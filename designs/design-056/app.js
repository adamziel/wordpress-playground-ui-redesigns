const runDetails = {
	unsaved: {
		kind: "Current run",
		title: "Unsaved plugin smoke test",
		state: "Needs save",
		stateClass: "amber",
		details: {
			Storage: "Temporary browser memory",
			Route: "/hello-from-playground/",
			Runtime: "WordPress latest, PHP 8.3",
			Network: "Allowed, multisite off",
		},
		preview: "../../research/screenshots/12-home-with-frame-text.png",
		caption: "Active homepage preview, logged in as admin.",
		actions: [
			["Save browser", "save", "primary"],
			["Save local", "save-local", ""],
			["Open Site Manager", "workbench", "view"],
			["Download .zip", "", ""],
		],
	},
	research: {
		kind: "Saved Playground",
		title: "Research Browser Playground",
		state: "Saved",
		stateClass: "green",
		details: {
			Storage: "Saved in this browser",
			Created: "May 21, 2026",
			Runtime: "WordPress latest, PHP 8.3",
			Actions: "Rename, delete, export, or resume",
		},
		preview: "../../research/screenshots/16-after-browser-save.png",
		caption: "Saved Playground state with browser-backed storage.",
		actions: [
			["Open Site Manager", "workbench", "view primary"],
			["Rename", "rename", ""],
			["Delete", "delete", "danger"],
		],
	},
	"core-pr": {
		kind: "Start source",
		title: "Core PR regression run",
		state: "PR start",
		stateClass: "blue",
		details: {
			Input: "PR number or URL",
			Runtime: "Selectable WordPress and PHP versions",
			Output: "Fresh Playground with the PR patch applied",
			Use: "Plugin compatibility and bug reproduction",
		},
		preview: "../../research/screenshots/30-start-wordpress-pr.png",
		caption: "Preview a WordPress PR flow.",
		actions: [["Preview WordPress PR", "wordpress-pr", "primary"]],
	},
	"gutenberg-pr": {
		kind: "Start source",
		title: "Editor branch test run",
		state: "Branch",
		stateClass: "blue",
		details: {
			Input: "PR number, URL, or branch name",
			Runtime: "Selectable",
			Output: "Playground with Gutenberg work loaded",
			Use: "Editor and block-plugin validation",
		},
		preview: "../../research/screenshots/31-start-gutenberg-pr.png",
		caption: "Preview a Gutenberg PR or branch.",
		actions: [["Preview Gutenberg work", "gutenberg-pr", "primary"]],
	},
	github: {
		kind: "Import source",
		title: "Import plugin from GitHub",
		state: "Import",
		stateClass: "amber",
		details: {
			Connection: "GitHub account required",
			Scope: "Public plugins, themes, and wp-content directories",
			Token: "Not stored after refresh",
			Output: "Imported code inside a Playground",
		},
		preview: "../../research/screenshots/32-start-from-github.png",
		caption: "GitHub import connection flow.",
		actions: [["Connect GitHub", "github", "primary"]],
	},
	"blueprint-url": {
		kind: "Blueprint source",
		title: "Run hosted blueprint",
		state: "Blueprint",
		stateClass: "blue",
		details: {
			Input: "Blueprint URL",
			Recipe: "blueprint.json",
			Output: "Configured Playground",
			Tools: "Copy link, download bundle, run again",
		},
		preview: "../../research/screenshots/33-start-blueprint-url.png",
		caption: "Run Blueprint from URL flow.",
		actions: [["Run Blueprint URL", "blueprint-url", "primary"]],
	},
	zip: {
		kind: "Import source",
		title: "Open archived Playground",
		state: "Import",
		stateClass: "amber",
		details: {
			Input: "Local .zip archive",
			Chooser: "Native file picker",
			Output: "Restored Playground",
			Export: "Download as .zip remains available",
		},
		preview: "../../research/screenshots/35-import-zip-trigger.png",
		caption: "Import .zip triggers the file picker.",
		actions: [["Browse .zip", "zip", "primary"]],
	},
	gallery: {
		kind: "Template source",
		title: "Blueprint gallery run",
		state: "Template",
		stateClass: "green",
		details: {
			Catalog: "All 43 blueprints",
			Filters: "Featured, Website, Personal, Content, Themes, Gutenberg, Experiments, WooCommerce, News",
			Shortcuts: "Art Gallery, Coffee Shop, Friends Feed Reader, Gaming News, Non-profit Organization",
			Output: "Recipe-defined Playground",
		},
		preview: "../../research/screenshots/34-blueprints-gallery.png",
		caption: "Blueprint gallery with filters and cards.",
		actions: [["Open Blueprints", "blueprints", "view primary"]],
	},
};

