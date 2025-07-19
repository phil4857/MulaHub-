const backend = "https://repo-1red-jipate-bonus.onrender.com";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const res = await fetch(`${backend}/register`, {
    method: "POST",
    body: formData,
  });
  alert(await res.text());
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const res = await fetch(`${backend}/login`, {
    method: "POST",
    body: formData,
  });
  alert(await res.text());
});

document.getElementById("investForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const res = await fetch(`${backend}/invest`, {
    method: "POST",
    body: formData,
  });
  alert(await res.text());
});

document.getElementById("withdrawForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const res = await fetch(`${backend}/withdraw`, {
    method: "POST",
    body: formData,
  });
  alert(await res.text());
});
