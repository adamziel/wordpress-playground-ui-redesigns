const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const state = {
  name: "Unsaved Playground",
  storage: "temporary",
  identity: "no slug yet",
  folder: "",
  path: "/hello-from-playground/",
  runtime: "WP latest / PHP 8.3",
  command: "save-local",
  manager: "settings",
  localPermission: "not requested",
  blueprintFilter: "All",
};

const commandTitles = {
  "save-local": "Save to local directory",
  "save-browser": "Save in this browser",
  "route-vanilla": "Vanilla WordPress",
  "route-wp-pr": "WordPress PR",
  "route-gutenberg": "Gutenberg PR or branch",
  "route-github": "From GitHub",
  "route-blueprint-url": "Blueprint URL",
  "route-zip": "Import .zip",
  rename: "Rename Playground",
  delete: "Delete saved Playground",
  settings: "Settings",
  files: "Files",
  blueprint: "Blueprint tools",
  database: "Database and logs",
  "export-github": "Export to GitHub",
  "download-zip": "Download as .zip",
  "download-database": "Download database.sqlite",
};

const managerSummaries = {
  settings: "Settings selected: saved sites reload; unsaved sites reset and lose temporary changes.",
  files: "Files selected: create file, create folder, upload, browse files, edit wp-config.php, and save dirty state.",
  blueprint: "Blueprint selected: gallery search, current blueprint.json, copy link, download bundle, validate, and run.",
  database: "Database selected: MySQL emulation backed by SQLite at /wordpress/wp-content/database/.ht.sqlite, 452 KB.",
  logs: "Logs selected: Playground boot clean, WordPress notice recorded, PHP memory stable.",
};

const blueprints = [
  { name: "Art Gallery", tag: "Website", desc: "Vueo theme gallery" },
  { name: "Coffee Shop", tag: "WooCommerce", desc: "Storefront with products" },
  { name: "Feed Reader with the Friends Plugin", tag: "Content", desc: "Social web feed reader" },
  { name: "Gaming News", tag: "News", desc: "Spiel news theme" },
  { name: "Non-profit Organization", tag: "Website", desc: "Koinonia theme site" },
  { name: "Personal Blog", tag: "Personal", desc: "Substrata journal" },
];

function timeStamp() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function storageLabel() {
  if (state.storage === "local") return "local directory";
  if (state.storage === "browser") return "saved in browser";
  return "not saved";
}

function storageClass() {
  if (state.storage === "local" || state.storage === "browser") return "status-chip ok";
  return "status-chip warn";
}

function reloadConsequence() {
  if (state.storage === "local") return "refresh asks to reconnect folder permission";
  if (state.storage === "browser") return "refresh restores browser-backed slug";
  return "refresh closes the site unless saved";
}

function addEvent(message) {
  const item = document.createElement("li");
  item.innerHTML = `<span>${timeStamp()}</span>${message}`;
  $("#eventList").prepend(item);
  $("#lastEvent").textContent = message;
  $("#transferHistory").textContent = message;
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "saved-playground";
}

function updateShell() {
  $("#storageBadge").textContent = state.storage === "temporary" ? "Unsaved Playground" : state.storage === "local" ? "Local directory" : "Saved Playground";
  $("#storageBadge").className = storageClass();
  $("#miniObjectStorage").textContent = storageLabel();
  $("#miniObjectStorage").className = storageClass();
  $("#runtimeBadge").textContent = state.runtime;
  $("#pathInput").value = state.path;
  $("#previewPath").textContent = state.path;
  $("#objectName").textContent = state.name;
  $("#miniObjectName").textContent = state.name;
  $("#objectStorage").textContent = state.storage === "local" ? `local folder: ${state.folder}` : state.storage === "browser" ? "browser storage" : "temporary memory";
  $("#objectIdentity").textContent = state.identity;
  $("#reloadConsequence").textContent = reloadConsequence();
  $("#selectedCommandLabel").textContent = commandTitles[state.command];
  $("#rowActiveName").textContent = state.name;
  $("#rowActiveMeta").textContent = `${storageLabel()} - ${reloadConsequence()}`;
  $("#previewTitle").textContent = state.path === "/wp-admin/" ? "WP Admin Dashboard" : "My WordPress Website";
}

function ensureActiveRow() {
  let row = $('[data-row="active"]');
  if (!row) return;
  row.classList.add("active");
  row.classList.remove("deleted");
}

function setCommand(command) {
  state.command = command;
  $$(".command-result").forEach((button) => {
    button.classList.toggle("active", button.dataset.command === command);
  });
  $$(".command-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.commandCard === command);
  });
  $("#detailTitle").textContent = commandTitles[command];
  updateShell();
}

