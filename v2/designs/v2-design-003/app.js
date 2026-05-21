const objects = [
  {
    id: "temp",
    title: "Unsaved Playground",
    slug: "temporary-session",
    storage: "temporary",
    path: "/hello-from-playground/",
    detail: "Not saved. Refresh or close will discard files and database.",
    created: "Current tab",
  },
  {
    id: "research",
    title: "Research Browser Playground",
    slug: "research-browser-playground",
    storage: "browser",
    path: "/hello-from-playground/",
    detail: "Saved in this browser a moment ago.",
    created: "May 21, 2026",
  },
  {
    id: "local",
    title: "Plugin Test Bench",
    slug: "plugin-test-bench",
    storage: "local",
    path: "/wp-admin/plugins.php",
    detail: "Local directory: ~/Playgrounds/plugin-test-bench",
    created: "Folder permission granted",
  },
];

const routeCopy = {
  vanilla: {
    title: "Vanilla WordPress",
    description: "Start a clean temporary Playground using the selected runtime settings.",
    input: "",
    label: "",
    constraints: ["Uses WordPress latest", "Creates a temporary object until saved"],
    action: "Start clean Playground",
  },
  "wordpress-pr": {
    title: "Preview a WordPress PR",
    description: "Preview a WordPress core pull request by PR number or wordpress-develop URL.",
    input: "https://github.com/WordPress/wordpress-develop/pull/7821",
    label: "PR number or URL",
    constraints: ["Requires a WordPress core PR", "Creates a temporary preview object", "Save and export after boot"],
    action: "Preview WordPress PR",
  },
  gutenberg: {
    title: "Preview a Gutenberg PR or Branch",
    description: "Run a Gutenberg PR, URL, or branch name in an isolated Playground.",
    input: "trunk",
    label: "PR number, URL, or branch name",
    constraints: ["Accepts PR number, GitHub URL, or branch", "Validates before boot", "Export enabled after preview"],
    action: "Preview Gutenberg",
  },
  github: {
    title: "Import from GitHub",
    description: "Import plugins, themes, or wp-content directories from public GitHub repositories.",
    input: "wordpress/gutenberg",
    label: "Repository or URL",
    constraints: ["GitHub account connection required", "Access token is not stored", "Re-authentication required after refresh"],
    action: "Connect and import",
  },
  "blueprint-url": {
    title: "Run Blueprint from URL",
    description: "Run a public Blueprint JSON URL and apply it to a Playground.",
    input: "https://example.com/blueprint.json",
    label: "Blueprint URL",
    constraints: ["URL must return Blueprint JSON", "Validation runs before replacement", "Current content may be changed"],
    action: "Run Blueprint URL",
  },
  zip: {
    title: "Import .zip",
    description: "Open the native file chooser, validate a Playground archive, then replace or create a site.",
    input: "playground-export.zip",
    label: "Selected file",
    constraints: ["Uses native file picker", "Validates archive structure", "Replacement requires confirmation"],
    action: "Choose and import .zip",
  },
};

const blueprints = [
  { title: "Art Gallery", category: "Website Personal Featured", description: "An art gallery created with the Vueo theme." },
  { title: "Coffee Shop", category: "WooCommerce Website Featured", description: "A WooCommerce coffee shop storefront with products and content." },
  { title: "Feed Reader with the Friends Plugin", category: "Content Featured", description: "Read feeds from the web via the Friends plugin." },
  { title: "Gaming News", category: "News Website Featured", description: "A gaming news site created with the Spiel theme." },
  { title: "Non-profit Organization", category: "Website Featured", description: "A non-profit organization site using the Koinonia theme." },
  { title: "Personal Blog", category: "Personal Website", description: "A personal blog created with the Substrata theme." },
  { title: "Gutenberg Data Views", category: "Gutenberg Experiments", description: "A Gutenberg experiment Playground for editor data views." },
  { title: "Content Experiments", category: "Content Experiments", description: "A content workflow demo with sample posts and media." },
];

