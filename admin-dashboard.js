const BACKEND_URL = "https://repo-1red-jipate-bonus-1-kwee.onrender.com";
const ADMIN_PASSWORD = "PHIL4857";

function showMessage(type, text) {
  const msg = document.getElementById("message");
  if (msg) {
    msg.className = `message ${type}`;
    msg.textContent = text;
  }
  console.log(`[${type.toUpperCase()}] ${text}`);
}

function switchTab(tabIndex) {
  document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', i === tabIndex));
  document.querySelectorAll('.tab-content').forEach((c, i) => c.classList.toggle('active', i === tabIndex));
}

// ==================== USERS ====================
async function fetchUsers() {
  const tbody = document.querySelector("#usersTable tbody");
  if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Loading users...</td></tr>`;

  try {
    const res = await fetch(`${BACKEND_URL}/admin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: ADMIN_PASSWORD })
    });

    let data = [];
    try { data = await res.json(); } catch(e) {}

    if (res.ok) {
      const users = Array.isArray(data) ? data : (data.users || []);
      populateUsersTable(users);
    } else {
      showMessage("error", data.detail || "Failed to load users");
    }
  } catch (err) {
    console.error(err);
    showMessage("error", "Cannot connect to server");
  }
}

function populateUsersTable(users) {
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";

  if (!users || users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;">No registered users yet</td></tr>`;
    return;
  }

  users.forEach(user => {
    const approvedText = user.approved ? '✅ Approved' : '⏳ Pending';
    const statusColor = user.approved ? 'green' : 'orange';

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.username || 'N/A'}</td>
      <td>${user.phone || 'N/A'}</td>
      <td style="color: \( {statusColor};"> \){approvedText}</td>
      <td>KES ${Number(user.balance || 0).toFixed(2)}</td>
      <td>KES ${Number(user.earnings || 0).toFixed(2)}</td>
      <td>
        <button class="action" onclick="approveUser('${user.username}')" ${user.approved ? 'disabled' : ''}>Approve</button>
        <button class="action" onclick="resetPassword('${user.username}')">Reset PW</button>
        <button class="action" onclick="terminateUser('${user.username}')" style="background:#dc3545;color:white;">Terminate</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// ==================== WITHDRAWALS ====================
async function fetchWithdrawals() {
  const tbody = document.querySelector("#withdrawalsTable tbody");
  if (tbody) tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Loading withdrawals...</td></tr>`;

  try {
    const res = await fetch(`${BACKEND_URL}/admin/withdrawals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: ADMIN_PASSWORD })
    });

    let data = [];
    try { data = await res.json(); } catch(e) {}

    if (res.ok) {
      const withdrawals = Array.isArray(data) ? data : (data.withdrawals || []);
      populateWithdrawalsTable(withdrawals);
    } else {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No pending withdrawals</td></tr>`;
    }
  } catch (err) {
    console.error(err);
    showMessage("error", "Cannot load withdrawals");
  }
}

function populateWithdrawalsTable(withdrawals) {
  const tbody = document.querySelector("#withdrawalsTable tbody");
  tbody.innerHTML = "";

  if (!withdrawals || withdrawals.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:40px;">No pending withdrawal requests</td></tr>`;
    return;
  }

  withdrawals.forEach(w => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${w.username || 'N/A'}</td>
      <td>KES ${Number(w.amount || 0).toFixed(2)}</td>
      <td>${w.requested_at || 'N/A'}</td>
      <td>${w.status || 'pending'}</td>
      <td>
        <button class="action" onclick="approveWithdrawal(${w.id})" style="background:#28a745;color:white;">Approve</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function approveWithdrawal(id) {
  if (!confirm("Approve this withdrawal request?")) return;

  try {
    const res = await fetch(`${BACKEND_URL}/admin/withdraw_approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        password: ADMIN_PASSWORD,
        withdrawal_id: id 
      })
    });

    const result = await res.json().catch(() => ({}));
    if (res.ok) {
      showMessage("success", result.message || "Withdrawal approved successfully");
      fetchWithdrawals();
    } else {
      showMessage("error", result.detail || "Failed to approve withdrawal");
    }
  } catch (e) {
    showMessage("error", "Network error");
  }
}

// ==================== FIXED USER ACTIONS ====================
async function adminAction(endpoint, username) {
  if (!confirm(`Confirm ${endpoint.replace(/-/g, ' ')} for user ${username}?`)) return;

  try {
    const res = await fetch(`\( {BACKEND_URL}/admin/ \){endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        password: ADMIN_PASSWORD, 
        username: username 
      })
    });

    let result = {};
    try {
      result = await res.json();
    } catch (e) {
      result = { detail: "Invalid response from server" };
    }

    if (res.ok) {
      showMessage("success", result.message || "Action completed successfully!");
      fetchUsers();                    // Refresh users table
    } else {
      const errorMsg = result.detail || result.message || `Server error (${res.status})`;
      showMessage("error", errorMsg);
      console.error(`[${endpoint}] Failed:`, result);
    }
  } catch (err) {
    console.error("Network / Fetch error:", err);
    showMessage("error", "Cannot connect to backend. Check Render logs and ensure backend is running.");
  }
}

function approveUser(u) { adminAction("approve-user", u); }
function resetPassword(u) { adminAction("reset-password", u); }
function terminateUser(u) { adminAction("terminate-user", u); }

function logout() {
  localStorage.removeItem("adminLoggedIn");
  window.location.href = "admin-login.html";
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admin-login.html";
    return;
  }
  fetchUsers();
  fetchWithdrawals();
});
