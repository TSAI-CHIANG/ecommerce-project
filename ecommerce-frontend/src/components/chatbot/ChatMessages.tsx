import {useEffect, useRef} from 'react'
import { ChatMessage } from './ChatMessage';
import { useChatStore } from "../../store/useChatStore";
import "./ChatMessages.css"

function ChatMessages() {
    const chatMessagesRef = useRef<HTMLDivElement>(null); 
    const chatMessages = useChatStore((s) => s.chatMessages);

    // 自動捲到最新訊息: 陣列 chatMessages 每當改變就執行 useEffect
    useEffect( () => {
        const messagesContainerElem: HTMLDivElement | null = chatMessagesRef.current;
        if (messagesContainerElem) {
            messagesContainerElem.scrollTop = messagesContainerElem.scrollHeight;
        }
    }
    ,[chatMessages]);
    

    return (
        <div className="chat-messages-container" ref={chatMessagesRef}> {/* 把 ref 綁定到這個 <div>，之後就可以用 chatMessagesRef.current 直接操作這個 DOM 元素。 */}
        {chatMessages.map((message) => {
            return (
                <ChatMessage 
                    message={message} 
                    key={message.id}
                />
            )
        })}
        </div>
    )
}

export default ChatMessages;
