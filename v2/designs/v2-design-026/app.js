const commands = [
  {
    id: "save-file",
    group: "Files",
    title: "Save selected file",
    summary: "Write wp-config.php dirty editor changes.",
    keywords: "save wp-config file dirty editor filesystem",
    button: "Save file",
    form: `
      <div class="field-grid">
        <label>Target file<input value="/wordpress/wp-config.php" readonly></label>
        <label>Write mode<select><option>Save dirty editor buffer</option><option>Save as new file</option></select></label>
      </div>
      <label>Change summary<textarea>Enable WP_DEBUG_LOG for this isolated Playground runtime.</textarea></label>
    `,
  },
  {
    id: "zip-import",
    group: "Portability",
    title: "Import ZIP archive",
    summary: "Validate archive, warn, replace files and database.",
    keywords: "zip import archive replace portability upload chooser",
    button: "Validate selected ZIP",
    warning: true,
    form: `
      <div class="field-grid">
        <label>Source archive<select id="zipSource"><option value="good">playground-support-bundle.zip</option><option value="bad">theme-export.txt</option></select></label>
        <label>Replacement scope<select><option>Files and SQLite database</option><option>Files only</option></select></label>
      </div>
      <label><span class="state-chip warning">Native chooser represented</span> File picker result is modeled here so the replacement flow can finish inside the wireframe.</label>
    `,
  },
  {
    id: "run-blueprint",
    group: "Blueprint",
    title: "Run Blueprint URL",
    summary: "Validate JSON and run against current Playground.",
    keywords: "run blueprint url json validate gallery copy download bundle",
    button: "Validate and run Blueprint",
    warning: true,
    form: `
      <label>Blueprint URL<input value="https://example.com/coffee-shop-blueprint.json"></label>
      <div class="field-grid">
        <label>Landing page<input value="/"></label>
        <label>Result identity<input value="Coffee Shop Blueprint"></label>
      </div>
    `,
  },
  {
    id: "download-db",
    group: "Database",
    title: "Download database.sqlite",
    summary: "Package the SQLite-backed database for download.",
    keywords: "download database sqlite adminer phpmyadmin data",
    button: "Download database.sqlite",
    form: `
      <div class="field-grid">
        <label>Driver<input value="MySQL emulation backed by SQLite" readonly></label>
        <label>Size<input value="452 KB" readonly></label>
      </div>
      <label>Path<input value="/wordpress/wp-content/database/.ht.sqlite" readonly></label>
    `,
  },
  {
    id: "save-browser",
    group: "Save",
    title: "Save in this browser",
    summary: "Copy 3,751 files into browser storage and create a slug.",
    keywords: "save browser saved playground storage slug reload",
    button: "Save in this browser",
    form: `
      <div class="field-grid">
        <label>Playground name<input id="saveNameField" value="Research Browser Playground"></label>
        <label>Slug<input value="research-browser-playground"></label>
      </div>
      <label>Consequence<input value="Restores from this browser after reload."></label>
    `,
  },
  {
    id: "save-local",
    group: "Save",
    title: "Save to local directory",
    summary: "Use folder permission and write a local working copy.",
    keywords: "save local directory folder permission reconnect",
    button: "Choose folder and save",
    form: `
      <div class="field-grid">
        <label>Folder picker result<input value="~/Sites/playground-lab"></label>
        <label>Permission<select><option>Granted for this session</option><option>Denied</option></select></label>
      </div>
      <label>Consequence<input value="Reconnect folder if browser permission is lost after reload."></label>
    `,
  },
  {
    id: "github-import",
    group: "GitHub",
    title: "Import from GitHub",
    summary: "Connect account and import plugin, theme, or wp-content.",
    keywords: "github import account token plugin theme wp-content",
    button: "Connect and import",
    form: `
      <div class="field-grid">
        <label>Repository<input value="WordPress/wordpress-playground"></label>
        <label>Directory<select><option>wp-content</option><option>plugin</option><option>theme</option></select></label>
      </div>
      <label>Token consequence<input value="Access token is not stored after refresh." readonly></label>
    `,
  },
  {
    id: "github-export",
    group: "GitHub",
    title: "Export to GitHub",
    summary: "Push the current Playground bundle to a repository.",
    keywords: "github export repository push token portability",
    button: "Export to GitHub",
    form: `
      <div class="field-grid">
        <label>Repository<input value="wp-playground-labs/research-browser"></label>
        <label>Branch<input value="playground-export"></label>
      </div>
      <label>Token consequence<input value="Connect each session; token is not stored after refresh." readonly></label>
    `,
  },
  {
    id: "delete",
    group: "Saved management",
    title: "Delete saved Playground",
    summary: "Confirm deletion, remove saved row, fall back if active.",
    keywords: "delete saved playground confirmation remove row destructive",
    button: "Show delete confirmation",
    warning: true,
    form: `
      <label>Saved copy<input value="Research Browser Playground"></label>
      <label>Final state<input value="Saved row removed; active shell falls back to Unsaved Playground if needed." readonly></label>
    `,
  },
  {
    id: "vanilla",
    group: "Launch",
    title: "Start Vanilla WordPress",
    summary: "Fresh latest WordPress temporary Playground.",
    keywords: "vanilla wordpress fresh latest start new",
    button: "Start fresh",
    form: `<label>Runtime<input value="WordPress latest / PHP 8.3 / logged in as admin" readonly></label>`,
  },
  {
    id: "wordpress-pr",
    group: "Launch",
    title: "Preview a WordPress PR",
    summary: "Use a PR number or wordpress-develop URL.",
    keywords: "wordpress pr preview core pull request",
    button: "Preview WordPress PR",
    form: `<label>PR number or URL<input value="https://github.com/WordPress/wordpress-develop/pull/7821"></label>`,
  },
  {
    id: "gutenberg-pr",
    group: "Launch",
    title: "Preview a Gutenberg PR or branch",
    summary: "Use a PR number, URL, or branch name.",
    keywords: "gutenberg pr branch preview trunk",
    button: "Preview Gutenberg",
    form: `<label>PR, URL, or branch<input value="trunk"></label>`,
  },
  {
    id: "blueprint-url",
    group: "Blueprint",
    title: "Run Blueprint from URL",
    summary: "Fetch public Blueprint JSON and validate before run.",
    keywords: "blueprint url run public json",
    button: "Inspect URL Blueprint",
    form: `<label>Blueprint URL<input value="https://example.com/blueprint.json"></label>`,
  },
  {
    id: "manager-files",
    group: "Site Manager",
    title: "Open Site Manager Files",
    summary: "Focus the file browser while keeping preview visible.",
    keywords: "site manager files browse upload create folder",
    button: "Open Files tab",
    form: `<label>Manager tab<input value="Files / wp-config.php" readonly></label>`,
  },
];

