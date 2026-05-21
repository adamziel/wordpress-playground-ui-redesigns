const blueprints = [
  ["Art Gallery", "Website Personal Featured", "An art gallery created with the Vueo theme", "#8c6a2b"],
  ["Coffee Shop", "WooCommerce Website Featured", "A stylish WooCommerce coffee shop storefront", "#5f2d8b"],
  ["Feed Reader with the Friends Plugin", "Content Featured", "Read feeds from the web in Playground", "#eef4ff"],
  ["Gaming News", "Website News Featured", "A gaming news site created with the Spiel theme", "#141414"],
  ["Non-profit Organization", "Website Content Featured", "A non-profit organization site created with Koinonia", "#8c461e"],
  ["Personal Blog", "Website Personal", "A personal blog site created with the Substrata theme", "#711544"],
  ["Personal Resume", "Website Personal", "A resume site created with the Readymade theme", "#565f76"],
  ["Photography Portfolio", "Website Personal Content", "A photography portfolio created with the Grammer theme", "#4d6c8d"],
  ["Skincare Blog", "Website News Personal", "A skincare blog created with the Piel theme", "#a86872"],
  ["University Website", "Website Content", "A university website created with the Kentwood theme", "#495b7a"],
  ["Create Block Theme", "Themes Gutenberg", "Install Create Block Theme and start editing", "#365f92"],
  ["Creating a new user for the blog", "Content", "Update user meta data in a simple example", "#6e7750"],
  ["Custom Post Type: Books", "Content", "Add a custom post type to Playground", "#5b7a56"],
  ["Demo of Twenty-Twenty-Five theme", "Themes", "Demo content for the Twenty-Twenty-Five default theme", "#2f6f42"],
  ["Display Admin Notice", "Experiments", "Add a tiny mu-plugin and display an admin notice", "#8d5a2b"],
  ["Enable all three Dataview Experiments in Gutenberg", "Gutenberg Experiments", "Enable multiple experiments in the Gutenberg plugin", "#316d74"],
  ["Fancy Dashboard Widget", "Content Experiments", "Display statistics about users, posts, and comments", "#5d4f81"],
  ["Grid Variations Experiments enabled", "Gutenberg Experiments", "Toggle a Gutenberg experiment from the Experiments page", "#465f99"],
  ["Gutenberg Guidelines Experiment enabled", "Gutenberg Experiments", "Enable the Gutenberg Guidelines experiment", "#4c6b8f"],
  ["Import Theme Starter Content", "Themes Content", "Install a theme with starter content", "#7b6145"],
  ["Import a standalone starter content via a blueprint step", "Themes Content", "Import stand-alone starter content from a blueprint", "#876449"],
  ["Install WordPress language packs", "Content", "Install and activate a WordPress translation pack", "#4c6b55"],
  ["Install plugin from a gist", "Content Experiments", "Install and activate a plugin from a gist PHP file", "#554d72"],
  ["Latest Gutenberg plugin", "Gutenberg", "Preview the latest version of the Gutenberg plugin", "#5c4a91"],
  ["Loading, activating, and configuring a theme from a GitHub repository", "Themes Experiments", "Load, activate, and configure a theme from GitHub", "#7c5536"],
  ["Login as an editor", "Content", "Test WordPress functionality as an editor", "#3f5c78"],
  ["Markdown and Trac Syntax Editor", "Gutenberg Content", "Edit Markdown and Trac formatting in the block editor", "#2d7a66"],
  ["Minimal WooCommerce Setup with Sample Products, Shipping, and Payment Method", "WooCommerce Content", "Install WooCommerce with products, shipping, and payment", "#6c3ea1"],
  ["My WordPress", "Website Content", "Persistent Playground welcome and personalization", "#315d7a"],
  ["Playground Welcome Landing Page", "Website Content", "Overview landing page for Playground capabilities", "#466a94"],
  ["Pretty permalinks", "Content", "Set the permalink structure to pretty permalinks", "#605f7c"],
  ["Reset data and import content (with logs)", "Content Experiments", "Reset default data, import content, and log each step", "#8a514e"],
  ["Serve media files from another host", "Content Experiments", "Redirect uploads to an external host", "#336d7a"],
  ["Set the admin color scheme", "Content", "Set the admin color scheme using updateUserMeta", "#6a5b8a"],
  ["Showcase plugin", "Content Experiments", "Showcase a custom plugin with media and imported WXR", "#23646d"],
  ["Stylish Press", "WooCommerce Website Themes", "A Woo store with custom theme, content, and products", "#7b2830"],
  ["Theme Tester", "Themes Content", "Add content and plugins to explore a theme", "#3e5c99"],
  ["Use WPGraphQL to query WordPress", "Content Experiments", "Load WPGraphQL and open the GraphQL IDE page", "#315d66"],
  ["Use wp-cli command to add posts", "Content Experiments", "Add posts via a wp-cli command", "#4b6865"],
  ["Use wp-cli to add a post with image", "Content Experiments", "Create a post with block markup and a featured image", "#6d5c41"],
  ["Weather Shortcode Plugin", "Content Experiments", "Connect a weather API and show data as a shortcode", "#2d5f88"],
  ["WooCommerce product feed", "WooCommerce Content", "Create a WooCommerce product and export a product feed", "#7e3e77"],
  ["WordPress Beta", "Experiments", "Test the latest WordPress Beta or RC with debugging plugins", "#b54c44"]
];

