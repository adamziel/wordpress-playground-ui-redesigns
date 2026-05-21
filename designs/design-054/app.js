const cards = Array.from(document.querySelectorAll("[data-card]"));
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const searchInput = document.querySelector("[data-search]");
const modeButtons = Array.from(document.querySelectorAll("[data-mode]"));
const modePanels = Array.from(document.querySelectorAll("[data-panel]"));
const managerButtons = Array.from(document.querySelectorAll("[data-manager-tab]"));
const managerPanels = Array.from(document.querySelectorAll("[data-manager-panel]"));
const dialogLayer = document.querySelector(".dialog-layer");
const dialogContent = document.querySelector("[data-dialog-content]");
const toast = document.querySelector(".toast");

let activeFilter = "all";
let toastTimer;

const selected = {
	title: document.querySelector("[data-selected-title]"),
	subtitle: document.querySelector("[data-selected-subtitle]"),
	site: document.querySelector("[data-preview-site]"),
	kicker: document.querySelector("[data-preview-kicker]"),
	heading: document.querySelector("[data-preview-heading]"),
	code: document.querySelector("[data-code]"),
};

function showToast(message) {
	if (!toast) return;
	toast.textContent = message;
	toast.hidden = false;
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => {
		toast.hidden = true;
	}, 2600);
}

function applyFilters() {
	const query = (searchInput?.value || "").trim().toLowerCase();
	cards.forEach((card) => {
		const categories = card.dataset.category || "";
		const haystack = `${card.dataset.title} ${card.dataset.theme} ${card.dataset.tags} ${card.dataset.desc}`.toLowerCase();
		const filterMatch = activeFilter === "all" || categories.includes(activeFilter);
		const searchMatch = !query || haystack.includes(query);
		card.toggleAttribute("hidden-by-filter", !(filterMatch && searchMatch));
	});
}

function selectCard(card) {
	cards.forEach((item) => item.classList.toggle("selected", item === card));
	const title = card.dataset.title || "Blueprint";
	const theme = card.dataset.theme || "Blueprint";
	const desc = card.dataset.desc || "Selected blueprint ready to run.";
	const tags = (card.dataset.tags || "Website").split(" ");

	selected.title.textContent = title;
	selected.subtitle.textContent = theme;
	selected.site.textContent = title.replace(" with the Friends Plugin", "");
	selected.kicker.textContent = theme;
	selected.heading.textContent = desc;
	selected.code.textContent = `{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "meta": {
    "title": "${title}",
    "categories": [ "${tags.join('", "')}" ]
  },
  "login": true,
  "landingPage": "/hello-from-playground/",
  "preferredVersions": {
    "php": "8.3",
    "wp": "latest"
  }
}`;
}

function setMode(mode) {
	modeButtons.forEach((button) => {
		button.classList.toggle("active", button.dataset.mode === mode);
	});
	modePanels.forEach((panel) => {
		panel.classList.toggle("active", panel.dataset.panel === mode);
	});
}

function setManagerTab(tab) {
	managerButtons.forEach((button) => {
		button.classList.toggle("active", button.dataset.managerTab === tab);
	});
	managerPanels.forEach((panel) => {
		panel.classList.toggle("active", panel.dataset.managerPanel === tab);
	});
}

function openDialog(name) {
	const template = document.querySelector(`#dialog-${name}`);
	if (!template || !dialogLayer || !dialogContent) return;
	dialogContent.replaceChildren(template.content.cloneNode(true));
	dialogLayer.hidden = false;
	const firstInput = dialogContent.querySelector("input, select, button");
	firstInput?.focus();
}

function closeDialog() {
	if (!dialogLayer || !dialogContent) return;
	dialogLayer.hidden = true;
	dialogContent.replaceChildren();
}

filterButtons.forEach((button) => {
	button.addEventListener("click", () => {
		activeFilter = button.dataset.filter;
		filterButtons.forEach((item) => item.classList.toggle("active", item === button));
		applyFilters();
	});
});

searchInput?.addEventListener("input", applyFilters);

cards.forEach((card) => {
	card.addEventListener("click", () => selectCard(card));
});

document.addEventListener("click", (event) => {
	const dialogButton = event.target.closest("[data-dialog]");
	if (dialogButton) {
		openDialog(dialogButton.dataset.dialog);
		return;
	}

	const toastButton = event.target.closest("[data-toast]");
	if (toastButton) {
		showToast(toastButton.dataset.toast);
		return;
	}

	const modeButton = event.target.closest("[data-mode]");
	if (modeButton) {
		setMode(modeButton.dataset.mode);
		return;
	}

	const managerButton = event.target.closest("[data-manager-tab]");
	if (managerButton) {
		setManagerTab(managerButton.dataset.managerTab);
		return;
	}

	const jumpButton = event.target.closest("[data-jump]");
	if (jumpButton) {
		document.querySelector(jumpButton.dataset.jump)?.scrollIntoView({ block: "start" });
		setMode("library");
		return;
	}

	if (event.target.closest(".dialog-close") || event.target.closest("[data-close]")) {
		closeDialog();
	}
});

dialogLayer?.addEventListener("click", (event) => {
	if (event.target === dialogLayer) {
		closeDialog();
	}
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		closeDialog();
	}
});

applyFilters();
