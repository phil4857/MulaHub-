// register.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await fetch("https://repo-1red-jipate-bonus.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Registration failed");
      }

      alert("Registration successful. Please log in.");
      localStorage.setItem("username", username);
      window.location.href = "dashboard.html";
    } catch (err) {
      alert(err.message);
    }
  });
});
