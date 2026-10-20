const $ = (s) => document.querySelector(s);
const gifts = [
  {
    e: "🌹",
    n: "Hoa hồng",
    img: "img/hoa_hong.webp",
    m: "Một bông hồng cho một bông hoa.",
  },
  {
    e: "🍫",
    n: "KitKat",
    img: "img/kitkat.webp",
    m: "Kitkat này trông có vẻ ngon á.",
  },
  {
    e: "🥛",
    n: "Hộp sữa",
    img: "img/hop_sua.webp",
    m: "Hộp sữa to đùng lun nè!",
  },
  {
    e: "🧸",
    n: "Gấu bông",
    img: "img/gau_bong.webp",
    m: "Con này trông có vẻ đẹp hơn mấy con gấu bông của bà.",
  },
  {
    e: "🐱",
    n: "Mũ len",
    img: "img/mu_meo.webp",
    m: "Đội vào là thành ebemeo xinh nhất mùa se lạnh.",
  },
  {
    e: "🐾",
    n: "Stiker mh",
    img: "img/nmh.webp",
    m: "hi!",
  },
];
const given = new Set();
function burst(x, y, list, n = 14) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.className = "fx";
    s.textContent = list[Math.floor(Math.random() * list.length)];
    s.style.left = x + "px";
    s.style.top = y + "px";
    s.style.setProperty("--dx", Math.random() * 320 - 160 + "px");
    s.style.setProperty("--dy", Math.random() * -260 - 30 + "px");
    s.style.setProperty("--r", Math.random() * 540 - 270 + "deg");
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1600);
  }
}
function center(el) {
  const r = el.getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2];
}
// shop
const shop = $("#shop");
gifts.forEach((g) => {
  new Image().src = g.img;
});
new Image().src = "img/gifts.webp"; // tải sẵn ảnh quà
const giftImg = (g) =>
  '<span class="e pop"><img class="cat" src="' +
  g.img +
  '" alt="" draggable="false"></span>';
function openBox(b, g, i) {
  b.dataset.busy = 1;
  b.classList.add("shake"); // lắc hộp trước khi mở
  setTimeout(() => {
    b.classList.remove("shake");
    b.classList.add("done");
    b.dataset.open = 1;
    delete b.dataset.busy;
    b.innerHTML = giftImg(g) + "<b>" + g.n + "</b>";
    b.setAttribute("aria-label", g.n + ", đã mở, bấm để xem");
    $("#reply").textContent = "Bấm vào món quà đã mở để xem lại nhé";
    given.add(i);
    $("#basket").innerHTML =
      [...given]
        .map(
          (k) =>
            '<img class="bk" src="' +
            gifts[k].img +
            '" alt="' +
            gifts[k].n +
            '">',
        )
        .join("") +
      "<small>Quà của Trâm: " +
      given.size +
      "/6</small>";
    // quà bay ra to giữa màn hình kèm chú thích; mở đủ 6 hộp thì sau khi đóng mới hiện lá thư
    setTimeout(
      () =>
        showViewer(i, b, () => {
          if (given.size === gifts.length) unlock();
        }),
      450,
    );
  }, 650);
}
gifts.forEach((g, i) => {
  const b = document.createElement("button");
  b.className = "gift box" + (i % 3);
  b.setAttribute("aria-label", "Hộp Meow " + (i + 1) + ", giải đố để mở");
  b.innerHTML =
    '<span class="e"><img class="cat" src="img/gifts.webp" alt="" draggable="false"></span><b>Hộp Meow ' +
    (i + 1) +
    "</b>";
  b.onclick = () => {
    if (b.dataset.busy) return;
    if (b.dataset.open) {
      showViewer(i, b);
      return;
    } // hộp đã mở: bấm để xem lại quà to + chú thích
    showQuiz(i, b, () => openBox(b, g, i)); // phải giải đố đúng mới mở được
  };
  shop.appendChild(b);
});
// ===== BỨC THƯ =====
const envelope = $("#envelope"),
  paper = $("#paper"),
  mailHint = $("#mailHint"),
  envSeal = $("#envSeal");
let letterReady = false,
  letterOpen = false;
