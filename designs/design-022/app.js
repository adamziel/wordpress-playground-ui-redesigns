(function () {
  const tabButtons = Array.from(document.querySelectorAll("[data-tab]"));
  const workspaces = Array.from(document.querySelectorAll(".workspace"));
  const toolButtons = Array.from(document.querySelectorAll("[data-tool]"));
  const toolPanels = Array.from(document.querySelectorAll(".tool-panel"));
  const siteRows = Array.from(document.querySelectorAll(".site-row[data-site]"));
  const title = document.getElementById("selected-site-title");

  function openTab(id) {
    tabButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.tab === id);
    });
    workspaces.forEach((panel) => {
      panel.classList.toggle("active", panel.id === id);
    });
  }

  function openTool(id) {
    toolButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.tool === id);
    });
    toolPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === id + "-tool");
    });
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => openTab(button.dataset.tab));
  });

  document.querySelectorAll("[data-open-tab]").forEach((button) => {
    button.addEventListener("click", () => openTab(button.dataset.openTab));
  });

  toolButtons.forEach((button) => {
    button.addEventListener("click", () => openTool(button.dataset.tool));
  });

  siteRows.forEach((row) => {
    row.addEventListener("click", () => {
      siteRows.forEach((candidate) => candidate.classList.remove("selected"));
      row.classList.add("selected");
      if (title) {
        title.textContent = row.dataset.site;
      }
    });
  });
})();
