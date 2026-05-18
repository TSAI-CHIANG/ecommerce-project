import { Page, expect } from '@playwright/test';

/**
 * 共用登入模組
 * 將重複的登入流程抽離，方便各個測試檔案呼叫。
 * 若未來登入頁面的按鈕文字或 ID 改變，只需修改此處即可。
 */
export async function loginToApp(page: Page, email = 'wuu@gmail.com', password = '123455') {
    // 1. 前往登入頁
    await page.goto('http://localhost:5173/login');

    // 2. 填寫帳密
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);

    // 3. 點擊登入按鈕
    await page.getByRole('button', { name: 'Sign In' }).click();

    // 4. 等待跳轉回首頁，確保登入成功
    await expect(page).toHaveURL('http://localhost:5173/');
}
