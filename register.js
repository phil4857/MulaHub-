document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    const referral = document.getElementById('referral').value.trim();

    if (!username || !phone || !password || !confirm) {
      alert("Please fill in all required fields.");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    // Optional: validate phone number format
    const phoneRegex = /^07\d{8}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid phone number (e.g., 07XXXXXXXX).");
      return;
    }

    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          number: phone,
          password,
          confirm,
          referral: referral || null
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      alert(data.message || "Registered successfully!");
      localStorage.setItem("username", data.username);

      // Redirect after successful registration
      window.location.href = data.redirect || "/dashboard.html";

    } catch (err) {
      console.error("Registration error:", err);
      alert(err.message || "An error occurred. Please try again.");
    }
  });
});
