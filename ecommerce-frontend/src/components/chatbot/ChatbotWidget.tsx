// src/components/chatbot/ChatbotWidget.tsx
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import MoveFooter from "./MoveFooter";
import { useChatStore } from "../../store/useChatStore";
import "./ChatbotWidget.css";

export type ChatMessageType = {
  id: string;
  text: string;
  sender: "user" | "robot";
};

export function ChatbotWidget() {
  const isChatWindowOpen = useChatStore((s) => s.isChatWindowOpen);
  const toggleChatWindow = useChatStore((s) => s.toggleChatWindow);
  const isTextboxTop = useChatStore((s) => s.isTextboxTop);

  //如果視窗關閉，顯示一個開啟按鈕
  if (!isChatWindowOpen) {
    return (
      <button
        className="chatbot-open-button"
        onClick={toggleChatWindow}
      >
        💬
      </button>
    );
  }

  return (
    <div className="chatbot-widget-container">
      <div className="chatbot-widget-title">
        <span className="chatbot-widget-title-text">🤖 Chat Assistant</span>
        <button
          className="chatbot-close-button"
          onClick={toggleChatWindow}
        >
          ✕
        </button>
      </div>
      <div className="chatbot-widget-content">
        {isTextboxTop ? (
          <>
            <ChatInput />
            <ChatMessages />
          </>
        ) : (
          <>
            <ChatMessages />
            <ChatInput />
          </>
        )}

        <MoveFooter />
      </div>
    </div>
  );
}

