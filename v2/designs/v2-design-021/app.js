const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const blueprints = [
  {
    name: "Feed Reader with the Friends Plugin",
    category: "Featured",
    tags: ["rss", "social web", "Content"],
    url: "https://playground.wordpress.net/blueprints/feed-reader.json",
    description: "Read feeds from the web in Playground using the Friends plugin.",
    title: "Feed Reader Lab",
    path: "/wp-admin/admin.php?page=friends",
    code: `{\\n  "$schema": "https://playground.wordpress.net/blueprint-schema.json",\\n  "landingPage": "/wp-admin/admin.php?page=friends",\\n  "preferredVersions": { "php": "8.3", "wp": "latest" },\\n  "steps": [\\n    { "step": "installPlugin", "pluginZipFile": "friends.zip" },\\n    { "step": "runPHP", "code": "<?php update_option('blogname','Feed Reader Lab');" }\\n  ]\\n}`
  },
  {
    name: "Art Gallery",
    category: "Website",
    tags: ["Website", "Personal", "Themes"],
    url: "https://playground.wordpress.net/blueprints/art-gallery.json",
    description: "An art gallery created with the Vueo theme.",
    title: "Art Gallery",
    path: "/",
    code: `{\\n  "$schema": "https://playground.wordpress.net/blueprint-schema.json",\\n  "landingPage": "/",\\n  "steps": [\\n    { "step": "installTheme", "themeZipFile": "vueo.zip" },\\n    { "step": "runPHP", "code": "<?php update_option('blogname','Art Gallery');" }\\n  ]\\n}`
  },
  {
    name: "Coffee Shop",
    category: "WooCommerce",
    tags: ["WooCommerce", "Store"],
    url: "https://playground.wordpress.net/blueprints/coffee-shop.json",
    description: "A stylish WooCommerce coffee shop storefront with custom theme, products, and content.",
    title: "Coffee Shop",
    path: "/shop/",
    code: `{\\n  "$schema": "https://playground.wordpress.net/blueprint-schema.json",\\n  "landingPage": "/shop/",\\n  "steps": [\\n    { "step": "installPlugin", "pluginZipFile": "woocommerce.zip" },\\n    { "step": "runPHP", "code": "<?php update_option('blogname','Coffee Shop');" }\\n  ]\\n}`
  },
  {
    name: "Gaming News",
    category: "News",
    tags: ["Website", "News"],
    url: "https://playground.wordpress.net/blueprints/gaming-news.json",
    description: "A gaming news site created with the Spiel theme.",
    title: "Gaming News",
    path: "/category/news/",
    code: `{\\n  "$schema": "https://playground.wordpress.net/blueprint-schema.json",\\n  "landingPage": "/category/news/",\\n  "steps": [\\n    { "step": "installTheme", "themeZipFile": "spiel.zip" },\\n    { "step": "runPHP", "code": "<?php update_option('blogname','Gaming News');" }\\n  ]\\n}`
  },
  {
    name: "Non-profit Organization",
    category: "Website",
    tags: ["Website", "Organization"],
    url: "https://playground.wordpress.net/blueprints/non-profit.json",
    description: "A non-profit organization site created with the Koinonia theme.",
    title: "Non-profit Organization",
    path: "/donate/",
    code: `{\\n  "$schema": "https://playground.wordpress.net/blueprint-schema.json",\\n  "landingPage": "/donate/",\\n  "steps": [\\n    { "step": "installTheme", "themeZipFile": "koinonia.zip" },\\n    { "step": "runPHP", "code": "<?php update_option('blogname','Non-profit Organization');" }\\n  ]\\n}`
  },
  {
    name: "Personal Blog",
    category: "Personal",
    tags: ["Website", "Personal", "Blog", "Themes"],
    url: "https://playground.wordpress.net/blueprints/personal-blog.json",
    description: "A personal blog created with the Substrata theme.",
    title: "Personal Blog",
    path: "/",
    code: `{\\n  "$schema": "https://playground.wordpress.net/blueprint-schema.json",\\n  "landingPage": "/",\\n  "steps": [\\n    { "step": "installTheme", "themeZipFile": "substrata.zip" },\\n    { "step": "runPHP", "code": "<?php update_option('blogname','Personal Blog');" }\\n  ]\\n}`
  }
];

const state = {
  panel: "blueprint",
  category: "All",
  selectedBlueprint: blueprints[0],
  blueprintValidated: false,
  storage: "temporary",
  activeTitle: "Unsaved Playground",
  activePath: "/hello-from-playground/",
  selectedDelete: null
};

