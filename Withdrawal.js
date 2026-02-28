document.addEventListener("DOMContentLoaded", () => {

  const username = localStorage.getItem("username");
  if (!username) {
    window.location.href = "login.html";
    return;
  }

  // Monday only (1 = Monday)
  const today = new Date();
  if (today.getDay() !== 1) {
    alert("Withdrawals are only allowed on Mondays.");
    window.location.href = "dashboard.html";
    return;
  }

  const withdrawForm = document.getElementById("withdrawForm");
  const otpSection = document.getElementById("otpSection");
  const withdrawOtpInput = document.getElementById("withdrawOtp");
  const otpDisplay = document.getElementById("otpDisplay");
  const confirmBtn = document.getElementById("confirmWithdrawBtn");

  let fakeOTP = null;
  let otpActive = false;

  function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "{}");
  }

  function getUser() {
    return getUsers()[username];
  }

  function saveUser(user) {
    const users = getUsers();
    users[username] = user;
    localStorage.setItem("users", JSON.stringify(users));
  }

  // ===== STEP 1: REQUEST WITHDRAWAL =====
  withdrawForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const amountInput = document.getElementById("amount").value;
    const amount = parseFloat(amountInput);

    if (!amount || amount <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    const user = getUser();
    if (!user) {
      alert("User not found.");
      return;
    }

    const invested = user.investment_amount || 0;
    const balance = user.balance || 0;
    const minAllowed = Math.floor(invested * 0.3);

    if (amount < minAllowed) {
      alert(`Minimum withdrawal is KES ${minAllowed}`);
      return;
    }

    if (amount > balance) {
      alert(`Maximum allowed withdrawal is KES ${balance}`);
      return;
    }

    // Generate 6-digit fake OTP
    fakeOTP = Math.floor(100000 + Math.random() * 900000).toString();
    otpActive = true;

    if (otpDisplay) {
      otpDisplay.textContent = `Your OTP: ${fakeOTP}`;
    }

    user.pendingWithdrawal = amount;
    saveUser(user);

    otpSection.style.display = "block";
  });

  // ===== STEP 2: CONFIRM WITHDRAWAL =====
  confirmBtn.addEventListener("click", () => {

    if (!otpActive) return;

    const enteredOtp = withdrawOtpInput.value.trim();
    if (enteredOtp !== fakeOTP) {
      alert("Incorrect OTP.");
      return;
    }

    const user = getUser();
    if (!user || !user.pendingWithdrawal) return;

    const amount = user.pendingWithdrawal;

    if (amount > user.balance) {
      alert("Balance error.");
      return;
    }

    user.balance -= amount;
    delete user.pendingWithdrawal;
    saveUser(user);

    // Reset OTP state
    fakeOTP = null;
    otpActive = false;
    withdrawOtpInput.value = "";
    otpSection.style.display = "none";

    alert("Withdrawal successful! Funds sent to MPESA.");
    window.location.href = "dashboard.html";
  });

});
