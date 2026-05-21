const objects = [
  {
    id: "temp-001",
    title: "Unsaved Playground",
    slug: "temporary-session",
    storage: "temporary",
    state: "warn",
    status: "Temporary",
    path: "/hello-from-playground/",
    storageDetail: "Temporary tab storage",
    reset: "Reset discards this unsaved Playground.",
    actions: "Save first to enable browser slug, rename, export, and durable reload.",
    lastAction: "Opened current tab",
  },
  {
    id: "plugin-review",
    title: "Plugin Review Playground",
    slug: "plugin-review-playground",
    storage: "browser",
    state: "saved",
    status: "Saved",
    path: "/wp-admin/plugins.php",
    storageDetail: "Browser storage on this device",
    reset: "Settings changes use Save & Reload.",
    actions: "Open, manage, rename, delete, export, download zip, and download database.",
    lastAction: "Saved May 21, 2026",
  },
  {
    id: "local-theme",
    title: "Theme Lab Folder",
    slug: "theme-lab-folder",
    storage: "local",
    state: "local-permission",
    status: "Local permission",
    path: "/wp-admin/site-editor.php",
    storageDetail: "Local directory: ~/Sites/theme-lab-folder",
    reset: "Save & Reload writes through the granted folder permission.",
    actions: "Reconnect folder, open, manage, rename, export, download zip, or delete ledger entry.",
    lastAction: "Folder permission granted",
  },
];

const routeInfo = {
  vanilla: {
    kind: "Create route",
    title: "Vanilla WordPress",
    description: "Starts a clean temporary Playground using the selected WordPress, PHP, language, network, and multisite settings.",
    label: "",
    value: "",
    constraints: ["Creates a temporary object until saved", "Save and export become available after boot"],
    warning: false,
    action: "Start vanilla WordPress",
  },
  "wordpress-pr": {
    kind: "PR preview",
    title: "Preview a WordPress PR",
    description: "Accepts a PR number or WordPress core pull request URL and boots a temporary preview object.",
    label: "PR number or URL",
    value: "https://github.com/WordPress/wordpress-develop/pull/7821",
    constraints: ["Requires wordpress-develop PR", "Network access is used to resolve the patch", "Creates a temporary PR object"],
    warning: true,
    action: "Preview WordPress PR",
  },
  gutenberg: {
    kind: "Editor preview",
    title: "Preview a Gutenberg PR or Branch",
    description: "Accepts a Gutenberg PR number, GitHub URL, or branch name and installs the editor build in the preview.",
    label: "PR number, URL, or branch name",
    value: "trunk",
    constraints: ["Accepts branch names", "Installs the Gutenberg plugin build", "Creates a temporary preview object"],
    warning: true,
    action: "Preview Gutenberg",
  },
  github: {
    kind: "GitHub import",
    title: "Import from GitHub",
    description: "Imports plugins, themes, or wp-content directories from a public GitHub repository after account connection.",
    label: "Repository path or URL",
    value: "wordpress/gutenberg",
    constraints: ["GitHub account connection required", "Access token is not stored", "Re-authentication required after refresh"],
    warning: true,
    action: "Connect and import",
  },
  "blueprint-url": {
    kind: "Blueprint URL",
    title: "Run Blueprint from URL",
    description: "Runs a public blueprint.json URL after JSON validation and replacement confirmation.",
    label: "Blueprint URL",
    value: "https://example.com/blueprint.json",
    constraints: ["URL must return Blueprint JSON", "Validation required before run", "Current content may be replaced"],
    warning: true,
    action: "Run Blueprint URL",
  },
  zip: {
    kind: "ZIP import",
    title: "Import .zip",
    description: "Opens the native file chooser, validates a Playground archive, and asks before replacing files and database.",
    label: "Selected .zip",
    value: "playground-export.zip",
    constraints: ["Native chooser controls file selection", "Archive structure is validated", "Replacement requires confirmation"],
    warning: true,
    action: "Choose and import zip",
  },
};

