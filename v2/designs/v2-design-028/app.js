const state = {
	title: "Unsaved Playground",
	storage: "temporary",
	path: "/hello-from-playground/",
	activeRoute: "vanilla",
	pendingDelete: null,
	blueprintCategory: "All",
	selectedBlueprint: "Art Gallery",
	localFolder: "",
};

const routeContracts = {
	vanilla: {
		label: "Vanilla WordPress",
		copy: "Starts a fresh temporary Playground immediately with latest WordPress and PHP 8.3.",
		input: "",
		placeholder: "",
		result: "Ready to start a fresh Vanilla WordPress runtime.",
	},
	"wordpress-pr": {
		label: "WordPress PR",
		copy: "Preview a WordPress core pull request. Accepts a PR number or full GitHub pull request URL.",
		input: "PR number or URL",
		placeholder: "https://github.com/WordPress/wordpress-develop/pull/6200",
		result: "Enter a WordPress PR number or URL before previewing.",
	},
	"gutenberg-pr": {
		label: "Gutenberg PR or branch",
		copy: "Preview Gutenberg work from a PR number, pull request URL, or branch name.",
		input: "PR, URL, or branch",
		placeholder: "trunk or 61000",
		result: "Enter a Gutenberg PR, URL, or branch name before previewing.",
	},
	github: {
		label: "From GitHub",
		copy: "Import plugins, themes, or wp-content directories from public GitHub repositories after connecting an account. The access token is not stored after refresh.",
		input: "Repository URL",
		placeholder: "https://github.com/example/plugin",
		result: "GitHub account connection required before import.",
	},
	"blueprint-url": {
		label: "Blueprint URL",
		copy: "Run a public Blueprint URL against a Playground after validating the JSON contract.",
		input: "Blueprint URL",
		placeholder: "https://example.com/blueprint.json",
		result: "Enter a public Blueprint URL to validate and run.",
	},
	zip: {
		label: "Import .zip",
		copy: "Open the native file chooser, validate the archive, then replace current files and database after confirmation.",
		input: "Selected archive",
		placeholder: "plugin-demo.zip",
		result: "No ZIP selected. Import will require replacement confirmation.",
	},
};

