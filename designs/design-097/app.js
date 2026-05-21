const routeButtons = [...document.querySelectorAll(".route-row")];
const routeTag = document.querySelector("#route-tag");
const routeInput = document.querySelector("#route-input");
const routeLabel = document.querySelector("#route-input-label");
const routeNote = document.querySelector("#route-note");
const routeResult = document.querySelector("#route-result");
const flowSource = document.querySelector("#flow-source");

routeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    routeButtons.forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    routeTag.textContent = button.dataset.route;
    routeInput.value = button.dataset.input;
    routeLabel.childNodes[0].textContent = `${button.dataset.route} input`;
    routeNote.textContent = button.dataset.routeNote;
    flowSource.textContent = button.dataset.route;
    routeResult.textContent = `${button.dataset.route} selected. ${button.dataset.routeNote}`;
  });
});

document.querySelector("#start-route").addEventListener("click", () => {
  const current = document.querySelector(".route-row.selected").dataset.route;
  routeResult.textContent = `${current} is preparing WordPress... ready at /hello-from-playground/ as admin.`;
});

const destinations = [...document.querySelectorAll(".destination")];
const saveMode = document.querySelector("#save-mode");
const saveCount = document.querySelector("#save-count");
const saveResult = document.querySelector("#save-result");
const saveBar = document.querySelector("#save-bar");
const storageFact = document.querySelector("#storage-fact");
const flowSave = document.querySelector("#flow-save");
const headerStatus = document.querySelector("#header-status");
const savedRowStorage = document.querySelector("#saved-row-storage");

destinations.forEach((button) => {
  button.addEventListener("click", () => {
    destinations.forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    const local = button.dataset.storage === "local";
    saveMode.textContent = local ? "Local directory selected" : "Browser storage selected";
    saveCount.textContent = local ? "Choose folder, then sync 3751 files" : "3028 / 3751 files";
    saveResult.textContent = local
      ? "Result: saved entry points to a selected local folder and reloads from that directory."
      : "Result: saved entry appears below with rename and delete actions.";
    saveBar.style.width = local ? "46%" : "81%";
    flowSave.textContent = local ? "Save to a local directory" : "Save in this browser";
  });
});

document.querySelector("#save-action").addEventListener("click", () => {
  const name = document.querySelector("#save-name").value || "Research Browser Playground";
  const local = document.querySelector(".destination.selected").dataset.storage === "local";
  document.querySelector("#saved-row-name").textContent = name;
  headerStatus.textContent = "Saved Playground";
  headerStatus.classList.remove("unsaved");
  headerStatus.classList.add("saved");
  storageFact.textContent = local ? "Local directory" : "Browser storage";
  savedRowStorage.textContent = local ? "Saved to local directory" : "Saved in this browser";
  saveCount.textContent = "3751 / 3751 files";
  saveBar.style.width = "100%";
  saveResult.textContent = local
    ? "Saved to /Users/me/Sites/research-browser-playground. Local reload is available."
    : "Saved at /research-browser-playground/. Rename and delete controls are active.";
});

document.querySelector("#rename-case").addEventListener("click", () => {
  const next = "Editor Regression Case";
  document.querySelector(".doc-title h1").textContent = next;
  document.querySelector("#save-name").value = next;
  document.querySelector("#saved-row-name").textContent = next;
});

document.querySelector("#rename-saved").addEventListener("click", () => {
  document.querySelector("#saved-row-name").textContent = "Renamed Research Playground";
  document.querySelector("#delete-note").textContent = "Saved Playground renamed. The browser entry keeps its saved files and new label.";
});

document.querySelector("#delete-saved").addEventListener("click", () => {
  document.querySelector("#saved-row").classList.add("unsaved");
  document.querySelector("#delete-note").textContent = "Delete requested: this browser-backed saved entry would be removed after confirmation.";
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(button.dataset.jump)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const managerTabs = [...document.querySelectorAll("[data-manager-tab]")];
managerTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    managerTabs.forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".manager-panel").forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`#manager-${tab.dataset.managerTab}`).classList.add("active");
  });
});

document.querySelector("#reset-site").addEventListener("click", () => {
  document.querySelector("#reset-result").textContent = "Settings reset queued. Unsaved files and database are replaced by a fresh Playground runtime.";
});

document.querySelector("#run-current-blueprint").addEventListener("click", () => {
  document.querySelector("#blueprint-run-state").textContent = "running";
  setTimeout(() => {
    document.querySelector("#blueprint-run-state").textContent = "run complete";
  }, 500);
});

document.querySelector("#import-zip").addEventListener("click", () => {
  document.querySelector("#handoff-result").textContent = "Native file chooser opened. Importing playground.zip over current would replace files and database.";
});

