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
  const investOtpDisplay = document.getElementById("investOtpDisplay");
  const withdrawAmountInput = document.getElementById("withdrawAmount");
  const withdrawOtpSection = document.getElementById("withdrawOtpSection");
  const withdrawOtpInput = document.getElementById("withdrawOtp");
  const withdrawOtpDisplay = document.getElementById("withdrawOtpDisplay");

  let fakeInvestOTP = null;
  let fakeWithdrawOTP = null;

  const commodities = {
    marble: { price: 650, days: 15 },
    crude_oil: { price: 800, days: 20 },
    silver: { price: 1000, days: 23 },
    lead: { price: 1200, days: 25 },
    platinum: { price: 1350, days: 28 },
    diamonds: { price: 1750, days: 32 },
    gold: { price: 2200, days: 35 },
    uranium: { price: 3000, days: 45 }
  };

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
    if (!user) return;

    balanceEl.textContent = `KES ${user.balance.toFixed(2)}`;
    renderInvestments(user.investments || {});
  }

  function renderInvestments(investments) {
    investmentListEl.innerHTML = "";
    if (Object.keys(investments).length === 0) {
      investmentListEl.textContent = "No active investments.";
      return;
    }

    for (const [commodity, inv] of Object.entries(investments)) {
      const div = document.createElement("div");
      div.className = "investment-item";

      const now = new Date();
      const expiry = new Date(inv.expiry_date);
      const diff = expiry - now;

      let timeText = "Expired";
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        timeText = `${days} days remaining`;
      }

      div.textContent = `${commodity.toUpperCase()} | KES ${inv.amount} | ${timeText}`;
      investmentListEl.appendChild(div);
    }
  }

  // INVEST REQUEST
  document.getElementById("investBtn")?.addEventListener("click", () => {
    const commodity = document.getElementById("commodity").value;
    const user = getUser();

    if (!commodities[commodity]) return alert("Invalid commodity");

    const price = commodities[commodity].price;
    if (user.balance < price) return alert("Insufficient balance");

    fakeInvestOTP = Math.floor(1000 + Math.random() * 9000).toString();
    investOtpDisplay.textContent = `Your OTP: ${fakeInvestOTP}`;
    investOtpSection.style.display = "block";

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + commodities[commodity].days);

    user.pendingInvestment = {
      commodity,
      amount: price,
      expiry_date: expiryDate.toISOString()
    };

    saveUser(user);
  });

  // INVEST CONFIRM
  document.getElementById("investConfirmBtn")?.addEventListener("click", () => {
    if (investOtpInput.value.trim() !== fakeInvestOTP)
      return alert("Incorrect OTP");

    const user = getUser();
    const inv = user.pendingInvestment;
    if (!inv) return alert("No pending investment");

    user.balance -= inv.amount;
    user.investments = user.investments || {};
    user.investments[inv.commodity] = inv;

    delete user.pendingInvestment;
    saveUser(user);

    fakeInvestOTP = null;
    investOtpSection.style.display = "none";
    investOtpInput.value = "";
    investOtpDisplay.textContent = "";

    alert("Investment successful!");
    loadDashboard();
  });

  // WITHDRAW REQUEST
  document.getElementById("withdrawBtn")?.addEventListener("click", () => {
    const today = new Date();
    if (today.getDay() !== 1)
      return alert("Withdrawals allowed only on Monday");

    const amount = parseFloat(withdrawAmountInput.value);
    const user = getUser();

    if (!amount || amount <= 0) return alert("Enter valid amount");
    if (amount > user.balance) return alert("Insufficient balance");

    fakeWithdrawOTP = Math.floor(1000 + Math.random() * 9000).toString();
    withdrawOtpDisplay.textContent = `Your OTP: ${fakeWithdrawOTP}`;
    withdrawOtpSection.style.display = "block";
  });

  // WITHDRAW CONFIRM
  document.getElementById("withdrawConfirmBtn")?.addEventListener("click", () => {
    if (withdrawOtpInput.value.trim() !== fakeWithdrawOTP)
      return alert("Incorrect OTP");

    const user = getUser();
    const amount = parseFloat(withdrawAmountInput.value);

    user.balance -= amount;
    saveUser(user);

    fakeWithdrawOTP = null;
    withdrawOtpSection.style.display = "none";
    withdrawOtpInput.value = "";
    withdrawOtpDisplay.textContent = "";

    alert("Withdrawal successful!");
    loadDashboard();
  });

  loadDashboard();
});
