function loadProfile() {
  let user = JSON.parse(localStorage.getItem("user"));
  let rented = JSON.parse(localStorage.getItem("rented")) || [];

  document.getElementById("info").innerHTML = `
    <h3>${user.name} ${user.surname}</h3>
    <p>${user.phone}</p>
  `;

  rented.forEach((car) => {
    document.getElementById("rented").innerHTML += `
      <div class="card">
        ${car.brand} ${car.model} - ${car.city} - ${car.price}₾
      </div>`;
  });
}
