const state = {
  title: "Unsaved Playground",
  storage: "temporary",
  path: "/hello-from-playground/",
  activeBlueprint: "Coffee Shop",
  dbSize: "452 KB",
  historyCount: 2,
  deleteTarget: null,
  saveTimer: null,
};

const headings = {
  start: "Start and import",
  save: "Save destinations",
  transfers: "Portability transfers",
  saved: "Saved Playgrounds",
  manager: "Site Manager",
  blueprints: "Blueprint bundles",
};

const blueprints = [
  {
    title: "Art Gallery",
    description: "An art gallery created with the Vueo theme.",
    tags: ["featured", "website", "personal"],
    tone: "art",
    json: `{
  "landingPage": "/",
  "steps": [
    { "step": "installTheme", "themeZipFile": "vueo.zip" },
    { "step": "runPHP", "code": "<?php update_option('blogname','Art Gallery');" }
  ]
}`,
  },
  {
    title: "Coffee Shop",
    description: "A stylish WooCommerce coffee shop storefront with custom theme, products, and content.",
    tags: ["featured", "woocommerce", "website"],
    tone: "coffee",
    json: `{
  "landingPage": "/",
  "steps": [
    { "step": "installTheme", "themeZipFile": "coffee-shop.zip" },
    { "step": "runPHP", "code": "<?php update_option('blogname','Coffee Shop');" }
  ]
}`,
  },
  {
    title: "Feed Reader with the Friends Plugin",
    description: "Read feeds from the web in Playground using the Friends plugin.",
    tags: ["featured", "content"],
    tone: "feed",
    json: `{
  "landingPage": "/",
  "steps": [
    { "step": "installPlugin", "pluginZipFile": "friends.zip" },
    { "step": "runPHP", "code": "<?php update_option('blogname','Friends Feed');" }
  ]
}`,
  },
  {
    title: "Gaming News",
    description: "A gaming news site created with the Spiel theme.",
    tags: ["featured", "website", "news"],
    tone: "news",
    json: `{
  "landingPage": "/",
  "steps": [
    { "step": "installTheme", "themeZipFile": "spiel.zip" },
    { "step": "runPHP", "code": "<?php update_option('blogname','Gaming News');" }
  ]
}`,
  },
  {
    title: "Non-profit Organization",
    description: "A non-profit organization site created with the Koinonia theme.",
    tags: ["featured", "website"],
    tone: "nonprofit",
    json: `{
  "landingPage": "/",
  "steps": [
    { "step": "installTheme", "themeZipFile": "koinonia.zip" },
    { "step": "runPHP", "code": "<?php update_option('blogname','Non-profit Organization');" }
  ]
}`,
  },
  {
    title: "Personal Blog",
    description: "A personal blog created with the Substrata theme.",
    tags: ["personal", "website"],
    tone: "art",
    json: `{
  "landingPage": "/",
  "steps": [
    { "step": "installTheme", "themeZipFile": "substrata.zip" },
    { "step": "runPHP", "code": "<?php update_option('blogname','Personal Blog');" }
  ]
}`,
  },
];

const els = {
  shellTitle: document.querySelector("#shellTitle"),
  shellSubtitle: document.querySelector("#shellSubtitle"),
  pathInput: document.querySelector("#pathInput"),
  storageBadge: document.querySelector("#storageBadge"),
  saveObjectTitle: document.querySelector("#saveObjectTitle"),
  saveObjectCopy: document.querySelector("#saveObjectCopy"),
  saveObjectBadge: document.querySelector("#saveObjectBadge"),
  resetConsequence: document.querySelector("#resetConsequence"),
  settingsApply: document.querySelector("#settingsApply"),
  saveProgressTitle: document.querySelector("#saveProgressTitle"),
  saveProgressCount: document.querySelector("#saveProgressCount"),
  saveProgressBar: document.querySelector("#saveProgressBar"),
  saveProgressText: document.querySelector("#saveProgressText"),
  savedList: document.querySelector("#savedList"),
  history: document.querySelector("#transferHistory"),
  historyCount: document.querySelector("#historyCount"),
  previewTitle: document.querySelector("#previewTitle"),
  previewMeta: document.querySelector("#previewMeta"),
  previewContent: document.querySelector("#previewContent"),
  previewCopy: document.querySelector(".preview-copy"),
  dbSizeInline: document.querySelector("#dbSizeInline"),
  databaseSize: document.querySelector("#databaseSize"),
  deleteDialog: document.querySelector("#deleteDialog"),
  deleteTitle: document.querySelector("#deleteTitle"),
  deleteResult: document.querySelector("#deleteResult"),
  blueprintGrid: document.querySelector("#blueprintGrid"),
  selectedBlueprintTitle: document.querySelector("#selectedBlueprintTitle"),
  selectedBlueprintDescription: document.querySelector("#selectedBlueprintDescription"),
  blueprintEditor: document.querySelector("#blueprintEditor"),
  blueprintValidation: document.querySelector("#blueprintValidation"),
  replaceWarning: document.querySelector("#replaceWarning"),
};

