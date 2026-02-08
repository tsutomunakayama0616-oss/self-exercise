document.addEventListener("DOMContentLoaded", () => {
  const tabbar = `
    <nav class="tabbar">
      <a href="index.html">
        <span class="tab-emoji">🏠</span>
        <span>ホーム</span>
      </a>

      <a href="exercises.html">
        <span class="tab-emoji">🏋️</span>
        <span>エクササイズ</span>
      </a>

      <a href="check.html">
        <span class="tab-emoji">🏃‍♂️</span>
        <span>フォーム</span>
      </a>

      <a href="progress.html">
        <span class="tab-emoji">📆</span>
        <span>進捗</span>
      </a>

      <a href="guide.html">
        <span class="tab-emoji">📖</span>
        <span>ガイド</span>
      </a>
    </nav>
  `;

  document.body.insertAdjacentHTML("beforeend", tabbar);
});
