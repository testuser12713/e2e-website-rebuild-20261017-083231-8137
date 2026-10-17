import { getAuthor, getTag } from "./data/index.js";

const HOME_PATH = /^#\/$/;
const HOME_PAGE_PATH = /^#\/page\/([1-9]\d*)\/$/;
const TAG_PATH = /^#\/tag\/([^/]+)\/$/;
const TAG_PAGE_PATH = /^#\/tag\/([^/]+)\/page\/([1-9]\d*)\/$/;
const AUTHOR_PATH = /^#\/author\/([^/]+)\/$/;

function decodeSegment(segment) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function parseRoute(hash) {
  if (typeof hash !== "string") {
    return { name: "notfound", path: "" };
  }

  if (HOME_PATH.test(hash)) {
    return { name: "home", page: 1 };
  }

  let match = hash.match(HOME_PAGE_PATH);
  if (match) {
    return { name: "home", page: Number(match[1]) };
  }

  match = hash.match(TAG_PAGE_PATH);
  if (match) {
    return {
      name: "tag",
      tag: decodeSegment(match[1]),
      page: Number(match[2]),
    };
  }

  match = hash.match(TAG_PATH);
  if (match) {
    return { name: "tag", tag: decodeSegment(match[1]), page: 1 };
  }

  match = hash.match(AUTHOR_PATH);
  if (match) {
    return { name: "author", author: decodeSegment(match[1]) };
  }

  return { name: "notfound", path: hash };
}

function normalizePage(page) {
  return Number.isInteger(page) && page > 1 ? page : 1;
}

export function homeHref(page) {
  const target = normalizePage(page);
  return target === 1 ? "#/" : `#/page/${target}/`;
}

export function tagHref(tag, page) {
  const target = normalizePage(page);
  const base = `#/tag/${encodeURIComponent(tag)}/`;
  return target === 1 ? base : `${base}page/${target}/`;
}

export function authorHref(authorSlug) {
  return `#/author/${encodeURIComponent(authorSlug)}/`;
}

export function documentTitle(route) {
  switch (route.name) {
    case "home":
      return route.page > 1
        ? `Quotes to Scrape — Page ${route.page}`
        : "Quotes to Scrape";
    case "tag": {
      const tag = getTag(route.tag);
      return `Quotes to Scrape — Tag: ${tag ? tag.name : route.tag}`;
    }
    case "author": {
      const author = getAuthor(route.author);
      return `Quotes to Scrape — ${author ? author.name : route.author}`;
    }
    case "notfound":
      return "Quotes to Scrape — Page not found";
    default:
      return "Quotes to Scrape";
  }
}
