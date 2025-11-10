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
// Orbit simulation logic
// -------------------------
const canvas = document.getElementById("orbit-canvas");
const ctx = canvas.getContext("2d");

let simRunning = false;
let simPaused = true;
let lastTime = 0;
let simTime = 0;
let rafId = null;

// physical (visual) constants for nice appearance
const PIXEL_SCALE = 1; // keep for possible scaling
const G = 0.08; // scaled gravitational constant for visualization

// base distances (visual)
const BASE_SUN_RADIUS = 24;
const BASE_EARTH_ORBIT = 180; // pixels from center
const BASE_EARTH_RADIUS = 10;
const BASE_MOON_ORBIT = 38;
const BASE_MOON_RADIUS = 4;

// default masses (relative unit)
const DEFAULT_SUN_MASS = 1000; // visualized unit
const DEFAULT_EARTH_MASS = 1;
const DEFAULT_MOON_MASS = 0.0123;

let simParams = {
  sunMass: DEFAULT_SUN_MASS,
  earthMass: DEFAULT_EARTH_MASS,
  moonMass: DEFAULT_MOON_MASS
};

// UI elements
const massSunInput = document.getElementById("mass-sun");
const massEarthInput = document.getElementById("mass-earth");
const massMoonInput = document.getElementById("mass-moon");
const calculateBtn = document.getElementById("calculate");
const pauseBtn = document.getElementById("pause-resume");
const resetBtn = document.getElementById("reset-sim");
const resultP = document.getElementById("result");

// utility: parse input like "0.5 times" or "Original"
function parseMassInput(value, defaultVal) {
  if (!value) return defaultVal;
  value = value.toString().trim().toLowerCase();
  if (value.includes("original")) return defaultVal;
  if (value.includes("times")) {
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) return defaultVal * num;
  }
  // if user typed number directly
  const asNum = parseFloat(value);
  if (!isNaN(asNum)) return asNum;
  return defaultVal;
}

// compute circular angular speed for radius r given central mass M: w = sqrt(G*M/r^3)
function angularSpeed(M, r) {
  return Math.sqrt((G * M) / (r * r * r));
}

// visual speed factors (use consistent named constants)
const EARTH_VISUAL_FACTOR = 1.6 * 50;
const MOON_VISUAL_FACTOR = 3.6 * 50;

