import test from "node:test";
import assert from "node:assert/strict";

import {
  AUTHORS,
  getAuthorPage,
  getTag,
} from "../js/data/index.js";
import { tagHref } from "../js/router.js";
import { renderAuthorView } from "../js/views/author.js";

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parent = null;
    this.attributes = new Map();
    this.className = "";
    this.id = "";
    this.text = "";
  }

  append(...nodes) {
    for (const node of nodes) {
      if (node instanceof FakeElement) {
        node.parent = this;
      }
      this.children.push(node);
    }
  }

  replaceChildren(...nodes) {
    this.children = [];
    this.append(...nodes);
  }

  remove() {
    if (!this.parent) {
      return;
    }
    this.parent.children = this.parent.children.filter((node) => node !== this);
    this.parent = null;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.has(name) ? this.attributes.get(name) : null;
  }

  querySelector(selector) {
    const matches = findAll(this, (element) => matchesSelector(element, selector));
    return matches[0] ?? null;
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

function matchesSelector(element, selector) {
  if (selector.startsWith(".")) {
    return element.className.split(/\s+/).includes(selector.slice(1));
  }
  return element.tagName === selector.toUpperCase();
}

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

const registry = new Map();

globalThis.document = {
  head: new FakeElement("head"),
  createElement(tagName) {
    return new FakeElement(tagName);
  },
  getElementById(id) {
    return registry.get(id) ?? null;
  },
};

const originalCreateElement = globalThis.document.createElement.bind(
  globalThis.document,
);
globalThis.document.createElement = (tagName) => {
  const element = originalCreateElement(tagName);
  const setAttribute = element.setAttribute.bind(element);
  element.setAttribute = (name, value) => {
    setAttribute(name, value);
    if (name === "id") {
      element.id = String(value);
      registry.set(element.id, element);
    }
  };
  return element;
};

const hasDataset = AUTHORS.length > 0;

test("an unknown author slug renders nothing and reports failure", () => {
  const root = new FakeElement("main");
  root.append(new FakeElement("p"));

  const rendered = renderAuthorView(root, {
    name: "author",
    author: "__does-not-exist__",
  });

  assert.equal(rendered, false);
  assert.equal(root.children.length, 0);
});

test(
  "every author slug resolves to an author page",
  { skip: hasDataset ? false : "the dataset is not populated yet" },
  () => {
    for (const author of AUTHORS) {
      const page = getAuthorPage(author.slug);
      assert.ok(page, `author "${author.slug}" has no author page`);
      assert.equal(page.author.slug, author.slug);
      assert.equal(page.author.name, author.name);
    }
    assert.equal(getAuthorPage("__does-not-exist__"), null);
  },
);

test(
  "every author has a birth date, a birth place and a description",
  { skip: hasDataset ? false : "the dataset is not populated yet" },
  () => {
    for (const author of AUTHORS) {
      for (const field of ["bornDate", "bornLocation", "description"]) {
        assert.equal(
          typeof author[field],
          "string",
          `author "${author.slug}" is missing "${field}"`,
        );
        assert.ok(
          author[field].trim().length > 0,
          `author "${author.slug}" has an empty "${field}"`,
        );
      }
    }
  },
);

test(
  "every author page only returns quotes by that author",
  { skip: hasDataset ? false : "the dataset is not populated yet" },
  () => {
    for (const author of AUTHORS) {
      const page = getAuthorPage(author.slug);
      assert.ok(page);
      for (const quote of page.quotes) {
        assert.equal(
          quote.author,
          author.slug,
          `quote "${quote.text}" does not belong to "${author.slug}"`,
        );
      }
    }
  },
);

test(
  "the author view renders the profile header, count line and every quote",
  {
    skip: hasDataset
      ? false
      : "the dataset is not populated yet",
  },
  () => {
    const author = AUTHORS[0];
    const page = getAuthorPage(author.slug);
    assert.ok(page);

    const root = new FakeElement("main");
    const rendered = renderAuthorView(root, {
      name: "author",
      author: author.slug,
    });
    assert.equal(rendered, true);

    const headings = findAll(root, (element) => element.tagName === "H1");
    assert.equal(headings.length, 1, "the view writes exactly one h1");
    assert.equal(headings[0].textContent, author.name);
    assert.equal(headings[0].getAttribute("tabindex"), "-1");

    const born = root.querySelector(".author-profile__born");
    assert.ok(born, "the born line is rendered");
    assert.equal(
      born.textContent,
      `Born: ${author.bornDate} in ${author.bornLocation}`,
    );

    const description = root.querySelector(".author-profile__description");
    assert.ok(description, "the description is rendered");
    assert.equal(description.textContent, author.description);

    const count = root.querySelector(".author-profile__count");
    assert.ok(count, "the count line is rendered");
    assert.equal(
      count.textContent,
      `${page.quotes.length} ${
        page.quotes.length === 1 ? "quote" : "quotes"
      } by ${author.name}`,
    );

    const backLink = root.querySelector(".back-link");
    assert.ok(backLink, "the back link to the start listing is rendered");
    assert.equal(backLink.href, "#/");

    const cards = findAll(
      root,
      (element) => element.className.split(/\s+/).includes("quote-card"),
    );
    assert.equal(cards.length, page.quotes.length);

    cards.forEach((card, index) => {
      const text = card.querySelector(".quote-card__text");
      assert.ok(text);
      assert.equal(text.textContent, page.quotes[index].text);

      assert.equal(
        card.querySelector(".quote-card__author"),
        null,
        "the author link is omitted inside own-author cards",
      );

      const chips = findAll(
        card,
        (element) => element.className.split(/\s+/).includes("tag-chip"),
      );
      assert.equal(chips.length, page.quotes[index].tags.length);
      chips.forEach((chip, tagIndex) => {
        const slug = page.quotes[index].tags[tagIndex];
        const tag = getTag(slug);
        assert.ok(tag, `the tag "${slug}" resolves`);
        assert.equal(chip.getAttribute("href"), tagHref(slug, 1));
        assert.equal(chip.textContent, tag.name);
      });
    });
  },
);
