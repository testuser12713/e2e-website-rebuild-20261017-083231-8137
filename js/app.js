import { documentTitle, parseRoute } from "./router.js";
import { renderShell } from "./shell.js";
import { renderAuthorView } from "./views/author.js";
import { renderHomeView } from "./views/home.js";
import { renderNotFoundView } from "./views/not-found.js";
import { renderTopTagsSidebar } from "./views/sidebar.js";
import { renderTagView } from "./views/tag.js";

const shell = renderShell(document);

function render() {
  const hash = window.location.hash || "#/";
  const route = parseRoute(hash);

  document.title = documentTitle(route);

  let rendered = false;
  switch (route.name) {
    case "home":
      rendered = renderHomeView(shell.main, route);
      break;
    case "tag":
      rendered = renderTagView(shell.main, route);
      break;
    case "author":
      rendered = renderAuthorView(shell.main, route);
      break;
    default:
      rendered = false;
  }

  if (!rendered) {
    const notFoundRoute = { name: "notfound", path: hash };
    document.title = documentTitle(notFoundRoute);
    renderNotFoundView(shell.main, notFoundRoute);
  }

  renderTopTagsSidebar(
    shell.sidebar,
    route.name === "tag" ? route.tag : null,
  );

  const heading = shell.main.querySelector("h1");
  if (heading) {
    if (!heading.hasAttribute("tabindex")) {
      heading.setAttribute("tabindex", "-1");
    }
    heading.focus({ preventScroll: true });
  }

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

window.addEventListener("hashchange", render);
render();
