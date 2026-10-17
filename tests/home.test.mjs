import test from "node:test";
import assert from "node:assert/strict";

import { QUOTES, getAuthor, getHomePage, getTag } from "../js/data/index.js";
import { authorHref, homeHref, tagHref } from "../js/router.js";
import { renderHomeView } from "../js/views/home.js";

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.attributes = new Map();
    this.className = "";
    this.text = "";
  }

  append(...nodes) {
    this.children.push(...nodes);
  }

  replaceChildren(...nodes) {
    this.children = nodes;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.has(name) ? this.attributes.get(name) : null;
  }

  set textContent(value) {
    this.text = String(value);
    this.children = [];
  }

  get textContent() {
    return (
      this.text +
      this.children
        .map((child) => (typeof child === "string" ? child : child.textContent))
        .join("")
    );
  }
}

globalThis.document = {
  createElement(tagName) {
    return new FakeElement(tagName);
  },
};

const EMPTY_DATASET = QUOTES.length === 0;

const skipEmpty = {
  skip: EMPTY_DATASET ? "the dataset is not populated yet" : false,
};

function findAll(root, predicate) {
  const matches = [];
  const visit = (node) => {
    if (!(node instanceof FakeElement)) {
      return;
    }
    if (predicate(node)) {
      matches.push(node);
    }
    for (const child of node.children) {
      visit(child);
    }
  };
  visit(root);
  return matches;
}

function hasClass(element, name) {
  return element.className.split(/\s+/).includes(name);
}

function totalPages() {
  return Math.ceil(QUOTES.length / 10);
}

test("the first home page carries ten quotes", skipEmpty, () => {
  const page = getHomePage(1);
  assert.ok(page);
  assert.equal(page.page, 1);
  assert.equal(page.quotes.length, Math.min(10, QUOTES.length));
  if (QUOTES.length >= 10) {
    assert.equal(page.quotes.length, 10);
  }
});

test("the last home page carries at most ten quotes", skipEmpty, () => {
  const lastPage = totalPages();
  const page = getHomePage(lastPage);
  assert.ok(page);
  assert.ok(page.quotes.length > 0);
  assert.ok(page.quotes.length <= 10);
  assert.equal(
    page.quotes.length,
    QUOTES.length - (lastPage - 1) * 10,
  );
});

test("totalPages matches the dataset", skipEmpty, () => {
  const page = getHomePage(1);
  assert.ok(page);
  assert.equal(page.totalPages, totalPages());
  assert.equal(page.totalPages, Math.ceil(QUOTES.length / 10));
});

test("page 0 and page totalPages + 1 resolve to null", skipEmpty, () => {
  assert.equal(getHomePage(0), null);
  assert.equal(getHomePage(totalPages() + 1), null);
});

test("the home view renders one heading, the cards and the pagination", skipEmpty, () => {
  const page = getHomePage(1);
  const root = new FakeElement("main");
  const rendered = renderHomeView(root, { name: "home", page: 1 });

  assert.equal(rendered, true);

  const headings = findAll(root, (element) => element.tagName === "H1");
  assert.equal(headings.length, 1);
  assert.equal(headings[0].textContent, "Quotes to Scrape");

  const subline = findAll(
    root,
    (element) => hasClass(element, "page-heading__subline"),
  );
  assert.equal(subline.length, 1);
  assert.equal(
    subline[0].textContent,
    `${QUOTES.length} quotes · Page 1 of ${page.totalPages}`,
  );

  const cards = findAll(root, (element) => hasClass(element, "quote-card"));
  assert.equal(cards.length, page.quotes.length);

  const status = findAll(
    root,
    (element) => hasClass(element, "pagination__status"),
  );
  assert.equal(status.length, 1);
  assert.equal(
    status[0].textContent,
    `Page 1 of ${page.totalPages}`,
  );

  page.quotes.forEach((quote, index) => {
    const card = cards[index];
    const authorLinks = findAll(
      card,
      (element) => hasClass(element, "quote-card__author"),
    );
    assert.equal(authorLinks.length, 1);
    assert.equal(authorLinks[0].getAttribute("href"), authorHref(quote.author));
    const author = getAuthor(quote.author);
    assert.equal(
      authorLinks[0].textContent,
      `${author ? author.name : quote.author}(about)`,
    );

    const chips = findAll(card, (element) => hasClass(element, "tag-chip"));
    assert.equal(chips.length, quote.tags.length);
    quote.tags.forEach((tagSlug, tagIndex) => {
      assert.equal(chips[tagIndex].getAttribute("href"), tagHref(tagSlug, 1));
      const tag = getTag(tagSlug);
      assert.equal(chips[tagIndex].textContent, tag ? tag.name : tagSlug);
    });
    assert.ok(chips.length >= 1);
  });

  const previous = findAll(
    root,
    (element) =>
      hasClass(element, "pagination__link") &&
      element.getAttribute("aria-disabled") === "true",
  );
  assert.equal(previous.length, 1);
  assert.equal(previous[0].textContent, "← Previous");
});

test("the home view returns false outside the page range", () => {
  for (const page of [0, -1, 999999]) {
    const root = new FakeElement("main");
    assert.equal(renderHomeView(root, { name: "home", page }), false);
    assert.equal(root.children.length, 0);
  }
});

test("the pagination hrefs point at home pages", skipEmpty, () => {
  const pages = totalPages();
  const root = new FakeElement("main");
  renderHomeView(root, { name: "home", page: Math.min(2, pages) });

  const links = findAll(
    root,
    (element) =>
      element.tagName === "A" && hasClass(element, "pagination__link"),
  );
  for (const link of links) {
    assert.match(link.getAttribute("href"), /^(#\/|#\/page\/\d+\/)$/);
  }

  const expected = homeHref(Math.min(2, pages));
  assert.ok(expected === "#/" || expected === "#/page/2/");
});
