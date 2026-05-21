const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const state = {
  title: "Unsaved Playground",
  storage: "temporary",
  identity: "Temporary browser runtime. Refresh or close loses files and database unless saved.",
  path: "/hello-from-playground/",
  runtime: "WP latest / PHP 8.3",
  lastEvent: "Booted from Vanilla WordPress",
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function timeStamp() {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function setClassName(element, base, variant) {
  element.className = variant ? `${base} ${variant}` : base;
}

function addEvent(title, detail, variant = "") {
  state.lastEvent = title;
  $("#objectEvent").textContent = title;

  const item = document.createElement("li");
  item.innerHTML = `<span>${timeStamp()}</span><strong>${title}</strong><em>${detail}</em>`;
  if (variant) {
    item.dataset.variant = variant;
  }
  $("#ledger").prepend(item);
}

function updateObject() {
  $("#siteTitle").textContent = state.title;
  $("#siteIdentity").textContent = state.identity;
  $("#objectPath").textContent = state.path;
  $("#objectStorage").textContent = state.storage;
  $("#objectRuntime").textContent = state.runtime;
  $("#objectEvent").textContent = state.lastEvent;
  $("#pathInput").value = state.path;
  $("#previewPath").textContent = state.path;

  const badge = $("#storageBadge");
  if (state.storage === "temporary") {
    badge.textContent = "Unsaved Playground";
    setClassName(badge, "chip", "warning");
  } else if (state.storage === "local directory") {
    badge.textContent = "Local directory";
    setClassName(badge, "chip", "success");
  } else {
    badge.textContent = "Saved Playground";
    setClassName(badge, "chip", "success");
  }

  $("#savedActiveName").textContent = state.title;
  $("#savedActiveMeta").textContent =
    state.storage === "temporary"
      ? "Temporary - not saved to browser storage or local directory"
      : state.identity;
}

function selectMode(mode) {
  $$(".mode-tabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
  $$("[data-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === mode);
  });
}

function selectManager(tab) {
  $$(".manager-nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.manager === tab);
  });
  $$("[data-manager-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.managerPanel === tab);
  });
}

function setPreview(mode) {
  if (mode === "admin") {
    state.path = "/wp-admin/";
    $("#previewState").textContent = "WP Admin active";
    $("#previewArticle").innerHTML = `
      <p class="eyebrow" id="previewPath">/wp-admin/</p>
      <h3>Dashboard</h3>
      <p>Welcome to WordPress. The admin dashboard is open inside the protected Playground shell.</p>
      <p class="highlight-note">Site Health shows one PHP warning and no fatal errors.</p>
      <button type="button">Open Site Editor</button>
    `;
  } else {
    state.path = "/hello-from-playground/";
    $("#previewState").textContent = "Homepage active";
    $("#previewArticle").innerHTML = `
      <p class="eyebrow" id="previewPath">/hello-from-playground/</p>
      <h3>Hello from <span>WordPress Playground!</span></h3>
      <p>This is Playground, a WordPress that runs client-side in your browser for training, demos, plugins, themes, and tests.</p>
      <p class="highlight-note">Note that you are logged in as admin.</p>
      <button type="button">Discover the mission behind Playground</button>
    `;
  }
  updateObject();
}

function animateProgress({ card, bar, label, count, steps, done }) {
  let index = 0;
  card.hidden = false;
  bar.style.inlineSize = "0%";

  function tick() {
    const step = steps[index];
    label.textContent = step.label;
    count.textContent = `${step.percent}%`;
    bar.style.inlineSize = `${step.percent}%`;
    index += 1;

    if (index < steps.length) {
      window.setTimeout(tick, 360);
    } else {
      window.setTimeout(done, 420);
    }
  }

  tick();
}

