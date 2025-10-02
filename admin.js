document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = "admin_login.html"; // enforce login page
    return;
  }
  fetchUsers();
});

async function fetchUsers() {
  const token = localStorage.getItem("adminToken");
  try {
    const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const users = await res.json();
    if (!res.ok) throw new Error(users.detail || "Failed to fetch users");

    const userDataDiv = document.getElementById("userData");

    if (users.length === 0) {
      userDataDiv.innerHTML = "<p>No users found.</p>";
      return;
    }

    userDataDiv.innerHTML = users.map(user => {
      const approveUserBtn = !user.approved
        ? `<button onclick="approveUser('${user.username}')">Approve User</button>`
        : '';

      const approveInvestmentBtn = !user.investment_approved && user.total_invested > 0
        ? `<button onclick="approveInvestment('${user.username}')">Approve Investment</button>`
        : '';

      const approveWithdrawalBtn = user.pending_withdrawal > 0
        ? `<button onclick="approveWithdrawal('${user.username}')">Approve Withdrawal</button>`
        : '';

      const resetBtn = `<button onclick="resetPassword('${user.username}')">Reset Password</button>`;
      const terminateBtn = `<button onclick="terminateUser('${user.username}')">❌ Terminate User</button>`;

      return `
        <div class="user-card">
          <strong>Username:</strong> ${user.username}<br>
          <strong>Phone:</strong> ${user.number || "N/A"}<br>
          <strong>Referral:</strong> ${user.referral || "None"}<br>
          <strong>Total Invested:</strong> KES ${(user.total_invested || 0).toFixed(2)}<br>
          <strong>Balance:</strong> KES ${(user.balance || 0).toFixed(2)}<br>
          <strong>Earnings:</strong> KES ${(user.earnings || 0).toFixed(2)}<br>
          <strong>Approved:</strong> ${user.approved ? '✅' : '❌'}<br>
          <strong>Investment Approved:</strong> ${user.investment_approved ? '✅' : '❌'}<br>
          <strong>Pending Withdrawal:</strong> KES ${(user.pending_withdrawal || 0).toFixed(2)}<br>
          ${approveUserBtn} ${approveInvestmentBtn} ${approveWithdrawalBtn} ${resetBtn} ${terminateBtn}
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error("User fetch error:", err);
    document.getElementById("userData").innerHTML = "<p>❌ Failed to load users.</p>";
  }
}

async function approveUser(username) {
  await postAdminAction("approve_user", { username }, `✅ ${username} approved`);
}

async function approveInvestment(username) {
  await postAdminAction("approve_investment", { username }, `✅ Investment approved for ${username}`);
}

async function approveWithdrawal(username) {
  await postAdminAction("approve_withdrawal", { username }, `✅ Withdrawal approved for ${username}`);
}

async function resetPassword(username) {
  const newPassword = prompt(`Enter new password for ${username}:`);
  if (!newPassword?.trim()) return;

  await postAdminAction("reset-password", { target_username: username, new_password: newPassword }, "Password reset successfully");
}

async function terminateUser(username) {
  if (!confirm(`⚠️ Are you sure you want to TERMINATE user ${username}? This cannot be undone.`)) return;
  await postAdminAction("terminate_user", { username }, `❌ User ${username} terminated`);
}

async function postAdminAction(endpoint, body, successMsg) {
  const token = localStorage.getItem("adminToken");
  try {
    const res = await fetch(`https://repo-1red-jipate-bonus.onrender.com/admin/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`
      },
      body: new URLSearchParams(body)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Action failed");

    alert(data.message || successMsg);
    fetchUsers();
  } catch (err) {
    alert("Error: " + err.message);
  }
}

function logout() {
  localStorage.removeItem("adminToken");
  window.location.href = "admin_login.html";
}
