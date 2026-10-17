import { QUOTES, getAuthor, getHomePage, getTag } from "../data/index.js";
import { authorHref, homeHref, tagHref } from "../router.js";
import { renderPagination } from "../components/pagination.js";
import { renderQuoteCard } from "../components/quote-card.js";

function buildHeading(totalPages, page) {
  const headingBlock = document.createElement("header");
  headingBlock.className = "page-heading";

  const heading = document.createElement("h1");
  heading.className = "page-heading__title";
  heading.textContent = "Quotes to Scrape";
  heading.setAttribute("tabindex", "-1");

  const subline = document.createElement("p");
  subline.className = "page-heading__subline";
  subline.textContent = `${QUOTES.length} quotes · Page ${page} of ${totalPages}`;

  headingBlock.append(heading, subline);
  return headingBlock;
}

function buildCard(quote) {
  const author = getAuthor(quote.author);

  return renderQuoteCard({
    text: quote.text,
    authorName: author ? author.name : quote.author,
    authorHref: authorHref(quote.author),
    tags: quote.tags.map((tagSlug) => {
      const tag = getTag(tagSlug);
      return {
        name: tag ? tag.name : tagSlug,
        href: tagHref(tagSlug, 1),
      };
    }),
  });
}

export function renderHomeView(root, route) {
  root.replaceChildren();

  const result = getHomePage(route.page);
  if (!result) {
    return false;
  }

  const list = document.createElement("div");
  list.className = "quote-list";

  for (const quote of result.quotes) {
    list.append(buildCard(quote));
  }

  const pagination = renderPagination({
    page: result.page,
    totalPages: result.totalPages,
    hrefFor: homeHref,
  });

  root.append(
    buildHeading(result.totalPages, result.page),
    list,
    pagination,
  );
  return true;
}
