document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Login failed");

      alert(data.message);
      localStorage.setItem("username", username);

      // Redirect based on username
      if (username === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "dashboard.html";
      }

    } catch (err) {
      alert(err.message);
    }
  });
});