// draw helpers
function drawBackground() {
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, "rgba(6,6,12,0.6)");
  grad.addColorStop(1, "rgba(3,3,9,0.6)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawOrbit(cx, cy, radius) {
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawSun(x, y, r) {
  const glow = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 3);
  glow.addColorStop(0, "rgba(255,210,120,1)");
  glow.addColorStop(0.2, "rgba(255,180,60,0.55)");
  glow.addColorStop(1, "rgba(255,180,60,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, r * 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffd27a";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawBody(x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

// state for current simulation
let state = {
  // angles in radians
  earthAngle: 0,
  moonAngle: 0,
  earthOrbitRadius: BASE_EARTH_ORBIT,
  moonOrbitRadius: BASE_MOON_ORBIT
};

function resizeCanvasToParent() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.min(760, rect.width * devicePixelRatio);
  canvas.height = Math.min(460, 460 * devicePixelRatio);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(1 / devicePixelRatio, 1 / devicePixelRatio);
}
window.addEventListener("resize", () => {
  resizeCanvasToParent();
});
resizeCanvasToParent();

// main simulation step
function simulationStep(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = (timestamp - lastTime) / 1000; // seconds
  lastTime = timestamp;
  if (!simPaused) simTime += dt;

  // center coordinates
  const cx = canvas.width / (2 * devicePixelRatio);
  const cy = canvas.height / (2 * devicePixelRatio);

  // draw background and orbits
  drawBackground();

  // Sun drawing in center (visual scale based on mass)
  const sunRadius = BASE_SUN_RADIUS * Math.max(0.7, Math.min(2.2, Math.cbrt(simParams.sunMass / DEFAULT_SUN_MASS)));
  drawSun(cx, cy, sunRadius);

  // compute current orbital radii (kept fixed for logical behavior)
  const earthR = state.earthOrbitRadius;
  const moonR = state.moonOrbitRadius;

  // compute angular speeds based on scaled masses
  const wEarth = angularSpeed(simParams.sunMass, earthR);
  const wMoon = angularSpeed(simParams.earthMass, moonR);

  // advance angles (scaled visually using consistent factors)
  if (!simPaused) {
    state.earthAngle += wEarth * dt * EARTH_VISUAL_FACTOR;
    state.moonAngle += wMoon * dt * MOON_VISUAL_FACTOR;
  }

  // Earth position
  const earthX = cx + Math.cos(state.earthAngle) * earthR;
  const earthY = cy + Math.sin(state.earthAngle) * earthR;

  // Moon position relative to Earth
  const moonX = earthX + Math.cos(state.moonAngle) * moonR;
  const moonY = earthY + Math.sin(state.moonAngle) * moonR;

  // draw orbits
  drawOrbit(cx, cy, earthR);
  drawOrbit(earthX, earthY, moonR);

  // draw earth and moon
  const earthRadius = BASE_EARTH_RADIUS * Math.max(0.6, Math.cbrt(simParams.earthMass / DEFAULT_EARTH_MASS));
  drawBody(earthX, earthY, earthRadius, "#7fbfff");

  const moonRadius = BASE_MOON_RADIUS * Math.max(0.5, Math.cbrt(simParams.moonMass / DEFAULT_MOON_MASS));
  drawBody(moonX, moonY, moonRadius, "#dcdcdc");

  // small labels
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "12px Poppins, sans-serif";
  ctx.fillText("Sun", cx + sunRadius + 6, cy - sunRadius - 6);
  ctx.fillText("Earth", earthX + earthRadius + 6, earthY - 6);
  ctx.fillText("Moon", moonX + moonRadius + 6, moonY - 6);

  // compute theoretical periods (based on w) and visual periods (based on the animation multiplier)
  const earthPeriodTheoretical = isFinite(wEarth) && wEarth !== 0 ? (2 * Math.PI) / wEarth : Infinity;
  const moonPeriodTheoretical  = isFinite(wMoon) && wMoon !== 0 ? (2 * Math.PI) / wMoon : Infinity;

  // visual angular speeds
  const wEarthVisual = wEarth * EARTH_VISUAL_FACTOR;
  const wMoonVisual  = wMoon  * MOON_VISUAL_FACTOR;

  const earthPeriodVisual = isFinite(wEarthVisual) && wEarthVisual !== 0 ? (2 * Math.PI) / wEarthVisual : Infinity;
  const moonPeriodVisual  = isFinite(wMoonVisual) && wMoonVisual !== 0 ? (2 * Math.PI) / wMoonVisual : Infinity;

  // display results (guard Infinity/NaN)
  function fmt(v) {
    return isFinite(v) ? v.toFixed(2) : "—";
  }

  resultP.textContent =
    `Earth period — theoretical: ${fmt(earthPeriodTheoretical)}s, visual: ${fmt(earthPeriodVisual)}s · ` +
    `Moon period — theoretical: ${fmt(moonPeriodTheoretical)}s, visual: ${fmt(moonPeriodVisual)}s`;

  // request next frame
  rafId = requestAnimationFrame(simulationStep);
}

// Simulation control functions
function startSimulation() {
  // parse inputs and set simParams
  simParams.sunMass = parseMassInput(massSunInput.value, DEFAULT_SUN_MASS);
  simParams.earthMass = parseMassInput(massEarthInput.value, DEFAULT_EARTH_MASS);
  simParams.moonMass = parseMassInput(massMoonInput.value, DEFAULT_MOON_MASS);

  // map large inputs to visual space (ensure positive)
  if (simParams.sunMass <= 0) simParams.sunMass = DEFAULT_SUN_MASS;
  if (simParams.earthMass <= 0) simParams.earthMass = DEFAULT_EARTH_MASS;
  if (simParams.moonMass <= 0) simParams.moonMass = DEFAULT_MOON_MASS;

  // keep fixed orbit radii (logical)
  state.earthOrbitRadius = BASE_EARTH_ORBIT;
  state.moonOrbitRadius = BASE_MOON_ORBIT;

  simPaused = false;
  simRunning = true;
  lastTime = 0;
  // ensure RAF loop running
  if (!rafId) rafId = requestAnimationFrame(simulationStep);
  pauseBtn.textContent = "Pause";
}

function pauseSimulation() {
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
  // reset state angles
  state.earthAngle = 0;
  state.moonAngle = 0;
  // reset radii to base
  state.earthOrbitRadius = BASE_EARTH_ORBIT;
  state.moonOrbitRadius = BASE_MOON_ORBIT;
  // clear canvas visually
  ctx.clearRect(0,0,canvas.width,canvas.height);
  resultP.textContent = "Simulation reset. Click 'Simulate Orbit' to start.";
  pauseBtn.textContent = "Pause";
  // redraw once
  resizeCanvasToParent();
  drawBackground();
  const cx = canvas.width / (2 * devicePixelRatio);
  const cy = canvas.height / (2 * devicePixelRatio);
  drawSun(cx, cy, BASE_SUN_RADIUS);
}

function onCalculateClicked() {
  startSimulation();
}

// attach UI handlers
calculateBtn.addEventListener("click", onCalculateClicked);

pauseBtn.addEventListener("click", () => {
  if (!simRunning) return;
  togglePauseResume();
});

resetBtn.addEventListener("click", resetSimulation);

// make Enter key on inputs trigger simulate
[massSunInput, massEarthInput, massMoonInput].forEach(inp => {
  inp.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      startSimulation();
    }
  });
});

// initialize option buttons to set textual values (0.25 times, etc.)
document.querySelectorAll(".options-row").forEach(row => {
  row.querySelectorAll(".option-btn").forEach(btn => {
    btn.addEventListener("click", (ev) => {
      // value applies to the preceding input element
      const input = row.previousElementSibling;
      // set input value directly (same text as button)
      input.value = btn.textContent;
      // trigger a small animation (already handled above)
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
