const sourceDetails = {
  vanilla: {
    title: "Vanilla WordPress",
    copy: "Ready to start a fresh temporary Playground with latest WordPress, PHP 8.3, English, and network access.",
    input: "No input required",
    disabled: true,
    action: "Start Playground",
    flowInput: "No input",
    flowResult: "Fresh temporary site"
  },
  wppr: {
    title: "Preview a WordPress PR",
    copy: "Uses a WordPress core pull request number or URL. The preview starts in a disposable Playground.",
    input: "https://github.com/WordPress/wordpress-develop/pull/7347",
    disabled: false,
    action: "Preview PR",
    flowInput: "PR NUMBER OR URL",
    flowResult: "Core patch preview"
  },
  gbpr: {
    title: "Preview a Gutenberg PR or Branch",
    copy: "Accepts a pull request number, full URL, or branch name from the Gutenberg repository.",
    input: "trunk",
    disabled: false,
    action: "Preview Gutenberg",
    flowInput: "PR, URL, OR BRANCH",
    flowResult: "Gutenberg build preview"
  },
  github: {
    title: "Import from GitHub",
    copy: "Imports public plugins, themes, or wp-content directories. GitHub token is not stored after refresh.",
    input: "owner/repository/path",
    disabled: false,
    action: "Connect GitHub",
    flowInput: "Account connection",
    flowResult: "Repo imported"
  },
  "blueprint-url": {
    title: "Run Blueprint from URL",
    copy: "Runs a remote blueprint.json and can change the current site, plugins, theme, content, and landing page.",
    input: "https://example.com/blueprint.json",
    disabled: false,
    action: "Run Blueprint",
    flowInput: "BLUEPRINT URL",
    flowResult: "Blueprint applied"
  },
  zip: {
    title: "Import .zip",
    copy: "Opens the native file chooser. Importing over the current site replaces the active WordPress files.",
    input: "Choose wordpress-playground.zip",
    disabled: true,
    action: "Choose .zip",
    flowInput: "Native file picker",
    flowResult: "Current site replaced"
  }
};

const imageSet = [
  "../../research/screenshots/34-blueprints-gallery.png",
  "../../research/screenshots/23-site-manager-blueprint.png",
  "../../research/screenshots/22-site-manager-file-browser.png",
  "../../research/screenshots/24-site-manager-database.png"
];

const blueprints = [
  ["Art Gallery", "Website · Personal · Themes", "website personal themes featured", "Vueo theme with gallery content."],
  ["Coffee Shop", "WooCommerce · Store", "woocommerce website featured", "Storefront with products and custom theme."],
  ["Feed Reader with the Friends Plugin", "RSS · Social web · Plugin", "content experiments featured", "Reads web feeds with Friends plugin."],
  ["Gaming News", "Website · News", "website news featured", "Spiel theme for game news."],
  ["Non-profit Organization", "Website · Organization", "website content featured", "Koinonia theme and donation content."],
  ["Personal Blog", "Website · Personal · Blog", "personal website themes", "Substrata theme for long-form posts."],
  ["Block Theme Starter", "Themes · Gutenberg", "themes gutenberg featured", "Theme author starting point with blueprint.json."],
  ["Plugin Test Fixture", "Experiments · Content", "experiments content", "Preloaded fixture for plugin checks."],
  ["Twenty Twenty-Four Shop", "WooCommerce · Themes", "woocommerce themes", "Product catalog with current default theme styling."],
  ["Pattern Directory Demo", "Gutenberg · Content", "gutenberg content", "Pattern-heavy page set for block layout review."],
  ["Interactivity API Counter", "Gutenberg · Experiments", "gutenberg experiments", "Small interactive block test site."],
  ["Multilingual Landing Page", "Website · Content", "website content", "Landing page content prepared for language switching."],
  ["Portfolio Archive", "Personal · Themes", "personal themes", "Image-led portfolio archive for theme spacing checks."],
  ["Local Newsroom", "News · Website", "news website", "Posts, categories, and navigation for publishing layouts."],
  ["Documentation Site", "Content · Website", "content website", "Long-form docs and nested page hierarchy."],
  ["Restaurant Menu", "Website · Content", "website content", "Menu pages, opening hours, and reservation content."],
  ["Event Schedule", "Content · Gutenberg", "content gutenberg", "Schedule blocks and speaker archive content."],
  ["Minimal Blog", "Personal · Themes", "personal themes", "Sparse posts for typography and reading-width checks."],
  ["Magazine Front Page", "News · Themes", "news themes", "Dense editorial homepage with multiple post loops."],
  ["Course Catalog", "Content · Website", "content website", "Course cards, lessons, and sample enrollment pages."],
  ["Photo Journal", "Personal · Content", "personal content", "Large media posts and gallery blocks."],
  ["Agency Homepage", "Website · Themes", "website themes", "Services, case studies, and contact content."],
  ["Product Launch", "Website · Content", "website content", "Hero, feature blocks, and launch announcement content."],
  ["Classic Theme Check", "Themes · Experiments", "themes experiments", "Classic theme fixture with widgets and menus."],
  ["Block Hooks Demo", "Gutenberg · Experiments", "gutenberg experiments", "Fixture for testing block hook placement."],
  ["Custom Post Types", "Content · Experiments", "content experiments", "Sample books, movies, and taxonomy archives."],
  ["Woo Digital Downloads", "WooCommerce · Content", "woocommerce content", "Downloadable products and checkout content."],
  ["Woo Subscriptions Mock", "WooCommerce · Experiments", "woocommerce experiments", "Subscription-like products for store UI review."],
  ["Community Forum", "Website · Content", "website content", "Forum-style pages and member content."],
  ["Newsletter Archive", "News · Content", "news content", "Issue archive, signup page, and article content."],
  ["Podcast Site", "Personal · Content", "personal content", "Episode posts and transcript pages."],
  ["Museum Collection", "Website · Personal", "website personal", "Collection objects and exhibit pages."],
  ["Recipe Index", "Content · Website", "content website", "Recipe cards, filters, and long ingredient lists."],
  ["Travel Notes", "Personal · Website", "personal website", "Destination posts and image galleries."],
  ["Theme JSON Lab", "Themes · Gutenberg", "themes gutenberg", "Style variation and global style test content."],
  ["Navigation Block Lab", "Gutenberg · Experiments", "gutenberg experiments", "Menus and responsive navigation stress cases."],
  ["Media Library Heavy", "Content · Experiments", "content experiments", "Image and attachment-heavy demo content."],
  ["Admin Color Schemes", "Experiments · Themes", "experiments themes", "Admin-facing visual checks and user profiles."],
  ["Small Business Brochure", "Website · Themes", "website themes", "Service pages and testimonial content."],
  ["Artist Monograph", "Personal · Website", "personal website", "Biography, works, and exhibition pages."],
  ["Developer Changelog", "News · Content", "news content", "Release posts and code-heavy formatting."],
  ["Headless Preview", "Experiments · Gutenberg", "experiments gutenberg", "Blueprint for REST and frontend preview checks."],
  ["Playground Welcome Page", "Featured · Website", "featured website", "Landing page fixture captured from Playground."]
].map(([title, tags, filter, desc], index) => ({
  title,
  tags,
  filter,
  desc,
  img: imageSet[index % imageSet.length]
}));