const blueprints = [
  {
    title: "Art Gallery",
    tags: ["Featured", "Website", "Personal", "Themes"],
    url: "https://playground.wordpress.net/blueprints/art-gallery/blueprint.json",
    theme: "vueo.zip",
    importFile: "art-gallery.xml",
  },
  {
    title: "Coffee Shop",
    tags: ["Featured", "Website", "WooCommerce"],
    url: "https://playground.wordpress.net/blueprints/coffee-shop/blueprint.json",
    theme: "coffee.zip",
    importFile: "products.xml",
  },
  {
    title: "Feed Reader with the Friends Plugin",
    tags: ["Featured", "Content"],
    url: "https://playground.wordpress.net/blueprints/friends-feed/blueprint.json",
    theme: "twentytwentyfive.zip",
    importFile: "friends.xml",
  },
  {
    title: "Gaming News",
    tags: ["Featured", "Website", "News"],
    url: "https://playground.wordpress.net/blueprints/gaming-news/blueprint.json",
    theme: "spiel.zip",
    importFile: "gaming-news.xml",
  },
  {
    title: "Non-profit Organization",
    tags: ["Featured", "Website"],
    url: "https://playground.wordpress.net/blueprints/non-profit/blueprint.json",
    theme: "koinonia.zip",
    importFile: "non-profit.xml",
  },
  {
    title: "Personal Blog",
    tags: ["Website", "Personal", "Content"],
    url: "https://playground.wordpress.net/blueprints/personal-blog/blueprint.json",
    theme: "substrata.zip",
    importFile: "blog.xml",
  },
  {
    title: "Gutenberg Data Views",
    tags: ["Gutenberg", "Experiments"],
    url: "https://playground.wordpress.net/blueprints/gutenberg-data-views/blueprint.json",
    theme: "twentytwentyfive.zip",
    importFile: "data-views.xml",
  },
  {
    title: "Pattern Content Kit",
    tags: ["Content", "Themes", "Experiments"],
    url: "https://playground.wordpress.net/blueprints/pattern-content-kit/blueprint.json",
    theme: "twentytwentyfive.zip",
    importFile: "patterns.xml",
  },
];

let activeId = "temp-001";
let selectedId = "temp-001";
let selectedRoute = "vanilla";
let selectedBlueprint = blueprints[0];
let selectedCategory = "All";
let pendingDeleteId = null;
let blueprintValidated = false;
let history = [
  "Temporary Playground opened at /hello-from-playground/.",
  "Theme Lab Folder reconnected to local directory permission.",
  "Plugin Review Playground downloaded database.sqlite.",
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "playground";
}

function activeObject() {
  return objects.find((object) => object.id === activeId) || objects[0];
}

function selectedObject() {
  return objects.find((object) => object.id === selectedId) || activeObject();
}

function storageLabel(object) {
  if (object.storage === "browser") return "Saved in browser";
  if (object.storage === "local") return "Local directory";
  if (object.storage === "imported") return "Imported";
  return "Temporary";
}

function badgeClass(object) {
  if (object.state === "saving") return "saving";
  if (object.state === "deleted") return "deleted";
  if (object.state === "imported") return "imported";
  if (object.state === "exported") return "exported";
  if (object.storage === "browser") return "saved";
  if (object.storage === "local") return "local-permission";
  return "warn";
}

function addHistory(message) {
  history.unshift(message);
  history = history.slice(0, 10);
  renderHistory();
}

function render() {
  renderObjects();
  renderDetail();
  renderPreview();
  renderHistory();
  renderSettingsConsequence();
}

