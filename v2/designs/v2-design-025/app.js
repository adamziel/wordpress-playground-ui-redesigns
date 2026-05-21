const state = {
  activeSite: "research",
  storage: "browser",
  saveDestination: "browser",
  pendingConfirm: null,
  sites: {
    research: {
      title: "Research Browser Playground",
      subtitle: "Saved in this browser as research-browser-playground.",
      storageLabel: "Browser storage",
      shellBadge: "Saved Playground",
      browserStorage: "Browser saved",
      identity: "research-browser-playground",
      runtime: "WP latest / PHP 8.3 / en_US / Network on",
      runtimeShort: "WP latest, PHP 8.3",
      reloadValue: "Save & Reload",
      path: "/hello-from-playground/"
    },
    local: {
      title: "Theme Lab Local Directory",
      subtitle: "Folder-backed Playground at ~/Sites/theme-lab.",
      storageLabel: "Local directory",
      shellBadge: "Local directory",
      browserStorage: "Local folder",
      identity: "~/Sites/theme-lab",
      runtime: "WP 6.8 / PHP 8.2 / en_US / Network on",
      runtimeShort: "WP 6.8, PHP 8.2",
      reloadValue: "Save & Reload after reconnect",
      path: "/wp-admin/"
    },
    unsaved: {
      title: "Unsaved Playground",
      subtitle: "Temporary session, not saved to browser storage.",
      storageLabel: "Temporary memory",
      shellBadge: "Unsaved Playground",
      browserStorage: "Temporary",
      identity: "none yet",
      runtime: "WP latest / PHP 8.3 / en_US / Network on",
      runtimeShort: "WP latest, PHP 8.3",
      reloadValue: "Apply Settings & Reset",
      path: "/hello-from-playground/"
    }
  },
  blueprints: [
    { title: "Art Gallery", categories: ["Website", "Personal"], detail: "Vueo theme gallery with art content." },
    { title: "Coffee Shop", categories: ["WooCommerce", "Website"], detail: "WooCommerce storefront with custom content." },
    { title: "Feed Reader with the Friends Plugin", categories: ["Content", "Experiments"], detail: "Social web feed reading in Playground." },
    { title: "Gaming News", categories: ["Website", "News"], detail: "Spiel theme news layout." },
    { title: "Non-profit Organization", categories: ["Website"], detail: "Koinonia theme benefit site." },
    { title: "Personal Blog", categories: ["Personal", "Content"], detail: "Substrata theme personal writing site." }
  ],
  blueprintFilter: "All"
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function addHistory(type, text) {
  const list = $("#historyList");
  const item = document.createElement("li");
  item.innerHTML = `<span class="history-type">${type}</span> ${text}`;
  list.prepend(item);
}

function setMutation(title, text) {
  $("#mutationTitle").textContent = title;
  $("#mutationText").textContent = text;
}

function syncActiveSite() {
  const site = state.sites[state.activeSite];
  if (!site) return;

  $("#activeTitle").textContent = site.title;
  $("#activeSubtitle").innerHTML =
    state.activeSite === "research"
      ? `Saved in this browser as <code>${site.identity}</code>.`
      : site.subtitle;
  $("#storageValue").textContent = site.storageLabel;
  $("#runtimeValue").textContent = site.runtimeShort;
  $("#reloadValue").textContent = site.reloadValue;
  $("#pathValue").textContent = site.path;
  $("#pathInput").value = site.path;
  $("#browserPath").textContent = site.path;
  $("#browserTitle").textContent = site.title;
  $("#browserStorage").textContent = site.browserStorage;
  $("#shellStorageBadge").textContent = site.shellBadge;
  $("#runtimeBadge").textContent = site.runtime;
  $("#managerStatus").textContent = state.activeSite === "unsaved" ? "Destructive reset mode" : "Stored reload mode";
  $("#settingsApplyButton").textContent = state.activeSite === "unsaved" ? "Apply Settings & Reset Playground" : "Save & Reload";

  $$(".saved-row").forEach((row) => row.classList.toggle("active", row.dataset.siteId === state.activeSite));

  if (state.activeSite === "unsaved") {
    $("#settingsState").innerHTML =
      "<strong>Unsaved reset warning</strong><span>Applying settings will reset this temporary Playground and discard files, database changes, and preview state.</span>";
    $("#settingsState").classList.add("notice", "warning");
  } else if (state.activeSite === "local") {
    $("#settingsState").innerHTML =
      "<strong>Local directory behavior</strong><span>Save & Reload writes settings to the local folder. If permission is lost, reconnect the directory before reload.</span>";
    $("#settingsState").classList.remove("warning");
  } else {
    $("#settingsState").innerHTML =
      "<strong>Stored Playground behavior</strong><span>Save & Reload will persist settings and reload the same saved object.</span>";
    $("#settingsState").classList.remove("warning");
  }
}

function showPanel(name) {
  $$(".deck-tabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.panelTarget === name);
  });
  $$(".panel").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === name);
  });
}

