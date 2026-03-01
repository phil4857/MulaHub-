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
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    username: username,
                    password: password
                })
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                if (response.status === 404) {
                    errorMsg.textContent = 'User not found. Please register first.';
                } else if (response.status === 400) {
                    errorMsg.textContent = 'Incorrect password.';
                } else if (response.status === 403) {
                    // User is not verified
                    const data = await response.json();
                    const fakeOTP = Math.floor(100000 + Math.random() * 900000).toString();
                    localStorage.setItem('loginOTP', fakeOTP);
                    localStorage.setItem('currentLogin', username);
                    alert(OTP sent: ${fakeOTP});  // For demo purposes, replace with your OTP page redirection
                    window.location.href = 'otp.html';
                } else {
                    errorMsg.textContent = errorDetails.detail || 'An error occurred. Please try again.';
                }
                return;
            }

            // Successful login
            const data = await response.json();
            localStorage.setItem('username', data.username);
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Login error:', error);
            errorMsg.textContent = 'An unexpected error occurred. Please try again.';
        }
    });
});
