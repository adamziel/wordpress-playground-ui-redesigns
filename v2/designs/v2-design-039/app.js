const app = document.querySelector(".app");
const toast = document.querySelector("#toast");
const panels = Array.from(document.querySelectorAll(".panel"));
const tabButtons = Array.from(document.querySelectorAll("[data-tab-target]"));
const managerButtons = Array.from(document.querySelectorAll("[data-manager-tab]"));
const managerPanels = Array.from(document.querySelectorAll(".manager-panel"));
const savedList = document.querySelector("#savedList");

const state = {
  activeId: "temp",
  activeTitle: "Unsaved Playground",
  subtitle: "Temporary session, not saved to browser storage or a local directory.",
  storage: "temporary",
  path: "/hello-from-playground/",
  runtime: {
    wp: "latest",
    php: "8.3",
    language: "en_US",
    network: true,
    multisite: false,
    older: false
  },
  route: "vanilla",
  saveDestination: "browser",
  pendingRename: null,
  pendingDelete: null,
  blueprintValidated: false,
  selectedBlueprint: "art"
};

const routeData = {
  vanilla: {
    badge: "Vanilla route",
    title: "Start Vanilla WordPress",
    copy: "Creates a fresh temporary Playground with the current runtime settings. Save before refresh if you want to keep it.",
    label: "Optional path after launch",
    value: "/",
    constraints: ["Uses selected WP/PHP settings", "Temporary until saved", "Existing saved Playgrounds remain in Saved"],
    button: "Start fresh"
  },
  "wp-pr": {
    badge: "WordPress PR route",
    title: "Preview a WordPress PR",
    copy: "Requires a WordPress core PR number or a wordpress-develop pull request URL. The preview remains temporary until saved.",
    label: "PR number or URL",
    value: "7821",
    constraints: ["Core PR only", "Builds WordPress runtime", "Save or export after preview"],
    button: "Preview WordPress PR"
  },
  "gb-pr": {
    badge: "Gutenberg route",
    title: "Preview a Gutenberg PR or branch",
    copy: "Accepts a PR number, GitHub URL, or branch name. Network access is required to fetch the Gutenberg build.",
    label: "PR number, URL, or branch name",
    value: "try/block-bindings-panel",
    constraints: ["Installs Gutenberg plugin build", "Network access required", "Temporary preview identity"],
    button: "Preview branch"
  },
  github: {
    badge: "GitHub import",
    title: "Import from GitHub",
    copy: "Imports public plugins, themes, or wp-content directories after account connection. The access token is not stored after refresh.",
    label: "Repository path",
    value: "WordPress/gutenberg",
    constraints: ["Connect account first", "Token not stored", "Imports plugin, theme, or wp-content"],
    button: "Connect and import"
  },
  "blueprint-url": {
    badge: "Blueprint URL",
    title: "Run Blueprint from URL",
    copy: "Validates a public blueprint.json URL, warns about replacing current content, then runs the Blueprint against the active Playground.",
    label: "Blueprint URL",
    value: "https://playground.wordpress.net/blueprints/art-gallery.json",
    constraints: ["Public JSON URL", "Schema validation", "Replacement warning before run"],
    button: "Open Blueprint runbook"
  },
  zip: {
    badge: "ZIP import",
    title: "Import .zip",
    copy: "Opens the native file chooser, validates the archive, then requires confirmation before replacing files and database.",
    label: "Selected archive",
    value: "playground-export.zip",
    constraints: ["Native file chooser", "Archive validation", "Replaces files and database"],
    button: "Choose .zip"
  }
};

