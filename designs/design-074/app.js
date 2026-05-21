const blueprints = [
  {
    title: "Feed Reader with the Friends Plugin",
    desc: "Read feeds from the web with plugin setup, sample subscriptions, and network access.",
    tags: ["Featured", "Content", "Gutenberg"],
    includes: "Friends plugin, content, network access",
    constraint: "Network access stays visible before run.",
    theme: "theme-feed"
  },
  {
    title: "Art Gallery",
    desc: "Portfolio-style gallery with the Voeu theme and sample artwork content.",
    tags: ["Website", "Personal", "Themes"],
    includes: "Theme, pages, media library",
    constraint: "Media import adds setup time.",
    theme: "theme-art"
  },
  {
    title: "Coffee Shop",
    desc: "WooCommerce storefront with custom theme, products, cart, and checkout pages.",
    tags: ["Featured", "WooCommerce", "Website"],
    includes: "WooCommerce, theme, demo products",
    constraint: "Runs store setup steps before landing page.",
    theme: "theme-coffee"
  },
  {
    title: "Gaming News",
    desc: "News homepage using the Spiel theme with posts, categories, and menus.",
    tags: ["News", "Website", "Themes"],
    includes: "Theme, posts, navigation",
    constraint: "Imports over current content.",
    theme: "theme-news"
  },
  {
    title: "Non-profit Organization",
    desc: "Donation-centered organization site with campaign pages and calls to action.",
    tags: ["Website", "Content", "Featured"],
    includes: "Pages, theme, navigation",
    constraint: "Replaces homepage and menus.",
    theme: "theme-nonprofit"
  },
  {
    title: "Personal Blog",
    desc: "Substrata-powered personal blog with authored posts and simple archives.",
    tags: ["Personal", "Content", "Themes"],
    includes: "Theme, posts, comments",
    constraint: "Sample content is installed.",
    theme: "theme-blog"
  },
  {
    title: "Product Catalog",
    desc: "Small catalog site for checking product blocks without full checkout flow.",
    tags: ["WooCommerce", "Content"],
    includes: "Products, taxonomy, shop pages",
    constraint: "Store plugins are activated.",
    theme: "theme-store"
  },
  {
    title: "Site Editor Regression",
    desc: "Block theme setup for reproducing editor layout and template issues.",
    tags: ["Gutenberg", "Themes", "Experiments"],
    includes: "Block theme, templates, patterns",
    constraint: "Starts in wp-admin after run.",
    theme: "theme-editor"
  },
  {
    title: "Pattern Directory",
    desc: "Content-heavy pattern set for testing inserter search and synced pattern edits.",
    tags: ["Gutenberg", "Content"],
    includes: "Patterns, reusable blocks, pages",
    constraint: "Blueprint opens editor context.",
    theme: "theme-patterns"
  },
  {
    title: "Merch Shop",
    desc: "WooCommerce sample store with product imagery, taxes disabled, and cart tests.",
    tags: ["WooCommerce", "Featured"],
    includes: "WooCommerce, products, media",
    constraint: "Import can overwrite current database.",
    theme: "theme-shop"
  },
  {
    title: "Blocks Compatibility Lab",
    desc: "Mixed core blocks, custom post types, and template parts for plugin checks.",
    tags: ["Gutenberg", "Experiments"],
    includes: "Block fixtures, CPT content",
    constraint: "Experimental fixtures are not production data.",
    theme: "theme-blocks"
  },
  {
    title: "Multisite Trial",
    desc: "Network-ready setup for testing multisite options and admin paths.",
    tags: ["Experiments", "Website"],
    includes: "Multisite flag, demo sites",
    constraint: "Requires reset to change network mode.",
    theme: "theme-lab"
  }
];

