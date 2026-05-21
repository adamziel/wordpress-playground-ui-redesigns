const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const blueprintData = [
  {
    name: "Art Gallery",
    description: "An art gallery created with the Vueo theme.",
    categories: ["Featured", "Website", "Personal", "Themes"],
    tags: ["Website", "Personal"],
    color: "#8a641e"
  },
  {
    name: "Coffee Shop",
    description: "A stylish WooCommerce coffee shop storefront with products and custom content.",
    categories: ["Featured", "Website", "WooCommerce", "Themes"],
    tags: ["WooCommerce", "Store"],
    color: "#5a2d78"
  },
  {
    name: "Feed Reader with the Friends Plugin",
    description: "Read web feeds inside Playground and experiment with social-web subscriptions.",
    categories: ["Featured", "Content", "Experiments"],
    tags: ["rss", "social web"],
    color: "#2459c8"
  },
  {
    name: "Gaming News",
    description: "A gaming news site created with the Spiel theme.",
    categories: ["Featured", "Website", "News", "Themes"],
    tags: ["Website", "News"],
    color: "#191919"
  },
  {
    name: "Non-profit Organization",
    description: "A non-profit organization site created with the Koinonia theme.",
    categories: ["Featured", "Website", "Content"],
    tags: ["Website", "Organization"],
    color: "#b45309"
  },
  {
    name: "Personal Blog",
    description: "A personal blog created with the Substrata theme.",
    categories: ["Website", "Personal", "Content", "Themes"],
    tags: ["Website", "Blog"],
    color: "#7a1741"
  },
  {
    name: "Gutenberg Data Views",
    description: "A block-editor experiment for testing Gutenberg data views in Playground.",
    categories: ["Gutenberg", "Experiments"],
    tags: ["Gutenberg", "Experiment"],
    color: "#3858e9"
  },
  {
    name: "Twenty Twenty-Four Portfolio",
    description: "A clean portfolio starter with sample pages, patterns, and media.",
    categories: ["Website", "Themes", "Content"],
    tags: ["Theme", "Portfolio"],
    color: "#168a4a"
  }
];

const commandData = [
  {
    group: "Blueprint",
    title: "Run Blueprint URL",
    keywords: "blue blueprint url validate run replace json",
    input: "https://playground.wordpress.net/blueprints/coffee-shop.json",
    help: "Validates the URL, warns before replacing the current Playground, runs the Blueprint, then updates preview and history."
  },
  {
    group: "Blueprint",
    title: "Search Blueprint gallery",
    keywords: "blue blueprint gallery categories search all 43",
    input: "coffee",
    help: "Filters the representative gallery subset while preserving the all-43 catalog label."
  },
  {
    group: "Create",
    title: "Preview WordPress PR",
    keywords: "wordpress pr preview core ticket pull request",
    input: "https://github.com/WordPress/wordpress-develop/pull/7349",
    help: "Accepts a WordPress PR number or URL and starts a replacement preview after confirmation."
  },
  {
    group: "Create",
    title: "Preview Gutenberg PR or branch",
    keywords: "gutenberg pr branch preview plugin",
    input: "trunk",
    help: "Accepts a Gutenberg PR, URL, or branch name."
  },
  {
    group: "Portability",
    title: "Import from GitHub",
    keywords: "github import connect token repository plugin theme wp-content",
    input: "github.com/example/friends-plugin",
    help: "Requires account connection. The access token is not stored after refresh."
  },
  {
    group: "Portability",
    title: "Import .zip",
    keywords: "zip import archive replace picker validate",
    input: "workshop-site.zip",
    help: "Uses the native file picker, validates the archive, and warns before replacement."
  },
  {
    group: "Data",
    title: "Download database.sqlite",
    keywords: "database sqlite download adminer phpmyadmin",
    input: "/wordpress/wp-content/database/.ht.sqlite",
    help: "Downloads the SQLite database and writes a transfer record."
  },
  {
    group: "Save",
    title: "Save to local directory",
    keywords: "save local directory folder permission file system access",
    input: "~/Sites/client-demo-local",
    help: "Requests folder access, copies files, and changes the active storage identity to local-directory backed."
  }
];