function showManagerTab(name) {
  $$(".manager-tabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.managerTab === name);
  });
  $$(".manager-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.managerPanel === name);
  });
  const titles = {
    settings: "Settings",
    files: "Files",
    blueprint: "Blueprint",
    database: "Database",
    logs: "Logs"
  };
  $("#managerTitle").textContent = titles[name] || "Site Manager";
}

function runMeter({ meter, title, count, steps, done }) {
  let index = 0;
  meter.style.width = "0%";
  title.textContent = steps[0].title;
  count.textContent = steps[0].count;

  const tick = () => {
    const step = steps[index];
    meter.style.width = step.width;
    title.textContent = step.title;
    count.textContent = step.count;
    index += 1;
    if (index < steps.length) {
      window.setTimeout(tick, 430);
    } else if (done) {
      window.setTimeout(done, 180);
    }
  };
  window.setTimeout(tick, 120);
}

function setSaveDestination(destination) {
  state.saveDestination = destination;
  $$("[data-destination-card]").forEach((card) => {
    card.classList.toggle("selected", card.dataset.destinationCard === destination);
  });

  if (destination === "local") {
    $("#permissionTitle").textContent = "Folder picker required";
    $("#permissionText").textContent =
      "Selected folder: ~/Sites/playground-research. Reloading later may require reconnecting permission.";
    $("#saveProgressCount").textContent = "Folder permission pending";
  } else {
    $("#permissionTitle").textContent = "Browser storage ready";
    $("#permissionText").textContent = "Saving will update the existing browser-backed Playground row.";
    $("#saveProgressCount").textContent = "3,751 files queued";
  }
}

function runSaveFlow() {
  const destination = state.saveDestination;
  const name = $("#saveName").value.trim() || "Research Browser Playground";
  $("#saveMeter").style.width = "0%";

  runMeter({
    meter: $("#saveMeter"),
    title: $("#saveProgressTitle"),
    count: $("#saveProgressCount"),
    steps: [
      { width: "22%", title: "Preparing save transfer", count: destination === "local" ? "Folder permission granted" : "Browser storage opened" },
      { width: "56%", title: "Copying WordPress files", count: "2,018 / 3,751 files copied" },
      { width: "86%", title: "Writing database and manifest", count: "3,620 / 3,751 files copied" },
      { width: "100%", title: "Save complete", count: destination === "local" ? "Local directory sync ready" : "Browser slug updated" }
    ],
    done: () => {
      if (destination === "local") {
        state.activeSite = "local";
        state.sites.local.title = name;
        state.sites.local.subtitle = "Folder-backed Playground at ~/Sites/playground-research.";
        state.sites.local.path = $("#pathInput").value;
        setMutation("Local save complete", `${name} now writes to ~/Sites/playground-research and will ask to reconnect if folder permission expires.`);
        addHistory("Save", `${name} saved to local directory with reconnect consequence.`);
      } else {
        state.activeSite = "research";
        state.sites.research.title = name;
        state.sites.research.path = $("#pathInput").value;
        setMutation("Browser save complete", `${name} is saved in this browser with slug research-browser-playground.`);
        addHistory("Save", `${name} saved in browser storage after copying 3,751 files.`);
      }
      syncActiveSite();
      showPanel("history");
    }
  });
}

