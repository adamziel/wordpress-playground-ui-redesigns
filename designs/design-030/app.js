const drawerData = {
	github: {
		kicker: "Bring In",
		title: "Import from GitHub",
		copy: "Import a plugin, theme, or wp-content directory from a public GitHub repository. The access token is not stored and connection is needed again after refresh.",
		form: `
			<label>Repository URL<input value="https://github.com/example/theme-lab" /></label>
			<label>Import target<select><option>Theme</option><option>Plugin</option><option>wp-content directory</option></select></label>
			<button class="primary" type="button">Connect GitHub account</button>
		`
	},
	zip: {
		kicker: "Bring In",
		title: "Import .zip",
		copy: "Open a local zip package and restore it as a Playground. This mirrors the current file chooser flow while making import visible in the hub.",
		form: `
			<label>Bundle source<input value="playground-export.zip" /></label>
			<button class="primary" type="button">Choose .zip file</button>
		`
	},
	"blueprint-url": {
		kicker: "Bring In",
		title: "Run Blueprint from URL",
		copy: "Paste a Blueprint URL, run it, and start the resulting WordPress site with the configured landing page and preferred versions.",
		form: `
			<label>Blueprint URL<input value="https://playground.wordpress.net/blueprint.json" /></label>
			<button class="primary" type="button">Run Blueprint</button>
		`
	},
	"pr-starts": {
		kicker: "Create",
		title: "Preview PRs and branches",
		copy: "Start a Playground from a WordPress core PR, a Gutenberg PR, or a Gutenberg branch name.",
		form: `
			<label>Source<select><option>WordPress PR</option><option>Gutenberg PR or branch</option></select></label>
			<label>PR number, URL, or branch<input value="https://github.com/WordPress/gutenberg/pull/" /></label>
			<button class="primary" type="button">Preview</button>
		`
	},
	"save-browser": {
		kicker: "Keep",
		title: "Save in browser",
		copy: "Name the temporary Playground and keep it in browser storage. Saved sites appear in the library with rename and delete actions.",
		form: `
			<label>Playground name<input value="Research Browser Playground" /></label>
			<label>Storage location<select><option>Save in this browser</option><option>Save to a local directory</option></select></label>
			<button class="primary" type="button">Save Playground</button>
		`
	},
	"save-local": {
		kicker: "Keep",
		title: "Save to local directory",
		copy: "Store the Playground in a local directory so the project survives browser storage cleanup and can be handled like a theme workspace.",
		form: `
			<label>Playground name<input value="Theme portability test" /></label>
			<button class="primary" type="button">Choose local directory</button>
		`
	},
	"export-github": {
		kicker: "Send Out",
		title: "Export to GitHub",
		copy: "Publish the current Playground files to GitHub from the Site Manager additional actions.",
		form: `
			<label>Destination<input value="github.com/example/theme-lab" /></label>
			<label>Export scope<select><option>Current Playground</option><option>wp-content</option><option>Theme files</option></select></label>
			<button class="primary" type="button">Export to GitHub</button>
		`
	},
	"download-zip": {
		kicker: "Send Out",
		title: "Download as .zip",
		copy: "Package the current Playground as a zip for backup, sharing, or later import.",
		form: `
			<label>File name<input value="research-browser-playground.zip" /></label>
			<button class="primary" type="button">Download .zip</button>
		`
	},
	"rename-site": {
		kicker: "Saved Management",
		title: "Rename saved Playground",
		copy: "Change the browser-backed Playground name while keeping the saved slug and files available in the library.",
		form: `
			<label>Playground name<input value="Research Browser Playground" /></label>
			<button class="primary" type="button">Rename Playground</button>
		`
	},
	"delete-site": {
		kicker: "Saved Management",
		title: "Delete saved Playground",
		copy: "Remove a saved browser-backed Playground from the saved list. Temporary unsaved Playgrounds can be saved or discarded by starting over.",
		form: `
			<label>Selected Playground<input value="Research Browser Playground" /></label>
			<button class="primary" type="button">Delete saved Playground</button>
		`
	},
	vanilla: {
		kicker: "Create",
		title: "Vanilla WordPress",
		copy: "Start a clean Playground using the selected runtime settings.",
		form: `
			<label>WordPress version<select><option>Latest</option><option>6.9 nightly</option><option>6.8</option></select></label>
			<label>PHP version<select><option>PHP 8.3</option><option>PHP 8.2</option><option>PHP 8.1</option></select></label>
			<button class="primary" type="button">Start Vanilla WordPress</button>
		`
	},
	"blueprint-gallery": {
		kicker: "Blueprint Gallery",
		title: "Browse all 43 blueprints",
		copy: "Filter the gallery, inspect featured templates, then run the selected Blueprint.",
		form: `
			<label>Filter<select><option>All</option><option>Featured</option><option>Website</option><option>Personal</option><option>Content</option><option>Themes</option><option>Gutenberg</option><option>Experiments</option><option>WooCommerce</option><option>News</option></select></label>
			<label>Search<input value="Coffee Shop" /></label>
			<button class="primary" type="button">Run selected Blueprint</button>
		`
	}
};

const title = document.querySelector("#drawer-title");
const kicker = document.querySelector("#drawer-kicker");
const copy = document.querySelector("#drawer-copy");
const form = document.querySelector("#drawer-form");

function openDrawer(key) {
	const data = drawerData[key] || drawerData.github;
	title.textContent = data.title;
	kicker.textContent = data.kicker;
	copy.textContent = data.copy;
	form.innerHTML = data.form;
	document.querySelectorAll("[data-drawer]").forEach((button) => {
		button.classList.toggle("active", button.dataset.drawer === key);
	});
}

document.addEventListener("click", (event) => {
	const drawerButton = event.target.closest("[data-drawer]");
	if (drawerButton) {
		openDrawer(drawerButton.dataset.drawer);
		document.querySelector(".detail-drawer")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
	}

	const openButton = event.target.closest("[data-open]");
	if (openButton) {
		const target = document.getElementById(openButton.dataset.open);
		target?.scrollIntoView({ behavior: "smooth", block: "start" });
	}
});

openDrawer("github");
