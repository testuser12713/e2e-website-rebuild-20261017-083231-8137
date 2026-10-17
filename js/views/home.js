import { QUOTES } from "../data/index.js";

export function renderHomeView(root, route) {
  root.replaceChildren();

  const heading = document.createElement("h1");
  heading.textContent = "Quotes to Scrape";
  heading.setAttribute("tabindex", "-1");

  const list = document.createElement("ul");
  list.className = "quote-plain-list";

  for (const quote of QUOTES) {
    const item = document.createElement("li");
    item.textContent = quote.text;
    list.append(item);
  }

  root.append(heading, list);
  return true;
}
