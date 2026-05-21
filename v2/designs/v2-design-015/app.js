const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const routeCopy = {
  gutenberg: {
    title: "Preview a Gutenberg PR or branch",
    label: "PR number, URL, or branch name",
    value: "try/wp-6-9-command-palette",
    hint: "Accepts Gutenberg PR URLs, PR numbers, or public branch names. A valid preview enables Save, Export to GitHub, Download as zip, and Site Manager tools.",
    button: "Validate & preview branch",
  },
  wordpress: {
    title: "Preview a WordPress PR",
    label: "PR number or URL",
    value: "https://github.com/WordPress/wordpress-develop/pull/6728",
    hint: "WordPress PR previews require a PR number or wordpress-develop pull request URL.",
    button: "Validate & preview PR",
  },
  vanilla: {
    title: "Start Vanilla WordPress",
    label: "Starting point",
    value: "latest WordPress, PHP 8.3, English (United States)",
    hint: "Starts a fresh temporary Playground immediately. Unsaved files and database state are replaced.",
    button: "Start fresh Playground",
  },
  github: {
    title: "Import from GitHub",
    label: "Repository path",
    value: "wordpress/wordpress-playground",
    hint: "Imports plugins, themes, or wp-content directories from public repositories after account connection. The access token is not stored after refresh.",
    button: "Connect & import",
  },
  "blueprint-url": {
    title: "Run Blueprint from URL",
    label: "Blueprint URL",
    value: "https://playground.wordpress.net/blueprints/art-gallery/blueprint.json",
    hint: "Validates a remote blueprint.json before running it against the active Playground.",
    button: "Validate & run Blueprint",
  },
  zip: {
    title: "Import .zip",
    label: "Selected archive",
    value: "playground-export.zip",
    hint: "The current product opens the native file chooser. This static wireframe shows the selected file, validation, replacement warning, progress, and result.",
    button: "Validate selected zip",
  },
};

const state = {
  siteName: "Unsaved Playground",
  saved: false,
  storage: "temporary",
  identity: "temp: unsaved-runtime",
  path: "/hello-from-playground/",
  runtime: "WP latest / PHP 8.3",
  route: "gutenberg",
  activeSaved: false,
  exportAvailable: false,
};

function stamp() {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "saved-playground";
}

function event(message, tone = "good") {
  const item = document.createElement("li");
  item.innerHTML = `<span>${stamp()}</span> ${message}`;
  $("#eventStream").prepend(item);
  $("#eventStatus").className = `chip ${tone}`;
  $("#eventStatus").textContent = tone === "warn" ? "Attention" : tone === "danger" ? "Changed" : "Updated";
}

function setProgress(ids, steps, done) {
  const box = $(ids.box);
  const text = $(ids.text);
  const bar = $(ids.bar);
  let index = 0;
  box.hidden = false;
  bar.style.inlineSize = "0%";

  function tick() {
    const step = steps[index];
    text.textContent = step.label;
    bar.style.inlineSize = `${step.percent}%`;
    index += 1;
    if (index < steps.length) {
      window.setTimeout(tick, 360);
    } else {
      window.setTimeout(() => {
        done();
      }, 280);
    }
  }

  tick();
}

function updateShell() {
  $("#shellTitle").textContent = state.siteName;
  $("#identityValue").textContent = state.identity;
  $("#pathInput").value = state.path;
  $("#previewPathLabel").textContent = state.path;
  $("#browserAddress").textContent = `playground.wordpress.net${state.path}`;
  $("#storageBadge").textContent = state.saved
    ? state.storage === "local"
      ? "Local directory"
      : "Saved Playground"
    : "Unsaved Playground";
  $("#storageBadge").className = `chip ${state.saved ? "good" : "warn"}`;
  $("#runtimeBadge").textContent = state.runtime;
  $("#objectSubtitle").textContent = state.saved
    ? state.storage === "local"
      ? "Local-directory backed Playground. Refresh requires permission to reconnect the selected folder."
      : "Browser-saved Playground. Refresh restores this identity and slug from browser storage."
    : "Temporary runtime. Refresh or reset discards files and the SQLite database until a save destination is completed.";
  $("#resetMode").textContent = state.saved ? "Save & Reload" : "Apply Settings & Reset";
  $("#transferState").textContent = state.exportAvailable ? "Save and export available" : "No durable destination";
  $("#saveStateChip").textContent = state.saved ? "Saved state" : "Unsaved state";
  $("#saveStateChip").className = `chip ${state.saved ? "good" : "warn"}`;
  $("#settingsConsequence").textContent = state.saved ? "Stored Save & Reload" : "Unsaved destructive reset";
  $("#settingsAction").textContent = state.saved ? "Save & Reload" : "Apply Settings & Reset";
  $("#settingsConsequenceText").textContent = state.saved
    ? "Stored Playgrounds keep limited settings and reload into the same saved identity."
    : "Temporary Playgrounds use Apply Settings & Reset, replacing files, database, logs, and current path.";
  $("#activeRowName").textContent = state.siteName;
  $("#activeRowMeta").textContent = state.saved
    ? state.storage === "local"
      ? `Local directory - ${state.identity.replace("local directory: ", "")}`
      : `Saved in this browser - slug ${state.identity.replace("browser: ", "")}`
    : "Temporary - not saved to browser storage";
  $("#savedCount").textContent = state.saved ? "3 saved rows" : "1 temporary, 2 saved";
}

