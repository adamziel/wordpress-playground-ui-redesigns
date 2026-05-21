const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const blueprints = [
  {
    title: "Coffee Shop",
    description: "WooCommerce storefront with custom theme, products, and content.",
    categories: ["WooCommerce", "Website"],
    url: "https://playground.wordpress.net/blueprints/coffee-shop.json",
    landing: "/",
    headline: "Home",
    body: "A stylized WooCommerce coffee shop storefront with product grids, checkout paths, and a custom homepage.",
    button: "Find your brew"
  },
  {
    title: "Art Gallery",
    description: "An art gallery created with the Vueo theme.",
    categories: ["Website", "Personal"],
    url: "https://playground.wordpress.net/blueprints/art-gallery.json",
    landing: "/",
    headline: "Art Gallery",
    body: "A gallery site with artwork archives, exhibition pages, and editorial image layouts.",
    button: "View exhibitions"
  },
  {
    title: "Feed Reader with the Friends Plugin",
    description: "Read feeds from the web in Playground by using the Friends plugin.",
    categories: ["Content", "Experiments"],
    url: "https://playground.wordpress.net/blueprints/friends-feed-reader.json",
    landing: "/wp-admin/admin.php?page=friends",
    headline: "Welcome to the Friends Plugin",
    body: "A WordPress admin workflow for subscribing to feeds, reading updates, and testing social web behavior.",
    button: "Open feed reader"
  },
  {
    title: "Gaming News",
    description: "A gaming news site created with the Spiel theme.",
    categories: ["Website", "News"],
    url: "https://playground.wordpress.net/blueprints/gaming-news.json",
    landing: "/",
    headline: "SPIEL",
    body: "A news homepage with featured reviews, guides, and game coverage organized for fast scanning.",
    button: "Read latest"
  },
  {
    title: "Non-profit Organization",
    description: "A non-profit organization site created with the Koinonia theme.",
    categories: ["Website", "Content"],
    url: "https://playground.wordpress.net/blueprints/non-profit.json",
    landing: "/",
    headline: "Volunteer for Good",
    body: "A campaign site with donation, volunteer, and mission content for a community organization.",
    button: "Donate"
  },
  {
    title: "Personal Blog",
    description: "A personal blog created with the Substrata theme.",
    categories: ["Website", "Personal"],
    url: "https://playground.wordpress.net/blueprints/personal-blog.json",
    landing: "/",
    headline: "Eleni Martinos",
    body: "A personal publishing site with long-form articles, archives, and a minimal editorial home.",
    button: "Read journal"
  }
];

const state = {
  title: "Unsaved Playground",
  saved: false,
  local: false,
  path: "/hello-from-playground/",
  slug: "",
  selectedBlueprint: blueprints[0],
  filter: "All",
  dbSize: "452 KB",
  eventCount: 2
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "saved-playground";
}

function timeNow() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function addEvent(title, detail, tone = "") {
  const item = document.createElement("li");
  if (tone) item.className = tone;
  item.innerHTML = `<span>${timeNow()}</span><strong>${escapeHtml(title)}</strong><p>${escapeHtml(detail)}</p>`;
  $("#eventStream").prepend(item);
  state.eventCount += 1;
  $("#transferStrip").textContent = title;
  $("#transferStrip").nextElementSibling.textContent = detail;
}

function activateTab(name) {
  $$(".tabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tabTarget === name);
  });
  $$(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.tabPanel === name);
  });
}

function activateManager(name) {
  $$(".manager-tabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.managerTarget === name);
  });
  $$(".manager-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.managerPanel === name);
  });
}

