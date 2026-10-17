import test from "node:test";
import assert from "node:assert/strict";

import { QUOTES, getTopTags } from "../js/data/index.js";
import { tagHref } from "../js/router.js";
import { renderTopTagsSidebar } from "../js/views/sidebar.js";

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

  set textContent(value) {
    this.text = String(value);
    this.children = [];
  }

  get textContent() {
    return (
      this.text +
      this.children
        .map((child) =>
          typeof child === "string" ? child : child.textContent,
        )
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

function quoteCounts() {
  const counts = new Map();
  for (const quote of QUOTES) {
    for (const tag of quote.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return counts;
}

function expectedTopTags() {
  const counts = quoteCounts();
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => {
      if (a.count !== b.count) {
        return b.count - a.count;
      }
      return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;
    })
    .slice(0, 10);
}

function renderedEntries(activeTag = null) {
  const root = new FakeElement("aside");
  renderTopTagsSidebar(root, activeTag);

  const links = findAll(root, (element) =>
    hasClass(element, "top-tags__link"),
  );

  return {
    root,
    links: links.map((link) => ({
      href: link.getAttribute("href"),
      slug: link.getAttribute("href")
        .replace(/^#\/tag\//, "")
        .replace(/\/$/, ""),
      name: link.children.find((child) =>
        hasClass(child, "top-tags__name"),
      )?.textContent,
      count: Number(
        link.children.find((child) =>
          hasClass(child, "top-tags__count"),
        )?.textContent,
      ),
      current: link.getAttribute("aria-current"),
    })),
  };
}

test("sidebar composes the kit's Top Ten tags panel", () => {
  const { root } = renderedEntries();

  assert.equal(hasClass(root.children[0], "top-tags"), true);
  assert.equal(
    findAll(root, (element) => hasClass(element, "top-tags__title"))[0]
      .textContent,
    "Top Ten tags",
  );
  assert.equal(
    findAll(root, (element) => element.tagName === "OL").length,
    1,
  );
});

test(
  "sidebar shows exactly ten tags once the dataset holds ten or more",
  { skip: getTopTags(10).length < 10 ? "dataset holds fewer than ten tags" : false },
  () => {
    const { links } = renderedEntries();
    assert.equal(links.length, 10);
  },
);

test(
  "sidebar orders tags by quote count descending, ties by name ascending",
  { skip: getTopTags(10).length < 10 ? "dataset holds fewer than ten tags" : false },
  () => {
    const expected = expectedTopTags();
    const { links } = renderedEntries();

    assert.deepEqual(
      links.map((link) => link.slug),
      expected.map((tag) => tag.slug),
    );
    for (let index = 1; index < links.length; index += 1) {
      const previous = links[index - 1];
      const current = links[index];
      assert.ok(
        previous.count > current.count ||
          (previous.count === current.count &&
            previous.name < current.name),
        `${previous.slug} must rank before ${current.slug}`,
      );
    }
  },
);

test(
  "each sidebar entry counts the quotes carrying its tag and links to its tag page",
  { skip: getTopTags(10).length < 10 ? "dataset holds fewer than ten tags" : false },
  () => {
    const counts = quoteCounts();
    const { links } = renderedEntries();

    for (const link of links) {
      assert.equal(
        link.count,
        counts.get(link.slug),
        `${link.slug} count must match its quotes`,
      );
      assert.equal(link.href, tagHref(link.slug, 1));
    }
  },
);

test(
  "the active tag is marked as the current page",
  { skip: getTopTags(10).length < 10 ? "dataset holds fewer than ten tags" : false },
  () => {
    const active = getTopTags(10)[0].slug;
    const { links } = renderedEntries(active);

    for (const link of links) {
      assert.equal(
        link.current,
        link.slug === active ? "page" : null,
        `${link.slug} current state`,
      );
    }
  },
);
