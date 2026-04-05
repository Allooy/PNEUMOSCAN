import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Chat() {
    usePageTitle('AI Assistant');
    const { messages, setMessages, isTyping, setIsTyping } = useChat();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const processedPromptRef = useRef(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Unified sending logic that accepts text directly or from input state
    const processMessage = async (textToProcess) => {
        if (!textToProcess.trim()) return;

        const userMessage = { id: Date.now(), sender: 'user', text: textToProcess };

        // Add user message to UI immediately
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        // Prepare conversation format for backend
        const history = messages
            .filter(m => m.id !== 1)
            .map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

        // Append the new message
        history.push({ role: 'user', content: textToProcess });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ messages: history })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Failed to fetch response');
            }

            const data = await response.json();

            const aiResponse = {
                id: Date.now() + 1,
                sender: 'ai',
                text: data.reply
            };
            setMessages(prev => [...prev, aiResponse]);

        } catch (error) {
            console.error("Chat API Error:", error);
            const errorMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: "⚠️ I'm sorry, I'm having trouble connecting to my service right now. Please check your API key configuration."
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = () => {
        if (!input.trim() || isTyping) return;
        processMessage(input.trim());
        setInput('');
    };

    // Auto-Prompt Listener
    useEffect(() => {
        if (location.state?.autoPrompt && !processedPromptRef.current) {
            const prompt = location.state.autoPrompt;
            processedPromptRef.current = true; // Mark as processed to prevent StrictMode double-fire

            // Clear the state so it doesn't re-fire on refresh
            navigate(location.pathname, { replace: true, state: {} });

            // Small timeout to allow UI to settle before firing
            setTimeout(() => {
                processMessage(prompt);
            }, 500);
        }
    }, [location.state, navigate]);

    // Reset the ref if location changes without an autoPrompt (e.g., normal navigation)
    useEffect(() => {
        if (!location.state?.autoPrompt) {
            processedPromptRef.current = false;
        }
    }, [location.pathname, location.state]);

    return (
        <div className="flex-1 min-h-[500px] h-0 flex flex-col bg-white dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-card border border-slate-100 dark:border-slate-700 relative transition-colors duration-300">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-100 dark:bg-violet-900/30 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2 pointer-events-none transition-colors duration-300"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-100 dark:bg-cyan-900/30 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2 pointer-events-none transition-colors duration-300"></div>

            {/* Chat Header */}
            <div className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 p-5 flex items-center gap-4 sticky top-0 z-50 shadow-md rounded-t-3xl border-b border-violet-500/50">
                <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl shadow-inner border border-white/10">
                    <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg tracking-tight">Clinical Assistant</h3>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <p className="text-xs text-violet-100 font-medium opacity-90">Online & Ready</p>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scroll-smooth flex flex-col">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 items-end ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm mb-1 ${msg.sender === 'user'
                                    ? 'bg-gradient-to-br from-fuchsia-500 to-pink-500'
                                    : 'bg-gradient-to-br from-violet-500 to-indigo-500'
                                    }`}>
                                    {msg.sender === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
                                </div>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm transition-colors duration-300 ${msg.sender === 'user'
                                    ? 'bg-slate-900 dark:bg-violet-600 text-white rounded-tr-sm border border-transparent'
                                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-sm border border-slate-100 dark:border-slate-600 shadow-soft'
                                    }`}>
                                    {msg.sender === 'ai' ? (
                                        <ReactMarkdown
                                            components={{
                                                p: ({ node, ...props }) => <p className="text-sm leading-relaxed mb-2 last:mb-0" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1 text-sm marker:text-violet-500" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2 space-y-1 text-sm marker:text-violet-500" {...props} />,
                                                li: ({ node, ...props }) => <li className="text-slate-700 dark:text-slate-300" {...props} />,
                                                strong: ({ node, ...props }) => <strong className="font-bold text-slate-900 dark:text-white" {...props} />,
                                                a: ({ node, ...props }) => <a className="text-violet-600 dark:text-violet-400 hover:underline" {...props} />,
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
                                    ) : (
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div
                            key="typing-indicator"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex justify-start"
                        >
                            <div className="flex gap-3 max-w-[80%] items-end">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-sm mb-1">
                                    <Bot className="h-4 w-4 text-white" />
                                </div>
                                <div className="bg-white dark:bg-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-600 shadow-soft flex items-center gap-1.5 h-[46px] transition-colors duration-300">
                                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} className="mt-auto" />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-700 relative z-20 flex-shrink-0 transition-colors duration-300">
                <div className="flex gap-3 items-center bg-slate-50 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:border-violet-300 dark:focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-100 dark:focus-within:ring-violet-900/30 transition-all duration-300">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isTyping}
                        placeholder={isTyping ? "AI is typing..." : "Type your message..."}
                        className="flex-1 px-4 py-3 bg-transparent border-none focus:outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="p-3 bg-slate-900 dark:bg-violet-600 text-white rounded-xl hover:bg-violet-600 dark:hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 flex items-center justify-center aspect-square"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1 transition-colors duration-300">
                        <MessageSquare className="h-3 w-3" />
                        AI responses are generated by OpenAI models.
                    </p>
                </div>
            </div>
        </div>
    );
}
