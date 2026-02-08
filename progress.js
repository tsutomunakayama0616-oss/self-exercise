const KEY = "selftraining_progress";
const progressList = document.getElementById("progress-list");

function loadProgress() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveProgress(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

let data = loadProgress();
if (data.length === 0) {
  data = [
    { month: "1月", comment: "フォーム改善 20%" },
    { month: "2月", comment: "フォーム改善 35%" }
  ];
  saveProgress(data);
}

if (progressList) {
  progressList.innerHTML = "";
  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = `${item.month}：${item.comment}`;
    progressList.appendChild(div);
  });
}
