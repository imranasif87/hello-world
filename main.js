const router = new Navigo("/hello-world", { hash: false });
const app = document.getElementById("app");

// Utility to load HTML into the app container
function loadPage(url) {
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Page not found");
      return res.text();
    })
    .then(html => {
      app.innerHTML = html;
    })
    .catch(err => {
      app.innerHTML = "<h2>404 - Page not found</h2>";
    });
}

// Set up routes
// Setup routes
router
  .on("/", () => loadPage("pages/home.html"))
  .on("/about", () => loadPage("pages/about.html"))
  .on("/products/:category/:id", ({ data }) => {
    // You can still inject dynamic content
    fetch("pages/product.html")
      .then(res => res.text())
      .then(html => {
        html = html.replace("{{category}}", data.category);
        html = html.replace("{{id}}", data.id);
        app.innerHTML = html;
      });
  })
  .notFound(() => {
    app.innerHTML = "<h2>404 Not Found</h2>";
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
