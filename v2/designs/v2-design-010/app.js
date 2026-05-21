const state = {
  query: "save",
  selectedCommand: "save-browser",
  activeObjectId: "unsaved",
  path: "/hello-from-playground/",
  title: "Unsaved Playground",
  storage: "Temporary",
  slug: "",
  runtime: "WP latest / PHP 8.3",
  selectedManagerTab: "settings",
  selectedDestination: "browser",
  selectedBlueprintCategory: "All",
  fileDirty: false,
  blueprintDirty: false,
  zipFile: "",
  githubConnected: false,
  history: [
    {
      title: "Temporary Playground booted",
      meta: "Path /hello-from-playground/ / SQLite database 452 KB"
    }
  ],
  objects: [
    {
      id: "unsaved",
      title: "Unsaved Playground",
      storage: "Temporary",
      meta: "Not saved. Refresh or close discards files and database.",
      active: true
    },
    {
      id: "research",
      title: "Research Browser Playground",
      storage: "Browser",
      meta: "Saved in this browser / created May 21, 2026",
      active: false
    },
    {
      id: "local",
      title: "Plugin Lab Local Folder",
      storage: "Local directory",
      meta: "~/Sites/plugin-lab / permission reconnect may be required",
      active: false
    }
  ]
};

const commands = [
  {
    id: "save-browser",
    group: "Save",
    title: "Save in this browser",
    hint: "Copy temporary files into browser storage",
    keywords: "save browser storage slug durable progress"
  },
  {
    id: "save-local",
    group: "Save",
    title: "Save to a local directory",
    hint: "Choose a folder and persist files outside browser storage",
    keywords: "save local directory folder permission reconnect"
  },
  {
    id: "vanilla",
    group: "Create",
    title: "Vanilla WordPress",
    hint: "Start a fresh latest WordPress Playground",
    keywords: "create start vanilla wordpress new reset"
  },
  {
    id: "wp-pr",
    group: "Create",
    title: "Preview WordPress PR",
    hint: "Requires a PR number or GitHub URL",
    keywords: "wordpress pr pull request preview"
  },
  {
    id: "gutenberg-pr",
    group: "Create",
    title: "Preview Gutenberg PR or branch",
    hint: "Accepts PR number, URL, or branch name",
    keywords: "gutenberg branch pr preview"
  },
  {
    id: "github-import",
    group: "Create",
    title: "Import from GitHub",
    hint: "Connect account, choose plugin/theme/wp-content source",
    keywords: "github import account token repository"
  },
  {
    id: "blueprint-url",
    group: "Create",
    title: "Run Blueprint URL",
    hint: "Paste a blueprint URL and validate before running",
    keywords: "blueprint url json run validate"
  },
  {
    id: "zip-import",
    group: "Create",
    title: "Import .zip over current Playground",
    hint: "Native file chooser, validation, replacement warning",
    keywords: "zip import replace destructive archive"
  },
  {
    id: "library",
    group: "Manage",
    title: "Saved Playgrounds",
    hint: "Open, manage, rename, or delete saved rows",
    keywords: "saved playgrounds library manage rename delete"
  },
  {
    id: "delete-saved",
    group: "Manage",
    title: "Delete saved Playground",
    hint: "Confirm deletion and fall back to an unsaved site if needed",
    keywords: "delete remove destructive saved"
  },
  {
    id: "settings",
    group: "Site Manager",
    title: "Runtime settings",
    hint: "WordPress, PHP, language, network, multisite",
    keywords: "settings php language network multisite older versions reset reload"
  },
  {
    id: "files",
    group: "Site Manager",
    title: "File browser",
    hint: "Create file/folder, upload, browse, edit and save",
    keywords: "files editor create folder upload browse wp-config"
  },
  {
    id: "blueprint",
    group: "Site Manager",
    title: "Blueprint tools",
    hint: "Gallery, URL, editor, copy, download, run",
    keywords: "blueprints gallery copy download bundle run validation"
  },
  {
    id: "database",
    group: "Site Manager",
    title: "Database tools",
    hint: "SQLite path, size, download, Adminer, phpMyAdmin",
    keywords: "database sqlite adminer phpmyadmin download"
  },
  {
    id: "logs",
    group: "Site Manager",
    title: "Logs",
    hint: "Playground, WordPress, and PHP events",
    keywords: "logs php wordpress playground warning"
  },
  {
    id: "export-github",
    group: "Portability",
    title: "Export to GitHub",
    hint: "Connect account, choose repository, push wp-content",
    keywords: "github export repository push"
  },
  {
    id: "download-zip",
    group: "Portability",
    title: "Download as .zip",
    hint: "Package files and database into a portable archive",
    keywords: "download zip archive export"
  },
  {
    id: "download-db",
    group: "Portability",
    title: "Download database.sqlite",
    hint: "Export the SQLite database file",
    keywords: "database download sqlite portability"
  }
];

const blueprints = [
  { title: "Art Gallery", category: "Website", desc: "A Vue theme gallery starter.", className: "" },
  { title: "Coffee Shop", category: "WooCommerce", desc: "Storefront with products.", className: "coffee" },
  { title: "Feed Reader with the Friends Plugin", category: "Content", desc: "RSS and social web reader.", className: "feed" },
  { title: "Gaming News", category: "News", desc: "Spiel theme news layout.", className: "game" },
  { title: "Non-profit Organization", category: "Website", desc: "Koinonia theme donation site.", className: "" },
  { title: "Personal Blog", category: "Personal", desc: "Substrata blog starter.", className: "coffee" }
];

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  [
    "activeIdentity",
    "commandSearch",
    "resultCount",
    "resultsList",
    "commandGroupLabel",
    "commandTitle",
    "commandState",
    "commandDescription",
    "commandBody",
    "objectList",
    "managerBody",
    "transferHistory",
    "pathInput",
    "browserPath",
    "storageBadge",
    "runtimeBadge",
    "mutationStatus",
    "previewTitle",
    "previewText",
    "previewKicker",
    "previewNote"
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });

  els.commandSearch.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderResults();
  });

  document.getElementById("commandSearchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const first = filteredCommands()[0];
    if (first) selectCommand(first.id);
  });

  document.getElementById("refreshButton").addEventListener("click", () => {
    addHistory("Preview refreshed", `${state.path} reloaded without changing storage state`);
    setMutation("Live WordPress preview refreshed.");
  });

  document.getElementById("homeButton").addEventListener("click", () => setPath("/hello-from-playground/", "Homepage opened"));
  document.getElementById("adminButton").addEventListener("click", () => setPath("/wp-admin/", "WP Admin opened"));
  document.getElementById("pathInput").addEventListener("change", (event) => setPath(event.target.value || "/", "Path command executed"));
  document.getElementById("saveCommandButton").addEventListener("click", () => selectCommand("save-browser"));
  document.getElementById("openManagerButton").addEventListener("click", () => selectCommand("files"));
  document.getElementById("renameActiveButton").addEventListener("click", () => openRenameModal(state.activeObjectId));
  document.getElementById("downloadZipButton").addEventListener("click", () => selectCommand("download-zip"));

  document.querySelectorAll(".manager-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      state.selectedManagerTab = tab.dataset.tab;
      document.querySelectorAll(".manager-tab").forEach((item) => item.classList.toggle("active", item === tab));
      renderManager();
    });
  });

  renderAll();
});

