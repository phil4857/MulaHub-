const BACKEND_URL = "https://repo-1red-jipate-bonus-1.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username");
    if (!username) {
        window.location.href = "login.html";
        return;
    }

    // Monday only check (client-side early warning)
    const today = new Date();
    if (today.getDay() !== 1) {
        alert("Withdrawals are only allowed on Mondays.");
        window.location.href = "dashboard.html";
        return;
    }

    const withdrawForm = document.getElementById("withdrawForm");
    const otpSection = document.getElementById("otpSection"); // can keep if you want to add OTP later, but hidden for now
    const amountInput = document.getElementById("amount");
    const msg = document.getElementById("msg") || document.createElement("div"); // fallback

    // Hide OTP section permanently (no OTP in current backend)
    if (otpSection) otpSection.style.display = "none";

    withdrawForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const amount = parseFloat(amountInput.value);

        if (!amount || amount <= 0) {
            alert("Enter a valid amount greater than 0.");
            return;
        }

        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("amount", amount);

        try {
            const response = await fetch(`${BACKEND_URL}/withdraw/request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || "Withdrawal request submitted successfully! Pending admin approval.");
                // Optional: clear input
                amountInput.value = "";
                // Redirect back to dashboard or refresh balance
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 2000);
            } else {
                alert(data.detail || "Withdrawal request failed. Please try again.");
            }
        } catch (err) {
            console.error("Withdrawal request error:", err);
            alert("Network error. Please check your connection and try again.");
        }
    });
});
