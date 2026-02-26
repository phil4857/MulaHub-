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

    // Simulated login without server
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

    // Optional: require OTP verification
    if (!user.verified) {
      errorMsg.textContent = "Your account is not yet verified. Please enter OTP sent to your phone.";
      localStorage.setItem("currentLogin", username); // store username for OTP verification
      window.location.href = "otp.html"; // redirect to OTP page
      return;
    }

    // Successful login
    localStorage.setItem("username", username);
    localStorage.setItem("userToken", "fake-jwt-token"); // placeholder token
    window.location.href = "dashboard.html";
  });    
});
