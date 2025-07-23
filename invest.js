document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password'); // Make sure this is stored at login

  if (!username || !password) {
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
    if (!amount || isNaN(amount) || amount <= 0) {
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
          password,
          amount
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Investment failed. Try again.");
      }

      alert(result.message);
      window.location.href = "dashboard.html";

    } catch (error) {
      console.error("Investment error:", error);
      alert(error.message || "An unexpected error occurred. Please try again.");
    }
  });
});
