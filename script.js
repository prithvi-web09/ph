// --------------------------
// GSAP + Original UI logic (fixed + cleaned)
// --------------------------
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// GSAP Intro Animations
gsap.timeline()
  .from(".logo", { y: -40, opacity: 0, duration: 1.2, ease: "back.out(1.7)" })
  .from("#page1 h1", { opacity: 0, scale: 0.9, y: 30, duration: 1, ease: "power3.out" }, "-=0.4")
  .from("#page1 p", { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" }, "-=0.4")
  .from(".credits-wrapper", { opacity: 0, y: 40, duration: 1.2, ease: "elastic.out(1, 0.5)" }, "-=0.5");

gsap.to(".logo", { y: 10, repeat: -1, yoyo: true, duration: 2, ease: "sine.inOut" });

// Seamless scrolling group names
const names = document.querySelector(".group-names");
if (names) {
  names.innerHTML += names.innerHTML;
  const namesWidth = names.scrollWidth / 2;
  gsap.to(".group-names", { x: -namesWidth, repeat: -1, duration: 25, ease: "none" });
}

// Scroll animation to Page 2
document.addEventListener("wheel", (e) => {
  if (e.deltaY > 0) {
    gsap.to(window, { scrollTo: "#page2", duration: 0.5, ease: "power2.inOut" });
  }
});

// Section fade-in animations
gsap.utils.toArray(".sec-container div").forEach((section, i) => {
  gsap.from(section, {
    scrollTrigger: {
      trigger: section,
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    opacity: 0,
    scale: 0.9,
    y: 50,
    duration: 0.8,
    ease: "power2.out",
    delay: i * 0.05
  });
});

// Starfield Background (kept)
const starCanvas = document.getElementById("starfield");
const starCtx = starCanvas.getContext("2d");
let w, h, stars = [], shootingStars = [];

function resize() {
  w = starCanvas.width = window.innerWidth;
  h = starCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// Create stars
for (let i = 0; i < 180; i++) {
  stars.push({
    x: Math.random() * w,
    y: Math.random() * h,
    radius: Math.random() * 1.3,
    alpha: Math.random(),
    twinkleSpeed: 0.015 + Math.random() * 0.03
  });
}

// Draw stars
function drawStars() {
  for (let star of stars) {
    star.alpha += star.twinkleSpeed * (Math.random() > 0.5 ? 1 : -1);
    star.alpha = Math.max(0.2, Math.min(1, star.alpha));
    starCtx.globalAlpha = star.alpha;
    starCtx.beginPath();
    starCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    starCtx.fillStyle = "white";
    starCtx.fill();
  }
  starCtx.globalAlpha = 1;
}

// Shooting stars
function spawnShootingStar() {
  const startX = Math.random() * w;
  const startY = Math.random() * h * 0.5;
  const length = 200 + Math.random() * 100;
  const speed = 10 + Math.random() * 5;
  shootingStars.push({ x: startX, y: startY, len: length, speed });
}

function drawShootingStars() {
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    starCtx.strokeStyle = "white";
    starCtx.lineWidth = 2;
    starCtx.beginPath();
    starCtx.moveTo(s.x, s.y);
    starCtx.lineTo(s.x - s.len, s.y + s.len / 2);
    starCtx.stroke();

    s.x -= s.speed;
    s.y += s.speed * 0.5;
    s.len -= 8;

    if (s.len < 0) shootingStars.splice(i, 1);
  }
}

// Animate starfield
function animateStarfield() {
  starCtx.fillStyle = "rgba(0, 0, 0, 0.25)";
  starCtx.fillRect(0, 0, w, h);
  drawStars();
  drawShootingStars();
  requestAnimationFrame(animateStarfield);
}
animateStarfield();

// Random shooting stars every 3 seconds
setInterval(() => {
  if (Math.random() > 0.7) spawnShootingStar();
}, 3000);

// -------------------------
// Light parallax for desktop
// -------------------------
if (window.innerWidth > 768) {
  document.addEventListener("mousemove", (e) => {
    const offsetX = (e.clientX / window.innerWidth - 0.5) * 20;
    const offsetY = (e.clientY / window.innerHeight - 0.5) * 20;
    gsap.to("header, #page1", { x: offsetX, y: offsetY, duration: 1, ease: "power2.out" });
  });
}

// -------------------------
// POPUP OPEN / CLOSE
// -------------------------
const gravPopup = document.getElementById("grav-popup");
const openBtn = document.querySelector(".sec-1");
const closeBtn = document.getElementById("close-popup");

if (openBtn) {
  openBtn.addEventListener("click", () => {
    gravPopup.classList.add("show");
    gravPopup.setAttribute("aria-hidden", "false");
    // reset UI state on open
    gsap.set(".option-btn", { opacity: 0, pointerEvents: "none" });
    pauseSimulation(); // ensure simulation paused until user clicks Simulate
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    gravPopup.classList.remove("show");
    gravPopup.setAttribute("aria-hidden", "true");
    gsap.set(".option-btn", { opacity: 0, pointerEvents: "none" });
    resetSimulation();
  });
}

// ===============================
// INPUT + OPTION BUTTON LOGIC
// ===============================

// Dynamically pair labels -> input -> its buttons
const allLabels = document.querySelectorAll(".input-group label");

allLabels.forEach((label) => {
  // input is the next element
  const input = label.nextElementSibling;

  // find option buttons inside the following .options-row (if any)
  let optRow = input.nextElementSibling;
  while (optRow && !optRow.classList.contains("options-row")) {
    optRow = optRow.nextElementSibling;
  }
  let buttons = [];
  if (optRow) {
    buttons = Array.from(optRow.querySelectorAll(".option-btn"));
  }

  // show only this input's options when clicked
  input.addEventListener("click", () => {
    gsap.to(".option-btn", { opacity: 0, duration: 0.12, pointerEvents: "none" });
    if (buttons.length) {
      gsap.to(buttons, {
        opacity: 1,
        pointerEvents: "auto",
        y: 0,
        stagger: 0.05,
        duration: 0.25,
        ease: "power2.out"
      });
    }
  });

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      input.value = btn.textContent;
      console.log(`Selected "${btn.textContent}" for ${label.textContent}`);
      // hide these options
      gsap.to(buttons, { opacity: 0, pointerEvents: "none", duration: 0.2 });
      // highlight input briefly
      gsap.fromTo(input, { boxShadow: "0 0 0px #00ffcc" }, { boxShadow: "0 0 12px #00ffcc", duration: 0.3, yoyo: true, repeat: 1 });
    });
  });
});