let saveDestination = "browser";
let isSaved = false;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function switchPanel(panel) {
  $$(".ledger-panel").forEach((el) => el.classList.toggle("active", el.id === `panel-${panel}`));
  $$(".key").forEach((button) => button.classList.toggle("active", button.dataset.panelTarget === panel));
  $(".app-shell").dataset.panel = panel;
}

function setSource(source) {
  const detail = sourceDetails[source];
  $$(".source-card").forEach((button) => button.classList.toggle("active", button.dataset.source === source));
  $("#sourceInspector h3").textContent = detail.title;
  $("#sourceInspector p:not(.eyebrow)").textContent = detail.copy;
  const input = $("#sourceInspector input");
  input.value = detail.input;
  input.disabled = detail.disabled;
  $("#startRoute").textContent = detail.action;
  $("#flowInput").textContent = detail.flowInput;
  $("#flowResult").textContent = detail.flowResult;
}

function renderBlueprints(filter = "all", search = "") {
  const list = $("#blueprintList");
  list.innerHTML = "";
  const normalized = search.trim().toLowerCase();
  const visible = blueprints.filter((item) => {
    const filterMatch = filter === "all" || item.filter.includes(filter);
    const searchMatch = !normalized || `${item.title} ${item.tags} ${item.desc}`.toLowerCase().includes(normalized);
    return filterMatch && searchMatch;
  });

  visible.forEach((item, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `blueprint-card${index === 0 ? " active" : ""}`;
    card.innerHTML = `
      <img src="${item.img}" alt="">
      <div>
        <strong>${item.title}</strong>
        <small>${item.desc}</small>
        <span>${item.tags}</span>
      </div>
    `;
    card.addEventListener("click", () => {
      $$(".blueprint-card").forEach((el) => el.classList.remove("active"));
      card.classList.add("active");
      $("#blueprintDetail strong").textContent = item.title;
      $("#blueprintDetail p").textContent = `${item.desc} Selected from the 43-entry Blueprint catalog index.`;
      $("#blueprintDetail dd").textContent = item.tags;
    });
    list.appendChild(card);
  });

  if (!visible.length) {
    list.innerHTML = `<div class="result-line">No matching Blueprint cards in this filtered view.</div>`;
  }
}

function updateSavedIdentity(name, detail) {
  isSaved = true;
  $("#identityLine").textContent = `${name} · ${detail}`;
  $("#siteTitle").textContent = name;
  $("#rowName").textContent = name;
  $("#rowStatus").textContent = detail;
  $("#saveState").textContent = "✓ Saved";
  $("#saveState").style.color = "#98f0c3";
  $("#settingsMode").textContent = "Saved reload:";
  $("#settingsText").textContent = "Stored Playgrounds keep limited configuration options and use Save & Reload.";
  $("#applySettings").textContent = "Save & Reload";
}

