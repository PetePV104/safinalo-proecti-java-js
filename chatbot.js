function sendMessage() {
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chat-messages");

  let q = input.value.toLowerCase();
  let answer = "";

  if (q.includes("როგორ დავამატო")) {
    answer = "Go to Add Car page and fill the form.";
  } else if (q.includes("როგორ ვიქირავო")) {
    answer = "Click Rent Now button on any car.";
  } else if (q.includes("პროფილი")) {
    answer = "Profile page shows your rented cars.";
  } else {
    answer = "I answer only AutoRent related questions 😊";
  }

  messages.innerHTML += `<div>👤 ${input.value}</div>`;
  messages.innerHTML += `<div>🤖 ${answer}</div>`;
  input.value = "";
}