const blueprints = [
  {
    id: "art",
    title: "Art Gallery",
    copy: "An art gallery created with the Vue theme.",
    tag: "Featured",
    categories: ["All", "Featured", "Website", "Personal", "Themes"],
    path: "/art-gallery/",
    thumb: ""
  },
  {
    id: "coffee",
    title: "Coffee Shop",
    copy: "A stylish WooCommerce coffee shop storefront with custom theme, products, and content.",
    tag: "WooCommerce",
    categories: ["All", "Featured", "Website", "WooCommerce", "Themes"],
    path: "/shop/",
    thumb: "coffee"
  },
  {
    id: "feed",
    title: "Feed Reader with the Friends Plugin",
    copy: "A feed reader setup using the Friends plugin and sample subscriptions.",
    tag: "Content",
    categories: ["All", "Featured", "Content", "Experiments"],
    path: "/friends/",
    thumb: "feed"
  },
  {
    id: "news",
    title: "Gaming News",
    copy: "A gaming news site created with the Spiel theme.",
    tag: "News",
    categories: ["All", "Featured", "Website", "News", "Themes"],
    path: "/gaming-news/",
    thumb: "news"
  },
  {
    id: "nonprofit",
    title: "Non-profit Organization",
    copy: "A non-profit organization site created with the Koinonia theme.",
    tag: "Website",
    categories: ["All", "Featured", "Website", "Content"],
    path: "/donate/",
    thumb: "nonprofit"
  },
  {
    id: "blog",
    title: "Personal Blog",
    copy: "A personal blog created with the Substrata theme.",
    tag: "Personal",
    categories: ["All", "Personal", "Website", "Themes"],
    path: "/journal/",
    thumb: "blog"
  }
];

function $(selector) {
  return document.querySelector(selector);
}

function setText(selector, value) {
  const node = $(selector);
  if (node) node.textContent = value;
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}

function storageLabel(storage = state.storage) {
  if (storage === "browser") return "Saved in browser";
  if (storage === "local") return "Local directory";
  if (storage === "preview") return "Preview unsaved";
  return "Temporary";
}

function storageClass(storage = state.storage) {
  if (storage === "browser" || storage === "local") return "badge ok";
  if (storage === "preview") return "badge warn";
  return "badge warn";
}

function storageCopy(storage = state.storage) {
  if (storage === "browser") return "Browser storage on this device. Settings use Save & Reload.";
  if (storage === "local") return "Local folder-backed copy. Reconnect folder permission after reload if prompted.";
  if (storage === "preview") return "Temporary preview. Save before refresh or close.";
  return "Lost on refresh or close until saved.";
}

function actionCopy(storage = state.storage) {
  return storage === "browser" || storage === "local" ? "Save & Reload" : "Apply Settings & Reset Playground";
}

function runtimeLabel() {
  const languageCode = state.runtime.language === "English (United States)" || state.runtime.language === "en_US" ? "en_US" : state.runtime.language;
  const flags = [
    state.runtime.network ? "network on" : "network off",
    state.runtime.multisite ? "multisite" : "single site"
  ].join(", ");
  return `WP ${state.runtime.wp} / PHP ${state.runtime.php} / ${languageCode} / ${flags}`;
}

function addEvent(kind, label, message) {
  const item = document.createElement("li");
  item.innerHTML = `<span class="event ${kind}">${label}</span> ${message}`;
  ["#statusEvents", "#transferEvents"].forEach((selector) => {
    const list = $(selector);
    if (!list) return;
    const clone = item.cloneNode(true);
    list.prepend(clone);
    while (list.children.length > 8) list.lastElementChild.remove();
  });
}

function normalizePath(value) {
  if (!value) return "/";
  return value.startsWith("/") ? value : `/${value}`;
}

function syncShell() {
  app.dataset.storage = state.storage;
  $("#pathInput").value = state.path;
  setText("#previewUrl", `playground.local${state.path}`);
  setText("#activeTitle", state.activeTitle);
  setText("#activeSubtitle", state.subtitle);
  setText("#factTitle", state.activeTitle);
  setText("#factPath", state.path);
  setText("#factSave", storageCopy());
  setText("#factReset", actionCopy());
  setText("#runtimeStorage", storageLabel());
  setText("#runtimeBadge", runtimeLabel());
  setText("#statusStorage", state.storage === "browser" ? "browser saved" : state.storage);
  setText("#shellStorage", storageLabel());
  setText("#saveModeBadge", state.storage === "browser" || state.storage === "local" ? "Settings use Save & Reload" : "Reset discards unsaved work");
  setText("#applySettings", actionCopy());

  $("#shellStorage").className = storageClass();
  $("#statusStorage").className = storageClass();
  $("#saveModeBadge").className = state.storage === "browser" || state.storage === "local" ? "badge ok" : "badge danger";

  const saved = state.storage === "browser" || state.storage === "local";
  $("#settingsWarning").innerHTML = saved
    ? "<strong>Stored reload behavior</strong><span>Settings are written to the saved Playground first, then the runtime reloads in place.</span>"
    : "<strong>Unsaved reset warning</strong><span>Applying settings to this temporary Playground will reset WordPress and discard unsaved content.</span>";

  document.querySelectorAll(".saved-row").forEach((row) => {
    row.classList.toggle("is-active", row.dataset.siteId === state.activeId);
  });
}

