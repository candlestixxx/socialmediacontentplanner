module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // .next/standalone duplicates workspace packages (e.g.
  // @contentcommand/database) which breaks Jest's Haste module map with
  // "several different files provide a module for that name". Ignore all
  // build output dirs.
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/apps/web/.next/',
    '<rootDir>/apps/mobile/.expo/',
    '<rootDir>/packages/api/dist/',
  ],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/dist/', '<rootDir>/apps/web/.next/'],
};
