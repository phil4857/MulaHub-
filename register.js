document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  if (!form) {
    alert("Registration form not found.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const referral = document.getElementById("referral").value.trim();

    const errorMsg = document.getElementById("errorMsg");

    if (!username || !phone || !password || !confirmPassword) {
      errorMsg.textContent = "All fields are required.";
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
        body: `username=${encodeURIComponent(username)}&phone=${encodeURIComponent(phone)}&password=${encodeURIComponent(password)}&referral=${encodeURIComponent(referral)}`
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      alert("Registration successful!");
      localStorage.setItem("username", username);
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error("Registration error:", err);
      errorMsg.textContent = err.message || "Failed to register. Try again.";
    }
  });
});