function setText(selector, text) {
  const node = $(selector);
  if (node) node.textContent = text;
}

function addHistory(title, detail) {
  const li = document.createElement("li");
  li.innerHTML = `<strong>${title}</strong><span>${detail}</span>`;
  $("#historyList").prepend(li);
  setText("#transferState", "Updated");
  setText("#lastResult", title);
  setText("#lastResultDetail", detail);
}

function jump(panel) {
  state.panel = panel;
  $$(".command-tile").forEach((button) => {
    button.classList.toggle("active", button.dataset.panel === panel);
  });
  $$(".panel").forEach((panelNode) => {
    panelNode.classList.toggle("active", panelNode.id === `panel-${panel}`);
  });
  const labels = {
    blueprint: "Blueprint lane ready",
    settings: "Runtime settings selected",
    save: "Save destination selected",
    launch: "Create route selected",
    manager: "Site Manager selected",
    library: "Saved Playgrounds selected",
    transfers: "Portability selected"
  };
  setText("#deckResult", labels[panel] || "Command selected");
}

function setPath(path) {
  state.activePath = path;
  $("#pathInput").value = path;
  setText("#previewPath", path);
  setText("#browserPath", `playground.wordpress.net${path}`);
  setText("#lastResult", "Path changed");
  setText("#lastResultDetail", `Preview navigated to ${path}.`);
  if (path.includes("wp-admin")) {
    setText("#previewKicker", "WP Admin route");
    setText("#previewHeadline", "WordPress Admin Dashboard");
    setText("#previewText", "Dashboard, Site Editor, plugins, users, and settings stay inside the protected Playground shell.");
    setText("#previewMarker", "Admin route loaded. File and Blueprint commands still target this same Playground.");
  } else {
    setText("#previewKicker", "Current WordPress page");
  }
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function setStorage(storage, name, detail) {
  state.storage = storage;
  state.activeTitle = name;
  setText("#activeTitle", name);
  setText("#activeSubtitle", detail);
  setText("#shellStorage", storage === "local" ? "Local directory" : storage === "browser" ? "Saved Playground" : "Unsaved Playground");
  setText("#storageSummary", storage === "local" ? "Local directory" : storage === "browser" ? "Browser storage" : "Temporary memory");
  setText("#storageDetail", detail);
  setText("#resetMode", storage === "temporary" ? "Settings reset this temporary site" : "Settings use Save & Reload");
  $("#shellStorage").className = storage === "temporary" ? "status warning" : "status success";
  $("#resetMode").className = storage === "temporary" ? "status warning" : "status success";
}

function renderBlueprintList() {
  const query = $("#blueprintSearch").value.trim().toLowerCase();
  const filtered = blueprints.filter((bp) => {
    const categoryMatch = state.category === "All" || bp.category === state.category || bp.tags.includes(state.category);
    const haystack = `${bp.name} ${bp.description} ${bp.tags.join(" ")}`.toLowerCase();
    return categoryMatch && (!query || haystack.includes(query));
  });

  $("#blueprintList").innerHTML = "";
  filtered.forEach((bp) => {
    const button = document.createElement("button");
    button.className = `blueprint-item${bp.name === state.selectedBlueprint.name ? " active" : ""}`;
    button.type = "button";
    button.innerHTML = `<strong>${bp.name}</strong><span>${bp.tags.join(" / ")}</span>`;
    button.addEventListener("click", () => selectBlueprint(bp));
    $("#blueprintList").append(button);
  });

  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "result";
    empty.textContent = "No representative Blueprint entries match this filter. The full current product gallery contains 43 entries.";
    $("#blueprintList").append(empty);
  }
}

function selectBlueprint(bp) {
  state.selectedBlueprint = bp;
  state.blueprintValidated = false;
  setText("#selectedBlueprintName", bp.name);
  setText("#selectedBlueprintDesc", bp.description);
  $("#blueprintUrl").value = bp.url;
  $("#selectedBlueprintTags").innerHTML = bp.tags.map((tag) => `<span>${tag}</span>`).join("");
  $("#blueprintCode code").textContent = bp.code.replaceAll("\\n", "\n");
  setText("#blueprintEditorState", "Clean. JSON has not been validated in this run.");
  setText("#blueprintValidation", "Not validated");
  $("#blueprintValidation").className = "status warning";
  $("#replaceWarning").hidden = true;
  $("#blueprintProgress").hidden = true;
  setText("#blueprintResult", `${bp.name} selected. Inspect JSON, validate, then confirm replacement before running.`);
  setText("#tileBlueprint", "Selected: " + bp.name);
  renderBlueprintList();
}