const grid = document.querySelector("#blueprintGrid");
const search = document.querySelector("#blueprintSearch");
const count = document.querySelector("#catalogCount");
const drawerImage = document.querySelector("#drawerImage");
const drawerBadge = document.querySelector("#drawerBadge");
const drawerTitle = document.querySelector("#drawerTitle");
const drawerDesc = document.querySelector("#drawerDesc");
const drawerIncludes = document.querySelector("#drawerIncludes");
const drawerConstraint = document.querySelector("#drawerConstraint");
const drawerRoute = document.querySelector("#drawerRoute");
const resultTitle = document.querySelector("#resultTitle");
const resultCopy = document.querySelector("#resultCopy");
const resultStatus = document.querySelector("#resultStatus");
const flowSteps = document.querySelector("#flowSteps");
const shellStatus = document.querySelector("#shellStatus");
const saveState = document.querySelector("#saveState");
const saveDetail = document.querySelector("#saveDetail");
const saveProgress = document.querySelector("#saveProgress");
const nameInput = document.querySelector("#playgroundName");
const renameInput = document.querySelector("#renameInput");
const managerName = document.querySelector("#managerName");
const managerSavedText = document.querySelector("#managerSavedText");

let selected = blueprints[0];
let activeFilter = "All";
let destination = "browser";

function renderCards() {
  const query = search.value.trim().toLowerCase();
  const filtered = blueprints.filter((bp) => {
    const matchesFilter = activeFilter === "All" || bp.tags.includes(activeFilter);
    const text = `${bp.title} ${bp.desc} ${bp.tags.join(" ")}`.toLowerCase();
    return matchesFilter && text.includes(query);
  });

  count.textContent = `Showing ${filtered.length} of 43 blueprints`;
  grid.innerHTML = "";

  filtered.forEach((bp) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `blueprint-card ${bp.title === selected.title ? "selected" : ""}`;
    card.innerHTML = `
      <div class="bp-image ${bp.theme}" aria-hidden="true"></div>
      <div class="bp-body">
        <strong>${bp.title}</strong>
        <p>${bp.desc}</p>
        <div class="tag-row">${bp.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      </div>
    `;
    card.addEventListener("click", () => selectBlueprint(bp));
    grid.appendChild(card);
  });
}

function selectBlueprint(bp) {
  selected = bp;
  drawerImage.className = `drawer-image ${bp.theme}`;
  drawerBadge.textContent = bp.tags[0];
  drawerTitle.textContent = bp.title;
  drawerDesc.textContent = bp.desc;
  drawerIncludes.textContent = bp.includes;
  drawerConstraint.textContent = bp.constraint;
  drawerRoute.textContent = "Blueprint catalog";
  resultTitle.textContent = `Ready to run: ${bp.title}`;
  resultCopy.textContent = "Inspect the blueprint JSON or run it over the current temporary site. The reset consequence remains visible before action.";
  resultStatus.textContent = "Selected";
  renderFlow(["done", "active", "", "", ""]);
  renderCards();
}

function renderFlow(states) {
  const labels = [
    `Launch source selected: ${drawerRoute.textContent}`,
    selected ? `Run selected blueprint: ${selected.title}` : "Run selected source",
    `Choose save destination: ${destination === "browser" ? "browser storage" : "local directory"}`,
    "Progress and saved identity",
    "Rename, reset, export, or delete"
  ];

  flowSteps.innerHTML = labels.map((label, index) => `<li class="${states[index] || ""}">${label}</li>`).join("");
}

function runBlueprint() {
  resultTitle.textContent = `Running ${selected.title}`;
  resultCopy.textContent = "Blueprint steps are applying plugins, content, versions, and landing page. Importing over this temporary site will discard unsaved changes.";
  resultStatus.textContent = "Preparing";
  renderFlow(["done", "done", "active", "", ""]);

  window.setTimeout(() => {
    resultTitle.textContent = `${selected.title} is ready`;
    resultCopy.textContent = "WordPress is prepared at /hello-from-playground/. Save now to keep this reproducible bug case after refresh.";
    resultStatus.textContent = "Unsaved";
    resultStatus.className = "status-pill unsaved";
    renderFlow(["done", "done", "active", "", ""]);
    document.querySelector("#savePanel").scrollIntoView({ behavior: "smooth", block: "start" });
  }, 400);
}

