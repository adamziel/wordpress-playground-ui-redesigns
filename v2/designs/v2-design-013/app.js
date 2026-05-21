const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const blueprints = [
  {
    id: "art",
    name: "Art Gallery",
    description: "An art gallery created with the Vueo theme.",
    categories: ["Featured", "Website", "Personal", "Themes"],
    tone: "gallery",
  },
  {
    id: "coffee",
    name: "Coffee Shop",
    description: "A stylish WooCommerce coffee shop storefront with custom theme, products, and content.",
    categories: ["Featured", "Website", "WooCommerce"],
    tone: "coffee",
  },
  {
    id: "feed",
    name: "Feed Reader with the Friends Plugin",
    description: "Read feeds from the web in Playground using the Friends plugin.",
    categories: ["Featured", "Content", "Experiments"],
    tone: "feed",
  },
  {
    id: "gaming",
    name: "Gaming News",
    description: "A gaming news site created with the Spiel theme.",
    categories: ["Featured", "Website", "News"],
    tone: "gaming",
  },
  {
    id: "nonprofit",
    name: "Non-profit Organization",
    description: "A non-profit organization site created with the Koinonia theme.",
    categories: ["Featured", "Website"],
    tone: "nonprofit",
  },
  {
    id: "blog",
    name: "Personal Blog",
    description: "A personal blog created with the Substrata theme.",
    categories: ["Website", "Personal", "Content"],
    tone: "blog",
  },
  {
    id: "shop",
    name: "Block Theme Shop",
    description: "WooCommerce content for testing theme patterns, cart flows, and product blocks.",
    categories: ["WooCommerce", "Themes", "Gutenberg"],
    tone: "shop",
  },
  {
    id: "docs",
    name: "Docs Starter",
    description: "A content-heavy starter site for editing pages, navigation, media, and posts.",
    categories: ["Website", "Content", "Gutenberg"],
    tone: "docs",
  },
];

const state = {
  selectedObject: "browser",
  selectedBlueprint: "art",
  blueprintValidated: false,
  objects: {
    browser: {
      id: "browser",
      title: "Research Browser Playground",
      type: "browser",
      storageLabel: "Saved Playground",
      detail: "Saved in this browser - slug: research-browser-playground",
      status: "active",
      path: "/hello-from-playground/",
      runtime: { wp: "latest", php: "8.3", language: "en_US", network: true, multisite: false },
    },
    local: {
      id: "local",
      title: "Theme Lab Local",
      type: "local",
      storageLabel: "Local directory",
      detail: "Local directory - reconnect folder after refresh",
      status: "idle",
      path: "/hello-from-playground/",
      runtime: { wp: "latest", php: "8.3", language: "en_US", network: true, multisite: false },
    },
    temporary: {
      id: "temporary",
      title: "Unsaved Playground",
      type: "temporary",
      storageLabel: "Unsaved Playground",
      detail: "Temporary memory - reload or reset discards files and database",
      status: "unsaved",
      path: "/hello-from-playground/",
      runtime: { wp: "latest", php: "8.3", language: "en_US", network: true, multisite: false },
    },
  },
};

function nowStamp() {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "playground";
}

function currentObject() {
  return state.objects[state.selectedObject];
}

function runtimeText(object = currentObject()) {
  const runtime = object.runtime;
  return `WP ${runtime.wp} / PHP ${runtime.php} / ${runtime.language} / network ${runtime.network ? "on" : "off"}`;
}

function storageClass(object = currentObject()) {
  if (object.type === "temporary") return "warning";
  return "success";
}

function addEvent(title, detail) {
  const item = document.createElement("li");
  item.innerHTML = `<time>${nowStamp()}</time><strong>${title}</strong><span>${detail}</span>`;
  $("#eventStream").prepend(item);
  const count = $("#eventStream").children.length;
  $("#eventCount").textContent = `${count} events`;
}

function updateTransfer(label, detail) {
  const list = $("#transferLedger");
  const item = document.createElement("li");
  item.innerHTML = `<strong>${label}</strong><span>${detail}</span>`;
  list.prepend(item);
}

