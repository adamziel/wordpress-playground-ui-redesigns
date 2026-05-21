const cards = Array.from(document.querySelectorAll(".blueprint-card"));
const categories = Array.from(document.querySelectorAll(".category"));
const searchInput = document.querySelector("#searchInput");
const clearSearch = document.querySelector("#clearSearch");
const resultsTitle = document.querySelector("#resultsTitle");
const selectedName = document.querySelector("#selectedName");
const selectedDesc = document.querySelector("#selectedDesc");
const selectedStack = document.querySelector("#selectedStack");
const bandTabs = Array.from(document.querySelectorAll(".band-tab"));
const bandPanels = Array.from(document.querySelectorAll(".band-panel"));
const sourcePills = Array.from(document.querySelectorAll(".source-pill"));

let activeCategory = "all";

function selectCard(card) {
  cards.forEach((item) => item.classList.remove("selected"));
  card.classList.add("selected");
  selectedName.textContent = card.dataset.name;
  selectedDesc.textContent = card.dataset.desc;
  selectedStack.textContent = card.dataset.stack;

  const badge = card.querySelector(".card-title span");
  cards.forEach((item) => {
    const itemBadge = item.querySelector(".card-title span");
    if (itemBadge && itemBadge.textContent === "Selected") {
      itemBadge.textContent = item.dataset.category.includes("featured") ? "Featured" : "Blueprint";
    }
  });
  if (badge) {
    badge.textContent = "Selected";
  }
}

function filterCards() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;

  cards.forEach((card) => {
    const haystack = `${card.dataset.name} ${card.dataset.category} ${card.dataset.desc}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesCategory = activeCategory === "all" || card.dataset.category.includes(activeCategory);
    const shouldShow = matchesQuery && matchesCategory;
    card.classList.toggle("hidden", !shouldShow);
    if (shouldShow) visible += 1;
  });

  const categoryText = activeCategory === "all" ? "all" : activeCategory;
  resultsTitle.textContent = `Showing ${visible} ${categoryText} blueprint${visible === 1 ? "" : "s"}`;
}

function openPanel(panelName) {
  const targetPanel = document.querySelector(`#panel-${panelName}`);
  if (!targetPanel) return;

  bandTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.panel === panelName));
  bandPanels.forEach((panel) => panel.classList.toggle("active", panel === targetPanel));
  targetPanel.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

cards.forEach((card) => {
  card.addEventListener("click", () => selectCard(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectCard(card);
    }
  });
  card.setAttribute("tabindex", "0");
});

categories.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    categories.forEach((category) => category.classList.toggle("active", category === button));
    filterCards();
  });
});

searchInput.addEventListener("input", filterCards);

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  filterCards();
});

bandTabs.forEach((tab) => {
  tab.addEventListener("click", () => openPanel(tab.dataset.panel));
});

document.querySelectorAll("[data-open-panel]").forEach((button) => {
  button.addEventListener("click", () => {
    const aliases = {
      imports: "starts",
      prs: "starts",
      github: "starts",
      gallery: "save",
    };
    openPanel(aliases[button.dataset.openPanel] || button.dataset.openPanel);
  });
});

sourcePills.forEach((pill) => {
  pill.addEventListener("click", () => {
    sourcePills.forEach((item) => item.classList.remove("active"));
    pill.classList.add("active");
  });
});

filterCards();
