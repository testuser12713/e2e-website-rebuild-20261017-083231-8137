function buildBrand() {
  const brand = document.createElement("a");
  brand.className = "site-brand";
  brand.href = "#/";

  const mark = document.createElement("span");
  mark.className = "site-brand__mark";
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = "“";

  const name = document.createElement("span");
  name.className = "site-brand__name";
  name.textContent = "Quotes to Scrape";

  brand.append(mark, name);
  return brand;
}

function buildNav() {
  const nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.setAttribute("aria-label", "Main");

  const home = document.createElement("a");
  home.href = "#/";
  home.textContent = "Home";
  nav.append(home);
  return nav;
}

function renderHeader(header) {
  let inner = header.querySelector(".site-header__inner");
  if (!inner) {
    inner = document.createElement("div");
    inner.className = "site-header__inner";
    header.append(inner);
  }

  const brand = inner.querySelector(".site-brand") ?? buildBrand();
  const nav = inner.querySelector(".site-nav") ?? buildNav();
  inner.replaceChildren(brand, nav);
}

function buildFooter() {
  const inner = document.createElement("div");
  inner.className = "site-footer__inner";

  const credits = document.createElement("p");
  credits.textContent = "Quotes by: GoodReads.com";

  const madeWith = document.createElement("p");
  madeWith.textContent = "Made with ❤ by Zyte";

  inner.append(credits, madeWith);
  return inner;
}

function findLandmark(root, selector, label) {
  const element = root.querySelector(selector);
  if (!element) {
    throw new Error(`Missing shell landmark: ${label} (${selector})`);
  }
  return element;
}

export function renderShell(root = document) {
  const header = findLandmark(root, "[data-shell-header]", "header");
  const main = findLandmark(root, "[data-shell-content]", "main");
  const sidebar = findLandmark(root, "[data-shell-sidebar]", "sidebar");
  const footer = findLandmark(root, "[data-shell-footer]", "footer");

  renderHeader(header);
  footer.replaceChildren(buildFooter());

  const skipLink = root.querySelector(".skip-link");
  if (skipLink) {
    skipLink.addEventListener("click", (event) => {
      event.preventDefault();
      main.focus({ preventScroll: true });
      main.scrollIntoView({ block: "start" });
    });
  }

  return { header, main, sidebar, footer };
}
