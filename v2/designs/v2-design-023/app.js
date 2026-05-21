const state = {
  activeId: "temp-main",
  route: "gutenberg",
  managerTab: "settings",
  selectedBlueprint: "art-gallery",
  saveTimer: null,
  objects: [
    {
      id: "temp-main",
      name: "Unsaved Playground",
      type: "temporary",
      detail: "Not saved. Refresh resets files and database.",
      path: "/hello-from-playground/",
      runtime: "WP latest / PHP 8.3",
      created: "current session",
      actions: ["open", "save", "manage"]
    },
    {
      id: "browser-research",
      name: "Research Browser Playground",
      type: "browser",
      detail: "Saved in this browser. Slug: research-browser-playground.",
      path: "/hello-from-playground/",
      runtime: "WP latest / PHP 8.3",
      created: "May 21, 2026",
      actions: ["open", "rename", "delete", "export"]
    },
    {
      id: "local-plugin-lab",
      name: "Local Plugin Lab",
      type: "local",
      detail: "Directory: ~/Sites/playground-plugin-lab. Reconnect after refresh.",
      path: "/wp-admin/",
      runtime: "WP 6.8 / PHP 8.3",
      created: "local directory",
      actions: ["open", "rename", "delete", "export"]
    }
  ],
  events: [
    { title: "Temporary Playground created", meta: "current session - not persisted" },
    { title: "Research Browser Playground saved", meta: "browser storage - 3751 files copied" }
  ],
  deletePendingId: null,
  folderGranted: false,
  fileDirty: false,
  fileResult: "Selected file editor is ready.",
  blueprintDirty: false,
  blueprintEditorResult: "Valid JSON. Running may replace current content."
};

const routes = {
  gutenberg: {
    title: "Preview Gutenberg PR or Branch",
    label: "PR number, URL, or branch name",
    value: "trunk",
    help: "Accepts Gutenberg PR numbers, GitHub PR URLs, or branch names. A preview object starts temporary, then can be saved or exported.",
    button: "Validate and preview branch"
  },
  wordpress: {
    title: "Preview WordPress PR",
    label: "PR number or URL",
    value: "https://github.com/WordPress/wordpress-develop/pull/7392",
    help: "Builds WordPress core from the PR and opens a temporary review Playground.",
    button: "Preview WordPress PR"
  },
  vanilla: {
    title: "Start Vanilla WordPress",
    label: "Version",
    value: "latest",
    help: "Starts a fresh temporary WordPress Playground with default content.",
    button: "Start fresh Playground"
  },
  github: {
    title: "Import from GitHub",
    label: "Repository path",
    value: "wordpress/wordpress-playground",
    help: "Imports a public plugin, theme, or wp-content directory. GitHub account connection is required and the access token is not stored after refresh.",
    button: "Connect GitHub and import"
  },
  "blueprint-url": {
    title: "Run Blueprint from URL",
    label: "Blueprint URL",
    value: "https://example.com/blueprint.json",
    help: "Fetches, validates, then runs a Blueprint. Running a Blueprint may replace current content.",
    button: "Validate URL and run"
  },
  zip: {
    title: "Import .zip",
    label: "Selected archive",
    value: "playground-export.zip",
    help: "Uses the native file chooser. Import replaces the active files and SQLite database after confirmation.",
    button: "Choose zip and validate"
  }
};

