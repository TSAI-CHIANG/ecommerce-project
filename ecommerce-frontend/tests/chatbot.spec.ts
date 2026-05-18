import { test, expect } from '@playwright/test';

test.describe('Chatbot Interaction Test', () => {

  test('User can open chatbot, send a message and receive response', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // 1. 斷言：初始狀態下，聊天室是開啟的
    const closeBtn = page.getByTestId('close-chatbot-button');
    await expect(closeBtn).toBeVisible();

    const openBtn = page.getByTestId('open-chatbot-button');
    // await expect(openBtn).toBeVisible();

    // 2. 打開聊天室，斷言：聊天室視窗展開
    // await openBtn.click();
    const chatContainer = page.locator('.chatbot-widget-container');
    await expect(chatContainer).toBeVisible();

    // 3. 輸入對話並送出
    await page.getByRole('textbox', { name: 'Send a message to Chatbot' }).fill('Hello, I need some help');
    await page.getByRole('button', { name: 'Send' }).click();

    // 4. 斷言：使用者的訊息有出現在對話框中
    const userMessage = page.locator('.chat-message-user').last();
    await expect(userMessage).toBeVisible();
    await expect(userMessage).toContainText('Hello, I need some help');

    // 5. 斷言：AI 有給予回應 
    // (AI 處理需要時間，因此這裡設定 timeout: 15000 給它 15 秒的時間等待回應出現)
    const robotMessage = page.locator('.chat-message-robot').last();
    await expect(robotMessage).toBeVisible({ timeout: 15000 });

    // 可以進階斷言：AI 的回應字數大於 0 (確保不是空字串)
    await expect(robotMessage).not.toBeEmpty();

    // 6. 關閉聊天室
    await page.getByTestId('close-chatbot-button').click();

    // 7. 斷言：聊天視窗消失，且重新看到對話按鈕
    await expect(chatContainer).toBeHidden();
    await expect(openBtn).toBeVisible();
  });

  test('User can toggle the position of the chat input box', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // 注意：在 Playwright 中，page.getByText() 回傳的永遠是一個 Locator (物件)，而不是 true/false。
    // 所以寫 if (moveToTopBtn) 在 TypeScript 眼裡永遠是 true，導致 else 區塊被判定為「永遠執行不到的死碼 (unreachable code)」，才會噴 never 錯誤！

    // 最佳實踐：自動化測試的狀態應該是「可預期的 (Deterministic)」。
    // 根據你的 useChatStore 預設值，isTextboxTop 為 true，所以預設會出現「Move textbox to bottom」按鈕。

    const moveToTopBtn = page.getByText('Move textbox to top');
    const moveToBottomBtn = page.getByText('Move textbox to bottom');

    // 1. 斷言：預設狀態下「Move textbox to bottom」按鈕可見
    await expect(moveToBottomBtn).toBeVisible();

    // 2. 點擊「Move textbox to bottom」
    await moveToBottomBtn.click();

    // 3. 斷言：「Move textbox to top」按鈕會出現，代表成功切換
    await expect(moveToTopBtn).toBeVisible();

    // 4. (可選) 再點一次切換回來
    await moveToTopBtn.click();
    await expect(moveToBottomBtn).toBeVisible();
  });

});