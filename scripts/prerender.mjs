// Renders the app to HTML at build time and writes it into dist/index.html, so the page's content is in the
// initial HTML (search engines, link previews, no-JS visitors). The browser then hydrates it.
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const distDir = path.resolve('dist');
const ssrDir = path.resolve('dist-ssr');
const indexPath = path.join(distDir, 'index.html');

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const appHtml = render();
const template = fs.readFileSync(indexPath, 'utf-8');

if (!template.includes('<!--app-html-->')) {
  console.error('prerender: <!--app-html--> placeholder not found in dist/index.html');
  process.exit(1);
}

fs.writeFileSync(indexPath, template.replace('<!--app-html-->', () => appHtml));
fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerender: wrote ${appHtml.length} characters of HTML into dist/index.html`);
