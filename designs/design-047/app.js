const cards = document.querySelectorAll("[data-panel-link]");
const panels = document.querySelectorAll(".panel");
const title = document.querySelector("#drawer-title");
const kicker = document.querySelector("#drawer-kicker");

function activatePanel(panelName) {
	const panel = document.querySelector(`.panel[data-panel="${panelName}"]`);
	if (!panel) {
		return;
	}

	panels.forEach((item) => item.classList.remove("active"));
	panel.classList.add("active");

	document.querySelectorAll(".task-card.active").forEach((item) => item.classList.remove("active"));
	document.querySelectorAll(`[data-panel-link="${panelName}"]`).forEach((item) => {
		if (item.classList.contains("task-card")) {
			item.classList.add("active");
		}
	});

	title.textContent = panel.dataset.title || "Task details";
	kicker.textContent = panel.dataset.kicker || "Workflow lane";
}

cards.forEach((card) => {
	card.addEventListener("click", () => activatePanel(card.dataset.panelLink));
});
