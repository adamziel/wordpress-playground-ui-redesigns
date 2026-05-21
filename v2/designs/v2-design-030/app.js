const commands = [
  {
    group: "Launch and import routes",
    items: [
      { id: "zip-import", key: "I", title: "Import .zip", hint: "Native archive chooser, validation, replacement warning, progress, imported identity" },
      { id: "github-import", key: "G", title: "Import from GitHub", hint: "Connect account, choose public plugin/theme/wp-content repository" },
      { id: "launch-vanilla", key: "N", title: "Vanilla WordPress", hint: "Start a fresh Playground immediately" },
      { id: "launch-wp-pr", key: "W", title: "WordPress PR", hint: "Preview by PR number or URL" },
      { id: "launch-gutenberg", key: "B", title: "Gutenberg PR or branch", hint: "Preview by PR, URL, or branch name" },
      { id: "blueprint-url", key: "U", title: "Blueprint URL", hint: "Run a remote blueprint.json URL" }
    ]
  },
  {
    group: "Save, storage, and saved management",
    items: [
      { id: "save-browser", key: "S", title: "Save in this browser", hint: "Copy files to browser storage and create a slug" },
      { id: "save-local", key: "L", title: "Save to local directory", hint: "Use a folder picker and preserve a folder-backed copy" },
      { id: "rename", key: "R", title: "Rename saved Playground", hint: "Update shell title, slug, and saved row" },
      { id: "delete", key: "D", title: "Delete saved Playground", hint: "Confirm removal and fall back if active" }
    ]
  },
  {
    group: "Site Manager commands",
    items: [
      { id: "manager-settings", key: "1", title: "Settings", hint: "WP version, PHP, language, network, multisite, reset or reload" },
      { id: "manager-files", key: "2", title: "Files", hint: "Create file/folder, upload, browse files, editor dirty/save state" },
      { id: "manager-blueprint", key: "3", title: "Blueprint tools", hint: "Gallery, URL, editor, copy, download, run, validation result" },
      { id: "manager-database", key: "4", title: "Database", hint: "SQLite path, size, download, Adminer, phpMyAdmin" },
      { id: "manager-logs", key: "5", title: "Logs", hint: "Playground, WordPress, and PHP log streams" }
    ]
  },
  {
    group: "Portability and bundles",
    items: [
      { id: "github-export", key: "E", title: "Export to GitHub", hint: "Connect session token, choose repository, push result" },
      { id: "zip-download", key: "Z", title: "Download as .zip", hint: "Generate active Playground archive and transfer history" },
      { id: "database-download", key: "Q", title: "Download database.sqlite", hint: "Export SQLite-backed database" },
      { id: "blueprint-bundle", key: "C", title: "Copy or download Blueprint bundle", hint: "Copy link, download bundle, run current blueprint" }
    ]
  }
];

const state = {
  activeCommand: "zip-import",
  managerTab: "files",
  selectedZip: "",
  zipStage: "source",
  githubConnected: false,
  exportConnected: false,
  currentProgress: 0,
  title: "Unsaved Playground",
  slug: "temporary-session",
  storage: "temporary",
  storageLabel: "Temporary, not saved",
  resetRule: "Settings reset discards this session",
  path: "/hello-from-playground/",
  runtime: "WP latest / PHP 8.3 / network on",
  previewKicker: "Live WordPress preview",
  previewHeadline: 'Hello from <span>WordPress Playground!</span>',
  previewText: "This Playground runs client-side in your browser. The command cockpit can start routes, save storage, inspect files, run Blueprints, and move ZIP or GitHub bundles without hiding this shell.",
  previewNote: "Logged in as admin. Temporary changes are lost on refresh until saved.",
  fileDirty: false,
  blueprintDirty: false,
  dbSize: "452 KB",
  objects: [
    { id: "temporary-session", name: "Unsaved Playground", meta: "Temporary session / current tab", type: "temporary", active: true },
    { id: "research-browser", name: "Research Browser Playground", meta: "Saved in browser / created May 21, 2026", type: "browser", active: false },
    { id: "client-theme-local", name: "Client Theme Local", meta: "Local directory / reconnect after permission loss", type: "local", active: false }
  ],
  history: [
    { type: "warning", title: "Temporary Playground opened", detail: "Active path /hello-from-playground/ is not saved to browser storage.", time: "09:42" },
    { type: "info", title: "Command selected", detail: "Import .zip is ready for source selection and replacement review.", time: "09:43" }
  ]
};

const $ = (selector) => document.querySelector(selector);

function addHistory(title, detail, type = "info") {
  state.history.unshift({
    title,
    detail,
    type,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  });
  renderHistory();
}

function setActiveObject(id) {
  state.objects = state.objects.map((object) => ({ ...object, active: object.id === id }));
}

function upsertObject(object) {
  const index = state.objects.findIndex((item) => item.id === object.id);
  if (index >= 0) {
    state.objects[index] = { ...state.objects[index], ...object };
  } else {
    state.objects.unshift(object);
  }
}

