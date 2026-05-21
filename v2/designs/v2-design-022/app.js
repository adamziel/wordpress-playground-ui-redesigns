const state = {
  mode: "data",
  title: "Unsaved Playground",
  storage: "Temporary",
  path: "/hello-from-playground/",
  runtime: "WP latest / PHP 8.3",
  selectedCommand: "download-db",
  selectedBlueprint: "art-gallery",
  blueprintCategory: "All",
  fileDirty: false,
  dbDownloaded: false,
  githubConnected: false,
  deleteTarget: null,
  savedRows: [
    {
      id: "temp",
      name: "Unsaved Playground",
      storage: "Temporary",
      meta: "Not saved. Refresh or destructive reset loses this runtime.",
      active: true
    },
    {
      id: "research-browser",
      name: "Research Browser Playground",
      storage: "Saved in this browser",
      meta: "Created May 21, 2026. Opens by browser-backed slug.",
      active: false
    },
    {
      id: "client-local",
      name: "Client Demo Local",
      storage: "Local directory",
      meta: "Folder permission granted for ~/Sites/client-demo-local.",
      active: false
    }
  ],
  logs: [
    { tone: "warning", text: "PHP notice: Plugin sandbox loaded with WP_DEBUG disabled." },
    { tone: "", text: "Playground boot complete. SQLite database mounted at /wordpress/wp-content/database/.ht.sqlite." }
  ],
  transfers: []
};

const commands = [
  {
    id: "download-db",
    group: "Data",
    label: "Download database.sqlite",
    detail: "Prepare the SQLite-backed database and write a log event.",
    mode: "data"
  },
  {
    id: "open-admin",
    group: "Shell",
    label: "Open WP Admin",
    detail: "Navigate the protected browser to /wp-admin/.",
    mode: "data"
  },
  {
    id: "save-browser",
    group: "Save",
    label: "Save in this browser",
    detail: "Copy files into browser storage and create a slugged saved identity.",
    mode: "save"
  },
  {
    id: "save-local",
    group: "Save",
    label: "Save to local directory",
    detail: "Grant folder access, copy files, and switch to local storage consequences.",
    mode: "save"
  },
  {
    id: "edit-file",
    group: "Files",
    label: "Mark wp-config.php dirty",
    detail: "Change the selected file and expose Save wp-config.php.",
    mode: "manage"
  },
  {
    id: "run-blueprint",
    group: "Blueprints",
    label: "Run selected Blueprint",
    detail: "Validate JSON, confirm replacement, run progress, and update preview.",
    mode: "blueprints"
  },
  {
    id: "zip-import",
    group: "Transfer",
    label: "Import .zip and replace current site",
    detail: "Validate client-demo-site.zip, confirm replacement, and mutate active site.",
    mode: "transfer"
  },
  {
    id: "gutenberg-preview",
    group: "Create",
    label: "Preview Gutenberg PR or branch",
    detail: "Use a branch or PR route and create a review Playground identity.",
    mode: "create"
  }
];

