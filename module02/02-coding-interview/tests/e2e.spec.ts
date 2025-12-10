import { expect, test } from '@playwright/test';

test.describe('Coding Interview Platform', () => {
  test.setTimeout(60000); // Increase overall timeout

  const waitForServer = async (page: any) => {
    let retries = 20;
    while (retries > 0) {
      try {
        const response = await page.request.get('http://localhost:3000/health');
        if (response.ok()) return;
      } catch (e) {
        // ignore
      }
      await page.waitForTimeout(1000);
      retries--;
    }
    throw new Error('Server not ready');
  };

  test('should create a session and redirect', async ({ page }) => {
    await waitForServer(page);
    await page.goto('/');
    await page.click('text=Create New Session');
    await expect(page).toHaveURL(/\/session\/.+/, { timeout: 10000 });
    await expect(page.locator('.status-badge')).toContainText('Connected');
  });

  test('should sync code between two clients', async ({ browser }) => {
    // Create session on Client A
    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();
    await waitForServer(pageA);
    await pageA.goto('/');
    await pageA.click('text=Create New Session');
    await expect(pageA).toHaveURL(/\/session\/.+/, { timeout: 10000 });
    
    // Get Session URL
    const sessionUrl = pageA.url();
    console.log('Session URL:', sessionUrl);
    
    // Join on Client B
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();
    
    await pageB.goto(sessionUrl);
    await pageB.waitForLoadState('domcontentloaded');
    
    // Verify connection
    await expect(pageA.locator('.status-badge')).toContainText('Connected', { timeout: 15000 });
    await expect(pageB.locator('.status-badge')).toContainText('Connected', { timeout: 15000 });

    // Type in Client A
    // Use a more reliable way to focus Monaco: click the container, then use keyboard
    await pageA.click('.monaco-editor'); 
    await pageA.waitForTimeout(500); // Short wait for focus
    await pageA.keyboard.press('Control+A');
    await pageA.keyboard.press('Backspace');
    await pageA.keyboard.type('Hello from A', { delay: 100 });
    
    // Check Client B
    // Wait for sync
    await pageB.waitForTimeout(1000); 
    
    // Check if the text appears in the editor
    // Monaco splits text into multiple spans, so we check the text content of the lines container
    await expect(pageB.locator('.monaco-editor .view-lines')).toContainText('Hello from A');
    
    await contextA.close();
    await contextB.close();
  });
});