function applyActiveIdentity({ title, slug, storage, storageLabel, resetRule, path, runtime, kicker, headline, text, note }) {
  if (title) state.title = title;
  if (slug) state.slug = slug;
  if (storage) state.storage = storage;
  if (storageLabel) state.storageLabel = storageLabel;
  if (resetRule) state.resetRule = resetRule;
  if (path) state.path = path;
  if (runtime) state.runtime = runtime;
  if (kicker) state.previewKicker = kicker;
  if (headline) state.previewHeadline = headline;
  if (text) state.previewText = text;
  if (note) state.previewNote = note;
  renderShell();
}

function renderShell() {
  $(".app").dataset.storage = state.storage;
  $("#shellName").textContent = state.title;
  $("#activeTitle").textContent = state.title;
  $("#activeStorage").textContent = state.storageLabel;
  $("#runtimeMeta").textContent = state.runtime;
  $("#resetRule").textContent = state.resetRule;
  $("#pathInput").value = state.path;
  $("#browserUrl").textContent = `playground.local${state.path}`;
  $("#previewKicker").textContent = state.previewKicker;
  $("#previewHeadline").innerHTML = state.previewHeadline;
  $("#previewText").textContent = state.previewText;
  $("#previewNote").textContent = state.previewNote;
  const badge = $("#shellBadge");
  badge.className = "badge";
  if (state.storage === "temporary") {
    badge.classList.add("warning");
    badge.textContent = "Temporary";
  } else if (state.storage === "browser") {
    badge.classList.add("success");
    badge.textContent = "Saved";
  } else if (state.storage === "local") {
    badge.classList.add("info");
    badge.textContent = "Local";
  } else {
    badge.classList.add("neutral");
    badge.textContent = "Imported";
  }
  renderObjects();
}

function renderObjects() {
  $("#objectList").innerHTML = state.objects.map((object) => `
    <div class="object-row ${object.active ? "is-active" : ""}" data-object-id="${object.id}">
      <span class="object-icon" aria-hidden="true">${object.type === "local" ? "LD" : object.type === "temporary" ? "TMP" : object.type === "imported" ? "ZIP" : "WP"}</span>
      <div>
        <strong>${object.name}</strong>
        <span>${object.meta}</span>
      </div>
      <button type="button" data-open-object="${object.id}">Open</button>
    </div>
  `).join("");
}

function commandMatches(command, query) {
  if (!query) return true;
  const haystack = `${command.title} ${command.hint}`.toLowerCase();
  return query.toLowerCase().split(/\s+/).every((part) => haystack.includes(part));
}

function renderCommands() {
  const query = $("#commandSearch").value.trim();
  $("#commandResults").innerHTML = commands.map((group) => {
    const items = group.items.filter((item) => commandMatches(item, query));
    if (!items.length) return "";
    return `
      <section class="command-group">
        <h2>${group.group}</h2>
        ${items.map((item) => `
          <button class="command-button ${item.id === state.activeCommand ? "is-active" : ""}" type="button" data-command="${item.id}">
            <span><strong>${item.title}</strong><span>${item.hint}</span></span>
            <kbd>${item.key}</kbd>
          </button>
        `).join("")}
      </section>
    `;
  }).join("") || `<section class="command-group"><h2>No matches</h2><button class="command-button" type="button">Try "save", "zip", "github", "database", or "blueprint"</button></section>`;
}

function commandMeta(id) {
  for (const group of commands) {
    const item = group.items.find((entry) => entry.id === id);
    if (item) return item;
  }
  return commands[0].items[0];
}

function selectCommand(id) {
  state.activeCommand = id;
  const managerMap = {
    "manager-settings": "settings",
    "manager-files": "files",
    "manager-blueprint": "blueprint",
    "manager-database": "database",
    "manager-logs": "logs",
    "database-download": "database",
    "blueprint-bundle": "blueprint"
  };
  if (managerMap[id]) state.managerTab = managerMap[id];
  renderCommands();
  renderCommandPanel();
  renderManager();
}

function renderCommandPanel() {
  const meta = commandMeta(state.activeCommand);
  $("#commandTitle").textContent = meta.title;
  const badge = $("#commandState");
  badge.className = "badge info";
  badge.textContent = panelStatus(state.activeCommand);
  $("#commandBody").innerHTML = `<div class="command-body">${panelMarkup(state.activeCommand)}</div>`;
}

function panelStatus(id) {
  const labels = {
    "zip-import": state.zipStage === "success" ? "Imported" : state.zipStage === "failure" ? "Failed validation" : state.zipStage === "warning" ? "Replacement warning" : "Source required",
    "github-import": state.githubConnected ? "Repository ready" : "Connection required",
    "zip-download": "Ready to generate",
    "github-export": state.exportConnected ? "Destination ready" : "Connection required",
    "save-browser": "Browser destination",
    "save-local": "Folder permission",
    "delete": "Destructive action",
    "rename": "Editable identity",
    "manager-files": state.fileDirty ? "Dirty file" : "File browser",
    "manager-blueprint": state.blueprintDirty ? "Dirty JSON" : "Blueprint tools",
    "manager-database": "SQLite backed",
    "manager-logs": "Warning present"
  };
  return labels[id] || "Ready";
}