function setTab(name) {
  app.dataset.tab = name;
  panels.forEach((panel) => panel.classList.toggle("is-active", panel.id === `tab-${name}`));
  tabButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.tabTarget === name));
}

function setManagerTab(name) {
  managerButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.managerTab === name));
  managerPanels.forEach((panel) => panel.classList.toggle("is-active", panel.id === `manager-${name}`));
}

function runProgress(progressNode, textNode, steps, done) {
  let index = 0;
  progressNode.style.width = "0";
  textNode.textContent = steps[0].text;
  clearInterval(runProgress.timer);
  runProgress.timer = setInterval(() => {
    const step = steps[index];
    progressNode.style.width = `${step.width}%`;
    textNode.textContent = step.text;
    index += 1;
    if (index >= steps.length) {
      clearInterval(runProgress.timer);
      if (done) window.setTimeout(done, 280);
    }
  }, 420);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "playground";
}

function ensureSavedRow(id, title, storage, detail) {
  let row = document.querySelector(`[data-site-id="${id}"]`);
  if (!row) {
    row = document.createElement("article");
    row.className = "saved-row";
    row.dataset.siteId = id;
    row.innerHTML = `
      <div class="row-icon">W</div>
      <div><strong></strong><span></span></div>
      <span class="badge"></span>
      <div class="row-actions">
        <button type="button" data-open-site="${id}">Open</button>
        <button type="button" data-rename-site="${id}">Rename</button>
        <button type="button" class="danger-ghost" data-delete-site="${id}">Delete</button>
      </div>`;
    savedList.append(row);
  }
  row.querySelector("strong").textContent = title;
  row.querySelector("span").textContent = detail;
  const badge = row.querySelector(".badge");
  badge.className = storage === "local" ? "badge ok" : "badge ok";
  badge.textContent = storage;
  row.querySelectorAll("[data-open-site]").forEach((button) => (button.dataset.openSite = id));
  row.querySelectorAll("[data-rename-site]").forEach((button) => (button.dataset.renameSite = id));
  row.querySelectorAll("[data-delete-site]").forEach((button) => (button.dataset.deleteSite = id));
}

function updatePreviewForRoute(title, copy, path, stateLabel = "Preview updated") {
  state.path = normalizePath(path);
  setText("#previewKicker", stateLabel);
  setText("#previewTitle", title);
  setText("#previewCopy", copy);
  setText("#previewNote", state.storage === "browser" || state.storage === "local"
    ? "Saved identity is active. Settings now use Save & Reload."
    : "This preview is unsaved. Save before refresh or close.");
  setText("#previewState", stateLabel);
  syncShell();
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => setTab(button.dataset.tabTarget));
});

managerButtons.forEach((button) => {
  button.addEventListener("click", () => setManagerTab(button.dataset.managerTab));
});

document.querySelector("#pathForm").addEventListener("submit", (event) => {
  event.preventDefault();
  state.path = normalizePath($("#pathInput").value);
  setText("#previewState", "Path changed");
  addEvent("info", "Path", `Navigated active WordPress preview to <code>${state.path}</code>.`);
  syncShell();
});

$("#refreshBtn").addEventListener("click", () => {
  setText("#previewState", "Refreshed");
  addEvent("info", "Shell", `Refreshed active WordPress page at <code>${state.path}</code>.`);
  showToast("Active WordPress page refreshed.");
});

document.querySelectorAll("[data-shell-route]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.shellRoute === "admin") {
      updatePreviewForRoute("WordPress Admin", "Dashboard, posts, plugins, themes, tools, and settings are available in the embedded WordPress admin.", "/wp-admin/", "WP Admin");
      return;
    }
    updatePreviewForRoute("Hello from WordPress Playground!", "This active site is ready for diagnostics, database checks, Blueprint runs, and portability work.", "/hello-from-playground/", "Homepage");
  });
});

