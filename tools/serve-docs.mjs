// Static server for the built docs site, under the same base path as GitHub Pages
// (read from the build's <base href>). Unknown paths get index.html, as 404.html does on Pages.
// Playwright starts it (apps/docs/playwright.config.ts); PORT picks the port.
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';

const root = resolve('dist/apps/docs/browser');
const index = await readFile(join(root, 'index.html'), 'utf8');
const base = index.match(/<base href="([^"]*)"/)?.[1] ?? '/';
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.woff2': 'font/woff2',
};

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://local').pathname);
  const file = resolve(root, '.' + sep + path.slice(base.length));
  try {
    if (!file.startsWith(root + sep)) throw new Error('outside the build');
    const body = await readFile(file);
    res.writeHead(200, {
      'content-type': types[extname(file)] ?? 'application/octet-stream',
    });
    res.end(body);
  } catch {
    if (extname(path)) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(index);
  }
}).listen(Number(process.env.PORT ?? 4320), () =>
  console.log(`docs on http://localhost:${process.env.PORT ?? 4320}${base}`),
);
