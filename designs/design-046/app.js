const commands = {
  "save-current": {
    group: "Current",
    title: "Save current Playground",
    description: "Save the temporary Playground in browser storage or to a local directory before refreshing or closing the browser.",
    action: "Save Playground",
    body: `
      <div class="option-list">
        <div class="option"><strong>Save in this browser</strong><span>Browser-backed Playground listed in saved management.</span></div>
        <div class="option"><strong>Save to a local directory</strong><span>Choose a directory and keep files local.</span></div>
      </div>
      <div>
        <strong>Saving 3028 / 3751 files</strong>
        <div class="progress" aria-label="Save progress"><i style="width: 81%"></i></div>
      </div>
    `
  },
  vanilla: {
    group: "Start",
    title: "Start vanilla WordPress",
    description: "Launch a fresh WordPress Playground with the current runtime defaults.",
    action: "Start Playground",
    body: `<div class="option"><strong>No input required</strong><span>Starts immediately with WordPress latest and PHP 8.3.</span></div>`
  },
  "wp-pr": {
    group: "Start",
    title: "Preview WordPress PR",
    description: "Open the WordPress PR preview flow for a pull request number or URL.",
    action: "Preview PR",
    body: `<div class="mini-form"><label><span>PR number or URL</span><input placeholder="https://github.com/WordPress/wordpress-develop/pull/0000"></label><div class="two"><button>Cancel</button><button class="primary">Preview</button></div></div>`
  },
  "gb-pr": {
    group: "Start",
    title: "Preview Gutenberg PR or branch",
    description: "Open the Gutenberg preview flow for a PR number, URL, or branch name.",
    action: "Preview Gutenberg",
    body: `<div class="mini-form"><label><span>PR, URL, or branch</span><input placeholder="try/plugin-toolbar-branch"></label><div class="two"><button>Cancel</button><button class="primary">Preview</button></div></div>`
  },
  "github-import": {
    group: "Move",
    title: "Import from GitHub",
    description: "Connect a GitHub account to import public plugins, themes, or wp-content directories. The token is not stored after refresh.",
    action: "Connect GitHub",
    body: `<div class="option"><strong>Account connection required</strong><span>Re-authentication is required after refresh.</span></div>`
  },
  "blueprint-url": {
    group: "Start",
    title: "Run Blueprint URL",
    description: "Paste a Blueprint URL and run it against the active Playground.",
    action: "Run Blueprint",
    body: `<div class="mini-form"><label><span>Blueprint URL</span><input placeholder="https://example.com/blueprint.json"></label><div class="two"><button>Cancel</button><button class="primary">Run Blueprint</button></div></div>`
  },
  "zip-import": {
    group: "Move",
    title: "Import .zip",
    description: "Trigger the native file picker to import a Playground zip archive.",
    action: "Choose .zip",
    body: `<div class="option"><strong>Native file chooser</strong><span>The current product opens the browser file picker rather than an in-page import modal.</span></div>`
  },
  "saved-list": {
    group: "Manage",
    title: "Manage saved Playgrounds",
    description: "Browse unsaved and saved browser-backed Playgrounds, then open, rename, or delete them.",
    action: "Open Library",
    body: `<div class="option-list"><div class="option"><strong>Research Browser Playground</strong><span>Open / Rename / Delete</span></div><div class="option"><strong>Unsaved Playground</strong><span>Save before refresh or close.</span></div></div>`
  },
  settings: {
    group: "Tools",
    title: "Runtime settings",
    description: "Edit WordPress version, include older versions, PHP version, language, network access, and multisite.",
    action: "Open Settings",
    body: `<div class="option"><strong>Reset behavior</strong><span>Temporary sites use Apply Settings & Reset Playground. Stored sites use Save & Reload.</span></div>`
  },
  files: {
    group: "Tools",
    title: "File browser and code editor",
    description: "Browse /wordpress, create a file or folder, upload or browse files, and edit code.",
    action: "Open Files",
    body: `<div class="option-list"><div class="option"><strong>/wordpress/wp-config.php</strong><span>Code editor surface is available in Site Manager.</span></div><div class="option"><strong>New File / New Folder / Upload / Browse</strong><span>All file browser actions remain grouped here.</span></div></div>`
  },
  "blueprint-editor": {
    group: "Tools",
    title: "Blueprint bundle editor",
    description: "View blueprint.json, copy the blueprint link, download the bundle, or run it.",
    action: "Open Blueprint",
    body: `<div class="option"><strong>Bundle actions</strong><span>Copy link / Download bundle / Run Blueprint.</span></div>`
  },
  database: {
    group: "Tools",
    title: "Database tools",
    description: "Inspect the SQLite-backed database and open database management tools.",
    action: "Open Database",
    body: `<div class="option-list"><div class="option"><strong>/wordpress/wp-content/database/.ht.sqlite</strong><span>452 KB, MySQL emulation backed by SQLite.</span></div><div class="option"><strong>Download database.sqlite</strong><span>Open Adminer or phpMyAdmin.</span></div></div>`
  },
  logs: {
    group: "Tools",
    title: "Logs",
    description: "Inspect Playground, WordPress, and PHP logs. The captured empty state says no problems so far.",
    action: "View Logs",
    body: `<div class="option-list"><div class="option"><strong>Playground</strong><span>No problems so far.</span></div><div class="option"><strong>WordPress and PHP</strong><span>Empty log state.</span></div></div>`
  },
  gallery: {
    group: "Start",
    title: "Blueprint gallery",
    description: "Browse all 43 blueprints with category filters and search.",
    action: "Browse Gallery",
    body: `<div class="option-list"><div class="option"><strong>Filters</strong><span>All, Featured, Website, Personal, Content, Themes, Gutenberg, Experiments, WooCommerce, News.</span></div><div class="option"><strong>Featured shortcuts</strong><span>Art Gallery, Coffee Shop, Feed Reader, Gaming News, Non-profit Organization.</span></div></div>`
  },
  export: {
    group: "Move",
    title: "Export current Playground",
    description: "Use Site Manager additional actions to export to GitHub or download the site as a .zip.",
    action: "Export",
    body: `<div class="option-list"><div class="option"><strong>Export to GitHub</strong><span>Send the current Playground to GitHub.</span></div><div class="option"><strong>Download as .zip</strong><span>Package the Playground for local reuse.</span></div></div>`
  }
};