const blueprints = [
  { id: "art-gallery", name: "Art Gallery", desc: "An art gallery created with the Vyeo theme.", tags: ["Featured", "Website", "Personal"] },
  { id: "coffee-shop", name: "Coffee Shop", desc: "A WooCommerce coffee shop storefront with products and custom content.", tags: ["Featured", "WooCommerce", "Website"] },
  { id: "friends-feed", name: "Feed Reader with the Friends Plugin", desc: "Read feeds from the web in Playground using the Friends plugin.", tags: ["Featured", "Content"] },
  { id: "gaming-news", name: "Gaming News", desc: "A gaming news site created with the Spiel theme.", tags: ["Featured", "News", "Website"] },
  { id: "non-profit", name: "Non-profit Organization", desc: "A non-profit organization site using the Koinonia theme.", tags: ["Featured", "Website"] },
  { id: "personal-blog", name: "Personal Blog", desc: "A personal blog created with the Substrata theme.", tags: ["Personal", "Content"] }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function activeObject() {
  return state.objects.find((object) => object.id === state.activeId) || state.objects[0];
}

function typeLabel(type) {
  return {
    temporary: "Temporary",
    browser: "Saved in browser",
    local: "Local directory",
    preview: "PR preview",
    imported: "ZIP import"
  }[type] || type;
}

function statusClass(type) {
  if (type === "browser" || type === "local") return "ok";
  if (type === "temporary" || type === "preview") return "warning";
  if (type === "imported") return "ok";
  return "";
}

function addEvent(title, meta) {
  state.events.unshift({ title, meta });
  renderEvents();
  $("#eventCount").textContent = String(state.events.length);
}

function renderAll() {
  renderObjects();
  renderShell();
  renderRoute();
  renderManage();
  renderManager();
  renderBlueprints();
  renderEvents();
}

function renderShell() {
  const object = activeObject();
  $("#shellTitle").textContent = object.name;
  $("#shellSubtitle").textContent = `${typeLabel(object.type)} - ${object.detail}`;
  $("#pathInput").value = object.path;
  $("#storageBadge").textContent = typeLabel(object.type);
  $("#storageBadge").className = `status ${statusClass(object.type)}`;
  $("#previewUrl").textContent = `playground.local${object.path}`;
  $("#previewState").textContent = object.type === "temporary" ? "Unsaved" : "Ready";
  $("#resetMode").textContent = object.type === "temporary" || object.type === "preview" ? "Apply & Reset" : "Save & Reload";
  $("#resetMode").className = object.type === "temporary" || object.type === "preview" ? "status warning" : "status ok";
  $("#previewKicker").textContent = typeLabel(object.type);
  $("#previewHeading").textContent = object.name.includes("Gutenberg") ? `${object.name}` : "Hello from WordPress Playground!";
  $("#previewBody").textContent = object.type === "preview"
    ? "This temporary preview was built from a route-specific Gutenberg input. Save it before refresh, or export it once the review is complete."
    : "This Playground runs client-side in your browser. Save it to browser storage or a local directory before refreshing if you need to keep the files and database.";
  $("#previewNotice").textContent = object.type === "temporary" || object.type === "preview"
    ? "Unsaved: refresh resets this site. Settings use Apply & Reset."
    : `${typeLabel(object.type)}: settings use Save & Reload. Reset no longer discards the object.`;
  $("#saveStatus").textContent = object.type === "temporary" || object.type === "preview" ? "Unsaved" : typeLabel(object.type);
  $("#saveStatus").className = `status ${statusClass(object.type)}`;
}

function renderObjects() {
  $("#objectCount").textContent = String(state.objects.length);
  $("#objectList").innerHTML = state.objects.map((object) => `
    <article class="objectRow ${object.id === state.activeId ? "active" : ""}" data-object-id="${object.id}">
      <div>
        <strong>${object.name}</strong>
        <small>${typeLabel(object.type)} - ${object.runtime}</small>
        <small>${object.detail}</small>
      </div>
      <div class="rowActions">
        <button type="button" data-action="open" data-id="${object.id}">Open</button>
        <button type="button" data-action="manage" data-id="${object.id}">Manage</button>
      </div>
    </article>
  `).join("");
}

function switchView(view) {
  $$(".modeTabs button").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  $$(".view").forEach((panel) => panel.classList.toggle("active", panel.id === `view-${view}`));
  $(".app").dataset.view = view;
}

function renderRoute() {
  const route = routes[state.route];
  $("#routeTitle").textContent = route.title;
  $("#routeStatus").textContent = "Idle";
  $("#routeStatus").className = "status";
  $("#routeDetails").innerHTML = `
    <div class="routeCard">
      <label class="field inline">
        <span>${route.label}</span>
        <input id="routeInput" value="${route.value}">
      </label>
      <p class="muted">${route.help}</p>
      <div class="runtimeStrip">
        <div><strong>WP</strong><span>latest unless route locks it</span></div>
        <div><strong>PHP</strong><span>8.3</span></div>
        <div><strong>Network</strong><span>allowed</span></div>
      </div>
      <div class="progressBlock" style="margin:0">
        <div class="progressLine"><span id="routeProgressLabel">Waiting for route validation</span><span id="routeProgressCount">0%</span></div>
        <div class="progress"><span id="routeProgressBar"></span></div>
      </div>
      <div class="buttonRow">
        <button type="button" id="runRouteBtn" class="primary">${route.button}</button>
        <button type="button" id="cancelRouteBtn">Cancel</button>
      </div>
      <div class="resultBox" style="margin:0" id="routeResult">Save, Export to GitHub, and Download as zip become available after a preview object exists.</div>
    </div>
  `;
}

function runRoute() {
  const input = $("#routeInput").value.trim();
  const route = routes[state.route];
  if (!input) {
    $("#routeStatus").textContent = "Validation failed";
    $("#routeStatus").className = "status danger";
    $("#routeResult").textContent = `${route.label} is required.`;
    return;
  }

  $("#routeStatus").textContent = "Validating";
  $("#routeStatus").className = "status warning";
  $("#routeProgressLabel").textContent = "Checking input and preparing runtime";
  $("#routeProgressCount").textContent = "35%";
  $("#routeProgressBar").style.width = "35%";

  window.setTimeout(() => {
    $("#routeStatus").textContent = "Loading";
    $("#routeProgressLabel").textContent = "Installing route-specific files";
    $("#routeProgressCount").textContent = "72%";
    $("#routeProgressBar").style.width = "72%";
  }, 350);

  window.setTimeout(() => {
    const safe = input.replace(/^https?:\/\//, "").replace(/[^\w.-]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "preview";
    const name = state.route === "gutenberg"
      ? `Gutenberg ${input} preview`
      : state.route === "wordpress"
        ? `WordPress PR ${safe} preview`
        : state.route === "vanilla"
          ? "Fresh Vanilla WordPress"
          : state.route === "github"
            ? `GitHub import ${safe}`
            : state.route === "blueprint-url"
              ? "Blueprint URL result"
              : "ZIP Import Preview";

    const path = state.route === "gutenberg"
      ? `/wp-admin/update-core.php?branch=${encodeURIComponent(input)}`
      : state.route === "wordpress"
        ? `/wp-admin/?core-pr=${encodeURIComponent(safe)}`
        : state.route === "github"
          ? "/wp-admin/plugins.php"
          : state.route === "blueprint-url"
            ? "/"
            : state.route === "zip"
              ? "/wp-admin/"
              : "/hello-from-playground/";

    const object = {
      id: `preview-${Date.now()}`,
      name,
      type: state.route === "zip" ? "imported" : state.route === "vanilla" ? "temporary" : "preview",
      detail: `${route.title} completed from "${input}". Save or export is now available.`,
      path,
      runtime: state.route === "wordpress" ? "WP PR build / PHP 8.3" : "WP latest / PHP 8.3",
      created: "just now",
      actions: ["open", "save", "rename", "delete", "export"]
    };
    state.objects.unshift(object);
    state.activeId = object.id;
    $("#routeStatus").textContent = "Preview ready";
    $("#routeStatus").className = "status ok";
    $("#routeProgressLabel").textContent = "Preview identity created";
    $("#routeProgressCount").textContent = "100%";
    $("#routeProgressBar").style.width = "100%";
    $("#routeResult").textContent = `${name} is now the active Playground. Save, Export to GitHub, Download as zip, database download, and Site Manager tabs are enabled for this object.`;
    addEvent(`${route.title} completed`, `${name} opened at ${path}`);
    renderObjects();
    renderShell();
    renderManage();
  }, 900);
}

function renderManage() {
  const object = activeObject();
  const canDelete = object.type !== "temporary";
  $("#manageCard").innerHTML = `
    <div class="routeCard">
      <h3>${object.name}</h3>
      <p class="muted">${typeLabel(object.type)} - ${object.detail}</p>
      <label class="field inline">
        <span>Rename active Playground</span>
        <input id="renameInput" value="${object.name}">
      </label>
      <div class="buttonRow">
        <button type="button" id="renameBtn">Rename</button>
        <button type="button" id="deletePrepareBtn" class="danger" ${canDelete ? "" : "disabled"}>Delete</button>
        <button type="button" id="openManagerBtn">Open Site Manager</button>
      </div>
      ${state.deletePendingId === object.id ? `
        <div class="deleteConfirm">
          <strong>Delete ${object.name}?</strong>
          <span>This removes the saved object from the list. If it is active, Playground falls back to a new unsaved site.</span>
          <div class="buttonRow">
            <button type="button" id="confirmDeleteBtn" class="danger">Confirm delete</button>
            <button type="button" id="cancelDeleteBtn">Cancel</button>
          </div>
        </div>
      ` : ""}
    </div>
  `;
}

function renameActive() {
  const object = activeObject();
  const nextName = $("#renameInput").value.trim();
  if (!nextName) return;
  const previous = object.name;
  object.name = nextName;
  object.detail = object.detail.replace(previous, nextName);
  addEvent("Playground renamed", `${previous} -> ${nextName}`);
  renderObjects();
  renderShell();
  renderManage();
}

function deleteActive() {
  const object = activeObject();
  const removedName = object.name;
  state.objects = state.objects.filter((item) => item.id !== object.id);
  if (!state.objects.length || state.activeId === object.id) {
    const fallback = {
      id: `temp-${Date.now()}`,
      name: "Unsaved Playground",
      type: "temporary",
      detail: "Fallback object after deletion. Refresh resets files and database.",
      path: "/hello-from-playground/",
      runtime: "WP latest / PHP 8.3",
      created: "just now",
      actions: ["open", "save", "manage"]
    };
    state.objects.unshift(fallback);
    state.activeId = fallback.id;
  }
  state.deletePendingId = null;
  addEvent("Saved Playground deleted", `${removedName} removed; active object fell back when needed.`);
  renderAll();
}

function startSave() {
  const destination = $("input[name='saveDestination']:checked").value;
  const name = $("#saveName").value.trim() || "Saved Playground";
  if (destination === "local" && !state.folderGranted) {
    $("#saveResult").textContent = "Choose a local directory before starting a local save. Browser save does not require folder permission.";
    return;
  }

  window.clearInterval(state.saveTimer);
  const total = destination === "browser" ? 3751 : 3751;
  let copied = 0;
  $("#startSaveBtn").disabled = true;
  $("#saveStatus").textContent = "Saving";
  $("#saveStatus").className = "status warning";
  $("#saveResult").textContent = destination === "browser"
    ? "Copying the active files and SQLite database into browser storage."
    : "Copying the active files and SQLite database into the granted local directory.";

  state.saveTimer = window.setInterval(() => {
    copied = Math.min(total, copied + 625);
    const pct = Math.round((copied / total) * 100);
    $("#saveProgressLabel").textContent = destination === "browser" ? "Saving to browser storage" : "Saving to local directory";
    $("#saveProgressCount").textContent = `${copied} / ${total}`;
    $("#saveProgressBar").style.width = `${pct}%`;
    if (copied >= total) {
      window.clearInterval(state.saveTimer);
      finishSave(destination, name);
    }
  }, 160);
}

function finishSave(destination, name) {
  const current = activeObject();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "saved-playground";
  current.name = name;
  current.type = destination === "browser" ? "browser" : "local";
  current.detail = destination === "browser"
    ? `Saved in this browser. Slug: ${slug}. Reload keeps this Playground.`
    : "Saved to ~/Sites/playground-command-deck. Refresh requires folder reconnect.";
  current.created = "just now";
  current.actions = ["open", "rename", "delete", "export"];
  if (destination === "browser") {
    current.path = `/saved/${slug}/`;
  }
  $("#startSaveBtn").disabled = false;
  $("#saveStatus").textContent = destination === "browser" ? "Saved in browser" : "Local directory";
  $("#saveStatus").className = "status ok";
  $("#saveResult").textContent = destination === "browser"
    ? `${name} is now browser-saved. The active shell title, path, storage badge, saved row, Site Manager reset control, and transfer history were updated.`
    : `${name} is now backed by a local directory. Reload keeps the object only after reconnecting the folder permission.`;
  addEvent(destination === "browser" ? "Browser save completed" : "Local directory save completed", `${name} copied 3751 files and database.sqlite`);
  renderObjects();
  renderShell();
  renderManage();
}

function renderManager() {
  $$("#managerTabs button").forEach((button) => button.classList.toggle("active", button.dataset.tab === state.managerTab));
  const object = activeObject();
  const resetCopy = object.type === "temporary" || object.type === "preview"
    ? "Apply Settings & Reset Playground destroys unsaved files and database."
    : "Save & Reload keeps the saved object and reloads the runtime.";

  const panes = {
    settings: `
      <div class="managerPane settingsGrid">
        <p class="muted">${resetCopy}</p>
        <label class="field inline"><span>WordPress Version</span><select><option>latest</option><option>6.8</option><option>6.7</option></select></label>
        <label class="toggleRow"><input type="checkbox"> Include older versions</label>
        <label class="field inline"><span>PHP Version</span><select><option>PHP 8.3</option><option>PHP 8.2</option><option>PHP 8.1</option></select></label>
        <label class="field inline"><span>Language</span><select><option>English (United States)</option><option>Polish</option></select></label>
        <label class="toggleRow"><input type="checkbox" checked> Allow network access</label>
        <label class="toggleRow"><input type="checkbox"> Create a multisite network</label>
        <button type="button" id="applySettingsBtn" class="${object.type === "temporary" || object.type === "preview" ? "danger" : "primary"}">${object.type === "temporary" || object.type === "preview" ? "Apply Settings & Reset Playground" : "Save & Reload"}</button>
      </div>
    `,
    files: `
      <div class="managerPane">
        <div class="buttonRow">
          <button type="button" id="newFileBtn">New File</button>
          <button type="button" id="newFolderBtn">New Folder</button>
          <button type="button" id="uploadFileBtn">Upload</button>
          <button type="button" id="browseFilesBtn">Browse files</button>
        </div>
        <div class="fileLayout">
          <div class="fileTree">
            <button type="button">/wordpress</button>
            <button type="button">wp-admin</button>
            <button type="button">wp-content</button>
            <button type="button">wp-includes</button>
            <button type="button">wp-config.php</button>
          </div>
          <div class="editorPane">
            <div class="editorHeader"><span>/wordpress/wp-config.php</span><span id="fileState">${state.fileDirty ? "Dirty" : "Saved"}</span></div>
            <textarea id="fileEditor">define( 'DB_NAME', 'database_name_here' );
define( 'DB_USER', 'username_here' );
define( 'DB_PASSWORD', 'password_here' );
define( 'DB_HOST', 'localhost' );</textarea>
            <div class="buttonRow" style="padding:8px"><button type="button" id="saveFileBtn" class="primary">Save file</button><span class="muted" id="fileResult">${state.fileResult}</span></div>
          </div>
        </div>
      </div>
    `,
    blueprint: `
      <div class="managerPane">
        <label class="field inline"><span>Blueprint URL</span><input value="https://playground.wordpress.net/blueprints/art-gallery.json"></label>
        <div class="buttonRow">
          <button type="button" id="copyBlueprintBtn">Copy link</button>
          <button type="button" id="downloadBlueprintBtn">Download bundle</button>
          <button type="button" id="runBlueprintBtn" class="primary">Run Blueprint</button>
        </div>
        <textarea id="blueprintEditor">{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "landingPage": "/hello-from-playground/",
  "preferredVersions": { "php": "8.3", "wp": "latest" },
  "features": {}
}</textarea>
        <div class="resultBox" style="margin:0" id="blueprintEditorResult">${state.blueprintEditorResult}</div>
      </div>
    `,
    database: `
      <div class="managerPane settingsGrid">
        <strong>Database management is an early access feature</strong>
        <p class="muted">WordPress Playground emulates MySQL using SQLite.</p>
        <div><strong>Database driver:</strong> MySQL emulation backed by SQLite</div>
        <div><strong>SQLite database path:</strong> /wordpress/wp-content/database/.ht.sqlite</div>
        <div><strong>Size:</strong> 452 KB</div>
        <div class="buttonRow">
          <button type="button" id="downloadDbPaneBtn">Download database.sqlite</button>
          <button type="button">Open Adminer</button>
          <button type="button">Open phpMyAdmin</button>
        </div>
      </div>
    `,
    logs: `
      <div class="managerPane settingsGrid">
        <div class="runtimeStrip">
          <div><strong>Playground</strong><span>No startup errors</span></div>
          <div><strong>WordPress</strong><span>1 notice</span></div>
          <div><strong>PHP</strong><span>No fatal errors</span></div>
        </div>
        <div class="resultBox" style="margin:0">WordPress notice: The optional SQLite database tools are early access. Continue using Adminer or phpMyAdmin for inspection.</div>
      </div>
    `
  };
  $("#managerBody").innerHTML = panes[state.managerTab];
}

function renderBlueprints() {
  const term = $("#blueprintSearch")?.value.toLowerCase() || "";
  const category = $("#blueprintCategory")?.value || "All";
  const filtered = blueprints.filter((item) => {
    const matchesTerm = `${item.name} ${item.desc}`.toLowerCase().includes(term);
    const matchesCategory = category === "All" || item.tags.includes(category);
    return matchesTerm && matchesCategory;
  });
  $("#blueprintStatus").textContent = `${filtered.length} of 43`;
  $("#blueprintList").innerHTML = filtered.map((item) => `
    <button type="button" class="blueprintCard ${item.id === state.selectedBlueprint ? "active" : ""}" data-blueprint="${item.id}">
      <strong>${item.name}</strong>
      <span class="muted">${item.desc}</span>
      <span class="tagLine">${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</span>
    </button>
  `).join("") || `<div class="resultBox" style="margin:0">No representative Blueprint matches this filter. The full product catalog contains 43 entries.</div>`;
  const selected = blueprints.find((item) => item.id === state.selectedBlueprint) || filtered[0] || blueprints[0];
  state.selectedBlueprint = selected.id;
  $("#blueprintDetail").innerHTML = `
    <h3>${selected.name}</h3>
    <p class="muted">${selected.desc}</p>
    <div class="buttonRow">
      <button type="button" id="selectBlueprintBtn">Use as active Blueprint</button>
      <button type="button" id="copyGalleryBlueprintBtn">Copy URL</button>
      <button type="button" id="runGalleryBlueprintBtn" class="primary">Run with replacement warning</button>
    </div>
    <div class="resultBox" style="margin:0" id="galleryBlueprintResult">Representative subset shown honestly: 6 visible entries from the 43-item current gallery.</div>
  `;
}

function renderEvents() {
  $("#eventLog").innerHTML = state.events.map((event) => `
    <li><strong>${event.title}</strong><span>${event.meta}</span></li>
  `).join("");
}

function completeTransfer(title, meta) {
  $("#transferStatus").textContent = "Completed";
  $("#transferStatus").className = "status ok";
  addEvent(title, meta);
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;

  if (target.dataset.view) switchView(target.dataset.view);

  if (target.dataset.route) {
    state.route = target.dataset.route;
    $$(".route").forEach((button) => button.classList.toggle("active", button.dataset.route === state.route));
    renderRoute();
    switchView("launch");
  }

  if (target.dataset.action === "open") {
    state.activeId = target.dataset.id;
    addEvent("Playground opened", `${activeObject().name} selected in object list.`);
    renderAll();
  }

  if (target.dataset.action === "manage") {
    state.activeId = target.dataset.id;
    renderAll();
    switchView("manage");
  }

  if (target.dataset.shellPath) {
    activeObject().path = target.dataset.shellPath;
    addEvent("Path changed", `${activeObject().name} opened ${target.dataset.shellPath}`);
    renderShell();
  }

  if (target.id === "refreshBtn") {
    addEvent("Preview refreshed", `${activeObject().name} refreshed at ${activeObject().path}`);
    $("#previewState").textContent = "Refreshed";
  }

  if (target.id === "saveTopBtn") switchView("save");
  if (target.id === "runRouteBtn") runRoute();
  if (target.id === "cancelRouteBtn") {
    $("#routeResult").textContent = "Route preview canceled. Active Playground was not changed.";
    $("#routeStatus").textContent = "Canceled";
  }
  if (target.id === "newTempBtn") {
    const object = {
      id: `temp-${Date.now()}`,
      name: "Unsaved Playground",
      type: "temporary",
      detail: "New temporary object. Refresh resets files and database.",
      path: "/hello-from-playground/",
      runtime: "WP latest / PHP 8.3",
      created: "just now",
      actions: ["open", "save", "manage"]
    };
    state.objects.unshift(object);
    state.activeId = object.id;
    addEvent("New temporary Playground started", "Vanilla WordPress started without persistence.");
    renderAll();
  }
  if (target.id === "grantFolderBtn") {
    state.folderGranted = true;
    $("#folderGrant span").textContent = "Folder: ~/Sites/playground-command-deck granted";
    addEvent("Local folder permission granted", "Local save can now write files; reconnect required after refresh.");
  }
  if (target.id === "startSaveBtn") startSave();
  if (target.id === "cancelSaveBtn") {
    window.clearInterval(state.saveTimer);
    $("#startSaveBtn").disabled = false;
    $("#saveResult").textContent = "Save canceled. Active Playground remains in its previous storage state.";
    addEvent("Save canceled", `${activeObject().name} storage unchanged.`);
  }
  if (target.id === "renameBtn") renameActive();
  if (target.id === "deletePrepareBtn") {
    state.deletePendingId = activeObject().id;
    renderManage();
  }
  if (target.id === "confirmDeleteBtn") deleteActive();
  if (target.id === "cancelDeleteBtn") {
    state.deletePendingId = null;
    addEvent("Delete canceled", `${activeObject().name} remains available.`);
    renderManage();
  }
  if (target.id === "openManagerBtn") switchView("site");
  if (target.dataset.tab) {
    state.managerTab = target.dataset.tab;
    renderManager();
  }
  if (target.id === "applySettingsBtn") {
    const object = activeObject();
    const temporary = object.type === "temporary" || object.type === "preview";
    object.detail = temporary ? "Settings reset completed. Site was rebuilt from the selected runtime." : "Settings saved and runtime reloaded without removing the saved object.";
    $("#previewState").textContent = temporary ? "Reset" : "Reloaded";
    addEvent(temporary ? "Destructive settings reset completed" : "Saved runtime reloaded", object.detail);
    renderShell();
    renderManager();
  }
  if (target.id === "newFileBtn" || target.id === "newFolderBtn" || target.id === "uploadFileBtn" || target.id === "browseFilesBtn") {
    const action = target.textContent;
    state.fileResult = `${action} completed. File browser selection updated.`;
    state.fileDirty = action === "New File" || action === "Upload";
    addEvent(`Files: ${action}`, "File browser result recorded for the active Playground.");
    renderManager();
  }
  if (target.id === "saveFileBtn") {
    state.fileDirty = false;
    state.fileResult = "/wordpress/wp-config.php saved successfully.";
    addEvent("File saved", "/wordpress/wp-config.php saved successfully.");
    renderManager();
  }
  if (target.id === "copyBlueprintBtn" || target.id === "downloadBlueprintBtn" || target.id === "runBlueprintBtn") {
    const action = target.id === "copyBlueprintBtn" ? "Blueprint link copied" : target.id === "downloadBlueprintBtn" ? "Blueprint bundle downloaded" : "Blueprint run completed";
    if (target.id === "runBlueprintBtn") {
      activeObject().path = "/";
      $("#previewHeading").textContent = "Blueprint result applied";
    }
    state.blueprintEditorResult = `${action}. The active Blueprint tool state and transfer history were updated.`;
    addEvent(action, `${activeObject().name} Blueprint tools updated.`);
    renderShell();
    renderManager();
  }
  if (target.dataset.blueprint) {
    state.selectedBlueprint = target.dataset.blueprint;
    renderBlueprints();
  }
  if (target.id === "selectBlueprintBtn" || target.id === "copyGalleryBlueprintBtn" || target.id === "runGalleryBlueprintBtn") {
    const blueprint = blueprints.find((item) => item.id === state.selectedBlueprint);
    if (target.id === "runGalleryBlueprintBtn") {
      activeObject().name = `${blueprint.name} Blueprint Result`;
      activeObject().path = "/";
      activeObject().detail = "Current content replaced by selected Blueprint run.";
      addEvent("Blueprint gallery run completed", `${blueprint.name} replaced current content and updated preview.`);
      renderAll();
      switchView("blueprints");
    } else {
      addEvent(target.id === "copyGalleryBlueprintBtn" ? "Blueprint URL copied" : "Blueprint selected", `${blueprint.name} is selected.`);
      $("#galleryBlueprintResult").textContent = `${blueprint.name}: ${target.id === "copyGalleryBlueprintBtn" ? "URL copied to clipboard result state." : "ready in Blueprint editor."}`;
    }
  }
  if (target.id === "exportGithubBtn") completeTransfer("Export to GitHub completed", "Connected account for this session, selected repository, pushed Playground bundle.");
  if (target.id === "downloadZipBtn") completeTransfer("ZIP download generated", `${activeObject().name}.zip packaged from active files and database.`);
  if (target.id === "downloadDbBtn" || target.id === "downloadDbPaneBtn") completeTransfer("database.sqlite downloaded", "/wordpress/wp-content/database/.ht.sqlite - 452 KB");
  if (target.id === "importZipBtn") $("#zipConfirm").classList.add("show");
  if (target.id === "cancelZipBtn") {
    $("#zipConfirm").classList.remove("show");
    addEvent("ZIP import canceled", "Active files and database were not replaced.");
  }
  if (target.id === "confirmZipBtn") {
    $("#zipConfirm").classList.remove("show");
    const object = activeObject();
    object.name = "Imported ZIP Playground";
    object.type = "imported";
    object.detail = "Files and SQLite database replaced from selected zip.";
    object.path = "/wp-admin/";
    completeTransfer("ZIP import completed", "Replacement confirmed; active shell, object row, preview path, and transfer history updated.");
    renderAll();
    switchView("transfers");
  }
});

document.addEventListener("change", (event) => {
  if (event.target.name === "saveDestination") {
    $$(".choice").forEach((choice) => choice.classList.toggle("active", choice.contains(event.target)));
    $("#folderGrant").style.display = event.target.value === "local" ? "flex" : "none";
    $("#saveResult").textContent = event.target.value === "local"
      ? "Local save writes to a user-granted directory and must be reconnected after browser refresh."
      : "Browser save writes to browser storage and creates a reload-safe slug in this browser.";
  }
  if (event.target.id === "blueprintCategory") renderBlueprints();
});

document.addEventListener("input", (event) => {
  if (event.target.id === "blueprintSearch") renderBlueprints();
  if (event.target.id === "fileEditor") {
    state.fileDirty = true;
    state.fileResult = "Unsaved editor changes.";
    $("#fileState").textContent = "Dirty";
    $("#fileResult").textContent = "Unsaved editor changes.";
  }
  if (event.target.id === "blueprintEditor") {
    state.blueprintDirty = true;
    state.blueprintEditorResult = "Blueprint JSON edited. Validate before running.";
    $("#blueprintEditorResult").textContent = "Blueprint JSON edited. Validate before running.";
  }
});

$("#pathForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const path = $("#pathInput").value.trim() || "/";
  activeObject().path = path.startsWith("/") ? path : `/${path}`;
  addEvent("Path navigated", `${activeObject().name} opened ${activeObject().path}`);
  renderShell();
});

renderAll();
