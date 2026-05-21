const app = document.querySelector(".app");
const tableBody = document.querySelector("#tableBody");
const detailBody = document.querySelector("#detailBody");
const detailTitle = document.querySelector("#detailTitle");
const detailKicker = document.querySelector("#detailKicker");
const detailState = document.querySelector("#detailState");
const shellTitle = document.querySelector("#shellTitle");
const shellMeta = document.querySelector("#shellMeta");
const storageBadge = document.querySelector("#storageBadge");
const runtimeBadge = document.querySelector("#runtimeBadge");
const pathInput = document.querySelector("#pathInput");
const previewPath = document.querySelector("#previewPath");
const previewStatus = document.querySelector("#previewStatus");
const previewOverlay = document.querySelector("#previewOverlay");
const overlayTitle = document.querySelector("#overlayTitle");
const overlayText = document.querySelector("#overlayText");
const overlayMeter = document.querySelector("#overlayMeter");
const siteHeading = document.querySelector("#siteHeading");
const previewContent = document.querySelector("#previewContent");

const state = {
  view: "playgrounds",
  selectedId: "pg-saved",
  activeId: "pg-saved",
  saveDestination: "browser",
  folderPermission: "none",
  deletePromptId: null,
  renamePromptId: null,
  zipNeedsConfirm: false,
  blueprintFilter: "All",
  managerTab: "settings",
  detailMessage: "Select a row to inspect and run actions.",
  playgrounds: [
    {
      id: "pg-unsaved",
      name: "Unsaved Playground",
      subtitle: "Temporary runtime. Refresh or close discards files and database.",
      storage: "temporary",
      status: "temporary",
      path: "/hello-from-playground/",
      runtime: { wp: "latest", php: "8.3", language: "en_US", network: true, multisite: false },
      lastAction: "Started from Vanilla WordPress"
    },
    {
      id: "pg-saved",
      name: "Research Browser Playground",
      subtitle: "Browser-backed slug: research-browser-playground",
      storage: "browser",
      status: "saved",
      path: "/hello-from-playground/",
      runtime: { wp: "latest", php: "8.3", language: "en_US", network: true, multisite: false },
      lastAction: "Saved in this browser"
    },
    {
      id: "pg-local",
      name: "Client Theme Local Directory",
      subtitle: "Local folder: ~/Sites/client-theme-playground",
      storage: "local",
      status: "local permission",
      path: "/wp-admin/",
      runtime: { wp: "6.8.2", php: "8.2", language: "en_US", network: true, multisite: false },
      lastAction: "Needs folder permission after reload"
    },
    {
      id: "pg-imported",
      name: "Plugin QA Import",
      subtitle: "Created from plugin-test.zip",
      storage: "imported",
      status: "imported",
      path: "/wp-admin/plugins.php",
      runtime: { wp: "latest", php: "8.3", language: "en_US", network: false, multisite: false },
      lastAction: "ZIP imported and validated"
    }
  ],
  routes: [
    { id: "route-vanilla", name: "Vanilla WordPress", state: "Ready", hint: "Fresh latest install, logged in as admin.", action: "Start" },
    { id: "route-wp-pr", name: "WordPress PR", state: "Needs PR number or URL", hint: "Preview a wordpress-develop pull request.", action: "Preview PR" },
    { id: "route-gb-pr", name: "Gutenberg PR or branch", state: "Needs PR, URL, or branch", hint: "Preview Gutenberg branch or pull request.", action: "Preview" },
    { id: "route-github", name: "From GitHub", state: "Account connection required", hint: "Import plugins, themes, or wp-content from a public repository. Token is session-only.", action: "Connect" },
    { id: "route-blueprint-url", name: "Blueprint URL", state: "Needs URL", hint: "Run a hosted blueprint JSON file.", action: "Inspect" },
    { id: "route-zip", name: "Import .zip", state: "Native chooser", hint: "Choose, validate, warn, then replace the current runtime.", action: "Choose zip" }
  ],
  managerRows: [
    { id: "manager-settings", name: "Settings", state: "Save & Reload available", hint: "WordPress version, PHP, language, network, multisite, older versions." },
    { id: "manager-files", name: "Files", state: "wp-config.php selected", hint: "New file, new folder, upload, browse files, editor dirty/save state." },
    { id: "manager-blueprint", name: "Blueprint", state: "blueprint.json valid", hint: "Blueprint URL, editor, copy link, download bundle, run, validation." },
    { id: "manager-database", name: "Database", state: "SQLite - 452 KB", hint: "Download database.sqlite, Adminer, phpMyAdmin." },
    { id: "manager-logs", name: "Logs", state: "1 PHP notice", hint: "Playground, WordPress, and PHP logs." },
    { id: "manager-portability", name: "Export and downloads", state: "Ready", hint: "Export to GitHub, download as .zip, database and Blueprint bundle actions." }
  ],
  blueprints: [
    { id: "bp-art", name: "Art Gallery", category: "Website", tags: "Website - Personal", state: "Featured", hint: "An art gallery created with the Voe theme." },
    { id: "bp-coffee", name: "Coffee Shop", category: "WooCommerce", tags: "WooCommerce - Store", state: "Featured", hint: "A stylized WooCommerce coffee shop storefront." },
    { id: "bp-friends", name: "Feed Reader with the Friends Plugin", category: "Content", tags: "rss - social web", state: "Featured", hint: "Read feeds from the web in Playground with the Friends plugin." },
    { id: "bp-gaming", name: "Gaming News", category: "News", tags: "Website - News", state: "Featured", hint: "A gaming news site created with the Spiel theme." },
    { id: "bp-nonprofit", name: "Non-profit Organization", category: "Website", tags: "Website - Organization", state: "Featured", hint: "A non-profit organization site created with the Koinonia theme." },
    { id: "bp-blog", name: "Personal Blog", category: "Personal", tags: "Website - Blog", state: "Catalog item", hint: "A personal blog created with the Substrata theme." }
  ],
  transfers: [
    { id: "tx-1", name: "Browser save", type: "Save", status: "completed", detail: "Research Browser Playground saved in this browser. Slug created and shell identity updated." },
    { id: "tx-2", name: "plugin-test.zip", type: "Import", status: "imported", detail: "ZIP validated. Files and database replaced for Plugin QA Import." },
    { id: "tx-3", name: "database.sqlite", type: "Database download", status: "ready", detail: "SQLite path /wordpress/wp-content/database/.ht.sqlite, 452 KB." }
  ]
};

