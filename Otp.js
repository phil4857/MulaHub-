document.addEventListener('DOMContentLoaded', () => {
  const otpInput = document.getElementById('otpInput');
  const submitBtn = document.getElementById('submitOtp');
  const otpMessage = document.getElementById('otpMessage');

  // Retrieve the username and OTP from localStorage
  const username = localStorage.getItem('currentLogin');
  const fakeOTP = localStorage.getItem('loginOTP');

  if (!username || !fakeOTP) {
    alert('No OTP request found. Please login first.');
    window.location.href = 'login.html';
    return;
  }

  // Display OTP to user (for testing/demo purposes)
  const otpDisplay = document.getElementById('otpDisplay');
  if (otpDisplay) otpDisplay.textContent = `Your OTP is: ${fakeOTP}`;

  submitBtn.addEventListener('click', () => {
    const enteredOtp = otpInput.value.trim();
    otpMessage.textContent = '';

    if (!enteredOtp) {
      otpMessage.textContent = 'Enter the OTP sent to you.';
      return;
    }

    if (enteredOtp !== fakeOTP) {
      otpMessage.textContent = '❌ Incorrect OTP. Try again.';
      return;
    }

    // OTP is correct → mark user as verified
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username]) {
      users[username].verified = true;
      localStorage.setItem('users', JSON.stringify(users));
    }

    // Clear temporary OTP storage
    localStorage.removeItem('loginOTP');
    localStorage.removeItem('currentLogin');

    // Successful verification → redirect to dashboard
    localStorage.setItem('username', username);
    localStorage.setItem('userToken', 'fake-jwt-token');
    alert('✅ OTP verified! You are now logged in.');
    window.location.href = 'dashboard.html';
  });
});
