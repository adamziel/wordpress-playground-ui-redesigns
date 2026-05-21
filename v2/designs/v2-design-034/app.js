const app = document.querySelector(".app");
const panels = Array.from(document.querySelectorAll("[data-view-panel]"));
const viewButtons = Array.from(document.querySelectorAll("[data-view-target]"));
const managerButtons = Array.from(document.querySelectorAll("[data-manager-target]"));
const managerPanels = Array.from(document.querySelectorAll("[data-manager-panel]"));

const pathInput = document.getElementById("pathInput");
const pathState = document.getElementById("pathState");
const storageBadge = document.getElementById("storageBadge");
const activeTitle = document.getElementById("activeTitle");
const activeSubtitle = document.getElementById("activeSubtitle");
const resetMode = document.getElementById("resetMode");
const previewUrl = document.getElementById("previewUrl");
const previewState = document.getElementById("previewState");
const previewTitle = document.getElementById("previewTitle");
const previewText = document.getElementById("previewText");
const previewKicker = document.getElementById("previewKicker");
const previewHighlight = document.getElementById("previewHighlight");
const previewSiteName = document.getElementById("previewSiteName");
const wpAdminSite = document.getElementById("wpAdminSite");
const activityList = document.getElementById("activityList");

const blueprints = [
  {
    id: "coffee",
    name: "Coffee Shop",
    type: "Blueprint gallery",
    group: "Captured gallery entries",
    description: "A stylish WooCommerce coffee shop storefront with custom theme, products, and content.",
    source: "Captured Blueprint gallery card",
    categories: ["Featured", "WooCommerce", "Store"],
    url: "https://playground.wordpress.net/blueprints/coffee-shop/blueprint.json",
    previewClass: "coffee",
    siteTitle: "Coffee Shop Blueprint",
    path: "/",
    text: "The Coffee Shop Blueprint has replaced the active Playground content. Products, pages, and the custom storefront are now loaded.",
  },
  {
    id: "art",
    name: "Art Gallery",
    type: "Blueprint gallery",
    group: "Captured gallery entries",
    description: "An art gallery created with the Vueo theme.",
    source: "Captured Blueprint gallery card",
    categories: ["Featured", "Website", "Personal"],
    url: "https://playground.wordpress.net/blueprints/art-gallery/blueprint.json",
    siteTitle: "Art Gallery Blueprint",
    path: "/",
    text: "The Art Gallery Blueprint is now active with gallery pages and sample artwork content.",
  },
  {
    id: "friends",
    name: "Feed Reader with the Friends Plugin",
    type: "Blueprint gallery",
    group: "Captured gallery entries",
    description: "Read feeds from the web in Playground using the Friends plugin.",
    source: "Captured Blueprint gallery card",
    categories: ["Featured", "Content", "Experiments"],
    url: "https://playground.wordpress.net/blueprints/friends-feed-reader/blueprint.json",
    siteTitle: "Friends Feed Reader",
    path: "/wp-admin/admin.php?page=friends",
    text: "The Friends plugin feed reader is active. The preview has moved to the plugin admin page.",
  },
  {
    id: "gaming",
    name: "Gaming News",
    type: "Blueprint gallery",
    group: "Captured gallery entries",
    description: "A gaming news site created with the Spiel theme.",
    source: "Captured Blueprint gallery card",
    categories: ["Featured", "Website", "News"],
    url: "https://playground.wordpress.net/blueprints/gaming-news/blueprint.json",
    siteTitle: "Gaming News Blueprint",
    path: "/",
    text: "The Gaming News Blueprint is active with news layouts, demo posts, and theme settings.",
  },
  {
    id: "nonprofit",
    name: "Non-profit Organization",
    type: "Blueprint gallery",
    group: "Captured gallery entries",
    description: "A non-profit organization site created with the Koinonia theme.",
    source: "Captured Blueprint gallery card",
    categories: ["Featured", "Website", "Content"],
    url: "https://playground.wordpress.net/blueprints/non-profit-organization/blueprint.json",
    siteTitle: "Non-profit Organization",
    path: "/",
    text: "The non-profit Blueprint is active with donation copy, pages, and theme content.",
  },
  {
    id: "personal",
    name: "Personal Blog",
    type: "Blueprint gallery",
    group: "Captured gallery entries",
    description: "A personal blog created with the Substrata theme.",
    source: "Captured Blueprint gallery card",
    categories: ["Personal", "Website", "Content"],
    url: "https://playground.wordpress.net/blueprints/personal-blog/blueprint.json",
    siteTitle: "Personal Blog Blueprint",
    path: "/",
    text: "The Personal Blog Blueprint is active with sample posts and theme styling.",
  },
  {
    id: "url-runner",
    name: "Run Blueprint from URL",
    type: "Command",
    group: "Blueprint tools",
    description: "Paste a public blueprint.json URL, validate the schema, then run with replacement protection.",
    source: "Current product start route",
    categories: ["All", "Experiments"],
    url: "https://example.com/blueprint.json",
    siteTitle: "URL Blueprint Playground",
    path: "/",
    text: "The Blueprint URL command completed and updated the current Playground.",
  },
  {
    id: "copy",
    name: "Copy current Blueprint URL",
    type: "Command",
    group: "Blueprint tools",
    description: "Copies the current Blueprint URL from the bundle editor.",
    source: "Site Manager Blueprint tab",
    categories: ["All"],
    url: "https://playground.wordpress.net/blueprint.json",
    siteTitle: "Unsaved Playground",
    path: "/hello-from-playground/",
    text: "Current Blueprint URL copied.",
  },
  {
    id: "download",
    name: "Download Blueprint bundle",
    type: "Command",
    group: "Blueprint tools",
    description: "Downloads the current blueprint.json and related files as a bundle.",
    source: "Site Manager Blueprint tab",
    categories: ["All"],
    url: "https://playground.wordpress.net/blueprint.json",
    siteTitle: "Unsaved Playground",
    path: "/hello-from-playground/",
    text: "Blueprint bundle download prepared.",
  },
];

