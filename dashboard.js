document.addEventListener('DOMContentLoaded', async function () {
  const username = localStorage.getItem('username');
  if (!username) {
    alert("Please login first.");
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('welcome').innerText = `Welcome, ${username}`;

  // Load balance and earnings
  try {
    const response = await fetch(`https://repo-1red-jipate-bonus.onrender.com/admin/view_users`);
    const data = await response.json();

    if (data[username]) {
      document.getElementById('balance').innerText = `Balance: KES ${data[username].balance.toFixed(2)}`;
      document.getElementById('earnings').innerText = `Total Earnings: KES ${data[username].earnings.toFixed(2)}`;
      
      // Countdown
      const lastTime = data[username].last_earning_time;
      const nextTime = lastTime + 86400 * 1000;
      const countdown = setInterval(() => {
        const now = Date.now();
        const remaining = nextTime - now;
        if (remaining <= 0) {
          clearInterval(countdown);
          document.getElementById('countdown').innerText = "You can now earn!";
        } else {
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((remaining % (1000 * 60)) / 1000);
          document.getElementById('countdown').innerText = `Next earning in: ${hours}h ${mins}m ${secs}s`;
        }
      }, 1000);
    }
  } catch (err) {
    console.error(err);
    alert("Failed to load dashboard data.");
  }

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', function () {
    localStorage.clear();
    window.location.href = 'login.html';
  });
});
