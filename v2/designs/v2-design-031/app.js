const state = {
  activeId: "temp-main",
  route: "gutenberg",
  destination: "browser",
  managerTab: "settings",
  blueprintFilter: "All",
  selectedBlueprint: "art-gallery",
  localPermission: false,
  objects: [
    {
      id: "temp-main",
      name: "Unsaved Playground",
      type: "temporary",
      path: "/hello-from-playground/",
      detail: "Temporary runtime. Not saved to browser storage.",
      identity: "temp: current-session",
      reset: "Apply Settings & Reset",
      export: "Locked until preview or save"
    },
    {
      id: "browser-research",
      name: "Research Browser Playground",
      type: "browser",
      path: "/hello-from-playground/",
      detail: "Saved in this browser. Slug: research-browser-playground.",
      identity: "browser: research-browser-playground",
      reset: "Save & Reload",
      export: "Export ready"
    },
    {
      id: "local-theme-lab",
      name: "Local Theme Lab",
      type: "local",
      path: "/wp-admin/",
      detail: "Local directory: ~/Sites/local-theme-lab. Reconnect after refresh.",
      identity: "local: ~/Sites/local-theme-lab",
      reset: "Save & Reload after folder permission",
      export: "Export ready"
    }
  ],
  history: [
    "Temporary Playground opened at /hello-from-playground/.",
    "SQLite database ready at /wordpress/wp-content/database/.ht.sqlite.",
    "Browser storage available; local directory permission not granted."
  ]
};

const routes = {
  gutenberg: {
    title: "Preview a Gutenberg PR or branch",
    label: "PR number, URL, or branch name",
    value: "try/wp-6-9-command-palette",
    hint: "Accepts Gutenberg PR URLs, PR numbers, or public branch names. When the preview is ready, Save, Export to GitHub, Download as zip, and Site Manager tools become available.",
    button: "Validate & preview branch",
    resultName: "Gutenberg Branch Preview",
    resultPath: "/wp-admin/site-editor.php?canvas=edit",
    resultText: "Built from Gutenberg branch try/wp-6-9-command-palette. Save before refresh, or export when the review is ready."
  },
  wordpress: {
    title: "Preview a WordPress PR",
    label: "PR number or URL",
    value: "https://github.com/WordPress/wordpress-develop/pull/7392",
    hint: "Requires a WordPress core PR number or URL. The runtime starts from latest WordPress and pins the active identity to the PR.",
    button: "Validate & preview PR",
    resultName: "WordPress PR Preview",
    resultPath: "/wp-admin/about.php",
    resultText: "WordPress core PR preview is running with latest WordPress and PHP 8.3."
  },
  vanilla: {
    title: "Start Vanilla WordPress",
    label: "Version",
    value: "latest",
    hint: "Starts a clean temporary WordPress Playground immediately. Starting fresh replaces the current unsaved runtime unless it is saved first.",
    button: "Start fresh Playground",
    resultName: "Vanilla WordPress Playground",
    resultPath: "/hello-from-playground/",
    resultText: "Fresh vanilla WordPress runtime created. It remains temporary until saved."
  },
  github: {
    title: "Import from GitHub",
    label: "Repository path",
    value: "wordpress/wordpress-playground",
    hint: "Imports public plugins, themes, or wp-content directories. Connect a GitHub account first; the access token is not stored after refresh.",
    button: "Connect GitHub & import",
    resultName: "GitHub Import Preview",
    resultPath: "/wp-admin/plugins.php",
    resultText: "Repository import staged after account connection. Token will not persist after refresh."
  },
  blueprintUrl: {
    title: "Run Blueprint from URL",
    label: "Blueprint URL",
    value: "https://playground.wordpress.net/blueprints/gallery/art-gallery/blueprint.json",
    hint: "Fetches and validates a public blueprint.json. Running it may replace current content after confirmation.",
    button: "Validate URL & run",
    resultName: "Blueprint URL Runtime",
    resultPath: "/",
    resultText: "Blueprint URL validated and applied to the active runtime."
  },
  zip: {
    title: "Import .zip",
    label: "Selected archive",
    value: "playground-export.zip",
    hint: "Uses the native file chooser. Import requires confirmation because it replaces files and the SQLite database.",
    button: "Choose zip & validate",
    resultName: "Imported Zip Playground",
    resultPath: "/wp-admin/",
    resultText: "playground-export.zip imported after replacement confirmation."
  }
};

