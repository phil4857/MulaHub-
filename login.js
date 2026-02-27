document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorMsg = document.getElementById('loginError');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorMsg.textContent = '';

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
      errorMsg.textContent = "Please enter both username and password.";
      return;
    }

    // Fetch users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users") || "{}");
    const user = storedUsers[username];

    if (!user) {
      errorMsg.textContent = "❌ User not found. Please register first.";
      return;
    }

    if (user.password !== password) {
      errorMsg.textContent = "❌ Incorrect password.";
      return;
    }

    // Handle OTP verification if user not verified
    if (!user.verified) {
      // Generate fake OTP for demonstration
      const fakeOTP = Math.floor(1000 + Math.random() * 9000).toString();
      localStorage.setItem("loginOTP", fakeOTP);
      localStorage.setItem("currentLogin", username);

      alert(`Your OTP (mock) is: ${fakeOTP}`); // OTP visible on page for testing
      window.location.href = "otp.html"; // redirect to OTP page
      return;
    }

    // Successful login
    localStorage.setItem("username", username);
    localStorage.setItem("userToken", "fake-jwt-token"); // placeholder token
    window.location.href = "dashboard.html";
  });
});
