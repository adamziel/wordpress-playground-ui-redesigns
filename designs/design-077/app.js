const routes = {
  vanilla: {
    badge: "W",
    flow: "Vanilla WordPress",
    title: "Start Vanilla WordPress",
    description: "Create a clean temporary Playground using the selected WordPress and PHP versions.",
    warning: "Current temporary work is replaced when this start command runs.",
    fields: [
      ["WordPress version", "select", ["Latest stable", "6.8.x", "Nightly"]],
      ["PHP version", "select", ["PHP 8.3", "PHP 8.2", "PHP 8.1"]],
    ],
    result: "Ready to start Vanilla WordPress",
  },
  "wordpress-pr": {
    badge: "PR",
    flow: "WordPress PR",
    title: "Preview a WordPress PR",
    description: "Run WordPress core from a pull request before it lands in trunk.",
    warning: "Requires a WordPress PR number or GitHub PR URL. The preview replaces the current temporary site.",
    fields: [
      ["PR number or URL", "input", "https://github.com/WordPress/wordpress-develop/pull/1234"],
      ["PHP version", "select", ["PHP 8.3", "PHP 8.2", "PHP 8.1"]],
    ],
    result: "Ready to preview WordPress PR",
  },
  "gutenberg-pr": {
    badge: "GB",
    flow: "Gutenberg PR or branch",
    title: "Preview a Gutenberg PR or Branch",
    description: "Install a Gutenberg pull request, GitHub URL, or named branch into the Playground.",
    warning: "Accepts PR number, URL, or branch name. Existing wp-content changes should be saved first.",
    fields: [
      ["PR number, URL, or branch", "input", "trunk"],
      ["WordPress version", "select", ["Latest stable", "Nightly", "6.8.x"]],
    ],
    result: "Ready to preview Gutenberg branch",
  },
  github: {
    badge: "GH",
    flow: "From GitHub",
    title: "Import from GitHub",
    description: "Import plugins, themes, or wp-content directories from a public repository.",
    warning: "Connect GitHub to create a temporary access token. The token is not stored and refresh requires re-authentication.",
    fields: [
      ["Repository URL", "input", "https://github.com/example/client-plugin"],
      ["Import target", "select", ["Plugin", "Theme", "wp-content directory"]],
    ],
    result: "Waiting for GitHub connection",
  },
  "blueprint-url": {
    badge: "URL",
    flow: "Blueprint URL",
    title: "Run Blueprint from URL",
    description: "Fetch and run a hosted blueprint.json against a new Playground.",
    warning: "Running a remote Blueprint replaces the current site unless this project is saved first.",
    fields: [
      ["Blueprint URL", "input", "https://example.com/blueprint.json"],
      ["Network access", "select", ["Allow network access", "Block network access"]],
    ],
    result: "Ready to run Blueprint URL",
  },
  zip: {
    badge: "ZIP",
    flow: "Import .zip",
    title: "Import a Playground .zip",
    description: "Open the native file chooser and import a zipped Playground archive.",
    warning: "The selected .zip imports over the current site. Save a copy before continuing.",
    fields: [
      ["Archive", "input", "client-site-export.zip"],
      ["Import behavior", "select", ["Replace current Playground", "Cancel and save first"]],
    ],
    result: "Native file chooser will open",
  },
};