let activeId = "research";
let selectedRoute = "vanilla";
let selectedBlueprint = blueprints[0];
let pendingDeleteId = null;
let activeCategory = "All";
let historyItems = [
  "Research Browser Playground opened from browser storage.",
  "database.sqlite downloaded from Plugin Test Bench.",
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function activeObject() {
  return objects.find((item) => item.id === activeId) || objects[0];
}

function storageLabel(storage) {
  if (storage === "browser") return "Saved in browser";
  if (storage === "local") return "Local directory";
  if (storage === "preview") return "Preview only";
  return "Temporary";
}

function storageSummary(object) {
  if (object.storage === "browser") return "Browser storage, this device";
  if (object.storage === "local") return object.detail;
  if (object.storage === "preview") return "Temporary PR or branch preview, not saved yet";
  return "Temporary tab storage, lost on refresh or close";
}

function resetSummary(object) {
  if (object.storage === "temporary" || object.storage === "preview") {
    return "Settings changes reset this Playground.";
  }
  return "Settings changes use Save & Reload.";
}

function addHistory(message) {
  historyItems.unshift(message);
  historyItems = historyItems.slice(0, 8);
  renderHistory();
}

function render() {
  const object = activeObject();
  const badgeClass = object.storage;
  document.body.dataset.activeStorage = object.storage;

  $("#shellTitle").textContent = object.title;
  $("#shellSubtitle").textContent = `Slug: ${object.slug}`;
  $("#inspectorTitle").textContent = object.title;
  $("#pathInput").value = object.path;
  $("#summaryIdentity").textContent = object.slug;
  $("#summaryStorage").textContent = storageSummary(object);
  $("#summaryPath").textContent = object.path;
  $("#summaryReset").textContent = resetSummary(object);
  $("#renameInput").value = object.title;
  $("#previewState").textContent = `Current path: ${object.path}`;
  $("#runtimeLabel").textContent = object.storage === "preview" ? "PR preview · WP latest · PHP 8.3" : "WP latest · PHP 8.3 · Network on";

  updateBadge($("#shellStorage"), badgeClass, storageLabel(object.storage));
  updateBadge($("#inspectorStorage"), badgeClass, storageLabel(object.storage));
  $("#shellSaveButton").textContent = object.storage === "temporary" || object.storage === "preview" ? "Save" : "Save & Reload";

  const dot = $("#siteDot");
  dot.style.background = object.storage === "temporary" ? "var(--amber)" : object.storage === "local" ? "var(--blue)" : object.storage === "preview" ? "var(--purple)" : "var(--green)";

  if (object.storage === "preview") {
    $("#previewKicker").textContent = "PR or branch preview";
    $("#previewTitle").textContent = object.title;
    $("#previewText").textContent = "The preview has booted and can now be saved to browser storage, saved to a local directory, exported to GitHub, or downloaded as a .zip.";
    $("#previewPrimary").textContent = "Open preview details";
  } else if (object.storage === "local") {
    $("#previewKicker").textContent = "Local directory Playground";
    $("#previewTitle").textContent = "Plugin test bench in WP Admin";
    $("#previewText").textContent = "This object is backed by a folder permission. File changes can be inspected outside the browser and may require reconnecting if permission is lost.";
    $("#previewPrimary").textContent = "Review plugins";
  } else if (object.storage === "temporary") {
    $("#previewKicker").textContent = "Temporary Playground";
    $("#previewTitle").textContent = "Hello from WordPress Playground!";
    $("#previewText").textContent = "This temporary site runs in the browser. Save it before refresh or close to keep files, database, and URL identity.";
    $("#previewPrimary").textContent = "Save this Playground";
  } else {
    $("#previewKicker").textContent = "Saved object loaded";
    $("#previewTitle").textContent = "Hello from WordPress Playground!";
    $("#previewText").textContent = "This saved browser Playground is ready for file, Blueprint, database, and portability work. The right inspector controls the same active object shown here.";
    $("#previewPrimary").textContent = "Discover the mission behind Playground";
  }

  renderObjectList();
  renderHistory();
}

function updateBadge(element, badgeClass, text) {
  element.className = `storage-badge ${badgeClass}`;
  element.textContent = text;
}

function renderObjectList() {
  const list = $("#objectList");
  list.innerHTML = objects
    .map((object) => {
      const canDelete = object.storage !== "temporary" && object.storage !== "preview";
      return `
        <article class="object-row ${object.id === activeId ? "is-active" : ""}">
          <div>
            <h3>${object.title}</h3>
            <p>${storageLabel(object.storage)} · ${object.created}<br>${object.detail}</p>
          </div>
          <div class="row-actions">
            <button type="button" data-open-object="${object.id}">${object.id === activeId ? "Active" : "Open"}</button>
            <button type="button" data-manage-object="${object.id}">Manage</button>
            ${canDelete ? `<button class="delete" type="button" data-delete-object="${object.id}">Delete</button>` : `<button type="button" data-save-object="${object.id}">Save</button>`}
          </div>
        </article>
      `;
    })
    .join("");

  $$("[data-open-object]").forEach((button) => {
    button.addEventListener("click", () => {
      activeId = button.dataset.openObject;
      $("#selectedCommand").textContent = "Open object";
      addHistory(`${activeObject().title} opened.`);
      render();
    });
  });

  $$("[data-manage-object]").forEach((button) => {
    button.addEventListener("click", () => {
      activeId = button.dataset.manageObject;
      showPanel("manager");
      $("#selectedCommand").textContent = "Manage object";
      render();
    });
  });

  $$("[data-delete-object]").forEach((button) => {
    button.addEventListener("click", () => beginDelete(button.dataset.deleteObject));
  });

  $$("[data-save-object]").forEach((button) => {
    button.addEventListener("click", () => {
      activeId = button.dataset.saveObject;
      runSave();
    });
  });
}

function showPanel(name) {
  $$(".panel").forEach((panel) => panel.classList.toggle("is-active", panel.id === `panel-${name}`));
  $$("[data-panel-target]").forEach((button) => button.classList.toggle("is-active", button.dataset.panelTarget === name));
}

function showSubpanel(name) {
  $$(".subpanel").forEach((panel) => panel.classList.toggle("is-active", panel.id === `subpanel-${name}`));
  $$("[data-subpanel-target]").forEach((button) => button.classList.toggle("is-active", button.dataset.subpanelTarget === name));
}

function progress(element, done) {
  element.hidden = false;
  const bar = element.querySelector(".progress span");
  bar.style.width = "0%";
  let value = 0;
  const timer = setInterval(() => {
    value += 25;
    bar.style.width = `${value}%`;
    if (value >= 100) {
      clearInterval(timer);
      setTimeout(done, 180);
    }
  }, 160);
}

function runSave() {
  const object = activeObject();
  const target = document.querySelector("input[name='saveTarget']:checked").value;
  $("#selectedCommand").textContent = target === "local" ? "Save to local directory" : "Save in browser";
  $("#saveProgressTitle").textContent = target === "local" ? "Requesting folder permission" : "Saving to browser storage";
  $("#saveProgressText").textContent = target === "local" ? "Folder selected: ~/Playgrounds/current-site" : "Saving 3028 / 3751 files";
  progress($("#saveProgress"), () => {
    if (target === "local") {
      object.title = object.title.replace("Unsaved", "Local Directory");
      object.slug = slugify(object.title);
      object.storage = "local";
      object.detail = `Local directory: ~/Playgrounds/${object.slug}`;
      object.created = "Folder permission granted";
      $("#saveResult").textContent = `${object.title} is now backed by a local directory. Reload keeps the folder identity but may require reconnecting permission.`;
      addHistory(`${object.title} saved to local directory.`);
    } else {
      object.title = object.title === "Unsaved Playground" ? "Saved Playground" : object.title.replace("Preview", "Saved Preview");
      object.slug = slugify(object.title);
      object.storage = "browser";
      object.detail = "Saved in this browser. Available from Saved Playgrounds.";
      object.created = "Saved just now";
      $("#saveResult").textContent = `${object.title} is saved in this browser. The shell title, slug, storage badge, and object row were updated.`;
      addHistory(`${object.title} saved in browser storage.`);
    }
    $("#saveProgress").hidden = true;
    render();
  });
}

function beginDelete(id) {
  pendingDeleteId = id;
  const object = objects.find((item) => item.id === id);
  $("#deleteTitle").textContent = `Delete ${object.title}?`;
  $("#deleteText").textContent = `${object.title} will be removed from Saved Playgrounds. If it is active, the live browser falls back to the temporary Playground.`;
  $("#deleteProgress").hidden = true;
  $("#deleteConfirm").hidden = false;
  $("#selectedCommand").textContent = "Delete confirmation";
}

function confirmDelete() {
  if (!pendingDeleteId) return;
  const deleted = objects.find((item) => item.id === pendingDeleteId);
  progress($("#deleteProgress"), () => {
    const index = objects.findIndex((item) => item.id === pendingDeleteId);
    if (index >= 0) objects.splice(index, 1);
    if (activeId === pendingDeleteId) {
      activeId = objects.find((item) => item.storage === "temporary")?.id || objects[0].id;
      $("#pathInput").value = activeObject().path;
    }
    $("#deleteConfirm").hidden = true;
    addHistory(`${deleted.title} deleted. Active site fell back to ${activeObject().title}.`);
    pendingDeleteId = null;
    $("#selectedCommand").textContent = "Delete complete";
    render();
  });
}

function selectRoute(route) {
  selectedRoute = route;
  const copy = routeCopy[route];
  $$(".route-card").forEach((card) => card.classList.toggle("is-selected", card.dataset.route === route));
  $("#routeTitle").textContent = copy.title;
  $("#routeDescription").textContent = copy.description;
  $("#routeInputWrap").hidden = !copy.input;
  $("#routeInputLabel").textContent = copy.label;
  $("#routeInput").value = copy.input;
  $("#routeConstraints").innerHTML = copy.constraints.map((item) => `<span>${item}</span>`).join("");
  $("#runRouteButton").textContent = copy.action;
  $("#routeResult").textContent = "Route selected. Validate input before booting if the route requires a value.";
  $("#selectedCommand").textContent = copy.title;
}

function runRoute(validateOnly = false) {
  const copy = routeCopy[selectedRoute];
  const input = $("#routeInput").value.trim();
  $("#routeProgressTitle").textContent = validateOnly ? "Validating route input" : "Preparing Playground preview";
  $("#routeProgressText").textContent = copy.input ? input : "Creating a clean runtime";
  progress($("#routeProgress"), () => {
    $("#routeProgress").hidden = true;
    if (validateOnly) {
      $("#routeResult").textContent = `${copy.title} input is valid for this prototype.`;
      addHistory(`${copy.title} input validated.`);
      return;
    }

    if (selectedRoute === "gutenberg") {
      createPreviewObject("Gutenberg trunk Preview", "gutenberg-trunk-preview", "/wp-admin/plugins.php", "preview", "Preview only", "Gutenberg branch validated and booted.");
      $("#routeResult").textContent = "Gutenberg branch preview is running. Save, Export to GitHub, Download .zip, and Site Manager are now available.";
    } else if (selectedRoute === "wordpress-pr") {
      createPreviewObject("WordPress PR Preview", "wordpress-pr-preview", "/wp-admin/", "preview", "Preview only", "WordPress PR input validated and booted.");
      $("#routeResult").textContent = "WordPress PR preview is running with save and export availability.";
    } else if (selectedRoute === "github") {
      createPreviewObject("GitHub Import Preview", "github-import-preview", "/wp-admin/plugins.php", "preview", "Preview only", "GitHub connected; repository imported.");
      $("#routeResult").textContent = "GitHub account connected, repository imported, token not stored after refresh.";
    } else if (selectedRoute === "blueprint-url") {
      createPreviewObject("Blueprint URL Preview", "blueprint-url-preview", "/hello-from-playground/", "preview", "Preview only", "Blueprint URL validated and applied.");
      $("#routeResult").textContent = "Blueprint URL validated and applied to a temporary preview object.";
    } else if (selectedRoute === "zip") {
      createPreviewObject("Imported ZIP Playground", "imported-zip-playground", "/wp-admin/", "preview", "Preview only", "ZIP archive validated and imported.");
      $("#routeResult").textContent = "ZIP archive validated, imported, and selected as the active Playground.";
    } else {
      createPreviewObject("Fresh Vanilla Playground", "fresh-vanilla-playground", "/hello-from-playground/", "temporary", "Temporary", "Clean WordPress Playground created.");
      $("#routeResult").textContent = "Fresh WordPress Playground created. Save it before refresh or close.";
    }
    render();
  });
}

function createPreviewObject(title, slug, path, storage, created, detail) {
  const existing = objects.findIndex((item) => item.id === "preview");
  const object = {
    id: "preview",
    title,
    slug,
    storage,
    path,
    detail,
    created,
  };
  if (existing >= 0) objects.splice(existing, 1, object);
  else objects.unshift(object);
  activeId = "preview";
  addHistory(`${title} created from ${routeCopy[selectedRoute].title}.`);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "playground";
}

function renderBlueprints() {
  const query = $("#blueprintSearch").value.toLowerCase();
  const filtered = blueprints.filter((item) => {
    const inCategory = activeCategory === "All" || item.category.includes(activeCategory);
    const inSearch = `${item.title} ${item.description}`.toLowerCase().includes(query);
    return inCategory && inSearch;
  });

  $("#blueprintGrid").innerHTML = filtered
    .map((item) => `
      <button class="blueprint-card ${item.title === selectedBlueprint.title ? "is-selected" : ""}" type="button" data-blueprint="${item.title}">
        <span class="blueprint-thumb"></span>
        <strong>${item.title}</strong>
        <span>${item.description}</span>
      </button>
    `)
    .join("") || `<p class="result-line">No representative Blueprints match this filter.</p>`;

  $$("[data-blueprint]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedBlueprint = blueprints.find((item) => item.title === button.dataset.blueprint);
      $("#selectedBlueprintTitle").textContent = selectedBlueprint.title;
      $("#selectedBlueprintDescription").textContent = selectedBlueprint.description;
      $("#galleryResult").textContent = `${selectedBlueprint.title} selected. Run will validate before replacing content.`;
      renderBlueprints();
    });
  });
}

