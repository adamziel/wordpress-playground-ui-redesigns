const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const state = {
  siteName: "Research Browser Playground",
  saved: true,
  storage: "browser",
  identity: "browser: research-browser-playground",
  path: "/hello-from-playground/",
  command: "settings",
  manager: "settings",
  runtime: {
    wp: "latest",
    php: "8.3",
    language: "en_US",
    network: true,
  },
};

const commandLabels = {
  settings: "Settings Save & Reload",
  save: "Save destinations",
  launch: "Create or import Playground",
  blueprints: "Blueprint gallery",
  portability: "Portability transfers",
};

function nowStamp() {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function addHistory(message) {
  const list = $("#diagnosticHistory");
  const item = document.createElement("li");
  item.innerHTML = `<span>${nowStamp()}</span> ${message}`;
  list.prepend(item);
  $("#lastTransfer").textContent = message;
}

function runtimeText() {
  const network = state.runtime.network ? "Network on" : "Network off";
  return `WP ${state.runtime.wp} / PHP ${state.runtime.php} / ${state.runtime.language} / ${network}`;
}

function updateShell() {
  $("#shellTitle").textContent = state.siteName;
  $("#identityValue").textContent = state.identity;
  $("#storageBadge").textContent = state.saved
    ? state.storage === "local"
      ? "Local directory"
      : "Saved Playground"
    : "Unsaved Playground";
  $("#storageBadge").className = `badge ${state.saved ? "success" : "warning"}`;
  $("#runtimeBadge").textContent = runtimeText();
  $("#diagRuntime").textContent = runtimeText().replaceAll(" / ", ", ");
  $("#selectedCommand").textContent = commandLabels[state.command];
  $("#pathInput").value = state.path;
  $("#previewPathLabel").textContent = state.path;
}

function selectPanel(panelName) {
  $$(".inspector-tabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.panel === panelName);
  });
  $$("[data-panel-view]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panelView === panelName);
  });
}

function selectCommand(commandName) {
  state.command = commandName;
  selectPanel("command");
  $$(".command-picker button").forEach((button) => {
    button.classList.toggle("active", button.dataset.command === commandName);
  });
  $$("[data-command-view]").forEach((view) => {
    view.classList.toggle("active", view.dataset.commandView === commandName);
  });
  updateShell();
}

function selectManager(managerName) {
  state.manager = managerName;
  $$(".manager-tabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.manager === managerName);
  });
  $$("[data-manager-view]").forEach((view) => {
    view.classList.toggle("active", view.dataset.managerView === managerName);
  });
}

function setPath(path) {
  state.path = path;
  updateShell();

  if (path === "/wp-admin/") {
    $("#siteCanvas").innerHTML = `
      <article class="site-copy">
        <p class="mini-label">/wp-admin/</p>
        <h2>Dashboard</h2>
        <p>Welcome to WordPress. The admin is loaded inside the protected Playground browser frame.</p>
        <p class="note">Site Health reports one PHP notice and no fatal errors.</p>
        <button class="wp-button" type="button">Open Site Editor</button>
      </article>
      <aside class="runtime-card" aria-label="Preview state">
        <strong>WP Admin active</strong>
        <span>Logged in as admin. Runtime: ${runtimeText()}</span>
        <div class="mini-meter"><span></span></div>
      </aside>
    `;
  } else {
    $("#siteCanvas").innerHTML = `
      <article class="site-copy">
        <p class="mini-label" id="previewPathLabel">${path}</p>
        <h2>Hello from <span>WordPress Playground!</span></h2>
        <p>This Playground runs client-side in the browser. It is ready for plugin tests, theme demos, PR reviews, and training without a server.</p>
        <p class="note">You are logged in as admin. Settings changes reload this saved browser-backed Playground; temporary Playgrounds warn before reset.</p>
        <button class="wp-button" type="button">Discover the mission behind Playground</button>
      </article>
      <aside class="runtime-card" aria-label="Preview state">
        <strong id="previewState">Live preview protected</strong>
        <span id="previewSubstate">Last reload: stored browser copy, ${nowStamp()}</span>
        <div class="mini-meter"><span></span></div>
      </aside>
    `;
  }
}

function animateProgress(options) {
  const { card, bar, text, steps, done } = options;
  let index = 0;
  card.hidden = false;
  bar.style.inlineSize = "0%";
  text.textContent = steps[0].label;

  function tick() {
    const step = steps[index];
    text.textContent = step.label;
    bar.style.inlineSize = `${step.percent}%`;
    index += 1;
    if (index < steps.length) {
      window.setTimeout(tick, 420);
    } else {
      window.setTimeout(done, 380);
    }
  }

  tick();
}

