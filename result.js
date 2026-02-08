/* ---------------------------------------------------------
   解析結果の読み込み
--------------------------------------------------------- */
const data = JSON.parse(localStorage.getItem("analysis_result"));

if (!data) {
  document.querySelector(".card").innerHTML =
    "<p>解析データが見つかりませんでした。</p>";
} else {
  /* ---------------------------------------------------------
     数値を反映
  --------------------------------------------------------- */
  document.getElementById("abduction").textContent = data.hipAbduction;
  document.getElementById("knee").textContent = data.knee;
  document.getElementById("pelvis").textContent = data.pelvis;
  document.getElementById("trunk").textContent = data.trunk;

  /* ---------------------------------------------------------
     評価コメント
  --------------------------------------------------------- */
  const good = [];
  const bad = [];

  // 股関節外転角度
  if (data.hipAbduction >= 25 && data.hipAbduction <= 40)
    good.push("股関節の開きは良好です。");
  else
    bad.push("股関節の開きがやや不足しています。");

  // 膝角度
  if (data.knee >= 50 && data.knee <= 70)
    good.push("膝の曲がり具合は適切です。");
  else
    bad.push("膝の角度をもう少し調整しましょう。");

  // 骨盤傾斜
  if (Math.abs(data.pelvis) <= 10)
    good.push("骨盤の傾きは安定しています。");
  else
    bad.push("骨盤の左右差に注意しましょう。");

  // 体幹傾き
  if (data.trunk <= 10)
    good.push("体幹の傾きは良好です。");
  else
    bad.push("体幹の前後の傾きに注意しましょう。");

  /* ---------------------------------------------------------
     HTML に反映
  --------------------------------------------------------- */
  document.getElementById("good").innerHTML =
    good.map(t => `<li>${t}</li>`).join("");

  document.getElementById("bad").innerHTML =
    bad.map(t => `<li>${t}</li>`).join("");
}