const dialogContent = {
	save: {
		kicker: "Persistence",
		title: "Save Playground",
		body: `
			<p>Temporary Playgrounds are lost on refresh or close unless saved.</p>
			<label>Playground name<input value="Research Browser Playground"></label>
			<label class="check"><input type="radio" name="dialog-storage" checked> Save in this browser</label>
			<label class="check"><input type="radio" name="dialog-storage"> Save to a local directory</label>
			<div class="progress"><span style="width:81%"></span></div>
			<small>Saving 3028 / 3751 files</small>
		`,
		actions: [["Cancel", "close", ""], ["Save", "close", "primary"]],
	},
	"save-local": {
		kicker: "Persistence",
		title: "Save to a local directory",
		body: `
			<p>Choose local directory storage when the browser supports it. The Playground remains addressable through the saved site entry.</p>
			<label>Playground name<input value="Research Browser Playground"></label>
			<label class="check"><input type="radio" name="local-storage"> Save in this browser</label>
			<label class="check"><input type="radio" name="local-storage" checked> Save to a local directory</label>
		`,
		actions: [["Cancel", "close", ""], ["Save to directory", "close", "primary"]],
	},
	vanilla: {
		kicker: "New run",
		title: "Start Vanilla WordPress",
		body: `<p>Start a fresh logged-in WordPress Playground using the selected runtime defaults.</p>`,
		actions: [["Cancel", "close", ""], ["Start", "close", "primary"]],
	},
	"wordpress-pr": {
		kicker: "PR preview",
		title: "Preview a WordPress PR",
		body: `
			<label>PR number or URL<input placeholder="12345 or https://github.com/WordPress/wordpress-develop/pull/12345"></label>
			<p>The run starts a fresh Playground with the WordPress Core pull request applied.</p>
		`,
		actions: [["Cancel", "close", ""], ["Preview", "close", "primary"]],
	},
	"gutenberg-pr": {
		kicker: "Editor preview",
		title: "Preview a Gutenberg PR or Branch",
		body: `
			<label>PR number, URL, or branch name<input placeholder="12345, pull URL, or branch name"></label>
			<p>Use this for editor, block, and Gutenberg plugin regression checks.</p>
		`,
		actions: [["Cancel", "close", ""], ["Preview", "close", "primary"]],
	},
	github: {
		kicker: "Import",
		title: "Import from GitHub",
		body: `
			<p>Import public plugins, themes, or wp-content directories from GitHub. The access token is not stored and re-authentication is required after refresh.</p>
			<label>Repository URL<input placeholder="https://github.com/owner/repository"></label>
		`,
		actions: [["Cancel", "close", ""], ["Connect GitHub", "close", "primary"]],
	},
	"blueprint-url": {
		kicker: "Blueprint",
		title: "Run Blueprint from URL",
		body: `
			<label>Blueprint URL<input placeholder="https://example.com/blueprint.json"></label>
			<p>The recipe controls setup, versions, login state, and landing page.</p>
		`,
		actions: [["Cancel", "close", ""], ["Run Blueprint", "close", "primary"]],
	},
	zip: {
		kicker: "Import",
		title: "Import .zip",
		body: `<p>This opens the native file chooser for a local Playground bundle.</p>`,
		actions: [["Cancel", "close", ""], ["Browse files", "close", "primary"]],
	},
	rename: {
		kicker: "Saved management",
		title: "Rename Playground",
		body: `<label>Playground name<input value="Research Browser Playground"></label>`,
		actions: [["Cancel", "close", ""], ["Rename", "close", "primary"]],
	},
	delete: {
		kicker: "Saved management",
		title: "Delete Playground",
		body: `<p>Delete the selected saved Playground from browser storage. The current unsaved run remains available until refresh or close.</p>`,
		actions: [["Cancel", "close", ""], ["Delete", "close", "danger"]],
	},
};

