// admin.js

// Replace with your actual backend URL
const backendURL = "https://repo-1red-jipate-bonus.onrender.com";

// Ensure only admin (by username) can access this page
document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username");
    if (username !== "admin") {
        alert("Access denied. Admins only.");
        window.location.href = "login.html";
    }
    loadUsers();
    loadInvestments();
});

// Approve a user
function approveUser(username) {
    fetch(`${backendURL}/admin/approve_user`, {
        method: "POST",
        body: new URLSearchParams({ username }),
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        loadUsers();
    });
}

// Reset a user's password
function resetPassword(username) {
    const newPassword = prompt("Enter new password for " + username);
    if (!newPassword) return;
    fetch(`${backendURL}/admin/reset_password`, {
        method: "POST",
        body: new URLSearchParams({ username, new_password: newPassword }),
    })
    .then(res => res.json())
    .then(data => alert(data.message));
}

// Approve an investment
function approveInvestment(username) {
    fetch(`${backendURL}/admin/approve_investment`, {
        method: "POST",
        body: new URLSearchParams({ username }),
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        loadInvestments();
    });
}

// Load user list
function loadUsers() {
    fetch(`${backendURL}/admin/view_users`)
        .then(res => res.json())
        .then(users => {
            const table = document.getElementById("userTableBody");
            table.innerHTML = "";
            Object.entries(users).forEach(([username, data]) => {
                const row = `
                    <tr>
                        <td>${username}</td>
                        <td>${data.approved}</td>
                        <td>${data.balance}</td>
                        <td>${data.earnings}</td>
                        <td>${data.referral || "None"}</td>
                        <td>${data.referred_users.length}</td>
                        <td>
                            <button onclick="approveUser('${username}')">Approve</button>
                            <button onclick="resetPassword('${username}')">Reset Password</button>
                        </td>
                    </tr>`;
                table.innerHTML += row;
            });
        });
}

// Load investment list
function loadInvestments() {
    fetch(`${backendURL}/admin/view_investments`)
        .then(res => res.json())
        .then(investments => {
            const table = document.getElementById("investmentTableBody");
            table.innerHTML = "";
            Object.entries(investments).forEach(([username, data]) => {
                const row = `
                    <tr>
                        <td>${username}</td>
                        <td>${data.amount}</td>
                        <td>${data.transaction_ref}</td>
                        <td>${data.approved}</td>
                        <td>${data.timestamp}</td>
                        <td><button onclick="approveInvestment('${username}')">Approve</button></td>
                    </tr>`;
                table.innerHTML += row;
            });
        });
}
