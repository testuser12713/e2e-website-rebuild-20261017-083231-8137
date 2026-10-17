import test from "node:test";
import assert from "node:assert/strict";

import { AUTHORS } from "../js/data/authors-part2.js";

const REQUIRED_FIELDS = [
  "slug",
  "name",
  "bornDate",
  "bornLocation",
  "description",
];

const BORN_DATE = /^[A-Z][a-z]+ \d{1,2}, \d{4}$/;
const AUTHOR_SLUG = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;

function expectedAuthorSlug(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’,]/g, "")
    .replace(/[^A-Za-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

test("authors-part2 contains the F-L share of the dataset", () => {
  assert.ok(Array.isArray(AUTHORS));
  assert.ok(AUTHORS.length > 0, "the F-L share must not be empty");
});

test("every part2 author carries all required fields with content", () => {
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

test("part2 author slugs follow the contract format", () => {
  const seen = new Set();
  for (const author of AUTHORS) {
    assert.match(
      author.slug,
      AUTHOR_SLUG,
      `author slug "${author.slug}" is not a dash-separated slug`,
    );
    assert.equal(
      author.slug,
      expectedAuthorSlug(author.name),
      `author slug "${author.slug}" does not match the name "${author.name}"`,
    );
    assert.match(
      author.slug,
      /^[F-L]/,
      `author "${author.slug}" does not belong to the F-L share`,
    );
    assert.ok(
      !seen.has(author.slug),
      `duplicate author slug "${author.slug}"`,
    );
    seen.add(author.slug);
  }
});

test("part2 born dates use the original long English form", () => {
  for (const author of AUTHORS) {
    assert.match(
      author.bornDate,
      BORN_DATE,
      `author "${author.slug}" has the non-standard born date "${author.bornDate}"`,
    );
  }
});

test("part2 born locations are place names without the leading preposition", () => {
  for (const author of AUTHORS) {
    assert.ok(
      !/^in\s+/i.test(author.bornLocation),
      `author "${author.slug}" keeps the "in" prefix in "${author.bornLocation}"`,
    );
  }
});
