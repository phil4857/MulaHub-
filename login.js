document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorMsg = document.getElementById('errorMsg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
      errorMsg.textContent = "Please enter both username and password.";
      return;
    }

    try {
      const response = await fetch("https://your-backend-url.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      alert(data.message || "Login successful");
      localStorage.setItem("username", data.username);
      window.location.href = data.redirect;

    } catch (err) {
      console.error("Login error:", err);
      errorMsg.textContent = err.message || "Login failed. Please try again.";
    }
  });
});
