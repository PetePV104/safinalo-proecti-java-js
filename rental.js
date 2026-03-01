const TOKEN_KEY = "authToken";
const USER_KEY = "currentUser";
const API_BASE_URL = "https://rentcar.stepprojects.ge/api";

document.addEventListener("DOMContentLoaded", () => {
  fillFormWithUserData();

  const rentalForm = document.getElementById("rentalForm");
  if (rentalForm) {
    rentalForm.addEventListener("submit", handleRentalSubmit);
  }

  const packageRadios = document.querySelectorAll("input[name='package']");
  packageRadios.forEach((radio) => {
    radio.addEventListener("change", handlePackageChange);
  });
});

function fillFormWithUserData() {
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.firstName)
        document.getElementById("firstName").value = user.firstName;
      if (user.lastName)
        document.getElementById("lastName").value = user.lastName;
      if (user.email) document.getElementById("email").value = user.email;
      if (user.phoneNumber)
        document.getElementById("phoneNumber").value = user.phoneNumber;
    } catch (e) {
      console.log("Could not parse user data");
    }
  }
}

function handlePackageChange(e) {
  const multiplier = e.target.value;
  const packageNames = {
    1: "1 დღე",
    7: "1 კვირა",
    30: "1 თვე",
  };

  document.getElementById("multiplier").value = multiplier;
  document.getElementById("selectedPackage").textContent =
    packageNames[multiplier];
}

function handleRentalSubmit(e) {
  e.preventDefault();

  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);

  if (!token || !userStr) {
    alert("გთხოვთ, პირველ რიგში დარეგისტრირდით ან შემოიტანეთ!");
    window.location.href = "register.html";
    return;
  }

  const user = JSON.parse(userStr);
  const carId = document.getElementById("carId").value;
  const multiplier = document.getElementById("multiplier").value;
  const phoneNumber = user.phoneNumber;

  if (!carId) {
    alert("გთხოვთ, აირჩიეთ მანქანის ID!");
    return;
  }

  submitRentalRequest(phoneNumber, carId, multiplier);
}

function submitRentalRequest(phoneNumber, carId, multiplier) {
  const url = `${API_BASE_URL}/Purchase/purchase?phoneNumber=${phoneNumber}&carId=${carId}&multiplier=${multiplier}`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("წარმატება:", data);
      showSuccessMessage();
    })
    .catch((error) => {
      console.error("შეცდომა:", error);
      alert("დაიცვა შეცდომა გაქირავების დროს. გთხოვთ სცადოთ მერე.");
    });
}

function showSuccessMessage() {
  const form = document.getElementById("rentalForm");
  const successMessage = document.getElementById("successMessage");

  form.style.display = "none";
  successMessage.style.display = "block";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 3000);
}