function setManager(manager) {
  state.manager = manager;
  $$(".manager-tabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.manager === manager);
  });
  $("#managerSummary").textContent = managerSummaries[manager] || managerSummaries.settings;
}

function animateProgress({ card, bar, text, steps, done }) {
  let index = 0;
  card.hidden = false;
  bar.style.width = "0%";

  function tick() {
    const step = steps[index];
    text.textContent = step.label;
    bar.style.width = `${step.percent}%`;
    index += 1;
    if (index < steps.length) {
      window.setTimeout(tick, 330);
    } else {
      window.setTimeout(done, 280);
    }
  }

  tick();
}

function saveLocal() {
  const name = $("#localName").value.trim() || "Local Playground";
  const folder = "/Users/admin/Playgrounds/command-search-cockpit";
  state.localPermission = "granted";
  $("#localPermission").textContent = "Folder permission: granted for this browser session";
  $("#localFolder").value = folder;

  animateProgress({
    card: $("#localProgress"),
    bar: $("#localProgressBar"),
    text: $("#localProgressText"),
    steps: [
      { label: "Folder picker returned command-search-cockpit...", percent: 15 },
      { label: "Writing 1140 / 3751 WordPress files to local directory...", percent: 38 },
      { label: "Writing 3028 / 3751 files and wp-content assets...", percent: 72 },
      { label: "Syncing SQLite database and blueprint.json...", percent: 92 },
      { label: "Local directory save complete.", percent: 100 },
    ],
    done() {
      state.name = name;
      state.storage = "local";
      state.folder = folder;
      state.identity = `local: ${folder}`;
      $("#localResult").textContent = `Result: ${name} is saved to ${folder}. Reloading later asks to reconnect this folder before opening.`;
      $("#previewState").textContent = "local sync complete";
      $("#previewState").className = "status-chip ok";
      ensureActiveRow();
      updateShell();
      addEvent(`Local-directory save completed for ${name}; folder identity attached and reload consequence changed.`);
    },
  });
}

function saveBrowser() {
  const name = $("#browserName").value.trim() || "Saved Playground";
  const slug = slugify($("#browserSlug").value || name);

  animateProgress({
    card: $("#browserProgress"),
    bar: $("#browserProgressBar"),
    text: $("#browserProgressText"),
    steps: [
      { label: "Saving 482 / 3751 files to browser storage...", percent: 18 },
      { label: "Saving 1864 / 3751 files to browser storage...", percent: 48 },
      { label: "Saving 3028 / 3751 files to browser storage...", percent: 78 },
      { label: "Saved 3751 / 3751 files.", percent: 100 },
    ],
    done() {
      state.name = name;
      state.storage = "browser";
      state.identity = `browser: ${slug}`;
      $("#browserResult").textContent = `Result: ${name} is saved in this browser at /${slug}/.`;
      $("#previewState").textContent = "browser save complete";
      $("#previewState").className = "status-chip ok";
      updateShell();
      addEvent(`Browser save completed; slug /${slug}/ inserted into the saved list.`);
    },
  });
}

function startRoute(label) {
  state.name = label;
  state.storage = "temporary";
  state.identity = "preview route, not saved";
  state.path = label.includes("WP Admin") ? "/wp-admin/" : "/hello-from-playground/";
  $("#previewState").textContent = "route loaded";
  $("#previewState").className = "status-chip";
  updateShell();
  addEvent(`${label} route started; active Playground replaced and marked temporary.`);
}

function renamePlayground() {
  const nextName = $("#renameInput").value.trim() || "Renamed Playground";
  state.name = nextName;
  if (state.storage === "browser") {
    state.identity = `browser: ${slugify(nextName)}`;
  }
  updateShell();
  addEvent(`Renamed active Playground to ${nextName}; shell title and saved row updated.`);
}

function deletePlayground() {
  const deletedName = state.name;
  $('[data-row="active"]').classList.add("deleted");
  $("#deleteResult").textContent = `${deletedName} deleted. Active shell fell back to a new Unsaved Playground.`;
  state.name = "Unsaved Playground";
  state.storage = "temporary";
  state.identity = "no slug yet";
  state.folder = "";
  state.path = "/hello-from-playground/";
  updateShell();
  window.setTimeout(() => $('[data-row="active"]').classList.remove("deleted"), 700);
  addEvent(`Deleted ${deletedName}; saved/local identity removed and temporary fallback opened.`);
}

