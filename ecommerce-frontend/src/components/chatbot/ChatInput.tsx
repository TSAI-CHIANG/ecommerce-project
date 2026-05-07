import { useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import "./ChatInput.css";


function ChatInput() {
  const [inputText, setInputText] = useState<string>("");

  // 訂閱 Global Store 的狀態與行為
  const isSending = useChatStore((s) => s.isSending);
  const sendMessage = useChatStore((s) => s.sendMessage);

  const handleSendMessage = () => {
    // 1. 取得去頭去尾的乾淨字串
    const trimmedText = inputText.trim();

    // 2. 防呆：如果是空字串或正在發送中，就提早結束 (Early Return)
    if (!trimmedText || isSending) return;

    // 3. 永遠優先更新 UI 狀態：清空輸入框，讓畫面立刻給予使用者回饋
    setInputText("");

    // 4. 觸發背後的商業邏輯/非同步更新 (Zustand)
    // 這裡直接使用剛存好的 trimmedText，絕對安全且不受 React 重新渲染影響
    sendMessage(trimmedText);
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