const routeDetails = {
  vanilla: {
    label: "Vanilla WordPress",
    field: "No input required",
    value: "Fresh WordPress latest, PHP 8.3",
    copy: "Starts a clean temporary WordPress. Because the current object is unsaved, replacement requires confirmation."
  },
  "wp-pr": {
    label: "WordPress PR",
    field: "PR number or URL",
    value: "https://github.com/WordPress/wordpress-develop/pull/7349",
    copy: "Builds a WordPress core PR preview from a PR number or URL."
  },
  "gutenberg-pr": {
    label: "Gutenberg PR or branch",
    field: "PR number, URL, or branch",
    value: "trunk",
    copy: "Installs a Gutenberg plugin preview from a branch, PR number, or URL."
  },
  github: {
    label: "From GitHub",
    field: "Repository",
    value: "github.com/example/friends-plugin",
    copy: "Imports a public plugin, theme, or wp-content directory after account connection. Token is not stored."
  },
  "blueprint-url": {
    label: "Blueprint URL",
    field: "Blueprint URL",
    value: "https://playground.wordpress.net/blueprints/art-gallery.json",
    copy: "Runs a remote Blueprint after validation and replacement confirmation."
  },
  zip: {
    label: "Import .zip",
    field: "Selected archive",
    value: "workshop-site.zip",
    copy: "Triggers a native file picker, validates the ZIP, and replaces current files and database."
  }
};

const state = {
  selectedPanel: "blueprints",
  selectedBlueprint: blueprintData[0],
  category: "All",
  shellTitle: "Unsaved Playground",
  storage: "temporary",
  path: "/hello-from-playground/",
  selectedSavedId: "temporary",
  savedRows: [
    {
      id: "temporary",
      name: "Unsaved Playground",
      storage: "Temporary",
      detail: "Not saved to browser storage",
      active: true
    },
    {
      id: "browser-research",
      name: "Research Browser Playground",
      storage: "Browser",
      detail: "Created May 21, 2026",
      active: false
    },
    {
      id: "local-client-demo",
      name: "Client Demo Local",
      storage: "Local directory",
      detail: "~/Sites/client-demo-local, reconnect on reload",
      active: false
    }
  ],
  events: [
    { tone: "success", title: "Preview mounted", detail: "WordPress homepage rendered at /hello-from-playground/." },
    { tone: "warning", title: "Temporary object selected", detail: "Refresh or replacement discards files until saved." }
  ],
  transfers: [],
  selectedCommand: commandData[0]
};

function setPanel(panel) {
  state.selectedPanel = panel;
  $$(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.panel === panel));
  $$("[data-panel-view]").forEach((view) => view.classList.toggle("active", view.dataset.panelView === panel));
  const titles = {
    blueprints: "Blueprint commands",
    command: "Command search",
    manager: "Site Manager",
    save: "Save destinations",
    library: "Saved Playgrounds",
    events: "Events and transfers"
  };
  $("#panelTitle").textContent = titles[panel] || "Operations ledger";
  if (panel === "events") {
    renderEvents();
    renderTransfers();
  }
}

