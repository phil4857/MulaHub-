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
                return `<div style="margin-bottom:10px">
                    <strong>${user.username}</strong> - ${user.number} 
                    | Approved: ${user.approved ? '✅' : '❌'} ${approveBtn}
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
    .then(res => {
        if (!res.ok) throw new Error("Approval failed.");
        return res.json();
    })
    .then(data => {
        alert(data.message);
        viewUsers(adminUsername, adminPassword);
    })
    .catch(err => {
        console.error(err);
        alert("Failed to approve user: " + err.message);
    });
}

function logout() {
    localStorage.removeItem('admin');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}
