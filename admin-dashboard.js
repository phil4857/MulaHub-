// admin-dashboard.js
const BACKEND_URL = "https://repo-1red-jipate-bonus-1.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  // Require admin login
  if (localStorage.getItem("adminLoggedIn") !== "true") {
    alert("Please login as admin first");
    window.location.href = "admin-login.html";
    return;
  }

  const tableBody = document.getElementById("usersTableBody");
  const msg = document.getElementById("msg");

  function showMessage(type, text) {
    if (msg) {
      msg.className = `msg ${type}`;
      msg.textContent = text;
      msg.style.display = "block";
      setTimeout(() => msg.style.display = "none", 8000);
    }
    console.log(`[${type}] ${text}`);
  }

  async function fetchUsers() {
    if (!tableBody) {
      showMessage("error", "Table body element missing in HTML");
      return;
    }

    tableBody.innerHTML = '<tr><td colspan="7">Loading users...</td></tr>';
    showMessage("loading", "Loading users...");

    try {
      const res = await fetch(`${BACKEND_URL}/admin/users`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `HTTP ${res.status}`);
      }

      const users = await res.json();
      tableBody.innerHTML = "";

      if (!users.length) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#777;">No users registered yet</td></tr>';
        showMessage("success", "No users found");
        return;
      }

      users.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${user.username}</td>
          <td>${user.phone || "N/A"}</td>
          <td>${user.approved ? '<span style="color:green;">Yes</span>' : '<span style="color:red;">No</span>'}</td>
          <td>KES ${Number(user.balance || 0).toFixed(2)}</td>
          <td>KES ${Number(user.earnings || 0).toFixed(2)}</td>
          <td>${user.referral || "-"}</td>
          <td>
            ${!user.approved ? `<button class="action-btn approve-btn" onclick="approveUser('${user.username}')">Approve</button>` : '<span style="color:green;">Approved</span>'}
            <button class="action-btn reset-btn" onclick="resetPassword('${user.username}')">Reset Password</button>
            <button class="action-btn terminate-btn" onclick="terminateUser('${user.username}')">Terminate</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });

      showMessage("success", `Loaded ${users.length} users`);
    } catch (err) {
      console.error("Fetch error:", err);
      tableBody.innerHTML = '<tr><td colspan="7" style="color:red;">Failed to load users</td></tr>';
      showMessage("error", "Failed to load users: " + err.message);
    }
  }

  window.approveUser = async (username) => {
    if (!confirm(`Approve ${username}?`)) return;
    await adminAction("approve-user", username, `${username} approved`);
  };

  window.resetPassword = async (username) => {
    if (!confirm(`Reset password for ${username}?`)) return;
    try {
      const res = await fetch(`${BACKEND_URL}/admin/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username })
      });
      const data = await res.json();
      if (res.ok) {
        showMessage("success", `New password for ${username}: ${data.new_password}`);
        fetchUsers();
      } else {
        showMessage("error", data.detail || "Reset failed");
      }
    } catch (err) {
      showMessage("error", "Network error");
    }
  };

  window.terminateUser = async (username) => {
    if (!confirm(`Terminate ${username}? Permanent!`)) return;
    await adminAction("terminate-user", username, `${username} terminated`);
  };

  async function adminAction(endpoint, username, successMsg) {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username })
      });
      const data = await res.json();
      if (res.ok) {
        showMessage("success", successMsg);
        fetchUsers();
      } else {
        showMessage("error", data.detail || "Action failed");
      }
    } catch (err) {
      console.error("Admin action error:", err);
      showMessage("error", "Network error");
    }
  }

  // Load users on page load
  fetchUsers();
});
