const app = document.querySelector(".app");
const modal = document.querySelector("#command-modal");
const modalTitle = document.querySelector("#modal-title");
const modalKicker = document.querySelector("#modal-kicker");
const modalBody = document.querySelector("#modal-body");
const modalActions = document.querySelector("#modal-actions");
const inspectorTitle = document.querySelector("#inspector-title");
const inspectorKicker = document.querySelector("#inspector-kicker");
const inspectorStatus = document.querySelector("#inspector-status");
const inspectorBody = document.querySelector("#inspector-body");
const inspectorActions = document.querySelector("#inspector-actions");

const commands = {
	save: {
		kicker: "Save",
		title: "Save Playground",
		body: `
			<label>Playground name <input value="Research Browser Playground"></label>
			<div class="choice-list">
				<button><span>Save in this browser</span><kbd>Enter</kbd></button>
				<button><span>Save to a local directory</span><kbd>D</kbd></button>
			</div>
			<div class="progress"><strong>Saving 3028 / 3751 files</strong><meter min="0" max="3751" value="3028"></meter></div>
		`,
		actions: ["Cancel", "Save"],
	},
	"save-local": {
		kicker: "Save",
		title: "Save to a local directory",
		body: `<label>Directory name <input value="research-browser-playground"></label><p>Local directory storage keeps the Playground outside browser storage.</p>`,
		actions: ["Cancel", "Choose directory"],
	},
	rename: {
		kicker: "Saved management",
		title: "Rename Playground",
		body: `<label>New name <input value="Research Browser Playground"></label>`,
		actions: ["Cancel", "Rename"],
	},
	delete: {
		kicker: "Saved management",
		title: "Delete Playground",
		body: `<p>This removes the browser-backed saved Playground. The current temporary site can still be downloaded as a zip before deletion.</p>`,
		actions: ["Cancel", "Delete"],
	},
	vanilla: {
		kicker: "Start",
		title: "Vanilla WordPress",
		body: `<p>Start a clean WordPress Playground using the selected runtime settings.</p>`,
		actions: ["Cancel", "Start"],
	},
	"wordpress-pr": {
		kicker: "Start",
		title: "Preview a WordPress PR",
		body: `<label>PR number or URL <input placeholder="https://github.com/WordPress/wordpress-develop/pull/0000"></label>`,
		actions: ["Cancel", "Preview"],
	},
	"gutenberg-pr": {
		kicker: "Start",
		title: "Preview a Gutenberg PR or branch",
		body: `<label>PR number, URL, or branch name <input placeholder="trunk or pull request URL"></label>`,
		actions: ["Cancel", "Preview"],
	},
	github: {
		kicker: "Import",
		title: "Import from GitHub",
		body: `<p>Connect a GitHub account to import a public plugin, theme, or wp-content directory. The access token is not stored and re-authentication is required after refresh.</p>`,
		actions: ["Cancel", "Connect GitHub"],
	},
	"blueprint-url": {
		kicker: "Import",
		title: "Run Blueprint from URL",
		body: `<label>Blueprint URL <input placeholder="https://example.com/blueprint.json"></label>`,
		actions: ["Cancel", "Run Blueprint"],
	},
	zip: {
		kicker: "Import",
		title: "Import .zip",
		body: `<p>Open a local Playground bundle with the native file chooser.</p>`,
		actions: ["Cancel", "Browse files"],
	},
	settings: {
		kicker: "Settings",
		title: "Quick settings",
		body: `
			<label>WordPress Version <select><option>Latest</option><option>6.9 nightly</option><option>6.8</option></select></label>
			<label>PHP Version <select><option>PHP 8.3</option><option>PHP 8.2</option></select></label>
			<label>Language <select><option>English (United States)</option><option>Polish</option></select></label>
			<label><input type="checkbox"> Include older versions</label>
			<label><input type="checkbox" checked> Allow network access</label>
			<label><input type="checkbox"> Create a multisite network</label>
		`,
		actions: ["Cancel", "Apply Settings & Reset Playground"],
	},
	reset: {
		kicker: "Settings",
		title: "Apply Settings & Reset Playground",
		body: `<p>Applying runtime changes resets an unsaved Playground. Stored Playgrounds use Save & Reload.</p>`,
		actions: ["Cancel", "Reset"],
	},
	"export-github": {
		kicker: "Export",
		title: "Export to GitHub",
		body: `<p>Publish the current Playground files to GitHub from Site Manager additional actions.</p>`,
		actions: ["Cancel", "Export"],
	},
	"download-zip": {
		kicker: "Export",
		title: "Download as .zip",
		body: `<p>Download the current Playground as a portable zip bundle.</p>`,
		actions: ["Cancel", "Download"],
	},
	"download-db": {
		kicker: "Database",
		title: "Download database.sqlite",
		body: `<p>SQLite path: /wordpress/wp-content/database/.ht.sqlite - Size: 452 KB.</p>`,
		actions: ["Cancel", "Download"],
	},
	"download-blueprint": {
		kicker: "Blueprint",
		title: "Download Blueprint bundle",
		body: `<p>Download the current blueprint.json and bundled assets.</p>`,
		actions: ["Cancel", "Download"],
	},
	"copy-blueprint": {
		kicker: "Blueprint",
		title: "Copy Blueprint link",
		body: `<label>Shareable Blueprint URL <input value="https://playground.wordpress.net/#blueprint"></label>`,
		actions: ["Close", "Copy"],
	},
	"run-blueprint": {
		kicker: "Blueprint",
		title: "Run current Blueprint",
		body: `<p>Run the current blueprint.json against this Playground.</p>`,
		actions: ["Cancel", "Run"],
	},
};

