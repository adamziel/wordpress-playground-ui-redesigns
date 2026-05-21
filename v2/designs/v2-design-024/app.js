const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const state = {
  activeTitle: "Unsaved Playground",
  storage: "temporary",
  selectedCategory: "All",
  selectedBlueprint: null,
  activePath: "/hello-from-playground/"
};

const blueprints = [
  {
    name: "Art Gallery",
    categories: ["Featured", "Website", "Personal", "Themes"],
    url: "https://playground.wordpress.net/blueprints/art-gallery.json",
    description: "An art gallery created with the Vueo theme."
  },
  {
    name: "Coffee Shop",
    categories: ["Featured", "Website", "WooCommerce", "Themes"],
    url: "https://playground.wordpress.net/blueprints/coffee-shop.json",
    description: "A stylised WooCommerce coffee shop storefront with custom theme, products, and content."
  },
  {
    name: "Feed Reader with the Friends Plugin",
    categories: ["Featured", "Content", "Gutenberg"],
    url: "https://playground.wordpress.net/blueprints/friends-feed-reader.json",
    description: "A WordPress feed reader using the Friends plugin and social web subscriptions."
  },
  {
    name: "Gaming News",
    categories: ["Featured", "Website", "News", "Themes"],
    url: "https://playground.wordpress.net/blueprints/gaming-news.json",
    description: "A gaming news site created with the Spiel theme."
  },
  {
    name: "Non-profit Organization",
    categories: ["Featured", "Website", "Content"],
    url: "https://playground.wordpress.net/blueprints/non-profit-organization.json",
    description: "A non-profit organization site created with the Koinonia theme."
  },
  {
    name: "Personal Blog",
    categories: ["Website", "Personal", "Themes"],
    url: "https://playground.wordpress.net/blueprints/personal-blog.json",
    description: "A personal blog created with the Substrata theme."
  },
  {
    name: "Block Theme Workshop",
    categories: ["Gutenberg", "Experiments", "Themes"],
    url: "https://playground.wordpress.net/blueprints/block-theme-workshop.json",
    description: "A Gutenberg-focused workshop runtime with sample patterns and theme files."
  },
  {
    name: "Content Migration Lab",
    categories: ["Content", "Experiments"],
    url: "https://playground.wordpress.net/blueprints/content-migration-lab.json",
    description: "A content-heavy Playground for testing imports, media, and database changes."
  }
];

state.selectedBlueprint = blueprints[1];

function addHistory(label, detail) {
  const list = $("#historyList");
  const item = document.createElement("li");
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  item.innerHTML = `<strong>${time}</strong> ${label}: ${detail}`;
  list.prepend(item);
}

function showPanel(id) {
  $$(".mode-tabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.panel === id);
  });
  $$(".panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === id);
  });
}

function setPath(path, source = "Path changed") {
  state.activePath = path;
  $("#pathInput").value = path;
  $("#previewPath").textContent = path;
  $("#pathBadge").textContent = path;
  if (path === "/wp-admin/") {
    $("#pageHeading").textContent = "Dashboard";
    $("#pageBody").textContent = "WordPress admin is open inside the protected Playground shell.";
    $("#previewAction").textContent = "Create a new post";
  } else if (path === "/sample-page/") {
    $("#pageHeading").textContent = "Sample Page";
    $("#pageBody").textContent = "This is the sample page from the active WordPress Playground.";
    $("#previewAction").textContent = "Edit Sample Page";
  } else if (path === "/" && $("#previewTitle").textContent !== "My WordPress Website") {
    $("#pageHeading").textContent = $("#previewTitle").textContent;
    $("#pageBody").textContent = state.selectedBlueprint.description;
    $("#previewAction").textContent = "Open replaced homepage";
  } else {
    $("#pageHeading").textContent = "Hello from WordPress Playground!";
    $("#pageBody").textContent = "This Playground runs client-side in your browser. It is ready for training, plugins, themes, PR reviews, Blueprint runs, exports, and testing.";
    $("#previewAction").textContent = "Discover the mission behind Playground";
  }
  addHistory(source, `preview navigated to ${path}`);
}

