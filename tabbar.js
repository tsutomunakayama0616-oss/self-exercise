document.addEventListener("DOMContentLoaded", () => {
  const tabbar = `
    <nav class="tabbar">
      <a href="index.html">
        <img src="🏠">
        <span>ホーム</span>
      </a>

      <a href="exercises.html">
        <img src="🏋️">
        <span>エクササイズ</span>
      </a>

      <a href="check.html">
        <img src="🏃‍♂️‍➡️">
        <span>フォーム</span>
      </a>

      <a href="progress.html">
        <img src="📆">
        <span>進捗</span>
      </a>

      <a href="guide.html">
        <img src="📖">
        <span>ガイド</span>
      </a>
    </nav>
  `;

  document.body.insertAdjacentHTML("beforeend", tabbar);
});
