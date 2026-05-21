const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const state = {
  activeSite: "research",
  eventCount: 5,
  githubConnected: false,
  zipSelected: false,
  selectedBlueprintFilter: "All",
  activeManagerTab: "settings",
};

const blueprints = [
  {
    title: "Art Gallery",
    description: "An art gallery created with the Vueo theme.",
    tags: ["Featured", "Website", "Personal"],
  },
  {
    title: "Coffee Shop",
    description: "A WooCommerce coffee shop storefront with custom content.",
    tags: ["Featured", "WooCommerce", "Website"],
  },
  {
    title: "Feed Reader with the Friends Plugin",
    description: "A feed reader using the Friends plugin and social web tools.",
    tags: ["Featured", "Content"],
  },
  {
    title: "Gaming News",
    description: "A gaming news site created with the Spiel theme.",
    tags: ["Featured", "News", "Website"],
  },
  {
    title: "Non-profit Organization",
    description: "A non-profit site created with the Koinonia theme.",
    tags: ["Featured", "Website"],
  },
  {
    title: "Personal Blog",
    description: "A personal blog created with the Substrata theme.",
    tags: ["Personal", "Content"],
  },
];

const sites = {
  unsaved: {
    title: "Unsaved Playground",
    contract: "Vanilla WordPress start",
    identity: "temporary: not saved",
    storage: "Temporary, lost on refresh unless saved",
    badge: "Unsaved Playground",
    badgeClass: "warning",
    path: "/hello-from-playground/",
  },
  research: {
    title: "Research Browser Playground",
    contract: "Vanilla WordPress start",
    identity: "browser: research-browser-playground",
    storage: "Browser storage, refresh-safe on this device",
    badge: "Saved in this browser",
    badgeClass: "success",
    path: "/hello-from-playground/",
  },
  local: {
    title: "Local Plugin Lab",
    contract: "Local directory save",
    identity: "local: /Users/admin/Playgrounds/local-plugin-lab",
    storage: "Local directory, folder permission required after refresh",
    badge: "Saved to local directory",
    badgeClass: "",
    path: "/wp-admin/",
  },
};

function addEvent(title, body, tone = "") {
  state.eventCount += 1;
  const item = document.createElement("li");
  if (tone) item.classList.add(tone);
  item.innerHTML = `<strong>${title}</strong><span>${body}</span>`;
  $("#eventStream").prepend(item);
  $("#eventCount").textContent = `${state.eventCount} events`;
  $("#lastTransfer").textContent = body;
  $("#runtimeCardCopy").textContent = `Last event: ${body}`;
}

function setChip(element, text, chipClass = "") {
  element.className = "state-chip";
  if (chipClass) element.classList.add(chipClass);
  element.textContent = text;
}

function updateActiveSite(siteKey) {
  const site = sites[siteKey];
  if (!site) return;
  const previewLabels = {
    unsaved: "Temporary Playground active",
    research: "Browser-saved Playground active",
    local: "Local directory Playground active",
  };
  state.activeSite = siteKey;
  $("#activeTitle").textContent = site.title;
  $("#previewTitle").textContent = site.title;
  $("#activeContract").textContent = site.contract;
  $("#activeIdentity").textContent = site.identity;
  $("#selectedObject").textContent = site.identity;
  $("#activeStorage").textContent = site.storage;
  setChip($("#storageBadge"), site.badge, site.badgeClass);
  $("#previewStatus").textContent = previewLabels[siteKey] || site.badge;
  $("#runtimeCardTitle").textContent = site.contract;
  setPath(site.path);
  $$(".site-row").forEach((row) => row.classList.toggle("selected", row.dataset.site === siteKey));
}

function setPath(path) {
  $("#pathInput").value = path;
  $("#activePath").textContent = path;
  $("#previewUrl").textContent = path;
  $("#previewPathLabel").textContent = path;

  if (path.includes("wp-admin")) {
    $("#previewHeadline").textContent = "WordPress dashboard";
    $("#previewCopy").textContent = "The embedded admin is open for plugin, theme, page, and settings work without leaving the Playground shell.";
    $("#previewNote").textContent = "Site Manager remains available while the live admin path is active.";
  } else if (path.includes("sample-page")) {
    $("#previewHeadline").textContent = "Sample Page";
    $("#previewCopy").textContent = "A front-end WordPress page is loaded through the Playground path input.";
    $("#previewNote").textContent = "Refresh and path changes mutate the same active Playground object.";
  } else {
    $("#previewHeadline").textContent = "Hello from WordPress Playground!";
    $("#previewCopy").textContent = "This browser-saved Playground is ready for PR review, file inspection, Blueprint runs, and database export while the live site stays visible.";
    $("#previewNote").textContent = "You are logged in as admin. Save & Reload keeps this browser identity and refreshes the runtime.";
  }
}

