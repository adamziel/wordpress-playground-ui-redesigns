const routes = {
  gutenberg: {
    badge: "Review contract",
    title: "Preview a Gutenberg PR or branch",
    copy: "Accepts a PR number, GitHub URL, or branch name. The resulting active Playground is labeled as an editor patch review.",
    label: "PR number, URL, or branch name",
    value: "try/block-bindings-panel",
    button: "Preview branch",
    source: "Gutenberg branch try/block-bindings-panel",
    constraints: ["Installs Gutenberg build", "Network access allowed", "Token not stored after refresh"]
  },
  wordpress: {
    badge: "Core patch",
    title: "Preview a WordPress PR",
    copy: "Requires a WordPress core PR number or URL and starts from the latest WordPress runtime.",
    label: "PR number or URL",
    value: "https://github.com/WordPress/wordpress-develop/pull/72042",
    button: "Preview PR",
    source: "WordPress PR 72042",
    constraints: ["Core patch only", "Latest WordPress", "Preview can replace temporary runtime"]
  },
  github: {
    badge: "Account connection",
    title: "Import from GitHub",
    copy: "Imports public plugins, themes, or wp-content directories. The access token is not stored and re-authentication is required after refresh.",
    label: "Repository path",
    value: "wordpress/wordpress-playground",
    button: "Connect and import",
    source: "GitHub import wordpress/wordpress-playground",
    constraints: ["Connect GitHub account", "Token not stored", "Public repository content"]
  },
  "blueprint-url": {
    badge: "Remote Blueprint",
    title: "Run Blueprint from URL",
    copy: "Runs a public blueprint.json against the active runtime after validation and replacement confirmation.",
    label: "Blueprint URL",
    value: "https://example.com/blueprint.json",
    button: "Run URL Blueprint",
    source: "Remote Blueprint URL",
    constraints: ["Validate JSON", "Confirm replacement", "Changes current files and database"]
  },
  zip: {
    badge: "Archive import",
    title: "Import .zip",
    copy: "Opens the native file chooser, validates the archive, and asks before replacing files and the SQLite database.",
    label: "Selected archive",
    value: "playground-export.zip",
    button: "Choose .zip",
    source: "ZIP import playground-export.zip",
    constraints: ["Native file chooser", "Archive validation", "Replacement warning"]
  },
  vanilla: {
    badge: "Clean install",
    title: "Start Vanilla WordPress",
    copy: "Starts a fresh Playground immediately with the default WordPress welcome site.",
    label: "Initial path",
    value: "/hello-from-playground/",
    button: "Start fresh",
    source: "Vanilla WordPress",
    constraints: ["Immediate start", "Default content", "Temporary until saved"]
  }
};

