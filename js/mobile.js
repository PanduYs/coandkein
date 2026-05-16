// ══════════════════════════════════════════════════════════════
//  CO&KEIN — MOBILE MENU
//  Hamburger menu, mobile navigation toggle
// ══════════════════════════════════════════════════════════════

const ham = document.getElementById("hamburger");
const menu = document.getElementById("mobileMenu");

ham.addEventListener("click", () => {
  ham.classList.toggle("open");
  menu.classList.toggle("open");
  document.body.style.overflow = menu.classList.contains("open")
    ? "hidden"
    : "";
});

function closeMenu() {
  ham.classList.remove("open");
  menu.classList.remove("open");
  document.body.style.overflow = "";
}
