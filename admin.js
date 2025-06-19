// LOG MANAGEMENT (per month)
let matchLogs = JSON.parse(localStorage.getItem("matchLogs")) || {};
let logDate = new Date();
const logMonthYearEl = document.getElementById("logMonthYear");
const logTableBody = document.querySelector("#logTable tbody");

function getLogMonthKey() {
  return logDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function loadLogs() {
  const key = getLogMonthKey();
  logMonthYearEl.textContent = key;
  logTableBody.innerHTML = "";
  const logs = matchLogs[key] || [];
  if (!logs.length) {
    logTableBody.innerHTML = `<tr><td colspan="5" class="no-users">No logs for ${key}.</td></tr>`;
    return;
  }
  logs.forEach((log, idx) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${log.date}</td>
      <td>${log.player}</td>
      <td>${log.opponent}</td>
      <td>${log.winner}</td>
      <td>
        <button onclick="editLog(${idx})">✏️</button>
        <button onclick="deleteLog(${idx})">🗑️</button>
      </td>`;
    logTableBody.appendChild(row);
  });
}

function prevLogMonth() { logDate.setMonth(logDate.getMonth() - 1); loadLogs(); }
function nextLogMonth() { logDate.setMonth(logDate.getMonth() + 1); loadLogs(); }

function openLogModal() {
  document.getElementById("logModal").style.display = "flex";
  document.getElementById("modalLogTitle").textContent = "Add Log";
  ["logIndex","logDate","logPlayer","logOpponent","logWinner"].forEach(id => document.getElementById(id).value = "");
}

function closeLogModal() {
  document.getElementById("logModal").style.display = "none";
}

function saveLog() {
  const idx = document.getElementById("logIndex").value;
  const date = document.getElementById("logDate").value;
  const player = document.getElementById("logPlayer").value.trim();
  const opponent = document.getElementById("logOpponent").value.trim();
  const winner = document.getElementById("logWinner").value.trim();
  if (!date || !player || !opponent || !winner) return alert("All fields are required.");
  const key = getLogMonthKey();
  if (!matchLogs[key]) matchLogs[key] = [];
  const entry = { date, player, opponent, winner };
  if (idx === "") matchLogs[key].push(entry);
  else matchLogs[key][parseInt(idx)] = entry;
  localStorage.setItem("matchLogs", JSON.stringify(matchLogs));
  closeLogModal();
  loadLogs();
}

function editLog(idx) {
  const key = getLogMonthKey();
  const log = matchLogs[key][idx];
  document.getElementById("logIndex").value = idx;
  document.getElementById("logDate").value = log.date;
  document.getElementById("logPlayer").value = log.player;
  document.getElementById("logOpponent").value = log.opponent;
  document.getElementById("logWinner").value = log.winner;
  document.getElementById("modalLogTitle").textContent = "Edit Log";
  document.getElementById("logModal").style.display = "flex";
}

function deleteLog(idx) {
  const key = getLogMonthKey();
  if (confirm("Delete this log?")) {
    matchLogs[key].splice(idx,1);
    localStorage.setItem("matchLogs", JSON.stringify(matchLogs));
    loadLogs();
  }
}

// Initialize logs on page load
loadLogs();
