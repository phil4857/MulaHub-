const BACKEND_URL = "https://repo-1red-jipate-bonus-1-kwee.onrender.com";
const ADMIN_PASSWORD = "PHIL4857";

let usersData = [];

// Show message in the message area
function showMessage(type, text) {
  const msgEl = document.getElementById("message");
  if (msgEl) {
    msgEl.className = type;
    msgEl.textContent = text;
    setTimeout(() => { msgEl.textContent = ""; }, 4000);
  } else {
    console.log(type + ":", text);
  }
}

// Populate the users table
function populateUsersTable(users) {
  const tbody = document.querySelector("#usersTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!users || users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">No users found</td></tr>`;
    return;
  }

  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.username || 'N/A'}</td>
      <td>${user.phone || 'N/A'}</td>
      <td>${user.approved ? '✅ Yes' : '❌ No'}</td>
      <td>${user.balance ? user.balance.toFixed(2) : '0.00'}</td>
      <td>${user.earnings ? user.earnings.toFixed(2) : '0.00'}</td>
      <td>
        <button onclick="approveUser('${user.username}')" ${user.approved ? 'disabled' : ''}>Approve</button>
        <button onclick="resetPassword('${user.username}')">Reset PW</button>
        <button onclick="terminateUser('${user.username}')" class="danger">Terminate</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Fetch users from backend
async function fetchUsers() {
  const tbody = document.querySelector("#usersTable tbody");
  if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Loading users...</td></tr>`;

  try {
    const res = await fetch(`${BACKEND_URL}/admin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: ADMIN_PASSWORD })
    });

    let data;
    try {
      data = await res.json();
    } catch (e) {
      data = [];
    }

    if (res.ok) {
      // Handle both array response and {users: [...]} format
      const users = Array.isArray(data) ? data : (data.users || data);
      usersData = users;
      populateUsersTable(users);
    } else {
      showMessage("error", data.detail || data.message || "Failed to load users");
      if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Error loading users</td></tr>`;
    }
  } catch (err) {
    console.error("Fetch users error:", err);
    showMessage("error", "Network error - cannot reach server");
    if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Cannot connect to server</td></tr>`;
  }
}

// Admin action helper
async function adminAction(endpoint, username) {
  if (!confirm(`Are you sure you want to ${endpoint} user ${username}?`)) return;

  try {
    const res = await fetch(`\( {BACKEND_URL}/admin/ \){endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        password: ADMIN_PASSWORD,
        username: username 
      })
    });

    const result = await res.json().catch(() => ({}));

    if (res.ok) {
      showMessage("success", result.message || "Action completed");
      fetchUsers(); // Refresh table
    } else {
      showMessage("error", result.detail || result.message || "Action failed");
    }
  } catch (err) {
    console.error(err);
    showMessage("error", "Network error");
  }
}

function approveUser(username) { adminAction("approve-user", username); }
function resetPassword(username) { adminAction("reset-password", username); }
function terminateUser(username) { adminAction("terminate-user", username); }

// Logout
function logout() {
  if (confirm("Logout admin?")) {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "admin-login.html";
  }
}

// Check if admin is logged in
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admin-login.html";
    return;
  }

  // Run fetch on load
  fetchUsers();
});