function updateObjectView() {
  $("#activeTitle").textContent = state.title;
  $("#previewTitle").textContent = state.title === "Unsaved Playground" ? "My WordPress Website" : state.title;
  $("#shellMode").textContent = state.saved ? "Saved support session" : state.local ? "Local directory session" : "Temporary support session";
  $("#pathInput").value = state.path;
  $("#previewBadge").textContent = state.path;
  $("#pageLabel").textContent = state.path;
  $("#confirmTarget").textContent = state.title;

  if (state.local) {
    $("#storageBadge").textContent = "Local directory";
    $("#storageBadge").className = "chip success";
    $("#storageValue").textContent = "Local directory sync";
    $("#identityValue").textContent = $("#localFolder").value;
    $("#activeSubtitle").textContent = "Saved to a folder. Browser reload requires folder permission.";
    $("#resetValue").textContent = "Save & Reload";
    $("#resetValue").className = "";
    $("#settingsAction").textContent = "Save & Reload";
    $("#settingsConsequence").textContent = "Stored local reload consequence";
    $("#settingsConsequenceText").textContent = "The local-directory Playground reloads after saving settings. Reopen may require folder permission.";
    $("#managerState").textContent = "Local controls";
    $("#previewRisk").textContent = "Reload keeps folder-backed identity";
  } else if (state.saved) {
    $("#storageBadge").textContent = "Saved Playground";
    $("#storageBadge").className = "chip success";
    $("#storageValue").textContent = "Browser storage";
    $("#identityValue").textContent = `browser: ${state.slug}`;
    $("#activeSubtitle").textContent = "Saved in this browser a moment ago.";
    $("#resetValue").textContent = "Save & Reload";
    $("#settingsAction").textContent = "Save & Reload";
    $("#settingsConsequence").textContent = "Stored browser reload consequence";
    $("#settingsConsequenceText").textContent = "The saved Playground reloads with new settings while preserving its browser-backed identity.";
    $("#managerState").textContent = "Saved controls";
    $("#previewRisk").textContent = "Reload keeps browser-backed identity";
  } else {
    $("#storageBadge").textContent = "Unsaved Playground";
    $("#storageBadge").className = "chip warning";
    $("#storageValue").textContent = "Temporary memory";
    $("#identityValue").textContent = "none yet";
    $("#activeSubtitle").textContent = "Temporary runtime, not stored in browser storage.";
    $("#resetValue").textContent = "Apply Settings & Reset";
    $("#settingsAction").textContent = "Apply Settings & Reset";
    $("#settingsConsequence").textContent = "Temporary reset consequence";
    $("#settingsConsequenceText").textContent = "Applying settings now resets the unsaved Playground and replaces files, database, and path state.";
    $("#managerState").textContent = "Unsaved controls";
    $("#previewRisk").textContent = "Reset would replace current content";
  }
}

function addSavedRow(kind) {
  const existing = $(`.saved-row[data-slug="${state.slug}"]`);
  if (existing) existing.remove();
  $$(".saved-row").forEach((row) => row.classList.remove("active"));

  const row = document.createElement("article");
  row.className = "saved-row active";
  row.dataset.kind = kind;
  row.dataset.slug = state.slug || slugify(state.title);
  const kindLabel = kind === "local" ? "Local directory, reconnect required after refresh" : "Saved in browser storage";
  row.innerHTML = `
    <span class="wp-mark small">W</span>
    <div>
      <strong>${escapeHtml(state.title)}</strong>
      <span>${escapeHtml(kindLabel)}</span>
    </div>
    <button class="small-button" type="button">Manage</button>
  `;
  $("#savedList").prepend(row);
  $("#libraryCount").textContent = `${$$("#savedList .saved-row").length} objects`;
}

function updateSavedRowTitle() {
  const row = $(`.saved-row[data-slug="${state.slug}"]`);
  if (row) {
    row.querySelector("strong").textContent = state.title;
  }
}

function runProgress({ card, bar, text, count, steps, done }) {
  const progressCard = $(card);
  const progressBar = $(bar);
  const progressText = $(text);
  const progressCount = $(count);
  progressCard.hidden = false;
  progressBar.style.inlineSize = "0%";

  let index = 0;
  const tick = () => {
    const step = steps[index];
    progressText.textContent = step.text;
    progressCount.textContent = step.count;
    progressBar.style.inlineSize = step.percent + "%";
    index += 1;
    if (index >= steps.length) {
      window.setTimeout(() => {
        progressCard.hidden = true;
        done();
      }, 300);
      return;
    }
    window.setTimeout(tick, 420);
  };
  tick();
}

