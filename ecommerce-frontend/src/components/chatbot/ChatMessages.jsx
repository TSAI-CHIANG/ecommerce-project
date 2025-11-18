import {useEffect, useRef} from 'react'
import { ChatMessage } from './ChatMessage';
import "./ChatMessages.css"

function ChatMessages({chatMessages}) {
    const chatMessagesRef = useRef(null);

    useEffect( () => {
        const messagesContainerElem = chatMessagesRef.current;
        if (messagesContainerElem) {
            messagesContainerElem.scrollTop = messagesContainerElem.scrollHeight;
        }
    }
    ,[chatMessages]);

    return (
        <div className="chat-messages-container" ref={chatMessagesRef}>
        {chatMessages.map( (chatMessage) => {
            return (
                <ChatMessage 
                    chatMessages={chatMessage} 
                    key={chatMessage.id}
                />
            )
        }
        )}
    </div>
    )
}

export default ChatMessages;
