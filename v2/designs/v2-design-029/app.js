const app = document.querySelector(".app");
const panels = Array.from(document.querySelectorAll(".panel"));
const panelButtons = Array.from(document.querySelectorAll("[data-panel-target]"));
const managerTabs = Array.from(document.querySelectorAll("[data-manager-tab]"));
const managerPanels = Array.from(document.querySelectorAll(".manager-panel"));
const eventList = document.querySelector("#eventList");
const overviewEvents = document.querySelector("#overviewEvents");
const toast = document.querySelector("#toast");

const state = {
  activeId: "research",
  title: "Research Browser Playground",
  subtitle: "Browser-backed slug: research-browser-playground",
  storage: "browser",
  route: "Vanilla saved site",
  path: "/hello-from-playground/",
  runtime: "WP latest / PHP 8.3",
  reset: "Settings use Save & Reload",
  dbSize: "452 KB",
  pendingDeleteId: null,
  saveDestination: "browser",
  localFolderGranted: false,
  routeValidated: false
};

const routeData = {
  vanilla: {
    kind: "Vanilla route selected",
    title: "Start Vanilla WordPress",
    description: "Start a fresh temporary Playground using the selected WordPress, PHP, language, network, and multisite settings.",
    label: "Optional landing path",
    value: "/",
    constraints: ["Uses WordPress latest", "Creates temporary identity", "Save required before reload"],
    button: "Start fresh"
  },
  wordpress: {
    kind: "WordPress PR route selected",
    title: "Preview a WordPress PR",
    description: "Requires a WordPress core PR number or wordpress-develop URL. The resulting object is a temporary PR preview until saved.",
    label: "PR number or URL",
    value: "https://github.com/WordPress/wordpress-develop/pull/7821",
    constraints: ["Core PR only", "Builds WordPress runtime", "Export available after preview"],
    button: "Preview WordPress PR"
  },
  gutenberg: {
    kind: "Gutenberg route selected",
    title: "Preview a Gutenberg PR or branch",
    description: "Use a PR number, GitHub URL, or branch name. The preview loads a temporary identity and enables Save, GitHub export, ZIP download, database download, and Blueprint tools.",
    label: "PR number, URL, or branch name",
    value: "try/block-bindings-panel",
    constraints: ["Installs Gutenberg plugin build", "Network access required", "Current saved site remains available in Library"],
    button: "Preview branch"
  },
  github: {
    kind: "GitHub import selected",
    title: "Import from GitHub",
    description: "Imports public plugins, themes, or wp-content directories. Connect an account first; the access token is not stored after refresh.",
    label: "Repository path",
    value: "WordPress/gutenberg",
    constraints: ["Account connection required", "Token not stored", "Imports plugin, theme, or wp-content"],
    button: "Connect and import"
  },
  blueprint: {
    kind: "Blueprint URL selected",
    title: "Run Blueprint from URL",
    description: "Validate a public blueprint.json URL, warn about current-site replacement, then run the Blueprint against the active runtime.",
    label: "Blueprint URL",
    value: "https://playground.wordpress.net/blueprints/art-gallery.json",
    constraints: ["Public JSON URL", "Schema validation", "Replacement warning before run"],
    button: "Validate and run"
  },
  zip: {
    kind: "ZIP import selected",
    title: "Import .zip",
    description: "Opens the native file chooser, validates the archive, then requires confirmation before replacing current files and database.",
    label: "Selected archive",
    value: "playground-export.zip",
    constraints: ["Native file chooser", "Archive validation", "Replaces files and database after confirmation"],
    button: "Choose .zip"
  }
};

function $(selector) {
  return document.querySelector(selector);
}

function setText(selector, text) {
  const node = $(selector);
  if (node) node.textContent = text;
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.hidden = true;
  }, 2400);
}

function addEvent(type, text) {
  const labels = {
    success: "Done",
    warning: "Warn",
    neutral: "Info",
    danger: "Delete"
  };
  [eventList, overviewEvents].forEach((list) => {
    const item = document.createElement("li");
    item.innerHTML = `<span class="event-type ${type}">${labels[type] || "Info"}</span> ${text}`;
    list.prepend(item);
    while (list.children.length > 8) list.lastElementChild.remove();
  });
}

