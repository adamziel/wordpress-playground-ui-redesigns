const blueprints = {
  "Art Gallery": {
    description: "Visual site demo with curated artwork content.",
    tags: ["Website", "Personal"],
    theme: "art",
    steps: ["installTheme", "importWxr", "login"]
  },
  "Coffee Shop": {
    description: "WooCommerce storefront with theme, products, and pages.",
    tags: ["WooCommerce", "Store"],
    theme: "coffee",
    steps: ["installPlugin", "installTheme", "importProducts", "login"]
  },
  "Feed Reader with the Friends Plugin": {
    description: "Read and subscribe to feeds through the Friends plugin.",
    tags: ["Content", "Plugin"],
    theme: "feed",
    steps: ["installPlugin", "activatePlugin", "importWxr", "login"]
  },
  "Gaming News": {
    description: "News publication using the Spiel theme and sample articles.",
    tags: ["News", "Website"],
    theme: "gaming",
    steps: ["installTheme", "importWxr", "login"]
  },
  "Non-profit Organization": {
    description: "Campaign and donation-oriented site with organization pages.",
    tags: ["Website", "Org"],
    theme: "nonprofit",
    steps: ["installTheme", "importWxr", "login"]
  },
  "Personal Blog": {
    description: "Substrata theme blog for long-form posts and archives.",
    tags: ["Personal", "Blog"],
    theme: "blog",
    steps: ["installTheme", "importWxr", "login"]
  },
  "Twenty Twenty-Five Theme": {
    description: "Current default theme review with starter content.",
    tags: ["Themes", "Website"],
    theme: "theme",
    steps: ["setSiteOptions", "importWxr", "login"]
  },
  "Gutenberg Nightly": {
    description: "Editor-focused Playground with latest Gutenberg plugin.",
    tags: ["Gutenberg", "Plugin"],
    theme: "gutenberg",
    steps: ["installPlugin", "activatePlugin", "login"]
  },
  "Block Theme Test": {
    description: "Full-site editing fixtures for block theme QA.",
    tags: ["Gutenberg", "Themes"],
    theme: "block",
    steps: ["installTheme", "setSiteOptions", "login"]
  },
  "WooCommerce Smoke Test": {
    description: "Store setup for quick product, cart, and checkout checks.",
    tags: ["WooCommerce", "QA"],
    theme: "woo",
    steps: ["installPlugin", "importProducts", "login"]
  },
  "Media Library Fixtures": {
    description: "Images, captions, and attachment data for media workflows.",
    tags: ["Content", "Media"],
    theme: "media",
    steps: ["importMedia", "importWxr", "login"]
  },
  "REST API Fixture Site": {
    description: "Posts, users, and taxonomies for API response review.",
    tags: ["Experiments", "Content"],
    theme: "rest",
    steps: ["importWxr", "setSiteOptions", "login"]
  }
};

let selectedBlueprint = "Art Gallery";
let activeFilter = "All";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function setSection(name) {
  $$(".content").forEach((section) => section.classList.remove("active"));
  $(`#section-${name}`).classList.add("active");
  $$(".rail-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.section === name);
  });
}

function setActivity(text, width = 42) {
  $("#activityText").textContent = text;
  $("#activityProgress").style.width = `${width}%`;
}

function markFlow(index) {
  $$("#flowSteps li").forEach((step, stepIndex) => {
    step.classList.toggle("done", stepIndex <= index);
  });
}

function selectBlueprint(title) {
  selectedBlueprint = title;
  const blueprint = blueprints[title];
  if (!blueprint) return;

  $$(".table-row").forEach((row) => {
    row.classList.toggle("selected", row.dataset.blueprint === title);
  });

  $("#selectedTitle").textContent = title;
  $("#selectedDescription").textContent = blueprint.description;
  $("#blueprintPreview").className = `preview-tile ${blueprint.theme}`;
  $("#blueprintJson").textContent = JSON.stringify({
    "$schema": "https://playground.wordpress.net/blueprint-schema.json",
    meta: { title },
    preferredVersions: { php: "8.3", wp: "latest" },
    landingPage: "/hello-from-playground/",
    login: true,
    steps: blueprint.steps
  }, null, 2);
  setActivity(`${title} selected. Ready to inspect, run, or save.`, 18);
  markFlow(0);
}

function filterCatalog() {
  const query = $("#catalogSearch").value.trim().toLowerCase();
  let visible = 0;

  $$(".table-row").forEach((row) => {
    const title = row.dataset.blueprint.toLowerCase();
    const tags = row.dataset.tags.toLowerCase();
    const matchesFilter = activeFilter === "All" || row.dataset.tags.includes(activeFilter);
    const matchesQuery = !query || title.includes(query) || tags.includes(query) || row.textContent.toLowerCase().includes(query);
    const isVisible = matchesFilter && matchesQuery;
    row.classList.toggle("is-hidden", !isVisible);
    if (isVisible) visible += 1;
  });

  $("#catalogCount").textContent = activeFilter === "All" && !query ? "12 visible rows" : `${visible} matching rows`;
}

function runSelected() {
  setActivity(`Preparing WordPress from ${selectedBlueprint}. Importing Blueprint steps over the current temporary site.`, 68);
  markFlow(1);
  setSection("desk");
}