// -------------------------
// Solar System simulation logic (canvas)
// -------------------------
const canvas = document.getElementById("orbit-canvas");
const ctx = canvas.getContext("2d");

let simRunning = false;
let simPaused = true;
let lastTime = 0;
let simTime = 0;
let rafId = null;

// scaled gravitational constant (visual)
const G = 0.06; // tuned for aesthetic motion

// default masses (relative unit)
const DEFAULT_SUN_MASS = 1000; // visualized unit

let simParams = {
  sunMass: DEFAULT_SUN_MASS
};

// UI elements
const massSunInput = document.getElementById("mass-sun");
const calculateBtn = document.getElementById("calculate");
const pauseBtn = document.getElementById("pause-resume");
const resetBtn = document.getElementById("reset-sim");
const resultP = document.getElementById("result");

// helper to parse values like "0.5 times" or "Original"
function parseMassInput(value, defaultVal) {
  if (!value) return defaultVal;
  value = value.toString().trim().toLowerCase();
  if (value.includes("original")) return defaultVal;
  // "0.5 times" -> parseFloat gives 0.5
  const timesMatch = value.match(/([0-9]*\.?[0-9]+)\s*times?/);
  if (timesMatch) {
    const num = parseFloat(timesMatch[1]);
    if (!isNaN(num) && num > 0) return defaultVal * num;
  }
  // if user typed a number directly
  const asNum = parseFloat(value);
  if (!isNaN(asNum)) return asNum;
  return defaultVal;
}

// angular speed for circular orbit: w = sqrt(G*M / r^3)
function angularSpeed(M, r) {
  return Math.sqrt((G * M) / (r * r * r));
}

// planets config (aesthetic visual distances & sizes)
const planets = [
  { name: "Mercury", color: "#c7c7c7", orbitRadius: 52, radius: 4.5, initialAngle: Math.random() * Math.PI * 2 },
  { name: "Venus",   color: "#e7c56a", orbitRadius: 86, radius: 7,   initialAngle: Math.random() * Math.PI * 2 },
  { name: "Earth",   color: "#7fbfff", orbitRadius: 120, radius: 8.5, initialAngle: Math.random() * Math.PI * 2 },
  { name: "Mars",    color: "#f08b66", orbitRadius: 154, radius: 6.5, initialAngle: Math.random() * Math.PI * 2 },
  { name: "Jupiter", color: "#f4d9b6", orbitRadius: 208, radius: 14,  initialAngle: Math.random() * Math.PI * 2 },
  { name: "Saturn",  color: "#edd5a0", orbitRadius: 270, radius: 12,  initialAngle: Math.random() * Math.PI * 2 },
  { name: "Uranus",  color: "#bfe9f4", orbitRadius: 320, radius: 10,  initialAngle: Math.random() * Math.PI * 2 },
  { name: "Neptune", color: "#9bbcf0", orbitRadius: 370, radius: 10,  initialAngle: Math.random() * Math.PI * 2 }
];

