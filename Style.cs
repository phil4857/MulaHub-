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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease-in-out;
  border: 1px solid #ccc; 
}

.small-container {
  max-width: 400px;
  margin: 60px auto;
  padding: 25px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

/* ----------------------------------------
   Headers & Titles
---------------------------------------- */
header {
  background: #003366; 
  color: white;
  padding: 15px;
  text-align: center;
  border-radius: 8px;
}

h1, h2, h3 {
  color: #003366; 
  margin-bottom: 20px;
  text-align: center;
  text-transform: uppercase;
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
  border-radius: 5px; 
}

/* ----------------------------------------
   Inputs & Buttons
---------------------------------------- */
input[type='text'],
input[type='password'],
input[type='number'],
input[type='email'],
select,
button {
  width: 100%;
  padding: 12px 15px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus,
select:focus,
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

.btn-danger {
  background-color: #cc0000; 
}

.btn-danger:hover {
  background-color: #990000; 
}

/* ----------------------------------------
   Cards & User Data
---------------------------------------- */
.user-card, .commodity-card {
  border: 1px solid #ccc;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 8px;
  background-color: #f9f9f9; 
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s ease-in-out;
}

.user-card:hover, .commodity-card:hover {
  transform: translateY(-3px);
}

/* Images inside cards */
.commodity-card img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 8px;
}

/* Countdown timer inside investment cards */
.countdown {
  font-weight: 700;
  color: #e53e3e;
  margin-top: 6px;
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
  background-color: #ffe6e6;
  padding: 10px;
  border-radius: 5px;
}

.success {
  color: green;
  font-size: 14px;
  margin-top: -5px;
  margin-bottom: 10px;
  display: block;
  text-align: center;
  background-color: #e6ffe6;
  padding: 10px;
  border-radius: 5px;
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
