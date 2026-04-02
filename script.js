// daily-bonus.js
document.addEventListener("DOMContentLoaded", () => {
// ── Early exit if not logged in ──
const username = localStorage.getItem("username");
if (!username) {
alert("Please log in to claim your daily bonus.");
window.location.href = "login.html";
return;
}

// ── DOM elements ──  
const countdownEl = document.getElementById("countdown");  
const grabBtn     = document.getElementById("grabBonusBtn");  

if (!countdownEl || !grabBtn) {  
    console.warn("Required elements #countdown or #grabBonusBtn not found.");  
    return;  
}

What does it contain
