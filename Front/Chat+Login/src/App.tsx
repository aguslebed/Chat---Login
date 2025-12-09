import { useState, useEffect } from 'react';
import AuthPage from './components/auth/AuthPage';
import ChatPage from './components/chat/ChatPage';
import { getMe, logout } from './request';
import './App.css';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const data = await getMe();
      if (data && data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Failed to check session");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData: any) => {
    setUser(userData.user);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-[#1a1a1a] text-white">Loading...</div>;
  }

  return (
    <>
      {!user ? (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <ChatPage currentUser={user} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