function setPath(path) {
  state.path = path;
  updateShell();
  if (path === "/wp-admin/") {
    $("#siteCanvas").innerHTML = `
      <div class="site-copy">
        <p class="eyebrow" id="previewPath">/wp-admin/</p>
        <h3>Dashboard</h3>
        <p>Welcome to WordPress. The admin remains inside the protected Playground shell while command results and ledgers stay visible.</p>
        <p class="highlight">Site Health: one plugin notice, no fatal errors.</p>
        <button class="wp-button" type="button">Open Site Editor</button>
      </div>
      <div class="preview-symbol" aria-hidden="true">W</div>
    `;
  } else {
    $("#siteCanvas").innerHTML = `
      <div class="site-copy">
        <p class="eyebrow" id="previewPath">${path}</p>
        <h3>Hello from <span>WordPress Playground!</span></h3>
        <p>This Playground runs client-side in your browser. It is ready for training, plugin tests, theme demos, and PR reviews.</p>
        <p class="highlight">You are logged in as admin.</p>
        <button class="wp-button" type="button">Discover the mission behind Playground</button>
      </div>
      <div class="preview-symbol" aria-hidden="true">W</div>
    `;
  }
  addEvent(`Navigated live shell to ${path}.`);
}

function completeTransfer(label, detail) {
  $("#previewState").textContent = label;
  $("#previewState").className = "status-chip ok";
  addEvent(detail);
}

function renderBlueprints(filter = "All") {
  const grid = $("#blueprintGrid");
  const query = ($("#blueprintSearch")?.value || "").trim().toLowerCase();
  const matches = blueprints.filter((item) => {
    const matchesFilter = filter === "All" || item.tag === filter;
    const haystack = `${item.name} ${item.tag} ${item.desc}`.toLowerCase();
    return matchesFilter && (!query || haystack.includes(query));
  });
  grid.innerHTML = "";
  $("#blueprintSubsetLabel").textContent = `Showing ${matches.length} representative entries from the captured 43-blueprint gallery.`;
  matches
    .forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `blueprint-card${index === 0 ? " active" : ""}`;
      button.innerHTML = `<strong>${item.name}</strong><span>${item.tag} - ${item.desc}</span>`;
      button.addEventListener("click", () => {
        $$(".blueprint-card").forEach((card) => card.classList.remove("active"));
        button.classList.add("active");
        $("#selectedBlueprint").textContent = `Selected: ${item.name}`;
        $("#blueprintResult").textContent = `Validation: ${item.name} selected from representative subset of 43 blueprints.`;
        addEvent(`Blueprint selected: ${item.name}.`);
      });
      grid.append(button);
    });
}

