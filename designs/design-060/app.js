const actionButtons = document.querySelectorAll("[data-action]");
const resultCards = document.querySelectorAll("[data-result]");

function selectAction(action) {
  actionButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.action === action);
  });

  resultCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.result === action);
  });
}

actionButtons.forEach((button) => {
  button.addEventListener("click", () => selectAction(button.dataset.action));
});

const managerTabs = document.querySelectorAll("[data-tab]");
const managerPanels = document.querySelectorAll(".manager-panel");

managerTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    managerTabs.forEach((item) => item.classList.toggle("active", item === tab));
    managerPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.managerPanel === tab.dataset.tab);
    });
  });
});

document.querySelectorAll("button[data-panel]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.panel;

    if (target === "manager") {
      document.querySelector("#manager")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (target === "library") {
      document.querySelector("#library")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (target === "settings") {
      document.querySelector("[data-tab='settings']")?.click();
      document.querySelector("#manager")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    selectAction(target);
  });
});
