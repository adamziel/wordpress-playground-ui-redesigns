const search = document.querySelector("#commandSearch");
const clearSearch = document.querySelector("#clearSearch");
const filterButtons = [...document.querySelectorAll(".filter-chip")];
const groups = [...document.querySelectorAll(".result-group")];
const results = [...document.querySelectorAll(".command-result")];
const title = document.querySelector("#inspectorTitle");
const kind = document.querySelector("#inspectorKind");
const detail = document.querySelector("#inspectorDetail");
const action = document.querySelector("#inspectorAction");

let activeFilter = "all";

function setInspector(button) {
  results.forEach((result) => result.classList.remove("active"));
  button.classList.add("active");
  title.textContent = button.dataset.title;
  kind.textContent = button.dataset.kind;
  detail.textContent = button.dataset.detail;
  action.textContent = button.dataset.action;
}

function applyFilter() {
  const query = search.value.trim().toLowerCase();
  groups.forEach((group) => {
    const groupName = group.dataset.group;
    let visibleCount = 0;
    group.querySelectorAll(".command-result").forEach((result) => {
      const matchesFilter = activeFilter === "all" || activeFilter === groupName;
      const matchesQuery = result.textContent.toLowerCase().includes(query) || result.dataset.detail.toLowerCase().includes(query);
      const isVisible = matchesFilter && matchesQuery;
      result.classList.toggle("hidden", !isVisible);
      if (isVisible) visibleCount += 1;
    });
    group.classList.toggle("hidden", visibleCount === 0);
  });

  const firstVisible = results.find((result) => !result.classList.contains("hidden"));
  if (firstVisible) setInspector(firstVisible);
}

results.forEach((result) => {
  result.addEventListener("click", () => setInspector(result));
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((chip) => chip.classList.remove("active"));
    button.classList.add("active");
    applyFilter();
  });
});

search.addEventListener("input", applyFilter);
clearSearch.addEventListener("click", () => {
  search.value = "";
  search.focus();
  applyFilter();
});

applyFilter();
