const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSytzFWEarglEI45Km6463QZ_UeBXThZf32NLcB-Hbnj13YaL7v7QYrGsdWQFaaR_9gO6ESMp-ox3sh/pub?gid=0&single=true&output=csv';

async function fetchData() {
try {
const response = await fetch(SHEET_URL);
const text = await response.text();
const json = JSON.parse(text.substr(47).slice(0, -2));
const rows = json.table.rows;

// Parse sheet rows into simple key:value pairs
const data = {};
rows.forEach(r => {
const cell = r.c[0]?.v || "";
const parts = cell.split(":");
if (parts.length === 2) data[parts[0].trim()] = parts[1].trim();
});

updateDashboard(data);
} catch (err) {
console.error("Fetch error:", err);
document.getElementById("dashboard").innerText = "⚠️ Error loading data";
}
}

function updateDashboard(data) {
let html = "";
for (const [key, value] of Object.entries(data)) {
if (key.includes("🌪️")) continue;
html += `<div class="data-box"><strong>${key}</strong><br>${value}</div>`;
}
document.getElementById("dashboard").innerHTML = html;
document.getElementById("timestamp").innerText = "Last updated: " + new Date().toLocaleTimeString();
}

// Refresh every 10 seconds
fetchData();
setInterval(fetchData, 10000);
