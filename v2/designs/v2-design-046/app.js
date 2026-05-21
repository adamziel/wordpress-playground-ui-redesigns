const state = {
	title: "Unsaved Playground",
	storage: "temporary",
	path: "/hello-from-playground/",
	selectedTransfer: "zip-import",
	selectedObject: "active-temp",
	managerTab: "files",
	blueprintFilter: "All",
	selectedBlueprint: "Art Gallery",
	fileDirty: false,
	localFolder: "",
	zipFile: "wordpress-static.zip",
	githubConnected: false,
};

const blueprints = [
	{ name: "Art Gallery", tags: ["Featured", "Website", "Personal"], desc: "An art gallery created with the Vueo theme." },
	{ name: "Coffee Shop", tags: ["Featured", "WooCommerce", "Website"], desc: "A WooCommerce coffee storefront with custom theme, products, and content." },
	{ name: "Feed Reader with the Friends Plugin", tags: ["Featured", "Content"], desc: "Read feeds from the web in Playground using the Friends plugin." },
	{ name: "Gaming News", tags: ["Featured", "News", "Website"], desc: "A gaming news site created with the Spiel theme." },
	{ name: "Non-profit Organization", tags: ["Featured", "Website"], desc: "A non-profit site created with the Koinonia theme." },
	{ name: "Personal Blog", tags: ["Personal", "Content"], desc: "A personal blog created with the Substrata theme." },
	{ name: "Block Theme Lab", tags: ["Themes", "Gutenberg", "Experiments"], desc: "A block theme workspace for inspecting templates and global styles." },
	{ name: "Woo Store Starter", tags: ["WooCommerce", "Website"], desc: "A compact WooCommerce store starter for product and checkout testing." },
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function addHistory(message) {
	const item = document.createElement("li");
	item.textContent = message;
	$("#historyList").prepend(item);
}

function logTo(selector, message) {
	const item = document.createElement("li");
	item.textContent = message;
	$(selector).prepend(item);
}

function setRunState(message) {
	$("#runState").textContent = message;
}

function setShell({ title, storage, path, subtitle, status, headline, copy, notice } = {}) {
	if (title) {
		state.title = title;
		$("#shellTitle").textContent = title;
		$("#previewSiteName").textContent = title === "Unsaved Playground" ? "My WordPress Website" : title;
	}
	if (storage) {
		state.storage = storage;
		const badge = $("#storageBadge");
		badge.className = "status-badge";
		if (storage === "temporary") {
			badge.classList.add("warning");
			badge.textContent = "Temporary";
		}
		if (storage === "browser") {
			badge.classList.add("success");
			badge.textContent = "Saved in browser";
		}
		if (storage === "local") {
			badge.classList.add("amber");
			badge.textContent = "Local directory";
		}
		document.querySelector(".app-shell").dataset.storage = storage;
	}
	if (path) {
		state.path = path;
		$("#pathInput").value = path;
		$("#previewPath").textContent = path;
	}
	if (subtitle) $("#shellSubtitle").textContent = subtitle;
	if (status) $("#previewStatus").textContent = status;
	if (headline) $("#previewHeadline").innerHTML = headline;
	if (copy) $("#previewCopy").textContent = copy;
	if (notice) $("#previewNotice").textContent = notice;

	const saved = state.storage !== "temporary";
	$("#resetMode").textContent = saved ? "Save & Reload" : "Apply Settings & Reset";
	$("#settingsConsequence").innerHTML = saved
		? `<strong>Reload consequence for stored Playground</strong><span>Settings are written to the ${state.storage === "local" ? "selected local directory" : "browser saved identity"} and WordPress reloads without losing this Playground.</span>`
		: `<strong>Destructive reset for temporary Playground</strong><span>Applying settings replaces current WordPress files and the SQLite database. Save first to preserve this work.</span>`;
}

function updateObjectRow(id, values = {}) {
	const row = $(`[data-object="${id}"]`);
	if (!row) return;
	const [nameCell, storageCell, stateCell, changeCell] = row.children;
	if (values.name || values.path) {
		nameCell.innerHTML = `<strong>${values.name || nameCell.querySelector("strong").textContent}</strong><span>${values.path || nameCell.querySelector("span").textContent}</span>`;
	}
	if (values.storageLabel) {
		const cls = values.storageClass || "";
		storageCell.innerHTML = `<span class="status-badge ${cls}">${values.storageLabel}</span>`;
	}
	if (values.stateText) stateCell.textContent = values.stateText;
	if (values.lastChange) changeCell.textContent = values.lastChange;
	$("#objectCount").textContent = `${$$("#objectRows tr").length} rows`;
}

function updateTransferRow(id, values = {}) {
	const row = $(`[data-transfer="${id}"]`);
	if (!row) return;
	const [nameCell, sourceCell, statusCell] = row.children;
	if (values.title || values.subtitle) {
		nameCell.innerHTML = `<strong>${values.title || nameCell.querySelector("strong").textContent}</strong><span>${values.subtitle || nameCell.querySelector("span").textContent}</span>`;
	}
	if (values.source) sourceCell.textContent = values.source;
	if (values.statusLabel) {
		const cls = values.statusClass || "";
		statusCell.innerHTML = `<span class="status-badge ${cls}">${values.statusLabel}</span>`;
	}
}

function selectRows(kind, id) {
	const selector = kind === "object" ? "#objectRows tr" : "#transferRows tr";
	$$(selector).forEach((row) => row.classList.toggle("selected", row.dataset[kind] === id));
}

function meter(id, steps, onTick, onDone) {
	let current = 0;
	const bar = $(id);
	bar.style.width = "0%";
	const timer = setInterval(() => {
		current += 1;
		const percent = Math.min(100, Math.round((current / steps) * 100));
		bar.style.width = `${percent}%`;
		if (onTick) onTick(current, percent);
		if (current >= steps) {
			clearInterval(timer);
			if (onDone) onDone();
		}
	}, 150);
}

function setDetail({ eyebrow, title, badge, badgeClass = "", body }) {
	$("#detailEyebrow").textContent = eyebrow;
	$("#detailTitle").textContent = title;
	$("#detailState").className = `status-badge ${badgeClass}`;
	$("#detailState").textContent = badge;
	$("#detailBody").innerHTML = body;
}

function detailZipImport(done = false) {
	setDetail({
		eyebrow: "Selected transfer",
		title: done ? "ZIP import completed" : "ZIP import replaces current Playground",
		badge: done ? "Imported" : "Needs confirmation",
		badgeClass: done ? "success" : "amber",
		body: `
			<section class="detail-card">
				<h3>Source selection</h3>
				<p>The current product opens a file chooser. This wireframe shows the selected archive and the replacement warning before import begins.</p>
				<ul class="detail-list">
					<li><strong>Selected file</strong><span id="zipFileLabel">${state.zipFile}</span></li>
					<li><strong>Archive check</strong><span id="zipValidation">${done ? "Valid archive imported" : "Contains wp-content, database, and blueprint.json"}</span></li>
					<li><strong>Consequence</strong><span>Replaces active files and SQLite database</span></li>
				</ul>
				<div class="progress-block">
					<div class="meter"><span id="zipMeter" style="width:${done ? 100 : 0}%"></span></div>
					<span class="muted" id="zipProgress">${done ? "Imported 3,751 files and restored database.sqlite." : "Waiting for confirmation."}</span>
				</div>
				<div class="detail-actions">
					<button type="button" data-action="choose-zip">Choose .zip</button>
					<button class="danger" type="button" data-action="cancel-zip">Cancel</button>
					<button class="primary" type="button" data-action="confirm-zip">Confirm replace and import</button>
				</div>
			</section>
			<section class="detail-card">
				<h3>Result targets</h3>
				<ul class="detail-list">
					<li><strong>Shell title</strong><span>Updates from Unsaved Playground to imported archive name</span></li>
					<li><strong>Storage</strong><span>Remains temporary until saved to browser or local directory</span></li>
					<li><strong>Preview</strong><span>Path, title, content, database size, and logs update together</span></li>
				</ul>
			</section>`,
	});
}

function runZipImport() {
	detailZipImport();
	$("#zipProgress").textContent = "Validating archive and preparing replacement.";
	$("#zipValidation").textContent = "Validation in progress";
	setRunState("Importing ZIP");
	updateTransferRow("zip-import", { statusLabel: "Importing", statusClass: "amber" });
	addHistory("ZIP import confirmed: current files and database will be replaced.");
	meter("#zipMeter", 9, (step) => {
		const files = Math.min(3751, step * 420);
		$("#zipProgress").textContent = `Importing ${files} / 3,751 files and restoring database.sqlite.`;
	}, () => {
		setShell({
			title: "Imported ZIP Playground",
			storage: "temporary",
			path: "/imported-zip-site/",
			subtitle: "Imported from wordpress-static.zip. Temporary until saved.",
			status: "ZIP imported",
			headline: "Imported <span>ZIP Playground</span>",
			copy: "The active WordPress files, Blueprint bundle, and SQLite database now come from the imported archive.",
			notice: "This replacement is complete. Save it to keep the imported Playground after reload.",
		});
		updateObjectRow("active-temp", {
			name: "Imported ZIP Playground",
			path: "/imported-zip-site/",
			storageLabel: "Temporary",
			storageClass: "warning",
			stateText: "Imported, unsaved",
			lastChange: "ZIP import completed",
		});
		updateTransferRow("zip-import", { source: state.zipFile, statusLabel: "Imported", statusClass: "success" });
		$("#databaseSize").textContent = "1.8 MB";
		logTo("#playgroundLog", "ZIP import replaced active files and SQLite database.");
		logTo("#wordpressLog", "Imported content loaded from wordpress-static.zip.");
		addHistory("ZIP import complete: active Playground identity, preview, database size, and row state updated.");
		setRunState("ZIP imported");
		detailZipImport(true);
	});
}

function detailGithubExport(done = false) {
	setDetail({
		eyebrow: "Selected transfer",
		title: done ? "GitHub export completed" : "Export active Playground to GitHub",
		badge: done ? "Exported" : "Ready",
		badgeClass: done ? "success" : "",
		body: `
			<section class="detail-card">
				<h3>Destination and source</h3>
				<ul class="detail-list">
					<li><strong>Repository</strong><span>adamziel/playground-demo</span></li>
					<li><strong>Branch</strong><span>playground-export</span></li>
					<li><strong>Source</strong><span>wp-content, blueprint.json, and database manifest</span></li>
					<li><strong>Account</strong><span id="githubAccount">${state.githubConnected ? "Connected for this browser session" : "Needs GitHub connection"}</span></li>
				</ul>
				<div class="progress-block">
					<div class="meter"><span id="githubExportMeter" style="width:${done ? 100 : 0}%"></span></div>
					<span class="muted" id="githubExportProgress">${done ? "Pushed 48 files and created a commit link." : "Ready to connect and export."}</span>
				</div>
				<div class="detail-actions">
					<button type="button" data-action="connect-github">Connect GitHub</button>
					<button class="primary" type="button" data-action="run-github-export">Export to GitHub</button>
				</div>
			</section>
			<section class="detail-card">
				<h3>Generated result</h3>
				<p id="githubExportResult">${done ? "Commit created at adamziel/playground-demo@playground-export with the current Playground bundle." : "No GitHub export result yet."}</p>
			</section>`,
	});
}

function runGithubExport() {
	state.githubConnected = true;
	$("#githubAccount").textContent = "Connected for this browser session";
	$("#githubExportProgress").textContent = "Packaging wp-content and Blueprint bundle.";
	setRunState("Exporting to GitHub");
	updateTransferRow("github-export", { statusLabel: "Exporting", statusClass: "amber" });
	addHistory("GitHub export started for adamziel/playground-demo.");
	meter("#githubExportMeter", 8, (step) => {
		$("#githubExportProgress").textContent = `Uploading ${Math.min(48, step * 6)} / 48 files to playground-export.`;
	}, () => {
		updateTransferRow("github-export", { statusLabel: "Exported", statusClass: "success" });
		updateObjectRow("active-temp", { lastChange: "Exported to GitHub" });
		logTo("#playgroundLog", "Exported current Playground bundle to GitHub branch playground-export.");
		addHistory("GitHub export complete: generated commit link and transfer history row.");
		setRunState("GitHub exported");
		detailGithubExport(true);
	});
}

function detailZipDownload(done = false) {
	setDetail({
		eyebrow: "Selected transfer",
		title: done ? "ZIP download generated" : "Download active Playground as .zip",
		badge: done ? "Generated" : "Ready",
		badgeClass: done ? "success" : "",
		body: `
			<section class="detail-card">
				<h3>Archive source</h3>
				<p>The archive includes the current WordPress files, wp-content, Blueprint bundle, and SQLite database snapshot.</p>
				<ul class="detail-list">
					<li><strong>Archive name</strong><span>imported-zip-playground.zip</span></li>
					<li><strong>Source status</strong><span>${done ? "Snapshot generated from active imported Playground" : "Ready to snapshot active Playground"}</span></li>
				</ul>
				<div class="progress-block">
					<div class="meter"><span id="downloadMeter" style="width:${done ? 100 : 0}%"></span></div>
					<span class="muted" id="downloadProgress">${done ? "Archive ready: 8.4 MB." : "No archive generated yet."}</span>
				</div>
				<div class="detail-actions">
					<button class="primary" type="button" data-action="run-zip-download">Generate .zip</button>
				</div>
			</section>`,
	});
}

function runZipDownload() {
	$("#downloadProgress").textContent = "Collecting files, database.sqlite, and blueprint.json.";
	setRunState("Generating ZIP");
	updateTransferRow("zip-download", { statusLabel: "Generating", statusClass: "amber" });
	meter("#downloadMeter", 7, (step) => {
		$("#downloadProgress").textContent = `Compressing archive ${Math.min(100, step * 15)}%.`;
	}, () => {
		updateTransferRow("zip-download", { statusLabel: "Generated", statusClass: "success" });
		addHistory("ZIP download generated: imported-zip-playground.zip, 8.4 MB.");
		setRunState("ZIP generated");
		detailZipDownload(true);
	});
}

function detailGithubImport(done = false) {
	setDetail({
		eyebrow: "Selected transfer",
		title: done ? "GitHub import completed" : "Import from GitHub",
		badge: done ? "Imported" : "Connect required",
		badgeClass: done ? "success" : "",
		body: `
			<section class="detail-card">
				<h3>Account and repository</h3>
				<p>Imports public GitHub plugins, themes, or wp-content directories. The token is not stored and re-authentication is required after refresh.</p>
				<ul class="detail-list">
					<li><strong>Account</strong><span id="githubImportAccount">${state.githubConnected ? "Connected for this browser session" : "Not connected"}</span></li>
					<li><strong>Repository</strong><span>wordpress/wordpress-develop, path: wp-content</span></li>
					<li><strong>Consequence</strong><span>Can replace active wp-content after confirmation</span></li>
				</ul>
				<div class="progress-block">
					<div class="meter"><span id="githubImportMeter" style="width:${done ? 100 : 0}%"></span></div>
					<span class="muted" id="githubImportProgress">${done ? "Imported repository contents into current Playground." : "Waiting for connection and import."}</span>
				</div>
				<div class="detail-actions">
					<button type="button" data-action="connect-github-import">Connect GitHub</button>
					<button class="primary" type="button" data-action="run-github-import">Import repository</button>
				</div>
			</section>`,
	});
}

function runGithubImport() {
	state.githubConnected = true;
	$("#githubImportAccount").textContent = "Connected for this browser session";
	$("#githubImportProgress").textContent = "Fetching repository tree and validating wp-content.";
	setRunState("Importing GitHub");
	updateTransferRow("github-import", { statusLabel: "Importing", statusClass: "amber" });
	meter("#githubImportMeter", 7, (step) => {
		$("#githubImportProgress").textContent = `Importing repository objects ${Math.min(100, step * 16)}%.`;
	}, () => {
		setShell({
			title: "GitHub Import Playground",
			storage: "temporary",
			path: "/github-import/",
			subtitle: "Imported from GitHub. Token is not stored after refresh.",
			status: "GitHub imported",
			headline: "GitHub <span>Import Playground</span>",
			copy: "The current wp-content directory now reflects the selected public GitHub repository.",
			notice: "Save this Playground to keep the imported repository contents.",
		});
		updateObjectRow("active-temp", {
			name: "GitHub Import Playground",
			path: "/github-import/",
			stateText: "Imported, unsaved",
			lastChange: "GitHub import completed",
		});
		updateTransferRow("github-import", { statusLabel: "Imported", statusClass: "success" });
		addHistory("GitHub import complete: active Playground identity and preview updated.");
		setRunState("GitHub imported");
		detailGithubImport(true);
	});
}

function detailObject(id) {
	if (id === "active-temp") {
		setDetail({
			eyebrow: "Selected Playground",
			title: state.title,
			badge: state.storage === "temporary" ? "Temporary" : state.storage === "local" ? "Local directory" : "Browser saved",
			badgeClass: state.storage === "temporary" ? "warning" : state.storage === "local" ? "amber" : "success",
			body: `
				<section class="detail-card">
					<h3>Save destinations</h3>
					<p>Save in this browser creates a browser-backed slug. Save to a local directory asks for folder permission and requires reconnecting that folder after reload.</p>
					<div class="form-grid">
						<label>Playground name<input id="saveName" value="${state.title === "Unsaved Playground" ? "Research Browser Playground" : state.title}" /></label>
					</div>
					<div class="progress-block">
						<div class="meter"><span id="saveMeter"></span></div>
						<span class="muted" id="saveProgress">No save in progress.</span>
					</div>
					<div class="detail-actions">
						<button class="primary" type="button" data-action="save-browser">Save in this browser</button>
						<button type="button" data-action="choose-local">Choose local directory</button>
						<button type="button" data-action="grant-local">Grant permission and save</button>
					</div>
				</section>
				<section class="detail-card">
					<h3>Current shell</h3>
					<ul class="detail-list">
						<li><strong>Path</strong><span>${state.path}</span></li>
						<li><strong>Reset behavior</strong><span>${state.storage === "temporary" ? "Apply Settings & Reset is destructive" : "Stored Playground uses Save & Reload"}</span></li>
					</ul>
				</section>`,
		});
		return;
	}

	if (id === "browser-saved") {
		setDetail({
			eyebrow: "Selected Playground",
			title: "Research Browser Playground",
			badge: "Browser saved",
			badgeClass: "success",
			body: `
				<section class="detail-card">
					<h3>Saved management</h3>
					<p>This browser-backed Playground can be opened, managed, renamed, or deleted. Delete requires confirmation and removes the row.</p>
					<div class="form-grid">
						<label>Rename Playground<input id="renameValue" value="Research Browser Playground" /></label>
					</div>
					<div class="detail-actions">
						<button type="button" data-action="open-browser-row">Open</button>
						<button type="button" data-action="rename-browser-row">Rename</button>
						<button class="danger" type="button" data-action="ask-delete-browser">Delete</button>
					</div>
					<div class="warning-card" id="deleteConfirm" hidden>
						<strong>Delete this saved Playground?</strong>
						<span>The browser-saved files and database are removed from Saved Playgrounds. The active site falls back to the unsaved Playground if this row was active.</span>
						<div class="detail-actions">
							<button type="button" data-action="cancel-delete-browser">Cancel</button>
							<button class="danger" type="button" data-action="confirm-delete-browser">Confirm delete</button>
						</div>
					</div>
				</section>`,
		});
		return;
	}

	setDetail({
		eyebrow: "Selected Playground",
		title: "Theme QA Folder",
		badge: "Permission needed",
		badgeClass: "amber",
		body: `
			<section class="detail-card">
				<h3>Local directory state</h3>
				<p>The folder-backed Playground persists on disk, but this browser session must reconnect folder permission before edits or reloads can write files.</p>
				<ul class="detail-list">
					<li><strong>Folder</strong><span>~/Sites/theme-qa-playground</span></li>
					<li><strong>Reload consequence</strong><span>Reconnect local permission, then Save & Reload</span></li>
				</ul>
				<div class="detail-actions">
					<button class="primary" type="button" data-action="reconnect-local">Reconnect folder</button>
				</div>
			</section>`,
	});
}

function runBrowserSave() {
	const name = $("#saveName").value.trim() || "Saved Playground";
	$("#saveProgress").textContent = "Saving 0 / 3,751 files to browser storage.";
	setRunState("Saving in browser");
	updateObjectRow("active-temp", { stateText: "Saving to browser", lastChange: "Saving now" });
	meter("#saveMeter", 8, (step) => {
		$("#saveProgress").textContent = `Saving ${Math.min(3751, step * 470)} / 3,751 files to browser storage.`;
	}, () => {
		setShell({
			title: name,
			storage: "browser",
			path: "/research-browser-playground/",
			subtitle: "Saved in this browser with slug /research-browser-playground/.",
			status: "Browser saved",
			notice: "Saved in browser storage. This Playground remains in Saved Playgrounds on this browser.",
		});
		updateObjectRow("active-temp", {
			name,
			path: "/research-browser-playground/",
			storageLabel: "Browser saved",
			storageClass: "success",
			stateText: "Saved",
			lastChange: "Browser save completed",
		});
		$("#saveProgress").textContent = "Saved 3,751 / 3,751 files. Shell title, slug, storage badge, and reset behavior updated.";
		addHistory("Browser save complete: temporary row transformed into a browser-saved Playground.");
		setRunState("Browser saved");
	});
}

function chooseLocal() {
	state.localFolder = "~/Sites/research-browser-playground";
	$("#saveProgress").textContent = `Folder selected: ${state.localFolder}. Grant permission before copying files.`;
	updateObjectRow("active-temp", { stateText: "Local permission needed", lastChange: "Folder selected" });
	addHistory(`Local directory selected: ${state.localFolder}.`);
}

function runLocalSave() {
	if (!state.localFolder) chooseLocal();
	$("#saveProgress").textContent = "Permission granted. Copying WordPress files to local folder.";
	setRunState("Saving locally");
	meter("#saveMeter", 8, (step) => {
		$("#saveProgress").textContent = `Copying ${Math.min(3751, step * 470)} / 3,751 files to ${state.localFolder}.`;
	}, () => {
		const name = $("#saveName").value.trim() || "Local Playground";
		setShell({
			title: name,
			storage: "local",
			path: "/research-browser-playground/",
			subtitle: `Local directory: ${state.localFolder}. Reconnect permission after browser reload.`,
			status: "Local saved",
			notice: "Local-directory save complete. Reloads keep this identity but may ask to reconnect the folder.",
		});
		updateObjectRow("active-temp", {
			name,
			path: state.localFolder,
			storageLabel: "Local directory",
			storageClass: "amber",
			stateText: "Saved locally",
			lastChange: "Local save completed",
		});
		$("#saveProgress").textContent = "Local save complete. Folder identity, reload consequence, and active row updated.";
		addHistory("Local-directory save complete: folder permission, copy progress, row state, and shell badge updated.");
		setRunState("Local saved");
	});
}

function detailLaunch() {
	setDetail({
		eyebrow: "Create routes",
		title: "Start or import a Playground",
		badge: "Routes visible",
		body: `
			<section class="detail-card">
				<h3>Launch contracts</h3>
				<div class="route-grid">
					<article class="route-card"><strong>Vanilla WordPress</strong><span>Starts a fresh Playground immediately. Unsaved current work should be saved first.</span><button type="button" data-action="start-vanilla">Start fresh</button></article>
					<article class="route-card"><strong>WordPress PR</strong><span>Accepts a PR number or URL.</span><input value="https://github.com/WordPress/wordpress-develop/pull/7777" /><button type="button" data-action="preview-wp-pr">Preview</button></article>
					<article class="route-card"><strong>Gutenberg PR or branch</strong><span>Accepts PR number, URL, or branch name.</span><input value="trunk" /><button type="button" data-action="preview-gutenberg">Preview</button></article>
					<article class="route-card"><strong>From GitHub</strong><span>Requires account connection; token is not stored after refresh.</span><button type="button" data-action="show-github-import">Connect and import</button></article>
					<article class="route-card"><strong>Blueprint URL</strong><span>Runs a remote blueprint after URL validation.</span><input value="https://playground.wordpress.net/blueprint.json" /><button type="button" data-action="run-blueprint-url">Run URL</button></article>
					<article class="route-card"><strong>Import .zip</strong><span>Uses a file chooser, validates archive contents, then warns before replacement.</span><button type="button" data-action="show-zip-import">Choose archive</button></article>
				</div>
			</section>`,
	});
}

function detailBlueprintGallery() {
	setDetail({
		eyebrow: "Blueprints",
		title: `${state.selectedBlueprint} selected`,
		badge: "Subset of 43",
		body: `
			<section class="detail-card">
				<h3>Gallery selection</h3>
				<p>The main manager tab shows a representative subset labeled honestly. Selecting a card updates this detail and the editable blueprint.json can be validated, copied, downloaded, or run.</p>
				<ul class="detail-list">
					<li><strong>Current filter</strong><span>${state.blueprintFilter}</span></li>
					<li><strong>Selected Blueprint</strong><span>${state.selectedBlueprint}</span></li>
					<li><strong>Replacement behavior</strong><span>Run Blueprint warns before changing current content</span></li>
				</ul>
				<div class="detail-actions">
					<button type="button" data-action="validate-blueprint">Validate JSON</button>
					<button type="button" data-action="copy-blueprint">Copy link</button>
					<button type="button" data-action="download-blueprint">Download bundle</button>
					<button class="primary" type="button" data-action="run-blueprint">Run Blueprint</button>
				</div>
			</section>`,
	});
}

function renderBlueprints() {
	const query = ($("#blueprintSearch")?.value || "").toLowerCase();
	const list = blueprints.filter((item) => {
		const matchesFilter = state.blueprintFilter === "All" || item.tags.includes(state.blueprintFilter);
		const matchesQuery = !query || item.name.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
		return matchesFilter && matchesQuery;
	});
	$("#blueprintList").innerHTML = list.map((item) => `
		<button class="blueprint-item ${item.name === state.selectedBlueprint ? "active" : ""}" type="button" data-blueprint="${item.name}">
			<strong>${item.name}</strong>
			<span>${item.desc}</span>
		</button>`).join("") || `<div class="result-card">No representative Blueprints match this filter.</div>`;
}

function setManagerTab(tab) {
	state.managerTab = tab;
	$$("[data-manager-tab]").forEach((button) => button.classList.toggle("active", button.dataset.managerTab === tab));
	$$(".manager-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `manager-${tab}`));
	setRunState({
		files: "Files selected",
		blueprint: "Blueprint selected",
		database: "Database selected",
		logs: "Logs selected",
		settings: "Settings selected",
	}[tab]);
	if (tab === "blueprint") renderBlueprints();
}

function setMode(mode) {
	$$("[data-mode]").forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
	if (mode === "manager") detailObject(state.selectedObject);
	if (mode === "objects") detailObject(state.selectedObject);
	if (mode === "launch") detailLaunch();
	if (mode === "blueprints") {
		setManagerTab("blueprint");
		detailBlueprintGallery();
	}
	if (mode === "transfers") showTransferDetail(state.selectedTransfer);
}

function showTransferDetail(id) {
	state.selectedTransfer = id;
	selectRows("transfer", id);
	if (id === "zip-import") detailZipImport();
	if (id === "github-export") detailGithubExport();
	if (id === "zip-download") detailZipDownload();
	if (id === "github-import") detailGithubImport();
	if (id === "db-download") {
		setDetail({
			eyebrow: "Selected transfer",
			title: "Download SQLite database",
			badge: "Ready",
			body: `<section class="detail-card"><h3>Database artifact</h3><p>Downloads the SQLite-backed database at /wordpress/wp-content/database/.ht.sqlite as database.sqlite.</p><div class="progress-block"><div class="meter"><span id="dbDetailMeter"></span></div><span class="muted" id="dbDetailProgress">No download in progress.</span></div><div class="detail-actions"><button class="primary" type="button" data-action="download-db">Download database.sqlite</button><button type="button" data-action="open-adminer">Open Adminer</button><button type="button" data-action="open-phpmyadmin">Open phpMyAdmin</button></div></section>`,
		});
	}
}

function markFileDirty() {
	state.fileDirty = true;
	$("#fileState").textContent = "Dirty";
	$("#fileState").className = "status-badge amber";
	$("#fileEditor").innerHTML = `<code>1  &lt;?php
2  define( 'DB_NAME', 'database_name_here' );
3  define( 'DB_USER', 'username_here' );
4  define( 'DB_PASSWORD', 'password_here' );
5  define( 'DB_HOST', 'localhost' );
6  define( 'DB_CHARSET', 'utf8mb4' );
7  define( 'WP_DEBUG', true );</code>`;
	$("#fileResult").textContent = "Unsaved change: WP_DEBUG switched to true in the editor buffer.";
	addHistory("File editor dirty: /wordpress/wp-config.php has unsaved changes.");
}

function saveFile() {
	if (!state.fileDirty) {
		$("#fileResult").textContent = "No dirty changes to save.";
		return;
	}
	$("#fileResult").textContent = "Saving /wordpress/wp-config.php...";
	setRunState("Saving file");
	setTimeout(() => {
		state.fileDirty = false;
		$("#fileState").textContent = "Saved";
		$("#fileState").className = "status-badge success";
		$("#fileResult").textContent = "Saved. WordPress runtime received the updated config.";
		logTo("#wordpressLog", "wp-config.php saved from Site Manager file editor.");
		addHistory("File save complete: dirty editor returned to saved state.");
		setRunState("File saved");
	}, 500);
}

function runDatabaseDownload() {
	setManagerTab("database");
	$("#databaseResult").textContent = "Preparing database.sqlite from /wordpress/wp-content/database/.ht.sqlite.";
	updateTransferRow("db-download", { statusLabel: "Downloading", statusClass: "amber" });
	addHistory("Database download started.");
	const detailBar = $("#dbDetailMeter");
	if (detailBar) detailBar.style.width = "0%";
	let step = 0;
	const timer = setInterval(() => {
		step += 1;
		const width = Math.min(100, step * 25);
		if (detailBar) detailBar.style.width = `${width}%`;
		if ($("#dbDetailProgress")) $("#dbDetailProgress").textContent = `Preparing database.sqlite ${width}%.`;
		if (step >= 4) {
			clearInterval(timer);
			$("#databaseResult").textContent = "database.sqlite downloaded. Size: 452 KB.";
			updateTransferRow("db-download", { statusLabel: "Downloaded", statusClass: "success" });
			addHistory("Database download complete: database.sqlite, 452 KB.");
		}
	}, 120);
}

function runBlueprintAction(action) {
	setManagerTab("blueprint");
	if (action === "validate") {
		$("#blueprintState").textContent = "Valid";
		$("#blueprintState").className = "status-badge success";
		$("#blueprintResult").textContent = "Blueprint JSON validates against playground.wordpress.net schema.";
		addHistory("Blueprint JSON validated successfully.");
	}
	if (action === "copy") {
		$("#blueprintResult").textContent = "Blueprint link copied for the current bundle.";
		addHistory("Blueprint link copied.");
	}
	if (action === "download") {
		$("#blueprintResult").textContent = "Blueprint bundle downloaded as blueprint-bundle.zip.";
		updateTransferRow("zip-download", { lastChange: "Blueprint bundle downloaded" });
		addHistory("Blueprint bundle download generated.");
	}
	if (action === "run") {
		$("#blueprintState").textContent = "Running";
		$("#blueprintState").className = "status-badge amber";
		$("#blueprintResult").textContent = "Replacement warning accepted. Running Blueprint against current Playground.";
		setRunState("Running Blueprint");
		setTimeout(() => {
			setShell({
				path: "/blueprint-result/",
				status: "Blueprint applied",
				headline: `${state.selectedBlueprint} <span>Blueprint</span>`,
				copy: "The selected Blueprint has been applied to the current WordPress Playground.",
				notice: "Blueprint run completed. Save if you want to keep this result.",
			});
			$("#blueprintState").textContent = "Applied";
			$("#blueprintState").className = "status-badge success";
			$("#blueprintResult").textContent = "Blueprint run complete. Preview path and active content updated.";
			updateObjectRow("active-temp", { stateText: "Blueprint applied", lastChange: "Blueprint run completed" });
			addHistory(`Blueprint run complete: ${state.selectedBlueprint} applied to active Playground.`);
			setRunState("Blueprint applied");
		}, 700);
	}
}

document.addEventListener("click", (event) => {
	const button = event.target.closest("button");
	const objectRow = event.target.closest("[data-object]");
	const transferRow = event.target.closest("[data-transfer]");
	const blueprintItem = event.target.closest("[data-blueprint]");

	if (objectRow && objectRow.tagName === "TR") {
		state.selectedObject = objectRow.dataset.object;
		selectRows("object", state.selectedObject);
		detailObject(state.selectedObject);
	}

	if (transferRow && transferRow.tagName === "TR") {
		showTransferDetail(transferRow.dataset.transfer);
	}

	if (blueprintItem) {
		state.selectedBlueprint = blueprintItem.dataset.blueprint;
		renderBlueprints();
		detailBlueprintGallery();
	}

	if (!button) return;

	if (button.dataset.mode) setMode(button.dataset.mode);
	if (button.dataset.managerTab) setManagerTab(button.dataset.managerTab);
	if (button.dataset.filter) {
		state.blueprintFilter = button.dataset.filter;
		$$("[data-filter]").forEach((filter) => filter.classList.toggle("active", filter.dataset.filter === state.blueprintFilter));
		renderBlueprints();
		detailBlueprintGallery();
	}

	const action = button.dataset.action;
	if (!action) return;

	if (action === "refresh") {
		setRunState("Preview refreshed");
		addHistory(`Refreshed active WordPress page at ${state.path}.`);
	}
	if (action === "homepage") {
		setShell({ path: "/hello-from-playground/", status: state.storage === "temporary" ? "Temporary" : "Stored" });
		addHistory("Opened Homepage in the live preview.");
	}
	if (action === "wp-admin") {
		setShell({ path: "/wp-admin/", status: "WP Admin" });
		addHistory("Opened WP Admin in the live preview.");
	}
	if (action === "focus-save") {
		state.selectedObject = "active-temp";
		selectRows("object", "active-temp");
		detailObject("active-temp");
	}
	if (action === "focus-manager") {
		setMode("manager");
		setManagerTab("files");
	}
	if (action === "choose-zip") {
		state.zipFile = "woocommerce-demo-import.zip";
		$("#zipFileLabel").textContent = state.zipFile;
		$("#zipValidation").textContent = "Valid archive: wp-content, blueprint.json, and database.sqlite found";
		addHistory("ZIP file selected: woocommerce-demo-import.zip.");
	}
	if (action === "cancel-zip") {
		$("#zipProgress").textContent = "Import canceled. Active Playground was not changed.";
		updateTransferRow("zip-import", { statusLabel: "Canceled", statusClass: "" });
		addHistory("ZIP import canceled before replacement.");
	}
	if (action === "confirm-zip") runZipImport();
	if (action === "connect-github" || action === "connect-github-import") {
		state.githubConnected = true;
		const account = action === "connect-github" ? $("#githubAccount") : $("#githubImportAccount");
		if (account) account.textContent = "Connected for this browser session";
		updateTransferRow(action === "connect-github" ? "github-export" : "github-import", { statusLabel: "Connected", statusClass: "success" });
		addHistory("GitHub account connected for this browser session. Token will not be stored after refresh.");
	}
	if (action === "run-github-export") runGithubExport();
	if (action === "run-zip-download") runZipDownload();
	if (action === "run-github-import") runGithubImport();
	if (action === "save-browser") runBrowserSave();
	if (action === "choose-local") chooseLocal();
	if (action === "grant-local") runLocalSave();
	if (action === "open-browser-row") {
		setShell({
			title: "Research Browser Playground",
			storage: "browser",
			path: "/research-browser-playground/",
			subtitle: "Saved in this browser with slug /research-browser-playground/.",
			status: "Browser saved",
		});
		addHistory("Opened browser-saved Playground from the saved table.");
	}
	if (action === "rename-browser-row") {
		const name = $("#renameValue").value.trim() || "Renamed Playground";
		updateObjectRow("browser-saved", { name, lastChange: "Renamed just now" });
		addHistory(`Saved Playground renamed to ${name}.`);
	}
	if (action === "ask-delete-browser") $("#deleteConfirm").hidden = false;
	if (action === "cancel-delete-browser") {
		$("#deleteConfirm").hidden = true;
		addHistory("Delete canceled; saved row remains.");
	}
	if (action === "confirm-delete-browser") {
		const row = $('[data-object="browser-saved"]');
		if (row) row.remove();
		$("#objectCount").textContent = `${$$("#objectRows tr").length} rows`;
		updateObjectRow("active-temp", { name: "Unsaved Playground", path: "/hello-from-playground/", stateText: "Active fallback after delete", lastChange: "Saved row deleted" });
		selectRows("object", "active-temp");
		setShell({
			title: "Unsaved Playground",
			storage: "temporary",
			path: "/hello-from-playground/",
			subtitle: "Fallback temporary Playground after saved row deletion.",
			status: "Temporary",
		});
		addHistory("Delete confirmed: browser-saved row removed and active site fell back to Unsaved Playground.");
		detailObject("active-temp");
	}
	if (action === "reconnect-local") {
		updateObjectRow("local-folder", { stateText: "Permission granted", lastChange: "Reconnected just now" });
		addHistory("Local directory reconnected; Save & Reload is available.");
		detailObject("local-folder");
	}
	if (action === "dirty-file") markFileDirty();
	if (action === "save-file") saveFile();
	if (action === "new-file") {
		$("#fileResult").textContent = "Created /wordpress/wp-content/mu-plugins/playground-note.php.";
		addHistory("New file created in Site Manager file browser.");
	}
	if (action === "new-folder") {
		$("#fileResult").textContent = "Created /wordpress/wp-content/uploads/playground-assets/.";
		addHistory("New folder created in Site Manager file browser.");
	}
	if (action === "upload-file") {
		$("#fileResult").textContent = "Uploaded sample-plugin.zip into /wordpress/wp-content/plugins/.";
		addHistory("Upload complete: sample-plugin.zip added to wp-content/plugins.");
	}
	if (action === "browse-files") {
		$("#fileResult").textContent = "Browse files opened the native file picker; no external file selected in this static mock.";
	}
	if (action === "validate-blueprint") runBlueprintAction("validate");
	if (action === "copy-blueprint") runBlueprintAction("copy");
	if (action === "download-blueprint") runBlueprintAction("download");
	if (action === "run-blueprint") runBlueprintAction("run");
	if (action === "download-db") runDatabaseDownload();
	if (action === "open-adminer") {
		setManagerTab("database");
		$("#databaseResult").textContent = "Adminer opened for the active SQLite-backed database.";
		addHistory("Adminer opened from Database tools.");
	}
	if (action === "open-phpmyadmin") {
		setManagerTab("database");
		$("#databaseResult").textContent = "phpMyAdmin opened for the active SQLite-backed database.";
		addHistory("phpMyAdmin opened from Database tools.");
	}
	if (action === "reset-settings") {
		setRunState(state.storage === "temporary" ? "Resetting" : "Reloading");
		addHistory(state.storage === "temporary" ? "Destructive settings reset confirmed for temporary Playground." : "Stored settings saved and WordPress reloaded.");
		setTimeout(() => setRunState(state.storage === "temporary" ? "Reset complete" : "Reload complete"), 600);
	}
	if (action === "show-github-import") {
		setMode("transfers");
		showTransferDetail("github-import");
	}
	if (action === "show-github-export") {
		setMode("transfers");
		showTransferDetail("github-export");
	}
	if (action === "show-zip-import") {
		setMode("transfers");
		showTransferDetail("zip-import");
	}
	if (action === "show-zip-download") {
		setMode("transfers");
		showTransferDetail("zip-download");
	}
	if (action === "start-vanilla") {
		setShell({
			title: "Unsaved Playground",
			storage: "temporary",
			path: "/",
			subtitle: "Fresh Vanilla WordPress Playground started. Save to preserve it.",
			status: "Fresh WordPress",
			headline: "Fresh <span>WordPress</span>",
			copy: "A new Vanilla WordPress Playground has replaced the previous temporary runtime.",
			notice: "This fresh Playground is unsaved.",
		});
		updateObjectRow("active-temp", { name: "Unsaved Playground", path: "/", stateText: "Fresh temporary", lastChange: "Vanilla WordPress started" });
		addHistory("Vanilla WordPress start route completed.");
	}
	if (action === "preview-wp-pr") {
		setShell({ title: "WordPress PR Preview", storage: "temporary", path: "/wp-admin/about.php", subtitle: "Previewing WordPress PR from URL. Temporary until saved.", status: "PR preview" });
		updateObjectRow("active-temp", { name: "WordPress PR Preview", path: "/wp-admin/about.php", stateText: "PR preview", lastChange: "WordPress PR route completed" });
		addHistory("WordPress PR preview route completed with PR URL input.");
	}
	if (action === "preview-gutenberg") {
		setShell({ title: "Gutenberg Branch Preview", storage: "temporary", path: "/wp-admin/site-editor.php", subtitle: "Previewing Gutenberg branch trunk. Temporary until saved.", status: "Gutenberg preview" });
		updateObjectRow("active-temp", { name: "Gutenberg Branch Preview", path: "/wp-admin/site-editor.php", stateText: "Branch preview", lastChange: "Gutenberg branch route completed" });
		addHistory("Gutenberg PR or branch preview route completed.");
	}
	if (action === "run-blueprint-url") {
		setManagerTab("blueprint");
		runBlueprintAction("run");
		addHistory("Blueprint URL validated and run from launch route.");
	}
});

document.addEventListener("input", (event) => {
	if (event.target.id === "blueprintSearch") renderBlueprints();
});

document.addEventListener("submit", (event) => {
	if (event.target.id !== "pathForm") return;
	event.preventDefault();
	const path = $("#pathInput").value.trim() || "/";
	setShell({ path, status: path.includes("wp-admin") ? "WP Admin" : state.storage === "temporary" ? "Temporary" : "Stored" });
	addHistory(`Opened ${path} in the live WordPress preview.`);
});

document.addEventListener("click", (event) => {
	const fileButton = event.target.closest("[data-file]");
	if (!fileButton) return;
	$$("[data-file]").forEach((button) => button.classList.toggle("active", button === fileButton));
	const file = fileButton.dataset.file;
	$("#selectedFile").textContent = file;
	$("#fileMeta").textContent = file.endsWith(".css") ? "CSS, 2.3 KB, selected from theme folder" : file.endsWith(".php") ? "PHP, selected from /wordpress" : "File selected from /wordpress";
	$("#fileState").textContent = "Clean";
	$("#fileState").className = "status-badge";
	$("#fileResult").textContent = `Opened ${file}.`;
	addHistory(`File selected: ${file}.`);
});

renderBlueprints();
detailZipImport();
