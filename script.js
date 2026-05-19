// script.js

// TIMER
let timer;
let totalSeconds = 300;

function updateTimerDisplay() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("timerDisplay").innerText =
    `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}

function startTimer() {
  const input = document.getElementById("minutesInput").value;

  if(input){
    totalSeconds = input * 60;
  }

  clearInterval(timer);

  timer = setInterval(() => {
    if(totalSeconds > 0){
      totalSeconds--;
      updateTimerDisplay();
    } else {
      clearInterval(timer);
      alert("Time is up!");
    }
  },1000);
}

function pauseTimer(){
  clearInterval(timer);
}

function resetTimer(){
  clearInterval(timer);
  totalSeconds = 300;
  updateTimerDisplay();
}

updateTimerDisplay();


// SEATING CHART
function generateSeats(){
  const names = document.getElementById("studentNames")
    .value
    .split(",")
    .map(name => name.trim())
    .filter(name => name !== "");

  names.sort(() => Math.random() - 0.5);

  const output = document.getElementById("seatOutput");
  output.innerHTML = "";

  names.forEach((name,index) => {
    const div = document.createElement("div");
    div.classList.add("seat");
    div.innerHTML = `
      <strong>Seat ${index + 1}</strong><br>
      ${name}
    `;
    output.appendChild(div);
  });
}


// BEHAVIOR TRACKER
const behaviorData = {};

function renderBehavior(){
  const list = document.getElementById("behaviorList");
  list.innerHTML = "";

  Object.keys(behaviorData).forEach(student => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${student}</strong> : ${behaviorData[student]} pts
    `;
    list.appendChild(li);
  });
}

function addPoint(){
  const name = document.getElementById("behaviorName").value.trim();

  if(!name) return;

  behaviorData[name] = (behaviorData[name] || 0) + 1;

  renderBehavior();
}

function removePoint(){
  const name = document.getElementById("behaviorName").value.trim();

  if(!name) return;

  behaviorData[name] = (behaviorData[name] || 0) - 1;

  renderBehavior();
}


// QR GENERATOR
function generateQR(){
  const text = document.getElementById("qrText").value;

  const qrContainer = document.getElementById("qrcode");

  qrContainer.innerHTML = "";

  QRCode.toCanvas(text, function (err, canvas) {
    if(err) console.error(err);

    qrContainer.appendChild(canvas);
  });
}