function setPath(path) {
  state.path = path;
  updateShell();

  if (path === "/wp-admin/") {
    $("#siteCanvas").innerHTML = `
      <article>
        <p class="route-label" id="previewPathLabel">/wp-admin/</p>
        <h2>Dashboard</h2>
        <p>Welcome to WordPress. The admin area remains inside the protected Playground shell with the transfer deck still available.</p>
        <p class="highlight">Site Manager, database downloads, logs, and exports are available without losing WP Admin context.</p>
        <button class="wpbutton" type="button">Open Site Editor</button>
      </article>
      <aside class="preview-card">
        <strong id="previewCardTitle">WP Admin active</strong>
        <span id="previewCardText">Logged in as admin. Current object: ${state.siteName}.</span>
        <div class="mini-progress"><span id="previewMeter" style="inline-size: 66%"></span></div>
      </aside>`;
  } else if (path.includes("site-editor")) {
    $("#siteCanvas").innerHTML = `
      <article>
        <p class="route-label" id="previewPathLabel">${path}</p>
        <h2>Gutenberg branch <span>preview ready</span></h2>
        <p>The branch route validated, loaded WordPress Admin, and attached save/export actions to the same active Playground object.</p>
        <p class="highlight">Save is now available. Export to GitHub and Download as zip use this resulting preview identity.</p>
        <button class="wpbutton" type="button">Review Site Editor changes</button>
      </article>
      <aside class="preview-card">
        <strong id="previewCardTitle">Preview identity created</strong>
        <span id="previewCardText">${state.identity}</span>
        <div class="mini-progress"><span id="previewMeter" style="inline-size: 82%"></span></div>
      </aside>`;
  } else {
    $("#siteCanvas").innerHTML = `
      <article>
        <p class="route-label" id="previewPathLabel">${path}</p>
        <h2>Hello from <span>WordPress Playground!</span></h2>
        <p>This is Playground, a WordPress that runs client-side in your browser. It is ready for training, plugin checks, PR reviews, and testing purposes.</p>
        <p class="highlight">You are logged in as admin. Save to browser storage or a local directory to keep this runtime after refresh.</p>
        <button class="wpbutton" type="button">Discover the mission behind Playground</button>
      </article>
      <aside class="preview-card">
        <strong id="previewCardTitle">Live shell protected</strong>
        <span id="previewCardText">The transfer deck changes the same active object instead of opening disconnected modal islands.</span>
        <div class="mini-progress"><span id="previewMeter"></span></div>
      </aside>`;
  }
}

function openPanel(panel) {
  $$(".deck-tabs button").forEach((button) => button.classList.toggle("active", button.dataset.panel === panel));
  $$("[data-panel-view]").forEach((view) => view.classList.toggle("active", view.dataset.panelView === panel));
  const title = {
    launch: "Launch and import routes",
    save: "Save destinations",
    transfer: "Portability transfers",
    manager: "Site Manager",
    blueprints: "Blueprint gallery",
  };
  $("#panelTitle").textContent = title[panel];
}

function openManager(panel) {
  $$(".manager-tabs button").forEach((button) => button.classList.toggle("active", button.dataset.manager === panel));
  $$("[data-manager-view]").forEach((view) => view.classList.toggle("active", view.dataset.managerView === panel));
}

