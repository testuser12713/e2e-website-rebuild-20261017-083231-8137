import { getTopTags } from "../data/index.js";
import { tagHref } from "../router.js";
import { renderTopTags } from "../components/top-tags.js";

export function renderTopTagsSidebar(root, activeTag) {
  const entries = getTopTags(10).map((tag) => ({
    slug: tag.slug,
    name: tag.name,
    count: tag.count,
    href: tagHref(tag.slug, 1),
  }));

  root.replaceChildren(renderTopTags(entries, activeTag));
}