const blueprints = {
  "Feed Reader with the Friends Plugin": {
    tags: "rss social web",
    path: "/friends/",
    size: "612 KB",
    heading: "Friends feed reader ready",
    lead: "The Friends Plugin Blueprint replaced the welcome content and installed feed-reading sample data.",
    json: `{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "meta": { "title": "Feed Reader with the Friends Plugin" },
  "landingPage": "/friends/",
  "preferredVersions": { "php": "8.3", "wp": "latest" },
  "steps": [
    { "step": "installPlugin", "pluginZipFile": "friends.zip" },
    { "step": "runPHP", "code": "<?php // create feed sample" }
  ]
}`
  },
  "Art Gallery": {
    tags: "Website Personal",
    path: "/gallery/",
    size: "540 KB",
    heading: "Art Gallery Blueprint applied",
    lead: "The Vueo gallery content is now active in the WordPress preview.",
    json: `{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "meta": { "title": "Art Gallery" },
  "landingPage": "/gallery/",
  "steps": [{ "step": "installTheme", "themeZipFile": "vueo.zip" }]
}`
  },
  "Coffee Shop": {
    tags: "WooCommerce Store",
    path: "/shop/",
    size: "884 KB",
    heading: "Coffee Shop storefront ready",
    lead: "WooCommerce products and the custom coffee storefront have replaced the current content.",
    json: `{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "meta": { "title": "Coffee Shop" },
  "landingPage": "/shop/",
  "steps": [{ "step": "installPlugin", "pluginZipFile": "woocommerce.zip" }]
}`
  },
  "Gaming News": {
    tags: "Website News",
    path: "/news/",
    size: "701 KB",
    heading: "Gaming News Blueprint applied",
    lead: "The Spiel theme and gaming posts are loaded into the active Playground.",
    json: `{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "meta": { "title": "Gaming News" },
  "landingPage": "/news/",
  "steps": [{ "step": "installTheme", "themeZipFile": "spiel.zip" }]
}`
  },
  "Non-profit Organization": {
    tags: "Website Organization",
    path: "/donate/",
    size: "668 KB",
    heading: "Non-profit site ready",
    lead: "The Koinonia theme and donation-oriented content now replace the welcome page.",
    json: `{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "meta": { "title": "Non-profit Organization" },
  "landingPage": "/donate/",
  "steps": [{ "step": "runPHP", "code": "<?php // import nonprofit content" }]
}`
  },
  "Personal Blog": {
    tags: "Website Personal Blog",
    path: "/blog/",
    size: "497 KB",
    heading: "Personal Blog Blueprint applied",
    lead: "The Substrata personal blog content is active in the preview.",
    json: `{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "meta": { "title": "Personal Blog" },
  "landingPage": "/blog/",
  "steps": [{ "step": "installTheme", "themeZipFile": "substrata.zip" }]
}`
  }
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

let activeBlueprint = "Feed Reader with the Friends Plugin";
let activeBlueprintFilter = "All";
let saveTimer = null;
let blueprintTimer = null;
let savedBrowserRowInserted = false;

function addHistory(kind, text) {
  const li = document.createElement("li");
  li.innerHTML = `<span class="tag ${kind}">${kind === "success" ? "Done" : kind === "danger" ? "Warning" : kind === "info" ? "Event" : "State"}</span> ${text}`;
  $("#historyList").prepend(li);
}

function openPanel(name) {
  $$(".ops-tabs button").forEach((button) => button.classList.toggle("active", button.dataset.panel === name));
  $$(".ops-panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.panelView === name));
}

function updateRoute(routeKey) {
  const route = routes[routeKey];
  $$(".contract-card").forEach((card) => card.classList.toggle("active", card.dataset.route === routeKey));
  $("#contractBadge").textContent = route.badge;
  $("#contractTitle").textContent = route.title;
  $("#contractCopy").textContent = route.copy;
  $("#contractLabel").textContent = route.label;
  $("#contractInput").value = route.value;
  $("#startContract").textContent = route.button;
  $("#sourceValue").textContent = `${route.title} selected`;
  $("#contractConstraints").innerHTML = route.constraints.map((item) => `<span>${item}</span>`).join("");
  $("#contractSteps").innerHTML = `<li class="current">Waiting for contract validation</li><li>Runtime not prepared</li><li>Active identity unchanged</li>`;
  addHistory("info", `${route.title} selected.`);
}

function completeRoute() {
  const activeRoute = $(".contract-card.active").dataset.route;
  const route = routes[activeRoute];
  $("#contractSteps").innerHTML = `<li class="done">Input validated</li><li class="done">Runtime prepared</li><li class="done">Active identity updated</li>`;
  $("#sourceValue").textContent = route.source;
  $("#runtimeTitle").textContent = route.source;
  $("#runtimeCopy").textContent = `${route.title} is now the active review context. Save or export when ready.`;
  $("#runtimeValidate").classList.add("done");
  $("#runtimePrepare").classList.add("done");
  $("#runtimeReady").classList.add("done");
  $("#previewState").textContent = "preview updated";
  addHistory("success", `${route.title} completed and updated the active preview identity.`);
}

function setSaveDestinationStyles() {
  $$(".destination").forEach((label) => {
    const input = label.querySelector("input");
    label.classList.toggle("active", input.checked);
  });
}

function completeBrowserSave(destination) {
  const name = $("#saveName").value.trim() || "Saved Playground";
  const local = destination === "local";
  const identity = local ? `${name} - Local Directory` : name;
  $("#activeTitle").textContent = identity;
  $("#activeMeta").textContent = local
    ? "Saved to a local directory. Reconnect folder permission after browser refresh before continuing."
    : "Saved in this browser a moment ago. The slug URL can reopen this Playground here.";
  $("#storageBadge").textContent = local ? "Local directory" : "Saved Playground";
  $("#storageBadge").className = "status-pill success";
  $("#storageValue").textContent = local ? "local directory: ~/Playgrounds/research-browser" : "browser storage";
  $("#resetMode").textContent = "Save & Reload";
  $("#resetButton").textContent = "Save & Reload";
  $("#settingsConsequence").innerHTML = local
    ? `<strong>Local reload consequence</strong><span>Save & Reload writes settings through the granted folder permission. If permission is lost, reconnect the directory first.</span><button class="danger" type="button">Save & Reload</button>`
    : `<strong>Saved reload consequence</strong><span>Stored Playgrounds have limited configuration options and use Save & Reload instead of a destructive reset.</span><button class="danger" type="button">Save & Reload</button>`;
  $("#saveStatus").textContent = local ? "Saved to local directory" : "Saved in browser";
  $("#saveStatus").className = "status-pill success";

  const path = local ? "/local/research-browser/hello-from-playground/" : "/research-browser-playground/hello-from-playground/";
  $("#pathInput").value = path;
  $("#browserUrl").textContent = `playground.local${path}`;
  $("#previewState").textContent = local ? "local saved" : "browser saved";

  const list = $("#savedList");
  $$(".saved-row").forEach((row) => row.classList.remove("active"));
  let row = document.querySelector(`[data-row="${local ? "local-save" : "browser-save"}"]`);
  if (!row) {
    row = document.createElement("article");
    row.className = "saved-row active";
    row.dataset.row = local ? "local-save" : "browser-save";
    row.innerHTML = `<span class="wp-mini">W</span><div><strong>${identity}</strong><small>${local ? "Local directory, folder permission granted" : "Saved in browser, created May 21, 2026"}</small></div><button type="button" data-library-action="manage">Manage</button>`;
    list.prepend(row);
    savedBrowserRowInserted = true;
  } else {
    row.classList.add("active");
    row.querySelector("strong").textContent = identity;
  }
  $("#libraryCount").textContent = `${document.querySelectorAll(".saved-row").length} objects`;
  addHistory("success", `${identity} saved; active title, path, storage badge, saved row, and reload mode updated.`);
}

function runSave() {
  if (saveTimer) {
    clearInterval(saveTimer);
  }
  const destination = document.querySelector("input[name='destination']:checked").value;
  const local = destination === "local";
  let copied = 0;
  $("#saveProgressText").textContent = local ? "Requesting local folder permission" : "Saving to browser storage";
  $("#saveProgressCount").textContent = "0 / 3751 files";
  $("#saveProgressBar").style.inlineSize = "0%";
  $("#saveSteps").innerHTML = `<li class="done">Destination chosen: ${local ? "local directory" : "browser storage"}</li><li class="current">Copying WordPress files</li><li>Insert saved row</li><li>Change reset action to Save & Reload</li>`;
  addHistory("info", `${local ? "Local directory" : "Browser storage"} save started.`);

  saveTimer = setInterval(() => {
    copied = Math.min(3751, copied + 463);
    const percent = Math.round((copied / 3751) * 100);
    $("#saveProgressCount").textContent = `${copied} / 3751 files`;
    $("#saveProgressBar").style.inlineSize = `${percent}%`;
    if (copied >= 3751) {
      clearInterval(saveTimer);
      $("#saveProgressText").textContent = local ? "Local directory copy complete" : "Browser storage copy complete";
      $("#saveSteps").innerHTML = `<li class="done">Destination chosen: ${local ? "local directory" : "browser storage"}</li><li class="done">Copied 3751 WordPress files</li><li class="done">Saved row inserted</li><li class="done">Reset changed to Save & Reload</li>`;
      completeBrowserSave(destination);
    }
  }, 170);
}

function selectBlueprint(name) {
  activeBlueprint = name;
  const item = blueprints[name];
  $("#blueprintTitle").textContent = name;
  $("#blueprintState").textContent = "Selected. JSON not validated.";
  $("#blueprintJson").textContent = item.json;
  $("#blueprintWarning").classList.add("hidden");
  $("#blueprintProgressText").textContent = "No Blueprint running";
  $("#blueprintProgressCount").textContent = "0%";
  $("#blueprintProgressBar").style.inlineSize = "0%";
  $$("#blueprintList button").forEach((button) => button.classList.toggle("active", button.dataset.blueprint === name));
  addHistory("info", `Blueprint selected: ${name}.`);
}

function applyBlueprintFilter() {
  const search = $("#blueprintSearch").value.trim().toLowerCase();
  let visible = 0;
  $$("#blueprintList button").forEach((button) => {
    const title = button.dataset.blueprint.toLowerCase();
    const tags = button.dataset.tags.toLowerCase();
    const matchesSearch = !search || title.includes(search) || tags.includes(search);
    const matchesFilter = activeBlueprintFilter === "All" || tags.includes(activeBlueprintFilter.toLowerCase());
    const show = matchesSearch && matchesFilter;
    button.classList.toggle("hidden", !show);
    if (show) {
      visible += 1;
    }
  });
  addHistory("info", `Blueprint gallery filtered to ${visible} shown from the representative 6 of 43.`);
}

function validateBlueprint() {
  $("#blueprintState").textContent = "Valid JSON. Replacement confirmation required.";
  $("#blueprintWarning").classList.remove("hidden");
  addHistory("warning", `${activeBlueprint} validated; running it will replace current content.`);
}

function runBlueprint() {
  if (blueprintTimer) {
    clearInterval(blueprintTimer);
  }
  validateBlueprint();
  let progress = 0;
  $("#blueprintProgressText").textContent = "Replacing current content";
  blueprintTimer = setInterval(() => {
    progress = Math.min(100, progress + 20);
    $("#blueprintProgressCount").textContent = `${progress}%`;
    $("#blueprintProgressBar").style.inlineSize = `${progress}%`;
    if (progress >= 100) {
      clearInterval(blueprintTimer);
      const item = blueprints[activeBlueprint];
      $("#blueprintProgressText").textContent = "Blueprint run complete";
      $("#blueprintState").textContent = "Run complete. Preview and database updated.";
      $("#previewHeading").textContent = item.heading;
      $("#previewLead").textContent = item.lead;
      $("#pathInput").value = item.path;
      $("#browserUrl").textContent = `playground.local${item.path}`;
      $("#previewState").textContent = "blueprint applied";
      $("#runtimeTitle").textContent = activeBlueprint;
      $("#runtimeCopy").textContent = "Blueprint replacement completed against the current Playground object.";
      $("#sourceValue").textContent = `Blueprint: ${activeBlueprint}`;
      $("#dbSize").textContent = item.size;
      addHistory("success", `${activeBlueprint} ran successfully; preview path changed to ${item.path} and database size is ${item.size}.`);
    }
  }, 220);
}

function confirmDelete() {
  const activeSaved = $(".saved-row.active");
  if (activeSaved && activeSaved.dataset.row !== "unsaved") {
    const name = activeSaved.querySelector("strong").textContent;
    activeSaved.remove();
    $("#libraryCount").textContent = `${document.querySelectorAll(".saved-row").length} objects`;
    $("#deleteConfirm").classList.add("hidden");
    $("#activeTitle").textContent = "Unsaved Playground";
    $("#activeMeta").textContent = "Temporary browser runtime restored after deleting the saved object.";
    $("#storageBadge").textContent = "Temporary runtime";
    $("#storageBadge").className = "status-pill warning";
    $("#storageValue").textContent = "temporary";
    $("#resetMode").textContent = "Destructive reset";
    $("#resetButton").textContent = "Reset temporary site";
    $("#pathInput").value = "/hello-from-playground/";
    $("#browserUrl").textContent = "playground.local/hello-from-playground/";
    const unsaved = document.querySelector('[data-row="unsaved"]');
    if (unsaved) {
      unsaved.classList.add("active");
    }
    addHistory("danger", `${name} deleted. Active shell fell back to an Unsaved Playground.`);
  } else {
    $("#deleteConfirm").classList.add("hidden");
    addHistory("warning", "Delete skipped because the selected object is temporary.");
  }
}

$$(".contract-card").forEach((card) => card.addEventListener("click", () => updateRoute(card.dataset.route)));
$("#validateContract").addEventListener("click", () => {
  $("#contractSteps").innerHTML = `<li class="done">Input validated</li><li class="current">Runtime awaiting preview command</li><li>Active identity unchanged</li>`;
  addHistory("success", "Launch contract input validated.");
});
$("#startContract").addEventListener("click", completeRoute);

$$("[data-open-panel]").forEach((button) => button.addEventListener("click", () => openPanel(button.dataset.openPanel)));
$$(".ops-tabs button").forEach((button) => button.addEventListener("click", () => openPanel(button.dataset.panel)));
$$("input[name='destination']").forEach((input) => input.addEventListener("change", setSaveDestinationStyles));
$("#runSave").addEventListener("click", runSave);
$("#cancelSave").addEventListener("click", () => {
  $("#saveProgressText").textContent = "Save cancelled";
  addHistory("warning", "Save cancelled before files were copied.");
});

$$(".manager-tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    $$(".manager-tabs button").forEach((tab) => tab.classList.toggle("active", tab === button));
    $$(".manager-pane").forEach((pane) => pane.classList.toggle("active", pane.dataset.managerPane === button.dataset.manager));
  });
});

