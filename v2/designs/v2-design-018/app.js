const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const commands = [
  {
    id: "runtime-settings",
    group: "Runtime settings",
    title: "Runtime settings reload",
    description: "WordPress version, PHP version, language, network, multisite, older versions, reset, and saved reload.",
    keywords: "php wordpress language older versions network multisite reset reload settings runtime",
    badge: "Settings",
  },
  {
    id: "browser-save",
    group: "Save destinations",
    title: "Save active Playground",
    description: "Save in this browser or save to a local directory with distinct reload consequences.",
    keywords: "save saved playground local directory browser storage progress folder permission",
    badge: "Save",
  },
  {
    id: "zip-import",
    group: "Import routes",
    title: "Import .zip archive",
    description: "Select source, confirm replacement warning, validate, import, and update active identity.",
    keywords: "zip import replacement warning source upload archive portability",
    badge: "Import",
  },
  {
    id: "github-import",
    group: "Import routes",
    title: "Import from GitHub",
    description: "Connect account, select repository target, import plugin/theme/wp-content, and record token caveat.",
    keywords: "github import account connection repository plugin theme wp-content token",
    badge: "GitHub",
  },
  {
    id: "blueprint-tools",
    group: "Blueprint tools",
    title: "Blueprint gallery and runner",
    description: "Search categories, inspect selected detail, validate JSON, copy, download, and run Blueprint.",
    keywords: "blueprint gallery categories search url run copy download validation 43",
    badge: "Blueprint",
  },
  {
    id: "rename",
    group: "Saved management",
    title: "Rename Playground",
    description: "Change saved identity and update shell title, saved row, slug, and event stream.",
    keywords: "rename saved playground identity slug title manage",
    badge: "Manage",
  },
  {
    id: "delete",
    group: "Saved management",
    title: "Delete saved Playground",
    description: "Confirm destructive removal, delete saved row, and fall back to an Unsaved Playground.",
    keywords: "delete confirmation destructive saved playground remove fallback",
    badge: "Danger",
  },
  {
    id: "github-export",
    group: "Portability",
    title: "Export to GitHub",
    description: "Push a Playground bundle to a repository, or download the same bundle as a .zip.",
    keywords: "github export zip download portability transfer repository",
    badge: "Export",
  },
];

const state = {
  command: "runtime-settings",
  siteName: "Unsaved Playground",
  storage: "temporary",
  identity: "Temporary browser session. Refresh or close loses files and database unless saved.",
  path: "/hello-from-playground/",
  runtime: {
    wp: "latest",
    php: "8.3",
    language: "English (United States)",
    network: true,
    multisite: false,
    older: false,
  },
  eventTotal: 5,
  githubConnected: false,
};

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "playground";
}

function timeStamp() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function runtimeText() {
  return `WP ${state.runtime.wp} / PHP ${state.runtime.php} / ${state.runtime.language === "English (United States)" ? "en_US" : state.runtime.language} / ${state.runtime.network ? "Network on" : "Network off"}`;
}

function addEvent(message) {
  const item = document.createElement("li");
  item.innerHTML = `<time>${timeStamp()}</time><span>${message}</span>`;
  $("#events").prepend(item);
  state.eventTotal += 1;
  $("#eventCount").textContent = `${state.eventTotal} events`;
}

function setProgress(percent) {
  $("#objectProgress").style.inlineSize = `${percent}%`;
}

function storageLabel() {
  if (state.storage === "browser") return "Saved Playground";
  if (state.storage === "local") return "Local directory";
  if (state.storage === "zip") return "Imported ZIP";
  if (state.storage === "github") return "GitHub import";
  return "Unsaved Playground";
}