function runProgress(card, titleSelector, textSelector, steps, done) {
  card.hidden = false;
  const meter = $(".meter span", card);
  meter.style.width = "0%";
  let index = 0;
  function tick() {
    const step = steps[index];
    setText(titleSelector, step.title);
    setText(textSelector, step.text);
    meter.style.width = step.width;
    index += 1;
    if (index < steps.length) {
      window.setTimeout(tick, 420);
    } else {
      window.setTimeout(done, 260);
    }
  }
  tick();
}

function validateBlueprint() {
  state.blueprintValidated = true;
  setText("#blueprintValidation", "Valid JSON");
  $("#blueprintValidation").className = "status success";
  setText("#blueprintEditorState", "Valid JSON. Replacement confirmation required before running.");
  setText("#blueprintResult", `${state.selectedBlueprint.name} JSON passed schema checks. Confirm replacement to run over the current Playground.`);
  $("#replaceWarning").hidden = false;
  addHistory("Blueprint validated", `${state.selectedBlueprint.name} passed JSON validation.`);
}

function completeBlueprintRun() {
  const bp = state.selectedBlueprint;
  $("#replaceWarning").hidden = true;
  runProgress(
    $("#blueprintProgress"),
    "#blueprintProgressTitle",
    "#blueprintProgressText",
    [
      { title: "Running Blueprint", text: "Replacing current content and preparing PHP runtime", width: "25%" },
      { title: "Applying steps", text: "Installing theme or plugin assets", width: "58%" },
      { title: "Updating database", text: "Writing posts, options, and landing page", width: "82%" },
      { title: "Preview ready", text: "Reloading protected WordPress shell", width: "100%" }
    ],
    () => {
      state.activeTitle = `${bp.title} Blueprint`;
      setText("#activeTitle", state.activeTitle);
      setText("#wpSiteTitle", bp.title);
      setPath(bp.path);
      setText("#previewKicker", "Blueprint result");
      setText("#previewHeadline", bp.title);
      setText("#previewText", `${bp.description} The Blueprint has replaced the previous temporary content and updated the live preview.`);
      setText("#previewMarker", "Blueprint run completed. Save or export this result to keep it.");
      setText("#blueprintResult", `${bp.name} ran successfully. Active preview, path, database size, transfer history, and title now reflect the Blueprint result.`);
      setText("#deckResult", "Blueprint run completed");
      setText("#tileBlueprint", "Run complete");
      setText("#dbSize", "518 KB");
      addHistory("Blueprint run completed", `${bp.name} replaced current content and opened ${bp.path}.`);
    }
  );
}

function saveCurrent() {
  const destination = $("input[name='saveDestination']:checked").value;
  const name = $("#saveName").value.trim() || "Saved Playground";
  const card = $("#saveProgress");
  const destinationText = destination === "local" ? "Writing to ~/Sites/playground-labs/research-browser" : "Copying to browser storage";
  setText("#saveState", "Saving");
  runProgress(
    card,
    "#saveProgressTitle",
    "#saveProgressText",
    [
      { title: "Saving 614 / 3751 files", text: destinationText, width: "18%" },
      { title: "Saving 1998 / 3751 files", text: "Copying wp-content, database, and Blueprint bundle", width: "52%" },
      { title: "Saving 3751 / 3751 files", text: "Writing saved identity and reload policy", width: "100%" }
    ],
    () => {
      if (destination === "local") {
        setStorage("local", name, "Folder-backed Playground: ~/Sites/playground-labs/research-browser. Reconnect permission may be required after reload.");
        setText("#saveResult", "Local directory save completed. The shell now shows a local badge and stored Playgrounds use Save & Reload instead of destructive reset.");
      } else {
        const slug = slugify(name);
        setStorage("browser", name, `Browser-backed saved Playground. Slug: ${slug}.`);
        setText("#saveResult", "Browser save completed. The temporary row has become a saved Playground row with a slug URL.");
      }
      setText("#saveState", "Saved");
      $("#saveState").className = "status success";
      setText("#tileSave", "Saved");
      upsertSavedRow(name, destination);
      addHistory("Save completed", `${name} saved to ${destination === "local" ? "local directory" : "browser storage"}.`);
    }
  );
}

