let cars = JSON.parse(localStorage.getItem("cars")) || [
  {
    id: 1,
    brand: "Mercedes",
    model: "E320",
    year: 2018,
    price: 120,
    city: "თბილისი",
    capacity: 4,
    image: "assets/images/mercedes.jpg",
  },
  {
    id: 2,
    brand: "BMW",
    model: "X5",
    year: 2020,
    price: 150,
    city: "ბათუმი",
    capacity: 6,
    image: "assets/images/bmw.jpg",
  },
  {
    id: 3,
    brand: "Toyota",
    model: "Prius",
    year: 2016,
    price: 70,
    city: "ქუთაისი",
    capacity: 4,
    image: "assets/images/toyota.jpg",
  },
];

function saveCars() {
  localStorage.setItem("cars", JSON.stringify(cars));
}
