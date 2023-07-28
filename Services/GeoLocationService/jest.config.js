/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  setupFiles: ['./.jest/setEnvVars.js'],
  preset: 'ts-jest',
  testEnvironment: 'node',
};