function unlock() {
  // được gọi khi đã mở đủ 6 hộp quà
  letterReady = true;
  envSeal.innerHTML = '<img src="img/icon-heart.webp" alt="heart">';
  envelope.classList.remove("wiggle");
  envelope.classList.add("ready");
  mailHint.textContent = "Thư được mở rồi, Trâm bấm vào để đọc nha!";
  $("#reply").textContent = "Mở đủ 6 hộp quà rồi nè!";
  const nn = $("#navNext");
  if (nn) nn.classList.add("pulse");
}
envelope.onclick = () => {
  if (letterOpen) return;
  if (!letterReady) {
    // chưa mở đủ 6 hộp quà: thư lung lay + nhắc
    mailHint.textContent =
      "Còn hộp quà chưa mở nè! Mở đủ 6 hộp thì thư mới mở nha! (Đã mở  " +
      given.size +
      "/6)";
    envelope.classList.remove("wiggle");
    void envelope.offsetWidth;
    envelope.classList.add("wiggle");
    return;
  }
  letterOpen = true;
  readingMusic(); // chỉ khi bức thư thật sự được mở thì nhạc mới nhỏ lại cho dễ đọc
  envelope.classList.remove("ready");
  envelope.classList.add("open");
  envelope.setAttribute("aria-expanded", "true");
  mailHint.textContent = "";
  setTimeout(() => {
    // giấy thư trượt ra, hiện đầy đủ phía dưới
    paper.classList.remove("hidden");
    paper.classList.add("show");
    paper.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 1000);
};
envelope.addEventListener("animationend", (e) => {
  if (e.animationName === "wobble") envelope.classList.remove("wiggle");
});
// hero
// Ảnh icon ở header: chỉ hiện 1 ảnh, chạm vào thì chuyển sang ảnh kế tiếp (không bao giờ biến mất)
const faces = [
  { src: "img/socute.webp", alt: "socute" },
  { src: "img/kindacry.webp", alt: "kindacry" },
  { src: "img/cute.webp", alt: "cute" },
];
faces.forEach((f) => {
  new Image().src = f.src;
}); // tải sẵn để đổi ảnh tức thì
const bear = $("#bear"),
  bearImg = $("#bearImg");
let face = 0;
bear.onanimationend = (e) => {
  if (e.animationName === "wiggle") bear.classList.remove("wiggle");
};
bearImg.onanimationend = () => bearImg.classList.remove("swap");
bear.onclick = () => {
  face = (face + 1) % faces.length;
  bearImg.src = faces[face].src;
  bearImg.alt = faces[face].alt;
  bearImg.classList.remove("swap");
  void bearImg.offsetWidth;
  bearImg.classList.add("swap");
  bear.classList.remove("wiggle");
  void bear.offsetWidth;
  bear.classList.add("wiggle");
  const [x, y] = center(bear);
  burst(x, y, [""], 1);
};
$("#start").onclick = () => {
  location.hash = "likes"; // sang trang "Trâm thích gì nà"
};

// ===== NHẠC NỀN =====
// File music/bgm.mp3 đã được cân âm về khoảng -19 LUFS (đúng chuẩn nhạc nền), có sẵn đoạn mờ dần ở đầu và cuối bài.
//
// CÁCH HOẠT ĐỘNG:
//   1) Vừa vào trang: KHÔNG phát gì cả (kể cả chế độ câm).
//   2) Lần đầu tiên người xem tương tác với một chức năng trong trang (bấm nút, thẻ bài, hộp quà, mũi tên chuyển trang...)
//      thì nhạc mới bắt đầu, lên dần cho êm tai. Chạm vào chỗ trống hoặc trang loading thì chưa tính.
//   3) Nhạc chỉ phát ĐÚNG 1 LẦN: hết bài thì dừng hẳn, không tự lặp lại.
//   4) Muốn nghe lại thì bấm icon nốt nhạc: nhạc phát lại từ đầu, và vẫn chỉ 1 lần.
const bgm = $("#bgm"),
  musicBtn = $("#musicBtn");
const VOL_NORMAL = 0.8; // âm lượng thường (0 → 1)
const VOL_READING = 0.55; // âm lượng khi đã mở khóa thư, nhỏ lại cho dễ đọc
let targetVol = VOL_NORMAL;
bgm.loop = false; // không lặp
bgm.muted = false;
bgm.volume = VOL_NORMAL;
bgm.preload = "none"; // sẽ tải ở warmAudio() sau khi loading xong
let wantMusic = true; // false nếu người xem đã chủ động tắt nhạc giữa chừng
let fadeRaf = 0,
  pauseTimer = 0,
  resumeAfterHidden = false,
  retried = false;
// đổi âm lượng từ từ cho êm tai (iOS không cho chỉnh volume bằng code, khi đó bỏ qua cũng không sao)
function fadeTo(v, ms) {
  cancelAnimationFrame(fadeRaf);
  const from = bgm.volume,
    t0 = performance.now();
  (function step(now) {
    const k = Math.min(1, (now - t0) / ms);
    bgm.volume = Math.max(0, Math.min(1, from + (v - from) * k));
    if (k < 1) fadeRaf = requestAnimationFrame(step);
  })(t0);
}
function setMusicUI(on) {
  musicBtn.classList.toggle("playing", on);
  musicBtn.classList.toggle("off", !on);
  musicBtn.setAttribute("aria-pressed", on);
  musicBtn.setAttribute("aria-label", on ? "Tắt nhạc" : "Bật nhạc");
}
// trả về Promise<true/false>: có phát được hay không
function playMusic() {
  clearTimeout(pauseTimer);
  if (!wantMusic) return Promise.resolve(false);
  if (!bgm.paused) {
    fadeTo(targetVol, 400);
    setMusicUI(true);
    return Promise.resolve(true);
  }
  if (bgm.ended) bgm.currentTime = 0; // nghe lại: bắt đầu từ đầu bài
  bgm.volume = 0;
  const p = bgm.play();
  if (!p || !p.then) {
    setMusicUI(true);
    fadeTo(targetVol, 900);
    return Promise.resolve(true);
  }
  return p
    .then(() => {
      setMusicUI(true);
      fadeTo(targetVol, 900);
      return true;
    })
    .catch(() => {
      setMusicUI(false);
      return false;
    });
}
function pauseMusic(soft) {
  clearTimeout(pauseTimer);
  setMusicUI(false);
  if (soft && !bgm.paused) {
    fadeTo(0, 350);
    pauseTimer = setTimeout(() => bgm.pause(), 370);
  } else {
    cancelAnimationFrame(fadeRaf);
    bgm.pause();
  }
}
// Bấm icon nốt nhạc: đang phát thì tạm dừng; đang dừng / đã hết bài thì phát (hết bài thì phát lại từ đầu)
musicBtn.onclick = () => {
  stopWaiting();
  if (!bgm.paused) {
    wantMusic = false;
    pauseMusic(true);
  } else {
    wantMusic = true;
    playMusic();
  }
};
setMusicUI(false);

// Lần tương tác đầu tiên với một chức năng trong trang → bắt đầu phát nhạc.
// Dùng "click" vì đây là sự kiện mà mọi trình duyệt (kể cả điện thoại) công nhận là người xem đã chủ động chạm;
// bấm Enter / Space trên nút cũng sinh ra click. Nếu lần đầu chưa phát được thì lần tương tác sau vẫn thử tiếp.
const INTERACTIVE =
  'button, a[href], input, select, textarea, summary, [role="button"], [tabindex]:not([tabindex="-1"]), #deck, .gift, .like';
const videoPlaying = () => {
  const v = document.getElementById("fwVideo");
  return !!v && !v.paused && !v.ended;
};
function onGesture(e) {
  const t = e.target && e.target.closest ? e.target : null;
  if (!t || !t.closest(INTERACTIVE)) return; // chạm vào chỗ trống: chưa tính
  if (t.closest("#musicBtn, #fwPlayer")) return; // nút nhạc tự xử lý; bấm trong khung video thì để video lo
  if (!wantMusic) return stopWaiting();
  if (videoPlaying()) return;
  playMusic().then((ok) => {
    if (ok) stopWaiting();
  });
}
function stopWaiting() {
  removeEventListener("click", onGesture, true);
}
addEventListener("click", onGesture, true);

// Hết bài thì dừng hẳn, KHÔNG lặp. Đưa về đầu bài để lần bấm nốt nhạc kế tiếp nghe lại từ đầu.
bgm.addEventListener("ended", () => {
  setMusicUI(false);
  bgm.currentTime = 0;
});
// Tải file lỗi (mạng chập chờn) thì tải lại một lần (không tự phát)
bgm.addEventListener("error", () => {
  if (retried) return;
  retried = true;
  setTimeout(() => bgm.load(), 1500);
});
// Bị ngắt giữa chừng (cuộc gọi, tai nghe rút...) thì cập nhật nút cho đúng
bgm.addEventListener("pause", () => {
  if (!bgm.ended) setMusicUI(false);
});
bgm.addEventListener("playing", () => setMusicUI(true));
// Chuyển sang tab / ứng dụng khác thì tạm dừng, quay lại thì tự phát tiếp (chỉ khi trước đó đang phát)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    resumeAfterHidden = wantMusic && !bgm.paused;
    if (resumeAfterHidden) {
      clearTimeout(pauseTimer);
      bgm.pause();
    }
  } else if (resumeAfterHidden) {
    resumeAfterHidden = false;
    playMusic();
  }
});

