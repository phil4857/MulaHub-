document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const referral = document.getElementById('referral').value.trim();

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/register", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `username=${username}&password=${password}&referral=${referral}&phone=${phone}`
  });

  const result = await res.json();
  if (res.ok) {
    alert("Registration successful!");
    window.location.href = "login.html";
  } else {
    alert(result.detail || "Registration failed.");
  }
});
