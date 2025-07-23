document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username");
  if (!username) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("usernameDisplay").textContent = username;
  const referralUrl = `${window.location.origin}/register.html?ref=${encodeURIComponent(username)}`;
  document.getElementById("referralLink").href = referralUrl;
  document.getElementById("referralLink").textContent = referralUrl;

  try {
    // Trigger daily bonus (no credentials needed here)
    await fetch("https://repo-1red-jipate-bonus.onrender.com/bonus/grab", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `username=${encodeURIComponent(username)}`
    }).catch(() => { /* ignore if already claimed */ });

    // Fetch dashboard data
    const res = await fetch(`https://repo-1red-jipate-bonus.onrender.com/dashboard?username=${encodeURIComponent(username)}`);
    const user = await res.json();

    document.getElementById("balanceDisplay").textContent = `KES ${user.balance.toFixed(2)}`;
    document.getElementById("earningsDisplay").textContent = `KES ${user.earnings.toFixed(2)}`;
    document.getElementById("bonusStatus").textContent = new Date(user.last_bonus_time).toLocaleString();

    if (localStorage.getItem("is_admin") === "true") {
      document.getElementById("adminLink").style.display = "block";
    }
  } catch (err) {
    console.error("Dashboard load failed:", err);
    alert("Failed to load dashboard. Try again later.");
  }
});
