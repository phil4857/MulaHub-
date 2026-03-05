const BACKEND_URL = "https://repo-1red-jipate-bonus-1.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("adminPassword");
  const loginBtn = document.getElementById("adminLoginBtn");
  const msg = document.getElementById("adminMsg");

  // Password visibility toggle (add this HTML if not present: <span id="togglePassword">👁️</span>)
  const togglePassword = document.getElementById("togglePassword");
  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      togglePassword.textContent = type === "password" ? "👁️" : "🙈";
    });
  }

  loginBtn.addEventListener("click", async () => {
    const password = passwordInput.value.trim();
    if (!password) {
      showMessage("red", "Please enter the admin password");
      return;
    }

    // Disable button & show loading
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";
    showMessage("blue", "Verifying...");

    try {
      const formData = new URLSearchParams();
      formData.append("password", password);

      const res = await fetch(`${BACKEND_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        showMessage("green", "Admin login successful! Redirecting...");
        localStorage.setItem("adminLoggedIn", "true");
        setTimeout(() => {
          window.location.href = "admin-dashboard.html";
        }, 1500); // Give time to read success message
      } else {
        showMessage("red", data.detail || "Invalid admin password");
      }
    } catch (err) {
      showMessage("red", "Cannot connect to server. Check your internet.");
      console.error("Admin login error:", err);
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
    }
  });

  function showMessage(color, text) {
    msg.style.color = color;
    msg.innerText = text;
  }
});
