// admin-dashboard.js (extended with withdrawals)
const BACKEND_URL = "https://repo-1red-jipate-bonus-1.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

  if (localStorage.getItem("adminLoggedIn") !== "true") {
    alert("Please login as admin first");
    window.location.href = "admin-login.html";
    return;
  }

  const tableBody = document.getElementById("usersTableBody");
  const withdrawalBody = document.getElementById("withdrawalTableBody");
  const msg = document.getElementById("msg");

  function showMessage(type, text) {
    if (msg) {
      msg.className = `msg ${type}`;
      msg.textContent = text;
      msg.style.display = "block";
      setTimeout(() => (msg.style.display = "none"), 8000);
    }
    console.log(`[${type}] ${text}`);
  }

  // ------------------ USERS ------------------
  async function fetchUsers() {

    if (!tableBody) return showMessage("error", "Table body missing");

    tableBody.innerHTML = '<tr><td colspan="7">Loading users...</td></tr>';
    showMessage("loading", "Loading users...");

    try {

      const res = await fetch(`${BACKEND_URL}/admin/users`);

      if (!res.ok) throw new Error((await res.json()).detail || `HTTP ${res.status}`);

      const users = await res.json();

      tableBody.innerHTML = "";

      if (!users.length) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#777;">No users found</td></tr>';
        showMessage("success", "No users found");
        return;
      }

      users.forEach((user) => {

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

      console.error("Fetch users error:", err);
      tableBody.innerHTML = '<tr><td colspan="7" style="color:red;">Failed to load users</td></tr>';
      showMessage("error", "Failed to load users: " + err.message);

    }

  }

  // ------------------ WITHDRAWALS ------------------

  async function fetchWithdrawals() {

    if (!withdrawalBody) return;

    withdrawalBody.innerHTML = '<tr><td colspan="3">Loading withdrawals...</td></tr>';

    try {

      const res = await fetch(`${BACKEND_URL}/admin/pending-withdrawals`);

      if (!res.ok) throw new Error((await res.json()).detail || `HTTP ${res.status}`);

      const withdrawals = await res.json();

      withdrawalBody.innerHTML = "";

      if (!withdrawals.length) {
        withdrawalBody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#777;">No pending withdrawals</td></tr>';
        return;
      }

      withdrawals.forEach(w => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${w.username}</td>
          <td>KES ${Number(w.amount).toFixed(2)}</td>
          <td>
            <button class="action-btn approve-btn" onclick="approveWithdrawal(${w.id})">Approve</button>
          </td>
        `;

        withdrawalBody.appendChild(tr);

      });

    } catch (err) {

      console.error("Fetch withdrawals error:", err);
      withdrawalBody.innerHTML = '<tr><td colspan="3" style="color:red;">Failed to load withdrawals</td></tr>';

    }

  }

  window.approveWithdrawal = async (id) => {

    if (!confirm(`Approve this withdrawal request?`)) return;

    try {

      const res = await fetch(`${BACKEND_URL}/admin/approve-withdrawal`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ request_id: id })
      });

      const data = await res.json();

      if (res.ok) {
        showMessage("success", data.message);
        fetchUsers();
        fetchWithdrawals();
      } else {
        showMessage("error", data.detail || "Failed to approve withdrawal");
      }

    } catch (err) {

      console.error(err);
      showMessage("error", "Network error");

    }

  };

  // ------------------ OTHER ADMIN ACTIONS ------------------

  window.approveUser = async (username) =>
    adminAction("approve-user", username, `${username} approved`);

  window.resetPassword = async (username) =>
    adminAction("reset-password", username, `Password reset for ${username}`);

  window.terminateUser = async (username) =>
    adminAction("terminate-user", username, `${username} terminated`);

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

  // Load everything
  fetchUsers();
  fetchWithdrawals();

});
