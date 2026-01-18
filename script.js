// ================================
// GSAP + UI Animations
// ================================
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const TIME_SCALE = 40;

// Marquee Names Animation
const namesContainer = document.querySelector(".group-names");
if (namesContainer) {
  namesContainer.innerHTML += namesContainer.innerHTML;
  const width = namesContainer.scrollWidth / 2;
  gsap.to(namesContainer, { x: -width, repeat: -1, duration: 25, ease: "none" });
}

// Initial Page Animations
gsap.timeline()
  .from(".logo", { y: -40, opacity: 0, duration: 1.2, ease: "back.out(1.7)" })
  .from("#page1 h1", { opacity: 0, scale: 0.9, y: 30, duration: 1 }, "-=0.4")
  .from("#page1 p", { opacity: 0, y: 20, duration: 0.8 }, "-=0.4")
  .from(".credits-wrapper", { opacity: 0, y: 40, duration: 1 }, "-=0.5");

gsap.to(".logo", { y: 10, repeat: -1, yoyo: true, duration: 2 });

// ================================
// Starfield
// ================================
const starCanvas = document.getElementById("starfield");
const starCtx = starCanvas.getContext("2d");
let stars = [];

function resizeStarfield() {
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
}
resizeStarfield();
window.addEventListener("resize", resizeStarfield);

for (let i = 0; i < 180; i++) {
  stars.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5,
    a: Math.random(),
    t: 0.01 + Math.random() * 0.03
  });
}

function animateStars() {
  starCtx.fillStyle = "rgba(0,0,0,0.25)";
  starCtx.fillRect(0, 0, starCanvas.width, starCanvas.height);

  for (let s of stars) {
    s.a += s.t * (Math.random() > 0.5 ? 1 : -1);
    s.a = Math.max(0.2, Math.min(1, s.a));
    starCtx.globalAlpha = s.a;
    starCtx.beginPath();
    starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    starCtx.fillStyle = "white";
    starCtx.fill();
  }
  starCtx.globalAlpha = 1;
  requestAnimationFrame(animateStars);
}
animateStars();

// ================================
// Gravitational Simulation
// ================================
const gravSection = document.getElementById("grav-fullscreen");
const canvas = document.getElementById("orbit-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

const G = 0.06;
const SUN_BASE_MASS = 1000;

let bodies = [];
let running = false;
let paused = false;
let lastTime = 0;

// ================================
// Body Class
// ================================
class Body {
  constructor(x, y, vx, vy, mass, radius, color, name) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.mass = mass;
    this.radius = radius;
    this.color = color;
    this.name = name;
    this.path = [];
    this.destroyed = false;
  }

  update(dt, sun) {
    if (this.destroyed) return;

    const dx = sun.x - this.x;
    const dy = sun.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const acc = (G * sun.mass) / (dist * dist);
    this.vx += acc * dx / dist * dt;
    this.vy += acc * dy / dist * dt;

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.path.push({ x: this.x, y: this.y });
    if (this.path.length > 250) this.path.shift();

    if (dist < sun.radius + this.radius) {
      this.destroyed = true;
    }
  }

  draw() {
    if (this.destroyed) return;

    if (this.path.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.path[0].x, this.path[0].y);
      for (let p of this.path) ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "12px Poppins";
    ctx.fillText(this.name, this.x + 6, this.y - 6);
  }
}

// ================================
// Mass Parsing
// ================================
function getSunMass() {
  const val = document.getElementById("mass-sun").value.toLowerCase();
  if (val.includes("0.25")) return SUN_BASE_MASS * 0.25;
  if (val.includes("0.5")) return SUN_BASE_MASS * 0.5;
  if (val.includes("1.5")) return SUN_BASE_MASS * 1.5;
  if (val.includes("2")) return SUN_BASE_MASS * 2;
  if (val.includes("3")) return SUN_BASE_MASS * 3;
  return SUN_BASE_MASS;
}