function wireEvents() {
  $$("[data-command]").forEach((button) => {
    button.addEventListener("click", () => {
      setCommand(button.dataset.command);
      if (button.dataset.managerJump) setManager(button.dataset.managerJump);
    });
  });

  $$(".manager-tabs button[data-manager]").forEach((button) => {
    button.addEventListener("click", () => setManager(button.dataset.manager));
  });

  $("#commandSearch").addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();
    $$(".command-result").forEach((button) => {
      const haystack = `${button.textContent} ${button.dataset.keywords || ""}`.toLowerCase();
      button.hidden = query && !haystack.includes(query);
    });
  });

  $("#pathInput").addEventListener("change", (event) => setPath(event.target.value || "/"));
  $("#refreshButton").addEventListener("click", () => addEvent(`Refreshed ${state.path}; preview preserved in the right shell.`));
  $("#homeButton").addEventListener("click", () => setPath("/hello-from-playground/"));
  $("#adminButton").addEventListener("click", () => setPath("/wp-admin/"));
  $$("[data-path]").forEach((button) => button.addEventListener("click", () => setPath(button.dataset.path)));

  $("#openFolderPicker").addEventListener("click", () => {
    $("#localFolder").value = "/Users/admin/Playgrounds/command-search-cockpit";
    $("#localPermission").textContent = "Folder permission: picker returned a folder, waiting for grant";
    addEvent("Local folder picker opened and command-search-cockpit selected.");
  });
  $("#denyLocalPermission").addEventListener("click", () => {
    $("#localPermission").textContent = "Folder permission: denied, local save blocked";
    $("#localResult").textContent = "Result: no files written. Choose a folder and grant permission to finish local save.";
    addEvent("Local-directory save denied before file copy; active Playground remains temporary.");
  });
  $("#grantLocalPermission").addEventListener("click", saveLocal);
  $("#saveBrowser").addEventListener("click", saveBrowser);
  $("#renameButton").addEventListener("click", renamePlayground);
  $("#cancelDelete").addEventListener("click", () => {
    $("#deleteResult").textContent = "Delete canceled; active saved object is unchanged.";
    addEvent("Delete confirmation canceled; no row removed.");
  });
  $("#confirmDelete").addEventListener("click", deletePlayground);

  $$("[data-start-route]").forEach((button) => {
    button.addEventListener("click", () => startRoute(button.dataset.startRoute));
  });
  $("#connectGithub").addEventListener("click", () => {
    state.name = `GitHub import: ${$("#githubRepo").value}`;
    state.storage = "temporary";
    state.identity = "github import, token not stored";
    updateShell();
    completeTransfer("GitHub import complete", `GitHub import completed from ${$("#githubRepo").value}; session token will not survive refresh.`);
  });
  $("#validateBlueprintUrl").addEventListener("click", () => {
    $("#blueprintResult").textContent = "Validation: Blueprint URL is reachable and has a landingPage step.";
    addEvent("Blueprint URL validated without running replacement.");
  });
  $("#importZip").addEventListener("click", () => {
    state.name = "Imported ZIP Playground";
    state.storage = "temporary";
    state.identity = "zip import, not saved";
    updateShell();
    completeTransfer("ZIP imported", "ZIP import confirmed; files and SQLite database replaced on the active Playground.");
  });

  $("#applySettings").addEventListener("click", () => {
    state.runtime = `${$("#wpVersion").value} / ${$("#phpVersion").value}`;
    updateShell();
    const action = state.storage === "temporary" ? "Apply Settings & Reset completed; temporary files and database rebuilt." : "Save & Reload completed for stored Playground.";
    completeTransfer("runtime reloaded", action);
  });

  $("#fileEditor").addEventListener("input", () => {
    $("#fileStatus").textContent = "dirty";
    $("#fileStatus").className = "status-chip warn";
  });
  $("#newFileButton").addEventListener("click", () => addEvent("New File command opened for /wordpress/wp-content/."));
  $("#newFolderButton").addEventListener("click", () => addEvent("New Folder command opened for /wordpress/wp-content/."));
  $("#uploadButton").addEventListener("click", () => addEvent("Upload command completed: mu-plugin-loader.php staged in wp-content/mu-plugins."));
  $("#browseButton").addEventListener("click", () => addEvent("Browse files opened and selected /wordpress/wp-config.php."));
  $("#saveFileButton").addEventListener("click", () => {
    $("#fileStatus").textContent = "saved";
    $("#fileStatus").className = "status-chip ok";
    completeTransfer("file saved", "Saved /wordpress/wp-config.php; dirty marker cleared and WordPress log updated.");
  });

  $$(".filter").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".filter").forEach((filter) => filter.classList.remove("active"));
      button.classList.add("active");
      state.blueprintFilter = button.dataset.filter;
      renderBlueprints(state.blueprintFilter);
    });
  });
  $("#blueprintSearch").addEventListener("input", () => renderBlueprints(state.blueprintFilter));
  $("#copyBlueprint").addEventListener("click", () => completeTransfer("blueprint copied", "Blueprint bundle link copied to clipboard state."));
  $("#downloadBlueprint").addEventListener("click", () => completeTransfer("blueprint downloaded", "Blueprint bundle download generated for the selected Blueprint."));
  $("#runBlueprint").addEventListener("click", () => {
    state.name = "Art Gallery Blueprint Playground";
    state.storage = "temporary";
    state.identity = "blueprint run, not saved";
    updateShell();
    $("#blueprintResult").textContent = "Run result: Art Gallery Blueprint applied and preview replaced.";
    completeTransfer("blueprint applied", "Blueprint run completed; active Playground content and preview state replaced.");
  });

  function databaseDownload() {
    $("#databaseSize").textContent = "452 KB - downloaded";
    completeTransfer("database downloaded", "database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite.");
  }
  $("#downloadDatabase").addEventListener("click", databaseDownload);
  $("#downloadDatabaseAlt").addEventListener("click", databaseDownload);
  $("#openAdminer").addEventListener("click", () => completeTransfer("Adminer opened", "Adminer opened against the SQLite-backed database."));
  $("#openPhpMyAdmin").addEventListener("click", () => completeTransfer("phpMyAdmin opened", "phpMyAdmin opened against the SQLite-backed database."));
  $("#exportGithub").addEventListener("click", () => completeTransfer("GitHub export complete", `Exported active Playground to ${$("#exportRepo").value}:${$("#exportBranch").value}; account token remains session-only.`));
  $("#downloadZip").addEventListener("click", () => completeTransfer("zip generated", "Download as .zip generated with files, database, and blueprint.json."));
}

renderBlueprints();
wireEvents();
updateShell();
