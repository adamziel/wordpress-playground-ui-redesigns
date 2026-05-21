const state = {
  mode: "save",
  managerTab: "settings",
  activeId: "temp",
  activeLog: "Playground",
  pendingRoute: null,
  deleteTarget: null,
  selectedBlueprint: "art-gallery",
  databaseDownloadState: "idle",
  playground: {
    id: "temp",
    name: "Unsaved Playground",
    path: "/hello-from-playground/",
    storage: "temporary",
    folder: null,
    slug: null,
    saveState: "unsaved",
    preview: "welcome"
  },
  savedSites: [
    {
      id: "temp",
      name: "Unsaved Playground",
      storage: "temporary",
      detail: "Not saved. Browser refresh removes this filesystem and database.",
      path: "/hello-from-playground/",
      active: true
    },
    {
      id: "browser-research",
      name: "Research Browser Playground",
      storage: "browser",
      detail: "Saved in this browser on May 21, 2026.",
      path: "/wp-admin/",
      slug: "research-browser-playground",
      active: false
    }
  ],
  transferHistory: [
    { type: "Session", status: "Ready", detail: "Temporary Playground opened at /hello-from-playground/." }
  ],
  logs: [
    { source: "Playground", level: "info", message: "Booted WordPress with PHP 8.3 and latest WordPress.", time: "10:22" },
    { source: "WordPress", level: "notice", message: "Homepage rendered while logged in as admin.", time: "10:22" },
    { source: "PHP", level: "info", message: "No PHP errors so far.", time: "10:22" }
  ]
};

const blueprints = [
  {
    id: "art-gallery",
    name: "Art Gallery",
    desc: "An art gallery created with the Vueo theme.",
    tags: ["Website", "Personal"],
    thumb: "art"
  },
  {
    id: "coffee-shop",
    name: "Coffee Shop",
    desc: "A stylish WooCommerce coffee shop storefront with products and content.",
    tags: ["WooCommerce", "Store"],
    thumb: "coffee"
  },
  {
    id: "feed-reader",
    name: "Feed Reader with the Friends Plugin",
    desc: "Read feeds from the web in Playground using the Friends plugin.",
    tags: ["Content", "social web"],
    thumb: "feed"
  },
  {
    id: "gaming-news",
    name: "Gaming News",
    desc: "A gaming news site created with the Spiel theme.",
    tags: ["Website", "News"],
    thumb: "news"
  },
  {
    id: "nonprofit",
    name: "Non-profit Organization",
    desc: "A non-profit organization site created with the Koinonia theme.",
    tags: ["Website", "Organization"],
    thumb: "nonprofit"
  },
  {
    id: "personal-blog",
    name: "Personal Blog",
    desc: "A personal blog created with the Substrata theme.",
    tags: ["Personal", "Blog"],
    thumb: "blog"
  }
];

const categories = ["All", "Featured", "Website", "Personal", "Content", "Themes", "Gutenberg", "Experiments", "WooCommerce", "News"];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function storageBadge(storage) {
  if (storage === "local") return { label: "Local directory", tone: "green" };
  if (storage === "browser") return { label: "Saved in browser", tone: "blue" };
  return { label: "Temporary", tone: "amber" };
}

function nowTime() {
  return "10:" + String(23 + state.transferHistory.length).padStart(2, "0");
}

function pushLog(source, level, message) {
  state.logs.unshift({ source, level, message, time: nowTime() });
  renderLogs();
}

function pushTransfer(type, status, detail) {
  state.transferHistory.unshift({ type, status, detail });
  renderTransferHistory();
}

function setSelectedCommand(text) {
  $("#selectedCommand").textContent = "Selected command: " + text;
}

