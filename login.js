const BACKEND_URL = "https://repo-1red-jipate-bonus-1.onrender.com";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const errorMsg = document.getElementById('loginError');
    const successMsg = document.getElementById('loginSuccess');
    const submitBtn = form?.querySelector('button[type="submit"]');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (!form || !errorMsg || !submitBtn) {
        console.error("Login form elements not found");
        return;
    }

    // Password visibility toggle (optional — add eye icon in HTML if needed)
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous messages
        errorMsg.textContent = '';
        if (successMsg) successMsg.textContent = '';

        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        const username = usernameInput?.value.trim();
        const password = passwordInput?.value;

        if (!username || !password) {
            errorMsg.textContent = 'Please enter both username and password.';
            errorMsg.style.color = '#dc3545';
            return;
        }

        // Disable button & show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';

        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch(`${BACKEND_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            let data;
            try {
                data = await response.json();
            } catch {
                data = { detail: 'Invalid response from server' };
            }

            if (response.ok) {
                // Save username (backend returns it or use input)
                localStorage.setItem('username', data.username || username);

                if (successMsg) {
                    successMsg.textContent = 'Login successful! Redirecting...';
                    successMsg.style.color = '#28a745';
                }

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500); // Delay to show success message
            } else {
                // Handle specific backend errors
                errorMsg.style.color = '#dc3545';
                if (response.status === 403) {
                    errorMsg.textContent = data.detail || 'Your account is pending approval. Please wait for admin confirmation.';
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
            errorMsg.style.color = '#dc3545';
            errorMsg.textContent = 'Cannot connect to server. Please check your internet connection.';
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    });
});
