import UserProfileImage from "../../assets/user_profile.png";
import RobotProfileImage from "../../assets/robot_profile.png";
import type { ChatMessageType } from "./ChatbotWidget";
import "./ChatMessage.css";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  return (
    <div
      className={
        message.sender === "user"
          ? "chat-message-user"
          : "chat-message-robot"
      }
    >
      {message.sender === "robot" && (
        <img className="chat-message-profile" src={RobotProfileImage} />
      )}

      <div className="chat-message-text">{message.text}</div>

      {message.sender === "user" && (
        <img className="chat-message-profile" src={UserProfileImage} />
      )}

    </div>
  );
}
