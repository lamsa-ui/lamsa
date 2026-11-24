// Builds the AI guide of the docs site from the docs pages themselves, so it cannot drift:
//   apps/docs/public/llms.txt       short index and the rules (the llms.txt convention)
//   apps/docs/public/llms-full.txt  everything: setup, rules and every component's usage and options
//   apps/docs/public/md/<framework>/<page>.md  one component page as Markdown, for the "Copy page" button
//   apps/docs/public/sitemap.xml    every page in the side bar, for search engines (submit it in Search Console; a robots.txt only works at a domain root)
//
// Run: pnpm llms        Check in CI: pnpm llms --check (fails when the files are stale)

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pagesDir = join(root, 'apps/docs/src/app/pages');
const outDir = join(root, 'apps/docs/public');
const SITE = readFileSync(
  join(root, 'apps/docs/src/app/shared/site.ts'),
  'utf8',
)
  .match(/SITE_URL = '([^']+)'/)[1]
  .replace(/\/$/, '');
const FRAMEWORKS = ['angular', 'react', 'vue', 'html'];
const LABEL = {
  angular: 'Angular',
  react: 'React',
  vue: 'Vue 3',
  html: 'Plain HTML and CSS',
};

/** Evaluate a literal initializer (objects, arrays, strings, template literals without holes). */
function evaluate(node, context) {
  const js = ts.transpileModule(`export default (${node.getText()});`, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const module = { exports: {} };
  // this.x in an initializer reads a field declared above it, as in the class.
  new Function('module', 'exports', js).call(context, module, module.exports);
  return module.exports.default;
}

function readPage(file) {
  const text = readFileSync(join(pagesDir, file), 'utf8');
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const page = {
    file,
    usage: null,
    api: null,
    alternatives: [],
    title: '',
    lead: '',
    examples: [],
  };
  const fields = {};
  const header = text.match(/<app-page\s+title="([^"]*)"\s+lead="([^"]*)"/s);
  if (header) {
    page.title = header[1];
    page.lead = header[2].replace(/\s+/g, ' ').replace(/&#64;/g, '@');
  }
  ts.forEachChild(source, function visit(node) {
    if (ts.isPropertyDeclaration(node) && node.initializer) {
      try {
        fields[node.name.getText()] = evaluate(node.initializer, fields);
      } catch {
        // an initializer that is not a literal is left out
      }
    }
    ts.forEachChild(node, visit);
  });
  page.usage = fields.usage ?? null;
  page.api = fields.api ?? null;
  page.alternatives = fields.alternatives ?? [];
  const attr = (tag, name) =>
    tag
      .match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1]
      ?.replace(/\s+/g, ' ');
  for (const [, tag] of text.matchAll(/<app-example\b([^>]*)>/g)) {
    const code = fields[attr(tag, '\\[code\\]')];
    page.examples.push({
      title: attr(tag, 'title') ?? '',
      description: attr(tag, 'description') ?? '',
      code: typeof code === 'object' ? code : {},
    });
  }
  return page;
}

const slugOf = (file) => file.replace(/-page\.component\.ts$/, '');

const components = readdirSync(pagesDir)
  .filter((f) => f.endsWith('-page.component.ts'))
  .sort()
  .map(readPage)
  .filter((p) => p.title);

const nav = readFileSync(join(root, 'apps/docs/src/app/shared/nav.ts'), 'utf8');
const pathOf = (slug) =>
  nav.match(new RegExp(`path: '(/(?:components|foundations)/${slug})'`))?.[1] ??
  `/components/${slug}`;

const tokens = readFileSync(join(root, 'packages/css/ui.css'), 'utf8');
const tokenNames = (prefix) => [
  ...new Set(
    [...tokens.matchAll(new RegExp(`--ui-${prefix}[\\w-]*(?=:)`, 'g'))].map(
      (m) => m[0],
    ),
  ),
];

const fence = (lang, code) => '```' + lang + '\n' + code.trim() + '\n```';

const rules = `## Rules for AI assistants

Follow these every time you write code with Lamsa.

1. Use the kit's components and classes. Do not hand-build a button, field, dialog or table that the kit already has.
2. Restyle only through the \`--ui-*\` tokens and Tailwind classes. Never override a \`.ui-*\` class, and never copy the kit's CSS into the project.
3. Never invent props, classes or components. If a name is not in this guide, it does not exist: check the component's page on the docs site.
4. Use colour tokens, never raw hex values: \`bg-primary\`, \`text-on-primary\`, \`var(--ui-primary)\`. Colours switch with the theme (\`data-theme="light"\` or \`"dark"\`, or the system setting).
5. Space comes from the scale: \`p-4\`, \`gap-3\`, \`ui-p-4\` (without Tailwind). Do not write pixel values.
6. Use logical properties (\`ms-2\`, \`pe-4\`, \`start\`, \`end\`), never \`left\` or \`right\`, so the layout flips in right-to-left languages.
7. Always set \`lang\` and \`dir\` on \`<html>\`. In an Arabic app give the components their Arabic words in one place, switched with the language: \`provideUiLabels(arabicLabels)\` (Angular providers; Vue in App.vue setup) or \`<UiLabelsProvider labels={arabicLabels}>\` (React). Do not set close, remove or pagination labels one by one. Write your own labels in Arabic too.
8. Every control needs a visible label. Colour never carries meaning alone: an error also has text.
9. Put your own CSS in \`@layer components\` or \`@layer base\`, or a plain rule beats the kit's classes.
10. Open native dialogs with \`showModal()\`, never \`show()\`.
11. Angular: components are standalone, import each one in \`imports\`. Use signals and the new control flow (\`@if\`, \`@for\`). React: React 19, function components. Vue: Vue 3.5 with \`<script setup>\`; values bind with v-model, callbacks are @events, content goes in #slots.
12. When unsure, say so and point to the docs page instead of guessing.`;

const setup = {
  angular: `${fence('sh', 'pnpm add @lamsa-ui/angular @lamsa-ui/css @angular/cdk@^22.2.0\npnpm add -D tailwindcss @tailwindcss/postcss')}

Needs Node 22, Angular 22.2 (core, common, forms, router), the same major of the Angular CDK, RxJS 7.8, Tailwind 4.1.

${fence('json', '// .postcssrc.json, next to angular.json\n{ "plugins": { "@tailwindcss/postcss": {} } }')}

${fence('css', "/* the global stylesheet (src/styles.css), first lines; never in a component's styles */\n@import 'tailwindcss';\n@import '@lamsa-ui/css/tailwind.css';\n@import '@angular/cdk/overlay-prebuilt.css';\n@import '@angular/cdk/a11y-prebuilt.css';")}

UiDialog, UiAlertDialog and UiToast are provided in root: inject them where needed.`,
  react: `${fence('sh', 'pnpm add @lamsa-ui/react @lamsa-ui/css\npnpm add -D tailwindcss @tailwindcss/vite')}

Needs Node 22, React 19, Tailwind 4.1.

${fence('ts', "// vite.config.ts\nimport tailwindcss from '@tailwindcss/vite';\nexport default defineConfig({ plugins: [react(), tailwindcss()] });")}

${fence('css', "/* src/index.css, imported once in main.tsx, above every other CSS import */\n@import 'tailwindcss';\n@import '@lamsa-ui/css/tailwind.css';")}

Wrap the app in \`ToastProvider\` if you use toasts (\`useToast()\` throws without it). For Arabic also wrap it in React Aria's \`I18nProvider locale="ar"\`.`,
  vue: `${fence('sh', 'pnpm add @lamsa-ui/vue @lamsa-ui/css vue')}

Vue 3.5: every component, with v-model for values, @events and #slots. Wrap the app in \`<ToastProvider>\` if you use toasts.

${fence('css', "/* src/main.css, imported once from main.ts */\n@import '@lamsa-ui/css/ui.css';")}

${fence(
  'vue',
  `<script setup lang="ts">
import { Button, TextField } from '@lamsa-ui/vue';
import { ref } from 'vue';

const email = ref('');
</script>

<template>
  <form>
    <TextField v-model="email" label="Email" type="email" required />
    <Button type="submit">Continue</Button>
  </form>
</template>`,
)}

See the [Vue integration guide](${SITE}/integrations/vue).`,
  html: `${fence('sh', 'pnpm add @lamsa-ui/css @lamsa-ui/icons\npnpm add -D tailwindcss @tailwindcss/cli')}

${fence('css', "/* src/app.css */\n@import 'tailwindcss';\n@import '@lamsa-ui/css/tailwind.css';\n@import '@lamsa-ui/icons/icons.css';")}

The component markup uses icon classes, \`<i class="ui-icon ui-icon-chevron-down" aria-hidden="true"></i>\`, drawn by \`icons.css\`. Every icon name is on ${SITE}/foundations/icons

${fence('sh', 'npx @tailwindcss/cli -i src/app.css -o dist/app.css --watch')}

Without Tailwind, load \`@lamsa-ui/css/ui.css\` alone and use the \`ui-\` classes (\`ui-p-4\`, \`ui-head-md\`). The package ships no JavaScript: behaviour is yours to write, each page lists the elements and attributes it needs. Keep the \`fonts\` folder next to the CSS.`,
};

function tokenSection() {
  return `## Tokens

All design values are \`--ui-*\` custom properties on \`:root\`. With Tailwind they are the theme: \`p-4\` is \`--ui-space-4\`, \`bg-primary\` is \`--ui-primary\`, \`rounded-xl\` is \`--ui-radius-xl\`.

- Colour: ${tokenNames(
    '(?:primary|on-primary|surface|on-surface|border|danger|focus|highlight)',
  )
    .slice(0, 16)
    .map((t) => `\`${t}\``)
    .join(', ')}. Full list on ${SITE}/foundations/colour
