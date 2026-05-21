const app = document.querySelector(".app");
const searchInput = document.querySelector("#commandSearch");
const resultCount = document.querySelector("#resultCount");
const rows = Array.from(document.querySelectorAll(".command-row"));
const filters = Array.from(document.querySelectorAll(".filter"));
const drawerKicker = document.querySelector("#drawerKicker");
const drawerTitle = document.querySelector("#drawerTitle");
const drawerBody = document.querySelector("#drawerBody");

const panels = {
  "wp-pr": {
    kicker: "Start source",
    title: "Preview a WordPress PR",
    body: `
      <section class="drawer-section">
        <div class="warning"><strong>Import-over-current-site consequence:</strong> previewing this PR starts a new WordPress build and replaces the temporary Playground unless you save it first.</div>
        <div class="field">
          <label for="wp-pr-input">PR number or URL</label>
          <input id="wp-pr-input" value="https://github.com/WordPress/wordpress-develop/pull/61234">
        </div>
        <div class="field">
          <label for="wp-pr-version">WordPress version constraint</label>
          <select id="wp-pr-version"><option>Use PR build with latest compatible WordPress</option><option>Include older versions</option></select>
        </div>
        <div class="button-row"><button type="button">Cancel</button><button class="primary" type="button">Preview PR</button></div>
        <div class="result"><strong>Result state shown in this wireframe:</strong> WordPress PR #61234 launched, saved as <code>research-browser</code>, then opened in Site Manager for inspection.</div>
      </section>`
  },
  "gutenberg-pr": {
    kicker: "Start source",
    title: "Preview a Gutenberg PR or branch",
    body: `
      <section class="drawer-section">
        <div class="field"><label>PR number, URL, or branch name</label><input value="trunk"></div>
        <div class="notice">This route is branch-aware. It is not the same as a WordPress core PR preview.</div>
        <div class="button-row"><button type="button">Cancel</button><button class="primary" type="button">Preview Gutenberg</button></div>
      </section>`
  },
  vanilla: {
    kicker: "Start source",
    title: "Start Vanilla WordPress",
    body: `
      <section class="drawer-section">
        <div class="notice">Starts a clean Playground immediately using latest WordPress and the selected PHP/runtime settings.</div>
        <div class="settings-grid">
          <div class="field"><label>WordPress</label><select><option>Latest</option><option>Include older versions</option></select></div>
          <div class="field"><label>PHP</label><select><option>PHP 8.3</option><option>PHP 8.2</option></select></div>
        </div>
        <div class="button-row"><button type="button">Cancel</button><button class="primary" type="button">Start Vanilla WordPress</button></div>
      </section>`
  },
  github: {
    kicker: "Import source",
    title: "Import from GitHub",
    body: `
      <section class="drawer-section">
        <div class="notice">Imports plugins, themes, or <code>wp-content</code> directories from public GitHub repositories. The access token is not stored and sign-in is required again after refresh.</div>
        <div class="field"><label>Repository path</label><input value="WordPress/gutenberg"></div>
        <div class="segmented"><button class="active" type="button">Plugin</button><button type="button">Theme</button><button type="button">wp-content</button></div>
        <div class="button-row"><button type="button">Cancel</button><button class="primary" type="button">Connect GitHub account</button></div>
      </section>`
  },
  "blueprint-url": {
    kicker: "Blueprint run",
    title: "Run Blueprint from URL",
    body: `
      <section class="drawer-section">
        <div class="field"><label>Blueprint URL</label><input value="https://playground.wordpress.net/blueprints/plugin-test.json"></div>
        <div class="warning">Running a Blueprint can modify content, plugins, themes, and settings in the current Playground.</div>
        <div class="button-row"><button type="button">Cancel</button><button class="primary" type="button">Run Blueprint</button></div>
      </section>`
  },
  zip: {
    kicker: "Import source",
    title: "Import .zip",
    body: `
      <section class="drawer-section">
        <div class="warning"><strong>Replaces the current site:</strong> importing a zip opens the local file chooser and applies the archive over this Playground.</div>
        <div class="field"><label>Selected archive</label><input value="theme-review-fixture.zip"></div>
        <div class="progress"><div class="bar"><span style="width:64%"></span></div><small>Import preview: 1 theme, 2 plugins, wp-content uploads detected.</small></div>
        <div class="button-row"><button type="button">Cancel</button><button class="primary" type="button">Browse files...</button></div>
      </section>`
  },
  save: {
    kicker: "Save current",
    title: "Save Playground",
    body: `
      <section class="drawer-section">
        <div class="field"><label>Playground name</label><input value="Research Browser Playground"></div>
        <div class="segmented" data-save-tabs><button class="active" type="button" data-save-mode="browser">Save in this browser</button><button type="button" data-save-mode="local">Save to a local directory</button></div>
        <div id="saveModeBody">
          <div class="notice"><strong>Browser storage:</strong> addressable as <code>/research-browser/</code> from Saved Playgrounds on this browser.</div>
          <div class="progress"><div class="bar"><span></span></div><small>Saving 3028 / 3751 files</small></div>
        </div>
        <div class="button-row"><button type="button">Cancel</button><button class="primary" type="button">Save</button></div>
        <div class="result">Result: shell title becomes <strong>Saved Playground</strong>; saved list row exposes Rename and Delete.</div>
      </section>`
  },
  library: {
    kicker: "Saved management",
    title: "Saved Playgrounds",
    body: `
      <section class="drawer-section">
        <div class="table">
          <div class="table-row"><div><strong>Unsaved Playground</strong><small>Temporary. Not saved to browser storage.</small></div><button type="button" data-command="save">Save</button></div>
          <div class="table-row"><div><strong>Research Browser Playground</strong><small>Created May 21, 2026 · /research-browser/</small></div><span class="button-row"><button type="button">Open</button><button type="button">Rename</button><button class="danger" type="button">Delete</button></span></div>
        </div>
        <div class="field"><label>Rename selected saved Playground</label><input value="Research Browser Playground"></div>
        <div class="warning">Delete removes the browser-backed Playground from this device. It does not affect exported zip files or GitHub repositories.</div>
      </section>`
  },
  settings: {
    kicker: "Site Manager",
    title: "Settings, reset, and reload",
    body: `
      <section class="drawer-section">
        <div class="settings-grid">
          <div class="field"><label>WordPress version</label><select><option>Latest</option><option>6.5</option><option>6.4</option></select></div>
          <div class="field"><label>PHP version</label><select><option>PHP 8.3</option><option>PHP 8.2</option><option>PHP 8.1</option></select></div>
          <div class="field"><label>Language</label><select><option>English (United States)</option><option>Polski</option></select></div>
          <label class="check-row"><input type="checkbox" checked><span><strong>Include older versions</strong><small>Expose older WordPress builds.</small></span></label>
          <label class="check-row"><input type="checkbox" checked><span><strong>Allow network access</strong><small>Permit outbound requests.</small></span></label>
          <label class="check-row"><input type="checkbox"><span><strong>Create a multisite network</strong><small>Requires reset/reload.</small></span></label>
        </div>
        <div class="warning">Unsaved Playgrounds use <strong>Apply Settings & Reset Playground</strong>. Stored Playgrounds use <strong>Save & Reload</strong> and have limited configuration options.</div>
        <div class="button-row"><button class="danger" type="button">Apply Settings & Reset Playground</button><button class="primary" type="button">Save & Reload</button></div>
      </section>`
  },
  files: {
    kicker: "Site Manager",
    title: "File browser",
    body: `
      <section class="drawer-section">
        <div class="toolbar"><button type="button">New File</button><button type="button">New Folder</button><button type="button">Upload</button><button type="button">Browse files</button></div>
        <div class="file-layout">
          <div class="file-tree"><div class="active">/wordpress</div><div>wp-admin</div><div>wp-content</div><div>wp-includes</div><div>index.php</div><div>wp-config.php</div></div>
          <pre class="code">&lt;?php define('CONCATENATE_SCRIPTS', false);
/** Database settings */
define('DB_NAME', 'database_name_here');
define('DB_USER', 'username_here');
define('DB_PASSWORD', 'password_here');
define('DB_HOST', 'localhost');</pre>
        </div>
      </section>`
  },
  blueprint: {
    kicker: "Site Manager",
    title: "Current blueprint.json",
    body: `
      <section class="drawer-section">
        <div class="toolbar"><button type="button">New File</button><button type="button">New Folder</button><button type="button">Upload</button><button type="button">Browse files</button></div>
        <div class="button-row"><button type="button">Copy link to Blueprint</button><button type="button">Download bundle</button><button class="primary" type="button">Run Blueprint</button></div>
        <div class="field"><label>/blueprint.json</label><textarea>{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "login": true,
  "landingPage": "/hello-from-playground/",
  "preferredVersions": { "php": "8.3", "wp": "latest" }
}</textarea></div>
      </section>`
  },
  database: {
    kicker: "Site Manager",
    title: "Database",
    body: `
      <section class="drawer-section">
        <div class="notice"><strong>Database management is an early access feature.</strong> WordPress Playground emulates MySQL using SQLite.</div>
        <div class="table">
          <div class="table-row"><strong>Database driver</strong><span>MySQL emulation backed by SQLite</span></div>
          <div class="table-row"><strong>SQLite database path</strong><span><code>/wordpress/wp-content/database/.ht.sqlite</code></span></div>
          <div class="table-row"><strong>Size</strong><span>452 KB</span></div>
        </div>
        <div class="button-row"><button type="button">Download database.sqlite</button><button class="primary" type="button">Open Adminer</button><button class="primary" type="button">Open phpMyAdmin</button></div>
      </section>`
  },
  logs: {
    kicker: "Site Manager",
    title: "Logs",
    body: `
      <section class="drawer-section">
        <div class="table">
          <div class="table-row"><div><strong>Playground logs</strong><small>No problems so far.</small></div><span>Empty</span></div>
          <div class="table-row"><div><strong>WordPress logs</strong><small>No warnings captured.</small></div><span>Empty</span></div>
          <div class="table-row"><div><strong>PHP logs</strong><small>No PHP errors.</small></div><span>Empty</span></div>
        </div>
      </section>`
  },
  gallery: {
    kicker: "Blueprint catalog",
    title: "Blueprint gallery",
    body: `
      <section class="drawer-section">
        <div class="gallery-tools">
          <div class="search-line"><div class="field"><input value="friends plugin" aria-label="Search Blueprints"></div><button type="button">Search</button></div>
          <div class="chip-row"><button class="chip active" type="button">All</button><button class="chip" type="button">Featured</button><button class="chip" type="button">Website</button><button class="chip" type="button">Personal</button><button class="chip" type="button">Content</button><button class="chip" type="button">Themes</button><button class="chip" type="button">Gutenberg</button><button class="chip" type="button">Experiments</button><button class="chip" type="button">WooCommerce</button><button class="chip" type="button">News</button></div>
        </div>
        <div class="notice">Showing 1-12 of 43 Blueprint catalog entries. Featured shortcuts remain available from the launcher.</div>
        <div class="gallery-grid">
          ${["Art Gallery","Coffee Shop","Feed Reader with the Friends Plugin","Gaming News","Non-profit Organization","Personal Blog","Woo Store Checkout","Block Theme Starter","Pattern Directory Demo","SQLite Lab","Multisite Sample","WP-CLI Posts"].map((name, index) => `<button class="blueprint-card ${index === 2 ? "selected feed" : index === 1 ? "coffee" : index === 3 ? "gaming" : index === 4 ? "nonprofit" : index === 5 ? "blog" : ""}" type="button"><span class="thumb"></span><strong>${name}</strong><small>${index === 2 ? "Selected · rss · social web" : "Website · Theme · Demo"}</small></button>`).join("")}
        </div>
        <div class="gallery-detail">
          <h3>Feed Reader with the Friends Plugin</h3>
          <p>Use the Friends plugin to read feeds from the web in Playground and inspect the installed plugin/content steps before running.</p>
          <div class="tagline"><span>rss</span><span>social web</span><span>plugin</span><span>featured</span></div>
          <div class="button-row"><button type="button">Inspect Blueprint</button><button class="primary" type="button">Run selected</button></div>
        </div>
      </section>`
  },
  export: {
    kicker: "Import / export",
    title: "Export and download artifacts",
    body: `
      <section class="drawer-section">
        <div class="artifact-grid">
          <div class="card"><strong>Export to GitHub</strong><span>Push current site files after account connection.</span><button type="button">Export</button></div>
          <div class="card"><strong>Download .zip</strong><span>Package the current Playground.</span><button type="button">Download</button></div>
          <div class="card"><strong>Blueprint bundle</strong><span>Download the current blueprint assets.</span><button type="button">Download bundle</button></div>
          <div class="card"><strong>database.sqlite</strong><span>Download the SQLite database from Database.</span><button type="button">Download DB</button></div>
        </div>
        <div class="result">Export result: <code>research-browser.zip</code> prepared after saving to browser storage; GitHub export still requires account connection.</div>
      </section>`
  },
  homepage: {
    kicker: "Navigation",
    title: "Open Homepage",
    body: `<section class="drawer-section"><div class="notice">Navigates the embedded WordPress site to <code>/</code> without leaving the Playground shell.</div><button class="primary" type="button">Open Homepage</button></section>`
  },
  "wp-admin": {
    kicker: "Navigation",
    title: "Open WP Admin",
    body: `<section class="drawer-section"><div class="notice">Opens <code>/wp-admin/</code> in the embedded frame as the logged-in <code>admin</code> user.</div><button class="primary" type="button">Open WP Admin</button></section>`
  }
};

