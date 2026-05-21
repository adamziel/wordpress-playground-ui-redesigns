const commands = [
  {
    id: "zip-download",
    group: "Portability",
    title: "Download current Playground as .zip",
    hint: "Generate archive",
    description: "Generate a ZIP archive from the active WordPress files and SQLite database, then record the completed transfer row.",
    fields: [
      ["Archive name", "playground-export-0521.zip"],
      ["Source status", "Current temporary site, 3,751 files, database included"]
    ],
    consequence: "Does not save the Playground. Produces a downloadable package and adds a transfer history row.",
    ready: "Ready to generate a ZIP from the current Playground."
  },
  {
    id: "github-export",
    group: "Portability",
    title: "Export to GitHub",
    hint: "Connect and push",
    description: "Authorize GitHub, choose a repository, export wp-content and Blueprint bundle, then mark the transfer exported.",
    fields: [
      ["Connection", "github.com connected as wp-lab-admin"],
      ["Repository", "github.com/acme/playground-lab"],
      ["Branch", "playground-export"]
    ],
    consequence: "Creates or updates repository files. The access token is not stored after browser refresh.",
    ready: "Ready to export the current Playground to GitHub."
  },
  {
    id: "save-local",
    group: "Save destinations",
    title: "Save to a local directory",
    hint: "Folder picker",
    description: "Use the file system picker, grant folder permission, copy WordPress files, and convert the current row to a local-directory Playground.",
    fields: [
      ["Playground name", "Research Browser Playground"],
      ["Folder", "~/Sites/playground-research-browser"],
      ["Permission", "Folder picker not granted yet"]
    ],
    consequence: "A local folder-backed Playground must reconnect folder permission after permission loss or browser reload.",
    ready: "Ready to open the folder picker for local-directory save."
  },
  {
    id: "save-browser",
    group: "Save destinations",
    title: "Save in this browser",
    hint: "Browser storage",
    description: "Copy the temporary Playground into browser storage, create a saved row, and update the shell slug.",
    fields: [
      ["Playground name", "Research Browser Playground"],
      ["Slug", "research-browser-playground"],
      ["Files", "3,751 WordPress files"]
    ],
    consequence: "Persists in this browser only. The saved Playground appears in Saved Playgrounds and uses Save & Reload.",
    ready: "Ready to save 3,751 files into browser storage."
  },
  {
    id: "zip-import",
    group: "Start and import",
    title: "Import .zip over current",
    hint: "Replacement",
    description: "Open the native file chooser, validate a WordPress ZIP, warn about replacement, and import files plus database.",
    fields: [
      ["Selected file", "portfolio-playground.zip"],
      ["Validation", "WordPress files and database.sqlite found"],
      ["Replacement target", "Current Unsaved Playground"]
    ],
    consequence: "Replaces the current Playground files and database after confirmation. Unsaved changes are discarded.",
    ready: "ZIP selected and validated. Confirmation is required before replacement."
  },
  {
    id: "delete-saved",
    group: "Saved management",
    title: "Delete saved Playground",
    hint: "Confirm delete",
    description: "Confirm deletion of a browser-saved Playground, then transform the row to a final deleted state.",
    fields: [
      ["Target", "Plugin Review Playground"],
      ["Storage", "Browser storage"],
      ["Fallback", "Keep current Unsaved Playground active"]
    ],
    consequence: "Deletes the saved browser copy. The active Playground remains unchanged because this row is not open.",
    ready: "Ready to ask for deletion confirmation."
  },
  {
    id: "rename-saved",
    group: "Saved management",
    title: "Rename saved Playground",
    hint: "Update row",
    description: "Rename the selected saved Playground and keep its storage, slug, and management actions attached to the same row.",
    fields: [
      ["Current name", "Plugin Review Playground"],
      ["New name", "Plugin QA Playground"],
      ["Slug", "plugin-qa-playground"]
    ],
    consequence: "Updates the saved row name and slug. Stored files are not copied.",
    ready: "Ready to rename the saved row."
  },
  {
    id: "vanilla",
    group: "Start and import",
    title: "Vanilla WordPress",
    hint: "Fresh site",
    description: "Start a fresh latest WordPress Playground logged in as admin.",
    fields: [
      ["WordPress", "Latest"],
      ["PHP", "8.3"],
      ["Network access", "Allowed"]
    ],
    consequence: "Starting fresh replaces an unsaved current Playground after confirmation.",
    ready: "Ready to start a fresh WordPress Playground."
  },
  {
    id: "wp-pr",
    group: "Start and import",
    title: "Preview a WordPress PR",
    hint: "PR number or URL",
    description: "Preview a WordPress core pull request by PR number or URL.",
    fields: [
      ["PR number or URL", "https://github.com/WordPress/wordpress-develop/pull/7821"],
      ["Runtime", "WordPress develop build"],
      ["Replacement target", "Current Playground"]
    ],
    consequence: "Builds a new preview and asks before replacing unsaved work.",
    ready: "Ready to preview the WordPress PR."
  },
  {
    id: "gutenberg-pr",
    group: "Start and import",
    title: "Preview a Gutenberg PR or branch",
    hint: "PR, URL, or branch",
    description: "Preview Gutenberg from a PR number, URL, or branch name.",
    fields: [
      ["PR, URL, or branch", "trunk"],
      ["Plugin", "Gutenberg"],
      ["Replacement target", "Current Playground"]
    ],
    consequence: "Creates a Playground with the selected Gutenberg branch active.",
    ready: "Ready to preview Gutenberg."
  },
  {
    id: "github-import",
    group: "Start and import",
    title: "Import from GitHub",
    hint: "Account required",
    description: "Import plugins, themes, or wp-content directories from public GitHub repositories after account connection.",
    fields: [
      ["Connection", "Connect GitHub account"],
      ["Repository", "github.com/wordpress/wordpress-playground"],
      ["Directory", "wp-content"]
    ],
    consequence: "The access token is not stored. Re-authentication is required after refresh.",
    ready: "Ready to connect GitHub for import."
  },
  {
    id: "blueprint-url",
    group: "Blueprints",
    title: "Run Blueprint from URL",
    hint: "Validate URL",
    description: "Fetch a Blueprint URL, validate blueprint.json, and run it after replacement confirmation.",
    fields: [
      ["Blueprint URL", "https://playground.wordpress.net/blueprints/gallery/art-gallery.json"],
      ["Validation", "Schema will be checked before run"],
      ["Landing page", "/hello-from-playground/"]
    ],
    consequence: "A Blueprint run can alter content, plugins, themes, and runtime settings.",
    ready: "Ready to validate the Blueprint URL."
  },
  {
    id: "blueprint-run",
    group: "Blueprints",
    title: "Run selected Blueprint",
    hint: "Replace content",
    description: "Run the selected gallery Blueprint and update the preview to the resulting WordPress site.",
    fields: [
      ["Selected Blueprint", "Art Gallery"],
      ["Gallery size", "43 available, 9 shown in this static slice"],
      ["Validation", "blueprint.json valid"]
    ],
    consequence: "Running a Blueprint replaces content and can install themes, plugins, and settings.",
    ready: "Ready to run the selected Blueprint after confirmation."
  },
  {
    id: "blueprint-gallery",
    group: "Blueprints",
    title: "Open Blueprint gallery",
    hint: "Categories and search",
    description: "Browse Blueprint categories, search entries, select a Blueprint detail, run URL, copy, download, or inspect bundle.",
    fields: [
      ["Categories", "All, Featured, Website, Personal, Content, Themes, Gutenberg, Experiments, WooCommerce, News"],
      ["Visible subset", "9 shown"],
      ["Total", "43 available"]
    ],
    consequence: "Selection only changes the detail until Run Blueprint is confirmed.",
    ready: "Ready to browse the Blueprint gallery."
  },
  {
    id: "database-download",
    group: "Files and database",
    title: "Download database.sqlite",
    hint: "SQLite",
    description: "Download the SQLite-backed database and add a database transfer result.",
    fields: [
      ["Driver", "MySQL emulation backed by SQLite"],
      ["Path", "/wordpress/wp-content/database/.ht.sqlite"],
      ["Size", "452 KB"]
    ],
    consequence: "Downloads database.sqlite without changing the current Playground.",
    ready: "Ready to download database.sqlite."
  },
  {
    id: "file-browser",
    group: "Files and database",
    title: "Open File browser",
    hint: "Editor",
    description: "Open Site Manager files with New File, New Folder, Upload, Browse files, selected file editor, dirty state, and save result.",
    fields: [
      ["Selected file", "/wordpress/wp-config.php"],
      ["Editor state", "Clean"],
      ["Actions", "New File, New Folder, Upload, Browse files"]
    ],
    consequence: "File edits mark the selected file dirty until Save selected file completes.",
    ready: "Ready to manage files."
  },
  {
    id: "site-manager",
    group: "Site Manager",
    title: "Open Site Manager",
    hint: "Settings and tools",
    description: "Open persistent tabs for Settings, Files, Blueprint, Database, Logs, Export to GitHub, and Download as zip.",
    fields: [
      ["Tabs", "Settings, Files, Blueprint, Database, Logs"],
      ["Shortcuts", "Homepage and WP Admin remain available"],
      ["Preview", "Live WordPress shell stays visible"]
    ],
    consequence: "Does not change the Playground until a tab action is run.",
    ready: "Site Manager is available in the dock below the preview."
  },
  {
    id: "settings-reset",
    group: "Site Manager",
    title: "Apply Settings and Reset or Save & Reload",
    hint: "Destructive",
    description: "Apply WordPress/PHP/language/network/multisite settings with destructive reset for temporary sites or Save & Reload for stored sites.",
    fields: [
      ["WordPress Version", "Latest, older versions optional"],
      ["PHP Version", "PHP 8.3"],
      ["Language", "English (United States)"]
    ],
    consequence: "Temporary Playgrounds are reset. Saved and local-directory Playgrounds use Save & Reload.",
    ready: "Ready to confirm settings application."
  },
  {
    id: "logs",
    group: "Site Manager",
    title: "Inspect logs",
    hint: "Playground, WordPress, PHP",
    description: "Inspect Playground, WordPress, and PHP logs with empty and warning states.",
    fields: [
      ["Playground log", "No problems so far"],
      ["WordPress log", "Deprecated notice sample available"],
      ["PHP log", "WP_DEBUG enabled"]
    ],
    consequence: "Logs are read-only and do not change the current Playground.",
    ready: "Ready to inspect logs."
  },
  {
    id: "saved-playgrounds",
    group: "Saved management",
    title: "Open Saved Playgrounds",
    hint: "Saved and unsaved list",
    description: "Browse temporary, browser-saved, local-directory, imported, and deleted Playground rows with open/manage/rename/delete actions.",
    fields: [
      ["Rows", "Temporary, saved, local permission, imported"],
      ["Actions", "Open, manage, rename, delete"],
      ["Start routes", "Vanilla, PRs, GitHub, Blueprint URL, Import .zip"]
    ],
    consequence: "Selecting a row changes the detail panel. Opening changes the active Playground.",
    ready: "Saved Playgrounds table is visible on the left."
  }
];

