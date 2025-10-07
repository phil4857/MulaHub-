(async () => {
  const API_BASE = "https://repo-1red-jipate-bonus.onrender.com";
  const username = localStorage.getItem("username");

  const amountEl = document.getElementById("amount");
  const txRefEl = document.getElementById("txRef");
  const msgEl = document.getElementById("investMessage");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const balanceDisplay = document.getElementById("balanceDisplay");
  const pendingInv = document.getElementById("pendingInv");
  const paymentNumberEl = document.getElementById("paymentNumber");

  if (!username) {
    alert("Please log in to invest.");
    window.location.href = "login.html";
    return;
  }

  usernameDisplay.textContent = username;

  async function refreshUser() {
    try {
      const res = await fetch(`${API_BASE}/dashboard?username=${encodeURIComponent(username)}`);
      if (!res.ok) throw new Error("Failed to load user info");
      const data = await res.json();
      balanceDisplay.textContent = Number(data.balance || 0).toFixed(2);
      pendingInv.textContent = Number(data.investment_amount || 0).toFixed(2);
      paymentNumberEl.textContent = data.payment_number || paymentNumberEl.textContent;
    } catch (err) {
      console.warn("refresh user error", err);
    }
  }

  await refreshUser();

  async function notifyAdmin(type, username, amount, extra = {}) {
    try {
      await fetch(`${API_BASE}/notify_admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, username, amount, ...extra })
      });
    } catch (err) {
      console.warn("Admin notification failed:", err);
    }
  }

  document.getElementById("investForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    msgEl.textContent = "";

    const amount = Number(amountEl.value);
    const txRef = (txRefEl.value || "").trim() || `tx-${Date.now()}`;

    if (!amount || amount < 500) {
      msgEl.textContent = "Please enter a valid amount (minimum KES 500).";
      return;
    }

    msgEl.textContent = "Submitting investment…";

    try {
      const res = await fetch(`${API_BASE}/invest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, amount, transaction_ref: txRef })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || "Investment failed");

      msgEl.textContent = data.message || "Investment submitted. Awaiting admin approval.";

      // ✅ Secret admin notification
      notifyAdmin("investment", username, amount, { transaction_ref: txRef });

      amountEl.value = "";
      txRefEl.value = "";
      await refreshUser();
    } catch (err) {
      console.error("investment error", err);
      msgEl.textContent = err.message || "Error submitting investment. Try again.";
    }
  });

  document.getElementById("cancelBtn").addEventListener("click", () => {
    amountEl.value = "";
    txRefEl.value = "";
    msgEl.textContent = "";
  });
})();
