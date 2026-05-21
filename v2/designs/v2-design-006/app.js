const state = {
  title: "Unsaved Playground",
  storage: "Temporary",
  identity: "temporary browser runtime",
  path: "/hello-from-playground/",
  activeTab: "files",
  selectedCommand: "save-file",
  fileDirty: false,
  githubConnected: false,
  savedRows: [
    {
      id: "active-temp",
      name: "Unsaved Playground",
      meta: "Temporary - lost on refresh unless saved",
      storage: "Temporary",
      active: true
    },
    {
      id: "research-browser",
      name: "Research Browser Playground",
      meta: "Browser storage - created May 21, 2026",
      storage: "Saved in this browser",
      active: false
    },
    {
      id: "coffee-local",
      name: "Coffee Shop Local Directory",
      meta: "Local directory - permission granted",
      storage: "Local directory",
      active: false
    }
  ]
};

const commands = [
  {
    id: "save-file",
    group: "Files",
    label: "Save edited wp-config.php",
    detail: "Commit the dirty file and write a Playground log event.",
    form: "Use the editor in the Files tab. Running this command marks the file saved and updates logs."
  },
  {
    id: "download-db",
    group: "Database",
    label: "Download database.sqlite",
    detail: "Prepare the SQLite-backed database for download.",
    form: "Exports /wordpress/wp-content/database/.ht.sqlite as database.sqlite and records transfer history."
  },
  {
    id: "open-admin",
    group: "Shell",
    label: "Open WP Admin",
    detail: "Navigate the protected live browser to /wp-admin/.",
    form: "Changes the shell path, preview state, selected command badge, and event record."
  },
  {
    id: "wp-pr",
    group: "Create",
    label: "Preview WordPress PR",
    detail: "Start from a WordPress PR number or URL.",
    form: "Enter a WordPress PR number or URL. The current temporary runtime will be replaced by the preview."
  },
  {
    id: "github-import",
    group: "Portability",
    label: "Import from GitHub",
    detail: "Connect a GitHub account, then import a public repository.",
    form: "Requires account connection. The access token is not stored after refresh."
  },
  {
    id: "zip-import",
    group: "Portability",
    label: "Import .zip and replace current site",
    detail: "Validate a zip archive, warn, then replace files and database.",
    form: "Selected archive: client-demo-site.zip. Running this command confirms replacement, imports files, and updates the preview."
  },
  {
    id: "blueprint-url",
    group: "Blueprint",
    label: "Run Blueprint URL",
    detail: "Validate and run a Blueprint URL against the active Playground.",
    form: "Runs the Blueprint URL shown in the Blueprint tab and records validation plus result state."
  }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function addEvent(message, target = "eventLog") {
  const list = $(`#${target}`);
  if (!list) return;
  const item = document.createElement(target === "eventLog" ? "li" : "li");
  item.textContent = message;
  list.prepend(item);
}

function setSelectedCommand(commandId) {
  const command = commands.find((item) => item.id === commandId) || commands[0];
  state.selectedCommand = command.id;
  $("#selectedCommandBadge").textContent = `Selected command: ${command.label}`;
  $("#commandForm").innerHTML = buildCommandForm(command);
  $("#runSelectedCommand").addEventListener("click", () => runCommand(command.id));
}

function buildCommandForm(command) {
  let extra = "";
  if (command.id === "wp-pr") {
    extra = `<label>PR number or URL<input id="commandPrInput" value="63322"></label>`;
  }
  if (command.id === "github-import") {
    extra = `<label>Repository<input id="commandGithubInput" value="wordpress/wordpress-playground"></label>`;
  }
  if (command.id === "blueprint-url") {
    extra = `<label>Blueprint URL<input id="commandBlueprintInput" value="${$("#blueprintUrl") ? $("#blueprintUrl").value : ""}"></label>`;
  }
  return `
    <strong>Selected: ${command.label}</strong>
    <p>${command.form}</p>
    ${extra}
    <button class="primary" id="runSelectedCommand" type="button">Run selected command</button>
  `;
}

function renderCommandResults() {
  const query = $("#commandSearch").value.trim().toLowerCase();
  const filtered = commands.filter((command) => {
    const haystack = `${command.group} ${command.label} ${command.detail}`.toLowerCase();
    return !query || haystack.includes(query);
  });
  const container = $("#commandResults");
  container.innerHTML = "";
  let currentGroup = "";

  if (!filtered.length) {
    container.innerHTML = `<div class="result-card">No command matches "${query}". Try save, file, database, GitHub, zip, admin, or Blueprint.</div>`;
    return;
  }

  filtered.forEach((command) => {
    if (command.group !== currentGroup) {
      currentGroup = command.group;
      const group = document.createElement("div");
      group.className = "result-group";
      group.textContent = currentGroup;
      container.appendChild(group);
    }
    const button = document.createElement("button");
    button.className = "command-result";
    button.type = "button";
    button.innerHTML = `<strong>${command.label}</strong><span>${command.detail}</span>`;
    button.addEventListener("click", () => {
      setSelectedCommand(command.id);
      $("#commandState").textContent = "Command selected";
      $("#commandState").className = "state-pill green";
    });
    container.appendChild(button);
  });
}

function updateShell() {
  $("#savedName").textContent = state.title;
  $("#storageBadge").textContent = state.storage;
  $("#storageBadge").className = "state-pill";
  if (state.storage === "Temporary") $("#storageBadge").classList.add("amber");
  if (state.storage.includes("Saved") || state.storage.includes("Local")) $("#storageBadge").classList.add("green");
  $("#identityLine").textContent = `${state.title} - ${state.identity}`;
  $("#pathInput").value = state.path;
  $("#footerIdentity").textContent = `${state.title} - ${state.storage}`;
  renderSavedRows();
}

function setPath(path) {
  state.path = path;
  updateShell();
  if (path.startsWith("/wp-admin")) {
    $("#browserTitle").textContent = "WordPress Dashboard";
    $("#previewFrame").innerHTML = `
      <div class="admin-page">
        <aside class="admin-sidebar">
          <strong>Dashboard</strong>
          <span class="active">Home</span>
          <span>Posts</span>
          <span>Media</span>
          <span>Pages</span>
          <span>Appearance</span>
          <span>Plugins</span>
          <span>Tools</span>
          <span>Settings</span>
        </aside>
        <main class="admin-main">
          <h1>Dashboard</h1>
          <div class="dashboard-grid">
            <div class="dashboard-card"><strong>Site Health</strong><p>Good. Network access is allowed and PHP 8.3 is active.</p></div>
            <div class="dashboard-card"><strong>At a Glance</strong><p>1 page, 1 post, Twenty Twenty-Five theme.</p></div>
            <div class="dashboard-card"><strong>Quick Draft</strong><p>Ready for admin workflows inside the protected live browser.</p></div>
          </div>
        </main>
      </div>`;
  } else {
    $("#browserTitle").textContent = "My WordPress Website";
    $("#previewFrame").innerHTML = `
      <div class="front-page">
        <div class="front-copy">
          <h1>Hello from <span>WordPress Playground!</span></h1>
          <p>This is Playground, a WordPress that runs client-side in your browser. It is perfect for training, demonstrating plugins and themes, and testing purposes.</p>
          <p><mark>Note that you are logged-in as admin!</mark><br>Thus, you can modify this site as you like: edit content, install plugins and play around.</p>
          <button type="button">Discover the mission behind Playground</button>
        </div>
        <div class="playground-art" aria-hidden="true">
          <div class="green-ring ring-a"></div>
          <div class="green-ring ring-b"></div>
          <div class="wp-orb">W</div>
        </div>
      </div>`;
  }
}

function selectTab(tabId) {
  state.activeTab = tabId;
  $$(".tabbar button").forEach((button) => {
    const active = button.dataset.tab === tabId;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });
  $$(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `tab-${tabId}`);
  });
  const titles = {
    files: "Files workbench",
    blueprint: "Blueprint JSON and gallery",
    database: "SQLite database tools",
    logs: "Runtime logs",
    settings: "Runtime settings",
    save: "Save and saved list",
    start: "Create and import routes"
  };
  $("#managerTitle").textContent = titles[tabId] || "Site Manager";
}

