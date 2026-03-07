// js/register.js

const BACKEND_URL = "https://repo-1red-jipate-bonus-6.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const registerBtn = document.getElementById("registerBtn");
    const msg = document.getElementById("msg");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    // Real-time password match feedback
    confirmPasswordInput.addEventListener("input", () => {
        const password = passwordInput.value;
        const confirm = confirmPasswordInput.value;

        if (confirm && password !== confirm) {
            msg.style.color = "red";
            msg.innerText = "Passwords do not match";
        } else if (confirm) {
            msg.style.color = "green";
            msg.innerText = "Passwords match!";
        } else {
            msg.innerText = "";
        }
    });

    registerBtn.addEventListener("click", async () => {
        msg.innerText = "";
        msg.style.color = "black";

        const username   = document.getElementById("username")?.value.trim();
        const phone      = document.getElementById("phone")?.value.trim();
        const pwd        = passwordInput?.value;
        const confirmPwd = confirmPasswordInput?.value;
        const referral   = document.getElementById("referral")?.value.trim() || "";

        // Client-side validation
        if (!username || !phone || !pwd || !confirmPwd) {
            msg.style.color = "red";
            msg.innerText = "Please fill in all required fields.";
            return;
        }

        if (username.includes(" ") || username.length < 3) {
            msg.style.color = "red";
            msg.innerText = "Username: ≥3 chars, no spaces.";
            return;
        }

        if (!/^(07|01)\d{8}$/.test(phone)) {
            msg.style.color = "red";
            msg.innerText = "Phone: 07XXXXXXXX or 01XXXXXXXX";
            return;
        }

        if (pwd.length < 6) {
            msg.style.color = "red";
            msg.innerText = "Password: ≥6 characters.";
            return;
        }

        if (pwd !== confirmPwd) {
            msg.style.color = "red";
            msg.innerText = "Passwords do not match.";
            return;
        }

        registerBtn.disabled = true;
        registerBtn.innerText = "Registering...";
        msg.style.color = "blue";
        msg.innerText = "Creating your account...";

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
                msg.innerText = data.message || "Registration successful! Redirecting...";
                setTimeout(() => window.location.href = "login.html", 2200);
            } else {
                msg.style.color = "red";
                let errorText = data.detail || `Error ${res.status}`;
                if (errorText.toLowerCase().includes("already exists")) {
                    errorText += " – choose another username.";
                }
                msg.innerText = errorText;
            }
        } catch (err) {
            msg.style.color = "red";
            msg.innerText = "Cannot connect to server. Check internet.";
            console.error("Registration error:", err);
        } finally {
            registerBtn.disabled = false;
            registerBtn.innerText = "Register";
        }
    });
});
