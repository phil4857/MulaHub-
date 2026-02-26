document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  if (!username) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  const balanceEl = document.getElementById("balanceDisplay");
  const investmentListEl = document.getElementById("investmentList");
  const investOtpSection = document.getElementById("investOtpSection");
  const investOtpInput = document.getElementById("investOtp");
  const withdrawAmountInput = document.getElementById("withdrawAmount");
  const withdrawOtpSection = document.getElementById("withdrawOtpSection");
  const withdrawOtpInput = document.getElementById("withdrawOtp");

  let investmentsData = {};
  let fakeInvestOTP = null;
  let fakeWithdrawOTP = null;

  function getUser() {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    return users[username];
  }

  function saveUser(user) {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    users[username] = user;
    localStorage.setItem("users", JSON.stringify(users));
  }

  function loadDashboard() {
    const user = getUser();
    balanceEl.textContent = `KES ${user.balance.toFixed(2)}`;
    investmentsData = user.investments || {};
    renderInvestments();
  }

  function renderInvestments() {
    investmentListEl.innerHTML = "";
    if (Object.keys(investmentsData).length === 0) {
      investmentListEl.textContent = "No active investments.";
      return;
    }
    for (const [commodity, inv] of Object.entries(investmentsData)) {
      const div = document.createElement("div");
      div.id = `invest-${commodity}`;
      const now = new Date();
      const expiry = new Date(inv.expiry_date);
      const diff = expiry - now;
      let timeText = diff > 0 ? `${Math.floor(diff/3600000)}h ${Math.floor((diff%3600000)/60000)}m ${Math.floor((diff%60000)/1000)}s` : "Expired";
      div.textContent = `${commodity}: KES ${inv.amount} | Expires in ${timeText}`;
      div.className = "investment-item";
      investmentListEl.appendChild(div);
    }
  }

  // Investment request
  document.getElementById("investBtn")?.addEventListener("click", () => {
    const commodity = document.getElementById("commodity").value;
    const user = getUser();
    const amount = parseFloat(prompt("Enter investment amount:"));
    if (isNaN(amount) || amount <= 0) return alert("Enter a valid amount");
    if (amount > user.balance) return alert("Insufficient balance");

    fakeInvestOTP = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`Investment OTP: ${fakeInvestOTP}`);
    alert("OTP sent for investment (check console in test mode)");
    investOtpSection.style.display = "block";

    user.pendingInvestment = { commodity, amount, expiry_date: new Date(Date.now() + 3600*1000*24).toISOString() };
    saveUser(user);
  });

  // Investment confirm
  document.getElementById("investConfirmBtn")?.addEventListener("click", () => {
    const otp = investOtpInput.value.trim();
    if (otp !== fakeInvestOTP) return alert("Incorrect OTP");

    const user = getUser();
    if (!user.pendingInvestment) return alert("No pending investment");

    const inv = user.pendingInvestment;
    user.balance -= inv.amount;
    if (!user.investments) user.investments = {};
    user.investments[inv.commodity] = inv;
    delete user.pendingInvestment;
    saveUser(user);

    fakeInvestOTP = null;
    investOtpInput.value = "";
    investOtpSection.style.display = "none";
    alert("Investment successful!");
    loadDashboard();
  });

  // Withdrawal request
  document.getElementById("withdrawBtn")?.addEventListener("click", () => {
    const amount = parseFloat(withdrawAmountInput.value);
    const user = getUser();
    if (isNaN(amount) || amount <= 0) return alert("Enter valid amount");
    if (amount > user.balance) return alert("Insufficient balance");

    fakeWithdrawOTP = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`Withdrawal OTP: ${fakeWithdrawOTP}`);
    alert("OTP sent for withdrawal (check console in test mode)");
    withdrawOtpSection.style.display = "block";

    user.pendingWithdrawal = amount;
    saveUser(user);
  });

  // Withdrawal confirm
  document.getElementById("withdrawConfirmBtn")?.addEventListener("click", () => {
    const otp = withdrawOtpInput.value.trim();
    if (otp !== fakeWithdrawOTP) return alert("Incorrect OTP");

    const user = getUser();
    user.balance -= user.pendingWithdrawal;
    delete user.pendingWithdrawal;
    saveUser(user);

    fakeWithdrawOTP = null;
    withdrawOtpInput.value = "";
    withdrawOtpSection.style.display = "none";
    alert("Withdrawal successful!");
    loadDashboard();
  });

  // Investment countdown updater
  setInterval(renderInvestments, 1000);
  loadDashboard();
});
