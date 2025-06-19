// Redirect if not logged in
if (localStorage.getItem("adminLoggedIn") !== "true") {
  window.location.href = "admin-login.html";
}

// Get admin data and show welcome message
const admin = JSON.parse(localStorage.getItem("admin")) || {};
document.getElementById("welcomeAdmin").textContent = `👑 Welcome, Admin ${admin.name || "Unknown"}!`;

// Log admin login to session (only once)
if (!sessionStorage.getItem("adminSessionLogged")) {
  const history = JSON.parse(localStorage.getItem("adminHistory")) || [];
  history.push({
    name: admin.name || "Unknown",
    email: admin.email || "Unknown",
    loginDate: new Date().toLocaleString()
  });
  localStorage.setItem("adminHistory", JSON.stringify(history));
  sessionStorage.setItem("adminSessionLogged", "true");
}

// Logout
function logout() {
  localStorage.removeItem("adminLoggedIn");
  sessionStorage.removeItem("adminSessionLogged");
  window.location.href = "advertisement.html";
}

// Load Users
const users = JSON.parse(localStorage.getItem("users")) || [];
const userTable = document.getElementById("userTableContainer");
const adminTable = document.getElementById("adminTableContainer");

const normalUsers = users.filter(user => user.role !== "admin");
const adminUsers = users.filter(user => user.role === "admin");

// Display Users
function renderUsers() {
  if (normalUsers.length === 0) {
    userTable.innerHTML = '<p class="no-users">No registered users found.</p>';
  } else {
    let table = `<table><thead><tr>
      <th>Full Name</th><th>Age</th><th>Gender</th><th>Team</th><th>Email</th><th>Signup Date</th>
    </tr></thead><tbody>`;
    normalUsers.forEach(user => {
      table += `<tr>
        <td>${user.name || "—"}</td>
        <td>${user.age || "—"}</td>
        <td>${user.gender || "—"}</td>
        <td>${user.team || "—"}</td>
        <td>${user.email || "—"}</td>
        <td>${user.signupDate || "—"}</td>
      </tr>`;
    });
    table += "</tbody></table>";
    userTable.innerHTML = table;
  }
}

// Display Admins
function renderAdmins() {
  if (adminUsers.length === 0) {
    adminTable.innerHTML = '<p class="no-users">No registered admins found.</p>';
  } else {
    let table = `<table><thead><tr>
      <th>Full Name</th><th>Email</th><th>Signup Date</th>
    </tr></thead><tbody>`;
    adminUsers.forEach(admin => {
      table += `<tr>
        <td>${admin.name || "—"}</td>
        <td>${admin.email || "—"}</td>
        <td>${admin.signupDate || "—"}</td>
      </tr>`;
    });
    table += "</tbody></table>";
    adminTable.innerHTML = table;
  }
}

// Login History
function renderLoginHistory() {
  const userLoginHistory = JSON.parse(localStorage.getItem("userLoginHistory")) || [];
  const adminLoginHistory = JSON.parse(localStorage.getItem("adminHistory")) || [];

  const userHistoryContainer = document.getElementById("userLoginHistoryContainer");
  const adminHistoryContainer = document.getElementById("adminHistoryContainer");

  if (userLoginHistory.length === 0) {
    userHistoryContainer.innerHTML = '<p class="no-users">No user login history found.</p>';
  } else {
    let table = `<table><thead><tr>
      <th>Name</th><th>Email</th><th>Team</th><th>Login Time</th>
    </tr></thead><tbody>`;
    userLoginHistory.forEach(entry => {
      table += `<tr>
        <td>${entry.name || "—"}</td>
        <td>${entry.email || "—"}</td>
        <td>${entry.team || "Unknown Team"}</td>
        <td>${entry.loginDate || "—"}</td>
      </tr>`;
    });
    table += "</tbody></table>";
    userHistoryContainer.innerHTML = table;
  }

  if (adminLoginHistory.length === 0) {
    adminHistoryContainer.innerHTML = '<p class="no-users">No admin login history found.</p>';
  } else {
    let table = `<table><thead><tr>
      <th>Name</th><th>Email</th><th>Login Time</th>
    </tr></thead><tbody>`;
    adminLoginHistory.forEach(entry => {
      table += `<tr>
        <td>${entry.name || "—"}</td>
        <td>${entry.email || "—"}</td>
        <td>${entry.loginDate || "—"}</td>
      </tr>`;
    });
    table += "</tbody></table>";
    adminHistoryContainer.innerHTML = table;
  }
}

renderUsers();
renderAdmins();
renderLoginHistory();


// 🔐 Match Schedule Manager

const matchScheduleSection = document.getElementById("matchScheduleSection");
const matchModal = document.getElementById("matchModal");
const matchIndexInput = document.getElementById("matchIndex");
const matchDateInput = document.getElementById("matchDate");
const matchTimeInput = document.getElementById("matchTime");
const matchTeamsInput = document.getElementById("matchTeams");
const matchLocationInput = document.getElementById("matchLocation");
const modalTitle = document.getElementById("modalTitle");

let matches = JSON.parse(localStorage.getItem("matchSchedule")) || [];

if (localStorage.getItem("adminLoggedIn") === "true") {
  matchScheduleSection.style.display = "block";
  renderMatchSchedule();
}

// Open modal for new match
function openMatchModal() {
  modalTitle.textContent = "Add Match";
  matchIndexInput.value = "";
  matchDateInput.value = "";
  matchTimeInput.value = "";
  matchTeamsInput.value = "";
  matchLocationInput.value = "";
  matchModal.style.display = "flex";
}

// Save match (add or edit)
function saveMatch() {
  const index = matchIndexInput.value;
  const match = {
    date: matchDateInput.value,
    time: matchTimeInput.value,
    match: matchTeamsInput.value,
    location: matchLocationInput.value
  };

  if (index === "") {
    matches.push(match);
  } else {
    matches[index] = match;
  }

  localStorage.setItem("matchSchedule", JSON.stringify(matches));
  renderMatchSchedule();
  closeMatchModal();
}

// Render match table
function renderMatchSchedule() {
  const tbody = document.querySelector("#matchScheduleTable tbody");
  tbody.innerHTML = "";

  matches.forEach((match, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${match.date}</td>
      <td>${match.time}</td>
      <td>${match.match}</td>
      <td>${match.location}</td>
      <td>
        <button onclick="editMatch(${i})">✏️</button>
        <button onclick="deleteMatch(${i})">🗑️</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Edit a match
function editMatch(index) {
  const match = matches[index];
  matchIndexInput.value = index;
  matchDateInput.value = match.date;
  matchTimeInput.value = match.time;
  matchTeamsInput.value = match.match;
  matchLocationInput.value = match.location;
  modalTitle.textContent = "Edit Match";
  matchModal.style.display = "flex";
}

// Delete a match
function deleteMatch(index) {
  if (confirm("Are you sure you want to delete this match?")) {
    matches.splice(index, 1);
    localStorage.setItem("matchSchedule", JSON.stringify(matches));
    renderMatchSchedule();
  }
}

// Close modal
function closeMatchModal() {
  matchModal.style.display = "none";
}