function updateShell() {
  $("#siteTitle").textContent = state.siteName;
  $("#identityLine").textContent = state.identity;
  $("#previewSiteName").textContent = state.siteName === "Unsaved Playground" ? "My WordPress Website" : state.siteName;
  $("#storageBadge").textContent = storageLabel();
  $("#storageBadge").className = `chip ${state.storage === "temporary" || state.storage === "zip" ? "warning" : "success"}`;
  $("#runtimeBadge").textContent = runtimeText();
  $("#wpValue").textContent = state.runtime.wp;
  $("#phpValue").textContent = state.runtime.php;
  $("#languageValue").textContent = state.runtime.language;
  $("#networkValue").textContent = state.runtime.network ? "Allowed" : "Blocked";
  $("#multisiteValue").textContent = state.runtime.multisite ? "On" : "Off";
  $("#olderValue").textContent = state.runtime.older ? "Included" : "Hidden";
  $("#pathInput").value = state.path;
  $("#previewPath").textContent = state.path;
  $("#activeRowName").textContent = state.siteName;
  $("#activeRowMeta").textContent = state.identity;

  if (state.storage === "browser") {
    $("#storageHeadline").textContent = "Saved in this browser";
    $("#storageCopy").textContent = "Runtime changes use Save & Reload. The saved row and slug remain addressable from Saved Playgrounds.";
    $("#runtimeConsequence").textContent = "This object is saved in browser storage, so runtime changes use Save & Reload and preserve the saved identity.";
    $("#applyRuntime").textContent = "Save & Reload stored Playground";
  } else if (state.storage === "local") {
    $("#storageHeadline").textContent = "Local directory backed";
    $("#storageCopy").textContent = "Runtime changes save to the selected folder. Reloading later needs folder permission before opening.";
    $("#runtimeConsequence").textContent = "This object is local-directory backed. Save & Reload writes changed runtime metadata to the folder after permission is granted.";
    $("#applyRuntime").textContent = "Save & Reload local directory";
  } else {
    $("#storageHeadline").textContent = state.storage === "zip" ? "Imported temporary ZIP" : "Temporary site";
    $("#storageCopy").textContent = "Applying settings here uses Apply Settings & Reset Playground and replaces WordPress files, SQLite database, logs, and current path.";
    $("#runtimeConsequence").textContent = "This object is temporary, so Apply Settings & Reset replaces files and database. Save first to get Save & Reload behavior.";
    $("#applyRuntime").textContent = "Apply Settings & Reset Playground";
  }
}

function setPreview(path, heading, copy, note) {
  state.path = path;
  $("#pathInput").value = path;
  $("#previewPath").textContent = path;
  const h2 = $(".wp-copy h2");
  h2.innerHTML = heading;
  $(".wp-copy p:not(.eyebrow):not(.note)").textContent = copy;
  $("#previewNote").textContent = note;
}

function showCommand(commandId) {
  const command = commands.find((item) => item.id === commandId) || commands[0];
  state.command = command.id;
  $("#commandTitle").textContent = command.title;
  $("#commandBadge").textContent = command.badge;

  $$(".command-form").forEach((form) => {
    form.classList.toggle("active", form.dataset.commandForm === command.id);
  });

  $$(".command-result").forEach((button) => {
    button.classList.toggle("active", button.dataset.commandId === command.id);
  });

  $("#commandResult").textContent = `${command.title} selected from grouped command search.`;
}

function renderCommandResults() {
  const query = $("#commandSearch").value.trim().toLowerCase();
  const terms = query.split(/\s+/).filter(Boolean);
  const filtered = terms.length
    ? commands.filter((command) => terms.some((term) => `${command.title} ${command.description} ${command.keywords} ${command.group}`.toLowerCase().includes(term)))
    : commands;

  const grouped = filtered.reduce((groups, command) => {
    groups[command.group] = groups[command.group] || [];
    groups[command.group].push(command);
    return groups;
  }, {});

  $("#commandResults").innerHTML = Object.entries(grouped).map(([group, items]) => `
    <div class="result-group">
      <strong>${group}</strong>
      ${items.map((item) => `
        <button class="command-result ${item.id === state.command ? "active" : ""}" type="button" data-command-id="${item.id}">
          ${item.title}
          <span>${item.description}</span>
        </button>
      `).join("")}
    </div>
  `).join("") || `<div class="result-box">No command found. Try save, zip, GitHub, Blueprint, PHP, files, database, logs, export, reset, or reload.</div>`;

  $("#queryStatus").textContent = `${filtered.length} grouped result${filtered.length === 1 ? "" : "s"}`;
}

