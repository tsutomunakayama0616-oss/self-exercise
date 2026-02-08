const RESULT_KEY = "selftraining_result_count";
let count = Number(localStorage.getItem(RESULT_KEY) || "0");
count += 1;
localStorage.setItem(RESULT_KEY, String(count));

const base = { abduction: 30, knee: 60, pelvis: 15, trunk: 10 };
const factor = Math.max(0, 5 - count);

const abduction = base.abduction - factor;
const knee = base.knee - factor;
const pelvis = base.pelvis - factor / 2;
const trunk = base.trunk - factor / 2;

document.getElementById("abduction").textContent = abduction.toFixed(0);
document.getElementById("knee").textContent = knee.toFixed(0);
document.getElementById("pelvis").textContent = pelvis.toFixed(0);
document.getElementById("trunk").textContent = trunk.toFixed(0);

const good = [];
const bad = [];

if (abduction >= 25 && abduction <= 35) good.push("股関節の開きは良好です。");
else bad.push("股関節の開きがやや不足しています。");

if (knee >= 50 && knee <= 70) good.push("膝の曲がり具合は適切です。");
else bad.push("膝の角度をもう少し調整しましょう。");

if (pelvis >= 5 && pelvis <= 15) good.push("骨盤の傾きは安定しています。");
else bad.push("骨盤の前後傾きに注意しましょう。");

if (trunk >= 3 && trunk <= 10) good.push("体幹の傾きは良好です。");
else bad.push("体幹の前後の傾きに注意しましょう。");

document.getElementById("good").innerHTML = good.map(t => `<li>${t}</li>`).join("");
document.getElementById("bad").innerHTML = bad.map(t => `<li>${t}</li>`).join("");