const blueprintData = [
  ["Art Gallery", "Website,Personal,Themes,Featured", "An art gallery created with the Vueo theme."],
  ["Coffee Shop", "WooCommerce,Website,Featured", "A stylish WooCommerce coffee shop storefront with custom theme, products, and content."],
  ["Feed Reader with the Friends Plugin", "Content,Experiments,Featured", "Read feeds from the web in Playground using the Friends plugin."],
  ["Gaming News", "Website,News,Featured", "A gaming news site created with the Spiel theme."],
  ["Non-profit Organization", "Website,Content,Featured", "A donation-focused organization site with pages and media."],
  ["Personal Blog", "Personal,Website,Themes", "A personal blog created with the Substrata theme."],
  ["Block Theme Starter", "Themes,Gutenberg", "A minimal block theme with templates and style variations."],
  ["Pattern Directory Demo", "Gutenberg,Content", "A content-rich site showing curated block patterns."],
  ["Woo Product Launch", "WooCommerce,Website", "A single product launch with checkout and seeded products."],
  ["Newsroom Briefing", "News,Content", "A compact editorial news site with categories and sample posts."],
  ["Agency Client Review", "Website,Content", "Pages, navigation, and sample media for a client review pass."],
  ["Classic Theme Test", "Themes,Website", "A classic theme compatibility sandbox."],
  ["Interactivity API Counter", "Gutenberg,Experiments", "A demo of interactive blocks and client-side state."],
  ["Multisite Sandbox", "Experiments,Website", "A network-ready Playground for multisite checks."],
  ["Plugin QA Fixture", "Experiments,Gutenberg", "Seed content and plugins for regression testing."],
  ["Portfolio Blocks", "Personal,Gutenberg", "A portfolio site assembled from block patterns."],
  ["Restaurant Menu", "Website,Content", "Menu pages, opening hours, and sample posts."],
  ["Learning Course", "Content,Website", "Course-style pages and sample lessons."],
  ["Documentation Site", "Content,Themes", "A docs-oriented site with hierarchy and search-ready content."],
  ["Landing Page Pack", "Website,Gutenberg", "Reusable landing page patterns and forms."],
  ["Storefront Trial", "WooCommerce,Featured", "WooCommerce storefront with sample catalog and cart."],
  ["Checkout Blocks", "WooCommerce,Gutenberg", "Checkout block testing with seeded orders."],
  ["Full Site Editing Lab", "Gutenberg,Themes", "Templates, parts, and global styles for site editing."],
  ["Theme Variation Matrix", "Themes,Experiments", "Compare style variations across pages."],
  ["Media Library Fixture", "Content,Experiments", "Posts and image-heavy content for media tests."],
  ["Comments Moderation", "Content,Website", "Seeded comments and posts for moderation workflows."],
  ["Events Calendar", "Website,Content", "Event listings, dates, and venue-style pages."],
  ["Magazine Layout", "News,Themes", "Editorial layout using magazine-style templates."],
  ["Recipe Journal", "Personal,Content", "Personal recipe posts and archive templates."],
  ["Accessibility Review", "Experiments,Website", "Content arranged for accessibility and keyboard checks."],
  ["REST API Fixture", "Experiments,Content", "Sample posts, users, and custom fields for API checks."],
  ["Translated Site", "Website,Content", "Localized content and language settings for review."],
  ["Theme Unit Content", "Themes,Content", "Theme unit test content imported into Playground."],
  ["E-commerce Coupons", "WooCommerce,Content", "Coupons, orders, and seeded customer flows."],
  ["Product Variations", "WooCommerce,Experiments", "Variable products and inventory states."],
  ["Gutenberg Nightly", "Gutenberg,Experiments", "Nightly Gutenberg branch with demo content."],
  ["Navigation Block Lab", "Gutenberg,Themes", "Menus and navigation block scenarios."],
  ["Synced Pattern Demo", "Gutenberg,Content", "Synced and unsynced pattern examples."],
  ["Minimal Publisher", "News,Personal", "A small publishing site with archive pages."],
  ["Plugin Directory Preview", "Experiments,Website", "Install and inspect public plugin previews."],
  ["Client Handoff Site", "Website,Featured", "A staged client handoff with saved pages and assets."],
  ["Blueprint Authoring Kit", "Experiments,Content", "A blueprint.json authoring and run fixture."],
  ["Admin Workflow Sample", "Website,Content", "WP Admin content and settings for workflow demos."],
];

