const state = {
  storage: "temporary",
  activeTitle: "Unsaved Playground",
  activePath: "/hello-from-playground/",
  runtime: "WP latest / PHP 8.3",
  selectedBlueprint: "Coffee Shop",
  blueprintValidated: false,
  currentView: "launch",
  currentManager: "settings",
  transferCount: 4,
};

const blueprints = [
  { name: "Art Gallery", tags: "Website, Personal", summary: "Vueo theme gallery with art content." },
  { name: "Coffee Shop", tags: "WooCommerce, Store", summary: "Stylish storefront with products and content." },
  { name: "Feed Reader with the Friends Plugin", tags: "Content, Experiments", summary: "Social web feed reading inside Playground." },
  { name: "Gaming News", tags: "Website, News", summary: "Spiel theme news and reviews layout." },
  { name: "Non-profit Organization", tags: "Website, Content", summary: "Benefit and wellness site with Koinonia." },
  { name: "Personal Blog", tags: "Website, Personal", summary: "Substrata-powered personal publishing site." },
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function setBadge(el, text, tone = "neutral") {
  el.className = `state-badge ${tone}`;
  el.textContent = text;
}

function selectRow(row) {
  $$(".table-row").forEach((item) => item.classList.remove("is-selected"));
  row.classList.add("is-selected");
}

function openView(view) {
  state.currentView = view;
  $$(".view-tabs button").forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
  $$(".table-panel").forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === view));
}

function updateShell({ title, subtitle, path, storage, runtime } = {}) {
  if (title) state.activeTitle = title;
  if (path) state.activePath = path;
  if (runtime) state.runtime = runtime;
  if (storage) state.storage = storage;

  $("#shellTitle").textContent = state.activeTitle;
  $("#shellSubtitle").textContent = subtitle || `${state.storageLabel || "Vanilla WordPress contract"}, ${state.storage} runtime`;
  $("#pathInput").value = state.activePath;
  $("#previewPath").textContent = state.activePath;
  $("#runtimeBadge").textContent = state.runtime;
  document.querySelector(".app").dataset.storage = state.storage;

  const badge = $("#storageBadge");
  if (state.storage === "browser") setBadge(badge, "Saved browser", "success");
  else if (state.storage === "local") setBadge(badge, "Local directory", "warning");
  else if (state.storage === "imported") setBadge(badge, "Imported", "success");
  else setBadge(badge, "Temporary", "warning");
}

function updatePreview({ title, headline, copy, label, path } = {}) {
  if (title) $("#previewTitle").textContent = title;
  if (headline) $("#previewHeadline").textContent = headline;
  if (copy) $("#previewCopy").textContent = copy;
  if (label) $("#previewLabel").textContent = label;
  if (path) {
    state.activePath = path;
    $("#pathInput").value = path;
    $("#previewPath").textContent = path;
  }
}

function setDetail(kicker, title, badge, tone, body) {
  $("#detailKicker").textContent = kicker;
  $("#detailTitle").textContent = title;
  setBadge($("#detailState"), badge, tone);
  $("#detailBody").innerHTML = body;
}

function simulateProgress({ box, label, steps, done, meterSelector = ".meter span", delay = 280 }) {
  const progressBox = typeof box === "string" ? $(box) : box;
  const labelNode = typeof label === "string" ? $(label) : label;
  const meter = $(meterSelector, progressBox);
  progressBox.classList.add("is-visible");
  let index = 0;
  const tick = () => {
    const step = steps[index];
    if (labelNode) labelNode.textContent = step.text;
    meter.style.width = `${step.width}%`;
    index += 1;
    if (index < steps.length) {
      window.setTimeout(tick, delay);
    } else if (done) {
      window.setTimeout(done, 220);
    }
  };
  tick();
}

function addTransfer(label, target, tone, stateText, result) {
  state.transferCount += 1;
  $("#summaryTransfers").textContent = String(state.transferCount);
  const table = $("#transferTable");
  const row = document.createElement("button");
  row.className = "table-row";
  row.type = "button";
  row.dataset.detail = "export";
  row.innerHTML = `
    <span>now</span>
    <span>${label}</span>
    <span>${target}</span>
    <span><em class="state-badge ${tone}">${stateText}</em></span>
    <span>${result}</span>
  `;
  table.append(row);
}

