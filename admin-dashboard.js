const BACKEND_URL = "https://repo-1red-jipate-bonus-1.onrender.com";
// Optional: if you want to protect admin actions with password, keep this
const ADMIN_PASSWORD = "PHIL4857"; // Change or remove if using token

document.addEventListener("DOMContentLoaded", () => {
  // Optional: check admin login (you can remove if not needed)
  if (localStorage.getItem("adminLoggedIn") !== "true") {
    alert("Please login as admin first");
    window.location.href = "admin-login.html";
    return;
  }

  const tableBody = document.querySelector("#usersTable tbody");
  const msgDiv = document.getElementById("msg") || document.createElement("div");

  function showMessage(type, text) {
    msgDiv.className = `msg ${type}`;
    msgDiv.textContent = text;
    msgDiv.style.display = "block";
    setTimeout(() => { msgDiv.style.display = "none"; }, 6000);
  }

  async function fetchUsers() {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/users`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to load users");
      }
      const users = await res.json();

      tableBody.innerHTML = "";
      users.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${user.username}</td>
          <td>${user.phone}</td>
          <td>${user.password || "••••••••"}</td> <!-- Password column added -->
          <td>${user.approved ? "Yes" : "No"}</td>
          <td>KES ${Number(user.balance || 0).toFixed(2)}</td>
          <td>KES ${Number(user.earnings || 0).toFixed(2)}</td>
          <td>
            \( {!user.approved ? `<button class="action-btn approve-btn" onclick="approveUser(' \){user.username}')">Approve</button>` : ""}
            <button class="action-btn reset-btn" onclick="resetPassword('${user.username}')">Reset Password</button>
            <button class="action-btn terminate-btn" onclick="terminateUser('${user.username}')">Terminate</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
      showMessage("error", "Failed to load users: " + err.message);
      tableBody.innerHTML = `<tr><td colspan="7">Error loading users</td></tr>`;
    }
  }

  // Approve user
  window.approveUser = async (username) => {
    if (!confirm(`Approve user ${username}?`)) return;
    await adminAction("approve-user", username, "User approved successfully");
  };

  // Reset password (new endpoint needed in backend)
  window.resetPassword = async (username) => {
    if (!confirm(`Reset password for ${username}?`)) return;

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      // Optional: add admin_password if you want extra security
      // formData.append("admin_password", ADMIN_PASSWORD);

      const res = await fetch(`${BACKEND_URL}/admin/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        showMessage("success", `New password for \( {username}: <strong> \){data.new_password}</strong>`);
        fetchUsers(); // refresh table
      } else {
        showMessage("error", data.detail || "Failed to reset password");
      }
    } catch (err) {
      showMessage("error", "Network error: " + err.message);
    }
  };

  // Terminate (delete) user
  window.terminateUser = async (username) => {
    if (!confirm(`Terminate user ${username}? This cannot be undone!`)) return;

    await adminAction("terminate-user", username, "User terminated successfully");
  };

  // Generic admin action helper
  async function adminAction(endpoint, username, successMsg) {
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      // Optional: add admin_password if you want extra security
      // formData.append("admin_password", ADMIN_PASSWORD);

      const res = await fetch(`\( {BACKEND_URL}/admin/ \){endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        showMessage("success", successMsg);
        fetchUsers(); // refresh table
      } else {
        showMessage("error", data.detail || "Action failed");
      }
    } catch (err) {
      showMessage("error", "Network error: " + err.message);
    }
  }

  // Load users on page open
  fetchUsers();
});
