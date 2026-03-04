const BACKEND_URL = "https://repo-1red-jipate-bonus.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {
  if (localStorage.getItem("adminLoggedIn") !== "true") {
    alert("Please login as admin first");
    window.location.href = "admin-login.html";
    return;
  }

  const tableBody = document.querySelector("#usersTable tbody");

  async function fetchUsers() {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/users`);
      const users = await res.json();
      tableBody.innerHTML = "";
      users.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${user.username}</td>
          <td>${user.phone}</td>
          <td>${user.approved}</td>
          <td>${user.balance}</td>
          <td>${user.earnings}</td>
          <td>
            ${user.approved ? "" : `<button onclick="approveUser('${user.username}')">Approve</button>`}
          </td>
        `;
        tableBody.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
      tableBody.innerHTML = `<tr><td colspan="6">Error loading users</td></tr>`;
    }
  }

  window.approveUser = async (username) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      const res = await fetch(`${BACKEND_URL}/admin/approve-user`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });
      if (res.ok) {
        alert(`User ${username} approved`);
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.detail || "Failed to approve user");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  fetchUsers();
});
