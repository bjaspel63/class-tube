// script.js

const studentInput = document.getElementById("studentNames");
const rowsInput = document.getElementById("rows");
const colsInput = document.getElementById("cols");

const generateBtn = document.getElementById("generateBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const clearBtn = document.getElementById("clearBtn");

const seatGrid = document.getElementById("seatGrid");

let currentStudents = [];

// BUTTON EVENTS

generateBtn.addEventListener("click", generateSeats);
shuffleBtn.addEventListener("click", shuffleSeats);
clearBtn.addEventListener("click", clearSeats);

// GET STUDENTS

function getStudents() {
  return studentInput.value
    .split("\n")
    .map(name => name.trim())
    .filter(name => name !== "");
}

// SHUFFLE ARRAY

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }
}

// GENERATE SEATS

function generateSeats() {

  currentStudents = getStudents();

  if (currentStudents.length === 0) {
    alert("Please enter student names.");
    return;
  }

  shuffleArray(currentStudents);

  renderSeats();
}

// SHUFFLE AGAIN

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

// RENDER SEATS

function renderSeats() {

  const rows = parseInt(rowsInput.value);
  const cols = parseInt(colsInput.value);

  seatGrid.innerHTML = "";

  seatGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  const totalSeats = rows * cols;

  for (let i = 0; i < totalSeats; i++) {

    const seat = document.createElement("div");

    seat.classList.add("seat");

    const seatNumber = i + 1;

    // COLOR GROUPS

    if (seatNumber >= 1 && seatNumber <= 8) {

      seat.classList.add("yellow-seat");

    } else if (seatNumber >= 9 && seatNumber <= 16) {

      seat.classList.add("blue-seat");

    } else if (seatNumber >= 17 && seatNumber <= 25) {

      seat.classList.add("red-seat");
    }

    // STUDENT OR EMPTY

    if (currentStudents[i]) {

      seat.innerHTML = `
        <div class="seat-number">
          Seat ${seatNumber}
        </div>

        <div class="student-name">
          ${currentStudents[i]}
        </div>
      `;

    } else {

      seat.classList.add("empty");

      seat.innerHTML = `
        <div class="seat-number">
          Seat ${seatNumber}
        </div>

        <div class="student-name">
          Empty
        </div>
      `;
    }

    seatGrid.appendChild(seat);
  }
}

// CLEAR EVERYTHING

function clearSeats() {

  studentInput.value = "";

  seatGrid.innerHTML = "";

  currentStudents = [];
}