function panelMarkup(id) {
  if (id === "zip-import") return zipImportPanel();
  if (id === "github-import") return githubImportPanel();
  if (id === "zip-download") return zipDownloadPanel();
  if (id === "github-export") return githubExportPanel();
  if (id === "save-browser") return savePanel("browser");
  if (id === "save-local") return savePanel("local");
  if (id === "delete") return deletePanel();
  if (id === "rename") return renamePanel();
  if (id.startsWith("launch-") || id === "blueprint-url") return launchPanel(id);
  if (id === "database-download") return databaseDownloadPanel();
  if (id === "blueprint-bundle") return blueprintBundlePanel();
  if (id.startsWith("manager-")) return managerCommandPanel(id.replace("manager-", ""));
  return `<p class="note">Select a command to inspect its inputs, constraints, progress, and final state.</p>`;
}

function zipImportPanel() {
  const selected = state.selectedZip || "No archive selected";
  let stage = `<p class="note">Current product opens a native file chooser. This cockpit keeps the result in view: no file, selected file, validation failure, replacement warning, progress, and final imported Playground identity.</p>`;
  if (state.zipStage === "failure") {
    stage = `<div class="error-box"><strong>Validation failed.</strong><br>broken-theme.zip is missing wp-content and cannot replace the current Playground.</div>`;
  }
  if (state.zipStage === "warning") {
    stage = `<div class="warning-box"><strong>Replacement warning.</strong><br>${selected} will replace current WordPress files and the SQLite database. Unsaved changes in this temporary Playground will be discarded.</div>`;
  }
  if (state.zipStage === "progress") {
    stage = `<div class="progress-row"><strong>Importing archive</strong><span>${state.currentProgress}%</span></div><div class="progress" style="--progress:${state.currentProgress}%"><span></span></div>`;
  }
  if (state.zipStage === "success") {
    stage = `<div class="success-box"><strong>Imported ZIP Playground is active.</strong><br>Shell title, storage badge, path, preview state, saved list, and transfer history now reference the imported archive.</div>`;
  }
  return `
    <div class="segmented">
      <button type="button" class="choice ${state.selectedZip === "agency-demo-export.zip" ? "is-selected" : ""}" data-zip-source="agency-demo-export.zip">
        <span><strong>agency-demo-export.zip</strong><span>Valid Playground export / 18.4 MB / files and database included</span></span><kbd>Source</kbd>
      </button>
      <button type="button" class="choice ${state.selectedZip === "broken-theme.zip" ? "is-selected" : ""}" data-zip-source="broken-theme.zip">
        <span><strong>broken-theme.zip</strong><span>Failure fixture / missing wp-content / demonstrates validation error</span></span><kbd>Test</kbd>
      </button>
    </div>
    <div class="status-line"><span class="badge neutral">${selected}</span></div>
    ${stage}
    <div class="button-row">
      <button type="button" class="filled" data-action="validate-zip">Validate archive</button>
      <button type="button" class="danger" data-action="confirm-zip">Replace current Playground</button>
      <button type="button" data-action="cancel-zip">Cancel import</button>
    </div>
  `;
}

function githubImportPanel() {
  return `
    <p class="note">Imports plugins, themes, and wp-content directories from public GitHub repositories. The access token is session-only and must be reconnected after refresh.</p>
    <div class="field"><span>GitHub account</span><button type="button" class="${state.githubConnected ? "filled" : ""}" data-action="connect-github">${state.githubConnected ? "Connected as @playground-demo" : "Connect GitHub account"}</button></div>
    <div class="field"><span>Repository or URL</span><input id="githubImportRepo" value="wordpress/wordpress-develop"></div>
    <div class="field-row">
      <label><span>Import path</span><select><option>wp-content/plugins</option><option>wp-content/themes</option><option>entire wp-content directory</option></select></label>
      <label><span>Constraint</span><select><option>Public repository</option><option>Session token required</option></select></label>
    </div>
    <div class="button-row"><button type="button" class="filled" data-action="run-github-import">Import from GitHub</button></div>
  `;
}

function savePanel(destination) {
  const isLocal = destination === "local";
  return `
    <p class="note">${isLocal ? "Local directory save uses a folder picker, keeps a folder-backed working copy, and needs permission again if the browser loses access." : "Browser save copies WordPress files into browser storage, creates a saved Playground row, and changes reset actions to Save & Reload."}</p>
    <div class="field"><span>Playground name</span><input id="saveName" value="${isLocal ? "Local Client Playground" : "Research Browser Playground"}"></div>
    ${isLocal ? `<div class="field"><span>Folder picker result</span><select id="localPermission"><option value="granted">/Users/demo/Sites/playground-client</option><option value="denied">Permission denied</option><option value="cancelled">User cancelled picker</option></select></div>` : `<div class="field"><span>Browser slug</span><input id="browserSlug" value="research-browser-playground"></div>`}
    <div id="saveProgressSlot"></div>
    <div class="button-row"><button type="button" class="filled" data-action="${isLocal ? "save-local" : "save-browser"}">${isLocal ? "Save to local directory" : "Save in this browser"}</button></div>
  `;
}

function deletePanel() {
  return `
    <div class="warning-box"><strong>Delete saved Playground?</strong><br>Research Browser Playground will be removed from browser storage. If it is active, the shell falls back to an Unsaved Playground.</div>
    <div class="button-row">
      <button type="button" data-action="cancel-delete">Cancel</button>
      <button type="button" class="danger" data-action="confirm-delete">Delete Research Browser Playground</button>
    </div>
  `;
}

