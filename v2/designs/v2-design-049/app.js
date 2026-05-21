const app = document.querySelector(".app");
const rowsEl = document.querySelector("#playgroundRows");
const transferEl = document.querySelector("#transferRows");
const routeChips = [...document.querySelectorAll(".route-chip")];
const panelButtons = [...document.querySelectorAll(".manager-tabs button")];
const panelViews = [...document.querySelectorAll(".manager-panel")];
const destinations = [...document.querySelectorAll(".destination")];
const deleteModal = document.querySelector("#deleteModal");

const routeData = {
  gutenberg: {
    kind: "Editor patch preview",
    title: "Preview a Gutenberg PR or branch",
    description: "Accepts a PR number, GitHub URL, or branch name. The resulting Playground remains temporary until saved.",
    label: "PR number, URL, or branch name",
    value: "try/block-bindings-panel",
    action: "Start preview",
    resultTitle: "Block bindings branch preview",
    resultPath: "/wp-admin/site-editor.php",
    previewText: "Gutenberg branch try/block-bindings-panel is running with the plugin build installed. Save or export is now available from the diagnostics console.",
    warning: "Replacement check: current runtime is unsaved. Starting a preview keeps a recovery row until you confirm reset or save."
  },
  wordpress: {
    kind: "Core patch preview",
    title: "Preview a WordPress PR",
    description: "Requires a WordPress core PR number or wordpress-develop pull request URL.",
    label: "PR number or URL",
    value: "https://github.com/WordPress/wordpress-develop/pull/7821",
    action: "Preview WordPress PR",
    resultTitle: "WordPress PR 7821 Preview",
    resultPath: "/wp-admin/about.php",
    previewText: "WordPress core PR 7821 is loaded against latest WordPress. The active object can now be saved, zipped, or exported."
  },
  vanilla: {
    kind: "Clean install",
    title: "Start Vanilla WordPress",
    description: "Creates a fresh latest WordPress install logged in as admin.",
    label: "Runtime note",
    value: "WordPress latest, PHP 8.3, English (United States)",
    action: "Start fresh",
    resultTitle: "Unsaved Vanilla Playground",
    resultPath: "/hello-from-playground/",
    previewText: "A fresh Vanilla WordPress runtime is ready. It is temporary until saved in this browser or to a local directory."
  },
  github: {
    kind: "Repository import",
    title: "Import from GitHub",
    description: "Imports plugins, themes, or wp-content directories from public GitHub repositories. Account connection is required and the token is not stored after refresh.",
    label: "Repository path",
    value: "wordpress/wordpress-playground/packages/playground",
    action: "Import repository",
    resultTitle: "GitHub Import Playground",
    resultPath: "/wp-admin/plugins.php",
    previewText: "GitHub import completed after account connection. Repository files are available in wp-content and export history records the import source."
  },
  "blueprint-url": {
    kind: "Blueprint runner",
    title: "Run Blueprint from URL",
    description: "Runs a public blueprint.json after schema validation and replacement confirmation.",
    label: "Blueprint URL",
    value: "https://playground.wordpress.net/blueprints/art-gallery.json",
    action: "Run Blueprint",
    resultTitle: "Art Gallery Blueprint Playground",
    resultPath: "/",
    previewText: "The Blueprint URL validated and ran against the active runtime. Content and theme state now match the selected Blueprint."
  },
  zip: {
    kind: "Archive replacement",
    title: "Import .zip",
    description: "Opens the native file chooser, validates a Playground bundle, then asks before replacing files and the SQLite database.",
    label: "Selected archive",
    value: "support-lab-export.zip",
    action: "Validate .zip",
    resultTitle: "Imported ZIP Playground",
    resultPath: "/wp-admin/",
    previewText: "The uploaded .zip replaced WordPress files and the SQLite database. Transfer history records the destructive import."
  }
};

