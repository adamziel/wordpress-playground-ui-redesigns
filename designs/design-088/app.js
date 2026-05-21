const views = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll("[data-view-target]");
const bottomButtons = document.querySelectorAll(".bottom-nav [data-view-target]");
const toolButtons = document.querySelectorAll("[data-tool-target]");
const toolPanels = document.querySelectorAll(".tool-panel");
const launchCards = document.querySelectorAll(".launch-card");
const blueprintCards = document.querySelectorAll(".blueprint-card");
const destinationButtons = document.querySelectorAll("[data-destination]");

function showView(name) {
  views.forEach((view) => view.classList.toggle("active", view.id === `view-${name}`));
  bottomButtons.forEach((button) => button.classList.toggle("active", button.dataset.viewTarget === name));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.viewTarget));
});

toolButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.toolTarget;
    toolButtons.forEach((item) => item.classList.toggle("active", item === button));
    toolPanels.forEach((panel) => panel.classList.toggle("active", panel.id === `tool-${target}`));
  });
});

launchCards.forEach((card) => {
  card.addEventListener("click", () => selectLaunch(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectLaunch(card);
    }
  });
});

function selectLaunch(card) {
  launchCards.forEach((item) => item.classList.toggle("selected", item === card));
  const result = document.querySelector("#launch-result");
  if (result) {
    result.textContent = `${card.dataset.launchName} selected`;
  }
}

blueprintCards.forEach((card) => {
  card.addEventListener("click", () => selectBlueprint(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectBlueprint(card);
    }
  });
});

function selectBlueprint(card) {
  blueprintCards.forEach((item) => item.classList.toggle("selected", item === card));
  const selectedTitle = document.querySelector("#selected-blueprint");
  if (selectedTitle) {
    selectedTitle.textContent = card.dataset.blueprintTitle;
  }
}

destinationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    destinationButtons.forEach((item) => item.classList.toggle("selected", item === button));
    const status = document.querySelector("#destination-status");
    const copy = document.querySelector("#destination-copy");

    if (button.dataset.destination === "local") {
      status.textContent = "Local directory selected";
      copy.textContent = "Result: choose a device folder, then Playground syncs files to that directory.";
    } else {
      status.textContent = "Browser storage selected";
      copy.textContent = "Result: saved entry appears in Fleet with rename and delete actions.";
    }
  });
});