function setTab(tab) {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tabTarget === tab);
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `tab-${tab}`);
  });
  document.querySelector("#panelHeading").textContent = headings[tab] || "Operations";
}

function setManagerTab(tab) {
  document.querySelectorAll(".manager-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.managerTarget === tab);
  });
  document.querySelectorAll(".manager-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `manager-${tab}`);
  });
}

function setStorage(storage, title, subtitle) {
  state.storage = storage;
  state.title = title;
  els.shellTitle.textContent = title;
  els.saveObjectTitle.textContent = title;
  els.shellSubtitle.textContent = subtitle;
  els.saveObjectCopy.textContent = subtitle;

  const label = storage === "browser" ? "Saved in browser" : storage === "local" ? "Local directory" : "Temporary";
  const className = storage === "browser" ? "state-pill success" : storage === "local" ? "state-pill info" : "state-pill warning";
  els.storageBadge.textContent = label;
  els.storageBadge.className = className;
  els.saveObjectBadge.textContent = label;
  els.saveObjectBadge.className = className;

  if (storage === "temporary") {
    els.resetConsequence.textContent = "Temporary sites reset destructively when settings are applied.";
    els.settingsApply.textContent = "Apply Settings & Reset Playground";
    els.settingsApply.className = "danger";
  } else {
    els.resetConsequence.textContent = storage === "local"
      ? "Local-directory sites save settings to the chosen folder and reconnect after refresh."
      : "Saved browser sites reload after settings are saved.";
    els.settingsApply.textContent = "Save & Reload";
    els.settingsApply.className = "primary";
  }
}

function setPath(path, meta = "Homepage · logged in as admin") {
  state.path = path;
  els.pathInput.value = path;
  els.previewMeta.textContent = `${path} · ${meta}`;
}

function addHistory(title, detail) {
  state.historyCount += 1;
  const item = document.createElement("li");
  item.innerHTML = `<b>${title}</b><span>${detail}</span>`;
  els.history.prepend(item);
  els.historyCount.textContent = `${state.historyCount} events`;
}

function setSavedActive(id) {
  document.querySelectorAll(".saved-row").forEach((row) => {
    row.classList.toggle("active", row.dataset.id === id);
  });
}

function createSavedRow({ id, title, detail, storage }) {
  const row = document.createElement("article");
  row.className = "saved-row active";
  row.dataset.id = id;
  const pillClass = storage === "local" ? "info" : "success";
  const pillText = storage === "local" ? "Local" : "Browser";
  row.innerHTML = `
    <div class="row-main">
      <strong>${title}</strong>
      <span>${detail}</span>
    </div>
    <span class="state-pill ${pillClass}">${pillText}</span>
    <div class="row-actions">
      <button class="secondary small" type="button" data-open-saved="${title}">Open</button>
      <button class="secondary small" type="button" data-rename-row>Rename</button>
      <button class="secondary small danger-text" type="button" data-delete-row>Delete</button>
    </div>
  `;
  document.querySelectorAll(".saved-row").forEach((savedRow) => savedRow.classList.remove("active"));
  els.savedList.prepend(row);
}

