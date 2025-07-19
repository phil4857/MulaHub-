document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const referral = document.getElementById('referral').value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch('https://repo-1red-jipate-bonus.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${encodeURIComponent(username)}&phone=${encodeURIComponent(phone)}&password=${encodeURIComponent(password)}&referral=${encodeURIComponent(referral)}`
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");

      alert("User registered successfully.");
      window.location.href = "login.html";
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });
});
