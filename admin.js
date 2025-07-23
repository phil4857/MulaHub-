document.addEventListener('DOMContentLoaded', async () => {
    const storedToken = localStorage.getItem('adminToken');

    if (!storedToken) {
        const username = prompt("Enter admin username:");
        const password = prompt("Enter admin password:");
        if (!username || !password) {
            alert("Login required.");
            window.location.href = "login.html";
            return;
        }

        try {
            const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || "Login failed");
            }

            const data = await res.json();
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
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error("Failed to fetch users");

        const users = await res.json();
        const output = users.map(user => {
            const approveBtn = !user.approved
                ? `<button onclick="approveUser('${user.username}')">Approve</button>`
                : '';

            const resetBtn = `<button onclick="resetPassword('${user.username}')">Reset Password</button>`;

            return `<div style="margin-bottom:10px">
                <strong>${user.username}</strong> - ${user.number} 
                | Approved: ${user.approved ? '✅' : '❌'}
                ${approveBtn} ${resetBtn}
            </div>`;
        }).join('');

        document.getElementById("userData").innerHTML = output;
    } catch (err) {
        alert("Error loading users: " + err.message);
    }
}

async function approveUser(username) {
    const token = localStorage.getItem("adminToken");
    try {
        const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/admin/approve-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ target_username: username })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Approval failed");
        alert(data.message || "User approved");
        fetchUsers();
    } catch (err) {
        alert("Approval error: " + err.message);
    }
}

async function resetPassword(username) {
    const token = localStorage.getItem("adminToken");
    const newPassword = prompt(`Enter new password for ${username}:`);
    if (!newPassword) return;

    try {
        const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/admin/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ target_username: username, new_password: newPassword })
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