const blueprints = [
  ["Art Gallery", "An art gallery created with the Vueo theme.", ["Website", "Personal", "Featured"], "art"],
  ["Coffee Shop", "A stylish WooCommerce coffee shop storefront with custom theme, products, and content.", ["WooCommerce", "Website", "Featured"], "coffee"],
  ["Feed Reader with the Friends Plugin", "Read feeds from the web in Playground using the Friends plugin.", ["Content", "Gutenberg"], "feed"],
  ["Gaming News", "A gaming news site created with the Spiel theme.", ["Website", "News"], "gaming"],
  ["Non-profit Organization", "A non-profit organization site created with the Koinonia theme.", ["Website", "Content"], "nonprofit"],
  ["Personal Blog", "A personal blog created with the Substrata theme.", ["Website", "Personal"], "blog"],
  ["Newsroom Demo", "A compact publishing site for testing post lists, menus, and media.", ["News", "Content"], "news"],
  ["Storefront Starter", "WooCommerce product and cart demo for checkout experiments.", ["WooCommerce", "Website"], "shop"],
  ["Interactivity Experiment", "A Gutenberg experiment showing dynamic blocks and front-end state.", ["Experiments", "Gutenberg"], "experiment"]
];

const state = {
  selectedCommand: "zip-download",
  selectedBlueprint: blueprints[0],
  storage: "temporary",
  activeTitle: "Unsaved Playground",
  commandRunning: false,
  confirmRun: null
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function addActivity(kind, text) {
  const li = document.createElement("li");
  li.innerHTML = `<span class="state ${kind}">${kind}</span> ${text}`;
  $("#activityList").prepend(li);
}

function setOperation(title, steps) {
  $("#operationTitle").textContent = title;
  $("#operationSteps").innerHTML = steps
    .map((step) => `<li class="${step.state || ""}">${escapeHtml(step.text)}</li>`)
    .join("");
}

function renderCommands() {
  const query = $("#commandSearch").value.trim().toLowerCase();
  const groups = new Map();
  commands.forEach((command) => {
    const haystack = `${command.group} ${command.title} ${command.hint} ${command.description}`.toLowerCase();
    if (query && !haystack.includes(query)) return;
    if (!groups.has(command.group)) groups.set(command.group, []);
    groups.get(command.group).push(command);
  });

  $("#commandGroups").innerHTML = [...groups.entries()]
    .map(([group, items]) => `
      <section class="command-group">
        <h3>${escapeHtml(group)}</h3>
        ${items.map((item) => `
          <button class="command-result ${item.id === state.selectedCommand ? "is-active" : ""}" type="button" data-command-id="${item.id}">
            <span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.description)}</small></span>
            <span>${escapeHtml(item.hint)}</span>
          </button>
        `).join("")}
      </section>
    `)
    .join("") || `<p class="result-line">No commands match this search.</p>`;
}

