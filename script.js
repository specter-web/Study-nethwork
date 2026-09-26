/* =========================================
   STUDY NETHWORK // NEXUS V2
   ========================================= */


/* ================= LOGIN ================= */

const savedUser =
  localStorage.getItem("studyUser");

if (savedUser) {
  showApp(savedUser);
}


function login() {

  const username =
    document.getElementById("usernameInput").value.trim();

  const password =
    document.getElementById("passwordInput").value;

  const message =
    document.getElementById("loginMessage");


  if (!username || !password) {

    message.textContent =
      "⚠ ENTER IDENTITY AND ACCESS CODE";

    return;
  }


  if (password.length < 4) {

    message.textContent =
      "⚠ ACCESS CODE MUST HAVE 4+ CHARACTERS";

    return;
  }


  localStorage.setItem(
    "studyUser",
    username
  );


  message.style.color = "#46d89a";

  message.textContent =
    "✓ ACCESS GRANTED";


  setTimeout(() => {

    showApp(username);

  }, 500);
}


function showApp(username) {

  document
    .getElementById("loginScreen")
    .classList.add("hidden");

  document
    .getElementById("mainApp")
    .classList.remove("hidden");


  const cleanName =
    username.toUpperCase();


  document.getElementById(
    "userDisplay"
  ).textContent =
    "● " + cleanName;


  document.getElementById(
    "profileName"
  ).textContent =
    cleanName;


  document.getElementById(
    "profileAvatar"
  ).textContent =
    username.charAt(0).toUpperCase();


  updateDashboard();
  updateTimerDisplay();
  updateAchievements();
}


function logout() {

  localStorage.removeItem(
    "studyUser"
  );


  document
    .getElementById("mainApp")
    .classList.add("hidden");

  document
    .getElementById("loginScreen")
    .classList.remove("hidden");


  document.getElementById(
    "passwordInput"
  ).value = "";

  document.getElementById(
    "loginMessage"
  ).textContent = "";
}


function togglePassword() {

  const password =
    document.getElementById(
      "passwordInput"
    );

  const button =
    document.getElementById(
      "showPassword"
    );


  if (password.type === "password") {

    password.type = "text";
    button.textContent = "HIDE";

  } else {

    password.type = "password";
    button.textContent = "SHOW";

  }
}


document.addEventListener(
  "keydown",
  function(event) {

    const loginScreen =
      document.getElementById(
        "loginScreen"
      );


    if (
      event.key === "Enter" &&
      !loginScreen.classList.contains("hidden")
    ) {

      login();

    }

  }
);


/* ================= DATA ================= */

let xp =
  Number(
    localStorage.getItem("studyXP")
  ) || 0;

let tasksDone =
  Number(
    localStorage.getItem("tasksDone")
  ) || 0;

let focusMinutes =
  Number(
    localStorage.getItem("focusMinutes")
  ) || 0;

let streak =
  Number(
    localStorage.getItem("studyStreak")
  ) || 1;

let quizCorrect =
  localStorage.getItem(
    "quizCorrect"
  ) === "true";

let timerSeconds =
  25 * 60;

let timerInterval = null;


/* ================= DASHBOARD ================= */

function updateDashboard() {

  const level =
    Math.floor(xp / 100) + 1;

  const currentXP =
    xp % 100;


  document.getElementById(
    "xp"
  ).textContent = xp;


  document.getElementById(
    "xpTop"
  ).textContent = xp;


  document.getElementById(
    "level"
  ).textContent =
    "LEVEL " + level;


  document.getElementById(
    "profileLevel"
  ).textContent =
    "LEVEL " + level;


  document.getElementById(
    "xpBar"
  ).style.width =
    currentXP + "%";


  document.getElementById(
    "xpText"
  ).textContent =
    currentXP + " / 100 XP";


  document.getElementById(
    "tasksDone"
  ).textContent =
    tasksDone;


  document.getElementById(
    "focusMinutes"
  ).textContent =
    focusMinutes;


  document.getElementById(
    "streak"
  ).textContent =
    streak;


  localStorage.setItem(
    "studyXP",
    xp
  );

  localStorage.setItem(
    "tasksDone",
    tasksDone
  );

  localStorage.setItem(
    "focusMinutes",
    focusMinutes
  );

  localStorage.setItem(
    "studyStreak",
    streak
  );


  updateAchievements();
}


