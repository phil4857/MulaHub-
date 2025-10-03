// admin.js
(() => {
  const API_BASE = "https://repo-1red-jipate-bonus.onrender.com";

  async function fetchPlatformInfo() {
    try {
      const res = await fetch(`${API_BASE}/platform/info`);
      if (!res.ok) throw new Error("Failed to fetch platform info");
      const data = await res.json();
      document.getElementById("paymentBanner").textContent = `💳 Pay Investment Fee To: ${data.platform} ${data.payment_number}`;
      document.title = `Admin Dashboard - ${data.platform}`;
      document.getElementById("dashboardTitle").textContent = `Admin Dashboard - ${data.platform}`;
    } catch (err) {
      console.warn("platform info error:", err);
      document.getElementById("paymentBanner").textContent = `💳 Pay Investment Fee To: Mkoba Wallet 0739075065 (default)`;
    }
  }

  async function requireAuth() {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "admin_login.html";
      throw new Error("no admin token");
    }
    return token;
  }

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
        container.innerHTML = "<p>No users yet.</p>";
        return;
      }

      // Option: simple search filtering
      const search = (document.getElementById("searchInput").value || "").toLowerCase();

      const cards = data
        .filter(u => !search || (u.username || "").toLowerCase().includes(search))
        .map(u => {
          const approveBtn = !u.approved ? `<button class="btn-approve" onclick="approveUser('${u.username}')">Approve</button>` : "";
          const investBtn = (!u.investment_approved && u.total_invested > 0) ? `<button class="btn-invest" onclick="approveInvestment('${u.username}')">Approve Investment</button>` : "";
          const withdrawBtn = (u.pending_withdrawal && u.pending_withdrawal > 0) ? `<button class="btn-withdraw" onclick="approveWithdrawal('${u.username}')">Approve Withdrawal</button>` : "";
          const resetBtn = `<button class="btn-reset" onclick="resetPassword('${u.username}')">Reset Password</button>`;
          const termBtn = `<button class="btn-term" onclick="terminateUser('${u.username}')">Terminate</button>`;

          return `
            <article class="user-card">
              <div><strong>Username:</strong> ${u.username}</div>
              <div class="small"><strong>Phone:</strong> ${u.number || "N/A"}</div>
              <div class="small"><strong>Referral:</strong> ${u.referral || "None"}</div>
              <div class="small"><strong>Total Invested:</strong> KES ${Number(u.total_invested||0).toFixed(2)}</div>
              <div class="small"><strong>Balance:</strong> KES ${Number(u.balance||0).toFixed(2)}</div>
              <div class="small"><strong>Earnings:</strong> KES ${Number(u.earnings||0).toFixed(2)}</div>
              <div class="small"><strong>Pending Withdrawal:</strong> KES ${Number(u.pending_withdrawal||0).toFixed(2)}</div>
              <div class="small"><strong>Approved:</strong> ${u.approved ? "✅" : "❌"}</div>
              <div class="small"><strong>Investment Approved:</strong> ${u.investment_approved ? "✅" : "❌"}</div>
              <div class="actions" style="margin-top:10px">${approveBtn} ${investBtn} ${withdrawBtn} ${resetBtn} ${termBtn}</div>
            </article>`;
        })
        .join("");

      container.innerHTML = cards;
    } catch (err) {
      console.error(err);
      container.innerHTML = `<p style="color:crimson">Failed to load users: ${err.message}</p>`;
    }
  }

  // Expose action functions globally so inline onclick handlers can call them
  window.approveUser = async (username) => {
    if (!confirm(`Approve user ${username}?`)) return;
    await postAdminAction("approve_user", { username }, `${username} approved`);
  };

  window.approveInvestment = async (username) => {
    if (!confirm(`Approve investment for ${username}?`)) return;
    await postAdminAction("approve_investment", { username }, `Investment approved for ${username}`);
  };

  window.approveWithdrawal = async (username) => {
    if (!confirm(`Approve withdrawal for ${username}?`)) return;
    await postAdminAction("approve_withdrawal", { username }, `Withdrawal approved for ${username}`);
  };

  window.resetPassword = async (username) => {
    const newPassword = prompt(`New password for ${username}:`);
    if (!newPassword) return;
    await postAdminAction("reset-password", { target_username: username, new_password: newPassword }, `Password reset for ${username}`);
  };

  window.terminateUser = async (username) => {
    // NOTE: backend currently doesn't implement terminate endpoint.
    if (!confirm(`Terminate (delete) user ${username}? This cannot be undone.`)) return;
    try {
      const token = await requireAuth();
      const res = await fetch(`${API_BASE}/admin/terminate_user`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Bearer ${token}` },
        body: new URLSearchParams({ username })
      });
      if (res.status === 404) {
        alert("Terminate endpoint is not implemented on server. Ask backend dev to add /admin/terminate_user.");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || "Terminate failed");
      alert(data.message || `User ${username} terminated`);
      fetchUsers();
    } catch (err) {
      alert("Terminate error: " + (err.message || err));
    }
  };

  async function postAdminAction(endpoint, body, successMsg) {
    try {
      const token = await requireAuth();
      const res = await fetch(`${API_BASE}/admin/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Bearer ${token}` },
        body: new URLSearchParams(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || "Action failed");
      alert(data.message || successMsg);
      fetchUsers();
    } catch (err) {
      alert("Action error: " + (err.message || err));
    }
  }

  window.logout = function () {
    localStorage.removeItem("adminToken");
    window.location.href = "admin_login.html";
  };

  // Init
  (async function init() {
    const adminUser = localStorage.getItem("adminUsername");
    if (adminUser) document.getElementById("adminWelcome").textContent = `Signed in as ${adminUser}`;
    await fetchPlatformInfo();
    try { await fetchUsers(); } catch (e) { /* already handled */ }
    // wire search input
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", () => fetchUsers());
  })();
})();