$$("[data-event]").forEach((button) => button.addEventListener("click", () => addHistory("info", button.dataset.event)));
$("#saveFile").addEventListener("click", () => {
  $("#fileStatus").textContent = "Saved";
  addHistory("success", "/wordpress/wp-config.php saved from the file editor.");
});
$("#downloadDb").addEventListener("click", () => addHistory("success", "database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite."));
$("#downloadDbTransfer").addEventListener("click", () => addHistory("success", "database.sqlite downloaded from the transfer queue."));
$("#downloadZip").addEventListener("click", () => addHistory("success", "Current Playground packaged as playground-export.zip."));
$("#downloadZipTransfer").addEventListener("click", () => addHistory("success", "Download as .zip completed from the transfer queue."));
$("#exportGithub").addEventListener("click", () => addHistory("info", "GitHub export queued: account connection required before repository selection."));
$("#copyBlueprint").addEventListener("click", () => addHistory("success", `Copied Blueprint link for ${activeBlueprint}.`));
$("#downloadBlueprint").addEventListener("click", () => addHistory("success", `Downloaded Blueprint bundle for ${activeBlueprint}.`));
$("#copyBlueprintManager").addEventListener("click", () => addHistory("success", "Copied link to /blueprint.json from Site Manager."));
$("#downloadBlueprintManager").addEventListener("click", () => addHistory("success", "Downloaded current Blueprint bundle from Site Manager."));