function renderDetail(commandId = state.selectedCommand) {
  const command = commands.find((item) => item.id === commandId) || commands[0];
  state.selectedCommand = command.id;
  state.confirmRun = null;
  $("#detailGroup").textContent = command.group;
  $("#detailTitle").textContent = command.title;
  $("#detailDescription").textContent = command.description;
  $("#detailFields").innerHTML = command.fields.map(([label, value]) => `
    <label><span>${escapeHtml(label)}</span><input value="${escapeHtml(value)}" ${label.includes("Status") || label === "Validation" || label === "Files" || label === "Storage" || label === "Driver" || label === "Path" || label === "Size" ? "readonly" : ""}></label>
  `).join("");
  $("#constraintBox").innerHTML = `<strong>Consequences</strong><span>${escapeHtml(command.consequence)}</span>`;
  $("#detailResult").textContent = command.ready;
  $("#progressBox").hidden = true;
  $("#confirmBox").hidden = true;
  $("#progressMeter").style.width = "0";
  $("#runCommand").disabled = false;
  renderCommands();

  if (command.id === "file-browser") showManagerTab("files");
  if (command.id === "blueprint-run" || command.id === "blueprint-url" || command.id === "blueprint-gallery") showManagerTab("blueprint");
  if (command.id === "database-download") showManagerTab("database");
  if (command.id === "logs") showManagerTab("logs");
  if (command.id === "settings-reset") showManagerTab("settings");
}

function showTable(name) {
  $$(".segmented button").forEach((button) => button.classList.toggle("is-active", button.dataset.table === name));
  $$(".object-table").forEach((table) => table.classList.toggle("is-active", table.id === `table-${name}`));
}

