/**
 * contentplanner build fixer — pass 3 (final residual cleanup).
 *
 * Residuals after pass 1+2:
 *   - provider `generate(prompt, systemPrompt?)` body refs were renamed to
 *     _systemPrompt while the param kept its name (pass 2 regex was too broad).
 *     Restore; only `generateStructuredResponse`'s third param is truly unused.
 *   - auth.ts lost its `import Redis` (pass 2 removed a used import by mistake)
 *     and has an implicit-any error callback.
 *   - social.ts terminal `res.redirect` needs `return` (pass 1 missed it).
 *   - workspace.ts assigns onto a Record<> via dot access -> bracket form.
 *   - billing/stripe/webhook.ts reads session.metadata via dot access -> bracket.
 *
 * Idempotent.
 */
const fs = require('fs');
const path = require('path');
const log = [];
function edit(rel, fn) {
  const p = path.join(__dirname, rel);
  const before = fs.readFileSync(p, 'utf8');
  const after = fn(before);
  if (after !== before) {
    fs.writeFileSync(p, after);
    log.push('patched ' + rel);
  } else log.push('NO-OP   ' + rel);
}

// --- 1. AI providers: restore systemPrompt name in `generate`, keep the
//        underscore prefix only on the genuinely-unused structured param.
for (const rel of [
  'packages/ai/src/providers/claude.ts',
  'packages/ai/src/providers/gemini.ts',
  'packages/ai/src/providers/openai.ts',
]) {
  edit(rel, (src) => {
    let s = src;
    // Undo over-renames inside the generate() body/params.
    s = s.replace(/\b_systemPrompt\b/g, 'systemPrompt');
    // Now prefix ONLY the third param of generateStructuredResponse, which
    // is a stub that never reads it.
    s = s.replace(
      /(generateStructuredResponse\s*<[^>]*>\s*\([^)]*?,\s*)systemPrompt(\s*\??:)/,
      '$1_systemPrompt$2'
    );
    return s;
  });
}

// --- 2. auth.ts: restore the used Redis import; type the error callback.
edit('packages/api/src/middleware/auth.ts', (src) => {
  let s = src;
  if (!/^import Redis from 'ioredis';/m.test(s)) {
    s = s.replace(
      "import rateLimit from 'express-rate-limit';",
      "import rateLimit from 'express-rate-limit';\nimport Redis from 'ioredis';"
    );
  }
  s = s.replace(
    "redisClient.on('error', (err) => console.log('Redis error:', err.message));",
    "redisClient.on('error', (err: Error) => console.log('Redis error:', err.message));"
  );
  return s;
});

// --- 3. social.ts: `res.redirect` is a terminal response too.
edit('packages/api/src/routes/social.ts', (src) =>
  src.replace(/^([ \t]+)(res\.redirect\()/gm, (m, indent, call) =>
    m.startsWith(indent + 'return ') ? m : `${indent}return ${call}`
  )
);

// --- 4. workspace.ts: Record<> assignments need bracket access.
edit('packages/api/src/routes/workspace.ts', (src) =>
  src
    .replace(/\bdata\.businessType\s*=/g, "data['businessType'] =")
    .replace(/\bdata\.name\s*=/g, "data['name'] =")
);

// --- 5. billing webhook: session.metadata is an index-signature bag.
edit('packages/billing/src/stripe/webhook.ts', (src) =>
  src
    .replace(/session\.metadata\?\.organizationId/g, "session.metadata?.['organizationId']")
    .replace(/session\.metadata\?\.plan/g, "session.metadata?.['plan']")
    .replace(/session\.metadata\.organizationId/g, "session.metadata['organizationId']")
    .replace(/session\.metadata\.plan/g, "session.metadata['plan']")
);

console.log(log.join('\n'));
console.log('\npass 3 complete');
