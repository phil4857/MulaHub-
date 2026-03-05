// daily-bonus.js
document.addEventListener("DOMContentLoaded", () => {
    // ── Early exit if not logged in ──
    const username = localStorage.getItem("username");
    if (!username) {
        alert("Please log in to claim your daily bonus.");
        window.location.href = "login.html";
        return;
    }

    // ── DOM elements ──
    const countdownEl = document.getElementById("countdown");
    const grabBtn     = document.getElementById("grabBonusBtn");

    if (!countdownEl || !grabBtn) {
        console.warn("Required elements #countdown or #grabBonusBtn not found.");
        return;
    }

    // ── Visual setup ──
    Object.assign(document.body.style, {
        background: "linear-gradient(135deg, #004aad 0%, #28a745 100%)",
        color: "#ffffff",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        minHeight: "100vh",
        margin: "0",
        padding: "20px"
    });

    // ── Countdown Logic ──
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    function updateCountdown() {
        const lastClaimStr = localStorage.getItem("lastEarning");
        const now = Date.now();

        if (!lastClaimStr) {
            countdownEl.textContent = "🎉 You can claim your daily bonus now!";
            countdownEl.style.color = "#ffeb3b";
            grabBtn.disabled = false;
            return;
        }

        const lastClaim = parseInt(lastClaimStr, 10);
        const nextClaim = lastClaim + ONE_DAY_MS;
        const remaining = nextClaim - now;

        if (remaining <= 0) {
            countdownEl.textContent = "🎉 Ready! Claim your daily bonus now!";
            countdownEl.style.color = "#4caf50";
            grabBtn.disabled = false;
        } else {
            const hours   = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            countdownEl.textContent = `⏳ Next claim in: ${hours.toString().padStart(2,'0')}h ${minutes.toString().padStart(2,'0')}m ${seconds.toString().padStart(2,'0')}s`;
            countdownEl.style.color = "#ffeb3b";
            grabBtn.disabled = true;
        }
    }

    // Update every second + initial call
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    // ── Claim Button Handler ──
    grabBtn.addEventListener("click", async () => {
        // Already disabled by countdown → extra safety
        if (grabBtn.disabled) return;

        grabBtn.disabled = true;
        grabBtn.textContent = "Processing...";

        try {
            const body = new URLSearchParams({ username });

            const response = await fetch("https://repo-1red-jipate-bonus.onrender.com/bonus/grab", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || data.message || "Failed to claim bonus");
            }

            // Success
            alert(`✅ ${data.message || "Daily bonus claimed successfully!"}`);
            
            // Update last claim time
            localStorage.setItem("lastEarning", Date.now().toString());
            
            // Immediately refresh UI
            updateCountdown();

        } catch (err) {
            console.error("Bonus claim error:", err);
            alert(`❌ ${err.message || "Could not claim bonus. Please try again later."}`);
        } finally {
            grabBtn.disabled = false;
            grabBtn.textContent = "Grab Daily Bonus";
        }
    });

    // ── Cleanup (good practice) ──
    window.addEventListener("beforeunload", () => {
        clearInterval(countdownInterval);
    });
});