function launchDetail(id) {
  const rows = {
    vanilla: {
      title: "Vanilla WordPress contract",
      badge: "Draft",
      tone: "neutral",
      body: `
        <div class="detail-section">
          <div class="cardlet">
            <p class="eyebrow">Route inputs</p>
            <h3>Fresh WordPress runtime</h3>
            <p>No external input is required. Starts latest WordPress, logs in as admin, and keeps Save, WP Admin, Homepage, reset, and download actions available.</p>
          </div>
          <div class="notice warning"><strong>Unsaved replacement warning</strong><p>Starting fresh over the current temporary runtime discards unsaved files and database changes.</p></div>
          <div class="button-row">
            <button class="ghost" type="button" data-action="validate-launch">Validate contract</button>
            <button class="primary" type="button" data-action="run-vanilla">Start fresh</button>
          </div>
          <div class="progress-box" id="launchProgress"><div class="progress-copy"><span id="launchProgressLabel">Preparing runtime...</span><span>0%</span></div><div class="meter"><span></span></div></div>
        </div>`,
    },
    "wp-pr": {
      title: "WordPress PR preview contract",
      badge: "Ready",
      tone: "neutral",
      body: `
        <div class="detail-section">
          <label class="form-field">PR number or URL <input value="https://github.com/WordPress/wordpress-develop/pull/7821"></label>
          <div class="notice"><strong>Constraint</strong><p>Accepts a WordPress core PR number or wordpress-develop pull request URL. The resulting identity includes the PR number.</p></div>
          <div class="button-row"><button class="ghost" data-action="validate-launch" type="button">Validate PR</button><button class="primary" data-action="run-wp-pr" type="button">Preview WordPress PR</button></div>
          <div class="progress-box" id="launchProgress"><div class="progress-copy"><span id="launchProgressLabel">Fetching PR patch...</span><span>0%</span></div><div class="meter"><span></span></div></div>
        </div>`,
    },
    "gutenberg-pr": {
      title: "Gutenberg PR or branch contract",
      badge: "Ready",
      tone: "neutral",
      body: `
        <div class="detail-section">
          <label class="form-field">PR, URL, or branch <input value="trunk"></label>
          <div class="notice"><strong>Constraint</strong><p>Branch names are accepted. Pull requests install a built Gutenberg plugin into the active runtime.</p></div>
          <div class="button-row"><button class="ghost" data-action="validate-launch" type="button">Validate branch</button><button class="primary" data-action="run-gutenberg" type="button">Preview Gutenberg</button></div>
          <div class="progress-box" id="launchProgress"><div class="progress-copy"><span id="launchProgressLabel">Resolving branch...</span><span>0%</span></div><div class="meter"><span></span></div></div>
        </div>`,
    },
    "github-import": {
      title: "GitHub import contract",
      badge: "Needs account",
      tone: "warning",
      body: `
        <div class="detail-section">
          <div class="notice warning"><strong>Account connection required</strong><p>Import plugins, themes, or wp-content directories from public GitHub repositories. The access token is not stored and refresh requires re-authentication.</p></div>
          <label class="form-field">Repository path <input value="wordpress/wordpress-develop"></label>
          <label class="form-field">Mount target <select><option>wp-content/plugins</option><option>wp-content/themes</option><option>wp-content</option></select></label>
          <div class="button-row"><button class="ghost" data-action="connect-github" type="button">Connect GitHub</button><button class="primary" data-action="run-github-import" type="button">Import repository</button></div>
          <div class="progress-box" id="launchProgress"><div class="progress-copy"><span id="launchProgressLabel">Waiting for GitHub connection...</span><span>0%</span></div><div class="meter"><span></span></div></div>
        </div>`,
    },
  };
  const detail = rows[id] || rows.vanilla;
  setDetail("Launch contract", detail.title, detail.badge, detail.tone, detail.body);
}

function saveDetail() {
  setDetail(
    "Save flow",
    "Save current Playground",
    "Temporary",
    "warning",
    `
    <div class="detail-section">
      <div class="notice warning"><strong>Temporary runtime</strong><p>This Playground is lost on refresh or close until it is saved. Browser storage and local directory are distinct destinations with different reload behavior.</p></div>
      <div class="form-grid two">
        <label class="cardlet checkbox-line"><input type="radio" name="saveDestination" value="browser" checked><span><strong>Save in this browser</strong><br><small>Creates a browser-backed slug and saved row.</small></span></label>
        <label class="cardlet checkbox-line"><input type="radio" name="saveDestination" value="local"><span><strong>Save to a local directory</strong><br><small>Asks for folder permission and may need reconnect after refresh.</small></span></label>
      </div>
      <label class="form-field">Playground name <input id="saveName" value="Review Browser Playground"></label>
      <div class="notice" id="localPermissionNote"><strong>Local directory consequence</strong><p>Folder picker target: <code>~/Sites/playground-review</code>. Permission can be revoked by the browser and must be reconnected.</p></div>
      <div class="button-row"><button class="ghost" type="button" data-action="cancel-save">Cancel</button><button class="primary" type="button" data-action="start-save">Save selected destination</button></div>
      <div class="progress-box" id="saveProgress"><div class="progress-copy"><span id="saveProgressLabel">Ready to save 3,751 files</span><span>0%</span></div><div class="meter success"><span></span></div></div>
    </div>`
  );
}

