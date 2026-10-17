import test from "node:test";
import assert from "node:assert/strict";

import { getAuthorPage, getTagPage } from "../js/data/index.js";
import { documentTitle, homeHref, parseRoute } from "../js/router.js";
import { renderNotFoundView } from "../js/views/not-found.js";

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

test("parseRoute sends the login path and unknown hashes to not found", () => {
  for (const hash of [
    "#/login",
    "#/page/0/",
    "#/some/unknown/path/",
    "#",
    "",
  ]) {
    assert.deepEqual(
      parseRoute(hash),
      { name: "notfound", path: hash },
      `expected "${hash}" to resolve to the not-found route`,
    );
  }
});

test("unknown tags and unknown authors resolve to no page", () => {
  assert.equal(getTagPage("does-not-exist", 1), null);
  assert.equal(getAuthorPage("does-not-exist"), null);
});

test("the not-found route keeps its document title", () => {
  assert.equal(
    documentTitle(parseRoute("#/login")),
    "Quotes to Scrape — Page not found",
  );
});

test("the not-found view renders one heading and a working link home", () => {
  const root = new FakeElement("main");
  const rendered = renderNotFoundView(root, {
    name: "notfound",
    path: "#/login",
  });

  assert.equal(rendered, true);
  assert.equal(root.children.length, 1);

  const headings = findAll(root, (element) => element.tagName === "H1");
  assert.equal(headings.length, 1);
  assert.equal(headings[0].textContent, "This page doesn't exist");
  assert.equal(headings[0].getAttribute("tabindex"), "-1");

  const eyebrows = findAll(root, (element) =>
    hasClass(element, "not-found__eyebrow"),
  );
  assert.equal(eyebrows.length, 1);
  assert.equal(eyebrows[0].textContent, "404");

  const links = findAll(root, (element) => element.tagName === "A");
  assert.equal(links.length, 1);
  assert.equal(links[0].getAttribute("href"), homeHref(1));
  assert.equal(links[0].getAttribute("href"), "#/");
  assert.equal(links[0].textContent, "← Back to all quotes");
  assert.ok(hasClass(links[0], "button--primary"));

  const captions = findAll(root, (element) =>
    hasClass(element, "not-found__caption"),
  );
  assert.equal(captions.length, 1);
  assert.equal(captions[0].textContent, "Or pick a tag from the list.");

  const bodies = findAll(root, (element) =>
    hasClass(element, "not-found__body"),
  );
  assert.equal(bodies.length, 1);
  assert.match(bodies[0].textContent, /match(es)? (any|no) quote, author or tag/i);
});

test("the not-found view offers no login form or login link", () => {
  const root = new FakeElement("main");
  renderNotFoundView(root, { name: "notfound", path: "#/login" });

  assert.equal(
    findAll(root, (element) => element.tagName === "FORM").length,
    0,
  );
  const links = findAll(root, (element) => element.tagName === "A");
  for (const link of links) {
    assert.notEqual(link.getAttribute("href"), "#/login");
  }
});