function runProgress({ title, countText, doneText, onDone, local }) {
  clearInterval(state.saveTimer);
  let progress = 0;
  const total = local ? 3751 : 3751;
  const step = local ? 469 : 536;
  els.saveProgressTitle.textContent = title;
  els.saveProgressText.textContent = local
    ? "Waiting for folder permission, then syncing files to the selected local directory."
    : "Copying the WordPress filesystem into browser storage.";
  state.saveTimer = setInterval(() => {
    progress = Math.min(total, progress + step);
    const percent = Math.round((progress / total) * 100);
    els.saveProgressCount.textContent = countText(progress, total);
    els.saveProgressBar.style.width = `${percent}%`;
    if (progress >= total) {
      clearInterval(state.saveTimer);
      els.saveProgressTitle.textContent = doneText;
      els.saveProgressText.textContent = local
        ? "Local directory permission granted. This Playground can reconnect to the chosen folder after reload."
        : "Browser save complete. The temporary object now has a slug and a saved-row identity.";
      onDone();
    }
  }, 180);
}

function saveInBrowser() {
  setTab("save");
  runProgress({
    title: "Saving to browser storage",
    countText: (progress, total) => `Saving ${progress} / ${total} files`,
    doneText: "Saved in this browser",
    onDone: () => {
      setStorage("browser", "Research Browser Playground", "Saved in this browser a moment ago · slug research-browser-playground");
      setPath("/hello-from-playground/?site=research-browser-playground", "saved browser runtime");
      createSavedRow({
        id: "research-browser-playground",
        title: "Research Browser Playground",
        detail: "Saved in this browser · created just now",
        storage: "browser",
      });
      addHistory("Browser save complete", "3028 / 3751 copied, slug research-browser-playground, reset action changed to Save & Reload");
    },
  });
}

function saveLocalDirectory() {
  setTab("save");
  runProgress({
    title: "Saving to local directory",
    local: true,
    countText: (progress, total) => `Syncing ${progress} / ${total} files`,
    doneText: "Local folder connected",
    onDone: () => {
      setStorage("local", "Local Directory Playground", "Saved to ~/Sites/playground-transfer · reconnect permission needed after refresh");
      setPath("/hello-from-playground/?folder=playground-transfer", "local folder runtime");
      createSavedRow({
        id: "local-directory-playground",
        title: "Local Directory Playground",
        detail: "Local directory · ~/Sites/playground-transfer",
        storage: "local",
      });
      addHistory("Local directory save complete", "Folder permission granted; refresh requires reconnecting ~/Sites/playground-transfer");
    },
  });
}

function renderBlueprints(filter = "all", query = "") {
  els.blueprintGrid.innerHTML = "";
  const normalized = query.trim().toLowerCase();
  blueprints
    .filter((blueprint) => filter === "all" || blueprint.tags.includes(filter))
    .filter((blueprint) => !normalized || blueprint.title.toLowerCase().includes(normalized) || blueprint.description.toLowerCase().includes(normalized))
    .forEach((blueprint) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = `blueprint-card${blueprint.title === state.activeBlueprint ? " active" : ""}`;
      card.dataset.tone = blueprint.tone;
      card.innerHTML = `
        <span class="blueprint-thumb"></span>
        <strong>${blueprint.title}</strong>
        <span>${blueprint.description}</span>
      `;
      card.addEventListener("click", () => selectBlueprint(blueprint.title));
      els.blueprintGrid.append(card);
    });
}

function selectBlueprint(title) {
  const blueprint = blueprints.find((item) => item.title === title) || blueprints[0];
  state.activeBlueprint = blueprint.title;
  els.selectedBlueprintTitle.textContent = blueprint.title;
  els.selectedBlueprintDescription.textContent = blueprint.description;
  els.blueprintEditor.value = blueprint.json;
  els.blueprintValidation.textContent = "JSON not validated in this session.";
  els.blueprintValidation.className = "validation-card";
  els.replaceWarning.classList.remove("show");
  renderBlueprints(document.querySelector(".filter.active")?.dataset.blueprintFilter || "all", document.querySelector("#blueprintSearch").value);
}

