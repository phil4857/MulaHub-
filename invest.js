document.addEventListener('DOMContentLoaded', async () => {
  const username = localStorage.getItem('username');

  if (!username) {
    alert('Please log in first.');
    window.location.href = 'login.html';
    return;
  }

  // Load user dashboard data
  await loadDashboard(username);

  // Handle new investment form
  const investForm = document.getElementById('investForm');
  if (investForm) {
    investForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const amountInput = document.getElementById('amount');
      const amount = parseFloat(amountInput.value);

      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid investment amount greater than zero.");
        return;
      }

      try {
        const response = await fetch('https://repo-1red-jipate-bonus.onrender.com/invest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            amount
          })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.detail || "Investment failed. Try again.");
        }

        alert(result.message || "Investment successful.");
        await loadDashboard(username); // refresh dashboard after investing

      } catch (error) {
        console.error("Investment error:", error);
        alert(error.message || "An unexpected error occurred. Please try again.");
      }
    });
  }
});

// Fetch and display dashboard info
async function loadDashboard(username) {
  try {
    const res = await fetch(`https://repo-1red-jipate-bonus.onrender.com/dashboard?username=${username}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.detail || "Failed to load dashboard");

    const dashDiv = document.getElementById('dashboardData');
    if (!dashDiv) return;

    dashDiv.innerHTML = `
      <div class="card">
        <h3>Welcome, ${data.username}</h3>
        <p><strong>Balance:</strong> KES ${data.balance.toFixed(2)}</p>
        <p><strong>Total Earnings:</strong> KES ${data.earnings.toFixed(2)}</p>
        <p><strong>Investment Amount:</strong> KES ${data.investment_amount}</p>
        <p><strong>Bonus Days Remaining:</strong> ${data.bonus_days_remaining}</p>
        <p><strong>Bonus Status:</strong> ${data.bonus_message}</p>
      </div>
    `;
  } catch (err) {
    console.error("Dashboard error:", err);
    alert("Failed to load dashboard. Please try again.");
  }
}