function storagePillClass(storage) {
  if (storage === "browser") return "pill browser";
  if (storage === "local") return "pill success";
  if (storage === "preview") return "pill warning";
  return "pill warning";
}

function storageLabel(storage) {
  if (storage === "browser") return "Saved in browser";
  if (storage === "local") return "Local directory";
  if (storage === "preview") return "Preview unsaved";
  return "Temporary";
}

function storageFact(storage) {
  if (storage === "browser") return "Browser storage on this device";
  if (storage === "local") return "Local folder, reconnect permission may be required";
  if (storage === "preview") return "Temporary preview, save before refresh or close";
  return "Temporary session, lost on refresh or close";
}

function resetFact(storage) {
  if (storage === "browser" || storage === "local") return "Stored Playgrounds save settings, then reload.";
  return "Unsaved Playgrounds reset destructively.";
}

function updateShell() {
  app.dataset.storage = state.storage;
  setText("#activeTitle", state.title);
  setText("#activeSubtitle", state.subtitle);
  setText("#factTitle", state.title);
  setText("#factPath", state.path);
  setText("#factStorage", storageFact(state.storage));
  setText("#factReset", resetFact(state.storage));
  setText("#storageMini", storageLabel(state.storage));
  setText("#railStorage", storageLabel(state.storage).replace("Saved in ", ""));
  setText("#railRoute", state.route);
  setText("#pathState", "ready");
  setText("#browserUrl", `playground.local${state.path}`);
  setText("#runtimeBadge", state.runtime);
  setText("#resetMode", state.storage === "temporary" || state.storage === "preview" ? "Reset will discard unsaved work" : "Settings use Save & Reload");
  setText("#caseState", state.storage === "browser" ? "browser saved" : state.storage);
  setText("#caseBadge", state.storage === "browser" ? "active saved" : state.storage);

  const badge = $("#storageBadge");
  badge.className = storagePillClass(state.storage);
  badge.textContent = storageLabel(state.storage);
  $("#caseState").className = storagePillClass(state.storage);
  $("#caseBadge").className = storagePillClass(state.storage);

  $("#pathInput").value = state.path;
  document.querySelectorAll(".saved-row").forEach((row) => {
    row.classList.toggle("is-active", row.dataset.rowId === state.activeId);
  });
}

function setPanel(name) {
  panels.forEach((panel) => panel.classList.toggle("is-active", panel.id === `panel-${name}`));
  document.querySelectorAll(".command-tabs [data-panel-target]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.panelTarget === name);
  });
}

function setManagerTab(name) {
  managerTabs.forEach((button) => button.classList.toggle("is-active", button.dataset.managerTab === name));
  managerPanels.forEach((panel) => panel.classList.toggle("is-active", panel.id === `manager-${name}`));
  setText("#railManagerTab", name[0].toUpperCase() + name.slice(1));
}

panelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setPanel(button.dataset.panelTarget);
    if (button.dataset.managerTab) setManagerTab(button.dataset.managerTab);
  });
});

managerTabs.forEach((button) => {
  button.addEventListener("click", () => {
    setManagerTab(button.dataset.managerTab);
  });
});

$("#pathInput").addEventListener("change", (event) => {
  state.path = event.target.value.startsWith("/") ? event.target.value : `/${event.target.value}`;
  setText("#previewStatus", "path changed");
  addEvent("neutral", `Navigated active preview to <code>${state.path}</code>.`);
  updateShell();
});

$("#refreshButton").addEventListener("click", () => {
  setText("#pathState", "reloaded");
  setText("#previewStatus", "refreshed");
  addEvent("neutral", `Refreshed active WordPress page at <code>${state.path}</code>.`);
  showToast("Active WordPress page refreshed.");
});

$("#homeButton").addEventListener("click", () => {
  state.path = "/hello-from-playground/";
  setText("#previewTitle", "Hello from WordPress Playground!");
  setText("#previewKicker", "Homepage");
  addEvent("neutral", "Opened Homepage in the protected preview.");
  updateShell();
});

