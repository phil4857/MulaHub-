const BACKEND_URL = "https://repo-1red-jipate-bonus-1.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const registerBtn = document.getElementById("registerBtn");
    const msg = document.getElementById("msg");

    // Optional: log the URL once on load so you can confirm what's being used
    console.log("Backend URL loaded:", BACKEND_URL);

    registerBtn.addEventListener("click", async () => {
        msg.innerText = "";
        msg.style.color = "black"; // reset color

        const username = document.getElementById("username").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const referral = document.getElementById("referral").value.trim();

        // Client-side validation
        if (!username || !phone || !password || !confirmPassword) {
            msg.style.color = "red";
            msg.innerText = "Please fill in all required fields.";
            return;
        }

        if (!/^07\d{8}$/.test(phone)) {
            msg.style.color = "red";
            msg.innerText = "Phone must be in 07XXXXXXXX format (exactly 10 digits).";
            return;
        }

        if (password.length < 6) {
            msg.style.color = "red";
            msg.innerText = "Password must be at least 6 characters long.";
            return;
        }

        if (password !== confirmPassword) {
            msg.style.color = "red";
            msg.innerText = "Passwords do not match.";
            return;
        }

        // Prepare form data (matches FastAPI Form fields)
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("phone", phone);
        formData.append("password", password);
        if (referral) {
            formData.append("referral", referral);
        }

        try {
            const res = await fetch(`${BACKEND_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData
            });

            let data;
            try {
                data = await res.json();
            } catch {
                data = { detail: "Invalid response from server" };
            }

            if (res.ok) {
                msg.style.color = "green";
                msg.innerText = data.message || "Registration successful! Awaiting admin approval.";
                // Optional: redirect to login after a short delay
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2500);
            } else {
                msg.style.color = "red";
                msg.innerText = data.detail || `Error ${res.status}: Registration failed`;
            }

        } catch (err) {
            msg.style.color = "red";
            msg.innerText = "Could not connect to the server. Please try again later.";
            console.error("Registration fetch error:", err);
        }
    });
});