const state = {
  route: "gutenberg",
  saveDestination: "browser",
  activeId: "temp-1",
  selectedId: "temp-1",
  exportReady: false,
  storage: "temporary",
  path: "/hello-from-playground/",
  sites: [
    {
      id: "temp-1",
      title: "Unsaved Playground",
      subtitle: "Temporary WordPress latest, PHP 8.3, network on",
      state: "Temporary",
      storage: "In memory",
      lastAction: "Opened current browser session",
      path: "/hello-from-playground/",
      reset: "Reset discards this site",
      db: "452 KB SQLite",
      export: "Locked until preview runs",
      deleted: false
    },
    {
      id: "browser-1",
      title: "Research Browser Playground",
      subtitle: "Saved in this browser a moment ago",
      state: "Saved",
      storage: "Browser storage",
      lastAction: "Created May 21, 2026",
      path: "/hello-from-playground/",
      reset: "Save & Reload",
      db: "481 KB SQLite",
      export: "Available",
      deleted: false
    },
    {
      id: "local-1",
      title: "Local Theme Lab",
      subtitle: "Folder-backed Playground",
      state: "Local permission needed",
      storage: "~/Sites/theme-lab",
      lastAction: "Folder permission must be reconnected",
      path: "/wp-admin/themes.php",
      reset: "Reconnect folder before reload",
      db: "626 KB SQLite",
      export: "Available after reconnect",
      deleted: false
    }
  ],
  transfers: [
    { type: "warning", title: "Temporary runtime opened", detail: "Refresh will discard files and database until saved.", status: "Active" },
    { type: "saved", title: "Research Browser Playground", detail: "Saved in browser storage, slug research-browser-playground.", status: "Resolved" },
    { type: "local", title: "Local Theme Lab", detail: "Local directory permission requires reconnect.", status: "Needs attention" }
  ],
  blueprints: [
    ["Art Gallery", "Website", "An art gallery created with the Vueo theme."],
    ["Coffee Shop", "WooCommerce", "A stylish WooCommerce storefront with products and custom content."],
    ["Feed Reader with the Friends Plugin", "Content", "Read feeds from the web in Playground using the Friends plugin."],
    ["Gaming News", "News", "A gaming news site created with the Spiel theme."],
    ["Non-profit Organization", "Website", "A non-profit organization site created with the Koinonia theme."],
    ["Personal Blog", "Personal", "A personal blog created with the Substrata theme."],
    ["Block Theme Starter", "Themes", "A small block-theme fixture with template parts and styles."],
    ["Woo Checkout Test", "WooCommerce", "A WooCommerce checkout sandbox with sample products."],
    ["Data Views Experiment", "Experiments", "A Gutenberg experiment environment for data views."],
    ["Newsroom Layout", "News", "A publishing demo with posts, categories, and editor styles."],
    ["Plugin Review Kit", "Experiments", "A plugin testing site with diagnostic content."],
    ["Pattern Directory Demo", "Content", "A content-heavy fixture for block patterns."]
  ]
};

function selectedSite() {
  return state.sites.find((site) => site.id === state.selectedId) || state.sites[0];
}

function activeSite() {
  return state.sites.find((site) => site.id === state.activeId) || selectedSite();
}

