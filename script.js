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

gsap.to(".logo", {
  y: 10,
  repeat: -1,
  yoyo: true,
  duration: 2,
  ease: "sine.inOut"
});

const names = document.querySelector(".group-names");
names.innerHTML += names.innerHTML; // Duplicate for seamless loop
const namesWidth = names.scrollWidth / 2;

gsap.to(".group-names", {
  x: -namesWidth,
  repeat: -1,
  duration: 25,
  ease: "none"
});

document.addEventListener("wheel", (e) => {
  if (e.deltaY > 0) {
    gsap.to(window, { scrollTo: "#page2", duration: 1.5, ease: "power2.inOut" });
  }
});

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
