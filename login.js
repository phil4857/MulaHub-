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

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch("https://repo-1red-jipate-bonus.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // ✅ Save safe info to localStorage
      localStorage.setItem("username", data.username || username);
      if (data.token) {
        localStorage.setItem("userToken", data.token); // Use token instead of password
      }
      localStorage.setItem("is_admin", data.is_admin);
      localStorage.setItem("is_approved", data.is_approved);

      // ✅ Redirect based on role/approval
      if (data.is_admin) {
        window.location.href = "admin.html";   // fixed redirect
      } else if (data.is_approved) {
        window.location.href = "dashboard.html";
      } else {
        errorMsg.textContent = "Your account is not yet approved by the admin.";
      }

    } catch (err) {
      console.error("Login error:", err);
      errorMsg.textContent = err.message || "Login failed. Please try again.";
    }
  });
});
