"use strict";

const API_BASE_URL = "https://rentcar.stepprojects.ge/api";
const TOKEN_KEY = "authToken";
const USER_KEY = "currentUser";
const RENTALS_STORAGE_KEY = "userRentals";

window.API_BASE_URL = API_BASE_URL;
window.TOKEN_KEY = TOKEN_KEY;
window.USER_KEY = USER_KEY;
window.RENTALS_STORAGE_KEY = RENTALS_STORAGE_KEY;

const overlay = document.querySelector("[data-overlay]");
const navbar = document.querySelector("[data-navbar]");
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");

const navToggleFunc = function () {
  navToggleBtn.classList.toggle("active");
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
};

navToggleBtn.addEventListener("click", navToggleFunc);
overlay.addEventListener("click", navToggleFunc);

for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", navToggleFunc);
}

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  window.scrollY >= 10
    ? header.classList.add("active")
    : header.classList.remove("active");
});

const searchForm = document.querySelector(".hero-form");
if (searchForm) {
  searchForm.addEventListener("submit", handleSearch);
}

function handleSearch(event) {
  event.preventDefault();

  const searchModel = document
    .querySelector("input[name='car-model']")
    ?.value?.trim();
  const maxPrice = document
    .querySelector("input[name='monthly-pay']")
    ?.value?.trim();
  const minYear = document.querySelector("input[name='year']")?.value?.trim();

  if (!searchModel && !maxPrice && !minYear) {
    alert("გთხოვთ, აირჩიეთ მინიმუმ ერთი ძებნის კრიტერიუმი");
    return;
  }

  const cars = document.querySelectorAll(".featured-car-card");
  let visibleCars = 0;

  cars.forEach((car) => {
    const title =
      car.querySelector(".card-title")?.textContent?.toLowerCase() || "";
    const price = parseFloat(
      car.querySelector(".card-price strong")?.textContent?.replace("$", "") ||
        0,
    );
    const year = parseInt(
      car.querySelector(".year")?.getAttribute("value") || 0,
    );

    let matches = true;

    if (searchModel && !title.includes(searchModel.toLowerCase())) {
      matches = false;
    }

    if (maxPrice && price > parseFloat(maxPrice)) {
      matches = false;
    }

    if (minYear && year < parseInt(minYear)) {
      matches = false;
    }

    if (matches) {
      car.parentElement.style.display = "block";
      visibleCars++;
    } else {
      car.parentElement.style.display = "none";
    }
  });

  const featuredSection = document.querySelector("#featured-car");
  if (featuredSection) {
    featuredSection.scrollIntoView({ behavior: "smooth" });
  }

  if (visibleCars === 0) {
    const message = document.createElement("div");
    message.style.cssText = `
      padding: 20px;
      background-color: #fff3cd;
      border: 2px solid #ffc107;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
      color: #856404;
    `;
    message.textContent =
      "⚠️ თქვენი ძებნის კრიტერიუმების მიხედვით მანქანა ვერ მოიძებნა.";

    const existingMessage = document.querySelector(".search-result-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    message.className = "search-result-message";
    const carList = document.querySelector(".featured-car-list");
    if (carList) {
      carList.parentElement.insertBefore(message, carList);
    }
  } else {
    const existingMessage = document.querySelector(".search-result-message");
    if (existingMessage) {
      existingMessage.remove();
    }
  }
}

function selectCar(carId, carName, carPrice, carYear, carImage = "") {
  sessionStorage.setItem(
    "selectedCar",
    JSON.stringify({
      carId: carId,
      carName: carName,
      carPrice: carPrice,
      carYear: carYear,
      carImage: carImage,
    }),
  );
  window.location.href = "rental.html";
}

async function loadFeaturedCars() {
  try {
    const carList = document.querySelector(".featured-car-list");
    if (!carList) return;

    carList.innerHTML =
      '<div style="text-align: center; padding: 40px; color: #999;">იტვირთება...</div>';

    const response = await fetch(`${API_BASE_URL}/Car`);
    if (!response.ok) throw new Error("Failed to fetch cars");

    const cars = await response.json();
    if (!Array.isArray(cars)) throw new Error("Invalid cars data");

    if (cars.length === 0) {
      carList.innerHTML =
        '<div style="text-align: center; padding: 40px; color: #999;">მანქანა ვერ მოიძებნა</div>';
      return;
    }

    displayFeaturedCars(cars.slice(0, 6));
  } catch (error) {
    console.error("Error loading cars:", error);
    const carList = document.querySelector(".featured-car-list");
    if (carList) {
      carList.innerHTML =
        '<div style="text-align: center; padding: 40px; color: #e74c3c;">API შეცდომა: მანქანების ჩატვირთვა ვერ მოხერხდა</div>';
    }
  }
}

function displayFeaturedCars(cars) {
  const carList = document.querySelector(".featured-car-list");
  if (!carList) return;

  carList.innerHTML = "";

  cars.forEach((car) => {
    const imageUrl = car.imageUrl1 || "./assets/images/hero-banner.jpg";
    const brand = car.brand || "Unknown";
    const model = car.model || "Model";
    const year = car.year || 2020;
    const price = car.price || 0;
    const capacity = car.capacity || 4;
    const transmission = car.transmission || "Automatic";
    const fuelType = car.fuelType || "ბენზინი";
    const fuelConsumption = car.fuelConsumption || "8.5 კმ / ლიტრი";
    const carName = `${brand} ${model}`;

    const carCard = document.createElement("li");
    carCard.innerHTML = `
      <div class="featured-car-card" data-car-id="${car.id}" data-car-name="${escapeHtml(carName)}" data-car-price="${price}" data-car-year="${year}">
        <figure class="card-banner">
          <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(carName)}" loading="lazy" width="440" height="300" class="w-100" />
        </figure>
        <div class="card-content">
          <div class="card-title-wrapper">
            <h3 class="h3 card-title"><a href="#">${escapeHtml(carName)}</a></h3>
            <data class="year" value="${year}">${year}</data>
          </div>
          <ul class="card-list">
            <li class="card-list-item">
              <ion-icon name="people-outline"></ion-icon><span class="card-item-text">${capacity} ადამიანი</span>
            </li>
            <li class="card-list-item">
              <ion-icon name="flash-outline"></ion-icon><span class="card-item-text">${escapeHtml(fuelType)}</span>
            </li>
            <li class="card-list-item">
              <ion-icon name="speedometer-outline"></ion-icon><span class="card-item-text">${escapeHtml(fuelConsumption)}</span>
            </li>
            <li class="card-list-item">
              <ion-icon name="hardware-chip-outline"></ion-icon><span class="card-item-text">${escapeHtml(transmission)}</span>
            </li>
          </ul>
          <div class="card-price-wrapper">
            <p class="card-price"><strong>$${price}</strong> / თვეში</p>
            <button class="btn fav-btn" aria-label="დამამტკიცებელი სიაში დამატება">
              <ion-icon name="heart-outline"></ion-icon>
            </button>
            <button class="btn rent-btn" data-car-id="${car.id}" data-car-name="${escapeHtml(carName)}" data-car-price="${price}" data-car-year="${year}" data-car-image="${escapeHtml(imageUrl)}">
              ახლა გაქირავება
            </button>
          </div>
        </div>
      </div>
    `;
    carList.appendChild(carCard);
  });

  const rentButtons = carList.querySelectorAll(".rent-btn");
  rentButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const carId = this.dataset.carId;
      const carName = this.dataset.carName;
      const carPrice = this.dataset.carPrice;
      const carYear = this.dataset.carYear;
      const carImage = this.dataset.carImage;
      selectCar(carId, carName, carPrice, carYear, carImage);
    });
  });

  if (window.ionicons) {
    window.ionicons.build();
  }
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

async function initializePage() {
  await loadFeaturedCars();

  if (window.ionicons) {
    window.ionicons.build();
  }
}

document.addEventListener("DOMContentLoaded", initializePage);
