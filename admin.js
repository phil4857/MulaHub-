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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "Login failed");
            }

            if (!data.token) {
                throw new Error("No token received from server.");
            }

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

        const users = await res.json();

        if (!res.ok) {
            throw new Error(users.detail || "Failed to fetch users");
        }

        const output = users.map(user => {
            const approveBtn = !user.approved
                ? `<button onclick="approveUser('${user.username}')">Approve</button>`
                : '';
            const resetBtn = `<button onclick="resetPassword('${user.username}')">Reset Password</button>`;

            return `
                <div style="margin-bottom:10px">
                    <strong>${user.username}</strong> - ${user.number || "N/A"}
                    | Approved: ${user.approved ? '✅' : '❌'}
                    ${approveBtn} ${resetBtn}
                </div>`;
        }).join('');

        document.getElementById("userData").innerHTML = output || "<p>No users found.</p>";
    } catch (err) {
        alert("Error loading users: " + err.message);
        document.getElementById("userData").innerHTML = "<p>❌ Failed to load users.</p>";
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
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
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
