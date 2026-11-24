import assert from 'node:assert/strict';
import { cp, copyFile, mkdir, readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const source = resolve('packages/css');
const output = resolve('dist/packages/css');

async function copyPackage() {
  await mkdir(output, { recursive: true });
  for (const file of ['package.json', 'README.md', 'ui.css', 'tailwind.css']) {
    await copyFile(join(source, file), join(output, file));
  }
  await cp(join(source, 'fonts'), join(output, 'fonts'), {
    recursive: true,
    force: true,
  });
}

async function validatePackage() {
  const manifest = JSON.parse(
    await readFile(join(output, 'package.json'), 'utf8'),
  );
  assert.equal(manifest.name, '@ghazal-ui/css');
  assert.equal(manifest.style, './ui.css');

  for (const file of manifest.files) {
    await stat(join(output, file));
  }

  for (const target of Object.values(manifest.exports)) {
    const path = target.replace(/^\.\//, '');
    if (path.includes('*')) {
      const directory = join(output, path.slice(0, path.indexOf('*')));
      assert.ok((await readdir(directory)).length > 0, `${path} is empty`);
    } else {
      await stat(join(output, path));
    }
  }

  async function checkTree(relative = '') {
    const sourcePath = join(source, relative);
    for (const entry of await readdir(sourcePath, { withFileTypes: true })) {
      const child = join(relative, entry.name);
      if (entry.isDirectory()) {
        await checkTree(child);
      } else {
        assert.deepEqual(
          await readFile(join(source, child)),
          await readFile(join(output, child)),
          `${child} differs from its packaged source`,
        );
      }
    }
  }

  await checkTree('fonts');
  console.log('✔ CSS package files, exports, and fonts are complete');
}

const command = process.argv[2];
if (command === 'build') {
  await copyPackage();
  await validatePackage();
} else if (command === 'validate') {
  await validatePackage();
} else {
  throw new Error('Usage: node tools/css-package.mjs <build|validate>');
}
