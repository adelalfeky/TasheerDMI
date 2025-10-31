

// scripts/login_auth.js

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const message = document.getElementById('loginMessage');

  // --- Configuration: credentials and routes ---
  const USERS = [
    {
      username: "procurementteam",
      password: "dmi@2025",
      route: "pages/09_Procurement/tasheer_Procurment_DMI.html"
    },
    {
      username: "productteam",
      password: "Dim@12",
      route: "pages/004- Product/dmi_assessment_Product.html"
    }
  ];
  // ---------------------------------------------

  // Try to find a matching user
  const matchedUser = USERS.find(
    user => user.username === username && user.password === password
  );

  if (matchedUser) {
    // ✅ Success — redirect to that user's page
    window.location.href = matchedUser.route;
  } else {
    // ❌ Invalid credentials
    message.textContent = "Invalid username or password.";
    message.style.display = 'block';
    setTimeout(() => { message.style.display = 'none'; }, 3000);
  }
});