- Space: \`--ui-space-1\` to \`--ui-space-*\`, as classes \`ui-p-*\`, \`ui-m-*\`, \`ui-gap-*\` (sides \`x y t b s e\`, logical).
- Type: one class sets face, weight, size and line height: \`ui-head-3xl\` … \`ui-head-2xs\`, \`ui-body-lg|md|sm\` (weight suffix \`-m\` \`-s\` \`-b\`), \`ui-label\`.
- Layout: \`class="ui-page"\` gives a centred 12-column grid; children take \`ui-col-6\`, \`ui-col-md-4\` (\`sm md lg xl 2xl\`).
- Also: radius, shadow (\`shadow-ui\`), z-index (\`z-dialog\`), motion (\`duration-fast\`, \`ease-ui\`), focus (\`focus-visible:focus-ring\`).

Re-brand by overriding tokens after the import. The "on" colour must reach 7:1 against its ground and the focus colour 3:1 against the page, in both themes:

${fence('css', ':root {\n  --ui-primary: light-dark(#0f5132, #6ee7b7);\n  --ui-on-primary: light-dark(#ffffff, #0b1020);\n  --ui-focus: light-dark(#0f5132, #6ee7b7);\n}')}`;
}

/** The keyboard and screen reader notes of every component page (apps/docs/src/app/shared/a11y.ts). */
const A11Y = (() => {
  const js = ts.transpileModule(
    readFileSync(join(root, 'apps/docs/src/app/shared/a11y.ts'), 'utf8'),
    { compilerOptions: { module: ts.ModuleKind.CommonJS } },
  ).outputText;
  const module = { exports: {} };
  new Function('module', 'exports', js)(module, module.exports);
  return module.exports.A11Y;
})();

