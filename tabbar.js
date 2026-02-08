document.addEventListener("DOMContentLoaded", () => {
  const tabbar = `
    <nav class="tabbar">
      <a href="index.html">
        <img src="home.png" class="tab-icon">
        <span>ホーム</span>
      </a>

      <a href="exercises.html">
        <img src="exercise.png" class="tab-icon">
        <span>エクササイズ</span>
      </a>

      <a href="check.html">
        <img src="form.png" class="tab-icon">
        <span>フォーム</span>
      </a>

      <a href="progress.html">
        <img src="progress.png" class="tab-icon">
        <span>進捗</span>
      </a>

      <a href="guide.html">
        <img src="guide.png" class="tab-icon">
        <span>ガイド</span>
      </a>
    </nav>
  `;

  document.body.insertAdjacentHTML("beforeend", tabbar);
});

