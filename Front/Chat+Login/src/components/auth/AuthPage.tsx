import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

type AuthView = 'login' | 'register';

export default function AuthPage({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) {
    const [view, setView] = useState<AuthView>('login');

    const handleLoginSuccess = (data: any) => {
        // You might want to store user info here or pass it up
        onLoginSuccess(data);
    };

    return (
        <div className="min-h-screen w-full flex bg-[#1a1a1a]">
            {/* Left side - Visual/Branding (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gray-900 justify-center items-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 z-10" />
                <div className="relative z-20 flex flex-col justify-center items-center text-center p-12">
                    <h1 className="text-5xl font-bold text-white mb-6">Welcome to Chat+</h1>
                </div>

                {/* Animated background blobs */}
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#1a1a1a]">
                <div className="w-full max-w-md animate-fade-in-up">
                    {view === 'login' && (
                        <LoginForm
                            onSwitchToRegister={() => setView('register')}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    )}
                    {view === 'register' && (
                        <RegisterForm onSwitchToLogin={() => setView('login')} />
                    )}
                </div>
            </div>
        </div>
    );
}
