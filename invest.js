document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  if(!username){ alert("Please log in."); window.location.href="login.html"; return; }

  const commoditySelect = document.getElementById("commodity");
  const amountInput = document.getElementById("amount");
  const investOtpInput = document.getElementById("investOtp");
  const investOtpSection = document.getElementById("otpSection");
  const otpDisplay = document.getElementById("otpDisplay");
  const investMessage = document.getElementById("investMessage");
  const activeInvestmentsEl = document.getElementById("activeInvestments");

  let fakeInvestOTP = null;

  function getUser(){
    const users = JSON.parse(localStorage.getItem("users")||"{}");
    return users[username];
  }

  function saveUser(user){
    const users = JSON.parse(localStorage.getItem("users")||"{}");
    users[username]=user;
    localStorage.setItem("users",JSON.stringify(users));
  }

  function renderInvestments(){
    const user = getUser();
    const investments = user.investments || [];
    activeInvestmentsEl.innerHTML = "";
    if(investments.length===0){ activeInvestmentsEl.textContent="No active investments."; return; }

    const commodityImages = {
      marble:'https://i.imgur.com/0X2U6hX.png',
      crude_oil:'https://i.imgur.com/6zQyGzK.png',
      silver:'https://i.imgur.com/T0M2Pz2.png',
      lead:'https://i.imgur.com/OU8b5wC.png',
      platinum:'https://i.imgur.com/1oC0fIq.png',
      diamonds:'https://i.imgur.com/akRhzZk.png',
      gold:'https://i.imgur.com/9O3qGZx.png',
      uranium:'https://i.imgur.com/Xxg1XYJ.png'
    };

    investments.forEach(inv=>{
      const div = document.createElement("div");
      div.className="investment-card";

      const img = document.createElement("img");
      img.src = commodityImages[inv.commodity]||"";
      img.alt = inv.commodity;

      const info = document.createElement("div");
      info.className="investment-info";
      info.innerHTML=`<strong>${inv.commodity.replace('_',' ').toUpperCase()}</strong>
        <div>Invested: KES ${inv.amount}</div>
        <div>Daily Earnings: KES ${(inv.amount*0.1).toFixed(2)}</div>
        <div class="countdown" data-expiry="${new Date(inv.start_date).getTime()+inv.duration_days*24*60*60*1000}"></div>`;

      div.appendChild(img);
      div.appendChild(info);
      activeInvestmentsEl.appendChild(div);
    });
    startCountdowns();
  }

  function startCountdowns(){
    const countdowns = document.querySelectorAll(".countdown");
    function update(){
      const now = Date.now();
      countdowns.forEach(c=>{
        const expiry = Number(c.dataset.expiry);
        const diff = expiry-now;
        if(diff<=0){ c.textContent="Expired"; }
        else {
          const d=Math.floor(diff/(1000*60*60*24));
          const h=Math.floor((diff%(1000*60*60*24))/(1000*60*60));
          const m=Math.floor((diff%(1000*60*60))/(1000*60));
          c.textContent=`Expires in: ${d}d ${h}h ${m}m`;
        }
      });
    }
    update();
    setInterval(update,60000);
  }

  // Request Investment OTP
  document.getElementById("investBtn").addEventListener("click",()=>{
    const commodity = commoditySelect.value;
    const amount = Number(amountInput.value);
    if(!commodity){ investMessage.textContent="Select a commodity"; return; }
    const min = Number(commoditySelect.options[commoditySelect.selectedIndex].dataset.min);
    if(!amount || amount<min){ investMessage.textContent=`Minimum for ${commodity} is KES ${min}`; return; }

    fakeInvestOTP = Math.floor(1000+Math.random()*9000).toString();
    otpDisplay.textContent=`Your OTP: ${fakeInvestOTP}`;
    investOtpSection.style.display="block";
    investMessage.textContent="";
    
    const user = getUser();
    user.pendingInvestment={commodity, amount, start_date:new Date().toISOString(), duration_days:7};
    saveUser(user);
  });

  // Confirm Investment
  document.getElementById("investConfirmBtn").addEventListener("click",()=>{
    const otp = investOtpInput.value.trim();
    if(otp!==fakeInvestOTP){ investMessage.textContent="Incorrect OTP"; return; }

    const user = getUser();
    const inv = user.pendingInvestment;
    if(!inv){ investMessage.textContent="No pending investment"; return; }

    user.balance=(user.balance||0)-inv.amount;
    if(!user.investments) user.investments=[];
    user.investments.push(inv);
    delete user.pendingInvestment;
    saveUser(user);

    investOtpInput.value="";
    investOtpSection.style.display="none";
    otpDisplay.textContent="";
    fakeInvestOTP=null;
    investMessage.textContent="Investment successful!";
    renderInvestments();
  });

  window.logout=()=>{
    localStorage.removeItem("username");
    window.location.href="login.html";
  }

  renderInvestments();
});
