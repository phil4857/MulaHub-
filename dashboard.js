document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username");
  if (!username) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  const balanceEl = document.getElementById("balanceDisplay");
  const investmentListEl = document.getElementById("investmentList");
  const commoditySelect = document.getElementById("commodity");
  const investOtpSection = document.getElementById("investOtpSection");
  const investOtpInput = document.getElementById("investOtp");
  const withdrawAmountInput = document.getElementById("withdrawAmount");
  const withdrawOtpSection = document.getElementById("withdrawOtpSection");
  const withdrawOtpInput = document.getElementById("withdrawOtp");

  let investmentsData = {};

  async function loadDashboard() {
    try {
      const res = await fetch(`https://repo-1red-jipate-bonus.onrender.com/dashboard?username=${encodeURIComponent(username)}`);
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      const data = await res.json();
      balanceEl.textContent = `KES ${parseFloat(data.balance||0).toFixed(2)}`;
      investmentsData = data.investments || {};
      renderInvestments();
    } catch(err) {
      console.error(err);
      alert("Dashboard load failed: " + err.message);
    }
  }

  function renderInvestments(){
    investmentListEl.innerHTML = "";
    if(Object.keys(investmentsData).length===0){
      investmentListEl.textContent = "No active investments.";
      return;
    }
    for(const [commodity, inv] of Object.entries(investmentsData)){
      const div = document.createElement("div");
      div.id = `invest-${commodity}`;
      div.textContent = `${commodity}: KES ${inv.amount} | Expires in ${inv.time_remaining}`;
      div.className = "investment-item";
      investmentListEl.appendChild(div);
    }
  }

  // Investment request
  document.getElementById("investBtn")?.addEventListener("click", async () => {
    const commodity = commoditySelect.value;
    const form = new URLSearchParams({ username, commodity });
    try {
      const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/invest/request", {
        method: "POST",
        body: form
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.detail);
      alert(data.message + " Enter OTP to confirm investment.");
      investOtpSection.style.display = "block";
    } catch(err) {
      alert("Investment request failed: "+err.message);
    }
  });

  // Investment confirm
  document.getElementById("investConfirmBtn")?.addEventListener("click", async () => {
    const otp = investOtpInput.value;
    if(!otp) return alert("Enter OTP");
    const form = new URLSearchParams({ username, otp });
    try {
      const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/invest/confirm", {
        method: "POST",
        body: form
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.detail);
      alert(data.message);
      investOtpSection.style.display = "none";
      investOtpInput.value = "";
      await loadDashboard();
    } catch(err) {
      alert("Investment confirmation failed: "+err.message);
    }
  });

  // Withdrawal request
  document.getElementById("withdrawBtn")?.addEventListener("click", async () => {
    const amount = withdrawAmountInput.value;
    if(!amount || isNaN(amount) || Number(amount)<=0) return alert("Enter valid amount");
    const form = new URLSearchParams({ username, amount });
    try {
      const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/withdraw/request", {
        method: "POST",
        body: form
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.detail);
      alert(data.message + " Enter OTP to confirm withdrawal.");
      withdrawOtpSection.style.display = "block";
    } catch(err) {
      alert("Withdrawal request failed: "+err.message);
    }
  });

  // Withdrawal confirm
  document.getElementById("withdrawConfirmBtn")?.addEventListener("click", async () => {
    const otp = withdrawOtpInput.value;
    if(!otp) return alert("Enter OTP");
    const form = new URLSearchParams({ username, otp });
    try {
      const res = await fetch("https://repo-1red-jipate-bonus.onrender.com/withdraw/confirm", {
        method: "POST",
        body: form
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.detail);
      alert(data.message);
      withdrawOtpSection.style.display = "none";
      withdrawOtpInput.value = "";
      await loadDashboard();
    } catch(err) {
      alert("Withdrawal confirmation failed: "+err.message);
    }
  });

  // Countdown updater
  setInterval(()=>{
    for(const [commodity, inv] of Object.entries(investmentsData)){
      const div = document.getElementById(`invest-${commodity}`);
      if(!div) continue;
      const expiry = new Date(inv.expiry_date);
      const now = new Date();
      const diff = expiry - now;
      if(diff>0){
        const h = Math.floor(diff/3600000);
        const m = Math.floor((diff%3600000)/60000);
        const s = Math.floor((diff%60000)/1000);
        div.textContent = `${commodity}: KES ${inv.amount} | Expires in ${h}h ${m}m ${s}s`;
      }else{
        div.textContent = `${commodity}: KES ${inv.amount} | Expired`;
      }
    }
  },1000);

  loadDashboard();
});