function statusClass(value) {
  const lower = String(value).toLowerCase();
  if (lower.includes("saved") || lower.includes("export") || lower.includes("ready")) return "green";
  if (lower.includes("delete") || lower.includes("replaced")) return "danger";
  if (lower.includes("local") || lower.includes("temporary") || lower.includes("saving") || lower.includes("permission")) return "warning";
  return "blue";
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function addTransfer(type, title, detail, status = "Resolved") {
  state.transfers.unshift({ type, title, detail, status });
  renderTransfers();
}

function renderRows() {
  rowsEl.innerHTML = state.sites.map((site) => {
    const active = site.id === state.selectedId ? "is-active" : "";
    const deleted = site.deleted ? "is-deleted" : "";
    const disabled = site.deleted ? "disabled" : "";
    return `
      <tr class="${active} ${deleted}" data-site-id="${site.id}">
        <td><strong>${site.title}</strong><small>${site.subtitle}</small></td>
        <td><span class="state-pill ${statusClass(site.state)}">${site.state}</span></td>
        <td><strong>${site.storage}</strong><small>${site.path}</small></td>
        <td><span>${site.lastAction}</span></td>
        <td>
          <div class="row-actions">
            <button type="button" class="secondary small" data-action="open" ${disabled}>Open</button>
            <button type="button" class="secondary small" data-action="rename" ${disabled}>Rename</button>
            <button type="button" class="secondary small" data-action="manage" ${disabled}>Manage</button>
            <button type="button" class="danger small" data-action="delete" ${disabled}>Delete</button>
          </div>
        </td>
      </tr>`;
  }).join("");
}

function renderTransfers() {
  transferEl.innerHTML = state.transfers.map((item) => `
    <article class="transfer-row">
      <span class="state-pill ${statusClass(item.type)}">${item.status}</span>
      <div><strong>${item.title}</strong><p>${item.detail}</p></div>
      <span>${item.type}</span>
    </article>
  `).join("");
}

function setShellFromActive() {
  const site = activeSite();
  const storage = site.state.toLowerCase().includes("saved") ? "browser"
    : site.state.toLowerCase().includes("local") ? "local"
    : "temporary";
  app.dataset.storage = storage;
  state.storage = storage;
  document.querySelector("#shellTitle").textContent = site.title;
  document.querySelector("#shellSubtitle").textContent = site.subtitle;
  document.querySelector("#storageBadge").textContent = storage === "browser" ? "Saved Playground" : storage === "local" ? "Local directory" : "Temporary";
  document.querySelector("#storageBadge").className = `state-pill ${storage === "browser" ? "green" : "warning"}`;
  document.querySelector("#pathInput").value = site.path;
  document.querySelector("#previewIdentity").textContent = site.title;
  document.querySelector("#previewRuntime").textContent = `${site.state} · WordPress latest · PHP 8.3`;
  document.querySelector("#previewDot").className = `site-dot ${storage === "temporary" ? "temporary" : "saved"}`;
  document.querySelector("#previewHighlight").textContent = `Note that you are logged-in as admin. Current path: ${site.path}`;
}

function renderDetail() {
  const site = selectedSite();
  document.querySelector("#detailTitle").textContent = site.title;
  document.querySelector("#detailSubtitle").textContent = site.subtitle;
  document.querySelector("#detailState").textContent = site.state;
  document.querySelector("#detailState").className = `state-pill ${statusClass(site.state)}`;
  document.querySelector("#detailPath").textContent = site.path;
  document.querySelector("#detailReset").textContent = site.reset;
  document.querySelector("#detailDb").textContent = site.db;
  document.querySelector("#detailExport").textContent = site.export;
  document.querySelector("#diagnosticWarning").textContent = site.state === "Saved"
    ? "This browser-backed Playground can reload safely. Settings changes use Save & Reload."
    : site.state.includes("Local")
      ? "Local-directory Playgrounds depend on folder permission. Reconnect before Save & Reload."
      : "Refresh or settings reset will remove files, database, and the current PR preview unless this Playground is saved.";
  document.querySelector("#storageDiagnostic").textContent = `${site.storage}. ${site.lastAction}`;
  document.querySelector("#settingsConsequence").textContent = site.state === "Saved" ? "Saved Playground reload" : "Temporary settings reset warning";
  document.querySelector("#settingsResult").textContent = site.state === "Saved"
    ? "This stored Playground keeps its browser-backed identity. Runtime changes use Save & Reload."
    : "Applying runtime settings resets this unsaved Playground and discards current files and database.";
}

function renderAll() {
  renderRows();
  renderTransfers();
  setShellFromActive();
  renderDetail();
}

function switchPanel(name) {
  panelButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.panel === name));
  panelViews.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panelView === name));
}

function setRoute(route) {
  state.route = route;
  const data = routeData[route];
  routeChips.forEach((button) => button.classList.toggle("is-active", button.dataset.route === route));
  document.querySelector("#routeKind").textContent = data.kind;
  document.querySelector("#routeTitle").textContent = data.title;
  document.querySelector("#routeDescription").textContent = data.description;
  document.querySelector("#routeInputLabel").textContent = data.label;
  document.querySelector("#routeInput").value = data.value;
  document.querySelector("#runRouteButton").textContent = data.action;
  document.querySelector("#connectGitHubButton").hidden = route !== "github";
  document.querySelector("#routeWarning").innerHTML = `<strong>Constraint:</strong> ${data.warning || "This route validates input before creating or replacing the active Playground."}`;
  document.querySelector("#routeTimeline").innerHTML = `
    <li class="current">Input waiting for validation</li>
    <li>Runtime not built</li>
    <li>Preview identity not assigned</li>
    <li>Save and export locked</li>`;
}

function animateProgress(card, textEl, steps, done) {
  card.hidden = false;
  const meter = card.querySelector(".meter span");
  let index = 0;
  meter.style.width = "0%";
  const tick = () => {
    const step = steps[index];
    meter.style.width = step.width;
    textEl.textContent = step.text;
    index += 1;
    if (index < steps.length) {
      setTimeout(tick, 360);
    } else {
      setTimeout(() => {
        card.hidden = true;
        done();
      }, 320);
    }
  };
  tick();
}

