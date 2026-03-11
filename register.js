const BACKEND_URL = "https://repo-1red-jipate-bonus-1.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const registerBtn = document.getElementById("registerBtn");
    const msg = document.getElementById("msg");
    const usernameInput = document.getElementById("username");
    const phoneInput = document.getElementById("phone");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const referralInput = document.getElementById("referral");

    const params = new URLSearchParams(window.location.search);
    if (params.has("ref")) referralInput.value = params.get("ref");

    const checkPasswordMatch = () => {
        const pwd = passwordInput.value;
        const confirm = confirmPasswordInput.value;

        if (!confirm) {
            msg.textContent = "";
            registerBtn.disabled = false;
            return;
        }

        if (pwd !== confirm) {
            msg.className = "msg error";
            msg.textContent = "Passwords do not match";
            registerBtn.disabled = true;
        } else {
            msg.className = "msg success";
            msg.textContent = "Passwords match ✓";
            registerBtn.disabled = false;
        }
    };

    passwordInput.addEventListener("input", checkPasswordMatch);
    confirmPasswordInput.addEventListener("input", checkPasswordMatch);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim().toLowerCase();
        const phone = phoneInput.value.trim();
        const pwd = passwordInput.value;
        const confirmPwd = confirmPasswordInput.value;
        const referral = referralInput.value.trim().toLowerCase() || "";

        if (!username || !phone || !pwd || !confirmPwd) {
            msg.className = "msg error";
            msg.textContent = "Please fill in all required fields.";
            return;
        }

        if (username.includes(" ") || username.length < 3) {
            msg.className = "msg error";
            msg.textContent = "Username: 3+ characters, no spaces.";
            return;
        }

        if (!/^(07|01)\d{8}$/.test(phone)) {
            msg.className = "msg error";
            msg.textContent = "Phone must start with 07 or 01 and have 10 digits.";
            return;
        }

        if (pwd.length < 6) {
            msg.className = "msg error";
            msg.textContent = "Password must be at least 6 characters.";
            return;
        }

        if (pwd !== confirmPwd) {
            msg.className = "msg error";
            msg.textContent = "Passwords do not match.";
            return;
        }

        registerBtn.disabled = true;
        registerBtn.textContent = "Registering...";
        msg.className = "msg loading";
        msg.textContent = "Creating your account...";

        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("phone", phone);
        formData.append("password", pwd);
        if (referral) formData.append("referral", referral);

        try {

            const res = await fetch(`${BACKEND_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                msg.className = "msg success";
                msg.textContent = data.message || "Registration successful! Redirecting...";
                setTimeout(() => window.location.href = "login.html", 2200);
            } else {
                msg.className = "msg error";
                let errText = data.detail || `Error ${res.status}`;

                if (errText.toLowerCase().includes("already exists")) {
                    errText += " – choose a different username.";
                }

                msg.textContent = errText;
            }

        } catch (err) {
            console.error("Registration error:", err);
            msg.className = "msg error";
            msg.textContent = "Cannot connect to server. Check your connection.";
        }

        finally {
            registerBtn.disabled = false;
            registerBtn.textContent = "Register";
        }

    });

});