document.addEventListener("click", (event) => {
  const panelTarget = event.target.closest("[data-panel-target]");
  if (panelTarget) {
    switchPanel(panelTarget.dataset.panelTarget);
  }
});

$$(".source-card").forEach((button) => {
  button.addEventListener("click", () => setSource(button.dataset.source));
});

$$(".destination-card").forEach((button) => {
  button.addEventListener("click", () => {
    saveDestination = button.dataset.saveDestination;
    $$(".destination-card").forEach((el) => el.classList.toggle("active", el === button));
    $("#saveProgress p").textContent = saveDestination === "browser"
      ? "Browser storage selected. Files will copy into this browser profile."
      : "Local directory selected. The browser directory picker will ask for a folder before reload.";
    $("#saveProgress .meter span").style.width = "0%";
  });
});

$("#runSave").addEventListener("click", () => {
  const name = $("#playgroundName").value.trim() || "Saved Playground";
  const progress = $("#saveProgress .meter span");
  const label = $("#saveProgress p");
  progress.style.width = "38%";
  label.textContent = saveDestination === "browser" ? "Saving 1421 / 3751 files..." : "Waiting for local directory permission...";
  window.setTimeout(() => {
    progress.style.width = "72%";
    label.textContent = saveDestination === "browser" ? "Saving 3028 / 3751 files..." : "Writing Playground files to selected local directory...";
  }, 280);
  window.setTimeout(() => {
    progress.style.width = "100%";
    const detail = saveDestination === "browser"
      ? "Saved in this browser · created May 21, 2026"
      : "Saved to local directory · reloads from chosen folder";
    label.textContent = saveDestination === "browser"
      ? "Saved. Browser-backed Playground URL is now available."
      : "Saved. The active Playground is now backed by the selected local directory.";
    updateSavedIdentity(name, detail);
  }, 620);
});

$("#resetTemp").addEventListener("click", () => {
  $("#saveProgress p").textContent = "Reset queued. The current temporary site will be discarded and prepared again.";
  $("#saveProgress .meter span").style.width = "18%";
});

$("#renameSite").addEventListener("click", () => {
  const next = $("#renameInput").value.trim() || "Renamed Playground";
  updateSavedIdentity(next, isSaved ? $("#rowStatus").textContent : "Saved in this browser · created May 21, 2026");
  $("#manageNotice").textContent = "Rename applied to the saved Playground identity and browser-backed saved list.";
});

$("#deleteSite").addEventListener("click", () => {
  $("#manageNotice").textContent = "Delete confirmed in wireframe: browser-stored copy removed; unsaved temporary session remains available.";
  $("#rowStatus").textContent = "Deleted from browser storage · temporary session still open";
});

$("#applySettings").addEventListener("click", () => {
  $("#settingsText").textContent = isSaved
    ? "Save & Reload started. Stored Playground will reload with PHP 8.3 and network settings retained."
    : "Reset started. Unsaved runtime will be discarded before WordPress prepares again.";
});

$$("[data-tool-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.toolTab;
    $$("[data-tool-tab]").forEach((el) => el.classList.toggle("active", el === button));
    $$(".tool-tab").forEach((el) => el.classList.toggle("active", el.id === `tool-${tab}`));
  });
});

$$("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    $$("[data-filter]").forEach((el) => el.classList.toggle("active", el === button));
    renderBlueprints(button.dataset.filter, $("#blueprintSearch").value);
  });
});

$("#blueprintSearch").addEventListener("input", () => {
  const activeFilter = $("[data-filter].active").dataset.filter;
  renderBlueprints(activeFilter, $("#blueprintSearch").value);
});

$("#startRoute").addEventListener("click", () => {
  const route = $("#sourceInspector h3").textContent;
  $("#flowResult").textContent = `${route} prepared`;
  $("#previewRoute").textContent = "/wp-admin/";
  $("#pathInput").value = "/wp-admin/";
  $("#identityLine").textContent = `Unsaved Playground · ${route}`;
  $("#saveState").textContent = "● Unsaved";
});

$("#goPath").addEventListener("click", () => {
  $("#previewRoute").textContent = $("#pathInput").value || "/";
});

$("#runGalleryBlueprint").addEventListener("click", () => {
  $("#blueprintDetail p").textContent = "Run queued. The selected Blueprint will import content and plugins into the active Playground.";
  $("#identityLine").textContent = "Unsaved Playground · Blueprint run pending";
});

$("#exportGithub").addEventListener("click", () => {
  $("#transferResult").textContent = "GitHub export prepared. Account connection required before repository creation.";
});

$("#downloadZip").addEventListener("click", () => {
  $("#transferResult").textContent = "Zip bundle prepared from the current WordPress filesystem.";
});

$("#importZip").addEventListener("click", () => {
  $("#transferResult").textContent = "Import .zip selected. Native chooser opens and importing will replace the current site.";
});

renderBlueprints();
