const commands = [
  {
    id: "vanilla",
    key: "V",
    group: "Start",
    title: "Vanilla WordPress",
    detail: "Start a fresh temporary Playground immediately.",
    tag: "no input",
    summary: "A clean WordPress Playground starts without extra configuration.",
    body: `
      <div class="notice"><strong>Temporary by default</strong><span>Refreshing or closing the browser can discard this site until it is saved.</span></div>
      <button class="primary" data-run-source="Vanilla WordPress">Start fresh Playground</button>
    `
  },
  {
    id: "wordpress-pr",
    key: "P",
    group: "Start",
    title: "Preview a WordPress PR",
    detail: "Requires a WordPress Core PR number or URL.",
    tag: "PR number or URL",
    summary: "Preview a WordPress pull request in a temporary Playground.",
    body: `
      <form class="inspector-form">
        <label>PR number or URL<input value="https://github.com/WordPress/wordpress-develop/pull/6400"></label>
        <div class="notice"><strong>Constraint</strong><span>Accepts a Core PR number or full pull request URL.</span></div>
        <button class="primary" type="button" data-run-source="WordPress PR preview">Preview WordPress PR</button>
      </form>
    `
  },
  {
    id: "gutenberg-pr",
    key: "G",
    group: "Start",
    title: "Preview a Gutenberg PR or branch",
    detail: "Accepts PR number, URL, or a branch name.",
    tag: "PR, URL, branch",
    summary: "Start a temporary Playground from a Gutenberg pull request URL, PR number, or branch name.",
    body: `
      <form class="inspector-form">
        <label>PR number, URL, or branch name<input value="trunk"></label>
        <div class="notice"><strong>Input is flexible</strong><span>Unlike WordPress Core preview, this route also accepts a Gutenberg branch name.</span></div>
        <button class="primary" type="button" data-run-source="Gutenberg PR or branch">Preview Gutenberg</button>
      </form>
    `
  },
  {
    id: "github-import",
    key: "H",
    group: "Import",
    title: "Import from GitHub",
    detail: "Connect GitHub to import public plugins, themes, or wp-content directories.",
    tag: "account connect",
    summary: "Import a public GitHub repository after connecting an account.",
    body: `
      <div class="notice"><strong>GitHub connection required</strong><span>The access token is not stored. Re-authentication is required after refresh.</span></div>
      <form class="inspector-form">
        <label>Repository URL<input value="https://github.com/example/theme-lab"></label>
        <label>Import target<select><option>Theme</option><option>Plugin</option><option>wp-content directory</option></select></label>
        <button class="primary" type="button" data-transfer="GitHub import connected; repository queued for import.">Connect GitHub account</button>
      </form>
    `
  },
  {
    id: "blueprint-url",
    key: "U",
    group: "Import",
    title: "Run Blueprint from URL",
    detail: "Requires a URL to a blueprint JSON file.",
    tag: "URL input",
    summary: "Run a remote Blueprint JSON against the Playground.",
    body: `
      <form class="inspector-form">
        <label>Blueprint URL<input value="https://playground.wordpress.net/blueprints/theme-preview.json"></label>
        <div class="notice"><strong>Current site consequence</strong><span>Running a blueprint can alter the active Playground content and configuration.</span></div>
        <button class="primary" type="button" data-transfer="Blueprint URL loaded and ready to run over the current Playground.">Run Blueprint</button>
      </form>
    `
  },
  {
    id: "zip-import",
    key: "Z",
    group: "Import",
    title: "Import .zip",
    detail: "Opens the native file chooser and may replace the current site.",
    tag: "file chooser",
    summary: "Import a zip archive into Playground using the browser file picker.",
    body: `
      <div class="notice destructive"><strong>Import over current site</strong><span>This can replace files in the current unsaved Playground. Save first if you need this state.</span></div>
      <button class="primary" data-transfer="Native file chooser opened; zip import will run against the current Playground.">Choose .zip file</button>
    `
  },
  {
    id: "save-browser",
    key: "S",
    group: "Save",
    title: "Save in this browser",
    detail: "Copy Playground files into browser storage and create a site slug.",
    tag: "browser storage",
    summary: "Save the temporary Playground in this browser and show copy progress.",
    body: `
      <form class="inspector-form">
        <label>Playground name<input id="saveName" value="Research Browser Playground"></label>
        <div class="choice-grid">
          <button class="choice" type="button" data-save="browser"><strong>Save in this browser</strong><span>Creates a saved Playground entry and site-slug URL.</span></button>
          <button class="choice" type="button" data-command="save-local"><strong>Save to a local directory</strong><span>Requires choosing a directory on this device.</span></button>
        </div>
        <div id="saveProgress"><strong>Ready to save</strong><div class="progress"><span style="width:0%"></span></div></div>
      </form>
    `
  },
  {
    id: "save-local",
    key: "L",
    group: "Save",
    title: "Save to a local directory",
    detail: "Choose a device folder and copy Playground files there.",
    tag: "directory picker",
    summary: "Save the Playground into a local directory, separate from browser storage.",
    body: `
      <div class="notice"><strong>Distinct destination</strong><span>This does not create a browser-backed saved Playground. It writes files to a selected local folder.</span></div>
      <form class="inspector-form">
        <label>Directory handle<input value="~/Sites/research-browser-playground"></label>
        <button class="primary" type="button" data-save="local">Choose directory and copy files</button>
      </form>
      <div id="localProgress"><strong>No directory selected</strong><div class="progress"><span style="width:0%"></span></div></div>
    `
  },
  {
    id: "settings-reset",
    key: "R",
    group: "Manage",
    title: "Apply Settings & Reset Playground",
    detail: "Change WP, PHP, language, network, or multisite options.",
    tag: "destructive",
    summary: "Modify runtime settings and reset or reload the Playground depending on saved state.",
    body: `
      <div class="notice destructive"><strong>Destructive for unsaved sites</strong><span>Applying settings rebuilds this Playground. Browser-saved sites use Save & Reload.</span></div>
      <form class="inspector-form">
        <label>WordPress Version<select><option>latest</option><option>6.8</option><option>6.7</option></select></label>
        <label>PHP Version<select><option>PHP 8.3</option><option>PHP 8.2</option></select></label>
        <button class="danger" type="button" data-flow-update="Settings reset queued; current unsaved site will rebuild.">Apply Settings & Reset Playground</button>
      </form>
    `
  },
  {
    id: "files",
    key: "F",
    group: "Site Manager",
    title: "File browser",
    detail: "Create files and folders, upload, browse, and edit WordPress files.",
    tag: "wp-config.php",
    summary: "Open Site Manager directly to the file browser.",
    body: `<button class="primary" data-open-tool="files">Open File browser</button>`
  },
  {
    id: "blueprint-editor",
    key: "B",
    group: "Site Manager",
    title: "Blueprint bundle",
    detail: "Edit blueprint.json, copy link, download bundle, or run Blueprint.",
    tag: "JSON",
    summary: "Inspect and run the current Playground blueprint bundle.",
    body: `<button class="primary" data-open-tool="blueprint">Open Blueprint tools</button>`
  },
  {
    id: "database",
    key: "D",
    group: "Site Manager",
    title: "Database tools",
    detail: "Inspect SQLite path and size, download database.sqlite, open Adminer or phpMyAdmin.",
    tag: "SQLite",
    summary: "Open early-access database tools for the current Playground.",
    body: `<button class="primary" data-open-tool="database">Open Database</button>`
  },
  {
    id: "logs",
    key: "O",
    group: "Site Manager",
    title: "Logs",
    detail: "Inspect Playground, WordPress, and PHP log streams.",
    tag: "empty state",
    summary: "Open log panels and current empty state.",
    body: `<button class="primary" data-open-tool="logs">Open Logs</button>`
  },
  {
    id: "export-github",
    key: "E",
    group: "Export",
    title: "Export to GitHub",
    detail: "Export the current Playground content to GitHub.",
    tag: "repository",
    summary: "Send current Playground files to a GitHub repository.",
    body: `
      <form class="inspector-form">
        <label>Repository destination<input value="wordpress/theme-experiment"></label>
        <button class="primary" type="button" data-transfer="Export to GitHub prepared for wordpress/theme-experiment.">Prepare GitHub export</button>
      </form>
    `
  },
  {
    id: "download-zip",
    key: "X",
    group: "Export",
    title: "Download as .zip",
    detail: "Package the current Playground as a zip archive.",
    tag: "archive",
    summary: "Download a portable zip archive of the current Playground.",
    body: `<button class="primary" data-transfer="Zip archive generated for the current Playground.">Download .zip</button>`
  },
  {
    id: "blueprint-gallery",
    key: "A",
    group: "Blueprints",
    title: "Browse all 43 blueprints",
    detail: "Search, filter, inspect, and run catalog entries.",
    tag: "catalog",
    summary: "Open the Blueprint gallery with real categories and selected Blueprint detail.",
    body: `<button class="primary" data-tab="gallery">Open Blueprint gallery</button>`
  },
  {
    id: "rename-delete",
    key: "M",
    group: "Saved",
    title: "Rename or delete saved Playground",
    detail: "Manage browser-backed Playgrounds and the unsaved current session.",
    tag: "saved list",
    summary: "Open saved management with rename and delete consequences visible.",
    body: `<button class="primary" data-tab="saved">Open Saved Playgrounds</button>`
  }
];

