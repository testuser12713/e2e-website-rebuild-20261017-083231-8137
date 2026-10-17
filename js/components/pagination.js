export function renderPagination(options) {
  const element = document.createElement("nav");
  element.className = "pagination";
  element.setAttribute("aria-label", "Pagination");
  return element;
}
