function register() {
  let user = {
    name: document.getElementById("name").value,
    surname: document.getElementById("surname").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };
  localStorage.setItem("user", JSON.stringify(user));
  alert("Registered successfully");
  window.location = "login.html";
}

function login() {
  let phone = document.getElementById("phone").value;
  let pass = document.getElementById("password").value;
  let user = JSON.parse(localStorage.getItem("user"));
  if (user && user.phone === phone && user.password === pass) {
    sessionStorage.setItem("auth", "true");
    window.location = "index.html";
  } else {
    alert("Invalid credentials");
  }
}

function logout() {
  sessionStorage.removeItem("auth");
  window.location = "index.html";
}