const blueprints = [
  { title: "Coffee Shop", tags: ["Featured", "WooCommerce"], thumb: "coffee", copy: "A stylish WooCommerce coffee shop storefront." },
  { title: "Art Gallery", tags: ["Featured", "Website", "Personal"], thumb: "art", copy: "An art gallery created with the Vueo theme." },
  { title: "Feed Reader with the Friends Plugin", tags: ["Featured", "Content"], thumb: "feed", copy: "Read feeds from the web using the Friends plugin." },
  { title: "Gaming News", tags: ["Featured", "News"], thumb: "gaming", copy: "A gaming news site created with the Spiel theme." },
  { title: "Non-profit Organization", tags: ["Featured", "Website"], thumb: "nonprofit", copy: "A nonprofit organization site created with the Koinonia theme." },
  { title: "Personal Blog", tags: ["Personal", "Website"], thumb: "blog", copy: "A personal blog created with the Substrata theme." },
];

const els = {
  commandInput: document.querySelector("#commandInput"),
  commandState: document.querySelector("#commandState"),
  resultGroups: document.querySelector("#resultGroups"),
  selectedGroup: document.querySelector("#selectedGroup"),
  selectedCommandTitle: document.querySelector("#selectedCommandTitle"),
  selectedCommandCopy: document.querySelector("#selectedCommandCopy"),
  dynamicForm: document.querySelector("#dynamicForm"),
  replaceWarning: document.querySelector("#replaceWarning"),
  executeCommand: document.querySelector("#executeCommand"),
  cancelCommand: document.querySelector("#cancelCommand"),
  commandProgress: document.querySelector("#commandProgress"),
  progressTitle: document.querySelector("#progressTitle"),
  progressDetail: document.querySelector("#progressDetail"),
  progressBar: document.querySelector("#progressBar"),
  commandResult: document.querySelector("#commandResult"),
  activeTitle: document.querySelector("#activeTitle"),
  previewShellTitle: document.querySelector("#previewShellTitle"),
  identityText: document.querySelector("#identityText"),
  storageBadge: document.querySelector("#storageBadge"),
  previewState: document.querySelector("#previewState"),
  pathInput: document.querySelector("#pathInput"),
  fileState: document.querySelector("#fileState"),
  fileDirtyMark: document.querySelector("#fileDirtyMark"),
  fileResult: document.querySelector("#fileResult"),
  eventList: document.querySelector("#eventList"),
  dbSize: document.querySelector("#dbSize"),
  dbState: document.querySelector("#dbState"),
  databaseOutcome: document.querySelector("#databaseOutcome"),
  databaseCopy: document.querySelector("#databaseCopy"),
  previewHeadline: document.querySelector("#previewHeadline"),
  previewCopy: document.querySelector("#previewCopy"),
  previewKicker: document.querySelector("#previewKicker"),
  previewMark: document.querySelector("#previewMark"),
  deleteBox: document.querySelector("#deleteBox"),
  savedList: document.querySelector("#savedList"),
  blueprintList: document.querySelector("#blueprintList"),
  blueprintSearch: document.querySelector("#blueprintSearch"),
  blueprintTitle: document.querySelector("#blueprintTitle"),
  blueprintState: document.querySelector("#blueprintState"),
  blueprintResult: document.querySelector("#blueprintResult"),
  playgroundLog: document.querySelector("#playgroundLog"),
  wordpressLog: document.querySelector("#wordpressLog"),
  phpLog: document.querySelector("#phpLog"),
};

