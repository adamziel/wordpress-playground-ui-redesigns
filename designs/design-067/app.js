const panels = {
  "flow-proof": {
    title: "Client demo run sheet",
    kicker: "End-to-end proof",
    summary: "A complete current-product flow: launch source, save destination, progress, saved identity, management, reset/reload consequence, and export/import result."
  },
  vanilla: {
    title: "Start Vanilla WordPress",
    kicker: "Create lane",
    summary: "A clean default Playground starts immediately with latest WordPress and the admin user logged in."
  },
  "wordpress-pr": {
    title: "Preview a WordPress PR",
    kicker: "Create lane",
    summary: "This route accepts a WordPress core PR number or wordpress-develop pull request URL."
  },
  "gutenberg-pr": {
    title: "Preview a Gutenberg PR or Branch",
    kicker: "Create lane",
    summary: "This route accepts a PR number, URL, or branch name, which makes it distinct from the WordPress PR flow."
  },
  github: {
    title: "Import from GitHub",
    kicker: "Create lane",
    summary: "Connect GitHub to import public plugins, themes, or wp-content directories; the token is not stored."
  },
  "blueprint-url": {
    title: "Run Blueprint from URL",
    kicker: "Create lane",
    summary: "Runs a remote blueprint.json from a URL with explicit Cancel and Run Blueprint actions."
  },
  "blueprint-gallery": {
    title: "Blueprint gallery",
    kicker: "Create lane",
    summary: "Browse the captured 43-entry catalog with category filters, search, selected detail, inspect, and run actions."
  },
  "zip-import": {
    title: "Import .zip",
    kicker: "Create lane",
    summary: "Opens the native file chooser and warns when the imported bundle replaces the current site."
  },
  unsaved: {
    title: "Temporary Playground",
    kicker: "Save lane",
    summary: "The active Playground is not durable until it is saved to browser storage or a local directory."
  },
  "save-browser": {
    title: "Save in this browser",
    kicker: "Save lane",
    summary: "Names the Playground and copies files into browser storage so it survives refreshes."
  },
  "save-local": {
    title: "Save to a local directory",
    kicker: "Save lane",
    summary: "Uses a directory picker and creates a local file-backed Playground, separate from browser storage."
  },
  "save-progress": {
    title: "Saving files",
    kicker: "Save lane",
    summary: "Progress is visible while files are copied; the temporary site is not safe to close until complete."
  },
  preview: {
    title: "Live site preview",
    kicker: "Manage lane",
    summary: "The active WordPress site is a board card instead of a separate operations console."
  },
  "saved-list": {
    title: "Your Playgrounds",
    kicker: "Manage lane",
    summary: "Saved and unsaved Playgrounds stay visible together, including browser and local-directory storage states."
  },
  "rename-delete": {
    title: "Rename or delete",
    kicker: "Manage lane",
    summary: "Saved Playground identity changes are exposed as visible board tasks instead of hidden overflow actions."
  },
  delete: {
    title: "Delete saved Playground",
    kicker: "Manage lane",
    summary: "Deletion is destructive for browser-backed state and is shown at the moment of action."
  },
  settings: {
    title: "Settings",
    kicker: "Inspect lane",
    summary: "WordPress version, older versions, PHP version, language, network access, and multisite controls."
  },
  "site-manager": {
    title: "Site Manager",
    kicker: "Inspect lane",
    summary: "Site Manager gathers Settings, File browser, Blueprint, Database, and Logs while preserving the live preview context.",
    panel: "settings"
  },
  files: {
    title: "File browser",
    kicker: "Inspect lane",
    summary: "Create files and folders, upload, browse local files, and edit WordPress files such as wp-config.php."
  },
  "blueprint-editor": {
    title: "Blueprint editor",
    kicker: "Inspect lane",
    summary: "Edit blueprint.json, copy a Blueprint link, download a bundle, upload files, browse files, and run the Blueprint."
  },
  database: {
    title: "Database",
    kicker: "Inspect lane",
    summary: "Inspect SQLite-backed MySQL emulation, download database.sqlite, and open Adminer or phpMyAdmin."
  },
  "export-github": {
    title: "Export to GitHub",
    kicker: "Export lane",
    summary: "Creates a GitHub-backed copy after account connection."
  },
  "download-zip": {
    title: "Download as .zip",
    kicker: "Export lane",
    summary: "Downloads a complete Playground archive for sharing or re-import."
  },
  "blueprint-artifact": {
    title: "Blueprint bundle",
    kicker: "Export lane",
    summary: "Copy the current Blueprint link, download the bundle, or run it again."
  },
  "import-result": {
    title: "Import result",
    kicker: "Export lane",
    summary: "Shows the consequence of importing a zip over the current unsaved site."
  },
  logs: {
    title: "Logs",
    kicker: "Debug lane",
    summary: "Inspect Playground, WordPress, and PHP log streams, including the current empty state."
  },
  reset: {
    title: "Reset and reload",
    kicker: "Debug lane",
    summary: "Unsaved Playgrounds reset destructively after settings changes; stored Playgrounds use Save & Reload."
  },
  paths: {
    title: "Navigate paths",
    kicker: "Debug lane",
    summary: "Refresh the embedded WordPress page, open Homepage, or jump to /wp-admin/ from the same shell."
  }
};

const title = document.querySelector("#result-title");
const kicker = document.querySelector("#result-kicker");
const summary = document.querySelector("#result-summary");
const actionButtons = document.querySelectorAll("[data-action]");
const resultBodies = document.querySelectorAll(".result-body");

function selectAction(action) {
  const config = panels[action] || panels["flow-proof"];
  const panelId = config.panel || action;

  title.textContent = config.title;
  kicker.textContent = config.kicker;
  summary.textContent = config.summary;

  resultBodies.forEach((panel) => {
    panel.classList.toggle("active", panel.id === `panel-${panelId}`);
  });

  document.querySelectorAll(".task-card, .result-chip").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.action === action);
    button.classList.toggle("is-active", button.dataset.action === action);
  });
}

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectAction(button.dataset.action);
  });
});