function setFileDirty(isDirty) {
  state.fileDirty = isDirty;
  $("#fileState").textContent = isDirty ? "Dirty" : "Clean";
  $("#fileState").className = `state-pill ${isDirty ? "amber" : "green"}`;
  $("#selectedCommandBadge").textContent = isDirty
    ? "Selected command: Save dirty wp-config.php"
    : "Selected command: File saved";
}

function runProgress({ wrap, bar, text, startText, finishText, duration = 900, onDone }) {
  const progressWrap = $(wrap);
  const progressBar = $(bar);
  const progressText = $(text);
  let value = 0;
  progressWrap.hidden = false;
  progressBar.style.width = "0";
  progressText.textContent = startText;
  const interval = setInterval(() => {
    value += 20;
    progressBar.style.width = `${value}%`;
    if (value >= 100) {
      clearInterval(interval);
      progressText.textContent = finishText;
      window.setTimeout(() => {
        if (onDone) onDone();
      }, duration / 5);
    }
  }, duration / 5);
}

function saveFile() {
  selectTab("files");
  $("#commandState").textContent = "Saving file";
  $("#commandState").className = "state-pill amber";
  runProgress({
    wrap: "#fileProgressWrap",
    bar: "#fileProgress",
    text: "#fileProgressText",
    startText: "Writing /wordpress/wp-config.php...",
    finishText: "Saved /wordpress/wp-config.php",
    onDone: () => {
      setFileDirty(false);
      $("#commandState").textContent = "File saved";
      $("#commandState").className = "state-pill green";
      $("#lastTransfer").textContent = "wp-config.php saved to active Playground";
      addEvent("Saved /wordpress/wp-config.php and cleared dirty editor state.");
      addEvent("File save completed through Site Manager.", "playgroundLogs");
    }
  });
}