let selectedCommand = commands[0];
let activeStorage = "temporary";
let blueprintFilter = "All";

function addEvent(label, text, kind = "") {
  const li = document.createElement("li");
  const chipClass = kind ? `state-chip ${kind}` : "state-chip";
  li.innerHTML = `<span class="${chipClass}">${label}</span> ${text}`;
  els.eventList.prepend(li);
}

function groupedCommands() {
  const q = els.commandInput.value.trim().toLowerCase();
  const matches = commands.filter((command) => {
    if (!q) return true;
    const haystack = `${command.group} ${command.title} ${command.summary} ${command.keywords}`.toLowerCase();
    return q.split(/\s+/).every((part) => haystack.includes(part));
  });
  const groups = new Map();
  matches.forEach((command) => {
    if (!groups.has(command.group)) groups.set(command.group, []);
    groups.get(command.group).push(command);
  });
  return { matches, groups };
}

function renderResults() {
  const { matches, groups } = groupedCommands();
  els.commandState.textContent = `${matches.length} grouped result${matches.length === 1 ? "" : "s"}`;
  els.resultGroups.innerHTML = "";

  groups.forEach((items, group) => {
    const section = document.createElement("section");
    section.className = "result-group";
    section.innerHTML = `<h4>${group}</h4>`;
    items.forEach((command) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `result-button${command.id === selectedCommand.id ? " is-active" : ""}`;
      button.dataset.commandId = command.id;
      button.innerHTML = `<strong>${command.title}</strong><span>${command.summary}</span>`;
      section.append(button);
    });
    els.resultGroups.append(section);
  });

  if (!matches.includes(selectedCommand) && matches[0]) {
    selectCommand(matches[0].id, false);
  }
}

function selectCommand(id, rerender = true) {
  selectedCommand = commands.find((command) => command.id === id) || commands[0];
  els.selectedGroup.textContent = selectedCommand.group;
  els.selectedCommandTitle.textContent = selectedCommand.title;
  els.selectedCommandCopy.innerHTML = selectedCommand.summary;
  els.dynamicForm.innerHTML = selectedCommand.form;
  els.replaceWarning.hidden = !selectedCommand.warning;
  els.executeCommand.textContent = selectedCommand.button;
  els.commandResult.textContent = "Command selected. The form is ready and will update the active Playground object when run.";
  els.commandProgress.hidden = true;
  els.progressBar.style.width = "0";
  if (rerender) renderResults();
  focusMatchingPanel(selectedCommand.id);
}

