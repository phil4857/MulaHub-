document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username");
  const isAdmin = localStorage.getItem("is_admin") === "true";

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
    // Check if user is approved
    const userRes = await fetch(`https://repo-1red-jipate-bonus.onrender.com/user/${encodeURIComponent(username)}`);
    if (!userRes.ok) throw new Error("Failed to fetch user data.");
    const userData = await userRes.json();

    if (!userData.approved) {
      alert("Your account is not yet approved by the admin. Please wait.");
      window.location.href = "login.html";
      return;
    }

    // Trigger daily bonus silently
    await fetch("https://repo-1red-jipate-bonus.onrender.com/bonus/grab", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `username=${encodeURIComponent(username)}`
    }).catch(() => { /* ignore if already claimed */ });

    // Load dashboard data
    const dashRes = await fetch(`https://repo-1red-jipate-bonus.onrender.com/dashboard?username=${encodeURIComponent(username)}`);
    if (!dashRes.ok) throw new Error("Failed to load dashboard data.");
    const user = await dashRes.json();

    document.getElementById("balanceDisplay").textContent = `KES ${user.balance.toFixed(2)}`;
    document.getElementById("earningsDisplay").textContent = `KES ${user.earnings.toFixed(2)}`;
    document.getElementById("bonusStatus").textContent = new Date(user.last_bonus_time).toLocaleString();

    if (isAdmin) {
      const adminLink = document.getElementById("adminLink");
      if (adminLink) adminLink.style.display = "block";
    }
  } catch (err) {
    console.error("Dashboard load failed:", err);
    alert("Failed to load dashboard. Try again later.");
  }
});