const blueprints = [
  { id: "art-gallery", name: "Art Gallery", category: "Website", desc: "An art gallery created with the Vueo theme.", url: "https://playground.wordpress.net/blueprints/art-gallery.json" },
  { id: "coffee-shop", name: "Coffee Shop", category: "WooCommerce", desc: "A stylish WooCommerce coffee shop storefront with custom content.", url: "https://playground.wordpress.net/blueprints/coffee-shop.json" },
  { id: "friends-feed", name: "Feed Reader with the Friends Plugin", category: "Content", desc: "Read feeds from the web in Playground using the Friends plugin.", url: "https://playground.wordpress.net/blueprints/friends-feed-reader.json" },
  { id: "gaming-news", name: "Gaming News", category: "News", desc: "A gaming news site created with the Spiel theme.", url: "https://playground.wordpress.net/blueprints/gaming-news.json" },
  { id: "non-profit", name: "Non-profit Organization", category: "Website", desc: "A non-profit organization site created with the Koinonia theme.", url: "https://playground.wordpress.net/blueprints/non-profit.json" },
  { id: "personal-blog", name: "Personal Blog", category: "Personal", desc: "A personal blog created with the Substrata theme.", url: "https://playground.wordpress.net/blueprints/personal-blog.json" }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function setMode(mode) {
  state.mode = mode;
  $$(".rail-item").forEach((item) => item.classList.toggle("active", item.dataset.mode === mode));
  $$(".mode-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `panel-${mode}`));
  const title = $(`#panel-${mode}`)?.dataset.title || mode;
  $("#activeModeFlag").textContent = `Mode: ${title}`;
}

function logEvent(text, tone = "") {
  state.logs.unshift({ text, tone });
  renderLogs();
}

function addTransfer(text, tone = "success") {
  state.transfers.unshift({ text, tone });
  $("#latestTransfer").textContent = text;
  renderTransfers();
}

function updateShell() {
  $("#shellTitle").textContent = state.title;
  $("#storageBadge").textContent = state.storage;
  $("#storageBadge").className = "status";
  if (state.storage === "Temporary") $("#storageBadge").classList.add("amber");
  if (state.storage.includes("Saved") || state.storage.includes("Local")) $("#storageBadge").classList.add("green");
  $("#runtimeBadge").textContent = state.runtime;
  $("#pathInput").value = state.path;
  $("#previewPath").textContent = state.path;
  $("#objectStorage").textContent = storageText();
  $("#resetBehavior").textContent = state.storage === "Temporary" ? "Apply Settings & Reset Playground" : "Save & Reload stored Playground";
  $("#shellConsequence").textContent = state.storage === "Temporary"
    ? "Refresh or settings reset can replace this unsaved runtime."
    : state.storage.includes("Local")
      ? "Reload reopens after folder permission is confirmed."
      : "Saved in this browser and available from the Library.";
  renderSavedRows();
}

function storageText() {
  if (state.storage === "Temporary") return "Temporary browser runtime";
  if (state.storage.includes("Local")) return "Local directory backed runtime";
  return "Browser storage backed runtime";
}

function setPath(path) {
  state.path = path || "/";
  updateShell();
  if (state.path.startsWith("/wp-admin")) {
    $("#previewState").textContent = "WordPress admin loaded";
    $("#previewFrame").innerHTML = `
      <div class="wp-adminbar">
        <span class="wp-dot">W</span><span>${state.title}</span><span>Dashboard</span><span>+ New</span><span class="push">Howdy, admin</span>
      </div>
      <div class="admin-preview">
        <aside class="admin-menu">
          <strong>Dashboard</strong><span class="active">Home</span><span>Posts</span><span>Media</span><span>Pages</span><span>Appearance</span><span>Plugins</span><span>Tools</span><span>Settings</span>
        </aside>
        <main class="admin-content">
          <h1>Dashboard</h1>
          <div class="admin-cards">
            <article class="admin-card"><strong>Site Health</strong><p>Good. Network access is allowed.</p></article>
            <article class="admin-card"><strong>At a Glance</strong><p>1 page, 1 post, PHP 8.3.</p></article>
            <article class="admin-card"><strong>Quick Draft</strong><p>Admin workflow stays inside the protected Playground shell.</p></article>
          </div>
        </main>
      </div>`;
  } else {
    renderFrontPreview("Hello from <span>WordPress Playground!</span>", "This is Playground, a WordPress that runs client-side in your browser. It is perfect for training, demonstrating plugins and themes, and for testing purposes.");
  }
}

function renderFrontPreview(heading, body, notice = "Note that you are logged-in as admin!") {
  $("#previewState").textContent = "Live WordPress preview";
  $("#previewFrame").innerHTML = `
    <div class="wp-adminbar">
      <span class="wp-dot">W</span>
      <span id="adminbarSite">My WordPress Website</span>
      <span>Edit Site</span>
      <span>0 comments</span>
      <span>+ New</span>
      <span class="push">Howdy, admin</span>
    </div>
    <nav class="site-nav">
      <strong id="siteTitle">My WordPress Website</strong>
      <span>Hello from WordPress Playground!</span>
      <span>Sample Page</span>
    </nav>
    <section class="front-preview">
      <div class="front-copy">
        <h1 id="previewHeading">${heading}</h1>
        <p id="previewBody">${body}</p>
        <p><mark id="previewNotice">${notice}</mark><br>Thus, you can modify this site as you like: edit content, install plugins and play around.</p>
        <button type="button">Discover the mission behind Playground</button>
      </div>
      <div class="wp-art" aria-hidden="true">
        <div class="green-loop loop-a"></div>
        <div class="green-loop loop-b"></div>
        <div class="wp-orb">W</div>
      </div>
    </section>`;
}

function runProgress({ card, bar, count, label, labelText, steps = [18, 43, 71, 100], unit = "%", done }) {
  card.classList.remove("hidden");
  bar.style.width = "0%";
  count.textContent = unit === "files" ? "0 / 3751" : "0%";
  if (labelText) label.textContent = labelText;
  let index = 0;
  const timer = setInterval(() => {
    const value = steps[index];
    bar.style.width = `${Math.min(value, 100)}%`;
    count.textContent = unit === "files" ? `${Math.round((value / 100) * 3751)} / 3751` : `${value}%`;
    index += 1;
    if (index >= steps.length) {
      clearInterval(timer);
      setTimeout(done, 180);
    }
  }, 260);
}

function downloadDatabase() {
  setMode("data");
  $("#selectedObjectFlag").textContent = "Selected: database.sqlite";
  $("#dbResultCard").classList.add("hidden");
  runProgress({
    card: $("#dbProgressCard"),
    bar: $("#dbProgressBar"),
    count: $("#dbProgressCount"),
    label: $("#dbProgressLabel"),
    labelText: "Preparing SQLite export...",
    done: () => {
      $("#dbProgressLabel").textContent = "Download ready";
      $("#dbResultCard").classList.remove("hidden");
      state.dbDownloaded = true;
      $("#dbSize").textContent = "452 KB, exported just now";
      addTransfer("database.sqlite downloaded from active Playground");
      logEvent("Database export complete: database.sqlite prepared from .ht.sqlite.", "success");
      $("#selectedObjectFlag").textContent = "Selected: database.sqlite ready";
    }
  });
}

function saveToBrowser() {
  setMode("save");
  $("#saveResultCard").classList.add("hidden");
  runProgress({
    card: $("#saveProgressCard"),
    bar: $("#saveProgressBar"),
    count: $("#saveProgressCount"),
    label: $("#saveProgressLabel"),
    labelText: "Saving files to browser storage...",
    unit: "files",
    done: () => {
      const name = $("#browserSaveName").value.trim() || "Saved Playground";
      state.title = name;
      state.storage = "Saved in this browser";
      upsertSavedRow("browser-active", name, "Saved in this browser", "Slug /research-browser-playground created just now.");
      $("#saveResultText").textContent = `${name} now appears in Library with browser storage and uses Save & Reload for settings changes.`;
      $("#saveResultCard").classList.remove("hidden");
      $("#saveModeBadge").textContent = "Browser saved";
      $("#saveModeBadge").className = "status green";
      updateShell();
      addTransfer("Browser save completed with slug /research-browser-playground");
      logEvent(`Saved "${name}" in this browser.`, "success");
    }
  });
}

function saveToLocal() {
  setMode("save");
  $("#saveResultCard").classList.add("hidden");
  $("#saveProgressLabel").textContent = "Folder permission granted. Copying files...";
  runProgress({
    card: $("#saveProgressCard"),
    bar: $("#saveProgressBar"),
    count: $("#saveProgressCount"),
    label: $("#saveProgressLabel"),
    unit: "files",
    done: () => {
      const name = $("#localSaveName").value.trim() || "Local Directory Playground";
      state.title = name;
      state.storage = "Local directory";
      upsertSavedRow("local-active", name, "Local directory", "Folder ~/Sites/client-demo-local granted just now. Reconnect required after permission loss.");
      $("#saveResultText").textContent = `${name} is folder-backed. Reload asks for permission to reopen the same directory.`;
      $("#saveResultCard").classList.remove("hidden");
      $("#saveModeBadge").textContent = "Local directory";
      $("#saveModeBadge").className = "status green";
      updateShell();
      addTransfer("Local directory save completed to ~/Sites/client-demo-local");
      logEvent(`Saved "${name}" to a local directory.`, "success");
    }
  });
}

function upsertSavedRow(id, name, storage, meta) {
  state.savedRows.forEach((row) => {
    row.active = false;
  });
  const temp = state.savedRows.find((row) => row.id === "temp");
  if (temp && id !== "temp") {
    temp.name = "Unsaved Playground";
    temp.storage = "Temporary";
    temp.meta = "Available as a new temporary fallback.";
  }
  const existing = state.savedRows.find((row) => row.id === id);
  if (existing) {
    existing.name = name;
    existing.storage = storage;
    existing.meta = meta;
    existing.active = true;
  } else {
    state.savedRows.unshift({ id, name, storage, meta, active: true });
  }
}

function renderSavedRows() {
  const list = $("#savedList");
  if (!list) return;
  list.innerHTML = "";
  state.savedRows.forEach((row) => {
    const item = document.createElement("article");
    item.className = `saved-row${row.active ? " active" : ""}`;
    item.innerHTML = `
      <div>
        <strong>${row.name}</strong>
        <small>${row.storage} - ${row.meta}</small>
      </div>
      <div class="row-actions">
        <button type="button" class="action compact" data-open-row="${row.id}">Open</button>
        <button type="button" class="action compact" data-rename-row="${row.id}">Rename</button>
        <button type="button" class="action compact danger" data-delete-row="${row.id}">Delete</button>
      </div>`;
    list.appendChild(item);
  });
  $("#libraryCount").textContent = `${state.savedRows.length} objects`;
}

function renderLogs() {
  const list = $("#eventLog");
  if (!list) return;
  list.innerHTML = "";
  state.logs.slice(0, 12).forEach((entry) => {
    const li = document.createElement("li");
    li.className = entry.tone || "";
    li.textContent = entry.text;
    list.appendChild(li);
  });
}

function renderTransfers() {
  const list = $("#transferList");
  if (!list) return;
  list.innerHTML = "";
  const entries = state.transfers.length ? state.transfers : [{ text: "No transfers yet. Run database download, GitHub export, zip import, or Blueprint bundle actions.", tone: "" }];
  entries.slice(0, 10).forEach((entry) => {
    const li = document.createElement("li");
    li.className = entry.tone || "";
    li.textContent = entry.text;
    list.appendChild(li);
  });
}

function renderCommandResults() {
  const query = $("#commandQuery").value.trim().toLowerCase();
  const results = commands.filter((command) => {
    const haystack = `${command.group} ${command.label} ${command.detail}`.toLowerCase();
    return !query || haystack.includes(query);
  });
  const list = $("#commandResults");
  list.innerHTML = "";
  if (!results.length) {
    list.innerHTML = `<div class="result-card">No command matches "${query}". Try database, save, file, zip, admin, Blueprint, or branch.</div>`;
    return;
  }
  let group = "";
  results.forEach((command) => {
    if (command.group !== group) {
      group = command.group;
      const groupEl = document.createElement("div");
      groupEl.className = "result-group";
      groupEl.textContent = group;
      list.appendChild(groupEl);
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = `command-result${state.selectedCommand === command.id ? " active" : ""}`;
    button.innerHTML = `<strong>${command.label}</strong><span>${command.detail}</span>`;
    button.addEventListener("click", () => selectCommand(command.id));
    list.appendChild(button);
  });
}

function selectCommand(id) {
  state.selectedCommand = id;
  const command = commands.find((item) => item.id === id) || commands[0];
  setMode(command.mode);
  $("#commandForm").innerHTML = commandFormMarkup(command);
  $("#runCommandBtn").addEventListener("click", () => runCommand(command.id));
  renderCommandResults();
}

function commandFormMarkup(command) {
  const fields = {
    "download-db": `<label>Output name<input value="database.sqlite"></label>`,
    "open-admin": `<label>Target path<input value="/wp-admin/"></label>`,
    "save-browser": `<label>Playground name<input value="${$("#browserSaveName")?.value || "Research Browser Playground"}"></label>`,
    "save-local": `<label>Folder<input value="~/Sites/client-demo-local"></label>`,
    "edit-file": `<label>Selected file<input value="/wordpress/wp-config.php"></label>`,
    "run-blueprint": `<label>Blueprint URL<input value="${$("#blueprintUrl")?.value || ""}"></label>`,
    "zip-import": `<label>Archive<input value="client-demo-site.zip"></label>`,
    "gutenberg-preview": `<label>PR, URL, or branch<input value="try/dataviews-polish"></label>`
  };
  return `
    <strong>Selected command: ${command.label}</strong>
    <p>${command.detail}</p>
    ${fields[command.id] || ""}
    <button class="action primary" type="button" id="runCommandBtn">Run command</button>`;
}

function runCommand(id) {
  if (id === "download-db") downloadDatabase();
  if (id === "open-admin") {
    setPath("/wp-admin/");
    logEvent("Command search opened WP Admin at /wp-admin/.", "success");
  }
  if (id === "save-browser") saveToBrowser();
  if (id === "save-local") saveToLocal();
  if (id === "edit-file") markFileDirty("Command search edited wp-config.php.");
  if (id === "run-blueprint") runBlueprintReplacement();
  if (id === "zip-import") zipReplacement();
  if (id === "gutenberg-preview") startRoute("gutenberg");
}

function markFileDirty(message = "wp-config.php edited. Save required.", appendLine = true) {
  setMode("manage");
  selectManagerTab("files");
  const wasDirty = state.fileDirty;
  state.fileDirty = true;
  $("#fileState").textContent = "wp-config.php dirty";
  $("#editorStatus").textContent = "Dirty";
  $("#editorStatus").className = "status amber";
  if (appendLine && !$("#fileEditor").value.includes("WP_ENVIRONMENT_TYPE")) {
    $("#fileEditor").value = `${$("#fileEditor").value}\ndefine( 'WP_ENVIRONMENT_TYPE', 'local' );`;
  }
  if (wasDirty && !appendLine) return;
  logEvent(message, "warning");
}

function saveFile() {
  state.fileDirty = false;
  $("#fileState").textContent = "wp-config.php saved";
  $("#editorStatus").textContent = "Saved just now";
  $("#editorStatus").className = "status green";
  addTransfer("wp-config.php saved to active Playground");
  logEvent("File saved: /wordpress/wp-config.php.", "success");
}

function selectManagerTab(tab) {
  $$(".tab[data-manager-tab]").forEach((button) => button.classList.toggle("active", button.dataset.managerTab === tab));
  $$(".manager-pane").forEach((pane) => pane.classList.toggle("active", pane.id === `manager-${tab}`));
}

function startRoute(route) {
  setMode("create");
  const names = {
    vanilla: "Unsaved Vanilla Playground",
    "wp-pr": "WordPress PR Preview",
    gutenberg: "Gutenberg Branch Preview"
  };
  state.title = names[route] || "Imported Playground";
  state.storage = "Temporary";
  state.path = route === "gutenberg" ? "/wp-admin/site-editor.php" : "/";
  state.savedRows.forEach((row) => {
    row.active = row.id === "temp";
  });
  const temp = state.savedRows.find((row) => row.id === "temp");
  if (temp) {
    temp.name = state.title;
    temp.storage = "Temporary";
    temp.meta = "Preview runtime, save before refresh.";
  }
  updateShell();
  if (route === "gutenberg") {
    setPath("/wp-admin/site-editor.php");
    state.path = "/wp-admin/site-editor.php";
  } else {
    setPath("/");
  }
  addTransfer(`${state.title} started from ${route} route`);
  logEvent(`${state.title} started. Previous temporary runtime was replaced.`, "warning");
}

function zipReplacement() {
  setMode("transfer");
  state.title = "Imported ZIP Playground";
  state.storage = "Temporary";
  state.path = "/";
  updateShell();
  renderFrontPreview("Imported <span>client demo site</span>", "The selected .zip replaced the current WordPress files and SQLite database after validation.");
  addTransfer("client-demo-site.zip imported and replaced active Playground");
  logEvent("ZIP import complete: current files and database were replaced.", "warning");
}

function runBlueprintReplacement() {
  setMode("blueprints");
  const selected = blueprints.find((item) => item.id === state.selectedBlueprint) || blueprints[0];
  $("#blueprintStatus").textContent = "Running replacement...";
  $("#blueprintStatus").className = "status amber";
  setTimeout(() => {
    state.title = `${selected.name} Playground`;
    state.storage = "Temporary";
    state.path = "/";
    updateShell();
    renderFrontPreview(`${selected.name}`, selected.desc, "Blueprint run complete. Current content was replaced.");
    $("#blueprintStatus").textContent = "Run complete";
    $("#blueprintStatus").className = "status green";
    addTransfer(`${selected.name} Blueprint ran and replaced active Playground`);
    logEvent(`Blueprint run complete: ${selected.name}.`, "success");
  }, 520);
}

function renderBlueprints() {
  const query = $("#blueprintSearch").value.trim().toLowerCase();
  const list = $("#blueprintList");
  list.innerHTML = "";
  const filtered = blueprints.filter((item) => {
    const categoryMatch = state.blueprintCategory === "All" || item.category === state.blueprintCategory;
    const queryMatch = !query || `${item.name} ${item.desc} ${item.category}`.toLowerCase().includes(query);
    return categoryMatch && queryMatch;
  });
  if (!filtered.length) {
    list.innerHTML = `<div class="result-card">No Blueprint in this representative subset matches the current filter.</div>`;
    return;
  }
  filtered.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `blueprint-card${item.id === state.selectedBlueprint ? " active" : ""}`;
    button.innerHTML = `<strong>${item.name}</strong><span>${item.category} - ${item.desc}</span>`;
    button.addEventListener("click", () => selectBlueprint(item.id));
    list.appendChild(button);
  });
}

function selectBlueprint(id) {
  state.selectedBlueprint = id;
  const selected = blueprints.find((item) => item.id === id) || blueprints[0];
  $("#selectedBlueprintName").textContent = selected.name;
  $("#selectedBlueprintDesc").textContent = selected.desc;
  $("#blueprintUrl").value = selected.url;
  $("#blueprintEditor").value = `{
  "landingPage": "/",
  "preferredVersions": { "php": "8.3", "wp": "latest" },
  "meta": { "title": "${selected.name}", "category": "${selected.category}" },
  "steps": [{ "step": "runPHP", "code": "<?php // ${selected.name} setup ?>" }]
}`;
  $("#blueprintStatus").textContent = "Valid JSON";
  $("#blueprintStatus").className = "status green";
  $("#selectedObjectFlag").textContent = `Selected: ${selected.name} Blueprint`;
  renderBlueprints();
}

function deleteRow(id) {
  state.deleteTarget = id;
  $("#deleteConfirm").classList.remove("hidden");
}

function confirmDelete() {
  if (!state.deleteTarget) return;
  const target = state.savedRows.find((row) => row.id === state.deleteTarget);
  const wasActive = target?.active;
  state.savedRows = state.savedRows.filter((row) => row.id !== state.deleteTarget);
  if (wasActive || !state.savedRows.some((row) => row.active)) {
    state.savedRows.forEach((row) => {
      row.active = false;
    });
    let temp = state.savedRows.find((row) => row.id === "temp");
    if (!temp) {
      temp = { id: "temp", name: "Unsaved Playground", storage: "Temporary", meta: "Fallback after delete.", active: true };
      state.savedRows.unshift(temp);
    }
    temp.active = true;
    state.title = temp.name;
    state.storage = "Temporary";
    state.path = "/hello-from-playground/";
    updateShell();
    setPath(state.path);
  }
  $("#deleteConfirm").classList.add("hidden");
  addTransfer(`Deleted ${target?.name || "saved Playground"} and updated Library`);
  logEvent(`Deleted saved Playground: ${target?.name || state.deleteTarget}.`, "warning");
  state.deleteTarget = null;
  renderSavedRows();
}

function openRow(id) {
  const row = state.savedRows.find((item) => item.id === id);
  if (!row) return;
  state.savedRows.forEach((item) => {
    item.active = item.id === id;
  });
  state.title = row.name;
  state.storage = row.storage;
  state.path = "/hello-from-playground/";
  updateShell();
  setPath(state.path);
  logEvent(`Opened ${row.name} from Library.`, "success");
}

function renameRow(id) {
  const row = state.savedRows.find((item) => item.id === id);
  if (!row) return;
  row.name = `${row.name} Renamed`;
  if (row.active) state.title = row.name;
  updateShell();
  logEvent(`Renamed Playground to ${row.name}.`, "success");
}

function bindEvents() {
  $$(".rail-item").forEach((item) => item.addEventListener("click", () => setMode(item.dataset.mode)));
  $$("[data-mode-shortcut]").forEach((item) => item.addEventListener("click", () => setMode(item.dataset.modeShortcut)));
  $("#goPathBtn").addEventListener("click", () => setPath($("#pathInput").value));
  $("#refreshBtn").addEventListener("click", () => logEvent(`Refreshed active path ${state.path}.`, "success"));
  $("#homeBtn").addEventListener("click", () => setPath("/hello-from-playground/"));
  $("#adminBtn").addEventListener("click", () => setPath("/wp-admin/"));
  $("#downloadDbBtn").addEventListener("click", downloadDatabase);
  $("#openAdminerBtn").addEventListener("click", () => {
    addTransfer("Adminer opened for active SQLite-backed database");
    logEvent("Adminer opened in a new Playground tool window.", "success");
  });
  $("#openPhpMyAdminBtn").addEventListener("click", () => {
    addTransfer("phpMyAdmin opened for active SQLite-backed database");
    logEvent("phpMyAdmin opened in a new Playground tool window.", "success");
  });
  $("#saveBrowserBtn").addEventListener("click", saveToBrowser);
  $("#chooseFolderBtn").addEventListener("click", () => {
    $("#saveModeBadge").textContent = "Folder picker open";
    $("#saveModeBadge").className = "status amber";
    logEvent("Local directory picker opened. Permission required before saving.", "warning");
  });
  $("#grantFolderBtn").addEventListener("click", saveToLocal);
  $("#commandQuery").addEventListener("input", renderCommandResults);
  $("#savedList").addEventListener("click", (event) => {
    const open = event.target.closest("[data-open-row]");
    const rename = event.target.closest("[data-rename-row]");
    const del = event.target.closest("[data-delete-row]");
    if (open) openRow(open.dataset.openRow);
    if (rename) renameRow(rename.dataset.renameRow);
    if (del) deleteRow(del.dataset.deleteRow);
  });
  $("#confirmDeleteBtn").addEventListener("click", confirmDelete);
  $("#cancelDeleteBtn").addEventListener("click", () => {
    state.deleteTarget = null;
    $("#deleteConfirm").classList.add("hidden");
    logEvent("Delete cancelled. Library row kept.", "success");
  });
  $$(".tab[data-manager-tab]").forEach((button) => button.addEventListener("click", () => selectManagerTab(button.dataset.managerTab)));
  $("#fileEditor").addEventListener("input", () => markFileDirty("wp-config.php edited in the file browser.", false));
  $("#saveFileBtn").addEventListener("click", saveFile);
  $("#newFileBtn").addEventListener("click", () => logEvent("New File created: /wordpress/wp-content/new-snippet.php.", "success"));
  $("#newFolderBtn").addEventListener("click", () => logEvent("New Folder created: /wordpress/wp-content/uploads/playground-assets.", "success"));
  $("#uploadFileBtn").addEventListener("click", () => logEvent("Upload complete: sample-plugin.zip added to wp-content/uploads.", "success"));
  $("#browseFilesBtn").addEventListener("click", () => logEvent("Browse files selected /wordpress/wp-config.php.", "success"));
  $("#resetSettingsBtn").addEventListener("click", () => {
    state.storage === "Temporary" ? startRoute("vanilla") : logEvent("Stored settings saved. Playground reload required.", "warning");
  });
  $("#exportGithubBtn").addEventListener("click", () => transferAction("Exported active Playground to github.com/example/playground-export"));
  $("#downloadZipBtn").addEventListener("click", () => transferAction("Generated active-playground.zip"));
  $("#blueprintSearch").addEventListener("input", renderBlueprints);
  $$("#blueprintFilters .chip").forEach((chip) => chip.addEventListener("click", () => {
    state.blueprintCategory = chip.dataset.category;
    $$("#blueprintFilters .chip").forEach((item) => item.classList.toggle("active", item === chip));
    renderBlueprints();
  }));
  $("#copyBlueprintBtn").addEventListener("click", () => transferAction("Copied Blueprint link to clipboard"));
  $("#downloadBlueprintBtn").addEventListener("click", () => transferAction("Downloaded selected Blueprint bundle"));
  $("#runBlueprintBtn").addEventListener("click", runBlueprintReplacement);
  $("#githubConnectBtn").addEventListener("click", () => {
    state.githubConnected = true;
    addTransfer("GitHub account connected for this session only");
    logEvent("GitHub connected. Access token will not be stored after refresh.", "warning");
  });
  $("#routeBlueprintRunBtn").addEventListener("click", runBlueprintReplacement);
  $("#zipReplaceBtn").addEventListener("click", zipReplacement);
  $$("[data-start-route]").forEach((button) => button.addEventListener("click", () => startRoute(button.dataset.startRoute)));
  $("#transferGithubImport").addEventListener("click", () => transferAction("Imported public GitHub repository after session connection"));
  $("#transferGithubExport").addEventListener("click", () => transferAction("Exported active Playground to GitHub repository"));
  $("#transferZipImport").addEventListener("click", zipReplacement);
  $("#transferZipDownload").addEventListener("click", () => transferAction("Generated active-playground.zip"));
  $("#transferDbDownload").addEventListener("click", downloadDatabase);
  $("#transferBlueprintDownload").addEventListener("click", () => transferAction("Downloaded Blueprint bundle for active Playground"));
}

function transferAction(text) {
  setMode("transfer");
  addTransfer(text);
  logEvent(text, "success");
}

function init() {
  bindEvents();
  updateShell();
  renderLogs();
  renderTransfers();
  renderBlueprints();
  selectBlueprint(state.selectedBlueprint);
  selectCommand(state.selectedCommand);
  setMode(state.mode);
}

init();
