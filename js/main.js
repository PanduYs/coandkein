// ══════════════════════════════════════════════════════════════
//  CO&KEIN — MAIN
//  Page initialization, event listeners
// ══════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", async () => {
  await initData();
  buildTicker();
  applyConfig();
  renderProducts();
  setTimeout(observeReveals, 150);
});
