const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const blueprints = [
  { name: "Art Gallery", desc: "An art gallery created with the Vueo theme.", tags: ["Featured", "Website", "Personal"], color: ["#7a5a21", "#e0b05d"] },
  { name: "Coffee Shop", desc: "A stylish WooCommerce coffee storefront with custom content.", tags: ["Featured", "WooCommerce", "Website"], color: ["#4b246d", "#ffb45f"] },
  { name: "Feed Reader with the Friends Plugin", desc: "Read feeds from the web in Playground with the Friends plugin.", tags: ["Featured", "Content"], color: ["#eef3ff", "#3858e9"] },
  { name: "Gaming News", desc: "A gaming news site created with the Spiel theme.", tags: ["Featured", "Website", "News"], color: ["#050505", "#d9480f"] },
  { name: "Non-profit Organization", desc: "A non-profit site created with the Koinonia theme.", tags: ["Website", "Content"], color: ["#4a2b17", "#f97316"] },
  { name: "Personal Blog", desc: "A personal blog created with the Substrata theme.", tags: ["Personal", "Website"], color: ["#65123f", "#b990a8"] },
  { name: "Gutenberg Experiments", desc: "A current Gutenberg branch sandbox with editor-focused content.", tags: ["Gutenberg", "Experiments"], color: ["#1d4ed8", "#a7f3d0"] },
  { name: "Theme Preview Lab", desc: "A compact theme testing site with sample posts and pages.", tags: ["Themes", "Website"], color: ["#0f766e", "#facc15"] },
];

const state = {
  mode: "transfer",
  managerTab: "settings",
  activeId: "temporary",
  active: {
    id: "temporary",
    title: "Unsaved Playground",
    storage: "Temporary",
    storageDetail: "Temporary memory",
    path: "/hello-from-playground/",
    runtime: "WordPress latest / PHP 8.3",
    consequence: "Reload discards files and database.",
    siteName: "My WordPress Website",
    headline: "Hello from WordPress Playground!",
    body: "This Playground runs client-side in your browser. It is ready for plugin tests, theme demos, Blueprint runs, and file edits.",
    marker: "Logged in as admin. Save before closing the browser to keep this site.",
  },
  saved: [
    { id: "temporary", title: "Unsaved Playground", storage: "Temporary", meta: "Not saved to browser storage", active: true },
    { id: "research", title: "Research Browser Playground", storage: "Browser", meta: "Created May 21, 2026" },
    { id: "local-theme", title: "Local Theme Lab", storage: "Local directory", meta: "Folder permission required on reload" },
  ],
  operations: [
    { name: "Shell ready", status: "ready", detail: "Temporary Playground loaded at /hello-from-playground/." },
    { name: "Database mounted", status: "ready", detail: "SQLite database .ht.sqlite is 452 KB." },
    { name: "Blueprint editor", status: "idle", detail: "blueprint.json available for copy, download, and run." },
    { name: "Transfer queue", status: "idle", detail: "ZIP, GitHub, and database transfers are ready." },
  ],
  events: [
    "Loaded temporary Playground at /hello-from-playground/.",
    "Site Manager tabs registered: Settings, Files, Blueprint, Database, Logs.",
    "Transfer mode opened with ZIP import selected.",
  ],
  selectedBlueprint: blueprints[0],
  zipFile: null,
  renameId: null,
  deleteId: null,
};

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "playground";
}

function setText(selector, value) {
  const node = $(selector);
  if (node) node.textContent = value;
}

function logEvent(message) {
  state.events.unshift(message);
  state.events = state.events.slice(0, 9);
  renderEvents();
}

function addOperation(name, status, detail) {
  state.operations.unshift({ name, status, detail });
  state.operations = state.operations.slice(0, 7);
  renderOperations();
  setText("#ledgerMutation", name);
  setText("#ledgerMutationDetail", detail);
}