const blueprints = [
  ["Art Gallery", "An art gallery created with the Vueo theme.", ["Website", "Personal", "Featured"], ["#8d6a22", "#1f7c75", "#e7c08a"]],
  ["Coffee Shop", "A stylish WooCommerce coffee shop storefront with custom theme, products, and content.", ["WooCommerce", "Store", "Featured"], ["#51257e", "#f0a45d", "#412010"]],
  ["Feed Reader with the Friends Plugin", "Read feeds from the web in Playground with Friends plugin subscriptions.", ["Content", "social web", "Featured"], ["#edf4ff", "#5573d8", "#ffffff"]],
  ["Gaming News", "A gaming news site created with the Spiel theme.", ["Website", "News", "Themes"], ["#050505", "#f26834", "#ffffff"]],
  ["Non-profit Organization", "A non-profit organization site created with the Koinonia theme.", ["Website", "Organization"], ["#4a2717", "#d07b4d", "#1a0f0b"]],
  ["Personal Blog", "A personal blog created with the Substrata theme.", ["Website", "Personal", "Blog"], ["#681035", "#d8bdc9", "#260713"]],
  ["Block Theme Starter", "A clean starter for testing block theme templates and style variations.", ["Themes", "Gutenberg"], ["#214e68", "#e8f4f6", "#90b6c8"]],
  ["Pattern Directory Draft", "Content patterns and synced pattern experiments for Site Editor review.", ["Gutenberg", "Content"], ["#29394d", "#f2dd72", "#8797a5"]],
  ["Woo Product Grid", "A compact WooCommerce catalog for product layout testing.", ["WooCommerce", "Website"], ["#1d3f37", "#8bd4b0", "#f7f3e7"]],
  ["Newsroom Blocks", "A news layout for testing query loops, taxonomy pages, and post templates.", ["News", "Gutenberg"], ["#202733", "#e34f4f", "#f8f8f8"]],
  ["Experimental Modules", "A sandbox for experiments and feature plugin compatibility checks.", ["Experiments", "Gutenberg"], ["#22242b", "#8ba3ff", "#f6f7fb"]],
  ["Theme Preview Matrix", "Compare templates, global styles, and homepage variants in one starter site.", ["Themes", "Website"], ["#314030", "#e0e6cc", "#95a86f"]]
];

