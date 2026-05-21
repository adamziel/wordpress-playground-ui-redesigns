const panels = {
	overview: {
		title: "Document Overview",
		body: `
			<section class="detail-card">
				<h3>Current brief</h3>
				<p class="drawer-text">A documentation writer can keep the active site, setup source, runtime settings, saved state, and export artifacts in one project document instead of jumping through modal stacks.</p>
				<div class="detail-meta">
					<div><span>Active route</span><strong>/hello-from-playground/</strong></div>
					<div><span>Save state</span><strong>Unsaved Playground</strong></div>
					<div><span>Site manager</span><strong>Settings, files, blueprint, database, logs</strong></div>
					<div><span>Blueprints</span><strong>43 gallery entries</strong></div>
				</div>
				<div class="detail-actions">
					<button type="button" class="primary" data-panel="save">Save draft</button>
					<button type="button" data-panel="create">Change source</button>
					<button type="button" data-panel="settings">Edit settings</button>
				</div>
			</section>
			${previewPanel()}
		`
	},
	create: {
		title: "Start Sources",
		body: `
			<section class="detail-card">
				<h3>Create a new Playground</h3>
				<p class="drawer-text">The same start options are presented as document clauses so a writer can record how the demo was built.</p>
				<div class="detail-actions">
					<button type="button" data-panel="vanilla">Vanilla WordPress</button>
					<button type="button" data-panel="wp-pr">WordPress PR</button>
					<button type="button" data-panel="gutenberg-pr">Gutenberg PR or branch</button>
					<button type="button" data-panel="github">From GitHub</button>
					<button type="button" data-panel="blueprint-url">Blueprint URL</button>
					<button type="button" data-panel="zip-import">Import .zip</button>
				</div>
			</section>
			<section class="detail-card">
				<h3>Featured blueprints</h3>
				<p class="drawer-text">Shortcuts: Art Gallery, Coffee Shop, Feed Reader with the Friends Plugin, Gaming News, and Non-profit Organization.</p>
				<button type="button" class="primary" data-panel="gallery">Open full Blueprint gallery</button>
			</section>
		`
	},
	vanilla: {
		title: "Vanilla WordPress",
		body: `
			<section class="detail-card">
				<h3>Start clean</h3>
				<p class="drawer-text">Starts a fresh WordPress Playground with the current runtime preferences.</p>
				<div class="detail-meta">
					<div><span>WordPress</span><strong>Latest</strong></div>
					<div><span>PHP</span><strong>8.3</strong></div>
				</div>
				<button type="button" class="primary">Start Vanilla WordPress</button>
			</section>
		`
	},
	"wp-pr": {
		title: "Preview WordPress PR",
		body: `
			<section class="form-card">
				<h3>Preview a WordPress PR</h3>
				<label class="field"><span class="mini-label">PR number or URL</span><input value="https://github.com/WordPress/wordpress-develop/pull/" /></label>
				<p class="field-help">Core pull requests can be entered by number or full URL.</p>
				<div class="button-row"><button type="button">Cancel</button><button type="button" class="primary">Preview</button></div>
			</section>
		`
	},
	"gutenberg-pr": {
		title: "Preview Gutenberg PR Or Branch",
		body: `
			<section class="form-card">
				<h3>Preview Gutenberg work</h3>
				<label class="field"><span class="mini-label">PR number, URL, or branch name</span><input value="trunk" /></label>
				<p class="field-help">Useful for editor documentation where a Gutenberg PR or branch needs validation.</p>
				<div class="button-row"><button type="button">Cancel</button><button type="button" class="primary">Preview</button></div>
			</section>
		`
	},
	github: {
		title: "Import From GitHub",
		body: `
			<section class="detail-card">
				<h3>Connect GitHub account</h3>
				<p class="drawer-text">Imports public plugins, themes, and wp-content directories from GitHub. The access token is not stored, so re-authentication is required after refresh.</p>
				<button type="button" class="primary">Connect GitHub</button>
			</section>
		`
	},
	"blueprint-url": {
		title: "Run Blueprint From URL",
		body: `
			<section class="form-card">
				<h3>Remote Blueprint</h3>
				<label class="field"><span class="mini-label">Blueprint URL</span><input value="https://example.com/blueprint.json" /></label>
				<div class="button-row"><button type="button">Cancel</button><button type="button" class="primary">Run Blueprint</button></div>
			</section>
		`
	},
	"zip-import": {
		title: "Import .zip",
		body: `
			<section class="detail-card">
				<h3>Archive import</h3>
				<p class="drawer-text">Import opens the native file chooser for a Playground zip bundle, matching the captured product behavior.</p>
				<button type="button" class="primary">Choose .zip file</button>
			</section>
		`
	},
	gallery: {
		title: "Blueprint Gallery",
		body: `
			<section class="form-card">
				<h3>Browse all 43 blueprints</h3>
				<input aria-label="Search Blueprints" value="Search Blueprints" />
				<div class="chips">
					<button type="button" class="selected">All</button><button type="button">Featured</button><button type="button">Website</button><button type="button">Personal</button><button type="button">Content</button><button type="button">Themes</button><button type="button">Gutenberg</button><button type="button">Experiments</button><button type="button">WooCommerce</button><button type="button">News</button>
				</div>
			</section>
			<section class="detail-card">
				<h3>Visible examples</h3>
				<p class="drawer-text">Art Gallery, Coffee Shop, Feed Reader with the Friends Plugin, Gaming News, Non-profit Organization, and Personal Blog cards keep descriptions and tags visible.</p>
				<button type="button" class="primary">Use selected Blueprint</button>
			</section>
		`
	},
	save: {
		title: "Save Playground",
		body: `
			<section class="form-card">
				<h3>Save temporary Playground</h3>
				<p class="drawer-text">A temporary Playground is lost on refresh or close unless saved.</p>
				<label class="field"><span class="mini-label">Playground name</span><input value="Research Browser Playground" /></label>
				<div class="segmented">
					<button type="button" class="primary">Save in this browser</button>
					<button type="button">Save to a local directory</button>
				</div>
				<div class="save-progress">
					<div><span>Copy progress</span><strong>3028 / 3751 files</strong></div>
					<div class="progress-bar"><span></span></div>
				</div>
				<div class="button-row"><button type="button">Cancel</button><button type="button" class="primary">Save</button></div>
			</section>
		`
	},
	saved: {
		title: "Saved Playgrounds",
		body: `
			<section class="detail-card">
				<h3>Saved management</h3>
				<div class="detail-meta">
					<div><span>Unsaved Playground</span><strong>Not saved to browser storage</strong></div>
					<div><span>Research Browser Playground</span><strong>Created May 21, 2026</strong></div>
				</div>
				<div class="detail-actions">
					<button type="button" data-panel="saved-actions">Rename saved Playground</button>
					<button type="button" class="pill-danger" data-panel="saved-actions">Delete saved Playground</button>
				</div>
			</section>
			<section class="detail-card">
				<h3>Start new from library</h3>
				<p class="drawer-text">Vanilla WordPress, WordPress PR, Gutenberg PR, From GitHub, Blueprint URL, Import .zip, featured blueprints, and View all 43 blueprints remain available here.</p>
			</section>
		`
	},
	"saved-actions": {
		title: "Rename Or Delete",
		body: `
			<section class="form-card">
				<h3>Saved Playground actions</h3>
				<label class="field"><span class="mini-label">Name</span><input value="Research Browser Playground" /></label>
				<div class="button-row"><button type="button" class="primary">Rename</button><button type="button" class="pill-danger">Delete</button></div>
			</section>
		`
	},
	settings: {
		title: "Runtime Settings",
		body: `
			<section class="form-card">
				<h3>Settings</h3>
				<label class="field"><span class="mini-label">WordPress version</span><select><option>Latest</option><option>6.9</option><option>6.8</option></select></label>
				<label class="check-row"><input type="checkbox" /> Include older versions</label>
				<label class="field"><span class="mini-label">PHP version</span><select><option>PHP 8.3</option><option>PHP 8.2</option><option>PHP 7.4</option></select></label>
				<label class="field"><span class="mini-label">Language</span><select><option>English (United States)</option></select></label>
				<label class="check-row"><input type="checkbox" checked /> Allow network access</label>
				<label class="check-row"><input type="checkbox" /> Create a multisite network</label>
				<p class="field-help">Applying settings resets an unsaved Playground. Stored Playgrounds use Save & Reload and expose limited configuration options.</p>
				<button type="button" class="primary">Apply Settings & Reset Playground</button>
			</section>
		`
	},
	files: {
		title: "File Browser",
		body: `
			<section class="detail-card">
				<h3>/wordpress file browser</h3>
				<div class="button-row"><button type="button">New File</button><button type="button">New Folder</button><button type="button">Upload</button><button type="button">Browse files</button></div>
				<div class="file-layout">
					<div class="file-tree"><span>/wordpress</span><span>wp-admin</span><span>wp-content</span><span>wp-includes</span><span>wp-config.php</span></div>
					<div class="code-card"><h3>wp-config.php</h3><pre>&lt;?php define( 'DB_NAME', 'database_name_here' );
define( 'DB_USER', 'username_here' );
define( 'DB_HOST', 'localhost' );</pre></div>
				</div>
			</section>
		`
	},
	blueprint: {
		title: "Blueprint Editor",
		body: `
			<section class="detail-card">
				<h3>blueprint.json</h3>
				<div class="button-row"><button type="button">Create file</button><button type="button">Create folder</button><button type="button">Upload</button><button type="button">Browse files</button><button type="button">Copy link</button><button type="button">Download bundle</button><button type="button" class="primary">Run Blueprint</button></div>
				<div class="code-card"><pre>{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "landingPage": "/hello-from-playground/",
  "login": true,
  "preferredVersions": { "php": "8.3", "wp": "latest" }
}</pre></div>
			</section>
		`
	},
	database: {
		title: "Database",
		body: `
			<section class="detail-card">
				<h3>Database management</h3>
				<p class="drawer-text">Early access database tools for MySQL emulation backed by SQLite.</p>
				<div class="detail-meta">
					<div><span>Driver</span><strong>MySQL emulation backed by SQLite</strong></div>
					<div><span>Path</span><strong>/wordpress/wp-content/database/.ht.sqlite</strong></div>
					<div><span>Size</span><strong>452 KB</strong></div>
					<div><span>Tools</span><strong>Adminer / phpMyAdmin</strong></div>
				</div>
				<div class="button-row"><button type="button">Download database.sqlite</button><button type="button" class="primary">Open Adminer</button><button type="button">Open phpMyAdmin</button></div>
			</section>
		`
	},
	logs: {
		title: "Logs",
		body: `
			<section class="log-panel">
				<h3>Diagnostics</h3>
				<p class="drawer-text">Switch between Playground, WordPress, and PHP logs.</p>
				<div class="segmented"><button type="button" class="primary">Playground</button><button type="button">WordPress</button><button type="button">PHP</button></div>
				<pre>No problems so far.</pre>
			</section>
		`
	},
	preview: {
		title: "Live WordPress Preview",
		body: previewPanel()
	},
	export: {
		title: "Export And Artifacts",
		body: `
			<section class="detail-card">
				<h3>Package the demo</h3>
				<div class="detail-actions">
					<button type="button" data-panel="export-github">Export to GitHub</button>
					<button type="button" data-panel="download-zip">Download as .zip</button>
					<button type="button" data-panel="blueprint">Copy Blueprint link</button>
					<button type="button" data-panel="blueprint">Download Blueprint bundle</button>
					<button type="button" data-panel="database">Download database.sqlite</button>
				</div>
			</section>
		`
	},
	"export-github": {
		title: "Export To GitHub",
		body: `<section class="detail-card"><h3>GitHub export</h3><p class="drawer-text">Export the current Playground to a connected GitHub account.</p><button type="button" class="primary">Export to GitHub</button></section>`
	},
	"download-zip": {
		title: "Download .zip",
		body: `<section class="detail-card"><h3>Archive download</h3><p class="drawer-text">Download the full Playground as a reusable .zip package.</p><button type="button" class="primary">Download as .zip</button></section>`
	}
};

