# admin.js

"""
document.addEventListener('DOMContentLoaded', () => {
    const adminLoggedIn = localStorage.getItem('admin') === 'true';
    if (!adminLoggedIn) {
        alert('Access denied. Admin only.');
        window.location.href = 'login.html';
        return;
    }
});

function unlockAdmin() {
    const password = prompt("Enter admin password:");
    fetch('https://repo-1red-jipate-bonus.onrender.com/admin/unlock', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `password=${encodeURIComponent(password)}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('admin', 'true');
            alert("Admin access granted.");
        } else {
            alert("Wrong password.");
        }
    });
}

function viewUsers() {
    fetch('https://repo-1red-jipate-bonus.onrender.com/admin/view_users')
        .then(res => res.json())
        .then(users => {
            const output = Object.entries(users).map(([username, info]) => 
                `<div><strong>${username}</strong>: ${JSON.stringify(info)}</div>`
            ).join('');
            document.getElementById('userData').innerHTML = output;
        });
}

function logout() {
    localStorage.removeItem('admin');
    window.location.href = 'login.html';
}
"""