function animateOperation(steps, done) {
  const progress = $("#operationProgress");
  const text = $("#operationProgressText");
  const bar = $("#operationProgressBar");
  let index = 0;
  progress.hidden = false;
  bar.style.inlineSize = "0%";
  setProgress(12);
  $("#browserFrame").classList.add("loading");

  function tick() {
    const step = steps[index];
    text.textContent = step.label;
    bar.style.inlineSize = `${step.percent}%`;
    setProgress(step.percent);
    index += 1;
    if (index < steps.length) {
      window.setTimeout(tick, 420);
    } else {
      window.setTimeout(() => {
        $("#browserFrame").classList.remove("loading");
        setProgress(0);
        done();
      }, 380);
    }
  }

  tick();
}

function ensureSavedRow(name, meta, storage = "browser") {
  let row = document.querySelector('[data-site="active"]');
  row.classList.add("active");
  row.querySelector("button").textContent = storage === "browser" ? "Manage" : "Reconnect";
  $("#activeRowName").textContent = name;
  $("#activeRowMeta").textContent = meta;
}

function applyRuntimeConfirm() {
  const isTemporary = state.storage === "temporary" || state.storage === "zip" || state.storage === "github";
  $("#runtimeConfirm").hidden = false;
  $("#runtimeConfirmTitle").textContent = isTemporary ? "Reset temporary Playground?" : "Reload saved runtime?";
  $("#runtimeConfirmCopy").textContent = isTemporary
    ? "The current files, database, path, logs, and unsaved edits will be replaced. This is the destructive reset path for a temporary Playground."
    : "The selected WordPress, PHP, language, network, multisite, and older-version settings will be saved, then the same Playground object will reload.";
  $("#commandResult").textContent = isTemporary
    ? "Replacement warning shown for temporary runtime reset."
    : "Saved-site reload confirmation shown.";
}

function confirmRuntime() {
  $("#runtimeConfirm").hidden = true;
  const next = {
    wp: $("#wpSelect").value,
    php: $("#phpSelect").value.replace("PHP ", ""),
    language: $("#languageSelect").value,
    network: $("#networkToggle").checked,
    multisite: $("#multisiteToggle").checked,
    older: $("#olderToggle").checked,
  };
  const reset = state.storage === "temporary" || state.storage === "zip" || state.storage === "github";
  animateOperation(
    [
      { label: reset ? "Preparing destructive reset plan..." : "Saving runtime settings to selected storage...", percent: 18 },
      { label: "Loading requested WordPress and PHP versions...", percent: 46 },
      { label: reset ? "Replacing files, database, logs, and path..." : "Reloading saved Playground object...", percent: 76 },
      { label: "Runtime command completed.", percent: 100 },
    ],
    () => {
      state.runtime = next;
      if (reset) {
        state.path = "/hello-from-playground/";
        $("#previewState").textContent = "Runtime reset completed";
        $("#previewSubstate").textContent = "Files and database were replaced for the temporary Playground.";
        setPreview(
          "/hello-from-playground/",
          "Hello from <span>WordPress Playground!</span>",
          "This Playground has been reset with the selected runtime settings. The current object remains temporary until saved.",
          "The reset returned the site to the landing page and cleared unsaved runtime state."
        );
      } else {
        $("#previewState").textContent = "Saved runtime reloaded";
        $("#previewSubstate").textContent = `${state.siteName} kept its saved identity after reload.`;
      }
      updateShell();
      $("#commandResult").textContent = `${reset ? "Apply Settings & Reset" : "Save & Reload"} completed: ${runtimeText()}.`;
      addEvent(`${reset ? "Reset" : "Reload"} completed for ${state.siteName}: ${runtimeText()}.`);
    }
  );
}