$("#adminButton").addEventListener("click", () => {
  state.path = "/wp-admin/";
  setText("#previewTitle", "WordPress Admin Dashboard");
  setText("#previewKicker", "WP Admin");
  setText("#previewText", "Admin is open in the same Playground shell. Files, database, Blueprint, logs, save, and export controls stay available.");
  addEvent("neutral", "Opened WP Admin from the shell.");
  updateShell();
});

document.querySelectorAll(".route-card").forEach((card) => {
  card.addEventListener("click", () => {
    const data = routeData[card.dataset.route];
    document.querySelectorAll(".route-card").forEach((item) => item.classList.remove("is-active"));
    card.classList.add("is-active");
    $("#routeKind").textContent = data.kind;
    $("#routeTitle").textContent = data.title;
    $("#routeDescription").textContent = data.description;
    $("#routeInputLabel").textContent = data.label;
    $("#routeInput").value = data.value;
    $("#routeConstraints").innerHTML = data.constraints.map((item) => `<span>${item}</span>`).join("");
    $("#runRouteButton").textContent = data.button;
    state.routeValidated = false;
    resetRouteTimeline("Input awaiting validation");
    setText("#launchResult", `${data.title} selected. Validate before running.`);
  });
});

function resetRouteTimeline(firstText) {
  $("#routeTimeline").innerHTML = `
    <li class="current">${firstText}</li>
    <li>Runtime not loaded</li>
    <li>Preview identity not assigned</li>
    <li>Save and export availability unchanged</li>
  `;
}

function completeTimeline(items) {
  $("#routeTimeline").innerHTML = items.map((item, index) => `<li class="${index === items.length - 1 ? "current" : "done"}">${item}</li>`).join("");
}

$("#validateRouteButton").addEventListener("click", () => {
  const input = $("#routeInput").value.trim();
  if (!input) {
    setText("#launchResult", "Validation failed: route input is required.");
    addEvent("warning", "Route validation failed because the input was empty.");
    return;
  }
  state.routeValidated = true;
  completeTimeline(["Input validated", "Runtime not loaded", "Preview identity not assigned", "Save and export availability unchanged"]);
  setText("#launchResult", `Validated ${input}. Ready to preview.`);
  addEvent("success", `Validated launch route input <code>${input}</code>.`);
});

$("#runRouteButton").addEventListener("click", () => {
  const activeRoute = document.querySelector(".route-card.is-active").dataset.route;
  const input = $("#routeInput").value.trim();
  if (!state.routeValidated) {
    $("#validateRouteButton").click();
    if (!state.routeValidated) return;
  }

  const progress = $("#routeProgress");
  const meter = progress.querySelector(".meter span");
  progress.hidden = false;
  meter.style.width = "18%";
  setText("#routeProgressTitle", "Building preview");
  setText("#routeProgressText", "Resolving dependencies and booting WordPress");
  completeTimeline(["Input validated", "Runtime loading", "Preview identity not assigned", "Save and export locked during load"]);

  setTimeout(() => {
    meter.style.width = "68%";
    setText("#routeProgressText", "Applying route contract to active shell");
  }, 450);

  setTimeout(() => {
    meter.style.width = "100%";
    const routeLabel = activeRoute === "gutenberg" ? `Gutenberg branch ${input}` : routeData[activeRoute].title.replace("Preview a ", "").replace("Start ", "");
    state.activeId = "preview";
    state.title = routeLabel;
    state.subtitle = "Temporary preview identity - save before refresh";
    state.storage = "preview";
    state.route = routeLabel;
    state.path = activeRoute === "gutenberg" ? "/wp-admin/site-editor.php?canvas=edit" : "/";
    setText("#previewKicker", "Preview ready");
    setText("#previewTitle", routeLabel);
    setText("#previewText", "The route-specific preview is running. Save, GitHub export, ZIP download, database download, Blueprint tools, logs, and Site Manager actions are available for this preview object.");
    setText("#previewNote", "This is a temporary preview. Save it in this browser or to a local directory before refresh or close.");
    setText("#reviewTarget", routeLabel);
    setText("#reviewSummary", "Validation and load completed. The preview identity is now attached to the active shell.");
    setText("#saveLock", "Save available");
    setText("#exportLock", "Export available");
    setText("#launchResult", `${routeLabel} is running. Save and export are available.`);
    completeTimeline(["Input validated", "Runtime loaded", "Preview identity assigned", "Save and export available"]);
    ensurePreviewRow(routeLabel);
    addEvent("success", `Preview ready for <code>${routeLabel}</code>; path changed to <code>${state.path}</code>.`);
    updateShell();
    showToast("Preview identity assigned.");
  }, 1100);
});