function runProgress({ card, bar, text, steps, done }) {
  const progressCard = $(card);
  const progressBar = $(bar);
  const progressText = $(text);
  progressCard.hidden = false;
  progressBar.style.width = "0%";
  let index = 0;
  const tick = () => {
    const step = steps[index];
    progressText.textContent = step.label;
    progressBar.style.width = step.percent;
    index += 1;
    if (index < steps.length) {
      window.setTimeout(tick, 520);
    } else {
      window.setTimeout(() => {
        progressCard.hidden = true;
        done();
      }, 520);
    }
  };
  tick();
}

function sectionTo(id) {
  $$(".section-nav button").forEach((button) => button.classList.toggle("active", button.dataset.section === id));
  $$(".ledger-section").forEach((section) => section.classList.toggle("active", section.id === id));
}

function managerTo(tab) {
  state.activeManagerTab = tab;
  $$(".manager-tabs button").forEach((button) => button.classList.toggle("active", button.dataset.managerTab === tab));
  $$(".manager-panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.managerView === tab));
  const label = tab === "transfer" ? "Portability" : tab[0].toUpperCase() + tab.slice(1);
  $("#managerState").textContent = `${label} tab`;
  $("#previewManagerTab").textContent = label;
}

function renderBlueprints() {
  const search = $("#blueprintSearch").value.trim().toLowerCase();
  const items = blueprints.filter((blueprint) => {
    const matchesFilter = state.selectedBlueprintFilter === "All" || blueprint.tags.includes(state.selectedBlueprintFilter);
    const matchesSearch = !search || `${blueprint.title} ${blueprint.description} ${blueprint.tags.join(" ")}`.toLowerCase().includes(search);
    return matchesFilter && matchesSearch;
  });

  $("#galleryGrid").innerHTML = items.map((blueprint) => `
    <article class="blueprint-card">
      <div class="blueprint-shot">${blueprint.title}</div>
      <div class="blueprint-body">
        <h3>${blueprint.title}</h3>
        <p>${blueprint.description}</p>
        <div class="tag-row">${blueprint.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        <button class="button" type="button" data-blueprint="${blueprint.title}">Select Blueprint</button>
      </div>
    </article>
  `).join("");
}

function setContract(name, contract, identity, path, body) {
  sites.unsaved.title = name;
  sites.unsaved.contract = contract;
  sites.unsaved.identity = identity;
  sites.unsaved.path = path;
  updateActiveSite("unsaved");
  $("#previewStatus").textContent = "Preview runtime replaced";
  $("#runtimeCardTitle").textContent = contract;
  addEvent(contract, body, "warning");
}

$$(".section-nav button").forEach((button) => {
  button.addEventListener("click", () => sectionTo(button.dataset.section));
});

$$("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => sectionTo(button.dataset.jump));
});

$("#openManager").addEventListener("click", () => sectionTo("manager"));
$("#previewManager").addEventListener("click", () => sectionTo("manager"));

$("#pathInput").addEventListener("change", (event) => {
  setPath(event.target.value || "/");
  addEvent("Path changed", `Active preview navigated to ${event.target.value || "/"}.`);
});

$("#refreshButton").addEventListener("click", () => {
  $("#previewMeter").style.width = "100%";
  window.setTimeout(() => {
    $("#previewMeter").style.width = "34%";
  }, 650);
  addEvent("Preview refreshed", `Reloaded ${$("#pathInput").value} inside the protected shell.`);
});

$("#homeButton").addEventListener("click", () => {
  setPath("/hello-from-playground/");
  addEvent("Homepage opened", "Active path changed to /hello-from-playground/.");
});

$("#adminButton").addEventListener("click", () => {
  setPath("/wp-admin/");
  addEvent("WP Admin opened", "Active path changed to /wp-admin/.");
});

$$("[data-path]").forEach((button) => {
  button.addEventListener("click", () => {
    setPath(button.dataset.path);
    addEvent("Preview navigation", `WordPress link opened ${button.dataset.path}.`);
  });
});