function downloadDatabase() {
  selectTab("database");
  $("#commandState").textContent = "Exporting database";
  $("#commandState").className = "state-pill amber";
  runProgress({
    wrap: "#databaseProgressWrap",
    bar: "#databaseProgress",
    text: "#databaseProgressText",
    startText: "Preparing database.sqlite from .ht.sqlite...",
    finishText: "database.sqlite ready",
    onDone: () => {
      $("#databaseResult").textContent = "database.sqlite downloaded - 452 KB - source /wordpress/wp-content/database/.ht.sqlite";
      $("#lastTransfer").textContent = "Downloaded database.sqlite";
      $("#commandState").textContent = "Database exported";
      $("#commandState").className = "state-pill green";
      addEvent("Downloaded database.sqlite from SQLite-backed WordPress database.");
    }
  });
}

function runCommand(commandId) {
  const command = commands.find((item) => item.id === commandId);
  if (!command) return;
  setSelectedCommand(commandId);

  if (commandId === "save-file") {
    if (!state.fileDirty) {
      $("#fileEditor").value += "\ndefine( 'WP_ENVIRONMENT_TYPE', 'local' );";
      setFileDirty(true);
    }
    saveFile();
    return;
  }

  if (commandId === "download-db") {
    downloadDatabase();
    return;
  }

  if (commandId === "open-admin") {
    $("#commandState").textContent = "Navigating";
    $("#commandState").className = "state-pill amber";
    $("#syncBadge").textContent = "Loading /wp-admin/";
    window.setTimeout(() => {
      setPath("/wp-admin/");
      $("#syncBadge").textContent = "WP Admin ready";
      $("#commandState").textContent = "Navigation complete";
      $("#commandState").className = "state-pill green";
      addEvent("Command search opened WP Admin and mutated the active path to /wp-admin/.");
    }, 450);
    return;
  }

  if (commandId === "wp-pr") {
    startRoute("wp-pr", $("#commandPrInput") ? $("#commandPrInput").value : "63322");
    return;
  }

  if (commandId === "github-import") {
    startRoute("github", $("#commandGithubInput") ? $("#commandGithubInput").value : "wordpress/wordpress-playground");
    return;
  }

  if (commandId === "zip-import") {
    confirmAction(
      "Import .zip and replace current site?",
      "The selected archive will replace the active Playground files and database. The current temporary site is not recoverable unless it is saved first.",
      () => startRoute("zip", "client-demo-site.zip")
    );
    return;
  }

  if (commandId === "blueprint-url") {
    runBlueprint();
  }
}