function selectCommand(command) {
  const panel = panels[command] || panels["wp-pr"];
  rows.forEach((row) => row.classList.toggle("selected", row.dataset.command === command));
  document.querySelectorAll("[data-command]").forEach((item) => {
    if (item.classList.contains("nav-button")) {
      item.classList.toggle("active", item.dataset.command === command);
    }
  });
  drawerKicker.textContent = panel.kicker;
  drawerTitle.textContent = panel.title;
  drawerBody.innerHTML = panel.body;
  app.dataset.drawerOpen = "true";
  bindDrawerControls();
}

function applySearch() {
  const query = searchInput.value.trim().toLowerCase();
  const activeFilter = document.querySelector(".filter.active")?.dataset.filter || "all";
  let visible = 0;
  rows.forEach((row) => {
    const text = row.textContent.toLowerCase() + " " + (row.dataset.tags || "");
    const groupMatch = activeFilter === "all" || (row.dataset.tags || "").includes(activeFilter);
    const queryMatch = !query || text.includes(query);
    const show = groupMatch && queryMatch;
    row.hidden = !show;
    if (show) visible += 1;
  });
  resultCount.textContent = `${visible} result${visible === 1 ? "" : "s"}`;
}

function bindDrawerControls() {
  drawerBody.querySelectorAll("[data-command]").forEach((button) => {
    button.addEventListener("click", () => selectCommand(button.dataset.command));
  });
  drawerBody.querySelectorAll("[data-save-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      drawerBody.querySelectorAll("[data-save-mode]").forEach((tab) => tab.classList.toggle("active", tab === button));
      const modeBody = drawerBody.querySelector("#saveModeBody");
      if (!modeBody) return;
      if (button.dataset.saveMode === "local") {
        modeBody.innerHTML = `<div class="notice"><strong>Local directory:</strong> asks for a folder on this device and keeps future file writes connected to that directory.</div><div class="progress"><div class="bar"><span style="width:42%"></span></div><small>Requesting directory permission, then copying WordPress files</small></div>`;
      } else {
        modeBody.innerHTML = `<div class="notice"><strong>Browser storage:</strong> addressable as <code>/research-browser/</code> from Saved Playgrounds on this browser.</div><div class="progress"><div class="bar"><span></span></div><small>Saving 3028 / 3751 files</small></div>`;
      }
    });
  });
}

document.querySelectorAll("[data-command]").forEach((item) => {
  item.addEventListener("click", () => selectCommand(item.dataset.command));
});

document.querySelectorAll("[data-toggle-drawer]").forEach((button) => {
  button.addEventListener("click", () => {
    app.dataset.drawerOpen = app.dataset.drawerOpen === "true" ? "false" : "true";
  });
});

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((item) => item.classList.toggle("active", item === filter));
    applySearch();
  });
});

searchInput.addEventListener("input", applySearch);

selectCommand("wp-pr");
applySearch();