// state
let state = {
  angles: planets.map(p => p.initialAngle),
  orbitRadii: planets.map(p => p.orbitRadius)
};

// visual speed multiplier to make motion pleasant (tweak for look)
const VISUAL_SPEED_MULT = 40; // higher = faster orbits

// devicePixelRatio friendly resize
function resizeCanvasToParent() {
  const rect = canvas.getBoundingClientRect();
  // keep canvas within the popup's canvas-wrap max width; limit pixel dimensions
  const targetWidth = Math.min(760, rect.width);
  const targetHeight = Math.min(460, targetWidth * 0.6);
  // set actual canvas pixel size for crispness
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(targetWidth * dpr);
  canvas.height = Math.round(targetHeight * dpr);
  canvas.style.width = `${targetWidth}px`;
  canvas.style.height = `${targetHeight}px`;
  // scale drawing operations
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", () => {
  resizeCanvasToParent();
});
resizeCanvasToParent();

// draw helpers
function drawBackground() {
  const cw = canvas.width / (window.devicePixelRatio || 1);
  const ch = canvas.height / (window.devicePixelRatio || 1);
  const grad = ctx.createLinearGradient(0, 0, 0, ch);
  grad.addColorStop(0, "rgba(6,6,12,0.65)");
  grad.addColorStop(1, "rgba(3,3,9,0.6)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, cw, ch);

  // subtle star scatter (canvas-local)
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * cw;
    const y = Math.random() * ch;
    ctx.globalAlpha = 0.03;
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.globalAlpha = 1;
}

function drawOrbit(cx, cy, radius) {
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawSun(cx, cy, r) {
  // glow
  const grd = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 3.2);
  grd.addColorStop(0, "rgba(255,225,140,1)");
  grd.addColorStop(0.2, "rgba(255,180,60,0.6)");
  grd.addColorStop(0.7, "rgba(255,140,40,0.08)");
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 2.8, 0, Math.PI * 2);
  ctx.fill();

  // core
  ctx.fillStyle = "#ffd27a";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawPlanet(x, y, r, color) {
  // subtle shadow
  ctx.beginPath();
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.ellipse(x + r * 0.45, y + r * 0.45, r * 0.9, r * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // body
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // rim highlight
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 0.8;
  ctx.stroke();
}

// small label
function drawLabel(text, x, y) {
  ctx.font = "12px Poppins, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.textAlign = "left";
  ctx.fillText(text, x + 8, y - 6);
}

// compute visual angular speeds per planet for current sun mass
function computePlanetSpeeds(sunMass) {
  // returns array of angular speeds (rad/s) BEFORE VISUAL multiplier
  return planets.map((p, i) => {
    const r = state.orbitRadii[i];
    return angularSpeed(sunMass, r);
  });
}

// main animation loop
function simulationStep(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = (timestamp - lastTime) / 1000; // seconds
  lastTime = timestamp;
  if (!simPaused) simTime += dt;

  // center coords
  const cx = (canvas.width / (window.devicePixelRatio || 1)) / 2;
  const cy = (canvas.height / (window.devicePixelRatio || 1)) / 2;

  // draw base
  drawBackground();

  // scale sun radius based on mass
  const sunRadius = 26 * Math.max(0.8, Math.min(2.2, Math.cbrt(simParams.sunMass / DEFAULT_SUN_MASS)));
  drawSun(cx, cy, sunRadius);

  // draw orbits
  for (let i = 0; i < planets.length; i++) {
    drawOrbit(cx, cy, state.orbitRadii[i]);
  }

  // compute base angular speeds given current sunMass
  const baseSpeeds = computePlanetSpeeds(simParams.sunMass);

  // advance and draw each planet
  const periodsInfo = [];
  for (let i = 0; i < planets.length; i++) {
    const p = planets[i];
    const r = state.orbitRadii[i];

    // visual speed = base angular speed * visual multiplier
    const wBase = baseSpeeds[i];
    const wVisual = wBase * VISUAL_SPEED_MULT;

    if (!simPaused) state.angles[i] += wVisual * dt;

    const x = cx + Math.cos(state.angles[i]) * r;
    const y = cy + Math.sin(state.angles[i]) * r;

    // draw planet
    drawPlanet(x, y, p.radius, p.color);

    // draw label (small but visible)
    drawLabel(p.name, x, y);

    // compute theoretical & visual periods (in seconds)
    const periodTheoretical = isFinite(wBase) && wBase !== 0 ? (2 * Math.PI) / wBase : Infinity;
    const periodVisual = isFinite(wVisual) && wVisual !== 0 ? (2 * Math.PI) / wVisual : Infinity;

    periodsInfo.push({ name: p.name, theoretical: periodTheoretical, visual: periodVisual });
  }

  // display results (only summary for clarity)
  function fmt(v) { return isFinite(v) ? v.toFixed(2) + "s" : "—"; }

  // show first 4 planets in short and indicate there are more
  const firstFour = periodsInfo.slice(0, 4).map(pi => `${pi.name}: ${fmt(pi.visual)}`).join(" · ");
  const lastFour  = periodsInfo.slice(4).map(pi => `${pi.name}: ${fmt(pi.visual)}`).join(" · ");

  resultP.textContent = `Visual periods (approx): ${firstFour} · ${lastFour}`;

  // request next frame
  rafId = requestAnimationFrame(simulationStep);
}

// Simulation control functions
function startSimulation() {
  // parse and apply sun mass multiplier
  simParams.sunMass = parseMassInput(massSunInput.value, DEFAULT_SUN_MASS);
  if (simParams.sunMass <= 0) simParams.sunMass = DEFAULT_SUN_MASS;

  // adjust orbit radii if canvas was resized (keeps proportions)
  // keep the preconfigured radii but shrink if canvas small
  const cw = canvas.width / (window.devicePixelRatio || 1);
  const ch = canvas.height / (window.devicePixelRatio || 1);
  const maxOrbit = Math.min(cw, ch) * 0.45;
  // compute current max of defined radii
  const definedMax = Math.max(...planets.map(p => p.orbitRadius));
  const scaleDown = Math.min(1, maxOrbit / definedMax);

  state.orbitRadii = planets.map(p => Math.max(30, Math.round(p.orbitRadius * scaleDown)));

  simPaused = false;
  simRunning = true;
  lastTime = 0;
  if (!rafId) rafId = requestAnimationFrame(simulationStep);

  pauseBtn.textContent = "Pause";
}

function pauseSimulation() {
  if (!simRunning) {
    // still show a static frame — draw once
    resizeCanvasToParent();
    drawBackground();
    const cx = (canvas.width / (window.devicePixelRatio || 1)) / 2;
    const cy = (canvas.height / (window.devicePixelRatio || 1)) / 2;
    drawSun(cx, cy, 26);
  }
  simPaused = true;
  pauseBtn.textContent = "Resume";
}

function resumeSimulation() {
  simPaused = false;
  pauseBtn.textContent = "Pause";
}

function togglePauseResume() {
  if (!simRunning) return;
  simPaused = !simPaused;
  pauseBtn.textContent = simPaused ? "Resume" : "Pause";
}

function resetSimulation() {
  // cancel RAF
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  simRunning = false;
  simPaused = true;
  lastTime = 0;
  simTime = 0;
  state.angles = planets.map(p => p.initialAngle);
  state.orbitRadii = planets.map(p => p.orbitRadius);
  // clear canvas visually
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  resultP.textContent = "Simulation reset. Click 'Simulate Orbit' to start.";
  pauseBtn.textContent = "Pause";
  // redraw once
  resizeCanvasToParent();
  drawBackground();
  const cx = (canvas.width / (window.devicePixelRatio || 1)) / 2;
  const cy = (canvas.height / (window.devicePixelRatio || 1)) / 2;
  drawSun(cx, cy, 26);
}

// attach UI handlers
calculateBtn.addEventListener("click", () => {
  startSimulation();
});

pauseBtn.addEventListener("click", () => {
  if (!simRunning) return;
  togglePauseResume();
});

resetBtn.addEventListener("click", resetSimulation);

// Enter key triggers simulate for the mass input
if (massSunInput) {
  massSunInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      startSimulation();
    }
  });
}

// initialize option buttons to set textual values (0.25 times, etc.)
document.querySelectorAll(".options-row").forEach(row => {
  row.querySelectorAll(".option-btn").forEach(btn => {
    btn.addEventListener("click", (ev) => {
      // value applies to the preceding input element
      const input = row.previousElementSibling;
      if (input) input.value = btn.textContent;
    });
  });
});

// initial reset draw
resetSimulation();

// Accessibility: close popup on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && gravPopup.classList.contains("show")) {
    closeBtn.click();
  }
});