let selectedBlueprint = blueprints[0];
let activeStorage = "temporary";
let deleteTargetId = null;
let selectedRoute = "vanilla";
let savedSites = [
  { id: "temporary", title: "Unsaved Playground", meta: "Temporary, lost on refresh or close", storage: "temporary", active: true },
  { id: "research", title: "Research Browser Playground", meta: "Browser storage, created May 21, 2026", storage: "browser", active: false },
  { id: "local", title: "Local Theme Lab", meta: "Local directory: ~/Sites/theme-lab", storage: "local", active: false },
];

const routeData = {
  vanilla: {
    badge: "Clean install",
    title: "Vanilla WordPress",
    copy: "Start a clean temporary Playground using WordPress latest and PHP 8.3.",
    label: "",
    value: "",
    constraints: ["Creates a temporary object until saved", "Settings reset is destructive while unsaved"],
    button: "Start route",
  },
  "wp-pr": {
    badge: "Core patch",
    title: "WordPress PR",
    copy: "Preview a WordPress core PR from a number or wordpress-develop pull request URL.",
    label: "PR number or URL",
    value: "https://github.com/WordPress/wordpress-develop/pull/7821",
    constraints: ["Builds from wordpress-develop", "Requires replacement confirmation"],
    button: "Preview WordPress PR",
  },
  gutenberg: {
    badge: "Editor patch",
    title: "Gutenberg PR or branch",
    copy: "Preview a Gutenberg PR, GitHub URL, or branch name with the plugin build installed.",
    label: "PR number, URL, or branch name",
    value: "try/block-bindings-panel",
    constraints: ["Installs Gutenberg build", "Network access recommended"],
    button: "Preview Gutenberg",
  },
  github: {
    badge: "Account connection",
    title: "From GitHub",
    copy: "Import a plugin, theme, or wp-content directory from a public GitHub repository. The token is not stored after refresh.",
    label: "Repository path",
    value: "wordpress/wordpress-playground",
    constraints: ["Connect GitHub account", "Token is not stored", "Replacement warning before import"],
    button: "Connect and import",
  },
  "blueprint-url": {
    badge: "Blueprint URL",
    title: "Run Blueprint from URL",
    copy: "Run a public blueprint.json after schema validation and replacement confirmation.",
    label: "Blueprint URL",
    value: "https://example.com/blueprint.json",
    constraints: ["Validates JSON schema", "Can replace files and database"],
    button: "Inspect and run",
  },
  zip: {
    badge: "Replacement",
    title: "Import .zip",
    copy: "Open a local file chooser, validate the archive, then confirm replacement of files and database.",
    label: "",
    value: "",
    constraints: ["Native file chooser", "Validates archive", "Replaces files and SQLite database"],
    button: "Choose .zip",
  },
};

function setView(view) {
  app.dataset.view = view;
  panels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.viewPanel === view));
  viewButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.viewTarget === view));
}

function setManagerPanel(name) {
  managerButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.managerTarget === name));
  managerPanels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.managerPanel === name));
}