function finishBrowserSave() {
  const name = $("#browserName").value.trim() || "Research Browser Playground";
  animateProgress({
    card: $("#saveProgress"),
    bar: $("#saveProgressBar"),
    label: $("#saveProgressText"),
    count: $("#saveProgressCount"),
    steps: [
      { label: "Indexing temporary WordPress files...", percent: 18 },
      { label: "Saving 1280 / 3751 files to browser storage...", percent: 42 },
      { label: "Saving SQLite database and blueprint.json...", percent: 76 },
      { label: "Browser saved identity ready.", percent: 100 },
    ],
    done() {
      state.title = name;
      state.storage = "browser storage";
      state.identity = `browser: ${slugify(name)}. Refresh keeps this saved row and slug.`;
      $("#saveStep").textContent = "Browser save complete";
      setClassName($("#saveStep"), "chip", "success");
      $("#saveResult").textContent = `${name} is now browser-backed and addressable from Saved Playgrounds.`;
      setClassName($("#saveResult"), "inline-result", "success");
      updateObject();
      addEvent("Saved in browser storage", `${name} transformed the active temporary row into a browser-saved Playground.`, "success");
    },
  });
}

function finishLocalSave() {
  const folder = $("#folderName").value.trim() || "/Users/admin/Playgrounds/current-playground";
  animateProgress({
    card: $("#saveProgress"),
    bar: $("#saveProgressBar"),
    label: $("#saveProgressText"),
    count: $("#saveProgressCount"),
    steps: [
      { label: "Opening browser folder picker...", percent: 12 },
      { label: "Permission granted for selected local directory...", percent: 30 },
      { label: "Writing 3751 files, uploads, plugins, themes, and database...", percent: 68 },
      { label: "Recording reload consequence and folder identity...", percent: 88 },
      { label: "Local directory save complete.", percent: 100 },
    ],
    done() {
      state.title = "Research Local Workbench";
      state.storage = "local directory";
      state.identity = `local: ${folder}. Refresh requires reconnecting folder permission before opening.`;
      $("#saveStep").textContent = "Local folder granted";
      setClassName($("#saveStep"), "chip", "success");
      $("#saveResult").textContent = `Saved to ${folder}. The shell badge, saved row, reload consequence, and ledger now identify this as a local-directory Playground.`;
      setClassName($("#saveResult"), "inline-result", "success");
      updateObject();
      addEvent("Saved to local directory", `${folder} granted and synced; reload will ask to reconnect this folder.`, "success");
      selectMode("library");
    },
  });
}

function finishTransfer(kind) {
  const isZip = kind === "zip";
  const repo = $("#repoName").value.trim() || "acme/playground-research-browser";
  animateProgress({
    card: $("#transferProgress"),
    bar: $("#transferProgressBar"),
    label: $("#transferProgressText"),
    count: $("#transferProgressCount"),
    steps: isZip
      ? [
          { label: "Scanning current files and SQLite database...", percent: 20 },
          { label: "Bundling wp-content, uploads, themes, plugins, and blueprint.json...", percent: 55 },
          { label: "Generating playground-research-local-2026-05-21.zip...", percent: 86 },
          { label: "ZIP download ready.", percent: 100 },
        ]
      : [
          { label: "Connecting GitHub account. Token is not stored after refresh...", percent: 20 },
          { label: `Creating export target ${repo}...`, percent: 45 },
          { label: "Pushing files, SQLite database, uploads, and blueprint metadata...", percent: 78 },
          { label: "GitHub export complete.", percent: 100 },
        ],
    done() {
      $("#transferBadge").textContent = isZip ? "ZIP generated" : "Exported";
      setClassName($("#transferBadge"), "chip", "success");
      $("#transferResult").textContent = isZip
        ? "Generated playground-research-local-2026-05-21.zip, 18.4 MB. Transfer history now includes source status, archive result, and selected Playground identity."
        : `Exported to GitHub repository ${repo}. Transfer history records account connection, repository target, pushed files, and non-persistent token consequence.`;
      setClassName($("#transferResult"), "inline-result", "success");
      addEvent(isZip ? "Downloaded Playground ZIP" : "Exported to GitHub", $("#transferResult").textContent, "success");
    },
  });
}

