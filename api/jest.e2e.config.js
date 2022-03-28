const defaults = require('./jest.config');

module.exports = {
  ...defaults,
  testRegex: '.e2e-spec.ts$',
};