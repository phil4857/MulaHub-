document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    const referral = document.getElementById('referral').value.trim();

    // Simple client-side validation
    if (!username || !phone || !password || !confirm) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/register", {
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

      window.location.href = data.redirect;

    } catch (err) {
      alert(err.message);
    }
  });
});
