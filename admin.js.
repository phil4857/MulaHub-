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
    const url = `https://repo-1red-jipate-bonus.onrender.com/admin/view_users?admin_password=${encodeURIComponent(adminPassword)}`;

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("Unauthorized or error fetching users.");
            return res.json();
        })
        .then(users => {
            const output = Object.entries(users).map(([username, info]) =>
                `<div><strong>${username}</strong>: ${JSON.stringify(info)}</div>`
            ).join('');
            document.getElementById('userData').innerHTML = output;
        })
        .catch(err => {
            console.error(err);
            alert("Failed to fetch user data. Wrong password?");
        });
}

function logout() {
    localStorage.removeItem('admin');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}
