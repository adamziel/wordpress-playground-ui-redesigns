const titles = {
  launch: "Launch source",
  save: "Save destination",
  manage: "Saved management",
  site: "Site Manager",
  files: "File browser",
  blueprints: "Blueprint catalog",
  data: "Database",
  logs: "Logs"
};

const commandButtons = document.querySelectorAll("[data-panel]");
const panels = document.querySelectorAll("[data-panel-view]");
const drawerTitle = document.querySelector("#drawerTitle");
const shellState = document.querySelector("#shellState");
const runLabel = document.querySelector("#runLabel");

function openPanel(name) {
  commandButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.panel === name && button.classList.contains("cmd"));
  });
  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panelView === name);
  });
  drawerTitle.textContent = titles[name] || "Command";
}

commandButtons.forEach((button) => {
  button.addEventListener("click", () => openPanel(button.dataset.panel));
});

document.querySelectorAll(".destination").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".destination").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const local = button.dataset.destination === "local";
    document.querySelector("#browserSave").classList.toggle("hidden", local);
    document.querySelector("#localSave").classList.toggle("hidden", !local);
  });
});

document.querySelector("#confirmSave").addEventListener("click", () => {
  shellState.textContent = "Saved";
  shellState.classList.remove("unsaved");
  shellState.classList.add("saved");
  runLabel.textContent = "Saved Playground / PHP 8.3 / WP latest";
});

document.addEventListener("keydown", (event) => {
  if (event.target.matches("input, select")) return;
  const key = event.key.toLowerCase();
  const map = { l: "launch", s: "save", m: "manage", i: "site", f: "files", b: "blueprints", d: "data", g: "logs" };
  if (map[key]) openPanel(map[key]);
});
