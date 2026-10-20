/* =====================================================================
   BÓI BÀI TAROT – bộ 78 lá (22 Ẩn chính + 56 Ẩn phụ, theo cấu trúc Rider–Waite)
   - Ảnh lá bài: đặt vào img/tarot/  (xem README.txt trong thư mục đó)
     + mặt sau:  img/tarot/back.webp   (hoặc .jpg / .png)
     + mặt trước: img/tarot/major-00.webp ... wands-14.webp ... (hoặc .jpg / .png)
   - Chưa có ảnh thì trang dùng mặt bài vẽ sẵn bằng CSS để vẫn chơi được.
   - Lời bói nằm trong MAJOR (22 lá chính) và RANKS (56 lá phụ) bên dưới, sửa thoải mái.
   ===================================================================== */
(() => {
  const EXTS = ["webp", "jpg", "png"];
  const IMG_DIR = "img/tarot/";

  // ---------- DỮ LIỆU 22 LÁ ẨN CHÍNH ----------
  const MAJOR = [
    [
      "The Fool",
      "Chàng ngốc",
      "Khởi đầu · Tự do · Dũng cảm",
      "🃏",
      "Trâm sắp bước sang một chặng mới, và lá bài này bảo rằng cứ nhẹ nhàng mà đi. Không cần chắc chắn hết mọi thứ mới dám bước, Trâm chỉ cần dũng cảm một chút thôi, phần còn lại có mình đứng phía sau cổ vũ nè.",
    ],
    [
      "The Magician",
      "Nhà ảo thuật",
      "Tài năng · Ý chí · Hành động",
      "🪄",
      "Trâm đã có sẵn mọi thứ cần thiết trong tay: sự thông minh, sự chăm chỉ và cả một trái tim biết cố gắng. Những gì Trâm đã học sẽ nằm yên trong đầu đúng lúc cần. Cứ tin vào mình nha.",
    ],
    [
      "The High Priestess",
      "Nữ tư tế",
      "Trực giác · Bí ẩn · Tĩnh lặng",
      "🌙",
      "Trực giác của Trâm đang rất tinh. Những lúc phân vân, Trâm cứ yên lặng một chút, hít thở thật sâu rồi lắng nghe bên trong. Câu trả lời đã nằm sẵn đó từ lâu rồi.",
    ],
    [
      "The Empress",
      "Nữ hoàng",
      "Dịu dàng · Đủ đầy · Nở rộ",
      "🌹",
      "Một giai đoạn dịu dàng và đủ đầy. Trâm được thương nhiều hơn Trâm nghĩ, và Trâm cũng rất biết thương người khác. Nhớ chăm sóc bản thân thật tốt, ăn đủ bữa, ngủ đủ giấc nha.",
    ],
    [
      "The Emperor",
      "Hoàng đế",
      "Vững vàng · Kỷ luật · Làm chủ",
      "🏰",
      "Trâm đang trưởng thành, vững vàng hơn từng ngày. Có kế hoạch rõ ràng, đi từng bước chắc chắn, Trâm sẽ tự đứng vững và làm chủ hành trình của mình.",
    ],
    [
      "The Hierophant",
      "Giáo hoàng",
      "Truyền thống · Học hỏi · Niềm tin",
      "🔔",
      "Những lời dặn của người đi trước và những điều Trâm đã học bấy lâu là nền tảng rất vững. Cứ tin vào cách học và lối đi mà Trâm đã chọn, nó hợp với Trâm lắm.",
    ],
    [
      "The Lovers",
      "Những người yêu nhau",
      "Tình yêu · Lựa chọn · Hòa hợp",
      "💞",
      "Có một tình cảm chân thành đang ở rất gần Trâm, nhẹ nhàng và không đòi hỏi gì cả. Còn Trâm thì đang học cách chọn điều đúng với trái tim mình. Yêu thương người khác nhưng đừng quên yêu thương chính mình nhé.",
    ],
    [
      "The Chariot",
      "Cỗ xe",
      "Quyết tâm · Chiến thắng · Tiến lên",
      "🎠",
      "Quyết tâm của Trâm sẽ đưa Trâm tới đích. Giữ nhịp thật đều, giữ đầu óc thật bình tĩnh, chiến thắng đang ở gần hơn Trâm tưởng. Cứ tiếp tục nha.",
    ],
    [
      "Strength",
      "Sức mạnh",
      "Kiên cường · Dịu dàng · Can đảm",
      "🦁",
      "Sức mạnh thật sự là dịu dàng mà không bỏ cuộc. Trâm kiên cường hơn Trâm nghĩ nhiều. Những lúc áp lực, cứ kiên nhẫn và tử tế với chính mình, mọi thứ rồi sẽ ổn.",
    ],
    [
      "The Hermit",
      "Ẩn sĩ",
      "Chiêm nghiệm · Tìm lại mình",
      "🏮",
      "Đây là lúc Trâm chậm lại và dành thời gian cho riêng mình. Những buổi tối ngồi học một mình không hề cô đơn đâu, ngọn đèn nhỏ ấy đang soi đường cho Trâm đó.",
    ],
    [
      "Wheel of Fortune",
      "Bánh xe vận mệnh",
      "May mắn · Thay đổi · Cơ hội",
      "🎡",
      "Vận may đang xoay về phía Trâm. Có vài thay đổi bất ngờ sắp tới, và phần lớn là điều tốt. Cứ đón nhận bằng một nụ cười nhé.",
    ],
    [
      "Justice",
      "Công lý",
      "Công bằng · Sự thật · Cân bằng",
      "⚖️",
      "Mọi cố gắng của Trâm đều được nhìn thấy, và sẽ được đền đáp xứng đáng. Cứ chân thành và làm hết sức mình, kết quả sẽ công bằng với Trâm.",
    ],
    [
      "The Hanged Man",
      "Người treo ngược",
      "Góc nhìn mới · Chờ đợi",
      "🙃",
      "Thử nhìn mọi chuyện từ một góc khác, Trâm sẽ thấy nhẹ hơn nhiều. Đôi khi dừng lại một nhịp không phải là chậm, mà là đang lấy đà cho một bước nhảy lớn.",
    ],
    [
      "Death",
      "Thần chết",
      "Kết thúc · Đổi mới · Chuyển hóa",
      "🦋",
      "Một chương cũ khép lại để chương mới đẹp hơn được mở ra. Lá bài này không đáng sợ đâu, nó chỉ nói rằng Trâm đang lớn lên và sắp bước sang một giai đoạn mới.",
    ],
    [
      "Temperance",
      "Tiết chế",
      "Cân bằng · Hài hòa · Kiên nhẫn",
      "⚗️",
      "Cân bằng là chìa khóa. Học một chút, nghỉ một chút, cười một chút. Chỉnh nhịp sống cho vừa sức, lòng Trâm sẽ nhẹ và bình yên hơn.",
    ],
    [
      "The Devil",
      "Ác quỷ",
      "Ràng buộc · Cám dỗ · Tự do",
      "⛓️",
      "Có thứ gì đó đang níu Trâm lại, có thể là nỗi lo, là áp lực hay một thói quen khó bỏ. Nhưng sợi xích ấy lỏng hơn Trâm tưởng, và Trâm hoàn toàn có thể tự tháo ra.",
    ],
    [
      "The Tower",
      "Tòa tháp",
      "Bất ngờ · Thay đổi · Làm lại",
      "⚡",
      "Có điều gì đó bất ngờ làm Trâm chao đảo một chút, nhưng là để dọn chỗ cho nền móng vững hơn. Sau cơn mưa, trời luôn trong hơn. Và Trâm không phải đi qua một mình đâu.",
    ],
    [
      "The Star",
      "Ngôi sao",
      "Hy vọng · Chữa lành · Ước mơ",
      "⭐",
      "Hy vọng đang lấp lánh ngay trên đầu Trâm. Mọi điều Trâm ước đều có thể thành thật, cứ giữ niềm tin và tiếp tục tỏa sáng nha.",
    ],
    [
      "The Moon",
      "Mặt trăng",
      "Mơ hồ · Trực giác · Cảm xúc",
      "🌕",
      "Có lúc mọi thứ hơi mơ hồ, lo lắng vu vơ kéo đến. Đừng vội kết luận nha, những cảm giác ấy sẽ tan khi trời sáng. Tin vào trực giác của mình, mọi chuyện rồi sẽ rõ.",
    ],
    [
      "The Sun",
      "Mặt trời",
      "Niềm vui · Thành công · Rạng rỡ",
      "☀️",
      "Niềm vui, thành công và nguồn năng lượng ấm áp đang bao quanh Trâm. Đây là một trong những lá đẹp nhất. Cứ cười thật tươi, vì nụ cười ấy hợp với Trâm lắm.",
    ],
    [
      "Judgement",
      "Phán xét",
      "Thức tỉnh · Tha thứ · Chương mới",
      "🎺",
      "Có một tiếng gọi bên trong đang đánh thức Trâm. Đã đến lúc nhìn lại chặng đường vừa qua, tha thứ cho những lần mình chưa làm tốt, và bước vào chương mới thật nhẹ nhõm.",
    ],
    [
      "The World",
      "Thế giới",
      "Viên mãn · Hoàn thành · Trọn vẹn",
      "🌍",
      "Một chu kỳ tròn đầy và viên mãn. Những gì Trâm cố gắng bấy lâu sắp được đền đáp. Hãy tự hào về chặng đường đã qua, và đón điều mới thật tự tin nha.",
    ],
  ];
  const ROMAN = [
    "0",
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
    "XIII",
    "XIV",
    "XV",
    "XVI",
    "XVII",
    "XVIII",
    "XIX",
    "XX",
    "XXI",
  ];

  // ---------- 4 BỘ ẨN PHỤ ----------
  const SUITS = [
    {
      key: "wands",
      vi: "Gậy",
      en: "Wands",
      t: "đam mê và ước mơ",
      sym: "🪄",
    },
    { key: "cups", vi: "Cốc", en: "Cups", t: "chuyện tình cảm", sym: "🍵" },
    {
      key: "swords",
      vi: "Kiếm",
      en: "Swords",
      t: "những suy nghĩ và quyết định",
      sym: "🗡️",
    },
    {
      key: "pentacles",
      vi: "Tiền xu",
      en: "Pentacles",
      t: "chuyện học hành và thi cử",
      sym: "🪙",
    },
  ];
  // 14 lá mỗi bộ: Át, 2–10, Thị đồng (Page), Kỵ sĩ (Knight), Nữ hoàng (Queen), Vua (King). {t} = chủ đề của bộ bài.
  const RANKS = [
    [
      "Ace",
      "Át",
      "A",
      "Khởi đầu",
      "Một khởi đầu mới đầy hứa hẹn đang đến với {t} của Trâm. Cứ đón lấy bằng sự cởi mở.",
    ],
    [
      "Two",
      "Hai",
      "2",
      "Lựa chọn",
      "Trâm đang cân nhắc giữa hai lựa chọn trong {t}. Không cần vội đâu, hít thở sâu, lắng nghe lòng mình rồi hãy quyết định nha.",
    ],
    [
      "Three",
      "Ba",
      "3",
      "Phát triển",
      "{t} đang nở dần nhờ sự đồng hành và hợp tác. Hãy chia sẻ niềm vui này với những người thương Trâm nhé.",
    ],
    [
      "Four",
      "Bốn",
      "4",
      "Ổn định",
      "{t} đang cần một chút ổn định và nghỉ ngơi. Dừng lại sắp xếp mọi thứ cho vững, rồi tiếp tục thật thong thả nhé.",
    ],
    [
      "Five",
      "Năm",
      "5",
      "Thử thách",
      "Có chút va chạm hoặc thử thách trong {t}, nhưng chỉ là bài học nho nhỏ thôi. Bình tĩnh nhìn lại, Trâm sẽ tìm ra cách.",
    ],
    [
      "Six",
      "Sáu",
      "6",
      "Hòa hợp",
      "{t} đang dịu lại và hòa hợp hơn. Một lời động viên hay một ký ức đẹp sẽ giúp Trâm bước tiếp thật nhẹ nhàng.",
    ],
    [
      "Seven",
      "Bảy",
      "7",
      "Kiên trì",
      "Trâm cần kiên trì giữ vững lập trường trong {t}. Tin vào những gì mình đã cố gắng, đừng để ai làm Trâm chùn bước.",
    ],
    [
      "Eight",
      "Tám",
      "8",
      "Chăm chỉ",
      "Sự chăm chỉ và tập trung sẽ mang lại kết quả cho {t}. Cứ đều đặn từng bước, tiến bộ của Trâm thật đáng nể.",
    ],
    [
      "Nine",
      "Chín",
      "9",
      "Gần đích",
      "{t} sắp về gần đích rồi. Trâm đã đi qua nhiều thứ, chỉ cần thêm chút kiên cường nữa thôi. Gần lắm rồi đó.",
    ],
    [
      "Ten",
      "Mười",
      "10",
      "Viên mãn",
      "Một chu kỳ trong {t} khép lại viên mãn, hoặc đã đến lúc đặt bớt gánh nặng xuống. Hãy tự thưởng cho mình một cái ôm.",
    ],
    [
      "Page",
      "Thị đồng",
      "P",
      "Tin mới",
      "Có một tin nhắn, một ý tưởng hay một cơ hội nhỏ xinh đang tới trong {t}. Hãy tò mò, học hỏi và đừng ngại thử điều mới.",
    ],
    [
      "Knight",
      "Kỵ sĩ",
      "N",
      "Hành động",
      "Mọi thứ trong {t} đang chuyển động nhanh. Hãy hành động bằng nhiệt huyết, nhưng nhớ nhìn đường kỹ để không vội vàng.",
    ],
    [
      "Queen",
      "Nữ hoàng",
      "Q",
      "Dịu dàng",
      "Trâm đang làm chủ {t} bằng sự dịu dàng và hiểu biết. Tin vào cảm nhận của mình, và nhớ chăm sóc bản thân nữa nha.",
    ],
    [
      "King",
      "Vua",
      "K",
      "Bản lĩnh",
      "Trâm có đủ bản lĩnh và kinh nghiệm để dẫn dắt {t}. Cứ bình tĩnh, rộng lượng và quyết đoán, mọi chuyện sẽ ổn.",
    ],
  ];
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const pad2 = (n) => String(n).padStart(2, "0");

  // ---------- GHÉP THÀNH 78 LÁ ----------
  const CARDS = [];
  MAJOR.forEach((m, n) =>
    CARDS.push({
      id: "major-" + pad2(n),
      en: m[0],
      vi: m[1],
      sub: m[2],
      sym: m[3],
      read: m[4],
      num: ROMAN[n],
      tag: "Ẩn chính",
    }),
  );
  SUITS.forEach((s) =>
    RANKS.forEach((r, k) =>
      CARDS.push({
        id: s.key + "-" + pad2(k + 1),
        en: r[0] + " of " + s.en,
        vi: r[1] + " " + s.vi,
        sub: "Bộ " + s.vi + " · " + r[3],
        sym: s.sym,
        read: r[4].replace(/^\{t\}/, cap(s.t)).replace(/\{t\}/g, s.t),
        num: r[2],
        tag: "Bộ " + s.vi,
      }),
    ),
  );

  // ---------- TIỆN ÍCH ----------
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function shuffledIndices(n) {
    // xáo trộn ngẫu nhiên: người chơi không thể đoán lá nào ở đâu
    const a = Array.from({ length: n }, (_, i) => i);
    const rnd = new Uint32Array(n);
    (self.crypto || window.crypto).getRandomValues(rnd);
    for (let i = n - 1; i > 0; i--) {
      const j = rnd[i] % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- MẶT SAU (ảnh back.* nếu có) ----------
  (function loadBack() {
    let k = 0;
    const img = new Image();
    img.onload = () => {
      document.documentElement.style.setProperty(
        "--back-img",
        'url("' + img.src + '")',
      );
      document.documentElement.classList.add("has-back");
    };
    img.onerror = () => {
      if (k < EXTS.length) img.src = IMG_DIR + "back." + EXTS[k++];
    };
    img.onerror();
  })();

  // ---------- MẶT TRƯỚC (ảnh thật nếu có, không thì mặt vẽ sẵn) ----------
  function fallbackFace(c) {
    const d = document.createElement("div");
    d.className = "fb";
    const mk = (tag, cls, txt) => {
      const e = document.createElement(tag);
      e.className = cls;
      e.textContent = txt;
      return e;
    };
    d.append(
      mk("small", "fb-num", c.num),
      mk("b", "fb-sym", c.sym),
      mk("strong", "fb-vi", c.vi),
      mk("em", "fb-en", c.en),
    );
    return d;
  }
  function buildFace(c) {
    const f = document.createElement("div");
    f.className = "tface";
    const img = new Image();
    img.alt = c.vi + " (" + c.en + ")";
    img.draggable = false;
    let k = 0;
    const next = () => {
      if (k >= EXTS.length) {
        img.remove();
        f.appendChild(fallbackFace(c));
        return;
      }
      img.src = IMG_DIR + c.id + "." + EXTS[k++];
    };
    img.onerror = next;
    f.appendChild(img);
    next();
    return f;
  }

  // ---------- BỘ BÀI (băng chuyền: lăn chuột / vuốt tay để lướt qua các lá) ----------
  const deck = $("#deck"),
    inner = $("#deckInner"),
    hint = $("#deckHint"),
    tarotEl = $("#tarotPage");
  const order = shuffledIndices(CARDS.length); // vị trí úp thứ i  →  lá bài thật order[i]
  const cards = [];
  const coarse = matchMedia("(pointer: coarse)").matches;
  let spread = false,
    focus = Math.floor(CARDS.length / 2),
    picked = null;
  let step = 22,
    gap = 30,
    vis = 5,
    suppressClick = 0;

  for (let i = 0; i < CARDS.length; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "tcard";
    b.tabIndex = -1;
    b.dataset.i = i;
    b.setAttribute("aria-label", "Lá bài úp số " + (i + 1));
    b.innerHTML = '<span class="tback"></span>';
    inner.appendChild(b);
    cards.push(b);
  }

  // đặt vị trí từng lá theo lá đang được chọn (focus): lá giữa nổi lên, các lá hai bên xòe ra đối xứng
  function render() {
    cards.forEach((c, i) => {
      const off = i - focus,
        a = Math.abs(off),
        s = Math.sign(off);
      let x,
        y,
        r,
        sc = 1,
        z,
        gone = false;
      if (!spread) {
        x = (i - 39) * 0.12;
        y = (i - 39) * -0.12;
        r = 0;
        z = i;
      } // chồng lại thành một bộ
      else if (off === 0) {
        x = 0;
        y = -28;
        r = 0;
        sc = 1.22;
        z = 300;
      } else {
        const k = Math.min(a, vis + 1);
        x = s * (k * step + gap);
        y = k * k * 0.22;
        r = s * Math.min(k * 2.4, 30);
        z = 200 - a;
        gone = a > vis; // lá nằm ngoài màn hình thì ẩn đi, không bị cắt ở mép
      }
      if (gone && c._gone) return; // lá vẫn đang ẩn ngoài màn hình thì khỏi ghi lại style
      c._gone = gone;
      c.style.transform =
        "translate(" +
        x +
        "px," +
        y +
        "px) rotate(" +
        r +
        "deg) scale(" +
        sc +
        ")";
      c.style.zIndex = z;
      c.classList.toggle("gone", gone);
      c.classList.toggle("focus", spread && off === 0);
    });
  }
  function layout() {
    const W = deck.clientWidth || Math.round(innerWidth * 0.8); // bề rộng vùng chứa bài (nằm trong khung nền)
    const cw = clamp(W * 0.19, 68, 104);
    tarotEl.style.setProperty("--cw", cw + "px");
    step = cw * (W >= 900 ? 0.42 : 0.3);
    gap = cw * 0.42;
    vis = Math.max(2, Math.floor((W / 2 - 10 - cw * 0.65 - gap) / step)); // số lá hiện mỗi bên: luôn nằm trọn trong màn hình
    render();
  }
  function setFocus(i) {
    i = clamp(i, 0, CARDS.length - 1);
    if (i === focus || picked !== null) return;
    focus = i;
    render();
  }
  function doSpread() {
    spread = true;
    cards.forEach((c, i) => {
      c.style.transitionDelay = Math.abs(i - focus) * 9 + "ms";
    });
    layout();
    setTimeout(
      () =>
        cards.forEach((c) => {
          c.style.transitionDelay = "";
        }),
      1100,
    );
    deck.setAttribute(
      "aria-label",
      "Bộ bài đã xòe. Dùng phím mũi tên để lướt, Enter để rút một lá",
    );
    hint.textContent =
      (coarse
        ? "Vuốt sang trái hoặc phải để lướt qua các lá bài, rồi chạm vào lá ở giữa để rút."
        : "Lăn chuột để lướt qua các lá bài, rồi bấm vào lá ở giữa để rút.") +
      " ";
  }

  deck.addEventListener("click", (e) => {
    if (picked !== null || performance.now() < suppressClick) return;
    if (!spread) {
      doSpread();
      return;
    }
    const c = e.target.closest(".tcard");
    if (!c) return;
    const i = +c.dataset.i;
    if (i === focus)
      pick(i); // lá ở giữa → rút
    else setFocus(i); // lá khác → đưa lá đó vào giữa trước (tránh rút nhầm)
  });
  // máy tính: lăn chuột trong vùng bài để chuyển sang lá khác
  let acc = 0;
  deck.addEventListener(
    "wheel",
    (e) => {
      if (!spread || picked !== null) return;
      e.preventDefault();
      acc +=
        (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) *
        (e.deltaMode === 1 ? 16 : 1);
      const n = Math.trunc(acc / 50);
      if (n) {
        acc -= n * 50;
        setFocus(focus + n);
      }
    },
    { passive: false },
  );
  // điện thoại (và kéo chuột): vuốt ngang để chuyển sang lá khác
  let drag = null;
  deck.addEventListener("pointerdown", (e) => {
    if (!spread || picked !== null) return;
    drag = { id: e.pointerId, x: e.clientX, f: focus, moved: 0 };
  });
  deck.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    drag.moved = Math.max(drag.moved, Math.abs(dx));
    if (drag.moved > 8) {
      try {
        deck.setPointerCapture(e.pointerId);
      } catch (_) {}
      setFocus(drag.f - Math.round(dx / step));
    }
  });
  const endDrag = (e) => {
    if (drag && e.pointerId === drag.id) {
      if (drag.moved > 8) suppressClick = performance.now() + 250; // vuốt xong thì không tính là chạm chọn bài
      drag = null;
    }
  };
  deck.addEventListener("pointerup", endDrag);
  deck.addEventListener("pointercancel", endDrag);
  deck.addEventListener("keydown", (e) => {
    if (picked !== null) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!spread) doSpread();
      else pick(focus);
    } else if (spread && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      e.preventDefault();
      setFocus(focus + (e.key === "ArrowRight" ? 1 : -1));
    }
  });
  let rzRaf = 0;
  addEventListener("resize", () => {
    cancelAnimationFrame(rzRaf);
    rzRaf = requestAnimationFrame(() => {
      if (picked === null) layout();
    });
  });
  window.tarotLayout = layout; // trang Tarot gọi lại khi được mở ra

  // ---------- RÚT BÀI ----------
  function pick(i) {
    if (picked !== null) return;
    picked = order[i];
    cards[i].classList.add("picked");
    deck.classList.add("locked");
    hint.textContent = "";
    openView(CARDS[picked], cards[i].getBoundingClientRect(), true);
  }

  // ---------- LÁ BÀI HIỆN GIỮA MÀN HÌNH + LẬT + LỜI BÓI ----------
  const tv = $("#tview"),
    tvCard = $("#tvCard"),
    tvInner = $("#tvInner"),
    tvText = $("#tvText");
  let tvTimer = 0,
    tvAnim = null,
    tvFirst = false;
  function openView(c, fromRect, animate) {
    clearTimeout(tvTimer);
    $("#tvFront").replaceChildren(buildFace(c));
    $("#tvName").textContent = c.vi;
    $("#tvEn").textContent = c.en + " · " + c.tag;
    $("#tvSub").textContent = c.sub;
    $("#tvRead").textContent = c.read;
    tvText.classList.remove("show");
    tvInner.classList.remove("flipped");
    tvFirst = animate;
    tv.classList.remove("hidden");
    document.body.classList.add("lock");
    const reveal = () => {
      tvInner.classList.add("flipped"); // hiệu ứng lật bài
      tvTimer = setTimeout(
        () => {
          tvText.classList.add("show");
        },
        reduced ? 0 : 900,
      );
    };
    if (animate && fromRect && !reduced) {
      const to = tvCard.getBoundingClientRect();
      const dx = fromRect.left + fromRect.width / 2 - (to.left + to.width / 2);
      const dy = fromRect.top + fromRect.height / 2 - (to.top + to.height / 2);
      const s = fromRect.width / to.width;
      tvAnim = tvCard.animate(
        [
          {
            transform: "translate(" + dx + "px," + dy + "px) scale(" + s + ")",
          },
          { transform: "none" },
        ],
        { duration: 700, easing: "cubic-bezier(.2,.9,.3,1.1)" },
      );
      tvAnim.onfinish = () => setTimeout(reveal, 150);
    } else if (animate) {
      reveal();
    } else {
      // xem lại lời bói: hiện luôn mặt trước
      tvInner.classList.add("flipped");
      tvText.classList.add("show");
    }
    setTimeout(() => $("#tvClose").focus({ preventScroll: true }), 60);
  }
  function closeView() {
    if (tv.classList.contains("hidden")) return;
    clearTimeout(tvTimer);
    if (tvAnim) {
      tvAnim.cancel();
      tvAnim = null;
    }
    tv.classList.add("hidden");
    document.body.classList.remove("lock");
    if (picked !== null) showResult(CARDS[picked]);
  }
  $("#tvClose").onclick = closeView;
  tv.addEventListener("pointerdown", (e) => {
    if (e.target === tv) closeView();
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeView();
  });

  // ---------- KẾT QUẢ SAU KHI RÚT ----------
  function showResult(c) {
    $("#deckWrap").classList.add("hidden");
    const box = $("#tarotResult");
    box.classList.remove("hidden");
    $("#trCard").replaceChildren(buildFace(c));
    $("#trName").textContent = c.vi;
    $("#trSub").textContent = c.sub;
    $("#tarotSub").textContent = "Đây là lá bài dành cho Trâm hôm nay";
  }
  $("#trAgain").onclick = () => {
    if (picked !== null) openView(CARDS[picked], null, false);
  };

  // ---------- KHỞI TẠO ----------
  layout();
})();
