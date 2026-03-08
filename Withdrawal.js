// withdrawal.js
const BACKEND_URL = "https://repo-1red-jipate-bonus-1.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username");
    if (!username) {
        window.location.href = "login.html";
        return;
    }

    const form        = document.getElementById("withdrawalForm");
    const amountInput = document.getElementById("amount");
    const methodInput = document.getElementById("method");
    const accountInput = document.getElementById("account");
    const submitBtn   = form.querySelector('button[type="submit"]');
    const balanceDiv  = document.querySelector(".balance");
    const msgDiv      = document.getElementById("msg") || document.createElement("div");

    msgDiv.id = "msg";
    msgDiv.style.marginTop = "1rem";
    if (!document.getElementById("msg")) form.appendChild(msgDiv);

    let currentBalance = 0;

    // Fetch latest user data
    async function loadUserData() {
        try {
            const res = await fetch(`${BACKEND_URL}/dashboard?username=${encodeURIComponent(username)}`);
            if (!res.ok) throw new Error("Failed to fetch user data.");
            const data = await res.json();

            currentBalance = Number(data.balance || 0);
            balanceDiv.textContent = `KES ${currentBalance.toLocaleString()}`;
        } catch (err) {
            showError("Could not load balance. Please refresh.");
            console.error(err);
        }
    }

    loadUserData();

    // Quick amount buttons
    document.querySelectorAll(".amount-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const val = parseFloat(btn.dataset.amount || btn.textContent.replace(/[^0-9]/g, ""));
            amountInput.value = val;
            clearMessage();
        });
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearMessage();

        const amount = parseFloat(amountInput.value.trim());
        const method = methodInput.value.trim();
        const account = accountInput.value.trim();

        // Validation
        if (!amount || isNaN(amount) || amount <= 0) return showError("Enter a valid amount greater than 0.");
        if (amount < 500) return showError("Minimum withdrawal is KES 500.");
        if (amount > currentBalance) return showError("Amount exceeds current balance.");
        if (!method) return showError("Please select a withdrawal method.");
        if (!account) return showError("Enter account or phone number.");

        submitBtn.disabled = true;
        submitBtn.textContent = "Processing...";
        showInfo("Submitting withdrawal request...");

        try {
            const formData = new URLSearchParams();
            formData.append("username", username);
            formData.append("amount", amount);
            formData.append("method", method);
            formData.append("account", account);

            const res = await fetch(`${BACKEND_URL}/withdraw/request`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                showSuccess(data.message || "Withdrawal request submitted! Awaiting admin approval.");
                amountInput.value = "";
                methodInput.value = "";
                accountInput.value = "";

                // Update balance display immediately (tentative)
                currentBalance -= amount;
                balanceDiv.textContent = `KES ${currentBalance.toLocaleString()}`;
            } else {
                const errorMsg = data.detail || data.error || data.message || "Withdrawal request failed.";
                showError(errorMsg);
            }
        } catch (err) {
            console.error(err);
            showError("Network error. Check connection.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Withdraw Now";
        }
    });

    // ────────────── Helper functions ──────────────
    function showMessage(text, type = "info") {
        msgDiv.textContent = text;
        msgDiv.className = `msg msg-${type}`;
        setTimeout(clearMessage, 10000);
    }
    function showSuccess(text) { showMessage(text, "success"); }
    function showError(text) { showMessage(text, "error"); amountInput.focus(); }
    function showInfo(text) { showMessage(text, "info"); }
    function clearMessage() { msgDiv.textContent = ""; msgDiv.className = ""; }
});
