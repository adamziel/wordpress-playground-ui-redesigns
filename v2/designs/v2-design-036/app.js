const state = {
	storage: "temporary",
	title: "Unsaved Playground",
	path: "/hello-from-playground/",
	localFolder: "",
	pendingDelete: null,
	blueprintFilter: "All",
	selectedBlueprint: "Art Gallery",
	fileDirty: false,
	zipReady: false,
};

const blueprints = [
	{ name: "Art Gallery", tags: ["Featured", "Website", "Personal"], desc: "An art gallery created with the Vueo theme." },
	{ name: "Coffee Shop", tags: ["Featured", "WooCommerce", "Website"], desc: "A WooCommerce coffee storefront with custom theme, products, and content." },
	{ name: "Feed Reader with the Friends Plugin", tags: ["Featured", "Content"], desc: "Read feeds from the web in Playground using the Friends plugin." },
	{ name: "Gaming News", tags: ["Featured", "News", "Website"], desc: "A gaming news site created with the Spiel theme." },
	{ name: "Non-profit Organization", tags: ["Featured", "Website"], desc: "A non-profit organization site created with the Koinonia theme." },
	{ name: "Personal Blog", tags: ["Personal", "Content"], desc: "A personal blog created with the Substrata theme." },
	{ name: "Block Theme Lab", tags: ["Themes", "Gutenberg", "Experiments"], desc: "A block theme workspace for inspecting templates and global styles." },
	{ name: "Woo Store Starter", tags: ["WooCommerce", "Website"], desc: "A compact WooCommerce store starter for product and checkout testing." },
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function setActiveTab(tab) {
	$$("[data-tab]").forEach((button) => button.classList.toggle("active", button.dataset.tab === tab));
	$$(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `panel-${tab}`));
	$("#runState").textContent = {
		files: "Editing files",
		blueprint: "Blueprint tools",
		database: "Database tools",
		logs: "Inspecting logs",
		settings: "Runtime settings",
		start: "Create routes",
		save: "Save flows",
		library: "Saved management",
	}[tab] || "Ready";
}

function activity(message) {
	const li = document.createElement("li");
	li.textContent = message;
	$("#activityLog").prepend(li);
	$("#activityCount").textContent = `${$("#activityLog").children.length} events`;
}

function logTo(listSelector, message) {
	const li = document.createElement("li");
	li.textContent = message;
	$(listSelector).prepend(li);
	$("#logState").textContent = "Updated";
}

function setShell({ title, storage, path, subtitle, notice, status, headline, copy } = {}) {
	if (title) {
		state.title = title;
		$("#shellTitle").textContent = title;
		$("#wpSiteLabel").textContent = title === "Unsaved Playground" ? "My WordPress Website" : title;
	}
	if (storage) {
		state.storage = storage;
		const badge = $("#storageBadge");
		badge.className = `storage-badge ${storage === "temporary" ? "warning" : storage === "local" ? "local" : "success"}`;
		badge.textContent = storage === "local" ? "Local directory" : storage === "browser" ? "Saved in browser" : "Temporary";
		document.querySelector(".app-shell").dataset.storage = storage;
	}
	if (path) {
		state.path = path;
		$("#pathInput").value = path;
		$("#previewPathLabel").textContent = path;
		$("#pathPill").textContent = path;
	}
	if (subtitle) $("#shellSubtitle").textContent = subtitle;
	if (notice) $("#previewNotice").textContent = notice;
	if (status) $("#previewStatus").textContent = status;
	if (headline) $("#previewHeadline").innerHTML = headline;
	if (copy) $("#previewCopy").textContent = copy;

	const saved = state.storage !== "temporary";
	$("#resetMode").textContent = saved ? "Save & Reload" : "Apply Settings & Reset";
	$("#settingsConsequence").innerHTML = saved
		? `<strong>Reload consequence for stored Playground</strong><span>Settings are saved to the ${state.storage === "local" ? "selected local directory" : "browser-saved identity"} and WordPress reloads without losing the saved site.</span>`
		: `<strong>Destructive reset for temporary Playground</strong><span>Applying settings replaces the current WordPress files and SQLite database. Save first to preserve this work.</span>`;
}

function setActiveSavedRow(row) {
	$$(".saved-row").forEach((item) => item.classList.toggle("active", item.dataset.row === row));
}

function updateLibraryCount() {
	$("#libraryState").textContent = `${$$(".saved-row").length} rows`;
}

