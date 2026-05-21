const tabButtons = document.querySelectorAll("[data-tab]");
const panels = document.querySelectorAll(".panel");
const mobileButtons = document.querySelectorAll(".mobile-nav button");
const drawer = document.querySelector(".flow-drawer");
const gallery = document.querySelector(".gallery-sheet");
const saveModal = document.querySelector("#save-modal");
const exportPopover = document.querySelector("#export-popover");

const flowContent = {
  vanilla: {
    title: "Vanilla WordPress",
    copy: "Start a clean WordPress Playground immediately with the current runtime defaults.",
    label: "Optional site label",
    value: "Client QA Sandbox",
    action: "Start Playground"
  },
  "wp-pr": {
    title: "Preview a WordPress PR",
    copy: "Enter a WordPress core PR number or URL to start a patch preview.",
    label: "PR number or URL",
    value: "https://github.com/WordPress/wordpress-develop/pull/",
    action: "Preview PR"
  },
  "gb-pr": {
    title: "Preview a Gutenberg PR or Branch",
    copy: "Use a PR number, PR URL, or branch name from the Gutenberg repository.",
    label: "PR number, URL, or branch",
    value: "trunk",
    action: "Preview Gutenberg"
  },
  github: {
    title: "Import from GitHub",
    copy: "Import public plugins, themes, or wp-content directories after connecting a GitHub account. Tokens are not stored after refresh.",
    label: "Repository URL",
    value: "https://github.com/example/client-plugin",
    action: "Connect GitHub"
  },
  "blueprint-url": {
    title: "Run Blueprint from URL",
    copy: "Load a remote blueprint URL and run it against the active Playground.",
    label: "Blueprint URL",
    value: "https://example.com/blueprint.json",
    action: "Run Blueprint"
  },
  zip: {
    title: "Import .zip",
    copy: "Open the native file chooser and import a Playground archive from disk.",
    label: "Selected archive",
    value: "No file selected",
    action: "Choose .zip"
  }
};

function activateTab(tabName) {
  document.querySelectorAll(".tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });

  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === `panel-${tabName}`);
  });

  mobileButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
}

function openFlow(name) {
  const flow = flowContent[name] || flowContent.vanilla;
  document.querySelector("#flow-title").textContent = flow.title;
  document.querySelector("#flow-copy").textContent = flow.copy;
  document.querySelector("#flow-label").firstChild.textContent = flow.label;
  document.querySelector("#flow-input").value = flow.value;
  document.querySelector("#flow-action").textContent = flow.action;
  drawer.classList.add("open");
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tabName = button.dataset.tab;
    if (tabName) {
      activateTab(tabName);
      gallery.classList.remove("open");
    }
  });
});

document.querySelectorAll("[data-start]").forEach((button) => {
  button.addEventListener("click", () => openFlow(button.dataset.start));
});

document.querySelectorAll("[data-section='gallery']").forEach((button) => {
  button.addEventListener("click", () => gallery.classList.add("open"));
});

document.querySelectorAll("[data-section='create'], [data-section='sites']").forEach((button) => {
  button.addEventListener("click", () => {
    gallery.classList.remove("open");
    const target = document.querySelector(`#${button.dataset.section}`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-close-gallery]").forEach((button) => {
  button.addEventListener("click", () => gallery.classList.remove("open"));
});

document.querySelectorAll("[data-close-drawer]").forEach((button) => {
  button.addEventListener("click", () => drawer.classList.remove("open"));
});

document.querySelectorAll("[data-open-modal='save']").forEach((button) => {
  button.addEventListener("click", () => saveModal.showModal());
});

document.querySelectorAll("[data-open-popover='export']").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    exportPopover.hidden = !exportPopover.hidden;
  });
});

document.addEventListener("click", (event) => {
  if (!exportPopover.hidden && !exportPopover.contains(event.target)) {
    exportPopover.hidden = true;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    drawer.classList.remove("open");
    gallery.classList.remove("open");
    exportPopover.hidden = true;
  }
});
