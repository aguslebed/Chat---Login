

export async function login(email: string, password: string) {
    try {

        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        const token = data.token;
        localStorage.setItem('token', token);
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}