function renderAll() {
  renderShell();
  renderResults();
  renderCommand();
  renderObjects();
  renderManager();
  renderHistory();
}

function renderShell() {
  const active = getActiveObject();
  state.title = active.title;
  state.storage = active.storage;
  els.activeIdentity.textContent = state.title;
  els.pathInput.value = state.path;
  els.browserPath.textContent = state.path;
  els.runtimeBadge.textContent = state.runtime;
  els.storageBadge.textContent = storageLabel(active.storage);
  els.storageBadge.className = `badge ${storageClass(active.storage)}`;
}

function storageLabel(storage) {
  if (storage === "Browser") return "Saved in browser";
  if (storage === "Local directory") return "Local directory";
  if (storage === "Imported zip") return "ZIP import";
  if (storage === "GitHub import") return "GitHub import";
  return "Temporary";
}

function storageClass(storage) {
  if (storage === "Browser" || storage === "Local directory") return "green";
  if (storage === "Imported zip" || storage === "GitHub import") return "blue";
  return "amber";
}

function filteredCommands() {
  const q = state.query.trim().toLowerCase();
  if (!q) return commands;
  return commands.filter((command) => {
    return `${command.title} ${command.group} ${command.hint} ${command.keywords}`.toLowerCase().includes(q);
  });
}

