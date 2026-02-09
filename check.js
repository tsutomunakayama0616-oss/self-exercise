/* ----------------------------------------------------
   check.js（最終版）
   - カメラ起動 / 停止
   - MoveNet 推論
   - 骨格描画
   - フォーム解析
   - 進捗保存
---------------------------------------------------- */

/* ------------------------------
   HTML要素の取得
------------------------------ */
const video = document.getElementById("camera");
const canvas = document.getElementById("poseCanvas");
const ctx = canvas.getContext("2d");
const analysisText = document.getElementById("analysisText");

const startBtn = document.getElementById("startCameraBtn");
const stopBtn = document.getElementById("stopCameraBtn");

let stream = null;
let detector = null;
let running = false;

/* ------------------------------
   MoveNet の読み込み
------------------------------ */
async function loadModel() {
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
  );
}

/* ------------------------------
   カメラ起動
------------------------------ */
async function startCamera() {
  if (running) return;

  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" }, // インカメラ
    audio: false
  });

  video.srcObject = stream;

  running = true;
  analysisText.textContent = "解析中…";

  requestAnimationFrame(loop);
}

/* ------------------------------
   カメラ停止
------------------------------ */
function stopCamera() {
  running = false;
  analysisText.textContent = "カメラを停止しました。";

  if (stream) {
    stream.getTracks().forEach(t => t.stop());
  }
}

/* ------------------------------
   骨格描画
------------------------------ */
function drawPose(keypoints) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const scaleX = canvas.width / video.videoWidth;
  const scaleY = canvas.height / video.videoHeight;

  // 点
  keypoints.forEach(kp => {
    if (kp.score > 0.3) {
      ctx.beginPath();
      ctx.arc(kp.x * scaleX, kp.y * scaleY, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#00e676";
      ctx.fill();
    }
  });

  // 線（主要な骨格）
  const edges = [
    [5, 7], [7, 9],   // 左腕
    [6, 8], [8, 10],  // 右腕
    [5, 6],           // 肩
    [11, 12],         // 腰
    [5, 11], [6, 12], // 体幹
    [11, 13], [13, 15], // 左脚
    [12, 14], [14, 16]  // 右脚
  ];

  ctx.strokeStyle = "#00bfa5";
  ctx.lineWidth = 3;

  edges.forEach(([a, b]) => {
    const p1 = keypoints[a];
    const p2 = keypoints[b];
    if (p1.score > 0.3 && p2.score > 0.3) {
      ctx.beginPath();
      ctx.moveTo(p1.x * scaleX, p1.y * scaleY);
      ctx.lineTo(p2.x * scaleX, p2.y * scaleY);
      ctx.stroke();
    }
  });
}

/* ------------------------------
   フォーム解析（簡易版）
------------------------------ */
function analyzePose(keypoints) {
  const leftShoulder = keypoints[5];
  const rightShoulder = keypoints[6];

  if (leftShoulder.score < 0.3 || rightShoulder.score < 0.3) {
    return "姿勢が検出できません。カメラから少し離れてください。";
  }

  const diff = Math.abs(leftShoulder.y - rightShoulder.y);

  if (diff < 20) return "良い姿勢です！左右のバランスが整っています。";
  if (diff < 40) return "少し傾いています。肩の高さを揃えましょう。";

  return "大きく傾いています。姿勢をまっすぐにしましょう。";
}

/* ------------------------------
   進捗保存
------------------------------ */
function saveProgress(score) {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);

  const raw = localStorage.getItem("progress") || "[]";
  const records = JSON.parse(raw);

  records.push({
    date: dateStr,
    exercise: exercise,
    score: score
  });

  localStorage.setItem("progress", JSON.stringify(records));
}

/* ------------------------------
   メインループ
------------------------------ */
async function loop() {
  if (!running) return;

  if (video.readyState >= 2) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const poses = await detector.estimatePoses(video);
    if (poses.length > 0) {
      const keypoints = poses[0].keypoints;

      drawPose(keypoints);

      const result = analyzePose(keypoints);
      analysisText.textContent = result;

      // スコア化（簡易）
      const score = result.includes("良い姿勢") ? 90 :
                    result.includes("少し傾いて") ? 70 : 40;

      saveProgress(score);
    }
  }

  requestAnimationFrame(loop);
}

/* ------------------------------
   イベント登録
------------------------------ */
startBtn.addEventListener("click", startCamera);
stopBtn.addEventListener("click", stopCamera);

/* ------------------------------
   初期化
------------------------------ */
loadModel();