function saveBrowser() {
  const name = $("#browserSaveName").value.trim() || "Saved Playground";
  animateOperation(
    [
      { label: "Saving 482 / 3751 files to browser storage...", percent: 16 },
      { label: "Saving 1864 / 3751 files to browser storage...", percent: 48 },
      { label: "Saving 3028 / 3751 files to browser storage...", percent: 78 },
      { label: "Saved 3751 / 3751 files. Creating browser slug...", percent: 100 },
    ],
    () => {
      state.siteName = name;
      state.storage = "browser";
      state.identity = `browser: ${slugify(name)} - saved a moment ago`;
      updateShell();
      ensureSavedRow(name, "Saved in this browser - just now", "browser");
      $("#previewState").textContent = "Browser save complete";
      $("#previewSubstate").textContent = "The object now survives refresh in this browser.";
      $("#commandResult").textContent = `${name} is saved in this browser and visible in the Playground ledger.`;
      addEvent(`Saved ${name} in browser storage; shell title, storage badge, saved row, and reload behavior updated.`);
    }
  );
}

function saveLocal() {
  const folder = $("#localFolder").value.trim() || "/Users/admin/Playgrounds/runtime-ledger";
  animateOperation(
    [
      { label: "Requesting folder permission from browser picker...", percent: 18 },
      { label: "Writing WordPress files to local directory...", percent: 44 },
      { label: "Syncing SQLite database and blueprint.json...", percent: 76 },
      { label: "Local directory save complete.", percent: 100 },
    ],
    () => {
      state.siteName = $("#browserSaveName").value.trim() || "Runtime Ledger Playground";
      state.storage = "local";
      state.identity = `local directory: ${folder} - reconnect permission after refresh`;
      updateShell();
      ensureSavedRow(state.siteName, `Local directory - ${folder}`, "local");
      $("#previewState").textContent = "Local directory save complete";
      $("#previewSubstate").textContent = "Reloading later asks to reconnect the folder permission.";
      $("#commandResult").textContent = `Saved to ${folder}. This destination is distinct from browser storage.`;
      addEvent(`Saved ${state.siteName} to local directory ${folder}; reload consequence changed to folder reconnect.`);
    }
  );
}

function importZip(success = true) {
  if (!success) {
    $("#commandResult").textContent = "Validation failed: invalid-theme-archive.zip does not contain a recognizable WordPress export, plugin, theme, or wp-content directory.";
    $("#previewState").textContent = "ZIP import blocked";
    $("#previewSubstate").textContent = "The active Playground was not replaced.";
    addEvent("ZIP import validation failed; active Playground identity was unchanged.");
    return;
  }

  if (!$("#zipAcknowledge").checked) {
    $("#commandResult").textContent = "Replacement warning must be acknowledged before importing the selected .zip.";
    return;
  }

  const source = $("#zipSource").value || "plugin-qa-import.zip";
  animateOperation(
    [
      { label: `Reading ${source} from native file chooser...`, percent: 14 },
      { label: "Validating archive structure and blueprint metadata...", percent: 36 },
      { label: "Replacing active WordPress files and SQLite database...", percent: 68 },
      { label: "Refreshing active shell identity and path...", percent: 100 },
    ],
    () => {
      state.siteName = source === "plugin-qa-import.zip" ? "Plugin QA Import" : "Imported ZIP Playground";
      state.storage = "zip";
      state.identity = `temporary ZIP import: ${source} - save required before refresh`;
      state.path = "/wp-admin/plugins.php";
      updateShell();
      setPreview(
        "/wp-admin/plugins.php",
        "Plugins <span>from ZIP import</span>",
        "The imported archive replaced the active files and database. This result is temporary until saved in browser storage or to a local directory.",
        "Replacement completed after warning confirmation. Save now to preserve the imported site."
      );
      $("#previewState").textContent = "ZIP import completed";
      $("#previewSubstate").textContent = "Active Playground identity, path, storage badge, and saved ledger row changed.";
      ensureSavedRow(state.siteName, "Temporary ZIP import - not saved", "zip");
      $("#commandResult").textContent = `${source} imported successfully. Active identity updated to ${state.siteName}.`;
      addEvent(`ZIP import replaced active Playground with ${state.siteName}; path changed to /wp-admin/plugins.php.`);
    }
  );
}

