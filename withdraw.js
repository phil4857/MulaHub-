document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username");
  const userToken = localStorage.getItem("userToken");

  if (!username || !userToken) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  // Only allow withdrawals on Monday
  const today = new Date();
  if (today.getDay() !== 1) {
    alert("Withdrawals are only allowed on Mondays.");
    window.location.href = "dashboard.html";
    return;
  }

  // Fetch user dashboard data
  async function getUserData() {
    try {
      const res = await fetch(`https://repo-1red-jipate-bonus.onrender.com/dashboard?username=${encodeURIComponent(username)}`, {
        headers: { "Authorization": `Bearer ${userToken}` }
      });
      if (!res.ok) throw new Error("Failed to load your data");
      return await res.json();
    } catch (err) {
      alert(err.message);
      return null;
    }
  }

  const userData = await getUserData();
  if (!userData) return;

  const withdrawForm = document.getElementById("withdrawForm");
  withdrawForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById("amount").value);

    if (isNaN(amount) || amount <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    const invested = userData.investment_amount || 0;
    const balance = userData.balance || 0;
    const minAllowed = Math.floor(invested * 0.3);
    const maxAllowed = balance;

    if (amount < minAllowed) {
      alert(`Minimum withdrawal is 30% of your investment: KES ${minAllowed}`);
      return;
    }
    if (amount > maxAllowed) {
      alert(`Maximum allowed withdrawal: KES ${maxAllowed}`);
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("amount", amount);

      const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Withdrawal failed");

      alert("✅ Withdrawal submitted successfully! Funds will be sent to your MPESA.");
      window.location.href = "dashboard.html";

    } catch (err) {
      console.error(err);
      alert("❌ " + (err.message || "An error occurred"));
    }
  });
});
