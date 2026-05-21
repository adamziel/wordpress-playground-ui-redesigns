const projectData = {
	unsaved: {
		title: "Unsaved bug repro",
		copy: "Support case WP-2041, testing a clean site with network access enabled.",
		status: "Unsaved Playground",
		statusClass: "unsaved",
		path: "/hello-from-playground/"
	},
	research: {
		title: "Research Browser Playground",
		copy: "Saved browser-backed site for repeated plugin and theme checks.",
		status: "Saved Playground",
		statusClass: "saved",
		path: "/hello-from-playground/"
	},
	"core-pr": {
		title: "Core PR 58123",
		copy: "WordPress pull request preview with the same Site Manager tools.",
		status: "WordPress PR Preview",
		statusClass: "saved",
		path: "/wp-admin/"
	}
};

const sourceHelp = {
	"Vanilla WordPress": {
		help: "Starts immediately with WordPress latest and the current runtime defaults.",
		value: "Vanilla WordPress uses no extra input"
	},
	"WordPress PR": {
		help: "Preview a WordPress core pull request by number or URL.",
		value: "https://github.com/WordPress/wordpress-develop/pull/58123"
	},
	"Gutenberg PR or branch": {
		help: "Preview a Gutenberg pull request, GitHub URL, or branch name.",
		value: "trunk"
	},
	"From GitHub": {
		help: "Connect a GitHub account and import a public plugin, theme, or wp-content repository.",
		value: "WordPress/wordpress-playground"
	},
	"Blueprint URL": {
		help: "Run a hosted blueprint.json file in a new Playground tab.",
		value: "https://playground.wordpress.net/blueprint.json"
	},
	"Import .zip": {
		help: "Open a local Playground zip using the browser file chooser.",
		value: "Choose a .zip bundle"
	}
};

function activateById(items, id, attribute) {
	items.forEach((item) => {
		item.classList.toggle("active", item.getAttribute(attribute) === id);
	});
}

function setView(view) {
	activateById(document.querySelectorAll(".view"), view, "id");
	document.querySelectorAll("[data-view]").forEach((button) => {
		button.classList.toggle("active", button.dataset.view === view && button.classList.contains("section-tab"));
	});
}

function setTask(task) {
	activateById(document.querySelectorAll(".task-panel"), `task-${task}`, "id");
	document.querySelectorAll(".task-tab").forEach((button) => {
		button.classList.toggle("active", button.dataset.task === task);
	});
}

document.addEventListener("click", (event) => {
	const projectButton = event.target.closest(".project-tab[data-project]");
	if (projectButton && !projectButton.classList.contains("add-tab")) {
		const project = projectData[projectButton.dataset.project];
		document.querySelectorAll(".project-tab").forEach((button) => button.classList.remove("active"));
		projectButton.classList.add("active");
		document.querySelector("#project-title").textContent = project.title;
		document.querySelector(".summary-copy").textContent = project.copy;
		document.querySelector("#path-input").value = project.path;
		const status = document.querySelector(".save-status");
		status.lastChild.textContent = ` ${project.status}`;
		status.className = `save-status ${project.statusClass}`;
	}

	const viewButton = event.target.closest("[data-view]");
	if (viewButton) {
		setView(viewButton.dataset.view);
		document.querySelector(".project-shell").scrollIntoView({ behavior: "smooth", block: "start" });
	}

	const taskButton = event.target.closest("[data-task]");
	if (taskButton) {
		setTask(taskButton.dataset.task);
		document.querySelector(".task-strip").scrollIntoView({ behavior: "smooth", block: "start" });
	}

	const sourceButton = event.target.closest(".source-card[data-source]");
	if (sourceButton) {
		document.querySelectorAll(".source-card").forEach((button) => button.classList.remove("selected"));
		sourceButton.classList.add("selected");
		const source = sourceButton.dataset.source;
		document.querySelector("#start-title").textContent = source;
		document.querySelector("#source-help").textContent = sourceHelp[source].help;
		document.querySelector(".inline-form input").value = sourceHelp[source].value;
	}

	const filterButton = event.target.closest(".filter-tab[data-filter]");
	if (filterButton) {
		const filter = filterButton.dataset.filter;
		document.querySelectorAll(".filter-tab").forEach((button) => button.classList.remove("active"));
		filterButton.classList.add("active");
		document.querySelectorAll(".blueprint-card").forEach((card) => {
			const visible = filter === "all" || card.dataset.tags.includes(filter);
			card.classList.toggle("is-hidden", !visible);
		});
	}
});