$("#validateBlueprint").addEventListener("click", validateBlueprint);
$("#runBlueprint").addEventListener("click", runBlueprint);
$$("#blueprintList button").forEach((button) => button.addEventListener("click", () => selectBlueprint(button.dataset.blueprint)));
$("#blueprintSearch").addEventListener("input", applyBlueprintFilter);
$$(".filters button").forEach((button) => {
  button.addEventListener("click", () => {
    $$(".filters button").forEach((filter) => filter.classList.toggle("active", filter === button));
    activeBlueprintFilter = button.dataset.filter;
    applyBlueprintFilter();
  });
});

$("#savedList").addEventListener("click", (event) => {
  const row = event.target.closest(".saved-row");
  if (!row) {
    return;
  }
  $$(".saved-row").forEach((savedRow) => savedRow.classList.toggle("active", savedRow === row));
  const name = row.querySelector("strong").textContent;
  $("#renameInput").value = name;
  addHistory("info", `${name} selected in saved Playground management.`);
});

$$("[data-select-route]").forEach((button) => {
  button.addEventListener("click", () => {
    updateRoute(button.dataset.route);
    openPanel("save");
  });
});

$("#renameButton").addEventListener("click", () => {
  const activeSaved = $(".saved-row.active");
  const nextName = $("#renameInput").value.trim() || "Renamed Playground";
  if (activeSaved) {
    activeSaved.querySelector("strong").textContent = nextName;
    $("#activeTitle").textContent = nextName;
    addHistory("success", `Selected Playground renamed to ${nextName}.`);
  }
});