function a11yLines(slug, framework) {
  const a = A11Y[slug];
  if (!a) return [];
  const lines = ['Keyboard and screen readers:', ''];
  if (a.script && framework === 'html')
    lines.push(
      'In plain HTML these keys come from your own script, following the matching WAI-ARIA pattern.',
      '',
    );
  for (const [keys, action] of a.keys ?? [])
    lines.push(`- ${keys.join(' or ')}: ${action}`);
  for (const note of a.notes) lines.push(`- ${note}`);
  lines.push('');
  return lines;
}

function componentSection(page, framework) {
  const slug = slugOf(page.file);
  const lines = [
    `### ${page.title}`,
    '',
    page.lead,
    '',
    `Docs: ${SITE}${pathOf(slug)}`,
    '',
  ];
  const usage = page.usage?.[framework];
  if (usage)
    lines.push(
      fence(
        framework === 'html' ? 'html' : framework === 'react' ? 'tsx' : 'ts',
        usage,
      ),
      '',
    );
  if (page.alternatives.length) {
    lines.push(
      'When to use something else:',
      '',
      ...page.alternatives.map(
        (a) =>
          `- ${a.need}: ${a.path ? `[${a.use}](${SITE}${a.path})` : a.use}`,
      ),
      '',
    );
  }
  const api = page.api?.[framework];
  if (api?.length) {
    lines.push(
      '| Name | Type | Default | What it does |',
      '| --- | --- | --- | --- |',
    );
    for (const r of api) {
      const cell = (s) =>
        String(s ?? '')
          .replace(/\|/g, '\\|')
          .replace(/\s+/g, ' ');
      lines.push(
        `| \`${cell(r.name)}\` | \`${cell(r.type)}\` | ${r.default ? `\`${cell(r.default)}\`` : ''} | ${cell(r.description)} |`,
      );
    }
    lines.push('');
  }
  lines.push(...a11yLines(slug, framework));
  return lines.join('\n');
}

function buildFull() {
  const parts = [
    `# Lamsa: guide for AI assistants (full)

Lamsa is the Lamsa design system: plain CSS tokens and component styles (\`@lamsa-ui/css\`), with Angular (\`@lamsa-ui/angular\`) and React (\`@lamsa-ui/react\`) and Vue (\`@lamsa-ui/vue\`) components. Accessible (WCAG 2.2 AA, text at 7:1), light and dark, left-to-right and right-to-left (Arabic first-class). ${components.length} documented components in every framework.

Site and live demos: ${SITE}/
Pick one framework section below and ignore the others.`,
    rules,
    tokenSection(),
  ];
  for (const fw of FRAMEWORKS) {
    parts.push(`# ${LABEL[fw]}\n\n## Setup (${LABEL[fw]})\n\n${setup[fw]}`);
    parts.push(
      `## Components (${LABEL[fw]})\n\n` +
        components.map((c) => componentSection(c, fw)).join('\n'),
    );
  }
  return parts.join('\n\n') + '\n';
}

const EXAMPLE_LANG = {
  angular: 'html',
  react: 'tsx',
  vue: 'vue',
  html: 'html',
};

/** One component page in one framework, as the "Copy page" button hands it to an AI assistant. */
function pageMarkdown(page, framework) {
  const [head, ...rest] = componentSection(page, framework).split('\n');
  const examples = page.examples
    .filter((e) => e.code[framework])
    .map((e) =>
      [
        `### ${e.title}`,
        '',
        ...(e.description ? [e.description, ''] : []),
        fence(EXAMPLE_LANG[framework], e.code[framework]),
        '',
      ].join('\n'),
    );
  return (
    [
      head.replace(/^### /, '# '),
      '',
      `Framework: ${LABEL[framework]}. Rules for AI assistants: ${SITE}/llms.txt`,
      ...rest,
      ...(examples.length ? ['## Examples', '', ...examples] : []),
    ]
      .join('\n')
      .trim() + '\n'
  );
}

function buildIndex() {
  return `# Lamsa

> The Lamsa design system: plain CSS tokens and component styles, with Angular, React and Vue 3 components. Accessible (WCAG 2.2 AA), light and dark, right-to-left ready. Give this file to your AI assistant before it writes UI code with the kit.

Packages: \`@lamsa-ui/css\` (any stack), \`@lamsa-ui/angular\` (Angular 22, standalone, signals), \`@lamsa-ui/react\` (React 19, React Aria), and \`@lamsa-ui/vue\` (Vue 3.5, Reka UI). Tailwind CSS 4.1 runs under the kit: its classes read the kit's tokens.

${rules}

## Docs

- [Full guide for AI assistants](${SITE}/llms-full.txt): setup per framework, tokens, and framework component availability. Fetch this before writing code.
- [Getting started](${SITE}/getting-started): the seven setup steps
- [Colour](${SITE}/foundations/colour), [Typography](${SITE}/foundations/typography), [Space](${SITE}/foundations/space), [Layout](${SITE}/foundations/layout), [Right to left](${SITE}/foundations/direction)
- [Accessibility](${SITE}/accessibility)

## Components

${components.map((c) => `- [${c.title}](${SITE}${pathOf(slugOf(c.file))}): ${c.lead.split(/(?<=\.)\s/)[0]}`).join('\n')}
`;
}

function buildSitemap() {
  const nav = readFileSync(
    join(root, 'apps/docs/src/app/shared/nav.ts'),
    'utf8',
  );
  const paths = [
    '/',
    ...[...nav.matchAll(/path: '([^']+)'/g)].map((m) => m[1]),
  ];
  const urls = paths
    .map((p) => `  <url><loc>${SITE}${p}</loc></url>`)
    .join(String.fromCharCode(10));
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

const files = {
  'llms.txt': buildIndex(),
  'llms-full.txt': buildFull(),
  'sitemap.xml': buildSitemap(),
};
for (const page of components) {
  const name = pathOf(slugOf(page.file)).split('/').pop();
  for (const fw of FRAMEWORKS)
    files[`md/${fw}/${name}.md`] = pageMarkdown(page, fw);
}

const check = process.argv.includes('--check');
let stale = false;
for (const [name, content] of Object.entries(files)) {
  const path = join(outDir, name);
  if (check) {
    if (!existsSync(path) || readFileSync(path, 'utf8') !== content) {
      console.error(`${name} is out of date: run pnpm llms`);
      stale = true;
    }
  } else {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
    if (!name.startsWith('md/'))
      console.log(`wrote apps/docs/public/${name} (${content.length} bytes)`);
  }
}
if (stale) process.exit(1);
