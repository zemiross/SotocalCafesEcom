// Runs Shopify Theme Check (the same engine as `shopify theme check`) without needing the Shopify CLI or store auth.
// Usage: node scripts/theme-check.mjs [--json]   → exit code 1 if any error-severity offense remains.
import { themeCheckRun } from '@shopify/theme-check-node';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync, mkdirSync } from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { offenses } = await themeCheckRun(root, path.join(root, '.theme-check.yml'), () => {});
const SEVERITY = ['error', 'warning', 'info'];
const rows = offenses.map((o) => ({
  severity: SEVERITY[o.severity] ?? String(o.severity),
  check: o.check,
  file: path.relative(root, o.uri.replace(/^file:\/\/\/?/, '').replace(/%3A/i, ':')),
  line: (o.start?.line ?? 0) + 1,
  message: o.message,
}));
rows.sort((a, b) => SEVERITY.indexOf(a.severity) - SEVERITY.indexOf(b.severity) || a.file.localeCompare(b.file));
const count = (s) => rows.filter((r) => r.severity === s).length;
mkdirSync(path.join(root, 'qa'), { recursive: true });
writeFileSync(path.join(root, 'qa', 'theme-check.json'), JSON.stringify(rows, null, 2));
if (process.argv.includes('--json')) console.log(JSON.stringify(rows, null, 2));
else {
  for (const r of rows) console.log(`${r.severity.padEnd(7)} ${r.check.padEnd(28)} ${r.file}:${r.line}  ${r.message}`);
  console.log(`\nTheme Check: ${count('error')} errors, ${count('warning')} warnings, ${count('info')} info`);
}
process.exitCode = count('error') > 0 ? 1 : 0;
