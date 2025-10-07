document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  if (!username) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  const today = new Date();
  const day = today.getDay(); // 1 = Monday
  if (day !== 1) {
    alert("Withdrawals are only allowed on Mondays.");
    window.location.href = "dashboard.html";
    return;
  }

  async function notifyAdmin(type, username, amount) {
    try {
      await fetch("https://repo-1red-jipate-bonus.onrender.com/notify_admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, username, amount })
      });
    } catch (err) {
      console.warn("Admin notification failed:", err);
    }
  }

  document.getElementById("withdrawForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById("amount").value);

    if (isNaN(amount) || amount <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    try {
      const [userRes, investRes] = await Promise.all([
        fetch("https://repo-1red-jipate-bonus.onrender.com/admin/view_users"),
        fetch("https://repo-1red-jipate-bonus.onrender.com/admin/view_investments"),
      ]);

      const users = await userRes.json();
      const investments = await investRes.json();

      const user = users[username];
      const investment = investments[username];

      if (!user || !investment) {
        alert("Account or investment not found.");
        return;
      }

      const invested = investment.amount;
      const balance = user.balance;
      const minAllowed = Math.floor(invested * 0.3);
      let maxAllowed = 0;

      if (invested >= 500 && invested < 1000) maxAllowed = 150;
      else if (invested >= 1000 && invested < 1500) maxAllowed = 300;
      else if (invested >= 1500) maxAllowed = Math.floor(invested * 0.3);

      if (amount < minAllowed) {
        alert(`Minimum withdrawal is 30% of investment: KES ${minAllowed}`);
        return;
      }

      if (amount > maxAllowed) {
        alert(`Maximum allowed withdrawal: KES ${maxAllowed}`);
        return;
      }

      if (amount > balance) {
        alert("Insufficient balance.");
        return;
      }

      const formData = new FormData();
      formData.append("username", username);
      formData.append("amount", amount);

      const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/withdraw/request", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Withdrawal request failed.");
      }

      const result = await res.json();
      alert("✅ Withdrawal request submitted. Wait for admin approval.");

      // ✅ Secret admin notification
      notifyAdmin("withdrawal", username, amount);

      window.location.href = "dashboard.html";
    } catch (err) {
      console.error(err);
      alert(err.message || "An error occurred during withdrawal.");
    }
  });
});
