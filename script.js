// ======= GSAP Intro Animations =======
gsap.timeline()
  .from(".logo", {
    y: -40,
    opacity: 0,
    duration: 1.2,
    ease: "back.out(1.7)"
  })
  .from("#page1 h1", {
    opacity: 0,
    scale: 0.9,
    y: 30,
    duration: 1,
    ease: "power3.out"
  }, "-=0.4")
  .from("#page1 p", {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.4")
  .from(".credits-wrapper", {
    opacity: 0,
    y: 40,
    duration: 1.2,
    ease: "elastic.out(1, 0.5)"
  }, "-=0.5");

// Floating logo animation
gsap.to(".logo", {
  y: 10,
  repeat: -1,
  yoyo: true,
  duration: 2,
  ease: "sine.inOut"
});

// ======= Continuous Name Scroll =======
const names = document.querySelector(".group-names");
names.innerHTML += names.innerHTML; // Duplicate for seamless loop
const namesWidth = names.scrollWidth / 2;

gsap.to(".group-names", {
  x: -namesWidth,
  repeat: -1,
  duration: 25,
  ease: "none"
});

// ======= Smooth Scroll on Wheel =======
document.addEventListener("wheel", (e) => {
  if (e.deltaY > 0) {
    gsap.to(window, {
      scrollTo: "#page2",
      duration: 0.5,
      ease: "power2.inOut"
    });
  }
});

// ======= Section Scroll Animations =======
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

// ======= SPACE BACKGROUND ANIMATION =======
const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");
let w, h;
let stars = [];
let shootingStars = [];

// Resize canvas dynamically
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// Generate stars
for (let i = 0; i < 150; i++) {
  stars.push({
    x: Math.random() * w,
    y: Math.random() * h,
    radius: Math.random() * 1.2,
    alpha: Math.random(),
    twinkleSpeed: 0.02 + Math.random() * 0.08
  });
}

// Draw stars
function drawStars() {
  ctx.clearRect(0, 0, w, h);
  for (let star of stars) {
    star.alpha += star.twinkleSpeed * (Math.random() > 0.5 ? 1 : -1);
    star.alpha = Math.max(0.2, Math.min(1, star.alpha));
    ctx.globalAlpha = star.alpha;
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// Create shooting stars
function spawnShootingStar() {
  const startX = Math.random() * w;
  const startY = Math.random() * h * 0.5;
  const length = 200 + Math.random() * 100;
  const speed = 10 + Math.random() * 5;
  shootingStars.push({ x: startX, y: startY, len: length, speed });
}

// Draw shooting stars
function drawShootingStars() {
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.len, s.y + s.len / 2);
    ctx.stroke();

    s.x -= s.speed;
    s.y += s.speed * 0.5;
    s.len -= 8;

    if (s.len < 0) shootingStars.splice(i, 1);
  }
}

// Animate background
function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, w, h);
  drawStars();
  drawShootingStars();
  requestAnimationFrame(animate);
}
animate();

// Spawn shooting stars occasionally
setInterval(() => {
  if (Math.random() > 0.7) spawnShootingStar();
}, 3000);

// ======= MOUSE PARALLAX =======
document.addEventListener("mousemove", (e) => {
  const offsetX = (e.clientX / window.innerWidth - 0.5) * 20;
  const offsetY = (e.clientY / window.innerHeight - 0.5) * 20;
  gsap.to("header, #page1", {
    x: offsetX,
    y: offsetY,
    duration: 1,
    ease: "power2.out"
  });
});
