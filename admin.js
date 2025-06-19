// Redirect if not logged in
if (localStorage.getItem("adminLoggedIn") !== "true") {
  window.location.href = "admin-login.html";
}

// Admin welcome message
const admin = JSON.parse(localStorage.getItem("admin"));
document.getElementById("welcomeAdmin").textContent = `👑 Welcome, Admin ${admin?.name || "Unknown"}!`;

// Save admin session history (only once per session)
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

// Match Schedule Functions
let matches = JSON.parse(localStorage.getItem("matchSchedule")) || [];

function loadMatches() {
  const table = document.querySelector("#matchScheduleTable tbody");
  table.innerHTML = "";

  if (matches.length === 0) {
    table.innerHTML = `<tr><td colspan="5" class="no-users">No matches scheduled.</td></tr>`;
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
        <button onclick="deleteMatch(${index})">🗑️</button>
      </td>
    `;
    table.appendChild(row);
  });
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

  const matchObj = { date, time, teams, location };

  if (index === "") {
    matches.push(matchObj);
  } else {
    matches[parseInt(index)] = matchObj;
  }

  localStorage.setItem("matchSchedule", JSON.stringify(matches));
  closeMatchModal();
  loadMatches();
}

function editMatch(index) {
  const match = matches[index];
  document.getElementById("matchIndex").value = index;
  document.getElementById("matchDate").value = match.date;
  document.getElementById("matchTime").value = match.time;
  document.getElementById("matchTeams").value = match.teams;
  document.getElementById("matchLocation").value = match.location;
  document.getElementById("modalTitle").textContent = "Edit Match";
  document.getElementById("matchModal").style.display = "flex";
}

function deleteMatch(index) {
  if (confirm("Are you sure you want to delete this match?")) {
    matches.splice(index, 1);
    localStorage.setItem("matchSchedule", JSON.stringify(matches));
    loadMatches();
  }
}

// Load matches on start
loadMatches();

// Registered Users/Admins
const users = JSON.parse(localStorage.getItem("users")) || [];
const userTable = document.getElementById("userTableContainer");
const adminTable = document.getElementById("adminTableContainer");

const normalUsers = users.filter(user => user.role !== "admin");
const adminUsers = users.filter(user => user.role === "admin");

// Registered Users Table
if (normalUsers.length === 0) {
  userTable.innerHTML = '<p class="no-users">No registered users found.</p>';
} else {
  let tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Full Name</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Team</th>
          <th>Email</th>
          <th>Signup Date</th>
        </tr>
      </thead>
      <tbody>
  `;
  normalUsers.forEach(user => {
    tableHTML += `
      <tr>
        <td>${user.name || "—"}</td>
        <td>${user.age || "—"}</td>
        <td>${user.gender || "—"}</td>
        <td>${user.team || "—"}</td>
        <td>${user.email || "—"}</td>
        <td>${user.signupDate || "—"}</td>
      </tr>
    `;
  });
  tableHTML += `</tbody></table>`;
  userTable.innerHTML = tableHTML;
}

// Registered Admins Table
if (adminUsers.length === 0) {
  adminTable.innerHTML = '<p class="no-users">No registered admins found.</p>';
} else {
  let tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Full Name</th>
          <th>Email</th>
          <th>Signup Date</th>
        </tr>
      </thead>
      <tbody>
  `;
  adminUsers.forEach(admin => {
    tableHTML += `
      <tr>
        <td>${admin.name || "—"}</td>
        <td>${admin.email || "—"}</td>
        <td>${admin.signupDate || "—"}</td>
      </tr>
    `;
  });
  tableHTML += `</tbody></table>`;
  adminTable.innerHTML = tableHTML;
}

// User Login History
const userLoginHistory = JSON.parse(localStorage.getItem("userLoginHistory")) || [];
const userHistoryContainer = document.getElementById("userLoginHistoryContainer");

if (userLoginHistory.length === 0) {
  userHistoryContainer.innerHTML = '<p class="no-users">No user login history found.</p>';
} else {
  let historyHTML = `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Team</th>
          <th>Login Time</th>
        </tr>
      </thead>
      <tbody>
  `;
  userLoginHistory.forEach(entry => {
    historyHTML += `
      <tr>
        <td>${entry.name || "—"}</td>
        <td>${entry.email || "—"}</td>
        <td>${entry.team ? entry.team : "Unknown Team"}</td>
        <td>${entry.loginDate || "—"}</td>
      </tr>
    `;
  });
  historyHTML += `</tbody></table>`;
  userHistoryContainer.innerHTML = historyHTML;
}

// Admin Login History
const adminHistory = JSON.parse(localStorage.getItem("adminHistory")) || [];
const adminHistoryContainer = document.getElementById("adminHistoryContainer");

if (adminHistory.length === 0) {
  adminHistoryContainer.innerHTML = '<p class="no-users">No admin login history found.</p>';
} else {
  let adminLogHTML = `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Login Time</th>
        </tr>
      </thead>
      <tbody>
  `;
  adminHistory.forEach(log => {
    adminLogHTML += `
      <tr>
        <td>${log.name || "—"}</td>
        <td>${log.email || "—"}</td>
        <td>${log.loginDate || "—"}</td>
      </tr>
    `;
  });
  adminLogHTML += `</tbody></table>`;
  adminHistoryContainer.innerHTML = adminLogHTML;
}

// Logout Function
function logout() {
  localStorage.removeItem("adminLoggedIn");
  sessionStorage.removeItem("adminSessionLogged");
  window.location.href = "advertisement.html";
}
