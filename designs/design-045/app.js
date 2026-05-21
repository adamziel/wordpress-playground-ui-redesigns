const leftButtons = document.querySelectorAll("[data-left]");
const leftPanels = document.querySelectorAll("[data-left-panel]");
const toolButtons = document.querySelectorAll("[data-tool]");
const toolPanels = document.querySelectorAll("[data-tool-panel]");

function activateLeft(name) {
  leftPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.leftPanel === name);
  });

  leftButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.left === name);
  });
}

function activateTool(name) {
  toolPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.toolPanel === name);
  });

  document.querySelectorAll(".tool-tabs [data-tool]").forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === name);
  });
}

leftButtons.forEach((button) => {
  button.addEventListener("click", () => activateLeft(button.dataset.left));
});

toolButtons.forEach((button) => {
  button.addEventListener("click", () => activateTool(button.dataset.tool));
});
