
<script>
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

  // Password visibility toggle
  if (togglePassword && passwordInput) {
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
    const passwordInputEl = document.getElementById('password');

    const username = usernameInput?.value.trim();
    const password = passwordInputEl?.value;

    if (!username || !password) {
      errorMsg.textContent = 'Please enter both username and password.';
      errorMsg.style.color = '#dc3545';
      return;
    }

    // Disable button & show loading
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });

      let data = {};
      const ct = response.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        try {
          data = await response.json();
        } catch (err) {
          data = {};
        }
      } else {
        const text = await response.text();
        try { data = JSON.parse(text); } catch { data = { message: text }; }
      }

      if (response.ok) {
        // Save token if present
        const token = data.access_token || data.token || data.jwt || null;
        if (token) {
          localStorage.setItem('access_token', token);
        }
        // Save username for convenience
        localStorage.setItem('username', data.username || username);

        if (successMsg) {
          successMsg.textContent = 'Login successful! Redirecting...';
          successMsg.style.color = '#28a745';
        }

        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 900); // short delay for UX
      } else {
        // Handle specific backend errors
        errorMsg.style.color = '#dc3545';
        if (response.status === 403) {
          errorMsg.textContent = data.detail || 'Your account is pending approval.';
        } else if (response.status === 404) {
          errorMsg.textContent = data.detail || 'User not found. Please register.';
        } else if (response.status === 400) {
          errorMsg.textContent = data.detail || data.message || 'Invalid username or password.';
        } else {
          errorMsg.textContent = data.detail || data.message || `Login failed (error ${response.status}).`;
        }
      }
    } catch (error) {
      console.error('Login request failed:', error);
      errorMsg.style.color = '#dc3545';
      errorMsg.textContent = 'Cannot connect to server. Please check your internet connection.';
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText || 'Login';
    }
  });
});
</script>
