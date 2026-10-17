export function renderQuoteCard(card) {
  const element = document.createElement("article");
  element.className = "quote-card";

  const mark = document.createElement("span");
  mark.className = "quote-card__mark";
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = "“";

  const text = document.createElement("p");
  text.className = "quote-card__text";
  text.textContent = card.text;

  const meta = document.createElement("div");
  meta.className = "quote-card__meta";

  const author = document.createElement("a");
  author.className = "quote-card__author";
  author.setAttribute("href", card.authorHref);

  const authorName = document.createElement("span");
  authorName.className = "quote-card__author-name";
  authorName.textContent = card.authorName;

  const authorHint = document.createElement("span");
  authorHint.className = "quote-card__author-hint";
  authorHint.textContent = "(about)";

  author.append(authorName, authorHint);
  meta.append(author);

  for (const tag of card.tags) {
    const chip = document.createElement("a");
    chip.className = "tag-chip";
    chip.setAttribute("href", tag.href);
    chip.textContent = tag.name;
    meta.append(chip);
  }

  element.append(mark, text, meta);
  return element;
}