function githubImport() {
  if (!state.githubConnected) {
    $("#commandResult").textContent = "GitHub account connection is required before import. The access token will not be stored after refresh.";
    return;
  }

  const repo = $("#githubRepo").value.trim();
  animateOperation(
    [
      { label: "Using connected GitHub account for this session...", percent: 16 },
      { label: "Fetching repository tree and selected target...", percent: 42 },
      { label: "Importing files into wp-content...", percent: 74 },
      { label: "Updating active Playground identity...", percent: 100 },
    ],
    () => {
      state.siteName = "GitHub Import Playground";
      state.storage = "github";
      state.identity = `temporary GitHub import: ${repo} - token not stored`;
      state.path = "/wp-admin/";
      updateShell();
      setPreview(
        "/wp-admin/",
        "Dashboard <span>with GitHub import</span>",
        "The selected repository content was imported into wp-content. The token is session-only, so refresh requires a new connection.",
        "Save this imported Playground to browser storage or a local directory before closing."
      );
      $("#previewState").textContent = "GitHub import completed";
      $("#previewSubstate").textContent = "Repository import changed the active temporary object.";
      ensureSavedRow(state.siteName, "Temporary GitHub import - token not stored", "github");
      $("#commandResult").textContent = `Imported ${repo} into the active Playground.`;
      addEvent(`GitHub import completed from ${repo}; active identity changed and token caveat recorded.`);
    }
  );
}

function renameSite() {
  const name = $("#renameInput").value.trim() || "Renamed Playground";
  state.siteName = name;
  if (state.storage === "browser") {
    state.identity = `browser: ${slugify(name)} - renamed just now`;
  } else if (state.storage === "local") {
    state.identity = state.identity.replace(/^local directory:/, `local directory (${name}):`);
  } else {
    state.identity = `${state.identity} - display name renamed`;
  }
  updateShell();
  $("#commandResult").textContent = `Renamed active Playground to ${name}. Shell title and ledger row updated.`;
  addEvent(`Renamed active Playground to ${name}.`);
}

function deleteSite() {
  if (!$("#deleteConfirmCheck").checked) {
    $("#commandResult").textContent = "Delete confirmation is required before removing a saved Playground.";
    return;
  }

  animateOperation(
    [
      { label: "Checking active saved row...", percent: 22 },
      { label: "Removing saved browser/local reference...", percent: 55 },
      { label: "Opening fallback Unsaved Playground...", percent: 84 },
      { label: "Delete complete.", percent: 100 },
    ],
    () => {
      const deletedName = state.siteName;
      state.siteName = "Unsaved Playground";
      state.storage = "temporary";
      state.identity = "Temporary browser session created after delete. Refresh or close loses files and database unless saved.";
      state.path = "/hello-from-playground/";
      updateShell();
      setPreview(
        "/hello-from-playground/",
        "Hello from <span>WordPress Playground!</span>",
        "A fallback Unsaved Playground is active after deleting the saved row.",
        "The deleted Playground row is gone. Save the fallback if you want to keep it."
      );
      $("#previewState").textContent = "Delete completed";
      $("#previewSubstate").textContent = "Active site fell back to an Unsaved Playground.";
      $("#commandResult").textContent = `${deletedName} deleted. Active shell now points at Unsaved Playground.`;
      addEvent(`Deleted ${deletedName}; saved row removed and fallback Unsaved Playground opened.`);
    }
  );
}

