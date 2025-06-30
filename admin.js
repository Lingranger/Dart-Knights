// ✅ 1) Check admin login
if (localStorage.getItem("adminLoggedIn") !== "true") {
  window.location.href = "admin-login.html";
}

// ✅ 2) Show admin welcome
const admin = JSON.parse(localStorage.getItem("admin"));
document.getElementById("welcomeAdmin").textContent = `👑 Welcome, Admin ${admin?.name || "Unknown"}!`;

// ✅ 3) Save admin session login history once per session
if (!sessionStorage.getItem("adminSessionLogged")) {
  const history = JSON.parse(localStorage.getItem("adminHistory")) || [];
  history.push({
    name: admin?.name || "Unknown",
    email: admin?.email || "Unknown",
    loginDate: new Date().toLocaleString()
  });
  localStorage.setItem("adminHistory", JSON.stringify(history));
  sessionStorage.setItem("adminSessionLogged", "true");
}

// ✅ 4) SAFE fallback defaults — only once!
const defaultEvents = [
  { title: "Opening Tournament", date: "2025-07-15", location: "Butuan City Dome" }
];

const defaultMatchSchedule = {
  [new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })]: [
    {
      date: new Date().toISOString().split("T")[0],
      time: "18:00",
      teams: "Team Alpha vs Team Beta",
      location: "Butuan City Dome"
    }
  ]
};

const defaultMatchLogs = [
  {
    date: new Date().toISOString().split("T")[0],
    player: "John Doe",
    opponent: "Jane Smith",
    winner: "John Doe"
  }
];

const defaultUsers = [
  {
    name: "Admin",
    email: "admin@example.com",
    role: "admin",
    signupDate: new Date().toLocaleDateString()
  },
  {
    name: "Sample Player",
    age: 25,
    gender: "Male",
    team: "Alpha",
    email: "player@example.com",
    role: "user",
    signupDate: new Date().toLocaleDateString()
  }
];

// ✅ Load or fallback
let events = JSON.parse(localStorage.getItem("upcomingEvents")) || defaultEvents;
let matchSchedule = JSON.parse(localStorage.getItem("matchSchedule")) || defaultMatchSchedule;
let matchLogs = JSON.parse(localStorage.getItem("matchLogs")) || defaultMatchLogs;
let users = JSON.parse(localStorage.getItem("users")) || defaultUsers;

// ✅ Save if it was missing before
localStorage.setItem("upcomingEvents", JSON.stringify(events));
localStorage.setItem("matchSchedule", JSON.stringify(matchSchedule));
localStorage.setItem("matchLogs", JSON.stringify(matchLogs));
localStorage.setItem("users", JSON.stringify(users));

// ✅ EVENTS
function renderEvents() {
  const container = document.getElementById("eventList");
  if (!container) return;
  container.innerHTML = "";

  if (events.length === 0) {
    container.innerHTML = `<tr><td colspan="4">No upcoming events.</td></tr>`;
    return;
  }

  events.forEach((event, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${event.title}</td>
      <td>${event.date}</td>
      <td>${event.location}</td>
      <td>
        <button onclick="editEvent(${index})">✏️</button>
        <button onclick="deleteEvent(${index})">❌</button>
      </td>
    `;
    container.appendChild(row);
  });
}

function openEventModal() {
  document.getElementById("eventModal").style.display = "flex";
  document.getElementById("eventModalTitle").textContent = "Add Event";
  document.getElementById("eventIndex").value = "";
  document.getElementById("eventTitle").value = "";
  document.getElementById("eventDate").value = "";
  document.getElementById("eventLocation").value = "";
}

function closeEventModal() {
  document.getElementById("eventModal").style.display = "none";
}

function saveEvent() {
  const index = document.getElementById("eventIndex").value;
  const title = document.getElementById("eventTitle").value;
  const date = document.getElementById("eventDate").value;
  const location = document.getElementById("eventLocation").value;

  if (!title || !date || !location) {
    alert("Please fill out all fields.");
    return;
  }

  const newEvent = { title, date, location };

  if (index === "") {
    events.push(newEvent);
  } else {
    events[parseInt(index)] = newEvent;
  }

  localStorage.setItem("upcomingEvents", JSON.stringify(events));
  closeEventModal();
  renderEvents();
}

function editEvent(index) {
  const event = events[index];
  document.getElementById("eventIndex").value = index;
  document.getElementById("eventTitle").value = event.title;
  document.getElementById("eventDate").value = event.date;
  document.getElementById("eventLocation").value = event.location;
  document.getElementById("eventModalTitle").textContent = "Edit Event";
  document.getElementById("eventModal").style.display = "flex";
}

function deleteEvent(index) {
  if (!confirm("Are you sure you want to delete this event?")) return;
  events.splice(index, 1);
  localStorage.setItem("upcomingEvents", JSON.stringify(events));
  renderEvents();
}

// ✅ MATCH SCHEDULE (persistent month)
let currentDate = new Date(localStorage.getItem("adminMatchScheduleMonth") || new Date());
const monthYearEl = document.getElementById("monthYear");
const matchTable = document.querySelector("#matchScheduleTable tbody");

function getCurrentMonthKey() {
  return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function loadMatches() {
  const key = getCurrentMonthKey();
  monthYearEl.textContent = key;
  matchTable.innerHTML = "";

  const matches = matchSchedule[key] || [];

  if (matches.length === 0) {
    matchTable.innerHTML = `<tr><td colspan="5" class="no-users">No matches scheduled for ${key}.</td></tr>`;
    return;
  }

  matches.forEach((match, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${match.date}</td>
      <td>${match.time}</td>
      <td>${match.teams}</td>
      <td>${match.location}</td>
      <td>
        <button onclick="editMatch(${index})">✏️</button>
        <button onclick="deleteMatch(${index})">❌</button>
      </td>
    `;
    matchTable.appendChild(row);
  });
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  localStorage.setItem("adminMatchScheduleMonth", currentDate);
  loadMatches();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  localStorage.setItem("adminMatchScheduleMonth", currentDate);
  loadMatches();
}

