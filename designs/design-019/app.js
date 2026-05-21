const menuButtons = Array.from(document.querySelectorAll(".menu-button"));
const menuPanels = Array.from(document.querySelectorAll(".menu-panel"));

menuButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const target = `menu-${button.dataset.menu}`;
		menuButtons.forEach((item) => item.classList.toggle("is-active", item === button));
		menuPanels.forEach((panel) => panel.classList.toggle("is-open", panel.id === target));
	});
});

const tabs = Array.from(document.querySelectorAll(".tab"));
const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));

tabs.forEach((tab) => {
	tab.addEventListener("click", () => {
		const target = `tab-${tab.dataset.tab}`;
		tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
		tabPanels.forEach((panel) => panel.classList.toggle("is-open", panel.id === target));
	});
});
