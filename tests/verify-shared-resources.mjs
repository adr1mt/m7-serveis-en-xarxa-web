import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'docs' && entry.name !== 'tests') {
      return htmlFiles(entryPath);
    }
    return entry.isFile() && entry.name.endsWith('.html') ? [entryPath] : [];
  }));
  return nested.flat();
}

function expectedResourcePath(htmlPath, resource) {
  const depth = path.relative(repositoryRoot, path.dirname(htmlPath)).split(path.sep).filter(Boolean).length;
  return `${'../'.repeat(depth)}_identitat/${resource}`;
}

const failures = [];
const files = await htmlFiles(repositoryRoot);

for (const file of files) {
  const content = await readFile(file, 'utf8');
  const relativeFile = path.relative(repositoryRoot, file);
  const expectedCss = expectedResourcePath(file, 'sinapsi.css');
  const expectedScript = expectedResourcePath(file, 'quiz.js');
  const hasInteractiveScript = relativeFile !== 'index.html';

  if ((content.match(/<main(?:\s|>)/g) ?? []).length !== 1) {
    failures.push(`${relativeFile}: expected exactly one <main>`);
  }
  if (!content.includes(`href="${expectedCss}"`)) {
    failures.push(`${relativeFile}: missing stylesheet ${expectedCss}`);
  }
  if (/<style[\s>]/.test(content)) {
    failures.push(`${relativeFile}: contains inline <style>`);
  }
  if (hasInteractiveScript && !content.includes(`src="${expectedScript}"`)) {
    failures.push(`${relativeFile}: missing interactive script ${expectedScript}`);
  }
  if (hasInteractiveScript && (content.match(/<script\b/g) ?? []).length !== 1) {
    failures.push(`${relativeFile}: expected exactly one interactive script`);
  }
  if (!hasInteractiveScript && (content.match(/<script\b/g) ?? []).length !== 0) {
    failures.push(`${relativeFile}: must not load an interactive script`);
  }
  if (/<script(?![^>]*\bsrc=)[^>]*>/.test(content)) {
    failures.push(`${relativeFile}: contains inline <script>`);
  }
}

if (files.length !== 83) {
  failures.push(`expected 83 HTML pages, found ${files.length}`);
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`PASS: ${files.length} HTML pages verified`);
}
