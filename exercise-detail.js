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
   ④ 骨格描画
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
   ⑤ 推定ループ
--------------------------------------------------------- */
async function poseLoop() {
  if (detector && video.readyState === 4) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const poses = await detector.estimatePoses(video);
    if (poses.length > 0) {
      drawSkeleton(poses[0].keypoints);
    }
  }
  requestAnimationFrame(poseLoop);
}

poseLoop();

/* ---------------------------------------------------------
   ⑥ 解析ボタン → result.html
--------------------------------------------------------- */
document.getElementById("analyze-btn").addEventListener("click", () => {
  window.location.href = "result.html";
});
