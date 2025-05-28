const detox = require('detox');
const config = require('../package.json').detox;

beforeAll(async () => {
  await detox.init(config);
});

afterAll(async () => {
  await detox.cleanup();
});

afterEach(async () => {
  if (device.takeScreenshot) {
    const testName = expect.getState().currentTestName.replace(/\s+/g, '_');
    await device.takeScreenshot(`FAIL_${testName}`);
  }
});
