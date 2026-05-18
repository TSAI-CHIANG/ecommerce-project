import { test, expect } from '@playwright/test';

test.describe('會員登入模組', () => {

    // 每次測試前，都先進入登入頁面
    test.beforeEach(async ({ page }) => {
        // 假設您的登入頁面路由是 /login
        await page.goto('http://localhost:5173/login');
    });

    // 🔴 反向測試 (Sad Path)：帳號密碼錯誤
    test('輸入錯誤的帳號密碼，應顯示錯誤訊息且無法登入', async ({ page }) => {
        // 1. 填寫錯誤的帳密
        // 因為您有寫 <label htmlFor="email">Email</label>，所以我們可以直接用 getByLabel
        await page.getByLabel('Email').fill('wrong@example.com');
        await page.getByLabel('Password').fill('wrongpassword123');

        // 2. 點擊登入按鈕
        await page.getByRole('button', { name: 'Sign In' }).click();

        // 3. 斷言：畫面必須出現「Invalid email or password.」的錯誤提示
        const errorMessage = page.locator('.error-message');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText('Invalid email or password.');

        // 4. 斷言：網址應該還是停留在 /login，沒有被跳轉
        await expect(page).toHaveURL(/.*login/);
    });

    // 🟢 正向測試 (Happy Path)：登入成功
    test('輸入正確的帳號密碼，應成功登入並跳轉回首頁', async ({ page }) => {
        // 1. 填寫正確的帳密 (請替換成您資料庫裡真實存在的帳號)
        await page.getByLabel('Email').fill('admin@example.com');
        await page.getByLabel('Password').fill('password123');

        // 2. 點擊登入
        await page.getByRole('button', { name: 'Sign In' }).click();

        // 3. 斷言：網址應該成功跳轉回首頁 '/'
        await expect(page).toHaveURL('http://localhost:5173/');

        // 4. 斷言：首頁應該出現登入後的狀態 (依您的 Header 設計而定)
        // 例如：可能會有一個「Sign Out」的按鈕，或是原本的「Sign In」連結不見了
        const signOutBtn = page.getByRole('button', { name: 'Sign Out' });
        // 如果您的系統登出是用連結，可能是 page.getByRole('link', { name: 'Sign Out' });
        // await expect(signOutBtn).toBeVisible(); 
    });
});
