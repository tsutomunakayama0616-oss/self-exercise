// =======================
// 音声フィードバック
// =======================
function speak(text) {
  const uttr = new SpeechSynthesisUtterance(text);
  uttr.lang = "ja-JP";
  uttr.rate = 1.1;
  speechSynthesis.speak(uttr);
}

const beep = new Audio("beep.mp3");

function playBeep() {
  beep.currentTime = 0;
  beep.play();
}

// =======================
// 距離推定
// =======================
function estimateDistance(keypoints) {
  const left = keypoints[5];
  const right = keypoints[6];

  if (left.score < 0.3 || right.score < 0.3) return null;

  const dx = left.x - right.x;
  const dy = left.y - right.y;
  const pixelWidth = Math.sqrt(dx*dx + dy*dy);

  return 200 / pixelWidth;
}

function updateDistanceGuide(distance) {
  const bar = document.getElementById("distance-bar");
  const text = document.getElementById("distance-text");

  if (!distance) {
    text.textContent = "人物を検出しています…";
    bar.style.width = "0%";
    bar.style.background = "gray";
    return;
  }

  const percent = Math.min(100, Math.max(0, (distance / 4) * 100));
  bar.style.width = percent + "%";

  if (distance < 1.2) {
    bar.style.background = "red";
    text.textContent = "近すぎます（もう少し下がってください）";
  } else if (distance < 1.5) {
    bar.style.background = "yellow";
    text.textContent = "やや近いです";
  } else if (distance <= 2.5) {
    bar.style.background = "green";
    text.textContent = "適正距離です";
  } else if (distance <= 3.0) {
    bar.style.background = "yellow";
    text.textContent = "やや遠いです";
  } else {
    bar.style.background = "red";
    text.textContent = "遠すぎます（もう少し近づいてください）";
  }
}

// =======================
// 骨格ライン描画
// =======================
function drawSkeleton(keypoints) {
  const canvas = document.getElementById("skeleton");
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(0,255,0,0.6)";
  ctx.lineWidth = 3;

  const edges = [
    [5, 7], [7, 9],
    [6, 8], [8, 10],
    [5, 6],
    [11, 12],
    [11, 13], [13, 15],
    [12, 14], [14, 16]
  ];

  edges.forEach(([a, b]) => {
    const p1 = keypoints[a];
    const p2 = keypoints[b];

    if (p1.score > 0.3 && p2.score > 0.3) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  });
}

// =======================
// リアルタイム姿勢評価
// =======================
function getBodyTilt(keypoints) {
  const L = keypoints[5];
  const R = keypoints[6];
  if (L.score < 0.3 || R.score < 0.3) return null;
  return Math.atan2(L.y - R.y, L.x - R.x) * 180 / Math.PI;
}

function getHipTilt(keypoints) {
  const L = keypoints[11];
  const R = keypoints[12];
  if (L.score < 0.3 || R.score < 0.3) return null;
  return Math.atan2(L.y - R.y, L.x - R.x) * 180 / Math.PI;
}

function generateLiveFeedback(exercise, keypoints) {
  const tilt = getBodyTilt(keypoints);
  const hip = getHipTilt(keypoints);

  let msg = "";

  if (!tilt || !hip) return "姿勢を検出しています…";

  if (Math.abs(tilt) > 10) msg += "上半身が傾いています。<br>";
  if (Math.abs(hip) > 10) msg += "骨盤が傾いています。<br>";

  if (msg === "") msg = "良い姿勢です！そのまま続けましょう。";

  return msg;
}

// =======================
// AIコーチ（表情＋セリフ）
// =======================
const coachLines = {
  good: [
    "その調子！とても良い姿勢です。",
    "完璧です！そのまま続けましょう。",
    "いいですね！安定しています。",
    "素晴らしいフォームです！"
  ],
  bad: [
    "少し姿勢を整えましょう。",
    "ゆっくり動いて安定させましょう。",
    "もう少しだけ意識してみましょう。",
    "焦らず丁寧に動きましょう。"
  ]
};

function getRandomLine(type) {
  const list = coachLines[type];
  return list[Math.floor(Math.random() * list.length)];
}

function updateCoachExpression(isGood) {
  const img = document.getElementById("coach-img");
  img.src = isGood ? "coach_smile.png" : "coach.png";
}

function updateCoach(feedback) {
  const coachText = document.getElementById("coach-text");
  const good = feedback.includes("良い姿勢です");
  coachText.innerHTML = good ? getRandomLine("good") : getRandomLine("bad");
}

// =======================
// リアルタイム更新
// =======================
let lastFeedback = "";
let wasGood = false;

function updateLiveFeedback(feedback) {
  const box = document.getElementById("live-feedback");
  box.innerHTML = feedback;

  const good = feedback.includes("良い姿勢です");

  updateCoachExpression(good);
  updateCoach(feedback);

  if (good && !wasGood) playBeep();
  wasGood = good;

  if (feedback !== lastFeedback) {
    speak(feedback.replace(/<br>/g, " "));
    lastFeedback = feedback;
  }
}

// =======================
// onPoseDetected 内で呼ぶ
// =======================
//
// const feedback = generateLiveFeedback(exercise, keypoints);
// updateLiveFeedback(feedback);
// updateDistanceGuide(estimateDistance(keypoints));
// drawSkeleton(keypoints);
//
