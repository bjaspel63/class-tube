// script.js

const studentInput = document.getElementById("studentNames");

const generateBtn = document.getElementById("generateBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const pdfBtn = document.getElementById("pdfBtn");
const clearBtn = document.getElementById("clearBtn");

const seatGrid = document.getElementById("seatGrid");

let currentStudents = [];

// EVENTS

generateBtn.addEventListener("click", generateSeats);
shuffleBtn.addEventListener("click", shuffleSeats);
pdfBtn.addEventListener("click", savePDF);
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

// GENERATE

function generateSeats() {

  currentStudents = getStudents();

  if (currentStudents.length === 0) {
    alert("Please enter student names.");
    return;
  }

  if (currentStudents.length > 25) {
    alert("Maximum is 25 students only.");
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

// RENDER

function renderSeats() {

  seatGrid.innerHTML = "";

  for (let i = 0; i < 25; i++) {

    const seat = document.createElement("div");

    seat.classList.add("seat");

    const seatNumber = i + 1;

    // COLORS

    if (seatNumber >= 1 && seatNumber <= 8) {

      seat.classList.add("yellow-seat");

    } else if (seatNumber >= 9 && seatNumber <= 16) {

      seat.classList.add("blue-seat");

    } else {

      seat.classList.add("red-seat");
    }

    // CONTENT

    seat.innerHTML = `
      <div class="seat-number">
        Seat ${seatNumber}
      </div>

      <div class="student-name"
           draggable="true">
           ${currentStudents[i] || "Empty"}
      </div>
    `;

    // EMPTY STYLE

    if (!currentStudents[i]) {
      seat.classList.add("empty");
    }

    seatGrid.appendChild(seat);
  }

  enableDragAndDrop();
}

// DRAG & DROP

function enableDragAndDrop() {

  const names = document.querySelectorAll(".student-name");

  let draggedItem = null;

  names.forEach(name => {

    name.addEventListener("dragstart", () => {

      draggedItem = name;

      setTimeout(() => {
        name.style.opacity = "0.5";
      }, 0);
    });

    name.addEventListener("dragend", () => {

      name.style.opacity = "1";
    });

    name.addEventListener("dragover", e => {

      e.preventDefault();
    });

    name.addEventListener("drop", () => {

      if (draggedItem !== name) {

        const temp = name.innerHTML;

        name.innerHTML = draggedItem.innerHTML;

        draggedItem.innerHTML = temp;
      }
    });
  });
}

// SAVE PDF

function savePDF() {

  const element = document.getElementById("pdfContent");

  const options = {
    margin: 0.5,
    filename: "classroom-seating-chart.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "portrait"
    }
  };

  html2pdf().set(options).from(element).save();
}

// CLEAR

function clearSeats() {

  studentInput.value = "";

  seatGrid.innerHTML = "";

  currentStudents = [];
}