function setStorage(type, title, identity) {
  state.storage = type;
  state.activeTitle = title;
  $("#activeTitle").textContent = title;
  $("#saveState").textContent = title;
  $("#rowActiveName").textContent = title;
  $("#replaceTarget").textContent = title;
  $("#identityLine").textContent = identity;
  $("#rowActiveMeta").textContent = identity;

  const badge = $("#storageBadge");
  badge.className = "status";
  if (type === "temporary") {
    badge.textContent = "Temporary";
    badge.classList.add("warning");
    $("#saveWarning").textContent = "Temporary site at risk";
  } else if (type === "local") {
    badge.textContent = "Local directory";
    badge.classList.add("success");
    $("#saveWarning").textContent = "Local folder linked";
  } else {
    badge.textContent = "Saved in browser";
    badge.classList.add("success");
    $("#saveWarning").textContent = "Browser copy saved";
  }
}

function runProgress({ card, bar, text, steps, done }) {
  const cardEl = $(card);
  const barEl = $(bar);
  const textEl = $(text);
  let index = 0;
  cardEl.hidden = false;
  barEl.style.width = "0%";
  textEl.textContent = steps[0].label;

  const timer = window.setInterval(() => {
    index += 1;
    const step = steps[Math.min(index, steps.length - 1)];
    barEl.style.width = step.percent;
    textEl.textContent = step.label;
    if (index >= steps.length - 1) {
      window.clearInterval(timer);
      window.setTimeout(() => {
        cardEl.hidden = true;
        done();
      }, 320);
    }
  }, 360);
}

function renderBlueprints() {
  const query = $("#blueprintSearch").value.trim().toLowerCase();
  const category = state.selectedCategory;
  const filtered = blueprints.filter((blueprint) => {
    const matchesCategory = category === "All" || blueprint.categories.includes(category);
    const matchesQuery = !query || `${blueprint.name} ${blueprint.description} ${blueprint.categories.join(" ")}`.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  const list = $("#blueprintList");
  list.innerHTML = "";
  filtered.forEach((blueprint) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `blueprint-card${blueprint.name === state.selectedBlueprint.name ? " active" : ""}`;
    button.innerHTML = `<strong>${blueprint.name}</strong><span>${blueprint.categories.join(" / ")}</span><span>${blueprint.description}</span>`;
    button.addEventListener("click", () => selectBlueprint(blueprint));
    list.append(button);
  });

  if (!filtered.length) {
    list.innerHTML = '<div class="result">No Blueprint in this representative subset matches the current filter.</div>';
  }
}

function selectBlueprint(blueprint) {
  state.selectedBlueprint = blueprint;
  $("#blueprintName").textContent = blueprint.name;
  $("#blueprintDescription").textContent = blueprint.description;
  $("#blueprintUrl").value = blueprint.url;
  $("#blueprintStatus").textContent = "Selected";
  $("#blueprintStatus").className = "status";
  $("#editorBadge").textContent = "Dirty";
  $("#editorBadge").className = "status warning";
  $("#blueprintEditor").value = `{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "meta": {
    "title": "${blueprint.name}",
    "categories": ${JSON.stringify(blueprint.categories)}
  },
  "landingPage": "/",
  "preferredVersions": { "php": "8.3", "wp": "latest" },
  "steps": [
    { "step": "installTheme", "themeZipFile": "${blueprint.name.toLowerCase().replaceAll(" ", "-")}.zip" },
    { "step": "runPHP", "code": "<?php update_option('blogname', '${blueprint.name}');" }
  ]
}`;
  $("#blueprintResult").textContent = `${blueprint.name} selected. Validate JSON before replacing ${state.activeTitle}.`;
  renderBlueprints();
}

function completeLocalSave() {
  const folder = "/Users/admin/Playgrounds/research-local-directory";
  $("#folderName").value = folder;
  $("#permissionState").textContent = "Folder permission: granted for research-local-directory. Reconnect is required after browser refresh.";
  setStorage("local", "Research Local Directory", `Local folder: ${folder}. Reload consequence: ask permission to reconnect before saving changes.`);
  $("#saveResult").textContent = "Local-directory save complete. Shell badge, active identity, saved row, and reload consequence now point to the selected folder.";
  $("#previewNotice").textContent = "Saved to a local directory. Refresh requires folder permission before reconnecting this Playground.";
  addHistory("Local save complete", `${folder} selected, permission granted, 3751 files copied`);
}

function completeBrowserSave() {
  const name = $("#browserName").value.trim() || "Research Browser Playground";
  setStorage("browser", name, `Browser storage slug: ${name.toLowerCase().replaceAll(" ", "-")}. Survives refresh on this device.`);
  $("#saveResult").textContent = "Browser save complete. The active temporary row is now a browser-backed saved Playground.";
  $("#previewNotice").textContent = "Saved in this browser. This Playground can be reopened from Saved Playgrounds.";
  addHistory("Browser save complete", `${name} saved with browser-backed slug`);
}

function completeBlueprintRun() {
  const blueprint = state.selectedBlueprint;
  $("#replaceWarning").classList.remove("open");
  $("#blueprintStatus").textContent = "Ran";
  $("#blueprintStatus").className = "status success";
  $("#editorBadge").textContent = "Saved";
  $("#editorBadge").className = "status success";
  $("#blueprintResult").textContent = `${blueprint.name} replaced the current WordPress content and moved the preview to /.`;
  $("#previewTitle").textContent = blueprint.name;
  $("#siteName").textContent = blueprint.name;
  $("#pageHeading").textContent = blueprint.name;
  $("#pageBody").textContent = blueprint.description;
  $("#previewNotice").textContent = "Blueprint run complete. Save or export this replaced Playground before closing.";
  $("#previewState").textContent = "Blueprint replacement complete";
  $("#previewSubstate").textContent = `${blueprint.name} ran with validated JSON and database updates.`;
  $("#fileCount").textContent = "3812";
  $("#dbBadge").textContent = "516 KB";
  $("#dbSize").textContent = "516 KB";
  setPath("/", "Blueprint run");
  addHistory("Blueprint replacement", `${blueprint.name} validated, confirmed, and ran against ${state.activeTitle}`);
}

function completeZipDownload() {
  $("#zipResult").textContent = "Generated result: playground-research-local-directory.zip, 18.4 MB. Source: active Playground files, SQLite database, Blueprint bundle, and metadata.";
  addHistory("ZIP download generated", "playground-research-local-directory.zip is ready from the active Playground source");
}

function completeDelete() {
  setStorage("temporary", "Unsaved Playground", "Temporary fallback created after deleting the selected saved entry.");
  $("#deleteBox").hidden = true;
  $("#libraryResult").textContent = "Delete complete. The saved row was removed and the shell fell back to a new Unsaved Playground.";
  $("#previewNotice").textContent = "Active saved entry was deleted. You are now in an Unsaved Playground.";
  addHistory("Delete complete", "selected saved object removed, active shell fell back to Unsaved Playground");
}

renderBlueprints();

$$("[data-panel]").forEach((button) => {
  button.addEventListener("click", () => showPanel(button.dataset.panel));
});

$$("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => showPanel(button.dataset.jump));
});

