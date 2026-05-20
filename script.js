// script.js

const studentInput = document.getElementById("studentNames");
const rowsInput = document.getElementById("rows");
const colsInput = document.getElementById("cols");

const generateBtn = document.getElementById("generateBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const clearBtn = document.getElementById("clearBtn");

const seatGrid = document.getElementById("seatGrid");

let currentStudents = [];

generateBtn.addEventListener("click", generateSeats);
shuffleBtn.addEventListener("click", shuffleSeats);
clearBtn.addEventListener("click", clearSeats);

function getStudents() {
  return studentInput.value
    .split("\n")
    .map(name => name.trim())
    .filter(name => name !== "");
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function generateSeats() {
  currentStudents = getStudents();

  if (currentStudents.length === 0) {
    alert("Please enter student names.");
    return;
  }

  shuffleArray(currentStudents);
  renderSeats();
}

function shuffleSeats() {
  if (currentStudents.length === 0) {
    currentStudents = getStudents();
  }

  if (currentStudents.length === 0) {
    alert("Please enter student names first.");
    return;
  }

  shuffleArray(currentStudents);
  renderSeats();
}

function renderSeats() {
  const rows = parseInt(rowsInput.value);
  const cols = parseInt(colsInput.value);

  seatGrid.innerHTML = "";
  seatGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  const totalSeats = rows * cols;

  for (let i = 0; i < totalSeats; i++) {
    const seat = document.createElement("div");
    seat.classList.add("seat");

    if (currentStudents[i]) {
      seat.textContent = currentStudents[i];
    } else {
      seat.textContent = "Empty";
      seat.classList.add("empty");
    }

    seatGrid.appendChild(seat);
  }
}

function clearSeats() {
  studentInput.value = "";
  seatGrid.innerHTML = "";
  currentStudents = [];
}
