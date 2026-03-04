const BACKEND_URL = "https://repo-1red-jipate-bonus-1.onrender.com";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const errorMsg = document.getElementById('loginError');
    const submitBtn = form?.querySelector('button[type="submit"]');

    if (!form || !errorMsg || !submitBtn) {
        console.error("Login form elements not found");
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous message
        errorMsg.textContent = '';

        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        const username = usernameInput?.value.trim();
        const password = passwordInput?.value;

        if (!username || !password) {
            errorMsg.textContent = 'Please enter both username and password.';
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';

        try {
            const response = await fetch(`${BACKEND_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ username, password })
            });

            let data;
            try {
                data = await response.json();
            } catch {
                data = { detail: 'Invalid response from server' };
            }

            if (response.ok) {
                // Save the username returned by backend (more secure)
                localStorage.setItem('username', data.username || username);

                errorMsg.style.color = '#28a745';
                errorMsg.textContent = 'Login successful! Redirecting...';

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1200);
            } else {
                // Handle specific backend errors
                if (response.status === 403) {
                    errorMsg.textContent = data.detail || 'Account pending admin approval. Please wait.';
                } else if (response.status === 404) {
                    errorMsg.textContent = 'User not found. Please register first.';
                } else if (response.status === 400) {
                    errorMsg.textContent = data.detail || 'Invalid username or password.';
                } else {
                    errorMsg.textContent = data.detail || `Login failed (error ${response.status}).`;
                }
            }
        } catch (error) {
            console.error('Login request failed:', error);
            errorMsg.textContent = 'Cannot connect to the server. Check your internet connection.';
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    });
});
