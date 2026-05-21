const links = document.querySelectorAll("[data-panel-link]");
const panels = document.querySelectorAll("[data-panel]");
const title = document.querySelector("#panel-title");

function selectPanel(panelName) {
	const target = document.querySelector(`[data-panel="${panelName}"]`);
	if (!target) {
		return;
	}

	panels.forEach((panel) => {
		panel.classList.toggle("active", panel === target);
	});

	document.querySelectorAll(".action-card").forEach((card) => {
		card.classList.toggle("active", card.dataset.panelLink === panelName);
	});

	title.textContent = target.dataset.title || "Selected action";

	const editor = document.querySelector(".editor-pane");
	if (editor && window.matchMedia("(max-width: 1120px)").matches) {
		editor.scrollIntoView({ behavior: "smooth", block: "start" });
	}
}

links.forEach((link) => {
	link.addEventListener("click", () => selectPanel(link.dataset.panelLink));
});

document.querySelectorAll(".chip-row .chip").forEach((chip) => {
	chip.addEventListener("click", () => {
		chip.parentElement.querySelectorAll(".chip").forEach((item) => item.classList.remove("active"));
		chip.classList.add("active");
	});
});