function objectDetail(rowId) {
  const isLocal = rowId === "local-object";
  const isDeleted = rowId === "deleted-object";
  setDetail(
    "Saved object",
    isDeleted ? "Deleted import test" : isLocal ? "Local Theme Lab" : "Research Browser Playground",
    isDeleted ? "Deleted" : isLocal ? "Local permission" : "Saved",
    isDeleted ? "danger" : isLocal ? "warning" : "success",
    `
    <div class="detail-section">
      <div class="cardlet">
        <p class="eyebrow">Object identity</p>
        <h3>${isDeleted ? "Final deleted state" : isLocal ? "Folder-backed Playground" : "Browser-backed Playground"}</h3>
        <p>${isDeleted ? "This row remains as an activity result after browser storage was removed." : isLocal ? "This site survives in a local folder but needs browser file-system permission after reload." : "This site has a saved browser-storage slug and can be opened or managed later."}</p>
      </div>
      <label class="form-field">Rename Playground <input id="renameInput" value="${isLocal ? "Local Theme Lab" : "Research Browser Playground"}" ${isDeleted ? "disabled" : ""}></label>
      <div class="button-row">
        <button class="ghost" data-action="open-object" type="button" ${isDeleted ? "disabled" : ""}>Open</button>
        <button class="ghost" data-action="rename-object" type="button" ${isDeleted ? "disabled" : ""}>Rename</button>
        <button class="danger" data-action="delete-object" type="button" ${isDeleted ? "disabled" : ""}>Delete</button>
      </div>
      <div class="confirm-box notice danger" id="deleteConfirm" hidden>
        <strong>Delete saved Playground?</strong>
        <p>Browser storage for this Playground will be removed. If this object is active, the shell falls back to an Unsaved Playground.</p>
        <div class="button-row"><button class="ghost" data-action="cancel-delete" type="button">Cancel</button><button class="danger" data-action="confirm-delete" type="button">Confirm delete</button></div>
      </div>
      <div class="progress-box" id="deleteProgress"><div class="progress-copy"><span id="deleteProgressLabel">Removing saved files...</span><span>0%</span></div><div class="meter"><span></span></div></div>
    </div>`
  );
}

function blueprintDetail() {
  const blueprint = blueprints.find((item) => item.name === state.selectedBlueprint) || blueprints[1];
  const cards = blueprints.map((item) => `
    <button class="blueprint-cardlet ${item.name === blueprint.name ? "is-selected" : ""}" type="button" data-blueprint="${item.name}">
      <strong>${item.name}</strong>
      <small>${item.tags}</small>
      <small>${item.summary}</small>
    </button>
  `).join("");
  const json = `{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "meta": {
    "title": "${blueprint.name}",
    "description": "Representative Blueprint detail from the current 43 item gallery"
  },
  "landingPage": "/",
  "preferredVersions": { "php": "8.3", "wp": "latest" },
  "steps": [
    { "step": "installTheme", "themeSlug": "twentytwentyfive" },
    { "step": "runPHP", "code": "<?php update_option('blogname', '${blueprint.name}');" }
  ]
}`;
  setDetail(
    "Blueprint tools",
    "Inspect, validate, and run Blueprint",
    state.blueprintValidated ? "Validated" : "Unvalidated",
    state.blueprintValidated ? "success" : "warning",
    `
    <div class="detail-section">
      <div class="blueprint-gallery">
        <div class="filter-row">
          <button class="chip is-active" type="button">All</button>
          <button class="chip" type="button">Featured</button>
          <button class="chip" type="button">Website</button>
          <button class="chip" type="button">WooCommerce</button>
          <button class="chip" type="button">News</button>
        </div>
        <input class="search-input" value="" placeholder="Search representative subset of 43 blueprints" aria-label="Search Blueprints">
        <p class="muted">Showing 6 representative entries from the 43-blueprint gallery.</p>
        <div class="blueprint-list">${cards}</div>
      </div>
      <label class="form-field">Blueprint URL <input value="https://example.com/${blueprint.name.toLowerCase().replaceAll(" ", "-")}/blueprint.json"></label>
      <label class="form-field">blueprint.json editor <textarea class="code-editor" id="blueprintEditor">${json}</textarea></label>
      <div class="notice warning" id="blueprintWarning" ${state.blueprintValidated ? "" : "hidden"}><strong>Replacement warning</strong><p>Running this Blueprint replaces current content, options, and database changes in the active temporary Playground.</p></div>
      <div class="blueprint-actions">
        <button class="ghost" type="button" data-action="copy-blueprint">Copy link</button>
        <button class="ghost" type="button" data-action="download-blueprint">Download bundle</button>
        <button class="ghost" type="button" data-action="validate-blueprint">Validate JSON</button>
        <button class="primary" type="button" data-action="run-blueprint">Run Blueprint</button>
      </div>
      <div class="progress-box" id="blueprintProgress"><div class="progress-copy"><span id="blueprintProgressLabel">Waiting for validation...</span><span>0%</span></div><div class="meter success"><span></span></div></div>
    </div>`
  );
}