/* ================= MISSIONS ================= */

function completeTask(box) {

  if (box.checked) {

    xp += 25;
    tasksDone++;

  } else {

    xp =
      Math.max(
        0,
        xp - 25
      );

    tasksDone =
      Math.max(
        0,
        tasksDone - 1
      );

  }


  updateDashboard();

  showToast(
    box.checked
      ? "+25 XP MISSION COMPLETE"
      : "-25 XP MISSION RESET"
  );
}


/* ================= TIMER ================= */

function updateTimerDisplay() {

  const minutes =
    Math.floor(
      timerSeconds / 60
    );

  const seconds =
    timerSeconds % 60;


  document.getElementById(
    "timer"
  ).textContent =

    String(minutes)
      .padStart(2,"0")

    + ":" +

    String(seconds)
      .padStart(2,"0");
}


function startTimer() {

  if (timerInterval) return;


  showToast(
    "FOCUS MODE ACTIVATED"
  );


  timerInterval =
    setInterval(() => {

      timerSeconds--;

      updateTimerDisplay();


      if (timerSeconds <= 0) {

        clearInterval(
          timerInterval
        );

        timerInterval = null;


        xp += 50;
        focusMinutes += 25;


        updateDashboard();


        showToast(
          "+50 XP FOCUS COMPLETE"
        );


        alert(
          "FOCUS SESSION COMPLETE!\n+50 XP"
        );


        timerSeconds =
          25 * 60;


        updateTimerDisplay();

      }

    },1000);
}


function resetTimer() {

  clearInterval(
    timerInterval
  );

  timerInterval = null;


  timerSeconds =
    25 * 60;


  updateTimerDisplay();
}


/* ================= NOTES ================= */

const savedNotes =
  localStorage.getItem(
    "studyNotes"
  );


if (savedNotes) {

  document.getElementById(
    "notes"
  ).value =
    savedNotes;
}


function saveNotes() {

  const notes =
    document.getElementById(
      "notes"
    ).value;


  localStorage.setItem(
    "studyNotes",
    notes
  );


  document.getElementById(
    "saveMessage"
  ).textContent =
    "✓ NOTES SAVED TO LOCAL DATABASE";


  showToast(
    "NOTES SAVED"
  );
}


/* ================= QUIZ ================= */

let quizAnswered = false;


function answerQuiz(
  button,
  correct
) {

  if (quizAnswered) return;


  quizAnswered = true;


  const result =
    document.getElementById(
      "quizResult"
    );


  if (correct) {

    result.textContent =
      "✓ CORRECT — +20 XP";


    xp += 20;

    quizCorrect = true;


    localStorage.setItem(
      "quizCorrect",
      "true"
    );


    showToast(
      "+20 XP KNOWLEDGE REWARD"
    );

  } else {

    result.textContent =
      "✕ INCORRECT — Try again next time.";

  }


  updateDashboard();
}


/* ================= ACHIEVEMENTS ================= */

function updateAchievements() {

  let unlocked = 0;


  if (xp >= 25) {

    unlock("achievement1");
    unlocked++;

  }


  if (xp >= 100) {

    unlock("achievement2");
    unlocked++;

  }


  if (tasksDone >= 5) {

    unlock("achievement3");
    unlocked++;

  }


  if (quizCorrect) {

    unlock("achievement4");
    unlocked++;

  }


  const count =
    document.getElementById(
      "achievementCount"
    );


  if (count) {

    count.textContent =
      unlocked;

  }
}


function unlock(id) {

  const element =
    document.getElementById(id);

  if (element) {

    element.classList.add(
      "unlocked"
    );

  }
}


/* ================= SUBJECT SEARCH ================= */