$("#cancelRouteButton").addEventListener("click", () => {
  state.routeValidated = false;
  resetRouteTimeline("Route run cancelled");
  setText("#launchResult", "Route cancelled. Active Playground was not replaced.");
  addEvent("neutral", "Cancelled launch route before replacement.");
});

function ensurePreviewRow(title) {
  let row = document.querySelector('[data-row-id="preview"]');
  if (!row) {
    row = document.createElement("article");
    row.className = "saved-row";
    row.dataset.rowId = "preview";
    row.innerHTML = `
      <span class="row-logo temporary">P</span>
      <div>
        <strong></strong>
        <small>Preview object - temporary until saved</small>
      </div>
      <div class="row-actions">
        <button class="mini" type="button" data-open-row="preview">Open</button>
        <button class="mini" type="button" data-panel-target="save">Save</button>
        <button class="mini danger" type="button" data-delete-row="preview">Delete</button>
      </div>
    `;
    $("#savedList").prepend(row);
    wireDynamicRow(row);
  }
  row.querySelector("strong").textContent = title;
}

document.querySelectorAll("[data-save-destination]").forEach((card) => {
  card.addEventListener("click", () => {
    state.saveDestination = card.dataset.saveDestination;
    document.querySelectorAll("[data-save-destination]").forEach((item) => item.classList.toggle("is-selected", item === card));
    $("#localPermission").hidden = state.saveDestination !== "local";
    setText("#saveResult", state.saveDestination === "local" ? "Local directory save requires folder permission before copying files." : "Browser save creates a slug and a saved row on this device.");
  });
});

$("#chooseLocalButton").addEventListener("click", () => {
  state.localFolderGranted = true;
  setText("#localPermissionText", "Folder selected: ~/Sites/playground-diagnostics. Permission granted for this session.");
  addEvent("success", "Local folder permission granted for ~/Sites/playground-diagnostics.");
});

$("#denyLocalButton").addEventListener("click", () => {
  state.localFolderGranted = false;
  setText("#localPermissionText", "Folder picker cancelled. No files were copied and browser storage is unchanged.");
  setText("#saveResult", "Local directory save cancelled before copy.");
  addEvent("warning", "Local directory picker was cancelled before saving.");
});

$("#cancelSaveButton").addEventListener("click", () => {
  $("#saveProgress").hidden = true;
  setText("#saveResult", "Save cancelled. Active Playground state is unchanged.");
  addEvent("neutral", "Save flow cancelled before copy.");
});

$("#startSaveButton").addEventListener("click", () => {
  if (state.saveDestination === "local" && !state.localFolderGranted) {
    $("#localPermission").hidden = false;
    setText("#saveResult", "Choose a local directory before saving locally.");
    addEvent("warning", "Local save blocked until a folder is chosen.");
    return;
  }
  const name = $("#saveName").value.trim() || "Saved Playground";
  const progress = $("#saveProgress");
  const meter = progress.querySelector(".meter span");
  progress.hidden = false;
  meter.style.width = "12%";
  setText("#saveProgressTitle", state.saveDestination === "local" ? "Saving to local directory" : "Saving in this browser");
  setText("#saveProgressText", "429 / 3751 files copied");
  setText("#saveResult", "Saving files, database, and Blueprint metadata...");

  setTimeout(() => {
    meter.style.width = "57%";
    setText("#saveProgressText", "2140 / 3751 files copied");
  }, 420);

  setTimeout(() => {
    meter.style.width = "100%";
    setText("#saveProgressText", "3751 / 3751 files copied");
    state.title = name;
    state.storage = state.saveDestination === "local" ? "local" : "browser";
    state.subtitle = state.storage === "local" ? "Local folder: ~/Sites/playground-diagnostics" : `Browser-backed slug: ${slugify(name)}`;
    state.activeId = state.storage === "local" ? "local-saved-current" : "research";
    state.route = state.storage === "local" ? "Local directory saved site" : "Browser saved site";
    state.reset = "Settings use Save & Reload";
    upsertSavedRow(state.activeId, name, state.storage);
    setText("#saveResult", state.storage === "local" ? "Saved to ~/Sites/playground-diagnostics. Reconnect may be required after permission changes." : `Saved in this browser as ${slugify(name)}.`);
    addEvent("success", state.storage === "local" ? `Saved <code>${name}</code> to local directory.` : `Saved <code>${name}</code> in browser storage.`);
    updateShell();
    showToast("Save complete.");
  }, 1000);
});

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "saved-playground";
}