function renderObjects() {
  const query = ($("#objectSearch")?.value || "").toLowerCase();
  const rows = objects.filter((object) => {
    const haystack = `${object.title} ${object.slug} ${object.storage} ${object.status} ${object.lastAction}`.toLowerCase();
    return haystack.includes(query);
  });

  $("#objectRows").innerHTML = rows
    .map((object) => {
      const active = object.id === activeId ? "is-active" : "";
      const deleted = object.state === "deleted" ? "is-deleted" : "";
      const deleteLabel = object.state === "deleted" ? "Deleted" : "Delete";
      return `
        <article class="object-row ${active} ${deleted}" role="row" data-object-id="${object.id}">
          <div class="object-main" role="cell">
            <strong>${object.title}</strong>
            <span>${object.slug} · ${object.path}</span>
          </div>
          <span class="object-cell" role="cell">${storageLabel(object)}</span>
          <span role="cell"><span class="state-pill ${badgeClass(object)}">${object.status}</span></span>
          <span class="object-cell" role="cell">${object.lastAction}</span>
          <div class="row-actions" role="cell">
            <button type="button" data-open="${object.id}">${object.id === activeId ? "Active" : "Open"}</button>
            <button type="button" data-select="${object.id}">Manage</button>
            <button type="button" data-rename="${object.id}">Rename</button>
            <button class="danger" type="button" data-delete="${object.id}" ${object.state === "deleted" ? "disabled" : ""}>${deleteLabel}</button>
          </div>
        </article>
      `;
    })
    .join("");

  $$("[data-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const object = objects.find((item) => item.id === button.dataset.open);
      if (!object || object.state === "deleted") return;
      activeId = object.id;
      selectedId = object.id;
      object.lastAction = "Opened in live preview";
      addHistory(`${object.title} opened in the embedded WordPress shell.`);
      render();
    });
  });

  $$("[data-select]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedId = button.dataset.select;
      $("#renameBox").hidden = true;
      renderDetail();
    });
  });

  $$("[data-rename]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedId = button.dataset.rename;
      $("#renameBox").hidden = false;
      $("#renameInput").value = selectedObject().title;
      renderDetail();
    });
  });

  $$("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => requestDelete(button.dataset.delete));
  });
}

function renderDetail() {
  const object = selectedObject();
  $("#detailTitle").textContent = object.title;
  $("#detailSlug").textContent = object.slug;
  $("#detailStorage").textContent = object.storageDetail;
  $("#detailPath").textContent = object.path;
  $("#detailReset").textContent = object.reset;
  $("#detailActions").textContent = object.actions;
  $("#detailBadge").className = `state-pill ${badgeClass(object)}`;
  $("#detailBadge").textContent = object.status;
  $("#renameInput").value = object.title;
  $("#detailSaveButton").textContent = object.storage === "temporary" ? "Save" : "Save & Reload";
  $("#detailDeleteButton").disabled = object.state === "deleted";
}

function renderPreview() {
  const object = activeObject();
  document.querySelector(".app").dataset.activeStorage = object.storage;
  $("#shellStorage").className = `state-pill ${badgeClass(object)}`;
  $("#shellStorage").textContent = object.storage === "temporary" ? "Unsaved Playground" : storageLabel(object);
  $("#topSaveButton").textContent = object.storage === "temporary" ? "Save" : "Save & Reload";
  $("#pathInput").value = object.path;
  $("#previewBrowserTitle").textContent = `playground.local${object.path}`;
  $("#previewRuntime").textContent = object.storage === "local" ? "WP latest · PHP 8.3 · local folder" : "WP latest · PHP 8.3";

  if (object.state === "imported") {
    $("#previewKicker").textContent = "Blueprint result";
    $("#previewTitle").textContent = `${object.title}`;
    $("#previewText").textContent = "The selected Blueprint has replaced the active content. The object table, detail panel, transfer history, path, and preview now agree on the new state.";
    $("#previewMark").textContent = "Blueprint run completed. Current content was replaced after confirmation.";
    $("#previewButton").textContent = "Review applied Blueprint";
  } else if (object.storage === "browser") {
    $("#previewKicker").textContent = "Saved browser Playground";
    $("#previewTitle").textContent = "Hello from WordPress Playground!";
    $("#previewText").textContent = "This saved object restores in this browser. Settings changes use Save & Reload, and export/download actions are available.";
    $("#previewMark").textContent = "Saved state. Browser storage keeps files and database on this device.";
    $("#previewButton").textContent = "Open saved site";
  } else if (object.storage === "local") {
    $("#previewKicker").textContent = "Local directory Playground";
    $("#previewTitle").textContent = "WP Admin for folder-backed work";
    $("#previewText").textContent = "This object is backed by a granted local directory. Reload may require reconnecting folder permission before files can sync.";
    $("#previewMark").textContent = "Folder-backed state. Permission controls reload behavior.";
    $("#previewButton").textContent = "Reconnect folder";
  } else {
    $("#previewKicker").textContent = "Temporary session";
    $("#previewTitle").textContent = "Hello from WordPress Playground!";
    $("#previewText").textContent = "This Playground runs client-side in the browser. Save it before refresh or close to preserve files, database, and the current URL identity.";
    $("#previewMark").textContent = "Logged in as admin. Unsaved changes are temporary.";
    $("#previewButton").textContent = "Discover the mission behind Playground";
  }

  $("#settingsApplyButton").textContent = object.storage === "temporary" ? "Apply Settings & Reset Playground" : "Save & Reload";
}

