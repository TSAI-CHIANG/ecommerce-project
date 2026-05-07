import { create } from "zustand";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import type { ChatMessageType } from "../components/chatbot/ChatbotWidget";

type ChatStore = {
    // 定義了這個 Store 裡面會有哪些資料 (狀態) 和哪些操作方法 (行為)
    chatMessages: ChatMessageType[];
    isSending: boolean;
    isChatWindowOpen: boolean;
    isTextboxTop: boolean;
    toggleChatWindow: () => void;
    toggleTextboxPosition: () => void;
    sendMessage: (inputText: string) => Promise<void>;
};

export const useChatStore = create<ChatStore>((set, get) => ({
    // set：用來「修改」狀態
    // get：用來「讀取」當前狀態

    // 狀態 (State)
    chatMessages: [
        {
            id: "id1",
            text: "Hello",
            sender: "user",
        },
        {
            id: "id2",
            text: "Hello! How can I help you?",
            sender: "robot",
        },
    ],
    isSending: false,
    isChatWindowOpen: true,
    isTextboxTop: true,

    // 行為 (Actions)
    // set 可以接收一個回呼函式 (Callback)，參數 state 代表「現在所有的狀態」。
    toggleChatWindow: () =>
        set((state) => {
            return { isChatWindowOpen: !state.isChatWindowOpen };
        }),

    toggleTextboxPosition: () =>
        set((state) => {
            return { isTextboxTop: !state.isTextboxTop }
        }),

    sendMessage: async (inputText: string) => {
        const { chatMessages, isSending } = get();

        if (!inputText.trim() || isSending) return;

        // 1. 先把使用者的訊息加進畫面，並設定狀態為發送中
        const userMessage: ChatMessageType = {
            id: uuidv4(),
            text: inputText,
            sender: "user",
        };

        set((state) => ({
            chatMessages: [...state.chatMessages, userMessage],
            isSending: true,
        }));

        try {
            // 2. 打 API 詢問機器人
            const response = await axios.post("/api/chat", {
                message: userMessage.text,
                history: chatMessages.map((msg) => ({
                    role: msg.sender === "user" ? "user" : "assistant",
                    content: msg.text,
                })),
            });

            // 等待後端 (await) 結束後，把後端的回傳值 (response.data.reply) 拿出來
            const botMessage: ChatMessageType = {
                id: uuidv4(),
                text: response.data.reply || "抱歉，目前沒有取得回覆內容。",
                sender: "robot",
            };

            // 3. 把機器人的回覆加進列表
            set((state) => ({
                chatMessages: [...state.chatMessages, botMessage],
            }));
        } catch (error) {
            console.error("Chat API error:", error);
            const errorMessage: ChatMessageType = {
                id: uuidv4(),
                text: "抱歉，系統目前有點問題，請稍後再試。",
                sender: "robot",
            };
            set((state) => ({
                chatMessages: [...state.chatMessages, errorMessage],
            }));
        } finally {
            // 4. 無論成功或失敗，都把發送中狀態解除
            set({ isSending: false });
        }
    },

}));
