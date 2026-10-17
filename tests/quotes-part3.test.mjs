import test from "node:test";
import assert from "node:assert/strict";

import { AUTHORS } from "../js/data/authors-part3.js";
import { QUOTES } from "../js/data/quotes-part3.js";

const TAG_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const AUTHOR_SLUG = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;

const authorSlugs = new Set(AUTHORS.map((author) => author.slug));

test("the M-Z quote share is not empty", () => {
  assert.ok(Array.isArray(QUOTES));
  assert.ok(QUOTES.length > 0);
});

test("every quote carries a non-empty text, author and tag list", () => {
  for (const quote of QUOTES) {
    assert.equal(
      typeof quote.text,
      "string",
      `quote by ${quote.author ?? "?"} has no text`,
    );
    assert.ok(quote.text.trim().length > 0, "a quote has an empty text");

    assert.equal(
      typeof quote.author,
      "string",
      `quote "${quote.text}" has no author reference`,
    );
    assert.ok(
      quote.author.trim().length > 0,
      `quote "${quote.text}" has an empty author reference`,
    );
    assert.match(
      quote.author,
      AUTHOR_SLUG,
      `quote "${quote.text}" has the malformed author slug "${quote.author}"`,
    );

    assert.ok(
      Array.isArray(quote.tags),
      `quote "${quote.text}" has no tags array`,
    );
    assert.ok(quote.tags.length >= 1, `quote "${quote.text}" has no tag`);

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

test("every quote belongs to the M-Z share by author slug", () => {
  for (const quote of QUOTES) {
    const firstLetter = quote.author.charAt(0).toUpperCase();
    assert.ok(
      firstLetter >= "M" && firstLetter <= "Z",
      `quote "${quote.text}" by "${quote.author}" does not belong to the M-Z share`,
    );
  }
});

test("every author reference resolves inside the M-Z share", () => {
  for (const quote of QUOTES) {
    assert.ok(
      authorSlugs.has(quote.author),
      `quote "${quote.text}" references unknown author "${quote.author}"`,
    );
  }
});

test("every M-Z author in this share has at least one quote", () => {
  const quotedAuthors = new Set(QUOTES.map((quote) => quote.author));
  for (const author of AUTHORS) {
    assert.ok(
      quotedAuthors.has(author.slug),
      `author "${author.slug}" has no quote in the M-Z share`,
    );
  }
});

test("there is no duplicate text/author pair inside the M-Z share", () => {
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
