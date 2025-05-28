describe('Smoke Test - Hydration Log', () => {
  beforeAll(async () => {
    await device.launchApp({ delete: true });
  });

  it('should launch and take hydration screen screenshot', async () => {
    // 💡 This won't navigate anywhere yet, but proves artifact capture works
    await device.takeScreenshot('Hydration_Smoke_Screenshot');
  });
});