function replaceWithZip() {
  animateProgress({
    card: $("#transferProgress"),
    bar: $("#transferProgressBar"),
    label: $("#transferProgressText"),
    count: $("#transferProgressCount"),
    steps: [
      { label: "Confirming replacement of current files and database...", percent: 15 },
      { label: "Extracting coffee-shop-playground.zip...", percent: 46 },
      { label: "Replacing SQLite database and wp-content...", percent: 74 },
      { label: "Imported ZIP runtime ready.", percent: 100 },
    ],
    done() {
      state.title = "Coffee Shop Import";
      state.storage = "temporary";
      state.identity = "Imported from coffee-shop-playground.zip. Unsaved until browser or local save is completed.";
      state.path = "/";
      $("#previewState").textContent = "ZIP import active";
      $("#transferResult").textContent = "coffee-shop-playground.zip replaced the active temporary Playground. Save again to keep the imported files and database.";
      setClassName($("#transferResult"), "inline-result", "warning");
      updateObject();
      addEvent("ZIP import replaced current Playground", "coffee-shop-playground.zip replaced files, database, current path, and preview state.", "warning");
    },
  });
}

function finishDelete() {
  $("#deleteConfirm").hidden = true;
  const row = $("#savedList .saved-row.active");
  row.classList.remove("active");
  row.style.opacity = "0.55";
  row.querySelector("strong").textContent = "Deleted Playground";
  row.querySelector("span").textContent = "Deletion confirmed - active object fell back to a new temporary runtime";
  state.title = "Unsaved Playground";
  state.storage = "temporary";
  state.identity = "Fresh temporary fallback after delete. Refresh or close loses files and database unless saved.";
  state.path = "/hello-from-playground/";
  updateObject();
  addEvent("Deleted saved Playground", "Confirmed deletion removed the selected saved identity and opened a fresh temporary fallback.", "danger");
}

$$("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => selectMode(button.dataset.mode));
});

$$("[data-manager]").forEach((button) => {
  button.addEventListener("click", () => selectManager(button.dataset.manager));
});

$$("[data-event]").forEach((button) => {
  button.addEventListener("click", () => addEvent(button.dataset.event, "Action completed on the selected Playground object."));
});

$$("[data-route]").forEach((button) => {
  button.addEventListener("click", () => {
    const route = button.dataset.route;
    state.title = route;
    state.storage = "temporary";
    state.identity = `${route} started as a new temporary Playground. Save required before refresh.`;
    state.path = route.includes("Blueprint") ? "/hello-from-playground/" : "/";
    $("#previewState").textContent = `${route} active`;
    updateObject();
    addEvent(`${route} started`, "Current temporary files and database were replaced by this launch route.", "warning");
  });
});

$("#refreshButton").addEventListener("click", () => {
  const detail =
    state.storage === "local directory"
      ? "Refresh requested. Browser will ask to reconnect the selected folder before opening local files."
      : state.storage === "temporary"
        ? "Refresh requested. Unsaved temporary runtime would be lost unless saved first."
        : "Refresh restored the browser-saved runtime.";
  addEvent("Refreshed active WordPress page", detail);
});

$("#homepageButton").addEventListener("click", () => {
  setPreview("home");
  addEvent("Opened Homepage", "Path changed to /hello-from-playground/ in the protected shell.");
});

$("#adminButton").addEventListener("click", () => {
  setPreview("admin");
  addEvent("Opened WP Admin", "Path changed to /wp-admin/ without leaving the Playground shell.");
});

$("#pathInput").addEventListener("change", (event) => {
  state.path = event.target.value || "/";
  $("#previewState").textContent = "Custom path active";
  updateObject();
  addEvent("Navigated by path input", `Active iframe path changed to ${state.path}.`);
});

$("[data-action='open-save']").addEventListener("click", () => selectMode("save"));

$("#saveFile").addEventListener("click", () => {
  $("#fileState").textContent = "Saved. wp-config.php write completed.";
  $("#managerBadge").textContent = "File saved";
  setClassName($("#managerBadge"), "chip", "success");
  addEvent("Saved wp-config.php", "Dirty file state cleared and WordPress file editor result recorded.", "success");
});

$("#copyBlueprint").addEventListener("click", () => {
  $("#blueprintResult").textContent = "Blueprint link copied to clipboard for the selected Feed Reader bundle.";
  setClassName($("#blueprintResult"), "inline-result", "success");
  addEvent("Copied Blueprint URL", "Selected blueprint URL copied from /blueprint.json.");
});

