import { useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import "./ChatInput.css";


function ChatInput() {
  const [inputText, setInputText] = useState<string>("");
  const isSending = useChatStore((s) => s.isSending);
  const sendMessage = useChatStore((s) => s.sendMessage);

  const handleSendMessage = () => {
    if (!inputText.trim() || isSending) return;
    sendMessage(inputText);
    setInputText("");
  };

  return (
    <div className="chat-input-container">
      <input
        className="chat-input-box"
        placeholder="Send a message to Chatbot"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />
      <button
        className="chat-send-btn"
        onClick={handleSendMessage}
        disabled={isSending}
      >
        {isSending ? "Sending..." : "Send"}
      </button>
    </div>
  );
}

export default ChatInput;