function renamePanel() {
  return `
    <p class="note">Renaming changes the active shell title, slug, saved row label, and manager header.</p>
    <div class="field"><span>New Playground name</span><input id="renameInput" value="${state.title === "Unsaved Playground" ? "Research Browser Playground" : state.title}"></div>
    <div class="button-row"><button type="button" class="filled" data-action="rename-playground">Rename Playground</button></div>
  `;
}

function launchPanel(id) {
  const content = {
    "launch-vanilla": ["Fresh WordPress", "No extra input. Starts a clean temporary Playground and warns before replacing unsaved work.", ""],
    "launch-wp-pr": ["Preview a WordPress PR", "PR NUMBER OR URL", "https://github.com/WordPress/wordpress-develop/pull/6401"],
    "launch-gutenberg": ["Preview a Gutenberg PR or branch", "PR NUMBER, URL, OR A BRANCH NAME", "trunk"],
    "blueprint-url": ["Run Blueprint from URL", "BLUEPRINT URL", "https://playground.wordpress.net/blueprints/gallery.json"]
  }[id];
  return `
    <p class="note">${content[0]} uses route-specific constraints and mutates the active title, path, preview state, and transfer history after confirmation.</p>
    ${content[1] ? `<div class="field"><span>${content[1]}</span><input id="launchInput" value="${content[2]}"></div>` : ""}
    <div class="warning-box"><strong>Replacement consequence.</strong><br>Starting this route replaces the current temporary runtime unless it is saved first.</div>
    <div class="button-row"><button type="button" class="filled" data-action="run-launch" data-launch="${id}">Start route</button><button type="button" data-command-jump="save-browser">Save first</button></div>
  `;
}

function zipDownloadPanel() {
  return `
    <p class="note">Generates a ZIP archive from the active Playground files and database. The live shell remains usable while the transfer record is written.</p>
    <ul class="mini-list">
      <li><span>Source</span><strong>${state.title}</strong></li>
      <li><span>Path</span><strong>${state.path}</strong></li>
      <li><span>Database</span><strong>${state.dbSize} SQLite included</strong></li>
    </ul>
    <div id="downloadProgressSlot"></div>
    <div class="button-row"><button type="button" class="filled" data-action="generate-zip">Generate ZIP</button></div>
  `;
}

function githubExportPanel() {
  return `
    <p class="note">Exports the active Playground to a GitHub repository. The token is not stored and must be reconnected after refresh.</p>
    <div class="field"><span>GitHub session</span><button type="button" class="${state.exportConnected ? "filled" : ""}" data-action="connect-export">${state.exportConnected ? "Connected as @playground-demo" : "Connect GitHub account"}</button></div>
    <div class="field"><span>Destination repository</span><input id="exportRepo" value="playground-demo/research-browser-playground"></div>
    <div class="field-row">
      <label><span>Export scope</span><select><option>Files and database</option><option>wp-content only</option><option>Blueprint bundle only</option></select></label>
      <label><span>Branch</span><input value="playground-export"></label>
    </div>
    <div id="exportProgressSlot"></div>
    <div class="button-row"><button type="button" class="filled" data-action="run-github-export">Export to GitHub</button></div>
  `;
}

function databaseDownloadPanel() {
  return `
    <ul class="mini-list">
      <li><span>Driver</span><strong>MySQL emulation backed by SQLite</strong></li>
      <li><span>Path</span><strong>/wordpress/wp-content/database/.ht.sqlite</strong></li>
      <li><span>Size</span><strong>${state.dbSize}</strong></li>
    </ul>
    <div class="button-row"><button type="button" class="filled" data-action="download-db">Download database.sqlite</button><button type="button">Open Adminer</button><button type="button">Open phpMyAdmin</button></div>
  `;
}

function blueprintBundlePanel() {
  return `
    <p class="note">Bundle actions operate on the current <code>/blueprint.json</code>: copy share link, download bundle, or run after validation.</p>
    <div class="button-row"><button type="button" data-action="copy-blueprint">Copy link</button><button type="button" data-action="download-blueprint">Download bundle</button><button type="button" class="filled" data-action="run-blueprint">Validate and run Blueprint</button></div>
  `;
}

function managerCommandPanel(tab) {
  return `
    <p class="note">The ${tab} command is open in the persistent Site Manager dock below the live preview. Actions there mutate the same active Playground object and write to transfer history.</p>
    <div class="button-row"><button type="button" class="filled" data-manager-tab="${tab}">Focus ${tab}</button></div>
  `;
}

function renderManager() {
  document.querySelectorAll("[data-manager-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.managerTab === state.managerTab);
  });
  const titleMap = { files: "Files", settings: "Settings", blueprint: "Blueprint", database: "Database", logs: "Logs" };
  $("#dockTitle").textContent = titleMap[state.managerTab];
  $("#managerPanel").innerHTML = managerMarkup(state.managerTab);
}