function runSettingsFlow() {
  const { wp, php, lang, network, multisite } = getSettingsValues();

  if (state.activeSite === "unsaved") {
    openConfirm({
      title: "Reset unsaved Playground?",
      text: "Applying these settings will reset the temporary site and discard its files, database, and preview state.",
      button: "Reset Playground",
      action: () => applyUnsavedSettingsReset()
    });
    return;
  }

  runReloadProgress("Saving settings before reload", "Stored reload complete", () => {
    const site = state.sites[state.activeSite];
    site.runtime = `WP ${wp} / PHP ${php} / ${lang} / ${network}`;
    site.runtimeShort = `WP ${wp}, PHP ${php}`;
    site.reloadValue = state.activeSite === "local" ? "Save & Reload after reconnect" : "Save & Reload";
    syncActiveSite();
    setPreview("Runtime reloaded", "Settings applied", `${site.title} reloaded in place with WP ${wp}, PHP ${php}, ${lang}, ${network}, ${multisite}.`);
    setMutation("Save & Reload complete", `Stored Playground kept its files and database, then reloaded with WP ${wp}, PHP ${php}, ${lang}, ${network}.`);
    addHistory("Reload", `${site.title} saved settings and reloaded with WP ${wp}, PHP ${php}, ${lang}, ${network}.`);
  });
}

function getSettingsValues() {
  const wp = $("#wpVersion").value;
  const php = $("#phpVersion").value;
  const lang =
    $("#languageSelect").value === "Polish"
      ? "pl_PL"
      : $("#languageSelect").value === "Spanish"
        ? "es_ES"
        : $("#languageSelect").value === "German"
          ? "de_DE"
          : "en_US";
  const network = $("#networkAccess").checked ? "Network on" : "Network off";
  const multisite = $("#multisite").checked ? "Multisite on" : "Single site";
  return { wp, php, lang, network, multisite };
}

function applyUnsavedSettingsReset() {
  const { wp, php, lang, network, multisite } = getSettingsValues();
  closeConfirm();
  runReloadProgress("Resetting temporary Playground", "Temporary reset complete", () => {
    state.sites.unsaved.runtime = `WP ${wp} / PHP ${php} / ${lang} / ${network}`;
    state.sites.unsaved.runtimeShort = `WP ${wp}, PHP ${php}`;
    state.sites.unsaved.path = "/hello-from-playground/";
    syncActiveSite();
    setPreview("Fresh unsaved Playground", "Reset preview", "Settings reset this temporary Playground. Files and database returned to a fresh WordPress install.");
    setMutation("Temporary reset complete", `Unsaved Playground now runs WP ${wp}, PHP ${php}, ${lang}, ${network}, ${multisite}.`);
    addHistory("Reset", `Unsaved Playground reset with WP ${wp}, PHP ${php}, ${lang}, ${network}.`);
  });
}

function runReloadProgress(firstTitle, finalTitle, done) {
  runMeter({
    meter: $("#reloadMeter"),
    title: $("#reloadProgressTitle"),
    count: $("#reloadProgressCount"),
    steps: [
      { width: "20%", title: firstTitle, count: "Persisting runtime options" },
      { width: "48%", title: "Preparing WordPress runtime", count: "Mounting files and database" },
      { width: "76%", title: "Reloading active shell", count: "Restoring path and admin login" },
      { width: "100%", title: finalTitle, count: "Runtime badge updated" }
    ],
    done
  });
}

function openConfirm({ title, text, button, action }) {
  state.pendingConfirm = action;
  $("#confirmBox").hidden = false;
  $("#confirmTitle").textContent = title;
  $("#confirmText").textContent = text;
  $("#confirmActionButton").textContent = button;
  setMutation(title, text);
}

function closeConfirm() {
  state.pendingConfirm = null;
  $("#confirmBox").hidden = true;
}

function deleteSite(siteId) {
  const site = state.sites[siteId];
  if (!site || siteId === "unsaved") return;
  openConfirm({
    title: `Delete ${site.title}?`,
    text: "This removes the saved Playground row from this browser. The active shell will fall back to an Unsaved Playground.",
    button: "Delete Playground",
    action: () => {
      const row = $(`[data-site-id="${siteId}"]`);
      if (row) {
        row.style.opacity = "0.45";
        row.querySelector("strong").textContent = `${site.title} deleting...`;
      }
      setMutation("Deleting Playground", "Removing browser metadata and saved row.");
      window.setTimeout(() => {
        if (row) row.remove();
        addHistory("Delete", `${site.title} deleted. Active shell fell back to Unsaved Playground.`);
        delete state.sites[siteId];
        state.activeSite = "unsaved";
        syncActiveSite();
        setPreview("Unsaved fallback loaded", "Fallback preview", "The deleted saved site was removed. Playground opened a temporary fallback session.");
        setMutation("Delete complete", "Saved row removed. Active Playground is now unsaved and will be lost on refresh unless saved again.");
        closeConfirm();
      }, 650);
    }
  });
}