const blueprints = [
  { id: "art-gallery", name: "Art Gallery", desc: "An art gallery created with the Vyeo theme.", tags: ["Featured", "Website", "Personal"] },
  { id: "coffee-shop", name: "Coffee Shop", desc: "A WooCommerce coffee shop storefront with products and custom content.", tags: ["Featured", "WooCommerce", "Website"] },
  { id: "friends-feed", name: "Feed Reader with the Friends Plugin", desc: "Read feeds from the web in Playground using the Friends plugin.", tags: ["Featured", "Content"] },
  { id: "gaming-news", name: "Gaming News", desc: "A gaming news site created with the Spiel theme.", tags: ["Featured", "News", "Website"] },
  { id: "non-profit", name: "Non-profit Organization", desc: "A non-profit organization site created with the Koinonia theme.", tags: ["Featured", "Website"] },
  { id: "personal-blog", name: "Personal Blog", desc: "A personal blog created with the Substrata theme.", tags: ["Personal", "Content"] }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function activeObject() {
  return state.objects.find((object) => object.id === state.activeId) || state.objects[0];
}

function typeLabel(type) {
  return {
    temporary: "Temporary",
    preview: "Preview, unsaved",
    browser: "Saved in browser",
    local: "Local directory",
    imported: "Imported zip",
    blueprint: "Blueprint runtime"
  }[type] || type;
}

function statusClass(type) {
  if (type === "browser" || type === "local" || type === "blueprint") return "good";
  if (type === "imported") return "blue";
  return "warning";
}

function addHistory(message) {
  state.history.unshift(message);
  renderHistory();
}

function switchPanel(panelName) {
  $$(".console-tabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.panel === panelName);
  });
  $$(".panel").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panelView === panelName);
  });
  const titles = {
    start: "Start routes",
    save: "Save destinations",
    library: "Playground objects",
    manager: "Site Manager",
    blueprints: "Blueprint gallery",
    transfers: "Portability transfers"
  };
  $("#consoleTitle").textContent = titles[panelName] || "Command deck";
}

function switchManager(tabName) {
  state.managerTab = tabName;
  $$(".manager-toolbar button").forEach((button) => {
    button.classList.toggle("active", button.dataset.managerTab === tabName);
  });
  $$(".manager-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.managerView === tabName);
  });
}

