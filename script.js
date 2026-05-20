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

    // HTML

    seat.innerHTML = `
      <div class="seat-number">
        ${seatNumber}
      </div>

      <div class="student-name"
           draggable="true">
           ${studentName}
      </div>
    `;

    // EMPTY STYLE

    if (studentName === "Empty") {

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

    // START DRAG

    name.addEventListener("dragstart", () => {

      // DON'T DRAG EMPTY

      if (name.innerText === "Empty") return;

      draggedItem = name;

      setTimeout(() => {

        name.style.opacity = "0.5";

      }, 0);
    });

    // END DRAG

    name.addEventListener("dragend", () => {

      name.style.opacity = "1";
    });

    // ALLOW DROP

    name.addEventListener("dragover", e => {

      e.preventDefault();
    });

    // DROP

    name.addEventListener("drop", () => {

      // DON'T DROP INTO EMPTY

      if (
        !draggedItem ||
        draggedItem === name ||
        name.innerText === "Empty"
      ) {
        return;
      }

      // SWAP NAMES

      const temp = name.innerHTML;

      name.innerHTML = draggedItem.innerHTML;

      draggedItem.innerHTML = temp;

      // FIX EMPTY POSITIONS

      moveEmptySeatsToEnd();

      // SAVE

      saveSeatsLocally();
    });
  });
}

// MOVE EMPTY TO END

function moveEmptySeatsToEnd() {

  const names = [];

  document.querySelectorAll(".student-name").forEach(name => {

    names.push(name.innerText);
  });

  // REMOVE EMPTY

  const filled = names.filter(name => name !== "Empty");

  // ADD EMPTY AT END

  while (filled.length < 25) {

    filled.push("Empty");
  }

  currentStudents = filled;

  renderSeats();
}

// SAVE LOCAL STORAGE

function saveSeatsLocally() {

  const seatNames = [];

  document.querySelectorAll(".student-name").forEach(name => {

    seatNames.push(name.innerText);
  });

  localStorage.setItem(
    "classroomSeats",
    JSON.stringify(seatNames)
  );
}

// LOAD LOCAL STORAGE

function loadSavedSeats() {

  const savedSeats = localStorage.getItem("classroomSeats");

  if (!savedSeats) return;

  currentStudents = JSON.parse(savedSeats);

  renderSeats();
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