document.querySelectorAll("[data-route]").forEach((button) => {
  button.addEventListener("click", () => {
    state.route = button.dataset.route;
    document.querySelectorAll("[data-route]").forEach((card) => card.classList.toggle("is-active", card.dataset.route === state.route));
    const route = routeData[state.route];
    setText("#routeBadge", route.badge);
    setText("#routeTitle", route.title);
    setText("#routeCopy", route.copy);
    setText("#routeLabel", route.label);
    $("#routeInput").value = route.value;
    $("#routeConstraints").innerHTML = route.constraints.map((item) => `<li>${item}</li>`).join("");
    setText("#runRoute", route.button);
    setText("#routeStatus", `${route.title} selected.`);
  });
});

$("#runRoute").addEventListener("click", () => {
  const route = routeData[state.route];
  const input = $("#routeInput").value.trim();

  if (state.route === "blueprint-url") {
    $("#blueprintUrl").value = input;
    setTab("blueprint");
    setText("#blueprintResult", "Blueprint URL loaded. Validate JSON before replacement.");
    addEvent("info", "Route", "Blueprint URL opened in the runbook.");
    return;
  }

  if (state.route === "zip") {
    setText("#routeStatus", "Archive selected. Validate zip and confirm replacement in Transfers.");
    setTab("transfer");
    addEvent("warn", "ZIP", "playground-export.zip selected. Replacement confirmation required before import.");
    return;
  }

  state.activeId = `preview-${Date.now()}`;
  state.storage = state.route === "github" ? "preview" : "temporary";
  const routeTitles = {
    vanilla: "New Vanilla Playground",
    "wp-pr": "WordPress PR Preview Playground",
    "gb-pr": "Gutenberg Branch Preview Playground",
    github: "GitHub Import Playground"
  };
  state.activeTitle = routeTitles[state.route] || "Preview Playground";
  state.subtitle = state.route === "github"
    ? "GitHub account connected for this session. Token will not be stored after refresh."
    : "Temporary preview created from the selected launch route.";
  const path = state.route === "vanilla" ? input : "/wp-admin/";
  updatePreviewForRoute(state.activeTitle, `${route.title} started from ${input || "default settings"}. Save or export to keep the resulting Playground.`, path, "Route started");
  setText("#routeStatus", `${route.title} started. Active object is now unsaved.`);
  addEvent("ok", "Start", `${route.title} started and active shell changed to <code>${state.activeTitle}</code>.`);
});

$("#cancelRoute").addEventListener("click", () => {
  setText("#routeStatus", "Route cancelled. Active Playground unchanged.");
});

document.querySelectorAll("[data-destination]").forEach((button) => {
  button.addEventListener("click", () => {
    state.saveDestination = button.dataset.destination;
    document.querySelectorAll("[data-destination]").forEach((item) => item.classList.toggle("is-active", item === button));
    setText("#saveProgressText", state.saveDestination === "browser"
      ? "Browser storage selected."
      : "Local directory selected. Folder permission will be requested.");
  });
});

$("#savePlayground").addEventListener("click", () => {
  const name = $("#saveName").value.trim() || "Saved Playground";
  const isLocal = state.saveDestination === "local";
  const slug = slugify(name);
  const progress = $("#saveProgress");
  const text = $("#saveProgressText");
  const steps = isLocal
    ? [
        { width: 18, text: "Requesting local folder permission..." },
        { width: 46, text: "Writing 1134 / 3751 files to ~/Sites/support-diagnostics..." },
        { width: 78, text: "Writing database and Blueprint bundle..." },
        { width: 100, text: "Local directory save complete. Reconnect permission may be needed after reload." }
      ]
    : [
        { width: 22, text: "Creating browser storage record..." },
        { width: 52, text: "Saving 1880 / 3751 files..." },
        { width: 84, text: "Saving database and runtime metadata..." },
        { width: 100, text: "Browser save complete. Saved row and shell slug updated." }
      ];

  runProgress(progress, text, steps, () => {
    state.activeId = isLocal ? "support-local" : "support-browser";
    state.activeTitle = name;
    state.storage = isLocal ? "local" : "browser";
    state.subtitle = isLocal
      ? "Saved to local directory: ~/Sites/support-diagnostics. Reconnect permission after reload if prompted."
      : `Browser-backed slug: ${slug}.`;
    ensureSavedRow(
      state.activeId,
      name,
      isLocal ? "local" : "browser",
      isLocal ? "Folder: ~/Sites/support-diagnostics. Permission may be needed after reload." : `Created May 21, 2026. Slug: ${slug}.`
    );
    setText("#saveResult", isLocal ? "Saved to local directory with folder identity." : "Saved in this browser with a restorable slug.");
    addEvent("ok", "Saved", `${name} saved to ${isLocal ? "a local directory" : "browser storage"} and selected.`);
    syncShell();
    showToast("Playground saved.");
  });
});

