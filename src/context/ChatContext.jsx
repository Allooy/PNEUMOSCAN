import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'ai',
            text: "Hello! I'm your PNEUMOSCAN assistant. How can I help you with your analysis today?"
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    return (
        <ChatContext.Provider value={{
            messages,
            setMessages,
            isTyping,
            setIsTyping
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};
