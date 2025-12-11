



const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

export async function register(email: string, password: string, userName: string) {
    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, userName }),
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
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getGlobalMessages() {
    try {
        const response = await fetch(`${API_URL}/api/messages/global`, {
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
        const response = await fetch(`${API_URL}/api/messages/conversations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data; // Assumes { id, name, status }
    } catch (error) {
        console.error("Error fetching conversations", error);
        return [];
    }
}