function renderSettingsConsequence() {
  const object = activeObject();
  if (object.storage === "temporary") {
    $("#settingsConsequence").textContent = "Temporary reset warning";
    $("#settingsCopy").textContent = "Applying settings resets the current unsaved Playground and discards files and database unless saved first.";
  } else {
    $("#settingsConsequence").textContent = "Stored Playground reload";
    $("#settingsCopy").textContent = "Stored Playgrounds have limited configuration options. Changes are written with Save & Reload instead of destructive reset.";
  }
}

function renderHistory() {
  $("#historyList").innerHTML = history.map((item) => `<li>${item}</li>`).join("");
}

function setView(view) {
  $$(".view-tabs button").forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
  $$(".view").forEach((panel) => panel.classList.toggle("is-active", panel.id === `view-${view}`));
}

function requestDelete(id) {
  const object = objects.find((item) => item.id === id);
  if (!object || object.state === "deleted") return;
  pendingDeleteId = id;
  selectedId = id;
  $("#deleteTitle").textContent = `Delete ${object.title}?`;
  $("#deleteText").textContent = object.id === activeId
    ? "This removes the active saved object. The shell will fall back to a new temporary Playground."
    : "This removes the saved object from the table and leaves the active Playground unchanged.";
  $("#deleteConfirm").hidden = false;
  setView("objects");
  renderDetail();
}

function ensureTemporaryFallback() {
  let temp = objects.find((object) => object.storage === "temporary" && object.state !== "deleted");
  if (!temp) {
    temp = {
      id: `temp-${Date.now()}`,
      title: "Unsaved Playground",
      slug: "temporary-session",
      storage: "temporary",
      state: "warn",
      status: "Temporary",
      path: "/hello-from-playground/",
      storageDetail: "Temporary tab storage",
      reset: "Reset discards this unsaved Playground.",
      actions: "Save first to enable browser slug, rename, export, and durable reload.",
      lastAction: "Created as fallback after deletion",
    };
    objects.unshift(temp);
  }
  return temp;
}

