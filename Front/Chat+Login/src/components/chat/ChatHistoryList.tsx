

const HistoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

interface ChatHistoryListProps {
    onUserClick?: (user: any) => void;
    users?: any[]; // Reusing user structure
}

const ChatHistoryList = ({ onUserClick, users = [] }: ChatHistoryListProps) => {
    return (
        <div className="w-64 bg-gray-900 border-l border-gray-800 flex flex-col h-full">
            <div className="p-4 border-b border-gray-800 flex-shrink-0">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                        Past Chats
                    </span>
                    <span className="text-xs bg-gray-800 text-gray-400 py-0.5 px-2 rounded-full">
                        {users.length}
                    </span>
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {users.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                        <p>No chat history yet.</p>
                    </div>
                ) : (
                    users.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => onUserClick && onUserClick(user)}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer group"
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
                                    <HistoryIcon />
                                </div>
                                {/* Optional: Show online status if we merge data? For now standard gray */}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-200 group-hover:text-white truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-gray-500 group-hover:text-gray-400 truncate">
                                    Click to open
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatHistoryList;