$("#downloadBlueprint").addEventListener("click", () => {
  $("#blueprintResult").textContent = "Downloaded blueprint-feed-reader.zip with blueprint.json and supporting files.";
  setClassName($("#blueprintResult"), "inline-result", "success");
  addEvent("Downloaded Blueprint bundle", "Blueprint bundle action recorded in portability history.", "success");
});

$("#runBlueprint").addEventListener("click", () => {
  $("#blueprintState").textContent = "Validated and applied. Current content replaced by Feed Reader with the Friends Plugin.";
  $("#blueprintResult").textContent = "Run complete. The active Playground path stayed protected while content was replaced by the selected Blueprint.";
  setClassName($("#blueprintResult"), "inline-result", "warning");
  $("#previewState").textContent = "Blueprint result active";
  addEvent("Ran Blueprint over current Playground", "Validated JSON, replaced content, and kept the live shell visible.", "warning");
});

$("#downloadDb").addEventListener("click", () => {
  $("#dbResult").textContent = "database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite, 452 KB.";
  setClassName($("#dbResult"), "inline-result", "success");
  addEvent("Downloaded database.sqlite", "SQLite-backed database export completed from Site Manager Database tab.", "success");
});

$("#resetPlayground").addEventListener("click", () => {
  state.title = "Unsaved Playground";
  state.storage = "temporary";
  state.identity = "Runtime reset completed. Files, database, logs, and path were rebuilt from selected settings.";
  state.path = "/hello-from-playground/";
  $("#previewState").textContent = "Reset complete";
  updateObject();
  addEvent("Applied settings and reset", "Destructive temporary reset replaced files, database, logs, and current path.", "danger");
});

$("#browserSave").addEventListener("click", finishBrowserSave);
$("#localSave").addEventListener("click", finishLocalSave);

$("#denyFolder").addEventListener("click", () => {
  $("#saveStep").textContent = "Permission denied";
  setClassName($("#saveStep"), "chip", "warning");
  $("#saveResult").textContent = "Folder permission denied. The Playground remains temporary and refresh will still discard this runtime.";
  setClassName($("#saveResult"), "inline-result", "warning");
  addEvent("Local folder permission denied", "Save to local directory canceled before any files were written.", "warning");
});

$("#renameSite").addEventListener("click", () => {
  state.title = state.storage === "local directory" ? "Local Research Browser" : "Renamed Research Playground";
  state.identity = `${state.identity} Rename applied to shell title, saved row, and ledger.`;
  updateObject();
  addEvent("Renamed active Playground", `Selected object renamed to ${state.title}.`, "success");
});

$("#deleteSite").addEventListener("click", () => {
  $("#deleteConfirm").hidden = false;
  addEvent("Delete confirmation opened", "No data changed until Confirm delete is pressed.", "warning");
});

$("#cancelDelete").addEventListener("click", () => {
  $("#deleteConfirm").hidden = true;
  addEvent("Delete canceled", "Selected Playground row and active shell identity were preserved.");
});

$("#confirmDelete").addEventListener("click", finishDelete);

$("#downloadZip").addEventListener("click", () => finishTransfer("zip"));
$("#githubExport").addEventListener("click", () => finishTransfer("github"));
$("#confirmZipImport").addEventListener("click", replaceWithZip);

$("#zipImport").addEventListener("click", () => {
  selectMode("transfer");
  $("#transferResult").textContent = "Native file chooser returned coffee-shop-playground.zip. Validation passed; replacement confirmation is required.";
  setClassName($("#transferResult"), "inline-result", "warning");
  addEvent("ZIP selected for import", "coffee-shop-playground.zip passed validation and is waiting for replacement confirmation.", "warning");
});

$("#connectGitHub").addEventListener("click", () => {
  selectMode("transfer");
  $("#transferResult").textContent = "GitHub connected for this session only. Token will not be stored after refresh.";
  setClassName($("#transferResult"), "inline-result", "success");
  addEvent("GitHub account connected", "Session-only token ready for import or export; re-authentication required after refresh.", "success");
});

$("#clearLedger").addEventListener("click", () => {
  $("#ledger").innerHTML = "";
  addEvent("Ledger view cleared", "Only new events will appear in this local operations view.");
});

updateObject();