const savedSites = [
  { name: "Unsaved Playground", meta: "Not saved to browser storage", status: "temporary" },
  { name: "Research Browser Playground", meta: "Created May 21, 2026", status: "browser" },
  { name: "Theme Regression Lab", meta: "Created May 20, 2026", status: "browser" }
];

let selectedCommand = "gutenberg-pr";
let selectedBlueprint = 2;

const commandGroups = document.querySelector("#commandGroups");
const inspectorGroup = document.querySelector("#inspectorGroup");
const inspectorTitle = document.querySelector("#inspectorTitle");
const inspectorSummary = document.querySelector("#inspectorSummary");
const inspectorBody = document.querySelector("#inspectorBody");

function renderCommands() {
  const query = document.querySelector("#commandSearch").value.toLowerCase();
  const filtered = commands.filter((command) =>
    [command.group, command.title, command.detail, command.tag].join(" ").toLowerCase().includes(query)
  );
  const groups = [...new Set(filtered.map((command) => command.group))];
  commandGroups.innerHTML = groups.map((group) => {
    const rows = filtered.filter((command) => command.group === group).map((command) => `
      <button class="command-row ${command.id === selectedCommand ? "active" : ""}" data-command="${command.id}">
        <span class="command-key">${command.key}</span>
        <span><strong>${command.title}</strong><small>${command.detail}</small></span>
        <span class="tag">${command.tag}</span>
      </button>
    `).join("");
    return `<section class="command-group"><div class="group-title"><span>${group}</span><span>${filtered.filter((command) => command.group === group).length}</span></div>${rows}</section>`;
  }).join("");
}