function openMatchModal() {
  document.getElementById("matchModal").style.display = "flex";
  document.getElementById("modalTitle").textContent = "Add Match";
  document.getElementById("matchIndex").value = "";
  document.getElementById("matchDate").value = "";
  document.getElementById("matchTime").value = "";
  document.getElementById("matchTeams").value = "";
  document.getElementById("matchLocation").value = "";
}

function closeMatchModal() {
  document.getElementById("matchModal").style.display = "none";
}

function saveMatch() {
  const index = document.getElementById("matchIndex").value;
  const date = document.getElementById("matchDate").value;
  const time = document.getElementById("matchTime").value;
  const teams = document.getElementById("matchTeams").value;
  const location = document.getElementById("matchLocation").value;

  if (!date || !time || !teams || !location) {
    alert("All fields are required.");
    return;
  }

  const match = { date, time, teams, location };
  const key = getCurrentMonthKey();

  if (!matchSchedule[key]) {
    matchSchedule[key] = [];
  }

  if (index === "") {
    matchSchedule[key].push(match);
  } else {
    matchSchedule[key][parseInt(index)] = match;
  }

  localStorage.setItem("matchSchedule", JSON.stringify(matchSchedule));
  closeMatchModal();
  loadMatches();
}

function editMatch(index) {
  const key = getCurrentMonthKey();
  const match = matchSchedule[key][index];
  document.getElementById("matchIndex").value = index;
  document.getElementById("matchDate").value = match.date;
  document.getElementById("matchTime").value = match.time;
  document.getElementById("matchTeams").value = match.teams;
  document.getElementById("matchLocation").value = match.location;
  document.getElementById("modalTitle").textContent = "Edit Match";
  document.getElementById("matchModal").style.display = "flex";
}

function deleteMatch(index) {
  const key = getCurrentMonthKey();
  if (confirm("Are you sure you want to delete this match?")) {
    matchSchedule[key].splice(index, 1);
    localStorage.setItem("matchSchedule", JSON.stringify(matchSchedule));
    loadMatches();
  }
}

// ✅ MATCH LOGS (persistent month)
let currentLogDate = new Date(localStorage.getItem("adminMatchLogMonth") || new Date());