const routeMessages = {
  vanilla: "Vanilla WordPress will start immediately with WP latest, PHP 8.3, language English, network access on.",
  "wp-pr": "WordPress PR route requires a PR number or wordpress-develop pull request URL before Preview can run.",
  gutenberg: "Gutenberg route accepts a PR number, full URL, or branch name and loads the editor package into Playground.",
  github: "GitHub import requires account connection. The token is not stored, so refresh requires re-authentication.",
  "blueprint-url": "Blueprint URL route fetches a JSON blueprint and runs its steps against the active Playground.",
  zip: "Zip import opens a native file chooser and replaces the current site contents if imported over this Playground."
};

const blueprintList = document.querySelector("#blueprintList");
const blueprintDetail = document.querySelector("#blueprintDetail");
const routeResult = document.querySelector("#routeResult");
const shellStatus = document.querySelector("#shellStatus");
const previewStatus = document.querySelector("#previewStatus");
const proofSteps = Array.from(document.querySelectorAll("#proofSteps li"));
const timeline = document.querySelector("#timeline");

let activeFilter = "All";

function logEvent(text) {
  const entry = document.createElement("div");
  const time = document.createElement("time");
  const span = document.createElement("span");
  time.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  span.textContent = text;
  entry.append(time, span);
  timeline.prepend(entry);
}

function setProof(index) {
  proofSteps.forEach((step, stepIndex) => {
    step.classList.toggle("is-current", stepIndex === index);
  });
}

function renderBlueprints() {
  const query = document.querySelector("#blueprintSearch").value.trim().toLowerCase();
  const visible = blueprints.filter(([name, tags, description]) => {
    const matchesFilter = activeFilter === "All" || tags.includes(activeFilter);
    const haystack = `${name} ${tags} ${description}`.toLowerCase();
    return matchesFilter && haystack.includes(query);
  });

  blueprintList.innerHTML = "";
  visible.forEach(([name, tags, description, color], index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `blueprint-card${index === 2 || name.includes("Feed Reader") ? " is-selected" : ""}`;
    card.style.setProperty("--thumb-color", color);
    card.innerHTML = `<div class="thumb"></div><strong>${name}</strong><span>${description}</span><span>${tags}</span>`;
    card.addEventListener("click", () => {
      document.querySelectorAll(".blueprint-card").forEach((item) => item.classList.remove("is-selected"));
      card.classList.add("is-selected");
      blueprintDetail.innerHTML = `
        <span class="eyebrow">Selected blueprint</span>
        <h3>${name}</h3>
        <p>${description}. Tags: ${tags}.</p>
        <div class="code-panel small"><pre>{
  "meta": { "title": "${name}" },
  "preferredVersions": { "php": "8.3", "wp": "latest" },
  "features": { "networking": true },
  "steps": [ "installTheme", "installPlugin", "runPHP" ]
}</pre></div>
        <div class="button-row">
          <button type="button" class="secondary-button">Inspect JSON</button>
          <button type="button" class="primary-button">Run Blueprint</button>
        </div>`;
      logEvent(`Blueprint inspected: ${name}.`);
    });
    blueprintList.append(card);
  });
}

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(button.dataset.jump).scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll(".route-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".route-card").forEach((item) => item.classList.remove("is-selected"));
    card.classList.add("is-selected");
    routeResult.innerHTML = `<strong>Selected route:</strong> ${routeMessages[card.dataset.route]}`;
    setProof(0);
    logEvent(`Launch source selected: ${card.querySelector("h3").textContent}.`);
  });
});