const blueprints = [
	{ name: "Art Gallery", tags: ["Featured", "Website", "Personal"], desc: "An art gallery created with the Vueo theme." },
	{ name: "Coffee Shop", tags: ["Featured", "WooCommerce", "Website"], desc: "A stylish WooCommerce coffee shop storefront with products and content." },
	{ name: "Feed Reader with the Friends Plugin", tags: ["Featured", "Content"], desc: "Read feeds from the web in Playground using the Friends plugin." },
	{ name: "Gaming News", tags: ["Featured", "News", "Website"], desc: "A gaming news site created with the Spiel theme." },
	{ name: "Non-profit Organization", tags: ["Featured", "Website"], desc: "A non-profit organization site created with the Koinonia theme." },
	{ name: "Personal Blog", tags: ["Personal", "Content"], desc: "A personal blog created with the Substrata theme." },
	{ name: "Gutenberg Experiments", tags: ["Gutenberg", "Experiments"], desc: "A block editor experiment runtime for trying Gutenberg changes." },
	{ name: "Woo Store Starter", tags: ["WooCommerce", "Website"], desc: "A compact store starter with WooCommerce ready to inspect." },
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function logEvent(message) {
	const item = document.createElement("li");
	item.textContent = message;
	$("#eventLog").prepend(item);
}

function setShell({ title, storage, path, notice, previewState } = {}) {
	if (title) {
		state.title = title;
		$("#shellTitle").textContent = title;
	}
	if (storage) {
		state.storage = storage;
		const badge = $("#storageBadge");
		badge.className = `status-badge ${storage === "temporary" ? "warning" : "success"}`;
		badge.textContent = storage === "local" ? "Local directory" : storage === "browser" ? "Browser saved" : "Temporary";
		document.querySelector(".app-shell").dataset.storage = storage;
	}
	if (path) {
		state.path = path;
		$("#pathInput").value = path;
		$("#previewPath").textContent = path;
	}
	if (notice) $("#previewNotice").textContent = notice;
	if (previewState) $("#previewState").textContent = previewState;

	const subtitle = {
		temporary: "Temporary runtime - changes are lost on refresh",
		browser: "Saved in this browser - available from Saved Playgrounds",
		local: `Local directory - ${state.localFolder || "folder permission granted"}`,
	}[state.storage];
	$("#shellSubtitle").textContent = subtitle;

	const resetLabel = state.storage === "temporary" ? "Apply Settings & Reset" : "Save & Reload";
	$("#resetVerb").textContent = resetLabel;
	$("#storedBehavior").textContent =
		state.storage === "temporary"
			? "Temporary Playgrounds reset when runtime settings are applied."
			: state.storage === "local"
				? "Local-directory Playgrounds reload from the chosen folder and may ask to reconnect after browser refresh."
				: "Browser-saved Playgrounds keep identity and use Save & Reload for runtime changes.";
	$("#resetCopy").textContent =
		state.storage === "temporary"
			? "This destructive reset replaces the current WordPress files and SQLite database."
			: "This saves the runtime settings, reloads WordPress, and preserves the stored Playground identity.";
	$("#runtimeConsequence strong").textContent = state.storage === "temporary" ? "Reset consequence" : "Reload consequence";
	$("#runtimeConsequence span").textContent =
		state.storage === "temporary"
			? "Applying these settings resets this temporary Playground and replaces the current files and database."
			: state.storage === "local"
				? "Save & Reload writes settings to the selected local directory. After browser refresh, reconnect the folder before editing."
				: "Save & Reload keeps the browser-saved identity and reloads the stored Playground.";
}

function updateRuntimeSnapshot() {
	const parts = [
		$("#wpVersion").value,
		$("#phpVersion").value,
		$("#language").value,
		$("#networkAccess").checked ? "network on" : "network off",
		$("#multisite").checked ? "multisite on" : "multisite off",
	];
	$("#runtimeSnapshot").textContent = parts.join(", ");
	$("#runtimeBadge").textContent = `${$("#wpVersion").value} / ${$("#phpVersion").value}`;
}

function setActiveSavedRow(rowKey) {
	$$(".saved-row").forEach((row) => row.classList.toggle("active", row.dataset.row === rowKey));
}

function insertOrUpdateLocalRow() {
	const existing = $('[data-row="local"]');
	const html = `
		<div>
			<strong>${$("#playgroundName").value}</strong>
			<span>Local directory - ${state.localFolder}</span>
		</div>
		<div class="row-actions">
			<button data-action="openRow" data-row="local">Open</button>
			<button data-action="renameRow" data-row="local">Rename</button>
			<button data-action="deleteRow" data-row="local">Delete</button>
		</div>`;
	if (existing) {
		existing.innerHTML = html;
	} else {
		const row = document.createElement("div");
		row.className = "saved-row local active";
		row.dataset.row = "local";
		row.innerHTML = html;
		$("#savedList").append(row);
	}
	setActiveSavedRow("local");
}

function saveInBrowser() {
	$("#saveMode").textContent = "Saving in browser...";
	let progress = 0;
	const total = 3751;
	const timer = setInterval(() => {
		progress += 520;
		const done = Math.min(progress, total);
		$("#saveMode").textContent = `Saving ${done} / ${total} files`;
		if (done === total) {
			clearInterval(timer);
			state.localFolder = "";
			setShell({
				title: $("#playgroundName").value,
				storage: "browser",
				path: "/research-browser-playground/",
				notice: "Saved in this browser. This Playground now has a browser-backed URL slug.",
				previewState: "Browser save complete",
			});
			$("#saveMode").textContent = "Browser saved";
			const row = document.createElement("div");
			row.className = "saved-row active";
			row.dataset.row = "browser-new";
			row.innerHTML = `
				<div>
					<strong>${$("#playgroundName").value}</strong>
					<span>Browser saved - created May 21, 2026</span>
				</div>
				<div class="row-actions">
					<button data-action="openRow" data-row="browser-new">Open</button>
					<button data-action="renameRow" data-row="browser-new">Rename</button>
					<button data-action="deleteRow" data-row="browser-new">Delete</button>
				</div>`;
			$("#savedList").prepend(row);
			setActiveSavedRow("browser-new");
			logEvent("Browser save completed; temporary row transformed into a saved browser identity.");
		}
	}, 120);
}

function startLocalSave() {
	$("#localSaveFlow").hidden = false;
	$("#folderStep").className = "flow-step active";
	$("#permissionStep").className = "flow-step";
	$("#copyStep").className = "flow-step";
	$("#resultStep").className = "flow-step";
	$("#folderState").textContent = "No folder selected.";
	$("#permissionState").textContent = "Waiting for a folder grant.";
	$("#copyState").textContent = "Progress will appear here.";
	$("#saveProgress").style.width = "0%";
	$("#localResult").textContent = "Local directory identity not established.";
	$("#saveMode").textContent = "Local folder required";
	logEvent("Local-directory save opened; waiting for folder picker permission.");
}

function chooseFolder() {
	state.localFolder = "~/Sites/research-browser-playground";
	$("#folderStep").className = "flow-step done";
	$("#permissionStep").className = "flow-step done";
	$("#copyStep").className = "flow-step active";
	$("#folderState").textContent = `Selected ${state.localFolder}`;
	$("#permissionState").textContent = "Read/write permission granted for this session.";
	$("#saveMode").textContent = "Folder permission granted";
	logEvent(`Folder permission granted for ${state.localFolder}.`);

	let copied = 0;
	const total = 3751;
	const timer = setInterval(() => {
		copied += 430;
		const done = Math.min(copied, total);
		const percent = Math.round((done / total) * 100);
		$("#copyState").textContent = `Saving ${done} / ${total} files`;
		$("#saveProgress").style.width = `${percent}%`;
		if (done === total) {
			clearInterval(timer);
			$("#copyStep").className = "flow-step done";
			$("#resultStep").className = "flow-step done";
			$("#localResult").textContent = `Saved as local directory at ${state.localFolder}. Reconnect folder after browser refresh before edits or reload.`;
			$("#saveMode").textContent = "Local directory saved";
			insertOrUpdateLocalRow();
			setShell({
				title: $("#playgroundName").value,
				storage: "local",
				path: "/research-browser-playground/",
				notice: "Local directory sync active. Reloads preserve this folder identity after reconnect.",
				previewState: "Local save complete",
			});
			logEvent("Local save completed; shell title, storage badge, saved row, preview notice, and reload consequence updated.");
			addPlaygroundLog("Local directory save completed with read/write permission.");
		}
	}, 130);
}

function denyFolder() {
	$("#localSaveFlow").hidden = false;
	$("#folderStep").className = "flow-step error";
	$("#permissionStep").className = "flow-step error";
	$("#folderState").textContent = "Folder picker closed without a selection.";
	$("#permissionState").textContent = "Permission denied. Playground remains temporary.";
	$("#saveMode").textContent = "Local permission denied";
	logEvent("Local-directory save canceled because folder permission was denied.");
}

function setRoute(routeKey) {
	state.activeRoute = routeKey;
	$$(".route").forEach((button) => button.classList.toggle("active", button.dataset.route === routeKey));
	const contract = routeContracts[routeKey];
	$("#routeLabel").textContent = contract.label;
	$("#routeCopy").textContent = contract.copy;
	$("#routeResult").textContent = contract.result;
	const wrap = $("#routeInputWrap");
	if (contract.input) {
		wrap.hidden = false;
		$("#routeInputLabel").textContent = contract.input;
		$("#routeInput").placeholder = contract.placeholder;
		$("#routeInput").value = "";
	} else {
		wrap.hidden = true;
	}
}

function executeRoute() {
	const contract = routeContracts[state.activeRoute];
	const value = $("#routeInput").value.trim();
	if (contract.input && !value) {
		$("#routeResult").textContent = contract.result;
		return;
	}
	if (state.activeRoute === "github") {
		$("#routeResult").textContent = "GitHub connected for this session; importing wp-content directory. Token will not be stored after refresh.";
		logEvent("GitHub import authenticated and queued for selected repository.");
	} else if (state.activeRoute === "zip") {
		$("#routeResult").textContent = "Archive selected, validated, and waiting for replacement confirmation before import.";
		logEvent("ZIP import selected; replacement warning displayed for current files and database.");
	} else {
		const path = state.activeRoute === "vanilla" ? "/hello-from-playground/" : "/wp-admin/";
		setShell({
			title: contract.label,
			storage: "temporary",
			path,
			notice: `${contract.label} started as a temporary Playground. Save before refresh to keep it.`,
			previewState: "Route started",
		});
		$("#routeResult").textContent = `${contract.label} started. Active shell identity and path updated.`;
		logEvent(`${contract.label} route started and active preview moved to ${path}.`);
	}
}

function switchTab(tab) {
	$$(".tab").forEach((button) => button.classList.toggle("active", button.dataset.tab === tab));
	$$(".tab-body").forEach((body) => body.classList.toggle("active", body.id === `tab-${tab}`));
}

function renderBlueprints() {
	const query = $("#blueprintSearch").value.toLowerCase();
	const list = $("#blueprintList");
	list.innerHTML = "";
	const filtered = blueprints.filter((item) => {
		const categoryMatch = state.blueprintCategory === "All" || item.tags.includes(state.blueprintCategory);
		const textMatch = `${item.name} ${item.desc} ${item.tags.join(" ")}`.toLowerCase().includes(query);
		return categoryMatch && textMatch;
	});
	filtered.forEach((item) => {
		const button = document.createElement("button");
		button.className = `blueprint-item ${item.name === state.selectedBlueprint ? "active" : ""}`;
		button.dataset.blueprint = item.name;
		button.innerHTML = `<strong>${item.name}</strong><span>${item.desc}</span><span>${item.tags.join(" / ")}</span>`;
		list.append(button);
	});
	if (!filtered.length) {
		list.innerHTML = '<p class="result-line">No entries in this representative subset match the current filter.</p>';
	}
}

function selectBlueprint(name) {
	const item = blueprints.find((entry) => entry.name === name);
	if (!item) return;
	state.selectedBlueprint = name;
	$("#selectedBlueprint").textContent = item.name;
	$("#blueprintDescription").textContent = item.desc;
	$("#blueprintUrl").value = `https://playground.wordpress.net/blueprints/${item.name.toLowerCase().replaceAll(" ", "-")}.json`;
	$("#blueprintResult").textContent = "JSON valid. Running will replace the current site content.";
	renderBlueprints();
}

function addPlaygroundLog(message) {
	const list = $("#playgroundLogs");
	if (list.textContent.includes("No problems")) list.innerHTML = "";
	const item = document.createElement("li");
	item.textContent = message;
	list.prepend(item);
}

function addPhpLog(message) {
	const list = $("#phpLogs");
	const item = document.createElement("li");
	item.textContent = message;
	list.prepend(item);
}

function downloadDatabase() {
	$("#databaseResult").textContent = "Preparing database.sqlite from /wordpress/wp-content/database/.ht.sqlite...";
	logEvent("Database download started for SQLite-backed database.");
	let percent = 0;
	const timer = setInterval(() => {
		percent += 25;
		$("#databaseResult").textContent = `Downloading database.sqlite - ${percent}%`;
		if (percent >= 100) {
			clearInterval(timer);
			$("#databaseResult").textContent = "database.sqlite downloaded successfully. Transfer history and logs updated.";
			$("#dbSize").textContent = "456 KB";
			logEvent("database.sqlite downloaded from active Playground.");
			addPlaygroundLog("database.sqlite download completed from SQLite-backed database.");
			$("#previewState").textContent = "Database downloaded";
		}
	}, 170);
}

function editFile() {
	$("#fileState").textContent = "Dirty";
	$("#fileState").style.background = "#fff2a8";
	$("#codeEditor code").textContent += "\n// Runtime control room draft edit";
	logEvent(`${$("#selectedFile").textContent} marked dirty in file editor.`);
}

function saveFile() {
	if ($("#fileState").textContent !== "Dirty") {
		$("#fileState").textContent = "Clean";
		return;
	}
	$("#fileState").textContent = "Saving...";
	setTimeout(() => {
		$("#fileState").textContent = "Saved";
		$("#fileState").style.background = "#e7f8ef";
		logEvent(`${$("#selectedFile").textContent} saved to the active Playground filesystem.`);
		addPhpLog("wp-config.php saved; no syntax errors detected.");
		$("#previewState").textContent = "File saved";
	}, 450);
}

function requestReset() {
	const saved = state.storage !== "temporary";
	$("#resetModalCopy").textContent = saved
		? "This saves runtime settings and reloads the stored Playground identity. Local directories may require reconnect after browser refresh."
		: "This resets the temporary Playground. Files, database content, and the current preview are replaced.";
	$("#resetModal").hidden = false;
}

function confirmReset() {
	$("#resetModal").hidden = true;
	const saved = state.storage !== "temporary";
	$("#previewState").textContent = saved ? "Saved and reloaded" : "Reset complete";
	$("#previewNotice").textContent = saved
		? "Runtime settings saved and WordPress reloaded without changing storage identity."
		: "Runtime reset complete. This is a fresh temporary Playground.";
	logEvent(saved ? "Runtime settings saved and stored Playground reloaded." : "Destructive runtime reset completed for temporary Playground.");
}

function deleteRow(rowKey) {
	state.pendingDelete = rowKey;
	$("#deleteConfirm").hidden = false;
	const active = $(`.saved-row[data-row="${rowKey}"]`)?.classList.contains("active");
	$("#deleteCopy").textContent = active
		? "This deletes the active saved identity. The shell will fall back to an unsaved Playground."
		: "This removes the saved row from this browser or local directory list.";
}

function confirmDelete() {
	const rowKey = state.pendingDelete;
	const row = $(`.saved-row[data-row="${rowKey}"]`);
	const wasActive = row?.classList.contains("active");
	if (row) row.remove();
	$("#deleteConfirm").hidden = true;
	if (wasActive) {
		setShell({
			title: "Unsaved Playground",
			storage: "temporary",
			path: "/hello-from-playground/",
			notice: "Deleted saved identity. The active runtime is now temporary again.",
			previewState: "Fallback runtime",
		});
		setActiveSavedRow("unsaved");
	}
	logEvent(`Saved Playground row deleted${wasActive ? "; active shell fell back to temporary state" : ""}.`);
	state.pendingDelete = null;
}

document.addEventListener("click", (event) => {
	const target = event.target.closest("button");
	if (!target) return;

	if (target.dataset.route) setRoute(target.dataset.route);
	if (target.dataset.tab) switchTab(target.dataset.tab);
	if (target.dataset.category) {
		state.blueprintCategory = target.dataset.category;
		$$(".chip").forEach((chip) => chip.classList.toggle("active", chip.dataset.category === state.blueprintCategory));
		renderBlueprints();
	}
	if (target.dataset.blueprint) selectBlueprint(target.dataset.blueprint);

	const action = target.dataset.action;
	if (!action) return;

	const actions = {
		refresh: () => {
			$("#previewState").textContent = "Refreshed";
			logEvent(`Refreshed active WordPress path ${state.path}.`);
		},
		goPath: () => {
			setShell({ path: $("#pathInput").value, previewState: "Path opened" });
			logEvent(`Opened WordPress path ${$("#pathInput").value}.`);
		},
		homepage: () => setShell({ path: "/", previewState: "Homepage opened" }),
		wpAdmin: () => setShell({ path: "/wp-admin/", previewState: "WP Admin opened" }),
		openSave: () => $("#saveCard").scrollIntoView({ behavior: "smooth", block: "start" }),
		openManager: () => $("#managerPanel").scrollIntoView({ behavior: "smooth", block: "start" }),
		olderToggle: () => {
			$("#olderVersions").checked = !$("#olderVersions").checked;
			updateRuntimeSnapshot();
			logEvent($("#olderVersions").checked ? "Older WordPress versions included in selector." : "Older WordPress versions hidden from selector.");
		},
		requestReset,
		cancelReset: () => ($("#resetModal").hidden = true),
		confirmReset,
		saveBrowser: saveInBrowser,
		startLocalSave,
		chooseFolder,
		denyFolder,
		executeRoute,
		newFile: () => {
			$("#selectedFile").textContent = "/wordpress/wp-content/mu-plugins/runtime-note.php";
			$("#fileState").textContent = "New unsaved file";
			logEvent("New file created in file browser draft state.");
		},
		newFolder: () => logEvent("New folder created at /wordpress/wp-content/uploads/runtime-assets."),
		uploadFile: () => logEvent("Upload completed for theme-overrides.css."),
		browseFiles: () => logEvent("Native file browser opened for active Playground filesystem."),
		editFile,
		saveFile,
		copyBlueprint: () => {
			$("#blueprintResult").textContent = "Blueprint link copied for the selected bundle.";
			logEvent("Blueprint bundle link copied.");
		},
		downloadBlueprint: () => {
			$("#blueprintResult").textContent = "Blueprint bundle downloaded.";
			logEvent("Blueprint bundle downloaded.");
		},
		runBlueprint: () => {
			$("#blueprintResult").textContent = "Validated, confirmed replacement, and running Blueprint...";
			setTimeout(() => {
				$("#blueprintResult").textContent = `${state.selectedBlueprint} Blueprint applied. Preview and transfer history updated.`;
				setShell({
					title: `${state.selectedBlueprint} Playground`,
					storage: "temporary",
					path: "/",
					notice: `${state.selectedBlueprint} content replaced the current temporary site.`,
					previewState: "Blueprint applied",
				});
				logEvent(`${state.selectedBlueprint} Blueprint validated and applied to active Playground.`);
			}, 600);
		},
		downloadDatabase,
		openAdminer: () => {
			$("#databaseResult").textContent = "Adminer opened in a new tool window for the active SQLite-backed database.";
			logEvent("Adminer opened for active database.");
		},
		openPhpMyAdmin: () => {
			$("#databaseResult").textContent = "phpMyAdmin opened for the active SQLite-backed database.";
			logEvent("phpMyAdmin opened for active database.");
		},
		exportGithub: () => logEvent("Export to GitHub queued; account connection required before repository selection."),
		downloadZip: () => logEvent("Active Playground ZIP bundle generated for download."),
		openRow: () => {
			const row = target.closest(".saved-row");
			if (!row) return;
			setActiveSavedRow(row.dataset.row);
			const isLocal = row.dataset.row === "local";
			const name = row.querySelector("strong").textContent;
			setShell({
				title: name,
				storage: isLocal ? "local" : row.dataset.row === "unsaved" ? "temporary" : "browser",
				path: isLocal ? "/research-browser-playground/" : "/hello-from-playground/",
				notice: `${name} opened from ${isLocal ? "local directory" : "saved list"}.`,
				previewState: "Playground opened",
			});
			logEvent(`${name} opened from saved management list.`);
		},
		manageRow: () => $("#managerPanel").scrollIntoView({ behavior: "smooth", block: "start" }),
		renameRow: () => {
			const row = target.closest(".saved-row");
			const strong = row?.querySelector("strong");
			if (!strong) return;
			strong.textContent = `${strong.textContent} Renamed`;
			if (row.classList.contains("active")) setShell({ title: strong.textContent, previewState: "Renamed" });
			logEvent("Saved Playground renamed; row and active shell title updated when selected.");
		},
		deleteRow: () => deleteRow(target.dataset.row),
		cancelDelete: () => {
			$("#deleteConfirm").hidden = true;
			state.pendingDelete = null;
			logEvent("Delete canceled; saved row preserved.");
		},
		confirmDelete,
	};

	actions[action]?.();
});

document.addEventListener("change", (event) => {
	if (["wpVersion", "phpVersion", "language", "networkAccess", "multisite"].includes(event.target.id)) {
		updateRuntimeSnapshot();
		logEvent("Runtime setting changed; consequence panel updated.");
	}
});

$("#blueprintSearch").addEventListener("input", renderBlueprints);

$$(".tree-row").forEach((row) => {
	row.addEventListener("click", () => {
		$$(".tree-row").forEach((item) => item.classList.remove("active"));
		row.classList.add("active");
		$("#selectedFile").textContent = row.dataset.file;
		$("#fileState").textContent = "Clean";
		$("#fileState").style.background = "#f3f4f6";
		logEvent(`${row.dataset.file} selected in file browser.`);
	});
});

renderBlueprints();
updateRuntimeSnapshot();
