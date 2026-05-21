const tabs = document.querySelectorAll("[data-tab]");
const panels = document.querySelectorAll(".tab-panel");
const directTabButtons = document.querySelectorAll("[data-tab-target]");
const modalLayer = document.querySelector(".modal-layer");
const modalPanels = document.querySelectorAll("[data-modal-panel]");

function activateTab(id) {
  tabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.tab === id);
  });
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === id);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => activateTab(tab.dataset.tab));
});

directTabButtons.forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.tabTarget));
});

document.querySelectorAll("[data-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.open;
    modalPanels.forEach((panel) => {
      panel.hidden = panel.dataset.modalPanel !== target;
    });
    modalLayer.hidden = false;
  });
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    modalLayer.hidden = true;
  });
});

modalLayer.addEventListener("click", (event) => {
  if (event.target === modalLayer) {
    modalLayer.hidden = true;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modalLayer.hidden = true;
  }
});