function validateBlueprint() {
  try {
    JSON.parse(els.blueprintEditor.value);
    els.blueprintValidation.textContent = `${state.activeBlueprint} validates against the current Blueprint bundle shape. Replacement warning is required before running.`;
    els.blueprintValidation.className = "validation-card valid";
    addHistory("Blueprint validated", `${state.activeBlueprint} JSON inspected and ready to run`);
  } catch (error) {
    els.blueprintValidation.textContent = `Validation failed: ${error.message}`;
    els.blueprintValidation.className = "validation-card";
  }
}

function applyBlueprint() {
  els.replaceWarning.classList.remove("show");
  els.blueprintValidation.className = "validation-card valid";
  els.blueprintValidation.textContent = `Running ${state.activeBlueprint}: replacing content, importing files, and updating options...`;
  let progress = 0;
  const timer = setInterval(() => {
    progress += 25;
    els.blueprintValidation.textContent = `Running ${state.activeBlueprint}: ${progress}% complete`;
    if (progress >= 100) {
      clearInterval(timer);
      state.dbSize = "812 KB";
      els.dbSizeInline.textContent = state.dbSize;
      els.databaseSize.textContent = state.dbSize;
      els.previewTitle.textContent = state.activeBlueprint;
      setPath("/", "Blueprint result · logged in as admin");
      els.previewContent.classList.add("blueprint-applied");
      els.previewCopy.innerHTML = `
        <h2>${state.activeBlueprint}</h2>
        <p>Blueprint run complete. The active preview, database size, path, and transfer history all reflect the replacement.</p>
        <mark>Current content was replaced after confirmation.</mark>
        <button>Open generated homepage</button>
      `;
      els.blueprintValidation.textContent = `${state.activeBlueprint} finished. Preview and database updated.`;
      addHistory("Blueprint run complete", `${state.activeBlueprint} replaced current content; database is now ${state.dbSize}`);
    }
  }, 260);
}

function openDelete(row) {
  state.deleteTarget = row;
  const title = row.querySelector("strong")?.textContent || "Saved Playground";
  els.deleteTitle.textContent = `Delete ${title}?`;
  if (typeof els.deleteDialog.showModal === "function") {
    els.deleteDialog.showModal();
  } else {
    row.classList.add("pending-delete");
  }
}

function finishDelete() {
  const row = state.deleteTarget;
  if (!row) return;
  const wasActive = row.classList.contains("active");
  const title = row.querySelector("strong")?.textContent || "Saved Playground";
  row.remove();
  if (wasActive) {
    setStorage("temporary", "Unsaved Playground", "Temporary runtime, not saved across refresh");
    setPath("/hello-from-playground/", "fallback after delete");
    setSavedActive("unsaved");
  }
  els.deleteResult.textContent = `${title} deleted. Saved row removed${wasActive ? " and active runtime fell back to Unsaved Playground." : "."}`;
  addHistory("Saved Playground deleted", `${title} row removed after confirmation`);
  state.deleteTarget = null;
  els.deleteDialog.close();
}

function renameRow(row) {
  const name = row.querySelector("strong");
  const oldName = name.textContent;
  const newName = oldName.includes("Renamed") ? oldName.replace("Renamed ", "") : `Renamed ${oldName}`;
  name.textContent = newName;
  const openButton = row.querySelector("[data-open-saved]");
  if (openButton) openButton.dataset.openSaved = newName;
  if (row.classList.contains("active")) {
    els.shellTitle.textContent = newName;
    els.saveObjectTitle.textContent = newName;
  }
  addHistory("Playground renamed", `${oldName} changed to ${newName}`);
}

function startRoute(label) {
  setStorage("temporary", label, "Temporary preview runtime created from selected start route");
  setPath(label.includes("PR") || label.includes("trunk") ? "/wp-admin/" : "/hello-from-playground/", "new route active");
  setSavedActive("unsaved");
  addHistory("Route started", `${label} created a temporary Playground and preserved the preview shell`);
}

