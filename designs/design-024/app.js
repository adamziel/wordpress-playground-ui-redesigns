const panels = document.querySelectorAll("[data-view]");
const panelButtons = document.querySelectorAll("[data-panel]");
const sidebarItems = document.querySelectorAll(".sidebar-item");
const railButtons = document.querySelectorAll(".rail-button[data-panel]");
const drawers = document.querySelectorAll(".drawer");
const backdrop = document.querySelector(".drawer-backdrop");

function showPanel(name) {
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.view === name);
  });

  railButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.panel === name);
  });

  sidebarItems.forEach((button) => {
    button.classList.toggle("is-current", button.dataset.panel === name);
  });
}

function closeDrawers() {
  drawers.forEach((drawer) => drawer.classList.remove("is-open"));
  backdrop.classList.remove("is-open");
}

function openDrawer(id) {
  closeDrawers();
  const drawer = document.getElementById(id);
  if (!drawer) {
    return;
  }
  drawer.classList.add("is-open");
  backdrop.classList.add("is-open");
}

panelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showPanel(button.dataset.panel);
  });
});

document.querySelectorAll("[data-drawer]").forEach((button) => {
  button.addEventListener("click", () => {
    openDrawer(button.dataset.drawer);
  });
});

document.querySelectorAll("[data-close-drawer]").forEach((button) => {
  button.addEventListener("click", closeDrawers);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDrawers();
  }
});
