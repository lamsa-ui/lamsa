import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const pagesDir = join(root, 'apps/docs/src/app/pages');
const files = readdirSync(pagesDir)
  .filter(
    (file) =>
      file.endsWith('-page.component.ts') && file !== 'icons-page.component.ts',
  )
  .sort();
const failures = [];
/** Every page in the side bar, so "When to use something else" rows can only link to real pages. */
const navPaths = new Set(
  [
    ...readFileSync(
      join(root, 'apps/docs/src/app/shared/nav.ts'),
      'utf8',
    ).matchAll(/path: '([^']+)'/g),
  ].map((m) => m[1]),
);

/** Props and emits of every Vue component, read from packages/vue/src: name → Set of 'prop' and '@event'. */
const vueDir = join(root, 'packages/vue/src/lib');
const vueComponents = new Map();
for (const file of readdirSync(vueDir).filter(
  (f) => f.endsWith('.ts') && !f.endsWith('.spec.ts'),
)) {
  const source = ts.createSourceFile(
    file,
    readFileSync(join(vueDir, file), 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
  const constants = new Map();
  ts.forEachChild(source, function collect(node) {
    if (ts.isVariableDeclaration(node) && node.initializer) {
      let init = node.initializer;
      while (ts.isAsExpression(init)) init = init.expression;
      if (ts.isObjectLiteralExpression(init))
        constants.set(node.name.getText(source), init);
    }
    ts.forEachChild(node, collect);
  });
  ts.forEachChild(source, function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      node.initializer &&
      ts.isCallExpression(node.initializer) &&
      node.initializer.expression.getText(source) === 'defineComponent'
    ) {
      const options = node.initializer.arguments[0];
      const names = new Set();
      for (const prop of options.properties ?? []) {
        const key = prop.name?.getText(source);
        if (
          (key === 'props' || key === 'emits') &&
          prop.initializer?.properties
        ) {
          // Follow spreads of objects declared in the same file (...sharedProps).
          const entries = (literal) =>
            literal.properties.flatMap((entry) =>
              ts.isSpreadAssignment(entry)
                ? entries(
                    constants.get(entry.expression.getText(source)) ?? {
                      properties: [],
                    },
                  )
                : [entry],
            );
          for (const entry of entries(prop.initializer)) {
            const name = entry.name.getText(source).replace(/['"]/g, '');
            names.add(key === 'emits' ? '@' + name : name);
            // A function prop named onX is also how Vue receives @x.
            if (/^on[A-Z]/.test(name))
              names.add('@' + name[2].toLowerCase() + name.slice(3));
          }
        }
      }
      vueComponents.set(node.name.getText(source), names);
    }
    ts.forEachChild(node, visit);
  });
}
const kebab = (name) => name.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
const intentionalDifferences = {
  'accordion-page.component.ts': {
    heading:
      'React accepts ReactNode; Angular accepts text or a projected heading template.',
    description:
      'React accepts ReactNode; Angular accepts text for this summary line.',
  },
  'data-table-page.component.ts': {
    rowKey:
      'Angular track functions allow unknown return types; React keys are restricted to React Key.',
  },
};
const usedDifferences = new Set();

function evaluate(node, context = {}) {
  const js = ts.transpileModule(`export default (${node.getText()});`, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const module = { exports: {} };
  new Function('module', 'exports', js).call(context, module, module.exports);
  return module.exports.default;
}

for (const file of files) {
  const source = ts.createSourceFile(
    file,
    readFileSync(join(pagesDir, file), 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
  let api;
  const context = {};
  const initializers = new Map();

  function visit(node) {
    if (ts.isPropertyDeclaration(node) && node.initializer) {
      initializers.set(node.name.getText(source), node.initializer);
      if (node.name.getText(source) === 'api') {
        api = node.initializer;
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  // Every page says which component to reach for instead, like it documents its API.
  const alternatives = initializers.get('alternatives');
  const rows = alternatives ? evaluate(alternatives) : [];
  if (!rows.length) {
    failures.push(
      `${file}: needs a "When to use something else" table (alternatives, at least one row).`,
    );
  }
  for (const row of rows) {
    if (!row.need || !row.use)
      failures.push(`${file}: every alternative needs "need" and "use".`);
    if (row.path && !navPaths.has(row.path))
      failures.push(
        `${file}: alternative "${row.use}" links to ${row.path}, which is not in the side bar.`,
      );
  }
  if (!api) {
    failures.push(`${file}: missing API table.`);
    continue;
  }
  const hydrated = new Set();
  function hydrate(name) {
    if (hydrated.has(name)) return;
    const initializer = initializers.get(name);
    if (!initializer) {
      failures.push(`${file}: API table references missing field "${name}".`);
      return;
    }
    hydrated.add(name);
    for (const [, dependency] of initializer
      .getText()
      .matchAll(/this\.(\w+)/g)) {
      hydrate(dependency);
    }
    context[name] = evaluate(initializer, context);
  }
  for (const [, dependency] of api.getText().matchAll(/this\.(\w+)/g)) {
    hydrate(dependency);
  }
  api = evaluate(api, context);
  if (!api.angular || !api.react) {
    failures.push(`${file}: API table must document both Angular and React.`);
    continue;
  }

  const byName = {};
  for (const framework of ['angular', 'react']) {
    byName[framework] = new Map();
    for (const row of api[framework]) {
      if (!row?.name || !row?.type) {
        failures.push(`${file}: ${framework} API rows need a name and type.`);
        continue;
      }
      if (byName[framework].has(row.name)) {
        failures.push(`${file}: duplicate ${framework} API row "${row.name}".`);
      }
      byName[framework].set(row.name, row);
    }
  }

  for (const [name, angular] of byName.angular) {
    const react = byName.react.get(name);
    if (!react || name.startsWith('...')) continue;
    for (const field of ['type', 'default']) {
      if ((angular[field] ?? '') !== (react[field] ?? '')) {
        const reason = intentionalDifferences[file]?.[name];
        if (reason && field === 'type') {
          usedDifferences.add(`${file}:${name}`);
          console.log(`ℹ ${file}: ${name} intentionally differs: ${reason}`);
        } else {
          failures.push(
            `${file}: shared prop "${name}" differs: Angular ${field}=${JSON.stringify(angular[field] ?? null)}, React ${field}=${JSON.stringify(react[field] ?? null)}.`,
          );
        }
      }
    }
  }

  // Vue: every documented prop and event must exist on the Vue component the page imports.
  const usageText = initializers.get('usage')?.getText(source) ?? '';
  const vueImports = [
    ...usageText.matchAll(/import \{([^}]+)\} from '@lamsa-ui\/vue'/g),
  ]
    .flatMap(([, names]) =>
      names
        .split(',')
        .map((n) => n.trim())
        // Type-only imports (type SelectOption) are not components.
        .filter((n) => !n.startsWith('type ')),
    )
    // Constants such as PHONE_COUNTRIES are not components.
    .filter((n) => !/^[A-Z0-9_]+$/.test(n));
  // Vue is at parity: every component page documents it.
  if (!vueImports.length || !api.vue) {
    failures.push(
      `${file}: needs a Vue usage line (import from @lamsa-ui/vue) and a Vue API table.`,
    );
  }
  if (api.vue) {
    const known = new Set();
    for (const name of vueImports) {
      const names = vueComponents.get(name);
      if (!names && !/^use[A-Z]/.test(name))
        failures.push(`${file}: @lamsa-ui/vue has no component "${name}".`);
      for (const n of names ?? []) known.add(n);
    }
    // A composable (useAlertDialog) documents functions and options, not props.
    const composablesOnly = vueImports.every((n) => /^use[A-Z]/.test(n));
    for (const row of composablesOnly ? [] : api.vue) {
      // Slots, and type rows (TimelineItem, TimelineItem.status) document shapes, not props.
      if (
        row.type === 'slot' ||
        /^(#|\.\.\.|[A-Z])/.test(row.name) ||
        row.name.includes('.') ||
        row.name === 'everything else' ||
        // Component tags and function calls describe usage, not props.
        /[<(]/.test(row.name) ||
        // Native attributes fall through to the element.
        /^(aria-|data-)/.test(row.name)
      )
        continue;
      for (const part of row.name.split(/\s*[/|,]\s*/)) {
        // v-model binds modelValue; v-model:open binds open.
        const name =
          part === 'v-model' ? 'modelValue' : part.replace(/^v-model:/, '');
        const event = name.startsWith('@') && '@' + name.slice(1);
        const found = event
          ? [...known].some(
              (k) => k.startsWith('@') && kebab(k) === kebab(event),
            )
          : known.has(name) || known.has('@' + name);
        if (!found) {
          failures.push(
            `${file}: Vue API row "${part}" is not a prop or event of ${vueImports.join(', ')}.`,
          );
        }
      }
    }
  }
}

for (const [file, differences] of Object.entries(intentionalDifferences)) {
  for (const name of Object.keys(differences)) {
    if (!usedDifferences.has(`${file}:${name}`)) {
      failures.push(
        `${file}: remove the obsolete intentional-difference note for "${name}".`,
      );
    }
  }
}

// The words the components say on their own are one file, the same in every package.
const labelsFile = (pkg) =>
  readFileSync(join(root, `packages/${pkg}/src/lib/ui-labels.ts`), 'utf8');
for (const pkg of ['react', 'vue']) {
  if (labelsFile(pkg) !== labelsFile('angular'))
    failures.push(
      `packages/${pkg}/src/lib/ui-labels.ts differs from the Angular copy: copy it over.`,
    );
}

if (failures.length) {
  console.error(failures.map((failure) => `✖ ${failure}`).join('\n'));
  process.exit(1);
}

console.log(
  `✔ ${files.length} component API tables checked for Angular/React parity, Vue rows checked against @lamsa-ui/vue, every page says when to use something else, the built-in labels match in every package.`,
);