function renderHistory() {
  $("#historyList").innerHTML = historyItems.map((item) => `<li>${item}</li>`).join("");
}

function recordResult(selector, message, history) {
  const element = selector ? $(selector) : null;
  if (element) element.textContent = message;
  addHistory(history || message);
}

$$("[data-panel-target]").forEach((button) => {
  button.addEventListener("click", () => showPanel(button.dataset.panelTarget));
});

$$("[data-subpanel-target]").forEach((button) => {
  button.addEventListener("click", () => showSubpanel(button.dataset.subpanelTarget));
});

$$(".route-card").forEach((button) => {
  button.addEventListener("click", () => selectRoute(button.dataset.route));
});

$("#runRouteButton").addEventListener("click", () => runRoute(false));
$("#validateRouteButton").addEventListener("click", () => runRoute(true));
$("#saveSelectedButton").addEventListener("click", runSave);
$("#shellSaveButton").addEventListener("click", () => {
  showPanel("object");
  runSave();
});
$("#cancelDeleteButton").addEventListener("click", () => {
  $("#deleteConfirm").hidden = true;
  pendingDeleteId = null;
  $("#selectedCommand").textContent = "Delete canceled";
  addHistory("Delete canceled; no saved rows changed.");
});
$("#confirmDeleteButton").addEventListener("click", confirmDelete);
$("#renameButton").addEventListener("click", () => {
  const object = activeObject();
  const previous = object.title;
  object.title = $("#renameInput").value.trim() || object.title;
  object.slug = slugify(object.title);
  $("#selectedCommand").textContent = "Rename object";
  addHistory(`${previous} renamed to ${object.title}.`);
  render();
});