function upsertSavedRow(id, name, storage) {
  let row = document.querySelector(`[data-row-id="${id}"]`);
  if (!row) {
    row = document.createElement("article");
    row.className = "saved-row";
    row.dataset.rowId = id;
    row.innerHTML = `
      <span class="row-logo ${storage === "local" ? "local" : ""}">${storage === "local" ? "L" : "W"}</span>
      <div>
        <strong></strong>
        <small></small>
      </div>
      <div class="row-actions">
        <button class="mini" type="button" data-open-row="${id}">Open</button>
        <button class="mini" type="button" data-panel-target="manager">Manage</button>
        <button class="mini" type="button" data-rename-row="${id}">Rename</button>
        <button class="mini danger" type="button" data-delete-row="${id}">Delete</button>
      </div>
    `;
    $("#savedList").prepend(row);
    wireDynamicRow(row);
  }
  row.querySelector("strong").textContent = name;
  row.querySelector("small").textContent = storage === "local" ? "Local directory - ~/Sites/playground-diagnostics - reconnect may be required" : `Browser storage - slug ${slugify(name)} - active`;
}

function wireDynamicRow(scope = document) {
  scope.querySelectorAll("[data-open-row]").forEach((button) => {
    button.addEventListener("click", () => openRow(button.dataset.openRow));
  });
  scope.querySelectorAll("[data-rename-row]").forEach((button) => {
    button.addEventListener("click", () => renameRow(button.dataset.renameRow));
  });
  scope.querySelectorAll("[data-delete-row]").forEach((button) => {
    button.addEventListener("click", () => showDelete(button.dataset.deleteRow));
  });
  scope.querySelectorAll("[data-panel-target]").forEach((button) => {
    button.addEventListener("click", () => setPanel(button.dataset.panelTarget));
  });
}

function openRow(id) {
  const row = document.querySelector(`[data-row-id="${id}"]`);
  if (!row) return;
  const title = row.querySelector("strong").textContent;
  state.activeId = id;
  state.title = title;
  state.path = "/hello-from-playground/";
  if (id.includes("local")) {
    state.storage = "local";
    state.subtitle = "Local folder: ~/Sites/theme-lab";
    state.route = "Local directory saved site";
  } else if (id === "temporary") {
    state.storage = "temporary";
    state.subtitle = "Temporary session, not saved";
    state.route = "Unsaved vanilla site";
  } else if (id === "preview") {
    state.storage = "preview";
    state.subtitle = "Temporary preview identity - save before refresh";
    state.route = title;
  } else {
    state.storage = "browser";
    state.subtitle = `Browser-backed slug: ${slugify(title)}`;
    state.route = "Browser saved site";
  }
  addEvent("neutral", `Opened <code>${title}</code> from saved management.`);
  updateShell();
}

function renameRow(id) {
  const row = document.querySelector(`[data-row-id="${id}"]`);
  if (!row) return;
  const current = row.querySelector("strong").textContent;
  const next = id === state.activeId ? `${current} Renamed` : `${current} Copy`;
  row.querySelector("strong").textContent = next;
  if (id === state.activeId) {
    state.title = next;
    state.subtitle = state.storage === "browser" ? `Browser-backed slug: ${slugify(next)}` : state.subtitle;
    updateShell();
  }
  setText("#libraryResult", `Renamed row to ${next}.`);
  addEvent("success", `Renamed saved Playground to <code>${next}</code>.`);
}

