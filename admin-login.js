const BACKEND_URL = "https://repo-1red-jipate-bonus.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("adminLoginBtn");
  const msg = document.getElementById("adminMsg");

  btn.addEventListener("click", async () => {
    msg.innerText = "";
    const password = document.getElementById("adminPassword").value.trim();
    if (!password) {
      msg.style.color = "red";
      msg.innerText = "Enter admin password.";
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("password", password);

      const res = await fetch(`${BACKEND_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        msg.style.color = "green";
        msg.innerText = "Login successful. Redirecting...";
        localStorage.setItem("adminLoggedIn", "true");
        setTimeout(() => { window.location.href = "admin-dashboard.html"; }, 1000);
      } else {
        msg.style.color = "red";
        msg.innerText = data.detail || "Login failed";
      }
    } catch (err) {
      msg.style.color = "red";
      msg.innerText = "Server error. Try again later.";
      console.error(err);
    }
  });
});