$("#resetButton").addEventListener("click", () => {
  const object = activeObject();
  if (object.storage !== "temporary" && object.storage !== "preview") {
    $("#saveResult").textContent = "Stored Playgrounds use Save & Reload instead of destructive reset.";
    return;
  }
  object.title = "Unsaved Playground";
  object.slug = "temporary-session";
  object.storage = "temporary";
  object.path = "/hello-from-playground/";
  object.detail = "Reset complete. Not saved to browser storage.";
  $("#selectedCommand").textContent = "Reset complete";
  addHistory("Temporary Playground reset to a clean WordPress state.");
  render();
});

$("#homepageButton").addEventListener("click", () => {
  activeObject().path = "/hello-from-playground/";
  $("#selectedCommand").textContent = "Homepage";
  addHistory(`${activeObject().title} navigated to Homepage.`);
  render();
});

$("#wpAdminButton").addEventListener("click", () => {
  activeObject().path = "/wp-admin/";
  $("#selectedCommand").textContent = "WP Admin";
  addHistory(`${activeObject().title} navigated to WP Admin.`);
  render();
});

$("#refreshButton").addEventListener("click", () => {
  $("#selectedCommand").textContent = "Refresh";
  addHistory(`${activeObject().title} refreshed at ${activeObject().path}.`);
});

