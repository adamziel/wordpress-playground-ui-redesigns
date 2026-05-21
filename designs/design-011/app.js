const tabButtons = document.querySelectorAll(".manager-tabs .tab");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;
    tabButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    tabPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === tab);
    });
  });
});

const flowCopy = {
  vanilla: {
    title: "Vanilla WordPress",
    copy: "Creates a clean logged-in Playground with the default welcome page.",
    label: "",
    value: "",
    action: "Start Playground"
  },
  "wp-pr": {
    title: "Preview a WordPress PR",
    copy: "Runs WordPress with a core pull request applied for review.",
    label: "PR number or URL",
    value: "https://github.com/WordPress/wordpress-develop/pull/",
    action: "Preview PR"
  },
  "gb-pr": {
    title: "Preview a Gutenberg PR or branch",
    copy: "Starts Playground with a Gutenberg pull request, URL, or branch name.",
    label: "PR number, URL, or branch",
    value: "trunk",
    action: "Preview Gutenberg"
  },
  github: {
    title: "Import from GitHub",
    copy: "Connect a GitHub account to import a public plugin, theme, or wp-content directory. The token is not stored.",
    label: "Repository URL",
    value: "https://github.com/wordpress/",
    action: "Connect GitHub"
  },
  "blueprint-url": {
    title: "Run Blueprint from URL",
    copy: "Loads a hosted Blueprint JSON and starts the configured Playground.",
    label: "Blueprint URL",
    value: "https://example.com/blueprint.json",
    action: "Run Blueprint"
  },
  zip: {
    title: "Import .zip",
    copy: "Opens the native file chooser to import a Playground zip bundle.",
    label: "",
    value: "",
    action: "Choose .zip"
  }
};

const flowTitle = document.querySelector("#flow-title");
const flowText = document.querySelector("#flow-copy");
const flowInputWrap = document.querySelector("#flow-input-wrap");
const flowLabel = document.querySelector("#flow-label");
const flowInput = document.querySelector("#flow-input");
const flowAction = document.querySelector("#flow-action");

document.querySelectorAll(".source-row").forEach((button) => {
  button.addEventListener("click", () => {
    const flow = flowCopy[button.dataset.flow];
    document.querySelectorAll(".source-row").forEach((item) => {
      item.classList.toggle("is-primary", item === button);
    });
    flowTitle.textContent = flow.title;
    flowText.textContent = flow.copy;
    flowAction.textContent = flow.action;
    if (flow.label) {
      flowInputWrap.hidden = false;
      flowLabel.textContent = flow.label;
      flowInput.value = flow.value;
    } else {
      flowInputWrap.hidden = true;
    }
  });
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.jump);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