function renameSite(siteId) {
  const site = state.sites[siteId];
  if (!site) return;
  const next = site.title === "Research Browser Playground" ? "Research Browser Playground Renamed" : `${site.title} Renamed`;
  site.title = next;
  const row = $(`[data-site-id="${siteId}"] strong`);
  if (row) row.textContent = next;
  if (state.activeSite === siteId) syncActiveSite();
  addHistory("Rename", `${next} renamed from the saved management row.`);
  setMutation("Rename complete", `${next} is now the active saved Playground name.`);
}

function openSite(siteId) {
  if (!state.sites[siteId]) return;
  state.activeSite = siteId;
  syncActiveSite();
  setPreview("Site opened", state.sites[siteId].title, `Opened ${state.sites[siteId].title} without hiding the live WordPress shell.`);
  addHistory("Open", `${state.sites[siteId].title} opened from Saved Playgrounds.`);
}

function setPreview(label, headline, copy) {
  $("#previewLabel").textContent = label;
  $("#previewHeadline").innerHTML = `${headline} <span>WordPress</span>`;
  $("#previewCopy").textContent = copy;
}

function runPortableTransfer(kind) {
  const labels = {
    "github-export": ["Export to GitHub", "GitHub connected. Repository wordpress/playground-export selected. Pushed wp-content and Blueprint metadata."],
    "zip-download": ["Download as .zip", "playground-export.zip generated with WordPress files and SQLite database."],
    "database-download": ["Database download", "database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite."],
    "blueprint-download": ["Blueprint bundle", "Blueprint bundle downloaded with blueprint.json and referenced assets."],
    "blueprint-copy": ["Blueprint URL copied", "Blueprint URL copied to clipboard result state."],
    "blueprint-run": ["Blueprint run prepared", "Validation passed. Confirm replacement to run Blueprint against current files and database."]
  };
  const [title, text] = labels[kind] || ["Transfer complete", "Transfer completed."];

  if (kind === "blueprint-run") {
    openConfirm({
      title: "Run Blueprint and replace current content?",
      text: "Running this Blueprint may replace files, database content, and the current preview state.",
      button: "Run Blueprint",
      action: () => {
        closeConfirm();
        $("#databaseSize").textContent = "628 KB";
        setPreview("Blueprint result", "Coffee Shop", "The Coffee Shop Blueprint ran successfully and updated the active preview, database size, and transfer history.");
        setMutation("Blueprint run complete", "Coffee Shop Blueprint replaced the active site content and updated the database to 628 KB.");
        addHistory("Blueprint", "Coffee Shop Blueprint validated, ran, and updated preview plus database size.");
      }
    });
    return;
  }

  $("#portableResult").innerHTML = `<strong>${title}</strong><span>${text}</span>`;
  setMutation(title, text);
  addHistory("Transfer", text);
}

function runLaunch(route) {
  const labels = {
    vanilla: ["Vanilla WordPress", "Fresh WordPress started as an unsaved temporary Playground."],
    "wordpress-pr": ["WordPress PR preview", "WordPress core PR validated and preview runtime started."],
    gutenberg: ["Gutenberg branch preview", "Gutenberg branch try/data-view-row-actions built and loaded."],
    "github-import": ["GitHub import", "GitHub account connected. Token will not be stored after refresh."]
  };
  const [title, text] = labels[route] || ["Launch route", "Route selected."];

  if (route === "vanilla") {
    state.activeSite = "unsaved";
    state.sites.unsaved.title = "Unsaved Vanilla WordPress";
    syncActiveSite();
  }
  setPreview("Launch result", title, text);
  setMutation(title, text);
  addHistory("Launch", text);
}

function runZipImport() {
  openConfirm({
    title: "Import selected .zip archive?",
    text: "playground-export.zip passed validation. Importing it will replace current files and database.",
    button: "Import .zip",
    action: () => {
      closeConfirm();
      state.activeSite = "unsaved";
      state.sites.unsaved.title = "Imported ZIP Playground";
      state.sites.unsaved.path = "/wp-admin/";
      syncActiveSite();
      $("#databaseSize").textContent = "704 KB";
      setPreview("ZIP import result", "Imported ZIP", "The selected archive replaced files and database. The imported Playground is temporary until saved.");
      setMutation("ZIP import complete", "playground-export.zip replaced the active site and updated the path to /wp-admin/.");
      addHistory("Import", "playground-export.zip imported after replacement warning.");
    }
  });
}

