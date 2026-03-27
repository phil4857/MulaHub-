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
    errorMsg.textContent = '';
    if (successMsg) successMsg.textContent = '';

    const username = document.getElementById('username')?.value.trim().toLowerCase();
    const password = document.getElementById('password')?.value;

    if (!username || !password) {
      errorMsg.textContent = 'Please enter both username and password.';
      errorMsg.style.color = '#dc3545';
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';

    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      let data = {};
      try { data = await response.json(); } 
      catch { data = { message: await response.text() }; }

      if (response.ok) {
        // Save token under common names
        const token = data.access_token || data.token || data.jwt;
        if (token) localStorage.setItem('access_token', token);

        localStorage.setItem('username', data.username || username);

        if (successMsg) {
          successMsg.textContent = 'Login successful! Redirecting...';
          successMsg.style.color = '#28a745';
        }

        setTimeout(() => window.location.href = 'dashboard.html', 900);

      } else {
        let errMsg = data.detail || data.message || 'Invalid credentials';
        if (Array.isArray(data)) {
          errMsg = data.map(e => e.msg || JSON.stringify(e)).join(" • ");
        }

        errorMsg.textContent = errMsg;
        errorMsg.style.color = '#dc3545';
      }

    } catch (error) {
      console.error('Login error:', error);
      errorMsg.textContent = 'Cannot connect to server.';
      errorMsg.style.color = '#dc3545';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText || 'Login';
    }
  });
});
</script>
