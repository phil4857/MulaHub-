<script>
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

  usernameInput.focus();

  // Autofill referral from ?ref=
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (ref) referralInput.value = ref;

  function showMessage(kind, text) {
    msg.className = "msg " + (kind || "");
    msg.textContent = text || "";
  }

  function validatePhone(phone) {
    // Accepts 07xxxxxxxx or 01xxxxxxxx
    return /^(07|01)\d{8}$/.test(phone);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showMessage("", "");

    const username = usernameInput.value.trim().toLowerCase();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const referral = referralInput.value.trim().toLowerCase();

    if (!username || !phone || !password || !confirmPassword) {
      showMessage("error", "Fill all required fields.");
      return;
    }

    if (username.length < 3) {
      showMessage("error", "Username must be at least 3 characters.");
      return;
    }

    if (!validatePhone(phone)) {
      showMessage("error", "Phone must be 07xxxxxxxx or 01xxxxxxxx.");
      return;
    }

    if (password.length < 6) {
      showMessage("error", "Password should be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("error", "Passwords do not match.");
      return;
    }

    registerBtn.disabled = true;
    registerBtn.textContent = "Registering...";
    showMessage("loading", "Creating account...");

    try {
      const payload = { username, phone, password };
      if (referral) payload.referral = referral;

      const res = await fetch(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let data;
      try { data = await res.json(); } 
      catch { data = { message: await res.text() }; }

      if (res.ok) {
        showMessage("success", data.message || "Registration successful. Redirecting to login...");
        localStorage.setItem("just_registered_username", username);
        setTimeout(() => { window.location.href = "login.html"; }, 1400);
      } else {
        // Flatten errors if returned as array
        let errMsg = data.detail || data.message || "Registration failed.";
        if (Array.isArray(data)) {
          errMsg = data.map(e => e.msg || JSON.stringify(e)).join(" • ");
        }
        showMessage("error", errMsg);
      }
    } catch (err) {
      console.error("Register error:", err);
      showMessage("error", "Cannot connect to server. Please try again.");
    } finally {
      registerBtn.disabled = false;
      registerBtn.textContent = "Register";
    }
  });
});
</script>
