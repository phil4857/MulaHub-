document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');

    // If not logged in at all
    if (!username) {
        alert('Please log in first.');
        window.location.href = 'login.html';
        return;
    }

    // Only show admin content if user is actually admin
    if (username !== 'admin') {
        alert('Access denied. Admins only.');
        window.location.href = 'dashboard.html';
        return;
    }

    // Allow admin access
    localStorage.setItem('admin', 'true');
    document.getElementById('adminPanel').style.display = 'block';
    viewUsers();
});

function viewUsers() {
    fetch('https://repo-1red-jipate-bonus.onrender.com/admin/view_users')
        .then(res => res.json())
        .then(users => {
            const output = Object.entries(users).map(([username, info]) =>
                `<div><strong>${username}</strong>: ${JSON.stringify(info)}</div>`
            ).join('');
            document.getElementById('userData').innerHTML = output;
        })
        .catch(err => {
            console.error(err);
            alert("Failed to fetch user data.");
        });
}

function logout() {
    localStorage.removeItem('admin');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}
