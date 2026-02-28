document.addEventListener('DOMContentLoaded', async () => {
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = 'login.html';
        return;
    }

    const balanceEl = document.getElementById('balanceDisplay');
    const investmentListEl = document.getElementById('investmentList');
    const investOtpSection = document.getElementById('investOtpSection');
    const investOtpInput = document.getElementById('investOtp');
    const investOtpDisplay = document.getElementById('investOtpDisplay');
    const withdrawAmountInput = document.getElementById('withdrawAmount');
    const withdrawOtpSection = document.getElementById('withdrawOtpSection');
    const withdrawOtpInput = document.getElementById('withdrawOtp');
    const withdrawOtpDisplay = document.getElementById('withdrawOtpDisplay');

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
        const response = await fetch(http://localhost:8000/dashboard?username=${username}, {
            method: 'GET',
            headers: {
                'Authorization': Bearer ${localStorage.getItem('userToken')}
            }
        });
        if (!response.ok) {
            alert('Failed to fetch user data.');
            logout();
            return;
        }
        return await response.json();
    }

    async function updateUI() {
        const user = await fetchUserData();
        if (user) {
            balanceEl.textContent = KES ${user.balance.toFixed(2)};
            renderInvestments(user.investments);
        }
    }

    function renderInvestments(investments) {
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
                timeText = ${days} days remaining;
            } else {
                // Auto-credit earnings once expired
                alert(Investment in ${commodity} has expired. Earnings credited.);
                // Update user's balance (assumed logic)
                inv.total_earned = inv.amount * 1.2; // Example earning
                await fetch(http://localhost:8000/invest/confirm, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': Bearer ${localStorage.getItem('userToken')}
                    },
                    body: JSON.stringify({ username, commodity })
                });
                updateUI(); // Refresh UI
                return;
            }

            div.textContent = ${commodity.toUpperCase()} | KES ${inv.amount} | ${timeText};
            investmentListEl.appendChild(div);
        }
    }

    // ===== INVEST REQUEST =====
    document.getElementById('investBtn')?.addEventListener('click', async () => {
        const commodity = document.getElementById('commodity').value;
        const user = await fetchUserData();

        if (!commodities[commodity]) return alert("Select a valid commodity.");
        if (user.balance < commodities[commodity].price) return alert("Insufficient balance.");

        // Request OTP from backend
        const response = await fetch('http://localhost:8000/invest/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Bearer ${localStorage.getItem('userToken')}
            },
            body: JSON.stringify({ username, commodity })
        });

        if (!response.ok) {
            alert('Investment request failed.');
            return;
        }

        const data = await response.json();
        investOtpDisplay.textContent = Your OTP: ${data.message};
        investOtpSection.style.display = 'block';
    });

    // ===== INVEST CONFIRM =====
    document.getElementById('investConfirmBtn')?.addEventListener('click', async () => {
        const otp = investOtpInput.value.trim();
        if (!otp) return alert("Enter OTP");

        const response = await fetch('http://localhost:8000/invest/confirm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Bearer ${localStorage.getItem('userToken')}
            },
            body: JSON.stringify({ username, otp })
        });

        if (!response.ok) {
            alert('Investment confirmation failed.');
            return;
        }

        alert('Investment confirmed!');
        investOtpSection.style.display = 'none';
        investOtpInput.value = '';
        investOtpDisplay.textContent = '';

        updateUI();
    });

    // ===== WITHDRAW REQUEST =====
    document.getElementById('withdrawBtn')?.addEventListener('click', async () => {
        const today = new Date();
        if (today.getDay() !== 1) return alert("Withdrawals allowed only on Monday");

        const amount = parseFloat(withdrawAmountInput.value);
        const user = await fetchUserData();

        if (!amount || amount <= 0) return alert("Enter valid amount");
        if (amount > user.balance) return alert("Insufficient balance");

        // Request OTP from backend
        const response = await fetch('http://localhost:8000/withdraw/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Bearer ${localStorage.getItem('userToken')}
            },
            body: JSON.stringify({ username, amount })
        });

        if (!response.ok) {
            alert('Withdrawal request failed.');
            return;
        }

        const data = await response.json();
        withdrawOtpDisplay.textContent = Your OTP: ${data.message};
        withdrawOtpSection.style.display = 'block';
    });

    // ===== WITHDRAW CONFIRM =====
    document.getElementById('withdrawConfirmBtn')?.addEventListener('click', async () => {
        const otp = withdrawOtpInput.value.trim();
        if (!otp) return alert("Enter OTP");

        const response = await fetch('http://localhost:8000/withdraw/confirm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Bearer ${localStorage.getItem('userToken')}
            },
            body: JSON.stringify({ username, otp })
        });

        if (!response.ok) {
            alert('Withdrawal confirmation failed.');
            return;
        }

        alert('Withdrawal successful!');
        withdrawOtpSection.style.display = 'none';
        withdrawOtpInput.value = '';
        withdrawOtpDisplay.textContent = '';

        updateUI();
    });

    window.logout = function () {
        localStorage.removeItem('username');
        localStorage.removeItem('userToken');
        window.location.href = 'login.html';
    };

    updateUI(); // Initial UI update
});
