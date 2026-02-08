/* ---------------------------------------------------------
  セルフエクササイズ一覧（カテゴリ付き）
--------------------------------------------------------- */
const exerciseList = [
  { id:1,  category:"ストレッチ", name:"ハムストリングス（大腿部後面）のストレッチ", url:"https://youtu.be/ihchQBuigY0" },
  { id:2,  category:"ストレッチ", name:"大腿四頭筋（大腿部前面）のストレッチ", url:"https://youtu.be/lVpF9TiepLg" },
  { id:3,  category:"ストレッチ", name:"腸腰筋（股関節前面）のストレッチ", url:"https://youtu.be/XIA80pBZ3ws" },
  { id:4,  category:"ストレッチ", name:"内転筋（大腿部内側）のストレッチ", url:"https://youtu.be/racb4M_hycM" },
  { id:5,  category:"ストレッチ", name:"下腿三頭筋（ふくらはぎ）のストレッチ", url:"https://youtu.be/Wbi5St1J9Kk" },

  { id:6,  category:"可動域・運動", name:"足首の上下（ポンプ）運動", url:"https://youtu.be/-inqX6tmDm8" },

  { id:7,  category:"筋力トレーニング（おしり）", name:"大殿筋（お尻）の筋力増強運動（収縮のみ）", url:"https://youtu.be/4ckJ67_8IB8" },
  { id:8,  category:"筋力トレーニング（おしり）", name:"大殿筋（お尻）の筋力増強運動（ブリッジ）", url:"https://youtu.be/9zKZ-YRmU8I" },
  { id:9,  category:"筋力トレーニング（おしり）", name:"大殿筋（お尻）の筋力増強運動（立位）", url:"https://youtu.be/aikGoCaTFFI" },

  { id:10, category:"筋力トレーニング（太もも）", name:"大腿四頭筋（大腿部前面）の筋力増強運動（セッティング）", url:"https://youtu.be/rweyU-3O3zo" },
  { id:11, category:"筋力トレーニング（太もも）", name:"大腿四頭筋（大腿部前面）の筋力増強運動（SLR）", url:"https://youtu.be/fNM6w_RnVRk" },

  { id:12, category:"筋力トレーニング（股関節外側）", name:"中殿筋（殿部外側）の筋力増強運動（背臥位）", url:"https://youtu.be/UBN5jCP-ErM" },
  { id:13, category:"筋力トレーニング（股関節外側）", name:"中殿筋（殿部外側）の筋力増強運動（立位）", url:"https://youtu.be/0gKoLDR8HcI" },

  { id:14, category:"バランス練習", name:"バランス運動（タンデム）", url:"https://youtu.be/F0OVS9LT1w4" },
  { id:15, category:"バランス練習", name:"バランス運動（片脚立位）", url:"https://youtu.be/HUjoGJtiknc" },

  { id:16, category:"有酸素運動", name:"ウォーキング", url:"https://youtu.be/Cs4NOzgkS8s" },
  { id:17, category:"有酸素運動", name:"自転車エルゴメータ", url:"https://youtu.be/12_J_pr-MUE" },
  { id:18, category:"有酸素運動", name:"水中運動", url:"https://youtu.be/xqj3dn9mw50" }
];

/* ---------------------------------------------------------
  YouTube サムネイル生成
--------------------------------------------------------- */
function getThumbnail(url) {
  const id = url.split("youtu.be/")[1];
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

/* ---------------------------------------------------------
  一覧ページ表示
--------------------------------------------------------- */
const list = document.getElementById("exercise-list");

if (list) {
  exerciseList.forEach(ex => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${getThumbnail(ex.url)}" class="thumb" />
      <h2>${ex.name}</h2>
      <p class="category">${ex.category}</p>
      <a href="exercise-detail.html?id=${ex.id}">動画を見る</a>
    `;

    list.appendChild(div);
  });
}

/* ---------------------------------------------------------
  詳細ページ：動画再生
--------------------------------------------------------- */
const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));
const detail = exerciseList.find(e => e.id === id);

if (detail) {
  document.getElementById("exercise-title").textContent = detail.name;
  document.getElementById("exercise-description").textContent = detail.category;

  const video = document.getElementById("exercise-video");
  video.src = detail.url;
}