$$("[data-launch]").forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.launch;
    if (type === "vanilla") {
      setContract("Unsaved Vanilla Playground", "Vanilla WordPress start", "temporary: vanilla-start", "/hello-from-playground/", "Fresh temporary WordPress runtime started.");
    }
    if (type === "wp-pr") {
      const value = $("#wpPrInput").value.trim();
      setContract("WordPress PR Preview", "WordPress PR contract", `core-pr: ${value}`, "/wp-admin/", `Validated Core PR input ${value} and opened a preview runtime.`);
    }
    if (type === "gb-pr") {
      const value = $("#gbInput").value.trim();
      setContract("Gutenberg Branch Preview", "Gutenberg PR or branch contract", `gutenberg: ${value}`, "/wp-admin/", `Loaded Gutenberg input ${value}; save and export actions now apply to this preview.`);
    }
    if (type === "github") {
      if (!state.githubConnected) {
        addEvent("GitHub connection required", "Import paused until a GitHub account is connected. Token will not be stored after refresh.", "warning");
        return;
      }
      const repo = $("#githubRepo").value.trim();
      runProgress({
        card: "#saveProgress",
        bar: "#saveProgressBar",
        text: "#saveProgressText",
        steps: [
          { label: "Reading repository tree...", percent: "25%" },
          { label: "Importing wp-content paths...", percent: "70%" },
          { label: "Finishing GitHub import...", percent: "100%" },
        ],
        done: () => setContract("GitHub Import Playground", "GitHub import contract", `github: ${repo}`, "/wp-admin/", `Imported ${repo}; source recorded in transfer history.`),
      });
    }
    if (type === "blueprint-url") {
      const url = $("#blueprintUrl").value.trim();
      runProgress({
        card: "#runtimeProgress",
        bar: "#runtimeProgressBar",
        text: "#runtimeProgressText",
        steps: [
          { label: "Fetching Blueprint URL...", percent: "33%" },
          { label: "Validating Blueprint JSON...", percent: "66%" },
          { label: "Applying Blueprint to runtime...", percent: "100%" },
        ],
        done: () => setContract("Blueprint URL Runtime", "Blueprint URL contract", `blueprint-url: ${url}`, "/hello-from-playground/", `Validated and ran ${url}; active preview content refreshed.`),
      });
    }
    if (type === "zip") {
      if (!state.zipSelected) {
        addEvent("ZIP import blocked", "No .zip selected. Current product opens a native file chooser before import.", "warning");
        return;
      }
      $("#resetConfirm").hidden = false;
      sectionTo("runtime");
      addEvent("ZIP replacement warning", "Selected playground-export.zip; confirmation required because files and database will be replaced.", "danger");
    }
  });
});

$("#connectGithub").addEventListener("click", () => {
  state.githubConnected = true;
  $("#connectGithub").textContent = "Account connected";
  addEvent("GitHub connected", "Public repository import/export can proceed. Access token is not stored across refresh.");
});

$("#selectZip").addEventListener("click", () => {
  state.zipSelected = true;
  $("#zipChoice").textContent = "playground-export.zip selected";
  addEvent("ZIP selected", "Native chooser returned playground-export.zip; validation and replacement warning are ready.");
});

$("#reviewReload").addEventListener("click", () => {
  $("#reloadConfirm").hidden = false;
  $("#resetConfirm").hidden = true;
  addEvent("Save & Reload reviewed", "Stored reload confirmation opened for the active browser-saved Playground.");
});

$("#cancelReload").addEventListener("click", () => {
  $("#reloadConfirm").hidden = true;
  addEvent("Save & Reload canceled", "Runtime settings remained unchanged.");
});

$("#confirmReload").addEventListener("click", () => {
  $("#reloadConfirm").hidden = true;
  const wp = $("#wpVersion").value;
  const php = $("#phpVersion").value;
  const lang = $("#language").value;
  const network = $("#networkAccess").checked ? "Network on" : "Network off";
  runProgress({
    card: "#runtimeProgress",
    bar: "#runtimeProgressBar",
    text: "#runtimeProgressText",
    steps: [
      { label: "Saving selected runtime options...", percent: "20%" },
      { label: "Reloading saved browser-backed Playground...", percent: "55%" },
      { label: "Restoring active path and Site Manager tabs...", percent: "82%" },
      { label: "Runtime badge updated.", percent: "100%" },
    ],
    done: () => {
      const badge = `WP ${wp} / PHP ${php} / ${lang} / ${network}`;
      $("#runtimeBadge").textContent = badge;
      $("#runtimeResultText").textContent = badge;
      $("#previewStatus").textContent = "Saved reload complete";
      $("#runtimeCardTitle").textContent = "Stored runtime reloaded";
      $("#runtimeCardCopy").textContent = `Last event: ${badge}`;
      $("#previewMeter").style.width = "72%";
      addEvent("Settings Save & Reload complete", `Final runtime badge: ${badge}. Browser identity and active row were preserved.`, "warning");
    },
  });
});