function focusMatchingPanel(id) {
  const tabMap = {
    "save-file": "files",
    "manager-files": "files",
    "run-blueprint": "blueprint",
    "blueprint-url": "blueprint",
    "download-db": "database",
    "zip-import": "launch",
    "github-import": "launch",
    "github-export": "launch",
    "save-browser": "saved",
    "save-local": "saved",
    "delete": "saved",
    "vanilla": "launch",
    "wordpress-pr": "launch",
    "gutenberg-pr": "launch",
  };
  const tab = tabMap[id];
  if (tab) activateTab(tab);
}

function activateTab(tab) {
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tab);
  });
  document.querySelectorAll("[data-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === tab);
  });
}

function simulateProgress(title, steps, done) {
  els.commandProgress.hidden = false;
  els.progressTitle.textContent = title;
  els.progressBar.style.width = "0";
  let index = 0;

  function tick() {
    const step = steps[index];
    els.progressDetail.textContent = step.text;
    els.progressBar.style.width = step.width;
    index += 1;
    if (index < steps.length) {
      window.setTimeout(tick, 360);
    } else {
      window.setTimeout(done, 260);
    }
  }

  tick();
}

function updateStorage(mode, title, identity) {
  activeStorage = mode;
  els.activeTitle.textContent = title;
  els.previewShellTitle.textContent = title;
  els.identityText.textContent = identity;
  els.storageBadge.textContent = mode === "local" ? "Local directory" : mode === "browser" ? "Saved Playground" : "Unsaved Playground";
  els.storageBadge.className = `state-chip ${mode === "temporary" ? "warning" : "green"}`;
  document.querySelector("#settingsConsequence").textContent = mode === "temporary" ? "Temporary reset consequence" : "Stored reload consequence";
  document.querySelector("#settingsCopy").textContent = mode === "temporary"
    ? "Apply Settings & Reset Playground replaces this unsaved site. Saved or local sites use Save & Reload with limited configuration changes."
    : "This stored Playground uses Save & Reload for setting changes. Local-directory storage may need folder permission after browser reload.";
}

function completeSave(mode) {
  const title = mode === "local" ? "Local Directory Playground" : "Research Browser Playground";
  const identity = mode === "local"
    ? "Local folder ~/Sites/playground-lab. Reconnect may be required after permission loss."
    : "Saved in this browser with slug research-browser-playground.";
  updateStorage(mode, title, identity);
  els.pathInput.value = mode === "local" ? "/wp-admin/site-editor.php" : "/research-browser-playground/hello-from-playground/";
  els.previewState.textContent = "Storage updated";
  els.commandResult.textContent = mode === "local"
    ? "Saved to local directory. The active row now uses folder-backed storage and records a reconnect consequence."
    : "Saved in this browser. Shell title, path, storage badge, saved row, and reset/reload consequence were updated.";
  ensureSavedRow(mode);
  addEvent(mode === "local" ? "Local save" : "Browser save", `${title} saved after copying 3,751 files.`, "green");
}

function ensureSavedRow(mode) {
  document.querySelectorAll(".saved-row").forEach((row) => row.classList.remove("active"));
  const existing = document.querySelector(`[data-id="${mode === "local" ? "generated-local" : "generated-browser"}"]`);
  if (existing) {
    existing.classList.add("active");
    return;
  }
  const row = document.createElement("article");
  row.className = "saved-row active";
  row.dataset.id = mode === "local" ? "generated-local" : "generated-browser";
  row.innerHTML = mode === "local"
    ? `<span class="row-mark local">L</span><div><strong>Local Directory Playground</strong><small>~/Sites/playground-lab, reconnect folder after permission loss</small></div><button type="button">Reconnect</button><button type="button">Manage</button><button class="danger-text" type="button" data-command="delete">Delete</button>`
    : `<span class="row-mark">B</span><div><strong>Research Browser Playground</strong><small>Saved in this browser, slug research-browser-playground</small></div><button type="button">Open</button><button type="button">Rename</button><button class="danger-text" type="button" data-command="delete">Delete</button>`;
  els.savedList.prepend(row);
}

