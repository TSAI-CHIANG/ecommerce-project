import { create } from "zustand";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import type { ChatMessageType } from "../components/chatbot/ChatbotWidget";

type ChatStore = {
    chatMessages: ChatMessageType[];
    isSending: boolean;
    isChatWindowOpen: boolean;
    isTextboxTop: boolean;
    toggleChatWindow: () => void;
    toggleTextboxPosition: () => void;
    sendMessage: (inputText: string) => Promise<void>;
};

export const useChatStore = create<ChatStore>((set, get) => ({
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
    toggleChatWindow: () =>
        set((state) => {
            return { isChatWindowOpen: !state.isChatWindowOpen };
        }),

    toggleTextboxPosition: () =>
        set((state) => ({ isTextboxTop: !state.isTextboxTop })),

    sendMessage: async (inputText: string) => {
        const { chatMessages, isSending } = get();

        if (!inputText.trim() || isSending) return;

        // 1. 先把使用者的訊息加進畫面，並設定狀態為發送中
        const userMessage: ChatMessageType = {
            id: uuidv4(),
            text: inputText,
            sender: "user",
        };

        const newChatMessages = [...chatMessages, userMessage];

        set({
            chatMessages: newChatMessages,
            isSending: true,
        });

        try {
            // 2. 打 API 詢問機器人
            const response = await axios.post("/api/chat", {
                message: userMessage.text,
                history: newChatMessages.map((msg) => ({
                    role: msg.sender === "user" ? "user" : "assistant",
                    content: msg.text,
                })),
            });

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
