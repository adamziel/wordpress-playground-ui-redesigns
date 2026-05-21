const panels = document.querySelectorAll(".panel");
const steps = document.querySelectorAll(".step");
const jumpButtons = document.querySelectorAll("[data-jump]");

function showPanel(name) {
  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === `panel-${name}`);
  });
  steps.forEach((step) => {
    step.classList.toggle("active", step.dataset.panel === name);
  });
  const activePanel = document.getElementById(`panel-${name}`);
  if (activePanel) {
    activePanel.scrollIntoView({ block: "start", behavior: "smooth" });
  }
}

steps.forEach((step) => {
  step.addEventListener("click", () => showPanel(step.dataset.panel));
});

jumpButtons.forEach((button) => {
  button.addEventListener("click", () => showPanel(button.dataset.jump));
});

const blueprints = [
  ["Art Gallery", "An art gallery created with the Vueo theme.", ["Website", "Personal"]],
  ["Coffee Shop", "A stylish WooCommerce coffee shop storefront with custom theme, products, and content.", ["WooCommerce", "Store"]],
  ["Feed Reader with the Friends Plugin", "By using the Friends plugin, you can read feeds from the web in Playground, and even via ActivityPub.", ["rss", "social web"]],
  ["Gaming News", "A gaming news site created with the Spiel theme.", ["Website", "News"]],
  ["Non-profit Organization", "A non-profit organization site created with the Koinonia theme.", ["Website", "Organization"]],
  ["Personal Blog", "A personal blog site created with the Substrata theme.", ["Website", "Personal", "Blog"]],
  ["Personal Resume", "A resume site created with the Readymade theme.", ["Website", "Personal"]],
  ["Photography Portfolio", "A photography portfolio created with the Grammer theme.", ["Website", "Personal", "Photography"]],
  ["Skincare Blog", "A skincare blog created with the Piel theme.", ["Website", "News", "Blog"]],
  ["University Website", "A university website created with the Kentwood theme.", ["Website", "Organization", "Education"]],
  ["Create Block Theme", "Blueprint to install Create Block Theme and start editing right away.", ["Editor", "theme"]],
  ["Creating a new user for the blog", "This is a simple example to update user meta data.", ["meta"]],
  ["Custom Post Type: Books", "Blueprint that added a custom post type to Playground.", ["Content", "CPT"]],
  ["Demo of Twenty-Twenty-Five theme", "Blueprint with demo content for the Twenty-Twenty-Five default theme.", ["Themes", "default"]],
  ["Display Admin Notice", "Blueprint to add a tiny mu-plugin and display an admin notice.", ["Admin", "notices"]],
  ["Enable all three Dataview Experiments in Gutenberg", "Blueprint example to enable multiple experiments within the Gutenberg plugin.", ["Gutenberg", "Experiments"]],
  ["Fancy Dashboard Widget", "A blueprint to display statistics about users, posts, and comments on a WordPress site.", ["Admin"]],
  ["Grid Variations Experiments enabled", "Blueprint example to toggle on a feature from the Experiments page in Gutenberg plugin.", ["Gutenberg", "Experiments"]],
  ["Gutenberg Guidelines Experiment enabled", "Enables the Gutenberg Guidelines experiment from the Gutenberg Experiments page.", ["Gutenberg", "Experiments"]],
  ["Import Theme Starter Content", "Blueprint to install a theme with starter content, here Twenty-Twenty-One.", ["Themes", "Starter Content"]],
  ["Import a standalone starter content via a blueprint step", "Blueprint to use a standalone starter content file and import it.", ["Themes", "Starter Content"]],
  ["Install WordPress language packs", "Installs and activates the latest WordPress Japanese translation pack.", ["core"]],
  ["Install plugin from a gist", "Install and activate a WordPress plugin from a PHP file stored in a gist.", ["plugins"]],
  ["Latest Gutenberg plugin", "A preview of the latest version of the Gutenberg plugin.", ["plugins", "Gutenberg"]],
  ["Loading, activating, and configuring a theme from a GitHub repository.", "Typical steps used for theme loading, activation, and configuration.", ["theme"]],
  ["Login as an editor", "Test WordPress functionality as an editor rather than an administrator.", ["User", "Role"]],
  ["Markdown and Trac Syntax Editor", "Edit Markdown and Trac formatting in the block editor thanks to the blocky-formats plugin.", ["block-editor"]],
  ["Minimal WooCommerce Setup with Sample Products, Shipping, and Payment Method", "Installs WooCommerce, imports sample products, and enables a payment method.", ["WooCommerce", "shipping", "flat_rate"]],
  ["My WordPress", "A welcome experience for persistent WordPress Playground instances.", ["Playground", "Onboarding"]],
  ["Playground Welcome Landing Page", "Landing page for WordPress Playground with an overview of features and capabilities.", ["meta"]],
  ["Pretty permalinks", "Set the permalink structure to use pretty permalinks.", ["Settings"]],
  ["Reset data and import content (with logs)", "Resets default data before importing custom content and logs each step.", ["reset", "log", "debug"]],
  ["Serve media files from another host", "Redirect upload file requests to an external host for large media libraries.", ["Settings"]],
  ["Set the admin color scheme", "Set the admin color scheme to Modern using the updateUserMeta step.", ["user meta"]],
  ["Showcase plugin", "Showcase a custom plugin from a server with media files and imported WXR content.", ["plugin", "demo", "media"]],
  ["Stylish Press", "A Woo store with custom theme, content, and products.", ["WooCommerce", "Site"]],
  ["Theme Tester", "Blueprint example to add content and plugins to explore a theme.", ["Themes", "Content"]],
  ["Use WPGraphQL to query WordPress", "Loads WordPress with WPGraphQL active and opens the WPGraphQL IDE page.", ["API", "wpgraphql"]],
  ["Use wp-cli command to add posts", "Blueprint example to add posts via a wp-cli command.", ["Content", "wpcli"]],
  ["Use wp-cli to add a post with image", "Use wp-cli to create a post from text file block markup and a featured image.", ["Content", "wpcli"]],
  ["Weather Shortcode Plugin", "A blueprint to connect a weather API and show data as shortcode on a WordPress site.", ["plugin"]],
  ["WooCommerce product feed", "Blueprint to create a WooCommerce product and export an XML or CSV product feed.", ["WooCommerce", "Content"]],
  ["WordPress Beta", "Test the latest WordPress Beta or RC release with theme test data and debugging plugins.", ["Testing"]]
].map(([title, description, tags]) => ({ title, description, tags }));

