// admin.js
(() => {
  const API_BASE = "https://repo-1red-jipate-bonus.onrender.com";

  // ---------------- PLATFORM INFO ----------------
  async function fetchPlatformInfo() {
    try {
      const res = await fetch(`${API_BASE}/platform/info`);
      if (!res.ok) throw new Error("Failed to fetch platform info");
      const data = await res.json();

      document.getElementById("paymentBanner").textContent =
        `💳 Pay Investment Fee To: ${data.platform} ${data.payment_number}`;
      document.title = `Admin Dashboard - ${data.platform}`;
      document.getElementById("dashboardTitle").textContent =
        `Admin Dashboard - ${data.platform}`;
    } catch (err) {
      console.warn("Platform info error:", err);
      document.getElementById("paymentBanner").textContent =
        "💳 Pay Investment Fee To: Mkoba Wallet 0739075065 (default)";
    }
  }

  // ---------------- AUTH CHECK ----------------
  async function requireAuth() {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "admin_login.html";
      throw new Error("No admin token found");
    }
    return token;
  }

  // ---------------- FETCH USERS ----------------
  async function fetchUsers() {
    const token = await requireAuth();
    const container = document.getElementById("userData");
    container.innerHTML = "Loading users...";

    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || data.message || "Failed to fetch users");
      if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = "<p>No users found.</p>";
        return;
      }

      // Optional: filter with search
      const search = (document.getElementById("searchInput")?.value || "").toLowerCase();

      container.innerHTML = data
        .filter(u => !search || (u.username || "").toLowerCase().includes(search))
        .map(u => {
          const approveBtn = !u.approved
            ? `<button class="btn-approve" onclick="approveUser('${u.username}')">Approve User</button>`
            : "";
          const investBtn = (!u.investment_approved && u.total_invested > 0)
            ? `<button class="btn-invest" onclick="approveInvestment('${u.username}')">Approve Investment</button>`
            : "";
          const withdrawBtn = (u.pending_withdrawal && u.pending_withdrawal > 0)
            ? `<button class="btn-withdraw" onclick="approveWithdrawal('${u.username}')">Approve Withdrawal</button>`
            : "";
          const resetBtn = `<button class="btn-reset" onclick="resetPassword('${u.username}')">Reset Password</button>`;
          const termBtn = `<button class="btn-term" onclick="terminateUser('${u.username}')">Terminate User</button>`;

          return `
            <article class="user-card">
              <div><strong>👤 Username:</strong> ${u.username}</div>
              <div><strong>📞 Phone:</strong> ${u.number || "N/A"}</div>
              <div><strong>🤝 Referral:</strong> ${u.referral || "None"}</div>
              <div><strong>💵 Total Invested:</strong> KES ${Number(u.total_invested||0).toFixed(2)}</div>
              <div><strong>💰 Balance:</strong> KES ${Number(u.balance||0).toFixed(2)}</div>
              <div><strong>📈 Earnings:</strong> KES ${Number(u.earnings||0).toFixed(2)}</div>
              <div><strong>⏳ Pending Withdrawal:</strong> KES ${Number(u.pending_withdrawal||0).toFixed(2)}</div>
              <div><strong>✅ Approved:</strong> ${u.approved ? "Yes" : "No"}</div>
              <div><strong>📊 Investment Approved:</strong> ${u.investment_approved ? "Yes" : "No"}</div>
              <div class="actions" style="margin-top:10px">
                ${approveBtn} ${investBtn} ${withdrawBtn} ${resetBtn} ${termBtn}
              </div>
            </article>`;
        })
        .join("");
    } catch (err) {
      console.error("Fetch users error:", err);
      container.innerHTML = `<p style="color:red;">❌ Failed to load users: ${err.message}</p>`;
    }
  }

  // ---------------- ACTIONS ----------------
  async function postAdminAction(endpoint, body, successMsg) {
    try {
      const token = await requireAuth();
      const res = await fetch(`${API_BASE}/admin/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`
        },
        body: new URLSearchParams(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || "Action failed");
      alert(data.message || successMsg);
      fetchUsers();
    } catch (err) {
      alert("❌ " + (err.message || err));
    }
  }

  // Expose functions globally
  window.approveUser = (username) =>
    confirm(`Approve user ${username}?`) &&
    postAdminAction("approve_user", { username }, `User ${username} approved`);

  window.approveInvestment = (username) =>
    confirm(`Approve investment for ${username}?`) &&
    postAdminAction("approve_investment", { username }, `Investment approved for ${username}`);

  window.approveWithdrawal = (username) =>
    confirm(`Approve withdrawal for ${username}?`) &&
    postAdminAction("approve_withdrawal", { username }, `Withdrawal approved for ${username}`);

  window.resetPassword = (username) => {
    const newPassword = prompt(`Enter new password for ${username}:`);
    if (newPassword?.trim()) {
      postAdminAction("reset-password", { target_username: username, new_password: newPassword }, `Password reset for ${username}`);
    }
  };

  window.terminateUser = async (username) => {
    if (!confirm(`⚠️ Terminate user ${username}? This cannot be undone.`)) return;
    await postAdminAction("terminate_user", { username }, `User ${username} terminated`);
  };

  // ---------------- LOGOUT ----------------
  window.logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "admin_login.html";
  };

  // ---------------- INIT ----------------
  (async function init() {
    const adminUser = localStorage.getItem("adminUsername");
    if (adminUser && document.getElementById("adminWelcome")) {
      document.getElementById("adminWelcome").textContent = `Signed in as ${adminUser}`;
    }
    await fetchPlatformInfo();
    await fetchUsers();

    // Search binding
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", fetchUsers);
    }
  })();
})();