function upsertSavedRow(row, title, meta, active = true) {
	let el = $(`.saved-row[data-row="${row}"]`);
	if (!el) {
		el = document.createElement("article");
		el.className = "saved-row";
		el.dataset.row = row;
		$("#savedList").append(el);
	}
	el.innerHTML = `
		<div>
			<strong>${title}</strong>
			<span>${meta}</span>
		</div>
		<div class="row-actions">
			<button type="button" data-row-action="open" data-row="${row}">Open</button>
			<button type="button" data-row-action="manage" data-row="${row}">Manage</button>
			<button type="button" data-row-action="rename" data-row="${row}">Rename</button>
			<button type="button" data-row-action="delete" data-row="${row}">Delete</button>
		</div>`;
	if (active) setActiveSavedRow(row);
	updateLibraryCount();
}

function simulateMeter(meter, steps, onTick, onDone) {
	let current = 0;
	$(meter).style.width = "0%";
	const timer = setInterval(() => {
		current += 1;
		const percent = Math.min(100, Math.round((current / steps) * 100));
		$(meter).style.width = `${percent}%`;
		if (onTick) onTick(current, percent);
		if (current >= steps) {
			clearInterval(timer);
			if (onDone) onDone();
		}
	}, 130);
}

function completeBrowserSave() {
	const name = $("#playgroundName").value.trim() || "Saved Playground";
	$("#saveState").textContent = "Saving in browser";
	activity("Browser save started: copying 3,751 WordPress files into browser storage.");
	setTimeout(() => {
		setShell({
			title: name,
			storage: "browser",
			path: "/research-browser-playground/",
			subtitle: "Saved in this browser with slug /research-browser-playground/",
			notice: "Saved in browser storage. This Playground remains available from Saved Playgrounds in this browser.",
			status: "Browser saved",
		});
		upsertSavedRow("browser-research", name, "Browser storage, created May 21, 2026");
		$("#saveState").textContent = "Browser saved";
		activity("Browser save complete: saved row created and active shell slug updated.");
		logTo("#playgroundLog", "Browser save completed with slug /research-browser-playground/.");
	}, 650);
}

function startLocalSave() {
	setActiveTab("save");
	$("#saveState").textContent = "Local folder required";
	$("#folderStep").className = "flow-step active";
	$("#permissionStep").className = "flow-step";
	$("#copyStep").className = "flow-step";
	$("#localResultStep").className = "flow-step";
	$("#folderStatus").textContent = "No folder selected.";
	$("#permissionStatus").textContent = "Waiting for folder grant.";
	$("#copyStatus").textContent = "Progress will appear here.";
	$("#localResult").textContent = "Local directory identity not established.";
	$("#localMeter").style.width = "0%";
	activity("Local-directory save opened: waiting for folder picker.");
}

function chooseFolder() {
	state.localFolder = "~/Sites/research-browser-playground";
	$("#folderStep").className = "flow-step complete";
	$("#permissionStep").className = "flow-step active";
	$("#folderStatus").textContent = `Selected ${state.localFolder}.`;
	$("#permissionStatus").textContent = "Folder selected. Permission grant is required before writing files.";
	$("#saveState").textContent = "Permission needed";
	activity(`Folder picker selected ${state.localFolder}.`);
}

function grantPermissionAndCopy() {
	if (!state.localFolder) chooseFolder();
	$("#permissionStep").className = "flow-step complete";
	$("#copyStep").className = "flow-step active";
	$("#permissionStatus").textContent = "Permission granted for read and write access.";
	$("#copyStatus").textContent = "Copying 0 / 3,751 files.";
	$("#saveState").textContent = "Copying files";
	activity("Local folder permission granted; copying WordPress files.");
	simulateMeter("#localMeter", 8, (step) => {
		const files = Math.min(3751, step * 470);
		$("#copyStatus").textContent = `Copying ${files} / 3,751 files.`;
	}, () => {
		const name = $("#playgroundName").value.trim() || "Local Playground";
		$("#copyStatus").textContent = "Copied 3,751 / 3,751 files.";
		$("#copyStep").className = "flow-step complete";
		$("#localResultStep").className = "flow-step complete";
		$("#localResult").textContent = `Saved to ${state.localFolder}. Reload will ask to reconnect this folder before edits continue.`;
		$("#saveState").textContent = "Local saved";
		setShell({
			title: name,
			storage: "local",
			path: "/research-browser-playground/",
			subtitle: `Local directory: ${state.localFolder}. Reconnect permission after browser reload.`,
			notice: "Local-directory save complete. Future reloads keep this identity but may require reconnecting folder permission.",
			status: "Local saved",
		});
		upsertSavedRow("local-research", name, `Local directory, ${state.localFolder}`);
		activity("Local-directory save complete: folder identity, shell badge, saved row, and reload consequence updated.");
		logTo("#playgroundLog", `Local save complete at ${state.localFolder}.`);
	});
}