function importDetail() {
  setDetail(
    "Replacement flow",
    "Import .zip archive",
    "Selected",
    "warning",
    `
    <div class="detail-section">
      <div class="notice warning"><strong>Native file chooser</strong><p>The current product opens a file chooser. This static state shows <code>plugin-review.zip</code> selected and not yet applied.</p></div>
      <div class="cardlet"><p class="eyebrow">Archive validation</p><h3>plugin-review.zip</h3><p>Contains WordPress files, wp-content, blueprint bundle, and SQLite database snapshot.</p></div>
      <div class="notice danger" id="zipWarning"><strong>Replace current Playground?</strong><p>Importing this zip replaces the active files and database. Save the temporary runtime first if you need it later.</p></div>
      <div class="button-row"><button class="ghost" data-action="validate-zip" type="button">Validate archive</button><button class="primary" data-action="run-zip-import" type="button">Import and replace</button></div>
      <div class="progress-box" id="zipProgress"><div class="progress-copy"><span id="zipProgressLabel">Ready to import archive...</span><span>0%</span></div><div class="meter"><span></span></div></div>
    </div>`
  );
}

function exportDetail(kind = "export") {
  const isDownload = kind === "download";
  setDetail(
    "Portability",
    isDownload ? "Download active Playground as .zip" : "Export active Playground to GitHub",
    isDownload ? "Ready" : "Exported",
    isDownload ? "neutral" : "success",
    `
    <div class="detail-section">
      <div class="cardlet">
        <p class="eyebrow">${isDownload ? "ZIP download" : "GitHub export"}</p>
        <h3>${isDownload ? "Build portable archive" : "Push files and blueprint"}</h3>
        <p>${isDownload ? "Generates a .zip with WordPress files, wp-content, blueprint.json, and database snapshot." : "Connects a GitHub account, selects a repository, and exports files. The token is not stored across refresh."}</p>
      </div>
      <label class="form-field">${isDownload ? "Archive name" : "Repository"} <input value="${isDownload ? "review-browser-playground.zip" : "acme/playground-review"}"></label>
      <div class="button-row"><button class="primary" data-action="${isDownload ? "run-download" : "run-export"}" type="button">${isDownload ? "Build .zip" : "Export to GitHub"}</button></div>
      <div class="progress-box" id="exportProgress"><div class="progress-copy"><span id="exportProgressLabel">Ready...</span><span>0%</span></div><div class="meter success"><span></span></div></div>
    </div>`
  );
}