$$("[data-manager]").forEach((button) => {
  button.addEventListener("click", () => {
    $$("[data-manager]").forEach((tab) => tab.classList.toggle("active", tab === button));
    $$("[data-manager-view]").forEach((view) => {
      view.classList.toggle("active", view.dataset.managerView === button.dataset.manager);
    });
  });
});

$$("[data-path]").forEach((button) => {
  button.addEventListener("click", () => setPath(button.dataset.path, "Preview navigation"));
});

$("#pathInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    setPath(event.currentTarget.value.trim() || "/", "Path input");
  }
});

$("#refreshButton").addEventListener("click", () => {
  $("#previewState").textContent = "Preview refreshed";
  $("#previewSubstate").textContent = `${state.activePath} reloaded without leaving the command console.`;
  addHistory("Refresh", `${state.activePath} reloaded`);
});

$("#homeButton").addEventListener("click", () => setPath("/hello-from-playground/", "Homepage"));
$("#adminButton").addEventListener("click", () => setPath("/wp-admin/", "WP Admin"));

$("#blueprintSearch").addEventListener("input", renderBlueprints);
$("#categoryChips").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;
  state.selectedCategory = button.dataset.category;
  $$("#categoryChips button").forEach((chip) => chip.classList.toggle("active", chip === button));
  renderBlueprints();
});

$("#blueprintEditor").addEventListener("input", () => {
  $("#editorBadge").textContent = "Dirty";
  $("#editorBadge").className = "status warning";
});

$("#validateBlueprint").addEventListener("click", () => {
  try {
    JSON.parse($("#blueprintEditor").value);
    $("#blueprintStatus").textContent = "Validated";
    $("#blueprintStatus").className = "status success";
    $("#editorBadge").textContent = "Valid";
    $("#editorBadge").className = "status success";
    $("#blueprintResult").textContent = "Validation passed. Replacement still requires explicit confirmation.";
    addHistory("Blueprint validation", `${state.selectedBlueprint.name} JSON passed schema-shaped validation`);
  } catch (error) {
    $("#blueprintStatus").textContent = "Invalid";
    $("#blueprintStatus").className = "status danger";
    $("#blueprintResult").textContent = `Validation failed: ${error.message}`;
  }
});