function setActive(partial, operationName, detail) {
  state.active = { ...state.active, ...partial };
  state.activeId = state.active.id;
  const temporaryRow = state.saved.find((row) => row.id === "temporary");
  if (state.active.storage === "Temporary" && temporaryRow) {
    temporaryRow.title = state.active.title;
    temporaryRow.storage = "Temporary";
    temporaryRow.meta = state.active.storageDetail;
  }
  state.saved = state.saved.map((row) => ({ ...row, active: row.id === state.activeId }));
  renderShell();
  renderSaved();
  if (operationName) {
    addOperation(operationName, "complete", detail);
    logEvent(`${operationName}: ${detail}`);
  }
}

function ensureSavedRow(row) {
  const existing = state.saved.findIndex((item) => item.id === row.id);
  if (existing >= 0) {
    state.saved[existing] = { ...state.saved[existing], ...row };
  } else {
    state.saved.unshift(row);
  }
  state.saved = state.saved.map((item) => ({ ...item, active: item.id === state.activeId }));
}

function renderShell() {
  const active = state.active;
  setText("#shellTitle", active.title);
  setText("#objectTitle", active.title);
  setText("#objectSubtitle", active.storage === "Temporary" ? "Temporary WordPress install, not saved to browser storage or disk." : `${active.storageDetail}. Current changes are attached to this identity.`);
  setText("#storageBadge", active.storage);
  $("#storageBadge").className = `status-chip ${active.storage === "Temporary" ? "amber" : "green"}`;
  setText("#objectStorage", active.storageDetail);
  setText("#runtimeFact", active.runtime);
  setText("#consequenceFact", active.consequence);
  $("#pathInput").value = active.path;
  setText("#previewPath", active.path);
  setText("#ledgerPath", active.path);
  setText("#ledgerStorage", active.storage);
  setText("#ledgerStorageDetail", active.storageDetail);
  setText("#wpSiteName", active.siteName);
  setText("#wpAdminSite", active.siteName);
  setText("#previewHeadline", active.headline);
  setText("#previewBody", active.body);
  setText("#previewMarker", active.marker);
  setText("#exportSource", `${active.title}, ${active.path}`);
  setText("#zipWarningName", active.title);
  setText("#settingsConsequence", active.storage === "Temporary" ? "Applying settings resets this temporary Playground and replaces files and database." : "Stored Playgrounds have limited configuration options. Save & Reload keeps the saved identity.");
  const apply = $("#applySettings");
  if (apply) apply.textContent = active.storage === "Temporary" ? "Apply Settings & Reset Playground" : "Save & Reload";
}

function renderOperations() {
  $("#operationList").innerHTML = state.operations.map((item) => `
    <div class="operation-item">
      <div>
        <strong>${item.name}</strong>
        <small>${item.detail}</small>
      </div>
      <span class="status-chip ${item.status === "complete" ? "green" : item.status === "failed" ? "red" : ""}">${item.status}</span>
    </div>
  `).join("");
  setText("#ledgerCount", `${state.operations.length} entries`);
}

function renderEvents() {
  $("#eventStream").innerHTML = state.events.map((event, index) => `
    <div class="event-item">
      <strong>${index === 0 ? "Now" : `${index + 1} events ago`}</strong>
      <small>${event}</small>
    </div>
  `).join("");
}

function renderSaved() {
  $("#savedList").innerHTML = state.saved.map((row) => `
    <article class="saved-row ${row.id === state.activeId ? "is-active" : ""}">
      <div>
        <strong>${row.title}</strong>
        <small>${row.storage} - ${row.meta}</small>
      </div>
      <div class="saved-actions">
        <button class="secondary-button small" type="button" data-open-id="${row.id}">Open</button>
        <button class="secondary-button small" type="button" data-rename-id="${row.id}" ${row.id === "temporary" ? "disabled" : ""}>Rename</button>
        <button class="danger-button small" type="button" data-delete-id="${row.id}" ${row.id === "temporary" ? "disabled" : ""}>Delete</button>
      </div>
    </article>
  `).join("");
}