function setCommand(id) {
  const command = commands.find((item) => item.id === id) || commands[0];
  selectedCommand = command.id;
  inspectorGroup.textContent = command.group;
  inspectorTitle.textContent = command.title;
  inspectorSummary.textContent = command.summary;
  inspectorBody.innerHTML = command.body;
  document.querySelector("#flowSource").textContent = command.group === "Start" ? `${command.title} selected` : "Launch route remains available";
  renderCommands();
}

function setTab(tab) {
  document.querySelectorAll(".tab").forEach((button) => button.classList.toggle("active", button.dataset.tab === tab));
  document.querySelectorAll(".panel").forEach((panel) => panel.classList.toggle("active", panel.id === `panel-${tab}`));
}

function setTool(tool) {
  setTab("manager");
  document.querySelectorAll(".tool-tab").forEach((button) => button.classList.toggle("active", button.dataset.tool === tool));
  document.querySelectorAll(".tool-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `tool-${tool}`));
}

function updateFlow(step, message) {
  const order = ["source", "saving", "identity", "tools", "portable"];
  const index = order.indexOf(step);
  document.querySelectorAll(".flow-step").forEach((item) => {
    const itemIndex = order.indexOf(item.dataset.flow);
    item.classList.toggle("done", itemIndex < index);
    item.classList.toggle("current", item.dataset.flow === step);
  });
  if (step === "saving") document.querySelector("#flowSaving").textContent = message;
  if (step === "identity") document.querySelector("#flowIdentity").textContent = message;
  if (step === "tools") document.querySelector("#flowTools").textContent = message;
  if (step === "portable") document.querySelector("#flowPortable").textContent = message;
}

function simulateSave(kind) {
  const browser = kind === "browser";
  const target = browser ? document.querySelector("#saveProgress") : document.querySelector("#localProgress");
  if (!target) return;
  target.innerHTML = `<strong>${browser ? "Saving 3028 / 3751 files" : "Copying 1840 / 3751 files to local directory"}</strong><div class="progress"><span style="width:${browser ? "81" : "49"}%"></span></div>`;
  updateFlow("saving", browser ? "Browser storage selected; file-copy progress visible" : "Local directory selected; not a browser saved site");
  window.setTimeout(() => {
    if (browser) {
      target.innerHTML = `<strong>Saved as Research Browser Playground</strong><div class="progress"><span style="width:100%"></span></div>`;
      document.querySelector("#shellState").textContent = "✓ Saved Playground";
      document.querySelector("#shellState").className = "save-state saved";
      document.querySelector("#activeSiteName").textContent = "Research Browser Playground";
      document.querySelector("#managerName").textContent = "Research Browser Playground";
      document.querySelector("#managerMeta").textContent = "Saved in this browser a moment ago";
      updateFlow("identity", "Saved Playground has slug, rename, and delete actions");
    } else {
      target.innerHTML = `<strong>Saved to ~/Sites/research-browser-playground</strong><div class="progress"><span style="width:100%"></span></div>`;
      updateFlow("portable", "Local directory result completed");
    }
  }, 550);
}

function setTransfer(message) {
  const result = document.querySelector("#transferResult");
  result.innerHTML = `<span class="pill">Result</span><h2>${message}</h2><p>The active unsaved/saved state remains visible before the action completes, so replacement and portability consequences are not hidden.</p>`;
  updateFlow("portable", message);
}

function renderGallery() {
  const activeFilter = document.querySelector("#galleryFilters .active").dataset.filter;
  const query = document.querySelector("#gallerySearch").value.toLowerCase();
  const visible = blueprints.filter((blueprint) => {
    const [title, description, tags] = blueprint;
    const matchesFilter = activeFilter === "All" || tags.includes(activeFilter);
    const matchesQuery = [title, description, ...tags].join(" ").toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });
  document.querySelector("#galleryCount").textContent = `Showing ${activeFilter === "All" && !query ? "43" : visible.length} blueprints`;
  document.querySelector("#blueprintGrid").innerHTML = visible.map((blueprint) => {
    const sourceIndex = blueprints.indexOf(blueprint);
    const [title, description, tags, colors] = blueprint;
    return `
      <button class="blueprint-card ${sourceIndex === selectedBlueprint ? "active" : ""}" data-blueprint="${sourceIndex}" style="--thumb-a:${colors[0]};--thumb-b:${colors[1]};--thumb-c:${colors[2]}">
        <div class="thumb" aria-hidden="true"></div>
        <div>
          <strong>${title}</strong>
          <p>${description}</p>
          <span class="chip-list">${tags.slice(0, 3).map((tag) => `<span>${tag}</span>`).join("")}</span>
        </div>
      </button>
    `;
  }).join("");
  renderBlueprintDetail();
}

function renderBlueprintDetail() {
  const [title, description, tags] = blueprints[selectedBlueprint];
  document.querySelector("#galleryDetail").innerHTML = `
    <span class="pill">Selected Blueprint</span>
    <h2>${title}</h2>
    <p>${description}</p>
    <div class="meta-grid">
      <span><strong>Catalog</strong><em>Part of 43 entries</em></span>
      <span><strong>Tags</strong><em>${tags.join(", ")}</em></span>
      <span><strong>Inspect</strong><em>Blueprint JSON available</em></span>
    </div>
    <div class="mini-list">
      <button data-run-source="${title} Blueprint">Run Blueprint</button>
      <button data-open-tool="blueprint">Inspect blueprint.json</button>
      <button data-command="blueprint-url">Run from Blueprint URL instead</button>
    </div>
  `;
}

function renderSaved() {
  document.querySelector("#savedTable").innerHTML = savedSites.map((site, index) => `
    <div class="saved-row ${index === 1 ? "active" : ""}">
      <span class="wp-badge">W</span>
      <span><strong>${site.name}</strong><small>${site.meta}</small></span>
      <button data-open-saved="${index}">Open</button>
      <button data-delete-saved="${index}">Delete</button>
    </div>
  `).join("");
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;
  if (target.dataset.command) setCommand(target.dataset.command);
  if (target.dataset.tab) setTab(target.dataset.tab);
  if (target.dataset.openTool) {
    setTool(target.dataset.openTool);
    updateFlow("tools", `${target.textContent.trim()} opened in Site Manager`);
  }
  if (target.dataset.runSource) {
    document.querySelector("#flowSource").textContent = `${target.dataset.runSource} running`;
    updateFlow("source", `${target.dataset.runSource} running`);
  }
  if (target.dataset.save) simulateSave(target.dataset.save);
  if (target.dataset.transfer) setTransfer(target.dataset.transfer);
  if (target.dataset.flowUpdate) updateFlow("tools", target.dataset.flowUpdate);
  if (target.dataset.filter) {
    document.querySelectorAll("#galleryFilters button").forEach((button) => button.classList.toggle("active", button === target));
    renderGallery();
  }
  if (target.dataset.blueprint) {
    selectedBlueprint = Number(target.dataset.blueprint);
    renderGallery();
  }
  if (target.dataset.openSaved) {
    const site = savedSites[Number(target.dataset.openSaved)];
    document.querySelector("#savedInspectorTitle").textContent = site.name;
    document.querySelector("#savedInspectorText").textContent = `${site.meta}. ${site.status === "temporary" ? "Save before closing to keep it." : "Stored in this browser."}`;
  }
  if (target.dataset.deleteSaved) {
    const site = savedSites[Number(target.dataset.deleteSaved)];
    document.querySelector("#deleteResult").textContent = `${site.name} is marked for deletion; browser storage removal is the consequence.`;
  }
});

document.querySelector("#commandSearch").addEventListener("input", renderCommands);
document.querySelector("#gallerySearch").addEventListener("input", renderGallery);
document.querySelector("#renameButton").addEventListener("click", () => {
  const name = document.querySelector("#renameInput").value || "Renamed Playground";
  document.querySelector("#savedInspectorTitle").textContent = name;
  document.querySelector("#activeSiteName").textContent = name;
  document.querySelector("#managerName").textContent = name;
  updateFlow("identity", `${name} renamed in saved management`);
});
document.querySelector("#deleteButton").addEventListener("click", () => {
  document.querySelector("#deleteResult").textContent = "Delete confirmation shown: this removes the browser-backed saved Playground, not local directory exports.";
  updateFlow("identity", "Delete consequence visible before browser storage removal");
});
document.querySelectorAll(".tool-tab").forEach((button) => button.addEventListener("click", () => setTool(button.dataset.tool)));

setCommand(selectedCommand);
renderGallery();
renderSaved();