$("#cancelSave").addEventListener("click", () => {
  setText("#saveResult", "Save cancelled. Temporary state unchanged.");
});

$("#applySettings").addEventListener("click", () => {
  const saved = state.storage === "browser" || state.storage === "local";
  $("#settingsConfirm").hidden = false;
  setText("#settingsConfirmTitle", saved ? "Confirm Save & Reload" : "Confirm destructive reset");
  setText("#settingsConfirmCopy", saved
    ? "Settings will be saved to the current Playground identity, then the runtime will reload."
    : "This temporary Playground will reset and unsaved content will be discarded.");
  $("#confirmSettings").className = saved ? "primary" : "danger";
  setText("#confirmSettings", saved ? "Save & Reload" : "Apply Settings & Reset Playground");
});

$("#cancelSettings").addEventListener("click", () => {
  $("#settingsConfirm").hidden = true;
  setText("#settingsResult", "Settings change cancelled.");
});

$("#confirmSettings").addEventListener("click", () => {
  state.runtime.wp = $("#wpVersion").value;
  state.runtime.php = $("#phpVersion").value;
  state.runtime.language = $("#language").value;
  state.runtime.network = $("#networkAccess").checked;
  state.runtime.multisite = $("#multisite").checked;
  state.runtime.older = $("#olderVersions").checked;
  const saved = state.storage === "browser" || state.storage === "local";
  const steps = saved
    ? [
        { width: 20, text: "Saving settings to stored Playground identity..." },
        { width: 54, text: "Reloading WordPress runtime..." },
        { width: 82, text: "Reconnecting database and files..." },
        { width: 100, text: `Runtime reloaded: ${runtimeLabel()}.` }
      ]
    : [
        { width: 24, text: "Resetting unsaved WordPress files and database..." },
        { width: 58, text: "Applying runtime settings..." },
        { width: 86, text: "Preparing fresh temporary Playground..." },
        { width: 100, text: `Temporary Playground reset: ${runtimeLabel()}.` }
      ];
  runProgress($("#settingsProgress"), $("#settingsResult"), steps, () => {
    $("#settingsConfirm").hidden = true;
    setText("#previewState", saved ? "Saved runtime reloaded" : "Temporary runtime reset");
    setText("#previewNote", saved
      ? "Runtime settings were saved first, then reloaded without changing the saved identity."
      : "The unsaved Playground was reset with the selected runtime settings.");
    addEvent(saved ? "ok" : "warn", saved ? "Reload" : "Reset", `${saved ? "Save & Reload finished" : "Unsaved reset finished"} with <code>${runtimeLabel()}</code>.`);
    syncShell();
  });
});

$("#fileEditor").addEventListener("input", () => {
  $("#fileStatus").className = "badge warn";
  setText("#fileStatus", "dirty");
});

$("#saveFile").addEventListener("click", () => {
  $("#fileStatus").className = "badge ok";
  setText("#fileStatus", "saved");
  addEvent("ok", "File", "Saved edits to <code>/wordpress/wp-config.php</code>.");
  showToast("File saved.");
});

$("#newFile").addEventListener("click", () => {
  setText("#fileName", "/wordpress/wp-content/debug-note.php");
  $("#fileEditor").value = "<?php\n// New support note file.\n";
  $("#fileStatus").className = "badge warn";
  setText("#fileStatus", "new unsaved");
  addEvent("info", "File", "Created new file draft <code>/wordpress/wp-content/debug-note.php</code>.");
});

