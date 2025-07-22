document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');

    // If not logged in
    if (!username) {
        alert('Please log in first.');
        window.location.href = 'login.html';
        return;
    }

    // Check admin access
    if (username !== 'admin') {
        alert('Access denied. Admins only.');
        window.location.href = 'dashboard.html';
        return;
    }

    // Ask for admin password
    const adminPassword = prompt("Enter admin password:");

    // Store admin flag (optional)
    localStorage.setItem('admin', 'true');
    document.getElementById('adminPanel').style.display = 'block';

    viewUsers(adminPassword);
});

function viewUsers(adminPassword) {
    const url = `https://repo-1red-jipate-bonus.onrender.com/users`;

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("Unauthorized or error fetching users.");
            return res.json();
        })
        .then(users => {
            const output = users.map(user => {
                return `<div style="margin-bottom:10px">
                    <strong>${user.username}</strong> - ${user.number} 
                    | Approved: ${user.approved ? '✅' : '❌'}
                    ${!user.approved ? `<button onclick="approveUser('${user.username}', '${adminPassword}')">Approve</button>` : ''}
                </div>`;
            }).join('');
            document.getElementById('userData').innerHTML = output;
        })
        .catch(err => {
            console.error(err);
            alert("Failed to fetch user data. Wrong password?");
        });
}

function approveUser(targetUsername, adminPassword) {
    fetch("https://repo-1red-jipate-bonus.onrender.com/admin/approve-user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            admin_username: "admin",
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
        viewUsers(adminPassword); // Refresh user list after approval
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
