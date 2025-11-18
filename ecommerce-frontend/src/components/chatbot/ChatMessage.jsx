import UserProfileImage from "../../assets/user_profile.png";
import RobotProfileImage from "../../assets/robot_profile.png";
import "./ChatMessage.css";

export function ChatMessage({ chatMessages }) {
  return (
    <div
      className={
        chatMessages.sender === "user"
          ? "chat-message-user"
          : "chat-message-robot"
      }
    >
      {chatMessages.sender === "robot" && (
        <img className="chat-message-profile" src={RobotProfileImage} />
      )}
      <div className="chat-message-text">{chatMessages.text}</div>
      {chatMessages.sender === "user" && (
        <img className="chat-message-profile" src={UserProfileImage} />
      )}
    </div>
  );
}
