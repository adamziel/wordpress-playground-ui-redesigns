const jumpButtons = document.querySelectorAll("[data-jump]");

jumpButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.jump);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const routeCards = document.querySelectorAll(".route-card");
const launchResult = document.querySelector("#launch-result");
const routeMessages = {
  vanilla: ["Ready", "Vanilla WordPress selected.", "Starting creates a fresh temporary Playground and keeps this page editable until saved."],
  "wp-pr": ["Preview", "WordPress PR route selected.", "The PR number or URL is required before Playground can preview core changes."],
  "gb-pr": ["Preview", "Gutenberg PR or branch route selected.", "Accepts a PR number, URL, or branch name for the Gutenberg plugin build."],
  github: ["Connect", "GitHub import selected.", "Connect an account to import public plugins, themes, or wp-content directories. The token is not stored."],
  "blueprint-url": ["Replace", "Blueprint URL route selected.", "Running a Blueprint can change the current site. Save first if this state matters."],
  zip: ["Replace", "Zip import selected.", "The file chooser opens next. Importing can replace current Playground files."]
};

routeCards.forEach((card) => {
  card.querySelector(".route-select").addEventListener("click", () => {
    routeCards.forEach((item) => item.classList.remove("selected"));
    card.classList.add("selected");
    const [chip, title, copy] = routeMessages[card.dataset.route];
    launchResult.innerHTML = `<span class="chip info">${chip}</span><strong>${title}</strong><span>${copy}</span>`;
  });
});

const destinations = document.querySelectorAll(".destination");
const saveTitle = document.querySelector("#save-title");
const saveCopy = document.querySelector("#save-copy");

destinations.forEach((destination) => {
  destination.querySelector(".save-choice").addEventListener("click", () => {
    destinations.forEach((item) => item.classList.remove("selected"));
    destination.classList.add("selected");
    if (destination.dataset.save === "local") {
      saveTitle.textContent = "Local directory save in progress";
      saveCopy.textContent = "When complete, the chosen folder contains the WordPress files and the browser header shows a local-directory saved state.";
      document.querySelector(".completion-row").innerHTML = '<span class="chip ok">Result: Saved to local directory</span><span>Folder access granted</span><span>Location: local device</span>';
      return;
    }
    saveTitle.textContent = "Browser save in progress";
    saveCopy.textContent = "When complete, the URL becomes /research-browser-playground/ and the header changes to Saved Playground.";
    document.querySelector(".completion-row").innerHTML = '<span class="chip ok">Result: Saved Playground</span><span>Created May 21, 2026</span><span>Location: this browser</span>';
  });
});

document.querySelector("#rename-site").addEventListener("click", () => {
  document.querySelector("#saved-name").textContent = "Renamed Documentation Demo";
});

document.querySelector("#delete-selected").addEventListener("click", () => {
  document.querySelector("#delete-warning").classList.toggle("visible");
});

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".manager-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    panels.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add("active");
  });
});