$("#newFolder").addEventListener("click", () => {
  addEvent("info", "Folder", "Created folder draft <code>/wordpress/wp-content/support</code>.");
  showToast("New folder staged.");
});

$("#uploadFile").addEventListener("click", () => {
  addEvent("ok", "Upload", "Uploaded <code>support-plugin.zip</code> into <code>/wordpress/wp-content/uploads</code>.");
  showToast("Upload finished.");
});

$("#browseFiles").addEventListener("click", () => {
  addEvent("info", "Browse", "Native file browser opened for WordPress files.");
});

["downloadDb", "openAdminer", "openPhpMyAdmin", "copyBlueprint", "downloadBlueprint"].forEach((id) => {
  const node = $(`#${id}`);
  if (!node) return;
  node.addEventListener("click", () => {
    const labels = {
      downloadDb: "Downloaded database.sqlite from /wordpress/wp-content/database/.ht.sqlite.",
      openAdminer: "Opened Adminer for the SQLite-backed database.",
      openPhpMyAdmin: "Opened phpMyAdmin for the SQLite-backed database.",
      copyBlueprint: "Copied current Blueprint link.",
      downloadBlueprint: "Downloaded current Blueprint bundle."
    };
    addEvent("ok", "Tool", labels[id]);
    showToast(labels[id]);
  });
});

function renderBlueprintCards() {
  const search = $("#blueprintSearch").value.trim().toLowerCase();
  const category = $("#blueprintCategory").value;
  const filtered = blueprints.filter((item) => {
    const matchesSearch = !search || `${item.title} ${item.copy}`.toLowerCase().includes(search);
    const matchesCategory = category === "All" || item.categories.includes(category);
    return matchesSearch && matchesCategory;
  });
  $("#shownCount").textContent = filtered.length;
  $("#blueprintCards").innerHTML = filtered.map((item) => `
    <button type="button" class="blueprint-card ${item.id === state.selectedBlueprint ? "is-active" : ""}" data-blueprint-id="${item.id}">
      <span class="thumb ${item.thumb}" aria-hidden="true"></span>
      <span><strong>${item.title}</strong><span>${item.copy}</span></span>
    </button>
  `).join("");
}

function selectBlueprint(id) {
  const item = blueprints.find((blueprint) => blueprint.id === id) || blueprints[0];
  state.selectedBlueprint = item.id;
  state.blueprintValidated = false;
  setText("#selectedBlueprintTag", item.tag);
  setText("#selectedBlueprintTitle", item.title);
  setText("#selectedBlueprintCopy", item.copy);
  $("#blueprintUrl").value = `https://playground.wordpress.net/blueprints/${slugify(item.title)}.json`;
  $("#blueprintEditor").value = JSON.stringify({
    $schema: "https://playground.wordpress.net/blueprint-schema.json",
    meta: {
      title: item.title,
      categories: item.categories.filter((category) => category !== "All")
    },
    landingPage: item.path,
    steps: [
      { step: "login" },
      { step: "installTheme", themeZipFile: `https://example.com/${slugify(item.title)}.zip` }
    ]
  }, null, 2);
  $("#blueprintStep").className = "badge warn";
  setText("#blueprintStep", "not validated");
  $("#blueprintDirty").className = "badge neutral";
  setText("#blueprintDirty", "clean");
  setText("#blueprintProgressText", "Blueprint selected. Inspect JSON, then validate before running.");
  $("#blueprintProgress").style.width = "0";
  renderBlueprintCards();
}

$("#blueprintSearch").addEventListener("input", renderBlueprintCards);
$("#blueprintCategory").addEventListener("change", renderBlueprintCards);
$("#blueprintCards").addEventListener("click", (event) => {
  const card = event.target.closest("[data-blueprint-id]");
  if (!card) return;
  selectBlueprint(card.dataset.blueprintId);
});

$("#blueprintEditor").addEventListener("input", () => {
  state.blueprintValidated = false;
  $("#blueprintStep").className = "badge warn";
  setText("#blueprintStep", "edited");
  $("#blueprintDirty").className = "badge warn";
  setText("#blueprintDirty", "dirty");
});

