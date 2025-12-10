import { expect, test } from '@playwright/test';

test.describe('Coding Interview Platform', () => {
  test('should create a session and redirect', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Create New Session');
    await expect(page).toHaveURL(/\/session\/.+/);
    await expect(page.locator('.status-badge')).toContainText('Connected');
  });

  test('should sync code between two clients', async ({ browser }) => {
    // Create session on Client A
    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();
    await pageA.goto('/');
    await pageA.click('text=Create New Session');
    
    // Get Session URL
    const sessionUrl = pageA.url();
    
    // Join on Client B
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();
    await pageB.goto(sessionUrl);
    
    // Verify connection
    await expect(pageA.locator('.status-badge')).toContainText('Connected');
    await expect(pageB.locator('.status-badge')).toContainText('Connected');

    // Type in Client A
    // Note: Monaco editor is tricky to type into with Playwright standard fill. 
    // We can use keyboard interactions or precise locators.
    // However, for this test let's try a simple keyboard press if we can focus it, 
    // or just check that they are on the same page.
    // Monaco textarea is usually hidden.
    
    // Let's at least verify they are in the same session and see the initial code.
    // Then emulate a "code-change" event if we can't type easily, OR just assert the sockets are connected.
    
    // Actually, let's try to click the editor and type.
    await pageA.click('.monaco-editor'); 
    await pageA.keyboard.type('// Hello form A');
    
    // Check Client B
    // Wait for sync
    await pageB.waitForTimeout(1000); 
    
    // It's hard to assert text content of Monaco easily without internal API
    // But we can check if the socket emitted or received data if we spy on it, 
    // or just check if the text appears in the DOM (Monaco renders lines as divs).
    
    const content = await pageB.content();
    expect(content).toContain('Hello form A');
    
    await contextA.close();
    await contextB.close();
  });
});