function completeZipImport(success) {
  if (!success) {
    els.commandResult.textContent = "ZIP validation failed: selected file is not a Playground ZIP bundle. Active Playground identity was not changed.";
    els.progressTitle.textContent = "Validation failed";
    els.progressDetail.textContent = "No replacement performed";
    els.progressBar.style.width = "100%";
    addEvent("ZIP failed", "theme-export.txt rejected before replacement; active site preserved.", "red");
    return;
  }
  updateStorage("temporary", "Imported ZIP Playground", "Temporary imported archive playground-support-bundle.zip. Save it before refresh.");
  els.pathInput.value = "/wp-admin/";
  els.previewState.textContent = "ZIP import applied";
  els.previewKicker.textContent = "Imported from ZIP";
  els.previewHeadline.textContent = "Imported Playground bundle is running";
  els.previewCopy.textContent = "The selected archive replaced WordPress files and the SQLite-backed database. The shell now points to WP Admin for post-import verification.";
  els.previewMark.textContent = "Replacement completed. Save this imported Playground to browser storage or a local directory to keep it.";
  els.dbSize.textContent = "1.8 MB";
  els.dbState.textContent = "Replaced by ZIP import";
  els.commandResult.textContent = "ZIP import succeeded. Active Playground title, path, database size, preview copy, and transfer history were updated.";
  addEvent("ZIP import", "playground-support-bundle.zip replaced files and database; active identity is Imported ZIP Playground.", "green");
}

function executeSelectedCommand() {
  if (selectedCommand.id === "delete") {
    els.deleteBox.hidden = false;
    els.commandResult.textContent = "Delete confirmation opened. Confirming removes the saved row and updates the active fallback state.";
    activateTab("saved");
    return;
  }

  const source = document.querySelector("#zipSource");
  const zipShouldSucceed = !source || source.value !== "bad";
  const progressSteps = {
    "save-file": [
      { text: "Hashing wp-config.php editor buffer", width: "32%" },
      { text: "Writing /wordpress/wp-config.php", width: "74%" },
      { text: "Refreshing file metadata", width: "100%" },
    ],
    "zip-import": [
      { text: "Validating archive structure", width: "26%" },
      { text: zipShouldSucceed ? "Replacement warning accepted" : "Checking extension and manifest", width: "52%" },
      { text: zipShouldSucceed ? "Replacing files and SQLite database" : "Stopping before replacement", width: "82%" },
      { text: zipShouldSucceed ? "Booting imported WordPress" : "Validation failed", width: "100%" },
    ],
    "run-blueprint": [
      { text: "Fetching Blueprint URL", width: "30%" },
      { text: "Validating blueprint.json", width: "55%" },
      { text: "Running steps against current Playground", width: "82%" },
      { text: "Updating preview and transfer history", width: "100%" },
    ],
    "download-db": [
      { text: "Opening SQLite-backed database", width: "40%" },
      { text: "Packaging database.sqlite", width: "78%" },
      { text: "Download ready", width: "100%" },
    ],
    "save-browser": [
      { text: "Saving 936 / 3,751 files", width: "25%" },
      { text: "Saving 2,408 / 3,751 files", width: "64%" },
      { text: "Saving 3,751 / 3,751 files", width: "100%" },
    ],
    "save-local": [
      { text: "Folder permission granted for ~/Sites/playground-lab", width: "25%" },
      { text: "Writing WordPress files to local directory", width: "68%" },
      { text: "Local directory identity created", width: "100%" },
    ],
  };

  simulateProgress(selectedCommand.title, progressSteps[selectedCommand.id] || [
    { text: "Validating input", width: "30%" },
    { text: "Applying command", width: "70%" },
    { text: "Updating active object", width: "100%" },
  ], () => {
    switch (selectedCommand.id) {
      case "save-file":
        els.fileState.textContent = "Saved";
        els.fileState.className = "state-chip green";
        els.fileDirtyMark.textContent = "saved";
        els.fileDirtyMark.style.color = "#008a20";
        els.fileResult.textContent = "wp-config.php saved. Dirty marker cleared and logs updated.";
        els.wordpressLog.textContent = "[notice] admin logged in\n[ok] wp-config.php saved with WP_DEBUG_LOG enabled";
        els.previewState.textContent = "File saved";
        els.commandResult.textContent = "Command completed. The selected file is no longer dirty, the preview state changed, and the event ledger recorded the write.";
        addEvent("File saved", "<code>/wordpress/wp-config.php</code> dirty editor buffer was written to the active Playground.", "green");
        break;
      case "zip-import":
        completeZipImport(zipShouldSucceed);
        break;
      case "run-blueprint":
      case "blueprint-url":
        completeBlueprintRun();
        break;
      case "download-db":
        completeDatabaseDownload();
        break;
      case "save-browser":
        completeSave("browser");
        break;
      case "save-local":
        completeSave("local");
        break;
      case "github-import":
        updateStorage("temporary", "GitHub Import Playground", "Imported from WordPress/wordpress-playground. Token is not stored after refresh.");
        els.previewState.textContent = "GitHub import complete";
        els.commandResult.textContent = "GitHub import completed after account connection. Active identity updated; token persistence warning remains visible.";
        addEvent("GitHub import", "Repository imported after session-only account connection.", "green");
        break;
      case "github-export":
        els.commandResult.textContent = "Export completed to wp-playground-labs/research-browser on branch playground-export. Token will not persist after refresh.";
        addEvent("GitHub export", "Current Playground pushed to repository branch playground-export.", "green");
        break;
      case "download-zip":
        addEvent("ZIP download", "Active Playground packaged as research-browser-playground.zip.", "green");
        break;
      case "manager-files":
        activateTab("files");
        els.commandResult.textContent = "Site Manager Files tab focused while the live WordPress shell remains visible.";
        addEvent("Manager", "Files tab opened beside live preview.", "blue");
        break;
      default:
        completeLaunch(selectedCommand.id);
    }
  });
}