function activePlayground() {
  return state.playgrounds.find((item) => item.id === state.activeId) || state.playgrounds[0];
}

function selectedPlayground() {
  return state.playgrounds.find((item) => item.id === state.selectedId);
}

function storageLabel(item) {
  if (item.storage === "browser") return "Saved - browser";
  if (item.storage === "local") return item.status === "local permission" ? "Local - permission needed" : "Saved - local";
  if (item.storage === "imported") return "Imported";
  return "Temporary";
}

function statusClass(value) {
  if (/saved|completed|ready|valid|imported|exported|reloaded/i.test(value)) return "success";
  if (/temporary|warning|permission|needs|saving|running|pending/i.test(value)) return "warning";
  if (/delete|failed|denied|reset/i.test(value)) return "danger";
  return "blue";
}

function runtimeText(runtime) {
  return `WP ${runtime.wp} - PHP ${runtime.php} - ${runtime.language}`;
}

function addTransfer(name, type, status, detail) {
  const id = `tx-${Date.now()}`;
  state.transfers.unshift({ id, name, type, status, detail });
  return id;
}

function updateShell() {
  const active = activePlayground();
  shellTitle.textContent = active.name;
  shellMeta.textContent = active.subtitle;
  storageBadge.textContent = storageLabel(active);
  storageBadge.className = `badge ${statusClass(active.status)}`;
  runtimeBadge.textContent = runtimeText(active.runtime);
  pathInput.value = active.path;
  previewPath.textContent = active.path;
}

function rowButton(label, action, extra = "") {
  return `<button type="button" data-action="${action}" ${extra}>${label}</button>`;
}

function renderTable() {
  let rows = [];
  if (state.view === "playgrounds") {
    rows = state.playgrounds.map((item) => ({
      id: item.id,
      name: item.name,
      hint: item.subtitle,
      state: storageLabel(item),
      note: item.lastAction,
      actions: [
        rowButton(item.id === state.activeId ? "Active" : "Open", "open-playground"),
        rowButton("Manage", "manage-playground"),
        item.storage === "temporary" ? rowButton("Save", "save-playground") : rowButton("Rename", "rename-playground"),
        item.storage === "temporary" ? "" : rowButton("Delete", "delete-playground", 'class="dangerGhost"')
      ].join("")
    }));
  }

  if (state.view === "routes") {
    rows = state.routes.map((item) => ({
      id: item.id,
      name: item.name,
      hint: item.hint,
      state: item.state,
      note: "Launch route",
      actions: rowButton(item.action, "run-route")
    }));
  }

  if (state.view === "manager") {
    rows = state.managerRows.map((item) => ({
      id: item.id,
      name: item.name,
      hint: item.hint,
      state: item.state,
      note: "Site Manager",
      actions: rowButton("Open", "open-manager")
    }));
  }

  if (state.view === "blueprints") {
    const filtered = filteredBlueprints();
    rows = filtered.map((item) => ({
      id: item.id,
      name: item.name,
      hint: item.hint,
      state: item.state,
      note: item.tags,
      actions: rowButton("Inspect", "inspect-blueprint")
    }));
  }

  if (state.view === "transfers") {
    rows = state.transfers.map((item) => ({
      id: item.id,
      name: item.name,
      hint: item.detail,
      state: item.status,
      note: item.type,
      actions: rowButton("Review", "review-transfer")
    }));
  }

  tableBody.innerHTML = rows.map((item) => `
    <tr data-id="${item.id}" class="${state.selectedId === item.id ? "selected" : ""} ${/deleted/.test(item.state) ? "mutedRow" : ""}">
      <td>
        <span class="objectName">
          <strong>${item.name}</strong>
          <span>${item.hint}</span>
        </span>
      </td>
      <td><span class="badge ${statusClass(item.state)}">${item.state}</span><div class="cellNote">${item.note}</div></td>
      <td><span class="rowActions">${item.actions}</span></td>
    </tr>
  `).join("");
}

function renderDetail() {
  const pg = selectedPlayground();
  if (pg) return renderPlaygroundDetail(pg);
  const route = state.routes.find((item) => item.id === state.selectedId);
  if (route) return renderRouteDetail(route);
  const manager = state.managerRows.find((item) => item.id === state.selectedId);
  if (manager) return renderManagerDetail(manager);
  const blueprint = state.blueprints.find((item) => item.id === state.selectedId);
  if (blueprint) return renderBlueprintDetail(blueprint);
  const transfer = state.transfers.find((item) => item.id === state.selectedId);
  if (transfer) return renderTransferDetail(transfer);
}

function filteredBlueprints() {
  if (state.blueprintFilter === "All") return state.blueprints;
  if (state.blueprintFilter === "Featured") return state.blueprints.filter((item) => item.state === "Featured");
  return state.blueprints.filter((item) => item.category === state.blueprintFilter);
}

