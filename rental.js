document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();

  loadSelectedCar();

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

function loadSelectedCar() {
  try {
    const selectedCarData = sessionStorage.getItem("selectedCar");
    if (selectedCarData) {
      const car = JSON.parse(selectedCarData);
      const carIdInput = document.getElementById("carId");
      if (carIdInput) {
        carIdInput.value = car.carId;
      }
      window.selectedCarData = car;

      fetchCarDetailsFromAPI(car.carId);

      sessionStorage.removeItem("selectedCar");
    }
  } catch (e) {
    console.log("No selected car data found");
  }
}

async function fetchCarDetailsFromAPI(carId) {
  try {
    const response = await fetch(`${window.API_BASE_URL}/Car/${carId}`);
    if (response.ok) {
      const carDetails = await response.json();
      window.selectedCarData = {
        carId: carDetails.id,
        carName: `${carDetails.brand} ${carDetails.model}`,
        carPrice: carDetails.price,
        carYear: carDetails.year,
        carImage: carDetails.imageUrl1 || "./assets/images/hero-banner.jpg",
        capacity: carDetails.capacity,
        transmission: carDetails.transmission,
        fuelCapacity: carDetails.fuelCapacity,
      };
    }
  } catch (error) {
    console.error("Error fetching car details from API:", error);
  }
}

function checkLoginStatus() {
  const token = localStorage.getItem(window.TOKEN_KEY);
  const userStr = localStorage.getItem(window.USER_KEY);

  if (!token || !userStr) {
    showLoginRequiredMessage();
  }
}

function showLoginRequiredMessage() {
  const rentalSection = document.querySelector(".rental-section");
  if (!rentalSection) return;

  const rentalContent = rentalSection.querySelector(".rental-content");
  if (!rentalContent) return;

  const existingMessage = rentalContent.querySelector(
    ".login-required-message",
  );
  if (existingMessage) return;

  const message = document.createElement("div");
  message.className = "login-required-message";
  message.style.cssText = `
    background-color: #fff3cd;
    border: 2px solid #ffc107;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    text-align: center;
    color: #856404;
  `;
  message.innerHTML = `
    <h3>⚠️ დაკავშირება აუცილებელია</h3>
    <p>მანქანის გაქირავებისთვის საჭიროა ჯერ <strong>დარეგისტრირდეთ ან შემოიტანეთ</strong>.</p>
    <a href="register.html" class="btn" style="margin-top: 10px; display: inline-block;">
      რეგისტრაცია / შესვლა
    </a>
  `;

  rentalContent.querySelector(".rental-form-wrapper").style.opacity = "0.5";
  rentalContent.querySelector(".rental-form-wrapper").style.pointerEvents =
    "none";
  rentalContent.insertBefore(
    message,
    rentalContent.querySelector(".rental-form-wrapper"),
  );
}

function fillFormWithUserData() {
  const token = localStorage.getItem(window.TOKEN_KEY);
  const userStr = localStorage.getItem(window.USER_KEY);

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

  const token = localStorage.getItem(window.TOKEN_KEY);
  const userStr = localStorage.getItem(window.USER_KEY);

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

  submitRentalRequest(phoneNumber, carId, multiplier, user);
}

function submitRentalRequest(phoneNumber, carId, multiplier, user) {
  const url = `${window.API_BASE_URL}/Purchase/purchase?phoneNumber=${phoneNumber}&carId=${carId}&multiplier=${multiplier}`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.warn(
          `API returned status ${response.status}, will save locally`,
        );
        return null;
      }
      return response.json().catch(() => null);
    })
    .then((data) => {
      console.log("API Response:", data);

      saveRentalLocally(phoneNumber, carId, multiplier, user);

      showSuccessMessage();
    })
    .catch((error) => {
      console.warn("API error, saving locally:", error);

      saveRentalLocally(phoneNumber, carId, multiplier, user);

      showSuccessMessage();
    });
}

function saveRentalLocally(phoneNumber, carId, multiplier, user) {
  const rental = {
    id: Date.now(),
    carId: carId,
    carName: window.selectedCarData?.carName || "Unknown",
    carPrice: window.selectedCarData?.carPrice || "N/A",
    carYear: window.selectedCarData?.carYear || "N/A",
    carImage:
      window.selectedCarData?.carImage || "./assets/images/hero-banner.jpg",
    multiplier: multiplier,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: phoneNumber,
    email: user.email,
    rentalDate: new Date().toLocaleDateString("ka-GE"),
    rentalTime: new Date().toLocaleTimeString("ka-GE"),
  };

  let userRentals = {};
  try {
    const allRentals =
      JSON.parse(localStorage.getItem(window.RENTALS_STORAGE_KEY)) || {};
    userRentals = allRentals;
  } catch (e) {
    userRentals = {};
  }

  if (!userRentals[phoneNumber]) {
    userRentals[phoneNumber] = [];
  }

  userRentals[phoneNumber].push(rental);

  localStorage.setItem(window.RENTALS_STORAGE_KEY, JSON.stringify(userRentals));
}

function showSuccessMessage() {
  const form = document.getElementById("rentalForm");
  const successMessage = document.getElementById("successMessage");

  if (form) form.style.display = "none";
  if (successMessage) successMessage.style.display = "block";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 3000);
}

