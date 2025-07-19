document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const countdownDisplay = document.getElementById("countdown");

  // Daily earnings countdown (24 hours)
  function updateCountdown() {
    const lastEarning = localStorage.getItem("lastEarning");
    if (!lastEarning) return;

    const now = new Date().getTime();
    const nextEarning = parseInt(lastEarning) + 86400000; // 24 hrs in ms
    const remaining = nextEarning - now;

    if (remaining > 0) {
      const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remaining / (1000 * 60)) % 60);
      const seconds = Math.floor((remaining / 1000) % 60);

      countdownDisplay.textContent = `Next earnings in: ${hours}h ${minutes}m ${seconds}s`;
    } else {
      countdownDisplay.textContent = "You can now claim your daily earnings!";
    }
  }

  setInterval(updateCountdown, 1000);

  // Handle form submission
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const action = form.getAttribute("action");
      const method = form.getAttribute("method") || "POST";

      try {
        const response = await fetch(action, {
          method,
          body: formData,
        });

        const data = await response.json();
        alert(data.message || "Success");

        if (action.includes("earnings")) {
          localStorage.setItem("lastEarning", new Date().getTime().toString());
        }

      } catch (error) {
        alert("An error occurred. Please try again.");
        console.error(error);
      }
    });
  }
});
