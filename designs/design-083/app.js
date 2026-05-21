const tabButtons = document.querySelectorAll("[data-tab]");
const panels = document.querySelectorAll(".workspace-panel");

function openTab(tabId) {
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabId);
  });
  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === tabId);
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => openTab(button.dataset.tab));
});

document.querySelectorAll("[data-open-tab]").forEach((button) => {
  button.addEventListener("click", () => openTab(button.dataset.openTab));
});

const filters = document.querySelectorAll("[data-filter]");
const cards = document.querySelectorAll("[data-blueprint]");
const search = document.querySelector("#blueprintSearch");

function applyCatalogFilter() {
  const activeFilter = document.querySelector("[data-filter].active")?.dataset.filter || "all";
  const query = (search.value || "").trim().toLowerCase();

  cards.forEach((card) => {
    const cats = card.dataset.cats || "";
    const name = (card.dataset.name || "").toLowerCase();
    const text = card.textContent.toLowerCase();
    const categoryMatch = activeFilter === "all" || cats.includes(activeFilter);
    const searchMatch = !query || name.includes(query) || text.includes(query);
    card.hidden = !(categoryMatch && searchMatch);
  });
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((filter) => filter.classList.remove("active"));
    button.classList.add("active");
    applyCatalogFilter();
  });
});

search.addEventListener("input", applyCatalogFilter);

cards.forEach((card) => {
  card.addEventListener("click", () => {
    cards.forEach((item) => item.classList.remove("selected"));
    card.classList.add("selected");
    document.querySelector("#selectedTitle").textContent = card.dataset.name;
  });
});

const managerTabs = document.querySelectorAll("[data-manager]");
const managerViews = document.querySelectorAll(".manager-view");

managerTabs.forEach((button) => {
  button.addEventListener("click", () => {
    managerTabs.forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    managerViews.forEach((view) => {
      view.classList.toggle("active", view.id === `${button.dataset.manager}-view`);
    });
  });
});

const destinationButtons = document.querySelectorAll("[data-destination]");
const destinationText = document.querySelector("#destinationText");

destinationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    destinationButtons.forEach((destination) => destination.classList.remove("active"));
    button.classList.add("active");
    destinationText.textContent = button.dataset.destination === "browser"
      ? "Browser storage destination selected"
      : "Local directory access requested; file sync will continue after folder selection";
  });
});
