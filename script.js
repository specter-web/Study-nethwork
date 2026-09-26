let xp = Number(localStorage.getItem("studyXP")) || 0;
let tasksDone = Number(localStorage.getItem("tasksDone")) || 0;
let focusMinutes = Number(localStorage.getItem("focusMinutes")) || 0;

let timerSeconds = 25 * 60;
let timerInterval = null;

function updateDashboard() {
  const level = Math.floor(xp / 100) + 1;
  const currentLevelXP = xp % 100;

  document.getElementById("xp").textContent = xp;
  document.getElementById("level").textContent = "LEVEL " + level;

  document.getElementById("xpBar").style.width =
    currentLevelXP + "%";

  document.getElementById("xpText").textContent =
    currentLevelXP + " / 100 XP";

  document.getElementById("tasksDone").textContent =
    tasksDone;

  document.getElementById("focusMinutes").textContent =
    focusMinutes;

  localStorage.setItem("studyXP", xp);
  localStorage.setItem("tasksDone", tasksDone);
  localStorage.setItem("focusMinutes", focusMinutes);
}

updateDashboard();

function completeTask(box) {
  if (box.checked) {
    xp += 25;
    tasksDone++;
  } else {
    xp = Math.max(0, xp - 25);
    tasksDone = Math.max(0, tasksDone - 1);
  }

  updateDashboard();
}

function updateTimerDisplay() {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;

  document.getElementById("timer").textContent =
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0");
}

function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {

    timerSeconds--;

    updateTimerDisplay();

    if (timerSeconds <= 0) {

      clearInterval(timerInterval);
      timerInterval = null;

      xp += 50;
      focusMinutes += 25;

      updateDashboard();

      alert("FOCUS SESSION COMPLETE!\n+50 XP");

      timerSeconds = 25 * 60;

      updateTimerDisplay();
    }

  }, 1000);
}

function resetTimer() {

  clearInterval(timerInterval);

  timerInterval = null;

  timerSeconds = 25 * 60;

  updateTimerDisplay();
}


/* NOTES */

const savedNotes =
  localStorage.getItem("studyNotes");

if (savedNotes) {
  document.getElementById("notes").value =
    savedNotes;
}

function saveNotes() {

  const notes =
    document.getElementById("notes").value;

  localStorage.setItem(
    "studyNotes",
    notes
  );

  document.getElementById(
    "saveMessage"
  ).textContent =
    "✓ NOTES SAVED TO LOCAL DATABASE";
}


/* QUIZ */

let quizAnswered = false;

function answerQuiz(button, correct) {

  if (quizAnswered) return;

  quizAnswered = true;

  const result =
    document.getElementById("quizResult");

  if (correct) {

    result.textContent =
      "✓ CORRECT — +20 XP";

    xp += 20;

  } else {

    result.textContent =
      "✕ INCORRECT — Try again next time.";
  }

  updateDashboard();
}


/* TERMINAL */

function terminalCommand(event) {

  if (event.key !== "Enter") return;

  const input =
    document.getElementById("terminalInput");

  const output =
    document.getElementById("terminalOutput");

  const command =
    input.value.trim().toLowerCase();

  if (!command) return;

  let response = "";

  if (command === "help") {

    response =
      "AVAILABLE COMMANDS → help | status | xp | focus | subjects | clear";

  }

  else if (command === "status") {

    response =
      "SYSTEM: ONLINE<br>" +
      "LEARNING ENGINE: ACTIVE<br>" +
      "KNOWLEDGE CORE: LOADED<br>" +
      "ALL MODULES: READY";

  }

  else if (command === "xp") {

    const level =
      Math.floor(xp / 100) + 1;

    response =
      "CURRENT XP → " +
      xp +
      "<br>LEVEL → " +
      level;

  }

  else if (command === "focus") {

    response =
      "FOCUS TIMER → 25:00<br>" +
      "STATUS → READY";

  }

  else if (command === "subjects") {

    response =
      "DATABASE → MATH / SCIENCE / ENGLISH / GEOGRAPHY / HISTORY / COMPUTER";

  }

  else if (command === "clear") {

    output.innerHTML = "";

    input.value = "";

    return;

  }

  else {

    response =
      "COMMAND NOT FOUND.<br>" +
      "TYPE <b>help</b> FOR AVAILABLE COMMANDS.";

  }

  output.innerHTML +=
    `<div class="terminal-line">
      <span class="prompt">SN@study:~$</span>
      <span>${command}</span>
    </div>
    <div class="system-output">
      ${response}
    </div>`;

  input.value = "";

  document.querySelector(
    ".terminal-body"
  ).scrollTop =
    document.querySelector(
      ".terminal-body"
    ).scrollHeight;
}


/* MOBILE MENU */

function toggleMenu() {

  document
    .getElementById("navMenu")
    .classList.toggle("show");
}


updateTimerDisplay();

console.log(
  "STUDY NETHWORK SYSTEM ONLINE."
);