function saveBrowser() {
  const name = $("#saveName").value.trim() || "Saved Playground";
  state.title = name;
  state.slug = slugify(name);
  $("#saveBrowser").disabled = true;
  $("#saveFlowState").textContent = "Copying files";
  addEvent("Browser save started", `${name} is copying files into browser storage.`, "warning");
  runProgress({
    card: "#saveProgress",
    bar: "#saveProgressBar",
    text: "#saveProgressText",
    count: "#saveProgressCount",
    steps: [
      { text: "Scanning WordPress files", count: "214 / 3751", percent: 8 },
      { text: "Copying wp-admin and wp-includes", count: "1288 / 3751", percent: 34 },
      { text: "Copying uploads and database", count: "2430 / 3751", percent: 65 },
      { text: "Writing browser storage manifest", count: "3520 / 3751", percent: 91 },
      { text: "Saved in this browser", count: "3751 / 3751", percent: 100 }
    ],
    done: () => {
      state.saved = true;
      state.local = false;
      updateObjectView();
      addSavedRow("browser");
      $("#saveFlowState").textContent = "Saved";
      $("#saveFlowState").className = "chip success";
      $("#saveResult").innerHTML = "<strong>Browser save completed</strong><span>The active shell title, storage badge, saved row, reset action, and transfer history now point to the saved browser-backed Playground.</span>";
      $("#siteNote").textContent = "You are logged in as admin. This Playground is saved in this browser and can use Save & Reload.";
      $("#previewValue").textContent = "Saved homepage loaded";
      $("#transferStrip").textContent = "Saved browser snapshot";
      $("#transferStrip").nextElementSibling.textContent = `browser: ${state.slug}`;
      addEvent("Browser save completed", `${name} inserted into Saved Playgrounds with slug ${state.slug}. Reset action changed to Save & Reload.`, "success");
      $("#saveBrowser").disabled = false;
    }
  });
}

function saveLocal() {
  const name = $("#saveName").value.trim() || "Local Directory Playground";
  state.title = name;
  state.slug = slugify(name);
  $("#saveLocal").disabled = true;
  $("#saveFlowState").textContent = "Folder permission granted";
  addEvent("Local directory save started", `Folder picker granted ${$("#localFolder").value}.`, "warning");
  runProgress({
    card: "#saveProgress",
    bar: "#saveProgressBar",
    text: "#saveProgressText",
    count: "#saveProgressCount",
    steps: [
      { text: "Preparing local file handles", count: "permission granted", percent: 18 },
      { text: "Syncing WordPress files", count: "1880 / 3751", percent: 48 },
      { text: "Writing SQLite database", count: "database.sqlite", percent: 78 },
      { text: "Saved to local directory", count: "3751 / 3751", percent: 100 }
    ],
    done: () => {
      state.saved = false;
      state.local = true;
      updateObjectView();
      addSavedRow("local");
      $("#saveFlowState").textContent = "Saved locally";
      $("#saveFlowState").className = "chip success";
      $("#saveResult").innerHTML = "<strong>Local save completed</strong><span>The active object is folder-backed. On reload, Playground must ask for permission to reconnect this directory.</span>";
      $("#saveLocal").disabled = false;
      addEvent("Local directory save completed", `${name} is synced to ${$("#localFolder").value}; reconnect permission is required after refresh.`, "success");
    }
  });
}

function renderBlueprints() {
  const query = $("#blueprintSearch").value.trim().toLowerCase();
  const filtered = blueprints.filter((blueprint) => {
    const categoryMatch = state.filter === "All" || blueprint.categories.includes(state.filter);
    const queryMatch = !query || blueprint.title.toLowerCase().includes(query) || blueprint.description.toLowerCase().includes(query);
    return categoryMatch && queryMatch;
  });
  const list = $("#blueprintList");
  list.innerHTML = "";
  filtered.forEach((blueprint) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "blueprint-item";
    if (blueprint.title === state.selectedBlueprint.title) item.classList.add("active");
    item.innerHTML = `
      <span>
        <strong>${escapeHtml(blueprint.title)}</strong><br>
        ${escapeHtml(blueprint.description)}
      </span>
      <span>${escapeHtml(blueprint.categories.join(", "))}</span>
    `;
    item.addEventListener("click", () => selectBlueprint(blueprint));
    list.appendChild(item);
  });
  if (!filtered.length) {
    list.innerHTML = '<div class="result-card"><strong>No matching Blueprints</strong><span>Adjust the category or search query. The full current gallery contains 43 Blueprints.</span></div>';
  }
}

function selectBlueprint(blueprint) {
  state.selectedBlueprint = blueprint;
  $("#selectedBlueprintTitle").textContent = blueprint.title;
  $("#blueprintUrl").value = blueprint.url;
  $("#jsonDirty").textContent = "Dirty JSON";
  $("#jsonDirty").className = "chip warning";
  $("#blueprintState").textContent = "Draft";
  $("#blueprintState").className = "chip warning";
  $("#blueprintJson").textContent = JSON.stringify({
    $schema: "https://playground.wordpress.net/blueprint-schema.json",
    meta: { title: blueprint.title, categories: blueprint.categories },
    landingPage: blueprint.landing,
    steps: [
      { step: "installTheme", themeZipFile: { resource: "wordpress.org/themes", slug: "twentytwentyfour" } },
      { step: "runPHP", code: "<?php // seed demo content ?>" }
    ]
  }, null, 2);
  renderBlueprints();
}

