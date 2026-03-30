// Reusable function for all admin actions
async function adminAction(endpoint, extraData = {}, successMsg, callback) {
  try {
    const res = await fetch(`\( {BACKEND_URL}/admin/ \){endpoint}`, {   // ← Fixed syntax
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        ...extraData, 
        password: ADMIN_PASSWORD 
      })
    });

    let result;
    try {
      result = await res.json();
    } catch (e) {
      result = { detail: "Unknown server error" };
    }

    if (res.ok) {
      showMessage("success", successMsg || result.message || "Action successful");
      if (callback) callback();
    } else {
      showMessage("error", result.detail || result.message || `Error ${res.status}`);
      console.error("Server error:", result);
    }
  } catch (err) {
    console.error("Network error:", err);
    showMessage("error", "Network error - check your internet or server");
  }
}
