export function renderTopTags(entries, activeTag) {
  const element = document.createElement("section");
  element.className = "top-tags";

  const title = document.createElement("h2");
  title.className = "top-tags__title";
  title.textContent = "Top Ten tags";

  const list = document.createElement("ol");
  list.className = "top-tags__list";

  for (const entry of entries) {
    const item = document.createElement("li");
    item.className = "top-tags__item";

    const link = document.createElement("a");
    link.className = "top-tags__link";
    link.setAttribute("href", entry.href);

    if (entry.slug === activeTag) {
      link.setAttribute("aria-current", "page");
    }

    const name = document.createElement("span");
    name.className = "top-tags__name";
    name.textContent = entry.name;

    link.append(name);

    if (Number.isFinite(entry.count)) {
      const count = document.createElement("span");
      count.className = "top-tags__count";
      count.textContent = String(entry.count);
      link.append(count);
    }

    item.append(link);
    list.append(item);
  }

  const caption = document.createElement("p");
  caption.className = "top-tags__caption";
  caption.textContent = "Ranked by number of quotes";

  element.append(title, list, caption);
  return element;
}