$("#pathInput").addEventListener("change", () => {
  activeObject().path = $("#pathInput").value || "/";
  $("#selectedCommand").textContent = "Path changed";
  addHistory(`${activeObject().title} path changed to ${activeObject().path}.`);
  render();
});

$("#applySettingsButton").addEventListener("click", () => {
  const object = activeObject();
  if (object.storage === "temporary" || object.storage === "preview") {
    object.path = "/hello-from-playground/";
    $("#settingsResult").textContent = "Settings applied; temporary Playground reset completed.";
    addHistory(`${object.title} reset after settings change.`);
  } else {
    $("#settingsResult").textContent = "Settings staged and saved. Reload completed for the stored Playground.";
    addHistory(`${object.title} saved and reloaded with updated runtime settings.`);
  }
  render();
});

$("#fileEditor").addEventListener("input", () => {
  $("#fileDirtyState").textContent = "Dirty";
  $("#fileDirtyState").classList.add("dirty");
  $("#fileResult").textContent = "wp-config.php has unsaved changes.";
});

$("#saveFileButton").addEventListener("click", () => {
  $("#fileDirtyState").textContent = "Saved";
  $("#fileDirtyState").classList.remove("dirty");
  recordResult("#fileResult", "wp-config.php saved to the active Playground filesystem.", "File editor saved /wordpress/wp-config.php.");
});