function managerMarkup(tab) {
  if (tab === "settings") {
    return `
      <div class="manager-grid">
        <section class="settings-card">
          <div class="field-row">
            <label><span>WordPress Version</span><select><option>latest</option><option>6.9 beta</option><option>6.8</option></select></label>
            <label><span>PHP Version</span><select><option>PHP 8.3</option><option>PHP 8.2</option><option>PHP 8.1</option></select></label>
          </div>
          <div class="field-row">
            <label><span>Language</span><select><option>English (United States)</option><option>Polish</option><option>Spanish</option></select></label>
            <label><span>Older versions</span><select><option>Do not include older versions</option><option>Include older versions</option></select></label>
          </div>
        </section>
        <section class="settings-card">
          <label><input type="checkbox" checked> Allow network access</label><br>
          <label><input type="checkbox"> Create a multisite network</label>
          <div class="warning-box"><strong>${state.storage === "temporary" ? "Apply Settings & Reset Playground" : "Save & Reload"}</strong><br>${state.storage === "temporary" ? "This reset is destructive for an unsaved Playground." : "Stored Playgrounds have limited configuration options and reload after saving."}</div>
          <button type="button" class="danger" data-action="apply-settings">${state.storage === "temporary" ? "Apply Settings & Reset Playground" : "Save & Reload"}</button>
        </section>
      </div>
    `;
  }
  if (tab === "blueprint") {
    return `
      <div class="manager-grid">
        <section class="blueprint-detail">
          <div class="blueprint-tools">
            <button type="button">New File</button><button type="button">New Folder</button><button type="button">Upload</button><button type="button">Browse files</button>
          </div>
          <p><strong>Gallery subset:</strong> 6 featured entries shown from the current 43-blueprint catalog.</p>
          <div class="field"><span>Search Blueprints</span><input value="featured website"></div>
          <div class="button-row"><button>All</button><button>Website</button><button>WooCommerce</button><button>News</button><button>Gutenberg</button></div>
          <div class="blueprint-gallery">
            ${["Art Gallery", "Coffee Shop", "Feed Reader with the Friends Plugin", "Gaming News", "Non-profit Organization", "Personal Blog"].map((name) => `<button class="bp-card" type="button"><strong>${name}</strong><span>Representative card from 43</span></button>`).join("")}
          </div>
        </section>
        <section class="editor-pane">
          <div class="editor-head"><strong>/blueprint.json</strong><span class="badge ${state.blueprintDirty ? "warning" : "success"}">${state.blueprintDirty ? "Dirty" : "Valid"}</span></div>
          <textarea id="blueprintEditor">{ "landingPage": "/hello-from-playground/", "preferredVersions": { "php": "8.3", "wp": "latest" } }</textarea>
          <div class="button-row"><button type="button" data-action="copy-blueprint">Copy link</button><button type="button" data-action="download-blueprint">Download bundle</button><button type="button" class="filled" data-action="run-blueprint">Run Blueprint</button></div>
        </section>
      </div>
    `;
  }
  if (tab === "database") {
    return `
      <div class="manager-grid">
        <section class="database-card">
          <h3>Database management is an early access feature</h3>
          <p>WordPress Playground emulates MySQL using SQLite.</p>
          <ul class="mini-list">
            <li><span>Driver</span><strong>MySQL emulation backed by SQLite</strong></li>
            <li><span>SQLite database path</span><strong>/wordpress/wp-content/database/.ht.sqlite</strong></li>
            <li><span>Size</span><strong>${state.dbSize}</strong></li>
          </ul>
        </section>
        <section class="database-card">
          <div class="button-row"><button type="button" class="filled" data-action="download-db">Download database.sqlite</button><button type="button">Open Adminer</button><button type="button">Open phpMyAdmin</button></div>
          <div class="success-box">Last checked: database is readable. Downloads write a transfer-history event.</div>
        </section>
      </div>
    `;
  }
  if (tab === "logs") {
    return `
      <div class="log-card">
        <div class="log-tabs"><button class="is-active">Playground</button><button>WordPress</button><button>PHP</button></div>
        <div class="log-row"><strong>PHP notice</strong><br>wp-config.php was edited in the file browser. Save or discard before reload.</div>
        <div class="note"><strong>WordPress log</strong><br>No fatal errors so far.</div>
        <div class="note"><strong>Playground log</strong><br>Service worker ready. Network access allowed.</div>
      </div>
    `;
  }
  return `
    <div class="manager-grid">
      <section class="file-tree">
        <div class="file-toolbar"><button type="button" data-action="new-file">New File</button><button type="button" data-action="new-folder">New Folder</button><button type="button" data-action="upload-file">Upload</button><button type="button">Browse files</button></div>
        <ul>
          <li>/wordpress</li>
          <li>wp-admin</li>
          <li>wp-content</li>
          <li>wp-includes</li>
          <li>index.php</li>
          <li class="is-selected">wp-config.php</li>
          <li>wp-cron.php</li>
        </ul>
      </section>
      <section class="editor-pane">
        <div class="editor-head"><strong>/wordpress/wp-config.php</strong><span class="badge ${state.fileDirty ? "warning" : "success"}">${state.fileDirty ? "Dirty" : "Saved"}</span></div>
        <textarea id="fileEditor">&lt;?php define('DB_NAME', 'database_name_here'); define('DB_USER', 'username_here'); define('DB_PASSWORD', 'password_here'); define('DB_HOST', 'localhost');</textarea>
        <div class="button-row"><button type="button" data-action="edit-file">Make dirty</button><button type="button" class="filled" data-action="save-file">Save file</button></div>
      </section>
    </div>
  `;
}