function renderObjects() {
  const rows = Object.values(state.objects);
  $("#ledgerCount").textContent = `${rows.length} objects`;
  $("#objectList").innerHTML = rows
    .map((object) => {
      const active = object.id === state.selectedObject ? " active" : "";
      return `
        <button class="object-row${active}" type="button" data-object-id="${object.id}">
          <span class="type-dot ${object.type}"></span>
          <span>
            <strong>${object.title}</strong>
            <small>${object.detail}</small>
          </span>
          <em>${object.id === state.selectedObject ? "active" : object.status}</em>
        </button>
      `;
    })
    .join("");
}

function updateShell() {
  const object = currentObject();
  $("#activeObjectLabel").textContent = object.title;
  $("#objectTitle").textContent = object.title;
  $("#previewTitle").textContent = object.title.includes("Unsaved") ? "My WordPress Website" : object.title;
  $("#pathInput").value = object.path;
  $("#previewPath").textContent = object.path;
  $("#runtimeBadge").textContent = runtimeText(object);
  $("#storageBadge").textContent = object.storageLabel;
  $("#storageBadge").className = `status-pill ${storageClass(object)}`;
  $("#settingsMode").textContent = object.type === "temporary" ? "Temporary reset" : "Stored object";
  $("#saveReload").textContent = object.type === "temporary" ? "Apply Settings & Reset Playground" : "Save & Reload active object";
  $("#renameInput").value = object.title;
  renderObjects();
}

function selectObject(id) {
  if (!state.objects[id]) return;
  state.selectedObject = id;
  updateShell();
  const object = currentObject();
  addEvent(`${object.title} selected`, `${object.storageLabel} opened at ${object.path}.`);
}

function selectPanel(name) {
  $$(".command-tabs button").forEach((button) => button.classList.toggle("active", button.dataset.panel === name));
  $$("[data-panel-view]").forEach((panel) => panel.classList.toggle("active", panel.dataset.panelView === name));
}

function selectManager(name) {
  $$(".manager-tabs button").forEach((button) => button.classList.toggle("active", button.dataset.manager === name));
  $$("[data-manager-view]").forEach((panel) => panel.classList.toggle("active", panel.dataset.managerView === name));
}

function updatePreview(kind, title, body, note) {
  if (kind === "admin") {
    $("#wpKicker").textContent = "WordPress Admin";
    $("#wpHeadline").innerHTML = "Dashboard";
    $("#wpBody").textContent = "The embedded admin is open inside the Playground shell. Posts, plugins, themes, settings, and Site Editor remain available.";
    $("#wpNote").textContent = "WP Admin is protected by the same path input, refresh, save state, and selected object.";
  } else if (kind === "blueprint") {
    $("#wpKicker").textContent = "Blueprint result";
    $("#wpHeadline").innerHTML = title;
    $("#wpBody").textContent = body;
    $("#wpNote").textContent = note;
  } else if (kind === "settings") {
    $("#wpKicker").textContent = "Reloaded runtime";
    $("#wpHeadline").innerHTML = "WordPress reloaded";
    $("#wpBody").textContent = body;
    $("#wpNote").textContent = note;
  } else {
    $("#wpKicker").textContent = "Browser-hosted WordPress";
    $("#wpHeadline").innerHTML = "Hello from <span>WordPress Playground!</span>";
    $("#wpBody").textContent = "This Playground runs client-side in your browser. It is ready for training, demonstrating plugins and themes, testing PRs, and running Blueprints.";
    $("#wpNote").textContent = "Logged in as admin. Save before closing the browser if this object is temporary.";
  }
  $("#previewState").textContent = kind === "home" ? "ready" : "updated";
}

function setPath(path) {
  const object = currentObject();
  object.path = path;
  updateShell();
  $("#previewPath").textContent = path;
  if (path === "/wp-admin/") {
    updatePreview("admin");
  } else {
    updatePreview("home");
  }
  addEvent("Path changed", `${object.title} navigated to ${path}.`);
}

