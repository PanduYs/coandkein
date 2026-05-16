// ══════════════════════════════════════════════════════════════
//  CO&KEIN ADMIN — SETTINGS
//  Site configuration, password management
// ══════════════════════════════════════════════════════════════

let aboutVisualImgBase64 = "";
let aboutVisualUrlMode = false;

function exportDataJson() {
  const data = {
    products: getProducts(),
    config: getConfig(),
    pass: getPass(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.json";
  a.click();
  URL.revokeObjectURL(url);
  showToast("data.json berhasil didownload! Ganti file lama lalu git push.");
}

function loadSettings() {
  const c = getConfig();
  document.getElementById("cfgDropTitle").value = c.dropTitle;
  document.getElementById("cfgAboutTitle").value = c.aboutTitle;
  document.getElementById("cfgAboutBody").value = c.aboutBody;
  document.getElementById("cfgShopLink").value = c.shopLink;
  document.getElementById("cfgGhToken").value = localStorage.getItem(GH_TOKEN_KEY) || "";

  aboutVisualImgBase64 = c.aboutVisualImg || "";
  const prev = document.getElementById("aboutVisualPreview");
  if (c.aboutVisualImg) {
    prev.src = c.aboutVisualImg;
    prev.classList.add("show");
    if (!c.aboutVisualImg.startsWith("data:")) {
      aboutVisualUrlMode = true;
      document.getElementById("aboutImgUrlWrap").classList.add("show");
      document.getElementById("cfgAboutVisualImg").value = c.aboutVisualImg;
    }
  } else {
    prev.src = "";
    prev.classList.remove("show");
  }
}

function saveSettings() {
  const urlVal = document.getElementById("cfgAboutVisualImg").value.trim();
  const finalImg = urlVal ? urlVal : aboutVisualImgBase64;
  const c = {
    dropTitle:
      document.getElementById("cfgDropTitle").value.trim() || "DROP 004",
    aboutTitle: document.getElementById("cfgAboutTitle").value.trim(),
    aboutBody: document.getElementById("cfgAboutBody").value.trim(),
    shopLink:
      document.getElementById("cfgShopLink").value.trim() ||
      "https://www.instagram.com/coandkein/",
    aboutVisualImg: finalImg,
  };
  const token = document.getElementById("cfgGhToken").value.trim();
  if (token) localStorage.setItem(GH_TOKEN_KEY, token);
  saveConfig(c);
  syncToGitHub().then(ok => {
    showToast(ok ? "Saved & synced ke GitHub!" : "Saved! (GitHub sync gagal — cek token)");
  });
}

function handleAboutVisualUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 8 * 1024 * 1024) {
    showToast("Image too large (max 8MB)", true);
    return;
  }
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const MAX = 1200;
      let w = img.width, h = img.height;
      if (w > MAX) { h = (MAX / w) * h; w = MAX; }
      canvas.width = Math.round(w);
      canvas.height = Math.round(h);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL("image/jpeg", 0.8);
      try {
        const resp = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64 }),
        });
        const { url } = await resp.json();
        aboutVisualImgBase64 = url;
      } catch {
        aboutVisualImgBase64 = base64;
      }
      const prev = document.getElementById("aboutVisualPreview");
      prev.src = aboutVisualImgBase64;
      prev.classList.add("show");
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function toggleAboutVisualUrlMode() {
  aboutVisualUrlMode = !aboutVisualUrlMode;
  document.getElementById("aboutImgUrlWrap").classList.toggle("show", aboutVisualUrlMode);
}

function previewAboutVisualUrl(url) {
  if (!url) return;
  aboutVisualImgBase64 = "";
  const prev = document.getElementById("aboutVisualPreview");
  prev.src = url;
  prev.classList.add("show");
}

function clearAboutVisualImg() {
  aboutVisualImgBase64 = "";
  aboutVisualUrlMode = false;
  document.getElementById("cfgAboutVisualImg").value = "";
  document.getElementById("aboutImgFile").value = "";
  document.getElementById("aboutImgUrlWrap").classList.remove("show");
  const prev = document.getElementById("aboutVisualPreview");
  prev.src = "";
  prev.classList.remove("show");
}

function changePassword() {
  const cur = document.getElementById("curPass").value;
  const nw = document.getElementById("newPass").value;
  const conf = document.getElementById("confPass").value;
  if (cur !== getPass()) {
    showToast("Current password incorrect", true);
    return;
  }
  if (nw.length < 6) {
    showToast("New password must be at least 6 characters", true);
    return;
  }
  if (nw !== conf) {
    showToast("Passwords do not match", true);
    return;
  }
  savePass(nw);
  document.getElementById("curPass").value = "";
  document.getElementById("newPass").value = "";
  document.getElementById("confPass").value = "";
  showToast("Password changed successfully!");
}