function startRoute(route, value = "") {
  selectTab("start");
  const labels = {
    vanilla: "Vanilla WordPress",
    "wp-pr": "WordPress PR",
    "gb-pr": "Gutenberg PR or Branch",
    github: "GitHub Import",
    "blueprint-url": "Blueprint URL",
    zip: "ZIP Import"
  };
  $("#commandState").textContent = "Starting route";
  $("#commandState").className = "state-pill amber";
  $("#syncBadge").textContent = `${labels[route]} preparing`;
  $("#lastTransfer").textContent = `${labels[route]} queued`;

  window.setTimeout(() => {
    if (route === "github" && !state.githubConnected) {
      $("#commandState").textContent = "GitHub connection required";
      $("#commandState").className = "state-pill red";
      addEvent("GitHub import paused until account connection is completed.");
      return;
    }
    const newTitle = route === "vanilla"
      ? "Unsaved Vanilla Playground"
      : route === "wp-pr"
        ? `WordPress PR ${value || $("#wpPrInput").value} Playground`
        : route === "gb-pr"
          ? `Gutenberg ${value || $("#gbPrInput").value} Playground`
          : route === "github"
            ? `GitHub Import ${value || $("#githubRepoInput").value}`
            : route === "blueprint-url"
              ? "Blueprint URL Playground"
              : "Imported ZIP Playground";
    state.title = newTitle;
    state.storage = "Temporary";
    state.identity = route === "zip" ? "temporary replacement from zip import" : "temporary browser runtime";
    setPath(route === "zip" ? "/" : "/hello-from-playground/");
    $("#lastTransfer").textContent = `${labels[route]} completed`;
    $("#syncBadge").textContent = "Preview updated";
    $("#commandState").textContent = "Route complete";
    $("#commandState").className = "state-pill green";
    addEvent(`${labels[route]} completed. Active shell title is now ${newTitle}.`);
    if (route === "zip") addEvent("ZIP import replaced files and database for the active temporary site.", "wordpressLogs");
    updateShell();
  }, 850);
}

function runBlueprint() {
  selectTab("blueprint");
  $("#blueprintValidation").textContent = "Validating Blueprint JSON...";
  $("#blueprintValidation").className = "validation";
  $("#commandState").textContent = "Blueprint running";
  $("#commandState").className = "state-pill amber";
  window.setTimeout(() => {
    $("#blueprintValidation").textContent = "Blueprint run complete - landing page changed to /hello-from-playground/.";
    $("#blueprintValidation").className = "validation ok";
    state.title = "Art Gallery Blueprint Playground";
    state.identity = "temporary Blueprint result";
    setPath("/hello-from-playground/");
    $("#lastTransfer").textContent = "Ran Blueprint bundle";
    $("#commandState").textContent = "Blueprint complete";
    $("#commandState").className = "state-pill green";
    addEvent("Ran Blueprint bundle after JSON validation and updated active Playground identity.");
    updateShell();
  }, 900);
}

function openSaveModal(destination = "browser") {
  $("#saveModal").hidden = false;
  $$("input[name='saveDestination']").forEach((radio) => {
    radio.checked = radio.value === destination;
  });
  updateDestinationCards();
}

function closeSaveModal() {
  $("#saveModal").hidden = true;
}

function updateDestinationCards() {
  const destination = $("input[name='saveDestination']:checked").value;
  $("#browserDestination").classList.toggle("selected", destination === "browser");
  $("#localDestination").classList.toggle("selected", destination === "local");
}

