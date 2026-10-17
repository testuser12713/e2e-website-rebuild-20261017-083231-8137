import test from "node:test";
import assert from "node:assert/strict";

import { QUOTES, getTag, getTagPage } from "../js/data/index.js";
import { tagHref } from "../js/router.js";
import { renderTagView } from "../js/views/tag.js";

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
    this.children = [...nodes];
    this.text = "";
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.has(name) ? this.attributes.get(name) : null;
  }

  querySelectorAll(selector) {
    const name = selector.startsWith(".") ? selector.slice(1) : null;
    const matches = [];
    const visit = (node) => {
      for (const child of node.children) {
        if (typeof child === "string") {
          continue;
        }
        if (name && child.className.split(/\s+/).includes(name)) {
          matches.push(child);
        }
        visit(child);
      }
    };
    visit(this);
    return matches;
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

function findAll(root, className) {
  return root.querySelectorAll(`.${className}`);
}

function tagCounts() {
  const counts = new Map();
  for (const quote of QUOTES) {
    for (const slug of quote.tags) {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }
  return counts;
}

function findTag(predicate) {
  for (const [slug, count] of tagCounts()) {
    if (predicate(count, slug)) {
      return slug;
    }
  }
  return null;
}

function render(route) {
  const root = new FakeElement("main");
  const rendered = renderTagView(root, route);
  return { root, rendered };
}

test("unknown tags resolve to null", () => {
  assert.equal(getTagPage("does-not-exist", 1), null);
  assert.equal(getTagPage("", 1), null);
});

test("out-of-range and malformed pages resolve to null", (t) => {
  const slug = findTag(() => true);
  if (!slug) {
    t.skip("authors and quotes dataset not present yet");
    return;
  }

  const first = getTagPage(slug, 1);
  assert.equal(getTagPage(slug, first.totalPages + 1), null);
  assert.equal(getTagPage(slug, 0), null);
  assert.equal(getTagPage(slug, -2), null);
  assert.equal(getTagPage(slug, 1.5), null);
});

test("a tag with a single quote yields one page with that quote", (t) => {
  const slug = findTag((count) => count === 1);
  if (!slug) {
    t.skip("no tag with exactly one quote in the dataset");
    return;
  }

  const page = getTagPage(slug, 1);
  assert.equal(page.totalPages, 1);
  assert.equal(page.quotes.length, 1);
  assert.ok(page.quotes[0].tags.includes(slug));
  assert.equal(getTagPage(slug, 2), null);

  const { root, rendered } = render({ name: "tag", tag: slug, page: 1 });
  assert.equal(rendered, true);
  assert.equal(findAll(root, "quote-card").length, 1);
  assert.equal(findAll(root, "pagination__status")[0].textContent, "Page 1 of 1");
  assert.equal(findAll(root, "pagination__link").length, 2);
  for (const control of findAll(root, "pagination__link")) {
    assert.equal(control.getAttribute("aria-disabled"), "true");
    assert.equal(control.getAttribute("href"), null);
  }
});

test("a tag with more quotes splits into pages of at most ten", (t) => {
  const slug = findTag((count) => count > 10);
  if (!slug) {
    t.skip("no tag with more than ten quotes in the dataset");
    return;
  }

  const total = tagCounts().get(slug);
  const expectedPages = Math.ceil(total / 10);
  const first = getTagPage(slug, 1);
  assert.equal(first.totalPages, expectedPages);
  assert.equal(first.quotes.length, 10);

  let seen = 0;
  for (let page = 1; page <= expectedPages; page += 1) {
    const current = getTagPage(slug, page);
    assert.ok(current, `page ${page} should resolve`);
    assert.ok(current.quotes.length <= 10);
    for (const quote of current.quotes) {
      assert.ok(quote.tags.includes(slug));
    }
    seen += current.quotes.length;
  }
  assert.equal(seen, total);
  assert.equal(getTagPage(slug, expectedPages + 1), null);
});

test("quotes keep the dataset order on every tag page", (t) => {
  const slugs = [...tagCounts().keys()];
  if (slugs.length === 0) {
    t.skip("authors and quotes dataset not present yet");
    return;
  }

  for (const slug of slugs) {
    const expected = QUOTES.filter((quote) => quote.tags.includes(slug));
    const first = getTagPage(slug, 1);
    assert.deepEqual(
      first.quotes.map((quote) => quote.text),
      expected.slice(0, 10).map((quote) => quote.text),
      `page 1 of "${slug}" does not match the dataset order`,
    );
  }
});

test("the tag view renders one heading, the cards and its own pagination", (t) => {
  const slug = findTag(() => true);
  if (!slug) {
    t.skip("authors and quotes dataset not present yet");
    return;
  }

  const tag = getTag(slug);
  const page = getTagPage(slug, 1);
  const { root, rendered } = render({ name: "tag", tag: slug, page: 1 });

  assert.equal(rendered, true);

  const headings = findAll(root, "page-heading__title");
  assert.equal(headings.length, 1);
  assert.equal(headings[0].tagName, "H1");
  assert.equal(headings[0].textContent, tag.name);
  assert.equal(headings[0].getAttribute("tabindex"), "-1");

  const backLinks = findAll(root, "back-link");
  assert.equal(backLinks.length, 1);
  assert.equal(backLinks[0].getAttribute("href"), "#/");
  assert.equal(backLinks[0].textContent, "← All quotes");

  assert.equal(findAll(root, "page-heading__eyebrow")[0].textContent, "Viewing tag");

  const subline = findAll(root, "page-heading__subline")[0];
  assert.equal(
    subline.textContent,
    `${tag.count} ${tag.count === 1 ? "quote" : "quotes"} with this tag · Page 1 of ${page.totalPages}`,
  );

  const cards = findAll(root, "quote-card");
  assert.equal(cards.length, page.quotes.length);

  const activeChips = findAll(root, "tag-chip").filter(
    (chip) =>
      chip.getAttribute("href") === tagHref(slug, 1) &&
      chip.getAttribute("aria-current") === "page",
  );
  assert.ok(activeChips.length >= 1, "the current tag chip is marked as active");

  const status = findAll(root, "pagination__status")[0];
  assert.equal(status.textContent, `Page 1 of ${page.totalPages}`);

  const next = findAll(root, "pagination__link").find(
    (control) => control.getAttribute("href") !== null,
  );
  if (page.totalPages > 1) {
    assert.equal(next.getAttribute("href"), tagHref(slug, 2));
  } else {
    assert.equal(next, undefined);
  }
});

test("unknown tags and out-of-range pages render the not-found fallback", (t) => {
  const { root, rendered } = render({
    name: "tag",
    tag: "does-not-exist",
    page: 1,
  });
  assert.equal(rendered, false);
  assert.equal(findAll(root, "page-heading__title").length, 0);

  const slug = findTag(() => true);
  if (!slug) {
    t.skip("authors and quotes dataset not present yet");
    return;
  }

  const beyond = render({
    name: "tag",
    tag: slug,
    page: getTagPage(slug, 1).totalPages + 1,
  });
  assert.equal(beyond.rendered, false);
  assert.equal(findAll(beyond.root, "page-heading__title").length, 0);
});
