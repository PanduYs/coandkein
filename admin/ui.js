// ══════════════════════════════════════════════════════════════
//  CO&KEIN ADMIN — UI
//  View switching, stats, table rendering
// ══════════════════════════════════════════════════════════════

const viewTitles = {
  overview: "Dashboard",
  products: "Products",
  settings: "Site Settings",
  password: "Change Password",
};

function showView(name, btn) {
  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.remove("active"));
  document
    .querySelectorAll(".nav-item")
    .forEach((b) => b.classList.remove("active"));
  const el = document.getElementById("view-" + name);
  if (el) el.classList.add("active");
  if (btn) btn.classList.add("active");
  document.getElementById("topbarTitle").textContent = viewTitles[name] || name;
  if (name === "overview") {
    refreshStats();
    renderOverview();
  }
  if (name === "products") renderProductsTable();
  if (name === "settings") loadSettings();
}

function refreshStats() {
  const p = getProducts();
  document.getElementById("statTotal").textContent = p.length;
  document.getElementById("statAvail").textContent = p.filter(
    (x) => x.available,
  ).length;
  document.getElementById("statSold").textContent = p.filter(
    (x) => !x.available,
  ).length;
}

function renderOverview() {
  const products = getProducts().slice(0, 5);
  const el = document.getElementById("overviewProductsList");
  if (!products.length) {
    el.innerHTML =
      '<p style="color:var(--muted); font-size:.82rem; padding:.75rem 0">No products yet. <button onclick="openAddModal()" style="color:var(--red); background:none; border:none; cursor:pointer; font-size:.82rem; text-decoration:underline">Add one →</button></p>';
    return;
  }
  el.innerHTML = `<table class="products-table">
    <thead><tr><th>Product</th><th>Collection</th><th>Status</th><th>Badge</th><th></th></tr></thead>
    <tbody>${products.map(productRow).join("")}</tbody>
  </table>`;
}

function productRow(p) {
  const thumbHTML = p.image
    ? `<div class="product-thumb"><img src="${p.image}" alt="${p.name}"></div>`
    : `<div class="product-thumb">${p.name.charAt(0)}</div>`;
  const badgeCls =
    { new: "badge-new", limited: "badge-ltd", sold: "badge-sold" }[p.badge] ||
    "";
  return `<tr>
    <td>
      <div class="product-row-info">
        ${thumbHTML}
        <div>
          <div class="product-row-name">${p.name}</div>
          <div class="product-row-type">${p.type || "—"}</div>
        </div>
      </div>
    </td>
    <td>${p.collection || "—"}</td>
    <td>${p.price || "—"}</td>
    <td><span class="badge ${p.available ? "badge-avail" : "badge-sold"}">${
      p.available ? "Available" : "Sold Out"
    }</span></td>
    <td>${p.badge ? `<span class="badge ${badgeCls}">${p.badge.toUpperCase()}</span>` : "—"}</td>
    <td>
      <div class="tbl-actions">
        <button class="tbl-btn" onclick='openEditModal(${JSON.stringify(p)})'>Edit</button>
        <button class="tbl-btn del" onclick="askDelete('${p.id}','${p.name.replace(/'/g, "\\'")}')"  >Del</button>
      </div>
    </td>
  </tr>`;
}

function renderProductsTable() {
  const products = getProducts();
  const tbody = document.getElementById("productsTableBody");
  if (!products.length) {
    tbody.innerHTML =
      "<tr class='empty-row'><td colspan='6'>No products yet — add one above</td></tr>";
    return;
  }
  tbody.innerHTML = products.map(productRow).join("");
}
