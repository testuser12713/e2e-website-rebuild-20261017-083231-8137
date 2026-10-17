function buildControl({ href, label, disabled }) {
  const control = document.createElement(disabled ? "span" : "a");
  control.className = "button button--secondary pagination__link";
  control.textContent = label;

  if (disabled) {
    control.setAttribute("aria-disabled", "true");
  } else {
    control.setAttribute("href", href);
  }

  return control;
}

export function renderPagination(options) {
  const { page, totalPages, hrefFor } = options;

  const element = document.createElement("nav");
  element.className = "pagination";
  element.setAttribute("aria-label", "Pagination");

  const previous = buildControl({
    href: page > 1 ? hrefFor(page - 1) : null,
    label: "← Previous",
    disabled: page <= 1,
  });

  const status = document.createElement("span");
  status.className = "pagination__status";
  status.setAttribute("aria-live", "polite");
  status.textContent = `Page ${page} of ${totalPages}`;

  const next = buildControl({
    href: page < totalPages ? hrefFor(page + 1) : null,
    label: "Next →",
    disabled: page >= totalPages,
  });

  element.append(previous, status, next);
  return element;
}
