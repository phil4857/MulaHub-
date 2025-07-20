document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const referral = document.getElementById('referral').value.trim();

  // Basic frontend validation
  if (!username || !phone || !password || !confirmPassword) {
    alert("❌ Please fill out all required fields.");
    return;
  }

  if (password.length < 4) {
    alert("❌ Password must be at least 4 characters.");
    return;
  }

  if (password !== confirmPassword) {
    alert("❌ Passwords do not match.");
    return;
  }

  try {
    const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username,
        password,
        referral,
        phone
      })
    });

    const result = await res.json();

    if (res.ok) {
      alert("✅ Registration successful! You can now log in.");
      window.location.href = "login.html";
    } else {
      alert(result?.detail || "❌ Registration failed.");
    }
  } catch (error) {
    console.error("❌ Error:", error);
    alert("❌ Server error. Please try again later.");
  }
});
