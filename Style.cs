/* Updated CSS Styling with Enhanced UI and Blue Background Theme */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #e6f0ff; /* Light blue background */
  color: #222;
  margin: 0;
  padding: 0;
  line-height: 1.6;
}

.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}

h1, h2, h3 {
  color: #003366;
  margin-bottom: 20px;
  text-align: center;
}

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

input:focus,
button:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

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

.error {
  color: red;
  font-size: 14px;
  margin-top: -5px;
  margin-bottom: 10px;
  display: block;
}

.success {
  color: green;
  font-size: 14px;
  margin-top: -5px;
  margin-bottom: 10px;
  display: block;
}

footer {
  text-align: center;
  padding: 20px;
  font-size: 14px;
  color: #555;
}
