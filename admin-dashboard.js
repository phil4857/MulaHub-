const BACKEND_URL = "https://repo-1red-jipate-bonus-1-kwee.onrender.com";
const ADMIN_PASSWORD = "PHIL4857";

function showMessage(type, text) {
  const msg = document.getElementById("message") || console;
  if (typeof msg.textContent !== 'undefined') {
    msg.className = type;
    msg.textContent = text;
  } else {
    console.log(type.toUpperCase() + ":", text);
  }
}

function populateUsersTable(users) {
  const tbody = document.querySelector("#usersTable tbody");
  if (!tbody) {
    console.error("Table body not found!");
    return;
  }

  tbody.innerHTML = "";

  if (!users || users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;">No registered users yet</td></tr>`;
    return;
  }

  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.username || 'N/A'}</td>
      <td>${user.phone || 'N/A'}</td>
      <td>${user.approved ? '✅ Approved' : '❌ Pending'}</td>
      <td>KES ${user.balance ? Number(user.balance).toFixed(2) : '0.00'}</td>
      <td>KES ${user.earnings ? Number(user.earnings).toFixed(2) : '0.00'}</td>
      <td>
        <button onclick="approveUser('${user.username}')" ${user.approved ? 'disabled style="opacity:0.5"' : ''}>Approve</button>
        <button onclick="resetPassword('${user.username}')">Reset PW</button>
        <button onclick="terminateUser('${user.username}')" style="background:#dc3545;color:white;">Terminate</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function fetchUsers() {
  const tbody = document.querySelector("#usersTable tbody");
  if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Loading users...</td></tr>`;

  try {
    const res = await fetch(`${BACKEND_URL}/admin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: ADMIN_PASSWORD })
    });

    console.log("Response status:", res.status);

    let data = [];
    try {
      data = await res.json();
    } catch (e) {
      console.error("JSON parse error:", e);
    }

    console.log("Received data:", data);

    if (res.ok) {
      const users = Array.isArray(data) ? data : (data.users || data || []);
      populateUsersTable(users);
    } else {
      const errorMsg = data.detail || data.message || `Error ${res.status}`;
      showMessage("error", errorMsg);
      if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:red;">Failed to load users (${errorMsg})</td></tr>`;
    }
  } catch (err) {
    console.error("Fetch error:", err);
    showMessage("error", "Network error - cannot reach backend");
    if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:red;">Cannot connect to server</td></tr>`;
  }
}

// FIXED adminAction function
async function adminAction(endpoint, username) {
  if (!confirm(`Confirm ${endpoint.replace('-', ' ')} for user ${username}?`)) return;

  try {
    const res = await fetch(`\( {BACKEND_URL}/admin/ \){endpoint}`, {   // Corrected line
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        password: ADMIN_PASSWORD, 
        username: username 
      })
    });

    const result = await res.json().catch(() => ({}));
    if (res.ok) {
      showMessage("success", result.message || "Action successful");
      fetchUsers(); // refresh table
    } else {
      showMessage("error", result.detail || result.message || "Action failed");
    }
  } catch (err) {
    console.error("Action error:", err);
    showMessage("error", "Network error");
  }
}

function approveUser(username) { adminAction("approve-user", username); }
function resetPassword(username) { adminAction("reset-password", username); }
function terminateUser(username) { adminAction("terminate-user", username); }

function logout() {
  if (confirm("Logout?")) {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "admin-login.html";
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admin-login.html";
    return;
  }
  fetchUsers();
});