document.addEventListener("click", (event) => {
  const tabTarget = event.target.closest("[data-tab-target]");
  if (tabTarget) {
    setTab(tabTarget.dataset.tabTarget);
  }

  const managerTarget = event.target.closest("[data-manager-target]");
  if (managerTarget) {
    setManagerTab(managerTarget.dataset.managerTarget);
  }

  const startButton = event.target.closest("[data-start-route]");
  if (startButton) {
    startRoute(startButton.dataset.startRoute);
  }

  const openSaved = event.target.closest("[data-open-saved]");
  if (openSaved) {
    const row = openSaved.closest(".saved-row");
    setSavedActive(row.dataset.id);
    const local = row.querySelector(".state-pill")?.textContent === "Local";
    setStorage(local ? "local" : "browser", openSaved.dataset.openSaved, local ? "Local directory Playground · reconnect permission retained for this session" : "Saved in this browser · loaded from storage");
    setPath("/hello-from-playground/", "opened saved Playground");
    addHistory("Saved Playground opened", `${openSaved.dataset.openSaved} is now active`);
  }

  const deleteButton = event.target.closest("[data-delete-row]");
  if (deleteButton) {
    openDelete(deleteButton.closest(".saved-row"));
  }

  const renameButton = event.target.closest("[data-rename-row]");
  if (renameButton) {
    renameRow(renameButton.closest(".saved-row"));
  }

  if (event.target.closest("[data-open-manager]")) {
    setTab("manager");
  }
});

document.querySelector("#pathForm").addEventListener("submit", (event) => {
  event.preventDefault();
  setPath(els.pathInput.value || "/", "path changed");
  addHistory("Path navigated", `Active preview navigated to ${els.pathInput.value || "/"}`);
});

document.querySelector("#pathInput").addEventListener("change", () => {
  setPath(els.pathInput.value || "/", "path changed");
  addHistory("Path navigated", `Active preview navigated to ${els.pathInput.value || "/"}`);
});

document.querySelector("#refreshButton").addEventListener("click", () => {
  addHistory("Preview refreshed", `${state.path} reloaded in the protected WordPress shell`);
});

document.querySelector("#homepageButton").addEventListener("click", () => {
  setPath("/", "Homepage · logged in as admin");
  addHistory("Homepage opened", "Active WordPress preview switched to /");
});

document.querySelector("#wpAdminButton").addEventListener("click", () => {
  setPath("/wp-admin/", "WP Admin · logged in as admin");
  els.previewTitle.textContent = "Dashboard";
  addHistory("WP Admin opened", "Active WordPress preview switched to /wp-admin/");
});

document.querySelector("#saveBrowser").addEventListener("click", saveInBrowser);
document.querySelector("#saveLocal").addEventListener("click", saveLocalDirectory);

document.querySelector("#settingsApply").addEventListener("click", () => {
  if (state.storage === "temporary") {
    addHistory("Settings reset complete", "Unsaved Playground reset after applying version, PHP, language, network, and multisite settings");
    setPath("/hello-from-playground/", "reset runtime");
  } else {
    addHistory("Settings saved and reloaded", `${state.title} reloaded with updated version, PHP, language, network, and multisite settings`);
  }
});

document.querySelector("#resetRuntime").addEventListener("click", () => {
  addHistory("Runtime reset warning accepted", `${state.title} returned to the default Playground welcome page`);
  setStorage("temporary", "Unsaved Playground", "Temporary runtime, not saved across refresh");
  setPath("/hello-from-playground/", "reset runtime");
  setSavedActive("unsaved");
});

document.querySelector("#githubConnect").addEventListener("click", () => {
  addHistory("GitHub connected", "Account connected for this session; token will not be stored after refresh");
});

document.querySelector("#githubImport").addEventListener("click", () => {
  addHistory("GitHub import ready", "Connected account, selected public plugin repository, waiting for import confirmation");
});

document.querySelector("#githubExport").addEventListener("click", () => {
  addHistory("Export to GitHub complete", `${state.title} exported as files, database, and Blueprint bundle`);
});

document.querySelector("#managerGithubExport").addEventListener("click", () => {
  addHistory("Site Manager export complete", `${state.title} exported to GitHub from Site Manager actions`);
});

document.querySelector("#zipImport").addEventListener("click", () => setTab("transfers"));
document.querySelector("#zipImportTwo").addEventListener("click", () => {
  addHistory("ZIP import validated", "site-export.zip selected; replacement warning required before import");
  setPath("/wp-admin/import.php", "ZIP import review");
});