function beginReload() {
  $("#reloadConfirm").hidden = false;
  $("#reloadConfirm strong").textContent = "Reload saved runtime?";
  $("#reloadConfirm p").textContent =
    "The browser-saved Playground will reload with the selected WordPress, PHP, language, and network settings. Unsaved runtime changes are discarded, but the saved identity remains.";
  $("#reloadResultText").textContent = "Pending settings change. Confirmation required before reload.";
}

function confirmReload() {
  $("#reloadConfirm").hidden = true;
  $("#previewFrame").classList.add("loading");
  $("#previewState") && ($("#previewState").textContent = "Reloading stored Playground");

  animateProgress({
    card: $("#reloadProgress"),
    bar: $("#reloadProgressBar"),
    text: $("#reloadProgressText"),
    steps: [
      { label: "Saving runtime preferences to browser storage...", percent: 20 },
      { label: "Reloading WordPress with selected versions...", percent: 52 },
      { label: "Restoring saved identity and current path...", percent: 78 },
      { label: "Runtime check complete.", percent: 100 },
    ],
    done() {
      state.runtime.wp = $("#wpVersion").value;
      state.runtime.php = $("#phpVersion").value;
      state.runtime.language = $("#language").value;
      state.runtime.network = $("#networkAccess").checked;
      updateShell();
      $("#previewFrame").classList.remove("loading");
      $("#reloadResultText").textContent = `${runtimeText()} saved and reloaded for ${state.identity}.`;
      $("#previewSubstate") && ($("#previewSubstate").textContent = `Reloaded stored browser copy at ${nowStamp()}`);
      $("#supportSignal").textContent = state.runtime.network
        ? "Network access enabled; PHP notice remains isolated"
        : "Network access disabled; external fetch warnings expected";
      addHistory(`Settings Save & Reload completed: ${runtimeText()}`);
    },
  });
}

function showTemporaryResetWarning() {
  $("#reloadConfirm").hidden = false;
  $("#reloadConfirm strong").textContent = "Temporary Playground would reset";
  $("#reloadConfirm p").textContent =
    "For an Unsaved Playground this action would rebuild WordPress, clear file edits, reset the SQLite database, and return the path to /hello-from-playground/.";
  $("#reloadResultText").textContent = "Temporary reset warning shown. No reload started.";
  addHistory("Temporary reset warning previewed; action canceled before mutation");
}

