import axios from "axios";
import { useState, type Dispatch, type SetStateAction } from "react";
import { v4 as uuidv4 } from "uuid";
// import { Chatbot } from "supersimpledev";
import type { ChatMessageType } from "./ChatbotWidget";
import "./ChatInput.css";


type ChatInputProps = {
  chatMessages: ChatMessageType[];
  setChatMessages: Dispatch<SetStateAction<ChatMessageType[]>>;
}

function ChatInput({ chatMessages, setChatMessages }: ChatInputProps) {
  const [inputText, setInputText] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  //isSending === true → 目前正在等待 GPT 回覆
  //isSending === false → 可以再次輸入 / 再次送出
  //沒有 isSending 的話，前端會短時間內送出好幾個 request

  // function saveInputText(event) {
  //   setInputText(event.target.value);
  //   // console.log(event.target.value);
  // }

  async function sendMessage() {
    if (!inputText.trim() || isSending) return;
    //如果輸入是空的 OR 正在送出中，就不要執行 sendMessage 的後續動作

    // 先把使用者訊息加進畫面
    const userMessage: ChatMessageType = {
      id: uuidv4(),
      text: inputText,
      sender: "user",
    };

    const newChatMessages = [...chatMessages, userMessage];

    setChatMessages(newChatMessages);
    setInputText("");
    setIsSending(true);
    // console.log(chatMessages);

    //backend: chatService.js
    try {
      const response = await axios.post("/api/chat", {
        message: userMessage.text, //  送 { message, history } ← 和後端約定的格式
        history: newChatMessages.map((msg) => { 
          return {
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          }
          //history 的作用就是讓 GPT 記得之前說過什麼。
          //GPT API 只接受固定三種角色：system、user、assistant
          //role 和 content 是 OpenAI Chat Completions API 規定的必填屬性。
        }),
      });
      const botMessage: ChatMessageType = {
        id: uuidv4(),
        text: response.data.reply || "抱歉，目前沒有取得回覆內容。", //Fallback設計
        sender: "robot",
      };
      // 把機器人訊息 append 到列表
      setChatMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage: ChatMessageType = {
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
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
          }
        }}
      />
      <button
        className="chat-send-btn"
        onClick={() => sendMessage()}
        disabled={isSending}
      >
        {isSending ? "Sending..." : "Send"}
      </button>
    </div>
  );
}

export default ChatInput;
