(function () {
  const panels = Array.from(document.querySelectorAll(".drawer-panel"));
  const panelButtons = document.querySelectorAll("[data-open-panel]");
  const jumpButtons = document.querySelectorAll("[data-jump]");
  const destinations = document.querySelectorAll("[data-destination]");
  const tabs = document.querySelectorAll("[data-tab]");
  const filters = document.querySelectorAll("[data-filter]");
  const cards = Array.from(document.querySelectorAll(".blueprint-card"));
  const search = document.getElementById("blueprint-search");

  function openPanel(name) {
    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.panel === name);
    });
  }

  panelButtons.forEach((button) => {
    button.addEventListener("click", () => openPanel(button.dataset.openPanel));
  });

  jumpButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.jump);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  destinations.forEach((button) => {
    button.addEventListener("click", () => {
      destinations.forEach((destination) => destination.classList.remove("selected"));
      button.classList.add("selected");
      const label = document.getElementById("save-progress-label");
      label.textContent =
        button.dataset.destination === "directory"
          ? "Ready to request local folder access and copy 3,751 files"
          : "Ready to save 3,751 files in this browser";
    });
  });

  const saveButton = document.getElementById("simulate-save");
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      const label = document.getElementById("save-progress-label");
      const percent = document.getElementById("save-progress-percent");
      const bar = document.getElementById("save-progress-bar");
      const result = document.getElementById("save-result");
      const row = document.getElementById("saved-result-row");
      const steps = [
        ["Saving 842 / 3,751 files", "22%"],
        ["Saving 1,904 / 3,751 files", "51%"],
        ["Saving 3,028 / 3,751 files", "81%"],
        ["Saved 3,751 / 3,751 files", "100%"]
      ];
      let index = 0;
      result.classList.add("hidden");
      saveButton.disabled = true;
      const timer = window.setInterval(() => {
        label.textContent = steps[index][0];
        percent.textContent = steps[index][1];
        bar.style.width = steps[index][1];
        index += 1;
        if (index === steps.length) {
          window.clearInterval(timer);
          result.classList.remove("hidden");
          row.classList.add("selected");
          saveButton.disabled = false;
        }
      }, 450);
    });
  }

  tabs.forEach((button) => {
    button.addEventListener("click", () => {
      tabs.forEach((tab) => tab.classList.remove("active"));
      button.classList.add("active");
      document.querySelectorAll(".tab-panel").forEach((panel) => {
        panel.classList.toggle("active", panel.id === button.dataset.tab);
      });
    });
  });

  function applyBlueprintFilter() {
    const active = document.querySelector(".filter.active")?.dataset.filter || "all";
    const term = (search?.value || "").trim().toLowerCase();
    cards.forEach((card) => {
      const text = `${card.dataset.name} ${card.dataset.tags} ${card.textContent}`.toLowerCase();
      const categoryMatch = active === "all" || (card.dataset.tags || "").includes(active);
      const textMatch = !term || text.includes(term);
      card.hidden = !(categoryMatch && textMatch);
    });
  }

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filters.forEach((filter) => filter.classList.remove("active"));
      button.classList.add("active");
      applyBlueprintFilter();
    });
  });

  if (search) {
    search.addEventListener("input", applyBlueprintFilter);
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      cards.forEach((item) => item.classList.remove("selected"));
      card.classList.add("selected");
      document.getElementById("selected-blueprint-title").textContent = card.dataset.name;
      document.getElementById("selected-blueprint-desc").textContent =
        card.querySelector("small")?.textContent || "";
    });
  });
})();
