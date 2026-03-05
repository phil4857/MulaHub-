// withdrawal.js
const BACKEND_URL = "https://repo-1red-jipate-bonus-1.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username");
    if (!username) {
        window.location.href = "login.html";
        return;
    }

    // Client-side Monday-only restriction
    const today = new Date();
    if (today.getDay() !== 1) {  // 1 = Monday
        alert("Withdrawals are only allowed on Mondays.");
        window.location.href = "dashboard.html";
        return;
    }

    // DOM elements
    const form          = document.getElementById("withdrawForm");
    const amountInput   = document.getElementById("amount");
    const submitBtn     = form.querySelector('button[type="submit"]');
    const msgDiv        = document.getElementById("msg") || document.createElement("div");
    msgDiv.id = "msg";
    msgDiv.style.marginTop = "1rem";
    form.appendChild(msgDiv); // append if not already in HTML

    // Optional: you can fetch current balance here if your backend supports it
    // For now we assume balance is shown in HTML and validated on backend

    // Quick amount buttons (if you have them in HTML)
    document.querySelectorAll(".amount-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            amountInput.value = btn.dataset.amount || btn.textContent.replace(/[^0-9]/g, "");
            amountInput.focus();
            clearMessage();
        });
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearMessage();

        const amount = parseFloat(amountInput.value.trim());

        // Basic client-side validation
        if (!amount || isNaN(amount) || amount <= 0) {
            showError("Please enter a valid amount greater than 0.");
            return;
        }

        if (amount < 500) {
            showError("Minimum withdrawal amount is KES 500.");
            return;
        }

        if (amount > 100000) { // example upper limit — adjust as needed
            showError("Maximum withdrawal per request is KES 100,000.");
            return;
        }

        // Disable button & show loading
        submitBtn.disabled = true;
        submitBtn.textContent = "Processing...";
        showInfo("Processing your withdrawal request...");

        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("amount", amount);

        try {
            const response = await fetch(`${BACKEND_URL}/withdraw/request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess(data.message || "Withdrawal request submitted successfully! Awaiting admin approval.");
                amountInput.value = ""; // clear field

                // Redirect after short delay so user sees success message
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 2200);
            } else {
                // Handle different kinds of backend errors
                const errorMsg = data.detail || data.error || data.message || "Withdrawal request failed.";
                showError(errorMsg);
            }
        } catch (err) {
            console.error("Withdrawal error:", err);
            showError("Network error. Please check your internet connection and try again.");
        } finally {
            // Always re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = "Withdraw Now";
        }
    });

    // ────────────────────────────────────────────────
    // Helper functions for better UX
    // ────────────────────────────────────────────────

    function showMessage(text, type = "info") {
        msgDiv.textContent = text;
        msgDiv.className = ""; // reset
        msgDiv.classList.add(`msg-${type}`);
        
        // Optional: auto-clear after 8 seconds
        setTimeout(clearMessage, 8000);
    }

    function showSuccess(text) {
        showMessage(text, "success");
    }

    function showError(text) {
        showMessage(text, "error");
        amountInput.focus();
    }

    function showInfo(text) {
        showMessage(text, "info");
    }

    function clearMessage() {
        msgDiv.textContent = "";
        msgDiv.className = "";
    }
});
