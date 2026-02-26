document.addEventListener("DOMContentLoaded", () => {
  const countdownDisplay = document.getElementById("countdown");
  const grabBtn = document.getElementById("grabBonusBtn");

  // Set attractive background gradient
  document.body.style.background = "linear-gradient(to bottom right, #004aad, #28a745)";
  document.body.style.color = "#fff";
  document.body.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

  const username = localStorage.getItem("username");
  if (!username) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  // ---------------- Countdown for daily earnings ----------------
  function updateCountdown() {
    if (!countdownDisplay) return;

    const lastEarning = localStorage.getItem("lastEarning");
    if (!lastEarning) {
      countdownDisplay.textContent = "🎉 You can now claim your daily earnings!";
      countdownDisplay.style.color = "#ffeb3b";
      return;
    }

    const now = Date.now();
    const nextEarning = parseInt(lastEarning) + 24 * 60 * 60 * 1000; // 24 hours in ms
    const remaining = nextEarning - now;

    if (remaining > 0) {
      const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remaining / (1000 * 60)) % 60);
      const seconds = Math.floor((remaining / 1000) % 60);

      countdownDisplay.textContent = `⏳ Next earnings in: ${hours}h ${minutes}m ${seconds}s`;
      countdownDisplay.style.color = "#ffeb3b";
    } else {
      countdownDisplay.textContent = "🎉 You can now claim your daily earnings!";
      countdownDisplay.style.color = "#ffeb3b";
    }
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // ---------------- Grab daily bonus ----------------
  if (grabBtn) {
    grabBtn.addEventListener("click", async () => {
      grabBtn.disabled = true;
      grabBtn.textContent = "Processing...";

      try {
        const form = new URLSearchParams();
        form.append("username", username);

        const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/bonus/grab", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: form
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Bonus claim failed");

        alert(`✅ ${data.message || "Bonus claimed!"}`);
        localStorage.setItem("lastEarning", Date.now().toString());
        updateCountdown();
      } catch (err) {
        console.error(err);
        alert(`❌ ${err.message || "An error occurred. Try again."}`);
      } finally {
        grabBtn.disabled = false;
        grabBtn.textContent = "Grab Bonus";
      }
    });
  }
});
