import { useState } from 'react';

const LoginIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const EnvelopeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

export default function LoginForm({ onSwitchToRegister, onForgotPassword }: { onSwitchToRegister: () => void, onForgotPassword: () => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempt:', { email, password });
    };

    return (
        <div className="w-full max-w-md mx-auto p-6">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">Welcome Back</h2>
                <p className="text-gray-400">Please sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <EnvelopeIcon />
                    </div>
                    <input
                        type="email"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white placeholder-gray-500 transition-all"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <LockIcon />
                    </div>
                    <input
                        type="password"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white placeholder-gray-500 transition-all"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                    >
                        Forgot Password?
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transform transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                    Sign In
                </button>
            </form>

            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#1a1a1a] text-gray-400">Or continue with</span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-xl bg-gray-800/30 hover:bg-gray-800 text-white transition-all hover:border-gray-600 cursor-pointer">
                        {/* Simple G icon */}
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.347.533 12S5.867 24 12.48 24c3.44 0 6.04-1.133 7.973-3.267 1.947-2.133 2.48-5.32 2.48-7.813 0-.693-.053-1.4-.16-2H12.48z" />
                        </svg>
                        Google
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-xl bg-gray-800/30 hover:bg-gray-800 text-white transition-all hover:border-gray-600 cursor-pointer">
                        <LoginIcon />
                        <span className="ml-2">Guest</span>
                    </button>
                </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <button onClick={onSwitchToRegister} className="font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                    Sign up
                </button>
            </p>
        </div>
    );
}
