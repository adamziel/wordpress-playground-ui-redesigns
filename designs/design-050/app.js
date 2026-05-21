const routeData = {
  "github-import": {
    group: "Bring in",
    title: "Import from GitHub",
    badge: "Requires account",
    copy:
      "Import plugins, themes, and wp-content directories from public GitHub repositories. The access token is not stored and re-authentication is required after refresh.",
    primary: "Connect GitHub",
    form: `
      <label>Repository URL<input value="https://github.com/WordPress/wordpress-develop" aria-label="GitHub repository URL"></label>
      <label>Import target<select aria-label="GitHub import target"><option>Plugin</option><option>Theme</option><option>wp-content directory</option></select></label>
    `,
  },
  "github-export": {
    group: "Send out",
    title: "Export to GitHub",
    badge: "Additional action",
    copy: "Publish the current Playground files to GitHub from the Site Manager additional actions menu.",
    primary: "Export to GitHub",
    form: `
      <label>Repository<input value="wordpress/playground-review" aria-label="Export repository"></label>
      <label>Commit message<input value="Review fix from Playground" aria-label="Commit message"></label>
    `,
  },
  "zip-import": {
    group: "Bring in",
    title: "Import .zip",
    badge: "Native file chooser",
    copy: "Open a local Playground archive and replace the current temporary site with the imported bundle.",
    primary: "Choose .zip",
    form: `
      <label>Selected file<input value="playground-review.zip" aria-label="Selected zip file"></label>
      <label>Import mode<select aria-label="Zip import mode"><option>Replace current Playground</option><option>Start as new Playground</option></select></label>
    `,
  },
  "zip-download": {
    group: "Send out",
    title: "Download as .zip",
    badge: "Portable archive",
    copy: "Download the active Playground as a zip bundle for sharing, backup, or later import.",
    primary: "Download .zip",
    form: `
      <label>Archive name<input value="research-browser-playground.zip" aria-label="Archive name"></label>
      <label>Contents<select aria-label="Zip contents"><option>Full Playground</option><option>wp-content only</option></select></label>
    `,
  },
  "save-browser": {
    group: "Store",
    title: "Save Playground",
    badge: "3028 / 3751 files",
    copy: "Save a temporary Playground before refresh or close. Browser-backed sites appear in Saved Playgrounds and can be renamed or deleted.",
    primary: "Save",
    form: `
      <label>Playground name<input value="Research Browser Playground" aria-label="Playground name"></label>
      <label>Storage location<select aria-label="Storage location"><option>Save in this browser</option><option>Save to a local directory</option></select></label>
      <div class="copy-progress"><span>Saving 3028 / 3751 files</span><div><i></i></div></div>
    `,
  },
  "local-directory": {
    group: "Store",
    title: "Save to local directory",
    badge: "Filesystem",
    copy: "Persist the current Playground to a chosen local directory instead of browser storage.",
    primary: "Choose directory",
    form: `
      <label>Directory<input value="/Users/reviewer/playgrounds/research-browser" aria-label="Local directory"></label>
      <label>Reload behavior<select aria-label="Reload behavior"><option>Save & Reload after copy</option><option>Copy only</option></select></label>
    `,
  },
  "wordpress-pr": {
    group: "Bring in",
    title: "Preview a WordPress PR",
    badge: "Core",
    copy: "Start a Playground from a WordPress core pull request number or URL.",
    primary: "Preview",
    form: `<label>PR number or URL<input value="https://github.com/WordPress/wordpress-develop/pull/0000" aria-label="WordPress PR number or URL"></label>`,
  },
  "gutenberg-pr": {
    group: "Bring in",
    title: "Preview a Gutenberg PR or branch",
    badge: "Editor",
    copy: "Start a Playground from a Gutenberg pull request, URL, or branch name.",
    primary: "Preview",
    form: `<label>PR number, URL, or branch<input value="trunk" aria-label="Gutenberg PR URL or branch"></label>`,
  },
  vanilla: {
    group: "Bring in",
    title: "Vanilla WordPress",
    badge: "Fresh site",
    copy: "Start a new logged-in Playground using the selected runtime settings.",
    primary: "Start WordPress",
    form: `
      <label>WordPress version<select aria-label="WordPress version"><option>Latest</option><option>6.8</option></select></label>
      <label>PHP version<select aria-label="PHP version"><option>PHP 8.3</option><option>PHP 8.2</option></select></label>
    `,
  },
  "blueprint-url": {
    group: "Bring in",
    title: "Run Blueprint from URL",
    badge: "Hosted JSON",
    copy: "Paste a Blueprint URL and run the configured Playground.",
    primary: "Run Blueprint",
    form: `<label>Blueprint URL<input value="https://playground.wordpress.net/blueprints/sample.json" aria-label="Blueprint URL"></label>`,
  },
  "blueprint-bundle": {
    group: "Send out",
    title: "Blueprint bundle",
    badge: "Copy / download / run",
    copy: "Work with the current blueprint.json from Site Manager: copy a link, download the bundle, or run it again.",
    primary: "Download bundle",
    form: `
      <label>Current file<input value="/blueprint.json" aria-label="Current blueprint file"></label>
      <label>Action<select aria-label="Blueprint action"><option>Copy link</option><option>Download bundle</option><option>Run Blueprint</option></select></label>
    `,
  },
  database: {
    group: "Send out",
    title: "Database artifacts",
    badge: "SQLite",
    copy: "Inspect the SQLite-backed database, download database.sqlite, or open Adminer and phpMyAdmin.",
    primary: "Download database.sqlite",
    form: `
      <label>Driver<input value="MySQL emulation backed by SQLite" aria-label="Database driver"></label>
      <label>Path<input value="/wordpress/wp-content/database/.ht.sqlite" aria-label="SQLite database path"></label>
    `,
  },
  gallery: {
    group: "Bring in",
    title: "Blueprint gallery",
    badge: "43 blueprints",
    copy: "Browse and filter Blueprint starts by All, Featured, Website, Personal, Content, Themes, Gutenberg, Experiments, WooCommerce, and News.",
    primary: "View all 43",
    form: `
      <label>Search Blueprints<input value="Feed Reader" aria-label="Search Blueprints"></label>
      <label>Category<select aria-label="Blueprint category"><option>All</option><option>Featured</option><option>Website</option><option>WooCommerce</option><option>News</option></select></label>
    `,
  },
  "site-manager": {
    group: "Site tools",
    title: "Open Site Manager",
    badge: "Settings / Files / Logs",
    copy: "Manage settings, file browsing and editing, blueprint JSON, database tools, logs, Homepage, WP Admin, and export actions beside the active site.",
    primary: "Open tools",
    form: `
      <label>Default tab<select aria-label="Site Manager tab"><option>Settings</option><option>File browser</option><option>Blueprint</option><option>Database</option><option>Logs</option></select></label>
      <label>Active path<input value="/hello-from-playground/" aria-label="Active path"></label>
    `,
  },
  "saved-sites": {
    group: "Store",
    title: "Saved Playgrounds",
    badge: "Browser storage",
    copy: "Browse temporary and saved Playgrounds, then open, rename, or delete browser-backed entries.",
    primary: "Open saved list",
    form: `
      <label>Selected Playground<input value="Research Browser Playground" aria-label="Selected Playground"></label>
      <label>Action<select aria-label="Saved Playground action"><option>Open</option><option>Rename</option><option>Delete</option></select></label>
    `,
  },
  settings: {
    group: "Site tools",
    title: "Runtime settings",
    badge: "Reset / reload",
    copy: "Adjust WordPress version, include older versions, PHP version, language, network access, and multisite. Unsaved resets are destructive.",
    primary: "Apply settings",
    form: `
      <label>WordPress version<select aria-label="Runtime WordPress version"><option>Latest</option><option>Include older versions</option></select></label>
      <label>Network<select aria-label="Network access"><option>Allow network access</option><option>Block network access</option></select></label>
    `,
  },
};