function setManagerTab(tabName) {
  $$(".mini-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.manager === tabName));
  $$("[data-manager-view]").forEach((view) => view.classList.toggle("active", view.dataset.managerView === tabName));
  const labels = {
    files: ["Files", "Selected file, dirty state, save result."],
    blueprint: ["Blueprint", "Current bundle actions and run state."],
    database: ["Database", "SQLite path, size, download, Adminer, phpMyAdmin."],
    logs: ["Logs", "Playground, WordPress, and PHP log records."],
    settings: ["Settings", "Version, PHP, language, network, multisite consequences."],
    transfer: ["Export", "GitHub export, ZIP download/import, GitHub import."]
  };
  $("#managerFact").textContent = labels[tabName][0];
  $("#managerDetail").textContent = labels[tabName][1];
}

function addEvent(title, detail, tone = "success") {
  state.events.unshift({ title, detail, tone });
  state.events = state.events.slice(0, 9);
  renderEvents();
}

function addTransfer(title, detail) {
  state.transfers.unshift({ title, detail });
  state.transfers = state.transfers.slice(0, 8);
  $("#transferFact").textContent = title;
  $("#transferDetail").textContent = detail;
  renderTransfers();
}

function renderEvents() {
  const stream = $("#eventStream");
  stream.innerHTML = state.events
    .map((item) => `<div class="event-item ${item.tone}"><strong>${item.title}</strong><span>${item.detail}</span></div>`)
    .join("");
}

function renderTransfers() {
  const target = $("#transferHistory");
  target.innerHTML = state.transfers.length
    ? state.transfers.map((item) => `<div class="transfer-item"><strong>${item.title}</strong><span>${item.detail}</span></div>`).join("")
    : `<div class="transfer-item"><strong>No transfers yet</strong><span>Database, ZIP, GitHub, Blueprint, and save results will appear here.</span></div>`;
}

function updateShell(overrides = {}) {
  Object.assign(state, overrides);
  $("#shellTitle").textContent = state.shellTitle;
  $("#shellBadge").textContent = state.shellTitle;
  $("#pathInput").value = state.path;
  $("#previewPath").textContent = state.path;
  $("#storageBadge").textContent = state.storage === "temporary" ? "Temporary" : state.storage === "local" ? "Local directory" : "Saved Playground";
  $("#storageBadge").className = `chip ${state.storage === "temporary" ? "warning" : "success"}`;
  $("#storageFact").textContent =
    state.storage === "temporary" ? "Temporary memory" : state.storage === "local" ? "Local folder-backed" : "Browser storage";
  $("#selectedRowFact").textContent = state.shellTitle;
  $("#selectedRowDetail").textContent =
    state.storage === "temporary"
      ? "Not stored. Browser refresh discards files and database."
      : state.storage === "local"
        ? "Local directory stores files; reload requires folder permission."
        : "Browser storage keeps a slugged saved identity.";
  document.querySelector(".app").dataset.storage = state.storage;
  $("#settingsConsequence").textContent = state.storage === "temporary" ? "Unsaved reset warning" : "Stored Save & Reload";
  $("#settingsCopy").textContent =
    state.storage === "temporary"
      ? "Applying settings to a temporary Playground replaces files, database, logs, and current path. Saved sites use Save & Reload with limited options."
      : "Stored Playgrounds keep limited configuration options and use Save & Reload instead of the unsaved destructive reset action.";
  renderSaved();
}

function renderBlueprints() {
  const query = $("#blueprintSearch").value.trim().toLowerCase();
  const filtered = blueprintData.filter((item) => {
    const inCategory = state.category === "All" || item.categories.includes(state.category);
    const text = `${item.name} ${item.description} ${item.categories.join(" ")} ${item.tags.join(" ")}`.toLowerCase();
    return inCategory && (!query || text.includes(query));
  });

  $("#blueprintList").innerHTML = filtered.length
    ? filtered
        .map(
          (item) => `<button class="result-item ${item.name === state.selectedBlueprint.name ? "active" : ""}" type="button" data-blueprint="${item.name}">
            <strong>${item.name}</strong>
            <span>${item.description}</span>
          </button>`
        )
        .join("")
    : `<div class="result-item"><strong>No matching entries in this represented subset</strong><span>The current product has 43 total Blueprints. Clear search or change category.</span></div>`;

  $$(".result-item[data-blueprint]").forEach((button) => {
    button.addEventListener("click", () => selectBlueprint(button.dataset.blueprint));
  });
}

function selectBlueprint(name) {
  const item = blueprintData.find((blueprint) => blueprint.name === name);
  if (!item) return;
  state.selectedBlueprint = item;
  $("#selectedBlueprintName").textContent = item.name;
  $("#selectedBlueprintDescription").textContent = item.description;
  $("#selectedTags").innerHTML = item.tags.map((tag) => `<span class="chip">${tag}</span>`).join("");
  $("#selectedArt").style.background = `linear-gradient(135deg, ${item.color}, #f5f7fb 62%)`;
  $("#blueprintUrl").value = `https://playground.wordpress.net/blueprints/${item.name.toLowerCase().replaceAll(" ", "-")}.json`;
  $("#commandFact").textContent = `Blueprint: ${item.name}`;
  renderBlueprints();
}

function renderCommands() {
  const query = $("#commandSearch").value.trim().toLowerCase();
  const visible = commandData.filter((command) => {
    const text = `${command.group} ${command.title} ${command.keywords} ${command.help}`.toLowerCase();
    return !query || text.includes(query);
  });
  const grouped = visible.reduce((groups, command) => {
    groups[command.group] ||= [];
    groups[command.group].push(command);
    return groups;
  }, {});

  $("#commandResults").innerHTML = Object.keys(grouped).length
    ? Object.entries(grouped)
        .map(
          ([group, commands]) => `<div class="command-group">
            <p class="eyebrow">${group}</p>
            ${commands
              .map(
                (command) => `<button class="command-item" type="button" data-command-title="${command.title}">
                  <strong>${command.title}</strong>
                  <span>${command.help}</span>
                </button>`
              )
              .join("")}
          </div>`
        )
        .join("")
    : `<div class="command-item"><strong>No command match</strong><span>Try blueprint, save, GitHub, ZIP, database, or PR.</span></div>`;

  $$(".command-item[data-command-title]").forEach((button) => {
    button.addEventListener("click", () => selectCommand(button.dataset.commandTitle));
  });
}

function selectCommand(title) {
  const command = commandData.find((item) => item.title === title);
  if (!command) return;
  state.selectedCommand = command;
  $("#commandDetail h3").textContent = command.title;
  $("#commandInput").value = command.input;
  $(".command-copy").textContent = command.help;
  $("#commandFact").textContent = command.title;
  addEvent("Command selected", `${command.group}: ${command.title}.`, "success");
}

function renderSaved() {
  $("#savedList").innerHTML = state.savedRows
    .map(
      (row) => `<button class="saved-row ${row.id === state.selectedSavedId ? "active" : ""}" type="button" data-saved-id="${row.id}">
        <strong>${row.name}</strong>
        <span>${row.storage} - ${row.detail}</span>
      </button>`
    )
    .join("");
  $$(".saved-row").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedSavedId = button.dataset.savedId;
      const row = state.savedRows.find((item) => item.id === state.selectedSavedId);
      $("#renameInput").value = row.name;
      updateShell({
        shellTitle: row.name,
        storage: row.storage === "Temporary" ? "temporary" : row.storage === "Local directory" ? "local" : "browser"
      });
      addEvent("Saved row opened", `${row.name} selected from saved management.`, "success");
    });
  });
}

