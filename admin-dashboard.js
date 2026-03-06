<script>
const BACKEND_URL = "https://repo-1red-jipate-bonus-1.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  // Check if admin is logged in (from localStorage set during login)
  if (localStorage.getItem("adminLoggedIn") !== "true") {
    alert("Please login as admin first");
    window.location.href = "admin-login.html";
    return;
  }

  const tableBody = document.querySelector("#usersTable tbody") || document.getElementById("usersTableBody");
  const msg = document.getElementById("msg");

  function showMessage(type, text) {
    if (msg) {
      msg.className = `msg ${type}`;
      msg.textContent = text;
      msg.style.display = "block";
      setTimeout(() => msg.style.display = "none", 8000);
    }
    console.log(`[${type.toUpperCase()}] ${text}`); // for debugging
  }

  async function fetchUsers() {
    if (!tableBody) {
      showMessage("error", "Table body not found in HTML");
      return;
    }

    tableBody.innerHTML = '<tr><td colspan="7">Loading users...</td></tr>';
    showMessage("", "Loading users...");

    try {
      const res = await fetch(`${BACKEND_URL}/admin/users`);
      console.log("Admin users request status:", res.status);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server returned ${res.status}`);
      }

      const users = await res.json();
      console.log("Users data received:", users); // ← check this in console!

      tableBody.innerHTML = "";

      if (!users || users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#777;">No users registered yet</td></tr>';
        showMessage("success", "No users found in database");
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
            \( {!user.approved ? `<button class="action-btn approve-btn" onclick="approveUser(' \){user.username}')">Approve</button>` : '<span style="color:green;">Approved</span>'}
            <button class="action-btn reset-btn" onclick="resetPassword('${user.username}')">Reset Password</button>
            <button class="action-btn terminate-btn" onclick="terminateUser('${user.username}')">Terminate</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });

      showMessage("success", `Loaded ${users.length} user(s)`);
    } catch (err) {
      console.error("Fetch users error:", err);
      tableBody.innerHTML = '<tr><td colspan="7" style="color:red;">Failed to load users</td></tr>';
      showMessage("error", "Failed to load users: " + err.message);
    }
  }

  window.approveUser = async (username) => {
    if (!confirm(`Approve ${username}?`)) return;
    await adminAction("approve-user", username, `${username} approved successfully`);
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
        showMessage("success", `New password for \( {username}: <strong> \){data.new_password}</strong>`);
        fetchUsers();
      } else {
        showMessage("error", data.detail || "Failed to reset password");
      }
    } catch (err) {
      showMessage("error", "Network error: " + err.message);
    }
  };

  window.terminateUser = async (username) => {
    if (!confirm(`Terminate ${username}? This is permanent!`)) return;
    await adminAction("terminate-user", username, `${username} terminated`);
  };

  async function adminAction(endpoint, username, successMsg) {
    try {
      const res = await fetch(`\( {BACKEND_URL}/admin/ \){endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username })
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

  // Start loading users
  fetchUsers();
});
</script>