const categories = ["All", "Featured", "Website", "Personal", "Content", "Themes", "Gutenberg", "Experiments", "WooCommerce", "News"];
let activeCategory = "All";
let selectedBlueprint = blueprints[2];

const filterRoot = document.getElementById("categoryFilters");
const listRoot = document.getElementById("blueprintList");
const searchInput = document.getElementById("blueprintSearch");
const countNode = document.getElementById("catalogCount");
const selectedTitle = document.getElementById("selectedBlueprintTitle");
const selectedDescription = document.getElementById("selectedBlueprintDescription");
const selectedTags = document.getElementById("selectedBlueprintTags");

function matchesCategory(item) {
  if (activeCategory === "All") return true;
  if (activeCategory === "Featured") return blueprints.indexOf(item) < 10;
  return item.tags.some((tag) => tag.toLowerCase() === activeCategory.toLowerCase());
}

function matchesSearch(item) {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return true;
  return `${item.title} ${item.description} ${item.tags.join(" ")}`.toLowerCase().includes(query);
}

function renderSelected(item) {
  selectedBlueprint = item;
  selectedTitle.textContent = item.title;
  selectedDescription.textContent = item.description;
  selectedTags.innerHTML = "";
  item.tags.forEach((tag) => {
    const tagNode = document.createElement("span");
    tagNode.textContent = tag;
    selectedTags.appendChild(tagNode);
  });
}

function renderFilters() {
  filterRoot.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-button${category === activeCategory ? " active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      activeCategory = category;
      renderFilters();
      renderBlueprints();
    });
    filterRoot.appendChild(button);
  });
}

function renderBlueprints() {
  const visible = blueprints.filter((item) => matchesCategory(item) && matchesSearch(item));
  countNode.textContent = String(visible.length);
  listRoot.innerHTML = "";

  visible.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `blueprint-item${item.title === selectedBlueprint.title ? " selected" : ""}`;
    button.innerHTML = `
      <strong>${item.title}</strong>
      <p>${item.description}</p>
      <div class="tag-row">${item.tags.slice(0, 3).map((tag) => `<span>${tag}</span>`).join("")}</div>
    `;
    button.addEventListener("click", () => {
      renderSelected(item);
      renderBlueprints();
    });
    listRoot.appendChild(button);
  });
}

searchInput.addEventListener("input", renderBlueprints);
renderFilters();
renderSelected(selectedBlueprint);
renderBlueprints();
