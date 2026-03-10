#!/usr/bin/env node

/**
 * Lint script to enforce max lines per file
 * - page.tsx files: max 250 lines (target: 150)
 * - section components: max 250 lines
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const MAX_LINES = 250;
const WARNING_LINES = 150;

const patterns = [
  'src/app/**/page.tsx',
  'src/components/sections/**/*.tsx',
];

let hasErrors = false;
let hasWarnings = false;
const results = [];

patterns.forEach(pattern => {
  const files = glob.sync(pattern, { cwd: process.cwd() });

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n').length;

    const status = lines > MAX_LINES ? 'ERROR' : lines > WARNING_LINES ? 'WARN' : 'OK';

    if (status === 'ERROR') hasErrors = true;
    if (status === 'WARN') hasWarnings = true;

    results.push({ file, lines, status });
  });
});

// Sort by lines descending
results.sort((a, b) => b.lines - a.lines);

// Print results
console.log('\n📏 Line Count Lint Results\n');
console.log('─'.repeat(70));
console.log(`${'File'.padEnd(50)} ${'Lines'.padStart(8)} ${'Status'.padStart(10)}`);
console.log('─'.repeat(70));

results.forEach(({ file, lines, status }) => {
  const icon = status === 'ERROR' ? '❌' : status === 'WARN' ? '⚠️ ' : '✅';
  const color = status === 'ERROR' ? '\x1b[31m' : status === 'WARN' ? '\x1b[33m' : '\x1b[32m';
  const reset = '\x1b[0m';

  console.log(`${color}${file.padEnd(50)} ${String(lines).padStart(8)} ${icon} ${status.padStart(6)}${reset}`);
});

console.log('─'.repeat(70));
console.log(`\nMax allowed: ${MAX_LINES} lines | Warning threshold: ${WARNING_LINES} lines`);

if (hasErrors) {
  console.log('\n❌ FAILED: Some files exceed the maximum line limit!\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('\n⚠️  PASSED with warnings: Consider refactoring files above 150 lines.\n');
  process.exit(0);
} else {
  console.log('\n✅ PASSED: All files are within limits.\n');
  process.exit(0);
}