function renderBlueprints() {
  const query = $("#blueprintSearch").value.trim().toLowerCase();
  const category = $("#blueprintCategory").value;
  const filtered = blueprints.filter((blueprint) => {
    const haystack = `${blueprint.name} ${blueprint.description} ${blueprint.categories.join(" ")}`.toLowerCase();
    return (category === "All" || blueprint.categories.includes(category)) && (!query || haystack.includes(query));
  });
  $("#catalogNote").textContent = filtered.length
    ? `Showing ${filtered.length} representative entries from the current 43-entry Blueprint gallery.`
    : "No representative Blueprint entries match this filter.";
  $("#blueprintGrid").innerHTML = filtered
    .map((blueprint) => {
      const active = blueprint.id === state.selectedBlueprint ? " active" : "";
      return `
        <button class="blueprint-card${active}" type="button" data-blueprint-id="${blueprint.id}">
          <span class="thumb ${blueprint.tone}"></span>
          <strong>${blueprint.name}</strong>
          <span>${blueprint.description}</span>
        </button>
      `;
    })
    .join("");
}

function selectBlueprint(id) {
  const blueprint = blueprints.find((item) => item.id === id) || blueprints[0];
  state.selectedBlueprint = blueprint.id;
  state.blueprintValidated = false;
  $("#selectedBlueprintName").textContent = blueprint.name;
  $("#selectedBlueprintDescription").textContent = blueprint.description;
  $("#selectedBlueprintTags").innerHTML = blueprint.categories.map((tag) => `<span>${tag}</span>`).join("");
  $("#blueprintUrl").value = `https://playground.wordpress.net/blueprints/${slugify(blueprint.name)}.json`;
  $("#blueprintArt").className = `detail-art ${blueprint.tone}`;
  $("#blueprintEditor").value = JSON.stringify(
    {
      $schema: "https://playground.wordpress.net/blueprint-schema.json",
      meta: { title: blueprint.name },
      landingPage: "/",
      preferredVersions: { php: "8.3", wp: "latest" },
      steps: [{ step: "setSiteOptions", options: { blogname: blueprint.name } }],
    },
    null,
    2
  );
  $("#blueprintState").textContent = "Inspection required";
  $("#blueprintState").className = "status-pill warning";
  $("#blueprintResult").textContent = `${blueprint.name} selected. Inspect and validate JSON before replacing the active content.`;
  renderBlueprints();
}

function animateProgress({ card, bar, text, steps, done }) {
  let index = 0;
  card.hidden = false;
  bar.style.inlineSize = "0%";
  function tick() {
    const step = steps[index];
    text.textContent = step.label;
    bar.style.inlineSize = `${step.percent}%`;
    index += 1;
    if (index < steps.length) {
      window.setTimeout(tick, 360);
    } else {
      window.setTimeout(done, 260);
    }
  }
  tick();
}

function validateBlueprint() {
  try {
    const parsed = JSON.parse($("#blueprintEditor").value);
    if (!parsed.steps || !Array.isArray(parsed.steps)) {
      throw new Error("Blueprint must include a steps array.");
    }
    state.blueprintValidated = true;
    $("#blueprintState").textContent = "Validated";
    $("#blueprintState").className = "status-pill success";
    $("#blueprintResult").textContent = "Blueprint JSON validated against required structure. Replacement confirmation is still required before running.";
    addEvent("Blueprint validated", `${$("#selectedBlueprintName").textContent} JSON is ready to run.`);
  } catch (error) {
    state.blueprintValidated = false;
    $("#blueprintState").textContent = "Validation failed";
    $("#blueprintState").className = "status-pill danger";
    $("#blueprintResult").textContent = `Validation failed: ${error.message}`;
    addEvent("Blueprint validation failed", error.message);
  }
}

