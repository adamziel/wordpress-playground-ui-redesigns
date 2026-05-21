const panelButtons = document.querySelectorAll("[data-panel]");
const panelViews = document.querySelectorAll("[data-panel-view]");

function showPanel(name) {
  panelViews.forEach((view) => {
    view.classList.toggle("active", view.dataset.panelView === name);
  });

  panelButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.panel === name);
  });

  const deck = document.querySelector(".control-deck");
  if (deck && window.matchMedia("(max-width: 760px)").matches) {
    deck.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

panelButtons.forEach((button) => {
  button.addEventListener("click", () => showPanel(button.dataset.panel));
});

document.querySelectorAll(".filter-row button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-row button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});