$("#showResetWarning").addEventListener("click", () => {
  $("#resetConfirm").hidden = false;
  $("#reloadConfirm").hidden = true;
  addEvent("Unsaved reset warning shown", "Temporary reset warning explains that files, database, logs, and current path are replaced.", "danger");
});

$("#cancelReset").addEventListener("click", () => {
  $("#resetConfirm").hidden = true;
  addEvent("Reset canceled", "No files, database rows, logs, or path values were changed.");
});

$("#confirmReset").addEventListener("click", () => {
  $("#resetConfirm").hidden = true;
  runProgress({
    card: "#runtimeProgress",
    bar: "#runtimeProgressBar",
    text: "#runtimeProgressText",
    steps: [
      { label: "Discarding temporary runtime...", percent: "30%" },
      { label: "Rebuilding WordPress files and SQLite database...", percent: "70%" },
      { label: "Opening reset Homepage...", percent: "100%" },
    ],
    done: () => {
      sites.unsaved.title = "Unsaved Playground";
      sites.unsaved.contract = "Settings reset result";
      sites.unsaved.identity = "temporary: reset-runtime";
      sites.unsaved.path = "/hello-from-playground/";
      updateActiveSite("unsaved");
      $("#runtimeBadge").textContent = "WP 6.9 / PHP 8.2 / pl_PL / Network off";
      $("#previewStatus").textContent = "Temporary runtime reset";
      $("#previewMeter").style.width = "18%";
      addEvent("Temporary reset complete", "Unsaved Playground was reset; saved and local rows remain available.", "danger");
    },
  });
});

