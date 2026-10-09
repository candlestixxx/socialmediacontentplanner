// Direct TS loader for ContentPlanner API — bypasses tsx/ts-node-dev caches entirely
process.env.TS_NODE_CACHE = 'false';
process.env.TS_NODE_TRANSPILE_ONLY = 'true';

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    target: 'es2020',
    esModuleInterop: true,
    skipLibCheck: true,
    moduleResolution: 'node',
  },
});

require('./src/server.ts');
