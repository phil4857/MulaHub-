Thanks for sharing the `invest.js` file! Let's enhance it based on the updated requirements and ensure it works smoothly with your modified HTML.

### Suggested Improvements for `invest.js`

1. **Dynamic Minimum Investment**: Ensure the script checks the selected commodity’s price and validates the investment amount accordingly.
2. **Display Countdown Timers**: Integrate logic to show countdowns for the next earnings and the expiry of investments.
3. **Error Handling**: Improve error handling to provide clearer user feedback.
4. **Multiple Commodities**: Adjust the investment submission to accommodate multiple commodities.

### Updated `invest.js`

Here’s the revised version of the `invest.js` file:

```javascript
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

  if (!username) {
    alert('Please log in to invest.');
    window.location.href = 'login.html';
    return;
  }

  usernameDisplay.textContent = username;

  async function refreshUser() {
    try {
      const res = await fetch(`${API_BASE}/dashboard?username=${encodeURIComponent(username)}`);
      if (!res.ok) throw new Error('Failed to load user info');
      const data = await res.json();
      balanceDisplay.textContent = Number(data.balance || 0).toFixed(2);
      pendingInv.textContent = Number(data.investment_amount || 0).toFixed(2);
      paymentNumberEl.textContent = data.payment_number || paymentNumberEl.textContent;
    } catch (err) {
      console.warn('refresh user error', err);
    }
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
    const minInvestment = commoditySelect.options[commoditySelect.selectedIndex].getAttribute('data-min');

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

      // ✅ Secret admin notification
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
```

### Key Features Implemented

1. **Dynamic Minimum Investment Check**: The script now retrieves the minimum investment requirement based on the selected commodity, preventing users from submitting too low amounts.
  
2. **Commodity Integration**: The user's selected commodity is sent along with the investment details to the backend.

3. **Improved Error Handling**: Clear user feedback is provided for various error scenarios, making it easier for users to understand what went wrong.

### Next Steps

- **Countdown Logic**: If you want to implement countdown timers for the next earning or expiry, you can add a function that calculates the time left based on the investment details fetched from the backend.
  
- **Testing**: Make sure to test the changes thoroughly to ensure that they work well with your backend and the overall application flow.

Let me know if you need further adjustments or if you have any additional files to share!
