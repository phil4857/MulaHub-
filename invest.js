document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username');
  if (!username) {
    alert('Please log in first.');
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('investForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const transactionRef = document.getElementById('transactionRef').value;

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!transactionRef.trim()) {
      alert("Transaction reference is required.");
      return;
    }

    try {
      const response = await fetch(`https://repo-1red-jipate-bonus.onrender.com/invest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `username=${encodeURIComponent(username)}&amount=${encodeURIComponent(amount)}&transaction_ref=${encodeURIComponent(transactionRef)}`
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Investment failed.");
      }

      const result = await response.json();
      alert(result.message + "\n" + result.note);
      window.location.href = "dashboard.html";

    } catch (err) {
      console.error("Investment Error:", err);
      alert(err.message || "An error occurred while investing.");
    }
  });
});
