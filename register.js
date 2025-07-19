document.getElementById('registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const referral = document.getElementById('referral').value;

  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  if (referral) {
    formData.append('referral', referral);
  }

  try {
    const response = await fetch('https://repo-1red-jipate-bonus.onrender.com/register', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      window.location.href = 'login.html';
    } else {
      alert(data.detail || "Registration failed.");
    }

  } catch (error) {
    alert("An error occurred. Try again later.");
    console.error(error);
  }
});
