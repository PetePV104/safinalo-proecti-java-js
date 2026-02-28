function renderCars() {
  const container = document.getElementById("cars");
  if (!container) return;

  container.innerHTML = "";

  cars.forEach((car) => {
    container.innerHTML += `
      <div class="card">
        <img src="${car.image}">
        <div class="card-content">
          <h3>${car.brand} ${car.model}</h3>
          <p>Year: ${car.year}</p>
          <p>City: ${car.city}</p>
          <p>Capacity: ${car.capacity}</p>
          <p><strong>${car.price}₾ / day</strong></p>
          <button onclick="rentCar(${car.id})">Rent Now 🚗</button>
        </div>
      </div>
    `;
  });
}

function rentCar(id) {
  let rented = JSON.parse(localStorage.getItem("rented")) || [];
  let car = cars.find((c) => c.id === id);
  rented.push(car);
  localStorage.setItem("rented", JSON.stringify(rented));
  alert("Car rented successfully!");
}

renderCars();
