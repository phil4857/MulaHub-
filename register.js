// js/register.js

const BACKEND_URL = "https://repo-1red-jipate-bonus-6.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const registerBtn = document.getElementById("registerBtn");
    const msg = document.getElementById("msg");
    const usernameInput = document.getElementById("username");
    const phoneInput = document.getElementById("phone");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const referralInput = document.getElementById("referral");

    // Real-time password match feedback + disable button if mismatch
    const updatePasswordMatch = () => {
        const password = passwordInput.value;
        const confirm = confirmPasswordInput.value;

        if (confirm) {
            if (password !== confirm) {
                msg.style.color = "red";
                msg.innerText = "Passwords do not match";
                registerBtn.disabled = true;
            } else {
                msg.style.color = "green";
                msg.innerText = "Passwords match!";
                registerBtn.disabled = false;
            }
        } else {
            msg.innerText = "";
            registerBtn.disabled = false;
        }
    };

    confirmPasswordInput.addEventListener("input", updatePasswordMatch);
    passwordInput.addEventListener("input", updatePasswordMatch);

    registerBtn.addEventListener("click", async () => {
        msg.innerText = "";
        msg.style.color = "black";

        // Get and normalize values
        let username = usernameInput?.value.trim()?.toLowerCase() || "";
        const phone = phoneInput?.value.trim() || "";
        const pwd = passwordInput?.value;
        const confirmPwd = confirmPasswordInput?.value;
        let referral = referralInput?.value.trim()?.toLowerCase() || "";

        // Client-side validation
        if (!username || !phone || !pwd || !confirmPwd) {
            msg.style.color = "red";
            msg.innerText = "Please fill in all required fields.";
            return;
        }

        if (username.includes(" ") || username.length < 3) {
            msg.style.color = "red";
            msg.innerText = "Username: at least 3 characters, no spaces.";
            return;
        }

        if (!/^(07|01)\d{8}$/.test(phone)) {
            msg.style.color = "red";
            msg.innerText = "Phone must start with 07 or 01 followed by 8 digits.";
            return;
        }

        if (pwd.length < 6) {
            msg.style.color = "red";
            msg.innerText = "Password must be at least 6 characters.";
            return;
        }

        if (pwd !== confirmPwd) {
            msg.style.color = "red";
            msg.innerText = "Passwords do not match.";
            return;
        }

        // Disable button and show loading state
        registerBtn.disabled = true;
        registerBtn.innerText = "Registering...";
        msg.style.color = "blue";
        msg.innerText = "Creating your account... Please wait.";

        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("phone", phone);
        formData.append("password", pwd);
        if (referral) formData.append("referral", referral);

        try {
            const res = await fetch(`${BACKEND_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            });

            let data;
            try {
                data = await res.json();
            } catch {
                // If response is not JSON (rare network/server issue)
                throw new Error("Invalid response from server");
            }

            if (res.ok) {
                msg.style.color = "green";
                msg.innerText = data.message || "Registration successful! Redirecting to login...";
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2200);
            } else {
                msg.style.color = "red";
                let errorText = data.detail || `Server error (${res.status})`;
                if (errorText.toLowerCase().includes("already exists")) {
                    errorText += " – please choose a different username.";
                }
                msg.innerText = errorText;
            }
        } catch (err) {
            console.error("Registration fetch error:", err.name, err.message, err.stack);

            msg.style.color = "red";
            let displayMsg = "Cannot connect to server.";

            if (err.name === "TypeError" && err.message.includes("fetch")) {
                displayMsg += " (Failed to reach server – check your internet, try Wi-Fi, or disable ad-blockers/extensions)";
            } else if (err.message?.includes("CORS")) {
                displayMsg += " (Network or browser security restriction – try incognito mode)";
            } else if (err.message?.includes("timeout")) {
                displayMsg += " (Request timed out – server may be slow or your connection is unstable)";
            } else {
                displayMsg += ` (${err.message || "Unknown error"})`;
            }

            msg.innerText = displayMsg + " Open F12 → Console for more details.";
        } finally {
            registerBtn.disabled = false;
            registerBtn.innerText = "Register";
        }
    });
});