function renderPlaygroundDetail(pg) {
  detailKicker.textContent = "Selected Playground";
  detailTitle.textContent = pg.name;
  detailState.textContent = storageLabel(pg);
  detailState.className = `badge ${statusClass(pg.status)}`;
  const isTemporary = pg.storage === "temporary";
  const deleteOpen = state.deletePromptId === pg.id;
  const renameOpen = state.renamePromptId === pg.id;
  const saveActive = state.selectedId === "pg-unsaved" || isTemporary;

  detailBody.innerHTML = `
    <div class="section">
      <div class="summaryGrid">
        <div class="stat"><span>Storage</span><strong>${storageLabel(pg)}</strong></div>
        <div class="stat"><span>Runtime</span><strong>${runtimeText(pg.runtime)}</strong></div>
        <div class="stat"><span>Path</span><strong>${pg.path}</strong></div>
        <div class="stat"><span>Last action</span><strong>${pg.lastAction}</strong></div>
      </div>

      <div class="buttonRow">
        <button type="button" class="primary" data-detail-action="open-selected">Open in preview</button>
        <button type="button" data-detail-action="manager-settings">Settings</button>
        ${isTemporary ? `<button type="button" data-detail-action="begin-save">Save temporary site</button>` : `<button type="button" data-detail-action="rename-selected">Rename</button><button type="button" class="dangerGhost" data-detail-action="delete-selected">Delete</button>`}
      </div>

      ${pg.storage === "local" && pg.status === "local permission" ? `
        <div class="notice warning">
          <strong>Local directory permission needed</strong>
          <span>This Playground reloads from a local directory, but the browser needs folder access again after refresh.</span>
          <div class="buttonRow"><button type="button" data-detail-action="reconnect-local">Reconnect folder</button></div>
        </div>
      ` : ""}

      ${saveActive ? saveFlowMarkup(pg) : ""}

      ${renameOpen ? renameMarkup(pg) : ""}

      ${settingsMarkup(pg)}

      ${deleteOpen ? deleteConfirmMarkup(pg) : ""}

      <div class="notice blueTone" id="detailMessage">${state.detailMessage}</div>
    </div>
  `;
}

function renameMarkup(pg) {
  return `
    <div class="notice blueTone">
      <strong>Rename saved Playground</strong>
      <span>Renaming updates the saved row and active shell title when this Playground is open.</span>
      <label class="field">New name <input id="renameName" value="${pg.name}"></label>
      <div class="buttonRow">
        <button type="button" class="primary" data-detail-action="confirm-rename">Rename</button>
        <button type="button" data-detail-action="cancel-rename">Cancel</button>
      </div>
    </div>
  `;
}

function saveFlowMarkup(pg) {
  return `
    <div class="notice">
      <strong>Save destination</strong>
      <span>Browser storage creates a slug in this browser. Local directory writes files to a chosen folder and requires permission after reload.</span>
      <label class="field">Playground name <input id="saveName" value="${pg.name === "Unsaved Playground" ? "Research Browser Playground" : pg.name}"></label>
      <div class="buttonRow">
        <button type="button" class="${state.saveDestination === "browser" ? "primary" : ""}" data-detail-action="save-destination" data-destination="browser">Save in this browser</button>
        <button type="button" class="${state.saveDestination === "local" ? "primary" : ""}" data-detail-action="save-destination" data-destination="local">Save to a local directory</button>
      </div>
      ${state.saveDestination === "local" ? `
        <div class="notice warning">
          <strong>${state.folderPermission === "granted" ? "Folder selected" : "Folder picker required"}</strong>
          <span>${state.folderPermission === "granted" ? "~/Sites/research-browser-playground granted for this session." : "Choose a local folder before copying files. Cancel leaves the Playground temporary."}</span>
          <div class="buttonRow"><button type="button" data-detail-action="choose-folder">Choose folder</button></div>
        </div>
      ` : ""}
      <div class="meter"><span id="saveMeter" style="inline-size: 0%"></span></div>
      <div class="buttonRow"><button type="button" class="primary" data-detail-action="start-save">Start save</button><button type="button" data-detail-action="cancel-save">Cancel</button></div>
    </div>
  `;
}

function settingsMarkup(pg) {
  const stored = pg.storage !== "temporary";
  return `
    <div class="notice">
      <strong>Runtime settings</strong>
      <span>${stored ? "Stored Playgrounds save runtime metadata and reload WordPress." : "Applying settings to an unsaved Playground resets files and database."}</span>
      <div class="formGrid">
        <label class="field">WordPress version
          <select id="settingWp">
            <option ${pg.runtime.wp === "latest" ? "selected" : ""}>latest</option>
            <option ${pg.runtime.wp === "6.9 nightly" ? "selected" : ""}>6.9 nightly</option>
            <option ${pg.runtime.wp === "6.8.2" ? "selected" : ""}>6.8.2</option>
          </select>
        </label>
        <label class="field">PHP version
          <select id="settingPhp">
            <option ${pg.runtime.php === "8.3" ? "selected" : ""}>8.3</option>
            <option ${pg.runtime.php === "8.2" ? "selected" : ""}>8.2</option>
            <option ${pg.runtime.php === "7.4" ? "selected" : ""}>7.4</option>
          </select>
        </label>
        <label class="field">Language
          <select id="settingLang">
            <option ${pg.runtime.language === "en_US" ? "selected" : ""}>en_US</option>
            <option ${pg.runtime.language === "pl_PL" ? "selected" : ""}>pl_PL</option>
            <option ${pg.runtime.language === "es_ES" ? "selected" : ""}>es_ES</option>
          </select>
        </label>
        <label class="check"><input id="settingNetwork" type="checkbox" ${pg.runtime.network ? "checked" : ""}> Allow network access</label>
        <label class="check"><input id="settingOlder" type="checkbox"> Include older versions</label>
        <label class="check"><input id="settingMultisite" type="checkbox" ${pg.runtime.multisite ? "checked" : ""}> Create multisite network</label>
      </div>
      <div class="notice ${stored ? "blueTone" : "dangerTone"}">
        <strong>${stored ? "Stored reload behavior" : "Unsaved reset warning"}</strong>
        <span>${stored ? "Save & Reload keeps the browser/local identity, then reloads the active WordPress runtime." : "Apply Settings & Reset Playground discards the temporary site and starts again with the selected runtime."}</span>
      </div>
      <div class="buttonRow">
        <button type="button" class="${stored ? "primary" : "danger"}" data-detail-action="apply-settings">${stored ? "Save & Reload" : "Apply Settings & Reset"}</button>
        ${!stored ? `<button type="button" data-detail-action="cancel-reset">Cancel reset</button>` : ""}
      </div>
    </div>
  `;
}

