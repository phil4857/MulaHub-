document.addEventListener("DOMContentLoaded", () => {

  const username = localStorage.getItem("username");
  if (!username) {
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

  function updateUI() {
    const user = getUser();
    if (!user) return;

    balanceEl.textContent = `KES ${user.balance.toFixed(2)}`;
    renderInvestments(user);
  }

  function renderInvestments(user) {
    investmentListEl.innerHTML = "";

    if (!user.investments || Object.keys(user.investments).length === 0) {
      investmentListEl.textContent = "No active investments.";
      return;
    }

    const now = new Date();

    for (const [commodity, inv] of Object.entries(user.investments)) {
      const div = document.createElement("div");
      div.className = "investment-item";

      const expiry = new Date(inv.expiry_date);
      const diff = expiry - now;

      let timeText = "Expired";

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        timeText = `${days} days remaining`;
      } else {
        // Auto-credit earnings once expired
        user.balance += inv.amount * 1.2;
        delete user.investments[commodity];
        saveUser(user);
        updateUI();
        return;
      }

      div.textContent = `${commodity.toUpperCase()} | KES ${inv.amount} | ${timeText}`;
      investmentListEl.appendChild(div);
    }
  }

  // ===== INVEST REQUEST =====
  document.getElementById("investBtn")?.addEventListener("click", () => {

    const commodity = document.getElementById("commodity").value;
    const user = getUser();

    if (!commodities[commodity]) return;
    if (user.balance < commodities[commodity].price) return;

    fakeInvestOTP = Math.floor(100000 + Math.random() * 900000).toString();
    investOtpDisplay.textContent = `Your OTP: ${fakeInvestOTP}`;
    investOtpSection.style.display = "block";

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + commodities[commodity].days);

    user.pendingInvestment = {
      commodity,
      amount: commodities[commodity].price,
      expiry_date: expiryDate.toISOString()
    };

    saveUser(user);
  });

  // ===== INVEST CONFIRM =====
  document.getElementById("investConfirmBtn")?.addEventListener("click", () => {

    if (investOtpInput.value.trim() !== fakeInvestOTP) return;

    const user = getUser();
    const inv = user.pendingInvestment;
    if (!inv) return;

    user.balance -= inv.amount;
    user.investments = user.investments || {};
    user.investments[inv.commodity] = inv;

    delete user.pendingInvestment;
    saveUser(user);

    fakeInvestOTP = null;
    investOtpSection.style.display = "none";
    investOtpInput.value = "";
    investOtpDisplay.textContent = "";

    updateUI();
  });

  // ===== WITHDRAW REQUEST =====
  document.getElementById("withdrawBtn")?.addEventListener("click", () => {

    const today = new Date();
    if (today.getDay() !== 1) return; // Monday only

    const amount = parseFloat(withdrawAmountInput.value);
    const user = getUser();

    if (!amount || amount <= 0) return;
    if (amount > user.balance) return;

    fakeWithdrawOTP = Math.floor(100000 + Math.random() * 900000).toString();
    withdrawOtpDisplay.textContent = `Your OTP: ${fakeWithdrawOTP}`;
    withdrawOtpSection.style.display = "block";
  });

  // ===== WITHDRAW CONFIRM =====
  document.getElementById("withdrawConfirmBtn")?.addEventListener("click", () => {

    if (withdrawOtpInput.value.trim() !== fakeWithdrawOTP) return;

    const user = getUser();
    const amount = parseFloat(withdrawAmountInput.value);

    user.balance -= amount;
    saveUser(user);

    fakeWithdrawOTP = null;
    withdrawOtpSection.style.display = "none";
    withdrawOtpInput.value = "";
    withdrawOtpDisplay.textContent = "";

    updateUI();
  });

  updateUI();
});