function markFileDirty() {
	state.fileDirty = true;
	$("#fileDirtyBadge").textContent = "Dirty";
	$("#fileDirtyBadge").className = "state-pill attention";
	$("#fileResult").textContent = "Unsaved change: WP_DEBUG switched to true in the editor buffer.";
	$("#fileEditor").innerHTML = `<code>1  &lt;?php
2  define( 'DB_NAME', 'database_name_here' );
3  define( 'DB_USER', 'username_here' );
4  define( 'DB_PASSWORD', 'password_here' );
5  define( 'DB_HOST', 'localhost' );
6  define( 'DB_CHARSET', 'utf8mb4' );
7  define( 'WP_DEBUG', true );</code>`;
	activity("File editor marked /wordpress/wp-config.php dirty.");
}

function saveFile() {
	if (!state.fileDirty) {
		$("#fileResult").textContent = "No dirty changes to save.";
		return;
	}
	$("#fileResult").textContent = "Saving /wordpress/wp-config.php...";
	$("#runState").textContent = "Saving file";
	setTimeout(() => {
		state.fileDirty = false;
		$("#fileDirtyBadge").textContent = "Saved";
		$("#fileDirtyBadge").className = "state-pill success";
		$("#fileResult").textContent = "Saved /wordpress/wp-config.php. WordPress runtime received the updated config.";
		$("#runState").textContent = "File saved";
		activity("File save complete: /wordpress/wp-config.php updated and editor returned to clean state.");
		logTo("#wordpressLog", "wp-config.php saved from Site Manager file editor.");
	}, 650);
}

function selectFile(file) {
	$("#selectedFile").textContent = file;
	$("#fileMeta").textContent = file.endsWith(".css") ? "CSS, 8.2 KB, selectable and editable" : file.endsWith(".json") ? "JSON, 1.9 KB, synced with Blueprint tools" : "PHP, 4.7 KB, selectable and editable";
	$$(".tree-item").forEach((item) => item.classList.toggle("active", item.dataset.file === file));
	state.fileDirty = false;
	$("#fileDirtyBadge").textContent = "Clean";
	$("#fileDirtyBadge").className = "state-pill";
	$("#fileResult").textContent = `Selected ${file}.`;
}

function renderBlueprints() {
	const query = $("#blueprintSearch").value.trim().toLowerCase();
	const filtered = blueprints.filter((item) => {
		const matchesFilter = state.blueprintFilter === "All" || item.tags.includes(state.blueprintFilter);
		const matchesQuery = !query || item.name.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
		return matchesFilter && matchesQuery;
	});
	$("#blueprintList").innerHTML = filtered
		.map((item) => `<button class="blueprint-item ${item.name === state.selectedBlueprint ? "active" : ""}" type="button" data-blueprint="${item.name}">
			<strong>${item.name}</strong>
			<span>${item.desc}</span>
			<small>${item.tags.join(" / ")}</small>
		</button>`)
		.join("");
	if (!filtered.length) {
		$("#blueprintList").innerHTML = `<div class="result-line">No representative items match this filter. The full gallery contains 43 blueprints.</div>`;
	}
}

function runBlueprint() {
	$("#blueprintResult").textContent = "Replacement warning accepted. Running Blueprint against the current Playground...";
	$("#blueprintState").textContent = "Running";
	$("#blueprintState").className = "state-pill attention";
	activity(`Blueprint run started: ${state.selectedBlueprint} will replace current content and update the preview.`);
	setTimeout(() => {
		$("#blueprintState").textContent = "Run complete";
		$("#blueprintState").className = "state-pill success";
		$("#blueprintResult").textContent = `${state.selectedBlueprint} completed. Preview, path, logs, and transfer history updated.`;
		setShell({
			path: "/",
			notice: `${state.selectedBlueprint} Blueprint ran successfully in the active Playground.`,
			status: "Blueprint applied",
			headline: `${state.selectedBlueprint} <span>Blueprint</span>`,
			copy: "The current Playground has been replaced with Blueprint-provided content while keeping the shell and Site Manager available.",
		});
		logTo("#playgroundLog", `Blueprint run complete: ${state.selectedBlueprint}.`);
		activity(`Blueprint run complete: ${state.selectedBlueprint} replaced current content.`);
	}, 900);
}

