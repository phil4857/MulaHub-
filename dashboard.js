const BACKEND_URL = "https://repo-1red-jipate-bonus-1.onrender.com";

document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = 'login.html';
        return;
    }

    const balanceEl = document.getElementById('balanceDisplay');
    const earningsEl = document.getElementById('earningsDisplay');
    const investedEl = document.getElementById('investedDisplay');
    const msgEl = document.getElementById('msg');
    const commodityGrid = document.getElementById('commodityGrid');
    const investmentList = document.getElementById('investmentList');

    // Load dashboard data
    async function updateUI() {
        msgEl.textContent = "Loading dashboard...";
        msgEl.style.color = "blue";

        try {
            const res = await fetch(`\( {BACKEND_URL}/dashboard?username= \){encodeURIComponent(username)}`);

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                msgEl.style.color = "red";
                if (res.status === 404) {
                    msgEl.textContent = "Dashboard endpoint not found. Check backend deployment.";
                } else if (res.status === 403) {
                    msgEl.textContent = data.detail || "Account not approved yet.";
                } else {
                    msgEl.textContent = data.detail || `Error ${res.status}`;
                }
                logout();
                return;
            }

            const data = await res.json();

            balanceEl.textContent = Number(data.balance || 0).toFixed(2);
            earningsEl.textContent = Number(data.earnings || 0).toFixed(2);

            let invested = 0;
            if (data.investments && typeof data.investments === 'object') {
                Object.values(data.investments).forEach(item => {
                    invested += Number(item.amount || 0);
                });
            }
            investedEl.textContent = invested.toFixed(2);

            renderInvestments(data.investments || {});
            renderCommodityCards();

            msgEl.style.color = "green";
            msgEl.textContent = "Dashboard loaded successfully!";
        } catch (err) {
            msgEl.style.color = "red";
            msgEl.textContent = "Cannot connect to server. Check internet or backend.";
            console.error(err);
        }
    }

    function renderInvestments(investments) {
        investmentList.innerHTML = "";

        if (!investments || Object.keys(investments).length === 0) {
            investmentList.innerHTML = "<p style='text-align:center; color:#777;'>No active investments yet.</p>";
            return;
        }

        for (const [commodity, inv] of Object.entries(investments)) {
            const expiry = new Date(inv.expiry_date);
            const remainingDays = Math.max(Math.floor((expiry - new Date()) / (1000 * 60 * 60 * 24)), 0);
            const div = document.createElement('div');
            div.style.background = '#f0f8f0';
            div.style.padding = '15px';
            div.style.borderRadius = '10px';
            div.style.border = '1px solid #28a745';
            div.innerHTML = `
                <strong>${commodity.toUpperCase()}</strong><br>
                Amount: KES ${inv.amount}<br>
                Expires in: ${remainingDays} day(s)
            `;
            investmentList.appendChild(div);
        }
    }

    function renderCommodityCards() {
        const commodities = [
            { key: "marble", name: "Marble", price: 650, days: 15, img: "https://images.unsplash.com/photo-1618220048045-1a5a6a3b5b5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { key: "crude_oil", name: "Crude Oil", price: 800, days: 20, img: "https://images.unsplash.com/photo-1581092160560-1c1e428e9d65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { key: "silver", name: "Silver", price: 1000, days: 23, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { key: "lead", name: "Lead", price: 1200, days: 25, img: "https://images.unsplash.com/photo-1581092160560-1c1e428e9d65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { key: "platinum", name: "Platinum", price: 1350, days: 28, img: "https://images.unsplash.com/photo-1618220048045-1a5a6a3b5b5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { key: "diamonds", name: "Diamonds", price: 1750, days: 32, img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { key: "gold", name: "Gold", price: 2200, days: 35, img: "https://images.unsplash.com/photo-1610375461248-9d2b9a3f6e1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { key: "uranium", name: "Uranium", price: 3000, days: 45, img: "https://images.unsplash.com/photo-1581092160560-1c1e428e9d65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
        ];

        commodityGrid.innerHTML = "";
        commodities.forEach(com => {
            const card = document.createElement('div');
            card.className = 'commodity-card';
            card.innerHTML = `
                <img src="\( {com.img}" alt=" \){com.name}">
                <div class="commodity-info">
                    <h4>${com.name}</h4>
                    <p>KES ${com.price}</p>
                    <p>${com.days} days</p>
                </div>
            `;
            card.onclick = () => investRequest(com.key);
            commodityGrid.appendChild(card);
        });
    }

    window.investRequest = async function (commodity) {
        msgEl.textContent = "Sending investment request...";
        msgEl.style.color = "blue";

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
                msgEl.style.color = "green";
                msgEl.textContent = data.message || `Request for ${commodity} created. Send KES ${COMMODITY_INFO[commodity].price} to M-Pesa: 0752964507`;
            } else {
                msgEl.style.color = "red";
                msgEl.textContent = data.detail || 'Request failed.';
            }
        } catch (err) {
            msgEl.style.color = "red";
            msgEl.textContent = "Network error during request.";
            console.error(err);
        }
    };

    window.logout = function () {
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    };

    updateUI(); // Initial load
});
</script>
