document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username");
  const isAdmin = localStorage.getItem("is_admin") === "true";

  if (!username) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  // Elements
  const balanceEl = document.getElementById("balanceDisplay");
  const earningsEl = document.getElementById("earningsDisplay");
  const bonusStatusEl = document.getElementById("bonusStatus");
  const bonusBtn = document.getElementById("grabBonusBtn");
  const referralLinkEl = document.getElementById("referralLink");
  const adminLinkEl = document.getElementById("adminLink");
  const withdrawBtn = document.getElementById("withdrawBtn");

  const referralUrl = `${window.location.origin}/register.html?ref=${encodeURIComponent(username)}`;
  referralLinkEl.href = referralUrl;
  referralLinkEl.textContent = referralUrl;

  if (isAdmin && adminLinkEl) adminLinkEl.style.display = "block";

  // Fetch and display user dashboard data
  async function loadDashboard() {
    try {
      const res = await fetch(`https://repo-1red-jipate-bonus.onrender.com/dashboard?username=${encodeURIComponent(username)}`);
      if (!res.ok) throw new Error("Failed to load dashboard");
      const data = await res.json();

      balanceEl.textContent = `KES ${data.balance.toFixed(2)}`;
      earningsEl.textContent = `KES ${data.earnings.toFixed(2)}`;
      bonusStatusEl.textContent = data.bonus_days_remaining > 0 
        ? `${data.bonus_days_remaining} bonus days left`
        : "No bonus available";

      return data;
    } catch (err) {
      console.error(err);
      alert("Unable to load dashboard. Try again later.");
    }
  }

  // Grab daily bonus
  if (bonusBtn) {
    bonusBtn.addEventListener("click", async () => {
      try {
        const form = new URLSearchParams({ username });
        const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/bonus/grab", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: form
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Bonus grab failed");
        alert(data.message);
        await loadDashboard();
      } catch (err) {
        console.error(err);
        alert(err.message || "Failed to grab bonus");
      }
    });
  }

  // Withdraw funds with OTP
  if (withdrawBtn) {
    withdrawBtn.addEventListener("click", async () => {
      const amount = prompt("Enter withdrawal amount (KES):");
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        alert("Invalid amount");
        return;
      }

      const otp = prompt("Enter the OTP sent to your phone:");
      if (!otp || otp.length === 0) {
        alert("OTP is required");
        return;
      }

      try {
        const form = new URLSearchParams({ username, amount, otp });
        const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/withdraw/request", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: form
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Withdrawal request failed");
        alert(data.message);
        await loadDashboard();
      } catch (err) {
        console.error(err);
        alert(err.message || "Withdrawal failed");
      }
    });
  }

  await loadDashboard();
});
