const BACKEND_URL = "https://repo-1red-jipate-bonus.onrender.com";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const errorMsg = document.getElementById('loginError');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMsg.textContent = '';

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            errorMsg.textContent = 'Please enter both username and password.';
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle specific backend status codes
                if (response.status === 404) {
                    errorMsg.textContent = 'User not found. Please register first.';
                } else if (response.status === 400) {
                    errorMsg.textContent = 'Incorrect password.';
                } else if (response.status === 403) {
                    errorMsg.textContent = data.detail || 'Account pending approval. Please wait for verification.';
                } else {
                    errorMsg.textContent = data.detail || 'An error occurred. Please try again.';
                }
                return;
            }

            // Successful login: save username and redirect
            localStorage.setItem('username', data.username);
            window.location.href = 'dashboard.html';

        } catch (error) {
            console.error('Login error:', error);
            errorMsg.textContent = 'An unexpected error occurred. Please try again.';
        }
    });
});
