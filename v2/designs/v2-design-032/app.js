const state = {
  mode: "create",
  activeId: "temp",
  path: "/hello-from-playground/",
  saveDestination: "local",
  localPermission: "none",
  localFolder: "",
  githubConnected: false,
  selectedBlueprint: "Art Gallery",
  blueprintFilter: "All",
  pendingDeleteId: null,
  saved: [
    {
      id: "temp",
      name: "Unsaved Playground",
      storage: "temporary",
      detail: "Temporary session, lost on refresh or close",
      badge: "Current",
      active: true
    },
    {
      id: "research",
      name: "Research Browser Playground",
      storage: "browser",
      detail: "Browser storage, slug /research-browser-playground/",
      badge: "Saved",
      active: false
    },
    {
      id: "local-shop",
      name: "Coffee Shop Local Copy",
      storage: "local",
      detail: "~/Sites/playground-coffee-shop, reconnect after reload",
      badge: "Local",
      active: false
    }
  ],
  history: [
    "Temporary Playground opened at /hello-from-playground/.",
    "SQLite database ready at /wordpress/wp-content/database/.ht.sqlite."
  ],
  logs: {
    playground: [
      ["info", "Booted WordPress latest with PHP 8.3."],
      ["warning", "Network access enabled for remote asset requests."]
    ],
    wordpress: [
      ["info", "No WordPress fatal errors so far."],
      ["warning", "Theme stylesheet requested a remote font; cached response used."]
    ],
    php: [
      ["info", "PHP 8.3 runtime initialized."],
      ["error", "Notice: Undefined index handled in sample-plugin.php on line 42."]
    ]
  }
};

const modeLabels = {
  create: ["Create a Playground", "Inputs ready"],
  save: ["Save active Playground", "Local destination"],
  library: ["Library", "3 objects"],
  manage: ["Site Manager", "Settings"],
  blueprints: ["Blueprints", "43 available"],
  data: ["Database and data", "SQLite"],
  logs: ["Runtime logs", "Warnings visible"],
  transfer: ["Transfer", "ZIP ready"]
};

