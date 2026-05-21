const outlineLinks = [...document.querySelectorAll(".outline-link")];
const contextTitle = document.querySelector("#context-title");
const contextBody = document.querySelector("#context-body");
const contextTabs = [...document.querySelectorAll(".tab-strip button")];

const sectionTitles = {
  brief: "Brief",
  start: "Starts",
  save: "Save",
  library: "Library",
  settings: "Settings",
  files: "Files",
  blueprint: "Blueprint",
  data: "Data and logs"
};

const contextTemplates = {
  notes: `
    <label class="field">
      <span>Evidence note</span>
      <textarea>Homepage loads after branch install. Next compare block editor behavior in WP Admin before exporting the snapshot.</textarea>
    </label>
    <div class="inline-actions">
      <button class="button primary">Attach note to section</button>
      <button class="button">Clear</button>
    </div>
  `,
  files: `
    <div class="file-editor">
      <div class="tree">
        <strong>/wordpress</strong>
        <span>wp-content</span>
        <span class="selected">wp-config.php</span>
        <span>index.php</span>
      </div>
      <pre><code>define('DB_NAME', 'database_name_here');
define('DB_HOST', 'localhost');</code></pre>
    </div>
    <div class="inline-actions">
      <button class="button small">New File</button>
      <button class="button small">New Folder</button>
      <button class="button small">Upload</button>
      <button class="button small">Browse files</button>
    </div>
  `,
  blueprint: `
    <pre class="json-code"><code>{
  "landingPage": "/hello-from-playground/",
  "preferredVersions": { "php": "8.3", "wp": "latest" }
}</code></pre>
    <div class="inline-actions">
      <button class="button small">Copy link</button>
      <button class="button small">Download bundle</button>
      <button class="button small primary">Run Blueprint</button>
    </div>
  `,
  logs: `
    <div class="diagnostic-grid">
      <div class="mini-card">
        <strong>Logs</strong>
        <span>Playground: empty</span>
        <span>WordPress: empty</span>
        <span>PHP: empty</span>
      </div>
      <div class="mini-card">
        <strong>Database</strong>
        <span>SQLite path: /wordpress/wp-content/database/.ht.sqlite</span>
        <span>Size: 452 KB</span>
      </div>
    </div>
    <div class="inline-actions">
      <button class="button small">Download database.sqlite</button>
      <button class="button small">Open Adminer</button>
      <button class="button small">Open phpMyAdmin</button>
    </div>
  `
};

outlineLinks.forEach((link) => {
  link.addEventListener("click", () => {
    outlineLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    contextTitle.textContent = sectionTitles[link.dataset.section] || "Brief";
  });
});

contextTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    contextTabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    contextBody.innerHTML = contextTemplates[tab.dataset.context];
  });
});