function setRoute(routeKey) {
  const route = routeDetails[routeKey];
  $$(".route-card").forEach((card) => card.classList.toggle("active", card.dataset.route === routeKey));
  $("#routeForm").innerHTML = `
    <strong>Selected route: ${route.label}</strong>
    <label>${route.field}<input id="routeInput" value="${route.value}"></label>
    <p>${route.copy}</p>
    <div class="button-row">
      <button class="button primary" id="startRouteButton" type="button">Validate route</button>
      <button class="button subtle" data-panel="command" type="button">Find related commands</button>
    </div>
  `;
  $("#startRouteButton").addEventListener("click", () => validateRoute(route.label));
  $$("[data-panel]", $("#routeForm")).forEach((button) => button.addEventListener("click", () => setPanel(button.dataset.panel)));
  addEvent("Route selected", `${route.label} form loaded with real input requirements.`, "success");
}

function runProgress({ box, bar, text, steps, done }) {
  box.hidden = false;
  bar.style.width = "0%";
  let index = 0;
  const tick = () => {
    const step = steps[index];
    text.textContent = step.label;
    bar.style.width = `${step.percent}%`;
    index += 1;
    if (index < steps.length) {
      window.setTimeout(tick, 420);
    } else {
      window.setTimeout(() => {
        box.hidden = true;
        done?.();
      }, 320);
    }
  };
  tick();
}

function validateRoute(label) {
  $("#healthBadge").textContent = "Validating";
  addEvent("Route validation started", `${label} checked before replacement.`, "warning");
  runProgress({
    box: $("#commandProgress"),
    bar: $("#commandProgressBar"),
    text: $("#commandProgressText"),
    steps: [
      { label: "Validating route input...", percent: 30 },
      { label: "Checking replacement consequences...", percent: 65 },
      { label: "Ready for confirmation.", percent: 100 }
    ],
    done: () => {
      $("#healthBadge").textContent = "Route ready";
      $("#commandFact").textContent = label;
      addEvent("Route ready", `${label} can replace the active Playground after confirmation.`, "success");
      setPanel("command");
    }
  });
}

