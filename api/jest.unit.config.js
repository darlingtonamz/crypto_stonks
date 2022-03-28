const defaults = require('./jest.config');

module.exports = {
  ...defaults,
  testRegex: '\\.spec.ts$',
  globalSetup: null,
  globalTeardown: null,
};