const navButtons = document.querySelectorAll("[data-panel]");
const panels = document.querySelectorAll(".panel");

function showPanel(panelName) {
  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === `panel-${panelName}`);
  });

  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.panel === panelName);
  });

  const content = document.querySelector(".content");
  if (content && window.matchMedia("(max-width: 980px)").matches) {
    content.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => showPanel(button.dataset.panel));
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => showPanel(button.dataset.jump));
});

const managerTabs = document.querySelectorAll("[data-manager]");
const managerPanels = document.querySelectorAll(".manager-panel");

managerTabs.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.manager;
    managerTabs.forEach((tab) => tab.classList.toggle("active", tab === button));
    managerPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === `manager-${target}`);
    });
  });
});

const ledgerRows = document.querySelectorAll("tbody tr");
ledgerRows.forEach((row) => {
  row.addEventListener("click", () => {
    ledgerRows.forEach((otherRow) => otherRow.classList.remove("selected"));
    row.classList.add("selected");
  });
});
