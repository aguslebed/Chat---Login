

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

interface User {
    id: string | number;
    name: string;
    status: string;
}

interface UserListProps {
    onUserClick?: (user: any) => void;
    users?: User[];
}

const UserList = ({ onUserClick, users = [] }: UserListProps) => {
    return (
        <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
            <div className="p-4 border-b border-gray-800 flex-shrink-0">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        Connected
                    </span>
                    <span className="text-xs bg-gray-800 text-gray-400 py-0.5 px-2 rounded-full">
                        {users.length}
                    </span>
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {users.map((user) => (
                    <div
                        key={user.id}
                        onClick={() => onUserClick && onUserClick(user)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer group"
                    >
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
                                <UserIcon />
                            </div>
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-200 group-hover:text-white truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-500 group-hover:text-gray-400 truncate">
                                {user.status}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;