function selectRow(rowId) {
  $$(".table-row[data-row-id]").forEach((row) => row.classList.toggle("is-selected", row.dataset.rowId === rowId));
  if (rowId === "active") {
    renderDetail(state.storage === "temporary" ? "save-local" : "settings-reset");
  } else if (rowId === "plugin-review") {
    renderDetail("delete-saved");
  } else if (rowId === "local-lab") {
    renderDetail("save-local");
    $("#detailResult").textContent = "Local Theme Lab needs folder permission before Save & Reload can continue.";
  } else if (rowId === "zip-import") {
    renderDetail("zip-import");
  }
}

function showManagerTab(tab) {
  $$(".manager-tabs button").forEach((button) => button.classList.toggle("is-active", button.dataset.managerTab === tab));
  $$(".manager-panel").forEach((panel) => panel.classList.toggle("is-active", panel.id === `manager-${tab}`));
}

function updateStorage(storage, title, identity, reloadRule) {
  state.storage = storage;
  state.activeTitle = title;
  document.querySelector(".app").dataset.storage = storage;
  $("#activeTitle").textContent = title;
  $("#shellStorage").textContent = storage === "browser" ? "Saved Playground" : storage === "local" ? "Local directory" : storage === "imported" ? "Imported" : "Temporary";
  $("#shellStorage").className = `storage-pill ${storage === "temporary" ? "amber" : storage === "browser" || storage === "local" ? "green" : "blue"}`;
  $("#activeIdentity").textContent = identity;
  $("#reloadRule").textContent = reloadRule;
  $("#rowActiveName").textContent = title;
  $("#rowActiveMeta").textContent = storage === "local" ? "~/Sites/playground-research-browser" : storage === "browser" ? "Slug /research-browser-playground/" : storage === "imported" ? "portfolio-playground.zip imported" : "Current WordPress latest / PHP 8.3";
  $("#rowActiveStorage").textContent = storage === "local" ? "local" : storage === "browser" ? "browser" : storage === "imported" ? "zip" : "temporary";
  $("#rowActiveState").textContent = storage === "local" ? "local saved" : storage === "browser" ? "saved" : storage === "imported" ? "imported" : "temporary";
  $("#rowActiveState").className = `state ${storage === "temporary" ? "amber" : storage === "imported" ? "blue" : "green"}`;
  $("#settingsNotice").textContent = storage === "temporary"
    ? "Temporary Playground: Apply Settings and Reset is destructive. Save first to use Save & Reload."
    : "Stored Playground: configuration is limited and uses Save & Reload instead of destructive reset.";
}

function updatePreview({ title, kicker, text, notice, path }) {
  if (title) $("#previewTitle").innerHTML = title;
  if (kicker) $("#previewKicker").textContent = kicker;
  if (text) $("#previewText").textContent = text;
  if (notice) $("#previewNotice").textContent = notice;
  if (path) {
    $("#pathInput").value = path;
    $("#browserUrl").textContent = `playground.local${path}`;
  }
}

function setProgress(title, text, pct) {
  $("#progressBox").hidden = false;
  $("#progressTitle").textContent = title;
  $("#progressText").textContent = text;
  $("#progressMeter").style.width = `${pct}%`;
}

function runProgress(steps, done) {
  if (state.commandRunning) return;
  state.commandRunning = true;
  $("#runCommand").disabled = true;
  $("#confirmBox").hidden = true;
  let index = 0;

  const tick = () => {
    const step = steps[index];
    setProgress(step.title, step.text, step.pct);
    $("#detailResult").textContent = step.result || step.text;
    setOperation(step.title, [
      { text: "Command accepted", state: "done" },
      { text: step.text, state: "current" },
      { text: `${step.pct}% complete` },
      { text: "Result pending" }
    ]);
    index += 1;
    if (index < steps.length) {
      window.setTimeout(tick, 420);
    } else {
      window.setTimeout(() => {
        state.commandRunning = false;
        $("#runCommand").disabled = false;
        done();
      }, 460);
    }
  };
  tick();
}

function addOrUpdateTransfer(id, name, source, status, tone = "green") {
  showTable("transfers");
  const existing = $(`[data-transfer-id="${id}"]`);
  const html = `
    <span><strong>${escapeHtml(name)}</strong><small>${escapeHtml(source.detail)}</small></span>
    <span>${escapeHtml(source.label)}</span>
    <span><b class="state ${tone}">${escapeHtml(status)}</b></span>
  `;
  if (existing) {
    existing.innerHTML = html;
    $$(".table-row[data-transfer-id]").forEach((row) => row.classList.toggle("is-selected", row === existing));
  } else {
    const row = document.createElement("button");
    row.className = "table-row is-selected";
    row.type = "button";
    row.dataset.transferId = id;
    row.innerHTML = html;
    $$(".table-row[data-transfer-id]").forEach((item) => item.classList.remove("is-selected"));
    $("#table-transfers").append(row);
  }
}

function requestConfirmation(title, text, onConfirm) {
  $("#confirmBox").hidden = false;
  $("#confirmTitle").textContent = title;
  $("#confirmText").textContent = text;
  state.confirmRun = onConfirm;
}

