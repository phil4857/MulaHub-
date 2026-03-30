const BACKEND_URL = "https://repo-1red-jipate-bonus-1-kwee.onrender.com";
const ADMIN_PASSWORD = "PHIL4857";

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("adminLoggedIn") !== "true") {
    alert("Please login as admin first");
    window.location.href = "admin-login.html";
    return;
  }

  const usersTableBody = document.getElementById("usersTableBody");
  const msg = document.getElementById("msg");

  function showMessage(type, text) {
    msg.className = `msg ${type}`;
    msg.textContent = text;
    msg.style.display = "block";
    setTimeout(() => { msg.style.display = "none"; }, 8000);
  }

  // Reusable function for all admin actions
  async function adminAction(endpoint, extraData = {}, successMsg, callback) {
    try {
      const res = await fetch(`\( {BACKEND_URL}/admin/ \){endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...extraData, 
          password: ADMIN_PASSWORD 
        })
      });

      let result;
      try {
        result = await res.json();
      } catch (e) {
        result = { detail: "Unknown server error" };
      }

      if (res.ok) {
        showMessage("success", successMsg || result.message || "Action successful");
        if (callback) callback();
      } else {
        showMessage("error", result.detail || result.message || `Error ${res.status}`);
        console.error("Server error:", result);
      }
    } catch (err) {
      console.error("Network error:", err);
      showMessage("error", "Network error - check your internet or server");
    }
  }

  async function fetchUsers() {
    usersTableBody.innerHTML = '<tr><td colspan="6">Loading users...</td></tr>';

    try {
      const res = await fetch(`${BACKEND_URL}/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: ADMIN_PASSWORD })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`HTTP ${res.status}: ${errorData.detail || "Unknown error"}`);
      }

      const users = await res.json();
      console.log("✅ Users received:", users);

      usersTableBody.innerHTML = "";

      if (!users || users.length === 0) {
        usersTableBody.innerHTML = '<tr><td colspan="6" style="color:#777;">No users registered yet</td></tr>';
        return;
      }

      users.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${user.username || "N/A"}</td>
          <td>${user.phone || "N/A"}</td>
          <td>${user.approved ? '<span style="color:green;">✓ Yes</span>' : '<span style="color:red;">✗ No</span>'}</td>
          <td>KES ${Number(user.balance || 0).toFixed(2)}</td>
          <td>KES ${Number(user.earnings || 0).toFixed(2)}</td>
          <td>
            ${!user.approved ? 
              `<button class="action-btn approve-btn" onclick="approveUser('${user.username}')">Approve</button>` : 
              '<span style="color:green;">Approved</span>'}
            <button class="action-btn reset-btn" onclick="resetPassword('${user.username}')">Reset Password</button>
            <button class="action-btn terminate-btn" onclick="terminateUser('${user.username}')">Terminate</button>
          </td>
        `;
        usersTableBody.appendChild(tr);
      });
    } catch (err) {
      console.error("❌ Fetch users failed:", err);
      usersTableBody.innerHTML = '<tr><td colspan="6" style="color:red;">Failed to load users</td></tr>';
      showMessage("error", "Failed to load users. Check F12 Console for details.");
    }
  }

  // Action functions
  window.approveUser = (username) => {
    if (!confirm(`Approve user ${username}?`)) return;
    adminAction("approve-user", { username }, `${username} has been approved`, fetchUsers);
  };

  window.resetPassword = (username) => {
    if (!confirm(`Reset password for ${username}?`)) return;
    adminAction("reset-password", { username }, `Password reset for ${username}`, fetchUsers);
  };

  window.terminateUser = (username) => {
    if (!confirm(`Terminate ${username} permanently?`)) return;
    adminAction("terminate-user", { username }, `${username} has been terminated`, fetchUsers);
  };

  // Load users when page opens
  fetchUsers();
});