function deleteConfirmMarkup(pg) {
  return `
    <div class="notice dangerTone">
      <strong>Delete ${pg.name}?</strong>
      <span>This removes the saved row. If it is active, the shell falls back to the unsaved temporary Playground. Files in a local directory are not silently removed.</span>
      <div class="buttonRow">
        <button type="button" class="danger" data-detail-action="confirm-delete">Delete Playground</button>
        <button type="button" data-detail-action="cancel-delete">Cancel</button>
      </div>
    </div>
  `;
}

function renderRouteDetail(route) {
  detailKicker.textContent = "Start route";
  detailTitle.textContent = route.name;
  detailState.textContent = route.state;
  detailState.className = `badge ${statusClass(route.state)}`;
  const fields = {
    "route-wp-pr": `<label class="field">PR number or URL <input id="routeInput" value="https://github.com/WordPress/wordpress-develop/pull/72042"></label>`,
    "route-gb-pr": `<label class="field">PR, URL, or branch <input id="routeInput" value="try/block-bindings-panel"></label>`,
    "route-github": `<label class="field">Repository <input id="routeInput" value="wordpress/wordpress-playground"></label><div class="notice warning"><strong>GitHub connection</strong><span>The access token is not stored. Refreshing the page requires authentication again.</span></div>`,
    "route-blueprint-url": `<label class="field">Blueprint URL <input id="routeInput" value="https://example.com/blueprint.json"></label>`,
    "route-zip": `<div class="notice warning"><strong>Native file chooser</strong><span>Selecting a ZIP validates the archive and then asks before replacing current files and database.</span></div>`
  };

  detailBody.innerHTML = `
    <div class="section">
      <div class="notice"><strong>${route.name}</strong><span>${route.hint}</span></div>
      ${fields[route.id] || `<div class="notice successTone"><strong>Fresh latest WordPress</strong><span>Starts a temporary Playground and keeps WP Admin/Homepage controls available.</span></div>`}
      ${route.id === "route-zip" && state.zipNeedsConfirm ? `
        <div class="notice dangerTone"><strong>Replace current Playground?</strong><span>plugin-test.zip contains files and a database. Importing replaces the active runtime.</span><div class="buttonRow"><button type="button" class="danger" data-detail-action="confirm-zip">Import and replace</button><button type="button" data-detail-action="cancel-zip">Cancel</button></div></div>
      ` : ""}
      <div class="buttonRow">
        <button type="button" class="primary" data-detail-action="run-route">${route.action}</button>
        <button type="button" data-view-target="playgrounds">Back to objects</button>
      </div>
      <div class="notice blueTone">${state.detailMessage}</div>
    </div>
  `;
}

function renderManagerDetail(row) {
  detailKicker.textContent = "Site Manager";
  detailTitle.textContent = row.name;
  detailState.textContent = row.state;
  detailState.className = `badge ${statusClass(row.state)}`;
  const active = activePlayground();
  const tabs = state.managerRows.map((item) => `<button type="button" class="${item.id === row.id ? "active" : ""}" data-select-id="${item.id}">${item.name}</button>`).join("");
  let body = "";

  if (row.id === "manager-settings") body = settingsMarkup(active);
  if (row.id === "manager-files") body = `
    <div class="buttonRow"><button type="button" data-detail-action="new-file">New File</button><button type="button" data-detail-action="new-folder">New Folder</button><button type="button" data-detail-action="upload-file">Upload</button><button type="button">Browse files</button></div>
    <div class="filePane">
      <ul class="fileTree"><li>/wordpress</li><li>wp-admin</li><li>wp-content</li><li>wp-includes</li><li class="active">wp-config.php</li><li>index.php</li></ul>
      <pre class="codeBox">define( 'DB_NAME', 'database_name_here' );
define( 'DB_USER', 'username_here' );
define( 'DB_PASSWORD', 'password_here' );
define( 'DB_HOST', 'localhost' );</pre>
    </div>
    <div class="notice warning"><strong>Dirty editor state available</strong><span>Editing wp-config.php marks the file dirty; Save writes the selected file and records the result.</span><div class="buttonRow"><button type="button" data-detail-action="mark-file-dirty">Edit line</button><button type="button" class="primary" data-detail-action="save-file">Save file</button></div></div>`;
  if (row.id === "manager-blueprint") body = `
    <label class="field">Blueprint URL <input value="https://example.com/blueprint.json"></label>
    <textarea rows="8">{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "login": true,
  "landingPage": "/hello-from-playground/",
  "preferredVersions": { "php": "8.3", "wp": "latest" }
}</textarea>
    <div class="buttonRow"><button type="button" data-detail-action="copy-blueprint">Copy link</button><button type="button" data-detail-action="download-blueprint">Download bundle</button><button type="button" class="primary" data-detail-action="run-blueprint">Run Blueprint</button></div>
    <div class="notice successTone"><strong>Validation passed</strong><span>blueprint.json is valid and ready to run against the active Playground.</span></div>`;
  if (row.id === "manager-database") body = `
    <div class="notice"><strong>Database management is an early access feature</strong><span>WordPress Playground emulates MySQL using SQLite.</span></div>
    <div class="summaryGrid"><div class="stat"><span>Driver</span><strong>MySQL emulation backed by SQLite</strong></div><div class="stat"><span>SQLite path</span><strong>/wordpress/wp-content/database/.ht.sqlite</strong></div><div class="stat"><span>Size</span><strong>452 KB</strong></div><div class="stat"><span>Status</span><strong>Download ready</strong></div></div>
    <div class="buttonRow"><button type="button" data-detail-action="download-db">Download database.sqlite</button><button type="button" data-detail-action="open-adminer">Open Adminer</button><button type="button" data-detail-action="open-phpmyadmin">Open phpMyAdmin</button></div>`;
  if (row.id === "manager-logs") body = `
    <div class="notice warning"><strong>PHP notice</strong><span>[PHP] Deprecated creation of dynamic property in /wordpress/wp-content/plugins/demo/plugin.php on line 42.</span></div>
    <div class="notice successTone"><strong>Playground log</strong><span>No startup problems so far.</span></div>
    <div class="notice successTone"><strong>WordPress log</strong><span>WP_DEBUG log is empty for the current request.</span></div>`;
  if (row.id === "manager-portability") body = `
    <div class="summaryGrid"><div class="stat"><span>GitHub</span><strong>Import and export</strong></div><div class="stat"><span>ZIP</span><strong>Import and download</strong></div><div class="stat"><span>Database</span><strong>database.sqlite</strong></div><div class="stat"><span>Blueprint</span><strong>Copy and bundle</strong></div></div>
    <div class="buttonRow"><button type="button" data-detail-action="export-github">Export to GitHub</button><button type="button" data-detail-action="download-zip">Download as .zip</button><button type="button" data-detail-action="download-db">Download database.sqlite</button><button type="button" data-detail-action="download-blueprint">Download Blueprint bundle</button></div>
    <div class="notice warning"><strong>GitHub export</strong><span>Connection is session-only. Choose an account and repository before pushing a branch.</span></div>`;

  detailBody.innerHTML = `<div class="section"><div class="managerTabs">${tabs}</div>${body}<div class="notice blueTone">${state.detailMessage}</div></div>`;
}

