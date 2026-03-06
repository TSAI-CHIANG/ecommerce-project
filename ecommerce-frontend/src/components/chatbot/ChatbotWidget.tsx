// src/components/chatbot/ChatbotWidget.tsx
import { useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import MoveFooter from "./MoveFooter";
import "./ChatbotWidget.css";

export type ChatMessageType = {
  id: string;
  text: string;
  sender: "user" | "robot";
};

export function ChatbotWidget() {
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([
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
  ]);
  const [isTextboxTop, setIsTextboxTop] = useState<boolean>(true);

  const [isChatWindowOpen, setIsChatWindowOpen] = useState<boolean>(true);

  // const botPersonality = "introvert";

  //如果視窗關閉，顯示一個開啟按鈕
  if (!isChatWindowOpen) {
    return (
      <button
        className="chatbot-open-button"
        onClick={() => setIsChatWindowOpen(true)}
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
          onClick={() => setIsChatWindowOpen(false)}
        >
          ✕
        </button>
      </div>
      <div className="chatbot-widget-content">
        {isTextboxTop ? (
          <>
            <ChatInput
              chatMessages={chatMessages}
              setChatMessages={setChatMessages}
              // botPersonality={botPersonality}
            />
            <ChatMessages chatMessages={chatMessages} />
          </>
        ) : (
          <>
            <ChatMessages chatMessages={chatMessages} />
            <ChatInput
              chatMessages={chatMessages}
              setChatMessages={setChatMessages}
            />
          </>
        )}

        <MoveFooter
          isTextboxTop={isTextboxTop}
          setIsTextboxTop={setIsTextboxTop}
        />
      </div>
    </div>
  );
}