document.querySelectorAll("[data-start-delete]").forEach((button) => {
  button.addEventListener("click", () => showDelete(state.activeId));
});

function showDelete(id) {
  const row = document.querySelector(`[data-row-id="${id}"]`);
  if (!row) {
    setText("#libraryResult", "Nothing to delete for the selected object.");
    return;
  }
  state.pendingDeleteId = id;
  const name = row.querySelector("strong").textContent;
  $("#deleteBox").hidden = false;
  $("#deleteProgress").hidden = true;
  $("#deleteConfirmInput").value = "";
  setText("#deleteTitle", `Delete ${name}?`);
  setText("#deleteText", id === state.activeId ? "This is the active Playground. Deleting it removes the saved/local copy and falls the live shell back to Unsaved Playground." : "This removes the saved copy from the management list. The active shell remains unchanged.");
  setText("#libraryResult", `Delete warning shown for ${name}.`);
  setPanel("library");
  addEvent("warning", `Delete warning shown for <code>${name}</code>.`);
}

$("#cancelDeleteButton").addEventListener("click", () => {
  $("#deleteBox").hidden = true;
  setText("#libraryResult", "Delete cancelled. Saved row remains available.");
  addEvent("neutral", "Delete cancelled from the confirmation panel.");
});

$("#confirmDeleteButton").addEventListener("click", () => {
  if ($("#deleteConfirmInput").value.trim().toUpperCase() !== "DELETE") {
    setText("#libraryResult", "Type DELETE to confirm destructive removal.");
    addEvent("warning", "Delete confirmation blocked until DELETE is typed.");
    return;
  }
  const id = state.pendingDeleteId;
  const row = document.querySelector(`[data-row-id="${id}"]`);
  if (!row) return;
  const name = row.querySelector("strong").textContent;
  const progress = $("#deleteProgress");
  const meter = progress.querySelector(".meter span");
  progress.hidden = false;
  meter.style.width = "20%";
  setText("#libraryResult", `Deleting ${name}...`);
  setTimeout(() => {
    meter.style.width = "70%";
  }, 350);
  setTimeout(() => {
    meter.style.width = "100%";
    row.remove();
    if (id === state.activeId) {
      state.activeId = "temporary";
      state.title = "Unsaved Playground";
      state.subtitle = "Temporary fallback after saved copy deletion";
      state.storage = "temporary";
      state.route = "Unsaved fallback";
      state.path = "/hello-from-playground/";
      setText("#previewKicker", "Fallback active");
      setText("#previewTitle", "Hello from WordPress Playground!");
      setText("#previewText", "The saved copy was deleted. The live shell now points at an unsaved fallback Playground so the browser is never left without an active site.");
      setText("#previewNote", "Temporary Playgrounds are lost on refresh or close unless saved.");
      setText("#reviewTarget", "No PR preview running");
    }
    $("#deleteBox").hidden = true;
    setText("#libraryResult", `${name} deleted. Active shell fallback applied when needed.`);
    addEvent("danger", `Deleted <code>${name}</code>; active shell fell back to Unsaved Playground.`);
    updateShell();
    showToast("Saved Playground deleted.");
  }, 900);
});