function managerDetail(id = state.currentManager) {
  state.currentManager = id;
  $$(".manager-tabs button, .manager-index button").forEach((button) => {
    if (button.dataset.manager) button.classList.toggle("is-active", button.dataset.manager === id);
  });
  const panel = $("#managerPanel");
  if (!panel) return;
  const templates = {
    settings: `
      <div class="detail-section">
        <div class="notice warning"><strong>Unsaved reset warning</strong><p>Applying version, PHP, language, network, or multisite changes to a temporary Playground resets the WordPress site.</p></div>
        <div class="notice"><strong>Stored reload behavior</strong><p>Browser-saved and local-directory Playgrounds use Save & Reload. The saved identity remains, then the runtime restarts with the selected versions.</p></div>
        <div class="form-grid two">
          <label class="form-field">WordPress Version <select id="wpVersion"><option>latest</option><option>6.8</option><option>6.7</option></select></label>
          <label class="form-field">PHP Version <select id="phpVersion"><option>8.3</option><option>8.2</option><option>8.1</option></select></label>
          <label class="form-field">Language <select id="language"><option>English (United States)</option><option>Polish</option><option>Spanish</option></select></label>
          <label class="checkbox-line"><input id="olderVersions" type="checkbox"> Include older versions</label>
          <label class="checkbox-line"><input id="networkAccess" type="checkbox" checked> Allow network access</label>
          <label class="checkbox-line"><input id="multisite" type="checkbox"> Create a multisite network</label>
        </div>
        <div class="button-row"><button class="primary" type="button" data-action="apply-settings">Save & Reload</button><button class="ghost" type="button">Cancel</button></div>
        <div class="confirm-box notice warning" id="settingsConfirm" hidden><strong>Confirm reset or stored reload</strong><p>Temporary Playgrounds reset destructively. Stored Playgrounds keep their saved identity and reload from storage.</p><button class="primary" data-action="confirm-settings" type="button">Confirm Save & Reload</button></div>
        <div class="progress-box" id="settingsProgress"><div class="progress-copy"><span id="settingsProgressLabel">Waiting for settings...</span><span>0%</span></div><div class="meter success"><span></span></div></div>
      </div>`,
    files: `
      <div class="detail-section">
        <div class="button-row"><button class="ghost" data-action="new-file" type="button">New File</button><button class="ghost" data-action="new-folder" type="button">New Folder</button><button class="ghost" data-action="upload-file" type="button">Upload</button><button class="ghost" data-action="browse-files" type="button">Browse files</button></div>
        <div class="file-browser">
          <div class="file-tree"><button class="is-active">/wordpress/wp-config.php</button><button>/wordpress/wp-content</button><button>/wordpress/wp-admin</button><button>/wordpress/wp-includes</button></div>
          <div class="editor-pane"><label class="form-field">Selected file editor <textarea class="code-editor" id="fileEditor"><?php define('DB_NAME', 'database_name_here');
define('DB_USER', 'username_here');
define('DB_HOST', 'localhost');</textarea></label><div class="button-row"><button class="ghost" data-action="dirty-file" type="button">Edit</button><button class="primary" data-action="save-file" type="button">Save file</button></div><p class="muted" id="fileState">Clean file, no unsaved changes.</p></div>
        </div>
      </div>`,
    blueprint: `
      <div class="detail-section">
        <div class="button-row"><button class="ghost" data-action="copy-blueprint">Copy link</button><button class="ghost" data-action="download-blueprint">Download bundle</button><button class="primary" data-action="open-blueprint">Open Blueprint runner</button></div>
        <textarea class="code-editor">{"$schema":"https://playground.wordpress.net/blueprint-schema.json","landingPage":"/","preferredVersions":{"php":"8.3","wp":"latest"}}</textarea>
        <p class="muted">Use the selected detail panel to validate, warn, run, and show the result state.</p>
      </div>`,
    database: `
      <div class="detail-section">
        <div class="notice"><strong>Database management is early access</strong><p>WordPress Playground emulates MySQL using SQLite.</p></div>
        <dl class="db-grid"><div><dt>Driver</dt><dd>MySQL emulation backed by SQLite</dd></div><div><dt>Path</dt><dd><code>/wordpress/wp-content/database/.ht.sqlite</code></dd></div><div><dt>Size</dt><dd>452 KB</dd></div></dl>
        <div class="button-row"><button class="ghost" data-action="download-db" type="button">Download database.sqlite</button><button class="primary" data-action="open-adminer" type="button">Open Adminer</button><button class="primary" data-action="open-phpmyadmin" type="button">Open phpMyAdmin</button></div>
        <p class="muted" id="dbResult">No database transfer started.</p>
      </div>`,
    logs: `
      <div class="detail-section">
        <div class="log-list">
          <div class="log-line"><strong>Playground</strong><span class="state-badge success">OK</span><span>No problems so far.</span></div>
          <div class="log-line"><strong>WordPress</strong><span class="state-badge warning">Notice</span><span>Theme preview generated a missing image warning after import.</span></div>
          <div class="log-line"><strong>PHP</strong><span class="state-badge neutral">Empty</span><span>No PHP fatal errors recorded.</span></div>
        </div>
      </div>`,
  };
  panel.innerHTML = templates[id] || templates.settings;
}

function renderManagerInDetail(id = "settings") {
  openView("manager");
  managerDetail(id);
  setDetail("Site Manager", `${id[0].toUpperCase()}${id.slice(1)} tools`, "Open", "neutral", `<p class="muted">The selected Site Manager tab is open in the table area. The live preview remains protected above this detail pane.</p>`);
}

function runLaunch(kind) {
  const config = {
    "run-vanilla": {
      steps: ["Resetting files...", "Preparing WordPress...", "Opening homepage..."],
      title: "Unsaved Playground",
      headline: "Hello from WordPress Playground!",
      copy: "A fresh vanilla WordPress runtime is active and still temporary until saved.",
      path: "/hello-from-playground/",
      source: "Fresh vanilla WordPress runtime started.",
    },
    "run-wp-pr": {
      steps: ["Fetching PR 7821...", "Applying patch...", "Booting PR preview..."],
      title: "WP PR 7821 Playground",
      headline: "WordPress PR 7821 Preview",
      copy: "Core pull request preview is active with a temporary runtime identity.",
      path: "/wp-admin/about.php?pr=7821",
      source: "WordPress PR preview imported.",
    },
    "run-gutenberg": {
      steps: ["Resolving trunk...", "Installing Gutenberg...", "Opening editor..."],
      title: "Gutenberg trunk Playground",
      headline: "Gutenberg Branch Preview",
      copy: "The Gutenberg branch is installed and ready for admin review.",
      path: "/wp-admin/site-editor.php",
      source: "Gutenberg branch preview imported.",
    },
    "run-github-import": {
      steps: ["Connecting account...", "Reading repository...", "Mounting wp-content..."],
      title: "GitHub Import Playground",
      headline: "GitHub Repository Imported",
      copy: "Repository files are mounted in the active temporary Playground. Token is not stored after refresh.",
      path: "/wp-admin/plugins.php",
      source: "GitHub import completed.",
    },
  }[kind];
  if (!config) return;
  simulateProgress({
    box: "#launchProgress",
    label: "#launchProgressLabel",
    steps: config.steps.map((text, index) => ({ text, width: [30, 68, 100][index] })),
    done: () => {
      updateShell({ title: config.title, path: config.path, storage: "temporary", subtitle: "Temporary review contract active" });
      updatePreview({ title: config.title, headline: config.headline, copy: config.copy, label: "Preview result", path: config.path });
      addTransfer("Launch contract", config.title, "success", "Imported", config.source);
      $("#summaryStatus").textContent = "temporary review runtime active";
      setBadge($("#detailState"), "Imported", "success");
    },
  });
}

