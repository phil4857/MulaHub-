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
    const msgEl = document.getElementById('msg');
    const investBtn = document.getElementById('investBtn');
    const selectedDisplay = document.getElementById('selectedCommodity');

    let selectedCommodity = null;

    // Load dashboard data
    async function loadDashboard() {
        if (msgEl) {
            msgEl.className = "msg loading";
            msgEl.textContent = "Loading account info...";
        }

        try {
            const res = await fetch(`${BACKEND_URL}/dashboard?username=${encodeURIComponent(username)}`);

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                if (msgEl) {
                    msgEl.className = "msg error";
                    msgEl.textContent = data.detail || `Error ${res.status}`;
                    if (res.status === 403) {
                        msgEl.textContent = "Account not approved yet. Please wait for admin.";
                    }
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

            if (msgEl) {
                msgEl.className = "msg success";
                msgEl.textContent = "Ready to invest!";
            }
        } catch (err) {
            if (msgEl) {
                msgEl.className = "msg error";
                msgEl.textContent = "Cannot connect to server. Check internet.";
            }
            console.error("Dashboard load error:", err);
        }
    }

    // Select commodity card
    window.selectCommodity = function(commodity) {
        selectedCommodity = commodity;

        document.querySelectorAll('.commodity-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');

        if (selectedDisplay) {
            selectedDisplay.textContent = commodity.charAt(0).toUpperCase() + commodity.slice(1).replace('_', ' ');
        }

        if (investBtn) investBtn.disabled = false;
    };

    // Handle investment request
    if (investBtn) {
        investBtn.addEventListener('click', async () => {
            if (!selectedCommodity) {
                if (msgEl) {
                    msgEl.className = "msg error";
                    msgEl.textContent = "Please select a commodity first.";
                }
                return;
            }

            if (msgEl) {
                msgEl.className = "msg loading";
                msgEl.textContent = "Sending investment request...";
            }

            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('commodity', selectedCommodity);

            try {
                const res = await fetch(`${BACKEND_URL}/invest/request`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData
                });

                const data = await res.json();

                if (res.ok) {
                    if (msgEl) {
                        msgEl.className = "msg success";
                        msgEl.textContent = data.message || `Investment request for ${selectedCommodity} created. Awaiting confirmation.`;
                    }
                    loadDashboard(); // refresh numbers
                } else {
                    if (msgEl) {
                        msgEl.className = "msg error";
                        msgEl.textContent = data.detail || 'Request failed.';
                    }
                }
            } catch (err) {
                if (msgEl) {
                    msgEl.className = "msg error";
                    msgEl.textContent = "Network error – try again.";
                }
                console.error(err);
            }
        });
    }

    function logout() {
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    }

    // Load on open
    loadDashboard();
});
