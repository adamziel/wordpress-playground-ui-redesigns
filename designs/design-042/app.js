const panelButtons = document.querySelectorAll("[data-panel]");
const drawerButtons = document.querySelectorAll("[data-drawer]");
const panels = document.querySelectorAll(".content-panel");
const drawerViews = document.querySelectorAll(".drawer-view");
const siteRows = document.querySelectorAll(".site-row[data-site]");
const selectedTitle = document.querySelector("#selected-title");

function showPanel(panelId, trigger) {
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === panelId);
  });

  panelButtons.forEach((button) => {
    button.classList.toggle("is-active", trigger ? button === trigger : button.dataset.panel === panelId);
  });
}

function showDrawer(drawerId) {
  drawerViews.forEach((view) => {
    view.classList.toggle("is-active", view.id === `drawer-${drawerId}`);
  });
}

panelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showPanel(button.dataset.panel, button);
    showDrawer(button.dataset.drawer);
  });
});

drawerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showDrawer(button.dataset.drawer);
  });
});

siteRows.forEach((row) => {
  row.addEventListener("click", () => {
    siteRows.forEach((candidate) => candidate.classList.remove("is-selected"));
    row.classList.add("is-selected");
    if (selectedTitle) {
      selectedTitle.textContent = row.dataset.site;
    }
    showDrawer(row.dataset.drawer || "site");
  });
});