function renderBlueprintDetail(bp) {
  detailKicker.textContent = "Blueprint gallery";
  detailTitle.textContent = bp.name;
  detailState.textContent = bp.state;
  detailState.className = `badge ${statusClass(bp.state)}`;
  const filters = ["All", "Featured", "Website", "Personal", "Content", "Themes", "Gutenberg", "Experiments", "WooCommerce", "News"];
  detailBody.innerHTML = `
    <div class="section">
      <div class="notice"><strong>Representative subset of 43 blueprints</strong><span>This static slice shows six captured Blueprint examples and keeps the current category/search model visible.</span></div>
      <div class="filters">${filters.map((filter) => `<button type="button" class="${state.blueprintFilter === filter ? "active" : ""}" data-filter="${filter}">${filter}</button>`).join("")}</div>
      <label class="field">Search Blueprints <input value="${bp.name}"></label>
      <div class="summaryGrid"><div class="stat"><span>Category</span><strong>${bp.category}</strong></div><div class="stat"><span>Tags</span><strong>${bp.tags}</strong></div></div>
      <div class="notice warning"><strong>Run behavior</strong><span>Running a Blueprint validates JSON, warns when replacing content, updates the active path, and records the transfer.</span></div>
      <div class="buttonRow"><button type="button" data-detail-action="copy-blueprint">Copy link</button><button type="button" data-detail-action="download-blueprint">Download bundle</button><button type="button" class="primary" data-detail-action="run-selected-blueprint">Run Blueprint</button></div>
      <div class="notice blueTone">${state.detailMessage}</div>
    </div>
  `;
}

function renderTransferDetail(tx) {
  detailKicker.textContent = "Transfer history";
  detailTitle.textContent = tx.name;
  detailState.textContent = tx.status;
  detailState.className = `badge ${statusClass(tx.status)}`;
  detailBody.innerHTML = `
    <div class="section">
      <div class="summaryGrid"><div class="stat"><span>Type</span><strong>${tx.type}</strong></div><div class="stat"><span>Status</span><strong>${tx.status}</strong></div></div>
      <div class="notice"><strong>Result</strong><span>${tx.detail}</span></div>
      <div class="buttonRow"><button type="button" data-view-target="transfers">View all transfers</button><button type="button" data-view-target="manager">Open Site Manager</button></div>
    </div>
  `;
}

function render() {
  app.dataset.view = state.view;
  document.querySelectorAll("[data-view-target]").forEach((button) => {
    button.classList.toggle("active", button.dataset.viewTarget === state.view);
  });
  updateShell();
  renderTable();
  renderDetail();
}

function setView(view) {
  state.view = view;
  const defaults = {
    playgrounds: state.activeId,
    routes: "route-vanilla",
    manager: "manager-settings",
    blueprints: "bp-art",
    transfers: state.transfers[0]?.id
  };
  state.selectedId = defaults[view] || state.selectedId;
  render();
}

function showOverlay(title, text, width = "35%") {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  overlayMeter.style.inlineSize = width;
  previewOverlay.classList.remove("hidden");
}

function finishOverlay() {
  overlayMeter.style.inlineSize = "100%";
  setTimeout(() => previewOverlay.classList.add("hidden"), 450);
}

function updatePreviewFor(pg, message = "Live WordPress shell protected") {
  siteHeading.textContent = pg.name.includes("Import") ? "Plugin QA Import" : "My WordPress Website";
  previewStatus.textContent = message;
  if (pg.path.includes("wp-admin")) {
    previewContent.innerHTML = `<article><h2>Dashboard <span>${pg.name}</span></h2><p>WP Admin is open for the active Playground. Settings, files, database, logs, and exports remain available in the command deck.</p><mark>${runtimeText(pg.runtime)}</mark><p>Use the protected path bar to return to the homepage or inspect admin routes.</p><button type="button">Open Site Editor</button></article><div class="playgroundGlyph" aria-hidden="true"><div class="rings"></div><strong>W</strong></div>`;
  } else if (pg.name.includes("Art Gallery")) {
    previewContent.innerHTML = `<article><h2>Art Gallery <span>Blueprint</span></h2><p>A selected Blueprint has replaced the demo homepage with gallery content and captured media.</p><mark>Blueprint run completed</mark><p>The transfer history now records the bundle run and the active path update.</p><button type="button">View exhibition</button></article><div class="playgroundGlyph" aria-hidden="true"><div class="rings"></div><strong>W</strong></div>`;
  }
}