function runResetFlow() {
  const progressText = state.storage === "temporary" || state.storage === "preview" ? "Resetting temporary files and database" : "Saving settings and reloading stored Playground";
  setText("#settingsWarningTitle", state.storage === "temporary" || state.storage === "preview" ? "Destructive reset in progress" : "Saved reload in progress");
  setText("#settingsWarningText", progressText);
  addEvent("warning", progressText + ".");
  setTimeout(() => {
    const stored = state.storage === "browser" || state.storage === "local";
    state.title = stored ? state.title : "Unsaved Playground";
    state.subtitle = stored ? state.subtitle : "Temporary fallback after destructive reset";
    state.activeId = stored ? state.activeId : "temporary";
    state.storage = stored ? state.storage : "temporary";
    state.route = stored ? state.route : "Unsaved reset result";
    state.path = "/hello-from-playground/";
    setText("#previewKicker", stored ? "Runtime reloaded" : "Reset complete");
    setText("#previewTitle", stored ? state.title : "Hello from WordPress Playground!");
    setText("#previewText", stored ? "The stored Playground reloaded with the selected runtime settings." : "The temporary Playground was reset and returned to the default WordPress Playground welcome page.");
    setText("#previewNote", stored ? "Stored Playgrounds keep their saved identity after Save & Reload." : "Temporary Playgrounds are lost on refresh or close unless saved.");
    setText("#settingsWarningText", "Runtime reloaded. WordPress latest, PHP 8.3, network on, multisite off.");
    setText("#previewStatus", "runtime reloaded");
    addEvent("success", "Runtime reload completed and preview returned to the homepage.");
    updateShell();
  }, 650);
}

$("#topResetButton").addEventListener("click", () => {
  setPanel("manager");
  setManagerTab("settings");
  runResetFlow();
});
$("#applySettingsButton").addEventListener("click", runResetFlow);
$("#destructiveResetButton").addEventListener("click", runResetFlow);

$("#fileEditor").addEventListener("input", () => {
  $("#fileDirty").className = "pill warning";
  $("#fileDirty").textContent = "dirty";
  setText("#fileResult", "wp-config.php has unsaved edits.");
});

$("#saveFileButton").addEventListener("click", () => {
  $("#fileDirty").className = "pill success";
  $("#fileDirty").textContent = "saved";
  setText("#fileResult", "wp-config.php saved. Dirty marker cleared and logs updated.");
  addEvent("success", "Saved edited file <code>/wordpress/wp-config.php</code>.");
});

$("#newFileButton").addEventListener("click", () => {
  setText("#fileResult", "Created /wordpress/wp-content/mu-plugins/support-note.php.");
  addEvent("success", "Created new file in the File browser.");
});

$("#newFolderButton").addEventListener("click", () => {
  setText("#fileResult", "Created /wordpress/wp-content/support-artifacts/.");
  addEvent("success", "Created new folder in the File browser.");
});

$("#uploadButton").addEventListener("click", () => {
  setText("#fileResult", "Upload complete: diagnostic-plugin.zip staged in wp-content/uploads.");
  addEvent("success", "Uploaded a file through Site Manager.");
});

$("#browseFilesButton").addEventListener("click", () => {
  setText("#fileResult", "Browse files opened. Selected /wordpress/wp-config.php remains in the editor.");
  addEvent("neutral", "Browse files action completed.");
});

document.querySelectorAll("[data-blueprint-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.blueprintFilter;
    document.querySelectorAll("[data-blueprint-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
    document.querySelectorAll(".blueprint-card").forEach((card) => {
      card.hidden = filter !== "All" && !card.dataset.category.includes(filter);
    });
    setText("#blueprintResult", `Showing ${filter === "All" ? "all visible" : filter} entries from a representative subset of 43 Blueprints.`);
  });
});

document.querySelectorAll(".blueprint-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".blueprint-card").forEach((item) => item.classList.remove("is-active"));
    card.classList.add("is-active");
    const name = card.dataset.blueprintName;
    setText("#selectedBlueprintTitle", `${name} blueprint.json`);
    $("#blueprintUrl").value = `https://playground.wordpress.net/blueprints/${slugify(name)}.json`;
    setText("#blueprintResult", `${name} selected. JSON validates before run.`);
  });
});

$("#copyBlueprintButton").addEventListener("click", () => {
  setText("#blueprintResult", "Blueprint URL copied to clipboard state.");
  addEvent("success", "Copied selected Blueprint URL.");
});

$("#downloadBlueprintButton").addEventListener("click", () => {
  setText("#blueprintResult", "Blueprint bundle downloaded: art-gallery-blueprint.zip.");
  addEvent("success", "Downloaded selected Blueprint bundle.");
});

