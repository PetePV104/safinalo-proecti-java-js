const API_BASE_URL = "https://rentcar.stepprojects.ge/api/Users";
const TOKEN_KEY = "authToken";
const USER_KEY = "currentUser";

document.addEventListener("DOMContentLoaded", () => {
  initializeAuthUI();
  checkAndShowWelcomeBanner();
});

function checkAndShowWelcomeBanner() {
  const token = localStorage.getItem(TOKEN_KEY);
  const user = localStorage.getItem(USER_KEY);
  const isIndexPage =
    window.location.pathname.includes("index.html") ||
    window.location.pathname.endsWith("/");
  const isContactPage = window.location.pathname.includes("contact.html");

  if (token && user && (isIndexPage || isContactPage)) {
    showWelcomeBanner(JSON.parse(user));
  }
}

function showWelcomeBanner(user) {
  const mainTag = document.querySelector("main");
  if (!mainTag) return;

  const bannerExists = document.getElementById("auth-welcome-banner");
  if (bannerExists) return;

  const banner = document.createElement("section");
  banner.id = "auth-welcome-banner";
  banner.className = "section";
  banner.style.cssText = `
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
    padding: 30px 20px;
    text-align: center;
    color: white;
  `;
  banner.innerHTML = `
    <div class="container">
      <h2 style="margin-bottom: 10px; font-size: 24px;">🎉 ჯერ კიდევ რეგისტრირებული ხარ!</h2>
      <p style="margin-bottom: 15px; font-size: 16px;">
        მოგესალმებით, <strong>${user.firstName} ${user.lastName}</strong>!
      </p>
      <button onclick="logout()" style="
        background-color: #e74c3c;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s;
      " onmouseover="this.style.backgroundColor='#c0392b'" onmouseout="this.style.backgroundColor='#e74c3c'">
        გამოსვლა
      </button>
    </div>
  `;

  const firstSection = mainTag.querySelector(".section");
  if (firstSection) {
    mainTag.insertBefore(banner, firstSection);
  } else {
    mainTag.prepend(banner);
  }
}

function initializeAuthUI() {
  const token = localStorage.getItem(TOKEN_KEY);
  const user = localStorage.getItem(USER_KEY);

  if (token && user) {
    updateHeaderWithUser(JSON.parse(user));
  } else {
    updateHeaderWithoutUser();
  }
}

function updateHeaderWithUser(user) {
  const userDisplay = document.getElementById("userDisplay");
  const logoutBtn = document.getElementById("logoutBtn");
  const profileLink = document.querySelector(".user-btn");
  const carButton = document.querySelector(".header-actions .btn");

  if (userDisplay) {
    userDisplay.innerHTML = `
      <span class="user-name">Welcome, <strong>${user.firstName}</strong></span>
    `;
    userDisplay.style.display = "flex";
  }

  if (logoutBtn) {
    logoutBtn.style.display = "flex";
  }

  if (profileLink) {
    profileLink.style.display = "none";
  }

  if (carButton) {
    carButton.style.display = "none";
  }
}

function updateHeaderWithoutUser() {
  const userDisplay = document.getElementById("userDisplay");
  const logoutBtn = document.getElementById("logoutBtn");
  const profileLink = document.querySelector(".user-btn");
  const carButton = document.querySelector(".header-actions .btn");

  if (userDisplay) {
    userDisplay.innerHTML = `<span class="user-name">Not logged in</span>`;
    userDisplay.style.display = "flex";
  }

  if (logoutBtn) {
    logoutBtn.style.display = "none";
  }

  if (profileLink) {
    profileLink.href = "register.html";
    profileLink.style.display = "flex";
  }

  if (carButton) {
    carButton.style.display = "flex";
  }
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  updateHeaderWithoutUser();

  if (window.location.pathname.includes("register.html")) {
    window.location.reload();
  } else if (!window.location.pathname.includes("index.html")) {
    setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  } else {
    window.location.reload();
  }
}

function isLoggedIn() {
  return localStorage.getItem(TOKEN_KEY) && localStorage.getItem(USER_KEY);
}

function getCurrentUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}