function applySettings() {
  const pg = selectedPlayground() || activePlayground();
  const nextRuntime = {
    wp: document.querySelector("#settingWp")?.value || pg.runtime.wp,
    php: document.querySelector("#settingPhp")?.value || pg.runtime.php,
    language: document.querySelector("#settingLang")?.value || pg.runtime.language,
    network: Boolean(document.querySelector("#settingNetwork")?.checked),
    multisite: Boolean(document.querySelector("#settingMultisite")?.checked)
  };
  const stored = pg.storage !== "temporary";
  pg.status = stored ? "saving" : "reset pending";
  pg.lastAction = stored ? "Save & Reload in progress" : "Unsaved reset in progress";
  state.detailMessage = stored ? "Saving runtime metadata, then reloading WordPress..." : "Resetting the temporary runtime with destructive settings changes...";
  showOverlay(stored ? "Saving and reloading" : "Resetting Playground", stored ? "Stored identity remains available after reload." : "Files and database are being recreated.");
  render();

  setTimeout(() => {
    pg.runtime = nextRuntime;
    pg.status = stored ? (pg.storage === "local" ? "saved local" : "saved") : "temporary";
    pg.lastAction = stored ? `Reloaded with ${runtimeText(pg.runtime)}` : `Reset with ${runtimeText(pg.runtime)}`;
    state.detailMessage = stored ? "Save & Reload complete. Runtime badge, active row, and preview state now match the selected settings." : "Reset complete. The unsaved Playground remains temporary and will still be lost on refresh.";
    addTransfer(stored ? "Settings Save & Reload" : "Temporary settings reset", "Settings", "completed", pg.lastAction);
    if (pg.id === state.activeId) {
      updatePreviewFor(pg, stored ? "Saved Playground reloaded" : "Temporary Playground reset");
    }
    finishOverlay();
    render();
  }, 850);
}

function startSave(pg) {
  const name = document.querySelector("#saveName")?.value.trim() || pg.name;
  if (state.saveDestination === "local" && state.folderPermission !== "granted") {
    state.detailMessage = "Choose a local folder first. Canceling the picker leaves the row temporary.";
    render();
    return;
  }
  pg.name = name;
  pg.status = "saving";
  pg.lastAction = state.saveDestination === "browser" ? "Saving 0 / 3751 files to browser storage" : "Copying 0 / 3751 files to local directory";
  state.detailMessage = pg.lastAction;
  showOverlay("Saving Playground", pg.lastAction, "28%");
  render();

  setTimeout(() => {
    pg.storage = state.saveDestination === "browser" ? "browser" : "local";
    pg.status = state.saveDestination === "browser" ? "saved" : "saved local";
    pg.subtitle = state.saveDestination === "browser" ? "Browser-backed slug: research-browser-playground" : "Local folder: ~/Sites/research-browser-playground";
    pg.lastAction = state.saveDestination === "browser" ? "Saving 3751 / 3751 files complete" : "Local copy complete; folder permission retained for this session";
    state.detailMessage = state.saveDestination === "browser" ? "Temporary row transformed into a browser-saved Playground with a slug and Save & Reload behavior." : "Temporary row transformed into a local-directory Playground. It will ask to reconnect the folder after refresh.";
    addTransfer(pg.name, "Save", "completed", pg.lastAction);
    state.activeId = pg.id;
    updatePreviewFor(pg, "Save completed");
    finishOverlay();
    render();
  }, 900);
}

function confirmDelete(pg) {
  pg.status = "deleting";
  pg.lastAction = "Delete confirmed; removing saved row";
  state.detailMessage = "Delete confirmed. Removing row and checking active-site fallback...";
  addTransfer(pg.name, "Delete", "pending", "Saved Playground deletion started.");
  render();
  setTimeout(() => {
    state.playgrounds = state.playgrounds.filter((item) => item.id !== pg.id);
    if (state.activeId === pg.id) {
      state.activeId = "pg-unsaved";
      const fallback = activePlayground();
      fallback.status = "temporary";
      fallback.lastAction = "Active fallback after saved Playground deletion";
      updatePreviewFor(fallback, "Deleted saved site; fallback opened");
    }
    state.deletePromptId = null;
    state.selectedId = state.activeId;
    state.detailMessage = "Delete complete. The saved row is gone and the active shell now uses the unsaved fallback.";
    addTransfer(pg.name, "Delete", "deleted", "Row removed. Active shell fell back to Unsaved Playground.");
    render();
  }, 700);
}

