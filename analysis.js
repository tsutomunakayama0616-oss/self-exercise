const video = document.getElementById("camera");
const capture = document.getElementById("capture");

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream);

capture.addEventListener("click", () => {
  window.location.href = "result.html";
});