function validateRoute() {
  const input = document.querySelector("#routeInput").value.trim();
  const timeline = document.querySelector("#routeTimeline");
  if (!input) {
    timeline.innerHTML = `
      <li class="current">Input is required</li>
      <li>Runtime not built</li>
      <li>Preview identity not assigned</li>
      <li>Save and export locked</li>`;
    return;
  }
  timeline.innerHTML = `
    <li class="done">Input validated</li>
    <li class="current">Ready to build runtime</li>
    <li>Preview identity not assigned</li>
    <li>Save and export locked</li>`;
  addTransfer("validated", routeData[state.route].title, `${input} passed route-specific validation.`, "Ready");
}

function runRoute() {
  const data = routeData[state.route];
  const input = document.querySelector("#routeInput").value.trim() || data.value;
  const card = document.querySelector("#routeProgress");
  document.querySelector("#routeProgressTitle").textContent = state.route === "zip" ? "Validating archive" : "Preparing preview";
  const active = activeSite();
  active.state = "Loading";
  active.lastAction = `${data.title}: resolving ${input}`;
  renderRows();
  animateProgress(card, document.querySelector("#routeProgressText"), [
    { width: "28%", text: "Validating route input" },
    { width: "62%", text: "Building WordPress runtime" },
    { width: "86%", text: "Applying files and database changes" },
    { width: "100%", text: "Assigning preview identity" }
  ], () => {
    const site = activeSite();
    site.title = data.resultTitle;
    site.subtitle = `${data.kind} from ${input}`;
    site.state = state.route === "zip" ? "Imported" : "Preview ready";
    site.storage = "In memory";
    site.lastAction = state.route === "zip" ? "ZIP archive imported and replaced current runtime" : `${data.kind} ready`;
    site.path = data.resultPath;
    site.reset = "Reset discards this preview";
    site.export = "Available";
    state.exportReady = true;
    document.querySelector("#saveNameInput").value = site.title;
    document.querySelector("#previewHeadline").textContent = site.title;
    document.querySelector("#previewText").textContent = data.previewText;
    document.querySelector("#previewKicker").textContent = data.kind;
    document.querySelector("#previewStatus").textContent = "Preview ready";
    document.querySelector("#routeTimeline").innerHTML = `
      <li class="done">Input validated</li>
      <li class="done">Runtime built</li>
      <li class="done">Preview identity assigned</li>
      <li class="done">Save and export available</li>`;
    addTransfer(state.route === "zip" ? "imported" : "preview", site.title, `${data.title} completed from ${input}.`, state.route === "zip" ? "Replaced" : "Ready");
    renderAll();
  });
}

function startSave() {
  const site = activeSite();
  const name = document.querySelector("#saveNameInput").value.trim() || site.title;
  const destination = state.saveDestination;
  const card = document.querySelector("#saveProgress");
  document.querySelector("#saveProgressTitle").textContent = destination === "browser" ? "Saving to browser storage" : "Saving to local directory";
  site.state = destination === "browser" ? "Saving" : "Local permission granted";
  site.lastAction = destination === "browser" ? "Copying files to browser storage" : "Copying files to ~/Sites/playground-support-lab";
  renderRows();
  switchPanel("save");
  animateProgress(card, document.querySelector("#saveProgressText"), [
    { width: "16%", text: "Copying 604 / 3,751 files" },
    { width: "48%", text: "Copying 1,824 / 3,751 files" },
    { width: "74%", text: "Copying 3,028 / 3,751 files" },
    { width: "100%", text: "Copying 3,751 / 3,751 files" }
  ], () => {
    const savedId = `${destination}-${Date.now()}`;
    const saved = {
      id: savedId,
      title: name,
      subtitle: destination === "browser" ? "Saved in this browser just now" : "Saved to local directory just now",
      state: destination === "browser" ? "Saved" : "Local saved",
      storage: destination === "browser" ? "Browser storage" : "~/Sites/playground-support-lab",
      lastAction: destination === "browser" ? "Browser save inserted from temporary row" : "Local directory save completed; permission active",
      path: site.path,
      reset: destination === "browser" ? "Save & Reload" : "Save & Reload after folder reconnect",
      db: site.db,
      export: "Available",
      deleted: false
    };
    state.sites.unshift(saved);
    site.state = "Temporary copied";
    site.lastAction = "Copied into saved row; safe to reset";
    state.activeId = savedId;
    state.selectedId = savedId;
    state.exportReady = true;
    document.querySelector("#saveResult").textContent = destination === "browser"
      ? `Saved row inserted. Active shell now uses slug ${slugify(name)} and reload preserves this Playground in this browser.`
      : "Local row inserted. Active shell points at the chosen folder; future sessions may ask to reconnect permission.";
    addTransfer(destination === "browser" ? "saved" : "local", name, destination === "browser" ? "Saved in browser storage with a slug URL." : "Saved to local directory with active permission.", "Saved");
    renderAll();
  });
}

