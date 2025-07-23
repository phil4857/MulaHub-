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
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // Save login info to localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("is_admin", data.is_admin);
      localStorage.setItem("is_approved", data.is_approved);

      // Redirect logic
      if (data.is_admin) {
        window.location.href = "/admin_dashboard.html";  // change if needed
      } else if (data.is_approved) {
        window.location.href = "/dashboard.html";        // change if needed
      } else {
        errorMsg.textContent = "Account not yet approved by admin.";
      }

    } catch (err) {
      console.error("Login error:", err);
      errorMsg.textContent = err.message || "Login failed. Please try again.";
    }
  });
});
