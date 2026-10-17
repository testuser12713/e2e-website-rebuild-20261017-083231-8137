import test from "node:test";
import assert from "node:assert/strict";

import { renderPagination } from "../js/components/pagination.js";
import { renderQuoteCard } from "../js/components/quote-card.js";
import { renderTopTags } from "../js/components/top-tags.js";

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

test("quote card links the author and every tag", () => {
  const card = renderQuoteCard({
    text: "The unexamined life is not worth living.",
    authorName: "Socrates",
    authorHref: "#/author/Socrates/",
    tags: [
      { name: "philosophy", href: "#/tag/philosophy/" },
      { name: "wisdom", href: "#/tag/wisdom/" },
    ],
  });

  assert.equal(card.tagName, "ARTICLE");
  assert.ok(hasClass(card, "quote-card"));
  assert.equal(
    card.textContent,
    "“The unexamined life is not worth living.Socrates(about)philosophywisdom",
  );

  const author = findAll(card, (element) => hasClass(element, "quote-card__author"));
  assert.equal(author.length, 1);
  assert.equal(author[0].tagName, "A");
  assert.equal(author[0].getAttribute("href"), "#/author/Socrates/");
  assert.equal(author[0].textContent, "Socrates(about)");

  const chips = findAll(card, (element) => hasClass(element, "tag-chip"));
  assert.deepEqual(
    chips.map((chip) => chip.getAttribute("href")),
    ["#/tag/philosophy/", "#/tag/wisdom/"],
  );
  assert.deepEqual(
    chips.map((chip) => chip.textContent),
    ["philosophy", "wisdom"],
  );
  for (const chip of chips) {
    assert.equal(chip.tagName, "A");
  }
});

test("pagination on the first page disables only previous", () => {
  const pagination = renderPagination({
    page: 1,
    totalPages: 3,
    hrefFor: (page) => `#/page/${page}/`,
  });

  const disabled = findAll(
    pagination,
    (element) => element.getAttribute("aria-disabled") === "true",
  );
  assert.equal(disabled.length, 1);
  assert.equal(disabled[0].tagName, "SPAN");
  assert.equal(disabled[0].textContent, "← Previous");
  assert.equal(disabled[0].getAttribute("href"), null);

  const links = findAll(
    pagination,
    (element) => element.tagName === "A" && element.className.includes("pagination__link"),
  );
  assert.equal(links.length, 1);
  assert.equal(links[0].getAttribute("href"), "#/page/2/");
  assert.equal(links[0].textContent, "Next →");

  const status = findAll(
    pagination,
    (element) => hasClass(element, "pagination__status"),
  );
  assert.equal(status.length, 1);
  assert.equal(status[0].textContent, "Page 1 of 3");
  assert.equal(status[0].getAttribute("aria-live"), "polite");
});

test("pagination in the middle links both directions", () => {
  const pagination = renderPagination({
    page: 2,
    totalPages: 3,
    hrefFor: (page) => (page === 1 ? "#/" : `#/page/${page}/`),
  });

  const links = findAll(
    pagination,
    (element) => element.tagName === "A" && element.className.includes("pagination__link"),
  );
  assert.deepEqual(
    links.map((link) => link.textContent),
    ["← Previous", "Next →"],
  );
  assert.deepEqual(
    links.map((link) => link.getAttribute("href")),
    ["#/", "#/page/3/"],
  );
  const status = findAll(
    pagination,
    (element) => hasClass(element, "pagination__status"),
  );
  assert.equal(status[0].textContent, "Page 2 of 3");
});

test("pagination on the last page and on a single page keeps both ends visible", () => {
  const lastPage = renderPagination({
    page: 3,
    totalPages: 3,
    hrefFor: (page) => `#/page/${page}/`,
  });
  const lastDisabled = findAll(
    lastPage,
    (element) => element.getAttribute("aria-disabled") === "true",
  );
  assert.equal(lastDisabled.length, 1);
  assert.equal(lastDisabled[0].textContent, "Next →");

  const singlePage = renderPagination({
    page: 1,
    totalPages: 1,
    hrefFor: (page) => `#/page/${page}/`,
  });
  const singleDisabled = findAll(
    singlePage,
    (element) => element.getAttribute("aria-disabled") === "true",
  );
  assert.deepEqual(
    singleDisabled.map((element) => element.textContent),
    ["← Previous", "Next →"],
  );
  const status = findAll(
    singlePage,
    (element) => hasClass(element, "pagination__status"),
  );
  assert.equal(status[0].textContent, "Page 1 of 1");
});

test("top tags renders the ordered list and marks the active tag", () => {
  const entries = [
    { slug: "love", name: "love", href: "#/tag/love/", count: 14 },
    { slug: "life", name: "life", href: "#/tag/life/", count: 12 },
    { slug: "wisdom", name: "wisdom", href: "#/tag/wisdom/", count: 9 },
  ];

  const panel = renderTopTags(entries, "life");

  const title = findAll(panel, (element) => element.tagName === "H2");
  assert.equal(title[0].textContent, "Top Ten tags");

  const list = findAll(panel, (element) => element.tagName === "OL");
  assert.equal(list.length, 1);

  const links = findAll(
    panel,
    (element) => element.tagName === "A" && hasClass(element, "top-tags__link"),
  );
  assert.deepEqual(
    links.map((link) => link.getAttribute("href")),
    ["#/tag/love/", "#/tag/life/", "#/tag/wisdom/"],
  );
  assert.deepEqual(
    links.map((link) => link.getAttribute("aria-current")),
    [null, "page", null],
  );
  assert.deepEqual(
    links.map((link) => link.textContent),
    ["love14", "life12", "wisdom9"],
  );

  const caption = findAll(
    panel,
    (element) => hasClass(element, "top-tags__caption"),
  );
  assert.equal(caption[0].textContent, "Ranked by number of quotes");
});

test("top tags works without a count and without an active tag", () => {
  const panel = renderTopTags(
    [{ slug: "love", name: "love", href: "#/tag/love/" }],
    null,
  );

  const links = findAll(
    panel,
    (element) => element.tagName === "A" && hasClass(element, "top-tags__link"),
  );
  assert.equal(links[0].textContent, "love");
  assert.equal(links[0].getAttribute("aria-current"), null);
  assert.equal(
    findAll(panel, (element) => hasClass(element, "top-tags__count")).length,
    0,
  );
});