function renderShell() {
  const object = activeObject();
  $("#activeTitle").textContent = object.name;
  $("#activeSummary").textContent = object.detail;
  $("#identityValue").textContent = object.identity;
  $("#resetValue").textContent = object.reset;
  $("#exportValue").textContent = object.export;
  $("#pathInput").value = object.path;
  $("#browserUrl").textContent = `playground.local${object.path}`;
  $("#pagePathLabel").textContent = object.path;
  $("#storageBadge").textContent = typeLabel(object.type);
  $("#storageBadge").className = `status ${statusClass(object.type)}`;
  $("#previewState").textContent = typeLabel(object.type);
  $("#settingsMode").textContent = object.type === "temporary" || object.type === "preview" ? "Apply Settings & Reset" : "Save & Reload";
  $("#settingsMode").className = object.type === "temporary" || object.type === "preview" ? "status warning" : "status good";
  $("#settingsResult").textContent = object.type === "temporary" || object.type === "preview"
    ? "Unsaved settings are destructive. This reset reloads the WordPress runtime and discards current files and database."
    : "This Playground has a durable destination. Settings changes use Save & Reload and keep the saved identity.";

  if (object.type === "preview") {
    $("#previewHeading").innerHTML = "Gutenberg branch <span>preview ready</span>";
    $("#previewBody").textContent = "The route-specific input was validated, the runtime was built, and this active shell now carries the PR or branch identity.";
    $("#previewNote").textContent = "Preview is still unsaved. Save to browser storage or a local directory before refresh.";
  } else if (object.type === "blueprint") {
    $("#previewHeading").innerHTML = `${escapeHtml(object.name)} <span>is running</span>`;
    $("#previewBody").textContent = "The selected Blueprint replaced the prior runtime and updated the live preview, files, and SQLite database.";
    $("#previewNote").textContent = "Blueprint result is browser-backed after save; run history is recorded in Transfers.";
  } else if (object.type === "imported") {
    $("#previewHeading").innerHTML = "Imported zip <span>ready</span>";
    $("#previewBody").textContent = "The selected archive replaced the WordPress files and database after confirmation.";
    $("#previewNote").textContent = "Inspect files, database, and logs before exporting again.";
  } else if (object.type === "browser" || object.type === "local") {
    $("#previewHeading").innerHTML = `${escapeHtml(object.name)} <span>saved</span>`;
    $("#previewBody").textContent = object.type === "browser"
      ? "This Playground is saved in browser storage with a stable slug and Save & Reload settings behavior."
      : "This Playground is backed by a local directory. Reconnect folder permission after refresh to continue saving changes.";
    $("#previewNote").textContent = object.type === "browser"
      ? "Reset no longer discards the saved row; settings use Save & Reload."
      : "Local directory storage is distinct from browser storage and depends on folder permission.";
  } else {
    $("#previewHeading").innerHTML = "Hello from <span>WordPress Playground!</span>";
    $("#previewBody").textContent = "This is Playground, a WordPress that runs client-side in your browser. It is ready for training, plugin checks, branch reviews, and testing purposes.";
    $("#previewNote").textContent = "You are logged in as admin. Save this temporary runtime before refresh if you need to keep the files and database.";
  }
}

function renderObjects() {
  $("#objectCount").textContent = `${state.objects.length} objects`;
  $("#objectList").innerHTML = state.objects.map((object) => `
    <article class="object-row ${object.id === state.activeId ? "active" : ""}" data-object-id="${escapeHtml(object.id)}">
      <div>
        <strong>${escapeHtml(object.name)}</strong>
        <span>${escapeHtml(typeLabel(object.type))} - ${escapeHtml(object.detail)}</span>
        <span>${escapeHtml(object.path)} - ${escapeHtml(object.identity)}</span>
      </div>
      <div class="row-actions">
        <button type="button" data-object-action="open" data-object-id="${escapeHtml(object.id)}">Open</button>
        <button type="button" data-object-action="manage" data-object-id="${escapeHtml(object.id)}">Manage</button>
      </div>
    </article>
  `).join("");
}

