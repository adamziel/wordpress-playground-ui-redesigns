const drawer = document.querySelector("#flow-drawer");
const drawerBackdrop = document.querySelector(".drawer-backdrop");
const drawerTitle = document.querySelector("#drawer-title");
const drawerKicker = document.querySelector("#drawer-kicker");
const drawerBody = document.querySelector("#drawer-body");

const flowTitles = {
  "vanilla": ["Start flow", "Vanilla WordPress"],
  "wordpress-pr": ["Start flow", "Preview a WordPress PR"],
  "gutenberg-pr": ["Start flow", "Preview a Gutenberg PR or Branch"],
  "github": ["Start flow", "Import from GitHub"],
  "blueprint-url": ["Start flow", "Run Blueprint from URL"],
  "zip": ["Start flow", "Import .zip"],
  "save": ["Save flow", "Save Playground"],
  "library": ["Saved management", "Your Playgrounds"],
  "settings": ["Quick settings", "Playground Settings"],
  "actions": ["Additional actions", "Export and Download"],
  "gallery": ["Blueprint gallery", "Showing all 43 blueprints"]
};

function openDrawer(flow) {
  const template = document.querySelector(`#template-${flow}`);
  const title = flowTitles[flow] || flowTitles.vanilla;
  if (!template) return;

  drawerKicker.textContent = title[0];
  drawerTitle.textContent = title[1];
  drawerBody.replaceChildren(template.content.cloneNode(true));
  drawer.classList.add("open");
  drawerBackdrop.classList.add("open");
}

function closeDrawer() {
  drawer.classList.remove("open");
  drawerBackdrop.classList.remove("open");
}

document.addEventListener("click", (event) => {
  const startButton = event.target.closest("[data-start]");
  const panelButton = event.target.closest("[data-open-panel]");
  const closeButton = event.target.closest("[data-close-panel]");
  const tabButton = event.target.closest("[data-tab]");
  const mobileButton = event.target.closest("[data-mobile]");
  const chipButton = event.target.closest("[data-filter]");

  if (startButton) {
    document.querySelectorAll("[data-start]").forEach((button) => button.classList.remove("selected"));
    startButton.classList.add("selected");
    openDrawer(startButton.dataset.start);
  }

  if (panelButton) {
    openDrawer(panelButton.dataset.openPanel);
  }

  if (closeButton) {
    closeDrawer();
  }

  if (tabButton) {
    const name = tabButton.dataset.tab;
    document.querySelectorAll(".tab").forEach((button) => button.classList.toggle("active", button === tabButton));
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.panel === name);
    });
  }

  if (mobileButton) {
    document.body.classList.remove("show-launch", "show-stage", "show-manager");
    document.body.classList.add(`show-${mobileButton.dataset.mobile}`);
    document.querySelectorAll(".mobile-nav button").forEach((button) => {
      button.classList.toggle("active", button === mobileButton);
    });
  }

  if (chipButton) {
    const group = chipButton.closest(".gallery-controls");
    group.querySelectorAll(".chip").forEach((button) => button.classList.remove("active"));
    chipButton.classList.add("active");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDrawer();
  }
});