$("#saveBrowser").addEventListener("click", () => {
  const name = $("#browserName").value.trim() || "Saved Playground";
  runProgress({
    card: "#saveProgress",
    bar: "#saveProgressBar",
    text: "#saveProgressText",
    steps: [
      { label: "Saving 842 / 3751 files to browser storage...", percent: "22%" },
      { label: "Saving 2380 / 3751 files to browser storage...", percent: "64%" },
      { label: "Saving 3751 / 3751 files to browser storage...", percent: "100%" },
    ],
    done: () => {
      sites.research.title = name;
      sites.research.identity = `browser: ${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
      sites.research.storage = "Browser storage, refresh-safe on this device";
      $(".site-row[data-site='research'] .row-title").textContent = name;
      $(".site-row[data-site='research'] span").textContent = sites.research.identity;
      updateActiveSite("research");
      addEvent("Browser save complete", `${name} is now saved in this browser with a Saved Playgrounds row and browser slug.`, "warning");
    },
  });
});

$("#cancelLocal").addEventListener("click", () => {
  addEvent("Local folder picker canceled", "No folder permission was granted; active storage did not change.");
});

$("#saveLocal").addEventListener("click", () => {
  const dir = $("#localDirectory").value.trim();
  runProgress({
    card: "#saveProgress",
    bar: "#saveProgressBar",
    text: "#saveProgressText",
    steps: [
      { label: "Requesting folder permission...", percent: "18%" },
      { label: "Writing files to local directory...", percent: "62%" },
      { label: "Recording reconnect requirement...", percent: "100%" },
    ],
    done: () => {
      sites.local.identity = `local: ${dir}`;
      updateActiveSite("local");
      addEvent("Local directory save complete", `Saved to ${dir}; refresh later requires folder permission before reload.`, "warning");
    },
  });
});

$$("[data-open-site]").forEach((button) => {
  button.addEventListener("click", () => {
    updateActiveSite(button.dataset.openSite);
    addEvent("Playground opened", `${sites[button.dataset.openSite].title} is now the selected active object.`);
  });
});

$("#renameButton").addEventListener("click", () => {
  const name = $("#renameInput").value.trim();
  if (!name || state.activeSite === "unsaved") {
    addEvent("Rename unavailable", "Temporary Playgrounds must be saved before rename is available.", "warning");
    return;
  }
  sites[state.activeSite].title = name;
  const rowTitle = $(`.site-row[data-site='${state.activeSite}'] strong`);
  if (rowTitle) rowTitle.textContent = name;
  updateActiveSite(state.activeSite);
  addEvent("Saved Playground renamed", `Selected row, shell title, and preview title changed to ${name}.`);
});

$("#startDelete").addEventListener("click", () => {
  if (state.activeSite === "unsaved") {
    addEvent("Delete skipped", "Unsaved Playground has no stored browser row to delete.", "warning");
    return;
  }
  $("#deleteConfirm").hidden = false;
  addEvent("Delete confirmation opened", `Deletion warning opened for ${sites[state.activeSite].title}.`, "danger");
});

$("#cancelDelete").addEventListener("click", () => {
  $("#deleteConfirm").hidden = true;
  addEvent("Delete canceled", "Saved row remains available and active site did not change.");
});

$("#confirmDelete").addEventListener("click", () => {
  const deleting = state.activeSite;
  $("#deleteConfirm").hidden = true;
  runProgress({
    card: "#saveProgress",
    bar: "#saveProgressBar",
    text: "#saveProgressText",
    steps: [
      { label: "Removing stored files...", percent: "35%" },
      { label: "Deleting Saved Playgrounds row...", percent: "75%" },
      { label: "Falling back to Unsaved Playground...", percent: "100%" },
    ],
    done: () => {
      const row = $(`.site-row[data-site='${deleting}']`);
      if (row) row.remove();
      updateActiveSite("unsaved");
      addEvent("Delete complete", "Saved row was removed; active shell fell back to Unsaved Playground.", "danger");
    },
  });
});

$$(".manager-tabs button").forEach((button) => {
  button.addEventListener("click", () => managerTo(button.dataset.managerTab));
});

$("#newFile").addEventListener("click", () => addEvent("File created", "/wordpress/wp-content/new-file.php appeared in the file tree."));
$("#newFolder").addEventListener("click", () => addEvent("Folder created", "/wordpress/wp-content/playground-assets appeared in the file tree."));
$("#uploadFile").addEventListener("click", () => addEvent("Upload complete", "theme-preview.css uploaded to /wordpress/wp-content/uploads/."));
$("#browseFiles").addEventListener("click", () => addEvent("Browse files", "Native file chooser opened for file import."));

$("#editFile").addEventListener("click", () => {
  setChip($("#fileDirty"), "Dirty", "warning");
  addEvent("File edited", "/wordpress/wp-config.php has unsaved changes.", "warning");
});

$("#saveFile").addEventListener("click", () => {
  setChip($("#fileDirty"), "Saved", "success");
  addEvent("File save complete", "/wordpress/wp-config.php saved and preview can be refreshed.");
});

$("#copyBlueprint").addEventListener("click", () => addEvent("Blueprint link copied", "Current Blueprint URL copied to clipboard result state."));
$("#downloadBlueprint").addEventListener("click", () => addEvent("Blueprint bundle downloaded", "Blueprint bundle prepared for download."));
$("#downloadBlueprint2").addEventListener("click", () => addEvent("Blueprint bundle downloaded", "Portability action downloaded the Blueprint bundle."));

$("#runBlueprint").addEventListener("click", () => {
  $("#blueprintResult").textContent = "Validation passed. Blueprint run completed and preview content refreshed.";
  setContract("Blueprint Run Result", "Blueprint editor run", `blueprint-editor: ${$("#managerBlueprintUrl").value}`, "/hello-from-playground/", "Blueprint editor validated and ran against the active Playground.");
});

$("#downloadDb").addEventListener("click", () => addEvent("Database downloaded", "database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite."));
$("#downloadDb2").addEventListener("click", () => addEvent("Database downloaded", "database.sqlite downloaded from the portability panel."));
$("#openAdminer").addEventListener("click", () => addEvent("Adminer opened", "Adminer launched against the SQLite-backed database."));
$("#openPhpmyadmin").addEventListener("click", () => addEvent("phpMyAdmin opened", "phpMyAdmin launched for the emulated MySQL database."));
$("#exportGithub").addEventListener("click", () => {
  if (!state.githubConnected) {
    addEvent("GitHub export paused", "Connect GitHub before exporting. Access token is not stored after refresh.", "warning");
    return;
  }
  addEvent("Export to GitHub complete", "Active Playground files exported to wordpress/wordpress-playground export branch.");
});
$("#downloadZip").addEventListener("click", () => addEvent("ZIP downloaded", "Active Playground files and database were packaged as playground-export.zip."));

$("#blueprintSearch").addEventListener("input", renderBlueprints);
$$(".filters button").forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedBlueprintFilter = button.dataset.filter;
    $$(".filters button").forEach((item) => item.classList.toggle("active", item === button));
    renderBlueprints();
  });
});

$("#galleryGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-blueprint]");
  if (!button) return;
  const title = button.dataset.blueprint;
  $("#blueprintUrl").value = `gallery:${title}`;
  addEvent("Blueprint selected", `${title} selected from a representative subset of 43 Blueprints.`);
});

renderBlueprints();