const inspectors = {
	research: {
		kicker: "Selected Playground",
		title: "Research Browser Playground",
		status: "Saved",
		statusClass: "saved",
		body: `
			<div class="mini-preview" aria-label="Homepage preview"></div>
			<div class="kv"><span>Storage</span><strong>Saved in this browser</strong></div>
			<div class="kv"><span>Runtime</span><strong>WP latest - PHP 8.3</strong></div>
			<div class="kv"><span>Paths</span><strong>Homepage - WP Admin - /hello-from-playground/</strong></div>
			<div class="kv"><span>Artifacts</span><strong>Blueprint bundle - database.sqlite - .zip</strong></div>
		`,
		actions: [
			["Open Site Manager", "manager-view"],
			["WP Admin", "noop"],
			["Homepage", "noop"],
			["Export to GitHub", "export-github"],
			["Download .zip", "download-zip"],
		],
	},
	unsaved: {
		kicker: "Temporary Playground",
		title: "Unsaved Playground",
		status: "Unsaved",
		statusClass: "unsaved",
		body: `
			<div class="mini-preview" aria-label="Homepage preview"></div>
			<div class="kv"><span>Risk</span><strong>Lost on refresh or close unless saved</strong></div>
			<div class="kv"><span>Save</span><strong>Browser storage or local directory</strong></div>
			<div class="progress"><strong>Save progress preview</strong><meter min="0" max="3751" value="3028"></meter></div>
		`,
		actions: [
			["Save Playground", "save"],
			["Save to directory", "save-local"],
			["Download .zip", "download-zip"],
			["Settings", "settings"],
		],
	},
	pr: {
		kicker: "Start source",
		title: "WordPress PR Preview",
		status: "Start",
		statusClass: "saved",
		body: `<div class="kv"><span>Input</span><strong>PR number or URL</strong></div><div class="kv"><span>Action</span><strong>Preview a WordPress core pull request</strong></div>`,
		actions: [["Preview WordPress PR", "wordpress-pr"], ["Runtime settings", "settings"]],
	},
	gutenberg: {
		kicker: "Start source",
		title: "Gutenberg PR or Branch",
		status: "Start",
		statusClass: "saved",
		body: `<div class="kv"><span>Input</span><strong>PR number, URL, or branch name</strong></div><div class="kv"><span>Action</span><strong>Preview Gutenberg against Playground</strong></div>`,
		actions: [["Preview Gutenberg", "gutenberg-pr"], ["Runtime settings", "settings"]],
	},
	github: {
		kicker: "Import source",
		title: "From GitHub",
		status: "Import",
		statusClass: "saved",
		body: `<div class="kv"><span>Source</span><strong>Public GitHub repositories</strong></div><div class="kv"><span>Content</span><strong>Plugins, themes, and wp-content directories</strong></div><div class="kv"><span>Auth</span><strong>Token not stored after refresh</strong></div>`,
		actions: [["Connect GitHub", "github"]],
	},
	blueprint: {
		kicker: "Import source",
		title: "Blueprint URL",
		status: "Import",
		statusClass: "saved",
		body: `<div class="kv"><span>Input</span><strong>Hosted blueprint.json URL</strong></div><div class="kv"><span>Gallery</span><strong>43 categorized blueprints</strong></div>`,
		actions: [["Run URL", "blueprint-url"], ["Browse gallery", "blueprints-view"]],
	},
	zip: {
		kicker: "Import source",
		title: "Import .zip",
		status: "Import",
		statusClass: "saved",
		body: `<div class="kv"><span>Input</span><strong>Local Playground zip bundle</strong></div><div class="kv"><span>Picker</span><strong>Native file chooser</strong></div>`,
		actions: [["Browse files", "zip"]],
	},
};