function runBlueprintReplacement(source = state.selectedBlueprint.name) {
  $("#blueprintConfirm").hidden = true;
  $("#healthBadge").textContent = "Running";
  runProgress({
    box: $("#blueprintProgress"),
    bar: $("#blueprintProgressBar"),
    text: $("#blueprintProgressText"),
    steps: [
      { label: "Validating blueprint.json schema...", percent: 22 },
      { label: "Copying Blueprint assets...", percent: 47 },
      { label: "Replacing WordPress content and database...", percent: 76 },
      { label: "Opening Blueprint landing page...", percent: 100 }
    ],
    done: () => {
      const title = `Blueprint: ${source}`;
      updateShell({ shellTitle: title, storage: state.storage, path: "/" });
      $("#previewHeadline").innerHTML = `${source}`;
      $("#previewBody").textContent = "The selected Blueprint has replaced the current WordPress content in this Playground.";
      $("#previewNote").textContent = state.storage === "temporary" ? "Replacement complete on a temporary Playground. Save to keep this result." : "Replacement complete on the saved Playground object.";
      $("#previewStatus").textContent = "Preview replaced by Blueprint run";
      $("#healthBadge").textContent = "Blueprint complete";
      addTransfer("Blueprint run", `${source} replaced current content and opened /.`);
      addEvent("Blueprint replacement complete", `${source} changed shell title, path, preview, transfer history, and logs.`, "success");
      setManagerTab("logs");
    }
  });
}

function saveBrowser() {
  const name = $("#browserSaveName").value.trim() || "Research Browser Playground";
  $("#healthBadge").textContent = "Saving";
  runProgress({
    box: $("#saveProgress"),
    bar: $("#saveProgressBar"),
    text: $("#saveProgressText"),
    steps: [
      { label: "Saving 482 / 3751 files to browser storage...", percent: 13 },
      { label: "Saving 1984 / 3751 files to browser storage...", percent: 52 },
      { label: "Saving 3751 / 3751 files and SQLite database...", percent: 88 },
      { label: "Created slug: /research-browser-playground/.", percent: 100 }
    ],
    done: () => {
      state.storage = "browser";
      state.shellTitle = name;
      state.selectedSavedId = "browser-research";
      const row = state.savedRows.find((item) => item.id === "browser-research");
      row.name = name;
      row.storage = "Browser";
      row.detail = "Saved in this browser a moment ago";
      updateShell({ shellTitle: name, storage: "browser", path: "/hello-from-playground/" });
      $("#healthBadge").textContent = "Saved";
      addTransfer("Browser save", `${name} saved to IndexedDB with browser-only slug.`);
      addEvent("Save in this browser complete", "Temporary object now has browser-backed identity, saved row, and stored reload behavior.", "success");
      setPanel("library");
    }
  });
}

function saveLocal() {
  const name = $("#localSaveName").value.trim() || "Client Demo Local";
  $("#folderPrompt").hidden = true;
  $("#healthBadge").textContent = "Saving local";
  runProgress({
    box: $("#saveProgress"),
    bar: $("#saveProgressBar"),
    text: $("#saveProgressText"),
    steps: [
      { label: "Folder granted: ~/Sites/client-demo-local.", percent: 18 },
      { label: "Copying wp-admin, wp-content, wp-includes...", percent: 48 },
      { label: "Writing SQLite database and blueprint.json...", percent: 79 },
      { label: "Local directory Playground ready.", percent: 100 }
    ],
    done: () => {
      state.selectedSavedId = "local-client-demo";
      const row = state.savedRows.find((item) => item.id === "local-client-demo");
      row.name = name;
      row.detail = "~/Sites/client-demo-local granted; reconnect on browser reload";
      updateShell({ shellTitle: name, storage: "local" });
      $("#healthBadge").textContent = "Local saved";
      addTransfer("Local directory save", `${name} written to ~/Sites/client-demo-local.`);
      addEvent("Save to local directory complete", "Folder-backed identity has different reload behavior and permission consequence.", "success");
      setPanel("library");
    }
  });
}

