// ══════════════════════════════════════════════════════════════
//  CO&KEIN — RENDERER
//  DOM rendering: ticker, config, products
// ══════════════════════════════════════════════════════════════

function buildTicker() {
  const phrases = [
    "STOP SETTLING FOR THE NOISE OF FAST FASHION",
    "ELEVATE YOUR AURA",
    "BE THE CALM IN THE CHAOS",
    "DM FOR ORDER",
    "CO &amp; KEIN",
    "PREMIUM STREETWEAR",
    "DRESS LIKE YOU OWN THE SILENCE",
  ];
  const track = document.getElementById("tickerTrack");
  let html = "";
  for (let r = 0; r < 2; r++) {
    phrases.forEach((p) => {
      html += `<span>${p}</span><span class="dot">·</span>`;
    });
  }
  track.innerHTML = html;
}

function applyConfig() {
  const c = getConfig();
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el && val) el.innerHTML = val.replace(/\n/g, "<br>");
  };
  set("dropTitle", c.dropTitle);
  set("aboutTitle", c.aboutTitle);
  set("aboutBody", c.aboutBody);
  const visualImg = document.getElementById("aboutVisualImgEl");
  if (visualImg) {
    if (c.aboutVisualImg) {
      visualImg.src = c.aboutVisualImg;
      visualImg.classList.add("visible");
    } else {
      visualImg.src = "";
      visualImg.classList.remove("visible");
    }
  }
  document
    .querySelectorAll('a[href*="instagram.com/coandkein"]')
    .forEach((a) => {
      if (c.shopLink) a.href = c.shopLink;
    });
}

function badgeHTML(badge, available) {
  if (!available)
    return '<span class="product-badge badge-sold">SOLD OUT</span>';
  if (badge === "new")
    return '<span class="product-badge badge-new">NEW DROP</span>';
  if (badge === "limited")
    return '<span class="product-badge badge-ltd">LIMITED</span>';
  return "";
}

function renderProducts() {
  const products = getProducts();
  const config = getConfig();
  const grid = document.getElementById("productsGrid");

  if (!products.length) {
    grid.innerHTML = `<div class="products-empty">
      <p>Collection coming soon — follow <a href="${config.shopLink}" target="_blank" style="color:var(--red)">@coandkein</a></p>
    </div>`;
    return;
  }

  grid.innerHTML = products
    .map(
      (p, i) => `
    <a href="${p.link || config.shopLink}" target="_blank" rel="noopener"
       class="product-card reveal d${(i % 3) + 1}">
      <div class="product-img-wrap">
        ${
          p.image
            ? `<img src="${p.image}" alt="${p.name}" loading="lazy">`
            : `<div class="product-placeholder">
               <div class="product-placeholder-char">${p.name.charAt(0)}</div>
               <div class="product-placeholder-icon">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1">
                   <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>
                   <line x1="15" y1="3" x2="15" y2="21"/>
                 </svg>
               </div>
             </div>`
        }
        <div class="product-overlay">
          <span class="product-overlay-btn">DM FOR ORDER →</span>
        </div>
        ${badgeHTML(p.badge, p.available)}
      </div>
      <div>
        <p class="product-col">${p.collection}</p>
        <p class="product-name">${p.name}</p>
        <p class="product-price">${p.price}</p>
      </div>
    </a>
  `,
    )
    .join("");
}
