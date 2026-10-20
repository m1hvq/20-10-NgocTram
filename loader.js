/* =====================================================================
   TRANG LOADING: chạy 3 giây → hiện "completed!" → trượt lên để vào trang tiêu đề chính
   ===================================================================== */
(() => {
  const el = document.getElementById("loader");
  if (!el) return;
  const text = document.getElementById("ldText");
  const DURATION = 3000; // thời gian load (ms)
  const HOLD = 700; // dừng lại bao lâu ở chữ "completed!" trước khi chuyển trang (ms)

  // tải sẵn các ảnh chính trong lúc chờ
  [
    "img/bg/home-top.webp",
    "img/bg/home-bot.webp",
    "img/bg/tarot-top.webp",
    "img/bg/tarot-mid.webp",
    "img/bg/tarot-bot.webp",
    "img/bg/gifts-top.webp",
    "img/bg/gifts-mid.webp",
    "img/bg/gifts-bot.webp",
    "img/bg/letter-top.webp",
    "img/bg/letter-mid.webp",
    "img/bg/letter-bot.webp",
    "img/bg/load2-ging.webp",
    "img/bg/load2-top.webp",
    "img/bg/load2-bot.webp",
    "img/kitty.webp",
    "img/tram-kitty.webp",
    "img/tram-meo.webp",
    "img/tram-pma.webp",
    "img/meow.webp",
    "img/gifts.webp",
    "img/icon-paw.webp",
    "img/icon-note.webp",
  ].forEach((s) => {
    const i = new Image();
    i.src = s;
  });

  // nền caro: chọn tỉ lệ sao cho số ô caro ở giữa luôn là số nguyên → họa tiết khớp liền mạch với 2 dải viền trên và dưới ở mọi kích thước
  const HT = 124,
    HB = 173.6,
    PER = 54.8;
  function fitBackground() {
    const vw = el.clientWidth || innerWidth,
      vh = el.clientHeight || innerHeight;
    const lp0 = Math.max(0.42, Math.min(vw, vh) / 736);
    const n = Math.max(1, Math.round((vh / lp0 - HT - HB) / PER));
    el.style.setProperty("--lp", (vh / (HT + HB + n * PER)).toFixed(5) + "px");
  }
  fitBackground();
  let rz = 0;
  const onResize = () => {
    cancelAnimationFrame(rz);
    rz = requestAnimationFrame(fitBackground); // gộp nhiều lần resize thành 1 lần mỗi khung hình
  };
  addEventListener("resize", onResize);

  const t0 = performance.now();
  function frame(now) {
    const t = Math.min(1, (now - t0) / DURATION);
    el.style.setProperty("--p", t.toFixed(4));
    if (t < 1) requestAnimationFrame(frame);
    else complete();
  }
  function complete() {
    text.textContent = "Completed!";
    el.classList.add("complete");
    el.setAttribute("aria-busy", "false");
    setTimeout(() => {
      el.classList.add("done"); // trượt lên, lộ ra trang tiêu đề chính
      window.siteReady = true;
      window.dispatchEvent(new Event("siteready")); // báo cho hiệu ứng hoa rơi / bướm bắt đầu
      const act = document.querySelector(".page.active"); // chạy lại hiệu ứng xuất hiện của trang
      if (act) {
        act.classList.remove("active");
        void act.offsetWidth;
        act.classList.add("active");
      }
      setTimeout(() => {
        el.classList.add("gone");
        removeEventListener("resize", onResize);
      }, 1000);
    }, HOLD);
  }
  requestAnimationFrame(frame);
})();
