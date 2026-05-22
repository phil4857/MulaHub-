// daily-bonus.js - MulaHub Daily Earnings System

document.addEventListener("DOMContentLoaded", () => {

    // ── AUTH CHECK ──
    const username = localStorage.getItem("username");

    if (!username) {
        alert("⚠️ Please log in to access MulaHub earnings.");
        window.location.href = "login.html";
        return;
    }

    // ── ELEMENTS ──
    const countdownEl = document.getElementById("countdown");
    const grabBtn = document.getElementById("grabBonusBtn");

    if (!countdownEl || !grabBtn) {
        console.warn("Missing #countdown or #grabBonusBtn");
        return;
    }

    // ── UI STYLE (MulaHub feel) ──
    Object.assign(document.body.style, {
        background: "linear-gradient(135deg, #0ea5e9, #22c55e)",
        color: "#ffffff",
        fontFamily: "'Segoe UI', sans-serif",
        minHeight: "100vh",
        margin: "0",
        padding: "20px"
    });

    const ONE_DAY = 24 * 60 * 60 * 1000;

    // ── COUNTDOWN ENGINE ──
    function updateCountdown() {

        const lastClaim = localStorage.getItem("lastEarning");
        const now = Date.now();

        if (!lastClaim) {
            countdownEl.textContent = "🎉 Welcome! Your MulaHub bonus is ready to claim.";
            grabBtn.disabled = false;
            return;
        }

        const nextTime = parseInt(lastClaim, 10) + ONE_DAY;
        const remaining = nextTime - now;

        if (remaining <= 0) {
            countdownEl.textContent = "🚀 Your daily earnings are ready to claim!";
            countdownEl.style.color = "#facc15";
            grabBtn.disabled = false;
        } else {
            const h = Math.floor(remaining / 3600000);
            const m = Math.floor((remaining % 3600000) / 60000);
            const s = Math.floor((remaining % 60000) / 1000);

            countdownEl.textContent =
                `⏳ Next MulaHub payout in: ${h.toString().padStart(2,'0')}h ` +
                `${m.toString().padStart(2,'0')}m ${s.toString().padStart(2,'0')}s`;

            grabBtn.disabled = true;
        }
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    
    // ── CLAIM BONUS BUTTON ──
    grabBtn.addEventListener("click", async () => {

        if (grabBtn.disabled) return;

        grabBtn.disabled = true;
        grabBtn.textContent = "Processing payout...";

        try {

            const response = await fetch(
                "https://repo-1red-jipate-bonus.onrender.com/bonus/grab",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams({ username })
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.detail || data.message || "Unable to process bonus");
            }

            // ── SUCCESS ──
            localStorage.setItem("lastEarning", Date.now().toString());

            countdownEl.textContent = "🎉 Success! Daily earnings credited to your account.";
            countdownEl.style.color = "#22c55e";

            // nicer UX instead of alert
            showToast("✅ Bonus claimed successfully!");

            updateCountdown();

        } catch (err) {

            console.error("Bonus error:", err);
            showToast(`❌ ${err.message || "Something went wrong"}`);

        } finally {
            grabBtn.disabled = false;
            grabBtn.textContent = "Grab Daily Bonus";
        }
    });

    // ── SIMPLE TOAST NOTIFICATION SYSTEM ──
    function showToast(message) {

        let toast = document.createElement("div");

        toast.textContent = message;

        Object.assign(toast.style, {
            position: "fixed",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#111827",
            color: "#fff",
            padding: "14px 20px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            zIndex: 9999,
            opacity: "0",
            transition: "all 0.3s ease"
        });

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateX(-50%) translateY(-10px)";
        }, 50);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(-50%) translateY(10px)";
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // ── CLEANUP ──
    window.addEventListener("beforeunload", () => {
        clearInterval(timer);
    });

});