function openMyRentalsModal() {
  const token = localStorage.getItem(window.TOKEN_KEY);
  const userStr = localStorage.getItem(window.USER_KEY);

  if (!token || !userStr) {
    alert("გთხოვთ, ჯერ დაკავშიროთ გაქირავებული მანქანების სანახავად.");
    window.location.href = "register.html";
    return;
  }

  const user = JSON.parse(userStr);
  const phoneNumber = user.phoneNumber;

  const modal = document.getElementById("myRentalsModal");
  if (modal) {
    modal.style.display = "flex";
    loadUserRentals(phoneNumber);
  }
}

function closeMyRentalsModal() {
  const modal = document.getElementById("myRentalsModal");
  if (modal) {
    modal.style.display = "none";
  }
}

function loadUserRentals(phoneNumber) {
  const rentalsList = document.getElementById("rentalsList");
  if (!rentalsList) return;

  try {
    const allRentals =
      JSON.parse(localStorage.getItem(window.RENTALS_STORAGE_KEY)) || {};
    const userRentals = allRentals[phoneNumber] || [];

    if (userRentals.length === 0) {
      rentalsList.innerHTML = `
        <div class="no-rentals">
          <p>🚗 თქვენ ჯერ კიდევ არ გაქირავებული მანქანა.</p>
          <p>დაიწყეთ თქვენი პირველი გაქირავება ახლა!</p>
        </div>
      `;
      return;
    }

    let html = "";
    userRentals.forEach((rental) => {
      html += `
        <div class="rental-item">
          <div class="rental-item-header">
            <span class="rental-car-id">🚗 ${rental.carName} (ID: ${rental.carId})</span>
            <span class="rental-date">${rental.rentalDate}</span>
          </div>
          <div class="rental-item-body">
            <div class="rental-car-image-wrapper">
              <img 
                src="${rental.carImage}" 
                alt="${rental.carName}" 
                class="rental-car-image"
                onclick="openCarImageModal('${rental.carImage}', '${rental.carName}')"
                style="cursor: pointer;"
              />
            </div>
            <p><strong>მანქანის წელი:</strong> ${rental.carYear}</p>
            <p><strong>ფასი (თვეში):</strong> $${rental.carPrice}</p>
            <p><strong>სახელი:</strong> ${rental.firstName} ${rental.lastName}</p>
            <p><strong>ტელეფონი:</strong> ${rental.phoneNumber}</p>
            <p><strong>ელ-ფოსტა:</strong> ${rental.email}</p>
            <p><strong>დღე:</strong> ${rental.multiplier} დღე</p>
            <p><strong>გაქირავების დრო:</strong> ${rental.rentalTime}</p>
            <div class="rental-item-actions">
              <button 
                class="btn delete-rental-btn" 
                onclick="deleteRental('${phoneNumber}', ${rental.id})"
                style="background-color: #e74c3c; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-top: 10px;"
              >
                🗑️ გასუფთავება
              </button>
            </div>
          </div>
        </div>
      `;
    });

    rentalsList.innerHTML = html;
  } catch (e) {
    console.error("Error loading rentals:", e);
    rentalsList.innerHTML = `
      <div class="error-message">
        <p>დაიცვა შეცდომა გაქირავებების ჩატვირთვაში.</p>
      </div>
    `;
  }
}

function openCarImageModal(imageUrl, carName) {
  const modal = document.createElement("div");
  modal.id = "carImageModal";
  modal.className = "car-image-modal";
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `;

  modal.innerHTML = `
    <div class="modal-image-content" style="
      background-color: white;
      border-radius: 15px;
      padding: 20px;
      max-width: 80%;
      max-height: 90%;
      position: relative;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    ">
      <button class="modal-close-btn" style="
        position: absolute;
        top: 10px;
        right: 15px;
        background: #e74c3c;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 24px;
        cursor: pointer;
        z-index: 10000;
      " onclick="closeCarImageModal()">×</button>
      
      <h3 style="margin-top: 0; text-align: center; color: #222;">${carName}</h3>
      <img src="${imageUrl}" alt="${carName}" style="
        width: 100%;
        height: auto;
        max-height: 70vh;
        object-fit: cover;
        border-radius: 10px;
      "/>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeCarImageModal();
    }
  });
}

function closeCarImageModal() {
  const modal = document.getElementById("carImageModal");
  if (modal) {
    modal.remove();
  }
}

function deleteRental(phoneNumber, rentalId) {
  if (!confirm("ნათლად გსურთ სგასუფთავებლოთ ეს გაქირავება?")) {
    return;
  }

  try {
    const allRentals =
      JSON.parse(localStorage.getItem(window.RENTALS_STORAGE_KEY)) || {};

    if (allRentals[phoneNumber]) {
      allRentals[phoneNumber] = allRentals[phoneNumber].filter(
        (rental) => rental.id !== rentalId,
      );

      if (allRentals[phoneNumber].length === 0) {
        delete allRentals[phoneNumber];
      }

      localStorage.setItem(
        window.RENTALS_STORAGE_KEY,
        JSON.stringify(allRentals),
      );

      loadUserRentals(phoneNumber);
    }
  } catch (e) {
    console.error("Error deleting rental:", e);
    alert("დაიცვა შეცდომა გაქირავების წაშლისას.");
  }
}
