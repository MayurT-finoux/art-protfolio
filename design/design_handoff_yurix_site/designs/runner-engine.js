// YurixRunner — placeholder endless-runner engine for the 404 page (prototype only).
// Sprites are drawn as simple doodles until the real assets land; swap draw* functions for sprite sheets.
(function () {
  const P = { ink: "#131316", pencil: "#8f8c9c", accent: "#5a4bc4", tint: "#efedfb", white: "#ffffff", yellow: "#f2c14e", coral: "#ee7b5b", teal: "#3aa6a0", pink: "#f3a5bf", lav: "#d8d3f2", soil: "#ebe8f8", wood: "#e8b77d" };
  const PAINTS = [P.accent, P.coral, P.teal, P.yellow, P.pink];
  const STAGES = { ink: [220, 340], paint: [600, 740] };
  const GROUND = [{ k: "jar", w: 26, h: 30 }, { k: "pencil", w: 12, h: 46 }, { k: "eraser", w: 36, h: 20 }, { k: "clay", w: 34, h: 26 }, { k: "can", w: 18, h: 40 }];
  const FLY = [{ k: "plane", w: 36, h: 16 }, { k: "brush", w: 50, h: 12 }, { k: "moth", w: 30, h: 22 }];
  const DIFF = { easy: { v: 200, a: 3.5, max: 440 }, normal: { v: 240, a: 5, max: 540 }, hard: { v: 290, a: 7, max: 620 } };
  const LABEL = { jar: "paint jar", pencil: "pencil", eraser: "eraser", clay: "clay blob", can: "spray can", plane: "paper plane", brush: "flying brush", moth: "moth" };
  const G = 2600, JV = 820;
  const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const hash = (a, b) => { let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) >>> 0; h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const rng = (seed) => { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; };
  const stageOf = (s) => s >= STAGES.paint[0] ? "paint" : s >= STAGES.ink[0] ? "ink" : "sketch";
  let AC = null;
  function sfx(name) {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
      o.connect(g); g.connect(AC.destination);
      const spec = { jump: ["square", 520, 880, 0.09, 0.05], hit: ["sawtooth", 220, 60, 0.28, 0.07], score: ["triangle", 880, 1320, 0.14, 0.06] }[name];
      if (!spec) return;
      o.type = spec[0]; o.frequency.setValueAtTime(spec[1], t); o.frequency.exponentialRampToValueAtTime(spec[2], t + spec[3]);
      g.gain.setValueAtTime(spec[4], t); g.gain.exponentialRampToValueAtTime(0.0001, t + spec[3]);
      o.start(t); o.stop(t + spec[3] + 0.02);
    } catch (e) {}
  }

  function create(canvas, opts) {
    opts = opts || {};
    const ctx = canvas.getContext("2d");
    const theme = opts.theme || "sketch";
    const cb = (n, ...a) => { if (!priming && opts[n]) opts[n](...a); };
    let D = DIFF[opts.difficulty] || DIFF.normal;
    let S = 1, WW = 420, WH = 260, GY = 220, CX = 70, dpr = 1;
    let mode = "idle", running = true, raf = 0, last = 0, dirty = true, priming = false;
    let t = 0, speed = D.v, dist = 0, score = 0, obs = [], nextSpawn = 300, alt = 0, vy = 0, grounded = true, duckHeld = false, jumpBuf = 0;
    let pose = "idle", phase = 0, hitType = null, shake = 0, parts = [], hist = [], histT = 0, autopilot = false, labels = !!opts.labels, lastStage = "sketch", lastMile = 0, oid = 1;
    let R = rng(opts.seed || 7);
    const city = [], clouds = [], props = [], pebbles = [];
    (function gen() {
      const r = rng(42);
      for (let x = 0; x < 1200;) { const w = 26 + r() * 36, h = 26 + r() * 70; city.push({ x, w, h, top: r() < 0.25 ? "dome" : r() < 0.4 ? "tank" : "flat" }); x += w + 4 + r() * 18; }
      for (let i = 0; i < 5; i++) clouds.push({ x: i * 290 + r() * 120, y: r(), r: 14 + r() * 10, id: 300 + i });
      for (let x = 30; x < 800;) { const k = r() < 0.3 ? "easel" : r() < 0.6 ? "plant" : "tuft"; props.push({ x, k, id: 500 + props.length, c: PAINTS[(r() * 5) | 0] }); x += 90 + r() * 160; }
      for (let x = 0; x < 300; x += 18 + r() * 30) pebbles.push({ x, y: 7 + r() * 22, w: 4 + r() * 10 });
    })();

    function resize() {
      const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      S = Math.min(h / 250, w / 440, 1.75);
      WW = w / S; WH = h / S; GY = WH - Math.min(44, WH * 0.16); CX = Math.min(96, WW * 0.16);
      dirty = true; kick();
    }
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(canvas);

    // ---------- drawing primitives ----------
    let L = { ink: 0, paint: 0 }, boil = 0, GHOST = 0;
    const lineCol = () => L.ink > 0.5 ? P.ink : P.pencil;
    function path(pts, closed, jx, seed) {
      ctx.beginPath();
      for (let i = 0; i < pts.length; i++) {
        const dx = jx ? (hash(seed, i * 2 + boil * 31) - 0.5) * jx : 0, dy = jx ? (hash(seed + 9, i * 2 + 1 + boil * 31) - 0.5) * jx : 0;
        const X = (pts[i][0] + dx) * S, Y = (pts[i][1] + dy) * S;
        i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
      }
      if (closed) ctx.closePath();
    }
    function shape(pts, o) {
      o = o || {};
      const closed = o.closed !== false, a = o.alpha == null ? 1 : o.alpha, id = o.id || 1, lw = o.lw || 1;
      ctx.lineJoin = "round"; ctx.lineCap = "round";
      if (GHOST) { ctx.globalAlpha = GHOST; ctx.strokeStyle = P.accent; ctx.lineWidth = 1.5 * S * lw; path(pts, closed, 0, id); ctx.stroke(); ctx.globalAlpha = 1; return; }
      if (o.fill && closed && L.paint > 0.01) {
        ctx.save(); ctx.translate(1.4 * S, 1.2 * S); ctx.globalAlpha = a * L.paint; ctx.fillStyle = o.fill; path(pts, true, 0, id); ctx.fill(); ctx.restore();
      }
      const sk = 1 - L.ink;
      if (sk > 0.01) {
        ctx.strokeStyle = P.pencil; ctx.lineWidth = 1.1 * S * lw;
        ctx.globalAlpha = a * sk * 0.95; path(pts, closed, 2.4, id); ctx.stroke();
        ctx.globalAlpha = a * sk * 0.4; path(pts, closed, 3.6, id + 77); ctx.stroke();
      }
      if (L.ink > 0.01) {
        ctx.strokeStyle = P.ink; ctx.lineWidth = 2 * S * lw; ctx.globalAlpha = a * L.ink;
        path(pts, closed, 0.6 * (1 - L.paint), id); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    function dot(x, y, r) { if (GHOST) return; ctx.globalAlpha = 1; ctx.fillStyle = lineCol(); ctx.beginPath(); ctx.arc(x * S, y * S, r * S, 0, 6.283); ctx.fill(); }
    const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
    const circ = (cx, cy, rx, ry, n, wob, seed) => { const p = []; n = n || 14; for (let i = 0; i < n; i++) { const a = (i / n) * 6.283, k = wob ? 1 + (hash(seed || 1, i) - 0.5) * wob : 1; p.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * (ry || rx) * k]); } return p; };
    const rot = (pts, cx, cy, a) => { const c = Math.cos(a), s = Math.sin(a); return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]); };
    function label(text, x, y) {
      if (!labels || GHOST) return;
      ctx.globalAlpha = 1; ctx.font = "500 " + Math.max(9, 8.5 * S) + "px 'DM Mono', monospace"; ctx.textAlign = "center";
      const w = ctx.measureText(text).width + 8 * S;
      ctx.fillStyle = "rgba(255,255,255,0.92)"; ctx.fillRect(x * S - w / 2, y * S - 7 * S, w, 12 * S);
      ctx.fillStyle = P.accent; ctx.fillText(text, x * S, y * S + 2.5 * S); ctx.textAlign = "left";
    }

    // ---------- character (placeholder doodle: me + giant pencil) ----------
    function pencilAt(hx, hy, ang, len) {
      const body = rot(rect(hx - 3, hy - len, 6, len), hx, hy, ang);
      const tip = rot([[hx - 3, hy - len], [hx + 3, hy - len], [hx, hy - len - 8]], hx, hy, ang);
      const eras = rot(rect(hx - 3, hy - 2, 6, 5), hx, hy, ang);
      shape(body, { fill: P.yellow, id: 61 }); shape(tip, { fill: P.wood, id: 62 }); shape(eras, { fill: P.pink, id: 63 });
    }
    function drawChar(fx, fy, ps, ph, tt) {
      const s2 = Math.sin(ph * 6.283);
      if (ps === "duck") {
        const b = Math.abs(s2) * 1.2;
        shape([[fx - 8, fy - 6], [fx - 12, fy]], { closed: false, id: 11 }); shape([[fx + 4, fy - 6], [fx + 2 + s2 * 4, fy]], { closed: false, id: 12 });
        shape(circ(fx - 1, fy - 13 - b, 15, 8, 14), { fill: P.accent, id: 13 });
        shape(circ(fx + 17, fy - 19 - b, 9, 9, 14), { fill: P.white, id: 14 });
        dot(fx + 20, fy - 21 - b, 1.3); dot(fx + 23, fy - 21 - b, 1.3);
        pencilAt(fx + 14, fy - 9 - b, 1.45, 26);
        return;
      }
      let bob = 0, legA, legB, armAng = -0.55, back = [fx - 12, fy - 22], tilt = 0, eyes = "dot";
      const hip = () => [fx, fy - 15 - bob];
      if (ps === "run") { bob = Math.abs(s2) * 2.2; legA = [fx + s2 * 10, fy - Math.max(0, Math.cos(ph * 6.283)) * 6]; legB = [fx - s2 * 10, fy - Math.max(0, -Math.cos(ph * 6.283)) * 6]; back = [fx - 11 - s2 * 3, fy - 20 - bob]; armAng = -0.7 + s2 * 0.12; }
      else if (ps === "jump") { legA = [fx + 8, fy - 6]; legB = [fx - 6, fy - 3]; back = [fx - 12, fy - 44]; armAng = -1.15; }
      else if (ps === "hit") { legA = [fx + 12, fy - 2]; legB = [fx - 10, fy - 1]; back = [fx - 15, fy - 40]; tilt = -0.42; eyes = "x"; }
      else { bob = Math.sin(tt * 2.2) * 1.2; legA = [fx + 5, fy]; legB = [fx - 5, fy]; armAng = -0.35 + Math.sin(tt * 1.4) * 0.12; if ((tt % 3.4) < 0.14) eyes = "blink"; }
      ctx.save();
      if (tilt) { ctx.translate(fx * S, (fy - 10) * S); ctx.rotate(tilt); ctx.translate(-fx * S, -(fy - 10) * S); }
      const [hx, hy] = hip();
      shape([[hx - 3, hy], legB], { closed: false, id: 21 }); shape([[hx + 3, hy], legA], { closed: false, id: 22 });
      shape([[fx - 2, fy - 31 - bob], back], { closed: false, id: 23 });
      shape(circ(fx, fy - 26 - bob, 9.5, 12.5, 14), { fill: P.accent, id: 24 });
      shape(circ(fx + 2, fy - 47 - bob, 10, 10, 14), { fill: P.white, id: 25 });
      shape([[fx - 6, fy - 55 - bob], [fx - 1, fy - 60 - bob], [fx + 3, fy - 56 - bob], [fx + 8, fy - 60 - bob]], { closed: false, id: 26 });
      if (eyes === "x") { const e = (x, y) => { shape([[x - 2, y - 2], [x + 2, y + 2]], { closed: false, id: 27 }); shape([[x + 2, y - 2], [x - 2, y + 2]], { closed: false, id: 28 }); }; e(fx + 3, fy - 48); e(fx + 9, fy - 48); }
      else if (eyes === "blink") { shape([[fx + 2, fy - 48 - bob], [fx + 5, fy - 48 - bob]], { closed: false, id: 27 }); shape([[fx + 8, fy - 48 - bob], [fx + 11, fy - 48 - bob]], { closed: false, id: 28 }); }
      else { dot(fx + 4, fy - 48 - bob, 1.4); dot(fx + 9, fy - 48 - bob, 1.4); }
      shape([[fx + 4, fy - 42 - bob], [fx + 7, fy - 41 - bob], [fx + 10, fy - 42 - bob]], { closed: false, id: 29 });
      const hand = [fx + 13, fy - 24 - bob];
      shape([[fx + 4, fy - 31 - bob], hand], { closed: false, id: 30 });
      if (ps !== "hit") pencilAt(hand[0], hand[1], armAng, 30);
      ctx.restore();
      if (ps === "hit") {
        pencilAt(fx + 34, fy - 74, tt * 5, 30);
        for (let i = 0; i < 3; i++) { const a = tt * 3 + i * 2.1, sx = fx - 6 + Math.cos(a) * 16, sy = fy - 66 + Math.sin(a) * 5; shape([[sx, sy - 4], [sx + 1, sy - 1], [sx + 4, sy], [sx + 1, sy + 1], [sx, sy + 4], [sx - 1, sy + 1], [sx - 4, sy], [sx - 1, sy - 1]], { fill: P.yellow, id: 40 + i }); }
      }
    }

    // ---------- obstacles ----------
    function drawObs(o) {
      const x = o.x, by = o.fly ? GY - o.alt : GY, id = o.id * 13;
      if (o.k === "jar") { shape(rect(x + 1, by - 24, 24, 24), { fill: o.c, id }); shape(rect(x - 1, by - 30, 28, 6), { fill: P.white, id: id + 1 }); shape([[x + 20, by - 24], [x + 20, by - 16], [x + 22, by - 13]], { closed: false, id: id + 2 }); }
      else if (o.k === "pencil") { shape(rect(x + 1, by - 36, 10, 36), { fill: P.yellow, id }); shape([[x + 1, by - 36], [x + 11, by - 36], [x + 6, by - 46]], { fill: P.wood, id: id + 1 }); shape(rect(x + 1, by - 7, 10, 7), { fill: P.pink, id: id + 2 }); dot(x + 6, by - 45, 1.2); }
      else if (o.k === "eraser") { shape([[x + 5, by - 20], [x + 36, by - 20], [x + 31, by], [x, by]], { fill: P.pink, id }); shape([[x + 15, by - 20], [x + 26, by - 20], [x + 22, by], [x + 11, by]], { fill: P.teal, id: id + 1 }); }
      else if (o.k === "clay") { const sq = 1 + Math.sin(t * 6 + o.id) * 0.06; const pts = circ(x + 17, by - 12 * sq, 17 / sq, 12 * sq, 12, 0.22, o.id); shape(pts.map(([px, py]) => [px, Math.min(py, by)]), { fill: P.coral, id }); dot(x + 12, by - 16, 1.4); dot(x + 20, by - 16, 1.4); }
      else if (o.k === "can") { shape(rect(x + 1, by - 32, 16, 32), { fill: P.teal, id }); shape(rect(x + 4, by - 38, 10, 6), { fill: P.white, id: id + 1 }); shape(rect(x + 12, by - 41, 5, 3), { id: id + 2 }); shape([[x + 1, by - 22], [x + 17, by - 22]], { closed: false, id: id + 3 }); }
      else if (o.k === "plane") { const y = by - 16 + Math.sin(t * 4 + o.id) * 2; shape([[x, y + 8], [x + 36, y], [x + 14, y + 16]], { fill: P.white, id }); shape([[x + 36, y], [x + 12, y + 9]], { closed: false, id: id + 1 }); }
      else if (o.k === "brush") { const y = by - 12; shape(rect(x + 16, y + 3, 34, 6), { fill: P.wood, id }); shape(rect(x + 9, y + 1, 8, 10), { fill: P.white, id: id + 1 }); shape([[x, y + 6], [x + 9, y + 1], [x + 9, y + 11]], { fill: o.c, id: id + 2 }); }
      else if (o.k === "moth") { const y = by - 22 + Math.sin(t * 3 + o.id) * 3, f = 0.45 + Math.abs(Math.sin(t * 16 + o.id)) * 0.55; shape([[x + 15, y + 11], [x + 1, y + 11 - 11 * f], [x + 4, y + 18]], { fill: P.lav, id }); shape([[x + 15, y + 11], [x + 29, y + 11 - 11 * f], [x + 26, y + 18]], { fill: P.lav, id: id + 1 }); shape(circ(x + 15, y + 12, 3, 7, 10), { fill: P.ink, id: id + 2 }); shape([[x + 14, y + 5], [x + 11, y]], { closed: false, id: id + 3 }); shape([[x + 16, y + 5], [x + 19, y]], { closed: false, id: id + 4 }); }
      label(LABEL[o.k] + (o.fly ? " · fly" : ""), x + o.w / 2, (o.fly ? by - o.h : by - o.h) - 9);
    }

    // ---------- world ----------
    function drawWorld() {
      const W = WW;
      if (L.paint > 0.01) {
        const g = ctx.createLinearGradient(0, 0, 0, GY * S); g.addColorStop(0, P.tint); g.addColorStop(1, P.white);
        ctx.globalAlpha = L.paint * 0.9; ctx.fillStyle = g; ctx.fillRect(0, 0, W * S, GY * S);
        ctx.globalAlpha = L.paint * 0.8; ctx.fillStyle = P.soil; ctx.fillRect(0, GY * S, W * S, (WH - GY) * S); ctx.globalAlpha = 1;
      }
      const sunY = Math.max(34, GY - 170);
      shape(circ(W - 64, sunY, 17, 17, 16), { fill: P.yellow, id: 900, alpha: 0.85 });
      for (const c of clouds) {
        let x = ((c.x - dist * 0.06) % 1450 + 1450) % 1450 - 100;
        if (x > W + 60) continue;
        const y = Math.max(26, GY - 175) + c.y * Math.min(70, GY * 0.3);
        const pts = []; for (let i = 0; i <= 16; i++) { const a = Math.PI + (i / 16) * Math.PI, k = 1 + Math.abs(Math.sin(i * 1.7 + c.id)) * 0.35; pts.push([x + Math.cos(a) * c.r * 2 * k, y + Math.sin(a) * c.r * k]); }
        shape(pts, { fill: P.white, id: c.id, alpha: 0.75 });
      }
      const co = (dist * 0.18) % 1200;
      for (let rep = 0; rep < 2; rep++) for (const b of city) {
        const x = b.x - co + rep * 1200; if (x > W || x + b.w < 0) continue;
        const top = GY - b.h; shape(rect(x, top, b.w, b.h), { fill: P.lav, id: 700 + (b.x | 0), alpha: 0.5 });
        if (b.top === "dome") shape(circ(x + b.w / 2, top, b.w * 0.32, b.w * 0.3, 10).filter(p => p[1] <= top + 0.1), { fill: P.lav, id: 701 + (b.x | 0), alpha: 0.5 });
        if (b.top === "tank") shape(rect(x + b.w * 0.25, top - 10, b.w * 0.4, 10), { fill: P.white, id: 702 + (b.x | 0), alpha: 0.5 });
      }
      const po = (dist * 0.5) % 800;
      for (let rep = 0; rep < 2; rep++) for (const p of props) {
        const x = p.x - po + rep * 800; if (x > W + 40 || x < -40) continue;
        if (p.k === "easel") { shape([[x, GY], [x + 12, GY - 38], [x + 24, GY]], { closed: false, id: p.id, alpha: 0.7 }); shape(rect(x + 2, GY - 34, 20, 15), { fill: p.c, id: p.id + 1, alpha: 0.7 }); }
        else if (p.k === "plant") { shape([[x, GY], [x + 1, GY - 22]], { closed: false, id: p.id, alpha: 0.7 }); shape(circ(x - 5, GY - 16, 6, 3, 8), { fill: P.teal, id: p.id + 1, alpha: 0.7 }); shape(circ(x + 7, GY - 22, 6, 3, 8), { fill: P.teal, id: p.id + 2, alpha: 0.7 }); }
        else { shape([[x, GY], [x - 3, GY - 9]], { closed: false, id: p.id, alpha: 0.6 }); shape([[x + 3, GY], [x + 4, GY - 11]], { closed: false, id: p.id + 1, alpha: 0.6 }); shape([[x + 6, GY], [x + 10, GY - 8]], { closed: false, id: p.id + 2, alpha: 0.6 }); }
      }
      const gpts = []; const off = dist % 40; for (let x = -off; x <= W + 40; x += 40) gpts.push([x, GY]);
      shape(gpts, { closed: false, id: 800 + Math.floor(dist / 40), lw: 1.2 });
      const pb = dist % 300;
      for (let rep = 0; rep < Math.ceil(W / 300) + 1; rep++) for (const p of pebbles) { const x = p.x - pb + rep * 300; if (x > W || x < -12) continue; shape([[x, GY + p.y], [x + p.w, GY + p.y]], { closed: false, id: 850 + (p.x | 0), alpha: 0.55 }); }
      if (labels) { label("bg · far layer", 90, Math.max(30, GY - 120)); label("bg · mid layer", W * 0.55, GY - 46); label("ground", W * 0.75, GY + 18); }
    }

    function render() {
      dirty = false;
      L = { ink: sm(STAGES.ink[0], STAGES.ink[1], score), paint: sm(STAGES.paint[0], STAGES.paint[1], score) };
      boil = L.ink < 0.98 ? Math.floor(t * 8) % 3 : 0;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, WW * S, WH * S);
      ctx.save();
      if (shake > 0) ctx.translate((Math.random() - 0.5) * shake * 16 * S, (Math.random() - 0.5) * shake * 10 * S);
      drawWorld();
      for (const o of obs) drawObs(o);
      if (theme === "frame" && (mode === "play" || mode === "paused")) {
        for (let i = 1; i <= 3; i++) { const h = hist[hist.length - 1 - i * 2]; if (!h) continue; GHOST = 0.32 / i; drawChar(CX - h.dx, GY - h.alt, h.pose, h.ph, t); }
        GHOST = 0;
      }
      drawChar(CX, GY - alt, pose, phase, t);
      label("character · " + (pose === "hit" ? "hit pose" : pose === "run" ? "run cycle" : pose === "idle" ? "idle loop" : pose), CX, GY - alt - 76);
      for (const p of parts) {
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life)); ctx.fillStyle = p.c;
        if (p.ring) { ctx.strokeStyle = P.pencil; ctx.lineWidth = 1.2 * S; ctx.beginPath(); ctx.arc(p.x * S, p.y * S, p.r * S, 0, 6.283); ctx.stroke(); }
        else { ctx.save(); ctx.translate(p.x * S, p.y * S); ctx.rotate(p.rot); ctx.beginPath(); ctx.ellipse(0, 0, p.r * S, p.r * 0.62 * S, 0, 0, 6.283); ctx.fill(); ctx.restore(); }
      }
      ctx.globalAlpha = 1; ctx.restore();
    }

    // ---------- simulation ----------
    function spawn() {
      const flyChance = score < 160 ? 0 : Math.min(0.36, 0.2 + score / 4000);
      let o;
      if (R() < flyChance) { const f = FLY[(R() * FLY.length) | 0]; o = { ...f, fly: true, alt: R() < 0.62 ? 34 : 64 }; }
      else { const g = GROUND[(R() * GROUND.length) | 0]; o = { ...g, fly: false, alt: 0 }; }
      o.id = oid++; o.x = WW + 24; o.c = PAINTS[(R() * PAINTS.length) | 0];
      obs.push(o);
      if (!o.fly && score > 420 && R() < 0.22) { const g = GROUND[(R() * 2) | 0]; obs.push({ ...g, fly: false, alt: 0, id: oid++, x: o.x + o.w + 6, c: PAINTS[(R() * 5) | 0] }); }
      const minGap = 200 + speed * 0.62;
      nextSpawn = dist + minGap + R() * minGap * 0.9 + (o.fly ? 60 : 0);
    }
    const playerBox = () => (duckHeld && grounded) ? [CX - 14, GY - 26, 40, 26] : [CX - 9, GY - alt - 58, 22, 58];
    const obsBox = (o) => o.fly ? [o.x, GY - o.alt - o.h, o.w, o.h] : [o.x, GY - o.h, o.w, o.h];
    const overlap = (a, b, k) => a[0] + k < b[0] + b[2] - k && a[0] + a[2] - k > b[0] + k && a[1] + k < b[1] + b[3] - k && a[1] + a[3] - k > b[1] + k;
    function ai() {
      const o = obs.find((q) => q.x + q.w > CX - 10);
      if (!o) { duckHeld = false; return; }
      const d = o.x - (CX + 12);
      if (o.fly && o.alt < 50) { duckHeld = d < speed * 0.32 && d > -o.w - 30; return; }
      duckHeld = false;
      if (!o.fly && grounded && d < speed * 0.16 + 6 && d > -4) doJump();
    }
    function doJump() { if (grounded) { vy = JV; grounded = false; jumpBuf = 0; cb("onSound", "jump"); } else jumpBuf = 0.12; }
    function step(dt) {
      t += dt;
      if (shake > 0) shake = Math.max(0, shake - dt);
      for (const p of parts) { p.vy += (p.ring ? 0 : 900) * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.life -= dt * (p.ring ? 2.2 : 0.55); if (p.ring) p.r += dt * 26; }
      parts = parts.filter((p) => p.life > 0 && p.y < WH + 20);
      if (mode !== "play") { if (mode === "idle") pose = "idle"; return; }
      speed = Math.min(D.max, speed + D.a * dt); dist += speed * dt; score += speed * dt / 12;
      const st = stageOf(score); if (st !== lastStage) { lastStage = st; cb("onStage", st); }
      const mile = Math.floor(score / 100); if (mile > lastMile) { lastMile = mile; cb("onSound", "score"); }
      if (autopilot) ai();
      if (jumpBuf > 0) { jumpBuf -= dt; if (grounded) doJump(); }
      if (!grounded) { vy -= G * (duckHeld ? 2.6 : 1) * dt; alt += vy * dt; if (alt <= 0) { alt = 0; vy = 0; grounded = true; } }
      pose = !grounded ? "jump" : duckHeld ? "duck" : "run";
      phase = (phase + dt * speed / 70) % 1;
      histT += dt; if (histT > 0.045) { histT = 0; hist.forEach((h) => (h.dx += speed * 0.045)); hist.push({ alt, pose, ph: phase, dx: 0 }); if (hist.length > 8) hist.shift(); }
      for (const o of obs) o.x -= speed * dt;
      obs = obs.filter((o) => o.x + o.w > -40);
      if (dist >= nextSpawn) spawn();
      const pb = playerBox();
      for (const o of obs) if (overlap(pb, obsBox(o), 3)) { if (priming) { obs = obs.filter((q) => q !== o); break; } hit(o.k); break; }
      cb("onScore", score);
    }
    function hit(k) {
      mode = "over"; pose = "hit"; hitType = k; shake = 0.28; duckHeld = false;
      for (let i = 0; i < 7; i++) parts.push({ ring: true, x: CX + 10 + (Math.random() - 0.5) * 20, y: GY - alt - 20 + (Math.random() - 0.5) * 30, vx: (Math.random() - 0.5) * 60, vy: (Math.random() - 0.5) * 40, r: 3, rot: 0, vr: 0, life: 1, c: "" });
      cb("onSound", "hit"); cb("onHit", k, score); kick();
    }
    function loop(now) {
      raf = 0;
      if (!running) return;
      const dt = Math.min(1 / 30, last ? (now - last) / 1000 : 1 / 60); last = now;
      if (mode !== "paused") step(dt);
      render();
      if (mode === "play" || mode === "idle" || parts.length || shake > 0 || mode === "over") raf = requestAnimationFrame(loop);
      else last = 0;
    }
    function kick() { if (running && !raf) { last = 0; raf = requestAnimationFrame(loop); } }

    const api = {
      start() { api.reset(); mode = "play"; pose = "run"; kick(); },
      reset() { D = DIFF[opts.difficulty] || DIFF.normal; speed = D.v; dist = 0; score = 0; obs = []; nextSpawn = 320; alt = 0; vy = 0; grounded = true; duckHeld = false; pose = "idle"; mode = "idle"; hitType = null; parts = []; hist = []; lastStage = "sketch"; lastMile = 0; R = rng(opts.seed || 7); dirty = true; kick(); },
      pause() { if (mode === "play") { mode = "paused"; render(); } },
      resume() { if (mode === "paused") { mode = "play"; kick(); } },
      jump() { if (mode === "play") doJump(); },
      duck(on) { duckHeld = !!on; },
      prime(target, demoDist) {
        api.reset(); mode = "play"; priming = true; autopilot = true;
        const st = 1 / 60; let n = 0;
        while (score < target && n++ < 40000) step(st);
        priming = false; autopilot = false; lastStage = stageOf(score); lastMile = Math.floor(score / 100);
        mode = "paused"; render();
      },
      forceHit(k) {
        const g = GROUND.find((q) => q.k === k) || FLY.find((q) => q.k === k) || GROUND[0];
        obs = obs.filter((o) => o.x > CX + 80 || o.x + o.w < CX - 60);
        obs.push({ ...g, fly: !!g.fly && false, alt: 0, id: oid++, x: CX + 6, c: P.coral });
        alt = 0; grounded = true; hit(g.k); shake = 0; parts = parts.filter((p) => !p.ring);
      },
      celebrate() { for (let i = 0; i < 46; i++) { const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2, v = 260 + Math.random() * 300; parts.push({ x: CX + 10, y: GY - 60, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 3 + Math.random() * 4, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 10, life: 1.6 + Math.random(), c: PAINTS[i % 5] }); } kick(); },
      setAutopilot(b) { autopilot = !!b; },
      setRunning(b) { running = !!b; if (running) kick(); },
      setLabels(b) { labels = !!b; render(); },
      setDifficulty(d) { opts.difficulty = d; },
      get score() { return score; }, get mode() { return mode; }, get hitType() { return hitType; }, get stage() { return stageOf(score); },
      destroy() { running = false; if (raf) cancelAnimationFrame(raf); if (ro) ro.disconnect(); }
    };
    resize(); api.reset();
    return api;
  }
  window.YurixRunner = { create, sfx, stageOf, STAGES, LABEL };
})();