function selectRoute(route) {
  state.route = route;
  const copy = routeCopy[route];
  $$(".route").forEach((button) => button.classList.toggle("active", button.dataset.route === route));
  $("#routeTitle").textContent = copy.title;
  $("#routeInputLabel").childNodes[0].nodeValue = copy.label;
  $("#routeInput").value = copy.value;
  $("#routeHint").textContent = copy.hint;
  $("#runRoute").textContent = copy.button;
  $("#routeValidation").textContent = "Needs validation";
  $("#routeValidation").className = "chip warn";
  $("#routeResult span").textContent = "Route selected. Validate before replacing the active preview.";
}

function runSelectedRoute() {
  const input = $("#routeInput").value.trim();
  if (!input) {
    $("#routeValidation").textContent = "Missing input";
    $("#routeValidation").className = "chip danger";
    $("#routeResult span").textContent = "Enter a PR number, URL, branch, repository, Blueprint URL, or selected archive before continuing.";
    event("Launch validation failed because route input was empty.", "warn");
    return;
  }

  if (state.route === "zip") {
    openPanel("transfer");
    $("#zipConfirm").hidden = false;
    event("ZIP archive validated. Replacement confirmation is required before import.", "warn");
    return;
  }

  $("#browserFrame").classList.add("loading");
  $("#routeValidation").textContent = "Validating";
  $("#routeValidation").className = "chip warn";
  setProgress(
    {
      box: "#routeProgress",
      text: "#routeProgressText",
      bar: "#routeProgressBar",
    },
    [
      { label: "Checking route-specific input and constraints...", percent: 22 },
      { label: "Fetching WordPress packages and requested source...", percent: 48 },
      { label: "Booting WordPress in the browser runtime...", percent: 76 },
      { label: "Attaching save and export actions to preview identity...", percent: 100 },
    ],
    () => {
      const route = state.route;
      if (route === "gutenberg") {
        state.siteName = "Gutenberg Branch Preview";
        state.identity = `preview: gutenberg/${input}`;
        state.path = "/wp-admin/site-editor.php";
        $("#routeResult span").textContent = `${input} validated. Preview loaded in WP Admin with Save, Export to GitHub, Download as zip, and Site Manager enabled.`;
      } else if (route === "wordpress") {
        state.siteName = "WordPress PR Preview";
        state.identity = `preview: wordpress-pr/${input.replace(/^.*pull\//, "#")}`;
        state.path = "/wp-admin/";
        $("#routeResult span").textContent = "WordPress PR validated and loaded. Save/export actions now target this PR preview.";
      } else if (route === "vanilla") {
        state.siteName = "Unsaved Vanilla WordPress";
        state.identity = "temp: vanilla-wordpress";
        state.path = "/hello-from-playground/";
        $("#routeResult span").textContent = "Fresh vanilla WordPress runtime started. It remains temporary until saved.";
      } else if (route === "github") {
        state.siteName = "GitHub Import Preview";
        state.identity = `preview: github/${input}`;
        state.path = "/wp-admin/";
        $("#routeResult span").textContent = "GitHub account connected, repository selected, and wp-content import preview loaded. Token will not be stored after refresh.";
      } else if (route === "blueprint-url") {
        state.siteName = "Blueprint URL Preview";
        state.identity = "preview: blueprint-url";
        state.path = "/hello-from-playground/";
        $("#routeResult span").textContent = "Blueprint URL validated and run. The resulting preview can be saved or exported.";
      }
      state.saved = false;
      state.storage = "temporary";
      state.activeSaved = false;
      state.exportAvailable = true;
      $("#routeValidation").textContent = "Preview ready";
      $("#routeValidation").className = "chip good";
      $("#previewState").textContent = "Preview ready";
      $("#transferState").textContent = "Save and export available";
      $("#browserFrame").classList.remove("loading");
      setPath(state.path);
      updateShell();
      event(`${state.siteName} created from ${routeCopy[route].title}; save/export availability updated.`);
    }
  );
}

function ensureSavedResultRow(name, meta) {
  const existing = $("#savedList").querySelector('[data-site="active"]');
  existing.classList.add("active");
  $("#activeRowName").textContent = name;
  $("#activeRowMeta").textContent = meta;
}

