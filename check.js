let stream;
let mediaRecorder;
let recordedChunks = [];

// ★ インカメラ起動（ミラー表示）
async function startCamera() {
  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
    audio: true
  });

  const cam = document.getElementById("camera");
  cam.srcObject = stream;
  cam.style.transform = "scaleX(-1)";
}

startCamera();

// ★ 撮影開始
document.getElementById("start-record").onclick = () => {
  recordedChunks = [];

  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "video/mp4" });
    const url = URL.createObjectURL(blob);

    const preview = document.getElementById("preview");
    preview.src = url;
    preview.play(); // ★ 自動再生
  };

  mediaRecorder.start();

  // UI 切り替え
  document.getElementById("camera-area").style.display = "none";
  document.getElementById("recording-area").style.display = "block";
};

// ★ 停止 → プレビュー表示
document.getElementById("stop-record").onclick = () => {
  mediaRecorder.stop();

  document.getElementById("recording-area").style.display = "none";
  document.getElementById("preview-area").style.display = "block";
};

// ★ もう一度撮影する → カメラ再起動
document.getElementById("retry").onclick = () => {
  document.getElementById("preview-area").style.display = "none";
  document.getElementById("camera-area").style.display = "block";

  startCamera(); // ★ インカメラ再起動
};

// ★ 解析を始める → 既存の解析ページへ遷移
document.getElementById("analyze").onclick = () => {
  window.location.href = "result.html"; // ← あなたの解析ページに合わせて変更
};
