import { AUTHORS as AUTHORS_PART_1 } from "./authors-part1.js";
import { AUTHORS as AUTHORS_PART_2 } from "./authors-part2.js";
import { AUTHORS as AUTHORS_PART_3 } from "./authors-part3.js";
import { QUOTES as QUOTES_PART_1 } from "./quotes-part1.js";
import { QUOTES as QUOTES_PART_2 } from "./quotes-part2.js";
import { QUOTES as QUOTES_PART_3 } from "./quotes-part3.js";

const PAGE_SIZE = 10;

export const AUTHORS = [
  ...AUTHORS_PART_1,
  ...AUTHORS_PART_2,
  ...AUTHORS_PART_3,
];

export const QUOTES = [
  ...QUOTES_PART_1,
  ...QUOTES_PART_2,
  ...QUOTES_PART_3,
];

const authorsBySlug = new Map(AUTHORS.map((author) => [author.slug, author]));

function compareTags(a, b) {
  if (a.count !== b.count) {
    return b.count - a.count;
  }
  if (a.name === b.name) {
    return 0;
  }
  return a.name < b.name ? -1 : 1;
}

function collectTags() {
  const counts = new Map();
  for (const quote of QUOTES) {
    for (const tag of quote.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, name: slug, count }))
    .sort(compareTags);
}

const TAGS = collectTags();
const tagsBySlug = new Map(TAGS.map((tag) => [tag.slug, tag]));

function isValidPage(page, totalPages) {
  return Number.isInteger(page) && page >= 1 && page <= totalPages;
}

export function getHomePage(page) {
  const totalPages = Math.ceil(QUOTES.length / PAGE_SIZE);
  if (!isValidPage(page, totalPages)) {
    return null;
  }
  const start = (page - 1) * PAGE_SIZE;
  return {
    quotes: QUOTES.slice(start, start + PAGE_SIZE),
    page,
    totalPages,
  };
}

export function getTagPage(tagSlug, page) {
  const tag = tagsBySlug.get(tagSlug);
  if (!tag) {
    return null;
  }
  const tagged = QUOTES.filter((quote) => quote.tags.includes(tagSlug));
  const totalPages = Math.ceil(tagged.length / PAGE_SIZE);
  if (!isValidPage(page, totalPages)) {
    return null;
  }
  const start = (page - 1) * PAGE_SIZE;
  return {
    tag,
    quotes: tagged.slice(start, start + PAGE_SIZE),
    page,
    totalPages,
  };
}

export function getAuthorPage(slug) {
  const author = authorsBySlug.get(slug);
  if (!author) {
    return null;
  }
  return {
    author,
    quotes: QUOTES.filter((quote) => quote.author === slug),
  };
}

export function getAuthor(slug) {
  return authorsBySlug.get(slug) ?? null;
}

export function getTag(slug) {
  return tagsBySlug.get(slug) ?? null;
}

export function getTopTags(limit = 10) {
  const count =
    typeof limit === "number" && Number.isFinite(limit)
      ? Math.max(0, Math.floor(limit))
      : 10;
  return TAGS.slice(0, count);
}
