const panelButtons = document.querySelectorAll("[data-panel]");
const panelNavButtons = document.querySelectorAll(".panel-nav [data-panel]");
const panels = document.querySelectorAll(".task-panel");

function showPanel(panelName) {
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === `panel-${panelName}`);
  });

  panelNavButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.panel === panelName);
  });

  const targetPanel = document.querySelector(`#panel-${panelName}`);
  if (targetPanel) {
    targetPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

panelButtons.forEach((button) => {
  button.addEventListener("click", () => showPanel(button.dataset.panel));
});

const siteCards = document.querySelectorAll(".site-card");
const selectedName = document.querySelector("#selected-name");
const selectedMeta = document.querySelector("#selected-meta");

siteCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("button")) {
      return;
    }

    siteCards.forEach((item) => item.classList.remove("is-selected"));
    card.classList.add("is-selected");
    selectedName.textContent = card.dataset.siteName;
    selectedMeta.textContent = `${card.dataset.siteState} from ${card.dataset.source}`;
  });
});

const managerButtons = document.querySelectorAll("[data-manager-tab]");
const managerPanes = document.querySelectorAll(".manager-pane");

managerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tabName = button.dataset.managerTab;

    managerButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    managerPanes.forEach((pane) => {
      pane.classList.toggle("is-active", pane.id === `manager-${tabName}`);
    });
  });
});

document.querySelectorAll(".soft-tabs button, .category-row button").forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.parentElement.querySelectorAll("button");
    group.forEach((item) => item.classList.toggle("is-active", item === button));
  });
});
