/* =====================================================================
   TRANG KẾT THÚC: "Cảm ơn Trâm đã coi"
   - Nền giống hệt trang loading (caro + 2 dải viền), tính tỉ lệ để họa tiết khớp liền mạch ở mọi kích thước.
   - Mèo lắc lư vui vẻ, chữ nhún theo từng chữ cái, trái tim pixel bay lên.
   - Chạm vào mèo: mèo nhún nhảy + thả tim bay ra.
   ===================================================================== */
(() => {
  const page = document.getElementById("page-end");
  if (!page) return;
  const kitty = document.getElementById("endKitty");
  const text = document.getElementById("endText");

  /* ---------- nền caro: giống fitBackground() của loader.js ---------- */
  const HT = 124,
    HB = 173.6,
    PER = 54.8;
  function fitBackground() {
    const vw = page.clientWidth || innerWidth,
      vh = page.clientHeight || innerHeight;
    const lp0 = Math.max(0.42, Math.min(vw, vh) / 736);
    const n = Math.max(1, Math.round((vh / lp0 - HT - HB) / PER));
    page.style.setProperty(
      "--lp",
      (vh / (HT + HB + n * PER)).toFixed(5) + "px",
    );
  }
  fitBackground();
  let rz = 0;
  addEventListener("resize", () => {
    cancelAnimationFrame(rz);
    rz = requestAnimationFrame(fitBackground);
  });
  addEventListener("orientationchange", () => setTimeout(fitBackground, 200));
  window.addEventListener("pagechange", (e) => {
    if (e.detail === "end") fitBackground();
  });

  /* ---------- chữ: tách từng chữ cái để nhún theo sóng (không làm hỏng việc xuống dòng) ---------- */
  const msg = text.textContent.trim();
  text.setAttribute("aria-label", msg);
  text.textContent = "";
  let i = 0;
  msg.split(" ").forEach((word, wi, arr) => {
    const w = document.createElement("span");
    w.className = "w";
    w.setAttribute("aria-hidden", "true");
    [...word].forEach((ch) => {
      const l = document.createElement("span");
      l.className = "l";
      l.style.setProperty("--i", i++);
      l.textContent = ch;
      w.appendChild(l);
    });
    text.appendChild(w);
    if (wi < arr.length - 1) text.appendChild(document.createTextNode(" "));
    i++;
  });

  /* ---------- chạm vào mèo ---------- */
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  kitty.addEventListener("click", () => {
    kitty.classList.remove("hop");
    void kitty.offsetWidth;
    kitty.classList.add("hop");
    if (typeof burst === "function") {
      const r = kitty.getBoundingClientRect();
      burst(
        r.left + r.width / 2,
        r.top + r.height * 0.35,
        [""],
        reduced ? 3 : 9,
      );
    }
  });
  kitty.addEventListener("animationend", (e) => {
    if (e.animationName === "endHop") kitty.classList.remove("hop");
  });
})();
