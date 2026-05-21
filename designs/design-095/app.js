const managerButtons = document.querySelectorAll(".manager-tabs button");
const toolPanels = document.querySelectorAll(".tool-panel");

managerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.panel;

    managerButtons.forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");

    toolPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === target);
    });
  });
});

const navLinks = document.querySelectorAll(".rail-nav a");
const sections = [...document.querySelectorAll(".screen")];

const setActiveNav = () => {
  const current = sections
    .map((section) => ({
      id: section.id,
      distance: Math.abs(section.getBoundingClientRect().top - 92),
    }))
    .sort((a, b) => a.distance - b.distance)[0];

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`);
  });
};

document.addEventListener("scroll", setActiveNav, { passive: true });
setActiveNav();