function openDelete(siteId) {
  state.selectedId = siteId;
  const site = selectedSite();
  document.querySelector("#deleteMessage").textContent = site.id === state.activeId
    ? "This removes the active saved copy. The shell will fall back to a new temporary Playground."
    : `This removes ${site.title} from saved browser storage or local management.`;
  deleteModal.hidden = false;
  renderAll();
}

function confirmDelete() {
  const site = selectedSite();
  site.state = "Deleting";
  site.lastAction = "Delete confirmation accepted";
  renderRows();
  setTimeout(() => {
    site.state = "Deleted";
    site.deleted = true;
    site.lastAction = "Deleted from saved management";
    addTransfer("deleted", site.title, "Confirmed delete completed; row remains as a final audit state.", "Deleted");
    if (site.id === state.activeId) {
      const fallback = {
        id: `temp-${Date.now()}`,
        title: "Unsaved Playground",
        subtitle: "New temporary fallback after deletion",
        state: "Temporary",
        storage: "In memory",
        lastAction: "Created after deleting active saved object",
        path: "/hello-from-playground/",
        reset: "Reset discards this site",
        db: "452 KB SQLite",
        export: "Locked until preview runs",
        deleted: false
      };
      state.sites.unshift(fallback);
      state.activeId = fallback.id;
      state.selectedId = fallback.id;
      document.querySelector("#previewHeadline").textContent = "Hello from WordPress Playground!";
      document.querySelector("#previewText").textContent = "The saved Playground was deleted. A temporary fallback is active so the live WordPress shell stays available.";
    }
    deleteModal.hidden = true;
    renderAll();
  }, 450);
}

function renameSite(siteId) {
  const site = state.sites.find((item) => item.id === siteId);
  if (!site || site.deleted) return;
  site.title = site.title.includes("Renamed") ? site.title.replace(" Renamed", "") : `${site.title} Renamed`;
  site.lastAction = "Renamed from saved management table";
  addTransfer("renamed", site.title, "Saved row name and active shell identity updated.", "Resolved");
  renderAll();
}

function openSite(siteId) {
  const site = state.sites.find((item) => item.id === siteId);
  if (!site || site.deleted) return;
  state.activeId = siteId;
  state.selectedId = siteId;
  document.querySelector("#previewHeadline").textContent = site.title;
  document.querySelector("#previewText").textContent = `${site.title} is now open in the protected WordPress preview.`;
  addTransfer("opened", site.title, `Opened at ${site.path}.`, "Active");
  renderAll();
}

function renderBlueprints() {
  const filter = document.querySelector(".filters .is-active")?.dataset.filter || "All";
  const query = document.querySelector("#blueprintSearch").value.toLowerCase();
  const cards = state.blueprints
    .filter(([name, tag]) => (filter === "All" || tag === filter) && name.toLowerCase().includes(query))
    .map(([name, tag, description], index) => `
      <button type="button" class="blueprint-card ${index === 0 ? "is-active" : ""}" data-name="${name}" data-tag="${tag}" data-description="${description}">
        <strong>${name}</strong>
        <span>${tag} · ${description}</span>
      </button>`)
    .join("");
  document.querySelector("#blueprintCards").innerHTML = cards || `<p class="result-line">No Blueprints match this filter in the representative subset.</p>`;
  document.querySelector("#blueprintCount").textContent = `${Math.max(0, (cards.match(/blueprint-card/g) || []).length)} shown of 43 Blueprints`;
}

routeChips.forEach((button) => button.addEventListener("click", () => setRoute(button.dataset.route)));
panelButtons.forEach((button) => button.addEventListener("click", () => switchPanel(button.dataset.panel)));

destinations.forEach((button) => {
  button.addEventListener("click", () => {
    state.saveDestination = button.dataset.destination;
    destinations.forEach((item) => item.classList.toggle("is-active", item === button));
    document.querySelector("#localPermission").hidden = state.saveDestination !== "local";
    document.querySelector("#saveResult").textContent = state.saveDestination === "local"
      ? "Local save will open a folder picker and record permission state separately from browser storage."
      : "Browser save creates a saved row and slug in this browser.";
  });
});

