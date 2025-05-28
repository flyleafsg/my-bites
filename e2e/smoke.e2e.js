describe('Smoke Test', () => {
  beforeAll(async () => {
    await device.launchApp({ delete: true });
  });

  it('should launch app and take a screenshot', async () => {
    await device.takeScreenshot('Smoke_Test_HomeScreen');
  });
});
