const projects = {
  scratch: {
    title: "Unsaved Scratch",
    meta: "Gutenberg branch preview. Not saved and will be lost on refresh or close.",
    state: "Unsaved Playground",
    className: "status warn"
  },
  research: {
    title: "Research Browser Playground",
    meta: "Saved in this browser a moment ago. Rename, delete, or reload from saved management.",
    state: "Saved Playground",
    className: "status ok"
  },
  acme: {
    title: "Acme QA",
    meta: "Saved to a selected local directory with network access enabled.",
    state: "Local directory",
    className: "status ok"
  },
  coffee: {
    title: "Coffee Blueprint",
    meta: "Started from the Coffee Shop catalog Blueprint and kept as a downloadable bundle.",
    state: "Blueprint bundle",
    className: "status ok"
  }
};

const projectTitle = document.querySelector("#projectTitle");
const projectMeta = document.querySelector("#projectMeta");
const saveState = document.querySelector("#saveState");

document.querySelectorAll(".project-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".project-tab").forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    const project = projects[tab.dataset.project];
    projectTitle.textContent = project.title;
    projectMeta.textContent = project.meta;
    saveState.textContent = project.state;
    saveState.className = project.className;
  });
});

document.querySelectorAll(".mode-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.panel;
    document.querySelectorAll(".mode-tab").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`#panel-${target}`).classList.add("active");
  });
});

function showDock(name) {
  const requested = name === "save" ? "save" : name === "management" ? "management" : "launch";
  document.querySelectorAll(".dock-panel").forEach((panel) => panel.classList.remove("active"));
  document.querySelector(`#dock-${requested}`).classList.add("active");
}

document.querySelectorAll("[data-panel]").forEach((control) => {
  control.addEventListener("click", () => {
    const name = control.dataset.panel;
    if (["site", "files", "blueprint", "database", "logs", "settings"].includes(name)) {
      document.querySelector(`.mode-tab[data-panel="${name}"]`)?.click();
      return;
    }
    showDock(name);
  });
});