function downloadDatabase() {
	setActiveTab("database");
	$("#dbProgressTitle").textContent = "Preparing database.sqlite";
	$("#dbProgressCopy").textContent = "Reading /wordpress/wp-content/database/.ht.sqlite.";
	activity("Database download started.");
	simulateMeter("#dbMeter", 7, (step, percent) => {
		$("#dbProgressCopy").textContent = `Packaging SQLite database, ${percent}% complete.`;
	}, () => {
		$("#dbProgressTitle").textContent = "database.sqlite downloaded";
		$("#dbProgressCopy").textContent = "452 KB database export is ready in the browser downloads list.";
		$("#databaseResult").textContent = "Download complete: database.sqlite, 452 KB.";
		activity("Database download complete: database.sqlite, 452 KB.");
		logTo("#playgroundLog", "Database export generated from SQLite-backed MySQL emulation.");
	});
}

function chooseZip() {
	setActiveTab("start");
	state.zipReady = true;
	$("#zipTitle").textContent = "plugin-demo.zip validated";
	$("#zipCopy").textContent = "Archive contains wp-content/plugins/demo-plugin and database changes. Replacing the current Playground will overwrite files and SQLite data.";
	$('[data-action="confirm-zip"]').disabled = false;
	activity("ZIP import selected plugin-demo.zip and passed archive validation.");
}

function confirmZip() {
	if (!state.zipReady) return;
	$("#zipTitle").textContent = "Replacing current Playground...";
	$("#zipCopy").textContent = "Importing files, replacing database, and reloading WordPress.";
	$('[data-action="confirm-zip"]').disabled = true;
	activity("ZIP replacement confirmed: current files and database are being replaced.");
	setTimeout(() => {
		state.zipReady = false;
		$("#zipTitle").textContent = "ZIP import complete";
		$("#zipCopy").textContent = "plugin-demo.zip replaced the current Playground. The active preview and path now show the imported plugin admin screen.";
		setShell({
			title: "Imported ZIP Playground",
			storage: "temporary",
			path: "/wp-admin/plugins.php",
			subtitle: "Temporary imported ZIP session. Save to preserve after refresh.",
			notice: "ZIP import replaced the current files and database. Save now to preserve the imported Playground.",
			status: "ZIP imported",
			headline: "Imported plugin <span>ready for review</span>",
			copy: "The archive was validated and imported over the current Playground. This remains temporary until saved.",
		});
		setActiveSavedRow("temporary");
		logTo("#wordpressLog", "ZIP import completed and WordPress reloaded at /wp-admin/plugins.php.");
		activity("ZIP import complete: preview, path, shell title, logs, and temporary state updated.");
	}, 1000);
}

function requestDelete(row) {
	const title = $(`.saved-row[data-row="${row}"] strong`)?.textContent || "selected Playground";
	state.pendingDelete = row;
	$("#confirmTitle").textContent = `Delete ${title}?`;
	$("#confirmCopy").textContent = "This removes the saved row from browser/local management. The active preview falls back to the temporary Playground if this row is active.";
	$('[data-action="confirm-delete"]').disabled = false;
	setActiveTab("library");
	activity(`Delete confirmation opened for ${title}.`);
}

function confirmDelete() {
	if (!state.pendingDelete) return;
	const row = $(`.saved-row[data-row="${state.pendingDelete}"]`);
	const wasActive = row?.classList.contains("active");
	const name = row?.querySelector("strong")?.textContent || "Saved Playground";
	row?.remove();
	state.pendingDelete = null;
	$("#confirmTitle").textContent = "Deleted";
	$("#confirmCopy").textContent = `${name} was removed from Saved Playgrounds.`;
	$('[data-action="confirm-delete"]').disabled = true;
	if (wasActive) {
		setActiveSavedRow("temporary");
		setShell({
			title: "Unsaved Playground",
			storage: "temporary",
			path: "/hello-from-playground/",
			subtitle: "Temporary fallback after deleting the active saved row",
			notice: "The deleted saved identity is gone. This is now a temporary Playground again.",
			status: "Temporary fallback",
		});
	}
	updateLibraryCount();
	activity(`Delete complete: ${name} removed from the saved list.`);
}

