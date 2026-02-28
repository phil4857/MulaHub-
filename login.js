document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('loginForm');
  const errorMsg = document.getElementById('loginError');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorMsg.textContent = '';

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
      errorMsg.textContent = "Please enter both username and password.";
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const user = users[username];

    if (!user) {
      errorMsg.textContent = "User not found. Please register first.";
      return;
    }

    if (user.password !== password) {
      errorMsg.textContent = "Incorrect password.";
      return;
    }

    // If user is NOT verified, send to OTP page
    if (!user.verified) {

      const fakeOTP = Math.floor(100000 + Math.random() * 900000).toString();

      localStorage.setItem("loginOTP", fakeOTP);
      localStorage.setItem("currentLogin", username);

      // Redirect to OTP page (OTP will be shown there)
      window.location.href = "otp.html";
      return;
    }

    // Successful login
    localStorage.setItem("username", username);
    window.location.href = "dashboard.html";
  });

});