function exportGithub() {
  const repo = $("#exportRepo").value.trim();
  animateOperation(
    [
      { label: "Preparing export bundle...", percent: 24 },
      { label: "Writing wp-content, blueprint.json, and SQLite database...", percent: 55 },
      { label: "Pushing export to GitHub repository...", percent: 82 },
      { label: "GitHub export complete.", percent: 100 },
    ],
    () => {
      $("#commandResult").textContent = `Exported ${state.siteName} to ${repo}.`;
      $("#previewState").textContent = "GitHub export complete";
      $("#previewSubstate").textContent = "Transfer history updated; active Playground did not change.";
      addEvent(`Exported ${state.siteName} to ${repo}.`);
    }
  );
}

function simpleResult(message) {
  $("#commandResult").textContent = message;
  addEvent(message);
}

function bindEvents() {
  $("#commandSearch").addEventListener("input", () => {
    renderCommandResults();
    addEvent(`Command query changed to "${$("#commandSearch").value}".`);
  });

  $("#commandResults").addEventListener("click", (event) => {
    const button = event.target.closest("[data-command-id]");
    if (button) showCommand(button.dataset.commandId);
  });

  $$("[data-select-command]").forEach((button) => {
    button.addEventListener("click", () => {
      showCommand(button.dataset.selectCommand);
      renderCommandResults();
    });
  });

  $$(".strip-tabs button").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".strip-tabs button").forEach((tab) => tab.classList.toggle("active", tab === button));
      $$(".manager-panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.managerPanel === button.dataset.manager));
    });
  });

  $$(".wp-site-header [data-path]").forEach((button) => {
    button.addEventListener("click", () => {
      state.path = button.dataset.path;
      updateShell();
      $("#previewPath").textContent = state.path;
      addEvent(`Path changed through WordPress navigation to ${state.path}.`);
    });
  });

  $("#pathInput").addEventListener("change", () => {
    state.path = $("#pathInput").value.trim() || "/";
    updateShell();
    addEvent(`Path input navigated active WordPress frame to ${state.path}.`);
  });

  $("#refreshButton").addEventListener("click", () => simpleResult(`Refreshed active WordPress page at ${state.path}.`));
  $("#homepageButton").addEventListener("click", () => {
    setPreview(
      "/hello-from-playground/",
      "Hello from <span>WordPress Playground!</span>",
      "This Playground runs client-side in your browser. It is ready for training, testing plugins and themes, previewing PRs, and experimenting with Blueprints.",
      "Homepage opened from the protected shell."
    );
    updateShell();
    addEvent("Homepage opened in the live WordPress frame.");
  });
  $("#adminButton").addEventListener("click", () => {
    setPreview(
      "/wp-admin/",
      "Dashboard <span>WP Admin</span>",
      "WordPress admin is loaded inside the protected Playground shell with the current runtime object still selected.",
      "Logged in as admin. Site Manager and save actions remain available."
    );
    updateShell();
    addEvent("WP Admin opened in the live WordPress frame.");
  });

  $("#previewReset").addEventListener("click", () => {
    showCommand("runtime-settings");
    renderCommandResults();
    applyRuntimeConfirm();
  });
  $("#applyRuntime").addEventListener("click", applyRuntimeConfirm);
  $("#saveBeforeRuntime").addEventListener("click", () => showCommand("browser-save"));
  $("#cancelRuntime").addEventListener("click", () => {
    $("#runtimeConfirm").hidden = true;
    $("#commandResult").textContent = "Runtime reset/reload canceled. Active Playground was not changed.";
    addEvent("Runtime reset/reload canceled before mutation.");
  });
  $("#confirmRuntime").addEventListener("click", confirmRuntime);

  $("#saveBrowser").addEventListener("click", saveBrowser);
  $("#saveLocal").addEventListener("click", saveLocal);
  $("#cancelLocalSave").addEventListener("click", () => {
    $("#commandResult").textContent = "Local directory picker canceled. Browser storage and active Playground were unchanged.";
    addEvent("Local directory save canceled before folder permission.");
  });

  $("#runZipImport").addEventListener("click", () => importZip(true));
  $("#failZipImport").addEventListener("click", () => importZip(false));

  $("#connectGithub").addEventListener("click", () => {
    state.githubConnected = true;
    $("#commandResult").textContent = "GitHub account connected for this session. Token will not be stored after refresh.";
    addEvent("GitHub account connected for import route; token persistence warning recorded.");
  });
  $("#runGithubImport").addEventListener("click", githubImport);

  $("#renameSite").addEventListener("click", renameSite);
  $("#cancelDelete").addEventListener("click", () => {
    $("#deleteConfirmCheck").checked = false;
    $("#commandResult").textContent = "Delete canceled. Saved Playground row remains active.";
    addEvent("Delete canceled before destructive removal.");
  });
  $("#confirmDelete").addEventListener("click", deleteSite);

  $("#runGithubExport").addEventListener("click", exportGithub);
  $("#downloadBundle").addEventListener("click", () => simpleResult(`Downloaded ${state.siteName} as a .zip bundle.`));
  $("#downloadZip").addEventListener("click", () => simpleResult(`Downloaded ${state.siteName} as a .zip bundle from the shell action.`));
  $("#downloadDb").addEventListener("click", () => simpleResult("Downloaded database.sqlite from /wordpress/wp-content/database/.ht.sqlite."));
  $("#openAdminer").addEventListener("click", () => simpleResult("Opened Adminer for the SQLite-backed database."));
  $("#openPhpMyAdmin").addEventListener("click", () => simpleResult("Opened phpMyAdmin for the SQLite-backed database."));
  $("#copyBlueprint").addEventListener("click", () => simpleResult("Copied Blueprint URL to clipboard."));
  $("#downloadBlueprint").addEventListener("click", () => simpleResult("Downloaded current Blueprint bundle."));
  $("#runBlueprint").addEventListener("click", () => {
    animateOperation(
      [
        { label: "Validating blueprint.json...", percent: 20 },
        { label: "Confirming Blueprint will alter current content...", percent: 45 },
        { label: "Running Blueprint steps in active Playground...", percent: 78 },
        { label: "Blueprint run complete.", percent: 100 },
      ],
      () => {
        state.path = "/hello-from-playground/";
        updateShell();
        $("#previewState").textContent = "Blueprint run complete";
        $("#previewSubstate").textContent = "Blueprint altered active content and transfer history.";
        $("#commandResult").textContent = "Blueprint validated and ran successfully against the active Playground.";
        addEvent("Blueprint validated, ran, and updated active Playground content.");
      }
    );
  });

  $$(".route-grid [data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      state.siteName = `${button.dataset.route} Preview`;
      state.storage = "temporary";
      state.identity = `${button.dataset.route} route created a temporary Playground. Save before refresh.`;
      state.path = button.dataset.route === "WordPress PR" || button.dataset.route === "Gutenberg PR" ? "/wp-admin/" : "/hello-from-playground/";
      updateShell();
      $("#previewState").textContent = `${button.dataset.route} route opened`;
      $("#previewSubstate").textContent = "Route-specific input accepted; result is temporary until saved.";
      addEvent(`${button.dataset.route} launch route opened a temporary Playground.`);
    });
  });

  $$("#savedList [data-open-saved]").forEach((button) => {
    button.addEventListener("click", () => {
      state.siteName = button.dataset.openSaved;
      state.storage = button.dataset.openSaved.includes("Local") ? "local" : "browser";
      state.identity = state.storage === "local"
        ? "local directory: folder permission needed after refresh"
        : `browser: ${slugify(state.siteName)} - restored from Saved Playgrounds`;
      state.path = "/hello-from-playground/";
      updateShell();
      addEvent(`Opened saved Playground ${state.siteName}.`);
    });
  });
}

renderCommandResults();
showCommand("runtime-settings");
updateShell();
bindEvents();
