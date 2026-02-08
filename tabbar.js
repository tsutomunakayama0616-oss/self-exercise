document.addEventListener("DOMContentLoaded", () => {
  const tabbar = `
    <nav class="tabbar">
      <a href="index.html">
        <img src="home.png" class="🏠">
        <span>ホーム</span>
      </a>

      <a href="exercises.html">
        <img src="exercise.png" class="🏋️">
        <span>エクササイズ</span>
      </a>

      <a href="check.html">
        <img src="form.png" class="🏃‍♂️‍➡️">
        <span>フォーム</span>
      </a>

      <a href="progress.html">
        <img src="progress.png" class="📆">
        <span>進捗</span>
      </a>

      <a href="guide.html">
        <img src="guide.png" class="📖">
        <span>ガイド</span>
      </a>
    </nav>
  `;

  document.body.insertAdjacentHTML("beforeend", tabbar);
});