function startRoute(route) {
  document.querySelectorAll(".source-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.source === route.label);
  });

  drawerRoute.textContent = route.label;
  resultTitle.textContent = route.title;
  resultCopy.textContent = route.copy;
  resultStatus.textContent = route.status;
  resultStatus.className = `status-pill ${route.status === "Ready" ? "saved" : "unsaved"}`;
  renderFlow(["done", "active", "", "", ""]);
}

function chooseDestination(button) {
  document.querySelectorAll(".destination").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  destination = button.dataset.destination;
  saveState.textContent = destination === "browser" ? "Ready to save in this browser" : "Ready to choose a local directory";
  saveDetail.textContent = destination === "browser"
    ? "Destination: browser storage"
    : "Destination: local folder permission required";
  saveProgress.style.width = "0";
  renderFlow(["done", "done", "active", "", ""]);
}

function savePlayground() {
  const total = destination === "browser" ? 3751 : 3751;
  const target = destination === "browser" ? "browser storage" : "Research-Browser-Playground local directory";
  saveState.textContent = `Saving 3028 / ${total} files`;
  saveDetail.textContent = `Copying files to ${target}`;
  saveProgress.style.width = "62%";
  renderFlow(["done", "done", "done", "active", ""]);

  window.setTimeout(() => {
    saveState.textContent = destination === "browser" ? "Saved in this browser" : "Saved to selected local directory";
    saveDetail.textContent = destination === "browser"
      ? "site-slug: research-browser"
      : "Directory sync is active for future changes";
    saveProgress.style.width = "100%";
    shellStatus.textContent = "Saved Playground";
    shellStatus.className = "status-pill saved";
    resultStatus.textContent = "Ready";
    resultStatus.className = "status-pill saved";
    managerSavedText.textContent = destination === "browser"
      ? "Saved in this browser a moment ago"
      : "Synced to a local directory a moment ago";
    renderFlow(["done", "done", "done", "done", "active"]);
  }, 520);
}

function renameSelected() {
  const nextName = renameInput.value.trim() || "Research Browser Playground";
  nameInput.value = nextName;
  managerName.textContent = nextName;

  const selectedRow = document.querySelector(".saved-row.selected strong");
  if (selectedRow) {
    selectedRow.textContent = nextName;
  }

  resultTitle.textContent = `Renamed to ${nextName}`;
  resultCopy.textContent = "Saved management keeps the stored identity and site-slug visible while allowing a direct rename.";
  renderFlow(["done", "done", "done", "done", "done"]);
}

function deleteSelected() {
  const selectedRow = document.querySelector(".saved-row.selected");
  if (!selectedRow) return;

  resultTitle.textContent = `Delete queued: ${selectedRow.dataset.name}`;
  resultCopy.textContent = "Deletion is destructive for the stored Playground. The unsaved temporary site remains marked as discardable on refresh.";
  resultStatus.textContent = "Confirm delete";
  resultStatus.className = "status-pill unsaved";
}

document.querySelectorAll(".category-strip button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".category-strip button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderCards();
  });
});

search.addEventListener("input", renderCards);

