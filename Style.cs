/* ----------------------------------------
   Global Styles – Mkoba Wallet Light Blue Theme
---------------------------------------- */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #e6f0ff; /* Soft light blue */
  color: #222;
  margin: 0;
  padding: 0;
  line-height: 1.6;
}

/* ----------------------------------------
   Layout Containers
---------------------------------------- */
.container {
  max-width: 700px;
  margin: 40px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}

/* Small containers (login forms, cards) */
.small-container {
  max-width: 400px;
  margin: 60px auto;
  padding: 25px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

/* ----------------------------------------
   Headers & Titles
---------------------------------------- */
header {
  background: #003366;
  color: white;
  padding: 15px;
  text-align: center;
}

h1, h2, h3 {
  color: #003366;
  margin-bottom: 20px;
  text-align: center;
}

/* ----------------------------------------
   Payment Info Banner
---------------------------------------- */
.payment-info {
  background: #f0f8ff;
  color: #003366;
  text-align: center;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 2px solid #003366;
}

/* ----------------------------------------
   Inputs & Buttons
---------------------------------------- */
input[type="text"],
input[type="password"],
input[type="number"],
input[type="email"],
button {
  width: 100%;
  padding: 12px 15px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
}

/* Focus state for inputs and buttons */
input:focus,
button:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Buttons */
button {
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

button[disabled] {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Danger button (logout, delete) */
.btn-danger {
  background-color: #cc0000;
}

.btn-danger:hover {
  background-color: #990000;
}

/* ----------------------------------------
   Cards & User Data
---------------------------------------- */
.user-card {
  border: 1px solid #ccc;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

/* ----------------------------------------
   Messages
---------------------------------------- */
.error {
  color: #cc0000;
  font-size: 14px;
  margin-top: -5px;
  margin-bottom: 10px;
  display: block;
  text-align: center;
}

.success {
  color: green;
  font-size: 14px;
  margin-top: -5px;
  margin-bottom: 10px;
  display: block;
  text-align: center;
}

/* ----------------------------------------
   Footer
---------------------------------------- */
footer {
  text-align: center;
  padding: 20px;
  font-size: 14px;
  color: #555;
}
