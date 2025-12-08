import { useState } from 'react';
import AuthPage from './components/auth/AuthPage';
import ChatPage from './components/chat/ChatPage';
import './App.css';

function App() {
  const [user, setUser] = useState<any>(null);

  const handleLoginSuccess = (userData: any) => {
    setUser(userData.user);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

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