document.querySelector("#runBlueprint").addEventListener("click", runBlueprint);
document.querySelector("#inspectBlueprint").addEventListener("click", () => {
  resultTitle.textContent = `Inspecting blueprint.json for ${selected.title}`;
  resultCopy.textContent = "The Blueprint tab shows copy link, download bundle, editable JSON, and run controls for the current bundle.";
  resultStatus.textContent = "Inspecting";
  document.querySelector('[data-tab="blueprintTab"]').click();
  document.querySelector("#managerPanel").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelectorAll("[data-start]").forEach((button) => {
  button.addEventListener("click", () => {
    const routes = {
      "vanilla": {
        label: "Vanilla WordPress",
        title: "Starting a fresh Vanilla WordPress Playground",
        copy: "No extra inputs required. Latest WordPress and PHP 8.3 are prepared, then the temporary site can be saved.",
        status: "Preparing"
      },
      "wordpress-pr": {
        label: "WordPress PR",
        title: "Previewing WordPress core PR",
        copy: "Requires a PR number or URL. This route applies the core patch before WordPress boots.",
        status: "Preparing"
      },
      "gutenberg-pr": {
        label: "Gutenberg PR",
        title: "Previewing Gutenberg PR or branch",
        copy: "Accepts a PR number, URL, or branch name, then installs the matching Gutenberg plugin build.",
        status: "Preparing"
      },
      "github": {
        label: "GitHub import",
        title: "GitHub account connection required",
        copy: "Imports public plugin, theme, or wp-content repositories. Access token is not stored and must be reconnected after refresh.",
        status: "Needs auth"
      },
      "blueprint-url": {
        label: "Blueprint URL",
        title: "Running Blueprint from URL",
        copy: "Requires a blueprint.json URL. Running it over the current Playground can replace content and settings.",
        status: "Ready"
      },
      "zip": {
        label: "ZIP import",
        title: "Import .zip over current site",
        copy: "The native file chooser opens for a .zip export. Importing replaces the current WordPress files and database.",
        status: "Destructive"
      }
    };
    startRoute(routes[button.dataset.start]);
  });
});

document.querySelectorAll(".destination").forEach((button) => {
  button.addEventListener("click", () => chooseDestination(button));
});

document.querySelector("#saveNow").addEventListener("click", savePlayground);
document.querySelector("#renameSelected").addEventListener("click", renameSelected);
document.querySelector("#deleteSelected").addEventListener("click", deleteSelected);

document.querySelectorAll(".saved-row").forEach((row) => {
  row.addEventListener("click", () => {
    document.querySelectorAll(".saved-row").forEach((item) => item.classList.remove("selected"));
    row.classList.add("selected");
    renameInput.value = row.dataset.name;
    resultTitle.textContent = `Selected: ${row.dataset.name}`;
    resultCopy.textContent = row.dataset.name === "Unsaved Playground"
      ? "This site is temporary. Refresh or close will discard it unless it is saved first."
      : "This browser-backed Playground can be renamed, opened, exported, or deleted.";
  });
});

document.querySelectorAll("[data-open]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(`#${button.dataset.open}`).scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll(".manager-tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".manager-tabs button").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    document.querySelector(`#${button.dataset.tab}`).classList.add("active");
  });
});

document.querySelector("#resetReload").addEventListener("click", () => {
  resultTitle.textContent = "Settings reset requested";
  resultCopy.textContent = "For an unsaved Playground this is destructive; for a stored Playground the changed settings are saved and the site reloads.";
  resultStatus.textContent = "Reset warning";
  resultStatus.className = "status-pill unsaved";
});

document.querySelector("#downloadZip").addEventListener("click", () => {
  resultTitle.textContent = "Download .zip prepared";
  resultCopy.textContent = "The current Playground files and database are bundled for export or later .zip import.";
});

document.querySelector("#exportGithub").addEventListener("click", () => {
  resultTitle.textContent = "Export to GitHub";
  resultCopy.textContent = "The additional action connects the current Playground to a GitHub export workflow.";
});

document.querySelector("#managerExport").addEventListener("click", () => {
  resultTitle.textContent = "Site Manager export";
  resultCopy.textContent = "Additional actions expose Export to GitHub and Download as .zip without leaving the active site.";
  document.querySelector("#sourceResult").scrollIntoView({ behavior: "smooth", block: "start" });
});

renderCards();
selectBlueprint(selected);
