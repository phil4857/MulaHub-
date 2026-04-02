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

    // ── Constants ──
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    // ── Create Live Banner ──
    function createLiveBanner() {
        const banner = document.createElement("div");
        banner.style.cssText = `
            background: linear-gradient(90deg, #10b981, #34d399);
            color: white;
            padding: 16px 20px;
            border-radius: 14px;
            text-align: center;
            font-weight: 700;
            margin: 25px 0 35px 0;
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
            animation: pulse 3s infinite;
            font-size: 1.12rem;
            line-height: 1.45;
        `;
        banner.innerHTML = `
            🚀 Thousands of people are earning more than 300 daily with Mkoba Wallet<br>
            <span style="font-size: 0.96rem; opacity: 0.95; font-weight: 500;">
                Start your journey to financial freedom today
            </span>
        `;

        // Insert banner below any existing top banner / welcome area
        const firstElement = document.body.firstElementChild;
        if (firstElement) {
            document.body.insertBefore(banner, firstElement.nextSibling || firstElement);
        } else {
            document.body.appendChild(banner);
        }
    }

    // ── Countdown Logic ──
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

    // ── Initial call + update interval ──
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    // ── Claim Button Handler ──
    grabBtn.addEventListener("click", async () => {
        if (grabBtn.disabled) return;

        grabBtn.disabled = true;
        grabBtn.textContent = "Processing...";

        try {
            const body = new URLSearchParams({ username });

            const response = await fetch("https://repo-1red-jipate-bonus.onrender.com/bonus/grab", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.detail || data.message || "Failed to claim bonus");

            alert(`✅ ${data.message || "Daily bonus claimed successfully!"}`);

            // Update last claim time
            localStorage.setItem("lastEarning", Date.now().toString());

            // Refresh countdown
            updateCountdown();

        } catch (err) {
            console.error("Bonus claim error:", err);
            alert(`❌ ${err.message || "Could not claim bonus. Try again later."}`);
        } finally {
            grabBtn.disabled = false;
            grabBtn.textContent = "Grab Daily Bonus";
        }
    });

    // ── Create the live banner ──
    createLiveBanner();

    // ── Cleanup on unload ──
    window.addEventListener("beforeunload", () => clearInterval(countdownInterval));
});