function runRoute(route) {
  if (route.id === "route-zip" && !state.zipNeedsConfirm) {
    state.zipNeedsConfirm = true;
    state.detailMessage = "plugin-test.zip selected. Confirm replacement before files and database change.";
    render();
    return;
  }
  if (route.id === "route-zip") return importZip();

  const active = activePlayground();
  active.status = "running";
  active.lastAction = `${route.name} route running`;
  state.detailMessage = `${route.name} is validating inputs and preparing WordPress.`;
  showOverlay(route.name, "Preparing WordPress runtime...", "42%");
  render();

  setTimeout(() => {
    if (route.id === "route-vanilla") {
      active.name = "Unsaved Playground";
      active.storage = "temporary";
      active.status = "temporary";
      active.path = "/hello-from-playground/";
    }
    if (route.id === "route-wp-pr") {
      active.name = "WordPress PR Preview";
      active.storage = "temporary";
      active.status = "temporary";
      active.path = "/wp-admin/about.php";
    }
    if (route.id === "route-gb-pr") {
      active.name = "Gutenberg Branch Preview";
      active.storage = "temporary";
      active.status = "temporary";
      active.path = "/wp-admin/site-editor.php";
    }
    if (route.id === "route-github") {
      active.name = "GitHub Import Preview";
      active.storage = "imported";
      active.status = "imported";
      active.path = "/wp-admin/plugins.php";
    }
    if (route.id === "route-blueprint-url") {
      active.name = "Blueprint URL Preview";
      active.storage = "temporary";
      active.status = "temporary";
      active.path = "/hello-from-playground/";
    }
    active.lastAction = `${route.name} completed`;
    state.detailMessage = `${route.name} completed. Active title, path, storage badge, preview, and transfer history updated.`;
    addTransfer(route.name, "Launch route", "completed", active.lastAction);
    updatePreviewFor(active, `${route.name} ready`);
    finishOverlay();
    render();
  }, 900);
}

function importZip() {
  const active = activePlayground();
  state.zipNeedsConfirm = false;
  active.status = "importing";
  active.lastAction = "ZIP replacement in progress";
  showOverlay("Importing plugin-test.zip", "Replacing files and database...", "48%");
  render();
  setTimeout(() => {
    active.name = "Imported ZIP Playground";
    active.storage = "imported";
    active.status = "imported";
    active.path = "/wp-admin/plugins.php";
    active.lastAction = "plugin-test.zip imported; files and database replaced";
    state.detailMessage = "ZIP import complete. The active row, shell title, path, preview, and transfer history now show the imported state.";
    addTransfer("plugin-test.zip", "Import", "imported", active.lastAction);
    updatePreviewFor(active, "ZIP import completed");
    finishOverlay();
    render();
  }, 950);
}

function runBlueprint(bp) {
  const active = activePlayground();
  active.status = "running";
  active.lastAction = `${bp.name} Blueprint validating`;
  state.detailMessage = "Blueprint JSON is valid. Replacing active content and updating the live preview...";
  showOverlay(`Running ${bp.name}`, "Applying Blueprint steps...", "55%");
  render();
  setTimeout(() => {
    active.name = `${bp.name} Playground`;
    active.status = active.storage === "temporary" ? "temporary" : "saved";
    active.path = "/";
    active.lastAction = `${bp.name} Blueprint run completed`;
    state.detailMessage = "Blueprint run complete. The preview changed, active path is /, and the transfer is recorded.";
    addTransfer(bp.name, "Blueprint run", "completed", active.lastAction);
    updatePreviewFor(active, "Blueprint run completed");
    finishOverlay();
    render();
  }, 850);
}