// Nhạc nhỏ lại một chút cho dễ đọc: chỉ gọi khi người xem MỞ bức thư (không phải lúc mở đủ 6 hộp quà).
// (xóa lời gọi readingMusic() trong envelope.onclick nếu không muốn nhạc nhỏ lại)
function readingMusic() {
  targetVol = VOL_READING;
  if (!bgm.paused) fadeTo(targetVol, 1500);
}

// Tải file nhạc SAU khi trang loading xong để không tranh băng thông với ảnh và font lúc mới vào;
// tới lúc người xem chạm lần đầu thì nhạc đã sẵn sàng.
function warmAudio() {
  if (bgm.paused && bgm.readyState === 0) {
    bgm.preload = "auto";
    bgm.load();
  }
}
if (window.siteReady) warmAudio();
else addEventListener("siteready", warmAudio, { once: true });
setTimeout(warmAudio, 6000); // phòng hờ nếu sự kiện siteready không tới

// ===== CÂU ĐỐ MỞ HỘP QUÀ =====
// Mỗi hộp (theo thứ tự 1 → 6) có một câu đố.
//  - ok:   danh sách đáp án đúng (không phân biệt hoa/thường, có dấu hay không dấu đều được)
//  - test: hàm kiểm tra riêng (dùng cho ngày sinh để nhận nhiều cách viết)
//  - choices + ans: câu hỏi trắc nghiệm (ans là vị trí đáp án đúng, tính từ 0)
const WRONG_TEXT = "Phải Trâm không mà đòi";
const norm = (s) =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\/.\- ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const quizzes = [
  {
    q: "Họ tên đầy đủ của Trâm là gì?",
    ph: "Nhập họ và tên đầy đủ...",
    ok: ["Trịnh Ngọc Trâm", "TNT"],
  },
  {
    q: "Sinh nhật của Trâm là ngày tháng nào?",
    ph: "Ví dụ: 09/12",
    test: (s) => /(^|\D)0?23\D{1,8}0?11(\D|$)/.test(norm(s)),
  },
  {
    q: "Tướng tủ liqi?",
    choices: ["Annet", "Aya", "Alice", "Cả 3"],
    ans: 3,
    note: "Trâm số 1 sp mà nhờ",
  },
  {
    q: "Trâm biết nấu những món nào?",
    choices: ["Trứng Ốp", "KimBap", "Bánh", "Nhiều hơn nữa"],
    ans: 3,
    note: "Trâm siu đầu bếp mà nhờ",
  },
  {
    q: "Món ăn nào Trâm ghét nhất?",
    choices: ["Bánh Đa", "Cá", "Mì Cay", "Kem"],
    ans: 1,
    note: "Trâm ghét cá vì cá có xương",
  },
  {
    q: "OTP(One True Pairing) của Trâm?",
    ph: "Nhập OTP...",
    ok: ["tg", "tgooie", "tgooiee"],
  },
];
const quiz = $("#quiz"),
  qCard = quiz.querySelector(".quiz-card"),
  qInput = $("#quizInput"),
  qChoices = $("#quizChoices"),
  qSubmit = $("#quizSubmit"),
  qMsg = $("#quizMsg"),
  qForm = $("#quizForm"),
  qWin = $("#quizWin");
