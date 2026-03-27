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

  // Password toggle
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    errorMsg.textContent = '';
    if (successMsg) successMsg.textContent = '';

    const username = document.getElementById('username')?.value.trim().toLowerCase();
    const password = document.getElementById('password')?.value;

    if (!username || !password) {
      errorMsg.textContent = 'Please enter both username and password.';
      errorMsg.style.color = '#dc3545';
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';

    try {
      // ✅ FIXED: Send JSON (not form-data)
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Save token
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
        }

        // Save username
        localStorage.setItem('username', username);

        if (successMsg) {
          successMsg.textContent = 'Login successful! Redirecting...';
          successMsg.style.color = '#28a745';
        }

        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);

      } else {
        errorMsg.style.color = '#dc3545';

        if (response.status === 403) {
          errorMsg.textContent = data.detail || 'Account not approved.';
        } else if (response.status === 404) {
          errorMsg.textContent = data.detail || 'User not found.';
        } else {
          errorMsg.textContent = data.detail || 'Invalid credentials.';
        }
      }

    } catch (error) {
      console.error('Login error:', error);
      errorMsg.style.color = '#dc3545';
      errorMsg.textContent = 'Cannot connect to server.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText || 'Login';
    }
  });
});