function addActivity(kind, message) {
  const li = document.createElement("li");
  li.innerHTML = `<span class="${kind}">${kind[0].toUpperCase()}${kind.slice(1)}</span> ${message}`;
  activityList.prepend(li);
}

function updateShell({ title, subtitle, storage, path, state, text, kicker, highlight }) {
  if (title) {
    activeTitle.textContent = title;
    previewSiteName.textContent = title;
    wpAdminSite.textContent = title;
  }
  if (subtitle) activeSubtitle.textContent = subtitle;
  if (storage) {
    activeStorage = storage;
    app.dataset.storage = storage;
    const labels = {
      temporary: "Temporary",
      browser: "Saved in browser",
      local: "Local directory",
      dirty: "Unsaved changes",
      imported: "Imported temporary",
    };
    storageBadge.textContent = labels[storage] || storage;
    storageBadge.className = `badge ${storage === "browser" || storage === "local" ? "green" : "amber"}`;
    resetMode.textContent = storage === "temporary" || storage === "dirty" || storage === "imported"
      ? "Settings reset will replace this temporary site"
      : "Settings changes use Save & Reload";
    document.getElementById("settingsWarning").textContent = storage === "browser" || storage === "local"
      ? "Saved Playground uses Save & Reload"
      : "Applying settings resets this unsaved Playground";
  }
  if (path) {
    pathInput.value = path;
    previewUrl.textContent = `playground.local${path}`;
  }
  if (state) previewState.textContent = state;
  if (title) previewTitle.textContent = title;
  if (text) previewText.textContent = text;
  if (kicker) previewKicker.textContent = kicker;
  if (highlight) previewHighlight.textContent = highlight;
}

function startProgress(card, steps, done) {
  const meter = card.querySelector(".meter span");
  card.hidden = false;
  meter.style.width = "0%";
  let index = 0;
  const tick = () => {
    const step = steps[index];
    if (!step) {
      done?.();
      return;
    }
    if (step.title) card.querySelector("strong").textContent = step.title;
    if (step.text) card.querySelector("span").textContent = step.text;
    meter.style.width = `${step.width}%`;
    index += 1;
    window.setTimeout(tick, step.delay || 450);
  };
  tick();
}

function renderResults() {
  const query = document.getElementById("commandSearch").value.trim().toLowerCase();
  const activeFilter = document.querySelector(".filters .is-active").dataset.filter;
  const resultRoot = document.getElementById("commandResults");
  const filtered = blueprints.filter((item) => {
    const text = `${item.name} ${item.description} ${item.type} ${item.categories.join(" ")}`.toLowerCase();
    const matchesQuery = !query || text.includes(query);
    const matchesFilter = activeFilter === "All" || item.categories.includes(activeFilter) || item.type === "Command";
    return matchesQuery && matchesFilter;
  });
  const groups = filtered.reduce((acc, item) => {
    acc[item.group] ||= [];
    acc[item.group].push(item);
    return acc;
  }, {});

  resultRoot.innerHTML = "";
  if (!filtered.length) {
    resultRoot.innerHTML = `<div class="result-group"><h4>No matches</h4><button class="result-item" type="button"><strong>No Blueprint commands found</strong><span>Try URL, ZIP, coffee, gallery, or download.</span></button></div>`;
    return;
  }

  Object.entries(groups).forEach(([group, items]) => {
    const wrapper = document.createElement("div");
    wrapper.className = "result-group";
    wrapper.innerHTML = `<h4>${group}</h4>`;
    items.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `result-item${item.id === selectedBlueprint.id ? " is-active" : ""}`;
      button.dataset.blueprintId = item.id;
      button.innerHTML = `<strong>${item.name}</strong><span>${item.description}</span>`;
      wrapper.append(button);
    });
    resultRoot.append(wrapper);
  });
}

function selectBlueprint(id) {
  selectedBlueprint = blueprints.find((item) => item.id === id) || selectedBlueprint;
  document.getElementById("selectedType").textContent = selectedBlueprint.type;
  document.getElementById("selectedName").textContent = selectedBlueprint.name;
  document.getElementById("selectedDescription").textContent = selectedBlueprint.description;
  document.getElementById("selectedSource").textContent = selectedBlueprint.source;
  document.getElementById("selectedCategories").textContent = selectedBlueprint.categories.join(", ");
  document.getElementById("selectedRunMode").textContent = selectedBlueprint.type === "Command" ? "Runs against current bundle" : "Replaces current content after confirmation";
  document.getElementById("blueprintUrl").value = selectedBlueprint.url;
  document.getElementById("blueprintValidation").textContent = "JSON valid. Running this Blueprint will replace current content and keep files editable in Site Manager.";
  document.getElementById("blueprintValidation").className = "validation good";
  renderResults();
  addActivity("blue", `Selected <code>${selectedBlueprint.name}</code> from grouped command results.`);
}

