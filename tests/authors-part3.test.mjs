import test from "node:test";
import assert from "node:assert/strict";

import { AUTHORS } from "../js/data/authors-part3.js";

const AUTHOR_FIELDS = [
  "slug",
  "name",
  "bornDate",
  "bornLocation",
  "description",
];

function expectedAuthorSlug(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’,]/g, "")
    .replace(/[^A-Za-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

test("the M-Z author share is not empty", () => {
  assert.ok(Array.isArray(AUTHORS));
  assert.ok(AUTHORS.length > 0);
});

test("every author carries all required non-empty fields", () => {
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
    assert.match(
      author.slug,
      /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/,
      `author slug "${author.slug}" is not a dash-separated slug`,
    );
    assert.ok(
      !seen.has(author.slug),
      `duplicate author slug "${author.slug}"`,
    );
    seen.add(author.slug);
  }
});

test("every author belongs to the M-Z share by slug", () => {
  for (const author of AUTHORS) {
    const firstLetter = author.slug.charAt(0).toUpperCase();
    assert.ok(
      firstLetter >= "M" && firstLetter <= "Z",
      `author "${author.slug}" does not belong to the M-Z share`,
    );
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