function finishBlueprintRun() {
  const object = currentObject();
  const blueprint = blueprints.find((item) => item.id === state.selectedBlueprint) || blueprints[0];
  object.title = `${blueprint.name} Playground`;
  object.detail = `${object.storageLabel} - Blueprint applied just now`;
  object.path = "/";
  object.status = "blueprint result";
  updateShell();
  updatePreview(
    "blueprint",
    `${blueprint.name} is running`,
    `${blueprint.description} The Blueprint steps replaced the active WordPress content and restored the path to /.`,
    "Blueprint completed. The event stream, object ledger, transfer ledger, and live shell now point at the same updated Playground."
  );
  $("#blueprintConfirm").hidden = true;
  $("#blueprintResult").textContent = `${blueprint.name} finished. Active object renamed to ${object.title}, path changed to /, and preview updated.`;
  updateTransfer("Blueprint run", `${blueprint.name} applied to ${object.title}; content replaced after confirmation.`);
  addEvent("Blueprint run completed", `${blueprint.name} replaced content for ${object.title}.`);
}

function prepareBlueprintRun() {
  if (!state.blueprintValidated) {
    $("#blueprintResult").textContent = "Run blocked: validate the Blueprint JSON before replacement confirmation.";
    $("#blueprintState").textContent = "Validate first";
    $("#blueprintState").className = "status-pill warning";
    return;
  }
  $("#blueprintConfirm").hidden = false;
  $("#blueprintResult").textContent = "Replacement warning shown. Confirm to run or cancel to keep current content.";
}

function confirmBlueprintRun() {
  $("#browserFrame").classList.add("loading");
  animateProgress({
    card: $("#blueprintProgress"),
    bar: $("#blueprintProgressBar"),
    text: $("#blueprintProgressText"),
    steps: [
      { label: "Reading blueprint.json and bundled resources...", percent: 18 },
      { label: "Replacing WordPress content and theme files...", percent: 48 },
      { label: "Updating SQLite database and landing page...", percent: 76 },
      { label: "Blueprint run complete.", percent: 100 },
    ],
    done() {
      $("#browserFrame").classList.remove("loading");
      finishBlueprintRun();
    },
  });
}

function beginReload() {
  $("#reloadConfirm").hidden = false;
  if (currentObject().type === "temporary") {
    $("#reloadConfirm strong").textContent = "Reset temporary Playground?";
    $("#reloadConfirm p").textContent = "Applying settings to an unsaved Playground replaces WordPress files, clears the SQLite database, discards editor changes, and returns the path to /hello-from-playground/.";
  } else {
    $("#reloadConfirm strong").textContent = "Reload stored Playground?";
    $("#reloadConfirm p").textContent = "The selected stored Playground will reload with the chosen WordPress, PHP, language, network, and multisite settings. Temporary runtime changes are discarded, but the object identity remains.";
  }
}

function confirmReload() {
  const object = currentObject();
  $("#reloadConfirm").hidden = true;
  $("#browserFrame").classList.add("loading");
  animateProgress({
    card: $("#reloadProgress"),
    bar: $("#reloadProgressBar"),
    text: $("#reloadProgressText"),
    steps: [
      { label: object.type === "temporary" ? "Preparing destructive reset..." : "Saving runtime preferences...", percent: 20 },
      { label: "Reloading WordPress and PHP runtime...", percent: 54 },
      { label: "Restoring selected object and path...", percent: 82 },
      { label: "Runtime ready.", percent: 100 },
    ],
    done() {
      object.runtime = {
        wp: $("#wpVersion").value,
        php: $("#phpVersion").value,
        language: $("#language").value,
        network: $("#networkAccess").checked,
        multisite: $("#multisite").checked,
      };
      if (object.type === "temporary") {
        object.path = "/hello-from-playground/";
        object.status = "reset";
      } else {
        object.status = "reloaded";
      }
      updateShell();
      $("#browserFrame").classList.remove("loading");
      const consequence = object.type === "temporary" ? "Temporary reset completed; files and database were replaced." : "Stored Save & Reload completed; object identity remains intact.";
      $("#reloadResult").textContent = `${runtimeText(object)}. ${consequence}`;
      updatePreview("settings", "WordPress reloaded", `${object.title} is running ${runtimeText(object)}.`, consequence);
      updateTransfer("Settings reload", `${object.title}: ${runtimeText(object)}.`);
      addEvent("Settings applied", `${consequence} Active runtime is ${runtimeText(object)}.`);
    },
  });
}

