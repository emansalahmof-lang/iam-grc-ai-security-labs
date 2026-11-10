#!/usr/bin/env node
/**
 * Post-build: add a Content-Security-Policy <meta> tag to every HTML page.
 *
 * GitHub Pages cannot set HTTP response headers, so the policy is delivered
 * as a meta tag. Inline scripts that Docusaurus emits (e.g. the colour-mode
 * bootstrap) are allowed by their SHA-256 hash, computed per page, so the
 * policy never needs 'unsafe-inline' for scripts.
 *
 * Limitations of meta-delivered CSP (documented in SECURITY.md):
 * frame-ancestors, report-uri and sandbox are ignored in <meta>.
 */
import {createHash} from 'node:crypto';
import {readdir, readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';

const BUILD_DIR = new URL('../build/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(p);
    else if (entry.name.endsWith('.html')) yield p;
  }
}

const INLINE_SCRIPT = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;

function policyFor(hashes) {
  const scriptSrc = ["'self'", ...[...hashes].map((h) => `'sha256-${h}'`)].join(' ');
  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "worker-src 'self' blob:",
    // Docusaurus, Mermaid and React components set inline style attributes.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

let pages = 0;
for await (const file of htmlFiles(BUILD_DIR)) {
  let html = await readFile(file, 'utf8');
  if (html.includes('http-equiv="Content-Security-Policy"')) continue;
  const hashes = new Set();
  for (const m of html.matchAll(INLINE_SCRIPT)) {
    const attrs = m[1];
    // Non-executable data blocks (e.g. JSON-LD) are not subject to script-src.
    if (/type=["']?application\/(ld\+)?json/i.test(attrs)) continue;
    hashes.add(createHash('sha256').update(m[2], 'utf8').digest('base64'));
  }
  const meta = `<meta http-equiv="Content-Security-Policy" content="${policyFor(hashes)}">`;
  // Must come before any script so it applies to them.
  html = html.replace(/<head([^>]*)>/i, `<head$1>${meta}`);
  await writeFile(file, html);
  pages++;
}
console.log(`[csp] Content-Security-Policy meta added to ${pages} HTML files`);
