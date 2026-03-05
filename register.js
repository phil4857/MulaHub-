const BACKEND_URL = "https://repo-1red-jipate-bonus-1.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const registerBtn = document.getElementById("registerBtn");
    const msg = document.getElementById("msg");

    // Real-time password match validation
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    confirmPassword.addEventListener("input", () => {
        if (confirmPassword.value && password.value !== confirmPassword.value) {
            msg.style.color = "red";
            msg.innerText = "Passwords do not match";
        } else if (confirmPassword.value) {
            msg.style.color = "green";
            msg.innerText = "Passwords match!";
        } else {
            msg.innerText = "";
        }
    });

    registerBtn.addEventListener("click", async () => {
        // Reset message
        msg.innerText = "";
        msg.style.color = "black";

        // Get form values
        const username   = document.getElementById("username")?.value.trim();
        const phone      = document.getElementById("phone")?.value.trim();
        const pwd        = password?.value;
        const confirmPwd = confirmPassword?.value;
        const referral   = document.getElementById("referral")?.value.trim() || "";

        // ── Client-side validation ────────────────────────────────────────
        if (!username || !phone || !pwd || !confirmPwd) {
            msg.style.color = "red";
            msg.innerText = "Please fill in all required fields.";
            return;
        }

        if (username.includes(" ") || username.length < 3) {
            msg.style.color = "red";
            msg.innerText = "Username must be at least 3 characters and contain no spaces.";
            return;
        }

        if (!/^(07|01)\d{8}$/.test(phone)) {
            msg.style.color = "red";
            msg.innerText = "Phone must start with 07 or 01 and be exactly 10 digits.";
            return;
        }

        if (pwd.length < 6) {
            msg.style.color = "red";
            msg.innerText = "Password must be at least 6 characters long.";
            return;
        }

        if (pwd !== confirmPwd) {
            msg.style.color = "red";
            msg.innerText = "Passwords do not match.";
            return;
        }

        // Disable button & show loading
        registerBtn.disabled = true;
        registerBtn.innerText = "Registering...";
        msg.style.color = "blue";
        msg.innerText = "Creating your account...";

        // Prepare form data (no email)
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("phone", phone);
        formData.append("password", pwd);
        if (referral) formData.append("referral", referral);

        try {
            const res = await fetch(`${BACKEND_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                msg.style.color = "green";
                msg.innerText = data.message || "Registration successful! Redirecting to login...";

                // Auto-redirect after 2.5 seconds
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2500);
            } else {
                msg.style.color = "red";
                msg.innerText = data.detail || `Registration failed (error ${res.status})`;
            }
        } catch (err) {
            msg.style.color = "red";
            msg.innerText = "Could not connect to the server. Please try again later.";
            console.error("Registration error:", err);
        } finally {
            registerBtn.disabled = false;
            registerBtn.innerText = "Register";
        }
    });
});