function saveToBrowser() {
  const name = $("#browserSaveName").value.trim() || "Saved Playground";
  animateProgress({
    card: $("#saveProgress"),
    bar: $("#saveProgressBar"),
    text: $("#saveProgressText"),
    steps: [
      { label: "Saving 482 / 3751 files to browser storage...", percent: 18 },
      { label: "Saving 1864 / 3751 files to browser storage...", percent: 48 },
      { label: "Saving 3028 / 3751 files to browser storage...", percent: 78 },
      { label: "Saved 3751 / 3751 files.", percent: 100 },
    ],
    done() {
      state.siteName = name;
      state.saved = true;
      state.storage = "browser";
      state.identity = `browser: ${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
      updateShell();
      $("#saveResult").textContent = `${name} is saved in this browser and appears in Saved Playgrounds with a slug URL.`;
      ensureSavedRow(name, "Saved in this browser - just now");
      addHistory(`Saved ${name} in browser storage`);
    },
  });
}

function saveToLocal() {
  const folder = $("#localFolder").value.trim() || "/Users/admin/Playgrounds/current-playground";
  animateProgress({
    card: $("#saveProgress"),
    bar: $("#saveProgressBar"),
    text: $("#saveProgressText"),
    steps: [
      { label: "Requesting local directory permission...", percent: 16 },
      { label: "Writing WordPress files to selected folder...", percent: 44 },
      { label: "Syncing SQLite database and blueprint.json...", percent: 78 },
      { label: "Local directory save complete.", percent: 100 },
    ],
    done() {
      state.saved = true;
      state.storage = "local";
      state.identity = `local directory: ${folder}`;
      updateShell();
      $("#saveResult").textContent = `Saved to ${folder}. Refreshing later will ask to reconnect folder permission before opening.`;
      $("#storageConsequence").textContent = "Local directory save completed; reconnect folder permission after refresh";
      addHistory(`Saved to local directory ${folder}`);
    },
  });
}

function ensureSavedRow(name, description) {
  const list = $("#savedList");
  let row = list.querySelector('[data-site="research"]');
  if (!row) {
    row = document.createElement("article");
    row.className = "saved-row active";
    row.dataset.site = "research";
    row.innerHTML = `
      <div>
        <strong></strong>
        <span></span>
      </div>
      <div class="row-actions">
        <button type="button" class="small-button">Open</button>
        <button type="button" class="small-button">Rename</button>
        <button type="button" class="small-button danger-text" id="deleteActive">Delete</button>
      </div>
    `;
    list.prepend(row);
    row.querySelector("#deleteActive").addEventListener("click", showDeleteConfirm);
  }
  row.querySelector("strong").textContent = name;
  row.querySelector("span").textContent = description;
}

function showDeleteConfirm() {
  $("#deleteConfirm").hidden = false;
  $("#libraryResult").textContent = "Delete confirmation open. Cancel keeps the saved row and active browser identity.";
}

function confirmDelete() {
  $("#deleteConfirm").hidden = true;
  animateProgress({
    card: $("#deleteProgress"),
    bar: $("#deleteProgressBar"),
    text: $("#deleteProgressText"),
    steps: [
      { label: "Deleting browser file copy...", percent: 25 },
      { label: "Removing saved row and slug...", percent: 58 },
      { label: "Falling back to Unsaved Playground...", percent: 86 },
      { label: "Delete complete.", percent: 100 },
    ],
    done() {
      const active = $('#savedList [data-site="research"]');
      if (active) {
        active.remove();
      }
      const fallback = $('#savedList [data-site="unsaved"]');
      fallback.classList.add("active");
      state.siteName = "Unsaved Playground";
      state.saved = false;
      state.storage = "temporary";
      state.identity = "temporary session: not saved";
      state.path = "/hello-from-playground/";
      updateShell();
      setPath(state.path);
      $("#libraryResult").textContent = "Research Browser Playground deleted. Active shell fell back to Unsaved Playground.";
      $("#storageConsequence").textContent = "Temporary Playground will be lost on refresh unless saved";
      addHistory("Deleted saved Playground; active site fell back to Unsaved Playground");
    },
  });
}

function filterBlueprints() {
  const query = $("#blueprintSearch").value.toLowerCase();
  const activeFilter = $(".filters button.active").dataset.filter;
  $$(".blueprint-row").forEach((row) => {
    const matchesQuery = row.dataset.name.toLowerCase().includes(query);
    const matchesFilter = activeFilter === "all" || row.dataset.tags.includes(activeFilter);
    row.hidden = !matchesQuery || !matchesFilter;
  });
}

function selectBlueprint(row) {
  $$(".blueprint-row").forEach((item) => item.classList.toggle("selected", item === row));
  $("#selectedBlueprint").textContent = row.dataset.name;
  $("#blueprintResult").textContent = `${row.dataset.name} selected. Schema valid. Ready to run.`;
}

function runBlueprint() {
  const name = $("#selectedBlueprint").textContent;
  $("#blueprintResult").textContent = `Validated ${name}. Replacement warning accepted. Running steps...`;
  window.setTimeout(() => {
    $("#blueprintResult").textContent = `${name} ran successfully. Preview path remains ${state.path}.`;
    addHistory(`Blueprint run completed: ${name}`);
  }, 650);
}

function portabilityResult(message) {
  $("#portabilityResult").textContent = message;
  addHistory(message);
}

function init() {
  updateShell();

  $$(".inspector-tabs button").forEach((button) => {
    button.addEventListener("click", () => selectPanel(button.dataset.panel));
  });

  $$("[data-command]").forEach((button) => {
    button.addEventListener("click", () => selectCommand(button.dataset.command));
  });

  $$(".command-picker button").forEach((button) => {
    button.addEventListener("click", () => selectCommand(button.dataset.command));
  });

  $$(".manager-tabs button").forEach((button) => {
    button.addEventListener("click", () => selectManager(button.dataset.manager));
  });

  $("#pathInput").addEventListener("change", (event) => {
    setPath(event.target.value || "/");
    addHistory(`Navigated preview to ${state.path}`);
  });

  $("#homepageButton").addEventListener("click", () => {
    setPath("/hello-from-playground/");
    addHistory("Opened Homepage from shell");
  });

  $("#adminButton").addEventListener("click", () => {
    setPath("/wp-admin/");
    addHistory("Opened WP Admin from shell");
  });

  $("#refreshButton").addEventListener("click", () => {
    $("#previewFrame").classList.add("loading");
    window.setTimeout(() => $("#previewFrame").classList.remove("loading"), 500);
    addHistory(`Refreshed active WordPress path ${state.path}`);
  });

  $$(".site-header button[data-path]").forEach((button) => {
    button.addEventListener("click", () => setPath(button.dataset.path));
  });

  $("#startReload").addEventListener("click", beginReload);
  $("#cancelReload").addEventListener("click", () => {
    $("#reloadConfirm").hidden = true;
    $("#reloadResultText").textContent = "Reload canceled. Runtime badge unchanged.";
    addHistory("Settings Save & Reload canceled");
  });
  $("#confirmReload").addEventListener("click", confirmReload);
  $("#previewResetWarning").addEventListener("click", showTemporaryResetWarning);

  $("#saveBrowser").addEventListener("click", saveToBrowser);
  $("#saveLocal").addEventListener("click", saveToLocal);
  $("#cancelLocal").addEventListener("click", () => {
    $("#saveResult").textContent = "Local directory picker canceled. No folder permission was granted and browser identity is unchanged.";
    addHistory("Local directory picker canceled before saving");
  });

  $("#deleteActive").addEventListener("click", showDeleteConfirm);
  $("#cancelDelete").addEventListener("click", () => {
    $("#deleteConfirm").hidden = true;
    $("#libraryResult").textContent = "Delete canceled. Research Browser Playground remains active and saved.";
    addHistory("Delete canceled; saved row retained");
  });
  $("#confirmDelete").addEventListener("click", confirmDelete);

  $$(".filters button").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".filters button").forEach((item) => item.classList.toggle("active", item === button));
      filterBlueprints();
    });
  });
  $("#blueprintSearch").addEventListener("input", filterBlueprints);
  $$(".blueprint-row").forEach((row) => row.addEventListener("click", () => selectBlueprint(row)));
  $("#runBlueprint").addEventListener("click", runBlueprint);
  $("#copyBlueprint").addEventListener("click", () => {
    $("#blueprintResult").textContent = "Blueprint URL copied for the selected gallery item.";
    addHistory("Blueprint URL copied");
  });
  $("#downloadBlueprint").addEventListener("click", () => {
    $("#blueprintResult").textContent = "Blueprint bundle downloaded.";
    addHistory("Blueprint bundle downloaded");
  });
  $("#managerRunBlueprint").addEventListener("click", () => {
    $("#managerBlueprintResult").textContent = "Blueprint validated, replacement warning accepted, run completed.";
    addHistory("Manager blueprint.json run completed");
  });

  $$("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".route-card").forEach((card) => card.classList.remove("active"));
      button.closest(".route-card").classList.add("active");
      addHistory(`${button.dataset.route} route selected; input constraints shown`);
    });
  });

  $("#connectGithub").addEventListener("click", () => {
    $("#connectGithub").textContent = "GitHub connected for this session";
    addHistory("GitHub account connected; token will not be stored after refresh");
  });

  $("#githubExport").addEventListener("click", () => portabilityResult("GitHub export queued: account connected, repository selection required."));
  $("#zipDownload").addEventListener("click", () => portabilityResult("Download as .zip completed: files, database, and blueprint bundled."));
  $("#zipImport").addEventListener("click", () => portabilityResult("ZIP import selected; validation requires replacement confirmation before mutation."));
  $("#databaseDownload").addEventListener("click", () => portabilityResult("database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite."));
  $$("[data-portable='database']").forEach((button) => {
    button.addEventListener("click", () => portabilityResult("database.sqlite downloaded from diagnostics panel."));
  });

  $("#editFile").addEventListener("click", () => {
    $("#fileCode").textContent += "\ndefine( 'WP_DEBUG', true );";
    $("#fileResult").textContent = "wp-config.php has unsaved edits.";
  });
  $("#saveFile").addEventListener("click", () => {
    $("#fileResult").textContent = "wp-config.php saved. File browser result recorded.";
    addHistory("File saved: /wordpress/wp-config.php");
  });
  $("#uploadFile").addEventListener("click", () => {
    $("#fileResult").textContent = "Upload completed: diagnostics-helper.php added to wp-content/mu-plugins.";
    addHistory("File upload completed in Site Manager");
  });
}

init();
