import test from "node:test";
import assert from "node:assert/strict";

import { AUTHORS } from "../js/data/authors-part1.js";

const REQUIRED_FIELDS = [
  "slug",
  "name",
  "bornDate",
  "bornLocation",
  "description",
];

const AUTHOR_SLUG = /^[A-E][A-Za-z0-9]*(-[A-Za-z0-9]+)*$/;

test("authors-part1 exports a non-empty author list", () => {
  assert.ok(Array.isArray(AUTHORS));
  assert.ok(AUTHORS.length > 0, "the A–E author list is empty");
});

test("every A–E author carries all required fields as non-empty strings", () => {
  for (const author of AUTHORS) {
    for (const field of REQUIRED_FIELDS) {
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

test("every A–E author slug follows the original site's naming rules", () => {
  const seen = new Set();
  for (const author of AUTHORS) {
    assert.match(
      author.slug,
      AUTHOR_SLUG,
      `author slug "${author.slug}" does not look like an A–E slug`,
    );
    assert.equal(
      author.slug[0],
      author.slug[0].toUpperCase(),
      `author slug "${author.slug}" must start with an uppercase letter`,
    );
    assert.ok(
      /^[A-E]/.test(author.slug),
      `author slug "${author.slug}" is outside the A–E group`,
    );
    assert.ok(
      !seen.has(author.slug),
      `duplicate author slug "${author.slug}"`,
    );
    seen.add(author.slug);
  }
});

test("every A–E author born date uses the long English form", () => {
  for (const author of AUTHORS) {
    assert.match(
      author.bornDate,
      /^[A-Z][a-z]+ \d{1,2}, \d{4}$/,
      `author "${author.slug}" has the non-standard born date "${author.bornDate}"`,
    );
  }
});
