const drawerButtons = document.querySelectorAll("[data-drawer]");
const drawerPanels = document.querySelectorAll("[data-drawer-panel]");
const chromeActions = document.querySelectorAll(".chrome-actions [data-drawer]");

function openDrawer(name) {
  drawerPanels.forEach((panel) => {
    panel.classList.toggle("open", panel.dataset.drawerPanel === name);
  });
  chromeActions.forEach((button) => {
    button.classList.toggle("active", button.dataset.drawer === name);
  });
}

drawerButtons.forEach((button) => {
  button.addEventListener("click", () => openDrawer(button.dataset.drawer));
});

const managerTabs = document.querySelectorAll("[data-manager-tab]");
const managerPanels = document.querySelectorAll("[data-manager-panel]");

managerTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const name = tab.dataset.managerTab;
    managerTabs.forEach((item) => item.classList.toggle("active", item === tab));
    managerPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.managerPanel === name);
    });
  });
});

const dialogTriggers = document.querySelectorAll("[data-dialog]");
const dialogPanels = document.querySelectorAll("[data-dialog-panel]");
const closeButtons = document.querySelectorAll("[data-close-dialog]");

function closeDialogs() {
  dialogPanels.forEach((panel) => {
    panel.hidden = true;
  });
}

dialogTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    closeDialogs();
    const panel = document.querySelector(`[data-dialog-panel="${trigger.dataset.dialog}"]`);
    if (panel) {
      panel.hidden = false;
    }
  });
});

closeButtons.forEach((button) => button.addEventListener("click", closeDialogs));

dialogPanels.forEach((panel) => {
  panel.addEventListener("click", (event) => {
    if (event.target === panel) {
      closeDialogs();
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDialogs();
  }
});

openDrawer("launch");