function renderSavedRows() {
  const root = document.getElementById("savedRows");
  root.innerHTML = "";
  savedSites.forEach((site) => {
    const row = document.createElement("article");
    row.className = `saved-row${site.active ? " active" : ""}`;
    row.dataset.siteId = site.id;
    row.innerHTML = `
      <div>
        <strong>${site.title}</strong>
        <small>${site.meta}</small>
      </div>
      <div class="row-actions">
        <button type="button" data-row-action="open">Open</button>
        <button type="button" data-row-action="manage">Manage</button>
        <button type="button" data-row-action="rename">Rename</button>
        <button type="button" data-row-action="delete" class="danger">Delete</button>
      </div>
    `;
    root.append(row);
  });
  document.getElementById("libraryCount").textContent = `${savedSites.length} Playgrounds listed`;
}

function setActiveSaved(id) {
  savedSites = savedSites.map((site) => ({ ...site, active: site.id === id }));
  const site = savedSites.find((item) => item.id === id);
  if (!site) return;
  const storage = site.storage === "browser" ? "browser" : site.storage === "local" ? "local" : "temporary";
  updateShell({
    title: site.title,
    subtitle: site.meta,
    storage,
    path: storage === "temporary" ? "/hello-from-playground/" : "/",
    state: `${site.title} open`,
    text: `${site.title} is now the active Playground. Manager, save, and portability controls apply to this same object.`,
    kicker: "Saved row opened",
    highlight: storage === "local" ? "Local directory backing is active. Folder permission may be required after reload." : "Current object is selected in Saved Playgrounds.",
  });
  renderSavedRows();
}

function upsertSavedSite(title, storage) {
  savedSites = savedSites.map((site) => ({ ...site, active: false }));
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "saved-playground";
  const meta = storage === "local"
    ? "Local directory: ~/Sites/blueprint-console"
    : `Browser storage, slug: ${slug}`;
  const id = storage === "local" ? "local-blueprint-console" : slug;
  const existingIndex = savedSites.findIndex((site) => site.id === id);
  const nextSite = { id, title, meta, storage, active: true };
  if (existingIndex >= 0) savedSites[existingIndex] = nextSite;
  else savedSites.unshift(nextSite);
  renderSavedRows();
  return { slug, meta };
}

function updateRouteDetail(route) {
  selectedRoute = route;
  const data = routeData[route];
  document.getElementById("routeBadge").textContent = data.badge;
  document.getElementById("routeTitle").textContent = data.title;
  document.getElementById("routeCopy").textContent = data.copy;
  document.getElementById("runRouteButton").textContent = data.button;
  const wrap = document.getElementById("routeInputWrap");
  wrap.hidden = !data.label;
  document.getElementById("routeInputLabel").textContent = data.label || "Input";
  document.getElementById("routeInput").value = data.value;
  document.getElementById("routeConstraints").innerHTML = data.constraints.map((item) => `<span>${item}</span>`).join("");
  document.getElementById("zipFlow").hidden = route !== "zip";
  document.querySelectorAll(".route-card").forEach((card) => card.classList.toggle("is-active", card.dataset.route === route));
}

function completeBlueprintRun() {
  document.getElementById("blueprintWarning").hidden = true;
  updateShell({
    title: selectedBlueprint.siteTitle,
    subtitle: `Blueprint result from ${selectedBlueprint.name}. Not saved yet.`,
    storage: "dirty",
    path: selectedBlueprint.path,
    state: "Blueprint run complete",
    text: selectedBlueprint.text,
    kicker: "Blueprint applied",
    highlight: "Blueprint changed files, content, and database. Save to keep this result.",
  });
  document.getElementById("managerBlueprintState").textContent = "Ran just now";
  document.getElementById("managerBlueprintResult").textContent = `${selectedBlueprint.name} ran successfully and replaced the current Playground content.`;
  addActivity("green", `Blueprint <code>${selectedBlueprint.name}</code> completed and updated the active shell.`);
}

viewButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.viewTarget));
});

managerButtons.forEach((button) => {
  button.addEventListener("click", () => setManagerPanel(button.dataset.managerTarget));
});

document.getElementById("openManagerButton").addEventListener("click", () => setView("manager"));
document.getElementById("openLibraryButton").addEventListener("click", () => setView("save"));
document.getElementById("quickSaveButton").addEventListener("click", () => setView("save"));
document.getElementById("quickStartButton").addEventListener("click", () => setView("launch"));