const blueprints = [
  ["Art Gallery", "Vueo theme gallery", ["featured", "website", "personal", "themes"]],
  ["Coffee Shop", "WooCommerce storefront", ["featured", "woocommerce", "website"]],
  ["Feed Reader with the Friends Plugin", "Read feeds from the web", ["featured", "content", "social web"]],
  ["Gaming News", "Spiel theme news site", ["featured", "website", "news"]],
  ["Non-profit Organization", "Koinonia theme sample", ["featured", "website", "themes"]],
  ["Personal Blog", "Substrata blog", ["personal", "website", "content"]],
  ["Block Bindings Showcase", "Gutenberg block bindings", ["gutenberg", "experiments"]],
  ["Twenty Twenty-Five Demo", "Default theme sample content", ["themes", "website"]],
  ["WooCommerce Product Feed", "Store with sample products", ["woocommerce", "content"]],
  ["WordPress Beta", "Latest beta runtime", ["experiments", "gutenberg"]],
  ["Pretty Permalinks", "Rewrite rules configured", ["content"]],
  ["WPGraphQL Query Demo", "GraphQL plugin scenario", ["experiments", "content"]],
  ["Theme Tester", "Switch and inspect themes", ["themes", "website"]],
  ["Stylish Press", "Design-heavy theme demo", ["themes", "personal"]],
  ["Admin Color Scheme", "Sets admin scheme", ["content"]],
  ["Weather Shortcode Plugin", "Plugin shortcode demo", ["experiments"]],
  ["Markdown and Trac Editor", "Syntax editing setup", ["content", "experiments"]],
  ["Minimal WooCommerce Setup", "Lean shop baseline", ["woocommerce"]],
  ["Import Theme Starter Content", "Starter content import", ["themes", "content"]],
  ["Loading Theme from GitHub", "Theme from repository", ["themes", "featured"]],
  ["Gutenberg Guidelines", "Experiment enabled", ["gutenberg", "experiments"]],
  ["Grid Variations", "Experimental layout grid", ["gutenberg", "experiments"]],
  ["DataViews Experiments", "Admin DataViews enabled", ["gutenberg", "experiments"]],
  ["Display Admin Notice", "Plugin notice example", ["content"]],
  ["Fancy Dashboard Widget", "Admin widget plugin", ["content"]],
  ["Serve Remote Media", "Media from external host", ["content", "website"]],
  ["Create Blog User", "Adds editor account", ["personal", "content"]],
  ["wp-cli Add Post", "Post generated through wp-cli", ["content"]],
  ["wp-cli Post with Image", "Content plus media", ["content"]],
  ["Reset Data and Import", "Clean import sequence", ["content"]],
  ["Install Language Packs", "Localized site setup", ["content"]],
  ["Skincare Blog", "Image-rich personal site", ["personal", "website"]],
  ["My WordPress", "Basic welcome site", ["website"]],
  ["Plugin from a Gist", "Install a gist plugin", ["experiments"]],
  ["Woo Storefront Blocks", "Blocks in commerce", ["woocommerce", "gutenberg"]],
  ["Newsroom Starter", "Editorial homepage", ["news", "website"]],
  ["Magazine Archive", "Dense post archive", ["news", "content"]],
  ["Portfolio Starter", "Personal portfolio", ["personal", "website"]],
  ["REST API Demo", "Endpoint testing setup", ["experiments"]],
  ["Pattern Directory Demo", "Patterns and templates", ["gutenberg", "themes"]],
  ["Classic Theme Fixture", "Legacy theme baseline", ["themes"]],
  ["Multisite Smoke Test", "Network setup scenario", ["experiments"]],
  ["Accessibility Content Set", "Accessible sample pages", ["content", "website"]]
];

const list = document.querySelector("#blueprint-list");
const search = document.querySelector("#blueprint-search");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
let activeFilter = "all";

function renderBlueprints() {
  const query = search.value.trim().toLowerCase();
  list.innerHTML = "";
  blueprints
    .filter(([title, copy, tags]) => {
      const text = `${title} ${copy} ${tags.join(" ")}`.toLowerCase();
      const filterMatch = activeFilter === "all" || tags.includes(activeFilter);
      return filterMatch && (!query || text.includes(query));
    })
    .forEach(([title, copy, tags], index) => {
      const card = document.createElement("button");
      card.className = `blueprint-card${title === "Feed Reader with the Friends Plugin" ? " selected" : ""}`;
      card.type = "button";
      card.innerHTML = `<strong>${title}</strong><small>${copy}</small><div class="chip-row">${tags.slice(0, 3).map((tag) => `<span>${tag}</span>`).join("")}</div>`;
      card.addEventListener("click", () => selectBlueprint(title, copy, tags, card));
      if (index > 42) card.hidden = true;
      list.appendChild(card);
    });
}

function selectBlueprint(title, copy, tags, card) {
  document.querySelectorAll(".blueprint-card").forEach((item) => item.classList.remove("selected"));
  card.classList.add("selected");
  document.querySelector("#selected-blueprint-title").textContent = title;
  document.querySelector("#selected-blueprint-copy").textContent = `${copy}. Run it now or inspect the Blueprint JSON first.`;
  document.querySelector("#selected-blueprint-tags").innerHTML = tags.map((tag) => `<span>${tag}</span>`).join("");
}

search.addEventListener("input", renderBlueprints);
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderBlueprints();
  });
});

document.querySelector("#run-selected-blueprint").addEventListener("click", () => {
  const title = document.querySelector("#selected-blueprint-title").textContent;
  routeResult.textContent = `Blueprint gallery entry "${title}" is running. Current site will load the selected recipe.`;
  document.querySelector("#brief").scrollIntoView({ behavior: "smooth", block: "start" });
});

renderBlueprints();