// ================================
// Initialize Bodies
// ================================
function initBodies() {
  bodies = [];
  const cx = canvas.clientWidth / 2;
  const cy = canvas.clientHeight / 2;

  const sunMass = getSunMass();
  const sun = new Body(cx, cy, 0, 0, sunMass, 26, "#ffd27a", "Sun");
  bodies.push(sun);

  const planets = [
    ["Mercury", 70, 4, "#c7c7c7"],
    ["Venus", 100, 6, "#e7c56a"],
    ["Earth", 140, 7, "#7fbfff"],
    ["Mars", 180, 5, "#f08b66"],
    ["Jupiter", 230, 11, "#f4d9b6"],
    ["Saturn", 280, 10, "#edd5a0"]
  ];

  planets.forEach((p, i) => {
    let r = p[1];
    let eccentricity = 1;

    if (sunMass >= SUN_BASE_MASS * 2) {
      if (i === 0) eccentricity = 0.7; // Mercury
      if (i === 1) eccentricity = 0.85; // Venus
    }

    if (sunMass >= SUN_BASE_MASS * 3 && i <= 1) {
      eccentricity = 0.5;
    }

    // Adjust distance for smaller Sun mass
    if (sunMass < SUN_BASE_MASS) r *= (SUN_BASE_MASS / sunMass);

    const v = Math.sqrt(G * sun.mass / r) * eccentricity;
    bodies.push(new Body(cx + r, cy, 0, v, 1, p[2], p[3], p[0]));
  });
}

// ================================
// Animation Loop
// ================================
function animate(time) {
  if (!running) return;

  if (!lastTime) lastTime = time;
  const dt = (time - lastTime) / 1000 * TIME_SCALE;
  lastTime = time;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!paused) {
    for (let i = 1; i < bodies.length; i++) {
      bodies[i].update(dt, bodies[0]);
    }
  }

  bodies.forEach(b => b.draw());
  requestAnimationFrame(animate);
}

// ================================
// Info Scroll Function
// ================================
function startInfoScroll() {
  const infoContainer = document.querySelector(".info-scroll");
  if (!infoContainer) return;

  const totalHeight = infoContainer.scrollHeight;

  gsap.fromTo(infoContainer,
    { y: window.innerHeight },
    { y: -totalHeight,
      duration: 40,
      ease: "linear",
      repeat: -1
    }
  );
}

// ================================
// Controls
// ================================
function startSimulation() {
  running = true;
  paused = false;
  lastTime = 0;
  initBodies();
  requestAnimationFrame(animate);
}

function resetSimulation() {
  running = false;
  paused = false;
  bodies = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.getElementById("calculate").onclick = () => {
  startSimulation();
  startInfoScroll(); // scroll info at the same time
};

document.getElementById("pause-resume").onclick = () => paused = !paused;
document.getElementById("reset-sim").onclick = resetSimulation;

document.querySelectorAll(".option-btn").forEach(btn => {
  btn.onclick = () => {
    document.getElementById("mass-sun").value = btn.innerText.replace("times", "").trim();
  };
});

// ================================
// Open / Close Simulation
// ================================
document.querySelector(".sec-1").onclick = () => {
  gravSection.style.display = "flex";
  gsap.to(window, {
    scrollTo: gravSection,
    duration: 1.2,
    onComplete: () => {
      resizeCanvas();
      startSimulation();
    }
  });
};

const closeBtn = document.createElement("button");
closeBtn.innerText = "Close Simulation";
Object.assign(closeBtn.style, {
  position: "absolute",
  top: "20px",
  right: "20px",
  padding: "10px 15px",
  background: "#00ffcc",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  zIndex: 10
});
gravSection.appendChild(closeBtn);

closeBtn.onclick = () => {
  resetSimulation();
  gsap.to(window, {
    scrollTo: 0,
    duration: 1,
    onComplete: () => gravSection.style.display = "none"
  });
};