function completeLaunch(id) {
  const labels = {
    vanilla: "Vanilla WordPress Playground",
    "wordpress-pr": "WordPress PR Preview",
    "gutenberg-pr": "Gutenberg Branch Preview",
  };
  updateStorage("temporary", labels[id] || selectedCommand.title, "Temporary preview route. Save before refresh to preserve this generated Playground.");
  els.pathInput.value = id === "vanilla" ? "/hello-from-playground/" : "/wp-admin/";
  els.previewState.textContent = "Launch route ready";
  els.commandResult.textContent = `${selectedCommand.title} completed. The active shell identity and path now reflect the selected route.`;
  addEvent("Launch", `${selectedCommand.title} created a temporary active Playground.`, "blue");
}

function completeBlueprintRun() {
  updateStorage("temporary", "Coffee Shop Blueprint", "Temporary Blueprint result. Save it before refresh or close.");
  els.pathInput.value = "/";
  els.blueprintState.textContent = "Validated and run";
  els.blueprintState.className = "state-chip green";
  els.blueprintResult.textContent = "Blueprint ran successfully. Current content was replaced and the preview now shows the selected Coffee Shop Blueprint.";
  els.previewKicker.textContent = "Blueprint result";
  els.previewHeadline.textContent = "Coffee Shop Blueprint is active";
  els.previewCopy.textContent = "Blueprint JSON validated, bundle actions are available, and the active WordPress shell has been replaced with the selected site setup.";
  els.commandResult.textContent = "Blueprint command completed. Title, path, preview, validation state, and transfer history were updated.";
  addEvent("Blueprint", "Coffee Shop Blueprint validated and replaced the current Playground content.", "green");
}

function completeDatabaseDownload() {
  els.dbState.textContent = "database.sqlite downloaded";
  els.databaseOutcome.textContent = "database.sqlite ready";
  els.databaseCopy.textContent = "The SQLite-backed database was packaged from /wordpress/wp-content/database/.ht.sqlite and added to transfer history.";
  els.commandResult.textContent = "Database download completed. Database state and transfer history were updated.";
  addEvent("Database", "<code>database.sqlite</code> downloaded from SQLite-backed database path.", "green");
}

