module.exports = {
  preset: 'jest-preset-typescript',
  testEnvironment: 'node',
  clearMocks: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/index.ts',
    'src/constants/',
    'src/models/',
    'src/controllers/models/',
    'src/routes',
  ],
};