function completeSave(destination) {
  const name = $("#saveName").value.trim() || "Research Browser Playground";
  const local = destination === "local";
  const progress = $("#saveProgress");
  const label = local ? "Requesting local directory access" : "Saving 3028 / 3751 files";
  progress.querySelector("span").textContent = label;
  progress.querySelector("i").style.width = local ? "52%" : "78%";
  setActivity(local ? "Choose a local directory, then Playground writes the saved site there." : "Saving to browser storage. File-copy progress is visible before the site receives a slug.", 78);

  window.setTimeout(() => {
    progress.querySelector("span").textContent = local ? "Saved to selected local directory" : "Saved in this browser as /research-browser-playground/";
    progress.querySelector("i").style.width = "100%";
    $("#shellSaveState").textContent = "Saved Playground";
    $("#shellSaveState").classList.remove("unsaved");
    $("#shellSaveState").classList.add("saved");
    $("#savedNameCell").textContent = name;
    setActivity(`${name} is saved. Rename and delete actions are available in the saved table.`, 100);
    markFlow(3);
  }, 500);
}

function updateDestination() {
  $$(".destination").forEach((destination) => {
    const input = $("input", destination);
    destination.classList.toggle("selected", input.checked);
  });
}

function managerTab(name) {
  $$(".manager-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.manager === name));
  $$(".manager-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `manager-${name}`));
}

function temporaryNotice(message, width = 55) {
  setActivity(message, width);
  window.setTimeout(() => setActivity(`${selectedBlueprint} selected. Ready to inspect, run, or save.`, 24), 1600);
}

$$(".rail-item").forEach((button) => {
  button.addEventListener("click", () => setSection(button.dataset.section));
});

$$("[data-section-jump], [data-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.sectionJump || button.dataset.open;
    if (target === "save" || target === "sites") setSection("sites");
    else if (target === "blueprint-url" || target === "starts") setSection("starts");
    else if (target === "manager") setSection("manager");
    else setSection(target);

    if (target === "blueprint-url") {
      $("#blueprint-url").scrollIntoView({ block: "center", behavior: "smooth" });
    }
  });
});

$$(".table-row").forEach((row) => {
  row.addEventListener("click", () => selectBlueprint(row.dataset.blueprint));
});

$$(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    activeFilter = chip.dataset.filter;
    $$(".chip").forEach((item) => item.classList.toggle("active", item === chip));
    filterCatalog();
  });
});

$("#catalogSearch").addEventListener("input", filterCatalog);

$$("input[name='dest']").forEach((input) => {
  input.addEventListener("change", updateDestination);
});

$$(".manager-tab").forEach((button) => {
  button.addEventListener("click", () => managerTab(button.dataset.manager));
});

document.addEventListener("click", (event) => {
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;
  const action = actionTarget.dataset.action;

  if (action === "run-selected" || action === "run-current-blueprint") runSelected();
  if (action === "inspect-json") $("#blueprintJson").classList.toggle("open");
  if (action === "copy-blueprint") temporaryNotice("Blueprint link copied for review handoff.", 46);
  if (action === "download-blueprint") temporaryNotice("Blueprint bundle download prepared.", 46);
  if (action === "save-browser") completeSave("browser");
  if (action === "save-local") completeSave("local");
  if (action === "rename-site") {
    $("#savedNameCell").textContent = "Renamed Blueprint Review Playground";
    temporaryNotice("Saved Playground renamed in browser storage.", 74);
  }
  if (action === "delete-site") {
    actionTarget.closest(".saved-row").classList.add("is-hidden");
    temporaryNotice("Saved Playground deleted. Current temporary site remains visible until reset or import.", 38);
  }
  if (action === "start-vanilla") temporaryNotice("Starting a fresh Vanilla WordPress Playground.", 62);
  if (action === "start-wp-pr") temporaryNotice("Previewing a WordPress core PR from a number or GitHub URL.", 62);
  if (action === "start-gb-pr") temporaryNotice("Previewing a Gutenberg PR, URL, or branch build.", 62);
  if (action === "connect-github") temporaryNotice("GitHub connection requested. Token is not stored after refresh.", 52);
  if (action === "run-url") temporaryNotice("Running Blueprint URL over the current unsaved Playground.", 68);
  if (action === "import-zip") temporaryNotice("Native file chooser opened for .zip import. Import replaces current site.", 48);
  if (action === "new-unsaved") temporaryNotice("New unsaved Playground added to the temporary list.", 28);
  if (action === "reset-settings") temporaryNotice("Settings reset warning acknowledged. Playground is rebuilding.", 64);
  if (action === "save-reload") temporaryNotice("Saved Playground settings are being saved and reloaded.", 68);
  if (action === "download-zip") temporaryNotice("Current Playground .zip export prepared.", 72);
  if (action === "export-github") temporaryNotice("Export to GitHub starts from additional actions.", 58);
  if (action === "wp-admin") {
    $("#pathInput").value = "/wp-admin/";
    temporaryNotice("WordPress frame navigated to /wp-admin/.", 32);
  }
  if (action === "homepage") {
    $("#pathInput").value = "/hello-from-playground/";
    temporaryNotice("WordPress frame returned to the homepage.", 32);
  }
  if (action === "refresh") temporaryNotice("Refreshing the active embedded WordPress page.", 32);
  if (action === "go-path") temporaryNotice(`Navigating WordPress frame to ${$("#pathInput").value}.`, 34);
});

selectBlueprint(selectedBlueprint);