$("#validateBlueprint").addEventListener("click", () => {
  try {
    const parsed = JSON.parse($("#blueprintEditor").value);
    if (!parsed.steps || !Array.isArray(parsed.steps)) throw new Error("steps must be an array");
    state.blueprintValidated = true;
    $("#blueprintStep").className = "badge ok";
    setText("#blueprintStep", "validated");
    $("#blueprintDirty").className = "badge ok";
    setText("#blueprintDirty", "valid");
    setText("#blueprintResult", "Blueprint JSON validates. Replacement warning is required before run.");
    setText("#blueprintProgressText", "Schema and required steps validated.");
    addEvent("ok", "Blueprint", "Blueprint JSON validated.");
  } catch (error) {
    state.blueprintValidated = false;
    $("#blueprintStep").className = "badge danger";
    setText("#blueprintStep", "invalid");
    setText("#blueprintResult", `Validation failed: ${error.message}.`);
    addEvent("warn", "Blueprint", `Validation failed: ${error.message}.`);
  }
});

$("#runBlueprint").addEventListener("click", () => {
  if (!state.blueprintValidated) {
    $("#validateBlueprint").click();
    if (!state.blueprintValidated) return;
  }
  $("#blueprintConfirm").hidden = false;
  setText("#blueprintResult", "Replacement warning shown. Confirm to run against current Playground.");
});

$("#cancelBlueprint").addEventListener("click", () => {
  $("#blueprintConfirm").hidden = true;
  setText("#blueprintResult", "Blueprint run cancelled. Active Playground unchanged.");
});

$("#confirmBlueprint").addEventListener("click", () => {
  const item = blueprints.find((blueprint) => blueprint.id === state.selectedBlueprint) || blueprints[0];
  const progress = $("#blueprintProgress");
  const text = $("#blueprintProgressText");
  runProgress(progress, text, [
    { width: 18, text: "Snapshotting current files and database before replacement..." },
    { width: 42, text: "Applying Blueprint steps and downloading assets..." },
    { width: 68, text: "Replacing content, theme, and landing page..." },
    { width: 88, text: "Reloading WordPress preview..." },
    { width: 100, text: `${item.title} Blueprint run complete. Preview replaced.` }
  ], () => {
    $("#blueprintConfirm").hidden = true;
    state.path = item.path;
    state.activeTitle = `${item.title} Playground`;
    state.subtitle = state.storage === "temporary"
      ? "Temporary Playground replaced by Blueprint output. Save before refresh or close."
      : `${storageLabel()} Playground replaced by Blueprint output.`;
    setText("#previewTitle", item.title);
    setText("#previewCopy", `${item.copy} The Blueprint replacement finished and the live preview moved to ${item.path}.`);
    setText("#previewKicker", "Blueprint result");
    setText("#previewNote", "Blueprint run changed the active files, database content, theme, and landing page.");
    setText("#previewState", "Blueprint applied");
    setText("#statusBlueprint", `${item.title} completed and replaced current content.`);
    setText("#blueprintResult", `${item.title} replaced the active Playground and updated the preview.`);
    addEvent("warn", "Replace", `${item.title} Blueprint replaced current content and moved preview to <code>${item.path}</code>.`);
    syncShell();
    showToast("Blueprint run complete.");
  });
});

$("#copyRunBlueprint").addEventListener("click", () => {
  addEvent("ok", "Blueprint", "Copied selected Blueprint JSON.");
  showToast("Blueprint JSON copied.");
});

$("#downloadRunBlueprint").addEventListener("click", () => {
  addEvent("ok", "Blueprint", "Downloaded selected Blueprint bundle.");
  showToast("Blueprint bundle downloaded.");
});