const commandRows = [...document.querySelectorAll(".command-row")];
const filters = [...document.querySelectorAll(".filter")];
const search = document.querySelector("#commandSearch");
const routeGroup = document.querySelector("#routeGroup");
const routeTitle = document.querySelector("#routeTitle");
const routeBadge = document.querySelector("#routeBadge");
const routeCopy = document.querySelector("#routeCopy");
const routeForm = document.querySelector("#routeForm");
const routePrimary = document.querySelector("#routePrimary");

let activeFilter = "all";

function selectRoute(route) {
  const data = routeData[route];
  if (!data) return;

  routeGroup.textContent = data.group;
  routeTitle.textContent = data.title;
  routeBadge.textContent = data.badge;
  routeCopy.textContent = data.copy;
  routePrimary.textContent = data.primary;
  routeForm.innerHTML = data.form;

  commandRows.forEach((row) => {
    row.classList.toggle("selected", row.dataset.route === route);
  });
}

function filterCommands() {
  const queryParts = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  commandRows.forEach((row) => {
    const haystack = `${row.dataset.search} ${row.textContent}`.toLowerCase();
    const matchesFilter = activeFilter === "all" || row.dataset.kind.includes(activeFilter);
    const matchesSearch = queryParts.length === 0 || queryParts.every((part) => haystack.includes(part));
    row.classList.toggle("hidden", !matchesFilter || !matchesSearch);
  });
}

document.addEventListener("click", (event) => {
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    selectRoute(routeButton.dataset.route);
    if (!routeButton.classList.contains("command-row")) {
      document.querySelector("#transfer-command").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const tabButton = event.target.closest("[data-tab]");
  if (tabButton) {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab === tabButton));
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.id === `tab-${tabButton.dataset.tab}`);
    });
  }

  const filterButton = event.target.closest(".filter");
  if (filterButton) {
    activeFilter = filterButton.dataset.filter;
    filters.forEach((filter) => filter.classList.toggle("active", filter === filterButton));
    filterCommands();
  }

  const blueFilter = event.target.closest(".blue-filter");
  if (blueFilter) {
    document.querySelectorAll(".blue-filter").forEach((filter) => filter.classList.toggle("active", filter === blueFilter));
  }
});

search.addEventListener("input", filterCommands);
selectRoute("github-import");
