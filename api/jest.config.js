module.exports = {
  verbose: process.env.ENVIRONMENT === 'local',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testRegex: 'spec.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '@modules/(.*)': '<rootDir>/src/modules/$1',
    '@config/(.*)': '<rootDir>/src/config/$1',
    '@utils/(.*)': '<rootDir>/utils/$1',
    '@data/(.*)': '<rootDir>/data/$1',
    '@const': '<rootDir>/src/constants',
  },
  testEnvironment: 'node',
  globalSetup: '<rootDir>/scripts/tests/setup.ts',
  globalTeardown: '<rootDir>/scripts/tests/teardown.ts',
  collectCoverage: true,
};