let qIdx = -1,
  qDone = null,
  qBtn = null;
const isRight = (z, val) =>
  z.test ? z.test(val) : z.ok.some((a) => norm(a) === norm(val));
function qWrong() {
  qMsg.textContent = WRONG_TEXT;
  qCard.classList.remove("nope");
  void qCard.offsetWidth;
  qCard.classList.add("nope");
}
function qWinNow(z) {
  qMsg.textContent = "";
  qForm.classList.add("hidden");
  qWin.classList.remove("hidden");
  $("#quizWinText").textContent = "Phải Trâm rùi nè!";
  const nt = $("#quizNote");
  nt.textContent = z.note || "";
  nt.classList.toggle("hidden", !z.note); // ghi chú nằm riêng, chỉ hiện nếu câu đó có note
  setTimeout(() => $("#quizOpen").focus(), 50);
}
function showQuiz(i, btn, done) {
  qIdx = i;
  qDone = done;
  qBtn = btn;
  const z = quizzes[i];
  $("#quizTitle").textContent = "Hộp Meow " + (i + 1);
  $("#quizQ").textContent = z.q;
  qMsg.textContent = "";
  qWin.classList.add("hidden");
  qForm.classList.remove("hidden");
  qChoices.innerHTML = "";
  if (z.choices) {
    qInput.classList.add("hidden");
    qSubmit.classList.add("hidden");
    qChoices.classList.remove("hidden");
    z.choices.forEach((c, k) => {
      const o = document.createElement("button");
      o.type = "button";
      o.className = "choice";
      o.textContent = c;
      o.onclick = () => {
        if (k === z.ans) qWinNow(z);
        else {
          o.classList.add("wrong");
          qWrong();
        }
      };
      qChoices.appendChild(o);
    });
  } else {
    qChoices.classList.add("hidden");
    qInput.classList.remove("hidden");
    qSubmit.classList.remove("hidden");
    qInput.value = "";
    qInput.placeholder = z.ph || "";
  }
  quiz.classList.remove("hidden");
  document.body.classList.add("lock");
  setTimeout(() => (z.choices ? qChoices.firstChild : qInput).focus(), 60);
}
function closeQuiz() {
  quiz.classList.add("hidden");
  document.body.classList.remove("lock");
  if (qBtn) qBtn.focus({ preventScroll: true });
}
qForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!qInput.value.trim()) {
    qMsg.textContent = "Nhập câu trả lời đã nha !";
    return;
  }
  if (isRight(quizzes[qIdx], qInput.value)) qWinNow(quizzes[qIdx]);
  else {
    qWrong();
    qInput.select();
  }
});
$("#quizOpen").onclick = () => {
  const f = qDone;
  closeQuiz();
  if (f) f();
};
$("#quizX").onclick = closeQuiz;
quiz.addEventListener("pointerdown", (e) => {
  if (e.target === quiz) closeQuiz();
});
addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !quiz.classList.contains("hidden")) closeQuiz();
});