function renderResults() {
  const filtered = filteredCommands();
  const grouped = filtered.reduce((acc, command) => {
    acc[command.group] = acc[command.group] || [];
    acc[command.group].push(command);
    return acc;
  }, {});

  els.resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "match" : "matches"}`;
  els.resultsList.innerHTML = "";

  if (!filtered.length) {
    els.resultsList.innerHTML = `<div class="empty">No command matches. Try "save", "zip", "database", "PR", "GitHub", or "Blueprint".</div>`;
    return;
  }

  Object.keys(grouped).forEach((group) => {
    const section = document.createElement("div");
    section.className = "result-group";
    section.innerHTML = `<div class="result-group-title">${group}</div>`;
    grouped[group].forEach((command) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `result-item ${command.id === state.selectedCommand ? "active" : ""}`;
      button.innerHTML = `
        <span><strong>${command.title}</strong><span>${command.hint}</span></span>
        <kbd>${group.slice(0, 3)}</kbd>
      `;
      button.addEventListener("click", () => selectCommand(command.id));
      section.appendChild(button);
    });
    els.resultsList.appendChild(section);
  });
}

function selectCommand(id) {
  state.selectedCommand = id;
  const command = commands.find((item) => item.id === id);
  if (command) {
    state.query = command.title.split(" ")[0].toLowerCase();
    els.commandSearch.value = state.query;
  }
  renderResults();
  renderCommand();
  setMutation(`Selected command: ${command ? command.title : id}.`);
}

function renderCommand() {
  const command = commands.find((item) => item.id === state.selectedCommand) || commands[0];
  els.commandGroupLabel.textContent = command.group;
  els.commandTitle.textContent = command.title;
  els.commandState.textContent = "Ready";
  els.commandState.className = "status-pill amber";
  els.commandDescription.textContent = commandDescription(command.id);
  els.commandBody.innerHTML = commandBody(command.id);
  bindCommandBody(command.id);
}

function commandDescription(id) {
  const active = getActiveObject();
  const descriptions = {
    "save-browser": "Copy this temporary Playground into browser storage, create a slug, and switch the shell to stored Save & Reload behavior.",
    "save-local": "Pick a local directory, grant browser file-system permission, and keep the Playground outside browser storage with reconnect consequences.",
    "vanilla": "Start a fresh latest WordPress Playground. Unsaved files and database in the current Playground will be replaced.",
    "wp-pr": "Preview a WordPress core pull request by number or URL. The resulting preview remains temporary until saved.",
    "gutenberg-pr": "Preview a Gutenberg pull request or branch by number, URL, or branch name, then save or export it if needed.",
    "github-import": "Import a public plugin, theme, or wp-content directory after connecting GitHub. Access tokens are not stored after refresh.",
    "blueprint-url": "Run a Blueprint from a URL after validation and replacement confirmation.",
    "zip-import": `Replace ${active.title} with an uploaded .zip after validation, warning, and import progress.`,
    "library": "Manage saved, local, and temporary Playground objects without hiding the live WordPress browser.",
    "delete-saved": "Delete a saved Playground with confirmation, row removal, and active-site fallback.",
    settings: "Change WordPress, PHP, language, network, and multisite settings. Temporary sites reset; stored sites Save & Reload.",
    files: "Browse WordPress files, create files or folders, upload, edit the selected file, and save dirty changes.",
    blueprint: "Search the Blueprint gallery subset, edit blueprint.json, validate, copy, download, and run the bundle.",
    database: "Inspect the SQLite-backed database, download database.sqlite, or open Adminer and phpMyAdmin.",
    logs: "Review Playground, WordPress, and PHP logs with realistic event states.",
    "export-github": "Connect GitHub, choose a repository, and export the active Playground files.",
    "download-zip": "Package the active Playground files and SQLite database into a portable .zip.",
    "download-db": "Download the SQLite database used by the current Playground."
  };
  return descriptions[id] || "";
}

function commandBody(id) {
  const bodies = {
    "save-browser": saveBody("browser"),
    "save-local": saveBody("local"),
    vanilla: startBody("Vanilla WordPress", "No input required. This starts a clean latest WordPress runtime."),
    "wp-pr": prBody("WordPress PR", "PR number or URL", "https://github.com/WordPress/wordpress-develop/pull/7391"),
    "gutenberg-pr": prBody("Gutenberg PR or branch", "PR number, URL, or branch name", "try/block-bindings-panel"),
    "github-import": githubImportBody(),
    "blueprint-url": blueprintUrlBody(),
    "zip-import": zipImportBody(),
    library: libraryBody(),
    "delete-saved": deleteCommandBody(),
    settings: settingsCommandBody(),
    files: filesCommandBody(),
    blueprint: blueprintCommandBody(),
    database: databaseCommandBody(),
    logs: logsCommandBody(),
    "export-github": githubExportBody(),
    "download-zip": downloadZipBody(),
    "download-db": databaseDownloadBody()
  };
  return bodies[id] || "";
}

function saveBody(destination) {
  const browserActive = destination === "browser";
  return `
    <div class="form-grid">
      <div class="warning-box">Temporary Playgrounds are lost on refresh or close unless saved. Browser storage creates a Playground slug; local directory saving asks for folder permission and may require reconnect after reload.</div>
      <div class="field">
        <label class="field-label" for="saveName">Playground name</label>
        <input id="saveName" value="${browserActive ? "Research Browser Playground" : "Client Demo Local"}">
      </div>
      <div class="choice-row" role="group" aria-label="Storage destination">
        <button class="choice ${browserActive ? "active" : ""}" data-select-command="save-browser" type="button">
          <strong>Save in this browser</strong>
          <span>Copies files into browser storage and creates a site slug.</span>
        </button>
        <button class="choice ${!browserActive ? "active" : ""}" data-select-command="save-local" type="button">
          <strong>Save to local directory</strong>
          <span>Uses a folder picker and stores the site on disk.</span>
        </button>
      </div>
      ${browserActive ? `<div class="info-box">Result will change the shell to "Saved in browser", update the path slug, and replace Reset with Save & Reload in Settings.</div>` : `<div class="info-box">Folder permission granted: ~/Sites/client-demo. If permission is lost after browser reload, the row asks to reconnect.</div>`}
      <div id="commandProgress"></div>
      <div class="button-row">
        <button class="primary" id="runSaveButton" type="button">${browserActive ? "Save in this browser" : "Choose folder and save"}</button>
        <button class="secondary" id="cancelCommandButton" type="button">Cancel</button>
      </div>
    </div>
  `;
}

function startBody(title, note) {
  return `
    <div class="form-grid">
      <div class="warning-box">${note} Starting this route replaces the current unsaved files and database unless you save first.</div>
      <div class="button-row">
        <button class="danger" id="startReplaceButton" type="button">Start and replace current</button>
        <button class="secondary" data-select-command="save-browser" type="button">Save first</button>
      </div>
      <div id="commandProgress"></div>
    </div>
  `;
}

function prBody(title, label, value) {
  return `
    <div class="form-grid">
      <div class="field">
        <label class="field-label" for="prInput">${label}</label>
        <input id="prInput" value="${value}">
      </div>
      <div class="info-box">${title} previews are temporary until saved. Export and ZIP download become available after the runtime is prepared.</div>
      <div id="commandProgress"></div>
      <div class="button-row">
        <button class="primary" id="runPrButton" type="button">Preview</button>
        <button class="secondary" type="button" data-select-command="library">Cancel</button>
      </div>
    </div>
  `;
}

function githubImportBody() {
  return `
    <div class="form-grid">
      <div class="${state.githubConnected ? "success-box" : "warning-box"}">${state.githubConnected ? "GitHub connected for this session. Token is still not stored after refresh." : "Connect a GitHub account to import public plugins, themes, or wp-content directories. The access token is not stored after refresh."}</div>
      <div class="button-row">
        <button class="${state.githubConnected ? "secondary" : "primary"}" id="connectGithubButton" type="button">${state.githubConnected ? "GitHub connected" : "Connect GitHub"}</button>
      </div>
      <div class="field">
        <label class="field-label" for="githubRepo">Repository source</label>
        <input id="githubRepo" value="wordpress/wordpress-playground-demo-plugin">
      </div>
      <div class="field">
        <label class="field-label" for="githubPath">Directory</label>
        <select id="githubPath">
          <option>plugin directory</option>
          <option>theme directory</option>
          <option>wp-content directory</option>
        </select>
      </div>
      <div class="warning-box">Import replaces the active wp-content area and keeps the resulting Playground temporary until saved.</div>
      <div id="commandProgress"></div>
      <div class="button-row">
        <button class="primary" id="runGithubImportButton" type="button">Import repository</button>
        <button class="secondary" data-select-command="zip-import" type="button">Use ZIP instead</button>
      </div>
    </div>
  `;
}

function blueprintUrlBody() {
  return `
    <div class="form-grid">
      <div class="field">
        <label class="field-label" for="blueprintUrl">Blueprint URL</label>
        <input id="blueprintUrl" value="https://playground.wordpress.net/blueprints/coffee-shop/blueprint.json">
      </div>
      <div class="info-box">Validation checks JSON schema, required steps, and compatible preferred PHP/WP versions before running.</div>
      <div id="commandProgress"></div>
      <div class="button-row">
        <button class="primary" id="runBlueprintUrlButton" type="button">Validate and run</button>
        <button class="secondary" data-select-command="blueprint" type="button">Open gallery</button>
      </div>
    </div>
  `;
}

function zipImportBody() {
  const fileLabel = state.zipFile || "No .zip selected";
  return `
    <div class="form-grid">
      <div class="field">
        <span class="field-label">Source selection</span>
        <div class="choice-row">
          <button class="secondary" id="chooseZipButton" type="button">Choose playground-wpcontent.zip</button>
          <button class="secondary" id="chooseBadZipButton" type="button">Choose invalid-notes.txt</button>
        </div>
      </div>
      <div class="${state.zipFile.endsWith(".txt") ? "error-box" : state.zipFile ? "success-box" : "info-box"}">Selected source: ${fileLabel}</div>
      <div class="warning-box">Replacement warning: importing a ZIP replaces current files and database for ${getActiveObject().title}. Save first if you need the current state.</div>
      <div id="commandProgress"></div>
      <div class="button-row">
        <button class="danger" id="runZipImportButton" type="button">Confirm replacement import</button>
        <button class="secondary" data-select-command="save-browser" type="button">Save before import</button>
      </div>
    </div>
  `;
}

function libraryBody() {
  return `
    <div class="form-grid">
      <div class="info-box">The rows below are the same active Playground objects shown in the shell. Opening, renaming, deleting, saving, or importing mutates this list.</div>
      <div class="button-row">
        <button class="primary" data-select-command="vanilla" type="button">Vanilla WordPress</button>
        <button class="secondary" data-select-command="wp-pr" type="button">WordPress PR</button>
        <button class="secondary" data-select-command="gutenberg-pr" type="button">Gutenberg PR</button>
        <button class="secondary" data-select-command="github-import" type="button">From GitHub</button>
        <button class="secondary" data-select-command="blueprint-url" type="button">Blueprint URL</button>
        <button class="secondary" data-select-command="zip-import" type="button">Import .zip</button>
      </div>
    </div>
  `;
}

function deleteCommandBody() {
  const saved = state.objects.filter((object) => object.storage === "Browser" || object.storage === "Local directory");
  return `
    <div class="form-grid">
      <div class="warning-box">Delete removes the saved browser/local record. If the active Playground is deleted, the browser falls back to a fresh unsaved Playground.</div>
      <div class="field">
        <label class="field-label" for="deleteTarget">Saved Playground</label>
        <select id="deleteTarget">
          ${saved.map((object) => `<option value="${object.id}">${object.title} - ${object.storage}</option>`).join("")}
        </select>
      </div>
      <div id="commandProgress"></div>
      <div class="button-row">
        <button class="danger" id="runDeleteCommandButton" type="button">Review delete confirmation</button>
        <button class="secondary" data-select-command="library" type="button">Cancel</button>
      </div>
    </div>
  `;
}

function settingsCommandBody() {
  return `
    <div class="form-grid">
      <div class="${getActiveObject().storage === "Temporary" ? "warning-box" : "info-box"}">${getActiveObject().storage === "Temporary" ? "Applying settings resets this unsaved Playground and destroys current files/database." : "Stored Playgrounds have limited configuration options and use Save & Reload."}</div>
      <div class="settings-grid">
        <div class="field"><label class="field-label">WordPress Version</label><select><option>latest</option><option>6.5</option><option>6.4</option></select></div>
        <div class="field"><label class="field-label">PHP Version</label><select><option>8.3</option><option>8.2</option><option>8.1</option></select></div>
        <div class="field"><label class="field-label">Language</label><select><option>English (United States)</option><option>Polish</option></select></div>
        <div class="field"><label class="field-label">Options</label><select><option>Network on / multisite off</option><option>Include older versions</option><option>Create multisite network</option></select></div>
      </div>
      <div id="commandProgress"></div>
      <div class="button-row">
        <button class="primary" id="applySettingsButton" type="button">${getActiveObject().storage === "Temporary" ? "Apply Settings & Reset Playground" : "Save & Reload"}</button>
      </div>
    </div>
  `;
}

function filesCommandBody() {
  return `
    <div class="form-grid">
      <div class="button-row">
        <button class="secondary" id="newFileButton" type="button">New File</button>
        <button class="secondary" id="newFolderButton" type="button">New Folder</button>
        <button class="secondary" id="uploadFileButton" type="button">Upload</button>
        <button class="secondary" id="browseFilesButton" type="button">Browse files</button>
      </div>
      ${fileBrowserMarkup()}
    </div>
  `;
}

function blueprintCommandBody() {
  return blueprintToolsMarkup(true);
}

function databaseCommandBody() {
  return `
    <div class="form-grid">
      <div class="info-box">Database management is an early access feature. WordPress Playground emulates MySQL using SQLite.</div>
      <div class="database-grid">
        <div><span class="meta-label">Driver</span><strong>MySQL emulation backed by SQLite</strong></div>
        <div><span class="meta-label">Size</span><strong id="dbSize">452 KB</strong></div>
        <div><span class="meta-label">SQLite path</span><strong>/wordpress/wp-content/database/.ht.sqlite</strong></div>
        <div><span class="meta-label">Current object</span><strong>${getActiveObject().title}</strong></div>
      </div>
      <div id="commandProgress"></div>
      <div class="button-row">
        <button class="primary" id="downloadDbButton" type="button">Download database.sqlite</button>
        <button class="secondary" id="openAdminerButton" type="button">Open Adminer</button>
        <button class="secondary" id="openPhpmyadminButton" type="button">Open phpMyAdmin</button>
      </div>
    </div>
  `;
}

function logsCommandBody() {
  return `
    <div class="form-grid">
      <div class="success-box">Playground log: runtime booted and preview available.</div>
      <div class="warning-box">WordPress log: REST request to /wp-json delayed 180 ms after ZIP validation.</div>
      <div class="info-box">PHP log: no fatal errors so far.</div>
      <div class="button-row">
        <button class="secondary" id="clearLogButton" type="button">Clear visible log</button>
      </div>
    </div>
  `;
}

function githubExportBody() {
  return `
    <div class="form-grid">
      <div class="${state.githubConnected ? "success-box" : "warning-box"}">${state.githubConnected ? "GitHub connected for this session." : "Connect GitHub before exporting. The token is not stored after refresh."}</div>
      <div class="field">
        <label class="field-label" for="exportRepo">Repository</label>
        <input id="exportRepo" value="my-org/playground-export">
      </div>
      <div class="field">
        <label class="field-label" for="exportBranch">Branch</label>
        <input id="exportBranch" value="playground/${slugFromTitle(getActiveObject().title)}">
      </div>
      <div id="commandProgress"></div>
      <div class="button-row">
        <button class="primary" id="runGithubExportButton" type="button">${state.githubConnected ? "Export to GitHub" : "Connect and export"}</button>
      </div>
    </div>
  `;
}

function downloadZipBody() {
  return `
    <div class="form-grid">
      <div class="info-box">Packages WordPress files, wp-content, blueprint.json, and the SQLite database into one archive.</div>
      <div class="database-grid">
        <div><span class="meta-label">Source</span><strong>${getActiveObject().title}</strong></div>
        <div><span class="meta-label">Storage</span><strong>${storageLabel(getActiveObject().storage)}</strong></div>
      </div>
      <div id="commandProgress"></div>
      <div class="button-row">
        <button class="primary" id="runZipDownloadButton" type="button">Generate playground.zip</button>
      </div>
    </div>
  `;
}

function databaseDownloadBody() {
  return databaseCommandBody();
}

function bindCommandBody(id) {
  document.querySelectorAll("[data-select-command]").forEach((button) => {
    button.addEventListener("click", () => selectCommand(button.dataset.selectCommand));
  });

  const bind = (selector, handler) => {
    const node = document.querySelector(selector);
    if (node) node.addEventListener("click", handler);
  };

  bind("#runSaveButton", () => runSave(id === "save-local" ? "local" : "browser"));
  bind("#cancelCommandButton", () => {
    addHistory("Save cancelled", "No storage identity changed");
    setMutation("Save cancelled. Playground remains in its previous storage state.");
  });
  bind("#startReplaceButton", () => runReplacementStart("Vanilla WordPress"));
  bind("#runPrButton", () => runPrPreview(id));
  bind("#connectGithubButton", () => {
    state.githubConnected = true;
    addHistory("GitHub connected", "Session token available until refresh");
    renderCommand();
  });
  bind("#runGithubImportButton", runGithubImport);
  bind("#runBlueprintUrlButton", () => runBlueprint("Blueprint URL"));
  bind("#chooseZipButton", () => {
    state.zipFile = "playground-wpcontent.zip";
    renderCommand();
  });
  bind("#chooseBadZipButton", () => {
    state.zipFile = "invalid-notes.txt";
    renderCommand();
  });
  bind("#runZipImportButton", runZipImport);
  bind("#runDeleteCommandButton", () => {
    const select = document.getElementById("deleteTarget");
    if (select && select.value) openDeleteModal(select.value);
  });
  bind("#applySettingsButton", runSettings);
  bind("#newFileButton", () => addHistory("File created", "/wordpress/wp-content/new-playground-file.php created"));
  bind("#newFolderButton", () => addHistory("Folder created", "/wordpress/wp-content/playground-assets created"));
  bind("#uploadFileButton", () => addHistory("Upload complete", "theme-helper.php uploaded to wp-content"));
  bind("#browseFilesButton", () => addHistory("Browse files opened", "Native file chooser available"));
  bind("#fileEditor", () => {});
  const fileEditor = document.getElementById("fileEditor");
  if (fileEditor) fileEditor.addEventListener("input", () => {
    state.fileDirty = true;
    renderManager();
    renderCommand();
  });
  bind("#saveFileButton", runFileSave);
  bind("#validateBlueprintButton", () => {
    state.blueprintDirty = false;
    addHistory("Blueprint validated", "blueprint.json schema valid / preferred PHP 8.3");
    setMutation("Blueprint validation passed.");
  });
  bind("#copyBlueprintButton", () => addHistory("Blueprint link copied", "Shareable blueprint URL copied to clipboard"));
  bind("#downloadBlueprintButton", () => addHistory("Blueprint bundle downloaded", "blueprint-bundle.zip generated"));
  bind("#runBlueprintButton", () => runBlueprint("Coffee Shop Blueprint"));
  bind("#downloadDbButton", runDatabaseDownload);
  bind("#openAdminerButton", () => addHistory("Adminer opened", "Database tool opened in a new Playground panel"));
  bind("#openPhpmyadminButton", () => addHistory("phpMyAdmin opened", "Database tool opened in a new Playground panel"));
  bind("#clearLogButton", () => {
    addHistory("Visible logs cleared", "New Playground, WordPress, and PHP events will appear here");
    renderCommand();
  });
  bind("#runGithubExportButton", runGithubExport);
  bind("#runZipDownloadButton", runZipDownload);

  document.querySelectorAll("[data-blueprint-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedBlueprintCategory = button.dataset.blueprintCategory;
      renderCommand();
      renderManager();
    });
  });
  document.querySelectorAll("[data-run-blueprint]").forEach((button) => {
    button.addEventListener("click", () => runBlueprint(button.dataset.runBlueprint));
  });
  const blueprintEditor = document.getElementById("blueprintEditor");
  if (blueprintEditor) blueprintEditor.addEventListener("input", () => {
    state.blueprintDirty = true;
    setMutation("Blueprint editor has unsaved JSON changes. Validate before running.");
  });
}

function runSave(destination) {
  const name = document.getElementById("saveName").value.trim() || "Saved Playground";
  const browser = destination === "browser";
  runProgress(
    browser ? "Saving 3028 / 3751 files" : "Requesting folder permission",
    browser ? ["Saving 3028 / 3751 files", "Saving database.sqlite", "Creating browser slug", "Saved in browser"] : ["Folder permission granted", "Writing 3028 / 3751 files", "Writing database.sqlite", "Saved to local directory"],
    () => {
      const active = getActiveObject();
      active.title = name;
      active.storage = browser ? "Browser" : "Local directory";
      active.meta = browser
        ? `Saved in this browser / slug ${slugFromTitle(name)} / Save & Reload enabled`
        : `~/Sites/${slugFromTitle(name)} / folder permission granted`;
      active.active = true;
      if (!state.objects.some((object) => object.storage === "Temporary")) {
        state.objects.unshift({
          id: `unsaved-${Date.now()}`,
          title: "Unsaved Playground",
          storage: "Temporary",
          meta: "Available scratch Playground / lost on refresh",
          active: false
        });
      }
      state.path = browser ? `/${slugFromTitle(name)}/` : state.path;
      state.slug = slugFromTitle(name);
      addHistory(
        browser ? "Saved in this browser" : "Saved to local directory",
        browser ? `${name} is now browser-backed and addressable by slug` : `${name} is stored in ~/Sites/${slugFromTitle(name)}`
      );
      setPreview("Saved Playground", `${name} is now durable. Settings use Save & Reload instead of destructive reset.`, browser ? "Browser-backed identity" : "Local directory identity");
      setMutation(`${name} saved. Shell identity, storage badge, object row, and settings consequence updated.`);
      renderAll();
    }
  );
}

function runReplacementStart(label) {
  runProgress(
    "Preparing fresh WordPress",
    ["Confirming replacement", "Resetting files and database", "Preparing WordPress", "Fresh Playground ready"],
    () => {
      const active = getActiveObject();
      active.title = label;
      active.storage = "Temporary";
      active.meta = "Fresh unsaved runtime / lost on refresh";
      state.path = "/hello-from-playground/";
      setPreview(label, "A fresh WordPress runtime replaced the previous unsaved files and database.", "Replacement complete");
      addHistory("Fresh Playground started", `${label} replaced the active runtime`);
      renderAll();
    }
  );
}

function runPrPreview(id) {
  const value = document.getElementById("prInput").value.trim();
  const label = id === "gutenberg-pr" ? "Gutenberg Preview" : "WordPress PR Preview";
  runProgress(
    "Validating preview source",
    ["Validating input", "Fetching patch metadata", "Building runtime", "Preview ready"],
    () => {
      const active = getActiveObject();
      active.title = `${label}: ${value}`;
      active.storage = "Temporary";
      active.meta = "Temporary PR preview / save or export to keep it";
      state.path = "/wp-admin/";
      setPreview(active.title, "The preview runtime is ready in WP Admin and can now be saved or exported.", "PR preview ready");
      addHistory(`${label} ready`, value);
      renderAll();
    }
  );
}

function runGithubImport() {
  if (!state.githubConnected) {
    state.githubConnected = true;
    addHistory("GitHub connected", "Session token available until refresh");
  }
  const repo = document.getElementById("githubRepo").value.trim() || "wordpress/demo";
  runProgress(
    "Reading repository",
    ["Authenticating session", "Selecting source directory", "Replacing wp-content", "GitHub import ready"],
    () => {
      const active = getActiveObject();
      active.title = `GitHub Import: ${repo.split("/").pop()}`;
      active.storage = "GitHub import";
      active.meta = `${repo} / temporary until saved / token not stored`;
      state.path = "/wp-admin/plugins.php";
      setPreview(active.title, "Repository contents replaced the current wp-content directory. Save to keep this imported state.", "GitHub import complete");
      addHistory("GitHub import complete", `${repo} imported into active Playground`);
      renderAll();
    }
  );
}

function runZipImport() {
  if (!state.zipFile) {
    state.zipFile = "playground-wpcontent.zip";
    renderCommand();
  }

  if (state.zipFile.endsWith(".txt")) {
    runProgress(
      "Validating archive",
      ["Checking selected source", "Archive validation failed"],
      () => {
        setCommandState("Validation failed", "red");
        addHistory("ZIP import failed", "invalid-notes.txt is not a .zip archive");
        setMutation("ZIP import failed validation. Active Playground was not replaced.");
      }
    );
    return;
  }

  runProgress(
    "Validating archive",
    ["Checking ZIP structure", "Replacement confirmed", "Importing files and database", "ZIP import complete"],
    () => {
      const active = getActiveObject();
      active.title = "ZIP Import Playground";
      active.storage = "Imported zip";
      active.meta = "playground-wpcontent.zip / temporary imported result / save to keep";
      state.path = "/wp-admin/";
      setPreview("ZIP Import Playground", "The uploaded archive replaced the active files and database. The imported result is temporary until saved.", "Replacement import complete");
      addHistory("ZIP import replaced active Playground", "playground-wpcontent.zip imported successfully");
      setMutation("ZIP import completed. Active identity, path, storage badge, preview, object row, and history now show the imported Playground.");
      renderAll();
    }
  );
}

function runBlueprint(source) {
  runProgress(
    "Validating Blueprint",
    ["Schema valid", "Replacement warning acknowledged", "Running Blueprint steps", "Blueprint result ready"],
    () => {
      const active = getActiveObject();
      active.title = source;
      active.storage = "Temporary";
      active.meta = "Blueprint result / temporary until saved";
      state.path = "/hello-from-playground/";
      setPreview(source, "Blueprint steps completed and replaced the active site content.", "Blueprint run complete");
      addHistory("Blueprint run complete", source);
      renderAll();
    }
  );
}

function runSettings() {
  const stored = getActiveObject().storage !== "Temporary";
  runProgress(
    stored ? "Saving runtime settings" : "Resetting Playground",
    stored ? ["Saving settings", "Reloading WordPress", "Runtime updated"] : ["Confirming destructive reset", "Resetting files and database", "Runtime updated"],
    () => {
      state.runtime = "WP latest / PHP 8.3";
      setPreview(stored ? "Saved Playground reloaded" : "Playground reset", stored ? "Stored settings were saved and WordPress reloaded." : "Temporary settings reset the current files and database.", stored ? "Save & Reload complete" : "Destructive reset complete");
      addHistory(stored ? "Save & Reload complete" : "Settings reset complete", state.runtime);
      renderAll();
    }
  );
}

function runFileSave() {
  runProgress(
    "Saving wp-config.php",
    ["Writing file", "Checking syntax", "File saved"],
    () => {
      state.fileDirty = false;
      addHistory("File saved", "/wordpress/wp-config.php updated");
      setMutation("File editor dirty state cleared and saved result recorded.");
      renderAll();
    }
  );
}

function runDatabaseDownload() {
  runProgress(
    "Preparing database.sqlite",
    ["Reading /wordpress/wp-content/database/.ht.sqlite", "Packaging database.sqlite", "Download ready"],
    () => {
      addHistory("database.sqlite downloaded", "452 KB SQLite database exported");
      setMutation("Database download completed and recorded in transfer history.");
      setCommandState("Downloaded", "green");
      renderHistory();
    }
  );
}

function runGithubExport() {
  if (!state.githubConnected) state.githubConnected = true;
  const repo = document.getElementById("exportRepo").value.trim() || "my-org/playground-export";
  runProgress(
    "Exporting to GitHub",
    ["Authenticating session", "Creating branch", "Pushing wp-content and blueprint", "GitHub export complete"],
    () => {
      addHistory("GitHub export complete", `${getActiveObject().title} pushed to ${repo}`);
      setMutation("GitHub export completed. Transfer history shows repository and active source.");
      setCommandState("Exported", "green");
      renderHistory();
      renderCommand();
    }
  );
}

function runZipDownload() {
  runProgress(
    "Generating archive",
    ["Collecting WordPress files", "Adding SQLite database", "Writing playground.zip", "Download ready"],
    () => {
      addHistory("playground.zip generated", `${getActiveObject().title} packaged for download`);
      setMutation("ZIP download generated and recorded in transfer history.");
      setCommandState("Generated", "green");
      renderHistory();
    }
  );
}

function runProgress(initial, steps, done) {
  const progress = document.getElementById("commandProgress");
  if (!progress) return;
  let index = 0;
  setCommandState("Running", "blue");
  progress.innerHTML = progressMarkup(8, initial);
  const timer = setInterval(() => {
    index += 1;
    const percent = Math.min(100, Math.round((index / steps.length) * 100));
    progress.innerHTML = progressMarkup(percent, steps[Math.min(index - 1, steps.length - 1)]);
    if (index >= steps.length) {
      clearInterval(timer);
      setCommandState("Complete", "green");
      done();
    }
  }, 480);
}

function progressMarkup(percent, label) {
  return `
    <div class="progress">
      <div class="progress-track"><div class="progress-bar" style="--progress:${percent}%"></div></div>
      <span class="progress-label">${label}</span>
    </div>
  `;
}

function setCommandState(label, kind) {
  els.commandState.textContent = label;
  els.commandState.className = `status-pill ${kind}`;
}

function setPath(path, eventTitle) {
  state.path = path.startsWith("/") ? path : `/${path}`;
  if (state.path === "/wp-admin/") {
    setPreview("WordPress Admin Dashboard", "The embedded browser is now in WP Admin while Playground controls remain available.", "WP Admin");
  } else {
    setPreview("Hello from WordPress Playground!", "The embedded browser returned to the public homepage.", "Homepage");
  }
  addHistory(eventTitle, state.path);
  renderShell();
}

function setPreview(title, text, kicker) {
  els.previewTitle.innerHTML = `${escapeHtml(title).replace("WordPress", "<span>WordPress</span>")}`;
  els.previewText.textContent = text;
  els.previewKicker.textContent = kicker;
  els.previewNote.textContent = state.storage === "Temporary" ? "Temporary state: save before refresh if you need this result." : "Saved state: use Save & Reload for runtime changes.";
}

function setMutation(message) {
  els.mutationStatus.textContent = message;
}

function renderObjects() {
  els.objectList.innerHTML = "";
  state.objects.forEach((object) => {
    const row = document.createElement("div");
    row.className = `object-row ${object.id === state.activeObjectId ? "active" : ""}`;
    row.innerHTML = `
      <span class="object-icon">W</span>
      <span>
        <span class="object-title">${object.title}</span>
        <span class="object-meta">${object.meta}</span>
        <span class="badge ${storageClass(object.storage)}">${storageLabel(object.storage)}</span>
      </span>
      <span class="object-actions">
        <button class="secondary small" data-open-object="${object.id}" type="button">Open</button>
        <button class="secondary small" data-manage-object="${object.id}" type="button">Manage</button>
        <button class="secondary small" data-rename-object="${object.id}" type="button">Rename</button>
        ${object.storage === "Browser" || object.storage === "Local directory" ? `<button class="danger small" data-delete-object="${object.id}" type="button">Delete</button>` : ""}
      </span>
    `;
    els.objectList.appendChild(row);
  });

  document.querySelectorAll("[data-open-object]").forEach((button) => {
    button.addEventListener("click", () => openObject(button.dataset.openObject));
  });
  document.querySelectorAll("[data-manage-object]").forEach((button) => {
    button.addEventListener("click", () => {
      openObject(button.dataset.manageObject);
      selectCommand("files");
    });
  });
  document.querySelectorAll("[data-rename-object]").forEach((button) => openRenameModalOn(button, button.dataset.renameObject));
  document.querySelectorAll("[data-delete-object]").forEach((button) => {
    button.addEventListener("click", () => openDeleteModal(button.dataset.deleteObject));
  });
}

function openRenameModalOn(button, id) {
  button.addEventListener("click", () => openRenameModal(id));
}

function openObject(id) {
  state.objects.forEach((object) => {
    object.active = object.id === id;
  });
  state.activeObjectId = id;
  const active = getActiveObject();
  state.title = active.title;
  state.storage = active.storage;
  state.path = active.storage === "Temporary" ? "/hello-from-playground/" : `/${slugFromTitle(active.title)}/`;
  setPreview(active.title, "This Playground object is now active in the live browser.", "Object opened");
  addHistory("Opened Playground", active.title);
  renderAll();
}

function openRenameModal(id) {
  const object = state.objects.find((item) => item.id === id);
  if (!object) return;
  openModal(`
    <h2>Rename Playground</h2>
    <p>Renaming updates the saved row, shell title, and slug preview for the active object.</p>
    <div class="field">
      <label class="field-label" for="renameInput">Name</label>
      <input id="renameInput" value="${object.title}">
    </div>
    <div class="button-row">
      <button class="primary" id="confirmRenameButton" type="button">Rename</button>
      <button class="secondary" id="closeModalButton" type="button">Cancel</button>
    </div>
  `);
  document.getElementById("confirmRenameButton").addEventListener("click", () => {
    const next = document.getElementById("renameInput").value.trim() || object.title;
    object.title = next;
    object.meta = object.storage === "Browser" ? `Saved in this browser / slug ${slugFromTitle(next)} / Save & Reload enabled` : object.meta;
    if (id === state.activeObjectId) state.path = object.storage === "Temporary" ? state.path : `/${slugFromTitle(next)}/`;
    closeModal();
    addHistory("Playground renamed", next);
    setMutation("Rename complete. Shell title, saved row, and slug preview updated.");
    renderAll();
  });
  document.getElementById("closeModalButton").addEventListener("click", closeModal);
}

function openDeleteModal(id) {
  const object = state.objects.find((item) => item.id === id);
  if (!object) return;
  openModal(`
    <h2>Delete saved Playground</h2>
    <p><strong>${object.title}</strong> will be removed from saved management. This cannot be undone in this static flow.</p>
    <div class="warning-box">If this is the active Playground, the live browser falls back to a fresh Unsaved Playground.</div>
    <div id="modalProgress"></div>
    <div class="button-row">
      <button class="danger" id="confirmDeleteButton" type="button">Confirm delete</button>
      <button class="secondary" id="closeModalButton" type="button">Cancel</button>
    </div>
  `);
  document.getElementById("closeModalButton").addEventListener("click", () => {
    addHistory("Delete cancelled", object.title);
    closeModal();
  });
  document.getElementById("confirmDeleteButton").addEventListener("click", () => {
    const progress = document.getElementById("modalProgress");
    progress.innerHTML = progressMarkup(55, "Deleting saved record");
    setTimeout(() => {
      state.objects = state.objects.filter((item) => item.id !== id);
      if (state.activeObjectId === id) {
        ensureUnsavedFallback();
      }
      closeModal();
      addHistory("Saved Playground deleted", object.title);
      setMutation("Delete complete. Saved row removed and active fallback applied if needed.");
      renderAll();
    }, 700);
  });
}

function ensureUnsavedFallback() {
  let fallback = state.objects.find((item) => item.storage === "Temporary");
  if (!fallback) {
    fallback = {
      id: `unsaved-${Date.now()}`,
      title: "Unsaved Playground",
      storage: "Temporary",
      meta: "Fresh fallback after deleting active saved Playground.",
      active: false
    };
    state.objects.unshift(fallback);
  }
  state.objects.forEach((object) => {
    object.active = object.id === fallback.id;
  });
  state.activeObjectId = fallback.id;
  state.path = "/hello-from-playground/";
  setPreview("Unsaved Playground", "A fresh temporary Playground is active after deletion.", "Fallback active");
}

function renderManager() {
  const tab = state.selectedManagerTab;
  const body = {
    settings: settingsManagerMarkup(),
    files: fileBrowserMarkup(),
    blueprint: blueprintToolsMarkup(false),
    database: databaseManagerMarkup(),
    logs: logsManagerMarkup()
  }[tab];
  els.managerBody.innerHTML = body;
  bindManagerBody();
}

function settingsManagerMarkup() {
  return `
    <div class="manager-layout">
      <div class="${getActiveObject().storage === "Temporary" ? "warning-box" : "info-box"}">${getActiveObject().storage === "Temporary" ? "Unsaved settings reset the current Playground." : "Stored Playground settings save and reload."}</div>
      <div class="settings-grid">
        <div><span class="meta-label">WordPress</span><strong>latest</strong></div>
        <div><span class="meta-label">PHP</span><strong>8.3</strong></div>
        <div><span class="meta-label">Language</span><strong>English (United States)</strong></div>
        <div><span class="meta-label">Network</span><strong>Allowed / multisite off</strong></div>
      </div>
      <button class="primary small" data-select-command="settings" type="button">${getActiveObject().storage === "Temporary" ? "Apply Settings & Reset" : "Save & Reload"}</button>
    </div>
  `;
}

function fileBrowserMarkup() {
  return `
    <div class="file-shell">
      <div class="file-tree">
        <button class="active" type="button">/wordpress/wp-config.php</button>
        <button type="button">/wordpress/wp-content</button>
        <button type="button">/wordpress/wp-admin</button>
        <button type="button">/wordpress/wp-includes</button>
        <button type="button">/wordpress/readme.html</button>
      </div>
      <div class="editor">
        <div class="editor-head">
          <strong>wp-config.php</strong>
          <span class="badge ${state.fileDirty ? "amber" : "green"}">${state.fileDirty ? "Dirty" : "Saved"}</span>
        </div>
        <textarea class="code-area" id="fileEditor">define( 'DB_NAME', 'database_name_here' );