function runSelectedCommand() {
  const id = state.selectedCommand;

  if (id === "zip-download") {
    runProgress([
      { title: "Preparing ZIP", text: "Reading current WordPress files", pct: 30 },
      { title: "Packaging ZIP", text: "Adding SQLite database and blueprint.json", pct: 72 },
      { title: "ZIP ready", text: "Generated playground-export-0521.zip", pct: 100 }
    ], () => {
      addOrUpdateTransfer("zip-download", "playground-export-0521.zip", { label: "current site", detail: "3,751 files and database.sqlite packaged" }, "downloaded", "green");
      $("#detailResult").textContent = "ZIP generated. Transfer history now contains playground-export-0521.zip.";
      addActivity("green", "Downloaded <code>playground-export-0521.zip</code> from the current Playground.");
      setOperation("ZIP download complete", [
        { text: "Source checked", state: "done" },
        { text: "Archive generated", state: "done" },
        { text: "Transfer row updated", state: "done" },
        { text: "Preview remained active", state: "current" }
      ]);
    });
    return;
  }

  if (id === "github-export") {
    runProgress([
      { title: "Authorizing GitHub", text: "Using connected GitHub account; token not stored after refresh", pct: 25 },
      { title: "Preparing repository", text: "Target github.com/acme/playground-lab on branch playground-export", pct: 55 },
      { title: "Exporting files", text: "Pushing wp-content, blueprint.json, and database note", pct: 88 },
      { title: "GitHub export complete", text: "Created export commit 9f4a2c1", pct: 100 }
    ], () => {
      addOrUpdateTransfer("github-export", "github.com/acme/playground-lab", { label: "GitHub", detail: "branch playground-export, commit 9f4a2c1" }, "exported", "green");
      $("#detailResult").textContent = "GitHub export complete. Repository and transfer row show exported state.";
      addActivity("green", "Exported current Playground to <code>github.com/acme/playground-lab</code>.");
      updatePreview({ notice: "GitHub export finished. The live WordPress preview is unchanged and still active." });
    });
    return;
  }

  if (id === "save-local") {
    runProgress([
      { title: "Opening folder picker", text: "Folder selected: ~/Sites/playground-research-browser", pct: 18 },
      { title: "Permission granted", text: "Browser granted read/write access to the selected local directory", pct: 38 },
      { title: "Copying files", text: "Saving 3028 / 3751 WordPress files", pct: 70 },
      { title: "Local save complete", text: "Saved to ~/Sites/playground-research-browser", pct: 100 }
    ], () => {
      updateStorage("local", "Research Browser Playground", "Local directory: ~/Sites/playground-research-browser", "Save & Reload writes settings back to the selected folder; reconnect permission may be required after reload.");
      $("#detailResult").textContent = "Local-directory save complete. The active row now shows local saved state and folder identity.";
      addActivity("green", "Saved current Playground to local folder <code>~/Sites/playground-research-browser</code>.");
      setOperation("Local-directory save complete", [
        { text: "Folder picker completed", state: "done" },
        { text: "Permission granted", state: "done" },
        { text: "Files copied", state: "done" },
        { text: "Active row transformed to local saved", state: "current" }
      ]);
    });
    return;
  }

  if (id === "save-browser") {
    runProgress([
      { title: "Preparing browser storage", text: "Creating saved Playground identity", pct: 22 },
      { title: "Copying files", text: "Saving 3028 / 3751 files", pct: 67 },
      { title: "Browser save complete", text: "Slug /research-browser-playground/ is available", pct: 100 }
    ], () => {
      updateStorage("browser", "Research Browser Playground", "Browser storage slug: /research-browser-playground/", "Stored Playground uses Save & Reload for settings changes.");
      $("#detailResult").textContent = "Browser save complete. The temporary row became a saved browser row.";
      addActivity("green", "Saved current Playground in this browser as <code>Research Browser Playground</code>.");
    });
    return;
  }

  if (id === "zip-import") {
    requestConfirmation("Replace current Playground with ZIP?", "portfolio-playground.zip has been validated. Importing replaces current files and database, and unsaved changes are discarded.", () => {
      runProgress([
        { title: "Importing ZIP", text: "Extracting portfolio-playground.zip", pct: 30 },
        { title: "Replacing database", text: "Installing database.sqlite into /wordpress/wp-content/database/.ht.sqlite", pct: 66 },
        { title: "Import complete", text: "Imported Portfolio Draft is now active", pct: 100 }
      ], () => {
        updateStorage("imported", "Imported Portfolio Draft", "Imported from portfolio-playground.zip", "Imported temporary site still needs a save destination before refresh.");
        updatePreview({
          title: "Imported <a>Portfolio Draft</a>",
          kicker: "ZIP import result",
          text: "The selected ZIP replaced files and database in the running Playground. The preview, active row, and path now reflect the imported site.",
          notice: "Imported from portfolio-playground.zip. Save in browser or local directory to keep it after refresh.",
          path: "/"
        });
        $("#detailResult").textContent = "ZIP import complete. Active row transformed to imported state.";
        addActivity("blue", "Imported <code>portfolio-playground.zip</code> and replaced the current Playground.");
      });
    });
    return;
  }

  if (id === "delete-saved") {
    requestConfirmation("Delete Plugin Review Playground?", "This removes the browser-saved copy. The current Playground remains open because the deleted row is not active.", () => {
      const row = $('[data-row-id="plugin-review"]');
      row.innerHTML = `
        <span><strong>Deleted Plugin Review Playground</strong><small>Deleted from browser storage a moment ago</small></span>
        <span>browser</span>
        <span><b class="state red">deleted</b></span>
      `;
      row.classList.remove("is-selected");
      row.disabled = true;
      row.style.opacity = "0.72";
      $("#detailResult").textContent = "Deletion complete. The saved row is locked in a final deleted state; active Playground did not change.";
      $("#confirmBox").hidden = true;
      addActivity("red", "Deleted browser-saved row <code>Plugin Review Playground</code>.");
      setOperation("Saved row deleted", [
        { text: "Confirmation accepted", state: "done" },
        { text: "Browser storage entry deleted", state: "done" },
        { text: "Row transformed to deleted state", state: "done" },
        { text: "Current Playground remains active", state: "current" }
      ]);
    });
    return;
  }

  if (id === "rename-saved") {
    const row = $('[data-row-id="plugin-review"]');
    row.innerHTML = `
      <span><strong>Plugin QA Playground</strong><small>Browser saved May 21, 2026, slug /plugin-qa-playground/</small></span>
      <span>browser</span>
      <span><b class="state green">renamed</b></span>
    `;
    $("#detailResult").textContent = "Rename complete. The saved row now uses Plugin QA Playground and slug /plugin-qa-playground/.";
    addActivity("green", "Renamed saved Playground row to <code>Plugin QA Playground</code>.");
    return;
  }

  if (id === "blueprint-run" || id === "blueprint-url") {
    requestConfirmation("Run Blueprint and replace current content?", `${state.selectedBlueprint[0]} will alter content, theme/plugin state, and landing page in the current Playground.`, () => {
      runProgress([
        { title: "Validating Blueprint", text: "Schema and preferred versions are valid", pct: 28 },
        { title: "Running Blueprint", text: `Installing ${state.selectedBlueprint[0]} content`, pct: 74 },
        { title: "Blueprint complete", text: `${state.selectedBlueprint[0]} is now active`, pct: 100 }
      ], () => {
        updatePreview({
          title: `${escapeHtml(state.selectedBlueprint[0])} <a>Playground</a>`,
          kicker: "Blueprint run result",
          text: state.selectedBlueprint[1],
          notice: "Blueprint completed and changed the active Playground. Save or export if you want to keep the result.",
          path: "/"
        });
        $("#blueprintResult").textContent = `Run complete. ${state.selectedBlueprint[0]} is active in the preview.`;
        $("#detailResult").textContent = "Blueprint run complete. Preview and activity history were updated.";
        addActivity("blue", `Ran Blueprint <code>${escapeHtml(state.selectedBlueprint[0])}</code> on the current Playground.`);
      });
    });
    return;
  }

  if (id === "database-download") {
    runProgress([
      { title: "Checking SQLite database", text: "Reading /wordpress/wp-content/database/.ht.sqlite", pct: 32 },
      { title: "Preparing download", text: "Creating database.sqlite", pct: 78 },
      { title: "Database download ready", text: "database.sqlite downloaded", pct: 100 }
    ], () => {
      addOrUpdateTransfer("database-download", "database.sqlite", { label: "SQLite", detail: "/wordpress/wp-content/database/.ht.sqlite, 452 KB" }, "downloaded", "green");
      $("#detailResult").textContent = "database.sqlite downloaded and recorded in transfer history.";
      addActivity("green", "Downloaded <code>database.sqlite</code> from the SQLite-backed database.");
    });
    return;
  }

  if (id === "settings-reset") {
    const stored = state.storage !== "temporary" && state.storage !== "imported";
    requestConfirmation(stored ? "Save & Reload stored Playground?" : "Reset temporary Playground?", stored
      ? "Stored Playgrounds have limited configuration options. Save & Reload applies the selected PHP, language, network, and multisite settings."
      : "This resets the temporary Playground and discards unsaved files, database changes, and content.", () => {
      runProgress([
        { title: stored ? "Saving settings" : "Resetting Playground", text: stored ? "Writing configuration before reload" : "Destroying current temporary runtime", pct: 45 },
        { title: stored ? "Reloading" : "Preparing WordPress", text: "WordPress latest / PHP 8.3 / network access on", pct: 100 }
      ], () => {
        $("#detailResult").textContent = stored ? "Save & Reload complete for stored Playground." : "Temporary Playground reset complete.";
        addActivity(stored ? "green" : "amber", stored ? "Applied settings with Save & Reload." : "Applied settings and reset the temporary Playground.");
        updatePreview({ notice: stored ? "Settings saved and Playground reloaded." : "Temporary Playground reset with selected settings." });
      });
    });
    return;
  }

  if (id === "vanilla" || id === "wp-pr" || id === "gutenberg-pr" || id === "github-import") {
    requestConfirmation(`Start ${commands.find((item) => item.id === id).title}?`, "The current Playground is temporary. Starting or importing a replacement discards unsaved work unless you save first.", () => {
      runProgress([
        { title: "Preparing route", text: "Validating route inputs and constraints", pct: 30 },
        { title: "Booting WordPress", text: "Preparing WordPress runtime", pct: 75 },
        { title: "Route ready", text: "New Playground route is active", pct: 100 }
      ], () => {
        const labels = {
          vanilla: "Vanilla WordPress Playground",
          "wp-pr": "WordPress PR Preview",
          "gutenberg-pr": "Gutenberg Branch Preview",
          "github-import": "GitHub Import Playground"
        };
        updateStorage("temporary", labels[id], "Temporary session, not saved yet", "Settings reset replaces this unsaved site");
        updatePreview({
          title: `${escapeHtml(labels[id])} <a>Ready</a>`,
          kicker: "Route started",
          text: "The selected route is now running in the protected WordPress shell.",
          notice: "Save in browser or local directory to keep this Playground.",
          path: "/"
        });
        $("#detailResult").textContent = `${labels[id]} is now active.`;
        addActivity("blue", `Started route <code>${escapeHtml(labels[id])}</code>.`);
      });
    });
    return;
  }

  if (id === "file-browser") {
    showManagerTab("files");
    $("#detailResult").textContent = "File browser opened. Edit the selected file to see dirty and save states.";
    addActivity("blue", "Opened Site Manager File browser.");
    return;
  }

  if (id === "site-manager" || id === "saved-playgrounds" || id === "blueprint-gallery" || id === "logs") {
    if (id === "logs") showManagerTab("logs");
    $("#detailResult").textContent = `${commands.find((item) => item.id === id).title} is visible in the cockpit.`;
    addActivity("blue", `Opened <code>${escapeHtml(commands.find((item) => item.id === id).title)}</code>.`);
  }
}

