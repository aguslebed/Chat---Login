import { useState } from 'react';
import UserList from './UserList';
import ChatArea from './ChatArea';

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

interface ChatPageProps {
    currentUser?: any; // Replace with proper type when available
    onLogout?: () => void;
}

export default function ChatPage({ currentUser, onLogout }: ChatPageProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // State for tabs. 'global' is always there.
    const [activeChat, setActiveChat] = useState<string>('global');
    const [openChats, setOpenChats] = useState<{ id: string | number, name: string }[]>([
        { id: 'global', name: 'Global Chat' }
    ]);

    const handleUserClick = (user: any) => {
        if (!openChats.find(c => c.id === user.id)) {
            setOpenChats([...openChats, { id: user.id, name: user.name }]);
        }
        setActiveChat(user.id);
        setIsSidebarOpen(false); // Close sidebar on mobile
    };

    const closeChat = (e: React.MouseEvent, chatId: string | number) => {
        e.stopPropagation();
        if (chatId === 'global') return; // Cannot close global chat

        const newChats = openChats.filter(c => c.id !== chatId);
        setOpenChats(newChats);

        if (activeChat === chatId) {
            setActiveChat(newChats[newChats.length - 1].id.toString());
        }
    };

    return (
        <div className="flex h-screen bg-[#1a1a1a] overflow-hidden">
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
                <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)}></div>
                <div className="absolute inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out h-full">
                    <UserList onUserClick={handleUserClick} />
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block h-full">
                <UserList onUserClick={handleUserClick} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col w-full h-full">
                {/* Navbar */}
                <header className="h-16 bg-gray-900/80 border-b border-gray-800 backdrop-blur-md flex items-center justify-between px-4 z-20 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden text-gray-400 hover:text-white"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <MenuIcon />
                        </button>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                            Chat+
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400 hidden sm:block">Welcome,</span>
                            <span className="text-sm font-semibold text-white">
                                {currentUser?.userName || 'Guest'}
                            </span>
                        </div>
                        <button
                            onClick={onLogout}
                            className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors border border-gray-700 cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Tabs Bar */}
                <div className="flex items-center bg-gray-900/50 border-b border-gray-800 px-2 pt-2 gap-1 overflow-x-auto flex-shrink-0">
                    {openChats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChat(chat.id.toString())}
                            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium cursor-pointer transition-colors ${activeChat === chat.id.toString() || (activeChat === 'global' && chat.id === 'global')
                                ? 'bg-[#1a1a1a] text-blue-400 border-t border-x border-gray-800 border-b-[#1a1a1a] -mb-[1px] z-10'
                                : 'bg-gray-800/20 text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 border border-transparent'
                                }`}
                        >
                            <span>{chat.name}</span>
                            {chat.id !== 'global' && (
                                <button
                                    onClick={(e) => closeChat(e, chat.id)}
                                    className="p-0.5 rounded-full hover:bg-gray-700 text-gray-500 hover:text-gray-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-hidden relative">
                    <ChatArea activeChat={activeChat} />
                </div>
            </div>
        </div>
    );
}