function getCurrentLogMonthKey() {
  return currentLogDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function renderMatchLogs() {
  const table = document.getElementById("adminMatchLogsTableBody");
  if (!table) return;
  table.innerHTML = "";

  const logs = matchLogs.filter(log => {
    const logMonth = new Date(log.date).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    return logMonth === getCurrentLogMonthKey();
  });

  if (logs.length === 0) {
    table.innerHTML = `<tr><td colspan="5" class="no-users">No logs for ${getCurrentLogMonthKey()}.</td></tr>`;
    return;
  }

  logs.forEach((log, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${log.date}</td>
      <td>${log.player}</td>
      <td>${log.opponent}</td>
      <td>${log.winner}</td>
      <td>
        <button onclick="editLog(${index})">✏️</button>
        <button onclick="deleteLog(${index})">❌</button>
      </td>
    `;
    table.appendChild(row);
  });
}

function changeLogMonth(direction) {
  currentLogDate.setMonth(currentLogDate.getMonth() + direction);
  localStorage.setItem("adminMatchLogMonth", currentLogDate);
  renderMatchLogs();
}

function openLogModal() {
  document.getElementById("logModal").style.display = "block";
}

function closeLogModal() {
  document.getElementById("logModal").style.display = "none";
  document.getElementById("logDate").value = "";
  document.getElementById("logPlayer").value = "";
  document.getElementById("logOpponent").value = "";
  document.getElementById("logWinner").value = "";
  document.getElementById("logIndex").value = "";
}

function addOrUpdateLog() {
  const date = document.getElementById("logDate").value;
  const player = document.getElementById("logPlayer").value;
  const opponent = document.getElementById("logOpponent").value;
  const winner = document.getElementById("logWinner").value;
  const index = document.getElementById("logIndex").value;

  if (!date || !player || !opponent || !winner) {
    alert("Please fill all fields.");
    return;
  }

  const newLog = { date, player, opponent, winner };

  if (index === "") {
    matchLogs.push(newLog);
  } else {
    matchLogs[parseInt(index)] = newLog;
  }

  localStorage.setItem("matchLogs", JSON.stringify(matchLogs));
  closeLogModal();
  renderMatchLogs();
}

function editLog(index) {
  const log = matchLogs[index];
  document.getElementById("logDate").value = log.date;
  document.getElementById("logPlayer").value = log.player;
  document.getElementById("logOpponent").value = log.opponent;
  document.getElementById("logWinner").value = log.winner;
  document.getElementById("logIndex").value = index;

  openLogModal();
}

function deleteLog(index) {
  if (!confirm("Delete this log?")) return;
  matchLogs.splice(index, 1);
  localStorage.setItem("matchLogs", JSON.stringify(matchLogs));
  renderMatchLogs();
}

// ✅ USERS & ADMINS
function renderRegisteredUsers() {
  const userTable = document.getElementById("userTableContainer");
  const normalUsers = users.filter(user => user.role !== "admin");

  if (normalUsers.length === 0) {
    userTable.innerHTML = '<p class="no-users">No registered users found.</p>';
  } else {
    let html = `<table><thead><tr>
      <th>Full Name</th><th>Age</th><th>Gender</th><th>Team</th><th>Email</th><th>Signup Date</th>
    </tr></thead><tbody>`;
    normalUsers.forEach(user => {
      html += `<tr>
        <td>${user.name || "—"}</td>
        <td>${user.age || "—"}</td>
        <td>${user.gender || "—"}</td>
        <td>${user.team || "—"}</td>
        <td>${user.email || "—"}</td>
        <td>${user.signupDate || "—"}</td>
      </tr>`;
    });
    html += `</tbody></table>`;
    userTable.innerHTML = html;
  }
}

function renderRegisteredAdmins() {
  const adminTable = document.getElementById("adminTableContainer");
  const adminUsers = users.filter(user => user.role === "admin");

  if (adminUsers.length === 0) {
    adminTable.innerHTML = '<p class="no-users">No registered admins found.</p>';
  } else {
    let html = `<table><thead><tr>
      <th>Full Name</th><th>Email</th><th>Signup Date</th>
    </tr></thead><tbody>`;
    adminUsers.forEach(admin => {
      html += `<tr>
        <td>${admin.name || "—"}</td>
        <td>${admin.email || "—"}</td>
        <td>${admin.signupDate || "—"}</td>
      </tr>`;
    });
    html += `</tbody></table>`;
    adminTable.innerHTML = html;
  }
}

function renderUserLoginHistory() {
  const logins = JSON.parse(localStorage.getItem("userLoginHistory")) || [];
  const container = document.getElementById("userLoginHistoryContainer");

  if (logins.length === 0) {
    container.innerHTML = '<p class="no-users">No user login history found.</p>';
  } else {
    let html = `<table><thead><tr>
      <th>Name</th><th>Email</th><th>Team</th><th>Login Time</th>
    </tr></thead><tbody>`;
    logins.forEach(log => {
      html += `<tr>
        <td>${log.name || "—"}</td>
        <td>${log.email || "—"}</td>
        <td>${log.team || "—"}</td>
        <td>${log.loginDate || "—"}</td>
      </tr>`;
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
  }
}

function renderAdminLoginHistory() {
  const logins = JSON.parse(localStorage.getItem("adminHistory")) || [];
  const container = document.getElementById("adminHistoryContainer");

  if (logins.length === 0) {
    container.innerHTML = '<p class="no-users">No admin login history found.</p>';
  } else {
    let html = `<table><thead><tr>
      <th>Name</th><th>Email</th><th>Login Time</th>
    </tr></thead><tbody>`;
    logins.forEach(log => {
      html += `<tr>
        <td>${log.name || "—"}</td>
        <td>${log.email || "—"}</td>
        <td>${log.loginDate || "—"}</td>
      </tr>`;
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
  }
}

// ✅ LOGOUT
function logout() {
  localStorage.removeItem("adminLoggedIn");
  sessionStorage.removeItem("adminSessionLogged");
  window.location.href = "advertisement.html";
}

// ✅ Final init
window.onload = () => {
  renderEvents();
  renderMatchLogs();
  loadMatches();
  renderRegisteredUsers();
  renderRegisteredAdmins();
  renderUserLoginHistory();
  renderAdminLoginHistory();
};
