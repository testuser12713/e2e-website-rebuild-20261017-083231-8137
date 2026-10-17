import test from "node:test";
import assert from "node:assert/strict";

import { AUTHORS } from "../js/data/authors-part1.js";
import { QUOTES } from "../js/data/quotes-part1.js";

const TAG_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const AUTHOR_SLUG = /^[A-E][A-Za-z0-9]*(-[A-Za-z0-9]+)*$/;

test("quotes-part1 exports a non-empty quote list", () => {
  assert.ok(Array.isArray(QUOTES));
  assert.ok(QUOTES.length > 0, "the A–E quote list is empty");
});

test("every A–E quote carries a text, an author and at least one tag", () => {
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
    assert.match(
      quote.author,
      AUTHOR_SLUG,
      `quote "${quote.text}" references a non-A–E author "${quote.author}"`,
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

test("every quote author resolves inside authors-part1", () => {
  const slugs = new Set(AUTHORS.map((author) => author.slug));
  for (const quote of QUOTES) {
    assert.ok(
      slugs.has(quote.author),
      `quote "${quote.text}" references unknown author "${quote.author}"`,
    );
  }
});

test("quote tags are lowercase dash slugs and unique per quote", () => {
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

test("no quote text/author pair appears twice in the A–E files", () => {
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