function previewTemporaryWarning() {
  $("#reloadConfirm").hidden = false;
  $("#reloadConfirm strong").textContent = "Temporary Playground reset warning";
  $("#reloadConfirm p").textContent = "For Unsaved Playground, Apply Settings & Reset rebuilds WordPress, clears file edits, resets /wordpress/wp-content/database/.ht.sqlite, empties logs, and returns to /hello-from-playground/.";
  $("#reloadResult").textContent = "Warning preview shown. No settings were applied.";
  addEvent("Temporary reset warning previewed", "No mutation performed.");
}

function saveBrowser() {
  const name = $("#saveName").value.trim() || "Saved Playground";
  const temporary = state.objects.temporary || currentObject();
  state.selectedObject = "temporary";
  animateProgress({
    card: $("#saveProgress"),
    bar: $("#saveProgressBar"),
    text: $("#saveProgressText"),
    steps: [
      { label: "Saving 482 / 3751 files to browser storage...", percent: 18 },
      { label: "Saving 1864 / 3751 files to browser storage...", percent: 50 },
      { label: "Saving 3028 / 3751 files to browser storage...", percent: 79 },
      { label: "Saved 3751 / 3751 files.", percent: 100 },
    ],
    done() {
      temporary.title = name;
      temporary.type = "browser";
      temporary.storageLabel = "Saved Playground";
      temporary.detail = `Saved in this browser - slug: ${slugify(name)}`;
      temporary.status = "saved just now";
      temporary.path = `/${slugify(name)}/hello-from-playground/`;
      state.selectedObject = temporary.id;
      updateShell();
      $("#saveResult").textContent = `The temporary row was transformed into ${name}. Browser storage survives refresh on this device and appears in Saved Playgrounds.`;
      updateTransfer("Browser save", `${name} copied 3751 files and database records to browser storage.`);
      addEvent("Browser save completed", `${name} replaced the temporary row with a saved browser identity.`);
    },
  });
}

function saveLocal() {
  const folder = $("#localFolder").value.trim() || "/Users/admin/Playgrounds/current-playground";
  const local = state.objects.local;
  state.selectedObject = "local";
  animateProgress({
    card: $("#saveProgress"),
    bar: $("#saveProgressBar"),
    text: $("#saveProgressText"),
    steps: [
      { label: "Opening local directory picker...", percent: 15 },
      { label: "Permission granted. Writing WordPress files...", percent: 42 },
      { label: "Syncing database.sqlite and blueprint.json...", percent: 78 },
      { label: "Local directory save complete.", percent: 100 },
    ],
    done() {
      local.title = "Theme Lab Local";
      local.type = "local";
      local.storageLabel = "Local directory";
      local.detail = `Local directory: ${folder} - reconnect required after refresh`;
      local.status = "saved just now";
      local.path = "/hello-from-playground/";
      updateShell();
      $("#saveResult").textContent = `Saved to ${folder}. Reloading later asks for folder permission before opening this local-directory Playground.`;
      updateTransfer("Local directory save", `${folder} selected and synchronized with files, SQLite database, and blueprint.json.`);
      addEvent("Local directory save completed", `${folder} linked to ${local.title}.`);
    },
  });
}

function routeAction(action) {
  const map = {
    vanilla: ["Vanilla WordPress started", "Fresh temporary Playground created from the default WordPress route."],
    "wp-pr": ["WordPress PR preview queued", "PR number or URL accepted; preview starts as a temporary replacement object."],
    gutenberg: ["Gutenberg PR or branch preview queued", "Branch or PR input accepted for Gutenberg preview."],
  };
  const [title, detail] = map[action] || ["Route selected", "Create route selected."];
  $("#launchResult").textContent = detail;
  addEvent(title, detail);
}