document.querySelector("#zipDownload").addEventListener("click", () => {
  addHistory("ZIP download prepared", `${state.title} packaged as playground-export.zip`);
});

document.querySelector("#managerZipDownload").addEventListener("click", () => {
  addHistory("Site Manager zip prepared", `${state.title} packaged as playground-export.zip from Site Manager actions`);
});

document.querySelector("#dbDownload").addEventListener("click", () => {
  addHistory("Database downloaded", `database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite at ${state.dbSize}`);
});

document.querySelector("#managerDbDownload").addEventListener("click", () => {
  addHistory("Database downloaded", `database.sqlite downloaded from Site Manager at ${state.dbSize}`);
});

document.querySelector("#adminer").addEventListener("click", () => {
  addHistory("Adminer opened", "SQLite-backed database opened in Adminer");
});

document.querySelector("#phpmyadmin").addEventListener("click", () => {
  addHistory("phpMyAdmin opened", "SQLite-backed database opened in phpMyAdmin");
});

document.querySelector("#copyBlueprint").addEventListener("click", () => addHistory("Blueprint link copied", "Current Blueprint bundle link copied"));
document.querySelector("#downloadBlueprint").addEventListener("click", () => addHistory("Blueprint bundle downloaded", "Current Blueprint bundle downloaded"));
document.querySelector("#managerCopyBlueprint").addEventListener("click", () => addHistory("Blueprint link copied", "Site Manager Blueprint link copied"));
document.querySelector("#managerDownloadBlueprint").addEventListener("click", () => addHistory("Blueprint bundle downloaded", "Site Manager Blueprint bundle downloaded"));
document.querySelector("#copySelectedBlueprint").addEventListener("click", () => addHistory("Blueprint link copied", `${state.activeBlueprint} share link copied`));
document.querySelector("#downloadSelectedBlueprint").addEventListener("click", () => addHistory("Blueprint bundle downloaded", `${state.activeBlueprint} bundle downloaded`));

document.querySelector("#newFile").addEventListener("click", () => addHistory("File created", "/wordpress/wp-content/new-file.php created"));
document.querySelector("#newFolder").addEventListener("click", () => addHistory("Folder created", "/wordpress/wp-content/playground-assets created"));
document.querySelector("#uploadFile").addEventListener("click", () => addHistory("Upload complete", "theme-functions.php uploaded to /wordpress/wp-content/uploads"));
document.querySelector("#browseFile").addEventListener("click", () => addHistory("Browse result", "Selected /wordpress/wp-config.php in the file browser"));
document.querySelector("#saveFile").addEventListener("click", () => {
  document.querySelector("#fileDirty").textContent = "Saved";
  document.querySelector("#fileDirty").className = "state-pill success";
  addHistory("File saved", "/wordpress/wp-config.php dirty state cleared");
});

document.querySelector("#validateBlueprint").addEventListener("click", validateBlueprint);
document.querySelector("#runBlueprint").addEventListener("click", () => {
  validateBlueprint();
  els.replaceWarning.classList.add("show");
  addHistory("Blueprint replacement warning", `${state.activeBlueprint} requires confirmation before replacing current content`);
});
document.querySelector("#cancelBlueprintRun").addEventListener("click", () => {
  els.replaceWarning.classList.remove("show");
  addHistory("Blueprint run canceled", `${state.activeBlueprint} replacement was canceled before changes`);
});
document.querySelector("#confirmBlueprintRun").addEventListener("click", applyBlueprint);

document.querySelector("#confirmDelete").addEventListener("click", finishDelete);

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((filter) => filter.classList.remove("active"));
    button.classList.add("active");
    renderBlueprints(button.dataset.blueprintFilter, document.querySelector("#blueprintSearch").value);
  });
});

document.querySelector("#blueprintSearch").addEventListener("input", (event) => {
  const filter = document.querySelector(".filter.active")?.dataset.blueprintFilter || "all";
  renderBlueprints(filter, event.target.value);
});

setStorage("temporary", "Unsaved Playground", "Temporary runtime, not saved across refresh");
renderBlueprints();