$("#newFileButton").addEventListener("click", () => recordResult("#fileResult", "New file created: /wordpress/wp-content/playground-note.php.", "File created in active Playground."));
$("#newFolderButton").addEventListener("click", () => recordResult("#fileResult", "New folder created: /wordpress/wp-content/playground-assets.", "Folder created in active Playground."));
$("#uploadFileButton").addEventListener("click", () => recordResult("#fileResult", "Upload complete: screenshot.png added to wp-content/uploads.", "File upload completed."));
$("#browseFilesButton").addEventListener("click", () => recordResult("#fileResult", "Browse files selected /wordpress/wp-config.php.", "Browse files action completed."));

$("#copyBlueprintButton").addEventListener("click", () => recordResult("#blueprintResult", "Blueprint link copied for the current bundle.", "Blueprint link copied."));
$("#downloadBlueprintButton").addEventListener("click", () => recordResult("#blueprintResult", "Blueprint bundle downloaded.", "Blueprint bundle downloaded."));
$("#runBlueprintButton").addEventListener("click", () => {
  activeObject().path = "/hello-from-playground/";
  recordResult("#blueprintResult", "Blueprint validated, ran, and updated the active preview.", "Blueprint editor run completed.");
  render();
});

$("#downloadDatabaseButton").addEventListener("click", () => recordResult("#databaseResult", "database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite.", "Database downloaded."));
$("#openAdminerButton").addEventListener("click", () => recordResult("#databaseResult", "Adminer opened for the SQLite-backed database.", "Adminer opened."));
$("#openPhpmyadminButton").addEventListener("click", () => recordResult("#databaseResult", "phpMyAdmin opened for the SQLite-backed database.", "phpMyAdmin opened."));

