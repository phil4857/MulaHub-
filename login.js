document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  try {
    const response = await fetch('https://repo-1red-jipate-bonus.onrender.com/login', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      localStorage.setItem("username", username);
      window.location.href = 'dashboard.html';
    } else {
      alert(data.detail || "Login failed.");
    }

  } catch (error) {
    alert("An error occurred. Try again later.");
    console.error(error);
  }
});
