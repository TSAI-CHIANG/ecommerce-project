import {useEffect, useRef} from 'react'
import { ChatMessage } from './ChatMessage';
import "./ChatMessages.css"
import type { ChatMessageType } from "./ChatbotWidget";

type ChatMessagesProps = {
    chatMessages: ChatMessageType[];
}

function ChatMessages({chatMessages}: ChatMessagesProps) {
    const chatMessagesRef = useRef<HTMLDivElement>(null); 
    //建立一個「指向 DOM 元素的指針」，<HTMLDivElement> 是 TypeScript 型別，告訴 TS 這個 ref 指向的是 <div>
    // useRef 回傳一個物件: { current: null } 初始值

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