function handleRowAction(action, row) {
	if (action === "delete") {
		requestDelete(row);
		return;
	}
	if (action === "rename") {
		const rowEl = $(`.saved-row[data-row="${row}"]`);
		const oldName = rowEl.querySelector("strong").textContent;
		const newName = oldName.includes("Renamed") ? "Plugin Review Playground" : "Renamed Plugin Review Playground";
		rowEl.querySelector("strong").textContent = newName;
		if (rowEl.classList.contains("active")) setShell({ title: newName, status: "Renamed" });
		activity(`Rename complete: ${oldName} changed to ${newName}.`);
		return;
	}
	setActiveSavedRow(row);
	if (row === "plugin-review") {
		setShell({
			title: "Plugin Review Playground",
			storage: "browser",
			path: "/wp-admin/plugins.php",
			subtitle: "Saved in this browser, created May 21, 2026",
			notice: "Opened Plugin Review Playground from browser storage.",
			status: action === "manage" ? "Managing saved site" : "Saved site opened",
		});
	} else if (row === "local-research") {
		setShell({
			storage: "local",
			status: "Local site opened",
			subtitle: `Local directory: ${state.localFolder || "~/Sites/research-browser-playground"}. Reconnect permission after browser reload.`,
		});
	} else if (row === "temporary") {
		setShell({
			title: "Unsaved Playground",
			storage: "temporary",
			path: "/hello-from-playground/",
			subtitle: "Temporary session, not saved to browser storage or local disk",
			notice: "Opened the current unsaved Playground. Save before refresh to preserve changes.",
			status: action === "manage" ? "Managing temporary site" : "Temporary site opened",
		});
	}
	setActiveTab(action === "manage" ? "files" : "library");
	activity(`${action === "manage" ? "Manage" : "Open"} action completed for ${row}.`);
}

function action(name) {
	if (name === "refresh") {
		$("#previewStatus").textContent = "Refreshed";
		activity(`Preview refreshed at ${state.path}.`);
	}
	if (name === "open-path") setShell({ path: $("#pathInput").value || "/", status: "Path opened", notice: `Opened ${$("#pathInput").value || "/"} inside the active WordPress shell.` });
	if (name === "homepage") setShell({ path: "/hello-from-playground/", status: "Homepage", notice: "Homepage opened inside the active WordPress shell." });
	if (name === "wp-admin") setShell({ path: "/wp-admin/", status: "WP Admin", notice: "WP Admin opened. Logged in as admin." });
	if (name === "focus-save") setActiveTab("save");
	if (name === "focus-library") setActiveTab("library");
	if (name === "focus-files") setActiveTab("files");
	if (name === "save-browser") completeBrowserSave();
	if (name === "start-local-save") startLocalSave();
	if (name === "choose-folder") chooseFolder();
	if (name === "grant-permission") grantPermissionAndCopy();
	if (name === "mark-dirty") markFileDirty();
	if (name === "save-file") saveFile();
	if (name === "new-file") {
		selectFile("/wordpress/wp-content/mu-plugins/playground-note.php");
		$("#fileResult").textContent = "New file created in the editor buffer. Save file to write it to the runtime.";
		markFileDirty();
	}
	if (name === "new-folder") {
		$("#fileResult").textContent = "Created folder /wordpress/wp-content/uploads/playground-notes.";
		activity("New folder created: /wordpress/wp-content/uploads/playground-notes.");
	}
	if (name === "upload-file" || name === "browse-files") {
		$("#fileResult").textContent = name === "upload-file" ? "Upload complete: imported block-patterns.json into wp-content/uploads." : "Browse files opened the native file picker; no file selected.";
		activity($("#fileResult").textContent);
	}
	if (name === "validate-blueprint") {
		$("#blueprintState").textContent = "Valid";
		$("#blueprintState").className = "state-pill success";
		$("#blueprintResult").textContent = "Blueprint schema validated. landingPage, login, preferredVersions, and steps are valid.";
	}
	if (name === "copy-blueprint") {
		$("#blueprintResult").textContent = "Copied Blueprint URL for the current bundle.";
		activity("Blueprint link copied.");
	}
	if (name === "download-blueprint") {
		$("#blueprintResult").textContent = "Downloaded Blueprint bundle for the current Playground.";
		activity("Blueprint bundle download complete.");
	}
	if (name === "run-blueprint") runBlueprint();
	if (name === "download-db") downloadDatabase();
	if (name === "open-adminer") {
		$("#databaseResult").textContent = "Adminer opened with SQLite-backed WordPress database selected.";
		activity("Adminer opened for /wordpress/wp-content/database/.ht.sqlite.");
	}
	if (name === "open-phpmyadmin") {
		$("#databaseResult").textContent = "phpMyAdmin opened with the Playground database selected.";
		activity("phpMyAdmin opened for the Playground database.");
	}
	if (name === "choose-zip") chooseZip();
	if (name === "confirm-zip") confirmZip();
	if (name === "confirm-delete") confirmDelete();
	if (name === "cancel-delete") {
		state.pendingDelete = null;
		$("#confirmTitle").textContent = "Delete cancelled";
		$("#confirmCopy").textContent = "No saved Playground rows were removed.";
		$('[data-action="confirm-delete"]').disabled = true;
		activity("Delete cancelled before removing a saved row.");
	}
	if (name === "cancel-zip") {
		state.zipReady = false;
		$("#zipTitle").textContent = "ZIP import cancelled";
		$("#zipCopy").textContent = "No files or database tables were replaced.";
		$('[data-action="confirm-zip"]').disabled = true;
		activity("ZIP import cancelled before replacement.");
	}
	if (name === "connect-github") {
		activity("GitHub account connection opened. Access token will not be stored after refresh.");
		$("#runState").textContent = "GitHub auth required";
	}
	if (name === "export-github") {
		activity("GitHub export prepared: choose repository, then push files and Blueprint bundle.");
	}
	if (name === "download-zip") {
		activity("Download .zip complete: current WordPress files and database bundled.");
	}
	if (name === "start-vanilla") {
		setShell({
			title: "Unsaved Playground",
			storage: "temporary",
			path: "/hello-from-playground/",
			subtitle: "Fresh temporary Vanilla WordPress Playground",
			notice: "Started a fresh Vanilla WordPress Playground. Save before refresh to preserve changes.",
			status: "Fresh runtime",
			headline: "Hello from <span>WordPress Playground!</span>",
			copy: "This is a fresh WordPress runtime, logged in as admin and ready for operations.",
		});
		setActiveSavedRow("temporary");
		activity("Started a fresh Vanilla WordPress Playground.");
	}
	if (name === "preview-wp-pr" || name === "preview-gb-pr" || name === "blueprint-url") {
		const label = name === "preview-wp-pr" ? "WordPress PR preview" : name === "preview-gb-pr" ? "Gutenberg PR or branch preview" : "Blueprint URL validation";
		activity(`${label} prepared. Current unsaved work requires confirmation before replacement.`);
	}
	if (name === "request-reset") {
		activity("Settings reset confirmation opened because temporary Playgrounds are destructive on apply.");
		$("#settingsConsequence").innerHTML = `<strong>Reset confirmation pending</strong><span>Confirming would replace files and database. Save to browser or local directory to switch this to Save & Reload.</span>`;
	}
	if (name === "save-reload") {
		activity(state.storage === "temporary" ? "Save & Reload unavailable until the Playground is saved." : "Save & Reload complete for stored Playground.");
	}
}