document.querySelector("#validateRouteButton").addEventListener("click", validateRoute);
document.querySelector("#runRouteButton").addEventListener("click", runRoute);
document.querySelector("#connectGitHubButton").addEventListener("click", () => {
  addTransfer("github", "GitHub account connected", "Access token available for this session only; re-authentication required after refresh.", "Connected");
  document.querySelector("#connectGitHubButton").textContent = "GitHub connected";
});
document.querySelector("#quickSaveButton").addEventListener("click", () => switchPanel("save"));
document.querySelector("#openSavePanelButton").addEventListener("click", () => switchPanel("save"));
document.querySelector("#openLogsPanelButton").addEventListener("click", () => switchPanel("logs"));
document.querySelector("#startSaveButton").addEventListener("click", startSave);
document.querySelector("#cancelSaveButton").addEventListener("click", () => {
  document.querySelector("#saveResult").textContent = "Save cancelled. Current Playground remains temporary until a destination is completed.";
});

rowsEl.addEventListener("click", (event) => {
  const row = event.target.closest("tr");
  if (!row) return;
  const siteId = row.dataset.siteId;
  const action = event.target.closest("button")?.dataset.action;
  state.selectedId = siteId;
  if (action === "open") openSite(siteId);
  else if (action === "rename") renameSite(siteId);
  else if (action === "manage") switchPanel("diagnostics");
  else if (action === "delete") openDelete(siteId);
  else renderAll();
});

document.querySelector("#cancelDeleteButton").addEventListener("click", () => {
  deleteModal.hidden = true;
  addTransfer("delete", selectedSite().title, "Delete confirmation cancelled; saved row remains available.", "Cancelled");
});
document.querySelector("#confirmDeleteButton").addEventListener("click", confirmDelete);
document.querySelector("#manageSelectedButton").addEventListener("click", () => switchPanel("diagnostics"));

document.querySelector("#pathForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const path = document.querySelector("#pathInput").value || "/";
  activeSite().path = path.startsWith("/") ? path : `/${path}`;
  activeSite().lastAction = `Navigated to ${activeSite().path}`;
  document.querySelector("#previewHighlight").textContent = `Note that you are logged-in as admin. Current path: ${activeSite().path}`;
  document.querySelector("#previewStatus").textContent = "Path loaded";
  addTransfer("path", activeSite().title, `Navigated live preview to ${activeSite().path}.`, "Resolved");
  renderAll();
});

document.querySelector("#homeButton").addEventListener("click", () => {
  document.querySelector("#pathInput").value = "/hello-from-playground/";
  document.querySelector("#pathForm").dispatchEvent(new Event("submit", { cancelable: true }));
});
document.querySelector("#adminButton").addEventListener("click", () => {
  document.querySelector("#pathInput").value = "/wp-admin/";
  document.querySelector("#pathForm").dispatchEvent(new Event("submit", { cancelable: true }));
});
document.querySelector("#refreshButton").addEventListener("click", () => {
  addTransfer("refresh", activeSite().title, `Refreshed ${activeSite().path}; ${activeSite().reset}.`, "Resolved");
  document.querySelector("#previewStatus").textContent = "Refreshed";
  renderTransfers();
});
document.querySelector("#resetButton").addEventListener("click", () => {
  const site = activeSite();
  site.state = site.state === "Saved" ? "Saved" : "Temporary";
  site.lastAction = site.state === "Saved" ? "Save & Reload completed" : "Reset completed; temporary content discarded";
  document.querySelector("#previewHeadline").textContent = "Hello from WordPress Playground!";
  document.querySelector("#previewText").textContent = site.state === "Saved"
    ? "Saved settings reloaded without losing the browser-backed identity."
    : "Temporary Playground reset completed and content returned to the default welcome page.";
  addTransfer("reset", site.title, site.lastAction, site.state === "Saved" ? "Reloaded" : "Reset");
  renderAll();
});
document.querySelector("#applySettingsButton").addEventListener("click", () => {
  const site = activeSite();
  const wp = document.querySelector("#wpVersionSelect").value;
  const php = document.querySelector("#phpVersionSelect").value;
  const language = document.querySelector("#languageSelect").value;
  const network = document.querySelector("#networkAccessCheck").checked ? "network on" : "network off";
  const multisite = document.querySelector("#multisiteCheck").checked ? "multisite" : "single site";
  site.subtitle = `${wp}, ${php}, ${language}, ${network}, ${multisite}`;
  site.lastAction = site.state === "Saved" ? "Settings saved and reloaded" : "Settings applied with destructive reset";
  document.querySelector("#settingsResult").textContent = site.state === "Saved"
    ? "Save & Reload completed. Browser-backed identity remains available after refresh."
    : "Settings reset completed. Temporary files and database were replaced by a fresh runtime.";
  document.querySelector("#previewText").textContent = document.querySelector("#settingsResult").textContent;
  addTransfer("settings", site.title, site.lastAction, site.state === "Saved" ? "Reloaded" : "Reset");
  renderAll();
});
document.querySelector("#saveReloadButton").addEventListener("click", () => {
  const site = activeSite();
  site.lastAction = site.state === "Saved" ? "Save & Reload completed" : "Save & Reload unavailable until the Playground is saved";
  document.querySelector("#settingsResult").textContent = site.lastAction;
  addTransfer("settings", site.title, site.lastAction, site.state === "Saved" ? "Reloaded" : "Blocked");
  renderAll();
});

