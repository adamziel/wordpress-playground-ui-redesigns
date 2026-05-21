const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const state = {
	storage: "temporary",
	activeTitle: "Unsaved Playground",
	path: "/hello-from-playground/",
	category: "All",
	selectedBlueprint: null,
	fileDirty: false,
	deletePrepared: false,
};

const blueprints = [
	{
		name: "Art Gallery",
		categories: ["Featured", "Website", "Personal", "Themes"],
		url: "https://playground.wordpress.net/blueprints/art-gallery.json",
		description: "An art gallery created with the Vueo theme.",
	},
	{
		name: "Coffee Shop",
		categories: ["Featured", "Website", "WooCommerce", "Themes"],
		url: "https://playground.wordpress.net/blueprints/coffee-shop.json",
		description: "A stylised WooCommerce coffee shop storefront with custom theme, products, and content.",
	},
	{
		name: "Feed Reader with the Friends Plugin",
		categories: ["Featured", "Content", "Gutenberg"],
		url: "https://playground.wordpress.net/blueprints/friends-feed-reader.json",
		description: "Read feeds from the web in Playground using the Friends plugin.",
	},
	{
		name: "Gaming News",
		categories: ["Featured", "Website", "News", "Themes"],
		url: "https://playground.wordpress.net/blueprints/gaming-news.json",
		description: "A gaming news site created with the Spiel theme.",
	},
	{
		name: "Non-profit Organization",
		categories: ["Featured", "Website", "Content"],
		url: "https://playground.wordpress.net/blueprints/non-profit-organization.json",
		description: "A non-profit organization site created with the Koinonia theme.",
	},
	{
		name: "Personal Blog",
		categories: ["Website", "Personal", "Themes"],
		url: "https://playground.wordpress.net/blueprints/personal-blog.json",
		description: "A personal blog created with the Substrata theme.",
	},
	{
		name: "Block Theme Workshop",
		categories: ["Gutenberg", "Experiments", "Themes"],
		url: "https://playground.wordpress.net/blueprints/block-theme-workshop.json",
		description: "A Gutenberg workshop runtime with sample patterns and theme files.",
	},
	{
		name: "Content Migration Lab",
		categories: ["Content", "Experiments"],
		url: "https://playground.wordpress.net/blueprints/content-migration-lab.json",
		description: "A content-heavy Playground for testing imports, media, and database changes.",
	},
];

state.selectedBlueprint = blueprints[1];

