document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username');
  if (!username) {
    alert('Please log in first.');
    window.location.href = 'login.html';
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

      if (!user || !investment) {
        alert("Account or investment not found.");
        return;
      }

      const invested = investment.amount;
      const balance = user.balance;

      // Determine withdrawal limit
      let allowedLimit = 0;
      if (invested >= 500 && invested < 1000) {
        allowedLimit = 150;
      } else if (invested >= 1000 && invested < 1500) {
        allowedLimit = 300;
      } else if (invested >= 1500) {
        allowedLimit = Math.floor(invested * 0.3);  // 30% cap
      }

      if (amount > allowedLimit) {
        alert(`Your withdrawal limit is KES ${allowedLimit}`);
        return;
      }

      if (amount > balance) {
        alert("Insufficient balance.");
        return;
      }

      // Submit withdrawal
      const withdrawRes = await fetch(`https://repo-1red-jipate-bonus.onrender.com/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${encodeURIComponent(username)}&amount=${encodeURIComponent(amount)}`
      });

      if (!withdrawRes.ok) {
        const err = await withdrawRes.json();
        throw new Error(err.detail || "Withdrawal failed");
      }

      alert("Withdrawal request sent. You’ll be notified once processed.");
      window.location.href = "dashboard.html";

    } catch (err) {
      console.error(err);
      alert(err.message || "Error occurred during withdrawal.");
    }
  });
});