function validateBlueprint() {
  $("#jsonDirty").textContent = "Valid JSON";
  $("#jsonDirty").className = "chip success";
  $("#blueprintState").textContent = "Validated";
  $("#blueprintState").className = "chip success";
  addEvent("Blueprint validated", `${state.selectedBlueprint.title} JSON schema and landing page are valid.`, "success");
}

function runBlueprint() {
  $("#blueprintConfirm").hidden = true;
  const selected = state.selectedBlueprint;
  $("#blueprintState").textContent = "Running";
  $("#blueprintState").className = "chip warning";
  addEvent("Blueprint replacement confirmed", `${selected.title} will replace current WordPress files, database content, and homepage state.`, "warning");
  runProgress({
    card: "#blueprintProgress",
    bar: "#blueprintProgressBar",
    text: "#blueprintProgressText",
    count: "#blueprintProgressCount",
    steps: [
      { text: "Resolving Blueprint resources", count: "18%", percent: 18 },
      { text: "Installing theme and plugins", count: "41%", percent: 41 },
      { text: "Replacing database content", count: "68%", percent: 68 },
      { text: "Reloading WordPress preview", count: "92%", percent: 92 },
      { text: "Blueprint run complete", count: "100%", percent: 100 }
    ],
    done: () => {
      state.path = selected.landing;
      state.dbSize = selected.title === "Coffee Shop" ? "1.8 MB" : "734 KB";
      updateObjectView();
      $("#siteHeadline").textContent = selected.headline;
      $("#siteBody").textContent = selected.body;
      $("#siteButton").textContent = selected.button;
      $("#siteNote").textContent = `Blueprint result: ${selected.title} replaced the current content and reloaded the live preview.`;
      $("#previewValue").textContent = `${selected.title} applied`;
      $("#previewTitle").textContent = selected.title;
      $("#siteHeaderName").textContent = selected.title;
      $("#databaseSize").textContent = state.dbSize;
      $("#dbStrip").textContent = `SQLite .ht.sqlite - ${state.dbSize}`;
      $("#blueprintState").textContent = "Applied";
      $("#blueprintState").className = "chip success";
      $("#previewRisk").textContent = "Blueprint replacement completed";
      addEvent("Blueprint run completed", `${selected.title} applied. Path changed to ${selected.landing}; database size is now ${state.dbSize}.`, "success");
    }
  });
}

function resetToUnsaved(reason) {
  state.title = "Unsaved Playground";
  state.saved = false;
  state.local = false;
  state.slug = "";
  state.path = "/hello-from-playground/";
  state.dbSize = "452 KB";
  $("#siteHeadline").innerHTML = "Hello from <span>WordPress Playground!</span>";
  $("#siteBody").textContent = "This is Playground, a WordPress that runs client-side in your browser. It is ready for training, plugin testing, theme demos, PR previews, and support investigations.";
  $("#siteButton").textContent = "Discover the mission behind Playground";
  $("#siteNote").textContent = "You are logged in as admin. Save before refreshing to keep this temporary site.";
  $("#siteHeaderName").textContent = "My WordPress Website";
  $("#previewValue").textContent = "Homepage loaded";
  $("#databaseSize").textContent = state.dbSize;
  $("#dbStrip").textContent = `SQLite .ht.sqlite - ${state.dbSize}`;
  $$(".saved-row").forEach((row) => row.classList.toggle("active", row.dataset.kind === "temporary"));
  updateObjectView();
  addEvent("Fallback to Unsaved Playground", reason, "warning");
}

function deleteActive() {
  if (!state.saved && !state.local) {
    addEvent("Delete blocked", "Temporary Unsaved Playground has no saved row to delete. Use reset or start fresh instead.", "warning");
    activateTab("events");
    return;
  }
  $("#deleteConfirm").hidden = false;
  activateTab("library");
}

