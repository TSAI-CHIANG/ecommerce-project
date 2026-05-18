import { test, expect } from '@playwright/test';
import { loginToApp } from './helpers';

test.describe('Add product to cart', () => {

    // 在每一個測試開始前，先執行「登入」
    test.beforeEach(async ({ page }) => {
        // 呼叫我們封裝好的共用登入函數
        await loginToApp(page);
    });

    test('User can add product to cart and checkout', async ({ page }) => {

        // 先看一下現在購物車圖示上的數字是多少 (如果沒有字就當作 0)
        const initialText = await page.locator('.cart-quantity').innerText();
        const initialQuantity = parseInt(initialText) || 0;

        // 在點擊前，先把第一個商品的名字讀出來並存進變數
        const firstProduct = page.locator('.product-container').first();
        // 假設商品名稱的 class 叫做 .product-name，請替換成您真實的 class
        const productName = await firstProduct.locator('.product-name').innerText();

        //在首頁尋找第一個商品並點擊「加入購物車」
        const addToCartBtn = page.getByTestId('add-to-cart-button').first();
        await addToCartBtn.click();

        // 斷言 - 驗證前端的 UI 回饋機制是否正常
        // 要求 Playwright 智慧等待 .added-to-cart 元素出現 visible class
        const addedMessage = page.locator('.added-to-cart').first();
        await expect(addedMessage).toHaveClass(/visible/);

        // 斷言：現在的購物車數字，必須是原本的數字 + 1
        const expectedQuantity = (initialQuantity + 1).toString();
        await expect(page.locator('.cart-quantity')).toHaveText(expectedQuantity);

        // 進入結帳頁
        // 點擊 Header 上的購物車圖示 (根據原始碼，這是一個連往 /checkout 的 link)
        await page.locator('.cart-link').click();

        // 確保網址真的有跳轉到結帳頁
        await expect(page).toHaveURL(/.*checkout/);

        // 終極斷言：結帳頁面的商品列表 (.cart-item-details) 中，
        // 必須包含我們剛剛記錄下來的 productName！
        const specificCartItem = page.locator('.cart-item-details').filter({ hasText: productName });
        await expect(specificCartItem).toBeVisible();
    });
});
