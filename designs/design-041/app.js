const views = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll("[data-view]");
const stepItems = document.querySelectorAll(".stepper li");
const stepPanels = document.querySelectorAll(".step-panel");
const stepButtons = document.querySelectorAll("[data-step-button]");
const sourceTiles = document.querySelectorAll(".source-tile");
const sourceInput = document.querySelector("#source-input");
const tabs = document.querySelectorAll(".tab");
const tabPanels = document.querySelectorAll(".tab-panel");

function showView(id) {
  views.forEach((view) => view.classList.toggle("active", view.id === id));
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === id);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showStep(id) {
  stepItems.forEach((item) => item.classList.toggle("active", item.dataset.step === id));
  stepPanels.forEach((panel) => panel.classList.toggle("active", panel.id === `step-${id}`));
}

function showTab(id) {
  tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === id));
  tabPanels.forEach((panel) => panel.classList.toggle("active", panel.id === `panel-${id}`));
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

stepButtons.forEach((button) => {
  button.addEventListener("click", () => showStep(button.dataset.stepButton));
});

sourceTiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    sourceTiles.forEach((item) => item.classList.remove("selected"));
    tile.classList.add("selected");
    if (sourceInput) sourceInput.value = tile.dataset.sourceText;
  });
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => showTab(tab.dataset.tab));
});