$("#downloadZipFromManager").addEventListener("click", () => recordResult("#settingsResult", "Current Playground downloaded as .zip.", "Download as .zip completed from Site Manager."));
$("#exportGithubFromManager").addEventListener("click", () => recordResult("#settingsResult", "Export to GitHub queued after account connection.", "GitHub export started from Site Manager."));

$("#blueprintSearch").addEventListener("input", renderBlueprints);
$$("[data-category]").forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    $$("[data-category]").forEach((item) => item.classList.toggle("is-active", item === button));
    renderBlueprints();
  });
});

$("#runSelectedBlueprintButton").addEventListener("click", () => {
  createPreviewObject(`${selectedBlueprint.title} Blueprint`, slugify(`${selectedBlueprint.title} Blueprint`), "/hello-from-playground/", "preview", "Preview only", `${selectedBlueprint.title} Blueprint validated and ran.`);
  $("#galleryResult").textContent = `${selectedBlueprint.title} validated, ran, and became the active preview. Save and export are available.`;
  addHistory(`${selectedBlueprint.title} Blueprint selected from representative gallery subset.`);
  render();
});
$("#copySelectedBlueprintButton").addEventListener("click", () => recordResult("#galleryResult", `${selectedBlueprint.title} Blueprint URL copied.`, "Selected Blueprint URL copied."));
$("#runBlueprintUrlButton").addEventListener("click", () => {
  selectRoute("blueprint-url");
  $("#routeInput").value = $("#blueprintUrlInput").value;
  showPanel("launch");
  runRoute(false);
});
$("#validateBlueprintUrlButton").addEventListener("click", () => recordResult("#galleryResult", "Blueprint URL returns valid JSON schema.", "Blueprint URL validated."));

$("#connectGithubButton").addEventListener("click", () => recordResult(null, "GitHub connected. Token is session-only and not stored after refresh.", "GitHub connected for import."));
$("#exportGithubButton").addEventListener("click", () => recordResult(null, "Current Playground exported to GitHub repository.", "Export to GitHub completed."));
$("#importZipButton").addEventListener("click", () => {
  createPreviewObject("Imported ZIP Playground", "imported-zip-playground", "/wp-admin/", "preview", "Preview only", "ZIP archive validated and imported.");
  addHistory("Native ZIP file chooser completed; archive imported as active preview.");
  render();
});
$("#downloadZipButton").addEventListener("click", () => addHistory(`${activeObject().title} downloaded as .zip.`));
$("#downloadDbTransferButton").addEventListener("click", () => addHistory("database.sqlite downloaded from transfer panel."));
$("#clearHistoryButton").addEventListener("click", () => {
  historyItems = ["Transfer history cleared."];
  renderHistory();
});

selectRoute("vanilla");
renderBlueprints();
render();
