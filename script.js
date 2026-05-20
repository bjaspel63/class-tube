// script.js

const studentInput = document.getElementById("studentNames");

const generateBtn = document.getElementById("generateBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const pdfBtn = document.getElementById("pdfBtn");
const clearBtn = document.getElementById("clearBtn");

const seatGrid = document.getElementById("seatGrid");

let currentStudents = [];

// LOAD SAVED SEATS

loadSavedSeats();

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

// GENERATE SEATS

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

  saveSeatsLocally();
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

  saveSeatsLocally();
}

// RENDER SEATS

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

    // STUDENT NAME

    const studentName = currentStudents[i] || "Empty";

    // EMPTY STYLE

    if (studentName === "Empty") {

      seat.classList.add("empty");
    }

    // HTML

    seat.innerHTML = `
      <div class="seat-number">
        ${seatNumber}
      </div>

      <div class="student-name">
        ${studentName}
      </div>
    `;

    seatGrid.appendChild(seat);
  }

  enableDragAndDrop();
}

// DRAG & DROP SEAT TILES

function enableDragAndDrop() {

  const seats = document.querySelectorAll(".seat");

  let draggedSeat = null;

  seats.forEach(seat => {

    // MAKE TILE DRAGGABLE

    seat.setAttribute("draggable", true);

    // START DRAG

    seat.addEventListener("dragstart", () => {

      draggedSeat = seat;

      setTimeout(() => {

        seat.style.opacity = "0.5";

      }, 0);
    });

    // END DRAG

    seat.addEventListener("dragend", () => {

      seat.style.opacity = "1";
    });

    // ALLOW DROP

    seat.addEventListener("dragover", e => {

      e.preventDefault();
    });

    // DROP

    seat.addEventListener("drop", () => {

      if (
        !draggedSeat ||
        draggedSeat === seat
      ) {
        return;
      }

      // SWAP FULL TILE CONTENT

      const draggedHTML = draggedSeat.innerHTML;
      const draggedClass = draggedSeat.className;

      draggedSeat.innerHTML = seat.innerHTML;
      draggedSeat.className = seat.className;

      seat.innerHTML = draggedHTML;
      seat.className = draggedClass;

      // SAVE

      saveSeatsLocally();

      // RE-ENABLE EVENTS

      enableDragAndDrop();
    });
  });
}

// SAVE LOCAL STORAGE

function saveSeatsLocally() {

  const seats = [];

  document.querySelectorAll(".seat").forEach(seat => {

    seats.push({
      html: seat.innerHTML,
      className: seat.className
    });
  });

  localStorage.setItem(
    "classroomSeats",
    JSON.stringify(seats)
  );
}

// LOAD LOCAL STORAGE

function loadSavedSeats() {

  const savedSeats = localStorage.getItem("classroomSeats");

  if (!savedSeats) return;

  const seats = JSON.parse(savedSeats);

  seatGrid.innerHTML = "";

  seats.forEach(savedSeat => {

    const seat = document.createElement("div");

    seat.className = savedSeat.className;

    seat.innerHTML = savedSeat.html;

    seatGrid.appendChild(seat);
  });

  enableDragAndDrop();
}

// SAVE PDF

function savePDF() {

  const element = document.getElementById("pdfContent");

  const options = {

    margin: 0.5,

    filename: "classroom-seating-chart.pdf",

    image: {
      type: "jpeg",
      quality: 1
    },

    html2canvas: {
      scale: 2
    },

    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "portrait"
    }
  };

  html2pdf()
    .set(options)
    .from(element)
    .save();
}

// CLEAR EVERYTHING

function clearSeats() {

  studentInput.value = "";

  seatGrid.innerHTML = "";

  currentStudents = [];

  localStorage.removeItem("classroomSeats");
}