function executeCommand() {
  const command = state.selectedCommand;
  $("#healthBadge").textContent = "Executing";
  runProgress({
    box: $("#commandProgress"),
    bar: $("#commandProgressBar"),
    text: $("#commandProgressText"),
    steps: [
      { label: `Resolving command: ${command.title}...`, percent: 22 },
      { label: "Loading grouped result form and validating input...", percent: 48 },
      { label: "Applying command to selected Playground object...", percent: 82 },
      { label: "Writing event stream and transfer result...", percent: 100 }
    ],
    done: () => {
      if (command.title === "Download database.sqlite") {
        downloadDatabase();
      } else if (command.title === "Save to local directory") {
        setPanel("save");
        $("#folderPrompt").hidden = false;
        addEvent("Command prepared local save", "Folder picker prompt is ready in Save destinations.", "warning");
      } else {
        updateShell({ shellTitle: "Blueprint: Coffee Shop", path: "/" });
        $("#previewHeadline").innerHTML = "Coffee Shop";
        $("#previewBody").textContent = "Command search ran the Coffee Shop Blueprint URL and changed the active WordPress preview.";
        $("#previewStatus").textContent = "Command search executed";
        addTransfer("Command run", `${command.title} completed from grouped search results.`);
        addEvent("Command search flow complete", "Query, grouped result, command form, progress, shell mutation, preview mutation, and transfer record all completed.", "success");
      }
      $("#healthBadge").textContent = "Complete";
    }
  });
}

function downloadDatabase() {
  setPanel("manager");
  setManagerTab("database");
  $("#dbSelected").textContent = "database.sqlite selected for download";
  $("#healthBadge").textContent = "Downloading";
  runProgress({
    box: $("#dbProgress"),
    bar: $("#dbProgressBar"),
    text: $("#dbProgressText"),
    steps: [
      { label: "Selecting /wordpress/wp-content/database/.ht.sqlite...", percent: 25 },
      { label: "Preparing database.sqlite download...", percent: 55 },
      { label: "Streaming 452 KB SQLite database...", percent: 86 },
      { label: "database.sqlite downloaded.", percent: 100 }
    ],
    done: () => {
      $("#dbSelected").textContent = "Downloaded database.sqlite a moment ago";
      $("#healthBadge").textContent = "Database saved";
      addTransfer("Database download", "database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite, 452 KB.");
      addEvent("Database operation complete", "Selected database, download progress, success state, and log record are complete.", "success");
      setManagerTab("logs");
    }
  });
}

function renameSelected() {
  const row = state.savedRows.find((item) => item.id === state.selectedSavedId);
  if (!row) return;
  const nextName = $("#renameInput").value.trim() || row.name;
  row.name = nextName;
  updateShell({ shellTitle: nextName });
  addEvent("Playground renamed", `Saved row and shell title changed to ${nextName}.`, "success");
}

function deleteSelected() {
  $("#deleteConfirm").hidden = true;
  const row = state.savedRows.find((item) => item.id === state.selectedSavedId);
  if (!row || row.id === "temporary") {
    addEvent("Delete blocked", "The temporary unsaved object cannot be removed from saved storage.", "warning");
    return;
  }
  state.savedRows = state.savedRows.filter((item) => item.id !== row.id);
  state.selectedSavedId = "temporary";
  updateShell({ shellTitle: "Unsaved Playground", storage: "temporary", path: "/hello-from-playground/" });
  $("#previewHeadline").innerHTML = "Hello from <span>WordPress Playground!</span>";
  $("#previewStatus").textContent = "Fallback temporary preview opened";
  addTransfer("Saved row deleted", `${row.name} removed. Active object fell back to Unsaved Playground.`);
  addEvent("Delete confirmed", "Saved row removed, shell identity reset, storage badge changed, and fallback preview opened.", "danger");
}