document.getElementById("homeButton").addEventListener("click", () => {
  pathInput.value = "/";
  previewUrl.textContent = "playground.local/";
  pathState.textContent = "home";
  addActivity("blue", "Homepage shortcut changed the active path to <code>/</code>.");
});

document.getElementById("adminButton").addEventListener("click", () => {
  pathInput.value = "/wp-admin/";
  previewUrl.textContent = "playground.local/wp-admin/";
  pathState.textContent = "wp-admin";
  previewState.textContent = "WP Admin path";
  addActivity("blue", "WP Admin shortcut changed the active path to <code>/wp-admin/</code>.");
});

document.getElementById("refreshButton").addEventListener("click", () => {
  pathState.textContent = "refreshed";
  addActivity("blue", `Refreshed active WordPress page at <code>${pathInput.value}</code>.`);
});

pathInput.addEventListener("change", () => {
  const value = pathInput.value.startsWith("/") ? pathInput.value : `/${pathInput.value}`;
  pathInput.value = value;
  previewUrl.textContent = `playground.local${value}`;
  pathState.textContent = "navigated";
  addActivity("blue", `Path input navigated the preview to <code>${value}</code>.`);
});

document.getElementById("commandSearch").addEventListener("input", renderResults);

document.querySelector(".filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
  renderResults();
});

document.getElementById("commandResults").addEventListener("click", (event) => {
  const button = event.target.closest("[data-blueprint-id]");
  if (!button) return;
  selectBlueprint(button.dataset.blueprintId);
});

document.getElementById("validateBlueprintButton").addEventListener("click", () => {
  const validation = document.getElementById("blueprintValidation");
  try {
    JSON.parse(document.getElementById("blueprintEditor").value);
    validation.textContent = "JSON valid. Schema, landing page, and preferred versions are ready to run.";
    validation.className = "validation good";
    addActivity("green", `Validated Blueprint JSON for <code>${selectedBlueprint.name}</code>.`);
  } catch (error) {
    validation.textContent = `JSON error: ${error.message}`;
    validation.className = "validation bad";
  }
});

document.getElementById("copyBlueprintButton").addEventListener("click", () => {
  addActivity("blue", `Copied Blueprint URL for <code>${selectedBlueprint.name}</code>.`);
  document.getElementById("blueprintValidation").textContent = "Blueprint URL copied to clipboard state.";
});

document.getElementById("downloadBlueprintButton").addEventListener("click", () => {
  addActivity("blue", `Prepared Blueprint bundle download for <code>${selectedBlueprint.name}</code>.`);
  document.getElementById("blueprintValidation").textContent = "Blueprint bundle download prepared.";
});

document.getElementById("runBlueprintButton").addEventListener("click", () => {
  document.getElementById("blueprintWarning").hidden = false;
  addActivity("amber", `Replacement warning shown for <code>${selectedBlueprint.name}</code>.`);
});

document.getElementById("cancelBlueprintRun").addEventListener("click", () => {
  document.getElementById("blueprintWarning").hidden = true;
  addActivity("amber", "Blueprint replacement cancelled. Active Playground unchanged.");
});

document.getElementById("confirmBlueprintRun").addEventListener("click", () => {
  startProgress(document.getElementById("blueprintProgress"), [
    { title: "Running Blueprint", text: "Validating schema", width: 22 },
    { title: "Running Blueprint", text: "Replacing files", width: 48 },
    { title: "Running Blueprint", text: "Importing content and database", width: 76 },
    { title: "Blueprint complete", text: "Preview updated", width: 100 },
  ], completeBlueprintRun);
});

document.querySelector(".route-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-route]");
  if (!button) return;
  updateRouteDetail(button.dataset.route);
});

document.getElementById("validateRouteButton").addEventListener("click", () => {
  const route = routeData[selectedRoute];
  document.getElementById("routeResult").textContent = `${route.title} input validated. Replacement confirmation is required when current changes are unsaved.`;
  addActivity("green", `Validated launch input for <code>${route.title}</code>.`);
});

