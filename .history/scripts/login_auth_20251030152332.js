// scripts/login_auth.js
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // ---- Configuration ----
  const VALID_USERNAME = "procurementteam";
  const VALID_PASSWORD = "dmi@2025";
  const REDIRECT_URL = "pages/09_Procurement/tasheer_Procurment_DMI.html";
  // ------------------------

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const message = document.getElementById('loginMessage');

  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    window.location.href = REDIRECT_URL;
  } else {
    message.textContent = "Invalid username or password.";
    message.style.display = 'block';
    setTimeout(() => { message.style.display = 'none'; }, 3000);
  }
});
