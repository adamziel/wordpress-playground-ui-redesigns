const state = {
  mode: "create",
  selectedCommand: "zip-import",
  selectedId: "temp",
  activeId: "temp",
  path: "/hello-from-playground/",
  saveDestination: "browser",
  folderPermission: "none",
  folderPath: "",
  githubConnected: false,
  exportConnected: false,
  selectedBlueprint: "Art Gallery",
  blueprintFilter: "All",
  objects: [
    {
      id: "temp",
      name: "Unsaved Playground",
      storage: "temporary",
      state: "temporary",
      source: "Vanilla WordPress",
      runtime: "WP latest / PHP 8.3",
      detail: "Temporary session. Lost on refresh or close unless saved.",
      result: "Ready at /hello-from-playground/.",
      updated: "Now"
    },
    {
      id: "research",
      name: "Research Browser Playground",
      storage: "browser",
      state: "saved",
      source: "Browser storage",
      runtime: "WP latest / PHP 8.3",
      detail: "Browser-backed slug /research-browser-playground/.",
      result: "Saved in this browser.",
      updated: "May 21, 2026"
    },
    {
      id: "local-shop",
      name: "Coffee Shop Local Copy",
      storage: "local",
      state: "local permission",
      source: "Local directory",
      runtime: "WP latest / PHP 8.3",
      detail: "~/Sites/playground-coffee-shop. Reconnect permission after reload.",
      result: "Folder permission needed after refresh.",
      updated: "Yesterday"
    },
    {
      id: "exported",
      name: "Plugin QA Export",
      storage: "browser",
      state: "exported",
      source: "GitHub export",
      runtime: "WP 6.8.2 / PHP 8.2",
      detail: "Exported to acme/plugin-qa-playground.",
      result: "GitHub export completed at commit 8f34c2a.",
      updated: "May 19, 2026"
    }
  ],
  history: [
    "Temporary Playground opened at /hello-from-playground/.",
    "SQLite database ready at /wordpress/wp-content/database/.ht.sqlite."
  ],
  logs: {
    playground: [
      ["INFO", "Booted WordPress latest with PHP 8.3."],
      ["WARN", "Network access enabled for remote assets."]
    ],
    wordpress: [
      ["INFO", "No WordPress fatal errors so far."],
      ["WARN", "Theme stylesheet requested a remote font; cached response used."]
    ],
    php: [
      ["INFO", "PHP 8.3 runtime initialized."],
      ["ERROR", "Notice handled in sample-plugin.php on line 42."]
    ]
  }
};

const commands = [
  {
    id: "vanilla",
    group: "Create",
    label: "Start Vanilla WordPress",
    hint: "Fresh latest install, logged in as admin.",
    keywords: "create start fresh vanilla wordpress"
  },
  {
    id: "wordpress-pr",
    group: "Create",
    label: "Preview WordPress PR",
    hint: "Use a PR number or wordpress-develop pull request URL.",
    keywords: "wordpress pr preview pull request"
  },
  {
    id: "gutenberg-pr",
    group: "Create",
    label: "Preview Gutenberg PR or branch",
    hint: "Accepts PR number, URL, or branch name.",
    keywords: "gutenberg pr branch preview"
  },
  {
    id: "github-import",
    group: "Create",
    label: "Import from GitHub",
    hint: "Connect account; token is not stored after refresh.",
    keywords: "github import connect repository plugin theme wp-content"
  },
  {
    id: "blueprint-url",
    group: "Create",
    label: "Run Blueprint URL",
    hint: "Validate a blueprint URL, then warn before replacing.",
    keywords: "blueprint url run validate"
  },
  {
    id: "zip-import",
    group: "Transfer",
    label: "Import .zip over current",
    hint: "Choose archive, validate, warn, import, update identity.",
    keywords: "zip import archive replacement current files database"
  },
  {
    id: "save-browser",
    group: "Save",
    label: "Save in this browser",
    hint: "Create a browser slug and saved row.",
    keywords: "save browser storage slug"
  },
  {
    id: "save-local",
    group: "Save",
    label: "Save to a local directory",
    hint: "Folder picker, permission, local identity.",
    keywords: "save local directory folder permission"
  },
  {
    id: "files",
    group: "Manage",
    label: "Open file browser",
    hint: "Create file, create folder, upload, browse, edit, save.",
    keywords: "files file browser upload editor dirty save"
  },
  {
    id: "database",
    group: "Manage",
    label: "Inspect SQLite database",
    hint: "Download database.sqlite, Adminer, phpMyAdmin.",
    keywords: "database sqlite adminer phpmyadmin download"
  },
  {
    id: "zip-download",
    group: "Transfer",
    label: "Download active Playground as .zip",
    hint: "Package files, uploads, Blueprint, and database.",
    keywords: "download zip export package"
  },
  {
    id: "github-export",
    group: "Transfer",
    label: "Export to GitHub",
    hint: "Connect account and push the active Playground.",
    keywords: "github export repository push"
  },
  {
    id: "wp-admin",
    group: "Shell",
    label: "Open WP Admin",
    hint: "Navigate the embedded site to /wp-admin/.",
    keywords: "wp admin dashboard path"
  },
  {
    id: "homepage",
    group: "Shell",
    label: "Open Homepage",
    hint: "Navigate the embedded site to /.",
    keywords: "home homepage path"
  }
];