const flowDialog = document.querySelector("#flow-dialog");
const dialogKicker = document.querySelector("#dialog-kicker");
const dialogTitle = document.querySelector("#dialog-title");
const dialogBody = document.querySelector("#dialog-body");
const dialogActions = document.querySelector("#dialog-actions");

function renderRun(runKey) {
	const run = runDetails[runKey] || runDetails.unsaved;
	document.querySelector("#inspector-kind").textContent = run.kind;
	document.querySelector("#inspector-title").textContent = run.title;
	const state = document.querySelector("#inspector-state");
	state.textContent = run.state;
	state.className = `state-chip ${run.stateClass}`;

	const detailRows = Object.entries(run.details)
		.map(([term, description]) => `<div><dt>${term}</dt><dd>${description}</dd></div>`)
		.join("");
	document.querySelector("#inspector-body").innerHTML = `
		<dl>${detailRows}</dl>
		<figure class="mini-preview">
			<img src="${run.preview}" alt="">
			<figcaption>${run.caption}</figcaption>
		</figure>
	`;

	document.querySelector("#inspector-actions").innerHTML = run.actions
		.map(([label, target, classes]) => {
			const view = classes.includes("view") ? `data-view="${target}"` : "";
			const dialog = target && !classes.includes("view") ? `data-dialog="${target}"` : "";
			return `<button type="button" class="${classes.replace("view", "").trim()}" ${view} ${dialog}>${label}</button>`;
		})
		.join("");
}

function setView(viewName) {
	document.querySelectorAll(".screen").forEach((screen) => {
		screen.classList.toggle("active", screen.id === `view-${viewName}`);
	});
	document.querySelectorAll("[data-view]").forEach((button) => {
		if (button.closest(".side-nav")) {
			button.classList.toggle("active", button.dataset.view === viewName);
		}
	});
}

function openDialog(dialogKey) {
	const content = dialogContent[dialogKey];
	if (!content) return;
	dialogKicker.textContent = content.kicker;
	dialogTitle.textContent = content.title;
	dialogBody.innerHTML = content.body;
	dialogActions.innerHTML = content.actions
		.map(([label, value, className]) => `<button value="${value}" class="${className}" type="submit">${label}</button>`)
		.join("");
	flowDialog.showModal();
}

document.addEventListener("click", (event) => {
	const row = event.target.closest("[data-run]");
	if (row) {
		document.querySelectorAll("[data-run]").forEach((item) => item.classList.remove("selected"));
		row.classList.add("selected");
		renderRun(row.dataset.run);
	}

	const viewButton = event.target.closest("[data-view]");
	if (viewButton) {
		setView(viewButton.dataset.view);
	}

	const dialogButton = event.target.closest("[data-dialog]");
	if (dialogButton) {
		openDialog(dialogButton.dataset.dialog);
	}

	const toolButton = event.target.closest("[data-tool]");
	if (toolButton) {
		document.querySelectorAll("[data-tool]").forEach((button) => button.classList.remove("active"));
		toolButton.classList.add("active");
		document.querySelectorAll(".tool-panel").forEach((panel) => {
			panel.classList.toggle("active", panel.id === `tool-${toolButton.dataset.tool}`);
		});
	}
});

renderRun("unsaved");
