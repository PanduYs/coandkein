// ══════════════════════════════════════════════════════════════
//  CO&KEIN ADMIN — PRODUCTS
//  Product CRUD, modals, image handling
// ══════════════════════════════════════════════════════════════

let deleteTargetId = null;
let imgBase64 = "";
let urlMode = false;

function openAddModal() {
  resetModal();
  document.getElementById("modalTitle").textContent = "Add Product";
  document.getElementById("productModal").classList.add("open");
}

function openEditModal(p) {
  resetModal();
  document.getElementById("modalTitle").textContent = "Edit Product";
  document.getElementById("prodId").value = p.id;
  document.getElementById("prodName").value = p.name;
  document.getElementById("prodCollection").value = p.collection || "";
  document.getElementById("prodType").value = p.type || "";
  document.getElementById("prodPrice").value = p.price || "";
  document.getElementById("prodBadge").value = p.badge || "";
  document.getElementById("prodLink").value = p.link || "";
  document.getElementById("prodAvail").checked = p.available !== false;
  if (p.image) {
    imgBase64 = p.image;
    const prev = document.getElementById("imgPreview");
    prev.src = p.image;
    prev.classList.add("show");
    if (!p.image.startsWith("data:")) {
      urlMode = true;
      document.getElementById("imgUrlWrap").classList.add("show");
      document.getElementById("prodImgUrl").value = p.image;
    }
  }
  document.getElementById("productModal").classList.add("open");
}

function resetModal() {
  document.getElementById("prodId").value = "";
  document.getElementById("prodName").value = "";
  document.getElementById("prodCollection").value = "DROP 004";
  document.getElementById("prodType").value = "";
  document.getElementById("prodPrice").value = "DM FOR INFO";
  document.getElementById("prodBadge").value = "new";
  document.getElementById("prodLink").value = "";
  document.getElementById("prodAvail").checked = true;
  document.getElementById("imgPreview").classList.remove("show");
  document.getElementById("imgPreview").src = "";
  document.getElementById("imgUrlWrap").classList.remove("show");
  document.getElementById("prodImgUrl").value = "";
  document.getElementById("imgFile").value = "";
  imgBase64 = "";
  urlMode = false;
}

function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

function handleImgUpload(e) {
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
      const MAX = 900;
      let w = img.width, h = img.height;
      if (w > MAX) { h = (MAX / w) * h; w = MAX; }
      if (h > MAX * 1.4) { w = ((MAX * 1.4) / h) * w; h = MAX * 1.4; }
      canvas.width = Math.round(w);
      canvas.height = Math.round(h);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL("image/jpeg", 0.72);
      // Try to save as file on server so HP can access it
      try {
        const resp = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64 }),
        });
        const { url } = await resp.json();
        imgBase64 = url;
      } catch {
        imgBase64 = base64; // fallback: store as base64
      }
      const prev = document.getElementById("imgPreview");
      prev.src = imgBase64;
      prev.classList.add("show");
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function toggleUrlMode() {
  urlMode = !urlMode;
  document.getElementById("imgUrlWrap").classList.toggle("show", urlMode);
}

function previewUrl(url) {
  if (!url) return;
  imgBase64 = url;
  const prev = document.getElementById("imgPreview");
  prev.src = url;
  prev.classList.add("show");
}

function saveProduct() {
  const name = document.getElementById("prodName").value.trim();
  if (!name) {
    showToast("Product name is required", true);
    return;
  }

  const urlVal = document.getElementById("prodImgUrl").value.trim();
  const finalImg = urlVal ? urlVal : imgBase64;

  const prod = {
    id: document.getElementById("prodId").value || "p" + Date.now(),
    name: name.toUpperCase(),
    collection:
      document.getElementById("prodCollection").value.trim() || "DROP 004",
    type: document.getElementById("prodType").value.trim(),
    price: document.getElementById("prodPrice").value.trim() || "DM FOR INFO",
    badge: document.getElementById("prodBadge").value,
    link: document.getElementById("prodLink").value.trim(),
    image: finalImg,
    available: document.getElementById("prodAvail").checked,
  };

  const products = getProducts();
  const idx = products.findIndex((p) => p.id === prod.id);
  if (idx >= 0) products[idx] = prod;
  else products.push(prod);
  saveProducts(products);

  closeModal("productModal");
  refreshStats();
  renderProductsTable();
  renderOverview();
  showToast(idx >= 0 ? "Product updated!" : "Product added!");
}

function askDelete(id, name) {
  deleteTargetId = id;
  document.getElementById("delMsg").textContent =
    `Delete "${name}"? This cannot be undone.`;
  document.getElementById("deleteModal").classList.add("open");
}

function confirmDelete() {
  if (!deleteTargetId) return;
  const products = getProducts().filter((p) => p.id !== deleteTargetId);
  saveProducts(products);
  deleteTargetId = null;
  closeModal("deleteModal");
  refreshStats();
  renderProductsTable();
  renderOverview();
  showToast("Product deleted.");
}