function updateShell() {
  const active = state.playground;
  const badge = storageBadge(active.storage);
  $("#shellTitle").textContent = active.name;
  $("#storageBadge").textContent = badge.label;
  $("#storageBadge").className = "badge " + badge.tone;
  $("#pathInput").value = active.path;
  $("#siteName").textContent = active.storage === "local" ? active.name : "My WordPress Website";
  $("#wpAdminSite").textContent = active.name;

  let identity = "Not saved. Refreshing the browser loses this Playground.";
  let consequence = "Reload consequence: temporary site resets unless saved.";
  if (active.storage === "local") {
    identity = "Folder: " + active.folder + ". Permission granted for this browser session.";
    consequence = "Reload consequence: reconnect or confirm folder permission to keep local files mounted.";
  }
  if (active.storage === "browser") {
    identity = "Slug: /" + active.slug + "/. Stored in this browser profile.";
    consequence = "Reload consequence: opens saved browser copy; settings use Save & Reload.";
  }
  $("#identityLine").textContent = identity;
  $("#reloadConsequence").textContent = consequence;

  $("#wpFrame").classList.toggle("local", active.storage === "local");
  $("#wpFrame").classList.toggle("browser-saved", active.storage === "browser");

  if (active.preview === "admin") {
    $("#previewHeading").innerHTML = "Dashboard <span>WP Admin</span>";
    $("#previewBody").textContent = "Posts, pages, comments, plugins, themes, and site health are available for the active Playground.";
    $("#previewNotice").textContent = "Admin route loaded at /wp-admin/.";
  } else if (active.preview === "fresh") {
    $("#previewHeading").innerHTML = "Fresh <span>WordPress</span>";
    $("#previewBody").textContent = "A new vanilla WordPress Playground replaced the previous temporary runtime.";
    $("#previewNotice").textContent = "The replacement flow completed.";
  } else if (active.preview === "blueprint") {
    $("#previewHeading").innerHTML = "Blueprint <span>Applied</span>";
    $("#previewBody").textContent = "The selected Blueprint updated content, runtime preferences, and landing page for this Playground.";
    $("#previewNotice").textContent = "Blueprint run completed with valid JSON.";
  } else if (active.preview === "database") {
    $("#previewHeading").innerHTML = "Database <span>Downloaded</span>";
    $("#previewBody").textContent = "The SQLite-backed database was packaged as database.sqlite without interrupting the running site.";
    $("#previewNotice").textContent = "Database operation recorded in logs and transfer history.";
  } else {
    $("#previewHeading").innerHTML = "Hello from <span>WordPress Playground!</span>";
    $("#previewBody").textContent = "This is Playground, a WordPress that runs client-side in your browser. It is perfect for training, demonstrating plugins and themes, and for testing purposes.";
    $("#previewNotice").textContent = "Note that you are logged-in as admin!";
  }

  renderSavedList();
  renderDatabaseTools();
}

