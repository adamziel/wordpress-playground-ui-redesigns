const panelButtons = document.querySelectorAll("[data-panel]");
const panels = document.querySelectorAll(".panel");
const drawerButtons = document.querySelectorAll("[data-drawer]");
const drawerPanels = document.querySelectorAll(".drawer-panel");
const drawerTitle = document.querySelector("#drawer-title");

const drawerTitles = {
  launch: "Create and start",
  save: "Save Playground",
  library: "Saved Playgrounds",
  gallery: "Blueprint gallery",
  export: "Export and import"
};

function activatePanel(name) {
  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === `panel-${name}`);
  });
  panelButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.panel === name);
  });
}

function activateDrawer(name) {
  drawerPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === `drawer-${name}`);
  });
  drawerButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.drawer === name);
  });
  drawerTitle.textContent = drawerTitles[name] || "Context drawer";
}

panelButtons.forEach((button) => {
  button.addEventListener("click", () => activatePanel(button.dataset.panel));
});

drawerButtons.forEach((button) => {
  button.addEventListener("click", () => activateDrawer(button.dataset.drawer));
});

document.querySelectorAll("[data-panel-target]").forEach((button) => {
  button.addEventListener("click", () => activatePanel(button.dataset.panelTarget));
});

activateDrawer("launch");
