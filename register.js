document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const errorMsg = document.getElementById('errorMsg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const referral = document.getElementById('referral').value.trim();

    // Clear error message
    errorMsg.textContent = '';

    if (!username || !phone || !password || !confirmPassword) {
      errorMsg.textContent = 'All fields except referral are required.';
      return;
    }

    if (password !== confirmPassword) {
      errorMsg.textContent = 'Passwords do not match.';
      return;
    }

    try {
      const response = await fetch("https://repo-1red-jipate-bonus.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `username=${encodeURIComponent(username)}&phone=${encodeURIComponent(phone)}&password=${encodeURIComponent(password)}&ref=${encodeURIComponent(referral)}`
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed. Try again later.");
      }

      alert("Registration successful! You can now log in.");
      localStorage.setItem("username", username);
      window.location.href = "dashboard.html";

    } catch (err) {
      console.error("Registration error:", err);
      errorMsg.textContent = err.message;
    }
  });
});
