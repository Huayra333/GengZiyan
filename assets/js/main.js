/* ══════════════════════════════════════════════════════
   MAIN — interactions + generative placeholders
   ══════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const COARSE  = window.matchMedia("(pointer: coarse)").matches;

  // default to English on first visit; remembers the visitor's choice after that
  let lang = localStorage.getItem("lang") || "en";

  const t = (key) => (I18N[lang] && I18N[lang][key]) || (I18N.en[key] || key);
  const pick = (obj) => (obj && (obj[lang] || obj.en)) || "";

  /* ════════════════════════════════════════
     1. GENERATIVE ART
     ════════════════════════════════════════ */

  /* Petronas palette: teal, silver, carbon black */
  const TONES = {
    ember:  { a: "#04090a", b: "#0a2325", glow: "#00a19b", light: "#e4f7f5", deep: "#020607" },
    steel:  { a: "#060809", b: "#141c1f", glow: "#6f8ba6", light: "#e3eef4", deep: "#030506" },
    bone:   { a: "#0a0b0c", b: "#1c2225", glow: "#c8ccce", light: "#f5f8f8", deep: "#050708" },
    cyan:   { a: "#03090a", b: "#0a2022", glow: "#2fd3c9", light: "#e2fffc", deep: "#020607" },
    violet: { a: "#04080b", b: "#0b1e2b", glow: "#1f7f96", light: "#ddf1f7", deep: "#020508" }
  };

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let x = Math.imul(a ^ (a >>> 15), 1 | a);
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* cached grain tile + per-context pattern */
  let grainTile = null;
  const grainCache = new WeakMap();
  function getGrain(ctx) {
    if (grainCache.has(ctx)) return grainCache.get(ctx);
    if (!grainTile) {
      const c = document.createElement("canvas");
      c.width = c.height = 240;
      const g = c.getContext("2d");
      const img = g.createImageData(240, 240);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 128 + (Math.random() - 0.5) * 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 26;
      }
      g.putImageData(img, 0, 0);
      grainTile = c;
    }
    const pat = ctx.createPattern(grainTile, "repeat");
    grainCache.set(ctx, pat);
    return pat;
  }

  function baseFill(ctx, W, H, tone, rnd, warmX) {
    const g = ctx.createLinearGradient(0, 0, W * 0.35, H);
    g.addColorStop(0, tone.a);
    g.addColorStop(0.55, tone.b);
    g.addColorStop(1, tone.deep);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // coloured bloom
    const cx = W * (warmX || 0.5), cy = H * 0.38;
    const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.75);
    rg.addColorStop(0, hexA(tone.glow, 0.44));
    rg.addColorStop(0.40, hexA(tone.glow, 0.14));
    rg.addColorStop(1, hexA(tone.glow, 0));
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, W, H);
  }

  function hexA(hex, alpha) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
  }

  function vignette(ctx, W, H) {
    const g = ctx.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.22, W / 2, H * 0.5, Math.max(W, H) * 0.78);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.60)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function doGrain(ctx, W, H) {
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.globalCompositeOperation = "overlay";
    ctx.fillStyle = getGrain(ctx);
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  /* ── style: flow field ── */
  function artFlow(ctx, W, H, tone, rnd, seed) {
    baseFill(ctx, W, H, tone, rnd, 0.35 + rnd() * 0.4);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const N = Math.round((W * H) / 2600);
    for (let i = 0; i < N; i++) {
      let x = rnd() * W, y = rnd() * H;
      const steps = 6 + (rnd() * 14) | 0;
      const light = rnd() > 0.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let s = 0; s < steps; s++) {
        const th = Math.sin(x * 0.0042 + seed * 0.7) * 2.1 +
                   Math.cos(y * 0.0035 - seed * 0.3) * 1.6 +
                   Math.sin((x + y) * 0.0016) * 1.2;
        x += Math.cos(th) * 9;
        y += Math.sin(th) * 9;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = hexA(light ? tone.light : tone.glow, 0.055 + rnd() * 0.18);
      ctx.lineWidth = 0.4 + rnd() * 1.6;
      ctx.stroke();
    }
    // one strong streak
    ctx.beginPath();
    const sy = H * (0.3 + rnd() * 0.4), amp = H * 0.14;
    ctx.moveTo(-40, sy);
    for (let x = 0; x <= W + 40; x += 18) {
      ctx.lineTo(x, sy + Math.sin(x * 0.006 + seed) * amp * (0.4 + rnd() * 0.1));
    }
    ctx.strokeStyle = hexA(tone.light, 0.55);
    ctx.lineWidth = 1.6;
    ctx.filter = "blur(2px)";
    ctx.stroke();
    ctx.filter = "none";
    ctx.restore();
    vignette(ctx, W, H);
    doGrain(ctx, W, H);
  }

  /* ── style: dust / bokeh (photographic) ── */
  function artDust(ctx, W, H, tone, rnd, seed) {
    baseFill(ctx, W, H, tone, rnd, 0.3 + rnd() * 0.5);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 42; i++) {
      const r = (0.02 + Math.pow(rnd(), 2) * 0.16) * Math.min(W, H);
      const x = rnd() * W, y = rnd() * H;
      const c = rnd() > 0.62 ? tone.glow : tone.light;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, hexA(c, 0.24 + rnd() * 0.34));
      g.addColorStop(0.55, hexA(c, 0.05));
      g.addColorStop(1, hexA(c, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    }
    // dust specks
    for (let i = 0; i < 300; i++) {
      ctx.fillStyle = hexA(tone.light, 0.08 + rnd() * 0.38);
      ctx.fillRect(rnd() * W, rnd() * H, 0.9, 0.9);
    }
    ctx.restore();
    vignette(ctx, W, H);
    doGrain(ctx, W, H);
  }

  /* ── style: grid / architecture ── */
  function artGrid(ctx, W, H, tone, rnd, seed) {
    baseFill(ctx, W, H, tone, rnd, 0.5);
    ctx.save();
    const vx = W * (0.2 + rnd() * 0.6), vy = H * 0.42;
    // radiating verticals
    for (let i = -14; i <= 14; i++) {
      ctx.beginPath();
      ctx.moveTo(vx + i * 22, vy);
      ctx.lineTo(vx + i * 190, H * 1.3);
      ctx.strokeStyle = hexA(tone.light, 0.10 + rnd() * 0.20);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // horizontals
    for (let i = 0; i < 12; i++) {
      const y = vy + Math.pow(i / 12, 2.2) * (H - vy) * 1.25;
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(W, y);
      ctx.strokeStyle = hexA(tone.light, 0.08 + rnd() * 0.16);
      ctx.stroke();
    }
    // solid block
    const bw = W * (0.18 + rnd() * 0.3), bh = H * (0.25 + rnd() * 0.5);
    ctx.fillStyle = hexA(tone.deep, 0.55);
    ctx.fillRect(W * (0.05 + rnd() * 0.5), H * 0.1, bw, bh);
    ctx.strokeStyle = hexA(tone.glow, 0.72);
    ctx.lineWidth = 1.4;
    ctx.strokeRect(W * 0.05, H * 0.1, bw, bh);
    ctx.restore();
    vignette(ctx, W, H);
    doGrain(ctx, W, H);
  }

  /* ── style: moiré ── */
  function artMoire(ctx, W, H, tone, rnd, seed) {
    baseFill(ctx, W, H, tone, rnd, 0.6);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const cx = W * (0.3 + rnd() * 0.4), cy = H * (0.3 + rnd() * 0.4);
    for (let i = 0; i < 90; i++) {
      const r = i * (Math.min(W, H) / 62);
      ctx.beginPath();
      ctx.arc(cx + Math.sin(i * 0.3) * 6, cy + Math.cos(i * 0.24) * 6, r, 0, 7);
      ctx.strokeStyle = hexA(i % 4 === 0 ? tone.light : tone.glow, 0.085);
      ctx.lineWidth = 1 + (i % 5) * 0.4;
      ctx.stroke();
    }
    // hatch
    ctx.lineWidth = 0.6;
    for (let i = 0; i < 60; i++) {
      const y = (i / 60) * H * 1.6 - H * 0.3;
      ctx.beginPath();
      ctx.moveTo(-W * 0.2, y);
      ctx.lineTo(W * 1.2, y - H * 0.55);
      ctx.strokeStyle = hexA(tone.light, 0.06);
      ctx.stroke();
    }
    ctx.restore();
    vignette(ctx, W, H);
    doGrain(ctx, W, H);
  }

  /* ── style: bloom (synthetic) ── */
  function artBloom(ctx, W, H, tone, rnd, seed) {
    baseFill(ctx, W, H, tone, rnd, 0.5);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const blobs = 5 + ((rnd() * 4) | 0);
    for (let i = 0; i < blobs; i++) {
      const x = W * (0.15 + rnd() * 0.7), y = H * (0.15 + rnd() * 0.7);
      const r = Math.min(W, H) * (0.1 + rnd() * 0.3);
      const g = ctx.createRadialGradient(x, y, r * 0.1, x, y, r);
      const c = rnd() > 0.5 ? tone.glow : tone.light;
      g.addColorStop(0, hexA(c, 0.46));
      g.addColorStop(0.4, hexA(c, 0.16));
      g.addColorStop(1, hexA(c, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    }
    // filament curves
    for (let i = 0; i < 26; i++) {
      const x0 = rnd() * W, y0 = rnd() * H;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.bezierCurveTo(
        x0 + (rnd() - 0.5) * W * 0.9, y0 + (rnd() - 0.5) * H * 0.9,
        x0 + (rnd() - 0.5) * W * 0.9, y0 + (rnd() - 0.5) * H * 0.9,
        x0 + (rnd() - 0.5) * W * 0.7, y0 + (rnd() - 0.5) * H * 0.7
      );
      ctx.strokeStyle = hexA(tone.light, 0.08 + rnd() * 0.19);
      ctx.lineWidth = 0.5 + rnd() * 1.4;
      ctx.filter = "blur(1px)";
      ctx.stroke();
      ctx.filter = "none";
    }
    ctx.restore();
    vignette(ctx, W, H);
    doGrain(ctx, W, H);
  }

  /* ── portrait: backlit silhouette (for the about photo) ── */
  function artPortrait(ctx, W, H, tone) {
    const g = ctx.createLinearGradient(W * 0.05, 0, W * 0.95, H);
    g.addColorStop(0, "#191614");
    g.addColorStop(0.38, "#2a2521");
    g.addColorStop(0.68, "#151315");
    g.addColorStop(1, "#0a0a0c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // light behind the subject
    const wx = W * 0.70, wy = H * 0.16;
    const rg = ctx.createRadialGradient(wx, wy, 0, wx, wy, W * 0.80);
    rg.addColorStop(0, hexA(tone.light, 0.44));
    rg.addColorStop(0.30, hexA(tone.glow, 0.17));
    rg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, W, H);

    const cx = W * 0.5;
    const headY = H * 0.335;
    const headRx = W * 0.168;
    const headRy = W * 0.212;
    const tilt = -0.05;

    // torso
    ctx.save();
    ctx.filter = "blur(5px)";
    ctx.beginPath();
    ctx.moveTo(cx - W * 0.66, H * 1.06);
    ctx.bezierCurveTo(cx - W * 0.60, H * 0.76, cx - W * 0.34, H * 0.615, cx - W * 0.135, H * 0.575);
    ctx.lineTo(cx + W * 0.135, H * 0.575);
    ctx.bezierCurveTo(cx + W * 0.34, H * 0.615, cx + W * 0.60, H * 0.76, cx + W * 0.66, H * 1.06);
    ctx.closePath();
    const tg = ctx.createLinearGradient(cx - W * 0.5, H * 0.6, cx + W * 0.5, H);
    tg.addColorStop(0, "#0b0a0c");
    tg.addColorStop(0.5, "#050506");
    tg.addColorStop(1, "#030304");
    ctx.fillStyle = tg;
    ctx.fill();

    // neck
    ctx.beginPath();
    ctx.moveTo(cx - W * 0.075, headY + headRy * 0.58);
    ctx.lineTo(cx + W * 0.075, headY + headRy * 0.58);
    ctx.lineTo(cx + W * 0.105, H * 0.612);
    ctx.lineTo(cx - W * 0.105, H * 0.612);
    ctx.closePath();
    ctx.fillStyle = "#060506";
    ctx.fill();

    // head + hair
    ctx.save();
    ctx.translate(cx, headY);
    ctx.rotate(tilt);
    ctx.beginPath();
    ctx.ellipse(0, 0, headRx, headRy, 0, 0, 7);
    ctx.fillStyle = "#050405";
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-headRx * 0.05, -headRy * 0.18, headRx * 1.06, headRy * 0.90, 0, Math.PI * 0.98, Math.PI * 2.02);
    ctx.fillStyle = "#0a090b";
    ctx.fill();
    ctx.restore();
    ctx.filter = "none";
    ctx.restore();

    // rim light
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.filter = "blur(9px)";
    ctx.beginPath();
    ctx.ellipse(cx, headY, headRx, headRy, tilt, -1.32, 0.52);
    ctx.strokeStyle = hexA(tone.light, 0.80);
    ctx.lineWidth = 7;
    ctx.stroke();

    ctx.filter = "blur(2px)";
    ctx.beginPath();
    ctx.ellipse(cx, headY, headRx, headRy, tilt, -1.05, 0.32);
    ctx.strokeStyle = "rgba(255,246,236,0.92)";
    ctx.lineWidth = 2.2;
    ctx.stroke();

    ctx.filter = "blur(11px)";
    ctx.beginPath();
    ctx.moveTo(cx + W * 0.135, H * 0.578);
    ctx.bezierCurveTo(cx + W * 0.34, H * 0.618, cx + W * 0.60, H * 0.76, cx + W * 0.66, H * 1.06);
    ctx.strokeStyle = hexA(tone.glow, 0.46);
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.filter = "none";
    ctx.restore();

    // atmosphere
    const hz = ctx.createRadialGradient(wx, wy, W * 0.1, wx, wy, W * 1.0);
    hz.addColorStop(0, hexA(tone.glow, 0.10));
    hz.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = hz;
    ctx.fillRect(0, 0, W, H);

    vignette(ctx, W, H);
    doGrain(ctx, W, H);
  }


  /* ── cinema: backlit hero composition ── */
  function artCinema(ctx, W, H, tone, rnd, seed) {
    // deep base
    let g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#03080a");
    g.addColorStop(0.55, "#05100f");
    g.addColorStop(1, "#071614");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    const lx = W * 0.82, ly = H * 0.17;

    // light core
    let rg = ctx.createRadialGradient(lx, ly, 0, lx, ly, W * 0.66);
    rg.addColorStop(0, "rgba(232,251,249,0.66)");
    rg.addColorStop(0.06, hexA(tone.glow, 0.42));
    rg.addColorStop(0.30, hexA(tone.glow, 0.16));
    rg.addColorStop(0.62, hexA(tone.glow, 0.05));
    rg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, W, H);

    // tight core — a crisp studio highlight at the source
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const core = ctx.createRadialGradient(lx, ly, 0, lx, ly, W * 0.10);
    core.addColorStop(0, "rgba(236,255,253,0.42)");
    core.addColorStop(0.35, "rgba(120,235,226,0.20)");
    core.addColorStop(1, "rgba(0,161,155,0)");
    ctx.fillStyle = core;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // light beam
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const bg = ctx.createLinearGradient(lx, ly, W * 0.2, H);
    bg.addColorStop(0, "rgba(198,240,235,0.30)");
    bg.addColorStop(0.42, hexA(tone.glow, 0.11));
    bg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.filter = "blur(42px)";
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(lx - W * 0.055, ly + H * 0.03);
    ctx.lineTo(W * 0.00, H * 1.18);
    ctx.lineTo(W * 0.74, H * 1.18);
    ctx.closePath();
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.filter = "none";
    ctx.restore();

    // bokeh
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 30; i++) {
      const r = (0.012 + Math.pow(rnd(), 2.4) * 0.075) * Math.max(W, H);
      const x = W * (0.45 + rnd() * 0.62);
      const y = H * (rnd() * 1.05);
      const c = rnd() > 0.55 ? "#d8f4f1" : tone.glow;
      const bgg = ctx.createRadialGradient(x, y, 0, x, y, r);
      bgg.addColorStop(0, hexA(c, 0.10 + rnd() * 0.18));
      bgg.addColorStop(0.6, hexA(c, 0.035));
      bgg.addColorStop(1, hexA(c, 0));
      ctx.fillStyle = bgg;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    }
    ctx.restore();

    // long trails drifting from the light
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.filter = "blur(1.4px)";
    for (let i = 0; i < 54; i++) {
      let x = lx + (rnd() - 0.5) * W * 0.3;
      let y = ly + (rnd() - 0.5) * H * 0.35;
      ctx.beginPath();
      ctx.moveTo(x, y);
      const len = 5 + ((rnd() * 12) | 0);
      for (let s = 0; s < len; s++) {
        const th = Math.PI * 0.72 + Math.sin(y * 0.006 + seed) * 0.5 + (rnd() - 0.5) * 0.25;
        x -= Math.cos(th) * 22;
        y += Math.sin(th) * 22;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = hexA(rnd() > 0.4 ? "#e6fbf8" : tone.glow, 0.07 + rnd() * 0.16);
      ctx.lineWidth = 0.7 + rnd() * 2;
      ctx.stroke();
    }
    ctx.restore();

    // livery streaks — thin teal and silver lines across the dark side
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 4; i++) {
      const y0 = H * (0.20 + i * 0.13);
      ctx.beginPath();
      ctx.moveTo(W * 1.02, y0);
      ctx.bezierCurveTo(W * 0.80, y0 + H * 0.05, W * 0.66, y0 + H * 0.16, W * 0.46, y0 + H * 0.20);
      ctx.strokeStyle = i === 1
        ? "rgba(0,161,155,0.34)"
        : "rgba(200,204,206,0.10)";
      ctx.lineWidth = i === 1 ? 1.8 : 0.8;
      ctx.filter = "blur(0.8px)";
      ctx.stroke();
    }
    ctx.restore();

    // protect the left column where the name sits
    const dg = ctx.createLinearGradient(0, 0, W * 0.68, 0);
    dg.addColorStop(0, "rgba(4,7,8,0.95)");
    dg.addColorStop(0.55, "rgba(4,7,8,0.55)");
    dg.addColorStop(1, "rgba(4,7,8,0)");
    ctx.fillStyle = dg;
    ctx.fillRect(0, 0, W, H);

    // bottom falloff
    const vg = ctx.createLinearGradient(0, H * 0.62, 0, H);
    vg.addColorStop(0, "rgba(7,9,10,0)");
    vg.addColorStop(1, "rgba(7,9,10,0.9)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    vignette(ctx, W, H);
    doGrain(ctx, W, H);
  }

  function renderArt(canvas) {
    const seed = parseInt(canvas.dataset.seed || "1", 10);
    const style = canvas.dataset.art || "flow";
    const toneName = canvas.dataset.tone || "bone";
    const mode = canvas.dataset.mode || "";
    const ratio = parseFloat(canvas.dataset.ar || "0") || 0;

    const W = 1280;
    let H = ratio ? Math.round(W / ratio) : 960;
    if (mode === "hero") H = 860;
    if (mode === "portrait") H = Math.round(W * 1.28);
    if (mode === "feature") H = Math.round(W * 1.06);
    H = Math.max(400, Math.min(H, 2200));

    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    const rnd = mulberry32(seed);
    const tone = TONES[toneName] || TONES.bone;

    if (mode === "portrait") {
      artPortrait(ctx, W, H, tone);
      return;
    }

    if (mode === "hero") {
      artCinema(ctx, W, H, tone, rnd, seed);
      return;
    }

    switch (style) {
      case "grid":  artGrid(ctx, W, H, tone, rnd, seed); break;
      case "moire": artMoire(ctx, W, H, tone, rnd, seed); break;
      case "dust":  artDust(ctx, W, H, tone, rnd, seed); break;
      case "bloom": artBloom(ctx, W, H, tone, rnd, seed); break;
      default:      artFlow(ctx, W, H, tone, rnd, seed);
    }
  }

  /* ════════════════════════════════════════
     2. MEDIA ELEMENT FACTORY
     ════════════════════════════════════════ */
  function makeMedia(item, extraClass) {
    const src = item.poster || item.img;
    if (src) {
      const img = document.createElement("img");
      img.className = "art " + (extraClass || "");
      img.src = src;
      img.alt = pick(item.title) || "";
      img.loading = "lazy";
      img.addEventListener("error", () => {
        const cv = document.createElement("canvas");
        cv.className = "art " + (extraClass || "");
        cv.dataset.seed = item.seed;
        cv.dataset.art = item.art || "flow";
        cv.dataset.tone = item.tone || "bone";
        cv.dataset.ar = item.ar || "";
        img.replaceWith(cv);
        renderArt(cv);
      });
      return img;
    }
    const cv = document.createElement("canvas");
    cv.className = "art " + (extraClass || "");
    cv.dataset.seed = item.seed;
    cv.dataset.art = item.art || "flow";
    cv.dataset.tone = item.tone || "bone";
    cv.dataset.ar = item.ar || "";
    renderArt(cv);
    return cv;
  }

  /* ════════════════════════════════════════
     3. RENDER: WORKS GRID
     ════════════════════════════════════════ */
  const gridEl = $("#worksGrid");
  let activeFilter = "all";
  let renderedOnce = false;

  const TYPE_LABEL = {
    film: { en: "Film", zh: "影像" },
    ai:   { en: "AI", zh: "AI 生成" }
  };

  function renderWorks() {
    if (!gridEl) return;
    gridEl.innerHTML = "";
    let lastGroup = null;
    WORKS.forEach((w, i) => {
      /* a group header once per cluster — "Ⅰ AIGC 创新实践 / Ⅱ 视听叙事 / Ⅲ 商业传播" */
      if (w.group && w.group !== lastGroup) {
        lastGroup = w.group;
        const g = (typeof WORK_GROUPS !== "undefined")
          ? WORK_GROUPS.filter((x) => x.id === w.group)[0] : null;
        if (g) gridEl.appendChild(buildGroupHead(g));
      }

      const card = document.createElement("article");
      card.className = "card" + (w.ai ? " card--ai" : "") + (w.doc ? " card--doc" : "");
      card.style.setProperty("--span", w.span);
      card.dataset.span = String(w.span);
      if (w.ar) card.style.setProperty("--ar", w.ar);
      card.dataset.type = w.type;
      card.dataset.index = i;
      if (!renderedOnce) card.style.animationDelay = (i * 55) + "ms";
      else card.style.animation = "none";

      /* a proposal is a document, not a film: wide paper strip, opens the reader */
      if (w.doc) {
        const cover = document.createElement("div");
        cover.className = "doc-card__cover";
        const covImg = document.createElement("img");
        covImg.src = w.cover;
        covImg.alt = pick(w.title);
        covImg.loading = "lazy";
        cover.appendChild(covImg);

        const body = document.createElement("div");
        body.className = "doc-card__body";
        body.innerHTML =
          `<span class="card__kicker">${pick(w.kicker)}</span>` +
          `<h3 class="card__title">${pick(w.title)}</h3>` +
          `<p class="doc-card__sub">${pick(w.sub)}</p>` +
          `<p class="doc-card__tags">${w.tags.map((tg) => `<span>${pick(tg)}</span>`).join("")}</p>` +
          `<span class="doc-card__meta">${pick(w.note)}</span>`;

        const go = document.createElement("span");
        go.className = "doc-card__go";
        go.innerHTML = `${pick(w.cta)} <i aria-hidden="true">↗</i>`;

        card.append(cover, body, go);
        card.addEventListener("click", (e) => openScript(e));
        gridEl.appendChild(card);
        return;
      }

      const frame = document.createElement("div");
      frame.className = "card__frame";
      frame.appendChild(makeMedia(w));

      // hover preview
      if (w.preview) {
        const vid = document.createElement("video");
        vid.className = "card__video";
        vid.muted = true;
        vid.loop = true;
        vid.playsInline = true;
        vid.preload = "none";
        vid.dataset.src = w.preview;
        frame.appendChild(vid);
        card.addEventListener("mouseenter", () => {
          if (!vid.src) vid.src = vid.dataset.src;
          const p = vid.play();
          if (p && p.catch) p.catch(() => {});
          vid.classList.add("is-on");
        });
        card.addEventListener("mouseleave", () => {
          vid.pause();
          vid.currentTime = 0;
          vid.classList.remove("is-on");
        });
      }

      const badge = document.createElement("span");
      badge.className = "card__badge" + (w.ai ? " card__badge--ai" : "");
      badge.textContent = w.ai ? t("w.aiTag") : pick(TYPE_LABEL[w.type]);
      frame.appendChild(badge);

      /* horror: say it on the poster, before anyone clicks */
      if (w.warn) {
        const warn = document.createElement("span");
        warn.className = "card__warn";
        warn.innerHTML = `<i aria-hidden="true">!</i>${pick(w.warn.chip)}`;
        frame.appendChild(warn);
      }

      const play = document.createElement("span");
      play.className = "card__play";
      play.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

      if (w.full) {
        frame.appendChild(play);
        const dur = document.createElement("span");
        dur.className = "card__dur";
        dur.textContent = w.dur || "";
        frame.appendChild(dur);
      }

      const info = document.createElement("div");
      info.className = "card__info";
      const left = document.createElement("div");

      /* optional strapline above the title, e.g. “a true story, re-staged with AI” */
      if (w.kicker) {
        const kicker = document.createElement("span");
        kicker.className = "card__kicker";
        kicker.textContent = pick(w.kicker);
        left.appendChild(kicker);
      }

      const title = document.createElement("h3");
      title.className = "card__title";
      title.textContent = pick(w.title);
      const sub = document.createElement("span");
      sub.className = "card__sub";
      sub.textContent = pick(w.sub);
      left.append(title, sub);

      if (w.ai) {
        const tech = document.createElement("span");
        tech.className = "card__tech";
        tech.textContent = pick(w.ai.line);
        left.appendChild(tech);

        /* the sentence that separates “directed with a model” from “used a tool” */
        if (w.ai.credit) {
          const credit = document.createElement("span");
          credit.className = "card__credit";
          credit.textContent = pick(w.ai.credit);
          left.appendChild(credit);
        }
      }

      const meta = document.createElement("span");
      meta.className = "card__meta";
      meta.textContent = String(WORKS.length - i).padStart(2, "0");

      info.append(left, meta);
      card.append(frame, info);
      card.addEventListener("click", () => openLightbox(i));
      gridEl.appendChild(card);
    });

    $("#workCount").textContent = String(WORKS.length).padStart(2, "0");

    /* a closing note beside the last card — keeps the final row from hanging */
    if (typeof WORK_NOTE !== "undefined") {
      const note = document.createElement("aside");
      note.className = "grid__note";
      note.dataset.type = WORK_NOTE.type;
      note.innerHTML =
        `<span class="grid__note-k">${pick(WORK_NOTE.k)}</span>` +
        `<h3 class="grid__note-t">${pick(WORK_NOTE.t)}</h3>` +
        `<p class="grid__note-d">${pick(WORK_NOTE.d)}</p>` +
        `<p class="grid__note-tags">${WORK_NOTE.tags.map((x) => `<span>${pick(x)}</span>`).join("")}</p>`;
      gridEl.appendChild(note);
    }

    // keep the filter counters honest
    const counts = { all: WORKS.length, photo: 0, ai: 0, motion: 0 };
    WORKS.forEach((w) => { counts[w.type] = (counts[w.type] || 0) + 1; });
    $$(".filter").forEach((b) => {
      const sup = b.querySelector("sup");
      if (sup) sup.textContent = String(counts[b.dataset.filter] || 0).padStart(2, "0");
    });

    applyFilter(activeFilter);
    renderedOnce = true;
  }

  function buildGroupHead(g) {
    const head = document.createElement("div");
    head.className = "grid__head";
    head.dataset.group = g.id;
    head.innerHTML =
      `<span class="grid__k">${g.k}</span>` +
      `<span class="grid__t">${pick(g.t)}</span>` +
      (g.hint ? `<span class="grid__hint">${pick(g.hint)}</span>` : "") +
      `<span class="grid__d">${pick(g.d)}</span>`;
    return head;
  }

  function applyFilter(f) {
    activeFilter = f;
    $$(".filter").forEach((b) => b.classList.toggle("is-on", b.dataset.filter === f));
    $$(".card").forEach((c) => {
      const show = f === "all" || c.dataset.type === f;
      c.classList.toggle("is-hidden", !show);
    });
    $$(".grid__note").forEach((n) => {
      n.classList.toggle("is-hidden", !(f === "all" || n.dataset.type === f));
    });
    /* a header goes away when its whole cluster is filtered out */
    if (gridEl) {
      const kids = Array.from(gridEl.children);
      kids.forEach((node, i) => {
        if (!node.classList.contains("grid__head")) return;
        let alive = false;
        for (let j = i + 1; j < kids.length; j++) {
          if (kids[j].classList.contains("grid__head")) break;
          if (!kids[j].classList.contains("is-hidden")) { alive = true; break; }
        }
        node.classList.toggle("is-off", !alive);
      });
    }
  }

  $$(".filter").forEach((btn) => {
    btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
  });

  /* ════════════════════════════════════════
     4. RENDER: BTS + HOBBIES + MARQUEE
     ════════════════════════════════════════ */
  /* behind the lens: a real clip, the setup, the timeline — all openable */
  let btsIO = null;
  function renderBts() {
    const el = $("#bts");
    if (!el || typeof BTS === "undefined") return;
    el.innerHTML = "";
    if (btsIO) { btsIO.disconnect(); btsIO = null; }

    BTS.forEach((b, i) => {
      const fig = document.createElement("figure");
      fig.className = "bts__item bts__item--" + b.kind;
      fig.style.setProperty("--span", b.span || 6);
      fig.style.setProperty("--ar", b.ar || "16 / 9");
      if (b.pos) fig.style.setProperty("--pos", b.pos);
      fig.tabIndex = 0;
      fig.setAttribute("role", "button");
      fig.setAttribute("aria-label", pick(b.title));
      fig.dataset.cursorLabel = t(b.kind === "video" ? "w.view" : "b.zoom");

      const frame = document.createElement("div");
      frame.className = "bts__frame";

      const badge = document.createElement("span");
      badge.className = "bts__badge";

      if (b.kind === "video") {
        const v = document.createElement("video");
        v.className = "bts__video";
        v.src = b.full;
        v.poster = b.img;
        v.muted = true; v.loop = true; v.playsInline = true;
        v.autoplay = true; v.preload = "metadata";
        v.setAttribute("muted", "");
        frame.appendChild(v);
        /* only plays while it is on screen — no silent 1.5 MB loop in a tab you left */
        if (!btsIO) {
          btsIO = new IntersectionObserver((entries) => {
            entries.forEach((en) => {
              const node = en.target;
              if (en.isIntersecting) { const p = node.play(); if (p && p.catch) p.catch(() => {}); }
              else node.pause();
            });
          }, { threshold: 0.15 });
        }
        btsIO.observe(v);
        badge.innerHTML = `<i class="bts__dot"></i>${t("w.view")} · ${b.dur || ""}`;
      } else {
        const img = document.createElement("img");
        img.src = b.img;
        img.alt = pick(b.sub);
        img.loading = "lazy";
        frame.appendChild(img);
        badge.textContent = t("b.zoom");
      }
      frame.appendChild(badge);

      const cap = document.createElement("div");
      cap.className = "bts__cap";
      cap.innerHTML = `<span class="bts__cap-t">${pick(b.title)}</span><em>${pick(b.note)}</em>`;
      const line = document.createElement("p");
      line.className = "bts__line";
      line.textContent = pick(b.cap);

      fig.append(frame, cap, line);
      fig.addEventListener("click", () => openGallery(BTS, i));
      fig.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGallery(BTS, i); }
      });
      el.appendChild(fig);
    });

    /* the note that balances the timeline tile */
    if (typeof BTS_NOTE !== "undefined") {
      const note = document.createElement("aside");
      note.className = "bts__note";
      note.innerHTML =
        `<p class="bts__note-k">${pick(BTS_NOTE.k)}</p>` +
        `<h3 class="bts__note-t">${pick(BTS_NOTE.t)}</h3>` +
        `<p class="bts__note-d">${pick(BTS_NOTE.d)}</p>`;
      el.appendChild(note);
    }
  }

  function renderHobbies() {
    const el = $("#hobbies");
    if (!el) return;
    el.innerHTML = "";
    HOBBIES.forEach((h) => {
      const li = document.createElement("li");
      li.innerHTML = `<b>${pick(h.t)}</b><span>${pick(h.d)}</span>`;
      el.appendChild(li);
    });
  }

  function renderMarquee() {
    const el = $("#marqueeTrack");
    if (!el) return;
    const block = MARQUEE.map((m) => `<span class="marquee__item"><b>${m}</b><i>✦</i></span>`).join("");
    el.innerHTML = block + block;
  }

  /* ════════════════════════════════════════
     5. LIGHTBOX
     ════════════════════════════════════════ */
  const lb = $("#lightbox"), lbMedia = $("#lbMedia"),
        lbTitle = $("#lbTitle"), lbMeta = $("#lbMeta"), lbExtra = $("#lbExtra");
  let lbIndex = 0, lbList = [], player = null;
  const acked = new Set();      // films whose content note has been read

  function visibleWorks() {
    return WORKS.map((w, i) => ({ w, i })).filter(({ w }) => activeFilter === "all" || w.type === activeFilter);
  }

  /* ── video player: scrubbable timeline, skip, speed, fullscreen ── */
  const ICON = {
    play:  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.2v13.6L19 12z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z"/></svg>',
    vol:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.4h3.3L12 5.5v13L7.3 14.6H4z"/><path d="M15.3 8.5a5 5 0 0 1 0 7M17.8 6a8.4 8.4 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    mute:  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.4h3.3L12 5.5v13L7.3 14.6H4z"/><path d="M16 9.2l5 5.6M21 9.2l-5 5.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    fs:    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  const SPEEDS = [1, 1.25, 1.5, 2];
  const blobCache = new Map();

  function fmtTime(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    sec = Math.floor(sec);
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(s).padStart(2, "0");
  }

  function destroyPlayer() {
    if (!player) return;
    player.destroy();
    player = null;
  }

  function buildPlayer(item) {
    const src = item.full || item.video;
    const wrap = document.createElement("div");
    wrap.className = "pl";
    wrap.style.setProperty("--ar", item.ar || 1.78);
    wrap.innerHTML =
      '<div class="pl__screen">' +
        '<video class="pl__video" playsinline preload="auto"></video>' +
        '<button class="pl__big" type="button" tabindex="-1" aria-label="Play">' + ICON.play + "</button>" +
        '<span class="pl__chip" hidden></span>' +
      "</div>" +
      '<div class="pl__rail" role="slider" tabindex="0" aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' +
        '<span class="pl__buf"></span>' +
        '<span class="pl__played"></span>' +
        '<span class="pl__thumb"></span>' +
        '<span class="pl__tip">0:00</span>' +
      "</div>" +
      '<div class="pl__bar">' +
        '<button class="pl__btn pl__toggle" type="button" aria-label="Play">' + ICON.play + "</button>" +
        '<span class="pl__time"><b>0:00</b><i>/</i><em>0:00</em></span>' +
        '<span class="pl__grow"></span>' +
        '<button class="pl__btn pl__skip" data-d="-10" type="button" aria-label="Back 10 seconds">−10s</button>' +
        '<button class="pl__btn pl__skip" data-d="10" type="button" aria-label="Forward 10 seconds">+10s</button>' +
        '<button class="pl__btn pl__rate" type="button" aria-label="Playback speed">1×</button>' +
        '<button class="pl__btn pl__mute" type="button" aria-label="Mute">' + ICON.vol + "</button>" +
        '<button class="pl__btn pl__fs" type="button" aria-label="Fullscreen">' + ICON.fs + "</button>" +
      "</div>";

    const video = wrap.querySelector("video");
    const rail = wrap.querySelector(".pl__rail");
    const played = wrap.querySelector(".pl__played");
    const buf = wrap.querySelector(".pl__buf");
    const thumb = wrap.querySelector(".pl__thumb");
    const tip = wrap.querySelector(".pl__tip");
    const nowEl = wrap.querySelector(".pl__time b");
    const allEl = wrap.querySelector(".pl__time em");
    const toggleBtn = wrap.querySelector(".pl__toggle");
    const rateBtn = wrap.querySelector(".pl__rate");
    const muteBtn = wrap.querySelector(".pl__mute");
    const fsBtn = wrap.querySelector(".pl__fs");
    const big = wrap.querySelector(".pl__big");
    const chip = wrap.querySelector(".pl__chip");

    video.src = src;
    if (item.poster) video.poster = item.poster;

    let raf = 0, dragging = false, rateIdx = 0, probing = false;

    const dur = () => (isFinite(video.duration) ? video.duration : 0);
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

    function paint() {
      const d = dur();
      const r = d ? clamp01(video.currentTime / d) : 0;
      played.style.width = (r * 100).toFixed(3) + "%";
      thumb.style.left = (r * 100).toFixed(3) + "%";
      rail.setAttribute("aria-valuenow", String(Math.round(r * 100)));
      nowEl.textContent = fmtTime(video.currentTime);
      if (d) allEl.textContent = fmtTime(d);

      let end = 0;
      for (let i = 0; i < video.buffered.length; i++) end = Math.max(end, video.buffered.end(i));
      buf.style.width = (d ? clamp01(end / d) * 100 : 0).toFixed(2) + "%";
    }

    function loop() {
      paint();
      raf = video.paused ? 0 : requestAnimationFrame(loop);
    }

    function syncPlayIcon() {
      const icon = video.paused ? ICON.play : ICON.pause;
      toggleBtn.innerHTML = icon;
      big.innerHTML = icon;
      toggleBtn.setAttribute("aria-label", video.paused ? "Play" : "Pause");
    }

    function play() { const p = video.play(); if (p && p.catch) p.catch(() => {}); }
    function toggle() { video.paused ? play() : video.pause(); }
    function nudge(d) { if (dur()) { video.currentTime = Math.min(dur() - 0.05, Math.max(0, video.currentTime + d)); paint(); } }

    function seekTo(clientX) {
      const rect = rail.getBoundingClientRect();
      if (!rect.width || !dur()) return;
      video.currentTime = clamp01((clientX - rect.left) / rect.width) * dur();
      paint();
    }

    /* ── scrubbing: click anywhere on the rail, or press and drag ── */
    rail.addEventListener("pointerdown", (e) => {
      if (!dur()) return;
      e.preventDefault();
      dragging = true;
      rail.classList.add("is-drag");
      try { rail.setPointerCapture(e.pointerId); } catch (err) {}
      seekTo(e.clientX);
    });
    rail.addEventListener("pointermove", (e) => {
      const rect = rail.getBoundingClientRect();
      if (!rect.width) return;
      const x = clamp01((e.clientX - rect.left) / rect.width);
      tip.style.left = (x * 100).toFixed(2) + "%";
      if (dur()) tip.textContent = fmtTime(x * dur());
      if (dragging) seekTo(e.clientX);
    });
    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      rail.classList.remove("is-drag");
      try { rail.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    rail.addEventListener("pointerup", endDrag);
    rail.addEventListener("pointercancel", endDrag);
    rail.addEventListener("pointerleave", () => rail.classList.remove("is-hover"));

    wrap.querySelector(".pl__screen").addEventListener("click", (e) => {
      if (e.target === chip || chip.contains(e.target)) return;
      toggle();
    });

    toggleBtn.addEventListener("click", toggle);
    wrap.querySelectorAll(".pl__skip").forEach((b) => {
      b.addEventListener("click", () => nudge(parseFloat(b.dataset.d)));
    });
    rateBtn.addEventListener("click", () => {
      rateIdx = (rateIdx + 1) % SPEEDS.length;
      video.playbackRate = SPEEDS[rateIdx];
      rateBtn.textContent = String(SPEEDS[rateIdx]).replace(/\.0+$/, "") + "×";
      rateBtn.classList.toggle("is-on", rateIdx > 0);
    });
    function syncMute() {
      muteBtn.innerHTML = video.muted ? ICON.mute : ICON.vol;
      muteBtn.classList.toggle("is-on", video.muted);
    }
    muteBtn.addEventListener("click", () => { video.muted = !video.muted; syncMute(); });
    fsBtn.addEventListener("click", () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (wrap.requestFullscreen) wrap.requestFullscreen().catch(() => {});
    });

    video.addEventListener("loadedmetadata", () => {
      allEl.textContent = fmtTime(dur()); paint(); probeSeek();
      /* size the frame from the file itself — a 16:9 film inside a 5:4 card
         should not be letterboxed by the card's ratio */
      if (video.videoWidth && video.videoHeight) {
        wrap.style.setProperty("--ar", (video.videoWidth / video.videoHeight).toFixed(4));
      }
      /* ±10 s is meaningless on a six-second clip */
      if (dur() && dur() < 20) wrap.querySelectorAll(".pl__skip").forEach((x) => x.remove());
    });
    video.addEventListener("durationchange", paint);
    video.addEventListener("timeupdate", paint);
    video.addEventListener("progress", paint);
    video.addEventListener("seeking", paint);
    video.addEventListener("play", () => { big.classList.add("is-off"); syncPlayIcon(); if (!raf) loop(); });
    video.addEventListener("pause", () => { big.classList.remove("is-off"); syncPlayIcon(); cancelAnimationFrame(raf); raf = 0; paint(); });
    video.addEventListener("ended", () => { big.classList.remove("is-off"); syncPlayIcon(); });

    /* ── if the host cannot serve byte ranges, seeking dies. pull the whole
          file into a blob instead, then hand it back to the same <video>. ── */
    function probeSeek() {
      if (probing) return;
      probing = true;
      fetch(src, { headers: { Range: "bytes=0-1" } })
        .then((r) => {
          if (r.body) { try { r.body.cancel(); } catch (e) {} }
          if (r.status !== 206) loadBlob();
        })
        .catch(() => {});   // file:// — native seeking is fine
    }

    function loadBlob() {
      chip.hidden = false;
      chip.textContent = "PREPARING · 0%";
      const job = fetch(src)
        .then((res) => {
          if (!res.ok) throw new Error("http " + res.status);
          const total = parseInt(res.headers.get("content-length") || "0", 10);
          if (!res.body || !total) return res.blob();
          const reader = res.body.getReader();
          const chunks = [];
          let got = 0;
          return (function pump() {
            return reader.read().then(({ done, value }) => {
              if (done) return new Blob(chunks, { type: res.headers.get("content-type") || "video/mp4" });
              chunks.push(value); got += value.length;
              chip.textContent = "PREPARING · " + Math.min(100, Math.round((got / total) * 100)) + "%";
              return pump();
            });
          })();
        })
        .then((blob) => URL.createObjectURL(blob))
        .catch(() => null);

      blobCache.set(src, job);
      job.then((url) => {
        if (!url) { chip.hidden = true; return; }
        const at = video.currentTime;
        const wasPlaying = !video.paused;
        const onMeta = () => {
          video.removeEventListener("loadedmetadata", onMeta);
          try { video.currentTime = at; } catch (e) {}
          paint();
          if (wasPlaying) play();
        };
        video.addEventListener("loadedmetadata", onMeta);
        video.src = url;
        video.load();
        chip.hidden = true;
      });
    }

    function onKey(e) {
      if (!lb.classList.contains("is-open")) return;
      const k = e.key.toLowerCase();
      const onControl = e.target.closest && e.target.closest("button, a, input, textarea");
      if (k === " " || k === "k") {
        if (onControl) return;
        e.preventDefault(); toggle();
      } else if (k === "arrowright") { e.preventDefault(); nudge(e.shiftKey ? 30 : 5); }
      else if (k === "arrowleft") { e.preventDefault(); nudge(e.shiftKey ? -30 : -5); }
      else if (k === "m") { video.muted = !video.muted; syncMute(); }
      else if (k === "f") { fsBtn.click(); }
    }
    document.addEventListener("keydown", onKey);

    syncPlayIcon();
    syncMute();
    play();

    player = {
      el: wrap,
      video: video,
      destroy() {
        document.removeEventListener("keydown", onKey);
        cancelAnimationFrame(raf);
        try { video.pause(); } catch (e) {}
        video.removeAttribute("src");
        try { video.load(); } catch (e) {}
      }
    };
    return wrap;
  }

  /* any list of media can be opened — works, behind-the-scenes, whatever */
  function openGallery(items, index) {
    lbList = items.map((w, i) => ({ w, i }));
    lbIndex = Math.max(0, Math.min(index, lbList.length - 1));
    paintLightbox();
    lb.classList.add("is-open");
    document.body.classList.add("is-locked");
    if (cur) cur.style.display = "none";
  }

  function openLightbox(index) {
    lbList = visibleWorks();
    const pos = lbList.findIndex((x) => x.i === index);
    openGallery(lbList.map((x) => x.w), pos < 0 ? 0 : pos);
  }

  function buildWarnPanel(w) {
    const box = document.createElement("div");
    box.className = "warn";
    box.innerHTML =
      `<p class="warn__k">${pick(w.warn.k)}</p>` +
      `<h3 class="warn__t">${pick(w.warn.t)}</h3>` +
      `<p class="warn__d">${pick(w.warn.d)}</p>` +
      `<div class="warn__acts">` +
        `<button class="warn__go" type="button">${pick(w.warn.go)}</button>` +
        `<button class="warn__back" type="button">${pick(w.warn.back)}</button>` +
      `</div>`;
    box.querySelector(".warn__go").addEventListener("click", () => {
      acked.add(w.title.en || pick(w.title));
      paintLightbox();
    });
    box.querySelector(".warn__back").addEventListener("click", closeLightbox);
    return box;
  }

  /* the line under the caption: how an AI piece was made, or a content note */
  function paintExtra(w) {
    if (!lbExtra) return;
    if (w.warn) {
      lbExtra.innerHTML =
        `<span class="lb__extra-k">${t("w.noteTag")}</span>` +
        `<span class="lb__extra-d">${pick(w.warn.chip)} — ${pick(w.warn.short)}</span>`;
      lbExtra.hidden = false;
    } else if (w.ai) {
      lbExtra.innerHTML =
        `<span class="lb__extra-k">${t("w.aiHow")}</span>` +
        `<span class="lb__extra-d">${pick(w.ai.d)}</span>` +
        `<span class="lb__extra-pipe">${pick(w.ai.line)}</span>`;
      lbExtra.hidden = false;
    } else {
      lbExtra.hidden = true;
      lbExtra.innerHTML = "";
    }
  }

  function paintLightbox() {
    const { w } = lbList[lbIndex];
    destroyPlayer();
    lbMedia.innerHTML = "";

    /* a horror film does not start until you have read the note */
    const gate = !!(w.warn && !acked.has(w.title.en || pick(w.title)));
    lb.classList.toggle("is-warn", gate);
    if (gate) {
      lbMedia.appendChild(buildWarnPanel(w));
      lbTitle.textContent = pick(w.title);
      lbMeta.textContent = pick(w.note);
      paintExtra(w);
      return;
    }

    if (w.full || w.video) {
      lbMedia.appendChild(buildPlayer(w));
    } else if (w.poster || w.img) {
      const img = document.createElement("img");
      img.src = w.poster || w.img;
      img.alt = pick(w.title);
      lbMedia.appendChild(img);
    } else {
      const cv = document.createElement("canvas");
      cv.className = "art";
      cv.dataset.seed = w.seed;
      cv.dataset.art = w.art || "flow";
      cv.dataset.tone = w.tone || "bone";
      cv.dataset.ar = String(w.ar || 1);
      cv.style.maxHeight = "76svh";
      cv.style.width = "auto";
      cv.style.height = "auto";
      renderArt(cv);
      lbMedia.appendChild(cv);
    }

    lbTitle.textContent = `${pick(w.title)} — ${pick(w.sub)}`;
    lbMeta.textContent = pick(w.note) + (w.full && w.type ? " · " + t("w.full") : "");
    paintExtra(w);
  }

  function stepLightbox(dir) {
    lbIndex = (lbIndex + dir + lbList.length) % lbList.length;
    paintLightbox();
  }

  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", () => stepLightbox(-1));
  $("#lbNext").addEventListener("click", () => stepLightbox(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });

  function closeLightbox() {
    destroyPlayer();
    lbMedia.innerHTML = "";
    lb.classList.remove("is-open", "is-warn");
    document.body.classList.remove("is-locked");
    if (cur) cur.style.display = "";
  }

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    // arrows belong to the video player while a film is open
    if (player || lb.classList.contains("is-warn")) return;
    if (e.key === "ArrowRight") stepLightbox(1);
    if (e.key === "ArrowLeft") stepLightbox(-1);
  });

  /* ════════════════════════════════════════
     SCRIPT READER — every page of the proposal
     ════════════════════════════════════════ */
  const readerEl = $("#reader"), readerStage = $("#readerStage");
  const readerKicker = $("#readerKicker"), readerDl = $("#readerDl");
  let readerLang = "", readerPages = (typeof PROPOSAL !== "undefined" ? 2 + PROPOSAL.pages.length : 0);

  function syncReaderBar() {
    if (readerKicker) {
      readerKicker.textContent = t("r.kicker").replace("{n}", String(readerPages));
    }
    if (readerDl) {
      const en = lang === "en";
      readerDl.href = en ? "assets/script/proposal-en.pdf" : "assets/script/proposal.pdf";
      readerDl.textContent = en ? t("r.dl") : t("r.dlZh");
    }
  }

  let buildToken = 0;

  function buildScript() {
    if (!readerStage) return Promise.resolve();
    const token = ++buildToken;
    return ProposalDoc.build(lang, readerStage).then((out) => {
      if (token !== buildToken) return;          // a newer build won
      readerLang = lang;
      readerPages = out.pages;
      syncReaderBar();
    });
  }

  /* switching language inside the reader keeps your place, not your page 01 */
  function relayoutReader(force) {
    if (!readerStage) return;
    if (!force && readerLang === lang) return;
    const prev = readerStage.scrollHeight - readerStage.clientHeight;
    const ratio = prev > 0 ? readerStage.scrollTop / prev : 0;
    buildScript().then(() => {
      readerStage.scrollTop = ratio * Math.max(0, readerStage.scrollHeight - readerStage.clientHeight);
    });
  }

  function openScript(e) {
    if (e) e.preventDefault();
    if (readerLang !== lang) buildScript();
    readerEl.classList.add("is-open");
    document.body.classList.add("is-locked");
    readerStage.scrollTop = 0;
    if (cur) cur.style.opacity = "0";
  }

  function closeScript() {
    readerEl.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    if (cur) cur.style.opacity = "";
  }

  /* webfonts change metrics — repaginate once they have landed */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (readerLang) relayoutReader(true);
    });
  }

  let rzTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(rzTimer);
    rzTimer = setTimeout(() => {
      if (readerEl && readerEl.classList.contains("is-open")) relayoutReader(true);
    }, 280);
  });

  const scriptBtn = $("#openScript");
  if (scriptBtn) scriptBtn.addEventListener("click", openScript);
  if ($("#readerClose")) $("#readerClose").addEventListener("click", closeScript);
  if (readerEl) readerEl.addEventListener("click", (e) => { if (e.target === readerEl) closeScript(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && readerEl && readerEl.classList.contains("is-open")) closeScript();
  });

  /* ════════════════════════════════════════
     6. I18N
     ════════════════════════════════════════ */
  function applyLang(next) {
    lang = next;
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang === "zh" ? "zh" : "en";

    $$("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const val = I18N[lang][key];
      if (typeof val === "string") el.textContent = val;
    });

    $$(".lang__opt").forEach((o) => o.classList.toggle("is-on", o.dataset.lang === lang));

    // the name lives in one place only — the SITE object
    const nameFull = lang === "zh"
      ? (SITE.nameCN || "")
      : [SITE.first, SITE.last].filter(Boolean).join(" ");
    const hFirst = lang === "zh" ? (SITE.nameCN || "") : SITE.first;
    const hLast  = lang === "zh" ? "" : (SITE.last || "");

    $$('[data-i18n="site.name"], [data-i18n="nav.mark"]').forEach((el) => { el.textContent = nameFull; });
    $$('[data-i18n="hero.first"]').forEach((el) => { el.textContent = hFirst; });
    $$('[data-i18n="hero.last"]').forEach((el) => {
      el.textContent = hLast;
      const line = el.closest(".line");
      if (line) line.style.display = hLast ? "" : "none";
    });

    const mail = $(".contact__mail");
    if (mail && SITE.email) {
      mail.href = "mailto:" + SITE.email;
      const inner = mail.querySelector(".line__in");
      if (inner) inner.textContent = SITE.email;
    }

    renderWorks();
    renderBts();
    renderHobbies();

    // the proposal follows the language switch, keeping the reader's place
    if (readerEl && readerEl.classList.contains("is-open")) relayoutReader();
    else syncReaderBar();

    document.title = `${nameFull} — ${I18N[lang]["hero.role"]}`;

    // re-observe freshly created nodes
    observeAll();
  }

  $("#langToggle").addEventListener("click", () => applyLang(lang === "en" ? "zh" : "en"));

  /* ════════════════════════════════════════
     7. REVEAL ON SCROLL
     ════════════════════════════════════════ */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  function observeAll() {
    $$(".reveal, .display, .line").forEach((el) => {
      if (!el.classList.contains("is-in")) io.observe(el);
    });
  }

  /* ════════════════════════════════════════
     8. CURSOR
     ════════════════════════════════════════ */
  const cur = $("#cursor"), curLabel = $(".cursor__label");
  if (!COARSE) {
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, visible = false;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      if (!visible) { visible = true; cur.classList.add("is-active"); }
    }, { passive: true });

    (function loop() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cur.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();

    const hoverables = "a, button, .card, .bts__item, .chips li";
    document.addEventListener("mouseover", (e) => {
      const el = e.target.closest(hoverables);
      if (!el) return;
      cur.classList.add("is-hover");
      let label = "";
      if (el.classList.contains("card")) label = I18N[lang]["w.view"];
      else if (el.dataset.cursorLabel) label = el.dataset.cursorLabel;
      curLabel.textContent = label;
    });
    document.addEventListener("mouseout", (e) => {
      if (!e.target.closest(hoverables)) return;
      cur.classList.remove("is-hover");
      curLabel.textContent = "";
    });
  }

  /* ════════════════════════════════════════
     9. SCROLL: nav, progress, parallax
     ════════════════════════════════════════ */
  const nav = $("#nav"), bar = $("#progressBar"), heroMedia = $(".hero__media");
  let lastY = 0, ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";

    nav.classList.toggle("is-stuck", y > 40);
    if (y > 220 && y > lastY + 6) nav.classList.add("is-hidden");
    else if (y < lastY - 6 || y < 120) nav.classList.remove("is-hidden");
    lastY = y;

    if (heroMedia && !REDUCED) {
      heroMedia.style.transform = `translate3d(0, ${y * 0.28}px, 0)`;
    }
  }

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });

  /* ════════════════════════════════════════
     10. BOOT
     ════════════════════════════════════════ */
  function boot() {
    renderMarquee();
    // static canvases written directly in index.html
    $$("canvas.art").forEach((c) => renderArt(c));
    applyLang(lang);
    onScroll();

    const loader = $("#loader"),
          count = $("#loaderCount"),
          progress = $("#loaderBar");

    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(100, p + Math.random() * 18 + 6);
      count.textContent = String(Math.round(p)).padStart(2, "0");
      progress.style.width = p + "%";
      if (p >= 100) {
        clearInterval(tick);
        setTimeout(() => {
          loader.classList.add("is-done");
          document.body.classList.remove("is-locked");
          $$(".hero .line, .hero .reveal").forEach((el, i) => {
            setTimeout(() => el.classList.add("is-in"), i * 90);
          });
          setTimeout(() => loader.remove(), 1400);
        }, 280);
      }
    }, 110);
  }

  document.body.classList.add("is-locked");
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
