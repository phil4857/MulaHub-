const BACKEND_URL = "https://repo-1red-jipate-bonus-1.onrender.com";

document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = 'login.html';
        return;
    }

    const balanceEl = document.getElementById('balance');
    const earningsEl = document.getElementById('earnings');
    const investedEl = document.getElementById('invested');
    const msgEl = document.getElementById('msg') || document.createElement('p'); // fallback if no #msg
    const investForm = document.getElementById('investForm');

    // Load user data from backend
    async function loadDashboard() {
        msgEl.textContent = "Loading account info...";
        msgEl.className = "msg loading";

        try {
            const res = await fetch(`\( {BACKEND_URL}/dashboard?username= \){encodeURIComponent(username)}`);

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                msgEl.className = "msg error";

                if (res.status === 403) {
                    msgEl.textContent = data.detail || "Account not approved yet. Please wait for admin approval.";
                } else {
                    msgEl.textContent = data.detail || `Error loading data (status ${res.status})`;
                }
                return;
            }

            const data = await res.json();

            if (balanceEl) balanceEl.textContent = `KES ${Number(data.balance || 0).toFixed(2)}`;
            if (earningsEl) earningsEl.textContent = `KES ${Number(data.earnings || 0).toFixed(2)}`;

            let invested = 0;
            if (data.investments && typeof data.investments === 'object') {
                Object.values(data.investments).forEach(item => {
                    invested += Number(item.amount || 0);
                });
            }
            if (investedEl) investedEl.textContent = `KES ${invested.toFixed(2)}`;

            msgEl.className = "msg success";
            msgEl.textContent = "Ready to invest!";
        } catch (err) {
            msgEl.className = "msg error";
            msgEl.textContent = "Cannot connect to server. Check your internet.";
            console.error("Dashboard load error:", err);
        }
    }

    // Handle investment request
    investForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const commodity = document.getElementById('commoditySelect')?.value;
        if (!commodity) {
            msgEl.className = "msg error";
            msgEl.textContent = "Please select a commodity.";
            return;
        }

        msgEl.className = "msg loading";
        msgEl.textContent = "Sending investment request...";

        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('commodity', commodity);

        try {
            const res = await fetch(`${BACKEND_URL}/invest/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                msgEl.className = "msg success";
                msgEl.textContent = data.message || 'Investment request created. Awaiting confirmation.';
                investForm.reset(); // clear form
                loadDashboard();    // refresh numbers
            } else {
                msgEl.className = "msg error";
                msgEl.textContent = data.detail || 'Investment request failed.';
            }
        } catch (err) {
            msgEl.className = "msg error";
            msgEl.textContent = "Network error – please try again.";
            console.error(err);
        }
    });

    function logout() {
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    }

    // Load data when page opens
    loadDashboard();
});
