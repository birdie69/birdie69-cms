/**
 * Production server build step.
 *
 * Runs TypeScript compilation and copies JSON schema files that tsc leaves
 * behind (tsc only emits .js, not .json). Must run inside the Docker builder
 * stage before `strapi start` is invoked.
 *
 * Usage: node scripts/build-server.js
 */

'use strict';

const tsUtils = require('@strapi/typescript-utils');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');

function copyDir(src, dest, filterExt) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);
    if (item.isDirectory()) {
      copyDir(srcPath, destPath, filterExt);
    } else if (!filterExt || item.name.endsWith(filterExt)) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copySchemas() {
  let copied = 0;

  const srcApi = path.join(ROOT, 'src', 'api');
  const distApi = path.join(ROOT, 'dist', 'src', 'api');
  if (fs.existsSync(srcApi)) {
    for (const apiDir of fs.readdirSync(srcApi, { withFileTypes: true })) {
      if (!apiDir.isDirectory()) continue;
      const ctSrc = path.join(srcApi, apiDir.name, 'content-types');
      const ctDest = path.join(distApi, apiDir.name, 'content-types');
      if (!fs.existsSync(ctSrc)) continue;
      for (const ct of fs.readdirSync(ctSrc, { withFileTypes: true })) {
        if (!ct.isDirectory()) continue;
        const schemaPath = path.join(ctSrc, ct.name, 'schema.json');
        if (!fs.existsSync(schemaPath)) continue;
        const destDir = path.join(ctDest, ct.name);
        fs.mkdirSync(destDir, { recursive: true });
        fs.copyFileSync(schemaPath, path.join(destDir, 'schema.json'));
        copied++;
      }
    }
  }

  const srcExt = path.join(ROOT, 'src', 'extensions');
  const distExt = path.join(ROOT, 'dist', 'src', 'extensions');
  if (fs.existsSync(srcExt)) {
    copyDir(srcExt, distExt, '.json');
  }

  console.log(`[build-server] ✓ Copied ${copied} schema file(s) + extensions JSON to dist/`);
}

async function main() {
  console.log('[build-server] Compiling TypeScript…');
  await tsUtils.compile(ROOT, { configOptions: { ignoreDiagnostics: false } });
  console.log('[build-server] TypeScript compilation done.');
  copySchemas();
  console.log('[build-server] Done.');
}

main().catch((err) => {
  console.error('[build-server] Fatal error:', err);
  process.exit(1);
});