function upsertSavedRow(name, destination) {
  const existing = $("[data-row='active-saved']");
  if (existing) existing.remove();
  const row = document.createElement("article");
  row.className = "saved-row active";
  row.dataset.row = "active-saved";
  row.innerHTML = `
    <div>
      <strong>${name}</strong>
      <span>${destination === "local" ? "Local directory, reconnect after permission loss" : "Saved in browser, slug " + slugify(name)}</span>
    </div>
    <div class="row-actions">
      <button type="button" data-open="active-saved">Open</button>
      <button type="button" data-rename="active-saved">Rename</button>
      <button type="button" data-delete="active-saved">Delete</button>
    </div>`;
  $$(".saved-row").forEach((item) => item.classList.remove("active"));
  $("#savedList").prepend(row);
  setText("#tileLibrary", `${$$(".saved-row").length} rows`);
}

function applySettings(reset) {
  const wp = $("#wpVersion").value;
  const php = $("#phpVersion").value;
  const language = $("#language").value;
  const network = $("#networkAccess").checked ? "Network on" : "Network off";
  const multisite = $("#multisite").checked ? "Multisite" : "Single site";
  if (reset && state.storage === "temporary") {
    runProgress(
      $("#reloadProgress"),
      "#reloadProgressTitle",
      "#reloadProgressText",
      [
        { title: "Resetting temporary Playground", text: "Discarding current files and database", width: "30%" },
        { title: "Booting new runtime", text: `WordPress ${wp}, PHP ${php}`, width: "72%" },
        { title: "Reset complete", text: "Fresh site loaded at homepage", width: "100%" }
      ],
      () => {
        setText("#settingsResult", `Temporary reset completed. Runtime badge is now WordPress ${wp} / PHP ${php} / ${network} / ${multisite}.`);
        setText("#shellRuntime", `WP ${wp} / PHP ${php} / ${network}`);
        setText("#runtimeSummary", `WordPress ${wp} / PHP ${php}`);
        setText("#runtimeDetail", `${language}, ${network}, ${multisite}.`);
        setText("#previewMarker", "Settings reset completed. This remains an unsaved temporary Playground.");
        addHistory("Settings reset completed", `Temporary Playground reset to WordPress ${wp}, PHP ${php}.`);
      }
    );
    return;
  }

  runProgress(
    $("#reloadProgress"),
    "#reloadProgressTitle",
    "#reloadProgressText",
    [
      { title: "Saving settings", text: "Stored Playground keeps identity while runtime options are updated", width: "35%" },
      { title: "Reloading stored Playground", text: `Applying WordPress ${wp}, PHP ${php}`, width: "70%" },
      { title: "Save & Reload complete", text: "Preview reloaded with saved identity preserved", width: "100%" }
    ],
    () => {
      setText("#settingsResult", `Save & Reload completed. ${state.activeTitle} kept its saved identity and now runs WordPress ${wp} / PHP ${php}.`);
      setText("#settingsDirty", "Reloaded");
      $("#settingsDirty").className = "status success";
      setText("#shellRuntime", `WP ${wp} / PHP ${php} / ${network}`);
      setText("#runtimeSummary", `WordPress ${wp} / PHP ${php}`);
      setText("#runtimeDetail", `${language}, ${network}, ${multisite}.`);
      setText("#previewMarker", "Stored Playground reloaded without changing saved identity.");
      addHistory("Save & Reload completed", `${state.activeTitle} reloaded with WordPress ${wp}, PHP ${php}.`);
    }
  );
}

function setManagerPane(name) {
  $$(".manager-tabs button").forEach((button) => button.classList.toggle("active", button.dataset.manager === name));
  $$(".manager-pane").forEach((pane) => pane.classList.toggle("active", pane.id === `manager-${name}`));
  setText("#managerState", name === "blueprintTools" ? "Blueprint selected" : name[0].toUpperCase() + name.slice(1) + " selected");
}

function showDelete(row) {
  state.selectedDelete = row;
  $("#deleteBox").hidden = false;
  $("#renameBox").hidden = true;
}

function confirmDelete() {
  const rowName = state.selectedDelete;
  const row = rowName ? $(`[data-row='${rowName}']`) : null;
  if (row && rowName !== "unsaved") row.remove();
  $("#deleteBox").hidden = true;
  setStorage("temporary", "Unsaved Playground", "Temporary fallback selected after delete. Refresh or reset discards files and database unless saved.");
  setPath("/hello-from-playground/");
  setText("#libraryResult", "Saved row deleted. Active shell fell back to the unsaved Playground and the saved list updated.");
  setText("#tileLibrary", `${$$(".saved-row").length} rows`);
  addHistory("Saved Playground deleted", "Browser-backed saved copy removed and temporary fallback selected.");
}