function renderBlueprints() {
  const q = els.blueprintSearch.value.trim().toLowerCase();
  const visible = blueprints.filter((item) => {
    const filterMatch = blueprintFilter === "All" || item.tags.includes(blueprintFilter);
    const textMatch = !q || `${item.title} ${item.copy} ${item.tags.join(" ")}`.toLowerCase().includes(q);
    return filterMatch && textMatch;
  });
  els.blueprintList.innerHTML = "";
  visible.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `blueprint-card${index === 0 ? " is-active" : ""}`;
    button.innerHTML = `<span class="thumb ${item.thumb}"></span><span><strong>${item.title}</strong><span>${item.copy}</span></span>`;
    button.addEventListener("click", () => {
      document.querySelectorAll(".blueprint-card").forEach((card) => card.classList.remove("is-active"));
      button.classList.add("is-active");
      els.blueprintTitle.textContent = item.title;
      els.blueprintResult.textContent = `${item.title} selected from an honestly labeled representative subset of the 43 Blueprint catalog. Validate before running.`;
      addEvent("Blueprint selected", `${item.title} selected from gallery subset.`, "blue");
    });
    els.blueprintList.append(button);
  });
}

document.addEventListener("click", (event) => {
  const commandButton = event.target.closest("[data-command]");
  if (commandButton) {
    selectCommand(commandButton.dataset.command);
    document.querySelector(".command-search").scrollIntoView({ block: "nearest" });
  }

  const resultButton = event.target.closest("[data-command-id]");
  if (resultButton) {
    selectCommand(resultButton.dataset.commandId);
  }

  const tabButton = event.target.closest("[data-tab]");
  if (tabButton) {
    activateTab(tabButton.dataset.tab);
  }

  const queryButton = event.target.closest("[data-query]");
  if (queryButton) {
    els.commandInput.value = queryButton.dataset.query;
    renderResults();
    addEvent("Search", `Command query changed to <code>${queryButton.dataset.query}</code>.`, "blue");
  }

  const filterButton = event.target.closest("[data-blueprint-filter]");
  if (filterButton) {
    blueprintFilter = filterButton.dataset.blueprintFilter;
    document.querySelectorAll("[data-blueprint-filter]").forEach((button) => button.classList.toggle("is-active", button === filterButton));
    renderBlueprints();
  }
});

els.commandInput.addEventListener("input", renderResults);
els.executeCommand.addEventListener("click", executeSelectedCommand);
els.cancelCommand.addEventListener("click", () => {
  els.commandProgress.hidden = true;
  els.commandResult.textContent = "Command canceled before mutation. Active Playground object is unchanged.";
  addEvent("Canceled", `${selectedCommand.title} canceled before mutation.`, "warning");
});

document.querySelector("#confirmDeleteButton").addEventListener("click", () => {
  const row = document.querySelector('[data-id="research"]');
  if (row) row.remove();
  els.deleteBox.hidden = true;
  updateStorage("temporary", "Unsaved Playground", "Temporary fallback after deleting the saved browser copy.");
  els.pathInput.value = "/hello-from-playground/";
  els.commandResult.textContent = "Delete completed. Saved row removed and active shell fell back to Unsaved Playground.";
  addEvent("Deleted", "Research Browser Playground removed from browser storage; active shell fell back to Unsaved Playground.", "red");
});

document.querySelector("#cancelDeleteButton").addEventListener("click", () => {
  els.deleteBox.hidden = true;
  els.commandResult.textContent = "Delete canceled. Saved row and active Playground remain unchanged.";
  addEvent("Delete canceled", "Saved Playground deletion canceled before removal.", "warning");
});

document.querySelector("#downloadDbButton").addEventListener("click", () => {
  selectCommand("download-db");
  executeSelectedCommand();
});

document.querySelector("#adminerButton").addEventListener("click", () => {
  els.databaseOutcome.textContent = "Adminer opened";
  els.databaseCopy.textContent = "Adminer opened in a database tool window for the SQLite-backed MySQL emulation.";
  addEvent("Adminer", "Adminer opened for /wordpress/wp-content/database/.ht.sqlite.", "blue");
});

