/* =====================================================================
   HIỆU ỨNG TOÀN TRANG
   1) Hoa rơi: chỉ dùng icon bông hoa (img/icon-flower.webp), rơi nhẹ, lắc lư và xoay chậm.
   2) Bướm bay: thỉnh thoảng 1–2 con bay lượn qua màn hình (img/icon-butterfly.webp), vỗ cánh khi bay.
   3) Dấu chân mèo: bấm vào bất kỳ nút nào (trừ icon ở tiêu đề chính và trang xem pháo hoa)
      thì hiện icon chân mèo ngay chỗ bấm (img/icon-pawclick.webp).
   Chỉnh số lượng / thời gian ở mục CONFIG bên dưới.
   ===================================================================== */
(() => {
  const CONFIG = {
    flower: "img/ion-flower.webp",
    butterfly: "img/ion-butterfly.webp",
    paw: "img/icon-pawclick.webp",
    flowerEvery: [2200, 4000], // khoảng cách giữa 2 lần hoa rơi (ms) – điện thoại tự giãn ra thêm
    flowerMax: [4, 6], // số hoa tối đa cùng lúc [điện thoại, máy lớn]
    butterflyFirst: [7000, 12000], // con bướm đầu tiên xuất hiện sau (ms)
    butterflyEvery: [16000, 28000], // khoảng cách giữa các lần bướm bay (ms)
    butterflyTwoChance: 0.35, // xác suất bay 2 con cùng lúc (còn lại là 1 con)
  };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const W = () => document.documentElement.clientWidth || innerWidth;
  const H = () => innerHeight;
  const small = () => W() < 600;
  // máy yếu (ít nhân CPU / ít RAM): bớt số hoa rơi cho đỡ giật
  const lowEnd =
    (navigator.hardwareConcurrency || 8) <= 4 ||
    (navigator.deviceMemory || 8) <= 4;
  // đang xem video pháo hoa thì tạm không thả thêm hoa / bướm để video chạy mượt
  const videoBusy = () => {
    const v = document.getElementById("fwVideo");
    return !!v && !v.paused && !v.ended;
  };
  [CONFIG.flower, CONFIG.butterfly, CONFIG.paw].forEach((s) => {
    const i = new Image();
    i.src = s;
  }); // tải sẵn

  /* ---------------- lớp chứa hoa và bướm ---------------- */
  const layer = document.createElement("div");
  layer.className = "fx-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);
  function makeImg(src) {
    const im = new Image();
    im.src = src;
    im.alt = "";
    im.draggable = false;
    return im;
  }

  /* ---------------- 1) HOA RƠI ---------------- */
  let flowers = 0;
  function dropFlower(seed) {
    const w = W(),
      h = H();
    const s = rand(18, 34) * (small() ? 0.85 : 1);
    const el = document.createElement("div");
    el.className = "fxf";
    el.style.width = s + "px";
    el.appendChild(makeImg(CONFIG.flower));
    layer.appendChild(el);
    flowers++;
    const dur = clamp(
      17000 - ((s - 18) / 16) * 5000 + rand(-1500, 1500),
      10500,
      18500,
    ); // hoa to (gần) rơi nhanh hơn hoa nhỏ (xa)
    const x0 = rand(-0.03, 1.03) * w;
    const amp = rand(16, 44),
      cyc = rand(1.4, 2.6),
      ph = rand(0, Math.PI * 2);
    const spin = rand(150, 320) * (Math.random() < 0.5 ? -1 : 1);
    const op = rand(0.6, 0.95);
    const N = 12,
      frames = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const x = x0 + amp * Math.sin(ph + t * cyc * Math.PI * 2);
      const y = -s * 1.5 + t * (h + s * 3);
      const r = spin * t + 14 * Math.sin(ph + t * cyc * Math.PI * 2 + 1.2);
      const o =
        t < 0.06 ? (op * t) / 0.06 : t > 0.94 ? (op * (1 - t)) / 0.06 : op;
      frames.push({
        transform: `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${r.toFixed(1)}deg)`,
        opacity: +o.toFixed(3),
      });
    }
    const a = el.animate(frames, {
      duration: dur,
      easing: "linear",
      delay: seed ? -rand(0, dur * 0.85) : 0,
      fill: "both",
    });
    a.onfinish = () => {
      el.remove();
      flowers--;
    };
  }
  function flowerLoop() {
    let max = small() ? CONFIG.flowerMax[0] : CONFIG.flowerMax[1];
    if (lowEnd) max = Math.max(3, max - 2);
    if (!document.hidden && !videoBusy() && flowers < max) dropFlower(false);
    const k = small() ? 1.25 : 1;
    setTimeout(
      flowerLoop,
      rand(CONFIG.flowerEvery[0], CONFIG.flowerEvery[1]) * k,
    );
  }

  /* ---------------- 2) BƯỚM BAY ---------------- */
  function spline(pts, u) {
    // đường cong mượt đi qua các điểm mốc (Catmull–Rom)
    const n = pts.length - 1,
      f = clamp(u, 0, 1) * n,
      i = Math.min(n - 1, Math.floor(f)),
      t = f - i;
    const p0 = pts[Math.max(0, i - 1)],
      p1 = pts[i],
      p2 = pts[i + 1],
      p3 = pts[Math.min(n, i + 2)];
    const c = (k) =>
      0.5 *
      (2 * p1[k] +
        (-p0[k] + p2[k]) * t +
        (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t * t +
        (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t * t * t);
    return [c(0), c(1)];
  }
  function flyButterfly(delay) {
    const w = W(),
      h = H();
    const s = rand(42, 58) * (small() ? 0.85 : 1);
    const dir = Math.random() < 0.5 ? 1 : -1; // 1: từ trái sang phải, -1: từ phải sang trái
    const xs = dir > 0 ? -s : w + s,
      xe = dir > 0 ? w + s : -s;
    const n = 7,
      pts = [];
    let y = rand(0.2, 0.68) * h;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const x =
        xs + (xe - xs) * t + (i > 0 && i < n - 1 ? rand(-0.07, 0.07) * w : 0);
      if (i > 0) y = clamp(y + rand(-0.22, 0.22) * h, 0.1 * h, 0.78 * h);
      pts.push([x, y]);
    }
    const wob = rand(9, 20),
      wf = rand(5, 8),
      wp = rand(0, Math.PI * 2); // rung rinh nhẹ khi bay
    const K = 80,
      frames = [];
    const pos = (u) => {
      const [x, y] = spline(pts, u);
      return [x, y + wob * Math.sin(wp + u * wf * Math.PI * 2)];
    };
    for (let k = 0; k <= K; k++) {
      const u = k / K,
        [x, y] = pos(u),
        [x2, y2] = pos(Math.min(1, u + 0.012));
      const dx = x2 - x,
        dy = y2 - y;
      const slope = (Math.atan2(dy, Math.abs(dx) || 1) * 180) / Math.PI; // dốc lên / xuống
      const tilt = clamp(
        Math.sign(dx || dir) * (8 + 0.45 * Math.abs(slope)) + slope * 0.1,
        -26,
        26,
      ); // nghiêng theo hướng bay
      const sc = 1 + 0.12 * Math.sin(u * Math.PI * 4);
      const o = u < 0.06 ? u / 0.06 : u > 0.94 ? (1 - u) / 0.06 : 1;
      frames.push({
        transform: `translate(${(x - s / 2).toFixed(1)}px,${(y - s / 2).toFixed(1)}px) rotate(${tilt.toFixed(1)}deg) scale(${sc.toFixed(3)})`,
        opacity: +o.toFixed(3),
      });
    }
    const el = document.createElement("div");
    el.className = "fxb";
    el.style.width = s + "px";
    el.style.setProperty("--flap", rand(0.2, 0.32).toFixed(2) + "s");
    el.appendChild(makeImg(CONFIG.butterfly));
    el.style.opacity = 0;
    layer.appendChild(el);
    const a = el.animate(frames, {
      duration: rand(11000, 15000),
      easing: "linear",
      delay: delay || 0,
      fill: "both",
    });
    a.onfinish = () => el.remove();
  }
  function butterflyLoop(first) {
    setTimeout(
      () => {
        if (!document.hidden && !videoBusy()) {
          flyButterfly(0);
          if (Math.random() < CONFIG.butterflyTwoChance)
            flyButterfly(rand(900, 2400)); // đôi khi có con thứ hai bay theo sau
        }
        butterflyLoop(false);
      },
      first
        ? rand(CONFIG.butterflyFirst[0], CONFIG.butterflyFirst[1])
        : rand(CONFIG.butterflyEvery[0], CONFIG.butterflyEvery[1]),
    );
  }

  /* ---------------- khởi động sau khi trang loading xong ---------------- */
  let started = false;
  function start() {
    if (started || reduced) return;
    started = true;
    const seeds = Math.round(
      (small() ? CONFIG.flowerMax[0] : CONFIG.flowerMax[1]) * 0.55,
    );
    for (let i = 0; i < seeds; i++) dropFlower(true); // có sẵn vài bông đang rơi dở để màn hình không trống lúc đầu
    flowerLoop();
    butterflyLoop(true);
  }
  if (window.siteReady || !document.getElementById("loader")) start();
  else addEventListener("siteready", start, { once: true });
  addEventListener("pagehide", () => {
    layer.textContent = "";
    flowers = 0;
  });

  /* ---------------- 3) DẤU CHÂN MÈO KHI BẤM NÚT ---------------- */
  const BTN = 'button, a[href], [role="button"], #deck, .gift, .like';
  const SKIP = ".fw-cell, #page-fireworks"; // giữ riêng hiệu ứng của icon tiêu đề chính và trang xem pháo hoa
  let paws = 0;
  function pawAt(x, y, size) {
    if (paws > 10) return;
    const el = makeImg(CONFIG.paw);
    el.className = "fx-paw";
    el.style.width = size + "px";
    el.style.marginLeft = -size / 2 + "px";
    el.style.marginTop = -size * 0.59 + "px";
    el.style.left = x + "px";
    el.style.top = y + "px";
    document.body.appendChild(el);
    paws++;
    const rot = rand(-16, 16);
    const T = (sc, dy) => `translateY(${dy}px) scale(${sc}) rotate(${rot}deg)`;
    const a = el.animate(
      reduced
        ? [{ opacity: 1 }, { opacity: 0 }]
        : [
            { transform: T(0.3, 0), opacity: 0 },
            { transform: T(1.15, 0), opacity: 1, offset: 0.22 },
            { transform: T(1, -2), opacity: 1, offset: 0.58 },
            { transform: T(0.92, -22), opacity: 0 },
          ],
      {
        duration: reduced ? 400 : 850,
        easing: "cubic-bezier(.2,.8,.3,1)",
        fill: "both",
      },
    );
    a.onfinish = () => {
      el.remove();
      paws--;
    };
  }
  document.addEventListener(
    "click",
    (e) => {
      const t = e.target.closest && e.target.closest(BTN);
      if (!t || t.closest(SKIP) || t.disabled) return;
      const r = t.getBoundingClientRect();
      let x = e.clientX,
        y = e.clientY;
      const inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      if (!e.detail || !inside || (!x && !y)) {
        x = r.left + r.width / 2;
        y = r.top + r.height / 2;
      } // bấm bằng bàn phím: hiện ở giữa nút
      pawAt(x, y, clamp(Math.min(r.width, r.height) * 0.62, 26, 56));
    },
    true,
  );
})();