$("#deleteButton").addEventListener("click", () => $("#deleteConfirm").classList.remove("hidden"));
$("#cancelDelete").addEventListener("click", () => {
  $("#deleteConfirm").classList.add("hidden");
  addHistory("info", "Delete cancelled; saved row remains available.");
});
$("#confirmDelete").addEventListener("click", confirmDelete);

$("#homeButton").addEventListener("click", () => {
  $("#pathInput").value = "/hello-from-playground/";
  $("#browserUrl").textContent = "playground.local/hello-from-playground/";
  addHistory("info", "Homepage opened in the live WordPress shell.");
});
$("#adminButton").addEventListener("click", () => {
  $("#pathInput").value = "/wp-admin/";
  $("#browserUrl").textContent = "playground.local/wp-admin/";
  $("#previewState").textContent = "wp admin";
  addHistory("info", "WP Admin opened at /wp-admin/.");
});
$("#refreshButton").addEventListener("click", () => addHistory("info", `Refreshed active path ${$("#pathInput").value}.`));
$("#pathInput").addEventListener("change", () => {
  $("#browserUrl").textContent = `playground.local${$("#pathInput").value}`;
  addHistory("info", `Navigated active WordPress path to ${$("#pathInput").value}.`);
});
$("#clearHistory").addEventListener("click", () => {
  $("#historyList").innerHTML = `<li><span class="tag info">Event</span> Resolved command history cleared.</li>`;
});
$("#applySettings").addEventListener("click", () => addHistory("danger", "Apply Settings & Reset requested; temporary Playground would be replaced."));

setSaveDestinationStyles();
