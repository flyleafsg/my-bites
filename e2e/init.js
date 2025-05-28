const detox = require('detox');
const config = require('../package.json').detox;
const adapter = require('detox/runners/jest/adapter');

jest.setTimeout(120000);
jasmine.getEnv().addReporter(adapter);

beforeAll(async () => {
  await detox.init(config);
}, 300000);

beforeEach(async () => {
  await adapter.beforeEach();
});

afterEach(async () => {
  await adapter.afterEach();

  // Optional: Always take a screenshot, especially for debugging
  if (device.takeScreenshot) {
    const testName = expect.getState().currentTestName.replace(/\s+/g, '_');
    await device.takeScreenshot(`AFTER_${testName}`);
  }
});

afterAll(async () => {
  await detox.cleanup();
});
