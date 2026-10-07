// ============================================================
//  EDIT HERE — paste the contract address once you launch.
// ============================================================
const CONFIG = {
  ca: "",                              // e.g. "AbC...pump"
  ticker: "$SUPERBULL",
  x: "https://x.com/superbullinu",
};

const links = {
  x: CONFIG.x,
  buy: CONFIG.ca
    ? `https://pump.fun/coin/${CONFIG.ca}`
    : "https://pump.fun/",
  dex: CONFIG.ca
    ? `https://dexscreener.com/solana/${CONFIG.ca}`
    : "https://dexscreener.com/solana",
};

document.querySelectorAll("[data-link]").forEach((a) => {
  a.href = links[a.dataset.link];
});
document.querySelectorAll('[data-text="ticker"]').forEach((el) => {
  el.textContent = CONFIG.ticker;
});
if (CONFIG.ca) {
  document.querySelectorAll('[data-text="ca"]').forEach((el) => {
    el.textContent = CONFIG.ca;
  });
  document.getElementById("chartBody").innerHTML =
    `<iframe src="https://dexscreener.com/solana/${CONFIG.ca}?embed=1&theme=dark&trades=0&info=0" title="Chart"></iframe>`;
}

// ---------- toast ----------
const toast = document.getElementById("toast");
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ---------- copy CA ----------
document.getElementById("copyCa").addEventListener("click", async () => {
  if (!CONFIG.ca) return showToast("No CA yet — the bull is still putting his armor on 🐂");
  try {
    await navigator.clipboard.writeText(CONFIG.ca);
    showToast("CA copied. Horns up! 🐂⚔️");
  } catch {
    showToast("Couldn't copy — select it manually, brave knight");
  }
});

// ---------- pet the bull: MOO! ----------
const moos = ["MOO!", "MOOO!", "MOO-N!", "⚔️ MOO ⚔️", "HODL MOO", "*angry moo*", "MOOOOON", "no bears.", "BULLISH"];
const layer = document.getElementById("mooLayer");
document.getElementById("mooBtn").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  btn.classList.remove("bonk");
  void btn.offsetWidth;
  btn.classList.add("bonk");

  const x = e.clientX || window.innerWidth / 2;
  const y = e.clientY || window.innerHeight / 2;
  const word = document.createElement("span");
  word.className = "moo";
  word.textContent = moos[Math.floor(Math.random() * moos.length)];
  word.style.left = x + "px";
  word.style.top = y + "px";
  word.style.setProperty("--r", (Math.random() * 30 - 15) + "deg");
  layer.appendChild(word);
  setTimeout(() => word.remove(), 1200);

  for (let i = 0; i < 10; i++) {
    const s = document.createElement("span");
    s.className = "spark";
    s.textContent = ["⭐", "🪙", "🐂", "💥"][Math.floor(Math.random() * 4)];
    s.style.left = x + "px";
    s.style.top = y + "px";
    const a = Math.random() * Math.PI * 2;
    const d = 60 + Math.random() * 90;
    s.style.setProperty("--dx", Math.cos(a) * d + "px");
    s.style.setProperty("--dy", Math.sin(a) * d + "px");
    layer.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }
});

// ---------- floating confetti ----------
const canvas = document.getElementById("embers");
const ctx = canvas.getContext("2d");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const COLORS = ["#ffd23f", "#ff4d3d", "#4cc9f0", "#3ddc84", "#ff8fb1"];
let w, h, bits;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  const n = Math.min(40, Math.floor((w * h) / 40000));
  bits = Array.from({ length: n }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    s: Math.random() * 8 + 6,
    vy: Math.random() * 0.5 + 0.3,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.04,
    c: COLORS[Math.floor(Math.random() * COLORS.length)],
    star: Math.random() > 0.5,
  }));
}
function drawStar(s) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? s / 2.4 : s;
    const a = (i * Math.PI) / 5;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
}
function tick() {
  ctx.clearRect(0, 0, w, h);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#161414";
  for (const p of bits) {
    p.y += p.vy;
    p.rot += p.vr;
    if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.c;
    if (p.star) drawStar(p.s); else { ctx.beginPath(); ctx.rect(-p.s / 2, -p.s / 4, p.s, p.s / 2); }
    ctx.globalAlpha = 0.55;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  requestAnimationFrame(tick);
}
resize();
window.addEventListener("resize", resize);
if (!reduce) tick();

// ---------- reveal on scroll ----------
const io = new IntersectionObserver(
  (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("in")),
  { threshold: 0.12 }
);
document.querySelectorAll(".section").forEach((el) => {
  el.classList.add("reveal");
  io.observe(el);
});
