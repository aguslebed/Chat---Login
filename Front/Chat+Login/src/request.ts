



const API_URL = import.meta.env.VITE_API_URL;

export async function login(email: string, password: string) {
    try {

        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });

        const data = await response.json();
        // Token is now in cookie, so we don't handle it here
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function register(email: string, password: string, userName: string, verificationCode: string) {
    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, userName, verificationCode }),
            credentials: 'include',
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function sendVerificationCode(email: string) {
    try {
        const response = await fetch(`${API_URL}/api/auth/send-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
            credentials: 'include',
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getMe() {
    try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) return null;

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function logout() {
    try {
        await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
    } catch (error) {
        console.error(error);
    }
}

export async function guestLogin() {
    try {
        const response = await fetch(`${API_URL}/api/auth/guest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await response.json();

        if (data.token) {
            document.cookie = `token=${data.token}; path=/; max-age=3600; samesite=lax`;
            localStorage.setItem('token', data.token);
        }

        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getGlobalMessages() {
    try {
        const token = localStorage.getItem('token');
        const headers: any = {
            'Content-Type': 'application/json',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}/api/messages/global`, {
            method: 'GET',
            headers,
            credentials: 'include',
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data.map((msg: any) => ({
            id: msg._id,
            user: msg.senderName,
            text: msg.content,
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            senderId: msg.sender,
            chatId: 'global'
        }));
    } catch (error) {
        console.error("Error fetching global messages", error);
        return [];
    }
}

export async function getPrivateMessages(userId: string) {
    try {
        const response = await fetch(`${API_URL}/api/messages/private/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data.map((msg: any) => ({
            id: msg._id,
            user: msg.senderName,
            text: msg.content,
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            senderId: msg.sender,
            chatId: userId
        }));
    } catch (error) {
        console.error("Error fetching private messages", error);
        return [];
    }
}

export async function getConversations() {
    try {
        const token = localStorage.getItem('token');
        const headers: any = {
            'Content-Type': 'application/json',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}/api/messages/conversations`, {
            method: 'GET',
            headers,
            credentials: 'include',
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data; // Assumes { id, name, status }
    } catch (error) {
        console.error("Error fetching conversations", error);
        return [];
        return [];
    }
}

export async function forgotPassword(email: string) {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Failed to send reset email');
    }

    return await response.json();
}

export async function resetPassword(token: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Failed to reset password');
    }

    return await response.json();
}