function saveBrowser() {
  const name = $("#browserName").value.trim() || "Saved Playground";
  openPanel("save");
  $("#browserFrame").classList.add("loading");
  setProgress(
    {
      box: "#saveProgress",
      text: "#saveProgressText",
      bar: "#saveProgressBar",
    },
    [
      { label: "Saving 482 / 3751 files to browser storage...", percent: 16 },
      { label: "Saving 1864 / 3751 files to browser storage...", percent: 45 },
      { label: "Saving 3028 / 3751 files to browser storage...", percent: 76 },
      { label: "Saved 3751 / 3751 files and wrote browser slug...", percent: 100 },
    ],
    () => {
      state.siteName = name;
      state.saved = true;
      state.storage = "browser";
      state.identity = `browser: ${slugify(name)}`;
      state.activeSaved = true;
      state.exportAvailable = true;
      $("#saveResult span").textContent = `${name} is saved in this browser. The active row, shell title, slug identity, reset action, and reload consequence changed together.`;
      $("#previewState").textContent = "Saved Playground";
      $("#browserFrame").classList.remove("loading");
      ensureSavedResultRow(name, `Saved in this browser - slug ${slugify(name)}`);
      updateShell();
      event(`Browser save completed for ${name}; saved row inserted and active title updated.`);
    }
  );
}

function saveLocal() {
  const folder = $("#localFolder").value.trim() || "/Users/admin/Playgrounds/current-playground";
  openPanel("save");
  setProgress(
    {
      box: "#saveProgress",
      text: "#saveProgressText",
      bar: "#saveProgressBar",
    },
    [
      { label: "Opening local directory picker...", percent: 12 },
      { label: "Folder permission granted. Copying WordPress files...", percent: 45 },
      { label: "Writing database.sqlite and blueprint.json...", percent: 78 },
      { label: "Local directory save complete.", percent: 100 },
    ],
    () => {
      state.saved = true;
      state.storage = "local";
      state.identity = `local directory: ${folder}`;
      state.activeSaved = true;
      $("#saveResult span").textContent = `Saved to ${folder}. On refresh, Playground must ask to reconnect this folder before loading the local copy.`;
      updateShell();
      event(`Local directory save completed. Folder identity recorded: ${folder}.`);
    }
  );
}

function openSavedSite(kind) {
  if (kind === "local") {
    state.siteName = "Local Theme Lab";
    state.saved = true;
    state.storage = "local";
    state.identity = "local directory: /Users/admin/Playgrounds/local-theme-lab";
    state.path = "/wp-admin/";
    event("Opened Local Theme Lab. Folder reconnect permission is required after browser refresh.");
  } else {
    state.siteName = "Research Browser Playground";
    state.saved = true;
    state.storage = "browser";
    state.identity = "browser: research-browser-playground";
    state.path = "/hello-from-playground/";
    event("Opened Research Browser Playground from browser storage.");
  }
  state.activeSaved = true;
  state.exportAvailable = true;
  setPath(state.path);
  updateShell();
}

function manageSavedSite(kind) {
  openSavedSite(kind);
  openPanel("manager");
  event(`Site Manager opened for ${state.siteName}.`);
}

function renameActive() {
  const name = $("#renameInput").value.trim();
  if (!name) return;
  state.siteName = name;
  if (state.saved && state.storage === "browser") {
    state.identity = `browser: ${slugify(name)}`;
  }
  $("#browserName").value = name;
  updateShell();
  event(`Active Playground renamed to ${name}; shell title and saved row mutated.`);
}

function deleteActive() {
  $("#deleteConfirm").hidden = false;
  event("Delete confirmation opened for active Playground.", "warn");
}

function confirmDelete() {
  $("#deleteConfirm").hidden = true;
  state.siteName = "Unsaved Playground";
  state.saved = false;
  state.storage = "temporary";
  state.identity = "temp: unsaved-runtime";
  state.path = "/hello-from-playground/";
  state.activeSaved = false;
  state.exportAvailable = false;
  $("#previewState").textContent = "Temporary preview";
  $("#saveResult span").textContent = "Deleted saved identity. The console fell back to a temporary Unsaved Playground.";
  setPath(state.path);
  updateShell();
  event("Saved Playground deleted. Active shell fell back to Unsaved Playground and saved row was removed.", "danger");
}

