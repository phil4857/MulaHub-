const BACKEND_URL = "https://repo-1red-jipate-bonus-1-kwee.onrender.com";
const ADMIN_PASSWORD = "PHIL4857";

function showMessage(type, text) {
  const msg = document.getElementById("message");
  if (msg) {
    msg.className = `message ${type}`;
    msg.textContent = text;
  }
  console.log(`[${type.toUpperCase()}]`, text);
}

function populateUsersTable(users) {
  const tbody = document.querySelector("#usersTable tbody");
  if (!tbody) {
    console.error("Table body not found!");
    return;
  }

  tbody.innerHTML = "";

  if (!users || users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;">No registered users yet</td></tr>`;
    return;
  }

  users.forEach(user => {
    const approvedText = user.approved ? '✅ Approved' : '⏳ Pending';
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.username || 'N/A'}</td>
      <td>${user.phone || 'N/A'}</td>
      <td style="color:\( {user.approved ? 'green' : 'orange'}"> \){approvedText}</td>
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
      console.log("Received data:", data);
    } catch (e) {
      console.error("JSON parse error:", e);
    }

    if (res.ok) {
      const users = Array.isArray(data) ? data : (data.users || data || []);
      populateUsersTable(users);
    } else {
      const errorMsg = data.detail || data.message || `Error ${res.status}`;
      showMessage("error", errorMsg);
      if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:red;">Failed to load users</td></tr>`;
    }
  } catch (err) {
    console.error("Fetch error:", err);
    showMessage("error", "Cannot connect to backend");
  }
}

async function adminAction(endpoint, username) {
  if (!confirm(`Confirm ${endpoint.replace('-', ' ')} for user ${username}?`)) return;

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
      showMessage("success", result.message || "Action successful");
      fetchUsers(); // refresh
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
});