document.getElementById("runRouteButton").addEventListener("click", () => {
  if (selectedRoute === "zip") {
    document.getElementById("chooseZipButton").click();
    return;
  }
  const route = routeData[selectedRoute];
  startProgress(document.getElementById("routeProgress"), [
    { title: `Starting ${route.title}`, text: "Checking route input", width: 25 },
    { title: `Starting ${route.title}`, text: "Preparing WordPress runtime", width: 58 },
    { title: `${route.title} ready`, text: "Active identity updated", width: 100 },
  ], () => {
    const title = route.title === "Vanilla WordPress" ? "Unsaved Playground" : `${route.title} Preview`;
    updateShell({
      title,
      subtitle: `${route.title} route created a temporary Playground.`,
      storage: "temporary",
      path: "/",
      state: `${route.title} ready`,
      text: `${route.title} is now running in the protected WordPress preview.`,
      kicker: "Launch route complete",
      highlight: "This route is temporary until saved to browser storage or a local directory.",
    });
    document.getElementById("routeResult").textContent = `${route.title} completed. Shell title, path, storage badge, and preview state were updated.`;
    addActivity("green", `<code>${route.title}</code> route completed.`);
  });
});

document.getElementById("chooseZipButton").addEventListener("click", () => {
  document.getElementById("zipFileName").textContent = "agency-demo-playground.zip";
  document.getElementById("zipFileMeta").textContent = "Validated: WordPress files, blueprint.json, and SQLite database detected.";
  document.getElementById("zipWarning").hidden = false;
  document.getElementById("routeResult").textContent = "Archive selected and validated. Replacement confirmation is required.";
  addActivity("amber", "ZIP archive selected; replacement warning is active.");
});

document.getElementById("cancelZipButton").addEventListener("click", () => {
  document.getElementById("zipWarning").hidden = true;
  document.getElementById("routeResult").textContent = "ZIP import cancelled. Active Playground unchanged.";
  addActivity("amber", "ZIP import cancelled before replacement.");
});

document.getElementById("confirmZipButton").addEventListener("click", () => {
  document.getElementById("zipWarning").hidden = true;
  startProgress(document.getElementById("routeProgress"), [
    { title: "Importing ZIP", text: "Reading archive manifest", width: 18 },
    { title: "Importing ZIP", text: "Replacing WordPress files", width: 46 },
    { title: "Importing ZIP", text: "Restoring SQLite database", width: 78 },
    { title: "ZIP import complete", text: "Active identity updated", width: 100 },
  ], () => {
    updateShell({
      title: "Agency Demo Import",
      subtitle: "Imported from agency-demo-playground.zip. Temporary until saved.",
      storage: "imported",
      path: "/wp-admin/",
      state: "ZIP import complete",
      text: "The ZIP import replaced the active WordPress files and database. You are viewing the imported wp-admin state.",
      kicker: "ZIP import result",
      highlight: "Imported archive is temporary until saved. Browser/local save destinations remain distinct.",
    });
    savedSites = savedSites.map((site) => ({ ...site, active: false }));
    savedSites.unshift({ id: "zip-import", title: "Agency Demo Import", meta: "Imported .zip, not saved yet", storage: "temporary", active: true });
    renderSavedRows();
    document.getElementById("routeResult").textContent = "ZIP import succeeded. Active Playground identity, path, saved rows, transfer history, and preview changed.";
    addActivity("green", "ZIP import succeeded and replaced the active Playground.");
  });
});

document.querySelectorAll('input[name="saveDestination"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const destination = document.querySelector('input[name="saveDestination"]:checked').value;
    document.getElementById("localPermission").hidden = destination !== "local";
    document.getElementById("saveResult").textContent = destination === "local"
      ? "Local directory save will open a folder picker and stores files outside browser storage."
      : "Browser save will create a saved Playground row and slug in this browser.";
  });
});

document.getElementById("startSaveButton").addEventListener("click", () => {
  const destination = document.querySelector('input[name="saveDestination"]:checked').value;
  const title = document.getElementById("saveName").value.trim() || "Saved Playground";
  const progress = document.getElementById("saveProgress");
  const destinationText = destination === "local" ? "Writing to ~/Sites/blueprint-console" : "Copying into browser storage";
  startProgress(progress, [
    { title: "Saving Playground", text: `${destinationText}: 402 / 3751 files`, width: 18 },
    { title: "Saving Playground", text: `${destinationText}: 1902 / 3751 files`, width: 52 },
    { title: "Saving Playground", text: `${destinationText}: 3320 / 3751 files`, width: 84 },
    { title: "Save complete", text: "Saved identity created", width: 100 },
  ], () => {
    const result = upsertSavedSite(title, destination);
    updateShell({
      title,
      subtitle: result.meta,
      storage: destination,
      path: destination === "browser" ? `/${result.slug}/` : "/",
      state: destination === "browser" ? "Saved in browser" : "Local directory saved",
      text: `${title} is saved to ${destination === "browser" ? "browser storage with a slug URL" : "a local directory with folder permission"}.`,
      kicker: "Save complete",
      highlight: destination === "browser" ? "Browser storage restores on this browser." : "Local directory files can be inspected outside Playground and may need reconnect after reload.",
    });
    document.getElementById("saveResult").textContent = destination === "browser"
      ? `Saved in this browser as ${result.slug}. Saved row is now active.`
      : "Saved to local directory ~/Sites/blueprint-console. Folder-backed row is now active.";
    addActivity("green", `${destination === "browser" ? "Browser" : "Local directory"} save completed for <code>${title}</code>.`);
  });
});

