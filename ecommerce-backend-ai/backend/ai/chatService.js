// backend/ai/chatService.js
import OpenAI from 'openai';
import {
  extractOrderIdsFromMessage,
  findOrdersByIds,
} from './orderService.js';
import { getPersonalityConfig } from './personalityConfig.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


/**
 * 輔助函式：產生訂單專用的 System Prompt
 */
function buildOrderContextPrompt(orders) {
  if (orders.length > 0) {
    return `以下是系統查到的訂單資料（JSON 格式，請依照內容回答，不要杜撰）：${JSON.stringify(orders)}`;
  }
  return '目前尚未查到任何訂單資料，若使用者提到訂單，請先請他確認訂單編號或提供更多資訊。';
}


/**
 * 主要流程：產生 Chat 回覆
 */
export async function generateChatReply({ message, history }) {
  const { personalityPrompt, temperature } = getPersonalityConfig();
  // 1. 解析訂單編號並查詢 DB
  const orderIds = extractOrderIdsFromMessage(message);
  const orders = orderIds.length > 0 ? await findOrdersByIds(orderIds) : [];
  // 2. 準備歷史訊息 (過濾並確保格式正確)
  const historyMessages = Array.isArray(history)
    ? history
      .filter(msg => msg.role && msg.content)
      .map(msg => ({ role: msg.role, content: msg.content }))
    : [];
  // 3. 準備基礎 System Prompt
  const systemPrompt = `
你是“YU”電商網站的智能客服機器人，專門協助處理「訂單相關問題」以及一般購物問題。
你可以使用後端提供的訂單資料回答問題。
${personalityPrompt}
回答原則：
- 優先根據實際訂單資料作答，勿憑空捏造。
- 查無訂單時，要請對方確認訂單編號或提供更多資訊。  
- 不要捏造不存在的產品或訂單資訊。
- 回覆使用繁體中文。
  `.trim();
  // 4. 一次性組裝給 OpenAI 的神級劇本 (乾淨俐落！)
  const messages = [
    { role: 'system', content: systemPrompt },
    ...historyMessages, // 展開歷史對話
    { role: 'system', content: buildOrderContextPrompt(orders) }, // 塞入訂單資料小抄
    { role: 'user', content: message } // 當下使用者的問題
  ];
  // 5. 呼叫 API 並加上完整的錯誤捕捉
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini', // 建議確認一下 OpenAI 有沒有這個模型名稱，通常是 gpt-4o-mini
      messages,
      temperature,
      max_completion_tokens: 512,
    });
    return completion.choices?.[0]?.message?.content?.trim() ?? '目前暫時無法回答，請稍後再試。';

  } catch (error) {
    console.error('OpenAI API 呼叫失敗:', error.message);
    // 即使 OpenAI 掛掉，前端也不會噴 500 錯誤，而是收到優雅的道歉
    return '抱歉，我的大腦目前連線有點不穩，請稍後再試一次！';
  }
}
