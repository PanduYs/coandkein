// ══════════════════════════════════════════════════════════════
//  CO&KEIN ADMIN — AUTH
//  Login, logout, authentication
// ══════════════════════════════════════════════════════════════

function doLogin() {
  const v = document.getElementById("loginPass").value;
  if (v === getPass()) {
    sessionStorage.setItem(SESSION_KEY, "1");
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    initDashboard();
  } else {
    document.getElementById("loginErr").textContent =
      "Incorrect password. Try again.";
  }
}

function doLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
}

document.getElementById("loginPass").addEventListener("keydown", (e) => {
  if (e.key === "Enter") doLogin();
});
