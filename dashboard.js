document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username");

  if (!username) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  // Set username
  document.getElementById("usernameDisplay").textContent = username;

  // Set referral link
  const referralUrl = `${window.location.origin}/register.html?ref=${username}`;
  const referralLinkEl = document.getElementById("referralLink");
  referralLinkEl.textContent = referralUrl;
  referralLinkEl.href = referralUrl;

  try {
    // Trigger daily earnings (idempotent)
    await fetch("https://repo-1red-jipate-bonus.onrender.com/earnings/daily", {
      method: "POST",
    });

    // Fetch all users
    const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/admin/view_users");
    const users = await res.json();

    const user = users[username];
    if (!user) {
      alert("User not found.");
      return;
    }

    // Update DOM with balance and earnings
    document.getElementById("balanceDisplay").textContent = `KES ${user.balance.toFixed(2)}`;
    document.getElementById("earningsDisplay").textContent = `KES ${user.earnings.toFixed(2)}`;

    // Show MPESA payment instructions
    document.getElementById("paymentInstructions").textContent = "Send payment to MPESA number: 0737734533";

    // Display referred users
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
    console.error(err);
    alert("Failed to load dashboard data.");
  }
});