function renderBlueprints() {
  const query = $("#blueprintSearch").value.trim().toLowerCase();
  const filter = $("#blueprintFilters .is-active").dataset.filter;
  const visible = blueprints.filter(([name, description, tags]) => {
    const matchesFilter = filter === "All" || tags.includes(filter);
    const matchesQuery = !query || `${name} ${description} ${tags.join(" ")}`.toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });
  $("#blueprintList").innerHTML = visible.map((bp) => `
    <button class="blueprint-card ${bp[0] === state.selectedBlueprint[0] ? "is-selected" : ""}" type="button" data-blueprint="${escapeHtml(bp[0])}">
      <span class="thumb ${escapeHtml(bp[3])}"></span>
      <span><strong>${escapeHtml(bp[0])}</strong><small>${escapeHtml(bp[2].join(", "))}</small></span>
    </button>
  `).join("") || `<p class="result-line">No Blueprint entries match this filter.</p>`;
}

function selectBlueprint(name) {
  const bp = blueprints.find((item) => item[0] === name);
  if (!bp) return;
  state.selectedBlueprint = bp;
  $("#selectedBlueprintName").textContent = bp[0];
  $("#selectedBlueprintDescription").textContent = bp[1];
  renderBlueprints();
  if (state.selectedCommand === "blueprint-run") renderDetail("blueprint-run");
}