document.querySelectorAll(".save-ticket").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".save-ticket").forEach((item) => item.classList.remove("is-selected"));
    card.classList.add("is-selected");
    const isBrowser = card.dataset.save === "browser";
    document.querySelector("#saveCounter").textContent = isBrowser ? "Saving 3028 / 3751 files" : "Syncing 3028 / 3751 files";
    document.querySelector("#saveMeter").style.width = isBrowser ? "80%" : "64%";
    document.querySelector("#saveResult").textContent = isBrowser
      ? "Destination: browser storage. Result: slug will be /research-browser-playground/ and shell status becomes Saved Playground."
      : "Destination: selected local directory. Result: files are synced to disk and the board keeps a browser-backed saved identity.";
    shellStatus.textContent = isBrowser ? "Saved Playground" : "Saved to local directory";
    shellStatus.classList.remove("warning");
    previewStatus.textContent = isBrowser ? "saved in browser" : "linked local directory";
    setProof(2);
    logEvent(isBrowser ? "Browser save completed for Research Browser Playground." : "Local directory save completed for research-browser.");
  });
});

document.querySelector("#renameButton").addEventListener("click", () => {
  document.querySelector("#savedName").textContent = "Renamed Repro Playground";
  document.querySelector("#manageResult").textContent = "Saved Playground renamed. Browser storage entry and board title now use Renamed Repro Playground.";
  setProof(3);
  logEvent("Saved Playground renamed to Renamed Repro Playground.");
});

document.querySelector("#deleteButton").addEventListener("click", () => {
  document.querySelector("#manageResult").textContent = "Delete selected: confirmation warns that browser storage for this saved Playground will be permanently removed.";
  document.querySelector("#savedRow").style.opacity = "0.55";
  logEvent("Delete action staged with permanent browser storage warning.");
});

document.querySelectorAll(".inspector-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".inspector-tab").forEach((item) => item.classList.remove("is-active"));
    document.querySelectorAll(".inspector-panel").forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");
    document.querySelector(`#panel-${tab.dataset.panel}`).classList.add("is-active");
    logEvent(`Site Manager opened: ${tab.textContent}.`);
  });
});

document.querySelectorAll(".filter-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach((item) => item.classList.remove("is-active"));
    chip.classList.add("is-active");
    activeFilter = chip.dataset.filter;
    renderBlueprints();
    logEvent(`Blueprint filter changed to ${activeFilter}.`);
  });
});

document.querySelector("#blueprintSearch").addEventListener("input", renderBlueprints);

document.querySelector("#exportGithub").addEventListener("click", () => {
  document.querySelector("#exportResult").textContent = "GitHub export queued: connect account, choose repository target, then push current Playground files.";
  setProof(4);
  logEvent("Export to GitHub queued after account connection.");
});

document.querySelector("#downloadZip").addEventListener("click", () => {
  document.querySelector("#exportResult").textContent = "Zip download prepared: current WordPress files and blueprint bundle are packaged for handoff.";
  setProof(4);
  logEvent("Download as .zip prepared.");
});

document.querySelector("#importZip").addEventListener("click", () => {
  document.querySelector("#exportResult").textContent = "Zip import selected: native file chooser opens and the board warns that current site files will be replaced.";
  logEvent("Import .zip selected with overwrite warning.");
});

renderBlueprints();
