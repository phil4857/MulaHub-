// Hardcoded backend URL (you can still switch to environment variables later if needed)
const API_BASE = "https://repo-1red-jipate-bonus-2.onrender.com";

const login = async () => {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: "admin",
        password: "admin123", // Replace this with a real input field if needed
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Login failed");
    }

    console.log("✅ Login success:", data);
  } catch (error) {
    console.error("❌ Login error:", error.message);
  }
};

// Call the login function (for test purposes)
login();