function initEvents() {
  $("#commandSearch").addEventListener("input", renderCommands);
  document.addEventListener("click", (event) => {
    const commandButton = event.target.closest("[data-command-id]");
    if (commandButton) {
      renderDetail(commandButton.dataset.commandId);
      return;
    }

    const tableButton = event.target.closest("[data-table]");
    if (tableButton) {
      showTable(tableButton.dataset.table);
      return;
    }

    const row = event.target.closest("[data-row-id]");
    if (row && !row.disabled) {
      selectRow(row.dataset.rowId);
      return;
    }

    const transfer = event.target.closest("[data-transfer-id]");
    if (transfer) {
      $$(".table-row[data-transfer-id]").forEach((item) => item.classList.toggle("is-selected", item === transfer));
      if (transfer.dataset.transferId === "github-export") renderDetail("github-export");
      if (transfer.dataset.transferId === "zip-download") renderDetail("zip-download");
      if (transfer.dataset.transferId === "database-download") renderDetail("database-download");
      return;
    }

    const managerTab = event.target.closest("[data-manager-tab]");
    if (managerTab) {
      showManagerTab(managerTab.dataset.managerTab);
      return;
    }

    const blueprintFilter = event.target.closest("[data-filter]");
    if (blueprintFilter) {
      $$("#blueprintFilters button").forEach((button) => button.classList.toggle("is-active", button === blueprintFilter));
      renderBlueprints();
      return;
    }

    const blueprintCard = event.target.closest("[data-blueprint]");
    if (blueprintCard) {
      selectBlueprint(blueprintCard.dataset.blueprint);
    }
  });

  $("#runCommand").addEventListener("click", runSelectedCommand);
  $("#validateCommand").addEventListener("click", () => {
    $("#detailResult").textContent = "Validation passed. Required inputs and consequences are ready for this command.";
    addActivity("blue", `Validated command <code>${escapeHtml($("#detailTitle").textContent)}</code>.`);
  });
  $("#cancelCommand").addEventListener("click", () => {
    $("#progressBox").hidden = true;
    $("#confirmBox").hidden = true;
    $("#detailResult").textContent = "Command cancelled. No Playground state changed.";
    setOperation("Command cancelled", [
      { text: "Previous state preserved", state: "done" },
      { text: "Awaiting command", state: "current" },
      { text: "Progress stopped" },
      { text: "No result created" }
    ]);
  });
  $("#confirmAction").addEventListener("click", () => {
    const fn = state.confirmRun;
    state.confirmRun = null;
    if (typeof fn === "function") fn();
  });
  $("#cancelConfirm").addEventListener("click", () => {
    $("#confirmBox").hidden = true;
    $("#detailResult").textContent = "Confirmation cancelled. The current Playground was not changed.";
  });

  $("#homeButton").addEventListener("click", () => {
    $("#pathInput").value = "/hello-from-playground/";
    $("#browserUrl").textContent = "playground.local/hello-from-playground/";
    $("#pathState").textContent = "homepage";
    addActivity("blue", "Navigated preview to <code>/hello-from-playground/</code>.");
  });
  $("#adminButton").addEventListener("click", () => {
    $("#pathInput").value = "/wp-admin/";
    $("#browserUrl").textContent = "playground.local/wp-admin/";
    $("#pathState").textContent = "wp admin";
    updatePreview({
      title: "WordPress <a>Dashboard</a>",
      kicker: "WP Admin",
      text: "The embedded WordPress admin is open in the protected shell.",
      notice: "Admin changes affect this isolated Playground."
    });
    addActivity("blue", "Opened <code>/wp-admin/</code> in the live shell.");
  });
  $("#refreshButton").addEventListener("click", () => {
    $("#pathState").textContent = "refreshed";
    addActivity("amber", "Refreshed active WordPress path <code>" + escapeHtml($("#pathInput").value) + "</code>.");
  });
  $("#pathInput").addEventListener("change", () => {
    const value = $("#pathInput").value.startsWith("/") ? $("#pathInput").value : `/${$("#pathInput").value}`;
    $("#pathInput").value = value;
    $("#browserUrl").textContent = `playground.local${value}`;
    $("#pathState").textContent = "navigated";
    addActivity("blue", `Navigated preview to <code>${escapeHtml(value)}</code>.`);
  });

  $("#fileEditor").addEventListener("input", () => {
    $("#fileDirty").textContent = "dirty";
    $("#fileDirty").className = "state amber";
    $("#fileResult").textContent = "Selected file has unsaved changes.";
  });
  $("#saveFile").addEventListener("click", () => {
    $("#fileDirty").textContent = "saved";
    $("#fileDirty").className = "state green";
    $("#fileResult").textContent = "/wordpress/wp-config.php saved successfully.";
    addActivity("green", "Saved selected file <code>/wordpress/wp-config.php</code>.");
  });
  $("#revertFile").addEventListener("click", () => {
    $("#fileDirty").textContent = "clean";
    $("#fileDirty").className = "state green";
    $("#fileResult").textContent = "Selected file is clean.";
  });
  ["newFile", "newFolder", "uploadFile", "browseFiles", "bpNewFile", "bpNewFolder", "bpUpload", "bpBrowse"].forEach((id) => {
    const node = $(`#${id}`);
    if (node) node.addEventListener("click", () => addActivity("blue", `${escapeHtml(node.textContent)} action completed in the Site Manager.`));
  });
  $$(".tree-row").forEach((row) => {
    row.addEventListener("click", () => {
      $$(".tree-row").forEach((item) => item.classList.remove("is-active"));
      row.classList.add("is-active");
      if (row.dataset.file) $("#fileName").textContent = row.dataset.file;
      $("#fileDirty").textContent = "clean";
      $("#fileDirty").className = "state green";
      $("#fileResult").textContent = `${row.dataset.file || "Selected file"} is clean.`;
    });
  });
  $("#copyBlueprint").addEventListener("click", () => {
    $("#blueprintResult").textContent = "Blueprint link copied to clipboard.";
    addActivity("green", "Copied current Blueprint link.");
  });
  $("#downloadBlueprint").addEventListener("click", () => {
    $("#blueprintResult").textContent = "Blueprint bundle downloaded.";
    addActivity("green", "Downloaded current Blueprint bundle.");
  });
  $("#openAdminer").addEventListener("click", () => addActivity("blue", "Opened Adminer for the SQLite-backed database."));
  $("#openPhpMyAdmin").addEventListener("click", () => addActivity("blue", "Opened phpMyAdmin for the SQLite-backed database."));
  $$(".log-tabs button").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".log-tabs button").forEach((item) => item.classList.toggle("is-active", item === button));
      const logs = {
        playground: "[playground] no problems so far\n[transfer] zip export handle ready\n[runtime] network access allowed",
        wordpress: "[wordpress] PHP notice: Example plugin loaded a deprecated hook\n[wordpress] Site URL /hello-from-playground/ resolved",
        php: "[php] WP_DEBUG true\n[php] memory limit 256M\n[php] no fatal errors"
      };
      $("#logOutput").textContent = logs[button.dataset.log];
    });
  });
  $("#blueprintSearch").addEventListener("input", renderBlueprints);
  $("#clearHistory").addEventListener("click", () => {
    $("#activityList").innerHTML = `<li><span class="state neutral">cleared</span> Resolved history cleared. Current Playground state remains visible in the shell and tables.</li>`;
  });
}

renderCommands();
renderDetail("zip-download");
renderBlueprints();
initEvents();
