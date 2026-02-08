/* ---------------------------------------------------------
   ① エクササイズ情報の取得（exercises.js のデータを利用）
--------------------------------------------------------- */
import { exerciseList } from "./exercises.js";

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));
const detail = exerciseList.find(e => e.id === id);

document.getElementById("exercise-title").textContent = detail.name;
document.getElementById("exercise-description").textContent = detail.category;
document.getElementById("exercise-note").textContent = detail.note;

/* YouTube 埋め込みURLに変換 */
const youtubeId = detail.url.split("youtu.be/")[1];
document.getElementById("exercise-youtube").src =
  `https://www.youtube.com/embed/${youtubeId}`;

/* ---------------------------------------------------------
   ② カメラ起動
--------------------------------------------------------- */
const video = document.getElementById("camera");
const canvas = document.getElementById("skeleton");
const ctx = canvas.getContext("2d");

navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
});

/* ---------------------------------------------------------
   ③ MoveNet モデル読み込み
--------------------------------------------------------- */
let detector;

async function loadModel() {
  await tf.setBackend("webgl");
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    { modelType: "lightning" }
  );
}

loadModel();

/* ---------------------------------------------------------
   ④ 角度計算関数
--------------------------------------------------------- */

/* ベクトル角度（基本） */
function angleBetween(p1, p2, p3) {
  const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
  const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };

  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
  const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);

  const cos = dot / (mag1 * mag2);
  return Math.acos(Math.min(Math.max(cos, -1), 1)) * (180 / Math.PI);
}

/* 中点 */
function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/* 膝角度（右） */
function kneeAngle(keypoints) {
  const hip = keypoints[12];
  const knee = keypoints[14];
  const ankle = keypoints[16];
  return angleBetween(hip, knee, ankle);
}

/* 股関節外転角度（右） */
function hipAbductionAngle(keypoints) {
  const shoulderCenter = midpoint(keypoints[5], keypoints[6]);
  const hip = keypoints[12];
  const knee = keypoints[14];
  return angleBetween(shoulderCenter, hip, knee);
}

/* 体幹傾き */
function trunkTilt(keypoints) {
  const shoulder = midpoint(keypoints[5], keypoints[6]);
  const hip = midpoint(keypoints[11], keypoints[12]);

  const dx = hip.x - shoulder.x;
  const dy = hip.y - shoulder.y;

  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  return Math.abs(angle - 90); // 90°が直立
}

/* 骨盤傾斜 */
function pelvisTilt(keypoints) {
  const leftHip = keypoints[11];
  const rightHip = keypoints[12];

  const dy = leftHip.y - rightHip.y;
  const dx = leftHip.x - rightHip.x;

  return Math.atan2(dy, dx) * (180 / Math.PI);
}

/* 解析結果まとめ */
function analyzePose(keypoints) {
  return {
    knee: kneeAngle(keypoints).toFixed(1),
    hipAbduction: hipAbductionAngle(keypoints).toFixed(1),
    trunk: trunkTilt(keypoints).toFixed(1),
    pelvis: pelvisTilt(keypoints).toFixed(1)
  };
}

/* ---------------------------------------------------------
   ⑤ 骨格描画
--------------------------------------------------------- */
function drawSkeleton(keypoints) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 点
  keypoints.forEach(p => {
    if (p.score > 0.3) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
    }
  });

  // 線（主要部位）
  const pairs = [
    [5, 7], [7, 9],   // 左腕
    [6, 8], [8, 10],  // 右腕
    [11, 13], [13, 15], // 左脚
    [12, 14], [14, 16], // 右脚
    [5, 6], [11, 12], // 肩・腰
    [5, 11], [6, 12]  // 体幹
  ];

  ctx.strokeStyle = "lime";
  ctx.lineWidth = 3;

  pairs.forEach(([a, b]) => {
    if (keypoints[a].score > 0.3 && keypoints[b].score > 0.3) {
      ctx.beginPath();
      ctx.moveTo(keypoints[a].x, keypoints[a].y);
      ctx.lineTo(keypoints[b].x, keypoints[b].y);
      ctx.stroke();
    }
  });
}

/* ---------------------------------------------------------
   ⑥ 推定ループ
--------------------------------------------------------- */
let lastKeypoints = null;

async function poseLoop() {
  if (detector && video.readyState === 4) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const poses = await detector.estimatePoses(video);
    if (poses.length > 0) {
      lastKeypoints = poses[0].keypoints;
      drawSkeleton(lastKeypoints);
    }
  }
  requestAnimationFrame(poseLoop);
}

poseLoop();

/* ---------------------------------------------------------
   ⑦ 解析ボタン → result.html
--------------------------------------------------------- */
document.getElementById("analyze-btn").addEventListener("click", () => {
  if (!lastKeypoints) {
    alert("姿勢が検出できませんでした。");
    return;
  }

  const result = analyzePose(lastKeypoints);
  localStorage.setItem("analysis_result", JSON.stringify(result));

  window.location.href = "result.html";
});