let activeRoute = "vanilla";
let activeSave = "browser";
let activeCategory = "All";
let selectedBlueprint = blueprintData[1];

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function buildField(label, type, value) {
  if (type === "select") {
    return `<label><span>${label}</span><select>${value.map((item) => `<option>${item}</option>`).join("")}</select></label>`;
  }
  return `<label><span>${label}</span><input value="${value}" aria-label="${label}"></label>`;
}

function setRoute(routeKey) {
  activeRoute = routeKey;
  const route = routes[routeKey];
  qsa(".route-card").forEach((button) => button.classList.toggle("active", button.dataset.route === routeKey));
  qs("#routeBadge").textContent = route.badge;
  qs("#routeTitle").textContent = route.title;
  qs("#routeDescription").textContent = route.description;
  qs("#routeWarning").textContent = route.warning;
  qs("#routeFields").innerHTML = route.fields.map((field) => buildField(...field)).join("");
  qs("#flowSource").textContent = route.flow;
  qs("#resultsTitle").textContent = route.result;
  qs("#summaryRoute").textContent = route.flow;
  qs("#summaryResult").textContent = "Route selected: " + route.title;
}

function setSaveDestination(destination) {
  activeSave = destination;
  qsa(".save-card").forEach((button) => button.classList.toggle("active", button.dataset.save === destination));
  const browser = destination === "browser";
  qs("#saveResultTitle").textContent = browser ? "Browser save selected" : "Local directory save selected";
  qs("#saveResultCopy").textContent = browser
    ? "Ready to copy 3,751 files into browser storage."
    : "Ready to request folder permission and mount the saved local directory.";
  qs("#saveProgressBar").style.width = browser ? "22%" : "12%";
  qs("#flowDestination").textContent = browser ? "Save in this browser" : "Save to a local directory";
  qs("#summarySave").textContent = browser ? "Browser storage" : "Local directory";
}

function completeSave() {
  const browser = activeSave === "browser";
  qs("#saveProgressBar").style.width = "100%";
  qs("#saveResultTitle").textContent = browser ? "Saved in this browser" : "Saved to local directory";
  qs("#saveResultCopy").textContent = browser
    ? "Saving complete: 3,751 / 3,751 files copied. Saved entry created."
    : "Directory mounted and reloaded. Local save is now the active Playground.";
  qs("#flowProgress").textContent = browser ? "3,751 / 3,751 files copied" : "directory permission granted";
  qs("#flowResult").textContent = browser ? "saved browser project" : "saved local directory project";
  qs("#projectStatus").textContent = browser ? "Saved Playground" : "Saved local directory";
  qs("#projectStatus").classList.remove("unsaved");
  qs("#resultsStatus").textContent = "Saved";
  qs("#summaryState").textContent = browser ? "Saved in this browser" : "Saved to a local directory";
  qs("#summaryResult").textContent = qs("#saveResultCopy").textContent;
}

function simulateAction(action) {
  if (action === "rename") {
    qs("#savedProjectName").textContent = "Client Research Browser";
    qs("h1").childNodes[0].textContent = "Client Research Browser ";
    qs("#summaryResult").textContent = "Saved Playground renamed to Client Research Browser";
  }
  if (action === "delete") {
    qs("#savedProjectRow").classList.add("pending-delete");
    qs("#savedProjectRow").style.background = "var(--red-soft)";
    qs("#summaryResult").textContent = "Delete requested: confirmation warns this browser-backed Playground will be removed.";
  }
  if (action === "refresh") {
    qs("#summaryResult").textContent = "Embedded WordPress page refreshed at /hello-from-playground/";
  }
  if (action === "run-blueprint") {
    qs("#summaryResult").textContent = "Blueprint run queued: " + selectedBlueprint[0] + " will replace the current temporary site unless saved.";
    qs("#resultsStatus").textContent = "Blueprint queued";
  }
}

function setPanel(panel) {
  qsa(".tab-button").forEach((button) => button.classList.toggle("active", button.dataset.panel === panel));
  qsa(".manager-panel").forEach((element) => element.classList.toggle("active", element.id === "panel-" + panel));
}

function artClass(index) {
  return "art-" + ((index % 6) + 1);
}