document.getElementById("cancelSaveButton").addEventListener("click", () => {
  document.getElementById("saveProgress").hidden = true;
  document.getElementById("saveResult").textContent = "Save cancelled. The current Playground storage state did not change.";
  addActivity("amber", "Save flow cancelled before writing files.");
});

document.getElementById("savedRows").addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-row-action]");
  if (!actionButton) return;
  const row = actionButton.closest("[data-site-id]");
  const id = row.dataset.siteId;
  const site = savedSites.find((item) => item.id === id);
  const action = actionButton.dataset.rowAction;
  if (action === "open") {
    setActiveSaved(id);
    addActivity("blue", `Opened saved row <code>${site.title}</code>.`);
  }
  if (action === "manage") {
    setActiveSaved(id);
    setView("manager");
    addActivity("blue", `Opened Site Manager for <code>${site.title}</code>.`);
  }
  if (action === "rename") {
    site.title = `${site.title} Renamed`;
    site.meta = `${site.meta}; renamed just now`;
    if (site.active) {
      updateShell({ title: site.title, subtitle: site.meta });
    }
    renderSavedRows();
    addActivity("green", `Renamed saved row to <code>${site.title}</code>.`);
  }
  if (action === "delete") {
    deleteTargetId = id;
    document.getElementById("deleteTitle").textContent = `Delete ${site.title}?`;
    document.getElementById("deleteConfirm").hidden = false;
    addActivity("amber", `Delete confirmation opened for <code>${site.title}</code>.`);
  }
});

document.getElementById("cancelDeleteButton").addEventListener("click", () => {
  document.getElementById("deleteConfirm").hidden = true;
  deleteTargetId = null;
  addActivity("amber", "Delete cancelled. Saved rows unchanged.");
});

document.getElementById("confirmDeleteButton").addEventListener("click", () => {
  if (!deleteTargetId) return;
  const deleted = savedSites.find((site) => site.id === deleteTargetId);
  const wasActive = deleted?.active;
  savedSites = savedSites.filter((site) => site.id !== deleteTargetId);
  if (wasActive && savedSites.length) {
    savedSites[0].active = true;
    updateShell({
      title: savedSites[0].title,
      subtitle: savedSites[0].meta,
      storage: savedSites[0].storage === "browser" ? "browser" : savedSites[0].storage === "local" ? "local" : "temporary",
      path: "/hello-from-playground/",
      state: "Fallback object active",
      text: "The deleted active Playground was removed. The shell fell back to the next available Playground.",
      kicker: "Delete complete",
      highlight: "Deletion removed the saved row and changed the active object.",
    });
  }
  document.getElementById("deleteConfirm").hidden = true;
  addActivity("green", `Deleted saved row <code>${deleted?.title || "Playground"}</code>; library list updated.`);
  deleteTargetId = null;
  renderSavedRows();
});

document.getElementById("newUnsavedButton").addEventListener("click", () => {
  savedSites = savedSites.map((site) => ({ ...site, active: false }));
  savedSites.unshift({ id: `temporary-${Date.now()}`, title: "Unsaved Playground", meta: "Temporary, not saved to browser storage", storage: "temporary", active: true });
  renderSavedRows();
  updateShell({
    title: "Unsaved Playground",
    subtitle: "Temporary session. Not saved to browser storage.",
    storage: "temporary",
    path: "/hello-from-playground/",
    state: "New unsaved Playground",
    text: "A fresh temporary Playground is active.",
    kicker: "New temporary site",
    highlight: "Refresh or close will lose this Playground until it is saved.",
  });
});

document.getElementById("fileEditor").addEventListener("input", () => {
  document.getElementById("fileState").textContent = "Dirty";
  document.getElementById("fileResult").textContent = "wp-config.php has unsaved edits. Save file to apply changes.";
});

document.getElementById("saveFileButton").addEventListener("click", () => {
  document.getElementById("fileState").textContent = "Saved";
  document.getElementById("fileResult").textContent = "wp-config.php saved successfully. File editor returned a result state.";
  addActivity("green", "Saved edited file <code>/wordpress/wp-config.php</code>.");
});