function startSave() {
  const destination = $('input[name="saveDestination"]:checked')?.value || "browser";
  const name = $("#saveName")?.value || (destination === "local" ? "Local Review Playground" : "Review Browser Playground");
  const steps = destination === "local"
    ? ["Requesting folder permission...", "Saving 1120 / 3751 files...", "Saving 3028 / 3751 files...", "Local directory ready"]
    : ["Saving 420 / 3751 files...", "Saving 1640 / 3751 files...", "Saving 3028 / 3751 files...", "Browser save complete"];
  setBadge($("#activeObjectState"), "Saving", "warning");
  $("#transferSaveResult").textContent = "Copy in progress";
  setBadge($("#transferSaveState"), "Saving", "warning");
  simulateProgress({
    box: "#saveProgress",
    label: "#saveProgressLabel",
    steps: steps.map((text, index) => ({ text, width: [18, 46, 78, 100][index] })),
    done: () => {
      const isLocal = destination === "local";
      updateShell({
        title: name,
        path: isLocal ? "/local-directory-review/" : "/review-browser-playground/",
        storage: isLocal ? "local" : "browser",
        subtitle: isLocal ? "Folder-backed local Playground" : "Saved in this browser a moment ago",
      });
      $("#activeObjectName").textContent = name;
      $("#activeObjectMeta").textContent = isLocal ? "Saved to ~/Sites/playground-review" : "Saved in this browser a moment ago";
      $("#activeObjectStorage").innerHTML = isLocal ? "<code>~/Sites/playground-review</code>" : "Browser storage slug <code>/review-browser-playground/</code>";
      setBadge($("#activeObjectState"), isLocal ? "Local permission" : "Saved", isLocal ? "warning" : "success");
      $("#transferSaveResult").textContent = isLocal ? "Folder permission granted; reconnect may be required" : "Saved row and slug created";
      setBadge($("#transferSaveState"), isLocal ? "Local permission" : "Saved", isLocal ? "warning" : "success");
      $("#summaryStatus").textContent = isLocal ? "local directory Playground active" : "browser-saved Playground active";
      setBadge($("#detailState"), isLocal ? "Local permission" : "Saved", isLocal ? "warning" : "success");
      addTransfer(isLocal ? "Local directory save" : "Browser save", name, isLocal ? "warning" : "success", isLocal ? "Local permission" : "Saved", isLocal ? "Folder-backed identity created" : "Browser-backed slug created");
    },
  });
}

function validateBlueprint() {
  state.blueprintValidated = true;
  setBadge($("#detailState"), "Validated", "success");
  setBadge($("#blueprintRouteState"), "Validated", "success");
  const warning = $("#blueprintWarning");
  if (warning) warning.hidden = false;
  const label = $("#blueprintProgressLabel");
  if (label) label.textContent = "JSON schema valid; replacement warning required before run.";
}

function runBlueprint() {
  if (!state.blueprintValidated) validateBlueprint();
  simulateProgress({
    box: "#blueprintProgress",
    label: "#blueprintProgressLabel",
    steps: [
      { text: "Confirming replacement of current content...", width: 18 },
      { text: "Running Blueprint steps...", width: 48 },
      { text: "Updating database and options...", width: 76 },
      { text: `${state.selectedBlueprint} Blueprint applied`, width: 100 },
    ],
    done: () => {
      updateShell({ title: `${state.selectedBlueprint} Playground`, path: "/", storage: "imported", subtitle: "Blueprint run replaced current content" });
      updatePreview({
        title: `${state.selectedBlueprint} Playground`,
        headline: `${state.selectedBlueprint} Blueprint Applied`,
        copy: "The selected Blueprint replaced the active content, updated the database, and opened the resulting WordPress homepage.",
        label: "Blueprint result",
        path: "/",
      });
      setBadge($("#detailState"), "Run complete", "success");
      setBadge($("#blueprintRouteState"), "Imported", "success");
      setBadge($("#activeObjectState"), "Imported", "success");
      $("#activeObjectMeta").textContent = "Temporary runtime replaced by Blueprint result";
      addTransfer("Blueprint run", state.selectedBlueprint, "success", "Imported", "Preview and database updated");
      $("#summaryStatus").textContent = "Blueprint result active";
    },
  });
}