function now() {
	return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function addTransfer(type, object, result) {
	const row = document.createElement("tr");
	row.innerHTML = `<td>${now()}</td><td>${type}</td><td>${object}</td><td>${result}</td>`;
	$("#transferRows").prepend(row);
	applyTableLabels();
}

function addLog(source, message) {
	const item = document.createElement("li");
	item.innerHTML = `<strong>${source}</strong><span>${message}</span>`;
	$("#logList").prepend(item);
}

function setBadge(el, kind, text) {
	el.className = `badge ${kind}`;
	el.textContent = text;
}

function setShell({ title = state.activeTitle, storage = state.storage, path = state.path, subtitle } = {}) {
	state.activeTitle = title;
	state.storage = storage;
	state.path = path;

	$("#shellTitle").textContent = title;
	$("#shellSubtitle").textContent = subtitle || subtitleForStorage(storage);
	$("#activeRowName").textContent = title;
	$("#activeRowMeta").textContent = subtitle || subtitleForStorage(storage);
	$("#pathInput").value = path;
	$("#previewPath").textContent = path;

	const badgeKind = storage === "temporary" ? "amber" : storage === "local" ? "green" : storage === "imported" ? "blue" : "green";
	const badgeText = storage === "temporary" ? "Temporary" : storage === "local" ? "Local directory" : storage === "imported" ? "Imported" : "Browser saved";
	setBadge($("#storageBadge"), badgeKind, badgeText);
	setBadge($("#activeRowStorage"), badgeKind, badgeText);
	setBadge($("#previewStatus"), badgeKind, badgeText);

	$("#replaceCopy").textContent = `This will change files, database content, landing page, path, and preview for ${title}.`;
}

function subtitleForStorage(storage) {
	if (storage === "local") {
		return "Local folder: /Users/admin/Playgrounds/research-local-directory. Refresh requires reconnect permission.";
	}
	if (storage === "browser") {
		return "Browser storage slug: research-browser-playground. Survives refresh on this device.";
	}
	if (storage === "imported") {
		return "Imported or Blueprint-replaced runtime. Save or export before closing.";
	}
	return "Temporary runtime. Save before refresh or close.";
}

function setPath(path, label = "Navigation") {
	state.path = path;
	$("#pathInput").value = path;
	$("#previewPath").textContent = path;
	$("#activeRowMutation").textContent = `Path ${path} opened`;

	if (path === "/wp-admin/") {
		$("#pageTitle").textContent = "Dashboard";
		$("#pageBody").textContent = "WordPress admin is open inside the protected Playground shell.";
		$("#previewButton").textContent = "Create a new post";
	} else if (path === "/sample-page/") {
		$("#pageTitle").textContent = "Sample Page";
		$("#pageBody").textContent = "This is the sample page from the active WordPress Playground.";
		$("#previewButton").textContent = "Edit Sample Page";
	} else if (path === "/" && state.storage === "imported") {
		$("#pageTitle").textContent = state.activeTitle;
		$("#pageBody").textContent = state.selectedBlueprint.description;
		$("#previewButton").textContent = "Open replaced homepage";
	} else {
		$("#pageTitle").textContent = "Hello from WordPress Playground!";
		$("#pageBody").textContent = "This is Playground, a WordPress that runs client-side in your browser. It is ready for training, plugins and themes, PR reviews, Blueprint runs, exports, and testing.";
		$("#previewButton").textContent = "Discover the mission behind Playground";
	}

	addTransfer(label, path, "Preview path updated in the live shell");
}

function runProgress(progressSelector, steps, done) {
	const progress = $(progressSelector);
	const bar = $("span", progress);
	let index = 0;
	progress.hidden = false;
	bar.style.width = "0%";

	const timer = window.setInterval(() => {
		const step = steps[Math.min(index, steps.length - 1)];
		bar.style.width = step.width;
		if (step.textTarget) {
			$(step.textTarget).textContent = step.text;
		}
		index += 1;
		if (index >= steps.length) {
			window.clearInterval(timer);
			window.setTimeout(() => {
				progress.hidden = true;
				if (done) {
					done();
				}
			}, 280);
		}
	}, 420);
}

function showTable(name) {
	$$("[data-table]").forEach((button) => button.classList.toggle("active", button.dataset.table === name));
	$$(".table-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `table-${name}`));
}

function showDetail(name) {
	$$("[data-detail]").forEach((button) => button.classList.toggle("active", button.dataset.detail === name));
	$$(".detail-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `detail-${name}`));
}

function showManager(name) {
	$$("[data-manager]").forEach((button) => button.classList.toggle("active", button.dataset.manager === name));
	$$(".manager-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `manager-${name}`));
	showDetail("manager");
}

function renderBlueprints() {
	const query = $("#blueprintSearch").value.trim().toLowerCase();
	const filtered = blueprints.filter((blueprint) => {
		const text = `${blueprint.name} ${blueprint.description} ${blueprint.categories.join(" ")}`.toLowerCase();
		const matchesQuery = !query || text.includes(query);
		const matchesCategory = state.category === "All" || blueprint.categories.includes(state.category);
		return matchesQuery && matchesCategory;
	});

	const list = $("#blueprintList");
	list.innerHTML = "";
	filtered.forEach((blueprint) => {
		const button = document.createElement("button");
		button.type = "button";
		button.className = `blueprint-item${blueprint.name === state.selectedBlueprint.name ? " active" : ""}`;
		button.innerHTML = `<strong>${blueprint.name}</strong><span>${blueprint.categories.join(" / ")}</span><span>${blueprint.description}</span>`;
		button.addEventListener("click", () => selectBlueprint(blueprint));
		list.append(button);
	});

	if (!filtered.length) {
		list.innerHTML = '<div class="result-line">No entry in this representative subset matches the current search and category.</div>';
	}
}

function selectBlueprint(blueprint) {
	state.selectedBlueprint = blueprint;
	$("#detailTitle").textContent = `${blueprint.name} Blueprint`;
	$("#selectedBlueprintName").textContent = blueprint.name;
	$("#selectedBlueprintDesc").textContent = blueprint.description;
	$("#blueprintUrl").value = blueprint.url;
	$("#routeBlueprintUrl").value = blueprint.url;
	setBadge($("#blueprintState"), "blue", "Selected");
	$("#blueprintResult").textContent = `${blueprint.name} selected. Validate JSON before replacing ${state.activeTitle}.`;
	$("#blueprintEditor").value = `{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "login": true,
  "landingPage": "/",
  "preferredVersions": { "php": "8.3", "wp": "latest" },
  "meta": {
    "title": "${blueprint.name}",
    "categories": ${JSON.stringify(blueprint.categories)}
  },
  "steps": [
    { "step": "installTheme", "themeZipFile": "${blueprint.name.toLowerCase().replaceAll(" ", "-")}.zip" },
    { "step": "runPHP", "code": "<?php update_option('blogname', '${blueprint.name}');" }
  ]
}`;
	renderBlueprints();
}

function saveLocalStart() {
	showDetail("save");
	$("#saveFlow").scrollIntoView({ block: "nearest" });
	$("#saveFlowTitle").textContent = "Folder picker ready";
	$("#saveFlowDetail").textContent = "Choose a local folder. Cancel leaves the Playground temporary; granting permission copies files and records the folder identity.";
	$("#activeRowState").textContent = "Local permission needed";
	$("#activeRowMutation").textContent = "Folder picker staged";
	$("#localSlotState").textContent = "Permission needed";
	setBadge($("#activeRowStorage"), "amber", "Temporary");
}

function chooseFolderAndSave() {
	$("#saveFlowTitle").textContent = "Permission granted";
	$("#saveFlowDetail").textContent = "Selected /Users/admin/Playgrounds/research-local-directory. Copying WordPress files, SQLite database, uploads, and Blueprint bundle.";
	$("#folderIdentity").value = "/Users/admin/Playgrounds/research-local-directory";
	$("#activeRowState").textContent = "Saving to local directory";
	$("#activeRowMutation").textContent = "Saving 0 / 3751 files";
	$("#localSlotState").textContent = "Saving";
	$("#localSlotMutation").textContent = "Folder permission granted";
	setBadge($("#activeRowStorage"), "amber", "Saving");
	addTransfer("Local permission", "research-local-directory", "Folder picker granted write access");

	runProgress("#saveProgress", [
		{ width: "18%", textTarget: "#activeRowMutation", text: "Saving 612 / 3751 files" },
		{ width: "43%", textTarget: "#activeRowMutation", text: "Saving 1648 / 3751 files" },
		{ width: "74%", textTarget: "#activeRowMutation", text: "Saving 3028 / 3751 files" },
		{ width: "100%", textTarget: "#activeRowMutation", text: "Saving 3751 / 3751 files" },
	], () => {
		setShell({
			title: "Research Local Directory",
			storage: "local",
			path: state.path,
			subtitle: "Local folder: /Users/admin/Playgrounds/research-local-directory. Refresh asks to reconnect before changes can sync.",
		});
		$("#activeRowState").textContent = "Saved locally";
		$("#activeRowMutation").textContent = "Local directory save complete";
		$("#localFolderCell").textContent = "/Users/admin/Playgrounds/research-local-directory";
		$("#localSlotState").textContent = "Linked and writable";
		$("#localSlotMutation").textContent = "Reconnect required after browser refresh";
		$("#saveFlowTitle").textContent = "Local-directory save complete";
		$("#saveFlowDetail").textContent = "The active row, shell badge, folder identity, transfer history, and reload consequence now point to the selected local directory.";
		$("#previewNotice").textContent = "Saved to a local directory. After refresh, grant folder permission to reconnect and continue syncing.";
		addTransfer("Save", "Research Local Directory", "3751 files copied; local badge active; reload requires reconnect permission");
		addLog("Playground", "Local-directory save completed. Reconnect permission will be requested after refresh.");
	});
}

function saveBrowser() {
	const name = $("#browserSaveName").value.trim() || "Research Browser Playground";
	setShell({
		title: name,
		storage: "browser",
		path: state.path,
		subtitle: `Browser storage slug: ${name.toLowerCase().replaceAll(" ", "-")}. Survives refresh on this device.`,
	});
	$("#activeRowState").textContent = "Saved in browser";
	$("#activeRowMutation").textContent = "Browser storage save complete";
	$("#previewNotice").textContent = "Saved in this browser. This Playground can be reopened from Saved Playgrounds.";
	addTransfer("Save", name, "Browser-backed saved row and slug created");
}

function prepareBlueprintRun() {
	showDetail("blueprint");
	$("#replaceBox").hidden = false;
	$("#replaceCopy").textContent = `This will change files, database content, landing page, path, and preview for ${state.activeTitle}.`;
	$("#blueprintResult").textContent = "Replacement warning is active. Confirm to run the selected Blueprint against the current Playground.";
}

function confirmBlueprintRun() {
	$("#activeRowState").textContent = "Replacing with Blueprint";
	$("#activeRowMutation").textContent = `${state.selectedBlueprint.name} run started`;
	setBadge($("#activeRowStorage"), "amber", "Replacing");
	runProgress("#blueprintProgress", [
		{ width: "22%", textTarget: "#blueprintResult", text: "Validating blueprint.json and hosted URL..." },
		{ width: "50%", textTarget: "#blueprintResult", text: "Applying files, themes, plugins, and database changes..." },
		{ width: "80%", textTarget: "#blueprintResult", text: "Updating landing page, preview path, and runtime metadata..." },
		{ width: "100%", textTarget: "#blueprintResult", text: "Blueprint replacement complete." },
	], () => {
		const blueprint = state.selectedBlueprint;
		$("#replaceBox").hidden = true;
		setBadge($("#blueprintState"), "green", "Ran");
		setShell({
			title: `${blueprint.name} Playground`,
			storage: "imported",
			path: "/",
			subtitle: `${blueprint.name} replaced files and database. Save or export before closing.`,
		});
		$("#activeRowState").textContent = "Imported by Blueprint";
		$("#activeRowMutation").textContent = `${blueprint.name} replaced current content`;
		$("#previewSiteName").textContent = blueprint.name;
		$("#siteNavName").textContent = blueprint.name;
		$("#pageTitle").textContent = blueprint.name;
		$("#pageBody").textContent = blueprint.description;
		$("#previewNotice").textContent = "Blueprint replacement complete. Save locally, save in browser, export to GitHub, or download a ZIP before closing.";
		$("#dbSize").textContent = "516 KB";
		addTransfer("Blueprint replace", blueprint.name, "Confirmed replacement; preview path moved to / and database grew to 516 KB");
		addLog("WordPress", `${blueprint.name} Blueprint ran and updated site content.`);
	});
}

function prepareDelete() {
	$("#deleteConfirm").hidden = false;
	$("#deleteConfirm").scrollIntoView({ block: "nearest" });
}

function confirmDelete() {
	const row = $('[data-row="browser"]');
	row.classList.add("deleted");
	row.children[2].textContent = "Deleted";
	row.children[3].textContent = "Confirmed deletion completed";
	row.children[4].innerHTML = '<span class="badge neutral">Final state</span>';
	$("#deleteConfirm").hidden = true;
	addTransfer("Delete", "Research Browser Playground", "Saved browser row deleted; active shell remains on current Playground");
	addLog("Playground", "Research Browser Playground was deleted from browser storage.");
}

function editFile() {
	state.fileDirty = true;
	setBadge($("#fileState"), "amber", "Dirty");
	$("#fileResult").textContent = "Buffer changed. Save selected file to write /wordpress/wp-config.php.";
	$("#activeRowMutation").textContent = "File editor dirty";
}

function saveFile() {
	if (!state.fileDirty) {
		$("#fileResult").textContent = "Selected file is already clean. No write was needed.";
		return;
	}
	$("#fileResult").textContent = "Saving /wordpress/wp-config.php...";
	runProgress("#fileProgress", [
		{ width: "34%", textTarget: "#fileResult", text: "Writing buffer to OPFS..." },
		{ width: "72%", textTarget: "#fileResult", text: "Checking PHP syntax and refreshing runtime cache..." },
		{ width: "100%", textTarget: "#fileResult", text: "File saved. Dirty marker cleared." },
	], () => {
		state.fileDirty = false;
		setBadge($("#fileState"), "green", "Saved");
		$("#activeRowMutation").textContent = "wp-config.php saved";
		$("#previewNotice").textContent = "wp-config.php saved from Site Manager. The live preview remains protected.";
		addTransfer("File save", "/wordpress/wp-config.php", "Dirty buffer written and result logged");
		addLog("PHP", "wp-config.php saved; no syntax errors detected.");
	});
}

function downloadDatabase() {
	$("#dbResult").textContent = "Preparing database.sqlite download...";
	runProgress("#dbProgress", [
		{ width: "28%", textTarget: "#dbResult", text: "Locking SQLite database snapshot..." },
		{ width: "64%", textTarget: "#dbResult", text: "Streaming /wordpress/wp-content/database/.ht.sqlite..." },
		{ width: "100%", textTarget: "#dbResult", text: "database.sqlite downloaded. Size: 452 KB." },
	], () => {
		$("#activeRowMutation").textContent = "database.sqlite exported";
		addTransfer("Database export", "database.sqlite", "Downloaded SQLite-backed database snapshot, 452 KB");
		addLog("Playground", "database.sqlite downloaded from SQLite-backed database path.");
	});
}

function importZip() {
	showTable("playgrounds");
	const row = $("#importedRow");
	row.classList.add("selected");
	$("#activeRowState").textContent = "ZIP replacement warning";
	$("#activeRowMutation").textContent = "plugin-demo.zip validated; replacement confirmed";
	setShell({
		title: "Imported ZIP Playground",
		storage: "imported",
		path: "/wp-admin/plugins.php",
		subtitle: "plugin-demo.zip replaced files and database in the active runtime.",
	});
	$("#pageTitle").textContent = "Plugins";
	$("#pageBody").textContent = "Imported ZIP contents are active in WordPress admin. Review plugins before saving or exporting.";
	$("#previewNotice").textContent = "ZIP import complete. This replacement remains temporary until saved or exported.";
	addTransfer("ZIP import", "plugin-demo.zip", "Archive validated, replace-current confirmed, active shell moved to plugins.php");
	addLog("WordPress", "plugin-demo.zip import completed and changed current WordPress files.");
}

function startRoute(action) {
	const labels = {
		"start-vanilla": ["Unsaved Playground", "temporary", "/hello-from-playground/", "Vanilla WordPress started from the route table"],
		"preview-wp-pr": ["WordPress PR Preview", "temporary", "/wp-admin/about.php", "WordPress PR preview runtime started"],
		"preview-gutenberg": ["Gutenberg Branch Preview", "temporary", "/wp-admin/plugins.php", "Gutenberg PR or branch preview started"],
		"connect-github": ["GitHub Import Playground", "imported", "/wp-admin/plugins.php", "GitHub connected for this session; token is not stored after refresh"],
	};
	const route = labels[action];
	if (!route) {
		return;
	}
	setShell({ title: route[0], storage: route[1], path: route[2], subtitle: route[3] });
	$("#activeRowState").textContent = action === "connect-github" ? "Imported from GitHub" : "Preview runtime";
	$("#activeRowMutation").textContent = route[3];
	$("#previewNotice").textContent = route[3];
	addTransfer("Create route", route[0], route[3]);
	setPath(route[2], "Route preview");
}

function simpleAction(action) {
	if (action === "validate-blueprint") {
		setBadge($("#blueprintState"), "green", "Validated");
		$("#blueprintResult").textContent = "Blueprint JSON and URL passed validation. Replacement warning will appear before run.";
		addTransfer("Blueprint", state.selectedBlueprint.name, "Validated JSON and URL");
		return;
	}
	if (action === "copy-blueprint") {
		$("#blueprintResult").textContent = "Blueprint link copied to clipboard state for the selected bundle.";
		addTransfer("Blueprint copy", state.selectedBlueprint.name, "Copy link result recorded");
		return;
	}
	if (action === "download-blueprint") {
		$("#blueprintResult").textContent = "Blueprint bundle downloaded as blueprint-bundle.zip.";
		addTransfer("Blueprint download", state.selectedBlueprint.name, "blueprint-bundle.zip generated");
		return;
	}
	if (action === "download-zip") {
		$("#activeRowMutation").textContent = "Exported as playground-package.zip";
		$("#exportRowState").textContent = "Exported";
		$("#exportRowMutation").textContent = "playground-package.zip generated";
		addTransfer("ZIP export", state.activeTitle, "playground-package.zip generated from active files, database, and Blueprint");
		return;
	}
	if (action === "export-github") {
		$("#activeRowMutation").textContent = "Exported to GitHub branch playground-export";
		$("#exportRowState").textContent = "Exported";
		$("#exportRowMutation").textContent = "GitHub branch playground-export pushed";
		addTransfer("GitHub export", state.activeTitle, "Connected account and pushed export branch; session token not stored");
		return;
	}
	if (action === "open-adminer" || action === "open-phpmyadmin") {
		const tool = action === "open-adminer" ? "Adminer" : "phpMyAdmin";
		$("#dbResult").textContent = `${tool} opened for the SQLite-backed database.`;
		addTransfer("Database tool", tool, "Opened from Site Manager Database tab");
		return;
	}
	if (action === "reset-settings") {
		$("#activeRowState").textContent = state.storage === "temporary" ? "Resetting temporary runtime" : "Save & Reload required";
		$("#activeRowMutation").textContent = state.storage === "temporary" ? "Destructive settings reset confirmed" : "Stored Playground uses Save & Reload";
		$("#previewNotice").textContent = state.storage === "temporary" ? "Settings reset replaced the temporary runtime." : "Settings saved. Reload the stored Playground to apply runtime changes.";
		addTransfer("Settings", state.activeTitle, state.storage === "temporary" ? "Apply Settings & Reset Playground completed" : "Save & Reload consequence recorded");
	}
}

function applyTableLabels() {
	$$(".admin-table").forEach((table) => {
		const headers = $$("thead th", table).map((th) => th.textContent.trim());
		$$("tbody tr", table).forEach((row) => {
			$$("td", row).forEach((cell, index) => {
				cell.dataset.label = headers[index] || "";
			});
		});
	});
}

document.addEventListener("click", (event) => {
	const tableButton = event.target.closest("[data-table]");
	if (tableButton) {
		showTable(tableButton.dataset.table);
		return;
	}

	const detailButton = event.target.closest("[data-detail]");
	if (detailButton) {
		showDetail(detailButton.dataset.detail);
		return;
	}

	const managerButton = event.target.closest("[data-manager]");
	if (managerButton) {
		showManager(managerButton.dataset.manager);
		return;
	}

	const pathLink = event.target.closest("[data-path]");
	if (pathLink) {
		event.preventDefault();
		setPath(pathLink.dataset.path);
		return;
	}

	const actionButton = event.target.closest("[data-action]");
	if (!actionButton) {
		return;
	}

	const action = actionButton.dataset.action;
	const handlers = {
		refresh: () => addTransfer("Refresh", state.path, "Embedded WordPress page refreshed"),
		homepage: () => setPath("/hello-from-playground/", "Homepage"),
		"wp-admin": () => setPath("/wp-admin/", "WP Admin"),
		"show-manager": () => showManager("files"),
		"open-manager": () => showManager("files"),
		"save-local": saveLocalStart,
		"choose-folder": chooseFolderAndSave,
		"cancel-picker": () => {
			$("#saveFlowTitle").textContent = "Folder picker cancelled";
			$("#saveFlowDetail").textContent = "No local permission was granted. The active Playground remains temporary until saved elsewhere.";
			$("#activeRowState").textContent = "Ready, not persisted";
			addTransfer("Local save", state.activeTitle, "Folder picker cancelled; no files copied");
		},
		"save-browser": saveBrowser,
		"prepare-blueprint-run": prepareBlueprintRun,
		"cancel-blueprint-run": () => {
			$("#replaceBox").hidden = true;
			$("#blueprintResult").textContent = "Blueprint run cancelled. No files or database content changed.";
			addTransfer("Blueprint replace", state.selectedBlueprint.name, "Cancelled before replacement");
		},
		"confirm-blueprint-run": confirmBlueprintRun,
		"prepare-delete": prepareDelete,
		"cancel-delete": () => {
			$("#deleteConfirm").hidden = true;
			addTransfer("Delete", "Research Browser Playground", "Delete cancelled; saved row remains");
		},
		"confirm-delete": confirmDelete,
		"edit-file": editFile,
		"save-file": saveFile,
		"download-db": downloadDatabase,
		"import-zip": importZip,
		"route-blueprint": () => {
			showDetail("blueprint");
			$("#blueprintUrl").value = $("#routeBlueprintUrl").value;
			$("#blueprintResult").textContent = "Blueprint URL loaded into the selected detail runner. Validate before run.";
		},
		"new-file": () => addTransfer("File", "/wordpress/new-file.php", "New File control staged"),
		"new-folder": () => addTransfer("File", "/wordpress/wp-content/new-folder", "New Folder control staged"),
		"upload-file": () => addTransfer("File upload", "theme-patch.css", "Upload result staged in file browser"),
		"browse-files": () => addTransfer("File browse", "/wordpress", "Browse files picker opened"),
		"open-browser-row": () => {
			setShell({ title: "Research Browser Playground", storage: "browser", path: "/hello-from-playground/" });
			$("#activeRowState").textContent = "Saved in browser";
			addTransfer("Open", "Research Browser Playground", "Browser saved row opened in live shell");
		},
		"rename-browser": () => {
			const row = $('[data-row="browser"] strong');
			row.textContent = "Research Browser Playground Renamed";
			addTransfer("Rename", "Research Browser Playground", "Saved row renamed in place");
		},
	};

	if (handlers[action]) {
		handlers[action]();
	} else if (["start-vanilla", "preview-wp-pr", "preview-gutenberg", "connect-github"].includes(action)) {
		startRoute(action);
	} else {
		simpleAction(action);
	}
});

$("#pathForm").addEventListener("submit", (event) => {
	event.preventDefault();
	const value = $("#pathInput").value.trim() || "/";
	setPath(value, "Path input");
});

$("#blueprintSearch").addEventListener("input", renderBlueprints);

$("#categoryChips").addEventListener("click", (event) => {
	const button = event.target.closest("[data-category]");
	if (!button) {
		return;
	}
	state.category = button.dataset.category;
	$$("[data-category]", $("#categoryChips")).forEach((chip) => chip.classList.toggle("active", chip === button));
	renderBlueprints();
});

$$("[data-file]").forEach((button) => {
	button.addEventListener("click", () => {
		$$("[data-file]").forEach((item) => item.classList.toggle("active", item === button));
		$("#selectedFile").textContent = button.dataset.file;
		$("#fileResult").textContent = `${button.dataset.file} selected. Edit buffer to create a dirty state.`;
		setBadge($("#fileState"), "neutral", "Clean");
		state.fileDirty = false;
	});
});

applyTableLabels();
renderBlueprints();
