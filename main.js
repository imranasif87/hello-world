const router = new Navigo("/hello-world", { hash: false }); // repo name as base path
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

// Setup routes
router
  .on("/", () => loadPage("/hello-world/pages/home.html"))
  .on("/about", () => loadPage("/hello-world/pages/about.html"))
  .on("/products/:category/:id", ({ data }) => {
    fetch("/hello-world/pages/product.html")
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
  history.replaceState(null, '', redirect);
  setTimeout(() => router.resolve(), 0);
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