function runSettingsReload() {
  const wp = $("#wpVersion")?.value || "latest";
  const php = $("#phpVersion")?.value || "8.3";
  const language = $("#language")?.value || "English (United States)";
  const network = $("#networkAccess")?.checked ? "network on" : "network off";
  simulateProgress({
    box: "#settingsProgress",
    label: "#settingsProgressLabel",
    steps: [
      { text: "Saving runtime settings...", width: 22 },
      { text: state.storage === "temporary" ? "Resetting unsaved Playground..." : "Reloading stored Playground identity...", width: 56 },
      { text: "Booting WordPress with selected versions...", width: 82 },
      { text: "Runtime badge updated", width: 100 },
    ],
    done: () => {
      const runtime = `WP ${wp} / PHP ${php}`;
      updateShell({ runtime, subtitle: state.storage === "temporary" ? "Settings applied with destructive reset" : "Stored Playground reloaded from saved identity" });
      $("#activeObjectRuntime").textContent = `${runtime} / ${language} / ${network}`;
      setBadge($("#detailState"), "Reloaded", "success");
      addTransfer("Settings Save & Reload", runtime, "success", "Saved", state.storage === "temporary" ? "Unsaved reset completed with warning" : "Stored reload completed");
      $("#summaryStatus").textContent = "runtime settings reloaded";
    },
  });
}

function runZipImport() {
  simulateProgress({
    box: "#zipProgress",
    label: "#zipProgressLabel",
    steps: [
      { text: "Validating plugin-review.zip...", width: 20 },
      { text: "Replacing WordPress files...", width: 50 },
      { text: "Restoring SQLite database...", width: 78 },
      { text: "Imported zip is active", width: 100 },
    ],
    done: () => {
      updateShell({ title: "Imported ZIP Playground", path: "/wp-admin/plugins.php", storage: "imported", subtitle: "Archive import replaced files and database" });
      updatePreview({ title: "Imported ZIP Playground", headline: "ZIP Import Applied", copy: "The selected archive replaced the active files and database. Plugin review state is open in WP Admin.", label: "Import result", path: "/wp-admin/plugins.php" });
      setBadge($("#zipState"), "Imported", "success");
      setBadge($("#transferImportState"), "Imported", "success");
      $("#transferImportResult").textContent = "Files and database replaced";
      setBadge($("#detailState"), "Imported", "success");
      addTransfer("ZIP import", "plugin-review.zip", "success", "Imported", "Active Playground replaced");
    },
  });
}