function runTransfer(kind) {
  const labels = {
    githubConnect: "GitHub account connected; repository picker opened. Access token will not be stored after refresh.",
    githubExport: "Export to GitHub finished for wordpress/playground-transfer-demo.",
    zipDownload: "playground-gutenberg-branch-preview.zip generated from active files, database, and blueprint.",
    dbDownload: "database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite (452 KB).",
    copyBlueprint: "Blueprint bundle link copied to clipboard.",
    downloadBlueprint: "blueprint.json bundle downloaded.",
    runBlueprint: "Blueprint bundle validated and run against active Playground.",
    managerCopyBlueprint: "Site Manager copied the current blueprint link.",
    managerDownloadBlueprint: "Site Manager downloaded the current Blueprint bundle.",
    managerRunBlueprint: "Blueprint run completed and preview refreshed.",
    managerDbDownload: "database.sqlite downloaded from Site Manager.",
    openAdminer: "Adminer opened in a new Playground tool window.",
    openPhpMyAdmin: "phpMyAdmin opened in a new Playground tool window.",
    galleryCopy: "Selected Blueprint URL copied.",
    galleryDownload: "Selected Blueprint bundle downloaded.",
    galleryRun: "Selected Blueprint validated, run, and recorded in transfer history.",
  };

  $("#transferResult span").textContent = labels[kind];
  event(labels[kind]);
}

function zipImport() {
  $("#zipConfirm").hidden = false;
  $("#transferResult span").textContent = "playground-export.zip selected and validated. Confirmation required before replacing the active site.";
  event("ZIP import selected; replacement confirmation displayed.", "warn");
}

function confirmZip() {
  $("#zipConfirm").hidden = true;
  $("#browserFrame").classList.add("loading");
  setProgress(
    {
      box: "#transferProgress",
      text: "#transferProgressText",
      bar: "#transferProgressBar",
    },
    [
      { label: "Reading playground-export.zip...", percent: 18 },
      { label: "Replacing WordPress files and wp-content...", percent: 50 },
      { label: "Replacing SQLite database and blueprint.json...", percent: 82 },
      { label: "Imported archive and refreshed preview.", percent: 100 },
    ],
    () => {
      state.siteName = "Imported ZIP Playground";
      state.saved = false;
      state.storage = "temporary";
      state.identity = "temp: imported-zip";
      state.path = "/wp-admin/";
      state.exportAvailable = true;
      $("#transferResult span").textContent = "ZIP import replaced files and database. Active title, path, storage badge, and preview state were updated.";
      $("#previewState").textContent = "ZIP import result";
      $("#browserFrame").classList.remove("loading");
      setPath(state.path);
      updateShell();
      event("ZIP import completed; current Playground replaced and preview loaded at /wp-admin/.", "danger");
    }
  );
}

function editFile() {
  $("#fileEditor code").textContent += "\ndefine('WP_ENVIRONMENT_TYPE', 'local');";
  $("#fileDirty").textContent = "Dirty";
  $("#fileDirty").className = "chip warn";
  event("wp-config.php edited; file browser marked dirty.", "warn");
}

function saveFile() {
  $("#fileDirty").textContent = "Saved";
  $("#fileDirty").className = "chip good";
  event("wp-config.php saved; file dirty state cleared.");
}

function filterBlueprints() {
  const filter = $("#blueprintFilters .active").dataset.filter;
  const query = $("#blueprintSearch").value.trim().toLowerCase();
  $$(".blueprint-card").forEach((card) => {
    const tags = card.dataset.tags;
    const text = card.textContent.toLowerCase();
    const matchFilter = filter === "All" || tags.includes(filter);
    const matchQuery = !query || text.includes(query);
    card.hidden = !(matchFilter && matchQuery);
  });
}

$$("[data-open-panel]").forEach((button) => {
  button.addEventListener("click", () => openPanel(button.dataset.openPanel));
});

$$(".deck-tabs button").forEach((button) => {
  button.addEventListener("click", () => openPanel(button.dataset.panel));
});

$$(".manager-tabs button").forEach((button) => {
  button.addEventListener("click", () => openManager(button.dataset.manager));
});

$$(".route").forEach((button) => {
  button.addEventListener("click", () => selectRoute(button.dataset.route));
});

$$("[data-path]").forEach((button) => {
  button.addEventListener("click", () => setPath(button.dataset.path));
});

