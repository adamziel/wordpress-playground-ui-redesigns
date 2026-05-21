const searchInput = document.querySelector("#commandSearch");
const filters = [...document.querySelectorAll(".filter[data-filter]")];
const results = [...document.querySelectorAll(".result-row")];
const inspector = document.querySelector("#inspector");

function renderPanel(key) {
  const template = document.querySelector(`#panel-${key}`);
  if (!template) return;
  inspector.replaceChildren(template.content.cloneNode(true));
}

function selectResult(row) {
  results.forEach((item) => item.classList.toggle("active", item === row));
  renderPanel(row.dataset.key);
}

function activeFilter() {
  return filters.find((filter) => filter.classList.contains("active"))?.dataset.filter || "all";
}

function applySearch() {
  const query = searchInput.value.trim().toLowerCase();
  const group = activeFilter();
  let firstVisible = null;

  results.forEach((row) => {
    const matchesGroup = group === "all" || row.dataset.group === group;
    const matchesQuery = !query || row.dataset.search.includes(query) || row.textContent.toLowerCase().includes(query);
    const visible = matchesGroup && matchesQuery;
    row.classList.toggle("hidden", !visible);
    if (visible && !firstVisible) firstVisible = row;
  });

  if (firstVisible && !firstVisible.classList.contains("active")) {
    selectResult(firstVisible);
  }
}

results.forEach((row) => {
  row.addEventListener("click", () => selectResult(row));
});

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((item) => item.classList.toggle("active", item === filter));
    applySearch();
  });
});

searchInput.addEventListener("input", applySearch);

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== searchInput) {
    event.preventDefault();
    searchInput.focus();
  }
});

document.querySelectorAll("[data-command-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.commandJump;
    const row = results.find((item) => item.dataset.key === key);
    if (!row) return;
    selectResult(row);
    row.scrollIntoView({ block: "center", behavior: "smooth" });
  });
});

renderPanel("new");