$("#runBlueprint").addEventListener("click", () => {
  $("#replaceWarning").classList.add("open");
  $("#blueprintResult").textContent = "Replacement warning opened. Confirm to mutate files, database, path, preview state, and history.";
});

$("#cancelRun").addEventListener("click", () => {
  $("#replaceWarning").classList.remove("open");
  $("#blueprintResult").textContent = "Blueprint run cancelled. Active Playground was not changed.";
  addHistory("Blueprint cancelled", `${state.selectedBlueprint.name} replacement was cancelled`);
});

$("#confirmRun").addEventListener("click", () => {
  runProgress({
    card: "#blueprintProgress",
    bar: "#blueprintProgressBar",
    text: "#blueprintProgressText",
    steps: [
      { percent: "12%", label: "Validating Blueprint JSON..." },
      { percent: "38%", label: "Preparing replacement filesystem..." },
      { percent: "68%", label: "Applying database and content steps..." },
      { percent: "100%", label: "Reloading preview at new landing page..." }
    ],
    done: completeBlueprintRun
  });
});

$("#runUrlButton").addEventListener("click", () => {
  $("#blueprintResult").textContent = `Blueprint URL queued for validation: ${$("#blueprintUrl").value}`;
  $("#replaceWarning").classList.add("open");
});

$("#copyBlueprint").addEventListener("click", () => {
  $("#blueprintResult").textContent = `Copied Blueprint URL for ${state.selectedBlueprint.name}.`;
  addHistory("Blueprint copy", `${state.selectedBlueprint.name} link copied`);
});

$("#downloadBlueprint").addEventListener("click", () => {
  $("#blueprintResult").textContent = `Downloaded Blueprint bundle for ${state.selectedBlueprint.name}.`;
  addHistory("Blueprint bundle", `${state.selectedBlueprint.name} bundle downloaded`);
});

$("#saveBrowser").addEventListener("click", () => {
  runProgress({
    card: "#saveProgress",
    bar: "#saveProgressBar",
    text: "#saveProgressText",
    steps: [
      { percent: "8%", label: "Preparing browser storage..." },
      { percent: "35%", label: "Saving 1204 / 3751 files..." },
      { percent: "72%", label: "Saving 3028 / 3751 files..." },
      { percent: "100%", label: "Writing saved Playground identity..." }
    ],
    done: completeBrowserSave
  });
});

$("#cancelFolder").addEventListener("click", () => {
  $("#permissionState").textContent = "Folder picker cancelled. Playground remains temporary until another destination is saved.";
  $("#saveResult").textContent = "Local-directory save cancelled. No folder permission was granted and the active shell did not change.";
  addHistory("Local save cancelled", "folder picker closed without permission");
});

$("#chooseFolder").addEventListener("click", () => {
  $("#permissionState").textContent = "Folder picker opened. Waiting for permission to write research-local-directory...";
  runProgress({
    card: "#saveProgress",
    bar: "#saveProgressBar",
    text: "#saveProgressText",
    steps: [
      { percent: "10%", label: "Folder selected: research-local-directory" },
      { percent: "32%", label: "Permission granted. Creating wp-content snapshot..." },
      { percent: "64%", label: "Saving 2390 / 3751 files to local directory..." },
      { percent: "100%", label: "Writing local identity and reload manifest..." }
    ],
    done: completeLocalSave
  });
});

$$("[data-route]").forEach((button) => {
  button.addEventListener("click", () => {
    const route = button.dataset.route;
    $("#launchResult").textContent = `${route} route validated. Starting it would replace the current temporary Playground after confirmation.`;
    addHistory("Create route", `${route} selected with route-specific input constraints`);
  });
});

$("#connectGitHub").addEventListener("click", () => {
  $("#launchResult").textContent = "GitHub connected for this session. Token is not stored after refresh; choose a plugin, theme, or wp-content repository next.";
  addHistory("GitHub import auth", "session account connected, token persistence warning shown");
});

$("#importZip").addEventListener("click", () => {
  $("#launchResult").textContent = "ZIP selected: playground-export.zip. Validation found wp-content and database; replacement confirmation is required before import.";
  addHistory("ZIP import selected", "native chooser returned playground-export.zip with replacement warning");
});

$("#resetSettings").addEventListener("click", () => {
  $("#settingsResult").textContent = state.storage === "temporary"
    ? "Reset warning shown: applying settings will replace files, database, logs, and current path for this Unsaved Playground."
    : "Stored Playground mode: settings will use Save & Reload rather than destructive reset.";
  addHistory("Settings consequence", $("#settingsResult").textContent);
});

