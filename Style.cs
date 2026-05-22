/* ============================================
   MulaHub - Main Stylesheet
   Green • Gold • Navy Theme
============================================ */

/* ── Root Variables ── */
:root {
  --primary: #10B981;
  --primary-dark: #059669;
  --primary-darker: #0F172A;

  --bg-light: #F8FAFC;
  --card-bg: #FFFFFF;
  --card-light: #F1F5F9;

  --text-dark: #1E293B;
  --text-muted: #64748B;

  --border: #E2E8F0;

  --success: #22C55E;
  --danger: #EF4444;
  --warning: #F59E0B;
  --info: #06B6D4;

  --radius: 12px;

  --shadow-sm: 0 2px 10px rgba(15, 23, 42, 0.08);
  --shadow-md: 0 8px 30px rgba(15, 23, 42, 0.12);

  --transition: all 0.25s ease;
}

/* ── Global Base ── */
* {
  box-sizing: border-box;
}

body {
  font-family: "Poppins", "Segoe UI", system-ui, sans-serif;
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
  border: 1px solid var(--border);
}

/* ── MulaHub Logo ── */
.logo {
  font-size: 2rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  color: #10B981;
}

.logo span {
  color: #F59E0B;
}

/* ── Typography ── */
h1,
h2,
h3 {
  color: var(--primary-darker);
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

h1 {
  font-size: 2rem;
}

h2 {
  font-size: 1.7rem;
}

h3 {
  font-size: 1.35rem;
}

/* ── Header ── */
header {
  background: linear-gradient(
    135deg,
    #0F172A,
    #10B981
  );
  color: white;
  padding: 1.5rem;
  text-align: center;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-md);
}

.payment-info {
  background: #ECFDF5;
  color: #065F46;
  text-align: center;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-left: 5px solid #10B981;
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
  padding: 0.95rem 1rem;
  margin: 0.6rem 0 1.2rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  transition: var(--transition);
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #10B981;
  box-shadow: 0 0 0 4px rgba(16,185,129,.15);
}

/* ── Buttons ── */
button,
.btn {
  display: inline-block;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(
    135deg,
    #10B981,
    #059669
  );
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  text-align: center;
}

button:hover,
.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

button:disabled,
.btn:disabled {
  background: #CBD5E1;
  cursor: not-allowed;
  transform: none;
}

.btn-danger {
  background: linear-gradient(
    135deg,
    #EF4444,
    #DC2626
  );
}

.btn-outline {
  background: transparent;
  border: 2px solid #10B981;
  color: #10B981;
}

.btn-outline:hover {
  background: #10B981;
  color: white;
}

/* ── Cards ── */
.user-card,
.commodity-card,
.card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.2rem;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  transition: var(--transition);
}

.user-card:hover,
.commodity-card:hover,
.card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.commodity-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 5px;
  width: 100%;
  background: linear-gradient(
    90deg,
    #10B981,
    #F59E0B
  );
}

.commodity-card img {
  width: 90px;
  height: 90px;
  object-fit: contain;
  display: block;
  margin: 0 auto 1rem;
}

.countdown {
  font-weight: 700;
  color: var(--danger);
  margin-top: 0.5rem;
  font-size: 1.05rem;
}

/* ── Alerts ── */
.error,
.success,
.info {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 10px;
  text-align: center;
}

.error {
  background: #FEE2E2;
  color: #991B1B;
}

.success {
  background: #DCFCE7;
  color: #166534;
}

.info {
  background: #E0F2FE;
  color: #075985;
}

/* ── Footer ── */
footer {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--text-muted);
  margin-top: 3rem;
  border-top: 1px solid var(--border);
}

/* ── Utilities ── */
.text-center {
  text-align: center;
}

.mt-1 {
  margin-top: 1rem;
}

.mt-2 {
  margin-top: 1.5rem;
}

.mb-1 {
  margin-bottom: 1rem;
}

.mb-2 {
  margin-bottom: 1.5rem;
}

.p-2 {
  padding: 1.5rem;
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .container,
  .small-container {
    margin: 1rem;
    padding: 1.2rem;
  }

  h1 {
    font-size: 1.7rem;
  }

  h2 {
    font-size: 1.4rem;
  }
}

/* ── Dark Mode ── */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-light: #020617;
    --card-bg: #0F172A;
    --card-light: #1E293B;
    --text-dark: #F8FAFC;
    --text-muted: #CBD5E1;
    --border: #334155;
  }
}