function renderBlueprints() {
  const query = $("#blueprintSearch").value.trim().toLowerCase();
  const list = $("#blueprintList");
  list.innerHTML = "";
  state.blueprints
    .filter((item) => state.blueprintFilter === "All" || item.categories.includes(state.blueprintFilter))
    .filter((item) => !query || item.title.toLowerCase().includes(query) || item.detail.toLowerCase().includes(query))
    .forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `blueprint-item${item.title === $("#selectedBlueprintName").textContent ? " active" : ""}`;
      button.innerHTML = `<strong>${item.title}</strong><span>${item.categories.join(" / ")}</span><span>${item.detail}</span>`;
      button.addEventListener("click", () => {
        $("#selectedBlueprintName").textContent = item.title;
        $("#blueprintValidation").textContent = "Needs validation";
        $("#blueprintValidation").className = "badge warning";
        $("#blueprintJson").textContent = `{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "meta": { "title": "${item.title}", "categories": ${JSON.stringify(item.categories)} },
  "landingPage": "/",
  "steps": [
    { "step": "setSiteOptions", "options": { "blogname": "${item.title}" } }
  ]
}`;
        renderBlueprints();
        setMutation("Blueprint selected", `${item.title} selected from a representative subset of the 43 available Blueprints.`);
      });
      list.append(button);
    });
}