function searchSubjects() {

  const query =
    document.getElementById(
      "subjectSearch"
    ).value
     .toLowerCase()
     .trim();


  const subjects =
    document.querySelectorAll(
      ".subject"
    );


  subjects.forEach(subject => {

    const name =
      subject.dataset.name;


    if (
      name.includes(query)
    ) {

      subject.style.display =
        "";

    } else {

      subject.style.display =
        "none";

    }

  });
}


/* ================= TERMINAL ================= */

function terminalCommand(event) {

  if (
    event.key !== "Enter"
  ) return;


  const input =
    document.getElementById(
      "terminalInput"
    );


  const output =
    document.getElementById(
      "terminalOutput"
    );


  const command =
    input.value
      .trim()
      .toLowerCase();


  if (!command) return;


  let response = "";


  if (
    command === "help"
  ) {

    response =
      "COMMANDS → help | status | xp | level | focus | subjects | achievements | clear";

  }


  else if (
    command === "status"
  ) {

    response =
      "SYSTEM → ONLINE<br>" +
      "LEARNING ENGINE → ACTIVE<br>" +
      "KNOWLEDGE CORE → LOADED<br>" +
      "ACHIEVEMENT CORE → READY<br>" +
      "FOCUS MODULE → READY";

  }


  else if (
    command === "xp"
  ) {

    response =
      "CURRENT XP → " +
      xp;

  }


  else if (
    command === "level"
  ) {

    const level =
      Math.floor(
        xp / 100
      ) + 1;


    response =
      "CURRENT LEVEL → " +
      level;

  }


  else if (
    command === "focus"
  ) {

    response =
      "FOCUS MODULE → 25 MIN<br>" +
      "STATUS → READY";

  }


  else if (
    command === "subjects"
  ) {

    response =
      "DATABASE → MATH / SCIENCE / ENGLISH / GEOGRAPHY / HISTORY / COMPUTER";

  }


  else if (
    command === "achievements"
  ) {

    response =
      "ACHIEVEMENT CORE → " +
      document.getElementById(
        "achievementCount"
      ).textContent +
      " UNLOCKED";

  }


  else if (
    command === "clear"
  ) {

    output.innerHTML =
      "";

    input.value =
      "";

    return;

  }


  else {

    response =
      "COMMAND NOT FOUND.<br>" +
      "TYPE <b>help</b> FOR AVAILABLE COMMANDS.";

  }


  output.innerHTML +=

    `<div class="terminal-line">
      <span class="prompt">
        SN@study:~$
      </span>
      <span>
        ${command}
      </span>
    </div>

    <div class="system-output">
      ${response}
    </div>`;


  input.value =
    "";


  const terminalBody =
    document.querySelector(
      ".terminal-body"
    );


  terminalBody.scrollTop =
    terminalBody.scrollHeight;
}


/* ================= MOBILE MENU ================= */

function toggleMenu() {

  document
    .getElementById(
      "navMenu"
    )
    .classList.toggle(
      "show"
    );
}


/* ================= TOAST ================= */

function showToast(message) {

  let toast =
    document.getElementById(
      "nexusToast"
    );


  if (!toast) {

    toast =
      document.createElement(
        "div"
      );

    toast.id =
      "nexusToast";


    toast.style.position =
      "fixed";

    toast.style.bottom =
      "25px";

    toast.style.left =
      "50%";

    toast.style.transform =
      "translateX(-50%)";

    toast.style.zIndex =
      "9999";

    toast.style.padding =
      "12px 18px";

    toast.style.border =
      "1px solid #2baaff";

    toast.style.borderRadius =
      "10px";

    toast.style.background =
      "#061426";

    toast.style.color =
      "#5fc2ff";

    toast.style.fontSize =
      "11px";

    toast.style.fontWeight =
      "bold";

    document.body.appendChild(
      toast
    );

  }


  toast.textContent =
    message;


  toast.style.opacity =
    "1";


  clearTimeout(
    window.toastTimer
  );


  window.toastTimer =
    setTimeout(() => {

      toast.style.opacity =
        "0";

    },1800);
}


/* ================= START ================= */

updateDashboard();
updateTimerDisplay();

console.log(
  "STUDY NETHWORK // NEXUS V2 ONLINE"
);
