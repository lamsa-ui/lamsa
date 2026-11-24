import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const nx = JSON.parse(await readFile(join(root, 'nx.json'), 'utf8'));
assert.equal(
  nx.cli?.packageManager,
  'pnpm',
  'Nx must use pnpm to resolve workspace dependencies',
);
const workflow = await readFile(
  join(root, '.github/workflows/release.yml'),
  'utf8',
);
const projects = nx.release.projects;
const workflowChoices = workflow.match(/options:\s*\[all,([^\]]+)\]/)?.[1];
assert.ok(workflowChoices, 'release workflow must define package choices');
assert.deepEqual(
  workflowChoices
    .split(',')
    .map((project) => project.trim())
    .sort(),
  [...projects].sort(),
  'release workflow choices must match nx.json release projects',
);

const preVersionCommand = nx.release.version.preVersionCommand;
const buildProjects = preVersionCommand.match(/-p\s+(.+)$/)?.[1]?.split(/\s+/);
assert.ok(buildProjects, 'preVersionCommand must build release packages');
for (const project of projects) {
  assert.ok(
    buildProjects.includes(project),
    `preVersionCommand does not build ${project}`,
  );
  const packageRoot = join(root, 'packages', project);
  const manifest = JSON.parse(
    await readFile(join(packageRoot, 'package.json'), 'utf8'),
  );
  const projectConfig = JSON.parse(
    await readFile(join(packageRoot, 'project.json'), 'utf8'),
  );
  assert.equal(manifest.name, `@ghazal-ui/${project}`);
  assert.ok(projectConfig.targets?.build, `${project} has no build target`);
}

assert.match(workflow, /first_release:/);
assert.match(workflow, /--first-release/);
console.log(
  `✔ release workflow and build configuration cover ${projects.length} packages`,
);