$$("[data-open-site]").forEach((button) => {
  button.addEventListener("click", () => openSavedSite(button.dataset.openSite));
});

$$("[data-manage]").forEach((button) => {
  button.addEventListener("click", () => manageSavedSite(button.dataset.manage));
});

$("#pathInput").addEventListener("change", (event) => setPath(event.target.value || "/"));
$("#refreshButton").addEventListener("click", () => event(`Preview refreshed at ${state.path}.`));
$("#homeButton").addEventListener("click", () => setPath("/hello-from-playground/"));
$("#adminButton").addEventListener("click", () => setPath("/wp-admin/"));
$("#managerHome").addEventListener("click", () => setPath("/hello-from-playground/"));
$("#managerAdmin").addEventListener("click", () => setPath("/wp-admin/"));
$("#runRoute").addEventListener("click", runSelectedRoute);
$("#cancelRoute").addEventListener("click", () => {
  $("#routeResult span").textContent = "Route preview canceled before validation. Active Playground was not changed.";
  event("Launch route canceled before mutation.", "warn");
});
$("#saveBrowserButton").addEventListener("click", saveBrowser);
$("#saveLocalButton").addEventListener("click", saveLocal);
$("#localCancel").addEventListener("click", () => {
  $("#saveResult span").textContent = "Local directory picker canceled. Active Playground remains temporary unless another destination completes.";
  event("Local directory picker canceled; no files copied.", "warn");
});
$("#renameButton").addEventListener("click", renameActive);
$("#deleteButton").addEventListener("click", deleteActive);
$("#cancelDelete").addEventListener("click", () => {
  $("#deleteConfirm").hidden = true;
  event("Delete canceled; active saved row remains.");
});
$("#confirmDelete").addEventListener("click", confirmDelete);
$("#zipImport").addEventListener("click", zipImport);
$("#cancelZip").addEventListener("click", () => {
  $("#zipConfirm").hidden = true;
  $("#transferResult span").textContent = "ZIP import canceled before replacement. Current files and database were not changed.";
  event("ZIP replacement canceled before mutation.", "warn");
});
$("#confirmZip").addEventListener("click", confirmZip);
$("#editFile").addEventListener("click", editFile);
$("#saveFile").addEventListener("click", saveFile);
$("#newFile").addEventListener("click", () => event("New file created in /wordpress/wp-content/mu-plugins/playground-note.php."));
$("#newFolder").addEventListener("click", () => event("New folder created in /wordpress/wp-content/uploads/playground-artifacts."));
$("#uploadFile").addEventListener("click", () => event("Upload completed: sample-plugin.zip placed in wp-content/uploads."));
$("#browseFiles").addEventListener("click", () => event("Browse files opened native file chooser for File browser upload."));
$("#settingsAction").addEventListener("click", () => {
  if (state.saved) {
    event("Save & Reload completed for stored Playground with limited settings.");
  } else {
    state.path = "/hello-from-playground/";
    setPath(state.path);
    event("Apply Settings & Reset completed; temporary files and database were replaced.", "danger");
  }
});

[
  "githubConnect",
  "githubExport",
  "zipDownload",
  "dbDownload",
  "copyBlueprint",
  "downloadBlueprint",
  "runBlueprint",
  "managerCopyBlueprint",
  "managerDownloadBlueprint",
  "managerRunBlueprint",
  "managerDbDownload",
  "openAdminer",
  "openPhpMyAdmin",
  "galleryCopy",
  "galleryDownload",
  "galleryRun",
].forEach((id) => {
  $(`#${id}`).addEventListener("click", () => runTransfer(id));
});

$$(".blueprint-card").forEach((card) => {
  card.addEventListener("click", () => {
    $$(".blueprint-card").forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
    $("#selectedBlueprint").textContent = card.querySelector("strong").textContent;
    $("#selectedBlueprintText").textContent = card.querySelector("span").textContent;
    $("#blueprintUrl").value = `https://playground.wordpress.net/blueprints/${slugify(card.querySelector("strong").textContent)}/blueprint.json`;
    event(`Blueprint selected: ${card.querySelector("strong").textContent}.`);
  });
});

$$(".filter-row button").forEach((button) => {
  button.addEventListener("click", () => {
    $$(".filter-row button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    filterBlueprints();
  });
});

$("#blueprintSearch").addEventListener("input", filterBlueprints);

updateShell();
