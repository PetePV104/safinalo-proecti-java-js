document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const token = localStorage.getItem(window.TOKEN_KEY);
    if (token) {
      showAuthenticatedState();
    }
  }, 100);
});

function toggleForms() {
  document.getElementById("registerForm").classList.toggle("hidden");
  document.getElementById("loginForm").classList.toggle("hidden");
  clearMessages();
}

async function handleRegister(event) {
  event.preventDefault();

  const phoneNumber = document.getElementById("regPhoneNumber").value;
  const email = document.getElementById("regEmail").value;
  const firstName = document.getElementById("regFirstName").value;
  const lastName = document.getElementById("regLastName").value;
  const password = document.getElementById("regPassword").value;
  const role = document.getElementById("regRole").value;

  if (password.length < 6) {
    showMessage(
      "registerMessage",
      "Password must be at least 6 characters",
      "error",
    );
    return;
  }

  const registerData = {
    phoneNumber,
    email,
    firstName,
    lastName,
    password,
    role,
  };

  try {
    const response = await fetch(`${window.API_BASE_URL}/Users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    });

    let data = {};
    try {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      }
    } catch (e) {
      console.warn("Could not parse response JSON:", e);
    }

    if (response.ok) {
      showMessage(
        "registerMessage",
        "Registration successful! Logging you in...",
        "success",
      );
      setTimeout(() => {
        document.getElementById("loginPhoneNumber").value = phoneNumber;
        document.getElementById("loginPassword").value = password;
        toggleForms();
      }, 1500);
    } else {
      showMessage(
        "registerMessage",
        data.message || `Registration failed (${response.status})`,
        "error",
      );
    }
  } catch (error) {
    showMessage("registerMessage", "Error: " + error.message, "error");
    console.error("Registration error:", error);
  }
}

async function handleLogin(event) {
  event.preventDefault();

  const phoneNumber = document.getElementById("loginPhoneNumber").value;
  const password = document.getElementById("loginPassword").value;

  const loginData = {
    phoneNumber,
    password,
  };

  try {
    const response = await fetch(`${window.API_BASE_URL}/Users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    let data = {};
    try {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      }
    } catch (e) {
      console.warn("Could not parse response JSON:", e);
    }

    if (response.ok) {
      localStorage.setItem(window.TOKEN_KEY, data.token || data.phoneNumber);
      localStorage.setItem(
        window.USER_KEY,
        JSON.stringify({
          phoneNumber: data.phoneNumber,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
        }),
      );

      showMessage("loginMessage", "Login successful!", "success");

      setTimeout(() => {
        updateHeaderWithUser(JSON.parse(localStorage.getItem(window.USER_KEY)));
        showAuthenticatedState();
        clearForms();
      }, 1000);
    } else {
      showMessage(
        "loginMessage",
        data.message ||
          `Login failed (${response.status}). Please check your credentials.`,
        "error",
      );
    }
  } catch (error) {
    showMessage("loginMessage", "Error: " + error.message, "error");
    console.error("Login error:", error);
  }
}

function showAuthenticatedState() {
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("logoutBtn").classList.remove("hidden");

  const user = getCurrentUser();
  const welcomeDiv = document.createElement("div");
  welcomeDiv.className = "auth-box welcome-box";
  welcomeDiv.innerHTML = `
    <h2 class="form-title">🎉 ჯერ კიდევ რეგისტრირებული ხარ!</h2>
    <p>
      მოგესალმებით, <strong>${user.firstName} ${user.lastName}</strong>!
      <br><br>
      თქვენ დაშვებული ხართ ყველა გვერდზე.
      <br>აირჩიეთ ქვემოთ რა გაგებთ:
    </p>
    <div class="quick-links">
      <a href="index.html">🏠 მთავარი საიტი</a>
      <a href="contact.html">📞 კონტაქტი</a>
    </div>
  `;

  const authSection = document.querySelector(".auth-section");
  if (authSection) {
    const container = authSection.querySelector(".container");
    if (container) {
      container.innerHTML = "";
      container.appendChild(welcomeDiv);
    }
  }
}

function showUnauthenticatedState() {
  document.getElementById("registerForm").classList.remove("hidden");
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("logoutBtn").classList.add("hidden");

  const authSection = document.querySelector(".auth-section");
  if (authSection) {
    const container = authSection.querySelector(".container");
    if (container) {
      const welcomeBox = container.querySelector(".welcome-box");
      if (welcomeBox) {
        container.innerHTML = "";
        container.appendChild(document.getElementById("registerForm"));
        container.appendChild(document.getElementById("loginForm"));
      }
    }
  }
}

function showMessage(elementId, message, type) {
  const messageDiv = document.getElementById(elementId);
  messageDiv.textContent = message;
  messageDiv.className = `message ${type}`;
}

function clearMessages() {
  document.getElementById("registerMessage").innerHTML = "";
  document.getElementById("loginMessage").innerHTML = "";
}

function clearForms() {
  document.getElementById("registerForm").reset();
  document.getElementById("loginForm").reset();
}