document.addEventListener("click", (event) => {
	const tabButton = event.target.closest("[data-tab]");
	if (tabButton) setActiveTab(tabButton.dataset.tab);

	const actionButton = event.target.closest("[data-action]");
	if (actionButton) action(actionButton.dataset.action);

	const fileButton = event.target.closest("[data-file]");
	if (fileButton) selectFile(fileButton.dataset.file);

	const blueprintButton = event.target.closest("[data-blueprint]");
	if (blueprintButton) {
		state.selectedBlueprint = blueprintButton.dataset.blueprint;
		$("#blueprintMeta").textContent = `${state.selectedBlueprint} selected from representative gallery subset.`;
		$("#blueprintResult").textContent = `${state.selectedBlueprint} selected. Validate or run to replace the current Playground content.`;
		renderBlueprints();
	}

	const filterButton = event.target.closest("[data-filter]");
	if (filterButton) {
		state.blueprintFilter = filterButton.dataset.filter;
		$$("[data-filter]").forEach((button) => button.classList.toggle("active", button === filterButton));
		renderBlueprints();
	}

	const rowButton = event.target.closest("[data-row-action]");
	if (rowButton) handleRowAction(rowButton.dataset.rowAction, rowButton.dataset.row);
});

$("#blueprintSearch").addEventListener("input", renderBlueprints);

["wpVersion", "phpVersion", "language", "olderVersions", "networkAccess", "multisite"].forEach((id) => {
	$(`#${id}`).addEventListener("change", () => {
		activity(`Runtime setting changed: ${id}. Temporary sites still require destructive reset; stored sites use Save & Reload.`);
	});
});

renderBlueprints();
updateLibraryCount();