define( 'DB_USER', 'username_here' );
define( 'DB_PASSWORD', 'password_here' );
define( 'DB_HOST', 'localhost' );
define( 'WP_DEBUG', false );</textarea>
        <div class="editor-actions">
          <span class="object-meta">Create file, create folder, upload, and browse actions are available above.</span>
          <button class="primary small" id="saveFileButton" type="button">Save file</button>
        </div>
      </div>
    </div>
  `;
}

function blueprintToolsMarkup(includeIntro) {
  const cats = ["All", "Featured", "Website", "Personal", "Content", "Themes", "Gutenberg", "Experiments", "WooCommerce", "News"];
  const filtered = state.selectedBlueprintCategory === "All" || state.selectedBlueprintCategory === "Featured"
    ? blueprints
    : blueprints.filter((item) => item.category === state.selectedBlueprintCategory);
  return `
    <div class="form-grid">
      ${includeIntro ? `<div class="info-box">Representative subset shown: 6 of the current 43 Blueprint gallery entries. Categories match the captured gallery.</div>` : `<div class="info-box">Blueprint gallery: 43 available, 6 representative entries shown here.</div>`}
      <div class="chip-row">
        ${cats.map((cat) => `<button class="filter-chip ${state.selectedBlueprintCategory === cat ? "active" : ""}" data-blueprint-category="${cat}" type="button">${cat}</button>`).join("")}
      </div>
      <div class="blueprint-grid">
        ${filtered.map((item) => `
          <button class="blueprint-card" data-run-blueprint="${item.title}" type="button">
            <span class="blueprint-thumb ${item.className}"></span>
            <strong>${item.title}</strong>
            <span>${item.desc}</span>
          </button>
        `).join("") || `<div class="empty">No representative entries in this static subset for ${state.selectedBlueprintCategory}.</div>`}
      </div>
      <div class="field">
        <label class="field-label" for="blueprintEditor">blueprint.json</label>
        <textarea id="blueprintEditor">{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "landingPage": "/hello-from-playground/",
  "preferredVersions": { "php": "8.3", "wp": "latest" }
}</textarea>
      </div>
      <div id="commandProgress"></div>
      <div class="button-row">
        <button class="secondary" id="validateBlueprintButton" type="button">Validate</button>
        <button class="secondary" id="copyBlueprintButton" type="button">Copy link</button>
        <button class="secondary" id="downloadBlueprintButton" type="button">Download bundle</button>
        <button class="primary" id="runBlueprintButton" type="button">Run Blueprint</button>
      </div>
    </div>
  `;
}

function databaseManagerMarkup() {
  return `
    <div class="manager-layout">
      <div class="database-grid">
        <div><span class="meta-label">Driver</span><strong>MySQL emulation backed by SQLite</strong></div>
        <div><span class="meta-label">Size</span><strong>452 KB</strong></div>
        <div><span class="meta-label">Path</span><strong>/wordpress/wp-content/database/.ht.sqlite</strong></div>
        <div><span class="meta-label">Tools</span><strong>Adminer / phpMyAdmin</strong></div>
      </div>
      <div class="button-row">
        <button class="primary small" data-select-command="download-db" type="button">Download database.sqlite</button>
        <button class="secondary small" type="button">Open Adminer</button>
        <button class="secondary small" type="button">Open phpMyAdmin</button>
      </div>
    </div>
  `;
}

function logsManagerMarkup() {
  return `
    <div class="manager-layout">
      <div class="success-box">Playground: boot completed for ${getActiveObject().title}.</div>
      <div class="warning-box">WordPress: delayed REST response after last command.</div>
      <div class="info-box">PHP: no fatal errors.</div>
    </div>
  `;
}

function bindManagerBody() {
  document.querySelectorAll("[data-select-command]").forEach((button) => {
    button.addEventListener("click", () => selectCommand(button.dataset.selectCommand));
  });
  document.querySelectorAll("[data-blueprint-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedBlueprintCategory = button.dataset.blueprintCategory;
      renderManager();
      if (state.selectedCommand === "blueprint") renderCommand();
    });
  });
  document.querySelectorAll("[data-run-blueprint]").forEach((button) => {
    button.addEventListener("click", () => runBlueprint(button.dataset.runBlueprint));
  });
  const editor = document.getElementById("fileEditor");
  if (editor) editor.addEventListener("input", () => {
    state.fileDirty = true;
    renderManager();
    if (state.selectedCommand === "files") renderCommand();
  });
  const saveFile = document.getElementById("saveFileButton");
  if (saveFile) saveFile.addEventListener("click", runFileSave);
  ["validateBlueprintButton", "copyBlueprintButton", "downloadBlueprintButton", "runBlueprintButton"].forEach((id) => {
    const node = document.getElementById(id);
    if (!node) return;
    if (id === "validateBlueprintButton") node.addEventListener("click", () => addHistory("Blueprint validated", "blueprint.json schema valid"));
    if (id === "copyBlueprintButton") node.addEventListener("click", () => addHistory("Blueprint link copied", "Shareable URL copied"));
    if (id === "downloadBlueprintButton") node.addEventListener("click", () => addHistory("Blueprint bundle downloaded", "blueprint-bundle.zip generated"));
    if (id === "runBlueprintButton") node.addEventListener("click", () => runBlueprint("Blueprint editor result"));
  });
}

function renderHistory() {
  els.transferHistory.innerHTML = state.history
    .slice(0, 8)
    .map((item) => `<li><strong>${item.title}</strong><span>${item.meta}</span></li>`)
    .join("");
}

function addHistory(title, meta) {
  state.history.unshift({ title, meta });
  renderHistory();
}

function getActiveObject() {
  return state.objects.find((object) => object.id === state.activeObjectId) || state.objects[0];
}

function slugFromTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "playground";
}

function openModal(content) {
  closeModal();
  const wrap = document.createElement("div");
  wrap.className = "modal-backdrop";
  wrap.id = "modalBackdrop";
  wrap.innerHTML = `<div class="modal">${content}</div>`;
  document.body.appendChild(wrap);
}

function closeModal() {
  const current = document.getElementById("modalBackdrop");
  if (current) current.remove();
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}
