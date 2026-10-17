import test from "node:test";
import assert from "node:assert/strict";

import {
  authorHref,
  documentTitle,
  homeHref,
  parseRoute,
  tagHref,
} from "../js/router.js";
import { getAuthor, getTag } from "../js/data/index.js";

test("parseRoute resolves the home routes", () => {
  assert.deepEqual(parseRoute("#/"), { name: "home", page: 1 });
  assert.deepEqual(parseRoute("#/page/1/"), { name: "home", page: 1 });
  assert.deepEqual(parseRoute("#/page/2/"), { name: "home", page: 2 });
  assert.deepEqual(parseRoute("#/page/10/"), { name: "home", page: 10 });
});

test("parseRoute resolves tag routes, including dashed tags", () => {
  assert.deepEqual(parseRoute("#/tag/love/"), {
    name: "tag",
    tag: "love",
    page: 1,
  });
  assert.deepEqual(parseRoute("#/tag/be-yourself/"), {
    name: "tag",
    tag: "be-yourself",
    page: 1,
  });
  assert.deepEqual(parseRoute("#/tag/love/page/2/"), {
    name: "tag",
    tag: "love",
    page: 2,
  });
  assert.deepEqual(parseRoute("#/tag/be-yourself/page/12/"), {
    name: "tag",
    tag: "be-yourself",
    page: 12,
  });
});

test("parseRoute resolves author routes with their original slugs", () => {
  assert.deepEqual(parseRoute("#/author/Albert-Einstein/"), {
    name: "author",
    author: "Albert-Einstein",
  });
  assert.deepEqual(parseRoute("#/author/J-K-Rowling/"), {
    name: "author",
    author: "J-K-Rowling",
  });
  assert.deepEqual(parseRoute("#/author/Madeleine-LEngle/"), {
    name: "author",
    author: "Madeleine-LEngle",
  });
  assert.deepEqual(parseRoute("#/author/Andr%C3%A9-Gide/"), {
    name: "author",
    author: "André-Gide",
  });
});

test("parseRoute maps every other hash to the not-found route", () => {
  for (const hash of [
    "#/login",
    "#/page/0/",
    "#/page/abc/",
    "#/page/2",
    "#/tag/love",
    "#/tag/love/page/0/",
    "#/tag/love/page/abc/",
    "#/author/",
    "#/author/Albert-Einstein",
    "#/does/not/exist/",
    "#",
    "",
  ]) {
    assert.deepEqual(
      parseRoute(hash),
      { name: "notfound", path: hash },
      `expected "${hash}" to be not found`,
    );
  }
});

test("href builders produce the agreed route strings", () => {
  assert.equal(homeHref(1), "#/");
  assert.equal(homeHref(2), "#/page/2/");
  assert.equal(homeHref(10), "#/page/10/");

  assert.equal(tagHref("love", 1), "#/tag/love/");
  assert.equal(tagHref("be-yourself", 1), "#/tag/be-yourself/");
  assert.equal(tagHref("love", 2), "#/tag/love/page/2/");
  assert.equal(tagHref("be-yourself", 12), "#/tag/be-yourself/page/12/");

  assert.equal(authorHref("Albert-Einstein"), "#/author/Albert-Einstein/");
  assert.equal(authorHref("J-K-Rowling"), "#/author/J-K-Rowling/");
  assert.equal(authorHref("Madeleine-LEngle"), "#/author/Madeleine-LEngle/");
});

test("href builders round-trip through parseRoute", () => {
  assert.deepEqual(parseRoute(homeHref(3)), { name: "home", page: 3 });
  assert.deepEqual(parseRoute(tagHref("be-yourself", 4)), {
    name: "tag",
    tag: "be-yourself",
    page: 4,
  });
  assert.deepEqual(parseRoute(authorHref("Madeleine-LEngle")), {
    name: "author",
    author: "Madeleine-LEngle",
  });
});

test("documentTitle names the home and not-found views", () => {
  assert.equal(documentTitle({ name: "home", page: 1 }), "Quotes to Scrape");
  assert.equal(
    documentTitle({ name: "home", page: 3 }),
    "Quotes to Scrape — Page 3",
  );
  assert.equal(
    documentTitle({ name: "notfound", path: "#/login" }),
    "Quotes to Scrape — Page not found",
  );
});

test("documentTitle names a tag with the display name from the data module", () => {
  const tag = getTag("love");
  assert.equal(
    documentTitle({ name: "tag", tag: "love", page: 1 }),
    `Quotes to Scrape — Tag: ${tag ? tag.name : "love"}`,
  );
  assert.equal(
    documentTitle({ name: "tag", tag: "unknown-tag", page: 1 }),
    "Quotes to Scrape — Tag: unknown-tag",
  );
});

test("documentTitle names an author with the display name from the data module", () => {
  const author = getAuthor("Albert-Einstein");
  assert.equal(
    documentTitle({ name: "author", author: "Albert-Einstein" }),
    `Quotes to Scrape — ${author ? author.name : "Albert-Einstein"}`,
  );
});
