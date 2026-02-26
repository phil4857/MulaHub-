document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const otpSection = document.getElementById('otpSection');
  const otpInput = document.getElementById('otpInput');
  const verifyBtn = document.getElementById('verifyOtpBtn');
  const errorMsg = document.getElementById('errorMsg');
  const successMsg = document.getElementById('successMsg');

  let fakeOTP = null;

  // Toggle OTP input visibility
  function showOTPSection() {
    otpSection.style.display = 'block';
  }

  // Step 1: Handle initial registration form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorMsg.textContent = '';
    successMsg.textContent = '';

    const username = document.getElementById('username').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    const referral = document.getElementById('referral') ? document.getElementById('referral').value.trim() : '';

    if (!username || !phone || !password || !confirm) {
      errorMsg.textContent = "Please fill in all required fields.";
      return;
    }

    if (password !== confirm) {
      errorMsg.textContent = "Passwords do not match.";
      return;
    }

    const phoneRegex = /^07\d{8}$/;
    if (!phoneRegex.test(phone)) {
      errorMsg.textContent = "Please enter a valid phone number (07XXXXXXXX).";
      return;
    }

    // ✅ Generate fake OTP
    fakeOTP = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`Fake OTP for ${phone}: ${fakeOTP}`); // For testing purposes
    successMsg.textContent = `✅ OTP sent to ${phone}. (Check console for OTP in test mode)`;
    showOTPSection();

    // Save registration info temporarily in localStorage
    localStorage.setItem('pendingRegistration', JSON.stringify({
      username, phone, password, referral
    }));
  });

  // Step 2: Handle OTP verification
  verifyBtn.addEventListener('click', () => {
    errorMsg.textContent = '';
    successMsg.textContent = '';

    const enteredOTP = otpInput.value.trim();
    if (!enteredOTP) {
      errorMsg.textContent = "Enter OTP to verify your account.";
      return;
    }

    if (enteredOTP !== fakeOTP) {
      errorMsg.textContent = "Incorrect OTP. Please try again.";
      return;
    }

    // ✅ OTP correct — finalize registration
    const pending = JSON.parse(localStorage.getItem('pendingRegistration'));
    if (!pending) {
      errorMsg.textContent = "No registration data found. Refresh and try again.";
      return;
    }

    // Save user data locally (simulate server storage)
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[pending.username]) {
      errorMsg.textContent = "Username already exists.";
      return;
    }

    users[pending.username] = {
      username: pending.username,
      phone: pending.phone,
      password: pending.password,
      referral: pending.referral,
      balance: 0,
      earnings: 0,
    };

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('username', pending.username);
    localStorage.removeItem('pendingRegistration');

    successMsg.textContent = "✅ Registration complete! Redirecting to dashboard...";
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);
  });
});
