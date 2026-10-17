import test from "node:test";
import assert from "node:assert/strict";

import { AUTHORS } from "../js/data/authors-part2.js";
import { QUOTES } from "../js/data/quotes-part2.js";

const TAG_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const AUTHOR_SLUG = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;

const part2Slugs = new Set(AUTHORS.map((author) => author.slug));

test("quotes-part2 contains the F-L share of the dataset", () => {
  assert.ok(Array.isArray(QUOTES));
  assert.ok(QUOTES.length > 0, "the F-L share must not be empty");
});

test("every part2 quote carries a text, an author and at least one tag", () => {
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

test("part2 quote authors are this share's authors with F-L slugs", () => {
  for (const quote of QUOTES) {
    assert.match(
      quote.author,
      AUTHOR_SLUG,
      `quote "${quote.text}" has the malformed author slug "${quote.author}"`,
    );
    assert.match(
      quote.author,
      /^[F-L]/,
      `quote "${quote.text}" references an author outside the F-L share`,
    );
    assert.ok(
      part2Slugs.has(quote.author),
      `quote "${quote.text}" references unknown author "${quote.author}"`,
    );
  }
});

test("part2 quote tags are lowercase dash slugs, unique per quote", () => {
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

test("part2 has no duplicate text/author pair", () => {
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

test("part2 has no duplicate quote text at all", () => {
  const seen = new Set();
  for (const quote of QUOTES) {
    assert.ok(
      !seen.has(quote.text),
      `duplicate quote text "${quote.text}"`,
    );
    seen.add(quote.text);
  }
});

test("every part2 author is represented by at least one quote", () => {
  const withQuotes = new Set(QUOTES.map((quote) => quote.author));
  for (const author of AUTHORS) {
    assert.ok(
      withQuotes.has(author.slug),
      `author "${author.slug}" has no quote in the F-L share`,
    );
  }
});