function startSave() {
  const object = activeObject();
  const destination = document.querySelector("input[name='destination']:checked").value;
  const title = $("#saveName").value.trim() || "Saved Playground";
  const slug = slugify($("#saveSlug").value || title);

  object.state = "saving";
  object.status = destination === "local" ? "Requesting folder" : "Saving";
  object.lastAction = destination === "local" ? "Opening folder picker" : "Copying files to browser storage";
  render();
  $("#saveProgress").hidden = false;
  $("#saveMeter").style.width = "12%";
  $("#saveProgressTitle").textContent = destination === "local" ? "Requesting folder permission" : "Copying files";
  $("#saveProgressText").textContent = destination === "local" ? "Waiting for ~/Sites folder grant" : "422 / 3,751 files copied";

  if (destination === "local") {
    $("#localPermission").hidden = false;
  }

  window.setTimeout(() => {
    $("#saveMeter").style.width = "58%";
    $("#saveProgressText").textContent = destination === "local" ? "2,142 / 3,751 files copied into folder" : "2,142 / 3,751 files copied";
    object.status = "Saving";
    renderObjects();
  }, 420);

  window.setTimeout(() => {
    $("#saveMeter").style.width = "100%";
    object.title = title;
    object.slug = slug;
    object.storage = destination === "local" ? "local" : "browser";
    object.state = destination === "local" ? "local-permission" : "saved";
    object.status = destination === "local" ? "Local permission" : "Saved";
    object.storageDetail = destination === "local"
      ? `Local directory: ~/Sites/${slug}`
      : "Browser storage on this device";
    object.reset = destination === "local"
      ? "Save & Reload writes through the granted folder permission."
      : "Settings changes use Save & Reload.";
    object.actions = destination === "local"
      ? "Reconnect folder, open, manage, rename, export, download zip, and download database."
      : "Open, manage, rename, delete, export, download zip, and download database.";
    object.lastAction = destination === "local"
      ? "Saved to local directory; permission granted"
      : "Browser save complete; row transformed from temporary";
    selectedId = object.id;
    $("#saveProgressTitle").textContent = "Save complete";
    $("#saveProgressText").textContent = destination === "local"
      ? `3,751 / 3,751 files copied into ~/Sites/${slug}`
      : "3,751 / 3,751 files copied into browser storage";
    addHistory(`${title} saved to ${destination === "local" ? "a local directory" : "browser storage"}; active shell title, row state, and reset behavior updated.`);
    render();
  }, 900);
}

function renderRoute() {
  const route = routeInfo[selectedRoute];
  $("#routeKind").textContent = route.kind;
  $("#routeTitle").textContent = route.title;
  $("#routeDescription").textContent = route.description;
  $("#routeInputWrap").hidden = !route.label;
  $("#routeInputLabel").textContent = route.label || "Input";
  $("#routeInput").value = route.value;
  $("#routeConstraints").innerHTML = route.constraints.map((item) => `<span>${item}</span>`).join("");
  $("#routeWarning").hidden = !route.warning;
  $("#runRouteButton").textContent = route.action;
  $("#routeResult").textContent = "Input ready for validation.";
  $$(".route-card").forEach((button) => button.classList.toggle("is-selected", button.dataset.route === selectedRoute));
}

function runRoute() {
  const route = routeInfo[selectedRoute];
  $("#routeProgress").hidden = false;
  $("#routeMeter").style.width = "22%";
  $("#routeProgressTitle").textContent = "Validating route";
  $("#routeProgressText").textContent = route.label ? route.value : "Runtime settings accepted";

  window.setTimeout(() => {
    $("#routeMeter").style.width = "72%";
    $("#routeProgressTitle").textContent = selectedRoute === "github" ? "Connecting GitHub" : "Preparing WordPress";
    $("#routeProgressText").textContent = selectedRoute === "zip" ? "Valid archive selected from native file chooser" : "Creating temporary object";
  }, 380);

  window.setTimeout(() => {
    $("#routeMeter").style.width = "100%";
    const id = `${selectedRoute}-${Date.now()}`;
    const imported = selectedRoute === "github" || selectedRoute === "zip";
    const title = imported ? `${route.title} Playground` : route.title;
    const object = {
      id,
      title,
      slug: slugify(title),
      storage: imported ? "imported" : "temporary",
      state: imported ? "imported" : "warn",
      status: imported ? "Imported" : "Temporary",
      path: selectedRoute === "gutenberg" || selectedRoute === "wordpress-pr" ? "/wp-admin/" : "/hello-from-playground/",
      storageDetail: imported ? "Imported object, not yet saved to browser or local directory" : "Temporary preview object",
      reset: "Reset discards this temporary preview unless saved first.",
      actions: "Save to browser or local directory before relying on reload. Export and zip download are available after save.",
      lastAction: `${route.title} completed`,
    };
    objects.unshift(object);
    activeId = id;
    selectedId = id;
    $("#routeResult").textContent = `${title} is now the active Playground. Save it before refresh or close.`;
    addHistory(`${route.title} completed and inserted a new active object row.`);
    render();
  }, 820);
}

