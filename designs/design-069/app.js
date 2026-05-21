const drawerButtons = document.querySelectorAll("[data-drawer]");
const navButtons = document.querySelectorAll(".nav-item");
const drawerPanels = document.querySelectorAll(".drawer-panel");

function showDrawer(name) {
  drawerPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === `drawer-${name}`);
  });
  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.drawer === name);
  });
}

drawerButtons.forEach((button) => {
  button.addEventListener("click", () => showDrawer(button.dataset.drawer));
});

const destinations = document.querySelectorAll(".destination");
const saveMode = document.querySelector("#save-mode");
const saveCount = document.querySelector("#save-count");
const saveResult = document.querySelector("#save-result");
const saveBar = document.querySelector("#save-bar");

destinations.forEach((button) => {
  button.addEventListener("click", () => {
    destinations.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    if (button.dataset.destination === "local") {
      saveMode.textContent = "Local directory permission";
      saveCount.textContent = "Folder selected";
      saveResult.textContent = "Result: Local directory save ready at ~/Playgrounds/research-browser with reload from disk.";
      saveBar.style.width = "100%";
    } else {
      saveMode.textContent = "Browser storage copy";
      saveCount.textContent = "3028 / 3751 files";
      saveResult.textContent = "Result: Saved Playground named Research Browser Playground with browser-backed identity.";
      saveBar.style.width = "81%";
    }
  });
});

const managerTabs = document.querySelectorAll(".manager-tab");
const managerPanes = document.querySelectorAll(".manager-pane");

managerTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.manager;
    managerTabs.forEach((item) => item.classList.toggle("active", item === tab));
    managerPanes.forEach((pane) => pane.classList.toggle("active", pane.id === `manager-${target}`));
  });
});

const blueprints = [
  ["Art Gallery", "An art gallery created with the Vueo theme.", ["Website", "Personal"]],
  ["Coffee Shop", "A stylish WooCommerce coffee shop storefront with custom theme, products, and content.", ["WooCommerce", "Store"]],
  ["Feed Reader with the Friends Plugin", "Read feeds from the web in Playground and via ActivityPub.", ["rss", "social web"]],
  ["Gaming News", "A gaming news site created with the Spiel theme.", ["Website", "News"]],
  ["Non-profit Organization", "A non-profit organization site created with the Koinonia theme.", ["Website", "Organization"]],
  ["Personal Blog", "A personal blog site created with the Substrata theme.", ["Website", "Personal", "Blog"]],
  ["Personal Resume", "A resume site created with the Readymade theme.", ["Website", "Personal"]],
  ["Photography Portfolio", "A photography portfolio created with the Grammer theme.", ["Website", "Photography"]],
  ["Skincare Blog", "A skincare blog created with the Piel theme.", ["Website", "News", "Blog"]],
  ["University Website", "A university website created with the Kentwood theme.", ["Website", "Education"]],
  ["Create Block Theme", "Install Create Block Theme and start editing right away.", ["Editor", "theme"]],
  ["Creating a new user for the blog", "A simple example that updates user meta data.", ["meta"]],
  ["Custom Post Type: Books", "Blueprint that adds a custom post type to Playground.", ["Content", "CPT"]],
  ["Demo of Twenty Twenty-Five theme", "Demo content for the Twenty Twenty-Five default theme.", ["Themes", "default"]],
  ["Display Admin Notice", "Add a tiny mu-plugin and display an admin notice.", ["Admin", "notices"]],
  ["Enable all three Dataview Experiments in Gutenberg", "Enable multiple experiments within the Gutenberg plugin.", ["Gutenberg", "Experiments"]],
  ["Fancy Dashboard Widget", "Display statistics about users, posts, and comments.", ["Admin", "dashboard"]],
  ["Grid Variations Experiments enabled", "Toggle on a Gutenberg Experiments page feature.", ["Gutenberg", "Experiments"]],
  ["Gutenberg Guidelines Experiment enabled", "Enable the Gutenberg Guidelines experiment.", ["Gutenberg", "Experiments"]],
  ["Import Theme Starter Content", "Install a theme with starter content.", ["Themes", "Starter Content"]],
  ["Import a standalone starter content via a blueprint step", "Import a stand-alone starter content file.", ["Themes", "Starter Content"]],
  ["Install WordPress language packs", "Install and activate WordPress Japanese translation packs.", ["core", "language"]],
  ["Install plugin from a gist", "Install and activate a plugin from a PHP file stored in a gist.", ["plugins"]],
  ["Latest Gutenberg plugin", "Preview the latest version of the Gutenberg plugin.", ["plugins", "Gutenberg"]],
  ["Loading, activating, and configuring a theme from a GitHub repository", "Typical steps for theme loading, activation, and configuration.", ["theme", "GitHub"]],
  ["Login as an editor", "Test WordPress functionality as an editor rather than administrator.", ["User", "Role"]],
  ["Markdown and Trac Syntax Editor", "Edit Markdown and Trac formatting in the block editor.", ["block-editor"]],
  ["Minimal WooCommerce Setup with Sample Products, Shipping, and Payment Method", "Install WooCommerce, sample products, shipping, and Direct Bank Transfer.", ["WooCommerce", "shipping"]],
  ["My WordPress", "Persistent Playground welcome experience with site naming and RSS import.", ["Playground", "Onboarding"]],
  ["Playground Welcome Landing Page", "Landing page with a quick overview of Playground capabilities.", ["meta"]],
  ["Pretty permalinks", "Set the permalink structure to use pretty permalinks.", ["Settings"]],
  ["Reset data and import content (with logs)", "Reset default data before importing custom content and log each step.", ["reset", "log", "debug"]],
  ["Serve media files from another host", "Redirect uploads requests to an external host.", ["Settings", "media"]],
  ["Set the admin color scheme", "Set the admin color scheme to Modern using updateUserMeta.", ["user meta"]],
  ["Showcase plugin", "Showcase a custom plugin with media files and WXR content.", ["plugin", "demo", "media"]],
  ["Stylish Press", "A Woo store with custom theme, content, and products.", ["WooCommerce", "Theme"]],
  ["Theme Tester", "Add content and plugins to explore a theme.", ["themes", "content"]],
  ["Use WPGraphQL to query WordPress", "Load WPGraphQL and open the GraphQL IDE page.", ["API", "wpgraphql"]],
  ["Use wp-cli command to add posts", "Add posts using a wp-cli command.", ["Content", "wpcli"]],
  ["Use wp-cli to add a post with image", "Create a post from block markup and a featured image.", ["Content", "wpcli"]],
  ["Weather Shortcode Plugin", "Connect a weather API and show data as a shortcode.", ["plugin", "API"]],
  ["WooCommerce product feed", "Create a WooCommerce product and export XML or CSV product feed.", ["WooCommerce", "Content"]],
  ["WordPress Beta", "Test the latest WordPress Beta or RC release with test data and debugging plugins.", ["Testing"]]
];

const catalog = document.querySelector("#blueprintCatalog");

if (catalog) {
  catalog.innerHTML = blueprints.map(([title, description, tags]) => `
    <article class="blueprint-item">
      <div class="blueprint-thumb" aria-hidden="true"></div>
      <div>
        <strong>${title}</strong>
        <span>${description}</span>
        <div class="blueprint-tags">${tags.map((tag) => `<b>${tag}</b>`).join("")}</div>
      </div>
    </article>
  `).join("");
}