function renameObject() {
  const object = currentObject();
  const name = $("#renameInput").value.trim();
  if (!name) {
    $("#manageResult").textContent = "Rename blocked: enter a Playground name.";
    return;
  }
  object.title = name;
  if (object.type === "browser") object.detail = `Saved in this browser - slug: ${slugify(name)}`;
  object.status = "renamed";
  updateShell();
  $("#manageResult").textContent = `Renamed selected object to ${name}. Shell title and ledger row updated together.`;
  addEvent("Playground renamed", `Selected object renamed to ${name}.`);
}

function deleteObject() {
  const object = currentObject();
  const deletedTitle = object.title;
  delete state.objects[object.id];
  if (!state.objects.temporary) {
    state.objects.temporary = {
      id: "temporary",
      title: "Unsaved Playground",
      type: "temporary",
      storageLabel: "Unsaved Playground",
      detail: "Temporary fallback after deletion - save before closing",
      status: "fallback",
      path: "/hello-from-playground/",
      runtime: { wp: "latest", php: "8.3", language: "en_US", network: true, multisite: false },
    };
  }
  state.selectedObject = "temporary";
  $("#deleteConfirm").hidden = true;
  updateShell();
  updatePreview("home");
  $("#manageResult").textContent = `${deletedTitle} deleted. Active site fell back to Unsaved Playground.`;
  updateTransfer("Delete completed", `${deletedTitle} removed from Saved Playgrounds; active fallback is Unsaved Playground.`);
  addEvent("Saved Playground deleted", `${deletedTitle} removed. Unsaved fallback selected.`);
}

function simpleResult(id, title, detail) {
  const target = $(id);
  if (target) target.textContent = detail;
  updateTransfer(title, detail);
  addEvent(title, detail);
}

document.addEventListener("click", (event) => {
  const objectButton = event.target.closest("[data-object-id]");
  if (objectButton) selectObject(objectButton.dataset.objectId);

  const tab = event.target.closest(".command-tabs [data-panel]");
  if (tab) selectPanel(tab.dataset.panel);

  const managerTab = event.target.closest(".manager-tabs [data-manager]");
  if (managerTab) selectManager(managerTab.dataset.manager);

  const pathButton = event.target.closest("[data-path]");
  if (pathButton) setPath(pathButton.dataset.path);

  const panelJump = event.target.closest("[data-open-panel]");
  if (panelJump) selectPanel(panelJump.dataset.openPanel);

  const blueprintButton = event.target.closest("[data-blueprint-id]");
  if (blueprintButton) selectBlueprint(blueprintButton.dataset.blueprintId);

  const routeButton = event.target.closest("[data-route-action]");
  if (routeButton) routeAction(routeButton.dataset.routeAction);
});

