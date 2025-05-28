describe('Smoke Test: Log Water Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate to Log Water screen when Log Water button is tapped', async () => {
    await expect(element(by.id('LogWaterButton'))).toBeVisible();
    await element(by.id('LogWaterButton')).tap();
    await expect(element(by.id('LogWaterScreen'))).toBeVisible();
  });
});
