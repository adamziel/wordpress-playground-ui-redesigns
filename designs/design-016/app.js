const views = document.querySelectorAll(".result-view");
const viewTabs = document.querySelectorAll("[data-view]");
const dockPanels = document.querySelectorAll(".dock-panel");
const dockTabs = document.querySelectorAll("[data-panel]");
const detailContent = document.querySelector("#detailContent");
const toast = document.querySelector(".toast");
const commandSearch = document.querySelector("#commandSearch");

const details = {
  "wordpress-pr": {
    eyebrow: "Selected command",
    title: "Preview WordPress PR",
    copy: "Open a clean WordPress build from a core pull request. Accepts a PR number or a full GitHub URL.",
    label: "PR number or URL",
    value: "58241",
    action: "Preview PR"
  },
  "gutenberg-pr": {
    eyebrow: "Selected command",
    title: "Preview Gutenberg PR or branch",
    copy: "Run a Gutenberg pull request, full URL, or named branch in a temporary Playground.",
    label: "PR number, URL, or branch",
    value: "trunk",
    action: "Preview Gutenberg"
  },
  github: {
    eyebrow: "Import",
    title: "Import from GitHub",
    copy: "Connect a GitHub account to import public plugins, themes, or wp-content directories. The access token is not stored after refresh.",
    label: "Repository URL",
    value: "https://github.com/example/plugin",
    action: "Connect GitHub"
  },
  vanilla: {
    eyebrow: "New Playground",
    title: "Start Vanilla WordPress",
    copy: "Create a fresh logged-in WordPress Playground with the current runtime settings.",
    label: "Landing path",
    value: "/hello-from-playground/",
    action: "Start Playground"
  },
  "blueprint-url": {
    eyebrow: "Blueprint",
    title: "Run Blueprint from URL",
    copy: "Paste a hosted blueprint JSON URL and run it against a new Playground.",
    label: "Blueprint URL",
    value: "https://example.com/blueprint.json",
    action: "Run Blueprint"
  },
  "zip-import": {
    eyebrow: "Import",
    title: "Import .zip Playground",
    copy: "Open the native file picker to load a local Playground bundle.",
    label: "File chooser",
    value: "No file selected",
    action: "Choose .zip"
  },
  gallery: {
    eyebrow: "Blueprint gallery",
    title: "All 43 blueprints",
    copy: "Filter starter environments by Featured, Website, Personal, Content, Themes, Gutenberg, Experiments, WooCommerce, and News.",
    label: "Search blueprints",
    value: "feed reader",
    action: "Filter Gallery"
  }
};

function setView(name) {
  views.forEach((view) => view.classList.toggle("is-active", view.id === `view-${name}`));
  viewTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === name));
}

function setPanel(name) {
  dockPanels.forEach((panel) => panel.classList.toggle("is-active", panel.id === `panel-${name}`));
  dockTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.panel === name));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function setDetail(name) {
  const detail = details[name] || details["wordpress-pr"];
  detailContent.innerHTML = `
    <p class="eyebrow">${detail.eyebrow}</p>
    <h2>${detail.title}</h2>
    <p>${detail.copy}</p>
    <label class="inline-field">
      <span>${detail.label}</span>
      <input type="text" value="${detail.value}">
    </label>
    <div class="detail-actions">
      <button class="primary" type="button" data-toast="${detail.action}: ${detail.value}">${detail.action}</button>
      <button type="button" data-toast="Command pinned to the launcher.">Pin</button>
    </div>
  `;
}

function openDialog(name) {
  const dialog = document.querySelector(`#${name}Dialog`);
  if (!dialog) {
    return;
  }
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    setView(viewButton.dataset.view);
  }

  const viewTarget = event.target.closest("[data-view-target]");
  if (viewTarget) {
    setView(viewTarget.dataset.viewTarget);
  }

  const panelButton = event.target.closest("[data-panel]");
  if (panelButton) {
    setPanel(panelButton.dataset.panel);
  }

  const panelTarget = event.target.closest("[data-panel-target]");
  if (panelTarget) {
    setPanel(panelTarget.dataset.panelTarget);
    document.querySelector(".manager-dock")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  const detailTarget = event.target.closest("[data-detail]");
  if (detailTarget) {
    document.querySelectorAll(".command-row").forEach((row) => row.classList.remove("is-selected"));
    detailTarget.classList.add("is-selected");
    setDetail(detailTarget.dataset.detail);
  }

  const chip = event.target.closest("[data-query]");
  if (chip) {
    commandSearch.value = chip.dataset.query;
    showToast(`Search updated: ${chip.dataset.query}`);
  }

  const dialogButton = event.target.closest("[data-dialog]");
  if (dialogButton) {
    openDialog(dialogButton.dataset.dialog);
  }

  const toastButton = event.target.closest("[data-toast]");
  if (toastButton) {
    showToast(toastButton.dataset.toast);
  }
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    commandSearch.focus();
    commandSearch.select();
    showToast("Command search focused.");
  }
});

document.querySelectorAll("dialog [data-dialog]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.target.closest("dialog")?.close();
  });
});

setDetail("wordpress-pr");