function renderBlueprints() {
  const search = ($("#blueprintSearch")?.value || "").toLowerCase();
  const filtered = blueprints.filter((blueprint) => {
    const inCategory = selectedCategory === "All" || blueprint.tags.includes(selectedCategory);
    const matches = `${blueprint.title} ${blueprint.tags.join(" ")}`.toLowerCase().includes(search);
    return inCategory && matches;
  });

  $("#blueprintGrid").innerHTML = filtered
    .map((blueprint) => `
      <button class="blueprint-card ${blueprint.title === selectedBlueprint.title ? "is-selected" : ""}" type="button" data-blueprint="${blueprint.title}">
        <span class="blueprint-thumb"></span>
        <span class="blueprint-body">
          <strong>${blueprint.title}</strong>
          <span>${blueprint.tags.join(" · ")}</span>
        </span>
      </button>
    `)
    .join("");

  $$("[data-blueprint]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedBlueprint = blueprints.find((item) => item.title === button.dataset.blueprint) || blueprints[0];
      blueprintValidated = false;
      updateBlueprintDetail();
      renderBlueprints();
    });
  });
}

function updateBlueprintDetail() {
  $("#blueprintTitle").textContent = selectedBlueprint.title;
  $("#blueprintUrl").value = selectedBlueprint.url;
  $("#blueprintStatus").className = "state-pill";
  $("#blueprintStatus").textContent = "Not validated";
  $("#blueprintWarning").hidden = true;
  $("#blueprintResult").textContent = "Inspect JSON, validate, then run with replacement warning.";
  $("#blueprintCode").textContent = `{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "landingPage": "/",
  "preferredVersions": { "php": "8.3", "wp": "latest" },
  "steps": [
    { "step": "installTheme", "themeZipFile": "${selectedBlueprint.theme}" },
    { "step": "importWxr", "file": "${selectedBlueprint.importFile}" }
  ]
}`;
}

function validateBlueprint() {
  blueprintValidated = true;
  $("#blueprintStatus").className = "state-pill success";
  $("#blueprintStatus").textContent = "Valid Blueprint";
  $("#blueprintWarning").hidden = false;
  $("#blueprintResult").textContent = `${selectedBlueprint.title} JSON validated. Running it will replace current content after confirmation.`;
  addHistory(`${selectedBlueprint.title} Blueprint validated.`);
}

function runBlueprint() {
  if (!blueprintValidated) {
    validateBlueprint();
    return;
  }

  const object = activeObject();
  document.body.classList.add("blueprint-running");
  $("#blueprintProgress").hidden = false;
  $("#blueprintMeter").style.width = "18%";
  $("#blueprintProgressTitle").textContent = "Replacing current content";
  $("#blueprintProgressText").textContent = "Confirm accepted; installing theme";

  object.state = "saving";
  object.status = "Running Blueprint";
  object.lastAction = `Replacing content with ${selectedBlueprint.title}`;
  renderObjects();
  renderDetail();

  window.setTimeout(() => {
    $("#blueprintMeter").style.width = "64%";
    $("#blueprintProgressText").textContent = "Importing content and updating landing page";
  }, 420);

  window.setTimeout(() => {
    $("#blueprintMeter").style.width = "100%";
    object.state = "imported";
    object.status = "Blueprint applied";
    object.path = "/";
    object.title = `${selectedBlueprint.title} Playground`;
    object.slug = slugify(object.title);
    object.lastAction = "Blueprint run complete";
    object.storageDetail = object.storage === "temporary"
      ? "Temporary object with Blueprint-applied content"
      : `${storageLabel(object)} with Blueprint-applied content`;
    $("#blueprintProgressTitle").textContent = "Blueprint complete";
    $("#blueprintProgressText").textContent = `${selectedBlueprint.title} replaced current content and preview state`;
    $("#blueprintResult").textContent = `${selectedBlueprint.title} applied. Active title, path, preview, row status, and transfer history updated.`;
    addHistory(`${selectedBlueprint.title} Blueprint run completed and replaced the active Playground content.`);
    document.body.classList.remove("blueprint-running");
    render();
  }, 940);
}