function runSave(destinationOverride) {
  const destination = destinationOverride || $("input[name='saveDestination']:checked").value;
  const name = $("#saveNameInput").value.trim() || "Saved Playground";
  $("#saveModal").hidden = false;
  $$("input[name='saveDestination']").forEach((radio) => {
    radio.checked = radio.value === destination;
  });
  updateDestinationCards();
  $("#commandState").textContent = destination === "browser" ? "Saving to browser" : "Choosing local directory";
  $("#commandState").className = "state-pill amber";

  let count = 0;
  $("#saveProgressWrap").hidden = false;
  $("#saveProgress").style.width = "0";
  const interval = setInterval(() => {
    count += 625;
    const percent = Math.min(100, Math.round((count / 3751) * 100));
    $("#saveProgress").style.width = `${percent}%`;
    $("#saveProgressText").textContent = destination === "browser"
      ? `Saving ${Math.min(count, 3751)} / 3751 files to browser storage`
      : `Writing ${Math.min(count, 3751)} / 3751 files to ~/Sites/playground-research`;
    if (count >= 3751) {
      clearInterval(interval);
      state.title = destination === "browser" ? name : `${name} Local`;
      state.storage = destination === "browser" ? "Saved in this browser" : "Local directory";
      state.identity = destination === "browser" ? "browser-backed saved Playground" : "local folder ~/Sites/playground-research";
      state.savedRows = state.savedRows.map((row) => ({ ...row, active: false }));
      const activeIndex = state.savedRows.findIndex((row) => row.id === "active-temp");
      const savedRow = {
        id: destination === "browser" ? "research-browser-active" : "research-local-active",
        name: state.title,
        meta: destination === "browser"
          ? "Browser storage - slug /research-browser-playground/"
          : "Local directory - folder permission granted",
        storage: state.storage,
        active: true
      };
      if (activeIndex >= 0) state.savedRows[activeIndex] = savedRow;
      else state.savedRows.unshift(savedRow);
      $("#saveProgressText").textContent = destination === "browser"
        ? "Saved in this browser. Row and shell identity updated."
        : "Saved to local directory. Reconnect may be required after refresh.";
      $("#lastTransfer").textContent = destination === "browser" ? "Browser save completed" : "Local directory save completed";
      $("#commandState").textContent = "Save complete";
      $("#commandState").className = "state-pill green";
      addEvent(`${state.title} saved to ${state.storage}; active saved row and shell badge updated.`);
      updateShell();
      window.setTimeout(closeSaveModal, 900);
    }
  }, 180);
}

function renderSavedRows() {
  const container = $("#savedRows");
  if (!container) return;
  container.innerHTML = "";
  state.savedRows.forEach((row) => {
    const item = document.createElement("div");
    item.className = `saved-row ${row.active ? "active" : ""}`;
    item.innerHTML = `
      <div>
        <strong>${row.name}</strong>
        <span>${row.storage} - ${row.meta}</span>
      </div>
      <div class="saved-row-actions">
        <button data-open="${row.id}" type="button">Open</button>
        <button data-manage="${row.id}" type="button">Manage</button>
        <button data-delete="${row.id}" class="danger-outline" type="button">Delete</button>
      </div>
    `;
    container.appendChild(item);
  });
  $$("[data-open]").forEach((button) => {
    button.addEventListener("click", () => openSavedRow(button.dataset.open));
  });
  $$("[data-manage]").forEach((button) => {
    button.addEventListener("click", () => {
      openSavedRow(button.dataset.manage);
      selectTab("files");
    });
  });
  $$("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteSavedRow(button.dataset.delete));
  });
}

function openSavedRow(id) {
  const row = state.savedRows.find((item) => item.id === id);
  if (!row) return;
  state.savedRows = state.savedRows.map((item) => ({ ...item, active: item.id === id }));
  state.title = row.name;
  state.storage = row.storage.includes("Local") ? "Local directory" : row.storage.includes("browser") || row.storage.includes("Saved") ? "Saved in this browser" : "Temporary";
  state.identity = row.meta;
  updateShell();
  addEvent(`Opened saved row: ${row.name}.`);
}

function deleteSavedRow(id) {
  const row = state.savedRows.find((item) => item.id === id);
  if (!row) return;
  confirmAction(
    `Delete ${row.name}?`,
    "This removes the saved Playground row from the browser or local-directory list. If it is active, the shell falls back to a new unsaved Playground.",
    () => {
      state.savedRows = state.savedRows.filter((item) => item.id !== id);
      if (row.active) {
        state.title = "Unsaved Playground";
        state.storage = "Temporary";
        state.identity = "new temporary fallback after delete";
        state.savedRows.unshift({
          id: "fallback-temp",
          name: "Unsaved Playground",
          meta: "Temporary - created after saved row deletion",
          storage: "Temporary",
          active: true
        });
        setPath("/hello-from-playground/");
      }
      updateShell();
      $("#lastTransfer").textContent = `Deleted ${row.name}`;
      addEvent(`Deleted saved Playground row: ${row.name}. Final state shown in saved list.`);
      selectTab("save");
    }
  );
}

