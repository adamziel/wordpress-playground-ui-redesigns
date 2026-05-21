const viewButtons = document.querySelectorAll("[data-view]");
const navButtons = document.querySelectorAll(".main-nav [data-view]");
const drawerPanels = document.querySelectorAll("[data-panel]");
const checklistItems = document.querySelectorAll(".checklist li");

function setView(view) {
  const panelName = view === "overview" ? "overview" : view;

  drawerPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === panelName);
  });

  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view || (view === "save" && button.dataset.view === "saved"));
  });

  checklistItems.forEach((item) => {
    const button = item.querySelector("[data-view]");
    item.classList.toggle("active", button && button.dataset.view === view);
  });
}

viewButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

const managerButtons = document.querySelectorAll("[data-manager]");
const managerPanels = document.querySelectorAll("[data-manager-panel]");

managerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    managerButtons.forEach((item) => item.classList.toggle("active", item === button));
    managerPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.managerPanel === button.dataset.manager);
    });
  });
});
