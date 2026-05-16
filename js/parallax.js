// ══════════════════════════════════════════════════════════════
//  CO&KEIN — PARALLAX
//  Parallax scroll effect, navbar hide/show
// ══════════════════════════════════════════════════════════════

let raf = false;
let lastScrollY = 0;
const logo = document.getElementById("heroLogoWrap");
const center = document.getElementById("heroCenter");
const navbar = document.getElementById("navbar");

function onScroll() {
  if (!raf) {
    requestAnimationFrame(tick);
    raf = true;
  }
}

function tick() {
  const sy = window.scrollY;
  const vh = window.innerHeight;

  if (logo) logo.style.transform = `translateY(${sy * 0.4}px)`;

  if (center) {
    const fade = Math.max(0, 1 - sy / (vh * 0.55));
    center.style.transform = `translateY(${sy * 0.12}px)`;
    center.style.opacity = fade;
  }

  navbar.classList.toggle("scrolled", sy > 60);

  if (sy > 80) {
    navbar.classList.toggle("nav-hidden", sy > lastScrollY);
  } else {
    navbar.classList.remove("nav-hidden");
  }
  lastScrollY = sy;

  raf = false;
}

window.addEventListener("scroll", onScroll, { passive: true });
