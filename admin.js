document.addEventListener('DOMContentLoaded', async () => {
  const storedToken = localStorage.getItem('adminToken');

  if (!storedToken) {
    const username = prompt("Enter admin username:");
    const password = prompt("Enter admin password:");

    if (!username?.trim() || !password?.trim()) {
      alert("Login required.");
      window.location.href = "login.html";
      return;
    }

    try {
      const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Login failed");
      if (!data.token) throw new Error("No token received from server.");

      localStorage.setItem("adminToken", data.token);
      fetchUsers();
    } catch (err) {
      alert("Login failed: " + err.message);
      window.location.href = "login.html";
    }
  } else {
    fetchUsers();
  }
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

    // Show payment number at the top
    let headerInfo = `
      <div style="margin-bottom:15px; padding:10px; background:#eef; border-radius:6px;">
        <strong>📌 Payment Number:</strong> <span style="font-size:16px; color:darkgreen;">MPESA: 0739075065</span>
      </div>
    `;

    if (users.length === 0) {
      userDataDiv.innerHTML = headerInfo + "<p>No users found.</p>";
      return;
    }

    const output = users.map(user => {
      const approveBtn = !user.approved
        ? `<button onclick="approveUser('${user.username}')">Approve</button>`
        : '';

      const resetBtn = `<button onclick="resetPassword('${user.username}')">Reset Password</button>`;

      return `
        <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ccc;">
          <strong>Username:</strong> ${user.username}<br>
          <strong>Phone:</strong> ${user.number || "N/A"}<br>
          <strong>Referral:</strong> ${user.referral || "None"}<br>
          <strong>Balance:</strong> KES ${user.balance || 0}<br>
          <strong>Earnings:</strong> KES ${user.earnings || 0}<br>
          <strong>Investment:</strong> KES ${user.total_invested || 0}<br>
          <strong>Approved:</strong> ${user.approved ? '✅' : '❌'}<br>
          ${approveBtn} ${resetBtn}
        </div>
      `;
    }).join('');

    userDataDiv.innerHTML = headerInfo + output;
  } catch (err) {
    alert("Error loading users: " + err.message);
    document.getElementById("userData").innerHTML = "<p>❌ Failed to load users.</p>";
  }
}

async function approveUser(username) {
  const token = localStorage.getItem("adminToken");
  try {
    const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/admin/approve_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`
      },
      body: new URLSearchParams({ username })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Approval failed");

    alert(data.message || `✅ ${username} approved`);
    fetchUsers();
  } catch (err) {
    alert("Approval error: " + err.message);
  }
}

async function resetPassword(username) {
  const token = localStorage.getItem("adminToken");
  const newPassword = prompt(`Enter new password for ${username}:`);
  if (!newPassword?.trim()) return;

  try {
    const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/admin/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`
      },
      body: new URLSearchParams({
        target_username: username,
        new_password: newPassword
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Reset failed");

    alert("Password reset successfully.");
  } catch (err) {
    alert("Reset error: " + err.message);
  }
}

function logout() {
  localStorage.removeItem("adminToken");
  window.location.href = "login.html";
}
