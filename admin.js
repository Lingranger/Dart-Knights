// ✅ 1) Check admin login
if (localStorage.getItem("adminLoggedIn") !== "true") {
  window.location.href = "admin-login.html";
}

// ✅ 2) Show admin welcome
const admin = JSON.parse(localStorage.getItem("admin"));
document.getElementById("welcomeAdmin").textContent = `👑 Welcome, Admin ${admin?.name || "Unknown"}!`;

// ✅ 3) Save admin login history once per session
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

// ✅ 4) Set fallback data **ONLY if no data yet**
if (!localStorage.getItem("upcomingEvents")) {
  const defaultEvents = [
    { title: "Opening Tournament", date: "2025-07-15", location: "Butuan City Dome" }
  ];
  localStorage.setItem("upcomingEvents", JSON.stringify(defaultEvents));
}

if (!localStorage.getItem("matchSchedule")) {
  const defaultSchedule = {
    [new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })]: [
      {
        date: new Date().toISOString().split("T")[0],
        time: "18:00",
        teams: "Team Alpha vs Team Beta",
        location: "Butuan City Dome"
      }
    ]
  };
  localStorage.setItem("matchSchedule", JSON.stringify(defaultSchedule));
}

if (!localStorage.getItem("matchLogs")) {
  const defaultLogs = [
    {
      date: new Date().toISOString().split("T")[0],
      player: "John Doe",
      opponent: "Jane Smith",
      winner: "John Doe"
    }
  ];
  localStorage.setItem("matchLogs", JSON.stringify(defaultLogs));
}

if (!localStorage.getItem("users")) {
  const defaultUsers = [
    {
      name: "Admin",
      email: "admin@example.com",
      role: "admin",
      signupDate: new Date().toLocaleDateString()
    }
  ];
  localStorage.setItem("users", JSON.stringify(defaultUsers));
}

// ✅ Now safely load
let events = JSON.parse(localStorage.getItem("upcomingEvents"));
let matchSchedule = JSON.parse(localStorage.getItem("matchSchedule"));
let matchLogs = JSON.parse(localStorage.getItem("matchLogs"));
let users = JSON.parse(localStorage.getItem("users"));

// ✅ Safe month state
let currentDate = localStorage.getItem("adminMatchScheduleMonth")
  ? new Date(localStorage.getItem("adminMatchScheduleMonth"))
  : new Date();

let currentLogDate = localStorage.getItem("adminMatchLogMonth")
  ? new Date(localStorage.getItem("adminMatchLogMonth"))
  : new Date();

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

// ✅ MATCH SCHEDULE
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
    matchTable.innerHTML = `<tr><td colspan="5">No matches for ${key}.</td></tr>`;
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
  localStorage.setItem("adminMatchScheduleMonth", currentDate.toISOString());
  loadMatches();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  localStorage.setItem("adminMatchScheduleMonth", currentDate.toISOString());
  loadMatches();
}

// ✅ LOGS
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
    table.innerHTML = `<tr><td colspan="5">No logs for ${getCurrentLogMonthKey()}.</td></tr>`;
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

function prevLogMonth() {
  currentLogDate.setMonth(currentLogDate.getMonth() - 1);
  localStorage.setItem("adminMatchLogMonth", currentLogDate.toISOString());
  renderMatchLogs();
}

function nextLogMonth() {
  currentLogDate.setMonth(currentLogDate.getMonth() + 1);
  localStorage.setItem("adminMatchLogMonth", currentLogDate.toISOString());
  renderMatchLogs();
}

// ✅ INIT
window.onload = () => {
  renderEvents();
  loadMatches();
  renderMatchLogs();
};