$("#pathInput").addEventListener("change", (event) => setPath(event.target.value || "/"));
$("#refreshButton").addEventListener("click", () => addEvent("Preview refreshed", `${currentObject().title} refreshed at ${currentObject().path}.`));
$("#blueprintSearch").addEventListener("input", renderBlueprints);
$("#blueprintCategory").addEventListener("change", renderBlueprints);
$("#validateBlueprint").addEventListener("click", validateBlueprint);
$("#prepareBlueprintRun").addEventListener("click", prepareBlueprintRun);
$("#cancelBlueprintRun").addEventListener("click", () => {
  $("#blueprintConfirm").hidden = true;
  $("#blueprintResult").textContent = "Blueprint run canceled. Active content unchanged.";
  addEvent("Blueprint run canceled", "Replacement confirmation dismissed before changes.");
});
$("#confirmBlueprintRun").addEventListener("click", confirmBlueprintRun);
$("#copyBlueprint").addEventListener("click", () => simpleResult("#blueprintResult", "Blueprint link copied", `${$("#blueprintUrl").value} copied to clipboard state.`));
$("#downloadBlueprint").addEventListener("click", () => simpleResult("#blueprintResult", "Blueprint bundle downloaded", "blueprint.json and bundled resources prepared for download."));
$("#saveReload").addEventListener("click", beginReload);
$("#showResetWarning").addEventListener("click", previewTemporaryWarning);
$("#cancelReload").addEventListener("click", () => {
  $("#reloadConfirm").hidden = true;
  $("#reloadResult").textContent = "Settings action canceled. Runtime unchanged.";
});
$("#confirmReload").addEventListener("click", confirmReload);
$("#saveBrowser").addEventListener("click", saveBrowser);
$("#saveLocal").addEventListener("click", saveLocal);
$("#cancelFolder").addEventListener("click", () => {
  $("#saveResult").textContent = "Folder picker canceled. Temporary Playground remains unsaved.";
  addEvent("Local directory picker canceled", "No files written; no folder permission retained.");
});
$("#connectGithub").addEventListener("click", () => {
  $("#launchResult").textContent = "GitHub connected for this session. Token is not stored after refresh; choose repository or wp-content directory next.";
  updateTransfer("GitHub import connected", "Account connected for import. Token expires with refresh.");
  addEvent("GitHub account connected", "Ready to import a public plugin, theme, or wp-content directory.");
});
$("#importZip").addEventListener("click", () => {
  $("#launchResult").textContent = "ZIP file chooser opened. Selected archive will be validated before replacement confirmation.";
  updateTransfer("ZIP import", "File chooser opened; validation and replacement warning pending.");
  addEvent("ZIP import started", "Native file chooser state represented in import ledger.");
});
$("#renameObject").addEventListener("click", renameObject);
$("#prepareDelete").addEventListener("click", () => {
  if (currentObject().type === "temporary") {
    $("#manageResult").textContent = "Temporary fallback cannot be deleted from Saved Playgrounds. Save it first or reset it from Settings.";
    return;
  }
  $("#deleteConfirm").hidden = false;
});
$("#cancelDelete").addEventListener("click", () => {
  $("#deleteConfirm").hidden = true;
  $("#manageResult").textContent = "Delete canceled. Saved row and active shell unchanged.";
});
$("#confirmDelete").addEventListener("click", deleteObject);
$("#newFile").addEventListener("click", () => {
  $("#fileResult").textContent = "New file created: /wordpress/wp-content/mu-plugins/playground-note.php. Editor marked dirty.";
  addEvent("File created", "New file added in File browser.");
});
$("#newFolder").addEventListener("click", () => {
  $("#fileResult").textContent = "New folder created: /wordpress/wp-content/playground-assets.";
  addEvent("Folder created", "File tree updated with playground-assets.");
});
$("#uploadFiles").addEventListener("click", () => {
  $("#fileResult").textContent = "Upload complete: custom-theme.zip added to /wordpress/wp-content/uploads.";
  updateTransfer("File upload", "custom-theme.zip uploaded through Site Manager.");
});
$("#browseFiles").addEventListener("click", () => {
  $("#fileResult").textContent = "Browse files selected /wordpress/wp-config.php.";
});
$("#saveFile").addEventListener("click", () => {
  $("#fileResult").textContent = "Saved /wordpress/wp-config.php. Editor is clean.";
  addEvent("File saved", "/wordpress/wp-config.php saved from editor.");
});
$("#copyBundle").addEventListener("click", () => updateTransfer("Blueprint bundle link", "Current /blueprint.json link copied."));
$("#downloadBundle").addEventListener("click", () => updateTransfer("Blueprint bundle download", "blueprint.zip generated from current bundle."));
$("#downloadDb").addEventListener("click", () => updateTransfer("Database download", "database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite."));
$("#openAdminer").addEventListener("click", () => addEvent("Adminer opened", "Database inspector opened in a new Playground panel state."));
$("#openPhpMyAdmin").addEventListener("click", () => addEvent("phpMyAdmin opened", "phpMyAdmin opened for the SQLite-backed database."));
$("#exportGithub").addEventListener("click", () => updateTransfer("GitHub export", "Connect account, choose repository, then push files, database, and blueprint metadata."));
$("#downloadZip").addEventListener("click", () => updateTransfer("ZIP download", `${currentObject().title}.zip packaged with files, database, and blueprint.json.`));

selectBlueprint("art");
renderObjects();
updateShell();
