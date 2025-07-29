const router = new Navigo("/", { hash: false });
const app = document.getElementById("app");

// Set up routes
router.on({
  "/": () => {
    app.innerHTML = "<h2>Home Page</h2><p>Welcome to our vanilla JS site!</p>";
  },
  "/about": () => {
    app.innerHTML = "<h2>About Page</h2><p>This is a simple single-page app.</p>";
  },
  "/products/:category/:id": ({ data }) => {
    app.innerHTML = `
      <h2>Product Page</h2>
      <p>Category: ${data.category}</p>
      <p>ID: ${data.id}</p>
    `;
  }
});

// Handle redirect (GitHub Pages fallback)
const params = new URLSearchParams(window.location.search);
const redirect = params.get("redirect");

if (redirect) {
  // Clean up the URL (remove the ?redirect=...) and replace it with the real route
  history.replaceState(null, '', redirect);
  // Wait a moment for URL to update, then resolve the route
  setTimeout(() => router.resolve(), 10);
} else {
  router.resolve();
}

// Handle client-side navigation
document.addEventListener("click", e => {
  const link = e.target.closest("a[data-navigo]");
  if (link) {
    e.preventDefault();
    router.navigate(link.getAttribute("href"));
  }
});