document.addEventListener("click", (event) => {
  const tabButton = event.target.closest("[data-tab-target]");
  if (tabButton) {
    activateTab(tabButton.dataset.tabTarget);
  }

  const managerButton = event.target.closest("[data-manager-target]");
  if (managerButton) {
    activateManager(managerButton.dataset.managerTarget);
  }

  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    const route = routeButton.dataset.route;
    resetToUnsaved(`${route} route selected. The active shell is now a fresh temporary preview and must be saved before refresh.`);
    $("#activeTitle").classList.add("toast");
    window.setTimeout(() => $("#activeTitle").classList.remove("toast"), 700);
  }
});

$("#saveBrowser").addEventListener("click", saveBrowser);
$("#saveLocal").addEventListener("click", saveLocal);
$("#cancelFolder").addEventListener("click", () => {
  $("#saveResult").innerHTML = "<strong>Folder picker cancelled</strong><span>No local directory permission was granted. The active Playground remains temporary or browser-backed.</span>";
  addEvent("Local directory picker cancelled", "No folder permission was stored; local save did not start.", "warning");
});

$("#blueprintSearch").addEventListener("input", renderBlueprints);
$$(".filters button").forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    $$(".filters button").forEach((entry) => entry.classList.toggle("active", entry === button));
    renderBlueprints();
  });
});

$("#validateBlueprint").addEventListener("click", validateBlueprint);
$("#prepareRun").addEventListener("click", () => {
  if ($("#jsonDirty").textContent !== "Valid JSON") validateBlueprint();
  $("#blueprintConfirm").hidden = false;
  $("#blueprintState").textContent = "Replacement warning";
  $("#blueprintState").className = "chip danger";
});
$("#cancelBlueprint").addEventListener("click", () => {
  $("#blueprintConfirm").hidden = true;
  $("#blueprintState").textContent = "Validated";
  $("#blueprintState").className = "chip success";
  addEvent("Blueprint run cancelled", "Replacement warning was dismissed; the active WordPress preview was not changed.", "warning");
});
$("#runBlueprint").addEventListener("click", runBlueprint);
$("#copyBlueprint").addEventListener("click", () => addEvent("Blueprint URL copied", $("#blueprintUrl").value, "success"));
$("#downloadBlueprint").addEventListener("click", () => addEvent("Blueprint bundle downloaded", `${state.selectedBlueprint.title} bundle prepared from blueprint.json and adjacent assets.`, "success"));

$("#homepageButton").addEventListener("click", () => {
  state.path = "/";
  updateObjectView();
  addEvent("Homepage opened", "Active WordPress path changed to /.", "success");
});
$("#adminButton").addEventListener("click", () => {
  state.path = "/wp-admin/";
  updateObjectView();
  $("#previewValue").textContent = "WP Admin opened";
  addEvent("WP Admin opened", "Active WordPress path changed to /wp-admin/.", "success");
});
$("#refreshButton").addEventListener("click", () => {
  const consequence = state.saved || state.local ? "Reloaded saved runtime without losing identity." : "Temporary runtime refreshed; unsaved content would be lost on full browser close.";
  addEvent("Preview refreshed", consequence, state.saved || state.local ? "success" : "warning");
});
$("#pathInput").addEventListener("change", () => {
  state.path = $("#pathInput").value || "/";
  updateObjectView();
  addEvent("Path navigated", `Active WordPress path changed to ${state.path}.`, "success");
});
$$("[data-path]").forEach((button) => {
  button.addEventListener("click", () => {
    state.path = button.dataset.path;
    updateObjectView();
    addEvent("Preview navigation", `Embedded WordPress link opened ${state.path}.`, "success");
  });
});

$("#renameActive").addEventListener("click", () => {
  $("#renameInput").value = state.title === "Unsaved Playground" ? "Support Review Playground" : state.title;
  $("#renameCard").hidden = false;
  activateTab("library");
});
$("#cancelRename").addEventListener("click", () => {
  $("#renameCard").hidden = true;
});
$("#confirmRename").addEventListener("click", () => {
  const oldTitle = state.title;
  state.title = $("#renameInput").value.trim() || state.title;
  if (state.saved || state.local) updateSavedRowTitle();
  $("#renameCard").hidden = true;
  updateObjectView();
  addEvent("Playground renamed", `${oldTitle} renamed to ${state.title}; shell title and saved row were updated.`, "success");
});
$("#deleteActive").addEventListener("click", deleteActive);
$("#cancelDelete").addEventListener("click", () => {
  $("#deleteConfirm").hidden = true;
  addEvent("Delete cancelled", "Saved row remains active.", "warning");
});
$("#confirmDelete").addEventListener("click", () => {
  const removed = state.title;
  const row = $(`.saved-row[data-slug="${state.slug}"]`);
  if (row) row.remove();
  $("#deleteConfirm").hidden = true;
  $("#libraryCount").textContent = `${$$("#savedList .saved-row").length} objects`;
  resetToUnsaved(`${removed} was deleted from Saved Playgrounds. Active shell fell back to a temporary Unsaved Playground.`);
});

