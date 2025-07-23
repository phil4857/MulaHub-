document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username');
  if (!username) {
    alert('Please log in first.');
    window.location.href = 'login.html';
    return;
  }

  // Only allow withdrawals on Mondays
  const today = new Date();
  const isMonday = today.getDay() === 1;
  if (!isMonday) {
    alert("Withdrawals are only allowed on Mondays.");
    window.location.href = "dashboard.html";
    return;
  }

  document.getElementById('withdrawForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);

    if (isNaN(amount) || amount <= 0) {
      alert("Enter a valid withdrawal amount.");
      return;
    }

    try {
      // Fetch user and investment details
      const [userRes, investRes] = await Promise.all([
        fetch(`https://repo-1red-jipate-bonus.onrender.com/admin/view_users`),
        fetch(`https://repo-1red-jipate-bonus.onrender.com/admin/view_investments`)
      ]);

      const users = await userRes.json();
      const investments = await investRes.json();

      const user = users[username];
      const investment = investments[username];

      if (!user) {
        alert("User not found on backend. Ensure you're registered and approved.");
        return;
      }

      if (!investment || investment.approved !== true) {
        alert("No approved investment found for this user.");
        return;
      }

      const invested = investment.amount;
      const balance = user.balance;

      // Calculate limits
      const minAllowed = Math.floor(invested * 0.3);
      let maxAllowed = 0;

      if (invested >= 500 && invested < 1000) {
        maxAllowed = 150;
      } else if (invested >= 1000 && invested < 1500) {
        maxAllowed = 300;
      } else if (invested >= 1500) {
        maxAllowed = Math.floor(invested * 0.3);  // 30% cap
      }

      if (amount < minAllowed) {
        alert(`Minimum withdrawal is 30% of your investment: KES ${minAllowed}`);
        return;
      }

      if (amount > maxAllowed) {
        alert(`Maximum allowed withdrawal is KES ${maxAllowed}`);
        return;
      }

      if (amount > balance) {
        alert("Insufficient balance.");
        return;
      }

      // Submit withdrawal for admin approval
      const withdrawRes = await fetch(`https://repo-1red-jipate-bonus.onrender.com/withdraw/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${encodeURIComponent(username)}&amount=${encodeURIComponent(amount)}`
      });

      if (!withdrawRes.ok) {
        const err = await withdrawRes.json();
        throw new Error(err.detail || "Withdrawal request failed.");
      }

      alert("✅ Withdrawal request submitted. Wait for admin approval.");
      window.location.href = "dashboard.html";

    } catch (err) {
      console.error("Withdrawal error:", err);
      alert(err.message || "Error occurred during withdrawal.");
    }
  });
});
