/* =====================================================================
   CHUYỂN TRANG
   Thứ tự trang: Tiêu đề chính → Trâm thích gì nà → Bói Tarot → Quà → Bức thư → Xem pháo hoa → Kết thúc
   Địa chỉ từng trang: #home  #likes  #tarot  #gifts  #letter  #fireworks  #end
   (Nền của từng trang là ảnh trong img/bg/, được ghép bằng CSS ở cuối style.css)
   ===================================================================== */
(() => {
  const PAGES = [
    "home",
    "likes",
    "tarot",
    "gifts",
    "letter",
    "fireworks",
    "end",
  ];
  const TITLES = {
    home: "20/10 NgocTram",
    likes: "Menu",
    tarot: "Bói Tarot",
    gifts: "Những hộp MeowMeow",
    letter: "Thư gửi Ngọc Trâm ",
    fireworks: "Xem pháo hoa ",
    end: "End",
  };
  const pageEl = (n) => document.getElementById("page-" + n);
  const navBack = document.getElementById("navBack");
  const navNext = document.getElementById("navNext");
  const dotsEl = document.getElementById("navDots");
  let cur = -1;

  PAGES.forEach(() => {
    const d = document.createElement("span");
    d.className = "dot";
    dotsEl.appendChild(d);
  });

  function updateNav() {
    navBack.classList.toggle("off", cur <= 0);
    navNext.classList.toggle("off", cur >= PAGES.length - 1);
    navBack.tabIndex = cur <= 0 ? -1 : 0;
    navNext.tabIndex = cur >= PAGES.length - 1 ? -1 : 0;
    dotsEl
      .querySelectorAll(".dot")
      .forEach((d, i) => d.classList.toggle("on", i === cur));
  }
  function show(name) {
    let idx = PAGES.indexOf(name);
    if (idx < 0) {
      idx = 0;
      name = "home";
    }
    if (idx === cur) return;
    const dir = cur < 0 ? 0 : idx > cur ? 1 : -1; // trượt vào từ phải (tiến) hoặc từ trái (lùi)
    PAGES.forEach((n, i) => pageEl(n).classList.toggle("active", i === idx));
    const body = pageEl(name).querySelector(".page-body");
    body.style.setProperty("--from", dir * 48 + "px");
    body.scrollTop = 0;
    cur = idx;
    navNext.classList.remove("pulse");
    updateNav();
    document.title = TITLES[name];
    if (name === "tarot" && window.tarotLayout) window.tarotLayout();
    window.dispatchEvent(new CustomEvent("pagechange", { detail: name }));
  }
  const go = (i) => {
    if (i >= 0 && i < PAGES.length) location.hash = PAGES[i];
  };
  navBack.onclick = () => go(cur - 1);
  navNext.onclick = () => go(cur + 1);
  addEventListener("hashchange", () => show(location.hash.replace("#", "")));
  show(location.hash.replace("#", "") || "home");
})();
