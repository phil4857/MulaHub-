(async () => {
  const API_BASE = 'https://repo-1red-jipate-bonus.onrender.com';
  const username = localStorage.getItem('username');

  const amountEl = document.getElementById('amount');
  const txRefEl = document.getElementById('txRef');
  const msgEl = document.getElementById('investMessage');
  const usernameDisplay = document.getElementById('usernameDisplay');
  const balanceDisplay = document.getElementById('balanceDisplay');
  const pendingInv = document.getElementById('pendingInv');
  const paymentNumberEl = document.getElementById('paymentNumber');
  const commoditySelect = document.getElementById('commoditySelect');

  // Container for active investments
  let investmentsContainer = document.getElementById('activeInvestments');
  if (!investmentsContainer) {
    investmentsContainer = document.createElement('div');
    investmentsContainer.id = 'activeInvestments';
    investmentsContainer.style.marginTop = '20px';
    document.querySelector('.panel').appendChild(investmentsContainer);
  }

  if (!username) {
    alert('Please log in to invest.');
    window.location.href = 'login.html';
    return;
  }

  usernameDisplay.textContent = username;

  const commodityImages = {
    marble: 'https://i.imgur.com/0X2U6hX.png',
    crude_oil: 'https://i.imgur.com/6zQyGzK.png',
    silver: 'https://i.imgur.com/T0M2Pz2.png',
    lead: 'https://i.imgur.com/OU8b5wC.png',
    platinum: 'https://i.imgur.com/1oC0fIq.png',
    diamonds: 'https://i.imgur.com/akRhzZk.png',
    gold: 'https://i.imgur.com/9O3qGZx.png',
    uranium: 'https://i.imgur.com/Xxg1XYJ.png'
  };

  async function refreshUser() {
    try {
      const res = await fetch(`${API_BASE}/dashboard?username=${encodeURIComponent(username)}`);
      if (!res.ok) throw new Error('Failed to load user info');
      const data = await res.json();

      balanceDisplay.textContent = Number(data.balance || 0).toFixed(2);
      pendingInv.textContent = Number(data.investment_amount || 0).toFixed(2);
      paymentNumberEl.textContent = data.payment_number || paymentNumberEl.textContent;

      // Display active investments
      displayActiveInvestments(data.active_investments || []);
    } catch (err) {
      console.warn('refresh user error', err);
    }
  }

  function displayActiveInvestments(investments) {
    investmentsContainer.innerHTML = '';
    if (investments.length === 0) {
      investmentsContainer.textContent = 'No active investments yet.';
      return;
    }

    investments.forEach(inv => {
      const card = document.createElement('div');
      card.style.border = '1px solid #e5e7eb';
      card.style.borderRadius = '10px';
      card.style.padding = '12px';
      card.style.marginBottom = '10px';
      card.style.display = 'flex';
      card.style.alignItems = 'center';
      card.style.gap = '12px';
      card.style.background = '#f8faf9';

      const img = document.createElement('img');
      img.src = commodityImages[inv.commodity] || '';
      img.alt = inv.commodity;
      img.style.width = '60px';
      img.style.height = '60px';
      img.style.objectFit = 'contain';

      const info = document.createElement('div');
      info.style.flex = '1';

      const name = document.createElement('div');
      name.innerHTML = `<strong>${inv.commodity.replace('_', ' ').toUpperCase()}</strong>`;

      const amount = document.createElement('div');
      amount.textContent = `Invested: KES ${Number(inv.amount).toFixed(2)}`;

      const earnings = document.createElement('div');
      earnings.textContent = `Daily Earnings: KES ${(inv.amount * 0.1).toFixed(2)}`;

      const expiry = document.createElement('div');
      expiry.className = 'expiryCountdown';
      expiry.dataset.expiry = new Date(inv.start_date).getTime() + inv.duration_days * 24 * 60 * 60 * 1000;

      info.appendChild(name);
      info.appendChild(amount);
      info.appendChild(earnings);
      info.appendChild(expiry);

      card.appendChild(img);
      card.appendChild(info);
      investmentsContainer.appendChild(card);
    });

    startCountdowns();
  }

  function startCountdowns() {
    const countdowns = document.querySelectorAll('.expiryCountdown');

    function updateCountdown() {
      const now = Date.now();
      countdowns.forEach(c => {
        const expiryTime = Number(c.dataset.expiry);
        const remaining = expiryTime - now;

        if (remaining <= 0) {
          c.textContent = 'Expired';
        } else {
          const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
          const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          c.textContent = `Expires in: ${days}d ${hours}h ${minutes}m`;
        }
      });
    }

    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute
  }

  await refreshUser();

  async function notifyAdmin(type, username, amount, extra = {}) {
    try {
      await fetch(`${API_BASE}/notify_admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, username, amount, ...extra })
      });
    } catch (err) {
      console.warn('Admin notification failed:', err);
    }
  }

  document.getElementById('investForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    msgEl.textContent = '';

    const amount = Number(amountEl.value);
    const txRef = (txRefEl.value || '').trim() || `tx-${Date.now()}`;
    const selectedCommodity = commoditySelect.value;
    const minInvestment = Number(commoditySelect.options[commoditySelect.selectedIndex].getAttribute('data-min'));

    if (!amount || amount < minInvestment) {
      msgEl.textContent = `Please enter a valid amount (minimum KES ${minInvestment}).`;
      return;
    }

    msgEl.textContent = 'Submitting investment…';

    try {
      const res = await fetch(`${API_BASE}/invest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, amount, transaction_ref: txRef, commodity: selectedCommodity })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || 'Investment failed');

      msgEl.textContent = data.message || 'Investment submitted. Awaiting admin approval.';
      notifyAdmin('investment', username, amount, { transaction_ref: txRef });

      amountEl.value = '';
      txRefEl.value = '';
      await refreshUser();
    } catch (err) {
      console.error('investment error', err);
      msgEl.textContent = err.message || 'Error submitting investment. Try again.';
    }
  });

  document.getElementById('cancelBtn').addEventListener('click', () => {
    amountEl.value = '';
    txRefEl.value = '';
    msgEl.textContent = '';
  });
})();