const blueprints = [
  ["Art Gallery", "Website", "Personal", "Vue theme gallery starter", "gallery"],
  ["Coffee Shop", "WooCommerce", "Store", "WooCommerce coffee shop storefront", "coffee"],
  ["Feed Reader with the Friends Plugin", "Content", "Featured", "Feeds and social web subscriptions", "feed"],
  ["Gaming News", "News", "Website", "Spiel theme gaming publication", "news"],
  ["Non-profit Organization", "Website", "Featured", "Koinonia theme non-profit site", "nonprofit"],
  ["Personal Blog", "Personal", "Content", "Substrata theme personal journal", "blog"],
  ["Mini Store", "WooCommerce", "Website", "Small product catalog with cart", "shop"],
  ["Gutenberg Experiments", "Gutenberg", "Experiments", "Editor API playground with demo blocks", "exp"]
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

function addHistory(message) {
  state.history.unshift(message);
  state.history = state.history.slice(0, 8);
  renderHistory();
}

function setMode(mode) {
  state.mode = mode;
  document.body.scrollTop = 0;
  $(".app").dataset.mode = mode;
  $$(".railItem").forEach((button) => button.classList.toggle("active", button.dataset.modeTarget === mode));
  $$("[data-mode-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.modePanel === mode));
  const [title, status] = modeLabels[mode];
  $("#modeTitle").textContent = title;
  $("#modeState").textContent = status;
  $("#modeState").className = `badge ${mode === "transfer" ? "green" : mode === "library" ? "" : "blue"}`;
}

function activeSite() {
  return state.saved.find((site) => site.id === state.activeId) || state.saved[0];
}

function storageClass(storage) {
  if (storage === "temporary") return "warning";
  if (storage === "local") return "green";
  if (storage === "browser") return "blue";
  return "";
}

function storageLabel(storage) {
  if (storage === "temporary") return "Temporary";
  if (storage === "local") return "Local directory";
  if (storage === "browser") return "Saved in browser";
  return storage;
}

function updateShell() {
  const site = activeSite();
  $("#shellTitle").textContent = site.name;
  $("#shellSubtitle").textContent = site.detail;
  $("#storageBadge").textContent = storageLabel(site.storage);
  $("#storageBadge").className = `badge ${storageClass(site.storage)}`;
  $("#pathInput").value = state.path;
  $("#browserUrl").textContent = `playground.local${state.path}`;
  $("#previewState").textContent = `Ready at ${state.path}`;
  $("#previewKicker").textContent = storageLabel(site.storage);

  const resetCopy = $("#resetCopy");
  const resetDetail = $("#resetDetail");
  if (site.storage === "temporary") {
    resetCopy.textContent = "Apply Settings and Reset Playground";
    resetDetail.textContent = "Temporary state will be discarded. Save before applying settings if you need to keep it.";
  } else if (site.storage === "local") {
    resetCopy.textContent = "Save and Reload local directory";
    resetDetail.textContent = "Settings write into the selected folder, then reload. Browser may ask to reconnect the folder after refresh.";
  } else {
    resetCopy.textContent = "Save and Reload browser Playground";
    resetDetail.textContent = "Stored Playgrounds have limited settings and reload after the copy finishes.";
  }
}

function setPreview(message, detail) {
  $("#previewState").textContent = message;
  if (detail) $("#previewBody").textContent = detail;
}

function renderSaved() {
  const list = $("#savedList");
  list.innerHTML = state.saved.map((site) => `
    <article class="savedRow ${site.id === state.activeId ? "active" : ""}" data-site-id="${escapeHtml(site.id)}">
      <span class="rowIcon">W</span>
      <div>
        <strong>${escapeHtml(site.name)}</strong>
        <small>${escapeHtml(site.detail)}</small>
      </div>
      <div class="rowActions">
        <span class="badge ${storageClass(site.storage)}">${escapeHtml(site.badge)}</span>
        <button type="button" class="small" data-open-site="${escapeHtml(site.id)}">Open</button>
        <button type="button" class="small" data-rename-site="${escapeHtml(site.id)}">Rename</button>
        ${site.id === "temp" ? "" : `<button type="button" class="small dangerGhost" data-delete-site="${escapeHtml(site.id)}">Delete</button>`}
      </div>
    </article>
  `).join("");

  $("#deleteConfirm").classList.add("hidden");
  $("#renameBox").classList.add("hidden");
  updateShell();
}

function renderHistory() {
  $("#historyList").innerHTML = state.history.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderLogs(target = "playground") {
  const html = state.logs[target].map(([kind, text]) => `
    <div class="logLine ${kind === "error" ? "error" : kind === "warning" ? "warning" : ""}">
      <strong>${escapeHtml(kind.toUpperCase())}</strong>
      <span>${escapeHtml(text)}</span>
    </div>
  `).join("");
  $("#logStream").innerHTML = html;
  $("#managerLogStream").innerHTML = html;
}

function renderBlueprints() {
  const query = $("#blueprintSearch").value.trim().toLowerCase();
  const filtered = blueprints.filter((item) => {
    const matchFilter = state.blueprintFilter === "All" || item.includes(state.blueprintFilter);
    const matchQuery = !query || item.join(" ").toLowerCase().includes(query);
    return matchFilter && matchQuery;
  });

  $("#blueprintGrid").innerHTML = filtered.map(([title, tag1, tag2, desc, theme]) => `
    <button type="button" class="blueprintCard ${title === state.selectedBlueprint ? "active" : ""}" data-blueprint="${escapeHtml(title)}">
      <span class="blueprintThumb ${escapeHtml(theme)}">${escapeHtml(tag1)}</span>
      <span class="blueprintBody">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(desc)}</span>
        <span>${escapeHtml(tag1)} / ${escapeHtml(tag2)}</span>
      </span>
    </button>
  `).join("");

  const selected = blueprints.find((item) => item[0] === state.selectedBlueprint) || blueprints[0];
  $("#selectedBlueprintTitle").textContent = selected[0];
  $("#selectedBlueprintMeta").textContent = `${selected[1]}, ${selected[2]} - ${selected[3]}`;
  $("#blueprintUrl").value = `https://playground.wordpress.net/blueprints/${selected[0].toLowerCase().replaceAll(" ", "-")}.json`;
}

function setSaveDestination(destination) {
  state.saveDestination = destination;
  $$("[data-save-destination]").forEach((button) => {
    button.classList.toggle("active", button.dataset.saveDestination === destination);
  });
  if (destination === "local") {
    $("#permissionBox").classList.remove("hidden");
    $("#saveProgressLabel").textContent = state.localPermission === "granted" ? "Ready to copy files into selected folder" : "Folder permission required";
    $("#saveProgressCount").textContent = "0 / 3751";
  } else {
    $("#permissionBox").classList.add("hidden");
    $("#saveProgressLabel").textContent = "Ready to copy files into browser storage";
    $("#saveProgressCount").textContent = "0 / 3751";
  }
  $("#saveMeter").style.width = "0%";
  $("#saveResult").textContent = destination === "local"
    ? "Local directory saves write files to a chosen folder. After reload, the browser may require folder permission again."
    : "Browser saves create a slug and survive reload only in this browser.";
}

function chooseFolder() {
  state.localPermission = "granted";
  state.localFolder = "~/Sites/playground-research-browser";
  $("#permissionTitle").textContent = "Folder permission granted";
  $("#permissionText").textContent = `${state.localFolder} selected. Reconnect may be required after browser reload.`;
  $("#chooseFolderBtn").textContent = "Change folder";
  $("#saveResult").textContent = "Permission granted. Start save to copy WordPress files, Blueprints, uploads, and database into the selected folder.";
  addHistory("Folder permission granted for ~/Sites/playground-research-browser.");
}

function runProgress({ meter, label, count, steps, done }) {
  let index = 0;
  const timer = window.setInterval(() => {
    const step = steps[index];
    $(meter).style.width = `${step.percent}%`;
    $(label).textContent = step.label;
    if (count) $(count).textContent = step.count;
    index += 1;
    if (index >= steps.length) {
      window.clearInterval(timer);
      done();
    }
  }, 420);
}

function startSave() {
  if (state.saveDestination === "local" && state.localPermission !== "granted") {
    $("#saveResult").textContent = "Folder picker is required before a local-directory save can start.";
    $("#permissionTitle").textContent = "Permission needed";
    $("#permissionText").textContent = "Choose a folder to grant write access for this Playground.";
    return;
  }

  $("#startSaveBtn").disabled = true;
  const destination = state.saveDestination;
  const name = $("#saveName").value.trim() || "Saved Playground";
  runProgress({
    meter: "#saveMeter",
    label: "#saveProgressLabel",
    count: "#saveProgressCount",
    steps: [
      { percent: 18, label: "Preparing WordPress filesystem", count: "684 / 3751" },
      { percent: 46, label: "Copying plugins, themes, and uploads", count: "1724 / 3751" },
      { percent: 78, label: "Writing SQLite database and Blueprint", count: "3042 / 3751" },
      { percent: 100, label: "Save complete", count: "3751 / 3751" }
    ],
    done() {
      $("#startSaveBtn").disabled = false;
      const storage = destination === "local" ? "local" : "browser";
      const detail = destination === "local"
        ? `${state.localFolder}, folder-backed local Playground`
        : `Browser storage, slug /${name.toLowerCase().replaceAll(" ", "-")}/`;
      const temp = state.saved.find((site) => site.id === "temp");
      temp.name = name;
      temp.storage = storage;
      temp.detail = detail;
      temp.badge = destination === "local" ? "Local" : "Saved";
      state.activeId = "temp";
      $("#saveResult").textContent = destination === "local"
        ? `Saved to ${state.localFolder}. The shell now shows a local-directory badge; after reload, reconnect the folder to continue editing.`
        : "Saved in this browser. The shell now shows a browser-saved badge and a saved slug.";
      $("#previewNotice").textContent = destination === "local"
        ? "Local directory save complete. Reload keeps the identity but may ask for folder access again."
        : "Browser save complete. This Playground survives reload in this browser.";
      addHistory(`${name} saved to ${destination === "local" ? state.localFolder : "browser storage"}.`);
      renderSaved();
      updateShell();
    }
  });
}

function launchRoute(route) {
  const labels = {
    vanilla: ["Vanilla WordPress", "/", "Clean latest WordPress runtime started."],
    wordpress: ["WordPress PR Preview", "/wp-admin/about.php", "WordPress core PR preview running with patch metadata."],
    gutenberg: ["Gutenberg Branch Preview", "/wp-admin/site-editor.php", "Gutenberg branch preview built with network access enabled."]
  };
  const [name, path, detail] = labels[route] || labels.vanilla;
  const temp = state.saved.find((site) => site.id === "temp");
  temp.name = name;
  temp.storage = "temporary";
  temp.detail = "Temporary replacement, save before refresh";
  temp.badge = "Current";
  state.activeId = "temp";
  state.path = path;
  $("#previewHeadline").innerHTML = route === "vanilla" ? "Hello from <span>WordPress Playground!</span>" : `${name}`;
  $("#previewBody").textContent = detail;
  $("#previewNotice").textContent = "This route replaced the current temporary runtime. Save before refreshing.";
  addHistory(`${name} started at ${path}.`);
  renderSaved();
}

function startGithubImport() {
  $("#githubImportBtn").disabled = true;
  $("#githubImportBtn").textContent = "Connecting...";
  window.setTimeout(() => {
    $("#githubImportBtn").textContent = "Importing...";
    setPreview("Importing GitHub repository", "GitHub account connected for this session. The token will not be stored after refresh.");
    window.setTimeout(() => {
      $("#githubImportBtn").disabled = false;
      $("#githubImportBtn").textContent = "Connect and import";
      const temp = state.saved.find((site) => site.id === "temp");
      temp.name = "GitHub Import Playground";
      temp.storage = "temporary";
      temp.detail = "Imported from wordpress/wordpress-playground, not saved";
      state.activeId = "temp";
      state.path = "/wp-admin/plugins.php";
      $("#previewHeadline").textContent = "GitHub import ready";
      $("#previewNotice").textContent = "Imported repository is temporary until saved or exported.";
      addHistory("Imported wordpress/wordpress-playground from GitHub. Token not stored.");
      renderSaved();
    }, 700);
  }, 650);
}

function requestDelete(id) {
  state.pendingDeleteId = id;
  const site = state.saved.find((item) => item.id === id);
  $("#deleteConfirm strong").textContent = `Delete ${site.name}?`;
  $("#deleteConfirm").classList.remove("hidden");
  $("#renameBox").classList.add("hidden");
}

function confirmDelete() {
  const deleted = state.saved.find((site) => site.id === state.pendingDeleteId);
  state.saved = state.saved.filter((site) => site.id !== state.pendingDeleteId);
  if (state.activeId === state.pendingDeleteId) {
    state.activeId = "temp";
    state.path = "/hello-from-playground/";
    $("#previewNotice").textContent = "Deleted active saved Playground. The shell has returned to the unsaved temporary Playground.";
  }
  addHistory(`${deleted.name} deleted from saved Playgrounds.`);
  state.pendingDeleteId = null;
  renderSaved();
}

function requestRename(id) {
  const site = state.saved.find((item) => item.id === id);
  state.pendingRenameId = id;
  $("#renameInput").value = site.name;
  $("#renameBox").classList.remove("hidden");
  $("#deleteConfirm").classList.add("hidden");
}

function applyRename() {
  const site = state.saved.find((item) => item.id === state.pendingRenameId);
  const next = $("#renameInput").value.trim();
  if (!site || !next) return;
  const old = site.name;
  site.name = next;
  site.detail = site.detail.replace(old, next);
  $("#renameBox").classList.add("hidden");
  addHistory(`${old} renamed to ${next}.`);
  renderSaved();
}

function openSite(id) {
  const site = state.saved.find((item) => item.id === id);
  state.activeId = id;
  state.path = site.storage === "browser" ? "/research-browser-playground/" : site.storage === "local" ? "/shop/" : "/hello-from-playground/";
  $("#previewHeadline").textContent = site.name;
  $("#previewBody").textContent = site.detail;
  $("#previewNotice").textContent = site.storage === "local"
    ? "Local directory Playground opened. Reconnect folder permission after browser reload if requested."
    : site.storage === "browser"
      ? "Browser-saved Playground opened from this browser storage."
      : "Temporary Playground opened. Save before refresh.";
  addHistory(`${site.name} opened from Library.`);
  renderSaved();
}

function handleManagerTab(tab) {
  $$("#managerTabs button").forEach((button) => button.classList.toggle("active", button.dataset.managerTab === tab));
  $$("[data-manager-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.managerPanel === tab));
  $("#modeState").textContent = tab[0].toUpperCase() + tab.slice(1);
}

function handleLogFilter(filter) {
  $$("[data-log-filter]").forEach((button) => button.classList.toggle("active", button.dataset.logFilter === filter));
  renderLogs(filter);
}

function completeZipDownload() {
  $("#downloadZipBtn").disabled = true;
  runProgress({
    meter: "#zipMeter",
    label: "#zipLabel",
    count: "#zipCount",
    steps: [
      { percent: 16, label: "Collecting WordPress files", count: "16%" },
      { percent: 39, label: "Adding wp-content and uploads", count: "39%" },
      { percent: 71, label: "Bundling SQLite database", count: "71%" },
      { percent: 100, label: "Archive generated", count: "100%" }
    ],
    done() {
      $("#downloadZipBtn").disabled = false;
      $("#downloadZipBtn").textContent = "Regenerate download";
      $("#openZipResultBtn").disabled = false;
      $("#zipResult").textContent = "Generated playground-export-2026-05-21.zip, 18.4 MB. Download is ready and recorded in transfer history.";
      $("#portabilityCopy").textContent = "ZIP archive generated: playground-export-2026-05-21.zip. Database and Blueprint bundle are available separately.";
      setPreview("ZIP download generated", "The active Playground was packaged into a portable ZIP containing files, uploads, Blueprint metadata, and SQLite database.");
      addHistory("Generated playground-export-2026-05-21.zip from active Playground.");
    }
  });
}

function connectGithubExport() {
  state.githubConnected = true;
  $("#githubResult").textContent = "GitHub connected for this session. Choose the target repository and export. Token is not stored after refresh.";
  addHistory("GitHub account connected for export session.");
}

function exportGithub() {
  if (!state.githubConnected) {
    $("#githubResult").textContent = "Connect GitHub before exporting. The access token will only live for this session.";
    return;
  }
  $("#githubResult").textContent = "Exporting files, database, and Blueprint bundle to GitHub...";
  window.setTimeout(() => {
    $("#githubResult").textContent = `Exported to ${$("#githubRepo").value} at commit 8f34c2a. Transfer history updated.`;
    addHistory(`Exported active Playground to ${$("#githubRepo").value} at commit 8f34c2a.`);
  }, 850);
}

function reviewZipImport() {
  $("#zipImportConfirm").classList.remove("hidden");
}

function confirmZipImport() {
  $("#zipImportConfirm").classList.add("hidden");
  const temp = state.saved.find((site) => site.id === "temp");
  temp.name = "Imported ZIP Playground";
  temp.storage = "temporary";
  temp.detail = "Imported from agency-site-export.zip, unsaved replacement";
  temp.badge = "Current";
  state.activeId = "temp";
  state.path = "/";
  $("#previewHeadline").textContent = "Imported ZIP Playground";
  $("#previewBody").textContent = "agency-site-export.zip replaced files and the SQLite database in the active runtime.";
  $("#previewNotice").textContent = "Replacement complete. Save or export this imported site before refresh.";
  addHistory("agency-site-export.zip replaced the active Playground.");
  renderSaved();
}

function simpleResult(selector, message, history) {
  const target = $(selector);
  if (target) target.textContent = message;
  if (history) addHistory(history);
}

document.addEventListener("click", (event) => {
  const modeButton = event.target.closest("[data-mode-target]");
  if (modeButton) {
    setMode(modeButton.dataset.modeTarget);
    return;
  }

  const pathButton = event.target.closest("[data-path]");
  if (pathButton) {
    state.path = pathButton.dataset.path;
    updateShell();
    addHistory(`Path changed to ${state.path}.`);
    return;
  }

  const destination = event.target.closest("[data-save-destination]");
  if (destination) {
    setSaveDestination(destination.dataset.saveDestination);
    return;
  }

  const launch = event.target.closest("[data-launch]");
  if (launch) {
    launchRoute(launch.dataset.launch);
    return;
  }

  const open = event.target.closest("[data-open-site]");
  if (open) {
    openSite(open.dataset.openSite);
    return;
  }

  const del = event.target.closest("[data-delete-site]");
  if (del) {
    requestDelete(del.dataset.deleteSite);
    return;
  }

  const rename = event.target.closest("[data-rename-site]");
  if (rename) {
    requestRename(rename.dataset.renameSite);
    return;
  }

  const managerTab = event.target.closest("[data-manager-tab]");
  if (managerTab) {
    handleManagerTab(managerTab.dataset.managerTab);
    return;
  }

  const logFilter = event.target.closest("[data-log-filter]");
  if (logFilter) {
    handleLogFilter(logFilter.dataset.logFilter);
    return;
  }

  const blueprintFilter = event.target.closest("[data-filter]");
  if (blueprintFilter) {
    state.blueprintFilter = blueprintFilter.dataset.filter;
    $$("#blueprintFilters button").forEach((button) => button.classList.toggle("active", button === blueprintFilter));
    renderBlueprints();
    return;
  }

  const blueprint = event.target.closest("[data-blueprint]");
  if (blueprint) {
    state.selectedBlueprint = blueprint.dataset.blueprint;
    renderBlueprints();
  }
});

$("#pathForm").addEventListener("submit", (event) => {
  event.preventDefault();
  state.path = $("#pathInput").value.startsWith("/") ? $("#pathInput").value : `/${$("#pathInput").value}`;
  updateShell();
  addHistory(`Navigated active WordPress preview to ${state.path}.`);
});

$("#refreshBtn").addEventListener("click", () => {
  setPreview(`Refreshed at ${state.path}`, "The embedded WordPress page reloaded without leaving the operations console.");
  addHistory(`Refreshed active WordPress page at ${state.path}.`);
});

$("#chooseFolderBtn").addEventListener("click", chooseFolder);
$("#startSaveBtn").addEventListener("click", startSave);
$("#cancelSaveBtn").addEventListener("click", () => {
  $("#saveMeter").style.width = "0%";
  $("#saveProgressLabel").textContent = "Save cancelled";
  $("#saveProgressCount").textContent = "0 / 3751";
  $("#saveResult").textContent = "Save cancelled. The active Playground is unchanged.";
});
$("#githubImportBtn").addEventListener("click", startGithubImport);
$("#confirmDeleteBtn").addEventListener("click", confirmDelete);
$("#cancelDeleteBtn").addEventListener("click", () => $("#deleteConfirm").classList.add("hidden"));
$("#applyRenameBtn").addEventListener("click", applyRename);
$("#cancelRenameBtn").addEventListener("click", () => $("#renameBox").classList.add("hidden"));
$("#resetRuntimeBtn").addEventListener("click", () => {
  const site = activeSite();
  if (site.storage === "temporary") {
    $("#previewNotice").textContent = "Settings applied. Temporary runtime was reset from the selected WordPress and PHP versions.";
    addHistory("Settings applied with destructive reset for temporary Playground.");
  } else {
    $("#previewNotice").textContent = "Settings saved and Playground reloaded with stored identity preserved.";
    addHistory("Settings saved and stored Playground reloaded.");
  }
});
$("#newFileBtn").addEventListener("click", () => addHistory("Created /wordpress/wp-content/new-file.php in file browser."));
$("#newFolderBtn").addEventListener("click", () => addHistory("Created /wordpress/wp-content/new-folder/ in file browser."));
$("#uploadBtn").addEventListener("click", () => addHistory("Uploaded selected file into /wordpress/wp-content/uploads/."));
$("#touchFileBtn").addEventListener("click", () => {
  $("#fileDirty").textContent = "Dirty";
  $("#fileDirty").className = "badge warning";
  addHistory("Edited /wordpress/wp-config.php; file has unsaved changes.");
});
$("#saveFileBtn").addEventListener("click", () => {
  $("#fileDirty").textContent = "Saved";
  $("#fileDirty").className = "badge green";
  addHistory("Saved /wordpress/wp-config.php.");
});
$("#copyBlueprintBtn").addEventListener("click", () => addHistory("Copied link to current blueprint.json."));
$("#downloadBlueprintBtn").addEventListener("click", () => addHistory("Downloaded current Blueprint bundle."));
$("#runBlueprintBtn").addEventListener("click", () => {
  $("#blueprintValidation").textContent = "Run complete";
  addHistory("Ran current /blueprint.json against active Playground.");
});
$("#downloadDbBtn").addEventListener("click", () => addHistory("Downloaded database.sqlite from Site Manager."));
$("#downloadDbBtn2").addEventListener("click", () => addHistory("Downloaded database.sqlite from Data mode."));
$("#downloadDbBtn3").addEventListener("click", () => addHistory("Downloaded database.sqlite from Transfer mode."));
$("#blueprintSearch").addEventListener("input", renderBlueprints);
$("#validateBlueprintUrlBtn").addEventListener("click", () => simpleResult("#blueprintResult", "Blueprint URL validated against schema. Replacement confirmation will be shown before running.", "Validated Blueprint URL."));
$("#copyBlueprintUrlBtn").addEventListener("click", () => addHistory("Copied selected Blueprint URL."));
$("#downloadSelectedBlueprintBtn").addEventListener("click", () => addHistory(`Downloaded ${state.selectedBlueprint} Blueprint bundle.`));
$("#runSelectedBlueprintBtn").addEventListener("click", () => {
  $("#blueprintResult").textContent = `${state.selectedBlueprint} ran successfully. Preview, path, and activity history updated.`;
  state.path = "/";
  $("#previewHeadline").textContent = state.selectedBlueprint;
  $("#previewBody").textContent = "Blueprint run completed and replaced the current demo content with the selected starter site.";
  $("#previewNotice").textContent = "Blueprint result is temporary until saved to browser storage, a local folder, GitHub, or ZIP.";
  updateShell();
  addHistory(`${state.selectedBlueprint} Blueprint ran against active Playground.`);
});
$("#downloadZipBtn").addEventListener("click", completeZipDownload);
$("#openZipResultBtn").addEventListener("click", () => addHistory("Opened generated ZIP result in browser downloads."));
$("#connectGithubBtn").addEventListener("click", connectGithubExport);
$("#exportGithubBtn").addEventListener("click", exportGithub);
$("#reviewZipImportBtn").addEventListener("click", reviewZipImport);
$("#confirmZipImportBtn").addEventListener("click", confirmZipImport);
$("#cancelZipImportBtn").addEventListener("click", () => $("#zipImportConfirm").classList.add("hidden"));
$("#downloadBlueprintBundleBtn").addEventListener("click", () => addHistory("Downloaded Blueprint bundle from Transfer mode."));
$("#copyBlueprintLinkBtn").addEventListener("click", () => addHistory("Copied Blueprint link from Transfer mode."));
$("#clearHistoryBtn").addEventListener("click", () => {
  state.history = ["Resolved transfer history cleared. Current active state retained."];
  renderHistory();
});

setMode("create");
setSaveDestination("local");
renderSaved();
renderHistory();
renderLogs("playground");
renderBlueprints();
updateShell();