const pills = document.querySelectorAll(".pill");
const catalogList = document.querySelector("#catalog-list");
const search = document.querySelector("#blueprint-search");
const blueprints = [
  ["Art Gallery", "Vueo theme with gallery content.", "Website", "art", "featured website content personal"],
  ["Coffee Shop", "WooCommerce storefront with sample products.", "WooCommerce", "coffee", "featured woocommerce website"],
  ["Feed Reader with the Friends Plugin", "Read feeds from the web in Playground.", "Content", "feed", "featured content personal"],
  ["Gaming News", "Spiel theme news layout.", "News", "game", "featured news website"],
  ["Non-profit Organization", "Donation-focused organization demo.", "Website", "nonprofit", "featured website content"],
  ["Personal Blog", "Substrata theme with authored posts.", "Personal", "blog", "personal themes"],
  ["Block Theme Starter", "A minimal site for exploring theme.json.", "Themes", "art", "themes gutenberg website"],
  ["WooCommerce Products", "Store catalog with sample product data.", "WooCommerce", "coffee", "woocommerce content"],
  ["Twenty Twenty-Four Portfolio", "Portfolio layout with patterns and pages.", "Themes", "blog", "themes website"],
  ["Interactive Blocks Lab", "Gutenberg blocks prepared for experiments.", "Gutenberg", "feed", "gutenberg experiments"],
  ["Media Library Demo", "Image-heavy content for docs screenshots.", "Content", "art", "content website"],
  ["Plugin Review Sandbox", "Plugin install and review preparation.", "Experiments", "feed", "experiments website"],
  ["News Homepage", "Magazine-style landing page and posts.", "News", "game", "news website"],
  ["Recipe Journal", "Personal publishing demo with categories.", "Personal", "blog", "personal content"],
  ["Course Landing Page", "Website demo with blocks and forms.", "Website", "nonprofit", "website content"],
  ["Pattern Directory Demo", "Curated patterns ready for inspection.", "Gutenberg", "feed", "gutenberg content"],
  ["Minimal Agency Site", "Small business pages with navigation.", "Website", "art", "website themes"],
  ["Store Checkout Demo", "WooCommerce checkout and cart walkthrough.", "WooCommerce", "coffee", "woocommerce"],
  ["Block Bindings Demo", "Experimental block bindings content.", "Gutenberg", "feed", "gutenberg experiments"],
  ["Documentation Site", "Docs-style pages and navigation.", "Content", "blog", "content website"],
  ["Photo Essay", "Long-form media story layout.", "Personal", "art", "personal content"],
  ["Theme Variation Preview", "Style variations prepared for comparison.", "Themes", "blog", "themes website"],
  ["Query Loop Examples", "Posts, filters, and archives for demos.", "Gutenberg", "feed", "gutenberg content"],
  ["Community Event Site", "Schedule, posts, and organizer pages.", "Website", "nonprofit", "website content"],
  ["Podcast Notes", "Personal publishing site with episodes.", "Personal", "blog", "personal content"],
  ["Product Launch Page", "Storefront-style page without checkout.", "Website", "coffee", "website woocommerce"],
  ["Comments Moderation Demo", "Content set for moderation walkthroughs.", "Content", "feed", "content"],
  ["Navigation Block Lab", "Menus and responsive navigation examples.", "Gutenberg", "feed", "gutenberg"],
  ["Classic Theme Comparison", "Theme migration inspection site.", "Themes", "blog", "themes experiments"],
  ["Local News Wire", "News taxonomy and archive structure.", "News", "game", "news content"],
  ["Membership Landing Page", "Organization content with calls to action.", "Website", "nonprofit", "website"],
  ["Experimental API Demo", "Feature test content for browser APIs.", "Experiments", "feed", "experiments"],
  ["Digital Downloads Store", "WooCommerce downloadable product demo.", "WooCommerce", "coffee", "woocommerce"],
  ["Author Archive Demo", "Personal author pages and archives.", "Personal", "blog", "personal content"],
  ["Template Part Inspector", "Header, footer, and part examples.", "Themes", "art", "themes gutenberg"],
  ["Block Hooks Demo", "Plugin and block hook examples.", "Gutenberg", "feed", "gutenberg experiments"],
  ["Editorial Calendar", "Content planning posts and categories.", "Content", "game", "content news"],
  ["Fundraising Campaign", "Non-profit landing and update posts.", "Website", "nonprofit", "website content"],
  ["Portfolio Shop", "Creator site with WooCommerce products.", "WooCommerce", "coffee", "woocommerce personal"],
  ["Site Editor Walkthrough", "Prepared pages for Site Editor docs.", "Gutenberg", "art", "gutenberg themes"],
  ["Accessibility Testing Page", "Content blocks for UI review.", "Experiments", "feed", "experiments content"],
  ["Release Notes Blog", "News and changelog publishing demo.", "News", "blog", "news content"],
  ["Starter Content Playground", "Plain WordPress content for baseline demos.", "Website", "art", "website featured"]
];

function renderBlueprints() {
  catalogList.innerHTML = blueprints
    .map(([title, description, category, thumb, tags], index) => {
      const selected = title === "Feed Reader with the Friends Plugin" ? " selected-detail" : "";
      return `<article class="blueprint-item${selected}" data-tags="${tags}" data-title="${title.toLowerCase()}">
        <div class="thumb ${thumb}"></div>
        <div><strong>${String(index + 1).padStart(2, "0")}. ${title}</strong><p>${description}</p></div>
        <span class="chip ${selected ? "info" : "neutral"}">${selected ? "Selected" : category}</span>
      </article>`;
    })
    .join("");
}

function filterBlueprints(filter = "all") {
  const query = search.value.trim().toLowerCase();
  document.querySelectorAll(".blueprint-item").forEach((item) => {
    const text = item.textContent.toLowerCase();
    const tags = item.dataset.tags;
    const filterMatch = filter === "all" || tags.includes(filter);
    const searchMatch = !query || text.includes(query) || tags.includes(query);
    item.style.display = filterMatch && searchMatch ? "" : "none";
  });
}

pills.forEach((pill) => {
  pill.addEventListener("click", () => {
    pills.forEach((item) => item.classList.remove("active"));
    pill.classList.add("active");
    filterBlueprints(pill.dataset.filter);
  });
});

search.addEventListener("input", () => {
  const active = document.querySelector(".pill.active");
  filterBlueprints(active ? active.dataset.filter : "all");
});

renderBlueprints();
filterBlueprints("all");