function setMode(mode) {
  state.mode = mode;
  $$(".mode-panel").forEach((panel) => panel.classList.toggle("is-active", panel.dataset.mode === mode));
  $$(".rail-item").forEach((button) => button.classList.toggle("is-active", button.dataset.modeTarget === mode));
  const labels = {
    create: ["Create", "Launch routes"],
    save: ["Save", "Destination selected"],
    library: ["Library", "Saved objects"],
    manage: ["Manage", "Site Manager"],
    blueprints: ["Blueprints", "Gallery runner"],
    data: ["Data", "SQLite and database"],
    logs: ["Logs", "Runtime stream"],
    transfer: ["Transfer", "ZIP import selected"],
  };
  setText("#modeTitle", labels[mode][0]);
  setText("#modeStatus", labels[mode][1]);
}

function simulateProgress({ bar, text, steps, done }) {
  const barNode = $(bar);
  const textNode = $(text);
  const progressBox = barNode.closest(".progress-box");
  if (progressBox) progressBox.hidden = false;
  barNode.style.width = "0";
  let index = 0;
  const runStep = () => {
    const step = steps[index];
    barNode.style.width = `${step.percent}%`;
    if (textNode) textNode.textContent = step.label;
    index += 1;
    if (index < steps.length) {
      window.setTimeout(runStep, 420);
    } else if (done) {
      window.setTimeout(done, 360);
    }
  };
  runStep();
}

function renderBlueprints() {
  const query = $("#blueprintSearch").value.trim().toLowerCase();
  const activeCategory = $("#categoryChips .chip.is-active").dataset.category;
  const filtered = blueprints.filter((item) => {
    const categoryMatch = activeCategory === "All" || item.tags.includes(activeCategory);
    const text = `${item.name} ${item.desc} ${item.tags.join(" ")}`.toLowerCase();
    return categoryMatch && text.includes(query);
  });
  setText("#catalogNote", `Showing ${filtered.length} representative entries from 43 available blueprints.`);
  $("#blueprintList").innerHTML = filtered.map((item) => `
    <button class="blueprint-row ${item.name === state.selectedBlueprint.name ? "is-active" : ""}" type="button" data-blueprint="${item.name}">
      <span class="blueprint-thumb" style="background: linear-gradient(135deg, ${item.color[0]}, ${item.color[1]});"></span>
      <span>
        <strong>${item.name}</strong>
        <small>${item.desc}</small>
      </span>
    </button>
  `).join("");
  renderSelectedBlueprint();
}

function renderSelectedBlueprint() {
  const item = state.selectedBlueprint;
  setText("#selectedBlueprintName", item.name);
  setText("#selectedBlueprintDescription", item.desc);
  $("#selectedBlueprintArt").style.background = `linear-gradient(135deg, ${item.color[0]}, ${item.color[1]})`;
  $("#selectedBlueprintTags").innerHTML = item.tags.map((tag) => `<span>${tag}</span>`).join("");
  $("#blueprintUrl").value = `https://playground.wordpress.net/blueprints/${slugify(item.name)}.json`;
}

function completeReplacement(title, source) {
  setActive({
    id: "temporary",
    title,
    storage: "Temporary",
    storageDetail: `Temporary import from ${source}`,
    path: "/wp-admin/",
    siteName: title,
    headline: `${title} ready`,
    body: "The imported archive replaced files and database, then opened WP Admin for verification.",
    marker: "Imported content is temporary until saved in browser storage or a local directory.",
    consequence: "Reload discards this imported site unless it is saved.",
  }, "ZIP import completed", `${source} replaced the active Playground and opened /wp-admin/.`);
  setText("#previewStatus", "Import rendered successfully");
}

