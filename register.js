document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const errorMsg = document.getElementById('errorMsg');

  // Fill referral field from URL if present
  const params = new URLSearchParams(window.location.search);
  const refCode = params.get('ref');
  if (refCode) {
    document.getElementById('referral').value = refCode;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';

    const username = document.getElementById('username').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const referral = document.getElementById('referral').value.trim();

    // Basic validation
    if (!username || !phone || !password || !confirmPassword) {
      errorMsg.textContent = "All fields except referral are required.";
      return;
    }

    if (password !== confirmPassword) {
      errorMsg.textContent = "Passwords do not match.";
      return;
    }

    try {
      const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `username=${encodeURIComponent(username)}&phone=${encodeURIComponent(phone)}&password=${encodeURIComponent(password)}&ref=${encodeURIComponent(referral)}`
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Registration failed.");
      }

      alert(data.message || "Registration successful!");

      // Store username in localStorage and redirect
      localStorage.setItem("username", username);
      if (username.toLowerCase() === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "dashboard.html";
      }

    } catch (err) {
      console.error("Registration error:", err);
      errorMsg.textContent = err.message || "Registration failed. Try again later.";
    }
  });
});