// ===== XEM QUÀ TO GIỮA MÀN HÌNH + CHÚ THÍCH =====
const viewer = $("#viewer"),
  vImg = $("#viewerImg");
let vAfter = null,
  vBtn = null;
function showViewer(i, btn, after) {
  const g = gifts[i];
  vAfter = after || null;
  vBtn = btn;
  vImg.src = g.img;
  vImg.alt = g.n;
  $("#viewerName").textContent = g.n;
  $("#viewerCap").textContent = g.m;
  const from = (btn.querySelector(".e img") || btn).getBoundingClientRect();
  viewer.classList.remove("hidden");
  document.body.classList.add("lock");
  vImg.classList.remove("zoom");
  const to = vImg.getBoundingClientRect();
  // hiệu ứng: quà phóng to từ đúng vị trí icon nhỏ ra giữa màn hình
  vImg.style.setProperty(
    "--fx",
    from.left + from.width / 2 - (to.left + to.width / 2) + "px",
  );
  vImg.style.setProperty(
    "--fy",
    from.top + from.height / 2 - (to.top + to.height / 2) + "px",
  );
  vImg.style.setProperty("--fs", Math.max(0.1, from.height / to.height));
  void vImg.offsetWidth;
  vImg.classList.add("zoom");
  setTimeout(() => $("#viewerClose").focus({ preventScroll: true }), 60);
}
function closeViewer() {
  if (viewer.classList.contains("hidden")) return;
  viewer.classList.add("hidden");
  document.body.classList.remove("lock");
  if (vBtn) vBtn.focus({ preventScroll: true });
  const f = vAfter;
  vAfter = null;
  if (f) f();
}
$("#viewerClose").onclick = closeViewer;
vImg.onclick = closeViewer;
viewer.addEventListener("pointerdown", (e) => {
  if (e.target === viewer) closeViewer();
});
addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeViewer();
});