document.getElementById("newFileButton").addEventListener("click", () => {
  document.getElementById("fileTitle").textContent = "new-playground-note.php";
  document.getElementById("fileState").textContent = "New file";
  document.getElementById("fileResult").textContent = "Created /wordpress/wp-content/new-playground-note.php. Save file to persist it.";
  addActivity("blue", "Created a new file in the file browser.");
});

document.getElementById("newFolderButton").addEventListener("click", () => {
  document.getElementById("fileResult").textContent = "Created folder /wordpress/wp-content/playground-notes/.";
  addActivity("blue", "Created a new folder in the file browser.");
});

document.getElementById("uploadFileButton").addEventListener("click", () => {
  document.getElementById("fileResult").textContent = "Uploaded plugin-demo.php to /wordpress/wp-content/uploads/.";
  addActivity("green", "Uploaded a file through the file browser.");
});

document.getElementById("browseFilesButton").addEventListener("click", () => {
  document.getElementById("fileResult").textContent = "Native file browser opened; selected wp-config.php remains active in the editor.";
});

document.getElementById("managerRunBlueprint").addEventListener("click", () => {
  setView("blueprints");
  document.getElementById("blueprintWarning").hidden = false;
  addActivity("amber", "Site Manager Blueprint run sent to command console for replacement confirmation.");
});

document.getElementById("managerCopyBlueprint").addEventListener("click", () => {
  document.getElementById("managerBlueprintResult").textContent = "Current blueprint.json link copied.";
  addActivity("blue", "Copied Blueprint link from Site Manager.");
});

document.getElementById("managerDownloadBlueprint").addEventListener("click", () => {
  document.getElementById("managerBlueprintResult").textContent = "Blueprint bundle download prepared.";
  addActivity("blue", "Prepared Blueprint bundle download from Site Manager.");
});

document.getElementById("applySettingsButton").addEventListener("click", () => {
  const saved = activeStorage === "browser" || activeStorage === "local";
  updateShell({
    subtitle: saved ? "Settings saved and Playground reloaded." : "Settings reset completed; temporary data was rebuilt.",
    storage: saved ? activeStorage : "temporary",
    path: "/",
    state: saved ? "Save & Reload complete" : "Reset complete",
    text: saved ? "Saved settings were applied with Save & Reload." : "Settings reset rebuilt this temporary Playground.",
    kicker: saved ? "Saved settings applied" : "Settings reset",
    highlight: saved ? "Saved identity remains available after reload." : "Temporary file and database changes were discarded by reset.",
  });
  addActivity(saved ? "green" : "amber", saved ? "Save & Reload completed for stored Playground." : "Destructive settings reset completed for temporary Playground.");
});

["managerHome", "managerAdmin"].forEach((id) => {
  document.getElementById(id).addEventListener("click", () => {
    document.getElementById(id === "managerHome" ? "homeButton" : "adminButton").click();
  });
});

document.getElementById("downloadDbButton").addEventListener("click", () => {
  document.getElementById("databaseResult").textContent = "database.sqlite download prepared. Size: 452 KB.";
  addActivity("blue", "Prepared <code>database.sqlite</code> download.");
});

document.getElementById("adminerButton").addEventListener("click", () => {
  document.getElementById("databaseResult").textContent = "Adminer opened in a new tool window state.";
});

document.getElementById("phpMyAdminButton").addEventListener("click", () => {
  document.getElementById("databaseResult").textContent = "phpMyAdmin opened in a new tool window state.";
});

document.getElementById("exportGithubButton").addEventListener("click", () => {
  addActivity("blue", "GitHub account connected; export target <code>playground-lab/demo</code> selected.");
  window.setTimeout(() => addActivity("green", "Export to GitHub completed for the current Playground bundle."), 550);
});

document.getElementById("downloadZipButton").addEventListener("click", () => {
  addActivity("green", "Generated and downloaded current Playground <code>.zip</code> archive.");
});

document.getElementById("transferZipButton").addEventListener("click", () => {
  setView("launch");
  updateRouteDetail("zip");
  document.getElementById("chooseZipButton").click();
});

document.getElementById("transferDbButton").addEventListener("click", () => {
  document.getElementById("downloadDbButton").click();
});

document.getElementById("transferBlueprintButton").addEventListener("click", () => {
  document.getElementById("copyBlueprintButton").click();
});

document.getElementById("clearHistoryButton").addEventListener("click", () => {
  activityList.innerHTML = "<li><span class=\"blue\">History</span> Resolved transfer history cleared.</li>";
});

renderResults();
renderSavedRows();
updateRouteDetail("vanilla");
