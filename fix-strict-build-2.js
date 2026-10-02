/**
 * contentplanner build fixer — pass 2 (hand fixes for residual errors).
 *
 * Why: pass 1 (fix-strict-build.js) only handled mechanical bulk classes.
 * These are the specific residual sites that need contextual edits:
 *   - TS4111 on req.query/req.body/this.store (index-signature access)
 *   - TS6133 false positive: getModelHandler used only via Proxy `as any`
 *   - TS6133 dead local in a fallthrough that always throws
 *   - TS6133 unused imports (RedisStore, AIProvider)
 *   - TS7006 implicit-any param
 *   - TS2614/TS2307 billing module export/import shape
 *   - TS2322 ioredis version conflict with bullmq's nested copy
 *
 * Idempotent. In-place edits under packages/.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'packages');
const log = [];
function edit(rel, fn) {
  const p = path.join(__dirname, rel);
  const before = fs.readFileSync(p, 'utf8');
  const after = fn(before);
  if (after !== before) {
    fs.writeFileSync(p, after);
    log.push('patched ' + rel);
  } else {
    log.push('NO-OP   ' + rel);
  }
}

// --- TS4111: req.query.X / req.body.X / this.store.X -> bracket form ------
function bracketAccess(src) {
  return src
    .replace(/\breq\.query\.([A-Za-z_][A-Za-z0-9_]*)/g, "req.query['$1']")
    .replace(/\breq\.body\.([A-Za-z_][A-Za-z0-9_]*)/g, "req.body['$1']")
    .replace(/\bthis\.store\.([A-Za-z_][A-Za-z0-9_]*)/g, "this.store['$1']");
}

// --- TS7006: forEach(m =>  ->  forEach((m: any) => -------------------------
function anyParams(src) {
  return src.replace(/\b(forEach|map|filter)\(([a-z])\s*=>/g, '$1(($2: any) =>');
}

// ===========================================================================
// Per-file contextual fixes
// ===========================================================================

// database/index.ts
edit('packages/database/index.ts', (src) => {
  let s = bracketAccess(src);
  // getModelHandler is reached via Proxy get(... ) as any — TS can't see the
  // call, so `private` makes it look unused. Drop `private` so it's a normal
  // method and the unused-private check stops firing.
  s = s.replace('private getModelHandler(', 'getModelHandler(');
  // Line ~166: `const mockModel = ...` sits in a branch that always throws.
  // The comment above it admits it's a stub. Remove the dead binding.
  s = s.replace(
    /^\s*const mockModel = globalMockClient\.getModelHandler\(prop\);\r?\n\s*\/\/ This logic is slightly complex[\s\S]*?\/\/ Better yet, let's just use the mock if the env says so\.\r?\n/gm,
    ''
  );
  return s;
});

// auth middleware — RedisStore imported but never used (rate-limit-redis
// store was planned then abandoned in the placeholder).
edit('packages/api/src/middleware/auth.ts', (src) => {
  return src
    .replace(/^import RedisStore from 'rate-limit-redis';\r?\n/m, '')
    .replace(/^import Redis from 'ioredis';\r?\n/m, '');
});

// campaigns.ts — AIProvider imported but never used
edit('packages/api/src/routes/campaigns.ts', (src) => {
  return src.replace(/^import \{[^}]*AIProvider[^}]*\} from '@contentcommand\/ai';\r?\n/m, (m) => {
    // Keep other named imports from the same statement.
    const names = m.match(/\{([^}]+)\}/)[1].split(',').map((x) => x.trim()).filter((x) => x && x !== 'AIProvider');
    return names.length ? `import { ${names.join(', ')} } from '@contentcommand/ai';\n` : '';
  });
});

// All route files — req.query / req.body bracket access + any params
for (const rel of [
  'packages/api/src/routes/analytics.ts',
  'packages/api/src/routes/brand-kits.ts',
  'packages/api/src/routes/campaigns.ts',
  'packages/api/src/routes/landing-pages.ts',
  'packages/api/src/routes/posts.ts',
  'packages/api/src/routes/social.ts',
  'packages/api/src/routes/workspace.ts',
]) {
  edit(rel, (src) => anyParams(bracketAccess(src)));
}

// social.ts — one TS7030 the pass-1 regex missed (nested callback body)
edit('packages/api/src/routes/social.ts', (src) => {
  // router.get('/accounts/:provider', ...) style where the handler has an
  // early return and a fallthrough res.json without return.
  return src.replace(/^(\s+)(res\.json\()/gm, (m, indent, call) => {
    // Don't double-prefix.
    return m.startsWith(indent + 'return ') ? m : `${indent}return ${call}`;
  });
});

// analytics.ts — forEach param already handled by anyParams above; also the
// metrics.map((m) => ...) form:
edit('packages/api/src/routes/analytics.ts', (src) =>
  src.replace(/\(\(m\)\s*=>/g, '((m: any) =>').replace(/\(m\s*=>/g, '((m: any) =>')
);

// ai parser — provider.generateStructuredResponse takes 2 args per the
// AIProvider interface; the call site passes (rawText, schema, systemPrompt).
// And `provider.generate` is not on the interface. Both are API-shape drift.
edit('packages/ai/src/parser/index.ts', (src) => {
  let s = src;
  // generateStructuredResponse<T>(text, schema) — fold systemPrompt into text.
  s = s.replace(
    'return this.provider.generateStructuredResponse<ParsedCommand>(rawText, CommandSchema, systemPrompt);',
    '// Interface takes (text, schema); fold the system prompt into the text\n      // so the provider still receives the instructions (API-shape drift fix).\n      return this.provider.generateStructuredResponse<ParsedCommand>(`${systemPrompt}\\n\\nUser Command: ${rawText}`, CommandSchema);'
  );
  // provider.generate -> cast to any to reach the stub method the concrete
  // providers implement but the shared interface omits.
  s = s.replace(
    'const rawResponse = await this.provider.generate(fallbackPrompt);',
    '// AIProvider interface omits `generate`, but every concrete provider\n    // implements it. Cast to reach it without widening the shared interface.\n    const rawResponse = await (this.provider as any).generate(fallbackPrompt);'
  );
  return s;
});

// Providers — systemPrompt still flagged after pass 1 (regex missed the
// 3rd param position). Prefix explicitly.
for (const rel of [
  'packages/ai/src/providers/claude.ts',
  'packages/ai/src/providers/gemini.ts',
  'packages/ai/src/providers/openai.ts',
]) {
  edit(rel, (src) =>
    src.replace(/([,(]\s*)systemPrompt(\s*[:,)])/g, '$1_systemPrompt$2')
  );
}

// billing module shape: api/routes/billing.ts imports from the non-existent
// relative path '../billing/src/stripe/webhook'. The real entrypoint is the
// workspace package @contentcommand/billing (which re-exports ./stripe/webhook).
edit('packages/api/src/routes/billing.ts', (src) => {
  let s = src.replace(
    /import \{([^}]+)\} from '\.\.\/billing\/src\/stripe\/webhook';/,
    "import {$1} from '@contentcommand/billing';"
  );
  // index.ts wants a named `billingRouter`; the file only has a default export.
  if (!/export .*billingRouter/.test(s) && /export default router;/.test(s)) {
    s = s.replace(
      'export default router;',
      'export default router;\nexport { router as billingRouter };'
    );
  }
  return s;
});

// index.ts imports { billingRouter } from './routes/billing' — that works once
// billing.ts re-exports `router as billingRouter` (handled above). No change
// needed here; leave index.ts's named import intact.

// jobs — bullmq bundles its own ioredis (5.10.1) while the root has 5.11.1,
// so the ConnectionOptions types are structurally incompatible across the two
// copies. Root-cured by pinning a single ioredis via package.json overrides
// (see the package.json edit below) — no casts needed in source.

// --- package.json: pin a single ioredis so bullmq and the app share types --
edit('package.json', (src) => {
  const pkg = JSON.parse(src);
  pkg.overrides = pkg.overrides || {};
  if (pkg.overrides.ioredis !== '5.11.1') {
    pkg.overrides.ioredis = '5.11.1';
    return JSON.stringify(pkg, null, 2) + '\n';
  }
  return src;
});

console.log(log.join('\n'));
console.log('\npass 2 complete');
