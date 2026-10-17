import { getAuthor, getTag, getTagPage } from "../data/index.js";
import { authorHref, tagHref } from "../router.js";
import { renderPagination } from "../components/pagination.js";
import { renderQuoteCard } from "../components/quote-card.js";

function renderHeading(tag, page, totalPages) {
  const heading = document.createElement("header");
  heading.className = "page-heading";

  const backLink = document.createElement("a");
  backLink.className = "back-link";
  backLink.setAttribute("href", "#/");
  backLink.textContent = "← All quotes";

  const eyebrow = document.createElement("p");
  eyebrow.className = "page-heading__eyebrow";
  eyebrow.textContent = "Viewing tag";

  const title = document.createElement("h1");
  title.className = "page-heading__title";
  title.setAttribute("tabindex", "-1");
  title.textContent = tag.name;

  const noun = tag.count === 1 ? "quote" : "quotes";
  const subline = document.createElement("p");
  subline.className = "page-heading__subline";
  subline.textContent = `${tag.count} ${noun} with this tag · Page ${page} of ${totalPages}`;

  heading.append(backLink, eyebrow, title, subline);
  return heading;
}

function buildCard(quote, activeTagSlug) {
  const author = getAuthor(quote.author);
  const card = renderQuoteCard({
    text: quote.text,
    authorName: author ? author.name : quote.author,
    authorHref: authorHref(quote.author),
    tags: quote.tags.map((slug) => {
      const tag = getTag(slug);
      return {
        name: tag ? tag.name : slug,
        href: tagHref(slug, 1),
      };
    }),
  });

  const activeHref = tagHref(activeTagSlug, 1);
  for (const chip of card.querySelectorAll(".tag-chip")) {
    if (chip.getAttribute("href") === activeHref) {
      chip.setAttribute("aria-current", "page");
    }
  }

  return card;
}

export function renderTagView(root, route) {
  const result = getTagPage(route.tag, route.page);
  if (!result) {
    root.replaceChildren();
    return false;
  }

  const { tag, quotes, page, totalPages } = result;

  const list = document.createElement("div");
  list.className = "quote-list";

  for (const quote of quotes) {
    list.append(buildCard(quote, tag.slug));
  }

  const pagination = renderPagination({
    page,
    totalPages,
    hrefFor: (target) => tagHref(tag.slug, target),
  });

  root.replaceChildren(
    renderHeading(tag, page, totalPages),
    list,
    pagination,
  );
  return true;
}