$("#settingsAction").addEventListener("click", () => {
  if (state.saved || state.local) {
    addEvent("Settings Save & Reload completed", `${state.title} reloaded with selected WordPress, PHP, language, network, and multisite settings.`, "success");
    $("#runtimeBadge").textContent = "WP 6.9 / PHP 8.2 / Network off";
    $("#previewValue").textContent = "Settings reloaded";
  } else {
    resetToUnsaved("Settings reset confirmed for a temporary Playground. Files, database, logs, and path returned to default.");
  }
});

$("#newFile").addEventListener("click", () => addEvent("File created", "/wordpress/wp-content/new-support-note.php created in the file browser.", "success"));
$("#newFolder").addEventListener("click", () => addEvent("Folder created", "/wordpress/wp-content/support-assets/ created in the file browser.", "success"));
$("#uploadFile").addEventListener("click", () => addEvent("Upload completed", "debug-plugin.php uploaded into /wordpress/wp-content/plugins/.", "success"));
$("#browseFile").addEventListener("click", () => addEvent("File selected", "/wordpress/wp-config.php opened in the editor.", "success"));
$("#saveFile").addEventListener("click", () => {
  $("#fileDirty").textContent = "Saved";
  $("#fileDirty").className = "chip success";
  addEvent("File saved", "wp-config.php changes saved and PHP logs were refreshed.", "success");
});

$("#downloadDatabase").addEventListener("click", () => addEvent("database.sqlite downloaded", `/wordpress/wp-content/database/.ht.sqlite downloaded at ${state.dbSize}.`, "success"));
$("#downloadDbShortcut").addEventListener("click", () => addEvent("database.sqlite downloaded", `/wordpress/wp-content/database/.ht.sqlite downloaded at ${state.dbSize}.`, "success"));
$("#openAdminer").addEventListener("click", () => addEvent("Adminer opened", "Adminer launched against the SQLite-backed database.", "success"));
$("#openPhpMyAdmin").addEventListener("click", () => addEvent("phpMyAdmin opened", "phpMyAdmin launched against MySQL emulation backed by SQLite.", "success"));
$("#exportGithub").addEventListener("click", () => addEvent("GitHub export queued", "Connect account, choose repository, then push files. Access token is not stored after refresh.", "warning"));
$("#downloadZip").addEventListener("click", () => addEvent("ZIP download generated", `${state.title} bundled as playground-export.zip.`, "success"));
$("#connectGithub").addEventListener("click", () => addEvent("GitHub account connected", "Repository import can continue; access token will not be stored after refresh.", "success"));
$("#zipImport").addEventListener("click", () => addEvent("ZIP import chooser opened", "Native file chooser opened. A selected archive would be validated before replacement warning.", "warning"));
$("#createBlueprintFile").addEventListener("click", () => addEvent("Blueprint file created", "/blueprint.json created in the bundle editor.", "success"));
$("#createBlueprintFolder").addEventListener("click", () => addEvent("Blueprint folder created", "/assets/ created for adjacent Blueprint files.", "success"));
$("#uploadBlueprintAssets").addEventListener("click", () => addEvent("Blueprint assets uploaded", "Adjacent files are now available for the Blueprint bundle.", "success"));
$("#browseBlueprintAssets").addEventListener("click", () => addEvent("Blueprint file selected", "/blueprint.json opened in the editor.", "success"));
$("#copyBlueprintBundle").addEventListener("click", () => addEvent("Blueprint bundle link copied", "Shareable Blueprint link copied from the current bundle.", "success"));
$("#downloadBlueprintBundle").addEventListener("click", () => addEvent("Blueprint bundle downloaded", "Current blueprint.json and adjacent files downloaded as a bundle.", "success"));
$("#clearEvents").addEventListener("click", () => addEvent("Events acknowledged", "Visible support events were reviewed; new operations will continue to append to the ledger.", "success"));

renderBlueprints();
updateObjectView();
