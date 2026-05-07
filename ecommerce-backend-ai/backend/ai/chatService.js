// backend/ai/chatService.js
import OpenAI from 'openai';
import { extractOrderIdsFromMessage, findOrdersByIds } from './orderService.js';
import { getPersonalityConfig } from './personalityConfig.js';

// 啟動時就驗證，避免 key 遺漏時錯誤難追蹤
if (!process.env.OPENAI_API_KEY) {
  throw new Error('缺少環境變數 OPENAI_API_KEY，請檢查 .env 設定');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const MAX_HISTORY_TURNS = 10; // 保留最近 10 輪（20 則訊息）

// 輔助函式：產生訂單 Context
function buildOrderContext(orders) {
  if (orders.length === 0) {
    return '目前未查到任何相關訂單資料，若使用者提到訂單，請先請他確認訂單編號或提供更多資訊。';
  }
  return `以下是查到的訂單資料（JSON 格式，請依照內容回答，不要杜撰）：\n${JSON.stringify(orders, null, 2)}`;
}

// 輔助函式：產生完整的 System Prompt
function buildSystemPrompt(personalityPrompt, orders) {
  const orderContext = buildOrderContext(orders);

  return `
你是"YU"電商網站的智能客服機器人，專門協助處理「訂單相關問題」以及一般購物問題。
你可以使用後端提供的訂單資料回答問題。
${personalityPrompt}

目前的環境資訊：
- 現在時間：${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}

訂單查詢結果：
${orderContext}

回答原則：
- 優先根據實際訂單資料作答，勿憑空捏造。
- 查無訂單時，要請對方確認訂單編號或提供更多資訊。
- 不要捏造不存在的產品或訂單資訊。
- 回覆語言使用繁體中文。
- 回覆時適當使用換行、換段落、空行與空白讓文字更易閱讀。
`.trim();
}

// 輔助函式：過濾並截取歷史對話
function prepareHistoryMessages(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(msg => msg.role && msg.content)
    .map(msg => ({ role: msg.role, content: msg.content }))
    .slice(-MAX_HISTORY_TURNS * 2);
}

/**
 * 主要流程：產生 Chat 回覆
 */
export async function generateChatReply({ message, history }) {
  const { personalityPrompt, temperature } = getPersonalityConfig();

  // 1. 解析訂單編號並查詢 DB
  const orderIds = extractOrderIdsFromMessage(message);
  const orders = orderIds.length > 0 ? await findOrdersByIds(orderIds) : [];

  // 2. 準備 System Prompt 與歷史訊息
  const systemPrompt = buildSystemPrompt(personalityPrompt, orders);
  const historyMessages = prepareHistoryMessages(history);

  // 3. 組裝 API 請求的 messages 陣列
  const messages = [
    { role: 'system', content: systemPrompt },
    ...historyMessages,
    { role: 'user', content: message },
  ];

  // 4. 呼叫 OpenAI API
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages,
      temperature,
      max_completion_tokens: 512,
    });
    return completion.choices?.[0]?.message?.content?.trim()
      ?? '目前暫時無法回答，請稍後再試。';

  } catch (error) {
    console.error('OpenAI API 呼叫失敗:', error.message);
    return '抱歉，我的大腦目前連線有點不穩，請稍後再試一次！';
  }
}
