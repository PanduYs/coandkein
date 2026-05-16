// ══════════════════════════════════════════════════════════════
//  CO&KEIN — ANIMATIONS
//  Intersection Observer for scroll reveal animations
// ══════════════════════════════════════════════════════════════

function observeReveals() {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
}