document.querySelector("#fileEditor").addEventListener("input", () => {
  document.querySelector("#fileState").textContent = "Dirty";
  document.querySelector("#fileState").style.color = "#9a6700";
});
document.querySelector("#saveFileButton").addEventListener("click", () => {
  document.querySelector("#fileState").textContent = "Saved";
  document.querySelector("#fileState").style.color = "#087f3f";
  addTransfer("file", "wp-config.php saved", "File editor dirty state resolved and active runtime updated.", "Saved");
});
document.querySelector("#newFileButton").addEventListener("click", () => {
  document.querySelector("#fileResultRow").hidden = false;
  document.querySelector("#fileState").textContent = "New file staged";
});
document.querySelector("#newFolderButton").addEventListener("click", () => addTransfer("file", "New folder created", "/wordpress/wp-content/support-diagnostics/ added to file browser.", "Resolved"));
document.querySelector("#uploadButton").addEventListener("click", () => addTransfer("upload", "Upload completed", "debug-helper.php uploaded into wp-content/mu-plugins.", "Resolved"));
document.querySelector("#browseFilesButton").addEventListener("click", () => addTransfer("browse", "Native file browser opened", "Selected files are staged before writing to WordPress.", "Opened"));

document.querySelectorAll(".filters button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filters button").forEach((item) => item.classList.toggle("is-active", item === button));
    renderBlueprints();
  });
});
document.querySelector("#blueprintSearch").addEventListener("input", renderBlueprints);
document.querySelector("#blueprintCards").addEventListener("click", (event) => {
  const card = event.target.closest(".blueprint-card");
  if (!card) return;
  document.querySelectorAll(".blueprint-card").forEach((item) => item.classList.toggle("is-active", item === card));
  document.querySelector("#selectedBlueprintTitle").textContent = card.dataset.name;
  document.querySelector("#selectedBlueprintTag").textContent = card.dataset.tag;
  document.querySelector("#selectedBlueprintDescription").textContent = card.dataset.description;
  document.querySelector("#blueprintUrl").value = `https://playground.wordpress.net/blueprints/${slugify(card.dataset.name)}.json`;
});
document.querySelector("#copyBlueprintButton").addEventListener("click", () => {
  document.querySelector("#blueprintResult").textContent = "Blueprint URL copied. The current editor JSON remains valid.";
  addTransfer("blueprint", "Blueprint link copied", document.querySelector("#blueprintUrl").value, "Resolved");
});
document.querySelector("#downloadBlueprintButton").addEventListener("click", () => {
  document.querySelector("#blueprintResult").textContent = "Blueprint bundle download prepared with blueprint.json and referenced files.";
  addTransfer("download", "Blueprint bundle downloaded", "blueprint-bundle.zip prepared from current Blueprint editor.", "Resolved");
});
document.querySelector("#runBlueprintButton").addEventListener("click", () => {
  const site = activeSite();
  site.title = `${document.querySelector("#selectedBlueprintTitle").textContent} Playground`;
  site.state = "Preview ready";
  site.lastAction = "Blueprint run replaced content";
  site.path = "/";
  state.exportReady = true;
  document.querySelector("#previewHeadline").textContent = site.title;
  document.querySelector("#previewText").textContent = document.querySelector("#selectedBlueprintDescription").textContent;
  document.querySelector("#blueprintResult").textContent = "Blueprint validated, replacement confirmed, and preview updated.";
  addTransfer("blueprint", site.title, "Blueprint run completed and active preview changed.", "Ready");
  renderAll();
});