const blueprints = [
  ["Art Gallery", "Website", "Personal", "An art gallery created with the Vue theme.", "gallery"],
  ["Coffee Shop", "WooCommerce", "Featured", "A stylized WooCommerce coffee shop storefront.", "coffee"],
  ["Feed Reader with the Friends Plugin", "Content", "Featured", "Read feeds from the web in Playground with the Friends plugin.", "feed"],
  ["Gaming News", "News", "Website", "A gaming news site created with the Spiel theme.", "news"],
  ["Non-profit Organization", "Website", "Featured", "A non-profit organization site created with the Koinonia theme.", "nonprofit"],
  ["Personal Blog", "Personal", "Content", "A personal blog created with the Substrata theme.", "blog"],
  ["Mini Store", "WooCommerce", "Website", "A compact product catalog with cart and checkout.", "shop"],
  ["Gutenberg Experiments", "Gutenberg", "Experiments", "Editor API experiments and demo blocks.", "gutenberg"]
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function activeObject() {
  return state.objects.find((item) => item.id === state.activeId) || state.objects[0];
}

function selectedObject() {
  return state.objects.find((item) => item.id === state.selectedId) || activeObject();
}

function objectById(id) {
  return state.objects.find((item) => item.id === id);
}

function badgeClass(value) {
  if (["saved", "browser", "exported"].includes(value)) return "blue";
  if (["local", "imported", "ok"].includes(value)) return "ok";
  if (["temporary", "saving", "local permission"].includes(value)) return "warn";
  if (["deleted", "failed"].includes(value)) return "bad";
  return "";
}

function storageLabel(storage) {
  if (storage === "temporary") return "Temporary";
  if (storage === "browser") return "Saved in browser";
  if (storage === "local") return "Local directory";
  return storage;
}

function stateLabel(value) {
  return value.split(" ").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function addHistory(message) {
  state.history.unshift(message);
  state.history = state.history.slice(0, 9);
  renderHistory();
}

function updateShell() {
  const active = activeObject();
  $("#shellTitle").textContent = active.name;
  $("#shellSub").textContent = active.detail;
  $("#storageBadge").textContent = storageLabel(active.storage);
  $("#storageBadge").className = `badge ${badgeClass(active.storage)}`;
  $("#pathInput").value = state.path;
  $("#previewUrl").textContent = `playground.local${state.path}`;
  $("#previewStatus").textContent = stateLabel(active.state);
  $("#settingsConsequence").textContent = active.storage === "temporary"
    ? "Temporary Playgrounds reset destructively. Save before applying settings if you need this runtime."
    : "Stored Playgrounds have limited configuration options and use Save and Reload.";
}

function updateDetail() {
  const item = selectedObject();
  $("#detailTitle").textContent = item.name;
  $("#detailState").textContent = stateLabel(item.state);
  $("#detailState").className = `badge ${badgeClass(item.state)}`;
  $("#detailSource").textContent = item.source;
  $("#detailRuntime").textContent = item.runtime;
  $("#detailStorage").textContent = item.detail;
  $("#detailResult").textContent = item.result;
}

function renderHistory() {
  $("#historyList").innerHTML = state.history.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  $("#historyCount").textContent = `${state.history.length} events`;
}

function rowHtml(item, context) {
  const canDelete = item.storage !== "temporary" || item.state === "imported" || item.state === "saved" || item.state === "local permission";
  return `
    <tr class="${item.id === state.selectedId ? "active" : ""} ${item.state === "deleted" ? "deleted" : ""}">
      <td><strong>${escapeHtml(item.name)}</strong><br><span>${escapeHtml(item.detail)}</span></td>
      <td><span class="badge ${badgeClass(item.storage)}">${escapeHtml(storageLabel(item.storage))}</span></td>
      <td><span class="badge ${badgeClass(item.state)}">${escapeHtml(stateLabel(item.state))}</span></td>
      <td>${escapeHtml(context === "library" ? item.updated : item.source)}</td>
      <td>
        <div class="rowActions">
          <button type="button" data-select-object="${escapeHtml(item.id)}">Select</button>
          <button type="button" data-open-object="${escapeHtml(item.id)}">Open</button>
          ${canDelete && item.state !== "deleted" ? `<button type="button" class="dangerSoft" data-delete-object="${escapeHtml(item.id)}">Delete</button>` : ""}
        </div>
      </td>
    </tr>
  `;
}

function renderRows() {
  $("#objectRows").innerHTML = state.objects.map((item) => rowHtml(item, "create")).join("");
  $("#libraryRows").innerHTML = state.objects.map((item) => rowHtml(item, "library")).join("");
  updateShell();
  updateDetail();
}

function setMode(mode) {
  state.mode = mode;
  $$(".railBtn").forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
  $$("[data-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === mode));
  const labels = {
    create: ["Create and import", "6 routes"],
    save: ["Save destination", state.saveDestination === "local" ? "Local folder" : "Browser storage"],
    library: ["Saved management", `${state.objects.length} rows`],
    manage: ["Site Manager", "Settings / Files / Data"],
    blueprints: ["Blueprints", "8 shown of 43"],
    data: ["Database", "SQLite"],
    logs: ["Logs", "Warnings visible"],
    transfer: ["Transfer", "Import / export"]
  };
  $("#modeTitle").textContent = labels[mode][0];
  $("#modeBadge").textContent = labels[mode][1];
}

function setPreview(headline, copy, notice) {
  $("#previewHeadline").innerHTML = headline;
  $("#previewCopy").textContent = copy;
  $("#previewNotice").textContent = notice;
}

function mutateActive(partial) {
  const active = activeObject();
  Object.assign(active, partial, { updated: "Now" });
  state.selectedId = active.id;
  renderRows();
}

function replaceWithTemporaryFallback(reason) {
  const id = `temp-${Date.now()}`;
  state.objects.unshift({
    id,
    name: "Unsaved Playground",
    storage: "temporary",
    state: "temporary",
    source: "Vanilla WordPress",
    runtime: "WP latest / PHP 8.3",
    detail: "Temporary fallback after deleted active Playground.",
    result: reason,
    updated: "Now"
  });
  state.activeId = id;
  state.selectedId = id;
  state.path = "/hello-from-playground/";
}

function renderCommands() {
  const query = $("#commandSearch").value.trim().toLowerCase();
  const filtered = commands.filter((command) => {
    if (!query) return true;
    return `${command.label} ${command.group} ${command.hint} ${command.keywords}`.toLowerCase().includes(query);
  });
  if (!filtered.some((command) => command.id === state.selectedCommand) && filtered[0]) {
    state.selectedCommand = filtered[0].id;
  }

  const groups = filtered.reduce((acc, command) => {
    acc[command.group] = acc[command.group] || [];
    acc[command.group].push(command);
    return acc;
  }, {});

  $("#commandResults").innerHTML = Object.entries(groups).map(([group, groupCommands]) => `
    <section class="commandGroup">
      <h3>${escapeHtml(group)}</h3>
      ${groupCommands.map((command) => `
        <button type="button" class="commandResult ${command.id === state.selectedCommand ? "active" : ""}" data-command="${escapeHtml(command.id)}">
          <strong>${escapeHtml(command.label)}</strong>
          <span>${escapeHtml(command.hint)}</span>
        </button>
      `).join("")}
    </section>
  `).join("") || `<div class="notice">No matching commands. Try save, zip, GitHub, database, files, WP Admin, or Blueprint.</div>`;

  renderCommandForm();
}

function renderCommandForm() {
  const command = commands.find((item) => item.id === state.selectedCommand) || commands[0];
  let html = `
    <p class="eyebrow">Selected command form</p>
    <h3>${escapeHtml(command.label)}</h3>
    <p>${escapeHtml(command.hint)}</p>
  `;

  if (command.id === "zip-import") {
    html += `
      <label>Archive selected from native chooser
        <input id="zipImportFile" value="agency-site-export.zip">
      </label>
      <div class="notice warnNotice">Replacement warning: importing a .zip replaces the current files and SQLite database in the active Playground.</div>
      <div class="progressCard">
        <div class="progressLine"><strong id="commandProgressLabel">Awaiting archive validation</strong><span id="commandProgressCount">0%</span></div>
        <div class="meter"><span id="commandMeter"></span></div>
      </div>
      <div class="buttonRow">
        <button type="button" id="zipFailBtn">Validate broken archive</button>
        <button type="button" id="zipValidateBtn">Validate selected archive</button>
        <button type="button" class="dangerSoft" id="zipImportRunBtn">Import and replace</button>
      </div>
      <div class="notice" id="commandNotice">This command is the active search result for "import zip". It mutates the shell identity, selected table row, preview, and transfer history.</div>
    `;
  } else if (command.id === "github-import") {
    html += `
      <label>Repository <input id="commandGithubRepo" value="wordpress/wordpress-playground"></label>
      <div class="notice warnNotice">GitHub requires account connection. The access token is session-only and is not stored after refresh.</div>
      <div class="buttonRow">
        <button type="button" id="commandGithubConnectBtn">Connect account</button>
        <button type="button" class="primary" id="commandGithubImportBtn">Import repository</button>
      </div>
      <div class="notice" id="commandNotice">Waiting for GitHub account connection.</div>
    `;
  } else if (command.id === "blueprint-url") {
    html += `
      <label>Blueprint URL <input id="commandBlueprintUrl" value="https://example.com/blueprint.json"></label>
      <div class="buttonRow">
        <button type="button" id="commandValidateBlueprintBtn">Validate</button>
        <button type="button" class="primary" id="commandRunBlueprintBtn">Run Blueprint</button>
      </div>
      <div class="notice" id="commandNotice">Blueprint runs show schema validation and a replacement warning before execution.</div>
    `;
  } else if (command.id === "save-browser" || command.id === "save-local") {
    html += `
      <label>Name <input id="commandSaveName" value="Research Browser Playground"></label>
      <div class="buttonRow">
        <button type="button" class="primary" id="commandSaveBtn">Open save flow</button>
      </div>
      <div class="notice" id="commandNotice">${command.id === "save-local" ? "Local saves require folder permission and reconnect after reload." : "Browser saves create a browser-backed slug."}</div>
    `;
  } else if (command.id === "wp-admin" || command.id === "homepage") {
    html += `
      <div class="buttonRow">
        <button type="button" class="primary" id="commandPathBtn">Navigate</button>
      </div>
      <div class="notice" id="commandNotice">This command mutates the shell path input and embedded preview URL.</div>
    `;
  } else if (command.id === "zip-download" || command.id === "github-export") {
    html += `
      <div class="buttonRow">
        <button type="button" class="primary" id="commandTransferBtn">Open transfer controls</button>
      </div>
      <div class="notice" id="commandNotice">Transfer commands are available in the Transfer rail and Site Manager export panels.</div>
    `;
  } else if (command.id === "files" || command.id === "database") {
    html += `
      <div class="buttonRow">
        <button type="button" class="primary" id="commandManageBtn">Open Site Manager</button>
      </div>
      <div class="notice" id="commandNotice">Manager commands keep the live WordPress shell visible beside the tool surface.</div>
    `;
  } else {
    html += `
      <div class="buttonRow">
        <button type="button" class="primary" id="commandLaunchBtn">Run route</button>
      </div>
      <div class="notice" id="commandNotice">The active Playground row will be replaced by this route until saved.</div>
    `;
  }

  $("#commandForm").innerHTML = html;
}

function progress({ meter, label, count, steps, done }) {
  let index = 0;
  const timer = window.setInterval(() => {
    const step = steps[index];
    if (meter) $(meter).style.width = `${step.percent}%`;
    if (label) $(label).textContent = step.label;
    if (count) $(count).textContent = step.count;
    index += 1;
    if (index === steps.length) {
      window.clearInterval(timer);
      done();
    }
  }, 420);
}

function validateZip(ok) {
  $("#commandMeter").style.width = ok ? "100%" : "34%";
  $("#commandProgressLabel").textContent = ok ? "Archive valid. Replacement confirmation required." : "Validation failed: missing wp-content or database export.";
  $("#commandProgressCount").textContent = ok ? "100%" : "Failed";
  $("#commandNotice").textContent = ok
    ? "Success state: agency-site-export.zip contains WordPress files and a SQLite database. Import can continue."
    : "Failure state: broken-plugin.zip cannot replace the active Playground. Choose another archive.";
  $("#commandNotice").className = ok ? "notice" : "notice warnNotice";
  addHistory(ok ? "ZIP archive validated successfully." : "ZIP archive validation failed before replacement.");
}

function runZipImport() {
  const file = $("#zipImportFile")?.value.trim() || "agency-site-export.zip";
  mutateActive({
    state: "saving",
    result: `Replacing current files and database from ${file}.`
  });
  $("#commandState").textContent = "Import running";
  progress({
    meter: "#commandMeter",
    label: "#commandProgressLabel",
    count: "#commandProgressCount",
    steps: [
      { percent: 18, label: "Reading archive manifest", count: "18%" },
      { percent: 39, label: "Replacing WordPress files", count: "39%" },
      { percent: 68, label: "Restoring SQLite database", count: "68%" },
      { percent: 88, label: "Rebuilding Blueprint metadata", count: "88%" },
      { percent: 100, label: "Import complete", count: "100%" }
    ],
    done() {
      const name = "Imported ZIP Playground";
      state.path = "/";
      mutateActive({
        name,
        storage: "temporary",
        state: "imported",
        source: file,
        detail: `${file} replaced files and database. Save before refresh.`,
        result: "ZIP import succeeded and updated the active Playground identity."
      });
      $("#commandState").textContent = "Shell mutated";
      $("#commandNotice").textContent = "Success state: shell title, path, selected row, storage badge, preview, and transfer history now reflect the imported ZIP.";
      setPreview("Imported ZIP Playground", `${file} replaced the current WordPress files and SQLite database. The imported site is temporary until saved or exported.`, "Replacement complete. Save before refresh.");
      addHistory(`${file} imported over the active Playground.`);
    }
  });
}

function launchRoute(route) {
  const routeMap = {
    vanilla: ["Vanilla WordPress", "/", "Fresh latest WordPress runtime started.", "Vanilla WordPress"],
    "wordpress-pr": ["WordPress PR Preview", "/wp-admin/about.php", "WordPress core PR preview running with patch metadata.", "WordPress PR"],
    "gutenberg-pr": ["Gutenberg Branch Preview", "/wp-admin/site-editor.php", "Gutenberg PR or branch preview built with network access.", "Gutenberg PR or branch"]
  };
  const [name, path, result, source] = routeMap[route] || routeMap.vanilla;
  state.path = path;
  mutateActive({
    name,
    storage: "temporary",
    state: "temporary",
    source,
    detail: "Temporary replacement. Save before refresh.",
    result
  });
  setPreview(name === "Vanilla WordPress" ? "Hello from <span>WordPress Playground!</span>" : name, result, "This route replaced the current runtime. Save before refreshing.");
  addHistory(`${name} opened at ${path}.`);
}

function startGithubImport(source) {
  const repo = source === "command" ? $("#commandGithubRepo").value.trim() : $("#githubImportRepo").value.trim();
  const notice = source === "command" ? $("#commandNotice") : null;
  if (source === "command" && !state.githubConnected) {
    notice.textContent = "Connect GitHub before importing. Token will not be stored after refresh.";
    return;
  }
  mutateActive({ state: "saving", result: `Importing ${repo} from GitHub.` });
  window.setTimeout(() => {
    state.path = "/wp-admin/plugins.php";
    mutateActive({
      name: "GitHub Import Playground",
      storage: "temporary",
      state: "imported",
      source: repo,
      detail: `Imported from ${repo}. Token is not stored; save before refresh.`,
      result: "GitHub import completed."
    });
    setPreview("GitHub import ready", `${repo} was imported into wp-content and opened in the admin plugin screen.`, "Imported repository is temporary until saved or exported.");
    addHistory(`Imported ${repo} from GitHub.`);
    if (notice) notice.textContent = "GitHub import complete. Active Playground identity and path changed.";
  }, 850);
}

function chooseFolder(granted = true) {
  if (!granted) {
    state.folderPermission = "denied";
    $("#folderTitle").textContent = "Folder permission denied";
    $("#folderDetail").textContent = "Local-directory save cannot start until a folder is granted.";
    $("#saveNotice").textContent = "Denied permission leaves the active Playground temporary. Browser save remains available.";
    activeObject().state = "local permission";
    activeObject().result = "Local permission denied.";
    renderRows();
    addHistory("Local folder permission denied.");
    return;
  }
  state.folderPermission = "granted";
  state.folderPath = "~/Sites/playground-research-browser";
  $("#folderTitle").textContent = "Folder permission granted";
  $("#folderDetail").textContent = `${state.folderPath} selected. Reconnect may be required after reload.`;
  $("#saveNotice").textContent = "Folder granted. Start save to write files, uploads, Blueprint, and database to disk.";
  activeObject().state = "local permission";
  activeObject().result = "Local folder permission granted.";
  renderRows();
  addHistory(`Folder permission granted for ${state.folderPath}.`);
}

function setSaveDestination(destination) {
  state.saveDestination = destination;
  $$("[data-save-destination]").forEach((button) => button.classList.toggle("active", button.dataset.saveDestination === destination));
  $("#modeBadge").textContent = destination === "local" ? "Local folder" : "Browser storage";
  $("#folderPermission").style.display = destination === "local" ? "grid" : "none";
  $("#saveMeter").style.width = "0%";
  $("#saveProgressCount").textContent = "0 / 3751";
  $("#saveProgressLabel").textContent = destination === "local" ? "Folder permission required" : "Ready to copy files into browser storage";
  $("#saveNotice").textContent = destination === "local"
    ? "Local saves require folder permission and can need reconnection after browser reload."
    : "Browser saves create a local browser slug and do not grant a file-system folder.";
}

function startSave() {
  if (state.saveDestination === "local" && state.folderPermission !== "granted") {
    chooseFolder(false);
    return;
  }
  const name = $("#saveName").value.trim() || "Saved Playground";
  mutateActive({ state: "saving", result: `Saving ${name}.` });
  $("#startSaveBtn").disabled = true;
  progress({
    meter: "#saveMeter",
    label: "#saveProgressLabel",
    count: "#saveProgressCount",
    steps: [
      { percent: 12, label: "Preparing WordPress filesystem", count: "452 / 3751" },
      { percent: 43, label: "Copying plugins, themes, and uploads", count: "1634 / 3751" },
      { percent: 74, label: "Writing SQLite database and Blueprint", count: "2811 / 3751" },
      { percent: 100, label: "Save complete", count: "3751 / 3751" }
    ],
    done() {
      $("#startSaveBtn").disabled = false;
      const local = state.saveDestination === "local";
      state.path = local ? "/local-directory/" : `/${slugify(name)}/`;
      mutateActive({
        name,
        storage: local ? "local" : "browser",
        state: local ? "local permission" : "saved",
        source: local ? state.folderPath : "Browser storage",
        detail: local ? `${state.folderPath}. Reconnect permission after reload.` : `Browser-backed slug /${slugify(name)}/.`,
        result: local ? "Saved to local directory. Reload may request folder access." : "Saved in this browser with a stable slug."
      });
      $("#saveNotice").textContent = local
        ? `Saved to ${state.folderPath}. The row is local-directory backed and records the reconnect consequence.`
        : "Saved in this browser. The exact temporary row transformed into a saved browser row.";
      setPreview(name, local ? "The active Playground is now backed by the selected local folder." : "The active Playground now has a browser-saved identity and slug.", local ? "Local directory save complete." : "Browser save complete.");
      addHistory(`${name} saved to ${local ? state.folderPath : "browser storage"}.`);
    }
  });
}

function requestDelete(id) {
  const item = objectById(id) || selectedObject();
  if (!item || item.state === "deleted") return;
  state.selectedId = item.id;
  $("#deleteTitle").textContent = `Delete ${item.name}?`;
  $("#deleteConfirm").classList.remove("hidden");
  setMode("library");
  renderRows();
}

function confirmDelete() {
  const item = selectedObject();
  item.state = "deleted";
  item.result = "Deleted from saved management.";
  item.updated = "Now";
  if (state.activeId === item.id) {
    replaceWithTemporaryFallback(`Deleted ${item.name}; active shell fell back to an unsaved Playground.`);
    setPreview("Hello from <span>WordPress Playground!</span>", "The active saved Playground was deleted. A temporary Playground is now selected.", "Deleted row remains visible in the table as final state.");
  }
  $("#deleteConfirm").classList.add("hidden");
  addHistory(`${item.name} deleted; final deleted state recorded.`);
  renderRows();
}

function renameSelected() {
  const item = selectedObject();
  if (!item || item.state === "deleted") return;
  const next = $("#renameInput").value.trim();
  if (!next) return;
  const old = item.name;
  item.name = next;
  item.result = `Renamed from ${old}.`;
  item.updated = "Now";
  addHistory(`${old} renamed to ${next}.`);
  renderRows();
}

function openObject(id) {
  const item = objectById(id);
  if (!item || item.state === "deleted") return;
  state.selectedId = id;
  state.activeId = id;
  state.path = item.storage === "browser" ? `/${slugify(item.name)}/` : item.storage === "local" ? "/local-directory/" : "/hello-from-playground/";
  setPreview(item.name.includes("Unsaved") ? "Hello from <span>WordPress Playground!</span>" : item.name, item.result, item.detail);
  addHistory(`${item.name} opened from saved management.`);
  renderRows();
}

function handleManagerTab(tab) {
  $$("[data-manager-tab]").forEach((button) => button.classList.toggle("active", button.dataset.managerTab === tab));
  $$("[data-manager-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.managerPanel === tab));
}

function renderLogs(kind, targetSelector) {
  const rows = state.logs[kind].map(([level, message]) => `
    <div class="logLine ${level === "ERROR" ? "error" : level === "WARN" ? "warning" : ""}">
      <strong>${escapeHtml(level)}</strong>
      <span>${escapeHtml(message)}</span>
    </div>
  `).join("");
  $(targetSelector).innerHTML = rows;
}

function renderBlueprints() {
  const query = $("#blueprintSearch").value.trim().toLowerCase();
  const filtered = blueprints.filter((item) => {
    const filterMatch = state.blueprintFilter === "All" || item.includes(state.blueprintFilter);
    const queryMatch = !query || item.join(" ").toLowerCase().includes(query);
    return filterMatch && queryMatch;
  });
  $("#blueprintCards").innerHTML = filtered.map(([title, tag1, tag2, description, theme]) => `
    <button type="button" class="blueprintCard ${title === state.selectedBlueprint ? "active" : ""}" data-blueprint="${escapeHtml(title)}">
      <span class="thumb ${escapeHtml(theme)}">${escapeHtml(tag1)}</span>
      <span>
        <strong>${escapeHtml(title)}</strong><br>
        <span>${escapeHtml(description)}</span><br>
        <span>${escapeHtml(tag1)} / ${escapeHtml(tag2)}</span>
      </span>
    </button>
  `).join("") || `<div class="notice">No blueprints in this representative subset match the filter.</div>`;
  const selected = blueprints.find((item) => item[0] === state.selectedBlueprint) || blueprints[0];
  $("#selectedBlueprintTitle").textContent = selected[0];
  $("#selectedBlueprintDesc").textContent = selected[3];
  $("#blueprintUrlInput").value = `https://playground.wordpress.net/blueprints/${slugify(selected[0])}.json`;
}

function runSelectedBlueprint() {
  const selected = blueprints.find((item) => item[0] === state.selectedBlueprint) || blueprints[0];
  mutateActive({
    name: `${selected[0]} Playground`,
    storage: "temporary",
    state: "imported",
    source: selected[0],
    detail: "Blueprint run replaced current content. Save before refresh.",
    result: "Blueprint validation passed and run completed."
  });
  state.path = "/";
  $("#blueprintRunNotice").textContent = `${selected[0]} validated and replaced current content. Preview and selected row updated.`;
  setPreview(`${selected[0]} Playground`, selected[3], "Blueprint run complete. Save or export this replacement.");
  addHistory(`${selected[0]} Blueprint run completed.`);
}

function downloadDatabase(source) {
  $("#databaseSize").textContent = "456 KB";
  $("#dataModeSize").textContent = "456 KB";
  selectedObject().result = "Downloaded database.sqlite.";
  addHistory(`database.sqlite downloaded from ${source}.`);
  renderRows();
}

function packageZip() {
  $("#downloadZipBtn").disabled = true;
  progress({
    meter: "#zipDownloadMeter",
    label: "#zipDownloadLabel",
    count: "#zipDownloadCount",
    steps: [
      { percent: 19, label: "Collecting WordPress files", count: "19%" },
      { percent: 48, label: "Adding uploads and themes", count: "48%" },
      { percent: 76, label: "Bundling SQLite database", count: "76%" },
      { percent: 100, label: "playground-export-2026-05-21.zip generated", count: "100%" }
    ],
    done() {
      $("#downloadZipBtn").disabled = false;
      mutateActive({ state: "exported", result: "Generated playground-export-2026-05-21.zip." });
      addHistory("Generated playground-export-2026-05-21.zip.");
    }
  });
}

function exportGithub() {
  if (!state.exportConnected) {
    $("#githubExportNotice").textContent = "Connect GitHub before exporting. Token remains session-only.";
    return;
  }
  $("#githubExportNotice").textContent = "Exporting files, database, and Blueprint bundle to GitHub...";
  window.setTimeout(() => {
    mutateActive({ state: "exported", source: $("#exportRepo").value, result: "GitHub export completed at commit 8f34c2a." });
    $("#githubExportNotice").textContent = `Exported to ${$("#exportRepo").value} at commit 8f34c2a.`;
    addHistory(`Exported active Playground to ${$("#exportRepo").value}.`);
  }, 800);
}

document.addEventListener("click", (event) => {
  const modeButton = event.target.closest("[data-mode]");
  if (modeButton) {
    setMode(modeButton.dataset.mode);
    if (modeButton.dataset.managerTab) handleManagerTab(modeButton.dataset.managerTab);
  }

  const commandButton = event.target.closest("[data-command]");
  if (commandButton) {
    state.selectedCommand = commandButton.dataset.command;
    renderCommands();
    return;
  }

  const selectCommand = event.target.closest("[data-select-command]");
  if (selectCommand) {
    state.selectedCommand = selectCommand.dataset.selectCommand;
    $("#commandSearch").value = commands.find((command) => command.id === state.selectedCommand)?.label || "";
    renderCommands();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const launch = event.target.closest("[data-launch]");
  if (launch) {
    launchRoute(launch.dataset.launch);
    return;
  }

  const pathButton = event.target.closest("[data-path]");
  if (pathButton) {
    state.path = pathButton.dataset.path;
    updateShell();
    setPreview(pathButton.dataset.path === "/wp-admin/" ? "WordPress Dashboard" : "Hello from <span>WordPress Playground!</span>", pathButton.dataset.path === "/wp-admin/" ? "The embedded site is showing WP Admin for the active Playground." : "The embedded site is showing the current homepage.", "Path navigation completed without leaving the console.");
    addHistory(`Navigated active preview to ${state.path}.`);
    return;
  }

  const saveDestination = event.target.closest("[data-save-destination]");
  if (saveDestination) {
    setSaveDestination(saveDestination.dataset.saveDestination);
    return;
  }

  const selectObject = event.target.closest("[data-select-object]");
  if (selectObject) {
    state.selectedId = selectObject.dataset.selectObject;
    renderRows();
    return;
  }

  const open = event.target.closest("[data-open-object]");
  if (open) {
    openObject(open.dataset.openObject);
    return;
  }

  const del = event.target.closest("[data-delete-object]");
  if (del) {
    requestDelete(del.dataset.deleteObject);
    return;
  }

  const managerTab = event.target.closest("[data-manager-tab]");
  if (managerTab) {
    handleManagerTab(managerTab.dataset.managerTab);
    return;
  }

  const log = event.target.closest("[data-log]");
  if (log) {
    $$("[data-log]").forEach((button) => button.classList.toggle("active", button === log));
    renderLogs(log.dataset.log, "#managerLogs");
    return;
  }

  const mainLog = event.target.closest("[data-log-main]");
  if (mainLog) {
    $$("[data-log-main]").forEach((button) => button.classList.toggle("active", button === mainLog));
    renderLogs(mainLog.dataset.logMain, "#mainLogs");
    return;
  }

  const filter = event.target.closest("[data-blueprint-filter]");
  if (filter) {
    state.blueprintFilter = filter.dataset.blueprintFilter;
    $$("[data-blueprint-filter]").forEach((button) => button.classList.toggle("active", button === filter));
    renderBlueprints();
    return;
  }

  const blueprint = event.target.closest("[data-blueprint]");
  if (blueprint) {
    state.selectedBlueprint = blueprint.dataset.blueprint;
    renderBlueprints();
  }
});

document.addEventListener("click", (event) => {
  if (event.target.id === "zipFailBtn") validateZip(false);
  if (event.target.id === "zipValidateBtn") validateZip(true);
  if (event.target.id === "zipImportRunBtn") runZipImport();
  if (event.target.id === "commandGithubConnectBtn") {
    state.githubConnected = true;
    $("#commandNotice").textContent = "GitHub connected for this session. Token will not be stored after refresh.";
    addHistory("GitHub account connected for import command.");
  }
  if (event.target.id === "commandGithubImportBtn") startGithubImport("command");
  if (event.target.id === "commandValidateBlueprintBtn") {
    $("#commandNotice").textContent = "Blueprint URL validated. Replacement warning will be shown before running.";
    addHistory("Blueprint URL validated from command search.");
  }
  if (event.target.id === "commandRunBlueprintBtn") runSelectedBlueprint();
  if (event.target.id === "commandSaveBtn") {
    setMode(state.selectedCommand === "save-local" ? "save" : "save");
    setSaveDestination(state.selectedCommand === "save-local" ? "local" : "browser");
  }
  if (event.target.id === "commandPathBtn") {
    state.path = state.selectedCommand === "wp-admin" ? "/wp-admin/" : "/";
    updateShell();
    addHistory(`Command search navigated to ${state.path}.`);
  }
  if (event.target.id === "commandTransferBtn") setMode("transfer");
  if (event.target.id === "commandManageBtn") {
    setMode("manage");
    handleManagerTab(state.selectedCommand === "database" ? "database" : "files");
  }
  if (event.target.id === "commandLaunchBtn") launchRoute(state.selectedCommand);
});

$("#pathForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const value = $("#pathInput").value.trim() || "/";
  state.path = value.startsWith("/") ? value : `/${value}`;
  updateShell();
  setPreview(state.path === "/wp-admin/" ? "WordPress Dashboard" : "Hello from <span>WordPress Playground!</span>", `The embedded WordPress preview navigated to ${state.path}.`, "Path input updated the active shell.");
  addHistory(`Path input navigated to ${state.path}.`);
});

$("#refreshBtn").addEventListener("click", () => {
  activeObject().result = `Refreshed at ${state.path}.`;
  setPreview($("#previewHeadline").innerHTML, `The embedded WordPress page refreshed at ${state.path}.`, "Refresh completed in the protected live shell.");
  addHistory(`Refreshed active WordPress page at ${state.path}.`);
  renderRows();
});

$("#commandSearch").addEventListener("input", renderCommands);
$("#githubImportBtn").addEventListener("click", () => {
  state.githubConnected = true;
  startGithubImport("route");
});
$("#chooseFolderBtn").addEventListener("click", () => chooseFolder(true));
$("#denyFolderBtn").addEventListener("click", () => chooseFolder(false));
$("#startSaveBtn").addEventListener("click", startSave);
$("#cancelSaveBtn").addEventListener("click", () => {
  $("#saveMeter").style.width = "0%";
  $("#saveProgressLabel").textContent = "Save cancelled";
  $("#saveProgressCount").textContent = "0 / 3751";
  $("#saveNotice").textContent = "Save cancelled. The active Playground row is unchanged.";
  addHistory("Save flow cancelled before copy.");
});
$("#renameBtn").addEventListener("click", renameSelected);
$("#deleteRequestBtn").addEventListener("click", () => requestDelete(state.selectedId));
$("#confirmDeleteBtn").addEventListener("click", confirmDelete);
$("#cancelDeleteBtn").addEventListener("click", () => $("#deleteConfirm").classList.add("hidden"));
$("#applySettingsBtn").addEventListener("click", () => {
  const active = activeObject();
  active.result = active.storage === "temporary"
    ? "Settings applied with destructive reset."
    : "Settings saved and Playground reloaded.";
  active.updated = "Now";
  setPreview(active.name, active.result, active.storage === "temporary" ? "Temporary runtime reset complete." : "Save and Reload complete.");
  addHistory(active.result);
  renderRows();
});
$("#newFileBtn").addEventListener("click", () => addHistory("Created /wordpress/wp-content/new-file.php."));
$("#newFolderBtn").addEventListener("click", () => addHistory("Created /wordpress/wp-content/new-folder/."));
$("#uploadFileBtn").addEventListener("click", () => addHistory("Uploaded file into /wordpress/wp-content/uploads/."));
$("#editFileBtn").addEventListener("click", () => {
  $("#fileBadge").textContent = "Dirty";
  $("#fileBadge").className = "badge warn";
  addHistory("/wordpress/wp-config.php has unsaved changes.");
});
$("#saveFileBtn").addEventListener("click", () => {
  $("#fileBadge").textContent = "Saved";
  $("#fileBadge").className = "badge ok";
  addHistory("/wordpress/wp-config.php saved.");
});
$("#copyBlueprintBtn").addEventListener("click", () => addHistory("Copied link to /blueprint.json."));
$("#downloadBlueprintBtn").addEventListener("click", () => addHistory("Downloaded current Blueprint bundle."));
$("#runBlueprintBtn").addEventListener("click", () => {
  $("#blueprintBadge").textContent = "Run complete";
  $("#blueprintBadge").className = "badge ok";
  runSelectedBlueprint();
});
$("#downloadDatabaseBtn").addEventListener("click", () => downloadDatabase("Site Manager"));
$("#dataDownloadBtn").addEventListener("click", () => downloadDatabase("Data mode"));
$("#transferDatabaseBtn").addEventListener("click", () => downloadDatabase("Transfer mode"));
$("#connectGithubBtn").addEventListener("click", () => {
  state.exportConnected = true;
  $("#githubExportNotice").textContent = "GitHub connected for this session. Choose repository and export.";
  addHistory("GitHub account connected for export.");
});
$("#exportGithubBtn").addEventListener("click", exportGithub);
$("#downloadZipBtn").addEventListener("click", packageZip);
$("#blueprintSearch").addEventListener("input", renderBlueprints);
$("#copySelectedBlueprintBtn").addEventListener("click", () => addHistory(`Copied ${state.selectedBlueprint} Blueprint URL.`));
$("#downloadSelectedBlueprintBtn").addEventListener("click", () => addHistory(`Downloaded ${state.selectedBlueprint} Blueprint bundle.`));
$("#runSelectedBlueprintBtn").addEventListener("click", runSelectedBlueprint);

renderCommands();
renderRows();
renderHistory();
renderLogs("playground", "#managerLogs");
renderLogs("playground", "#mainLogs");
renderBlueprints();
setSaveDestination("browser");
