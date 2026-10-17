export function renderNotFoundView(root, route) {
  root.replaceChildren();

  const panel = document.createElement("section");
  panel.className = "not-found";

  const eyebrow = document.createElement("p");
  eyebrow.className = "not-found__eyebrow";
  eyebrow.textContent = "404";

  const heading = document.createElement("h1");
  heading.className = "not-found__title";
  heading.setAttribute("tabindex", "-1");
  heading.textContent = "This page doesn't exist";

  const body = document.createElement("p");
  body.className = "not-found__body";
  body.textContent =
    "The address you followed doesn't match any quote, author or tag in this collection.";

  const action = document.createElement("a");
  action.className = "button button--primary not-found__action";
  action.setAttribute("href", "#/");
  action.textContent = "← Back to all quotes";

  const caption = document.createElement("p");
  caption.className = "not-found__caption";
  caption.textContent = "Or pick a tag from the list.";

  panel.append(eyebrow, heading, body, action, caption);
  root.append(panel);
  return true;
}