function showModal(commandName) {
	const command = commands[commandName];
	if (!command) return;
	modalKicker.textContent = command.kicker;
	modalTitle.textContent = command.title;
	modalBody.innerHTML = command.body;
	modalActions.innerHTML = command.actions
		.map((label, index) => `<button type="button" ${index === command.actions.length - 1 ? 'class="primary"' : ""}>${label}</button>`)
		.join("");
	modal.hidden = false;
}

function showInspector(name) {
	const data = inspectors[name];
	if (!data) return;
	document.querySelectorAll(".table-row").forEach((row) => row.classList.toggle("selected", row.dataset.inspector === name));
	inspectorKicker.textContent = data.kicker;
	inspectorTitle.textContent = data.title;
	inspectorStatus.textContent = data.status;
	inspectorStatus.className = `save-state ${data.statusClass}`;
	inspectorBody.innerHTML = data.body;
	inspectorActions.innerHTML = data.actions
		.map(([label, action]) => `<button type="button" data-action="${action}">${label}</button>`)
		.join("");
}

function setView(view) {
	app.dataset.view = view;
	document.querySelectorAll(".menu-popover").forEach((menu) => (menu.hidden = true));
	if (location.hash !== `#${view}`) {
		history.replaceState(null, "", `#${view}`);
	}
}

function setPanel(panel) {
	document.querySelectorAll("[data-panel]").forEach((button) => button.classList.toggle("active", button.dataset.panel === panel));
	document.querySelectorAll(".tool-panel").forEach((section) => section.classList.toggle("active", section.dataset.tool === panel));
	setView("manager");
}

document.addEventListener("click", (event) => {
	const menuButton = event.target.closest("[data-menu]");
	if (menuButton) {
		const menu = document.querySelector(`#menu-${menuButton.dataset.menu}`);
		document.querySelectorAll(".menu-popover").forEach((item) => {
			item.hidden = item !== menu || !item.hidden;
		});
		return;
	}

	const commandButton = event.target.closest("[data-command]");
	if (commandButton) {
		showModal(commandButton.dataset.command);
		document.querySelectorAll(".menu-popover").forEach((menu) => (menu.hidden = true));
		return;
	}

	const viewButton = event.target.closest("[data-view-button]");
	if (viewButton) {
		setView(viewButton.dataset.viewButton);
		return;
	}

	const panelButton = event.target.closest("[data-panel]");
	if (panelButton) {
		setPanel(panelButton.dataset.panel);
		return;
	}

	const tableRow = event.target.closest("[data-inspector]");
	if (tableRow) {
		showInspector(tableRow.dataset.inspector);
		return;
	}

	const inspectorAction = event.target.closest("[data-action]");
	if (inspectorAction) {
		const action = inspectorAction.dataset.action;
		if (action === "manager-view") setView("manager");
		else if (action === "blueprints-view") setView("blueprints");
		else showModal(action);
		return;
	}

	if (event.target.closest("[data-close]") || event.target === modal) {
		modal.hidden = true;
	}
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		modal.hidden = true;
		document.querySelectorAll(".menu-popover").forEach((menu) => (menu.hidden = true));
	}
});

window.addEventListener("hashchange", () => {
	const view = location.hash.slice(1);
	if (["register", "manager", "blueprints"].includes(view)) setView(view);
});

showInspector("research");
if (["manager", "blueprints"].includes(location.hash.slice(1))) {
	setView(location.hash.slice(1));
} else {
	setView("register");
}
