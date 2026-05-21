const detailButtons = document.querySelectorAll("[data-detail]");
const panels = document.querySelectorAll(".drawer-panel");
const cards = document.querySelectorAll(".tool-card");

function showDetail(name) {
	panels.forEach((panel) => {
		panel.classList.toggle("active", panel.dataset.panel === name);
	});

	cards.forEach((card) => {
		card.classList.toggle("active", card.dataset.detail === name);
	});
}

detailButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const detail = button.dataset.detail;
		if (!detail) {
			return;
		}

		showDetail(detail);
	});
});
