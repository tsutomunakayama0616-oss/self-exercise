// check.js の saveProgress() で保存されたデータを利用
// localStorage key: "progress"
// 形式: [{ date: "2026-02-09", exercise: "squat", score: 85 }, ...]

const raw = localStorage.getItem("progress") || "[]";
const records = JSON.parse(raw);

// 年月の一覧を作成
const yearSet = new Set();
const monthSetByYear = {};

records.forEach(r => {
  const [y, m] = r.date.split("-");
  yearSet.add(y);
  if (!monthSetByYear[y]) monthSetByYear[y] = new Set();
  monthSetByYear[y].add(m);
});

const yearSelect = document.getElementById("yearSelect");
const monthSelect = document.getElementById("monthSelect");

// 年セレクト初期化
const years = Array.from(yearSet).sort();
if (years.length === 0) {
  const now = new Date();
  years.push(String(now.getFullYear()));
}
years.forEach(y => {
  const opt = document.createElement("option");
  opt.value = y;
  opt.textContent = y + "年";
  yearSelect.appendChild(opt);
});

// 月セレクト更新
function updateMonthOptions() {
  monthSelect.innerHTML = "";
  const y = yearSelect.value;
  const months = monthSetByYear[y]
    ? Array.from(monthSetByYear[y]).sort()
    : [];

  const baseMonths = months.length > 0 ? months : ["01","02","03","04","05","06","07","08","09","10","11","12"];

  baseMonths.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = Number(m) + "月";
    monthSelect.appendChild(opt);
  });
}

yearSelect.addEventListener("change", () => {
  updateMonthOptions();
  updateChart();
});

monthSelect.addEventListener("change", () => {
  updateChart();
});

// Chart.js 初期化
const ctx = document.getElementById("progressChart").getContext("2d");
let chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "フォーム精度（%）",
      data: [],
      borderColor: "#4caf50",
      backgroundColor: "rgba(76,175,80,0.2)",
      tension: 0.2
    }]
  },
  options: {
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: { stepSize: 20 }
      }
    }
  }
});

function updateChart() {
  const y = yearSelect.value;
  const m = monthSelect.value;

  const filtered = records.filter(r => r.date.startsWith(`${y}-${m}`));

  const labels = filtered.map(r => r.date.slice(8)); // 日だけ
  const data = filtered.map(r => r.score);

  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.update();
}

// 初期表示
updateMonthOptions();
updateChart();
