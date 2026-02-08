import { exerciseList } from "./exercises.js";

/* -------------------------------
   ① 選択された動画を表示
-------------------------------- */
const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));
const detail = exerciseList.find(e => e.id === id);

const youtubeId = detail.url.split("youtu.be/")[1];
document.getElementById("exercise-youtube").src =
  `https://www.youtube.com/embed/${youtubeId}`;

/* -------------------------------
   ② カメラ起動
-------------------------------- */
const startBtn = document.getElementById("start-camera-btn");
const analyzeBtn = document.getElementById("analyze-btn");
const cameraArea = document.getElementById("camera-area");

const video = document.getElementById("camera");
const canvas = document.getElementById("skeleton");
const ctx = canvas.getContext("2d");

startBtn.addEventListener("click", async () => {
  cameraArea.style.display = "block";
  analyzeBtn.style.display = "block";

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
});

/* -------------------------------
   ③ MoveNet モデル読み込み
-------------------------------- */
let detector;
let lastKeypoints = null;

async function loadModel() {
  await tf.setBackend("webgl");
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    { modelType: "lightning" }
  );
}

loadModel();

/* -------------------------------
   ④ 骨格描画
-------------------------------- */
function drawSkeleton(keypoints) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  keypoints.forEach(p => {
    if (p.score > 0.3) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
    }
  });

  const pairs = [
    [5, 7], [7, 9],
    [6, 8], [8, 10],
    [11, 13], [13, 15],
    [12, 14], [14, 16],
    [5, 6], [11, 12],
    [5, 11], [6, 12]
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

/* -------------------------------
   ⑤ 推定ループ
-------------------------------- */
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

/* -------------------------------
   ⑥ 角度計算（C のロジック）
-------------------------------- */
function angleBetween(p1, p2, p3) {
  const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
  const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
  const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
  const cos = dot / (mag1 * mag2);
  return Math.acos(Math.min(Math.max(cos, -1), 1)) * (180 / Math.PI);
}

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function analyzePose(keypoints) {
  const knee = angleBetween(keypoints[12], keypoints[14], keypoints[16]);
  const hipAbduction = angleBetween(
    midpoint(keypoints[5], keypoints[6]),
    keypoints[12],
    keypoints[14]
  );
  const trunk = Math.abs(
    (Math.atan2(
      midpoint(keypoints[11], keypoints[12]).y -
        midpoint(keypoints[5], keypoints[6]).y,
      midpoint(keypoints[11], keypoints[12]).x -
        midpoint(keypoints[5], keypoints[6]).x
    ) *
      180) /
      Math.PI -
      90
  );
  const pelvis =
    (Math.atan2(
      keypoints[11].y - keypoints[12].y,
      keypoints[11].x - keypoints[12].x
    ) *
      180) /
    Math.PI;

  return {
    knee: knee.toFixed(1),
    hipAbduction: hipAbduction.toFixed(1),
    trunk: trunk.toFixed(1),
    pelvis: pelvis.toFixed(1)
  };
}

/* -------------------------------
   ⑦ 解析ボタン → result.html
-------------------------------- */
analyzeBtn.addEventListener("click", () => {
  if (!lastKeypoints) {
    alert("姿勢が検出できませんでした。");
    return;
  }

  const result = analyzePose(lastKeypoints);
  localStorage.setItem("analysis_result", JSON.stringify(result));

  window.location.href = "result.html";
});
