// Redirect if not logged in
if (localStorage.getItem("adminLoggedIn") !== "true") {
  window.location.href = "admin-login.html";
}

// Admin welcome message
const admin = JSON.parse(localStorage.getItem("admin"));
document.getElementById("welcomeAdmin").textContent = `👑 Welcome, Admin ${admin?.name || "Unknown"}!`;

// Show Match Schedule section only for admins
if (localStorage.getItem("adminLoggedIn") === "true") {
  document.getElementById("matchScheduleSection").style.display = "block";
  loadMatches();
}

// Open Modal
function openMatchModal(index = null) {
  document.getElementById("matchModal").style.display = "flex";
  if (index !== null) {
    const match = matches[index];
    document.getElementById("modalTitle").textContent = "Edit Match";
    document.getElementById("matchIndex").value = index;
    document.getElementById("matchDate").value = match.date;
    document.getElementById("matchTime").value = match.time;
    document.getElementById("matchTeams").value = match.match;
    document.getElementById("matchLocation").value = match.location;
  } else {
    document.getElementById("modalTitle").textContent = "Add Match";
    document.getElementById("matchIndex").value = "";
    document.getElementById("matchDate").value = "";
    document.getElementById("matchTime").value = "";
    document.getElementById("matchTeams").value = "";
    document.getElementById("matchLocation").value = "";
  }
}

// Close Modal
function closeMatchModal() {
  document.getElementById("matchModal").style.display = "none";
}

let matches = JSON.parse(localStorage.getItem("matchSchedule")) || [];

function loadMatches() {
  const tbody = document.querySelector("#matchScheduleTable tbody");
  tbody.innerHTML = "";
  matches.forEach((m, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.date}</td>
      <td>${m.time}</td>
      <td>${m.match}</td>
      <td>${m.location}</td>
      <td>
        <button onclick="openMatchModal(${i})">✏️</button>
        <button onclick="deleteMatch(${i})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function saveMatch() {
  const index = document.getElementById("matchIndex").value;
  const newMatch = {
    date: document.getElementById("matchDate").value,
    time: document.getElementById("matchTime").value,
    match: document.getElementById("matchTeams").value,
    location: document.getElementById("matchLocation").value
  };

  if (index === "") {
    matches.push(newMatch);
  } else {
    matches[parseInt(index)] = newMatch;
  }

  localStorage.setItem("matchSchedule", JSON.stringify(matches));
  closeMatchModal();
  loadMatches();
}

function deleteMatch(index) {
  if (confirm("Are you sure you want to delete this match?")) {
    matches.splice(index, 1);
    localStorage.setItem("matchSchedule", JSON.stringify(matches));
    loadMatches();
  }
}

// Log session if first time this session
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

// Load and display users
const users = JSON.parse(localStorage.getItem("users")) || [];
const userTable = document.getElementById("userTableContainer");
const adminTable = document.getElementById("adminTableContainer");

const normalUsers = users.filter(user => user.role !== "admin");
const adminUsers = users.filter(user => user.role === "admin");

// Registered Users
if (normalUsers.length === 0) {
  userTable.innerHTML = '<p class="no-users">No registered users found.</p>';
} else {
  let table = `
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
    table += `
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
  table += `</tbody></table>`;
  userTable.innerHTML = table;
}

// Registered Admins
if (adminUsers.length === 0) {
  adminTable.innerHTML = '<p class="no-users">No registered admins found.</p>';
} else {
  let adminHTML = `
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
    adminHTML += `
      <tr>
        <td>${admin.name || "—"}</td>
        <td>${admin.email || "—"}</td>
        <td>${admin.signupDate || "—"}</td>
      </tr>
    `;
  });
  adminHTML += `</tbody></table>`;
  adminTable.innerHTML = adminHTML;
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
        <td>${entry.team || "Unknown Team"}</td>
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

// Logout
function logout() {
  localStorage.removeItem("adminLoggedIn");
  sessionStorage.removeItem("adminSessionLogged");
  window.location.href = "advertisement.html";
}
