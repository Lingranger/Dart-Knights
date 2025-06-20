// Redirect if not logged in
if (localStorage.getItem("adminLoggedIn") !== "true") {
  window.location.href = "admin-login.html";
}

// Admin welcome message
const admin = JSON.parse(localStorage.getItem("admin"));
document.getElementById("welcomeAdmin").textContent = 👑 Welcome, Admin ${admin?.name || "Unknown"}!;

// Save admin session history (once per session)
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

// MATCH SCHEDULE (monthly based)
let matchSchedule = JSON.parse(localStorage.getItem("matchSchedule")) || {};
let currentDate = new Date();
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
    matchTable.innerHTML = <tr><td colspan="5" class="no-users">No matches scheduled for ${key}.</td></tr>;
    return;
  }

  matches.forEach((match, index) => {
    const row = document.createElement("tr");
    row.innerHTML = 
      <td>${match.date}</td>
      <td>${match.time}</td>
      <td>${match.teams}</td>
      <td>${match.location}</td>
      <td>
        <button onclick="editMatch(${index})">✏️</button>
        <button onclick="deleteMatch(${index})">🔚️</button>
      </td>
    ;
    matchTable.appendChild(row);
  });
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  loadMatches();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
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

function renderMatchLogs() {
  const logs = JSON.parse(localStorage.getItem("matchLogs")) || [];
  const table = document.getElementById("adminMatchLogsTableBody");
  if (!table) return;
  table.innerHTML = "";

  logs.forEach((log, index) => {
    const row = document.createElement("tr");
    row.innerHTML = 
      <td>${log.date}</td>
      <td>${log.player}</td>
      <td>${log.opponent}</td>
      <td>${log.winner}</td>
      <td>
        <button onclick="editLog(${index})">✏️</button>
        <button onclick="deleteLog(${index})">🔚️</button>
      </td>
    ;
    table.appendChild(row);
  });
}

function renderMatchLogsWithMonth() {
  renderMatchLogs(); // Placeholder for future month-based filtering
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

  const logs = JSON.parse(localStorage.getItem("matchLogs")) || [];
  const newLog = { date, player, opponent, winner };

  if (index === "") {
    logs.push(newLog);
  } else {
    logs[parseInt(index)] = newLog;
  }

  localStorage.setItem("matchLogs", JSON.stringify(logs));
  closeLogModal();
  renderMatchLogs();
}

function editLog(index) {
  const logs = JSON.parse(localStorage.getItem("matchLogs")) || [];
  const log = logs[index];

  document.getElementById("logDate").value = log.date;
  document.getElementById("logPlayer").value = log.player;
  document.getElementById("logOpponent").value = log.opponent;
  document.getElementById("logWinner").value = log.winner;
  document.getElementById("logIndex").value = index;

  openLogModal();
}

function deleteLog(index) {
  if (!confirm("Delete this log?")) return;
  const logs = JSON.parse(localStorage.getItem("matchLogs")) || [];
  logs.splice(index, 1);
  localStorage.setItem("matchLogs", JSON.stringify(logs));
  renderMatchLogs();
}

function renderRegisteredUsers() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userTable = document.getElementById("userTableContainer");
  const normalUsers = users.filter(user => user.role !== "admin");

  if (normalUsers.length === 0) {
    userTable.innerHTML = '<p class="no-users">No registered users found.</p>';
  } else {
    let html = <table><thead><tr>
      <th>Full Name</th><th>Age</th><th>Gender</th><th>Team</th><th>Email</th><th>Signup Date</th>
    </tr></thead><tbody>;
    normalUsers.forEach(user => {
      html += <tr>
        <td>${user.name || "—"}</td>
        <td>${user.age || "—"}</td>
        <td>${user.gender || "—"}</td>
        <td>${user.team || "—"}</td>
        <td>${user.email || "—"}</td>
        <td>${user.signupDate || "—"}</td>
      </tr>;
    });
    html += </tbody></table>;
    userTable.innerHTML = html;
  }
}

function renderRegisteredAdmins() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const adminTable = document.getElementById("adminTableContainer");
  const adminUsers = users.filter(user => user.role === "admin");

  if (adminUsers.length === 0) {
    adminTable.innerHTML = '<p class="no-users">No registered admins found.</p>';
  } else {
    let html = <table><thead><tr>
      <th>Full Name</th><th>Email</th><th>Signup Date</th>
    </tr></thead><tbody>;
    adminUsers.forEach(admin => {
      html += <tr>
        <td>${admin.name || "—"}</td>
        <td>${admin.email || "—"}</td>
        <td>${admin.signupDate || "—"}</td>
      </tr>;
    });
    html += </tbody></table>;
    adminTable.innerHTML = html;
  }
}

function renderUserLoginHistory() {
  const logins = JSON.parse(localStorage.getItem("userLoginHistory")) || [];
  const container = document.getElementById("userLoginHistoryContainer");

  if (logins.length === 0) {
    container.innerHTML = '<p class="no-users">No user login history found.</p>';
  } else {
    let html = <table><thead><tr>
      <th>Name</th><th>Email</th><th>Team</th><th>Login Time</th>
    </tr></thead><tbody>;
    logins.forEach(log => {
      html += <tr>
        <td>${log.name || "—"}</td>
        <td>${log.email || "—"}</td>
        <td>${log.team || "—"}</td>
        <td>${log.loginDate || "—"}</td>
      </tr>;
    });
    html += </tbody></table>;
    container.innerHTML = html;
  }
}

function renderAdminLoginHistory() {
  const logins = JSON.parse(localStorage.getItem("adminHistory")) || [];
  const container = document.getElementById("adminHistoryContainer");

  if (logins.length === 0) {
    container.innerHTML = '<p class="no-users">No admin login history found.</p>';
  } else {
    let html = <table><thead><tr>
      <th>Name</th><th>Email</th><th>Login Time</th>
    </tr></thead><tbody>;
    logins.forEach(log => {
      html += <tr>
        <td>${log.name || "—"}</td>
        <td>${log.email || "—"}</td>
        <td>${log.loginDate || "—"}</td>
      </tr>;
    });
    html += </tbody></table>;
    container.innerHTML = html;
  }
}

function logout() {
  localStorage.removeItem("adminLoggedIn");
  sessionStorage.removeItem("adminSessionLogged");
  window.location.href = "advertisement.html";
}

window.onload = () => {
  renderMatchLogsWithMonth();
  loadMatches();
  renderRegisteredUsers();
  renderRegisteredAdmins();
  renderUserLoginHistory();
  renderAdminLoginHistory();
}; 
