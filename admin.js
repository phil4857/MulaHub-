document.addEventListener('DOMContentLoaded', () => {
    const adminLoggedIn = localStorage.getItem('admin') === 'true';
    const currentPage = window.location.pathname.split('/').pop();

    if (!adminLoggedIn && currentPage !== 'unlock_admin.html') {
        alert('Access denied. Admin only.');
        window.location.href = 'unlock_admin.html';
        return;
    }

    if (adminLoggedIn && currentPage === 'unlock_admin.html') {
        // Already unlocked, go to admin dashboard
        window.location.href = 'admin.html';
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
            window.location.href = 'admin.html';
        } else {
            alert("Wrong password.");
        }
    })
    .catch(err => {
        console.error("Unlock error:", err);
        alert("Server error. Try again later.");
    });
}

function viewUsers() {
    fetch('https://repo-1red-jipate-bonus.onrender.com/admin/view_users')
        .then(res => res.json())
        .then(users => {
            const output = Object.entries(users).map(([username, info]) => 
                `<div style="margin-bottom: 10px; padding: 8px; border: 1px solid #ccc; border-radius: 8px;">
                    <strong>${username}</strong><br/>
                    Number: ${info.phone || 'N/A'}<br/>
                    Balance: KES ${info.balance}<br/>
                    Referral: ${info.referral || 'N/A'}<br/>
                    Approved: ${info.approved ? 'Yes' : 'No'}
                </div>`
            ).join('');
            document.getElementById('userData').innerHTML = output;
        })
        .catch(err => {
            console.error("Failed to fetch user data:", err);
            alert("Unable to load users.");
        });
}

function logout() {
    localStorage.removeItem('admin');
    alert("Logged out.");
    window.location.href = 'login.html';
}