let pendingConfirm = null;

function confirmAction(title, message, onConfirm) {
  $("#confirmTitle").textContent = title;
  $("#confirmMessage").textContent = message;
  pendingConfirm = onConfirm;
  $("#confirmModal").hidden = false;
}

function closeConfirm() {
  pendingConfirm = null;
  $("#confirmModal").hidden = true;
}

function resetPlayground() {
  confirmAction(
    "Apply settings and reset this unsaved Playground?",
    "The active temporary files and database will be replaced. Saved browser and local-directory Playgrounds would use Save & Reload instead.",
    () => {
      state.title = "Unsaved Playground";
      state.storage = "Temporary";
      state.identity = "reset with PHP 8.3 and latest WordPress";
      $("#syncBadge").textContent = "Preparing WordPress...";
      $("#lastTransfer").textContent = "Settings reset started";
      updateShell();
      window.setTimeout(() => {
        setPath("/hello-from-playground/");
        $("#syncBadge").textContent = "Reset complete";
        $("#lastTransfer").textContent = "Settings reset completed";
        addEvent("Applied settings and reset the unsaved Playground. Files and database were replaced.");
      }, 850);
    }
  );
}

function renameActive() {
  const active = state.savedRows.find((row) => row.active);
  if (!active) return;
  const nextName = active.name.includes("Renamed") ? active.name.replace(" Renamed", "") : `${active.name} Renamed`;
  active.name = nextName;
  state.title = nextName;
  $("#lastTransfer").textContent = "Renamed active Playground";
  addEvent(`Renamed active Playground to ${nextName}.`);
  updateShell();
}

