// invest.js
document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username');

  if (!username) {
    alert('Please log in first.');
    window.location.href = 'login.html';
    return;
  }

  const investForm = document.getElementById('investForm');
  if (!investForm) {
    console.error("Investment form not found on the page.");
    return;
  }

  investForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const transactionRef = document.getElementById('transactionRef').value.trim();

    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid investment amount greater than zero.");
      return;
    }

    if (!transactionRef) {
      alert("Please enter your transaction reference.");
      return;
    }

    try {
      const response = await fetch('https://repo-1red-jipate-bonus.onrender.com/invest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `username=${encodeURIComponent(username)}&amount=${encodeURIComponent(amount)}&transaction_ref=${encodeURIComponent(transactionRef)}`
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Investment failed. Try again.");
      }

      alert(result.message + (result.note ? `\n${result.note}` : ""));
      window.location.href = "dashboard.html";

    } catch (error) {
      console.error("Investment error:", error);
      alert(error.message || "An unexpected error occurred. Please try again.");
    }
  });
});
