import test from "node:test";
import assert from "node:assert/strict";

import {
  AUTHORS,
  QUOTES,
  getAuthor,
  getAuthorPage,
  getHomePage,
  getTag,
  getTagPage,
  getTopTags,
} from "../js/data/index.js";

const AUTHOR_FIELDS = [
  "slug",
  "name",
  "bornDate",
  "bornLocation",
  "description",
];

const TAG_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function expectedAuthorSlug(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’,]/g, "")
    .replace(/[^A-Za-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

test("the data module exposes author and quote arrays", () => {
  assert.ok(Array.isArray(AUTHORS));
  assert.ok(Array.isArray(QUOTES));
});

test("every author carries the required string fields", () => {
  for (const author of AUTHORS) {
    for (const field of AUTHOR_FIELDS) {
      assert.equal(
        typeof author[field],
        "string",
        `author ${author.slug ?? "?"} is missing the string field "${field}"`,
      );
      assert.ok(
        author[field].trim().length > 0,
        `author ${author.slug ?? "?"} has an empty "${field}"`,
      );
    }
  }
});

test("author slugs follow the original site's naming rules", () => {
  const seen = new Set();
  for (const author of AUTHORS) {
    assert.equal(
      author.slug,
      expectedAuthorSlug(author.name),
      `author slug "${author.slug}" does not match the name "${author.name}"`,
    );
    assert.ok(
      !seen.has(author.slug),
      `duplicate author slug "${author.slug}"`,
    );
    seen.add(author.slug);
  }
});

test("birth dates are written in long English form", () => {
  for (const author of AUTHORS) {
    assert.match(
      author.bornDate,
      /^[A-Z][a-z]+ \d{1,2}, \d{4}$/,
      `author "${author.slug}" has the non-standard born date "${author.bornDate}"`,
    );
  }
});

test("every quote carries a text, an author and at least one tag", () => {
  for (const quote of QUOTES) {
    assert.equal(
      typeof quote.text,
      "string",
      `quote by ${quote.author ?? "?"} has no text`,
    );
    assert.ok(
      quote.text.trim().length > 0,
      "a quote has an empty text",
    );
    assert.equal(
      typeof quote.author,
      "string",
      `quote "${quote.text}" has no author reference`,
    );
    assert.ok(
      quote.author.length > 0,
      `quote "${quote.text}" has an empty author reference`,
    );
    assert.ok(
      Array.isArray(quote.tags),
      `quote "${quote.text}" has no tags array`,
    );
    assert.ok(
      quote.tags.length >= 1,
      `quote "${quote.text}" has no tag`,
    );
  }
});

test("quote tags use lowercase dash slugs and are unique per quote", () => {
  for (const quote of QUOTES) {
    for (const tag of quote.tags) {
      assert.equal(
        typeof tag,
        "string",
        `quote "${quote.text}" has a non-string tag`,
      );
      assert.match(
        tag,
        TAG_SLUG,
        `tag "${tag}" on quote "${quote.text}" is not a lowercase dash slug`,
      );
    }
    assert.equal(
      new Set(quote.tags).size,
      quote.tags.length,
      `quote "${quote.text}" repeats a tag`,
    );
  }
});

test("every author reference resolves with a description and born date", () => {
  for (const quote of QUOTES) {
    const author = getAuthor(quote.author);
    assert.ok(
      author,
      `quote "${quote.text}" references unknown author "${quote.author}"`,
    );
    assert.ok(
      author.description.trim().length > 0,
      `author "${author.slug}" has no description`,
    );
    assert.ok(
      author.bornDate.trim().length > 0,
      `author "${author.slug}" has no born date`,
    );
  }
});

test("every tag reference resolves to a tag page with quotes", () => {
  for (const quote of QUOTES) {
    for (const tagSlug of quote.tags) {
      const tag = getTag(tagSlug);
      assert.ok(tag, `quote "${quote.text}" references unknown tag "${tagSlug}"`);

      const page = getTagPage(tagSlug, 1);
      assert.ok(page, `tag "${tagSlug}" has no first page`);
      assert.equal(page.tag.slug, tagSlug);
      assert.ok(
        page.quotes.length > 0,
        `tag page for "${tagSlug}" has no quotes`,
      );
    }
  }
});

test("every author resolves to a reachable author page", () => {
  for (const author of AUTHORS) {
    const page = getAuthorPage(author.slug);
    assert.ok(page, `author "${author.slug}" has no page`);
    assert.equal(page.author.slug, author.slug);
  }
});

test("there is no duplicate text/author pair", () => {
  const seen = new Set();
  for (const quote of QUOTES) {
    const key = `${quote.author}\u0000${quote.text}`;
    assert.ok(
      !seen.has(key),
      `duplicate quote "${quote.text}" by "${quote.author}"`,
    );
    seen.add(key);
  }
});

test("getTopTags orders by count descending, then name ascending", () => {
  const tags = getTopTags();
  assert.ok(Array.isArray(tags));
  assert.ok(tags.length <= 10);

  for (let index = 1; index < tags.length; index += 1) {
    const previous = tags[index - 1];
    const current = tags[index];
    assert.ok(
      previous.count > current.count ||
        (previous.count === current.count && previous.name <= current.name),
      `"${previous.name}" (${previous.count}) must sort before "${current.name}" (${current.count})`,
    );
  }

  assert.ok(getTopTags(3).length <= 3);
});

test("tag counts match the number of quotes carrying each tag", () => {
  const expected = new Map();
  for (const quote of QUOTES) {
    for (const tag of quote.tags) {
      expected.set(tag, (expected.get(tag) ?? 0) + 1);
    }
  }

  const tags = getTopTags(Number.MAX_SAFE_INTEGER);
  assert.equal(tags.length, expected.size);
  for (const tag of tags) {
    assert.equal(
      tag.count,
      expected.get(tag.slug),
      `tag "${tag.slug}" has the wrong count`,
    );
  }
});

test(
  "getHomePage splits the collection into pages of ten",
  { skip: QUOTES.length === 0 ? "the dataset is not populated yet" : false },
  () => {
    const totalPages = Math.ceil(QUOTES.length / 10);
    const first = getHomePage(1);
    assert.ok(first);
    assert.equal(first.page, 1);
    assert.equal(first.totalPages, totalPages);
    assert.equal(first.quotes.length, Math.min(10, QUOTES.length));
    assert.deepEqual(first.quotes, QUOTES.slice(0, 10));

    const last = getHomePage(totalPages);
    assert.ok(last);
    assert.equal(last.page, totalPages);
    assert.equal(
      last.quotes.length,
      QUOTES.length - (totalPages - 1) * 10,
    );

    assert.equal(getHomePage(totalPages + 1), null);
  },
);

test("data accessors reject pages and slugs that do not exist", () => {
  assert.equal(getHomePage(0), null);
  assert.equal(getHomePage(-1), null);
  assert.equal(getHomePage(1.5), null);
  assert.equal(getHomePage(Number.MAX_SAFE_INTEGER), null);

  assert.equal(getAuthor("__does-not-exist__"), null);
  assert.equal(getAuthorPage("__does-not-exist__"), null);
  assert.equal(getTag("__does-not-exist__"), null);
  assert.equal(getTagPage("__does-not-exist__", 1), null);
});
