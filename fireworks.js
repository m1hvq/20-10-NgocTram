/* =====================================================================
   TRANG XEM PHÁO HOA
   - Màn chiếu 16:9 khớp khít video. Nút play hồng giữa màn hình, bấm vào video để phát / tạm dừng,
     bấm đúp để phóng to.
   - Thanh điều khiển: tua (kéo thanh), phát / tạm dừng, thời gian, bật tắt tiếng, chỉnh âm lượng, phóng to.
   - Phím tắt khi đang chọn video: Space / K phát-dừng, ← → tua 5 giây, M tắt tiếng, F phóng to.
   - Video có tiếng: khi xem thì nhạc nền tạm dừng, xem xong nhạc tự bật lại (nếu đang bật).
   - 3 ô thả cảm xúc: bấm vào thì icon bay lên rồi biến mất (giống thả cảm xúc khi xem story).
   ===================================================================== */
(() => {
  const $id = (id) => document.getElementById(id);
  const video = $id("fwVideo"),
    player = $id("fwPlayer"),
    screenEl = $id("fwScreen");
  if (!video) return;
  const bigPlay = $id("fwPlay"),
    toggleBtn = $id("fwToggle"),
    seek = $id("fwSeek"),
    timeEl = $id("fwTime");
  const muteBtn = $id("fwMute"),
    vol = $id("fwVol"),
    zoomBtn = $id("fwZoom");
  let resumeMusic = false,
    seeking = false;

  const fmt = (s) => {
    s = Math.max(0, Math.floor(s || 0));
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  };
  const setFill = (el, pct) => el.style.setProperty("--fill", pct + "%");
  function updateTime() {
    const d = video.duration || 0;
    timeEl.textContent = fmt(video.currentTime) + " / " + fmt(d);
    if (!seeking) {
      const v = d ? Math.round((video.currentTime / d) * 1000) : 0;
      seek.value = v;
      setFill(seek, v / 10);
    }
  }

  /* ---------- phát / tạm dừng ---------- */
  function togglePlay() {
    if (video.paused || video.ended) {
      if (video.ended) video.currentTime = 0;
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    } else video.pause();
  }
  bigPlay.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePlay();
  });
  toggleBtn.addEventListener("click", togglePlay);
  video.addEventListener("click", togglePlay);
  video.addEventListener("dblclick", () => toggleZoom());

  video.addEventListener("play", () => {
    player.classList.add("is-playing");
    resumeMusic = typeof bgm !== "undefined" && !bgm.paused;
    if (resumeMusic) pauseMusic(); // tạm dừng nhạc nền khi xem video
  });
  const stopped = () => {
    player.classList.remove("is-playing"); // hiện lại nút play hồng
    if (resumeMusic) {
      resumeMusic = false;
      playMusic();
    } // bật lại nhạc nền
  };
  video.addEventListener("pause", stopped);
  video.addEventListener("ended", stopped);
  ["timeupdate", "loadedmetadata", "durationchange"].forEach((ev) =>
    video.addEventListener(ev, updateTime),
  );

  /* ---------- tua ---------- */
  seek.addEventListener("pointerdown", () => {
    seeking = true;
  });
  ["pointerup", "pointercancel", "blur"].forEach((ev) =>
    seek.addEventListener(ev, () => {
      seeking = false;
      updateTime();
    }),
  );
  seek.addEventListener("input", () => {
    setFill(seek, seek.value / 10);
    if (video.duration) {
      video.currentTime = (seek.value / 1000) * video.duration;
      timeEl.textContent = fmt(video.currentTime) + " / " + fmt(video.duration);
    }
  });

  /* ---------- âm lượng ---------- */
  function syncVol() {
    const muted = video.muted || video.volume === 0;
    player.classList.toggle("is-muted", muted);
    const v = muted ? 0 : Math.round(video.volume * 100);
    vol.value = v;
    setFill(vol, v);
  }
  vol.addEventListener("input", () => {
    const v = vol.value / 100;
    video.volume = v;
    video.muted = v === 0;
    setFill(vol, vol.value);
    player.classList.toggle("is-muted", v === 0);
  });
  muteBtn.addEventListener("click", () => {
    if (video.muted || video.volume === 0) {
      video.muted = false;
      if (video.volume === 0) video.volume = 0.6;
    } else video.muted = true;
    syncVol();
  });
  video.addEventListener("volumechange", syncVol);
  syncVol();

  /* ---------- phóng to ---------- */
  const fsEl = () =>
    document.fullscreenElement || document.webkitFullscreenElement;
  function setZoom(on) {
    player.classList.toggle("is-zoom", on);
    zoomBtn.setAttribute(
      "aria-label",
      on ? "Thu nhỏ màn hình" : "Phóng to màn hình",
    );
    document.body.classList.toggle("lock", on);
  }
  function toggleZoom(force) {
    const on =
      force !== undefined ? force : !player.classList.contains("is-zoom");
    if (on) {
      setZoom(true); // luôn phủ kín trang (chạy được trên mọi trình duyệt)
      const req = player.requestFullscreen || player.webkitRequestFullscreen;
      if (req) {
        try {
          const p = req.call(player);
          if (p && p.catch) p.catch(() => {});
        } catch (_) {}
      }
    } else {
      setZoom(false);
      if (fsEl()) {
        const ex = document.exitFullscreen || document.webkitExitFullscreen;
        if (ex) {
          try {
            ex.call(document);
          } catch (_) {}
        }
      }
    }
  }
  zoomBtn.addEventListener("click", () => toggleZoom());
  ["fullscreenchange", "webkitfullscreenchange"].forEach((ev) =>
    document.addEventListener(ev, () => {
      if (!fsEl() && player.classList.contains("is-zoom")) setZoom(false);
    }),
  );
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && player.classList.contains("is-zoom"))
      toggleZoom(false);
  });

  /* ---------- phím tắt ---------- */
  player.addEventListener("keydown", (e) => {
    if (
      e.target.tagName === "INPUT" &&
      (e.key === "ArrowLeft" || e.key === "ArrowRight")
    )
      return; // để thanh trượt tự xử lý
    const k = e.key.toLowerCase();
    if (k === " " || k === "k") {
      if (e.target.tagName !== "BUTTON") {
        e.preventDefault();
        togglePlay();
      }
    } else if (k === "arrowleft") {
      video.currentTime = Math.max(0, video.currentTime - 5);
    } else if (k === "arrowright") {
      video.currentTime = Math.min(
        video.duration || 1e9,
        video.currentTime + 5,
      );
    } else if (k === "m") muteBtn.click();
    else if (k === "f") toggleZoom();
  });

  /* rời trang thì dừng video và thu nhỏ */
  window.addEventListener("pagechange", (e) => {
    if (e.detail !== "fireworks") {
      if (!video.paused) video.pause();
      if (player.classList.contains("is-zoom")) toggleZoom(false);
    }
  });

  /* ---------- 3 ô thả cảm xúc: icon bay lên rồi biến mất ---------- */
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let flying = 0;
  function fly(cell, scale, delay) {
    if (flying > 36) return;
    const r = cell.getBoundingClientRect();
    const icon = cell.querySelector(".fw-ic");
    const hasImg =
      icon &&
      icon.style.display !== "none" &&
      icon.complete &&
      icon.naturalWidth > 0;
    const size = Math.max(30, Math.min(r.height * 0.55, 64)) * scale;
    let el;
    if (hasImg) {
      el = new Image();
      el.src = icon.currentSrc || icon.src;
      el.draggable = false;
      el.style.width = size + "px";
      el.style.height = "auto";
    } else {
      el = document.createElement("span");
      el.textContent = cell.dataset.emoji || "💖";
      el.style.fontSize = size * 0.85 + "px";
    }
    el.className = "fw-fly";
    el.style.marginLeft = -size / 2 + "px";
    el.style.marginTop = -size / 2 + "px";
    el.style.left =
      r.left + r.width / 2 + (Math.random() - 0.5) * r.width * 0.4 + "px";
    el.style.top = r.top + r.height * 0.35 + "px";
    document.body.appendChild(el);
    flying++;
    const rise = innerHeight * (0.38 + Math.random() * 0.3);
    const dx = (Math.random() - 0.5) * 120;
    const sway = (Math.random() < 0.5 ? -1 : 1) * (14 + Math.random() * 22);
    const rot = (Math.random() - 0.5) * 36;
    const dur = 1700 + Math.random() * 700;
    const anim = el.animate(
      [
        { transform: "translate(0,0) scale(.4) rotate(0deg)", opacity: 0 },
        {
          transform: `translate(${sway * 0.4}px,${-rise * 0.12}px) scale(1.05) rotate(${rot * 0.3}deg)`,
          opacity: 1,
          offset: 0.12,
        },
        {
          transform: `translate(${dx * 0.35 - sway}px,${-rise * 0.45}px) scale(1.2) rotate(${rot * 0.6}deg)`,
          opacity: 1,
          offset: 0.45,
        },
        {
          transform: `translate(${dx * 0.75 + sway}px,${-rise * 0.78}px) scale(1.35) rotate(${rot}deg)`,
          opacity: 0.85,
          offset: 0.75,
        },
        {
          transform: `translate(${dx}px,${-rise}px) scale(1.5) rotate(${rot * 1.2}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: reduced ? 400 : dur,
        delay: delay || 0,
        easing: "cubic-bezier(.25,.6,.35,1)",
        fill: "both",
      },
    );
    anim.onfinish = () => {
      el.remove();
      flying--;
    };
  }
  /* ---------- viết hành động riêng cho từng ô ở đây (không bắt buộc) ---------- */
  const FW_ACTIONS = {
    1: (btn) => {
      /* TODO: thêm việc cần làm khi bấm ô 1 */
    },
    2: (btn) => {
      /* TODO: thêm việc cần làm khi bấm ô 2 */
    },
    3: (btn) => {
      /* TODO: thêm việc cần làm khi bấm ô 3 */
    },
  };
  document.querySelectorAll(".fw-cell").forEach((b) => {
    b.addEventListener("click", () => {
      fly(b, 1, 0); // icon chính
      if (!reduced) {
        fly(b, 0.7, 90);
        fly(b, 0.55, 190);
      } // vài icon nhỏ bay theo cho sinh động
      const f = FW_ACTIONS[b.dataset.fw];
      if (f) f(b);
    });
  });
})();