savedList.addEventListener("click", (event) => {
  const open = event.target.closest("[data-open-site]");
  const rename = event.target.closest("[data-rename-site]");
  const del = event.target.closest("[data-delete-site]");

  if (open) {
    const id = open.dataset.openSite;
    const row = document.querySelector(`[data-site-id="${id}"]`);
    state.activeId = id;
    state.activeTitle = row.querySelector("strong").textContent;
    if (id === "temp") {
      state.storage = "temporary";
      state.subtitle = "Temporary session, not saved to browser storage or a local directory.";
    } else if (id === "local" || id === "support-local") {
      state.storage = "local";
      state.subtitle = "Local directory-backed Playground. Reconnect permission after reload if prompted.";
    } else {
      state.storage = "browser";
      state.subtitle = `Browser-backed slug: ${slugify(state.activeTitle)}.`;
    }
    setText("#libraryResult", `${state.activeTitle} opened in the live shell.`);
    addEvent("info", "Open", `${state.activeTitle} opened from Saved Playgrounds.`);
    syncShell();
  }

  if (rename) {
    state.pendingRename = rename.dataset.renameSite;
    const row = document.querySelector(`[data-site-id="${state.pendingRename}"]`);
    $("#renameInput").value = row.querySelector("strong").textContent;
    $("#renameBox").hidden = false;
    $("#deleteBox").hidden = true;
  }

  if (del) {
    state.pendingDelete = del.dataset.deleteSite;
    const row = document.querySelector(`[data-site-id="${state.pendingDelete}"]`);
    setText("#deleteCopy", `Delete "${row.querySelector("strong").textContent}" from saved Playgrounds? This cannot be restored from browser storage.`);
    $("#deleteBox").hidden = false;
    $("#renameBox").hidden = true;
  }
});

$("#confirmRename").addEventListener("click", () => {
  if (!state.pendingRename) return;
  const row = document.querySelector(`[data-site-id="${state.pendingRename}"]`);
  const name = $("#renameInput").value.trim() || "Renamed Playground";
  row.querySelector("strong").textContent = name;
  if (state.activeId === state.pendingRename) {
    state.activeTitle = name;
    state.subtitle = state.storage === "browser" ? `Browser-backed slug: ${slugify(name)}.` : state.subtitle;
  }
  $("#renameBox").hidden = true;
  setText("#libraryResult", `Renamed saved Playground to ${name}.`);
  addEvent("ok", "Rename", `Saved Playground renamed to <code>${name}</code>.`);
  syncShell();
});

$("#cancelRename").addEventListener("click", () => {
  $("#renameBox").hidden = true;
  state.pendingRename = null;
});

$("#confirmDelete").addEventListener("click", () => {
  if (!state.pendingDelete) return;
  const row = document.querySelector(`[data-site-id="${state.pendingDelete}"]`);
  const name = row.querySelector("strong").textContent;
  row.remove();
  if (state.activeId === state.pendingDelete) {
    state.activeId = "temp";
    state.activeTitle = "Unsaved Playground";
    state.storage = "temporary";
    state.subtitle = "Temporary session selected after deleting the saved copy.";
    updatePreviewForRoute("Hello from WordPress Playground!", "Saved copy deleted. The shell is now attached to the unsaved Playground entry.", "/hello-from-playground/", "Unsaved fallback");
  }
  $("#deleteBox").hidden = true;
  setText("#libraryResult", `${name} deleted. Saved list and active shell updated.`);
  addEvent("danger", "Delete", `${name} deleted from Saved Playgrounds.`);
  syncShell();
});

$("#cancelDelete").addEventListener("click", () => {
  $("#deleteBox").hidden = true;
  state.pendingDelete = null;
});

$("#clearDone").addEventListener("click", () => {
  $("#statusEvents").innerHTML = '<li><span class="event info">Ready</span> Resolved history cleared for this view.</li>';
});

const transferActions = {
  githubImport: ["ok", "GitHub", "GitHub account connected and WordPress/gutenberg import staged. Token will not be stored after refresh."],
  githubExport: ["ok", "Export", "Exported current Playground to GitHub branch support-diagnostics-export."],
  zipImport: ["warn", "ZIP", "playground-export.zip validated. Replacement warning required before import."],
  zipDownload: ["ok", "ZIP", "Downloaded current Playground as playground-export.zip."],
  transferDb: ["ok", "DB", "Downloaded database.sqlite from /wordpress/wp-content/database/.ht.sqlite."],
  transferBlueprint: ["ok", "Bundle", "Downloaded current Blueprint bundle."]
};

Object.entries(transferActions).forEach(([id, [kind, label, message]]) => {
  const node = $(`#${id}`);
  if (!node) return;
  node.addEventListener("click", () => {
    setText("#transferResult", message);
    addEvent(kind, label, message);
    showToast(message);
  });
});

renderBlueprintCards();
selectBlueprint("art");
syncShell();