function renderHistory() {
  $("#historyCount").textContent = `${state.history.length} events`;
  $("#transferHistory").innerHTML = state.history.map((event) => `
    <li>
      <time>${event.time} / ${event.type}</time>
      <strong>${event.title}</strong><br>${event.detail}
    </li>
  `).join("");
}

function runProgress(slotSelector, done) {
  state.currentProgress = 0;
  const tick = () => {
    state.currentProgress += state.currentProgress < 60 ? 20 : 10;
    if (state.currentProgress > 100) state.currentProgress = 100;
    renderCommandPanel();
    const slot = $(slotSelector);
    if (slot) {
      slot.innerHTML = `<div class="progress-row"><strong>Working</strong><span>${state.currentProgress}%</span></div><div class="progress" style="--progress:${state.currentProgress}%"><span></span></div>`;
    }
    if (state.currentProgress < 100) {
      setTimeout(tick, 180);
    } else {
      done();
    }
  };
  tick();
}

function runZipImport() {
  if (state.zipStage !== "warning" || state.selectedZip !== "agency-demo-export.zip") {
    state.zipStage = "warning";
    renderCommandPanel();
    return;
  }
  state.zipStage = "progress";
  addHistory("ZIP import started", "agency-demo-export.zip is replacing the current files and SQLite database.", "transfer");
  runProgress("#zipProgressSlot", () => {
    state.zipStage = "success";
    setActiveObject("imported-zip");
    upsertObject({ id: "imported-zip", name: "Imported ZIP Playground", meta: "Imported from agency-demo-export.zip / temporary until saved", type: "imported", active: true });
    applyActiveIdentity({
      title: "Imported ZIP Playground",
      slug: "imported-zip-playground",
      storage: "imported",
      storageLabel: "Imported archive, temporary until saved",
      resetRule: "Imported runtime can be saved, exported, or replaced",
      path: "/wp-admin/import.php?complete=zip",
      kicker: "ZIP import complete",
      headline: "Imported <span>Playground archive</span>",
      text: "The selected archive replaced WordPress files and the SQLite database. The shell identity, active path, saved objects, and transfer history now point at the imported Playground.",
      note: "Imported state is temporary until saved in browser storage or a local directory."
    });
    addHistory("ZIP import completed", "Imported ZIP Playground became the active shell object.", "success");
    renderCommandPanel();
  });
}

function runSave(destination) {
  const name = $("#saveName")?.value || "Saved Playground";
  if (destination === "local") {
    const permission = $("#localPermission").value;
    if (permission !== "granted") {
      addHistory("Local save not completed", permission === "denied" ? "Folder permission was denied." : "Folder picker was cancelled.", "warning");
      $("#saveProgressSlot").innerHTML = `<div class="error-box">Local directory save stopped: ${permission === "denied" ? "permission denied" : "picker cancelled"}.</div>`;
      return;
    }
  }
  const slot = "#saveProgressSlot";
  addHistory(destination === "local" ? "Local directory save started" : "Browser save started", `Saving 3028 / 3751 files for ${name}.`, "transfer");
  runProgress(slot, () => {
    const id = destination === "local" ? "local-client-playground" : "research-browser";
    setActiveObject(id);
    upsertObject({
      id,
      name,
      meta: destination === "local" ? "Local directory / /Users/demo/Sites/playground-client" : "Saved in browser / slug ready",
      type: destination,
      active: true
    });
    applyActiveIdentity({
      title: name,
      slug: destination === "local" ? "local-client-playground" : ($("#browserSlug")?.value || "research-browser-playground"),
      storage: destination,
      storageLabel: destination === "local" ? "Local directory, folder permission granted" : "Saved in browser storage",
      resetRule: destination === "local" ? "Save & Reload uses the selected local folder" : "Settings changes use Save & Reload",
      kicker: destination === "local" ? "Local directory saved" : "Browser storage saved",
      text: destination === "local" ? "This Playground is backed by a local folder. If permission is lost on refresh, reconnect the directory before continuing." : "This Playground now has a browser-backed slug and appears in the saved Playgrounds list.",
      note: destination === "local" ? "Local directory storage is portable but permission-bound." : "Saved in this browser and available after reload."
    });
    addHistory(destination === "local" ? "Saved to local directory" : "Saved in this browser", `${name} is now the active ${destination} Playground.`, "success");
    renderCommandPanel();
  });
}

function runZipDownload() {
  addHistory("ZIP generation started", `${state.title} is being packaged with files and database.`, "transfer");
  runProgress("#downloadProgressSlot", () => {
    addHistory("ZIP ready", `${state.slug || "playground"}-2026-05-21.zip generated from ${state.title}.`, "success");
    $("#downloadProgressSlot").innerHTML = `<div class="success-box"><strong>${state.slug || "playground"}-2026-05-21.zip ready.</strong><br>Generated from active files plus ${state.dbSize} database.</div>`;
  });
}

function runGithubExport() {
  if (!state.exportConnected) {
    $("#exportProgressSlot").innerHTML = `<div class="error-box">Connect GitHub before exporting. The access token is session-only and is not stored after refresh.</div>`;
    return;
  }
  const repo = $("#exportRepo")?.value || "playground-demo/export";
  addHistory("GitHub export started", `${state.title} is pushing files and database to ${repo}.`, "transfer");
  runProgress("#exportProgressSlot", () => {
    addHistory("GitHub export completed", `${repo} received branch playground-export with the active Playground bundle.`, "success");
    $("#exportProgressSlot").innerHTML = `<div class="success-box"><strong>Export complete.</strong><br>${repo} / branch <code>playground-export</code> now contains files, database, and Blueprint bundle.</div>`;
  });
}

