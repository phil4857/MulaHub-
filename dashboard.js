const BACKEND_URL = "https://repo-1red-jipate-bonus-1.onrender.com";

document.addEventListener('DOMContentLoaded', async () => {
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = 'login.html';
        return;
    }

    const balanceEl = document.getElementById('balanceDisplay');
    const investmentListEl = document.getElementById('investmentList');

    const commodities = {
        marble: { price: 650, days: 15 },
        crude_oil: { price: 800, days: 20 },
        silver: { price: 1000, days: 23 },
        lead: { price: 1200, days: 25 },
        platinum: { price: 1350, days: 28 },
        diamonds: { price: 1750, days: 32 },
        gold: { price: 2200, days: 35 },
        uranium: { price: 3000, days: 45 }
    };

    async function fetchUserData() {
        try {
            const response = await fetch(`\( {BACKEND_URL}/dashboard?username= \){encodeURIComponent(username)}`);
            if (!response.ok) {
                console.error(`Dashboard fetch failed: ${response.status} ${response.statusText}`);
                if (response.status === 403) {
                    alert("Account not approved or access denied. Please wait for admin approval.");
                } else {
                    alert(`Failed to load dashboard data (status ${response.status}).`);
                }
                logout();
                return null;
            }
            return await response.json();
        } catch (err) {
            console.error("Dashboard fetch error:", err);
            alert("Cannot connect to the server. Check your internet.");
            return null;
        }
    }

    async function updateUI() {
        const user = await fetchUserData();
        if (!user) return;

        if (balanceEl) {
            balanceEl.textContent = `KES ${Number(user.balance || 0).toFixed(2)}`;
        }

        renderInvestments(user.investments || {});
    }

    function renderInvestments(investments) {
        if (!investmentListEl) return;

        investmentListEl.innerHTML = '';

        if (!investments || Object.keys(investments).length === 0) {
            investmentListEl.textContent = 'No active investments.';
            return;
        }

        const now = new Date();

        for (const [commodity, inv] of Object.entries(investments)) {
            const div = document.createElement('div');
            div.className = 'investment-item';

            const expiry = new Date(inv.expiry_date);
            const diff = expiry - now;

            let timeText = 'Expired';
            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                timeText = `${days} days remaining`;
            }

            div.textContent = `${commodity.toUpperCase()} | KES ${inv.amount} | ${timeText}`;
            investmentListEl.appendChild(div);
        }
    }

    // INVEST REQUEST
    document.getElementById('investBtn')?.addEventListener('click', async () => {
        const commodity = document.getElementById('commodity')?.value;
        if (!commodity) return alert("Please select a commodity.");

        const user = await fetchUserData();
        if (!user) return;

        if (!commodities[commodity] || user.balance < commodities[commodity].price) {
            return alert("Insufficient balance or invalid commodity.");
        }

        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('commodity', commodity);

        try {
            const response = await fetch(`${BACKEND_URL}/invest/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || 'Investment request created. Proceed to confirm.');
            } else {
                alert(data.detail || 'Investment request failed.');
            }
        } catch (err) {
            alert('Network error during investment request.');
            console.error(err);
        }
    });

    // INVEST CONFIRM
    document.getElementById('investConfirmBtn')?.addEventListener('click', async () => {
        const formData = new URLSearchParams();
        formData.append('username', username);

        try {
            const response = await fetch(`${BACKEND_URL}/invest/confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || 'Investment confirmed!');
                updateUI();
            } else {
                alert(data.detail || 'Confirmation failed.');
            }
        } catch (err) {
            alert('Network error during confirmation.');
            console.error(err);
        }
    });

    // WITHDRAW REQUEST
    document.getElementById('withdrawBtn')?.addEventListener('click', async () => {
        const today = new Date();
        if (today.getDay() !== 1) return alert("Withdrawals allowed only on Monday");

        const amount = parseFloat(document.getElementById('withdrawAmount')?.value || 0);
        if (!amount || amount <= 0) return alert("Enter a valid amount");

        const user = await fetchUserData();
        if (!user) return;

        if (amount > user.balance) return alert("Insufficient balance");

        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('amount', amount);

        try {
            const response = await fetch(`${BACKEND_URL}/withdraw/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || 'Withdrawal request created. Pending admin approval.');
            } else {
                alert(data.detail || 'Withdrawal request failed.');
            }
        } catch (err) {
            alert('Network error during withdrawal request.');
            console.error(err);
        }
    });

    // WITHDRAW CONFIRM
    document.getElementById('withdrawConfirmBtn')?.addEventListener('click', async () => {
        const formData = new URLSearchParams();
        formData.append('username', username);

        try {
            const response = await fetch(`${BACKEND_URL}/withdraw/confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || 'Withdrawal confirmed!');
                updateUI();
            } else {
                alert(data.detail || 'Confirmation failed.');
            }
        } catch (err) {
            alert('Network error during confirmation.');
            console.error(err);
        }
    });

    window.logout = function () {
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    };

    // Initial load
    updateUI();
});
