document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username");

  if (!username) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  // Show logged-in username
  document.getElementById("usernameDisplay").textContent = username;

  // Setup referral link
  const referralUrl = `${window.location.origin}/register.html?ref=${encodeURIComponent(username)}`;
  const referralLinkEl = document.getElementById("referralLink");
  referralLinkEl.textContent = referralUrl;
  referralLinkEl.href = referralUrl;

  try {
    // Trigger daily earnings
    await fetch("https://repo-1red-jipate-bonus.onrender.com/earnings/daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    });

    // Fetch all users
    const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/admin/view_users");
    if (!res.ok) throw new Error("Unable to fetch user data");

    const users = await res.json();
    const user = users[username];

    if (!user) {
      alert("Your account could not be found.");
      return;
    }

    // Enforce investment rule
    if (!user.invested || user.investment_amount < 500 || !user.approved) {
      document.getElementById("balanceDisplay").textContent = "KES 0.00";
      document.getElementById("earningsDisplay").textContent = "KES 0.00";
      alert("Earnings are only available after approval and a minimum investment of KES 500.");
    } else {
      const earnings = user.earnings ?? 0;
      const balance = user.balance ?? 0;

      document.getElementById("balanceDisplay").textContent = `KES ${balance.toFixed(2)}`;
      document.getElementById("earningsDisplay").textContent = `KES ${earnings.toFixed(2)}`;
    }

    // Payment instructions
    document.getElementById("paymentInstructions").textContent =
      "Send payment to MPESA number: 0737734533";

    // Referral list
    const referredUsers = user.referred_users || [];
    const referredList = document.getElementById("referredUsers");
    referredList.innerHTML = "";

    if (referredUsers.length === 0) {
      referredList.innerHTML = "<li>No referrals yet</li>";
    } else {
      referredUsers.forEach((refUser) => {
        const li = document.createElement("li");
        li.textContent = refUser;
        referredList.appendChild(li);
      });
    }

  } catch (err) {
    console.error("Dashboard error:", err);
    alert("Failed to load dashboard data. Please try again later.");
  }
});
