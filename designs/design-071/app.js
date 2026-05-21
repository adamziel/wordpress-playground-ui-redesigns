const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const id = tab.dataset.tab;
    tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    panels.forEach((panel) => panel.classList.toggle("is-active", panel.id === `tab-${id}`));
  });
});

document.querySelectorAll("[data-focus-panel]").forEach((control) => {
  control.addEventListener("click", () => {
    const target = document.getElementById(control.dataset.focusPanel);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("active");
      window.setTimeout(() => target.classList.remove("active"), 900);
    }
  });
});

const search = document.getElementById("blueprint-search");
const rows = Array.from(document.querySelectorAll(".catalog-row"));
const filterButtons = document.querySelectorAll(".pill");
let activeFilter = "all";

function filterCatalog() {
  const term = search ? search.value.trim().toLowerCase() : "";
  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    const tags = row.dataset.tags || "";
    const matchesTerm = !term || text.includes(term);
    const matchesFilter = activeFilter === "all" || tags.includes(activeFilter);
    row.classList.toggle("is-hidden", !matchesTerm || !matchesFilter);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    filterCatalog();
  });
});

if (search) {
  search.addEventListener("input", filterCatalog);
}
