const cards = Array.from(document.querySelectorAll(".task-card"));
const panels = Array.from(document.querySelectorAll(".panel-content"));
const panelTitle = document.querySelector("#panel-title");
const panelLane = document.querySelector("#panel-lane");

const titles = {
  "gutenberg-pr": ["Gutenberg PR or branch", "Create lane"],
  "wordpress-pr": ["WordPress PR", "Create lane"],
  vanilla: ["Vanilla WordPress", "Create lane"],
  "github-import": ["From GitHub", "Create lane"],
  "blueprint-url": ["Blueprint URL", "Create lane"],
  "zip-import": ["Import .zip", "Create lane"],
  "blueprint-gallery": ["Blueprint gallery", "Create lane"],
  "save-browser": ["Save in this browser", "Save lane"],
  "save-local": ["Save to a local directory", "Save lane"],
  "save-progress": ["Save progress", "Save lane"],
  "saved-unsaved": ["Unsaved Playground", "Manage lane"],
  "saved-research": ["Research Browser Playground", "Manage lane"],
  "saved-actions": ["Rename or delete", "Manage lane"],
  settings: ["Settings", "Inspect lane"],
  files: ["File browser", "Inspect lane"],
  "blueprint-editor": ["blueprint.json", "Inspect lane"],
  database: ["Database", "Inspect lane"],
  "export-github": ["Export to GitHub", "Export lane"],
  "download-zip": ["Download as .zip", "Export lane"],
  "download-blueprint": ["Copy or download Blueprint bundle", "Export lane"],
  logs: ["Playground, WordPress, PHP logs", "Debug lane"],
  reset: ["Apply settings and reset", "Debug lane"],
  paths: ["Navigate WordPress paths", "Debug lane"]
};

function selectCard(card) {
  const key = card.dataset.panel;
  const target = document.querySelector(`#panel-${key}`);
  if (!target) return;

  cards.forEach((item) => item.classList.toggle("active", item === card));
  panels.forEach((panel) => panel.classList.toggle("active", panel === target));

  const [title, lane] = titles[key] || [card.querySelector("strong")?.textContent || "Selected task", "Task lane"];
  panelTitle.textContent = title;
  panelLane.textContent = lane;

  if (window.matchMedia("(max-width: 1180px)").matches) {
    document.querySelector(".editor-panel").scrollIntoView({ block: "start", behavior: "smooth" });
  }
}

cards.forEach((card) => {
  card.addEventListener("click", () => selectCard(card));
});