$("#runBlueprintButton").addEventListener("click", () => {
  setText("#blueprintState", "running");
  $("#blueprintState").className = "pill warning";
  setText("#blueprintResult", "Replacement warning accepted. Running Blueprint against current Playground...");
  addEvent("warning", "Blueprint run accepted replacement warning.");
  setTimeout(() => {
    state.path = "/";
    state.dbSize = "588 KB";
    setText("#blueprintState", "applied");
    $("#blueprintState").className = "pill success";
    setText("#previewKicker", "Blueprint applied");
    setText("#previewTitle", "Art Gallery");
    setText("#previewText", "The selected Blueprint has replaced current content and updated the database. Site Manager, logs, and transfer history all reflect the run.");
    setText("#blueprintResult", "Blueprint run complete. Database size changed to 588 KB.");
    updateDatabaseSize("588 KB");
    addEvent("success", "Ran selected Blueprint and updated preview plus database size.");
    updateShell();
  }, 850);
});

function updateDatabaseSize(size) {
  state.dbSize = size;
  setText("#dbSize", size);
  setText("#railDbSize", `${size} used`);
  setText("#dbMini", `/wordpress/wp-content/database/.ht.sqlite - ${size}`);
}

function transferDone(label, message, type = "success") {
  setText("#transferResult", message);
  addEvent(type, `${label}: ${message}`);
  showToast(message);
}

$("#downloadDbButton").addEventListener("click", () => {
  setText("#databaseResult", "database.sqlite generated from /wordpress/wp-content/database/.ht.sqlite.");
  transferDone("Database", "database.sqlite downloaded.");
});
$("#adminerButton").addEventListener("click", () => {
  setText("#databaseResult", "Adminer opened in a new tool window state.");
  addEvent("neutral", "Opened Adminer for SQLite-backed database inspection.");
});
$("#phpmyadminButton").addEventListener("click", () => {
  setText("#databaseResult", "phpMyAdmin opened in a new tool window state.");
  addEvent("neutral", "Opened phpMyAdmin for database inspection.");
});

[
  ["exportGithubButton", "GitHub export", "Export to GitHub queued from Site Manager."],
  ["downloadZipButton", "ZIP download", "Active Playground packaged as playground-export.zip."],
  ["githubImportButton", "GitHub import", "Connected account and imported WordPress/gutenberg. Token will not persist after refresh."],
  ["githubExportButton", "GitHub export", "Pushed active Playground to my-org/playground-diagnostic-export."],
  ["zipImportButton", "ZIP import", "playground-export.zip validated. Replacement warning shown before import."],
  ["zipDownloadButton", "ZIP download", "Active Playground downloaded as playground-export.zip."],
  ["dbDownloadTransferButton", "Database", "database.sqlite downloaded from SQLite path."],
  ["bundleDownloadButton", "Blueprint", "Blueprint bundle downloaded from selected editor state."]
].forEach(([id, label, message]) => {
  const node = document.getElementById(id);
  if (node) node.addEventListener("click", () => transferDone(label, message, label.includes("ZIP import") ? "warning" : "success"));
});

$("#clearResolved").addEventListener("click", () => {
  overviewEvents.innerHTML = '<li><span class="event-type neutral">Info</span> Resolved overview events cleared.</li>';
});

$("#commandSearch").addEventListener("input", (event) => {
  const value = event.target.value.toLowerCase();
  if (value.includes("pr") || value.includes("branch") || value.includes("import")) setPanel("launch");
  if (value.includes("save") || value.includes("folder")) setPanel("save");
  if (value.includes("delete") || value.includes("rename")) setPanel("library");
  if (value.includes("database")) {
    setPanel("manager");
    setManagerTab("database");
  }
  if (value.includes("log")) {
    setPanel("manager");
    setManagerTab("logs");
  }
  if (value.includes("zip") || value.includes("github") || value.includes("export")) setPanel("transfers");
});

document.addEventListener("keydown", (event) => {
  if (!event.ctrlKey) return;
  const map = {
    "1": "overview",
    "2": "launch",
    "3": "save",
    "4": "library",
    "5": "manager",
    "6": "transfers"
  };
  if (map[event.key]) {
    event.preventDefault();
    setPanel(map[event.key]);
  }
});

wireDynamicRow();
updateShell();
