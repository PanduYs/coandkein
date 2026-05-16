// ══════════════════════════════════════════════════════════════
//  CO&KEIN ADMIN — MAIN
//  Initialization, event listeners, notifications
// ══════════════════════════════════════════════════════════════

function initDashboard() {
  refreshStats();
  renderOverview();
  renderProductsTable();
  loadSettings();
}

window.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem(SESSION_KEY)) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    initDashboard();
  }
});

let toastTimer;
function showToast(msg, isError = false) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = isError ? "error show" : "show";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.className = ""), 3500);
}

document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("open");
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document
      .querySelectorAll(".modal-overlay")
      .forEach((o) => o.classList.remove("open"));
  }
});