function initialize() {
  $$("[data-panel]").forEach((button) => {
    button.addEventListener("click", () => setPanel(button.dataset.panel));
  });

  $$(".mini-tab").forEach((button) => {
    button.addEventListener("click", () => setManagerTab(button.dataset.manager));
  });

  $$(".route-card").forEach((button) => {
    button.addEventListener("click", () => setRoute(button.dataset.route));
  });

  $$("[data-path]").forEach((button) => {
    button.addEventListener("click", () => {
      updateShell({ path: button.dataset.path });
      addEvent("Path changed", `Preview navigated to ${button.dataset.path}.`, "success");
    });
  });

  $("#homeButton").addEventListener("click", () => updateShell({ path: "/hello-from-playground/" }));
  $("#adminButton").addEventListener("click", () => {
    updateShell({ path: "/wp-admin/" });
    $("#previewHeadline").textContent = "Dashboard";
    $("#previewBody").textContent = "WordPress admin is open inside the protected Playground shell.";
    addEvent("WP Admin opened", "Active path changed to /wp-admin/ without leaving the shell.", "success");
  });
  $("#refreshButton").addEventListener("click", () => addEvent("Preview refreshed", `${state.path} reloaded in the embedded WordPress frame.`, "success"));
  $("#pathInput").addEventListener("change", (event) => {
    updateShell({ path: event.target.value || "/" });
    addEvent("Path input submitted", `Active WordPress path changed to ${state.path}.`, "success");
  });

  $("#blueprintSearch").addEventListener("input", renderBlueprints);
  $$("#categoryChips .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.category = chip.dataset.category;
      $$("#categoryChips .chip").forEach((item) => item.classList.toggle("active", item === chip));
      renderBlueprints();
    });
  });
  $("#showAllLabel").addEventListener("click", () => {
    addEvent("Blueprint catalog scope noted", "This static slice shows 8 representative entries and labels the full current gallery as 43 total.", "success");
  });
  $("#blueprintEditor").addEventListener("input", () => {
    $("#jsonDirty").hidden = false;
    $("#bundleStatus").textContent = "Dirty JSON waiting for validation";
  });
  $("#validateJsonButton").addEventListener("click", () => {
    try {
      JSON.parse($("#blueprintEditor").value);
      $("#jsonDirty").hidden = true;
      $("#bundleStatus").textContent = "Valid JSON a moment ago";
      addEvent("Blueprint JSON validated", "Editor dirty state cleared and Blueprint bundle marked valid.", "success");
    } catch {
      $("#bundleStatus").textContent = "JSON validation error";
      addEvent("Blueprint JSON validation failed", "Editor contains invalid JSON and cannot run yet.", "danger");
    }
  });
  $("#copyBlueprintButton").addEventListener("click", () => addTransfer("Blueprint link copied", $("#blueprintUrl").value));
  $("#downloadBlueprintButton").addEventListener("click", () => addTransfer("Blueprint bundle downloaded", `${state.selectedBlueprint.name} bundle downloaded from blueprint.json.`));
  $("#runBlueprintButton").addEventListener("click", () => {
    $("#blueprintConfirm").hidden = false;
    addEvent("Blueprint replacement warning shown", `${state.selectedBlueprint.name} will replace current content after confirmation.`, "warning");
  });
  $("#cancelBlueprintButton").addEventListener("click", () => {
    $("#blueprintConfirm").hidden = true;
    addEvent("Blueprint run canceled", "Replacement warning was dismissed; current Playground unchanged.", "warning");
  });
  $("#confirmBlueprintButton").addEventListener("click", () => runBlueprintReplacement());

  $("#commandSearch").addEventListener("input", renderCommands);
  $("#executeCommandButton").addEventListener("click", executeCommand);

  $("#fileEditor").addEventListener("input", () => {
    $("#fileDirty").hidden = false;
    $("#fileResult").textContent = "Unsaved edits in selected file.";
  });
  $$(".file-row").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".file-row").forEach((row) => row.classList.toggle("active", row === button));
      $("#selectedFile").textContent = button.dataset.file;
      $("#fileDirty").hidden = true;
      $("#fileResult").textContent = "Selected file is clean.";
      addEvent("File selected", `${button.dataset.file} loaded in editor.`, "success");
    });
  });
  $("#saveFileButton").addEventListener("click", () => {
    $("#fileDirty").hidden = true;
    $("#fileResult").textContent = "Saved a moment ago.";
    addEvent("File operation complete", `${$("#selectedFile").textContent} moved from dirty to saved and wrote a log record.`, "success");
  });
  $("#newFileButton").addEventListener("click", () => addEvent("New file created", "/wordpress/wp-content/mu-plugins/workshop.php created in file tree.", "success"));
  $("#newFolderButton").addEventListener("click", () => addEvent("New folder created", "/wordpress/wp-content/uploads/imports/ created.", "success"));
  $("#uploadButton").addEventListener("click", () => addEvent("Upload complete", "theme-asset.png uploaded to /wordpress/wp-content/uploads/.", "success"));
  $("#browseButton").addEventListener("click", () => addEvent("Browse files", "Native file picker opened for selected WordPress directory.", "success"));

  $("#downloadDbButton").addEventListener("click", downloadDatabase);
  $("#adminerButton").addEventListener("click", () => addEvent("Adminer opened", "Database tool opened in a new Playground panel.", "success"));
  $("#phpmyadminButton").addEventListener("click", () => addEvent("phpMyAdmin opened", "phpMyAdmin opened for the SQLite-backed database.", "success"));
  $("#managerCopyBlueprint").addEventListener("click", () => addTransfer("Manager copied Blueprint link", "/blueprint.json link copied."));
  $("#managerDownloadBlueprint").addEventListener("click", () => addTransfer("Manager downloaded Blueprint bundle", "Current blueprint.json and assets downloaded."));
  $("#managerRunBlueprint").addEventListener("click", () => {
    setPanel("blueprints");
    $("#blueprintConfirm").hidden = false;
  });
  $("#resetSettingsButton").addEventListener("click", () => {
    updateShell({ shellTitle: "Unsaved Playground", storage: "temporary", path: "/hello-from-playground/" });
    addEvent("Settings reset applied", "Temporary Playground reset with selected runtime settings; files and database replaced.", "danger");
  });
  $("#exportGithubButton").addEventListener("click", () => {
    addTransfer("GitHub export", "Connected account, selected repository, and queued Playground bundle export.");
    addEvent("Export to GitHub queued", "Token is session-only; repository export result written to transfer history.", "success");
  });
  $("#downloadZipButton").addEventListener("click", () => {
    addTransfer("Download as .zip", "playground-export.zip generated with files, database, and Blueprint bundle.");
    addEvent("ZIP download complete", "Download as .zip generated a portability record.", "success");
  });
  $("#importZipButton").addEventListener("click", () => {
    updateShell({ shellTitle: "Imported ZIP Playground", storage: "temporary", path: "/" });
    addTransfer("ZIP import", "workshop-site.zip validated and replaced current temporary Playground.");
    addEvent("ZIP replacement complete", "Native file picker result validated, warning accepted, current site replaced.", "danger");
  });
  $("#githubImportButton").addEventListener("click", () => {
    addTransfer("GitHub import", "Connected GitHub account and imported public plugin repository.");
    addEvent("GitHub import complete", "Account connection used for this session only; token not stored after refresh.", "success");
  });

  $("#saveBrowserButton").addEventListener("click", saveBrowser);
  $("#chooseFolderButton").addEventListener("click", () => {
    $("#folderPrompt").hidden = false;
    addEvent("Folder permission requested", "Local-directory save opened a folder picker prompt.", "warning");
  });
  $("#grantFolderButton").addEventListener("click", saveLocal);
  $("#cancelFolderButton").addEventListener("click", () => {
    $("#folderPrompt").hidden = true;
    addEvent("Folder picker canceled", "Local-directory save canceled; temporary Playground unchanged.", "warning");
  });
  $("#denyFolderButton").addEventListener("click", () => {
    addEvent("Folder permission denied", "Local-directory save cannot continue until a folder is granted.", "danger");
  });

  $("#renameButton").addEventListener("click", renameSelected);
  $("#deleteButton").addEventListener("click", () => {
    $("#deleteConfirm").hidden = false;
    addEvent("Delete confirmation opened", "Destructive saved-row removal is waiting for confirmation.", "warning");
  });
  $("#cancelDeleteButton").addEventListener("click", () => {
    $("#deleteConfirm").hidden = true;
    addEvent("Delete canceled", "Saved row remains in the library.", "warning");
  });
  $("#confirmDeleteButton").addEventListener("click", deleteSelected);

  selectBlueprint("Art Gallery");
  renderCommands();
  renderSaved();
  renderEvents();
  renderTransfers();
  setRoute("blueprint-url");
  setPanel("blueprints");
}

initialize();