function previewPanel() {
	return `
		<section class="mini-preview">
			<div class="preview-bar"><span>R</span><strong>/hello-from-playground/</strong><span>Saved Playground</span></div>
			<div class="preview-site">
				<nav><strong>My WordPress Website</strong><span>Hello from WordPress Playground!</span><span>Sample Page</span></nav>
				<div class="preview-hero">
					<div>
						<h4>Hello from <span>WordPress Playground!</span></h4>
						<p class="drawer-text">This embedded site can be navigated by path, refreshed, opened at Homepage, or opened in WP Admin.</p>
					</div>
					<div class="wp-orbit" aria-hidden="true">W</div>
				</div>
			</div>
		</section>
	`;
}

const drawerTitle = document.querySelector("#drawer-title");
const drawerContent = document.querySelector("#drawer-content");

function setPanel(name) {
	const panel = panels[name] || panels.overview;
	drawerTitle.textContent = panel.title;
	drawerContent.innerHTML = panel.body;
	document.querySelectorAll("[data-panel]").forEach((button) => {
		button.classList.toggle("active", button.dataset.panel === name);
	});
}

document.addEventListener("click", (event) => {
	const trigger = event.target.closest("[data-panel]");
	if (!trigger) {
		return;
	}
	setPanel(trigger.dataset.panel);
});

setPanel("overview");