function setManagerTab(tab) {
  $$(".manager-tabs button").forEach((button) => button.classList.toggle("is-active", button.dataset.manager === tab));
  $$(".manager-card").forEach((card) => card.classList.toggle("is-active", card.id === `manager-${tab}`));
}

function markTransfer(type) {
  const object = activeObject();
  object.lastAction = type;
  if (type.includes("export")) {
    object.state = "exported";
    object.status = "Exported";
  }
  addHistory(`${object.title}: ${type}.`);
  render();
}

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    setView(viewButton.dataset.view);
  }
});

$("#objectSearch").addEventListener("input", renderObjects);
$("#newVanillaButton").addEventListener("click", () => {
  selectedRoute = "vanilla";
  setView("routes");
  renderRoute();
});

$$("input[name='destination']").forEach((input) => {
  input.addEventListener("change", () => {
    $$(".destination").forEach((destination) => destination.classList.remove("is-selected"));
    input.closest(".destination").classList.add("is-selected");
    $("#localPermission").hidden = input.value !== "local";
    $("#saveProgressText").textContent = input.value === "local" ? "Destination: local directory" : "Destination: browser storage";
  });
});

$("#topSaveButton").addEventListener("click", () => {
  setView("objects");
  $("#saveDrawer").scrollIntoView({ block: "nearest" });
});
$("#detailSaveButton").addEventListener("click", () => {
  setView("objects");
  $("#saveDrawer").scrollIntoView({ block: "nearest" });
});
$("#startSaveButton").addEventListener("click", startSave);
$("#cancelSaveButton").addEventListener("click", () => {
  $("#saveProgress").hidden = true;
  $("#saveMeter").style.width = "0";
  addHistory("Save canceled before copying files.");
});

$("#cancelDeleteButton").addEventListener("click", () => {
  pendingDeleteId = null;
  $("#deleteConfirm").hidden = true;
});

$("#confirmDeleteButton").addEventListener("click", () => {
  const object = objects.find((item) => item.id === pendingDeleteId);
  if (!object) return;
  object.state = "deleted";
  object.status = "Deleted";
  object.lastAction = "Deleted after confirmation";
  if (object.id === activeId) {
    const fallback = ensureTemporaryFallback();
    activeId = fallback.id;
    selectedId = fallback.id;
    addHistory(`${object.title} deleted. Active shell fell back to a temporary Playground.`);
  } else {
    addHistory(`${object.title} deleted after confirmation.`);
  }
  pendingDeleteId = null;
  $("#deleteConfirm").hidden = true;
  render();
});

$("#detailDeleteButton").addEventListener("click", () => requestDelete(selectedId));
$("#detailRenameButton").addEventListener("click", () => {
  $("#renameBox").hidden = !$("#renameBox").hidden;
  $("#renameInput").value = selectedObject().title;
});
$("#applyRenameButton").addEventListener("click", () => {
  const object = selectedObject();
  const title = $("#renameInput").value.trim();
  if (!title || object.state === "deleted") return;
  object.title = title;
  object.slug = slugify(title);
  object.lastAction = "Renamed in selected detail";
  addHistory(`Renamed selected Playground to ${title}.`);
  render();
});

$$(".route-card").forEach((button) => {
  button.addEventListener("click", () => {
    selectedRoute = button.dataset.route;
    renderRoute();
  });
});
$("#validateRouteButton").addEventListener("click", () => {
  const route = routeInfo[selectedRoute];
  $("#routeResult").textContent = `${route.title} input validated. ${route.warning ? "Replacement confirmation will be required." : "Ready to start."}`;
  addHistory(`${route.title} route input validated.`);
});
$("#runRouteButton").addEventListener("click", runRoute);

