const views = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll("[data-view]");
const openButtons = document.querySelectorAll("[data-open]");
const stepItems = document.querySelectorAll(".wizard-steps li");
const stepJumpButtons = document.querySelectorAll("[data-step-jump]");
const sourceCards = document.querySelectorAll(".source-card");
const sourceDetail = document.querySelector("#source-detail input");
const toolTabs = document.querySelectorAll(".tool-tab");

const sourceCopy = {
  vanilla: "Vanilla WordPress uses no extra input",
  "wp-pr": "Enter a WordPress core PR number or URL",
  gutenberg: "Enter a Gutenberg PR number, URL, or branch name",
  github: "Connect GitHub, then enter a public plugin, theme, or wp-content repo",
  "blueprint-url": "Paste the Blueprint URL to run",
  zip: "Choose a local Playground .zip bundle"
};

function activateView(id) {
  views.forEach((view) => view.classList.toggle("active", view.id === id));
  navButtons.forEach((button) => button.classList.toggle("active", button.dataset.view === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function activateStep(id) {
  stepItems.forEach((item) => item.classList.toggle("active", item.dataset.step === id));
  const heading = document.querySelector(".wizard-panel .eyebrow");
  const title = document.querySelector(".wizard-panel h2");
  const labels = {
    source: ["Step 1", "Pick how this test site starts"],
    runtime: ["Step 2", "Confirm runtime and reset rules"],
    blueprint: ["Step 3", "Attach a gallery item, URL, or current blueprint"],
    persistence: ["Step 4", "Choose browser storage or a local directory"],
    review: ["Step 5", "Review the launch impact before starting"]
  };
  if (labels[id]) {
    heading.textContent = labels[id][0];
    title.textContent = labels[id][1];
  }
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => activateView(button.dataset.view));
});

openButtons.forEach((button) => {
  button.addEventListener("click", () => activateView(button.dataset.open));
});

stepItems.forEach((item) => {
  item.addEventListener("click", () => activateStep(item.dataset.step));
});

stepJumpButtons.forEach((button) => {
  button.addEventListener("click", () => activateStep(button.dataset.stepJump));
});

sourceCards.forEach((card) => {
  card.addEventListener("click", () => {
    sourceCards.forEach((item) => item.classList.remove("selected"));
    card.classList.add("selected");
    sourceDetail.value = sourceCopy[card.dataset.source];
  });
});

toolTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const activeTool = tab.dataset.tool;
    toolTabs.forEach((item) => item.classList.toggle("active", item.dataset.tool === activeTool));
    document.querySelectorAll(".tool-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.id === `tool-${activeTool}`);
    });
  });
});
