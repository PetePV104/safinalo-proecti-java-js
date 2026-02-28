function addCar(){
  let newCar={
    id:Date.now(),
    brand:document.getElementById("brand").value,
    model:document.getElementById("model").value,
    year:document.getElementById("year").value,
    price:document.getElementById("price").value,
    city:document.getElementById("city").value,
    capacity:document.getElementById("capacity").value
  };
  cars.push(newCar);
  saveCars();
  alert("Car added 🚀");
  window.location="index.html";
}