function wireEvents() {
  $("#commandSearch").addEventListener("input", renderCommandResults);
  $("#runSelectedCommand").addEventListener("click", () => runCommand(state.selectedCommand));
  $("#pathInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      setPath(event.currentTarget.value || "/");
      addEvent(`Path input navigated to ${state.path}.`);
    }
  });
  $("#refreshButton").addEventListener("click", () => {
    $("#syncBadge").textContent = "Refreshed current page";
    addEvent(`Refreshed ${state.path}.`);
  });
  $("#homeButton").addEventListener("click", () => {
    setPath("/hello-from-playground/");
    addEvent("Homepage button navigated to /hello-from-playground/.");
  });
  $("#adminButton").addEventListener("click", () => runCommand("open-admin"));
  $("#openSaveButton").addEventListener("click", () => openSaveModal("browser"));
  $("#resetButton").addEventListener("click", resetPlayground);
  $("#applyResetButton").addEventListener("click", resetPlayground);
  $("#saveReloadButton").addEventListener("click", () => {
    $("#lastTransfer").textContent = "Saved and reloaded stored Playground";
    addEvent("Stored Playground used Save & Reload instead of destructive reset.");
  });

  $$(".route-strip button").forEach((button) => {
    button.addEventListener("click", () => {
      const route = button.dataset.route;
      if (route === "zip") {
        confirmAction(
          "Import .zip and replace current site?",
          "The selected zip import replaces the current Playground files and database.",
          () => startRoute("zip", "client-demo-site.zip")
        );
      } else if (route === "github") {
        selectTab("start");
        setSelectedCommand("github-import");
      } else {
        startRoute(route);
      }
    });
  });

  $$(".tabbar button").forEach((button) => {
    button.addEventListener("click", () => selectTab(button.dataset.tab));
  });

  $$(".tree-row").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".tree-row").forEach((row) => row.classList.remove("selected"));
      button.classList.add("selected");
      $("#selectedFile").textContent = button.dataset.file;
      setFileDirty(false);
      addEvent(`Selected file ${button.dataset.file}.`);
    });
  });

  $("#dirtyFileButton").addEventListener("click", () => {
    $("#fileEditor").value += "\ndefine( 'WP_DEBUG_LOG', true );";
    setFileDirty(true);
    addEvent("Edited wp-config.php; file is now dirty.");
  });
  $("#fileEditor").addEventListener("input", () => setFileDirty(true));
  $("#saveFileButton").addEventListener("click", saveFile);
  $("#uploadFileButton").addEventListener("click", () => {
    $("#lastTransfer").textContent = "Uploaded plugin-audit.php";
    addEvent("Uploaded plugin-audit.php into /wordpress/wp-content/plugins.");
  });

  $("#downloadDatabaseButton").addEventListener("click", downloadDatabase);
  $("#adminerButton").addEventListener("click", () => {
    $("#databaseResult").textContent = "Adminer opened in a new database tool view for the active SQLite-backed database.";
    addEvent("Opened Adminer from Database tab.");
  });
  $("#phpMyAdminButton").addEventListener("click", () => {
    $("#databaseResult").textContent = "phpMyAdmin opened with current database credentials.";
    addEvent("Opened phpMyAdmin from Database tab.");
  });

  $("#copyBlueprintButton").addEventListener("click", () => {
    $("#blueprintValidation").textContent = "Blueprint link copied to clipboard state.";
    addEvent("Copied Blueprint URL.");
  });
  $("#downloadBlueprintButton").addEventListener("click", () => {
    $("#lastTransfer").textContent = "Downloaded Blueprint bundle";
    $("#blueprintValidation").textContent = "Blueprint bundle downloaded.";
    addEvent("Downloaded current Blueprint bundle.");
  });
  $("#runBlueprintButton").addEventListener("click", runBlueprint);

  $("#downloadZipButton").addEventListener("click", () => {
    $("#lastTransfer").textContent = "Downloaded playground.zip";
    addEvent("Downloaded active Playground as .zip.");
  });
  $("#exportGitHubButton").addEventListener("click", () => {
    if (!state.githubConnected) {
      $("#lastTransfer").textContent = "GitHub export waiting for account connection";
      addEvent("Export to GitHub requires account connection before repository selection.");
      selectTab("start");
      return;
    }
    $("#lastTransfer").textContent = "Exported to GitHub repository";
    addEvent("Exported active Playground to connected GitHub repository.");
  });

  $("#connectGithubButton").addEventListener("click", () => {
    state.githubConnected = true;
    $("#connectGithubButton").textContent = "GitHub account connected";
    $("#lastTransfer").textContent = "GitHub account connected";
    addEvent("Connected GitHub account. Access token is not stored after refresh.");
  });

  $$("[data-start-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const route = button.dataset.startAction;
      if (route === "zip") {
        confirmAction(
          "Import .zip and replace current site?",
          "The archive will replace the active Playground files and database after validation.",
          () => startRoute("zip", $("#zipNameInput").value)
        );
        return;
      }
      const value = route === "wp-pr"
        ? $("#wpPrInput").value
        : route === "gb-pr"
          ? $("#gbPrInput").value
          : route === "github"
            ? $("#githubRepoInput").value
            : route === "blueprint-url"
              ? $("#startBlueprintUrl").value
              : "";
      startRoute(route, value);
    });
  });

  $("#closeSaveButton").addEventListener("click", closeSaveModal);
  $$("input[name='saveDestination']").forEach((radio) => {
    radio.addEventListener("change", updateDestinationCards);
  });
  $("#runSaveButton").addEventListener("click", () => runSave());
  $("#saveBrowserTabButton").addEventListener("click", () => openSaveModal("browser"));
  $("#saveLocalTabButton").addEventListener("click", () => openSaveModal("local"));
  $("#renameActiveButton").addEventListener("click", renameActive);

  $("#cancelConfirmButton").addEventListener("click", closeConfirm);
  $("#confirmActionButton").addEventListener("click", () => {
    const action = pendingConfirm;
    closeConfirm();
    if (action) action();
  });
}

wireEvents();
renderCommandResults();
setSelectedCommand("save-file");
renderSavedRows();
updateShell();
