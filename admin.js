document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');

    if (!username) {
        alert('Please log in first.');
        window.location.href = 'login.html';
        return;
    }

    if (username !== 'admin') {
        alert('Access denied. Admins only.');
        window.location.href = 'dashboard.html';
        return;
    }

    const adminPassword = prompt("Enter admin password:");
    if (!adminPassword) {
        alert("Password is required.");
        window.location.href = 'login.html';
        return;
    }

    localStorage.setItem('admin', 'true');
    document.getElementById('adminPanel').style.display = 'block';

    viewUsers(username, adminPassword);
});

function viewUsers(adminUsername, adminPassword) {
    fetch("https://repo-1red-jipate-bonus.onrender.com/users")
        .then(res => {
            if (!res.ok) throw new Error("Error fetching users.");
            return res.json();
        })
        .then(users => {
            const output = users.map(user => {
                const approveBtn = !user.approved
                    ? `<button onclick="approveUser('${user.username}', '${adminUsername}', '${adminPassword}')">Approve</button>`
                    : '';

                const resetBtn = `<button onclick="resetPassword('${user.username}', '${adminUsername}', '${adminPassword}')">Reset Password</button>`;

                return `<div style="margin-bottom:10px">
                    <strong>${user.username}</strong> - ${user.number} 
                    | Approved: ${user.approved ? '✅' : '❌'}
                    ${approveBtn} ${resetBtn}
                </div>`;
            }).join('');
            document.getElementById('userData').innerHTML = output;
        })
        .catch(err => {
            console.error(err);
            alert("Failed to load users.");
        });
}

function approveUser(targetUsername, adminUsername, adminPassword) {
    fetch("https://repo-1red-jipate-bonus.onrender.com/admin/approve-user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            admin_username: adminUsername,
            admin_password: adminPassword,
            target_username: targetUsername
        })
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || data.message || "Approval failed");
        alert(data.message || "User approved successfully.");
        viewUsers(adminUsername, adminPassword);
    })
    .catch(err => {
        console.error(err);
        alert("Failed to approve user: " + err.message);
    });
}

function resetPassword(targetUsername, adminUsername, adminPassword) {
    const newPassword = prompt(`Enter a new password for ${targetUsername}:`);
    if (!newPassword) return;

    fetch("https://repo-1red-jipate-bonus.onrender.com/admin/reset-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            admin_username: adminUsername,
            admin_password: adminPassword,
            target_username: targetUsername,
            new_password: newPassword
        })
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || data.message || "Reset failed");
        alert(data.message || "Password reset successfully.");
    })
    .catch(err => {
        console.error(err);
        alert("Failed to reset password: " + err.message);
    });
}

function logout() {
    localStorage.removeItem('admin');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}