function renderHistory() {
  $("#historyList").innerHTML = state.history.slice(0, 9).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderRoute() {
  const route = routes[state.route];
  $("#routeTitle").textContent = route.title;
  $("#routeLabel").textContent = route.label;
  $("#routeInput").value = route.value;
  $("#routeHint").textContent = route.hint;
  $("#runRouteBtn").textContent = route.button;
  $("#routeStatus").textContent = "Input pending";
  $("#routeStatus").className = "status warning";
  $("#routeProgressLabel").textContent = "Waiting for validation";
  $("#routeProgressCount").textContent = "0%";
  $("#routeProgressBar").style.width = "0%";
  $("#routeTimeline").innerHTML = `
    <li class="current">Route input has not been validated.</li>
    <li>Runtime has not been built.</li>
    <li>Preview identity has not replaced the temporary shell.</li>
    <li>Save and export are still locked.</li>
  `;
}

function renderBlueprints() {
  const search = $("#blueprintSearch").value.trim().toLowerCase();
  const filtered = blueprints.filter((blueprint) => {
    const categoryMatch = state.blueprintFilter === "All" || blueprint.tags.includes(state.blueprintFilter);
    const searchMatch = !search || blueprint.name.toLowerCase().includes(search) || blueprint.desc.toLowerCase().includes(search);
    return categoryMatch && searchMatch;
  });
  $("#blueprintCount").textContent = `${filtered.length} shown of 43`;
  $("#blueprintGrid").innerHTML = filtered.map((blueprint) => `
    <button class="blueprint-card ${blueprint.id === state.selectedBlueprint ? "active" : ""}" type="button" data-blueprint-id="${escapeHtml(blueprint.id)}">
      <span class="blueprint-thumb">${escapeHtml(blueprint.tags[0])}</span>
      <span class="blueprint-info">
        <strong>${escapeHtml(blueprint.name)}</strong>
        <span>${escapeHtml(blueprint.tags.join(" / "))}</span>
      </span>
    </button>
  `).join("");
  const selected = blueprints.find((blueprint) => blueprint.id === state.selectedBlueprint) || blueprints[0];
  $("#selectedBlueprintTitle").textContent = selected.name;
  $("#selectedBlueprintDesc").textContent = selected.desc;
}

function renderSaveDestination() {
  $$(".destination").forEach((button) => {
    button.classList.toggle("active", button.dataset.destination === state.destination);
  });
  if (state.destination === "browser") {
    $("#startSaveBtn").textContent = "Save to browser storage";
    $("#saveConsequence").textContent = "Browser destination selected. The active temporary row will become a saved browser-backed Playground and a new unsaved row remains available for quick start.";
  } else {
    $("#startSaveBtn").textContent = state.localPermission ? "Save to local directory" : "Choose local directory";
    $("#saveConsequence").textContent = state.localPermission
      ? "Local folder ~/Sites/gutenberg-console-review is connected. Reloads require reconnecting permission before writes continue."
      : "Local destination selected. A folder picker must grant permission before files can be copied outside browser storage.";
  }
}

function renderAll() {
  renderShell();
  renderObjects();
  renderHistory();
  renderBlueprints();
  renderSaveDestination();
}

function resetProgress(prefix) {
  $(`#${prefix}ProgressLabel`).textContent = prefix === "route" ? "Waiting for validation" : "No files copied yet";
  $(`#${prefix}ProgressCount`).textContent = prefix === "route" ? "0%" : "0 / 3751 files";
  $(`#${prefix}ProgressBar`).style.width = "0%";
}

function runProgress({ prefix, steps, done }) {
  let index = 0;
  const timer = window.setInterval(() => {
    const step = steps[index];
    $(`#${prefix}ProgressLabel`).textContent = step.label;
    $(`#${prefix}ProgressCount`).textContent = step.count;
    $(`#${prefix}ProgressBar`).style.width = step.width;
    index += 1;
    if (index >= steps.length) {
      window.clearInterval(timer);
      window.setTimeout(done, 250);
    }
  }, 420);
}

function completeRoute() {
  const route = routes[state.route];
  const value = $("#routeInput").value.trim() || route.value;
  const object = activeObject();
  object.name = state.route === "gutenberg" ? `${route.resultName}: ${value}` : route.resultName;
  object.type = state.route === "zip" ? "imported" : "preview";
  object.path = route.resultPath;
  object.detail = route.resultText;
  object.identity = state.route === "gutenberg" ? `preview: gutenberg/${value}` : `preview: ${state.route}`;
  object.reset = "Apply Settings & Reset";
  object.export = "Export to GitHub and Download as zip available";
  state.activeId = object.id;
  $("#routeStatus").textContent = "Preview ready";
  $("#routeStatus").className = "status good";
  $("#commandStatus").textContent = "Preview ready";
  $("#commandStatus").className = "status good";
  $("#routeTimeline").innerHTML = `
    <li class="done">Input validated: ${escapeHtml(value)}.</li>
    <li class="done">Runtime built with WordPress latest and PHP 8.3.</li>
    <li class="done">Active shell identity changed to ${escapeHtml(object.name)}.</li>
    <li class="done">Save, Export to GitHub, Download as zip, Files, Database, and Logs are available.</li>
  `;
  $("#flowTitle").textContent = "Preview ready";
  $("#flowText").textContent = object.detail;
  $("#stepValidate").classList.add("done");
  $("#stepBuild").classList.add("done");
  $("#stepReady").classList.add("done");
  addHistory(`${object.name} built from route-specific input and opened at ${object.path}.`);
  renderAll();
}

function startRouteFlow() {
  resetProgress("route");
  $("#routeStatus").textContent = "Validating";
  $("#routeStatus").className = "status blue";
  $("#commandStatus").textContent = "Building preview";
  $("#commandStatus").className = "status blue";
  $("#routeTimeline").innerHTML = `
    <li class="current">Validating ${escapeHtml(routes[state.route].label)}.</li>
    <li>Runtime build queued.</li>
    <li>Preview identity pending.</li>
    <li>Save and export remain locked.</li>
  `;
  runProgress({
    prefix: "route",
    steps: [
      { label: "Validating route input", count: "24%", width: "24%" },
      { label: "Resolving WordPress and PHP versions", count: "48%", width: "48%" },
      { label: "Building browser runtime", count: "76%", width: "76%" },
      { label: "Assigning preview identity", count: "100%", width: "100%" }
    ],
    done: completeRoute
  });
}

function ensureUnsavedRow() {
  if (!state.objects.some((object) => object.id === "temp-main")) {
    state.objects.push({
      id: "temp-main",
      name: "Unsaved Playground",
      type: "temporary",
      path: "/hello-from-playground/",
      detail: "Temporary runtime. Not saved to browser storage.",
      identity: "temp: current-session",
      reset: "Apply Settings & Reset",
      export: "Locked until preview or save"
    });
  }
}

function completeSave() {
  const name = $("#saveName").value.trim() || "Saved Playground";
  const destination = state.destination;
  const savedId = `${destination}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  const prior = activeObject();
  const savedObject = {
    id: savedId,
    name,
    type: destination === "browser" ? "browser" : "local",
    path: prior.path,
    detail: destination === "browser"
      ? "Saved in this browser. Slug: gutenberg-branch-console-review."
      : "Saved to local directory ~/Sites/gutenberg-console-review. Reconnect after refresh.",
    identity: destination === "browser"
      ? "browser: gutenberg-branch-console-review"
      : "local: ~/Sites/gutenberg-console-review",
    reset: destination === "browser" ? "Save & Reload" : "Save & Reload after folder permission",
    export: "Export to GitHub and Download as zip available"
  };
  state.objects = state.objects.filter((object) => object.id !== savedId);
  state.objects.unshift(savedObject);
  if (prior.type === "temporary" || prior.type === "preview") {
    prior.name = "Unsaved Playground";
    prior.type = "temporary";
    prior.path = "/hello-from-playground/";
    prior.detail = "Fresh temporary runtime remains available for starting over.";
    prior.identity = "temp: current-session";
    prior.reset = "Apply Settings & Reset";
    prior.export = "Locked until preview or save";
  }
  ensureUnsavedRow();
  state.activeId = savedId;
  $("#saveStatus").textContent = destination === "browser" ? "Saved in browser" : "Saved locally";
  $("#saveStatus").className = "status good";
  $("#saveResult").textContent = destination === "browser"
    ? "Done. Saved row inserted, active title updated, browser slug assigned, and settings now use Save & Reload."
    : "Done. Local directory row inserted. Refresh requires reconnecting folder permission before additional writes.";
  $("#commandStatus").textContent = "Saved";
  $("#commandStatus").className = "status good";
  addHistory(`${name} saved to ${destination === "browser" ? "browser storage" : "local directory"} after copying 3751 files.`);
  renderAll();
}

function startSaveFlow() {
  if (state.destination === "local" && !state.localPermission) {
    $("#saveResult").textContent = "Folder picker required before local-directory save can start. Use Grant local folder permission.";
    $("#saveStatus").textContent = "Folder permission needed";
    $("#saveStatus").className = "status warning";
    return;
  }
  $("#saveStatus").textContent = "Saving";
  $("#saveStatus").className = "status blue";
  runProgress({
    prefix: "save",
    steps: [
      { label: "Preparing file manifest", count: "412 / 3751 files", width: "11%" },
      { label: "Copying WordPress core", count: "1394 / 3751 files", width: "37%" },
      { label: "Copying wp-content and Blueprint bundle", count: "2740 / 3751 files", width: "73%" },
      { label: "Writing database and saved identity", count: "3751 / 3751 files", width: "100%" }
    ],
    done: completeSave
  });
}

function openObject(id) {
  const object = state.objects.find((item) => item.id === id);
  if (!object) return;
  state.activeId = id;
  $("#renameInput").value = object.name;
  addHistory(`${object.name} opened from the saved Playground list.`);
  renderAll();
}

function deleteActive() {
  const object = activeObject();
  if (object.type === "temporary" || object.type === "preview") {
    $("#deleteCopy").textContent = "This active object is temporary. Confirming clears the preview and starts a fresh Unsaved Playground.";
  } else {
    $("#deleteCopy").textContent = `This removes ${object.name} from its ${typeLabel(object.type)} destination. The shell falls back to a fresh Unsaved Playground.`;
  }
  $("#deleteConfirm").hidden = false;
}

function confirmDelete() {
  const object = activeObject();
  state.objects = state.objects.filter((item) => item.id !== object.id);
  ensureUnsavedRow();
  const fallback = state.objects.find((item) => item.id === "temp-main") || state.objects[0];
  state.activeId = fallback.id;
  $("#deleteConfirm").hidden = true;
  addHistory(`${object.name} deleted. Active shell fell back to ${fallback.name}.`);
  renderAll();
}

function renameActive() {
  const object = activeObject();
  const nextName = $("#renameInput").value.trim();
  if (!nextName) return;
  const previous = object.name;
  object.name = nextName;
  if (object.type === "browser") {
    object.identity = `browser: ${nextName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  }
  addHistory(`${previous} renamed to ${nextName}.`);
  renderAll();
}

function runBlueprintReplacement() {
  const selected = blueprints.find((blueprint) => blueprint.id === state.selectedBlueprint) || blueprints[0];
  const object = activeObject();
  object.name = `${selected.name} Blueprint Runtime`;
  object.type = "blueprint";
  object.path = "/";
  object.detail = `${selected.name} replaced the prior runtime. ${selected.desc}`;
  object.identity = `blueprint: ${selected.id}`;
  object.reset = "Save & Reload";
  object.export = "Export to GitHub and Download as zip available";
  $("#blueprintConfirm").hidden = true;
  $("#selectedBlueprintStatus").textContent = "Run complete";
  $("#selectedBlueprintStatus").className = "status good";
  addHistory(`${selected.name} Blueprint confirmed, run, and reflected in the live preview.`);
  renderAll();
}

function runZipReplacement() {
  const object = activeObject();
  object.name = "Imported Zip Playground";
  object.type = "imported";
  object.path = "/wp-admin/";
  object.detail = "playground-export.zip replaced files and the SQLite database after confirmation.";
  object.identity = "import: playground-export.zip";
  object.reset = "Apply Settings & Reset until saved";
  object.export = "Download as zip available";
  $("#zipConfirm").hidden = true;
  addHistory("playground-export.zip imported after replacement confirmation.");
  renderAll();
}

function bindEvents() {
  $$(".console-tabs button").forEach((button) => {
    button.addEventListener("click", () => switchPanel(button.dataset.panel));
  });
  $$("[data-mobile-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      switchPanel(button.dataset.mobileTab);
      $(".console").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  $("#managerShortcut").addEventListener("click", () => switchPanel("manager"));
  $("#topSaveBtn").addEventListener("click", () => switchPanel("save"));

  $$(".route").forEach((button) => {
    button.addEventListener("click", () => {
      state.route = button.dataset.route;
      $$(".route").forEach((item) => item.classList.toggle("active", item === button));
      renderRoute();
    });
  });
  $("#runRouteBtn").addEventListener("click", startRouteFlow);
  $("#cancelRouteBtn").addEventListener("click", () => {
    renderRoute();
    addHistory("Route preview canceled before runtime replacement.");
  });

  $$(".destination").forEach((button) => {
    button.addEventListener("click", () => {
      state.destination = button.dataset.destination;
      renderSaveDestination();
    });
  });
  $("#folderPermissionBtn").addEventListener("click", () => {
    state.destination = "local";
    state.localPermission = true;
    $("#saveStatus").textContent = "Folder connected";
    $("#saveStatus").className = "status good";
    $("#saveResult").textContent = "Folder permission granted for ~/Sites/gutenberg-console-review. Local save can now copy files.";
    addHistory("Local folder permission granted for ~/Sites/gutenberg-console-review.");
    renderSaveDestination();
  });
  $("#startSaveBtn").addEventListener("click", startSaveFlow);

  $("#objectList").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const id = button.dataset.objectId;
    if (button.dataset.objectAction === "open") openObject(id);
    if (button.dataset.objectAction === "manage") {
      openObject(id);
      switchPanel("manager");
    }
  });
  $("#renameBtn").addEventListener("click", renameActive);
  $("#deleteBtn").addEventListener("click", deleteActive);
  $("#cancelDeleteBtn").addEventListener("click", () => {
    $("#deleteConfirm").hidden = true;
    addHistory("Delete canceled; active Playground unchanged.");
  });
  $("#confirmDeleteBtn").addEventListener("click", confirmDelete);

  $$(".manager-toolbar button").forEach((button) => {
    button.addEventListener("click", () => switchManager(button.dataset.managerTab));
  });
  $("#applySettingsBtn").addEventListener("click", () => {
    const object = activeObject();
    if (object.type === "temporary" || object.type === "preview") {
      object.name = "Unsaved Playground";
      object.type = "temporary";
      object.path = "/hello-from-playground/";
      object.detail = "Settings reset completed. Files and database returned to a fresh temporary runtime.";
      object.identity = "temp: reset-session";
      object.export = "Locked until preview or save";
      $("#settingsResult").textContent = "Reset complete. The live preview returned to a fresh temporary WordPress runtime.";
      addHistory("Destructive settings reset completed for the unsaved Playground.");
    } else {
      $("#settingsResult").textContent = "Save & Reload complete. Saved identity and row stayed intact.";
      addHistory(`${object.name} reloaded with updated settings.`);
    }
    renderAll();
  });

  $("#fileEditor").addEventListener("input", () => {
    $("#fileStatus").textContent = "Dirty";
    $("#fileStatus").className = "status warning";
    $("#fileResult").textContent = "wp-config.php has unsaved editor changes.";
  });
  $("#saveFileBtn").addEventListener("click", () => {
    $("#fileStatus").textContent = "Saved";
    $("#fileStatus").className = "status good";
    $("#fileResult").textContent = "wp-config.php saved. File browser result recorded in transfer history.";
    addHistory("wp-config.php edited and saved from Site Manager Files.");
  });
  $("#newFileBtn").addEventListener("click", () => addHistory("New File created: /wordpress/wp-content/mu-plugins/playground-note.php."));
  $("#newFolderBtn").addEventListener("click", () => addHistory("New Folder created: /wordpress/wp-content/uploads/playground-assets."));
  $("#uploadFileBtn").addEventListener("click", () => addHistory("Upload complete: sample-plugin.zip added to wp-content/uploads."));
  $("#browseFilesBtn").addEventListener("click", () => addHistory("Browse files selected /wordpress/wp-config.php."));

  $("#copyBlueprintBtn").addEventListener("click", () => {
    $("#blueprintResult").textContent = "Blueprint link copied to clipboard.";
    addHistory("Blueprint link copied from Site Manager.");
  });
  $("#downloadBlueprintBtn").addEventListener("click", () => {
    $("#blueprintResult").textContent = "Blueprint bundle download prepared.";
    addHistory("Blueprint bundle download prepared.");
  });
  $("#runBlueprintEditorBtn").addEventListener("click", () => {
    $("#blueprintResult").textContent = "Blueprint JSON validated. Replacement confirmation is shown in the Blueprints tab.";
    switchPanel("blueprints");
    $("#blueprintConfirm").hidden = false;
  });

  $("#downloadDbBtn").addEventListener("click", () => addHistory("database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite."));
  $("#adminerBtn").addEventListener("click", () => addHistory("Adminer opened for SQLite-backed database inspection."));
  $("#phpmyadminBtn").addEventListener("click", () => addHistory("phpMyAdmin opened for WordPress database inspection."));
  $("#exportGithubBtn").addEventListener("click", () => {
    $("#exportResult").textContent = "GitHub export authenticated, repository selected, and push queued for the active Playground.";
    addHistory("Export to GitHub queued from Site Manager additional actions.");
  });
  $("#downloadZipBtn").addEventListener("click", () => addHistory("Download as .zip generated for the active Playground."));
  $("#downloadBlueprintBundleBtn").addEventListener("click", () => addHistory("Blueprint bundle downloaded from additional actions."));

  $$(".filter-row button").forEach((button) => {
    button.addEventListener("click", () => {
      state.blueprintFilter = button.dataset.filter;
      $$(".filter-row button").forEach((item) => item.classList.toggle("active", item === button));
      renderBlueprints();
    });
  });
  $("#blueprintSearch").addEventListener("input", renderBlueprints);
  $("#blueprintGrid").addEventListener("click", (event) => {
    const card = event.target.closest("[data-blueprint-id]");
    if (!card) return;
    state.selectedBlueprint = card.dataset.blueprintId;
    renderBlueprints();
  });
  $("#validateBlueprintBtn").addEventListener("click", () => {
    $("#selectedBlueprintStatus").textContent = "Valid JSON";
    $("#selectedBlueprintStatus").className = "status good";
    addHistory(`${$("#selectedBlueprintTitle").textContent} Blueprint validated.`);
  });
  $("#runGalleryBlueprintBtn").addEventListener("click", () => {
    $("#blueprintConfirm").hidden = false;
  });
  $("#cancelBlueprintBtn").addEventListener("click", () => {
    $("#blueprintConfirm").hidden = true;
    addHistory("Blueprint replacement canceled; active preview unchanged.");
  });
  $("#confirmBlueprintBtn").addEventListener("click", runBlueprintReplacement);

  $("#connectGithubBtn").addEventListener("click", () => addHistory("GitHub account connected for this session; token will not be stored after refresh."));
  $("#transferExportBtn").addEventListener("click", () => addHistory("Active Playground exported to GitHub repository wordpress/playground-review."));
  $("#zipImportBtn").addEventListener("click", () => {
    $("#zipConfirm").hidden = false;
    addHistory("playground-export.zip selected through native file chooser; replacement confirmation required.");
  });
  $("#cancelZipBtn").addEventListener("click", () => {
    $("#zipConfirm").hidden = true;
    addHistory("Zip import canceled before files and database were replaced.");
  });
  $("#confirmZipBtn").addEventListener("click", runZipReplacement);
  $("#transferZipBtn").addEventListener("click", () => addHistory("Current Playground downloaded as playground-export.zip."));
  $("#transferDbBtn").addEventListener("click", () => addHistory("database.sqlite downloaded from Transfers."));
  $("#transferBlueprintBtn").addEventListener("click", () => addHistory("Blueprint bundle downloaded from Transfers."));

  $("#goPathBtn").addEventListener("click", () => {
    const object = activeObject();
    object.path = $("#pathInput").value.trim() || "/";
    addHistory(`Active WordPress path changed to ${object.path}.`);
    renderShell();
  });
  $("#refreshBtn").addEventListener("click", () => addHistory(`Refreshed active WordPress page at ${activeObject().path}.`));
  $("#homeBtn").addEventListener("click", () => {
    activeObject().path = "/hello-from-playground/";
    addHistory("Homepage opened in the protected live shell.");
    renderShell();
  });
  $("#adminBtn").addEventListener("click", () => {
    activeObject().path = "/wp-admin/";
    addHistory("WP Admin opened in the protected live shell.");
    renderShell();
  });
  $$(".site-nav [data-path]").forEach((button) => {
    button.addEventListener("click", () => {
      activeObject().path = button.dataset.path;
      addHistory(`WordPress navigation changed path to ${button.dataset.path}.`);
      renderShell();
    });
  });
}

bindEvents();
renderRoute();
renderAll();
