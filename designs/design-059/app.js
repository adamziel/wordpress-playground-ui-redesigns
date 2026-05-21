const app = document.querySelector(".app");
const tabButtons = document.querySelectorAll("[data-tab-target]");
const panels = document.querySelectorAll(".tab-panel");
const menuButtons = document.querySelectorAll("[data-menu]");
const menus = document.querySelectorAll(".menu-popover");

function setTab(tab) {
  app.dataset.activeTab = tab;
  panels.forEach((panel) => panel.classList.toggle("active", panel.id === tab));
  document.querySelectorAll(".workspace-tabs [data-tab-target]").forEach((button) => {
    button.classList.toggle("active", button.dataset.tabTarget === tab);
  });
}

function setMenu(menu) {
  menus.forEach((panel) => {
    const active = panel.id === `menu-${menu}`;
    panel.hidden = !active;
    panel.classList.toggle("is-open", active);
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setTab(button.dataset.tabTarget);
    const panel = document.getElementById(button.dataset.tabTarget);
    if (panel) panel.scrollIntoView({ block: "start" });
  });
});

menuButtons.forEach((button) => {
  button.addEventListener("click", () => setMenu(button.dataset.menu));
});

document.addEventListener("keydown", (event) => {
  if (["INPUT", "SELECT", "TEXTAREA"].includes(event.target.tagName)) return;

  if (event.metaKey && event.key.toLowerCase() === "s") {
    event.preventDefault();
    setMenu("save");
  }

  if (!event.metaKey && !event.ctrlKey && !event.altKey) {
    const keyMap = {
      n: "new",
      i: "import",
      e: "export",
      ",": "runtime",
      l: "library",
      m: "manager",
      "1": "browser",
      "2": "library",
      "3": "manager",
      "4": "files",
      "5": "blueprint",
      "6": "data",
      "7": "logs",
      "8": "gallery",
    };
    const target = keyMap[event.key.toLowerCase()];
    if (!target) return;
    if (["new", "import", "export", "runtime"].includes(target)) setMenu(target);
    else setTab(target);
  }
});
