const backendUrl = "https://jipate-bonus-ylut.onrender.com"; // your Render backend

function postData(url, formData) {
  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("response").innerText = JSON.stringify(data, null, 2);
    })
    .catch((err) => {
      document.getElementById("response").innerText = "Error: " + err;
    });
}

document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  postData(`${backendUrl}/register`, formData);
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  postData(`${backendUrl}/login`, formData);
});

document.getElementById("investForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  postData(`${backendUrl}/invest`, formData);
});

document.getElementById("withdrawForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  postData(`${backendUrl}/withdraw`, formData);
});