function setMode(mode) {
  state.mode = mode;
  $$(".rail-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
  $$(".panel").forEach((panel) => panel.classList.remove("active"));
  $("#panel-" + mode).classList.add("active");
  $("#modeTitle").textContent = $("#panel-" + mode).dataset.title;
  const labels = {
    create: "Create or import Playground",
    save: "Save to local directory",
    library: "Manage saved identity",
    manage: "Site Manager",
    blueprints: "Browse Blueprint gallery",
    data: "Database tools",
    logs: "Inspect logs",
    transfer: "Portability action"
  };
  setSelectedCommand(labels[mode]);
}

function markSaveIdle() {
  $("#folderPrompt").classList.add("hidden");
  $("#saveProgressBox").classList.add("hidden");
  $("#saveResult").classList.add("hidden");
}

function runProgress({ text, count, onTick, onDone }) {
  let step = 0;
  const totalSteps = 7;
  const interval = window.setInterval(() => {
    step += 1;
    const files = Math.min(count, Math.round((count / totalSteps) * step));
    const pct = Math.round((files / count) * 100);
    $("#saveProgressText").textContent = text;
    $("#saveProgressCount").textContent = files + " / " + count;
    $("#saveProgressBar").style.width = pct + "%";
    if (onTick) onTick(files, pct);
    if (step >= totalSteps) {
      window.clearInterval(interval);
      if (onDone) onDone();
    }
  }, 180);
}

function completeLocalSave() {
  const name = $("#localName").value.trim() || "Local Directory Playground";
  state.playground = {
    ...state.playground,
    id: "local-client-demo",
    name,
    storage: "local",
    folder: "~/Sites/client-demo-local",
    slug: null,
    saveState: "saved"
  };
  state.activeId = "local-client-demo";
  const transformed = {
    id: "local-client-demo",
    name,
    storage: "local",
    detail: "Folder ~/Sites/client-demo-local granted. Reload asks to confirm folder access.",
    path: state.playground.path,
    folder: "~/Sites/client-demo-local",
    active: true
  };
  state.savedSites = state.savedSites.filter((site) => site.id !== "temp" && site.id !== "local-client-demo");
  state.savedSites.unshift(transformed);
  state.savedSites.push({
    id: "temp-next",
    name: "Unsaved Playground",
    storage: "temporary",
    detail: "New temporary slot available for the next launch or import.",
    path: "/hello-from-playground/",
    active: false
  });
  $("#permissionLine").innerHTML = '<span class="state-dot green"></span><span>Permission granted for ~/Sites/client-demo-local.</span>';
  $("#saveResult").classList.remove("hidden");
  $("#saveResultText").textContent = "Folder connected. Reload will ask to confirm folder access, then remount " + name + ".";
  $("#previewStatus").textContent = "Saved to local directory";
  pushTransfer("Local directory save", "Completed", name + " transformed the temporary row into a local folder-backed Playground.");
  pushLog("Playground", "info", "Saved active Playground to ~/Sites/client-demo-local with folder permission granted.");
  updateShell();
}

function completeBrowserSave() {
  const name = $("#browserName").value.trim() || "Research Browser Playground";
  state.playground = {
    ...state.playground,
    id: "browser-research",
    name,
    storage: "browser",
    folder: null,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    saveState: "saved"
  };
  state.activeId = "browser-research";
  const existing = state.savedSites.find((site) => site.id === "browser-research");
  if (existing) {
    existing.name = name;
    existing.storage = "browser";
    existing.detail = "Saved in this browser a moment ago.";
    existing.path = state.playground.path;
    existing.slug = state.playground.slug;
  } else {
    state.savedSites.unshift({
      id: "browser-research",
      name,
      storage: "browser",
      detail: "Saved in this browser a moment ago.",
      path: state.playground.path,
      slug: state.playground.slug
    });
  }
  state.savedSites.forEach((site) => site.active = site.id === state.activeId);
  $("#saveResult").classList.remove("hidden");
  $("#saveResultText").textContent = "Browser copy saved at /" + state.playground.slug + "/ and selected in the library.";
  $("#previewStatus").textContent = "Saved in browser";
  pushTransfer("Browser save", "Completed", name + " stored in this browser with slug /" + state.playground.slug + "/.");
  pushLog("Playground", "info", "Saved active Playground to browser storage.");
  updateShell();
}

function renderSavedList() {
  const container = $("#savedList");
  if (!container) return;
  container.innerHTML = state.savedSites.map((site) => {
    const badge = storageBadge(site.storage);
    const active = site.id === state.activeId ? " active" : "";
    const folder = site.folder ? `<span class="muted">${site.folder}</span>` : "";
    return `
      <article class="saved-row${active}" data-site-id="${site.id}">
        <div class="saved-row-head">
          <div>
            <strong>${site.name}</strong>
            <div class="muted">${site.detail}</div>
            ${folder}
          </div>
          <span class="badge ${badge.tone}">${badge.label}</span>
        </div>
        <div class="saved-row-actions">
          <button class="secondary small open-site" data-site-id="${site.id}">Open</button>
          <button class="secondary small manage-site" data-site-id="${site.id}">Manage</button>
          <button class="secondary small rename-site" data-site-id="${site.id}">Rename</button>
          <button class="danger small delete-site" data-site-id="${site.id}">Delete</button>
        </div>
      </article>
    `;
  }).join("");
}

function openSite(siteId) {
  const site = state.savedSites.find((item) => item.id === siteId);
  if (!site) return;
  state.activeId = site.id;
  state.playground = {
    ...state.playground,
    id: site.id,
    name: site.name,
    path: site.path,
    storage: site.storage,
    folder: site.folder || null,
    slug: site.slug || null,
    preview: site.storage === "temporary" ? "welcome" : state.playground.preview
  };
  state.savedSites.forEach((item) => item.active = item.id === siteId);
  $("#previewStatus").textContent = "Opened " + site.name;
  pushLog("Playground", "info", "Opened " + site.name + " from the saved library.");
  updateShell();
}

function renameSite(siteId) {
  const site = state.savedSites.find((item) => item.id === siteId);
  if (!site) return;
  const next = window.prompt("Rename Playground", site.name);
  if (!next || !next.trim()) return;
  site.name = next.trim();
  site.detail = site.storage === "temporary" ? site.detail : "Renamed a moment ago.";
  if (site.id === state.activeId) {
    state.playground.name = site.name;
  }
  pushLog("Playground", "info", "Renamed saved Playground to " + site.name + ".");
  updateShell();
}

function confirmDelete(siteId) {
  const site = state.savedSites.find((item) => item.id === siteId);
  if (!site) return;
  state.deleteTarget = siteId;
  $("#deleteText").textContent = "Delete " + site.name + "? This removes its saved identity. If it is active, the shell falls back to an unsaved Playground.";
  $("#deleteConfirm").classList.remove("hidden");
}

function deleteSite() {
  const id = state.deleteTarget;
  const site = state.savedSites.find((item) => item.id === id);
  if (!site) return;
  state.savedSites = state.savedSites.filter((item) => item.id !== id);
  if (state.activeId === id) {
    const fallback = {
      id: "temp-fallback",
      name: "Unsaved Playground",
      storage: "temporary",
      detail: "Fallback created after deleting the active saved Playground.",
      path: "/hello-from-playground/",
      active: true
    };
    state.savedSites.unshift(fallback);
    state.activeId = fallback.id;
    state.playground = {
      id: fallback.id,
      name: fallback.name,
      path: fallback.path,
      storage: "temporary",
      folder: null,
      slug: null,
      saveState: "unsaved",
      preview: "welcome"
    };
  }
  state.savedSites.forEach((item) => item.active = item.id === state.activeId);
  $("#deleteConfirm").classList.add("hidden");
  $("#previewStatus").textContent = "Deleted saved identity";
  pushTransfer("Delete Playground", "Completed", site.name + " removed from the saved library.");
  pushLog("Playground", "warning", "Deleted saved Playground: " + site.name + ".");
  state.deleteTarget = null;
  updateShell();
}

function renderDatabaseTools() {
  const html = `
    <div class="database-card">
      <div class="status-strip">
        <strong>Database management is an early access feature</strong>
        <span>WordPress Playground emulates MySQL using SQLite.</span>
      </div>
      <div class="metric-grid">
        <div class="metric"><span>Driver</span><strong>MySQL emulation backed by SQLite</strong></div>
        <div class="metric"><span>SQLite database path</span><strong>/wordpress/wp-content/database/.ht.sqlite</strong></div>
        <div class="metric"><span>Size</span><strong id="dbSizeText">452 KB</strong></div>
        <div class="metric"><span>Selected operation</span><strong>${state.databaseDownloadState === "done" ? "database.sqlite downloaded" : "Ready to download"}</strong></div>
      </div>
      <div class="button-row">
        <button class="primary db-download">Download database.sqlite</button>
        <button class="secondary open-adminer">Open Adminer</button>
        <button class="secondary open-phpmyadmin">Open phpMyAdmin</button>
      </div>
      <div class="progress-box hidden db-progress">
        <div class="progress-label"><span>Packaging SQLite database...</span><span class="db-progress-count">0%</span></div>
        <div class="progress-track"><span class="db-progress-bar"></span></div>
      </div>
      <p class="muted db-result">${state.databaseDownloadState === "done" ? "database.sqlite downloaded and transfer history updated." : "No database operation has run in this session."}</p>
    </div>
  `;
  $("#databaseTools").innerHTML = html;
  $("#manager-database").innerHTML = html;
  $("#manager-logs").innerHTML = `<div class="log-list">${logEntriesHtml(state.logs.slice(0, 4))}</div>`;
}

function runDatabaseDownload() {
  state.databaseDownloadState = "running";
  setMode("data");
  setSelectedCommand("Download database.sqlite");
  renderDatabaseTools();
  const boxes = $$(".db-progress");
  boxes.forEach((box) => box.classList.remove("hidden"));
  let pct = 0;
  const interval = window.setInterval(() => {
    pct += 20;
    $$(".db-progress-bar").forEach((bar) => bar.style.width = pct + "%");
    $$(".db-progress-count").forEach((label) => label.textContent = pct + "%");
    if (pct >= 100) {
      window.clearInterval(interval);
      state.databaseDownloadState = "done";
      state.playground.preview = "database";
      $("#previewStatus").textContent = "Database downloaded";
      pushTransfer("Database download", "Completed", "database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite.");
      pushLog("Playground", "info", "database.sqlite download completed successfully.");
      pushLog("PHP", "notice", "SQLite database package size was 452 KB.");
      updateShell();
      setMode("data");
    }
  }, 160);
}

function logEntriesHtml(entries) {
  return entries.map((entry) => {
    const tone = entry.level === "warning" ? "amber" : entry.level === "error" ? "red" : "blue";
    return `
      <article class="log-entry">
        <strong>${entry.source}<span class="badge ${tone}">${entry.level} ${entry.time}</span></strong>
        <span>${entry.message}</span>
      </article>
    `;
  }).join("");
}

function renderLogs() {
  const filtered = state.logs.filter((entry) => entry.source === state.activeLog);
  $("#logList").innerHTML = logEntriesHtml(filtered.length ? filtered : [{ source: state.activeLog, level: "info", message: "No problems so far.", time: nowTime() }]);
  const managerLogs = $("#manager-logs");
  if (managerLogs) managerLogs.innerHTML = `<div class="log-list">${logEntriesHtml(state.logs.slice(0, 4))}</div>`;
}

function renderTransferHistory() {
  $("#transferHistory").innerHTML = state.transferHistory.map((item) => `
    <article class="transfer-row">
      <strong>${item.type}<span class="badge ${item.status === "Completed" ? "green" : "blue"}">${item.status}</span></strong>
      <span class="muted">${item.detail}</span>
    </article>
  `).join("");
}

function renderBlueprints() {
  $("#categoryFilters").innerHTML = categories.map((category, index) => `
    <button class="filter-chip ${index === 0 ? "active" : ""}" data-category="${category}">${category}</button>
  `).join("");
  updateBlueprintGrid();
}

function updateBlueprintGrid(category = "All") {
  const query = ($("#blueprintSearch").value || "").toLowerCase();
  const filtered = blueprints.filter((bp) => {
    const categoryMatch = category === "All" || category === "Featured" || bp.tags.includes(category);
    const text = (bp.name + " " + bp.desc + " " + bp.tags.join(" ")).toLowerCase();
    return categoryMatch && text.includes(query);
  });
  $("#blueprintGrid").innerHTML = filtered.map((bp) => `
    <button class="blueprint-card ${bp.id === state.selectedBlueprint ? "active" : ""}" data-blueprint-id="${bp.id}">
      <div class="blueprint-thumb ${bp.thumb}"></div>
      <div class="blueprint-body">
        <strong>${bp.name}</strong>
        <span class="muted">${bp.desc}</span>
        <span class="tag-row">${bp.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</span>
      </div>
    </button>
  `).join("");
  renderBlueprintDetail();
}

function renderBlueprintDetail() {
  const bp = blueprints.find((item) => item.id === state.selectedBlueprint) || blueprints[0];
  $("#blueprintDetail").innerHTML = `
    <h3>${bp.name}</h3>
    <p>${bp.desc}</p>
    <div class="tag-row">${bp.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
    <label class="field"><span>Blueprint URL</span><input value="https://playground.wordpress.net/blueprints/${bp.id}.json"></label>
    <div class="button-row">
      <button class="secondary" id="copySelectedBlueprint">Copy URL</button>
      <button class="secondary" id="downloadSelectedBlueprint">Download</button>
      <button class="primary" id="runSelectedBlueprint">Run selected Blueprint</button>
    </div>
    <p class="muted">6 representative cards shown from the 43 available Blueprints.</p>
  `;
}

function runBlueprint(name) {
  state.playground.preview = "blueprint";
  state.playground.path = "/hello-from-playground/";
  $("#previewStatus").textContent = "Blueprint applied";
  pushTransfer("Blueprint run", "Completed", name + " validated and ran against the active Playground.");
  pushLog("Playground", "info", "Blueprint run completed: " + name + ".");
  updateShell();
}

function requestReplace(route) {
  state.pendingRoute = route;
  const labels = {
    vanilla: "Start a clean Vanilla WordPress Playground",
    "wp-pr": "Preview a WordPress pull request",
    gutenberg: "Preview a Gutenberg PR or branch",
    "blueprint-url": "Run a Blueprint URL",
    zip: "Import a .zip archive"
  };
  $("#replaceText").textContent = labels[route] + ". This replaces the current filesystem and database if confirmed.";
  $("#replaceConfirm").classList.remove("hidden");
}

function finishReplace() {
  const route = state.pendingRoute || "vanilla";
  const routeName = {
    vanilla: "Vanilla WordPress",
    "wp-pr": "WordPress PR preview",
    gutenberg: "Gutenberg preview",
    "blueprint-url": "Blueprint URL",
    zip: "ZIP import"
  }[route];
  state.playground = {
    id: "temp-" + route,
    name: routeName,
    storage: "temporary",
    folder: null,
    slug: null,
    path: route === "wp-pr" || route === "gutenberg" ? "/wp-admin/" : "/hello-from-playground/",
    saveState: "unsaved",
    preview: route === "blueprint-url" ? "blueprint" : "fresh"
  };
  state.activeId = state.playground.id;
  state.savedSites.unshift({
    id: state.playground.id,
    name: state.playground.name,
    storage: "temporary",
    detail: "Temporary replacement created from " + routeName + ". Save it before refresh.",
    path: state.playground.path,
    active: true
  });
  state.savedSites.forEach((site) => site.active = site.id === state.activeId);
  $("#replaceConfirm").classList.add("hidden");
  $("#previewStatus").textContent = routeName + " started";
  pushTransfer(routeName, "Completed", "Replacement flow confirmed and active Playground updated.");
  pushLog("Playground", "warning", routeName + " replaced the previous temporary runtime.");
  updateShell();
}

function genericTransfer(type) {
  setMode("transfer");
  setSelectedCommand(type);
  pushTransfer(type, "Completed", type + " prepared for the active Playground.");
  pushLog("Playground", "info", type + " completed from the transfer center.");
}

function bindEvents() {
  $$(".rail-item").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
  $$("[data-mode-shortcut]").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.modeShortcut)));

  $("#refreshBtn").addEventListener("click", () => {
    $("#previewStatus").textContent = state.playground.storage === "local" ? "Reloaded after folder permission check" : "Refreshed current page";
    pushLog("Playground", "info", "Refreshed " + state.playground.path + ".");
  });
  $("#goPathBtn").addEventListener("click", () => {
    state.playground.path = $("#pathInput").value || "/";
    state.playground.preview = state.playground.path.includes("wp-admin") ? "admin" : "welcome";
    $("#previewStatus").textContent = "Navigated to " + state.playground.path;
    pushLog("WordPress", "info", "Navigated embedded site to " + state.playground.path + ".");
    updateShell();
  });
  $("#homeBtn").addEventListener("click", () => {
    state.playground.path = "/hello-from-playground/";
    state.playground.preview = "welcome";
    $("#previewStatus").textContent = "Homepage opened";
    updateShell();
  });
  $("#adminBtn").addEventListener("click", () => {
    state.playground.path = "/wp-admin/";
    state.playground.preview = "admin";
    $("#previewStatus").textContent = "WP Admin opened";
    updateShell();
  });

  $("#chooseFolderBtn").addEventListener("click", () => {
    markSaveIdle();
    $("#folderPrompt").classList.remove("hidden");
    $("#permissionLine").innerHTML = '<span class="state-dot amber"></span><span>Waiting for browser folder permission...</span>';
    setSelectedCommand("Choose local folder");
  });
  $("#denyFolderBtn").addEventListener("click", () => {
    $("#permissionLine").innerHTML = '<span class="state-dot red"></span><span>Permission denied. Local save cannot continue until a folder is granted.</span>';
    pushLog("Playground", "warning", "Local directory permission was denied.");
  });
  $("#cancelFolderBtn").addEventListener("click", () => {
    $("#folderPrompt").classList.add("hidden");
    $("#permissionLine").innerHTML = '<span class="state-dot amber"></span><span>Folder picker cancelled. Playground remains temporary.</span>';
    pushLog("Playground", "info", "Local directory picker cancelled.");
  });
  $("#grantFolderBtn").addEventListener("click", () => {
    $("#folderPrompt").classList.add("hidden");
    $("#saveProgressBox").classList.remove("hidden");
    $("#saveProgressBar").style.width = "0";
    $("#permissionLine").innerHTML = '<span class="state-dot green"></span><span>Permission granted. Copying WordPress files...</span>';
    runProgress({
      text: "Saving WordPress files to ~/Sites/client-demo-local",
      count: 3751,
      onDone: completeLocalSave
    });
  });
  $("#browserSaveBtn").addEventListener("click", () => {
    markSaveIdle();
    $("#saveProgressBox").classList.remove("hidden");
    $("#saveProgressBar").style.width = "0";
    setSelectedCommand("Save in this browser");
    runProgress({
      text: "Saving files to browser storage",
      count: 3751,
      onDone: completeBrowserSave
    });
  });

  $("#savedList").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const id = button.dataset.siteId;
    if (button.classList.contains("open-site")) openSite(id);
    if (button.classList.contains("manage-site")) {
      openSite(id);
      setMode("manage");
    }
    if (button.classList.contains("rename-site")) renameSite(id);
    if (button.classList.contains("delete-site")) confirmDelete(id);
  });
  $("#confirmDeleteBtn").addEventListener("click", deleteSite);
  $("#cancelDeleteBtn").addEventListener("click", () => $("#deleteConfirm").classList.add("hidden"));

  $$(".start-route").forEach((button) => button.addEventListener("click", () => requestReplace(button.dataset.route)));
  $("#runBlueprintUrlBtn").addEventListener("click", () => requestReplace("blueprint-url"));
  $("#zipImportBtn").addEventListener("click", () => requestReplace("zip"));
  $("#zipTransferBtn").addEventListener("click", () => {
    setMode("create");
    requestReplace("zip");
  });
  $("#confirmReplaceBtn").addEventListener("click", finishReplace);
  $("#cancelReplaceBtn").addEventListener("click", () => $("#replaceConfirm").classList.add("hidden"));
  $("#connectGithubBtn").addEventListener("click", () => {
    pushTransfer("GitHub import", "Ready", "Account connected. Token is session-only and must be reauthenticated after refresh.");
    pushLog("Playground", "info", "GitHub account connected for import.");
  });

  $$(".manager-tab").forEach((button) => {
    button.addEventListener("click", () => {
      state.managerTab = button.dataset.managerTab;
      $$(".manager-tab").forEach((tab) => tab.classList.toggle("active", tab === button));
      $$(".manager-panel").forEach((panel) => panel.classList.remove("active"));
      $("#manager-" + state.managerTab).classList.add("active");
      setSelectedCommand("Site Manager: " + button.textContent);
    });
  });

  $("#resetBtn").addEventListener("click", () => requestReplace("vanilla"));
  $("#fileEditor").addEventListener("input", () => {
    $("#dirtyBadge").classList.remove("hidden");
    $("#fileResult").textContent = "File has unsaved changes.";
  });
  $$(".tree-row").forEach((row) => {
    row.addEventListener("click", () => {
      $$(".tree-row").forEach((item) => item.classList.remove("active"));
      row.classList.add("active");
      $("#selectedFile").textContent = row.dataset.file;
      $("#dirtyBadge").classList.add("hidden");
      $("#fileResult").textContent = "Selected file is clean.";
      $("#fileEditor").value = row.dataset.file.includes("style.css")
        ? "body {\n  --wp--preset--color--primary: #2271b1;\n}\n"
        : "<?php\n// File loaded from " + row.dataset.file + "\n";
    });
  });
  $("#saveFileBtn").addEventListener("click", () => {
    $("#dirtyBadge").classList.add("hidden");
    $("#fileResult").textContent = "Saved " + $("#selectedFile").textContent + " and refreshed the preview.";
    pushLog("WordPress", "info", "Saved file " + $("#selectedFile").textContent + ".");
  });
  $("#discardFileBtn").addEventListener("click", () => {
    $("#dirtyBadge").classList.add("hidden");
    $("#fileResult").textContent = "Discarded local editor changes.";
  });
  $("#newFileBtn").addEventListener("click", () => {
    $("#fileResult").textContent = "Created /wordpress/wp-content/mu-plugins/playground-note.php.";
    pushLog("WordPress", "info", "Created new file in wp-content.");
  });
  $("#newFolderBtn").addEventListener("click", () => {
    $("#fileResult").textContent = "Created /wordpress/wp-content/uploads/playground-demo/.";
  });
  $("#uploadBtn").addEventListener("click", () => {
    $("#fileResult").textContent = "Uploaded demo-plugin.zip and unpacked it into plugins.";
    pushTransfer("File upload", "Completed", "demo-plugin.zip uploaded through Site Manager.");
  });
  $("#browseBtn").addEventListener("click", () => {
    $("#fileResult").textContent = "Native file chooser opened; no file selected in this prototype state.";
  });

  $("#copyBlueprintBtn").addEventListener("click", () => {
    $("#blueprintResult").textContent = "Copied shareable Blueprint URL for the current bundle.";
    pushTransfer("Blueprint copy", "Completed", "Blueprint link copied.");
  });
  $("#downloadBlueprintBtn").addEventListener("click", () => {
    $("#blueprintResult").textContent = "Downloaded Blueprint bundle for the current Playground.";
    pushTransfer("Blueprint download", "Completed", "Blueprint bundle downloaded.");
  });
  $("#runBlueprintBtn").addEventListener("click", () => {
    $("#blueprintResult").textContent = "Validated JSON and ran Blueprint against the active Playground.";
    runBlueprint("Current blueprint.json");
  });
  $("#blueprintEditor").addEventListener("input", () => {
    try {
      JSON.parse($("#blueprintEditor").value);
      $("#blueprintValid").textContent = "Valid JSON";
      $("#blueprintValid").className = "badge green";
    } catch (error) {
      $("#blueprintValid").textContent = "Invalid JSON";
      $("#blueprintValid").className = "badge red";
    }
  });

  $("#categoryFilters").addEventListener("click", (event) => {
    const button = event.target.closest(".filter-chip");
    if (!button) return;
    $$(".filter-chip").forEach((chip) => chip.classList.toggle("active", chip === button));
    updateBlueprintGrid(button.dataset.category);
  });
  $("#blueprintSearch").addEventListener("input", () => {
    const active = $(".filter-chip.active");
    updateBlueprintGrid(active ? active.dataset.category : "All");
  });
  $("#blueprintGrid").addEventListener("click", (event) => {
    const card = event.target.closest(".blueprint-card");
    if (!card) return;
    state.selectedBlueprint = card.dataset.blueprintId;
    updateBlueprintGrid($(".filter-chip.active").dataset.category);
  });
  $("#blueprintDetail").addEventListener("click", (event) => {
    const bp = blueprints.find((item) => item.id === state.selectedBlueprint);
    if (!bp) return;
    if (event.target.id === "copySelectedBlueprint") {
      pushTransfer("Blueprint URL", "Completed", bp.name + " URL copied.");
    }
    if (event.target.id === "downloadSelectedBlueprint") {
      pushTransfer("Blueprint download", "Completed", bp.name + " bundle downloaded.");
    }
    if (event.target.id === "runSelectedBlueprint") {
      runBlueprint(bp.name);
    }
  });

  document.body.addEventListener("click", (event) => {
    if (event.target.closest(".db-download") || event.target.id === "databaseDownloadShortcut") {
      runDatabaseDownload();
    }
    if (event.target.closest(".open-adminer")) {
      state.playground.path = "/adminer.php";
      $("#previewStatus").textContent = "Adminer opened";
      pushLog("Playground", "info", "Opened Adminer for SQLite-backed database inspection.");
      updateShell();
    }
    if (event.target.closest(".open-phpmyadmin")) {
      state.playground.path = "/phpmyadmin/";
      $("#previewStatus").textContent = "phpMyAdmin opened";
      pushLog("Playground", "info", "Opened phpMyAdmin database tool.");
      updateShell();
    }
    const transferButton = event.target.closest(".transfer-action");
    if (transferButton) {
      genericTransfer(transferButton.dataset.transfer);
    }
  });

  $$(".log-tab").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeLog = button.dataset.log;
      $$(".log-tab").forEach((tab) => tab.classList.toggle("active", tab === button));
      renderLogs();
    });
  });
}

function init() {
  bindEvents();
  renderSavedList();
  renderDatabaseTools();
  renderLogs();
  renderTransferHistory();
  renderBlueprints();
  updateShell();
}

init();
