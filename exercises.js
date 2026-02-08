/* ---------------------------------------------------------
  セルフエクササイズ一覧（カテゴリ付き）
--------------------------------------------------------- */
export const exerciseList = [
  { id:1,  category:"ストレッチ", name:"ハムストリングス（大腿部後面）のストレッチ", url:"https://youtu.be/ihchQBuigY0", note:"太ももの後面の柔軟性を高めます。" },
  { id:2,  category:"ストレッチ", name:"大腿四頭筋（大腿部前面）のストレッチ", url:"https://youtu.be/lVpF9TiepLg", note:"太ももの前側を伸ばします。" },
  { id:3,  category:"ストレッチ", name:"腸腰筋（股関節前面）のストレッチ", url:"https://youtu.be/XIA80pBZ3ws", note:"股関節前面の柔軟性改善に。" },
  { id:4,  category:"ストレッチ", name:"内転筋（大腿部内側）のストレッチ", url:"https://youtu.be/racb4M_hycM", note:"内ももの柔軟性を高めます。" },
  { id:5,  category:"ストレッチ", name:"下腿三頭筋（ふくらはぎ）のストレッチ", url:"https://youtu.be/Wbi5St1J9Kk", note:"ふくらはぎの柔軟性改善に。" },

  { id:6,  category:"可動域・運動", name:"足首の上下（ポンプ）運動", url:"https://youtu.be/-inqX6tmDm8", note:"むくみ予防にも効果的です。" },

  { id:7,  category:"筋力トレーニング（おしり）", name:"大殿筋（収縮のみ）", url:"https://youtu.be/4ckJ67_8IB8", note:"お尻の筋肉を意識して力を入れます。" },
  { id:8,  category:"筋力トレーニング（おしり）", name:"大殿筋（ブリッジ）", url:"https://youtu.be/9zKZ-YRmU8I", note:"お尻を持ち上げて体幹も鍛えます。" },
  { id:9,  category:"筋力トレーニング（おしり）", name:"大殿筋（立位）", url:"https://youtu.be/aikGoCaTFFI", note:"立位で行うお尻のトレーニングです。" },

  { id:10, category:"筋力トレーニング（太もも）", name:"大腿四頭筋（セッティング）", url:"https://youtu.be/rweyU-3O3zo", note:"太ももの前側を目覚めさせる運動です。" },
  { id:11, category:"筋力トレーニング（太もも）", name:"大腿四頭筋（SLR）", url:"https://youtu.be/fNM6w_RnVRk", note:"足を持ち上げる基本的な筋トレです。" },

  { id:12, category:"筋力トレーニング（股関節外側）", name:"中殿筋（背臥位）", url:"https://youtu.be/UBN5jCP-ErM", note:"股関節外側の安定性を高めます。" },
  { id:13, category:"筋力トレーニング（股関節外側）", name:"中殿筋（立位）", url:"https://youtu.be/0gKoLDR8HcI", note:"立位で行う中殿筋トレーニングです。" },

  { id:14, category:"バランス練習", name:"バランス運動（タンデム）", url:"https://youtu.be/F0OVS9LT1w4", note:"前後に足を並べてバランスを取ります。" },
  { id:15, category:"バランス練習", name:"バランス運動（片脚立位）", url:"https://youtu.be/HUjoGJtiknc", note:"片脚で立つバランス練習です。" },

  { id:16, category:"有酸素運動", name:"ウォーキング", url:"https://youtu.be/Cs4NOzgkS8s", note:"歩行による全身運動です。" },
  { id:17, category:"有酸素運動", name:"自転車エルゴメータ", url:"https://youtu.be/12_J_pr-MUE", note:"膝に優しい有酸素運動です。" },
  { id:18, category:"有酸素運動", name:"水中運動", url:"https://youtu.be/xqj3dn9mw50", note:"水中での負荷軽減運動です。" }
];

/* YouTube サムネイル */
function getThumbnail(url) {
  const id = url.split("youtu.be/")[1];
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

/* 一覧ページ：カテゴリごとに表示 */
const list = document.getElementById("exercise-list");

if (list) {
  const byCategory = {};

  exerciseList.forEach(ex => {
    if (!byCategory[ex.category]) byCategory[ex.category] = [];
    byCategory[ex.category].push(ex);
  });

  Object.keys(byCategory).forEach(category => {
    const h2 = document.createElement("h2");
    h2.textContent = category;
    h2.style.textAlign = "left";
    list.appendChild(h2);

    byCategory[category].forEach(ex => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <img src="${getThumbnail(ex.url)}" class="thumb" />
        <h3>${ex.name}</h3>
        <a href="check.html?id=${ex.id}">フォームを確認</a>
      `;
      list.appendChild(div);
    });
  });
}