document.querySelector("#downloadDbButton").addEventListener("click", () => {
  document.querySelector("#databaseResult").textContent = "database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite.";
  addTransfer("database", "database.sqlite downloaded", "452 KB SQLite database exported.", "Resolved");
});
document.querySelector("#openAdminerButton").addEventListener("click", () => {
  document.querySelector("#databaseResult").textContent = "Adminer opened in a new Playground tool window.";
  addTransfer("database", "Adminer opened", "Database inspection tool launched.", "Opened");
});
document.querySelector("#openPhpMyAdminButton").addEventListener("click", () => {
  document.querySelector("#databaseResult").textContent = "phpMyAdmin opened for the SQLite-backed WordPress database.";
  addTransfer("database", "phpMyAdmin opened", "Database management tool launched.", "Opened");
});

document.querySelectorAll(".log-tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".log-tabs button").forEach((item) => item.classList.toggle("is-active", item === button));
    const logs = {
      playground: "[09:41:02] Playground boot complete\n[09:41:04] Warning: temporary runtime is not saved\n[09:41:06] Network access enabled",
      wordpress: "[09:42:12] WordPress loaded /hello-from-playground/\n[09:42:13] admin authenticated\n[09:42:28] Theme assets loaded from wp-content",
      php: "[09:42:34] PHP Notice: Undefined index \"demo_mode\" in /wordpress/wp-content/mu-plugins/support-note.php on line 18\n[09:42:35] PHP 8.3 runtime continuing"
    };
    document.querySelector("#logOutput").textContent = logs[button.dataset.log];
  });
});

document.querySelector("#exportGitHubButton").addEventListener("click", () => {
  if (!state.exportReady) {
    document.querySelector("#exportResult").textContent = "Export blocked until a route preview, saved site, or imported runtime has a stable identity.";
    return;
  }
  const repo = document.querySelector("#repoInput").value;
  document.querySelector("#exportResult").textContent = `GitHub export completed to ${repo}. Token remains session-only.`;
  activeSite().lastAction = `Exported to GitHub repository ${repo}`;
  addTransfer("exported", activeSite().title, `Pushed current files to ${repo}.`, "Exported");
  renderAll();
});
document.querySelector("#downloadZipButton").addEventListener("click", () => {
  document.querySelector("#exportResult").textContent = "Zip download prepared with files, Blueprint bundle, and SQLite database.";
  addTransfer("download", activeSite().title, "Downloaded Playground archive as .zip.", "Downloaded");
});
document.querySelector("#zipImportButton").addEventListener("click", () => {
  document.querySelector("#replaceConfirm").hidden = false;
  document.querySelector("#exportResult").textContent = "support-lab-export.zip selected and validated. Confirmation required before replacement.";
});
document.querySelector("#cancelReplaceButton").addEventListener("click", () => {
  document.querySelector("#replaceConfirm").hidden = true;
  document.querySelector("#exportResult").textContent = "ZIP import cancelled. Current files and database were not changed.";
  addTransfer("import", "ZIP import cancelled", "Replacement confirmation was cancelled.", "Cancelled");
});
document.querySelector("#confirmReplaceButton").addEventListener("click", () => {
  document.querySelector("#replaceConfirm").hidden = true;
  const site = activeSite();
  site.title = "Imported ZIP Playground";
  site.state = "Imported";
  site.subtitle = "Replaced from support-lab-export.zip";
  site.path = "/wp-admin/";
  site.db = "734 KB SQLite";
  site.lastAction = "ZIP import replaced files and database";
  state.exportReady = true;
  document.querySelector("#databaseSize").textContent = "734 KB";
  document.querySelector("#previewHeadline").textContent = "Imported ZIP Playground";
  document.querySelector("#previewText").textContent = "The selected .zip was validated and then replaced the active WordPress files and SQLite database.";
  document.querySelector("#exportResult").textContent = "ZIP import completed. Active shell, database size, transfer history, and preview now reflect the imported archive.";
  addTransfer("imported", site.title, "support-lab-export.zip replaced files and database.", "Imported");
  renderAll();
});

document.querySelector("#clearResolvedButton").addEventListener("click", () => {
  state.transfers = state.transfers.filter((item) => !["Resolved", "Saved", "Downloaded", "Exported"].includes(item.status));
  renderTransfers();
});

setRoute("gutenberg");
renderBlueprints();
renderAll();