function runLaunch(id) {
  const labels = {
    "launch-vanilla": ["Fresh Vanilla WordPress", "/hello-from-playground/", "Vanilla WordPress started"],
    "launch-wp-pr": ["WordPress PR Preview", "/wp-admin/about.php?pr=6401", "WordPress PR preview ready"],
    "launch-gutenberg": ["Gutenberg Branch Preview", "/wp-admin/site-editor.php?branch=trunk", "Gutenberg PR or branch preview ready"],
    "blueprint-url": ["Blueprint URL Playground", "/hello-from-blueprint/", "Blueprint URL validated and run"]
  };
  const [title, path, eventTitle] = labels[id];
  setActiveObject("temporary-session");
  applyActiveIdentity({
    title,
    storage: "temporary",
    storageLabel: "Temporary route result, not saved",
    resetRule: "Save before refresh or replacement",
    path,
    kicker: "Route result",
    headline: `${title.replace(" Playground", "")} <span>ready</span>`,
    text: "The launch route completed and replaced the active temporary runtime. Save, export, inspect files, or open WP Admin from the same shell.",
    note: "This route result is temporary until saved."
  });
  upsertObject({ id: "temporary-session", name: title, meta: "Temporary route result / current tab", type: "temporary", active: true });
  addHistory(eventTitle, `${title} is active at ${path}.`, "success");
}

function handleAction(action, target) {
  if (action === "validate-zip") {
    if (!state.selectedZip) {
      addHistory("ZIP validation blocked", "No archive was selected.", "warning");
      return;
    }
    state.zipStage = state.selectedZip === "broken-theme.zip" ? "failure" : "warning";
    addHistory(state.zipStage === "failure" ? "ZIP validation failed" : "ZIP validation passed", state.selectedZip === "broken-theme.zip" ? "broken-theme.zip is missing wp-content." : "agency-demo-export.zip is valid and needs replacement confirmation.", state.zipStage === "failure" ? "error" : "info");
    renderCommandPanel();
  }
  if (action === "confirm-zip") runZipImport();
  if (action === "cancel-zip") {
    state.zipStage = "source";
    state.selectedZip = "";
    addHistory("ZIP import cancelled", "Active Playground was not changed.", "info");
    renderCommandPanel();
  }
  if (action === "connect-github") {
    state.githubConnected = true;
    addHistory("GitHub import connected", "Connected as @playground-demo. Token will not be stored after refresh.", "success");
    renderCommandPanel();
  }
  if (action === "run-github-import") {
    if (!state.githubConnected) {
      addHistory("GitHub import blocked", "Connect account before selecting a repository.", "warning");
      return;
    }
    applyActiveIdentity({
      title: "GitHub Import Playground",
      storage: "imported",
      storageLabel: "Imported from GitHub, temporary until saved",
      resetRule: "Imported runtime can be exported, saved, or replaced",
      path: "/wp-admin/plugins.php?source=github",
      kicker: "GitHub import complete",
      headline: "GitHub <span>import ready</span>",
      text: "The selected repository was imported into wp-content and is now visible in the active WordPress shell.",
      note: "GitHub token is not stored. Reconnect after refresh."
    });
    setActiveObject("github-import");
    upsertObject({ id: "github-import", name: "GitHub Import Playground", meta: "Imported from wordpress/wordpress-develop / temporary", type: "imported", active: true });
    addHistory("GitHub import completed", "Repository content imported into wp-content and activated as the current Playground.", "success");
  }
  if (action === "save-browser") runSave("browser");
  if (action === "save-local") runSave("local");
  if (action === "confirm-delete") {
    const wasActive = state.objects.find((item) => item.id === "research-browser")?.active;
    state.objects = state.objects.filter((item) => item.id !== "research-browser");
    if (wasActive) {
      setActiveObject("temporary-session");
      applyActiveIdentity({
        title: "Unsaved Playground",
        storage: "temporary",
        storageLabel: "Temporary fallback after deletion",
        resetRule: "Settings reset discards this session",
        path: "/hello-from-playground/",
        kicker: "Fallback active",
        headline: 'Hello from <span>WordPress Playground!</span>',
        text: "The deleted saved Playground was active, so the shell returned to a temporary Playground.",
        note: "Temporary changes are lost on refresh until saved."
      });
    }
    addHistory("Saved Playground deleted", "Research Browser Playground was removed from the saved list.", "success");
    renderObjects();
    renderCommandPanel();
  }
  if (action === "cancel-delete") addHistory("Delete cancelled", "No saved row was removed.", "info");
  if (action === "rename-playground") {
    const newName = $("#renameInput").value || state.title;
    state.title = newName;
    state.slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const active = state.objects.find((item) => item.active);
    if (active) active.name = newName;
    addHistory("Playground renamed", `Active shell and saved row now use ${newName}.`, "success");
    renderShell();
    renderCommandPanel();
  }
  if (action === "run-launch") runLaunch(target.dataset.launch);
  if (action === "generate-zip") runZipDownload();
  if (action === "connect-export") {
    state.exportConnected = true;
    addHistory("GitHub export connected", "Connected as @playground-demo for this session only.", "success");
    renderCommandPanel();
  }
  if (action === "run-github-export") runGithubExport();
  if (action === "download-db") {
    addHistory("database.sqlite downloaded", `/wordpress/wp-content/database/.ht.sqlite exported at ${state.dbSize}.`, "success");
    state.dbSize = "456 KB";
    renderManager();
    renderCommandPanel();
  }
  if (action === "copy-blueprint") addHistory("Blueprint link copied", "Current /blueprint.json share link copied.", "success");
  if (action === "download-blueprint") addHistory("Blueprint bundle downloaded", "Blueprint bundle generated from current blueprint.json.", "success");
  if (action === "run-blueprint") {
    state.blueprintDirty = false;
    applyActiveIdentity({
      title: "Blueprint Result Playground",
      path: "/hello-from-blueprint/",
      kicker: "Blueprint run complete",
      headline: "Blueprint <span>result ready</span>",
      text: "The Blueprint validated, replaced the current content, and updated the active preview.",
      note: "Save this result before running another replacement flow."
    });
    addHistory("Blueprint run completed", "Validated blueprint.json replaced the active Playground content.", "success");
    renderManager();
  }
  if (action === "edit-file") {
    state.fileDirty = true;
    addHistory("File editor dirty", "wp-config.php has unsaved edits.", "warning");
    renderManager();
    renderCommandPanel();
  }
  if (action === "save-file") {
    state.fileDirty = false;
    addHistory("File saved", "/wordpress/wp-config.php saved successfully.", "success");
    renderManager();
    renderCommandPanel();
  }
  if (action === "new-file") addHistory("New file created", "/wordpress/wp-content/mu-plugins/playground-note.php created.", "success");
  if (action === "new-folder") addHistory("New folder created", "/wordpress/wp-content/uploads/playground-assets created.", "success");
  if (action === "upload-file") addHistory("Upload completed", "theme-preview.css uploaded into wp-content/uploads.", "success");
  if (action === "apply-settings") {
    applyActiveIdentity({
      runtime: "WP latest / PHP 8.2 / network on",
      resetRule: state.storage === "temporary" ? "Reset completed for temporary settings" : "Save & Reload completed",
      kicker: "Runtime settings applied",
      text: "WordPress and PHP settings were applied. Temporary Playgrounds reset; saved and local Playgrounds reload after saving.",
      note: state.storage === "temporary" ? "Previous temporary changes were discarded by reset." : "Stored identity was preserved through Save & Reload."
    });
    addHistory("Settings applied", state.storage === "temporary" ? "Temporary Playground reset after settings change." : "Saved Playground reloaded after settings change.", "success");
  }
}

