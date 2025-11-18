import axios from "axios";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
// import { Chatbot } from "supersimpledev";
import "./ChatInput.css";

function ChatInput({ chatMessages, setChatMessages }) {
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  //isSending === true → 目前正在等待 GPT 回覆
  //isSending === false → 可以再次輸入 / 再次送出
  //沒有 isSending 的話，前端會短時間內送出好幾個 request

  function saveInputText(event) {
    setInputText(event.target.value);
    // console.log(event.target.value);
  }

  async function sendMessage() {
    if (!inputText.trim() || isSending) return;
    //如果輸入是空的 OR 正在送出中，就不要執行 sendMessage 的後續動作

    // 先把使用者訊息加進畫面
    const userMessage = {
      id: uuidv4(),
      text: inputText,
      sender: "user",
    };

    const newChatMessages = [...chatMessages, userMessage];

    // const newChatMessages = [
    //   ...chatMessages,
    //   {
    //     id: uuidv4(),
    //     text: inputText,
    //     sender: "user",
    //   },
    // ];

    setChatMessages(newChatMessages);
    setInputText("");
    setIsSending(true);
    // console.log(chatMessages);

    try {
      const response = await axios.post("/api/chat", {
        message: userMessage.text,
        history: newChatMessages.map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant", //GPT API 只接受固定三種角色：system、user、assistant
          content: msg.text,
        })),
      });
      const botMessage = {
        id: uuidv4(),
        text: response.data.reply || "抱歉，目前沒有取得回覆內容。",
        sender: "robot",
      };

      // 把機器人訊息 append 到列表
      setChatMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage = {
        id: uuidv4(),
        text: "抱歉，系統目前有點問題，請稍後再試。",
        sender: "robot",
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  }
  // const response = Chatbot.getResponse(inputText);
  // setChatMessages([
  //   ...newChatMessages,
  //   {
  //     id: uuidv4(),
  //     text: response,
  //     sender: "robot",
  //   },
  // ]);

  return (
    <div className="chat-input-container">
      <input
        className="chat-input-box"
        placeholder="Send a message to Chatbot"
        value={inputText}
        onChange={saveInputText}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
          }
        }}
      />
      <button
        className="chat-send-btn"
        onClick={sendMessage}
        disabled={isSending}
      >
        {isSending ? "Sending..." : "Send"}
      </button>
    </div>
  );
}

export default ChatInput;
