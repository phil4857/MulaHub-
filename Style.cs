/* ============================================
   Mkoba Wallet - Main Stylesheet
   Light Blue Professional Theme
=========================================== */

/* ── Root Variables ── */
:root {
  --primary: #007bff;        /* Main blue - buttons, links */
  --primary-dark: #0056b3;
  --primary-darker: #003366;  /* Headers, accents */
  --bg-light: #e6f0ff;        /* Page background */
  --card-bg: #ffffff;
  --card-light: #f8f9fa;
  --text-dark: #1a1f36;
  --text-muted: #555;
  --border: #d1d9e6;
  --success: #28a745;
  --danger: #dc3545;
  --warning: #ffc107;
  --info: #17a2b8;
  --radius: 10px;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 20px rgba(0,0,0,0.12);
  --transition: all 0.25s ease;
}

/* ── Global Base ── */
* {
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background-color: var(--bg-light);
  color: var(--text-dark);
  margin: 0;
  padding: 0;
  line-height: 1.6;
  min-height: 100vh;
}

/* ── Layout Containers ── */
.container {
  max-width: 720px;
  margin: 2.5rem auto;
  padding: 2rem;
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border);
}

.small-container {
  max-width: 420px;
  margin: 4rem auto 2rem;
  padding: 1.8rem;
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
}

/* ── Typography ── */
h1, h2, h3 {
  color: var(--primary-darker);
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

h1 { font-size: 1.9rem; }
h2 { font-size: 1.6rem; }
h3 { font-size: 1.35rem; }

/* ── Header / Banner ── */
header {
  background: var(--primary-darker);
  color: white;
  padding: 1.2rem;
  text-align: center;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
}

.payment-info {
  background: #f0f8ff;
  color: var(--primary-darker);
  text-align: center;
  padding: 1rem;
  font-size: 1.05rem;
  font-weight: 600;
  border-bottom: 3px solid var(--primary-darker);
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
}

/* ── Form Elements ── */
input[type="text"],
input[type="password"],
input[type="number"],
input[type="email"],
input[type="tel"],
select,
textarea {
  width: 100%;
  padding: 0.9rem 1.1rem;
  margin: 0.6rem 0 1.2rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  transition: var(--transition);
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
}

/* Buttons */
button,
.btn {
  display: inline-block;
  width: 100%;
  padding: 0.95rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  text-align: center;
}

button:hover,
.btn:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

button:active,
.btn:active {
  transform: translateY(0);
}

button:disabled,
.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.btn-danger {
  background: var(--danger);
}

.btn-danger:hover {
  background: #c82333;
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--primary);
  color: var(--primary);
}

.btn-outline:hover {
  background: var(--primary);
  color: white;
}

/* ── Cards ── */
.user-card,
.commodity-card,
.card {
  border: 1px solid var(--border);
  padding: 1.2rem;
  margin-bottom: 1.2rem;
  border-radius: var(--radius);
  background: #fafcff;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.user-card:hover,
.commodity-card:hover,
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.commodity-card img {
  width: 90px;
  height: 90px;
  object-fit: contain;
  margin: 0 auto 0.8rem;
  display: block;
}

.countdown {
  font-weight: 700;
  color: var(--danger);
  margin-top: 0.5rem;
  font-size: 1.1rem;
}

/* ── Messages / Alerts ── */
.error,
.success,
.info {
  padding: 0.9rem 1.2rem;
  margin: 0.8rem 0;
  border-radius: 8px;
  font-size: 0.95rem;
  text-align: center;
}

.error {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

.success {
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
}

.info {
  color: #0c5460;
  background-color: #d1ecf1;
  border: 1px solid #bee5eb;
}

/* ── Footer ── */
footer {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-top: 3rem;
  border-top: 1px solid var(--border);
}

/* ── Utility Classes ── */
.text-center { text-align: center; }
.mt-1 { margin-top: 1rem; }
.mt-2 { margin-top: 1.5rem; }
.mb-1 { margin-bottom: 1rem; }
.mb-2 { margin-bottom: 1.5rem; }
.p-2 { padding: 1.5rem; }

/* ── Dark Mode (optional - activate with class or prefers-color-scheme) ── */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-light: #0d1b2a;
    --card-bg: #1b263b;
    --text-dark: #e0e7ff;
    --text-muted: #a0aec0;
    --border: #33415c;
  }
  
  body { background: var(--bg-light); color: var(--text-dark); }
  .container, .small-container, .card { background: var(--card-bg); }
}