const rows = Array.from(document.querySelectorAll(".command-row"));
const scopes = Array.from(document.querySelectorAll(".scope"));
const search = document.querySelector("#commandSearch");
const inspectorGroup = document.querySelector("#inspectorGroup");
const inspectorTitle = document.querySelector("#inspectorTitle");
const inspectorDescription = document.querySelector("#inspectorDescription");
const inspectorBody = document.querySelector("#inspectorBody");
const inspectorAction = document.querySelector("#inspectorAction");

function selectCommand(commandId) {
  const command = commands[commandId];
  if (!command) return;

  rows.forEach((row) => row.classList.toggle("selected", row.dataset.command === commandId));
  inspectorGroup.textContent = command.group;
  inspectorTitle.textContent = command.title;
  inspectorDescription.textContent = command.description;
  inspectorBody.innerHTML = command.body;
  inspectorAction.textContent = command.action;

  const tabMap = {
    settings: "settings",
    files: "files",
    "blueprint-editor": "blueprint",
    database: "database",
    logs: "logs",
    export: "exports",
    "github-import": "exports",
    "zip-import": "exports"
  };
  if (tabMap[commandId]) {
    selectTab(tabMap[commandId]);
  }
}

function filterRows(scope = document.querySelector(".scope.active")?.dataset.filter || "all") {
  const query = search.value.trim().toLowerCase();
  rows.forEach((row) => {
    const haystack = row.textContent.toLowerCase();
    const inScope = scope === "all" || row.dataset.filter.split(" ").includes(scope);
    const matches = !query || haystack.includes(query);
    row.hidden = !(inScope && matches);
  });
}

scopes.forEach((scopeButton) => {
  scopeButton.addEventListener("click", () => {
    scopes.forEach((button) => button.classList.remove("active"));
    scopeButton.classList.add("active");
    filterRows(scopeButton.dataset.filter);
  });
});

rows.forEach((row) => {
  row.addEventListener("click", () => selectCommand(row.dataset.command));
});

document.querySelectorAll("[data-command]").forEach((button) => {
  button.addEventListener("click", (event) => {
    const commandId = event.currentTarget.dataset.command;
    if (commands[commandId]) selectCommand(commandId);
  });
});

search.addEventListener("input", () => filterRows());

function selectTab(tabName) {
  document.querySelectorAll(".manager-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabName);
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `tab-${tabName}`);
  });
}

document.querySelectorAll(".manager-tab").forEach((tab) => {
  tab.addEventListener("click", () => selectTab(tab.dataset.tab));
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    search.focus();
    search.select();
  }
});

selectCommand("save-current");