document.addEventListener("click", (event) => {
  const commandButton = event.target.closest("[data-command]");
  if (commandButton) selectCommand(commandButton.dataset.command);

  const commandJump = event.target.closest("[data-command-jump]");
  if (commandJump) selectCommand(commandJump.dataset.commandJump);

  const zipSource = event.target.closest("[data-zip-source]");
  if (zipSource) {
    state.selectedZip = zipSource.dataset.zipSource;
    state.zipStage = "source";
    renderCommandPanel();
  }

  const managerTab = event.target.closest("[data-manager-tab]");
  if (managerTab) {
    state.managerTab = managerTab.dataset.managerTab;
    renderManager();
  }

  const openObject = event.target.closest("[data-open-object]");
  if (openObject) {
    const object = state.objects.find((item) => item.id === openObject.dataset.openObject);
    if (object) {
      setActiveObject(object.id);
      applyActiveIdentity({
        title: object.name,
        storage: object.type === "browser" ? "browser" : object.type === "local" ? "local" : object.type === "imported" ? "imported" : "temporary",
        storageLabel: object.meta,
        resetRule: object.type === "temporary" ? "Settings reset discards this session" : "Settings changes use Save & Reload",
        path: object.type === "local" ? "/wp-admin/" : "/hello-from-playground/",
        kicker: "Playground opened",
        text: `${object.name} is now the active Playground object.`
      });
      addHistory("Playground opened", `${object.name} is active.`, "info");
    }
  }

  const action = event.target.closest("[data-action]");
  if (action) handleAction(action.dataset.action, action);
});

$("#commandSearch").addEventListener("input", renderCommands);

$("#pathInput").addEventListener("change", (event) => {
  state.path = event.target.value || "/";
  $("#browserUrl").textContent = `playground.local${state.path}`;
  addHistory("Path navigated", `Embedded WordPress site moved to ${state.path}.`, "info");
});

$("#refreshBtn").addEventListener("click", () => addHistory("Preview refreshed", `${state.path} reloaded in the active WordPress shell.`, "info"));
$("#homeBtn").addEventListener("click", () => {
  state.path = "/hello-from-playground/";
  renderShell();
  addHistory("Homepage opened", "Active WordPress path changed to /hello-from-playground/.", "info");
});
$("#adminBtn").addEventListener("click", () => {
  state.path = "/wp-admin/";
  renderShell();
  addHistory("WP Admin opened", "Active WordPress path changed to /wp-admin/.", "info");
});

renderCommands();
renderShell();
renderCommandPanel();
renderManager();
renderHistory();