function runExport(kind) {
  simulateProgress({
    box: "#exportProgress",
    label: "#exportProgressLabel",
    steps: [
      { text: kind === "download" ? "Collecting Playground files..." : "Connecting GitHub account...", width: 24 },
      { text: kind === "download" ? "Bundling database and blueprint..." : "Pushing files and database snapshot...", width: 68 },
      { text: kind === "download" ? "review-browser-playground.zip is ready" : "Exported to acme/playground-review", width: 100 },
    ],
    done: () => {
      if (kind === "download") {
        addTransfer("Download .zip", "review-browser-playground.zip", "success", "Exported", "Portable archive generated");
      } else {
        setBadge($("#transferExportState"), "Exported", "success");
        addTransfer("GitHub export", "acme/playground-review", "success", "Exported", "Repository updated");
      }
      setBadge($("#detailState"), "Exported", "success");
    },
  });
}

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    openView(viewButton.dataset.view);
    return;
  }

  const row = event.target.closest(".table-row[data-row]");
  if (row && !event.target.closest(".table-header")) {
    selectRow(row);
    const detail = row.dataset.detail;
    if (detail === "launch") launchDetail(row.dataset.row);
    if (detail === "save") saveDetail();
    if (detail === "object") objectDetail(row.dataset.row);
    if (detail === "blueprint") blueprintDetail();
    if (detail === "import") importDetail();
    if (detail === "export") exportDetail("export");
    if (detail === "download") exportDetail("download");
    return;
  }

  const managerButton = event.target.closest("[data-manager]");
  if (managerButton) {
    renderManagerInDetail(managerButton.dataset.manager);
    return;
  }

  const detailButton = event.target.closest("[data-detail]");
  if (detailButton && !detailButton.closest(".table-row")) {
    if (detailButton.dataset.detail === "export") exportDetail("export");
    if (detailButton.dataset.detail === "download") exportDetail("download");
    return;
  }

  const blueprintButton = event.target.closest("[data-blueprint]");
  if (blueprintButton) {
    state.selectedBlueprint = blueprintButton.dataset.blueprint;
    state.blueprintValidated = false;
    blueprintDetail();
    return;
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;

  if (action === "validate-launch") {
    setBadge($("#detailState"), "Validated", "success");
  }
  if (["run-vanilla", "run-wp-pr", "run-gutenberg", "run-github-import"].includes(action)) runLaunch(action);
  if (action === "connect-github") {
    setBadge($("#detailState"), "Connected", "success");
    addTransfer("GitHub account", "wordpress/wordpress-develop", "success", "Connected", "Token available for this session only");
  }
  if (action === "start-save") startSave();
  if (action === "cancel-save") saveDetail();
  if (action === "rename-object") {
    const value = $("#renameInput")?.value || "Renamed Playground";
    const rowName = $('[data-row="browser-object"] strong');
    if (rowName) rowName.textContent = value;
    setBadge($("#detailState"), "Renamed", "success");
    addTransfer("Rename", value, "success", "Saved", "Saved row name updated");
  }
  if (action === "open-object") {
    updateShell({ title: $("#renameInput")?.value || "Research Browser Playground", path: "/research-browser/", storage: "browser", subtitle: "Opened saved browser Playground" });
    setBadge($("#detailState"), "Open", "success");
  }
  if (action === "delete-object") {
    $("#deleteConfirm").hidden = false;
    setBadge($("#detailState"), "Confirm delete", "danger");
  }
  if (action === "cancel-delete") {
    $("#deleteConfirm").hidden = true;
    setBadge($("#detailState"), "Saved", "success");
  }
  if (action === "confirm-delete") {
    simulateProgress({
      box: "#deleteProgress",
      label: "#deleteProgressLabel",
      steps: [
        { text: "Removing browser storage...", width: 35 },
        { text: "Updating saved list...", width: 75 },
        { text: "Deleted row retained as final state", width: 100 },
      ],
      done: () => {
        const row = $('[data-row="browser-object"]');
        if (row) {
          row.classList.add("deleted-row");
          row.querySelector("small").textContent = "Deleted just now";
          row.children[1].textContent = "Browser storage removed";
          row.children[3].innerHTML = '<em class="state-badge danger">Deleted</em>';
          row.children[4].textContent = "Removed";
        }
        setBadge($("#detailState"), "Deleted", "danger");
        addTransfer("Delete", "Research Browser Playground", "danger", "Deleted", "Saved row removed from usable library");
      },
    });
  }
  if (action === "copy-blueprint") addTransfer("Blueprint copy", state.selectedBlueprint, "success", "Copied", "Share URL copied");
  if (action === "download-blueprint") addTransfer("Blueprint download", state.selectedBlueprint, "success", "Exported", "Bundle download ready");
  if (action === "validate-blueprint") validateBlueprint();
  if (action === "run-blueprint") runBlueprint();
  if (action === "open-blueprint") blueprintDetail();
  if (action === "validate-zip") {
    setBadge($("#zipState"), "Validated", "success");
    setBadge($("#detailState"), "Validated", "success");
  }
  if (action === "run-zip-import") runZipImport();
  if (action === "apply-settings") {
    const confirm = $("#settingsConfirm");
    if (confirm) confirm.hidden = false;
    setBadge($("#detailState"), "Warning", "warning");
  }
  if (action === "confirm-settings") runSettingsReload();
  if (action === "dirty-file") {
    $("#fileState").textContent = "Dirty file: wp-config.php has unsaved edits.";
    setBadge($("#detailState"), "Dirty", "warning");
  }
  if (action === "save-file") {
    $("#fileState").textContent = "Saved wp-config.php and wrote result to WordPress logs.";
    setBadge($("#detailState"), "Saved", "success");
    addTransfer("File save", "/wordpress/wp-config.php", "success", "Saved", "Editor dirty state cleared");
  }
  if (action === "download-db") {
    $("#dbResult").textContent = "database.sqlite download prepared from /wordpress/wp-content/database/.ht.sqlite.";
    addTransfer("Database download", "database.sqlite", "success", "Exported", "SQLite file prepared");
  }
  if (action === "open-adminer") $("#dbResult").textContent = "Adminer opened for the SQLite-backed database.";
  if (action === "open-phpmyadmin") $("#dbResult").textContent = "phpMyAdmin opened for the SQLite-backed database.";
  if (action === "run-export") runExport("github");
  if (action === "run-download") runExport("download");
});

$("#saveHeaderButton").addEventListener("click", () => {
  openView("objects");
  saveDetail();
});

$("#resetHeaderButton").addEventListener("click", () => {
  renderManagerInDetail("settings");
  const confirm = $("#settingsConfirm");
  if (confirm) confirm.hidden = false;
});

$("#refreshButton").addEventListener("click", () => {
  addTransfer("Refresh", state.activePath, "success", "Saved", "Embedded WordPress page reloaded");
});

$("#homeButton").addEventListener("click", () => {
  updatePreview({ path: "/hello-from-playground/", headline: "Hello from WordPress Playground!", copy: "Homepage shortcut opened inside the protected live preview.", label: "Homepage" });
});

$("#adminButton").addEventListener("click", () => {
  updatePreview({ path: "/wp-admin/", headline: "WordPress Admin", copy: "WP Admin shortcut opened while the same active Playground identity stayed selected.", label: "Admin route" });
});

launchDetail("vanilla");
managerDetail("settings");