$$(".filters button").forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    $$(".filters button").forEach((item) => item.classList.toggle("is-active", item === button));
    renderBlueprints();
  });
});
$("#blueprintSearch").addEventListener("input", renderBlueprints);
$("#validateBlueprintButton").addEventListener("click", validateBlueprint);
$("#runBlueprintButton").addEventListener("click", runBlueprint);
$("#copyBlueprintButton").addEventListener("click", () => {
  $("#blueprintResult").textContent = "Blueprint link copied to clipboard result state.";
  addHistory(`${selectedBlueprint.title} Blueprint link copied.`);
});
$("#downloadBlueprintButton").addEventListener("click", () => {
  $("#blueprintResult").textContent = "Blueprint bundle download prepared.";
  addHistory(`${selectedBlueprint.title} Blueprint bundle downloaded.`);
});

$$(".manager-tabs button").forEach((button) => {
  button.addEventListener("click", () => setManagerTab(button.dataset.manager));
});

$("#pathInput").addEventListener("change", () => {
  const object = activeObject();
  object.path = $("#pathInput").value || "/";
  object.lastAction = `Navigated to ${object.path}`;
  addHistory(`${object.title} navigated to ${object.path}.`);
  render();
});
$("#refreshButton").addEventListener("click", () => addHistory(`${activeObject().title} refreshed at ${activeObject().path}.`));
$("#homeButton").addEventListener("click", () => {
  activeObject().path = "/hello-from-playground/";
  addHistory("Homepage opened in active WordPress shell.");
  render();
});
$("#adminButton").addEventListener("click", () => {
  activeObject().path = "/wp-admin/";
  addHistory("WP Admin opened in active WordPress shell.");
  render();
});

$("#fileText").addEventListener("input", () => {
  $("#fileStatus").className = "state-pill warn";
  $("#fileStatus").textContent = "Dirty";
});
$("#saveFileButton").addEventListener("click", () => {
  $("#fileStatus").className = "state-pill success";
  $("#fileStatus").textContent = "Saved";
  activeObject().lastAction = "wp-config.php saved";
  addHistory("File browser saved /wordpress/wp-config.php.");
  renderObjects();
});
$("#newFileButton").addEventListener("click", () => {
  $("#fileStatus").className = "state-pill warn";
  $("#fileStatus").textContent = "New file pending";
  addHistory("File browser created a pending new file.");
});

$("#settingsApplyButton").addEventListener("click", () => {
  const object = activeObject();
  if (object.storage === "temporary") {
    object.lastAction = "Settings reset applied";
    addHistory("Settings applied with destructive reset on the temporary Playground.");
  } else {
    object.lastAction = "Settings saved and reloaded";
    addHistory(`${object.title} settings saved with Save & Reload.`);
  }
  renderObjects();
});

$("#copyBundleButton").addEventListener("click", () => addHistory("Current Blueprint bundle link copied."));
$("#downloadBundleButton").addEventListener("click", () => addHistory("Current Blueprint bundle downloaded."));
$("#downloadDatabaseButton").addEventListener("click", () => markTransfer("database.sqlite downloaded"));
$("#downloadDbButton").addEventListener("click", () => markTransfer("database.sqlite downloaded"));
$("#adminerButton").addEventListener("click", () => addHistory("Adminer opened for SQLite-backed database."));
$("#phpMyAdminButton").addEventListener("click", () => addHistory("phpMyAdmin opened for SQLite-backed database."));
$("#exportGithubButton").addEventListener("click", () => markTransfer("export to GitHub completed"));
$("#downloadZipButton").addEventListener("click", () => markTransfer("download as .zip generated"));
$("#importZipButton").addEventListener("click", () => {
  selectedRoute = "zip";
  setView("routes");
  renderRoute();
  addHistory("Import .zip opened native chooser route.");
});
$("#clearHistoryButton").addEventListener("click", () => {
  history = ["Resolved transfer history cleared."];
  renderHistory();
});

renderRoute();
updateBlueprintDetail();
renderBlueprints();
render();