function handleDetailAction(action, button) {
  const pg = selectedPlayground();
  const route = state.routes.find((item) => item.id === state.selectedId);
  const bp = state.blueprints.find((item) => item.id === state.selectedId);

  if (action === "open-selected" && pg) {
    state.activeId = pg.id;
    pg.lastAction = "Opened in protected live preview";
    state.detailMessage = "Selected row is now the active Playground. Shell title, badge, path, and preview are synchronized.";
    updatePreviewFor(pg, "Selected Playground opened");
  }
  if (action === "manager-settings") setView("manager");
  if (action === "begin-save" && pg) state.detailMessage = "Choose browser storage or local directory, then start save.";
  if (action === "save-destination") state.saveDestination = button.dataset.destination;
  if (action === "choose-folder") {
    state.folderPermission = "granted";
    state.detailMessage = "Folder permission granted for ~/Sites/research-browser-playground.";
  }
  if (action === "start-save" && pg) return startSave(pg);
  if (action === "cancel-save") state.detailMessage = "Save canceled. Temporary Playground remains temporary.";
  if (action === "delete-selected" && pg) state.deletePromptId = pg.id;
  if (action === "rename-selected" && pg) state.renamePromptId = pg.id;
  if (action === "cancel-rename") {
    state.renamePromptId = null;
    state.detailMessage = "Rename canceled. The saved row name is unchanged.";
  }
  if (action === "confirm-rename" && pg) {
    const nextName = document.querySelector("#renameName")?.value.trim() || pg.name;
    pg.name = nextName;
    pg.subtitle = pg.storage === "browser" ? `Browser-backed slug: ${nextName.toLowerCase().replaceAll(" ", "-")}` : pg.subtitle;
    pg.lastAction = "Renamed saved Playground";
    state.renamePromptId = null;
    state.detailMessage = "Rename complete. The saved row and active shell title now use the new name.";
    addTransfer(nextName, "Rename", "completed", "Saved Playground row renamed.");
  }
  if (action === "cancel-delete") {
    state.deletePromptId = null;
    state.detailMessage = "Delete canceled. The saved row remains available.";
    addTransfer(pg.name, "Delete", "canceled", "User canceled deletion before any row changed.");
  }
  if (action === "confirm-delete" && pg) return confirmDelete(pg);
  if (action === "reconnect-local" && pg) {
    pg.status = "saved local";
    pg.lastAction = "Local folder permission reconnected";
    state.detailMessage = "Local permission restored. Reload behavior and local identity remain distinct from browser storage.";
    addTransfer(pg.name, "Local permission", "completed", pg.lastAction);
  }
  if (action === "apply-settings") return applySettings();
  if (action === "cancel-reset") state.detailMessage = "Reset canceled. No runtime settings were applied.";
  if (action === "run-route" && route) return runRoute(route);
  if (action === "confirm-zip") return importZip();
  if (action === "cancel-zip") {
    state.zipNeedsConfirm = false;
    state.detailMessage = "ZIP import canceled before replacement.";
  }
  if (action === "run-selected-blueprint" && bp) return runBlueprint(bp);
  if (action === "run-blueprint") {
    state.detailMessage = "Blueprint editor validated and ran against the active Playground.";
    addTransfer("blueprint.json", "Blueprint run", "completed", "Current Blueprint bundle ran successfully.");
  }
  if (action === "copy-blueprint") {
    state.detailMessage = "Blueprint link copied. Transfer history records the copy result.";
    addTransfer("Blueprint link", "Copy", "completed", "Copy link to Blueprint completed.");
  }
  if (action === "download-blueprint") {
    state.detailMessage = "Blueprint bundle generated for download.";
    addTransfer("blueprint-bundle.zip", "Download", "completed", "Blueprint bundle download generated.");
  }
  if (action === "download-db") {
    state.detailMessage = "database.sqlite download prepared from /wordpress/wp-content/database/.ht.sqlite.";
    addTransfer("database.sqlite", "Database download", "completed", "Downloaded SQLite database, 452 KB.");
  }
  if (action === "open-adminer" || action === "open-phpmyadmin") {
    state.detailMessage = action === "open-adminer" ? "Adminer opened in a new tool window." : "phpMyAdmin opened in a new tool window.";
  }
  if (action === "export-github") {
    state.detailMessage = "GitHub export queued. Connect account, choose repository, then push branch. Token remains session-only.";
    addTransfer("GitHub export", "Export", "exported", "Exported active Playground to wordpress/playground-demo branch preview.");
  }
  if (action === "download-zip") {
    state.detailMessage = "site-export.zip generated with files and database.";
    addTransfer("site-export.zip", "Download", "completed", "Active Playground ZIP download generated.");
  }
  if (action === "mark-file-dirty") {
    state.managerRows.find((item) => item.id === "manager-files").state = "wp-config.php dirty";
    state.detailMessage = "wp-config.php is dirty. Save file writes the selected editor content.";
  }
  if (action === "save-file") {
    state.managerRows.find((item) => item.id === "manager-files").state = "wp-config.php saved";
    state.detailMessage = "wp-config.php saved. File result state recorded.";
    addTransfer("wp-config.php", "File save", "completed", "Selected file saved successfully.");
  }
  if (action === "new-file" || action === "new-folder" || action === "upload-file") {
    state.detailMessage = action === "new-file" ? "New File created in /wordpress/wp-content/." : action === "new-folder" ? "New Folder created in /wordpress/wp-content/." : "Upload completed and file tree refreshed.";
  }
  render();
}

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view-target]");
  if (viewButton) {
    setView(viewButton.dataset.viewTarget);
    return;
  }

  const selectButton = event.target.closest("[data-select-id]");
  if (selectButton) {
    state.selectedId = selectButton.dataset.selectId;
    render();
    return;
  }

  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) {
    state.blueprintFilter = filterButton.dataset.filter;
    const filtered = filteredBlueprints();
    state.selectedId = filtered[0]?.id || "bp-art";
    render();
    return;
  }

  const detailButton = event.target.closest("[data-detail-action]");
  if (detailButton) {
    handleDetailAction(detailButton.dataset.detailAction, detailButton);
    return;
  }

  const rowAction = event.target.closest("[data-action]");
  if (rowAction) {
    const tr = rowAction.closest("tr");
    if (tr) state.selectedId = tr.dataset.id;
    const action = rowAction.dataset.action;
    const pg = selectedPlayground();
    const route = state.routes.find((item) => item.id === state.selectedId);
    const bp = state.blueprints.find((item) => item.id === state.selectedId);
    if (action === "open-playground" && pg) {
      state.activeId = pg.id;
      pg.lastAction = "Opened from table";
      state.detailMessage = "Open complete. Active shell now tracks the selected row.";
      updatePreviewFor(pg, "Opened from Playground table");
    }
    if (action === "manage-playground") state.view = "manager", state.selectedId = "manager-settings";
    if (action === "save-playground") state.detailMessage = "Save controls are ready in the selected detail panel.";
    if (action === "rename-playground" && pg) state.renamePromptId = pg.id;
    if (action === "delete-playground" && pg) state.deletePromptId = pg.id;
    if (action === "run-route" && route) return runRoute(route);
    if (action === "open-manager") state.detailMessage = "Site Manager row opened in the selected detail panel.";
    if (action === "inspect-blueprint" && bp) state.detailMessage = "Blueprint detail opened with copy, download, validation, and run actions.";
    render();
    return;
  }

  const row = event.target.closest("tr[data-id]");
  if (row) {
    state.selectedId = row.dataset.id;
    render();
  }

  const pathButton = event.target.closest("[data-path]");
  if (pathButton) {
    const active = activePlayground();
    if (pathButton.dataset.path === "refresh") {
      state.detailMessage = "Preview refreshed at the current path.";
      previewStatus.textContent = "Preview refreshed";
    } else {
      active.path = pathButton.dataset.path;
      state.detailMessage = `Path changed to ${active.path}.`;
      updatePreviewFor(active, active.path === "/wp-admin/" ? "WP Admin opened" : "Homepage opened");
    }
    render();
  }
});

document.querySelector("#pathForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const active = activePlayground();
  active.path = pathInput.value || "/";
  active.lastAction = `Navigated to ${active.path}`;
  state.detailMessage = `Path input navigated the embedded WordPress page to ${active.path}.`;
  updatePreviewFor(active, "Path navigation completed");
  render();
});

document.querySelector("#refreshBtn").addEventListener("click", () => {
  previewStatus.textContent = "Preview refreshed";
  state.detailMessage = "Refresh completed without losing the active Playground.";
  render();
});

document.querySelector("#saveButton").addEventListener("click", () => {
  state.view = "playgrounds";
  state.selectedId = state.activeId;
  state.detailMessage = "Save options are available in the selected Playground detail.";
  render();
});

document.querySelector("#newPlaygroundBtn").addEventListener("click", () => setView("routes"));

render();
