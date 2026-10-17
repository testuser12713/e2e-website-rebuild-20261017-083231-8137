import { renderQuoteCard } from "../components/quote-card.js";
import { getAuthorPage, getTag } from "../data/index.js";
import { authorHref, tagHref } from "../router.js";

const STYLESHEET_ID = "author-view-styles";
const STYLESHEET_HREF = "styles/author.css";

function ensureStylesheet() {
  if (typeof document === "undefined") {
    return;
  }

  const head = document.head;
  if (!head) {
    return;
  }

  if (document.getElementById(STYLESHEET_ID)) {
    return;
  }

  const link = document.createElement("link");
  link.id = STYLESHEET_ID;
  link.rel = "stylesheet";
  link.href = STYLESHEET_HREF;
  head.append(link);
}

function buildBackLink() {
  const link = document.createElement("a");
  link.className = "back-link";
  link.href = "#/";
  link.textContent = "← All quotes";
  return link;
}

function createInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "";
  }
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return `${first}${last}`.toUpperCase();
}

function buildProfileHeader(author, quoteCount) {
  const header = document.createElement("header");
  header.className = "author-profile";

  const heading = document.createElement("div");
  heading.className = "author-profile__heading";

  const monogram = document.createElement("div");
  monogram.className = "author-profile__monogram";
  monogram.setAttribute("aria-hidden", "true");
  monogram.textContent = createInitials(author.name);

  const name = document.createElement("h1");
  name.className = "author-profile__name";
  name.setAttribute("tabindex", "-1");
  name.textContent = author.name;

  heading.append(monogram, name);

  const born = document.createElement("p");
  born.className = "author-profile__born";
  born.textContent = `Born: ${author.bornDate} in ${author.bornLocation}`;

  const description = document.createElement("p");
  description.className = "author-profile__description";
  description.textContent = author.description;

  const count = document.createElement("p");
  count.className = "author-profile__count";
  count.textContent = `${quoteCount} ${
    quoteCount === 1 ? "quote" : "quotes"
  } by ${author.name}`;

  header.append(heading, born, description, count);
  return header;
}

function buildQuoteCard(quote, author) {
  const tags = quote.tags.map((slug) => {
    const tag = getTag(slug);
    return {
      name: tag ? tag.name : slug,
      href: tagHref(slug, 1),
    };
  });

  const card = renderQuoteCard({
    text: quote.text,
    authorName: author.name,
    authorHref: authorHref(author.slug),
    tags,
  });

  const ownAuthorLink = card.querySelector(".quote-card__author");
  if (ownAuthorLink) {
    ownAuthorLink.remove();
  }

  return card;
}

function buildQuoteList(quotes, author) {
  const list = document.createElement("div");
  list.className = "quote-list";

  for (const quote of quotes) {
    list.append(buildQuoteCard(quote, author));
  }

  return list;
}

function buildEmptyState() {
  const section = document.createElement("section");
  section.className = "empty-state";

  const message = document.createElement("p");
  message.className = "empty-state__message";
  message.textContent = "No quotes here yet.";

  const explanation = document.createElement("p");
  explanation.className = "empty-state__text";
  explanation.textContent = "This author has no quotes in the collection yet.";

  const back = document.createElement("a");
  back.className = "button button--secondary empty-state__action";
  back.href = "#/";
  back.textContent = "← Back to all quotes";

  section.append(message, explanation, back);
  return section;
}

export function renderAuthorView(root, route) {
  root.replaceChildren();

  const page = getAuthorPage(route.author);
  if (!page) {
    return false;
  }

  ensureStylesheet();

  const { author, quotes } = page;

  const view = document.createElement("div");
  view.className = "author-view";
  view.append(buildBackLink(), buildProfileHeader(author, quotes.length));

  if (quotes.length > 0) {
    view.append(buildQuoteList(quotes, author));
  } else {
    view.append(buildEmptyState());
  }

  root.append(view);
  return true;
}