function wireEvents() {
  $$(".command-tile").forEach((button) => button.addEventListener("click", () => jump(button.dataset.panel)));
  $$("[data-jump]").forEach((button) => button.addEventListener("click", () => jump(button.dataset.jump)));
  $$("[data-path]").forEach((button) => button.addEventListener("click", () => setPath(button.dataset.path)));
  $("#pathInput").addEventListener("change", (event) => setPath(event.target.value || "/"));
  $("#refreshButton").addEventListener("click", () => {
    setText("#browserActivity", "Refreshed");
    addHistory("Preview refreshed", `${state.activePath} reloaded in the protected shell.`);
  });

  $$(".filter-row button").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".filter-row button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.category = button.dataset.category;
      renderBlueprintList();
    });
  });
  $("#blueprintSearch").addEventListener("input", renderBlueprintList);
  $("#markBlueprintDirty").addEventListener("click", () => {
    state.blueprintValidated = false;
    setText("#blueprintEditorState", "Dirty. Validate JSON again before running.");
    setText("#blueprintValidation", "Dirty");
    $("#blueprintValidation").className = "status warning";
  });
  $("#copyBlueprint").addEventListener("click", () => {
    setText("#blueprintResult", "Blueprint link copied to clipboard state. Transfer history recorded the copy action.");
    addHistory("Blueprint link copied", `${state.selectedBlueprint.name} share URL copied.`);
  });
  $("#downloadBlueprint").addEventListener("click", () => {
    setText("#blueprintResult", "Blueprint bundle download prepared.");
    addHistory("Blueprint bundle downloaded", `${state.selectedBlueprint.name} bundle generated.`);
  });
  $("#validateBlueprint").addEventListener("click", validateBlueprint);
  $("#cancelBlueprint").addEventListener("click", () => {
    $("#replaceWarning").hidden = true;
    setText("#blueprintResult", "Blueprint run cancelled before replacing current content.");
    addHistory("Blueprint run cancelled", `${state.selectedBlueprint.name} did not replace current content.`);
  });
  $("#confirmBlueprint").addEventListener("click", () => {
    if (!state.blueprintValidated) validateBlueprint();
    completeBlueprintRun();
  });

  $$("input[name='saveDestination']").forEach((input) => {
    input.addEventListener("change", () => {
      $$(".destination").forEach((item) => item.classList.toggle("active", $("input", item).checked));
      const local = input.value === "local" && input.checked;
      $("#localBox").hidden = !local;
      setText("#saveResult", local ? "Local directory selected. Folder permission has been granted for this static prototype." : "Browser storage selected. Save will create a slug and browser-backed saved row.");
    });
  });
  $("#startSave").addEventListener("click", saveCurrent);
  $("#cancelSave").addEventListener("click", () => setText("#saveResult", "Save cancelled. The active Playground remains in its current storage state."));

  $$("#wpVersion, #phpVersion, #language, #olderVersions, #networkAccess, #multisite").forEach((control) => {
    control.addEventListener("change", () => {
      setText("#settingsDirty", "Unsaved changes");
      $("#settingsDirty").className = "status warning";
      setText("#settingsConsequenceTitle", state.storage === "temporary" ? "Temporary reset warning" : "Stored reload behavior");
      setText("#settingsConsequenceText", state.storage === "temporary"
        ? "This unsaved Playground will be replaced if settings are applied now. Save first to switch to Save & Reload."
        : "Saved and local Playgrounds keep their identity and reload with limited configuration changes.");
    });
  });
  $("#applyReset").addEventListener("click", () => applySettings(true));
  $("#saveReload").addEventListener("click", () => {
    if (state.storage === "temporary") {
      setStorage("browser", "Research Browser Playground", "Auto-saved before reload. Slug: research-browser-playground.");
      upsertSavedRow("Research Browser Playground", "browser");
      addHistory("Auto-save before reload", "Temporary Playground was saved so settings can use Save & Reload.");
    }
    applySettings(false);
  });

  $("#startVanilla").addEventListener("click", () => {
    setStorage("temporary", "Unsaved Playground", "Fresh Vanilla WordPress runtime. Refresh or reset discards files and database unless saved.");
    setPath("/hello-from-playground/");
    setText("#launchResult", "Vanilla WordPress started. The previous temporary state was replaced after route confirmation.");
    addHistory("Vanilla WordPress started", "Fresh latest WordPress loaded in temporary memory.");
  });
  $("#connectGithub").addEventListener("click", () => {
    setText("#launchResult", "GitHub account connected for this browser session. Token is not stored after refresh; choose a repository to import.");
    addHistory("GitHub connected", "Session-only token ready for import or export.");
  });
  $("#importZip").addEventListener("click", () => {
    setText("#launchResult", "Native .zip chooser opened. Selected archive will be validated and will warn before replacing files and database.");
    addHistory("ZIP chooser opened", "Import route is waiting for a selected Playground archive.");
  });

  $$(".manager-tabs button").forEach((button) => button.addEventListener("click", () => setManagerPane(button.dataset.manager)));
  $("#saveFile").addEventListener("click", () => {
    setText("#fileState", "Saved. wp-config.php changes written.");
    setText("#managerResult", "File saved. Dirty marker cleared and the transfer history records the write.");
    addHistory("File saved", "/wordpress/wp-config.php saved in the active Playground.");
  });
  [
    ["#newFile", "New file created", "/wordpress/wp-content/mu-plugins/playground-note.php"],
    ["#newFolder", "New folder created", "/wordpress/wp-content/uploads/lab"],
    ["#uploadFile", "Upload completed", "theme-preview.png uploaded to wp-content/uploads"],
    ["#browseFiles", "Browse files opened", "File picker opened for WordPress filesystem"]
  ].forEach(([selector, title, detail]) => {
    $(selector).addEventListener("click", () => {
      setText("#managerResult", `${title}: ${detail}.`);
      addHistory(title, detail);
    });
  });
  $("#copyManagerBlueprint").addEventListener("click", () => addHistory("Blueprint link copied", "Current /blueprint.json link copied from Site Manager."));
  $("#downloadManagerBlueprint").addEventListener("click", () => addHistory("Blueprint bundle downloaded", "Current Blueprint bundle downloaded from Site Manager."));
  $("#downloadDb").addEventListener("click", () => addHistory("Database downloaded", "/wordpress/wp-content/database/.ht.sqlite exported as database.sqlite."));
  $("#openAdminer").addEventListener("click", () => addHistory("Adminer opened", "Database opened in Adminer."));
  $("#openPhpMyAdmin").addEventListener("click", () => addHistory("phpMyAdmin opened", "Database opened in phpMyAdmin."));

  $("#savedList").addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.open) {
      $$(".saved-row").forEach((row) => row.classList.remove("active"));
      target.closest(".saved-row").classList.add("active");
      setStorage("browser", "Research Browser Playground", "Browser-backed saved Playground opened from the saved list.");
      setText("#libraryResult", "Saved Playground opened and selected as the active shell object.");
      addHistory("Saved Playground opened", "Research Browser Playground selected from saved list.");
    }
    if (target.dataset.rename) {
      $("#renameBox").hidden = false;
      $("#deleteBox").hidden = true;
      setText("#libraryResult", "Rename form opened for the selected saved Playground.");
    }
    if (target.dataset.delete) showDelete(target.dataset.delete);
  });
  $("#confirmRename").addEventListener("click", () => {
    const name = $("#renameInput").value.trim() || "Renamed Playground";
    const row = $(".saved-row.active strong") || $("[data-row='research'] strong");
    if (row) row.textContent = name;
    setText("#activeTitle", name);
    setText("#libraryResult", `Saved Playground renamed to ${name}. Shell title updated.`);
    $("#renameBox").hidden = true;
    addHistory("Saved Playground renamed", `Active saved row renamed to ${name}.`);
  });
  $("#cancelDelete").addEventListener("click", () => {
    $("#deleteBox").hidden = true;
    setText("#libraryResult", "Delete cancelled. Saved row remains available.");
  });
  $("#confirmDelete").addEventListener("click", confirmDelete);

  $("#githubExport").addEventListener("click", () => addHistory("GitHub export completed", "Connected account pushed active Playground bundle to wordpress/playground-demo."));
  $("#zipDownload").addEventListener("click", () => addHistory("ZIP download completed", "active-playground.zip generated from files and SQLite database."));
  $("#zipImport").addEventListener("click", () => {
    setText("#transferState", "ZIP validation required");
    addHistory("ZIP import selected", "Native chooser selected playground-export.zip; replacement confirmation required before import.");
  });
  $("#databaseDownload").addEventListener("click", () => addHistory("Database downloaded", "database.sqlite downloaded from SQLite-backed WordPress database."));
}

renderBlueprintList();
wireEvents();
