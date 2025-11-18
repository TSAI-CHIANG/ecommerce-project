import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Chatbot } from 'supersimpledev';
import "./ChatInput.css"

function ChatInput({chatMessages, setChatMessages}) {
    const [inputText, setInputText] = useState('');

    function saveInputText(event) {
        setInputText(event.target.value);
        // console.log(event.target.value);
    }

    function sendMessage() {
        const newChatMessages = [
            ...chatMessages,
            {
             id: uuidv4(),
             text: inputText,
             sender: 'user'
            }
        ]

        setChatMessages(newChatMessages)
        // console.log(chatMessages);

        const response = Chatbot.getResponse(inputText);
        setChatMessages([
            ...newChatMessages,
            {
              id: uuidv4(),
              text: response,
              sender: 'robot',
            }
        ]);
        
        setInputText('');
    }

    return(
        <div className="chat-input-container">
            <input 
                className="chat-input-box" 
                placeholder="Send a message to Chatbot"
                value={inputText}
                onChange={saveInputText}
            />
            <button 
                className="chat-send-btn" 
                onClick={sendMessage}
            >Send</button>
        </div>
    );

}

export default ChatInput;