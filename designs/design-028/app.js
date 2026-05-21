const panelButtons = document.querySelectorAll("[data-panel-target]");
const panels = document.querySelectorAll("[data-panel]");
const navButtons = document.querySelectorAll(".bottom-nav [data-panel-target]");

function showPanel(name) {
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === name);
  });

  navButtons.forEach((button) => {
    button.classList.toggle("selected", button.dataset.panelTarget === name);
  });
}

panelButtons.forEach((button) => {
  button.addEventListener("click", () => showPanel(button.dataset.panelTarget));
});

const toolButtons = document.querySelectorAll("[data-tool-target]");
const toolPanels = document.querySelectorAll(".tool-panel");

toolButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.toolTarget;

    toolButtons.forEach((tab) => {
      tab.classList.toggle("selected", tab === button);
    });

    toolPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.id === `tool-${target}`);
    });
  });
});
