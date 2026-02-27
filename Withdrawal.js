document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  if (!username) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  // Monday check
  const today = new Date();
  if (today.getDay() !== 1) { // 1 = Monday
    alert("Withdrawals are only allowed on Mondays.");
    window.location.href = "dashboard.html";
    return;
  }

  const withdrawForm = document.getElementById("withdrawForm");
  const otpSection = document.getElementById("otpSection");
  const withdrawOtpInput = document.getElementById("withdrawOtp");
  const otpDisplay = document.getElementById("otpDisplay"); // Element to show OTP
  let fakeOTP = null;

  function getUser() {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    return users[username];
  }

  function saveUser(user) {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    users[username] = user;
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Step 1: Request withdrawal and generate fake OTP
  withdrawForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById("amount").value);
    const user = getUser();
    if (!user) return alert("User not found");

    const invested = user.investment_amount || 0;
    const balance = user.balance || 0;
    const minAllowed = Math.floor(invested * 0.3);
    const maxAllowed = balance;

    if (amount < minAllowed) return alert(`Minimum withdrawal is 30% of your investment: KES ${minAllowed}`);
    if (amount > maxAllowed) return alert(`Maximum allowed withdrawal: KES ${maxAllowed}`);

    // ✅ Generate fake OTP and display
    fakeOTP = Math.floor(1000 + Math.random() * 9000).toString();
    if (otpDisplay) otpDisplay.textContent = `Your OTP: ${fakeOTP}`;
    alert("OTP generated! Enter it below to confirm withdrawal.");

    user.pendingWithdrawal = amount;
    saveUser(user);
    otpSection.style.display = "block";
  });

  // Step 2: Confirm withdrawal with fake OTP
  document.getElementById("confirmWithdrawBtn").addEventListener("click", () => {
    const otp = withdrawOtpInput.value.trim();
    if (otp !== fakeOTP) return alert("Incorrect OTP");

    const user = getUser();
    user.balance -= user.pendingWithdrawal;
    delete user.pendingWithdrawal;
    saveUser(user);

    alert("✅ Withdrawal successful! Funds sent to MPESA.");
    window.location.href = "dashboard.html";
  });
});