function blueprintMatches(item) {
  const [title, categories, description] = item;
  const text = `${title} ${categories} ${description}`.toLowerCase();
  const query = qs("#blueprintSearch").value.trim().toLowerCase();
  const categoryMatch = activeCategory === "All" || categories.split(",").includes(activeCategory);
  return categoryMatch && (!query || text.includes(query));
}

function renderBlueprints() {
  const list = qs("#catalogList");
  const matches = blueprintData.filter(blueprintMatches);
  qs("#catalogCount").textContent = `Showing ${matches.length} of ${blueprintData.length} catalog entries`;
  list.innerHTML = matches.map((item) => {
    const originalIndex = blueprintData.indexOf(item);
    const active = item[0] === selectedBlueprint[0] ? " active" : "";
    return `<button class="blueprint-row${active}" data-blueprint="${originalIndex}">
      <span class="thumb ${artClass(originalIndex)}"></span>
      <span><strong>${item[0]}</strong><small>${item[2]}</small><small>${item[1].replaceAll(",", " - ")}</small></span>
    </button>`;
  }).join("");
  if (!matches.length) {
    list.innerHTML = `<div class="empty-state">No blueprints match this search and category combination.</div>`;
  }
}

function selectBlueprint(index) {
  selectedBlueprint = blueprintData[index];
  qs("#selectedBlueprintTitle").textContent = selectedBlueprint[0];
  qs("#selectedBlueprintText").textContent = selectedBlueprint[2];
  qs("#selectedBlueprintTags").innerHTML = selectedBlueprint[1].split(",").map((tag) => `<span>${tag}</span>`).join("");
  qs("#selectedBlueprintArt").className = "preview-art selected-art " + artClass(index);
  qs("#summaryResult").textContent = "Blueprint selected: " + selectedBlueprint[0];
  renderBlueprints();
}

function jumpTo(sectionId) {
  const section = qs("#" + sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

qsa(".route-card").forEach((button) => {
  button.addEventListener("click", () => setRoute(button.dataset.route));
});

qsa(".save-card").forEach((button) => {
  button.addEventListener("click", () => setSaveDestination(button.dataset.save));
});

qsa(".tab-button").forEach((button) => {
  button.addEventListener("click", () => setPanel(button.dataset.panel));
});

qsa("[data-target-section]").forEach((button) => {
  button.addEventListener("click", () => jumpTo(button.dataset.targetSection));
});

qsa("[data-simulate]").forEach((button) => {
  button.addEventListener("click", () => simulateAction(button.dataset.simulate));
});

qs("#completeSave").addEventListener("click", completeSave);

qs("#runRoute").addEventListener("click", () => {
  const route = routes[activeRoute];
  qs("#flowProgress").textContent = "command accepted";
  qs("#flowResult").textContent = route.flow + " preview running";
  qs("#resultsStatus").textContent = "Running";
  qs("#summaryResult").textContent = route.title + " started. Current unsaved site will be replaced.";
});

qs("#commandSearch").addEventListener("input", (event) => {
  const value = event.target.value.toLowerCase();
  const found = Object.entries(routes).find(([, route]) => {
    return `${route.title} ${route.description} ${route.flow}`.toLowerCase().includes(value);
  });
  if (found && value.length > 2) {
    setRoute(found[0]);
  }
});

qs("#categoryFilters").addEventListener("click", (event) => {
  if (!event.target.matches(".filter")) return;
  activeCategory = event.target.dataset.category;
  qsa(".filter").forEach((button) => button.classList.toggle("active", button === event.target));
  renderBlueprints();
});

qs("#blueprintSearch").addEventListener("input", renderBlueprints);

qs("#catalogList").addEventListener("click", (event) => {
  const row = event.target.closest(".blueprint-row");
  if (row) {
    selectBlueprint(Number(row.dataset.blueprint));
  }
});

setRoute("vanilla");
setSaveDestination("browser");
renderBlueprints();
selectBlueprint(1);
