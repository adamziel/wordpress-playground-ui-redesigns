const views = document.querySelectorAll(".view");
const railItems = document.querySelectorAll("[data-view]");
const viewTargets = document.querySelectorAll("[data-view-target]");
const tabs = document.querySelectorAll(".tab");
const tabPanels = document.querySelectorAll(".tab-panel");
const toast = document.querySelector(".toast");

function showView(name) {
  views.forEach((view) => view.classList.toggle("is-active", view.id === `view-${name}`));
  railItems.forEach((item) => item.classList.toggle("is-active", item.dataset.view === name));
  if (location.hash !== `#${name}`) {
    history.replaceState(null, "", `#${name}`);
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.hidden = true;
  }, 2400);
}

railItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    showView(item.dataset.view);
  });
});

viewTargets.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.viewTarget));
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    tabPanels.forEach((panel) => panel.classList.toggle("is-active", panel.id === `tab-${tab.dataset.tab}`));
  });
});

document.querySelectorAll("[data-dialog]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.querySelector(`#dialog-${button.dataset.dialog}`);
    if (dialog && typeof dialog.showModal === "function") {
      dialog.showModal();
    }
  });
});

document.querySelectorAll("[data-toast]").forEach((button) => {
  button.addEventListener("click", () => showToast(button.dataset.toast));
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((item) => item.classList.toggle("is-active", item === chip));
    showToast(`${chip.textContent} blueprints filter selected.`);
  });
});

document.querySelectorAll(".blueprint-tile, .gallery-card").forEach((card) => {
  card.addEventListener("click", () => {
    const title = card.querySelector("strong, h2")?.textContent || "Blueprint";
    showToast(`${title} blueprint selected. Playground start preview opened.`);
  });
});

const initial = location.hash.replace("#", "");
if (initial && document.querySelector(`#view-${initial}`)) {
  showView(initial);
}
