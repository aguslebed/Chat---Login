import { useState, useRef, useEffect } from 'react';

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

interface ChatAreaProps {
    activeChat: string | number;
}

const ChatArea = ({ activeChat }: ChatAreaProps) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        // Reset messages when active chat changes (Mock behavior)
        if (activeChat === 'global') {
            setMessages([
                { id: 1, user: 'Alice', text: 'Hey everyone!', time: '10:00 AM', isMe: false },
                { id: 2, user: 'Me', text: 'Hi Alice! How are you?', time: '10:02 AM', isMe: true },
            ]);
        } else {
            setMessages([]); // Empty for private chats for now
        }
    }, [activeChat]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setMessages([...messages, {
            id: Date.now(),
            user: 'Me',
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        }]);
        setMessage('');
    };

    return (
        <div className="flex-1 flex flex-col bg-[#1a1a1a] h-full relative">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative z-10">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex flex-col max-w-[80%] md:max-w-[70%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                            {!msg.isMe && (
                                <span className="text-xs text-gray-400 ml-1 mb-1">{msg.user}</span>
                            )}
                            <div className={`px-4 py-2 rounded-2xl ${msg.isMe
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none'
                                : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                                }`}>
                                <p>{msg.text}</p>
                            </div>
                            <span className="text-xs text-gray-500 mt-1 px-1">{msg.time}</span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-900/50 border-t border-gray-800 relative z-10 backdrop-blur-sm">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-500 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors cursor-pointer"
                    >
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatArea;