function init() {
  $$(".deck-tabs button").forEach((button) => {
    button.addEventListener("click", () => showPanel(button.dataset.panelTarget));
  });

  $$("[data-panel-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      showPanel(button.dataset.panelJump);
      if (button.dataset.managerJump) showManagerTab(button.dataset.managerJump);
    });
  });

  $$("[data-manager-tab]").forEach((button) => {
    button.addEventListener("click", () => showManagerTab(button.dataset.managerTab));
  });

  $$("[data-save-destination]").forEach((button) => {
    button.addEventListener("click", () => setSaveDestination(button.dataset.saveDestination));
  });

  $("#runSaveButton").addEventListener("click", runSaveFlow);
  $("#cancelSaveButton").addEventListener("click", () => {
    $("#saveMeter").style.width = "0%";
    $("#saveProgressTitle").textContent = "Save canceled";
    $("#saveProgressCount").textContent = "No files copied";
    addHistory("Cancel", "Save destination selection canceled before file copy.");
  });

  $("#settingsApplyButton").addEventListener("click", runSettingsFlow);
  $("#temporaryResetButton").addEventListener("click", () => {
    state.activeSite = "unsaved";
    syncActiveSite();
    openConfirm({
      title: "Unsaved reset warning",
      text: "This temporary Playground will be reset if settings are applied. Save it first to avoid losing files and database changes.",
      button: "Apply Settings & Reset",
      action: applyUnsavedSettingsReset
    });
  });

  $("#cancelConfirmButton").addEventListener("click", () => {
    addHistory("Cancel", `${$("#confirmTitle").textContent} canceled.`);
    setMutation("Action canceled", "The active Playground object was not changed.");
    closeConfirm();
  });

  $("#confirmActionButton").addEventListener("click", () => {
    if (state.pendingConfirm) state.pendingConfirm();
  });

  $("#pathInput").addEventListener("change", () => {
    const path = $("#pathInput").value || "/";
    if (state.sites[state.activeSite]) state.sites[state.activeSite].path = path;
    syncActiveSite();
    setPreview("Path navigated", path, `The protected shell navigated the active WordPress iframe to ${path}.`);
    addHistory("Path", `Active shell navigated to ${path}.`);
  });

  $("#homeButton").addEventListener("click", () => {
    $("#pathInput").value = "/hello-from-playground/";
    $("#pathInput").dispatchEvent(new Event("change"));
  });

  $("#adminButton").addEventListener("click", () => {
    $("#pathInput").value = "/wp-admin/";
    $("#pathInput").dispatchEvent(new Event("change"));
  });

  $("#refreshButton").addEventListener("click", () => {
    setMutation("Preview refreshed", `${state.sites[state.activeSite].title} refreshed at ${$("#pathInput").value}.`);
    addHistory("Refresh", `Active WordPress iframe refreshed at ${$("#pathInput").value}.`);
  });

  $$("[data-open-site]").forEach((button) => button.addEventListener("click", () => openSite(button.dataset.openSite)));
  $$("[data-rename-site]").forEach((button) => button.addEventListener("click", () => renameSite(button.dataset.renameSite)));
  $$("[data-delete-site]").forEach((button) => button.addEventListener("click", () => deleteSite(button.dataset.deleteSite)));
  $$("[data-transfer]").forEach((button) => button.addEventListener("click", () => runPortableTransfer(button.dataset.transfer)));
  $$("[data-launch]").forEach((button) => button.addEventListener("click", () => runLaunch(button.dataset.launch)));

  $("#zipImportButton").addEventListener("click", runZipImport);

  $("#newFileButton").addEventListener("click", () => {
    $("#fileName").textContent = "wp-content/mu-plugins/playground-note.php";
    $("#fileDirty").textContent = "New file";
    $("#fileDirty").className = "badge warning";
    $("#fileCode").textContent = "<?php\n/** Playground note created from the file browser. */\nadd_action( 'init', function () {\n    error_log( 'Playground file browser created this file.' );\n} );";
    setMutation("New file staged", "A new mu-plugin file is staged in the file browser and needs saving.");
  });

  $("#newFolderButton").addEventListener("click", () => {
    addHistory("Files", "New folder /wordpress/wp-content/playground-assets created.");
    setMutation("Folder created", "/wordpress/wp-content/playground-assets is visible in the file browser result state.");
  });

  $("#uploadFilesButton").addEventListener("click", () => {
    addHistory("Files", "Uploaded demo-plugin.php into /wordpress/wp-content/plugins.");
    setMutation("Upload complete", "demo-plugin.php uploaded through Browse files and added to wp-content/plugins.");
  });

  $("#browseFilesButton").addEventListener("click", () => {
    setMutation("Browse files", "Native file picker opened for WordPress file upload.");
    addHistory("Files", "Browse files triggered a native file selection flow.");
  });

  $("#editFileButton").addEventListener("click", () => {
    $("#fileDirty").textContent = "Dirty";
    $("#fileDirty").className = "badge warning";
    $("#fileCode").textContent += "\ndefine( 'WP_DEBUG_DISPLAY', false );";
    setMutation("File edited", "wp-config.php has unsaved edits. Save file to update the active Playground files.");
  });

  $("#saveFileButton").addEventListener("click", () => {
    $("#fileDirty").textContent = "Saved";
    $("#fileDirty").className = "badge saved";
    setMutation("File saved", `${$("#fileName").textContent} saved to the active WordPress filesystem.`);
    addHistory("Files", `${$("#fileName").textContent} saved from Site Manager.`);
  });

  $("#validateBlueprintButton").addEventListener("click", () => {
    $("#blueprintValidation").textContent = "Valid JSON";
    $("#blueprintValidation").className = "badge saved";
    setMutation("Blueprint validated", `${$("#selectedBlueprintName").textContent} Blueprint JSON passed schema validation.`);
    addHistory("Blueprint", `${$("#selectedBlueprintName").textContent} JSON validated.`);
  });

  $("#runBlueprintButton").addEventListener("click", () => runPortableTransfer("blueprint-run"));
  $("#confirmBlueprintRunButton").addEventListener("click", () => runPortableTransfer("blueprint-run"));
  $("#copyBlueprintButton").addEventListener("click", () => runPortableTransfer("blueprint-copy"));
  $("#downloadBlueprintButton").addEventListener("click", () => runPortableTransfer("blueprint-download"));
  $("#adminerButton").addEventListener("click", () => {
    setMutation("Adminer opened", "Adminer launched in a new Playground tool window for the SQLite-backed database.");
    addHistory("Database", "Adminer opened for SQLite-backed database inspection.");
  });
  $("#phpmyadminButton").addEventListener("click", () => {
    setMutation("phpMyAdmin opened", "phpMyAdmin launched for database inspection.");
    addHistory("Database", "phpMyAdmin opened from Site Manager.");
  });
  $("#clearLogsButton").addEventListener("click", () => {
    $(".log-warning").textContent = "Resolved: network access notice acknowledged.";
    setMutation("Logs updated", "WordPress warning marked resolved while Playground and PHP logs remain healthy.");
    addHistory("Logs", "Network access notice resolved.");
  });

  $("#blueprintSearch").addEventListener("input", renderBlueprints);
  $$("#blueprintFilters button").forEach((button) => {
    button.addEventListener("click", () => {
      state.blueprintFilter = button.dataset.filter;
      $$("#blueprintFilters button").forEach((filter) => filter.classList.toggle("active", filter === button));
      renderBlueprints();
    });
  });

  syncActiveSite();
  renderBlueprints();
}

init();