$("#fileEditor").addEventListener("input", () => {
  $("#fileStatus").textContent = "Dirty";
  $("#fileStatus").className = "status warning";
});

$("#saveFile").addEventListener("click", () => {
  $("#fileStatus").textContent = "Saved";
  $("#fileStatus").className = "status success";
  addHistory("File saved", "/wordpress/wp-config.php dirty state cleared");
});

[
  ["#newFile", "File action", "New file prompt opened in /wordpress."],
  ["#newFolder", "File action", "New folder prompt opened in /wordpress."],
  ["#uploadFile", "File action", "Upload chooser returned plugin-debug.php."],
  ["#browseFiles", "File action", "Browse files selected /wordpress/wp-config.php."],
  ["#copyBundle", "Blueprint manager", "Current Blueprint link copied from Site Manager."],
  ["#downloadBundle", "Blueprint manager", "Current Blueprint bundle downloaded from Site Manager."],
  ["#downloadDatabase", "Database download", "database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite."],
  ["#openAdminer", "Database tool", "Adminer opened in a new Playground tool panel."],
  ["#openPhpMyAdmin", "Database tool", "phpMyAdmin opened in a new Playground tool panel."],
  ["#githubImport", "GitHub import", "Account connection required before repository import."],
  ["#githubExport", "GitHub export", "Repository picker prepared for active Playground export."],
  ["#exportGitHub", "GitHub export", "Repository picker prepared from Site Manager additional actions."],
  ["#zipImportTransfer", "ZIP import", "Native chooser selected imported-playground.zip; replacement warning required."],
  ["#downloadDbTransfer", "Database download", "database.sqlite generated from transfer panel."]
].forEach(([selector, label, detail]) => {
  $(selector).addEventListener("click", () => {
    const target = selector.includes("Database") ? $("#databaseResult") : $("#zipResult");
    if (selector.includes("downloadDatabase") || selector.includes("openAdminer") || selector.includes("openPhpMyAdmin")) {
      $("#databaseResult").textContent = detail;
    } else if (selector.includes("github") || selector.includes("zip") || selector.includes("downloadDb")) {
      $("#zipResult").textContent = detail;
    }
    addHistory(label, detail);
  });
});

$("#managerRunBlueprint").addEventListener("click", () => {
  showPanel("blueprintPanel");
  $("#replaceWarning").classList.add("open");
  $("#blueprintResult").textContent = "Run requested from Site Manager Blueprint tab. Replacement confirmation is open.";
});

function startZipDownload() {
  showPanel("transferPanel");
  $("#zipResult").textContent = "Source status: active Playground ready. Collecting files, SQLite database, Blueprint bundle, and metadata.";
  runProgress({
    card: "#zipProgress",
    bar: "#zipProgressBar",
    text: "#zipProgressText",
    steps: [
      { percent: "14%", label: "Collecting active Playground files..." },
      { percent: "44%", label: "Adding SQLite database and wp-content..." },
      { percent: "76%", label: "Writing Blueprint bundle metadata..." },
      { percent: "100%", label: "Finalising playground zip download..." }
    ],
    done: completeZipDownload
  });
}

$("#downloadZip").addEventListener("click", startZipDownload);
$("#downloadZipTop").addEventListener("click", startZipDownload);

$("#renameActive").addEventListener("click", () => {
  $("#renameBox").hidden = false;
  $("#renameInput").value = state.activeTitle;
});

$("#cancelRename").addEventListener("click", () => {
  $("#renameBox").hidden = true;
  $("#libraryResult").textContent = "Rename cancelled. Active Playground name did not change.";
});

$("#confirmRename").addEventListener("click", () => {
  const name = $("#renameInput").value.trim() || "Renamed Playground";
  setStorage(state.storage, name, $("#identityLine").textContent.replace(state.activeTitle, name));
  $("#renameBox").hidden = true;
  $("#libraryResult").textContent = `Rename complete. Active shell title and selected saved row now read ${name}.`;
  addHistory("Rename complete", `active Playground renamed to ${name}`);
});

$("#deleteActive").addEventListener("click", () => {
  $("#deleteBox").hidden = false;
  $("#libraryResult").textContent = "Delete confirmation open. Confirming removes the saved row and falls back to Unsaved Playground.";
});

$("#cancelDelete").addEventListener("click", () => {
  $("#deleteBox").hidden = true;
  $("#libraryResult").textContent = "Delete cancelled. Saved row and active shell are unchanged.";
  addHistory("Delete cancelled", `${state.activeTitle} remains active`);
});

$("#confirmDelete").addEventListener("click", completeDelete);
