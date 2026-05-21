const routes = {
	vanilla: {
		title: "Vanilla WordPress",
		copy: "Start a fresh Playground immediately, then save or export it when the demo is ready.",
		label: "",
		placeholder: "",
		action: "Start Playground",
		warning: "Starting clean replaces the temporary site in the frame.",
		input: false
	},
	wppr: {
		title: "Preview a WordPress PR",
		copy: "Launch a WordPress core pull request without leaving the Playground shell.",
		label: "PR number or URL",
		placeholder: "58642 or https://github.com/WordPress/wordpress-develop/pull/58642",
		action: "Preview PR",
		warning: "Previewing a PR starts a new temporary Playground.",
		input: true
	},
	gbpr: {
		title: "Preview a Gutenberg PR or Branch",
		copy: "Test editor work from a pull request, GitHub URL, or branch name.",
		label: "PR number, URL, or branch",
		placeholder: "trunk, 61234, or https://github.com/WordPress/gutenberg/pull/61234",
		action: "Preview Gutenberg",
		warning: "This route loads Gutenberg code into a fresh Playground.",
		input: true
	},
	github: {
		title: "Import from GitHub",
		copy: "Import public plugin, theme, or wp-content repositories after connecting a GitHub account.",
		label: "Repository path",
		placeholder: "owner/repository",
		action: "Connect GitHub",
		warning: "GitHub access is requested for import and the token is not stored after refresh.",
		input: true
	},
	blueprint: {
		title: "Run Blueprint from URL",
		copy: "Run a hosted blueprint JSON against the current Playground.",
		label: "Blueprint URL",
		placeholder: "https://example.com/blueprint.json",
		action: "Run Blueprint",
		warning: "Running a Blueprint can import content and settings over the current site.",
		input: true
	},
	zip: {
		title: "Import .zip",
		copy: "Open the native file picker and import a Playground archive.",
		label: "",
		placeholder: "",
		action: "Choose .zip file",
		warning: "Importing a zip replaces the current Playground contents.",
		input: false
	}
};

const blueprints = {
	art: {
		title: "Art Gallery",
		tags: "Website + Personal",
		description: "An art gallery created with the Vueo theme. Inspect the JSON, copy its link, download the bundle, or run it over the current site.",
		code: '{\n  "$schema": "https://playground.wordpress.net/blueprint-schema.json",\n  "meta": { "title": "Art Gallery", "categories": ["Website", "Personal"] },\n  "steps": ["installTheme", "importWxr", "setSiteOptions"]\n}'
	},
	coffee: {
		title: "Coffee Shop",
		tags: "WooCommerce + Store",
		description: "A stylish WooCommerce coffee shop storefront with custom theme, products, and content.",
		code: '{\n  "meta": { "title": "Coffee Shop", "categories": ["WooCommerce", "Store"] },\n  "steps": ["installPlugin:woocommerce", "installTheme", "importProducts"]\n}'
	},
	friends: {
		title: "Feed Reader with the Friends Plugin",
		tags: "RSS + Social web",
		description: "A Playground configured to read feeds from the web with the Friends plugin.",
		code: '{\n  "meta": { "title": "Feed Reader with the Friends Plugin" },\n  "steps": ["installPlugin:friends", "activatePlugin", "importWxr"]\n}'
	},
	gaming: {
		title: "Gaming News",
		tags: "Website + News",
		description: "A gaming news site created with the Spiel theme and demo posts.",
		code: '{\n  "meta": { "title": "Gaming News", "categories": ["Website", "News"] },\n  "steps": ["installTheme:spiel", "importWxr"]\n}'
	},
	nonprofit: {
		title: "Non-profit Organization",
		tags: "Website + Organization",
		description: "A non-profit organization site created with the Koinonia theme.",
		code: '{\n  "meta": { "title": "Non-profit Organization" },\n  "steps": ["installTheme:koinonia", "importWxr", "setSiteOptions"]\n}'
	},
	blog: {
		title: "Personal Blog",
		tags: "Website + Personal + Blog",
		description: "A personal blog created with the Substrata theme and starter content.",
		code: '{\n  "meta": { "title": "Personal Blog", "categories": ["Website", "Personal", "Blog"] },\n  "steps": ["installTheme:substrata", "importWxr"]\n}'
	}
};

const routeButtons = document.querySelectorAll("[data-route]");
const routeTitle = document.querySelector("#route-title");
const routeCopy = document.querySelector("#route-copy");
const routeLabel = document.querySelector("#route-label");
const routeInput = document.querySelector("#route-input");
const runRoute = document.querySelector("#run-route");
const routeWarning = document.querySelector("#route-warning");

routeButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const route = routes[button.dataset.route];
		routeButtons.forEach((item) => {
			item.classList.toggle("active", item === button);
			item.setAttribute("aria-selected", item === button ? "true" : "false");
		});
		routeTitle.textContent = route.title;
		routeCopy.textContent = route.copy;
		routeLabel.textContent = route.label;
		routeInput.placeholder = route.placeholder;
		runRoute.textContent = route.action;
		routeWarning.textContent = route.warning;
		routeLabel.classList.toggle("hidden", !route.input);
		routeInput.classList.toggle("hidden", !route.input);
	});
});

runRoute.addEventListener("click", () => {
	routeWarning.textContent = `${runRoute.textContent} queued. Save or export after WordPress finishes preparing.`;
});

const destinationCards = document.querySelectorAll(".destination-card");
const destinationInputs = document.querySelectorAll("input[name='save-destination']");

destinationInputs.forEach((input) => {
	input.addEventListener("change", () => {
		destinationCards.forEach((card) => {
			const cardInput = card.querySelector("input");
			card.classList.toggle("selected", cardInput.checked);
		});
	});
});

const saveAction = document.querySelector("#save-action");
const saveProgress = document.querySelector("#save-progress");
const saveOutput = document.querySelector("#save-output");
const saveStatus = document.querySelector("#save-status");
const savedName = document.querySelector("#saved-name");
const playgroundName = document.querySelector("#playground-name");

saveAction.addEventListener("click", () => {
	const destination = document.querySelector("input[name='save-destination']:checked").value;
	const target = destination === "browser" ? "browser storage" : "a local directory";
	saveStatus.textContent = "Saving";
	saveStatus.className = "status-chip info";
	saveProgress.style.width = "80%";
	saveOutput.textContent = "3028 / 3751 files";

	window.setTimeout(() => {
		saveProgress.style.width = "100%";
		saveOutput.textContent = "3751 / 3751 files";
		saveStatus.textContent = `Saved to ${target}`;
		saveStatus.className = "status-chip success";
		savedName.textContent = playgroundName.value || "Research Browser Playground";
	}, 500);
});

document.querySelector("#cancel-save").addEventListener("click", () => {
	saveProgress.style.width = "0";
	saveOutput.textContent = "0 / 3751 files";
	saveStatus.textContent = "Ready to save";
	saveStatus.className = "status-chip success";
});

const exportResult = document.querySelector("#export-result");

document.querySelector("#github-export").addEventListener("click", () => {
	exportResult.textContent = "GitHub export ready";
	exportResult.className = "status-chip success";
});

document.querySelector("#zip-download").addEventListener("click", () => {
	exportResult.textContent = "playground.zip downloaded";
	exportResult.className = "status-chip info";
});

const blueprintCards = document.querySelectorAll("[data-blueprint]");
const blueprintTitle = document.querySelector("#blueprint-detail-title");
const blueprintTags = document.querySelector("#blueprint-tags");
const blueprintDescription = document.querySelector("#blueprint-description");
const blueprintCode = document.querySelector("#blueprint-code");
const blueprintResult = document.querySelector("#blueprint-result");

blueprintCards.forEach((card) => {
	card.addEventListener("click", () => {
		const item = blueprints[card.dataset.blueprint];
		blueprintCards.forEach((entry) => entry.classList.toggle("selected", entry === card));
		blueprintTitle.textContent = item.title;
		blueprintTags.textContent = item.tags;
		blueprintDescription.textContent = item.description;
		blueprintCode.textContent = item.code;
		blueprintResult.textContent = "Running a Blueprint imports over the current Playground.";
	});
});

document.querySelector("#copy-blueprint").addEventListener("click", () => {
	blueprintResult.textContent = "Blueprint link copied for the selected catalog item.";
});

document.querySelector("#download-blueprint").addEventListener("click", () => {
	blueprintResult.textContent = "Blueprint bundle download prepared.";
});

document.querySelector("#run-blueprint").addEventListener("click", () => {
	blueprintResult.textContent = "Blueprint run queued. Current Playground content will be replaced.";
});

const renamePanel = document.querySelector("#rename-panel");
const deletePanel = document.querySelector("#delete-panel");

document.querySelector("#rename-saved").addEventListener("click", () => {
	renamePanel.hidden = !renamePanel.hidden;
	deletePanel.hidden = true;
});

document.querySelector("#delete-saved").addEventListener("click", () => {
	deletePanel.hidden = !deletePanel.hidden;
	renamePanel.hidden = true;
});

document.querySelector("#confirm-rename").addEventListener("click", () => {
	const value = document.querySelector("#rename-input").value.trim();
	if (value) {
		savedName.textContent = value;
		playgroundName.value = value;
	}
	renamePanel.hidden = true;
});

document.querySelector("#confirm-delete").addEventListener("click", () => {
	savedName.textContent = "Deleted browser copy";
	deletePanel.hidden = true;
});

document.querySelectorAll("[data-scroll-target]").forEach((button) => {
	button.addEventListener("click", () => {
		const target = document.getElementById(button.dataset.scrollTarget);
		if (target) {
			target.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	});
});
