(() => {
  const seedProducts = [
    { id: "p1", name: "Dew Drop Serum", category: "Skincare", price: 28, tag: "Bestseller", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80", description: "A lightweight daily serum that leaves skin feeling soft, calm, and comfortably hydrated.", ingredients: "Hyaluronic acid, aloe vera, glycerin, vitamin B5" },
    { id: "p2", name: "Soft Focus Tint", category: "Makeup", price: 24, tag: "Everyday favorite", image: "https://images.unsplash.com/photo-1631214540242-2d1f6f0f3f54?auto=format&fit=crop&w=800&q=80", description: "A sheer, blendable tint for a fresh flush of color that looks like you, only a little more rested.", ingredients: "Jojoba oil, vitamin E, mineral pigments" },
    { id: "p3", name: "Sunday Hair Oil", category: "Haircare", price: 26, tag: "Small ritual", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80", description: "A smoothing, lightweight finishing oil that brings a little shine to dry ends and flyaways.", ingredients: "Argan oil, sunflower seed oil, rosemary extract" },
    { id: "p4", name: "Cloud Nine Body Cream", category: "Bodycare", price: 32, tag: "New", image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80", description: "A rich-but-easy body cream that melts in quickly and leaves skin feeling cared for.", ingredients: "Shea butter, oat extract, squalane, vitamin E" },
    { id: "p5", name: "Morning Dew Cleanser", category: "Skincare", price: 21, tag: "Gentle daily", image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=800&q=80", description: "A gentle, creamy cleanser to lift away the day without leaving skin feeling tight.", ingredients: "Coco-glucoside, chamomile, glycerin, oat extract" },
    { id: "p6", name: "Petal Lip Balm", category: "Makeup", price: 16, tag: "Pocket-sized", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80", description: "A comfy tinted balm with a soft sheen for an easy pop of color on the go.", ingredients: "Shea butter, castor seed oil, candelilla wax" },
    { id: "p7", name: "Sunday Scalp Scrub", category: "Haircare", price: 23, tag: "Reset day", image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80", description: "A once-a-week scalp polish that helps your wash day feel like a fresh start.", ingredients: "Sea salt, peppermint, jojoba esters, aloe" },
    { id: "p8", name: "Slow Morning Bath Soak", category: "Bodycare", price: 19, tag: "Take a moment", image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80", description: "A mineral-rich soak for the days when your evening could use a softer landing.", ingredients: "Epsom salt, sea salt, lavender, calendula" }
  ];
  const fallbackImage = seedProducts[0].image;
  const read = (key, fallback) => {
    try { const raw = localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); }
    catch { return fallback; }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  };
  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const money = (value) => `$${Number(value).toFixed(2)}`;
  function getProducts() {
    const products = read("diva-products", null);
    if (products) return products;
    write("diva-products", seedProducts);
    return seedProducts;
  }
  function getCart() { return read("diva-cart", []); }
  function setCart(cart) { write("diva-cart", cart); updateCartCount(); }
  function updateCartCount() {
    const count = getCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    document.querySelectorAll("[data-cart-count]").forEach((node) => { node.textContent = count; });
  }
  function showToast(message) {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      document.body.append(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
  }
  function addToCart(id) {
    const product = getProducts().find((item) => item.id === id);
    if (!product) return;
    const cart = getCart();
    const existing = cart.find((item) => item.id === id);
    if (existing) existing.quantity = Number(existing.quantity) + 1;
    else cart.push({ id, quantity: 1 });
    setCart(cart);
    showToast(`${product.name} added to your bag`);
  }
  function closeModal(layer) {
    layer?.classList.remove("open");
    if (!document.querySelector(".modal-layer.open")) document.body.style.overflow = "";
  }
  function openProduct(product) {
    const layer = document.getElementById("productModal");
    if (!layer) return;
    layer.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="detailName"><button class="modal-close" type="button" data-close-modal aria-label="Close product details">×</button><div class="product-detail"><div class="detail-image"><img src="${safe(product.image || fallbackImage)}" alt="${safe(product.name)}"></div><div class="detail-copy"><span class="eyebrow">${safe(product.category)}</span><h2 id="detailName">${safe(product.name)}</h2><div class="detail-price">${money(product.price)}</div><p>${safe(product.description)}</p><h3>Ingredients</h3><div class="ingredients">${safe(product.ingredients || "See product packaging for full ingredient details.")}</div><button class="button" type="button" data-add="${safe(product.id)}">Add to bag · ${money(product.price)}</button></div></div></div>`;
    layer.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function initShared() {
    updateCartCount();
    const toggle = document.querySelector("[data-menu-toggle]");
    toggle?.addEventListener("click", () => {
      const nav = document.querySelector("[data-main-nav]");
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (event) => {
      const add = event.target.closest("[data-add]");
      if (add) {
        addToCart(add.dataset.add);
        if (add.closest("#productModal")) closeModal(add.closest(".modal-layer"));
      }
      if (event.target.closest("[data-close-modal]") || event.target.classList.contains("modal-layer")) closeModal(event.target.closest(".modal-layer") || event.target);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") document.querySelectorAll(".modal-layer.open").forEach(closeModal);
    });
    window.addEventListener("storage", (event) => {
      if (event.key === "diva-cart") updateCartCount();
      if (document.body.dataset.page === "cart" && (event.key === "diva-cart" || event.key === "diva-products")) renderCartPage();
      if (document.body.dataset.page === "admin" && (event.key === "diva-products" || event.key === "diva-orders")) renderAdmin();
    });
  }
  function initHome() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;
    let category = "All";
    function render() {
      const visible = getProducts().filter((product) => category === "All" || product.category === category);
      grid.innerHTML = visible.length ? visible.map((product) => `<article class="product-card"><div class="product-photo" data-product="${safe(product.id)}" role="button" tabindex="0" aria-label="View ${safe(product.name)}"><img src="${safe(product.image || fallbackImage)}" alt="${safe(product.name)}" loading="lazy"><span class="product-tag">${safe(product.tag || product.category)}</span><button class="quick-add" type="button" data-add="${safe(product.id)}" aria-label="Add ${safe(product.name)} to bag">+</button></div><div class="product-info"><div class="product-meta"><h3 class="product-name">${safe(product.name)}</h3><span class="product-price">${money(product.price)}</span></div><p class="product-category">${safe(product.category)}</p></div></article>`).join("") : '<p class="no-products">No products in this category just yet.</p>';
    }
    grid.addEventListener("click", (event) => {
      if (event.target.closest("[data-add]")) return;
      const card = event.target.closest("[data-product]");
      if (card) { const product = getProducts().find((item) => item.id === card.dataset.product); if (product) openProduct(product); }
    });
    grid.addEventListener("keydown", (event) => {
      const card = event.target.closest("[data-product]");
      if (card && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); const product = getProducts().find((item) => item.id === card.dataset.product); if (product) openProduct(product); }
    });
    document.querySelectorAll("[data-category]").forEach((button) => button.addEventListener("click", () => {
      category = button.dataset.category;
      document.querySelectorAll("[data-category]").forEach((item) => item.classList.toggle("active", item === button));
      render();
    }));
    document.getElementById("contactForm")?.addEventListener("submit", (event) => { event.preventDefault(); event.currentTarget.reset(); showToast("Thanks for your note! This demo form is ready to connect to email."); });
    const store = read("diva-store", { owner: "Diva Beauty Team", email: "hello@divabeauty.example" });
    const owner = document.getElementById("ownerName");
    const email = document.getElementById("ownerEmail");
    if (owner) owner.textContent = store.owner;
    if (email) { email.textContent = store.email; email.href = `mailto:${store.email}`; }
    render();
  }
  async function digest(password, salt) {
    if (!crypto.subtle) throw new Error("Secure browser storage is unavailable. Open the site on localhost.");
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${password}`));
    return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  function initAccount() {
    const auth = document.getElementById("authArea");
    if (!auth) return;
    const panel = document.getElementById("accountPanel");
    const feedback = document.getElementById("feedback");
    const setSession = (session) => {
      auth.hidden = Boolean(session);
      panel.classList.toggle("visible", Boolean(session));
      if (session) document.getElementById("accountGreeting").textContent = `${session.username} · ${session.email}`;
    };
    document.querySelectorAll("[data-mode]").forEach((tab) => tab.addEventListener("click", () => {
      const register = tab.dataset.mode === "register";
      document.querySelectorAll("[data-mode]").forEach((item) => { item.classList.toggle("active", item === tab); item.setAttribute("aria-selected", String(item === tab)); });
      document.getElementById("loginForm").classList.toggle("active", !register);
      document.getElementById("registerForm").classList.toggle("active", register);
      document.getElementById("accountHeading").textContent = register ? "Create your account" : "Welcome back";
      feedback.textContent = "";
    }));
    document.getElementById("registerForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const username = form.elements.username.value.trim();
      const email = form.elements.email.value.trim().toLowerCase();
      const password = form.elements.password.value;
      const accounts = read("diva-accounts", []);
      if (accounts.some((account) => account.email === email)) { feedback.textContent = "An account with that email already exists. Try logging in."; return; }
      try {
        const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, "0")).join("");
        accounts.push({ username, email, salt, passwordHash: await digest(password, salt) });
        const session = { username, email };
        if (!write("diva-accounts", accounts) || !write("diva-session", session)) throw new Error("Your browser could not save this account.");
        feedback.textContent = "Your account is ready.";
        form.reset();
        setSession(session);
      } catch (error) { feedback.textContent = error.message; }
    });
    document.getElementById("loginForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const email = form.elements.email.value.trim().toLowerCase();
      const account = read("diva-accounts", []).find((item) => item.email === email);
      if (!account) { feedback.textContent = "We couldn't find an account with that email."; return; }
      try {
        if (await digest(form.elements.password.value, account.salt) !== account.passwordHash) { feedback.textContent = "That password doesn't match. Try again."; return; }
        const session = { username: account.username, email: account.email };
        if (!write("diva-session", session)) throw new Error("Your browser could not save this session.");
        form.reset();
        feedback.textContent = "Welcome back.";
        setSession(session);
      } catch (error) { feedback.textContent = error.message; }
    });
    document.getElementById("signOutButton")?.addEventListener("click", () => { try { localStorage.removeItem("diva-session"); } catch {} setSession(null); feedback.textContent = "You've been signed out."; });
    setSession(read("diva-session", null));
  }
  function renderCartPage() {
    const root = document.getElementById("cartContents");
    if (!root) return;
    const products = getProducts();
    let cart = getCart().filter((item) => products.some((product) => product.id === item.id) && Number(item.quantity) > 0);
    write("diva-cart", cart);
    const count = cart.reduce((sum, item) => sum + Number(item.quantity), 0);
    const total = cart.reduce((sum, item) => { const product = products.find((entry) => entry.id === item.id); return sum + product.price * Number(item.quantity); }, 0);
    document.getElementById("itemCount").textContent = count;
    document.getElementById("cartTotal").textContent = money(total);
    document.getElementById("cartCountText").textContent = count ? `${count} ${count === 1 ? "item" : "items"} selected` : "Your selected products, all in one place.";
    const empty = document.getElementById("emptyCart");
    const checkout = document.getElementById("checkoutSection");
    empty.hidden = Boolean(count);
    checkout.hidden = !count;
    if (!count) { root.innerHTML = ""; updateCartCount(); return; }
    root.innerHTML = `<div class="cart-list">${cart.map((item) => {
      const product = products.find((entry) => entry.id === item.id);
      return `<article class="cart-item"><img src="${safe(product.image || fallbackImage)}" alt="${safe(product.name)}"><div><p class="item-category">${safe(product.category)}</p><h2 class="item-name">${safe(product.name)}</h2><p class="item-unit">${money(product.price)} each</p><div class="quantity-control"><button type="button" data-step="-1" data-id="${safe(product.id)}" aria-label="Decrease quantity">−</button><span class="quantity-value">${item.quantity}</span><button type="button" data-step="1" data-id="${safe(product.id)}" aria-label="Increase quantity">+</button></div></div><div class="item-end"><span class="item-total">${money(product.price * item.quantity)}</span><button class="remove-button" type="button" data-remove="${safe(product.id)}">Remove product</button></div></article>`;
    }).join("")}</div>`;
    updateCartCount();
  }
  function initCart() {
    const root = document.getElementById("cartContents");
    if (!root) return;
    root.addEventListener("click", (event) => {
      const step = event.target.closest("[data-step]");
      const remove = event.target.closest("[data-remove]");
      let cart = getCart();
      if (step) {
        const item = cart.find((entry) => entry.id === step.dataset.id);
        if (item) item.quantity = Number(item.quantity) + Number(step.dataset.step);
        cart = cart.filter((entry) => entry.quantity > 0);
        setCart(cart);
        renderCartPage();
      }
      if (remove) { setCart(cart.filter((entry) => entry.id !== remove.dataset.remove)); renderCartPage(); }
    });
    document.getElementById("checkoutForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const cart = getCart();
      const products = getProducts();
      if (!cart.length) return;
      const form = event.currentTarget;
      const customer = form.elements.customer.value.trim();
      const email = form.elements.email.value.trim();
      const items = cart.map((entry) => { const product = products.find((item) => item.id === entry.id); return { name: product.name, quantity: entry.quantity, price: product.price }; });
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const orders = read("diva-orders", []);
      orders.push({ id: String(Date.now()).slice(-7), date: new Date().toISOString(), customer, email, items, total });
      if (!write("diva-orders", orders)) { showToast("Your browser could not save this demo order."); return; }
      setCart([]);
      form.reset();
      renderCartPage();
      showToast("Demo order placed. Thank you!");
    });
    renderCartPage();
  }
  function renderAdmin() {
    const productList = document.getElementById("adminProductList");
    if (!productList) return;
    const products = getProducts();
    productList.innerHTML = products.length ? products.map((product) => `<div class="admin-row"><img src="${safe(product.image || fallbackImage)}" alt=""><div><strong>${safe(product.name)}</strong><small>${safe(product.category)} · ${money(product.price)}</small></div><button class="small-button edit-product" type="button" data-edit="${safe(product.id)}">Edit</button><button class="small-button danger" type="button" data-delete="${safe(product.id)}">Delete</button></div>`).join("") : '<div class="empty-state">No products yet. Add one above.</div>';
    const orders = read("diva-orders", []);
    document.getElementById("adminOrderList").innerHTML = orders.length ? [...orders].reverse().map((order) => `<article class="order-row"><div><strong>Order ${safe(order.id)}</strong><p>${safe(order.customer)} · ${safe(order.email)} · ${new Date(order.date).toLocaleString()}</p><p>${order.items.map((item) => `${safe(item.name)} × ${item.quantity}`).join(", ")}</p></div><span>${money(order.total)}</span></article>`).join("") : '<div class="empty-state">No customer orders yet.</div>';
  }
  function initAdmin() {
    const form = document.getElementById("productForm");
    if (!form) return;
    const ownerForm = document.getElementById("storeForm");
    const details = read("diva-store", { owner: "Diva Beauty Team", email: "hello@divabeauty.example" });
    document.getElementById("storeOwner").value = details.owner;
    document.getElementById("storeEmail").value = details.email;
    document.querySelectorAll("[data-admin-tab]").forEach((tab) => tab.addEventListener("click", () => {
      document.querySelectorAll("[data-admin-tab]").forEach((item) => item.classList.toggle("active", item === tab));
      document.querySelectorAll(".admin-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `panel-${tab.dataset.adminTab}`));
    }));
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const id = document.getElementById("editProductId").value;
      const products = getProducts();
      const existing = products.find((item) => item.id === id);
      const product = { id: id || `p${Date.now()}`, name: form.elements.name.value.trim(), category: form.elements.category.value, price: Number(form.elements.price.value), image: form.elements.image.value.trim() || fallbackImage, description: form.elements.description.value.trim(), ingredients: form.elements.ingredients.value.trim() || "See packaging for full ingredient details.", tag: existing?.tag || "Just added" };
      const updated = existing ? products.map((item) => item.id === id ? product : item) : [...products, product];
      if (!write("diva-products", updated)) { showToast("Your browser could not save the product."); return; }
      form.reset();
      document.getElementById("editProductId").value = "";
      document.getElementById("saveProductButton").textContent = "Add product";
      document.getElementById("cancelEdit").hidden = true;
      renderAdmin();
      showToast(existing ? "Product updated" : "Product added");
    });
    document.getElementById("cancelEdit").addEventListener("click", () => { form.reset(); document.getElementById("editProductId").value = ""; document.getElementById("saveProductButton").textContent = "Add product"; document.getElementById("cancelEdit").hidden = true; });
    document.getElementById("adminProductList").addEventListener("click", (event) => {
      const edit = event.target.closest("[data-edit]");
      if (edit) {
        const product = getProducts().find((item) => item.id === edit.dataset.edit);
        if (!product) return;
        document.getElementById("editProductId").value = product.id;
        form.elements.name.value = product.name;
        form.elements.category.value = product.category;
        form.elements.price.value = product.price;
        form.elements.image.value = product.image || "";
        form.elements.description.value = product.description;
        form.elements.ingredients.value = product.ingredients || "";
        document.getElementById("saveProductButton").textContent = "Save changes";
        document.getElementById("cancelEdit").hidden = false;
        form.elements.name.focus();
      }
      const remove = event.target.closest("[data-delete]");
      if (remove && window.confirm("Delete this product from the store?")) {
        const products = getProducts().filter((item) => item.id !== remove.dataset.delete);
        write("diva-products", products);
        setCart(getCart().filter((item) => item.id !== remove.dataset.delete));
        renderAdmin();
        showToast("Product deleted");
      }
    });
    ownerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const store = { owner: ownerForm.elements.owner.value.trim(), email: ownerForm.elements.email.value.trim() };
      if (write("diva-store", store)) showToast("Store details saved");
      else showToast("Your browser could not save store details.");
    });
    renderAdmin();
  }
  function init() {
    document.querySelectorAll("[data-year]").forEach((node) => { node.textContent = new Date().getFullYear(); });
    initShared();
    initHome();
    initAccount();
    initCart();
    initAdmin();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();