function initEvents() {
  document.addEventListener("click", (event) => {
    const modeTarget = event.target.closest("[data-mode-target]");
    if (modeTarget) setMode(modeTarget.dataset.modeTarget);

    const open = event.target.closest("[data-open-id]");
    if (open) {
      const row = state.saved.find((item) => item.id === open.dataset.openId);
      if (row) {
        setActive({
          id: row.id,
          title: row.title,
          storage: row.storage,
          storageDetail: row.storage === "Browser" ? "Saved in this browser" : row.storage === "Local directory" ? "Backed by a local folder permission" : "Temporary memory",
          path: row.id === "temporary" ? "/hello-from-playground/" : "/wp-admin/",
          siteName: row.title,
          consequence: row.storage === "Temporary" ? "Reload discards files and database." : "Stored Playgrounds use Save & Reload for settings.",
        }, "Playground opened", `${row.title} is now the active shell object.`);
      }
    }

    const rename = event.target.closest("[data-rename-id]");
    if (rename) {
      const row = state.saved.find((item) => item.id === rename.dataset.renameId);
      state.renameId = row.id;
      $("#renameInput").value = row.title;
      $("#renameBox").hidden = false;
      $("#deleteBox").hidden = true;
    }

    const del = event.target.closest("[data-delete-id]");
    if (del) {
      const row = state.saved.find((item) => item.id === del.dataset.deleteId);
      state.deleteId = row.id;
      setText("#deleteTitle", `Delete ${row.title}?`);
      $("#deleteBox").hidden = false;
      $("#renameBox").hidden = true;
    }

    const blueprintButton = event.target.closest("[data-blueprint]");
    if (blueprintButton) {
      state.selectedBlueprint = blueprints.find((item) => item.name === blueprintButton.dataset.blueprint);
      renderBlueprints();
      addOperation("Blueprint selected", "ready", `${state.selectedBlueprint.name} detail loaded.`);
    }
  });

  $("#pathInput").addEventListener("change", (event) => {
    const path = event.target.value.startsWith("/") ? event.target.value : `/${event.target.value}`;
    setActive({ path }, "Path changed", `Embedded WordPress navigated to ${path}.`);
  });
  $("#homeButton").addEventListener("click", () => setActive({ path: "/hello-from-playground/" }, "Homepage opened", "The live preview returned to the Playground welcome page."));
  $("#adminButton").addEventListener("click", () => setActive({ path: "/wp-admin/" }, "WP Admin opened", "The shell path and preview now target /wp-admin/."));
  $("#refreshButton").addEventListener("click", () => {
    setText("#previewStatus", "Refreshed just now");
    addOperation("Preview refreshed", "complete", `${state.active.path} reloaded in the embedded shell.`);
    logEvent(`Refreshed active path ${state.active.path}.`);
  });

  $("#startVanilla").addEventListener("click", () => setActive({
    id: "temporary",
    title: "Fresh Vanilla Playground",
    storage: "Temporary",
    storageDetail: "Temporary memory",
    path: "/hello-from-playground/",
    siteName: "My WordPress Website",
    headline: "Fresh WordPress Playground",
    body: "A clean latest WordPress install is running in the browser.",
    marker: "This new site replaces the previous temporary state until saved.",
    consequence: "Reload discards files and database.",
  }, "Vanilla WordPress started", "Fresh latest install replaced the active temporary site."));

  $("#previewWpPr").addEventListener("click", () => setActive({
    id: "temporary",
    title: "WordPress PR Preview",
    storage: "Temporary",
    storageDetail: "Temporary PR preview",
    path: "/wp-admin/update-core.php",
    headline: "WordPress PR preview ready",
    body: `Previewing ${$("#wpPrInput").value} with admin access and current runtime settings.`,
    marker: "PR previews are temporary unless saved after boot.",
  }, "WordPress PR previewed", "PR source validated and opened in the active shell."));

  $("#previewGbPr").addEventListener("click", () => setActive({
    id: "temporary",
    title: "Gutenberg Branch Preview",
    storage: "Temporary",
    storageDetail: "Temporary Gutenberg preview",
    path: "/wp-admin/post-new.php",
    headline: "Gutenberg preview ready",
    body: `The Gutenberg ${$("#gbPrInput").value} source is active for editor testing.`,
    marker: "Branch or PR preview replaces the current temporary runtime.",
  }, "Gutenberg previewed", "Gutenberg branch or PR booted into the active Playground."));

  $("#connectGitHubImport").addEventListener("click", () => {
    $("#connectGitHubImport").textContent = "Connected: adamziel";
    $("#finishGitHubImport").disabled = false;
    addOperation("GitHub import connected", "ready", "Account connected for this browser session. Token is not stored after refresh.");
    logEvent("GitHub import account connected.");
  });
  $("#finishGitHubImport").addEventListener("click", () => setActive({
    id: "temporary",
    title: "GitHub Theme Import",
    storage: "Temporary",
    storageDetail: "Temporary GitHub import",
    path: "/wp-admin/themes.php",
    siteName: "GitHub Theme Import",
    headline: "GitHub import ready",
    body: "A public theme repository was imported into wp-content and activated for inspection.",
    marker: "GitHub token is not stored; reconnect is required after refresh.",
  }, "GitHub import completed", "Selected repository imported into wp-content and updated the active identity."));

  $("#saveBrowser").addEventListener("click", () => {
    const title = $("#saveName").value.trim() || "Saved Playground";
    simulateProgress({
      bar: "#browserSaveProgress",
      text: "#browserSaveText",
      steps: [
        { percent: 16, label: "Saving 603 / 3,751 files..." },
        { percent: 45, label: "Saving 1,914 / 3,751 files..." },
        { percent: 78, label: "Saving database and metadata..." },
        { percent: 100, label: "Saved in this browser." },
      ],
      done: () => {
        const id = slugify(title);
        ensureSavedRow({ id, title, storage: "Browser", meta: "Saved in this browser a moment ago" });
        setActive({
          id,
          title,
          storage: "Browser",
          storageDetail: "Saved in this browser",
          path: `/${id}/`,
          siteName: title,
          consequence: "Settings use Save & Reload; browser storage keeps files and database.",
        }, "Browser save completed", `${title} received a browser-backed saved identity and slug URL.`);
      },
    });
  });

  $("#pickFolder").addEventListener("click", () => {
    setText("#folderName", "wordpress-playground-demo");
    setText("#folderPermission", "Folder selected, permission pending");
    setText("#folderBadge", "Permission pending");
    $("#grantFolder").disabled = false;
    addOperation("Local folder picked", "ready", "Directory destination selected; write permission is still required.");
  });
  $("#grantFolder").addEventListener("click", () => {
    setText("#folderPermission", "Read/write access granted");
    setText("#folderBadge", "Granted");
    $("#folderBadge").className = "status-chip green";
    $("#saveLocal").disabled = false;
    logEvent("Local directory permission granted.");
  });
  $("#saveLocal").addEventListener("click", () => {
    const title = $("#saveName").value.trim() || "Local Playground";
    simulateProgress({
      bar: "#localSaveProgress",
      text: "#localSaveText",
      steps: [
        { percent: 18, label: "Creating local directory manifest..." },
        { percent: 52, label: "Writing WordPress files to disk..." },
        { percent: 86, label: "Writing SQLite database..." },
        { percent: 100, label: "Saved to local directory. Reconnect folder after reload." },
      ],
      done: () => {
        const id = `${slugify(title)}-local`;
        ensureSavedRow({ id, title, storage: "Local directory", meta: "Folder: wordpress-playground-demo" });
        setActive({
          id,
          title,
          storage: "Local directory",
          storageDetail: "Backed by wordpress-playground-demo",
          path: `/${slugify(title)}/`,
          consequence: "Reload asks to reconnect the folder before WordPress starts.",
        }, "Local directory save completed", `${title} now uses the selected folder instead of browser storage.`);
      },
    });
  });

  $("#cancelRename").addEventListener("click", () => $("#renameBox").hidden = true);
  $("#confirmRename").addEventListener("click", () => {
    const row = state.saved.find((item) => item.id === state.renameId);
    if (!row) return;
    const oldTitle = row.title;
    row.title = $("#renameInput").value.trim() || row.title;
    if (row.id === state.activeId) {
      setActive({ title: row.title, siteName: row.title }, "Playground renamed", `${oldTitle} is now ${row.title}.`);
    } else {
      addOperation("Saved row renamed", "complete", `${oldTitle} is now ${row.title}.`);
      logEvent(`Renamed saved row ${oldTitle} to ${row.title}.`);
    }
    $("#renameBox").hidden = true;
    renderSaved();
  });

  $("#cancelDelete").addEventListener("click", () => $("#deleteBox").hidden = true);
  $("#confirmDelete").addEventListener("click", () => {
    const row = state.saved.find((item) => item.id === state.deleteId);
    state.saved = state.saved.filter((item) => item.id !== state.deleteId);
    $("#deleteBox").hidden = true;
    if (state.activeId === state.deleteId) {
      setActive({
        id: "temporary",
        title: "Unsaved Playground",
        storage: "Temporary",
        storageDetail: "Temporary memory",
        path: "/hello-from-playground/",
        siteName: "My WordPress Website",
        consequence: "Reload discards files and database.",
      }, "Saved Playground deleted", `${row.title} was removed; active shell fell back to an unsaved Playground.`);
    } else {
      addOperation("Saved Playground deleted", "complete", `${row.title} was removed from the library.`);
      logEvent(`Deleted saved Playground ${row.title}.`);
      renderSaved();
    }
  });

  $$(".subtab").forEach((button) => button.addEventListener("click", () => {
    state.managerTab = button.dataset.managerTab;
    $$(".subtab").forEach((item) => item.classList.toggle("is-active", item === button));
    $$(".manager-pane").forEach((pane) => pane.classList.toggle("is-active", pane.id === `manager-${state.managerTab}`));
  }));

  $("#applySettings").addEventListener("click", () => {
    const saved = state.active.storage !== "Temporary";
    setActive({
      path: "/hello-from-playground/",
      runtime: `WordPress ${$("#wpVersion").value} / PHP ${$("#phpVersion").value}`,
      marker: saved ? "Stored Playground reloaded with limited configuration changes." : "Settings reset completed and replaced the temporary runtime.",
    }, saved ? "Save & Reload completed" : "Settings reset completed", saved ? "Stored runtime reloaded without losing saved identity." : "Temporary files and database were replaced by a fresh runtime.");
  });

  $("#fileEditor").addEventListener("input", () => $("#fileDirty").hidden = false);
  $("#saveFile").addEventListener("click", () => {
    $("#fileDirty").hidden = true;
    setText("#fileResult", "Saved /wordpress/wp-config.php.");
    addOperation("File saved", "complete", "wp-config.php dirty state cleared.");
  });
  $("#newFile").addEventListener("click", () => {
    setText("#filePath", "/wordpress/wp-content/mu-plugins/playground-note.php");
    $("#fileEditor").value = "<?php\n/** Playground note plugin. */\n";
    $("#fileDirty").hidden = false;
    setText("#fileResult", "New file created, not saved yet.");
  });
  $("#newFolder").addEventListener("click", () => {
    setText("#fileResult", "Created folder /wordpress/wp-content/uploads/playground-demo.");
    addOperation("Folder created", "complete", "New folder appeared in wp-content/uploads.");
  });
  $("#uploadFile").addEventListener("click", () => {
    setText("#fileResult", "Uploaded plugin-demo.php to /wordpress/wp-content/plugins.");
    addOperation("File uploaded", "complete", "Browse result selected the uploaded plugin file.");
  });
  $("#browseFiles").addEventListener("click", () => {
    setText("#fileResult", "Browse selected /wordpress/wp-content/themes/twentytwentyfive/style.css.");
    setText("#filePath", "/wordpress/wp-content/themes/twentytwentyfive/style.css");
  });

  $("#managerBlueprintEditor").addEventListener("input", () => $("#managerBlueprintDirty").hidden = false);
  $("#copyBlueprint").addEventListener("click", () => {
    setText("#managerBlueprintResult", "Blueprint link copied to clipboard.");
    addOperation("Blueprint link copied", "complete", "Current /blueprint.json URL copied.");
  });
  $("#downloadBlueprint").addEventListener("click", () => {
    setText("#managerBlueprintResult", "Blueprint bundle downloaded.");
    addOperation("Blueprint bundle downloaded", "complete", "blueprint.json and assets generated as a bundle.");
  });
  $("#runManagerBlueprint").addEventListener("click", () => {
    $("#managerBlueprintDirty").hidden = true;
    setText("#managerBlueprintResult", "Blueprint ran successfully and kept current landing page.");
    addOperation("Blueprint run completed", "complete", "Manager blueprint executed against the active Playground.");
  });

  const dbAction = (text) => {
    setText("#dbResult", text);
    setText("#dataResult", text);
    addOperation("Database action completed", "complete", text);
  };
  ["downloadDb", "dataDownloadDb"].forEach((id) => $(`#${id}`).addEventListener("click", () => dbAction("database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite.")));
  ["openAdminer", "dataOpenAdminer"].forEach((id) => $(`#${id}`).addEventListener("click", () => dbAction("Adminer opened for SQLite-backed database inspection.")));
  ["openPhpMyAdmin", "dataOpenPhpMyAdmin"].forEach((id) => $(`#${id}`).addEventListener("click", () => dbAction("phpMyAdmin opened in a new tool window.")));

  $("#blueprintSearch").addEventListener("input", renderBlueprints);
  $$("#categoryChips .chip").forEach((chip) => chip.addEventListener("click", () => {
    $$("#categoryChips .chip").forEach((item) => item.classList.toggle("is-active", item === chip));
    renderBlueprints();
  }));
  $("#validateBlueprint").addEventListener("click", () => {
    setText("#blueprintResult", `${state.selectedBlueprint.name} URL validated. Replacement warning required before run.`);
    addOperation("Blueprint validated", "ready", `${state.selectedBlueprint.name} JSON and URL are valid.`);
  });
  $("#copyGalleryBlueprint").addEventListener("click", () => {
    setText("#blueprintResult", "Blueprint URL copied.");
    addOperation("Blueprint copied", "complete", `${state.selectedBlueprint.name} URL copied.`);
  });
  $("#downloadGalleryBlueprint").addEventListener("click", () => {
    setText("#blueprintResult", "Blueprint bundle downloaded.");
    addOperation("Blueprint downloaded", "complete", `${state.selectedBlueprint.name} bundle generated.`);
  });
  $("#prepareBlueprintRun").addEventListener("click", () => $("#blueprintRunBox").hidden = false);
  $("#cancelBlueprintRun").addEventListener("click", () => $("#blueprintRunBox").hidden = true);
  $("#confirmBlueprintRun").addEventListener("click", () => {
    $("#blueprintRunBox").hidden = true;
    setActive({
      title: `${state.selectedBlueprint.name} Playground`,
      siteName: state.selectedBlueprint.name,
      path: "/",
      headline: state.selectedBlueprint.name,
      body: state.selectedBlueprint.desc,
      marker: "Blueprint run changed content and database. Save to keep this result.",
    }, "Blueprint run completed", `${state.selectedBlueprint.name} replaced the active content and opened the landing page.`);
    setText("#blueprintResult", "Blueprint run completed and active preview changed.");
  });

  $("#chooseBadZip").addEventListener("click", () => {
    state.zipFile = { name: "notes.txt", valid: false };
    setText("#zipSource", "notes.txt");
    setText("#zipValidation", "Not run");
    setText("#zipStatus", "Wrong type");
    $("#zipStatus").className = "status-chip red";
    $("#prepareZipReplace").disabled = true;
    addOperation("ZIP source selected", "failed", "notes.txt is not an accepted .zip archive.");
  });
  $("#chooseZip").addEventListener("click", () => {
    state.zipFile = { name: "client-demo.zip", valid: true };
    setText("#zipSource", "client-demo.zip - 18.4 MB");
    setText("#zipValidation", "Not run");
    setText("#zipStatus", "Selected");
    $("#zipStatus").className = "status-chip amber";
    $("#prepareZipReplace").disabled = true;
    logEvent("Native file chooser returned client-demo.zip.");
  });
  $("#validateZip").addEventListener("click", () => {
    if (!state.zipFile) {
      setText("#zipValidation", "Choose a file first");
      return;
    }
    if (!state.zipFile.valid) {
      setText("#zipValidation", "Failed: selected file is not a .zip archive");
      setText("#zipStatus", "Failed");
      $("#zipStatus").className = "status-chip red";
      addOperation("ZIP validation failed", "failed", "The selected source was rejected before replacement.");
      $("#logsOutput").insertAdjacentHTML("afterbegin", "<p class=\"warn\">[playground] rejected import: notes.txt is not a zip archive</p>");
      return;
    }
    setText("#zipValidation", "Valid Playground archive; replacement warning required");
    setText("#zipStatus", "Validated");
    $("#zipStatus").className = "status-chip green";
    $("#prepareZipReplace").disabled = false;
    addOperation("ZIP validation passed", "ready", "client-demo.zip can replace the current files and database.");
  });
  $("#prepareZipReplace").addEventListener("click", () => $("#zipWarning").hidden = false);
  $("#cancelZipImport").addEventListener("click", () => {
    $("#zipWarning").hidden = true;
    addOperation("ZIP import cancelled", "idle", "Replacement warning was dismissed without changing the active Playground.");
  });
  $("#confirmZipImport").addEventListener("click", () => {
    $("#zipWarning").hidden = true;
    simulateProgress({
      bar: "#zipProgress",
      text: "#zipProgressText",
      steps: [
        { percent: 12, label: "Unpacking archive..." },
        { percent: 36, label: "Replacing WordPress files..." },
        { percent: 68, label: "Importing SQLite database..." },
        { percent: 91, label: "Rebuilding active shell identity..." },
        { percent: 100, label: "Import completed." },
      ],
      done: () => {
        completeReplacement("Client Demo Import", "client-demo.zip");
        setText("#zipStatus", "Imported");
        $("#zipStatus").className = "status-chip green";
      },
    });
  });

  $("#connectGitHubExport").addEventListener("click", () => {
    setText("#exportDestination", "GitHub connected as adamziel");
    $("#chooseGitHubRepo").disabled = false;
    addOperation("GitHub export connected", "ready", "Export token granted for this session.");
  });
  $("#chooseGitHubRepo").addEventListener("click", () => {
    setText("#exportDestination", "adam/playground-export, branch playground/client-demo");
    $("#runGitHubExport").disabled = false;
    logEvent("GitHub export destination selected.");
  });
  $("#runGitHubExport").addEventListener("click", () => {
    setText("#exportStatus", "Exporting");
    $("#exportStatus").className = "status-chip amber";
    simulateProgress({
      bar: "#exportProgress",
      text: "#exportProgressText",
      steps: [
        { percent: 20, label: "Collecting wp-content and blueprint..." },
        { percent: 46, label: "Preparing commit..." },
        { percent: 74, label: "Pushing to adam/playground-export..." },
        { percent: 100, label: "GitHub export completed." },
      ],
      done: () => {
        setText("#exportStatus", "Exported");
        $("#exportStatus").className = "status-chip green";
        setText("#exportResult", "Created pull request adam/playground-export#42 with files, database notes, and blueprint.json.");
        addOperation("GitHub export completed", "complete", "Transfer history now contains adam/playground-export#42.");
      },
    });
  });
  $("#downloadZip").addEventListener("click", () => {
    setText("#exportDestination", "Local download: playground-export.zip");
    setText("#exportStatus", "Generating");
    $("#exportStatus").className = "status-chip amber";
    simulateProgress({
      bar: "#exportProgress",
      text: "#exportProgressText",
      steps: [
        { percent: 18, label: "Collecting WordPress files..." },
        { percent: 40, label: "Adding blueprint.json..." },
        { percent: 70, label: "Adding database export manifest..." },
        { percent: 100, label: "playground-export.zip generated." },
      ],
      done: () => {
        setText("#exportStatus", "Downloaded");
        $("#exportStatus").className = "status-chip green";
        setText("#exportResult", "Generated playground-export.zip from the active Playground.");
        addOperation("ZIP download completed", "complete", "Generated playground-export.zip and recorded it in transfer history.");
      },
    });
  });

  $("#clearLogs").addEventListener("click", () => {
    $("#logsOutput").innerHTML = "<p>[playground] transient warnings cleared</p><p>[wordpress] no problems so far</p><p>[php] no fatal errors</p>";
    addOperation("Logs cleared", "complete", "Transient warnings were removed from the log view.");
  });
}

renderShell();
renderOperations();
renderEvents();
renderSaved();
renderBlueprints();
setMode("transfer");
initEvents();