document.querySelector("#phpmyadminButton").addEventListener("click", () => {
  els.databaseOutcome.textContent = "phpMyAdmin opened";
  els.databaseCopy.textContent = "phpMyAdmin opened for the emulated MySQL database.";
  addEvent("phpMyAdmin", "phpMyAdmin opened for database inspection.", "blue");
});

document.querySelector("#validateBlueprintButton").addEventListener("click", () => {
  els.blueprintState.textContent = "Valid JSON";
  els.blueprintState.className = "state-chip green";
  els.blueprintResult.textContent = "Blueprint JSON is valid. Running it will replace current content and update the preview.";
  addEvent("Blueprint", "blueprint.json validated successfully.", "green");
});

document.querySelector("#runBlueprintButton").addEventListener("click", () => {
  selectCommand("run-blueprint");
  executeSelectedCommand();
});

document.querySelector("#copyBlueprintButton").addEventListener("click", () => {
  els.blueprintResult.textContent = "Blueprint link copied to clipboard state.";
  addEvent("Blueprint", "Shareable Blueprint link copied.", "blue");
});

document.querySelector("#downloadBlueprintButton").addEventListener("click", () => {
  els.blueprintResult.textContent = "Blueprint bundle downloaded.";
  addEvent("Blueprint", "Blueprint bundle downloaded.", "green");
});

document.querySelector("#downloadZipButton").addEventListener("click", () => {
  addEvent("ZIP download", "research-browser-playground.zip generated from active Playground.", "green");
});

document.querySelector("#exportGithubButton").addEventListener("click", () => {
  selectCommand("github-export");
});

document.querySelector("#clearHistoryButton").addEventListener("click", () => {
  els.eventList.innerHTML = "<li><span class=\"state-chip\">History</span> Resolved operations cleared from this view.</li>";
});

document.querySelector("#homeButton").addEventListener("click", () => {
  els.pathInput.value = "/hello-from-playground/";
  els.previewState.textContent = "Homepage";
  addEvent("Navigation", "Homepage opened in the protected live shell.", "blue");
});

document.querySelector("#adminButton").addEventListener("click", () => {
  els.pathInput.value = "/wp-admin/";
  els.previewState.textContent = "WP Admin";
  addEvent("Navigation", "WP Admin opened in the protected live shell.", "blue");
});

document.querySelector("#refreshButton").addEventListener("click", () => {
  els.previewState.textContent = "Refreshed";
  addEvent("Refresh", `Active WordPress path <code>${els.pathInput.value}</code> refreshed.`, "blue");
});

document.querySelector("#resetSettingsButton").addEventListener("click", () => {
  updateStorage("temporary", "Reset Playground", "Temporary site reset after settings change. Save before refresh.");
  els.previewState.textContent = "Reset complete";
  addEvent("Reset", "Apply Settings & Reset Playground replaced the temporary runtime.", "red");
});

document.querySelector("#saveReloadButton").addEventListener("click", () => {
  els.previewState.textContent = "Save & Reload complete";
  addEvent("Reload", `${activeStorage === "temporary" ? "Temporary" : "Stored"} Playground reloaded after settings save.`, "green");
});

["newFileButton", "newFolderButton", "uploadButton", "browseFilesButton", "discardFileButton"].forEach((id) => {
  document.querySelector(`#${id}`).addEventListener("click", () => {
    const labels = {
      newFileButton: "New file created: /wordpress/wp-content/debug-note.php",
      newFolderButton: "New folder created: /wordpress/wp-content/mu-plugins",
      uploadButton: "Upload finished: plugin-test.zip staged in wp-content/uploads",
      browseFilesButton: "Native file browser opened and returned wp-config.php",
      discardFileButton: "Dirty editor changes discarded for wp-config.php",
    };
    if (id === "discardFileButton") {
      els.fileState.textContent = "Clean";
      els.fileState.className = "state-chip";
      els.fileDirtyMark.textContent = "clean";
    }
    els.fileResult.textContent = labels[id];
    addEvent("Files", labels[id], id === "discardFileButton" ? "warning" : "blue");
  });
});

els.blueprintSearch.addEventListener("input", renderBlueprints);

renderResults();
selectCommand("save-file", false);
renderBlueprints();
