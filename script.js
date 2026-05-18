const iframe =
  document.getElementById("videoFrame");

const lessonList =
  document.getElementById("lessonList");

/* THEME TOGGLE */

document
  .getElementById("themeToggle")
  .addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

  });

/* EXTRACT VIDEO ID */

function extractVideoID(url) {

  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

  const match = url.match(regExp);

  return (match && match[2].length === 11)
    ? match[2]
    : null;
}

/* LOAD VIDEO */

function loadVideo() {

  const url =
    document.getElementById("youtubeLink").value;

  const videoID =
    extractVideoID(url);

  if (!videoID) {
    alert("Invalid YouTube URL");
    return;
  }

  const autoplay =
    document.getElementById("autoplay").checked ? 1 : 0;

  const startTime =
    document.getElementById("startTime").value || 0;

  const embedURL =
    `https://www.youtube.com/embed/${videoID}?rel=0&modestbranding=1&autoplay=${autoplay}&start=${startTime}`;

  iframe.src = embedURL;

  generateQR(embedURL);
}

/* FULLSCREEN */

function fullscreenPlayer() {

  const player =
    document.getElementById("playerContainer");

  if (player.requestFullscreen) {
    player.requestFullscreen();
  }
}

/* COPY LINK */

function copyShareLink() {

  navigator.clipboard.writeText(iframe.src);

  alert("Link copied!");
}

/* QR CODE */

function generateQR(link) {

  const qr =
    document.getElementById("qrcode");

  qr.innerHTML = "";

  new QRCode(qr, {
    text: link,
    width: 180,
    height: 180
  });
}

/* SAVE LESSON */

function saveLesson() {

  const video =
    iframe.src;

  const notes =
    document.getElementById("teacherNotes").value;

  if (!video) {
    alert("Load a video first.");
    return;
  }

  const lessons =
    JSON.parse(localStorage.getItem("lessons")) || [];

  lessons.push({
    video,
    notes
  });

  localStorage.setItem(
    "lessons",
    JSON.stringify(lessons)
  );

  renderLessons();

  alert("Lesson saved!");
}

/* RENDER LESSONS */

function renderLessons() {

  const lessons =
    JSON.parse(localStorage.getItem("lessons")) || [];

  lessonList.innerHTML = "";

  lessons.forEach((lesson, index) => {

    const div =
      document.createElement("div");

    div.classList.add("lesson-item");

    div.innerHTML = `
      <p><strong>Lesson ${index + 1}</strong></p>

      <p>${lesson.notes || "No notes"}</p>

      <button onclick="loadSavedLesson(${index})">
        Open
      </button>

      <button onclick="deleteLesson(${index})">
        Delete
      </button>
    `;

    lessonList.appendChild(div);

  });

}

/* LOAD SAVED LESSON */

function loadSavedLesson(index) {

  const lessons =
    JSON.parse(localStorage.getItem("lessons"));

  iframe.src =
    lessons[index].video;

  document.getElementById("teacherNotes").value =
    lessons[index].notes;

  generateQR(lessons[index].video);
}

/* DELETE */

function deleteLesson(index) {

  const lessons =
    JSON.parse(localStorage.getItem("lessons"));

  lessons.splice(index, 1);

  localStorage.setItem(
    "lessons",
    JSON.stringify(lessons)
  );

  renderLessons();
}

/* INIT */

renderLessons();