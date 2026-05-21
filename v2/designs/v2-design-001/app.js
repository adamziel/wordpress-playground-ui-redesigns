const app = document.querySelector(".app");
const shellStorage = document.getElementById("shellStorage");
const activeTitle = document.getElementById("activeTitle");
const activeIdentity = document.getElementById("activeIdentity");
const storageBadge = document.getElementById("storageBadge");
const resetBehavior = document.getElementById("resetBehavior");
const resetAction = document.getElementById("resetAction");
const pathInput = document.getElementById("pathInput");
const previewHeadline = document.getElementById("previewHeadline");
const previewDescription = document.getElementById("previewDescription");
const previewLabel = document.getElementById("previewLabel");
const previewSiteTitle = document.getElementById("previewSiteTitle");
const wpSiteName = document.getElementById("wpSiteName");
const savedList = document.getElementById("savedList");
const transferHistory = document.getElementById("transferHistory");
const historyCount = document.getElementById("historyCount");

const state = {
  command: "save",
  destination: "browser",
  storage: "temporary",
  activeName: "Unsaved Playground",
  activeIdentity: "Temporary session, not saved to browser storage",
  path: "/hello-from-playground/",
  history: [
    '<span class="badge green">Ready</span> WordPress booted at /hello-from-playground/',
    '<span class="badge amber">Temporary</span> Current Playground has not been saved',
  ],
  selectedBlueprint: "Coffee Shop",
  blueprintValid: false,
};

function setCommand(command) {
  if (command === "settings") {
    command = "manager";
    document.querySelector('[data-manager-tab="settings"]')?.click();
  }
  state.command = command;
  document.querySelectorAll("[data-command]").forEach((button) => {
    if (button.tagName === "BUTTON") {
      button.classList.toggle("is-active", button.dataset.command === command);
    }
  });
  document.querySelectorAll("[data-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === command);
  });
}

function addHistory(label, tone = "green") {
  state.history.push(`<span class="badge ${tone}">${label}</span> ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ${state.activeName}`);
  renderHistory();
}

function addHistoryText(html) {
  state.history.push(html);
  renderHistory();
}

function renderHistory() {
  transferHistory.innerHTML = state.history.map((item) => `<li>${item}</li>`).join("");
  historyCount.textContent = `${state.history.length} events`;
}

function updateIdentity() {
  app.dataset.storage = state.storage;
  shellStorage.textContent = state.storage === "temporary" ? "Unsaved Playground" : state.storage === "browser" ? "Saved Playground" : "Local Directory Playground";
  activeTitle.textContent = state.activeName;
  activeIdentity.textContent = state.activeIdentity;

  storageBadge.className = "badge";
  if (state.storage === "temporary") {
    storageBadge.classList.add("amber");
    storageBadge.textContent = "Temporary";
    resetBehavior.textContent = "Settings will reset this Playground";
    resetAction.textContent = "Apply Settings & Reset Playground";
  } else if (state.storage === "browser") {
    storageBadge.classList.add("green");
    storageBadge.textContent = "Saved in browser";
    resetBehavior.textContent = "Settings use Save & Reload";
    resetAction.textContent = "Save & Reload";
  } else {
    storageBadge.classList.add("green");
    storageBadge.textContent = "Local directory";
    resetBehavior.textContent = "Reconnect folder if permission expires";
    resetAction.textContent = "Save & Reload local folder";
  }
}

function updatePreview({ title, headline, description, label, path }) {
  if (title) {
    previewSiteTitle.textContent = title;
    wpSiteName.textContent = title;
  }
  if (headline) previewHeadline.innerHTML = headline;
  if (description) previewDescription.textContent = description;
  if (label) previewLabel.textContent = label;
  if (path) {
    state.path = path;
    pathInput.value = path;
  }
}

function markActiveRow(rowSelector) {
  document.querySelectorAll(".saved-row").forEach((row) => row.classList.remove("active"));
  const row = document.querySelector(rowSelector);
  if (row) row.classList.add("active");
}

function insertSavedRow(name, storageLabel) {
  const id = `saved-${Date.now()}`;
  const row = `
    <article class="saved-row active" data-row="${id}">
      <span class="row-logo">W</span>
      <div>
        <strong>${name}</strong>
        <small>${storageLabel}</small>
      </div>
      <span class="badge green">Current</span>
      <button class="small-button" type="button" data-action="open-saved">Open</button>
      <button class="small-button danger" type="button" data-action="ask-delete">Delete</button>
    </article>
  `;
  document.querySelectorAll(".saved-row").forEach((item) => item.classList.remove("active"));
  savedList.insertAdjacentHTML("afterbegin", row);
}

function setSaveDestination(destination) {
  state.destination = destination;
  document.querySelectorAll("[data-destination]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.destination === destination);
  });
  document.getElementById("localPicker").hidden = destination !== "local";
  document.getElementById("saveProgressDetail").textContent =
    destination === "browser" ? "Destination: browser storage" : "Destination: ~/Sites/playground-lab";
}

function startSave() {
  const name = document.getElementById("saveName").value.trim() || "Saved Playground";
  const label = document.getElementById("saveProgressLabel");
  const detail = document.getElementById("saveProgressDetail");
  const meter = document.getElementById("saveMeter");
  const steps = [
    { width: "22%", label: "Saving 842 / 3,751 files", detail: "Copying WordPress core files" },
    { width: "55%", label: "Saving 2,318 / 3,751 files", detail: "Copying wp-content and uploads" },
    { width: "82%", label: "Saving 3,028 / 3,751 files", detail: "Writing SQLite database and metadata" },
    { width: "100%", label: "Saved 3,751 / 3,751 files", detail: "Finalizing saved identity" },
  ];
  let index = 0;
  meter.style.width = "8%";
  label.textContent = "Preparing file copy";
  detail.textContent = state.destination === "browser" ? "Browser storage selected" : "Local directory permission granted";

  const timer = window.setInterval(() => {
    const step = steps[index];
    label.textContent = step.label;
    detail.textContent = step.detail;
    meter.style.width = step.width;
    index += 1;
    if (index === steps.length) {
      window.clearInterval(timer);
      finishSave(name);
    }
  }, 520);
}

function finishSave(name) {
  if (state.destination === "browser") {
    state.storage = "browser";
    state.activeName = name;
    state.activeIdentity = "Saved in this browser as /research-browser-playground/";
    state.path = "/research-browser-playground/hello-from-playground/";
    pathInput.value = state.path;
    insertSavedRow(name, "Browser storage, saved a moment ago");
    addHistoryText(`<span class="badge green">Saved</span> ${name} copied to browser storage and inserted into Saved Playgrounds`);
  } else {
    state.storage = "local";
    state.activeName = name;
    state.activeIdentity = "Backed by local folder ~/Sites/playground-lab";
    insertSavedRow(name, "Local directory, folder permission active");
    addHistoryText(`<span class="badge green">Local</span> ${name} saved to ~/Sites/playground-lab; reconnect may be required after reload`);
  }
  updateIdentity();
  document.getElementById("saveProgressLabel").textContent = "Save complete";
  document.getElementById("saveProgressDetail").textContent = state.activeIdentity;
}

function validateBlueprint() {
  state.blueprintValid = true;
  document.getElementById("blueprintValidation").className = "badge green";
  document.getElementById("blueprintValidation").textContent = "Valid JSON";
  document.getElementById("managerBlueprintState").className = "badge green";
  document.getElementById("managerBlueprintState").textContent = "Valid";
  document.getElementById("blueprintProgressLabel").textContent = "Blueprint validated";
  document.getElementById("blueprintProgressDetail").textContent = `${state.selectedBlueprint} can run after replacement confirmation.`;
  addHistoryText(`<span class="badge green">Validated</span> Blueprint JSON checked for ${state.selectedBlueprint}`);
}

function askBlueprintRun() {
  if (!state.blueprintValid) {
    validateBlueprint();
  }
  document.getElementById("replaceWarning").hidden = false;
  document.getElementById("blueprintProgressLabel").textContent = "Replacement confirmation required";
  document.getElementById("blueprintProgressDetail").textContent = "This will replace files, database content, and landing page.";
}

function runBlueprint() {
  const label = document.getElementById("blueprintProgressLabel");
  const detail = document.getElementById("blueprintProgressDetail");
  const meter = document.getElementById("blueprintMeter");
  document.getElementById("replaceWarning").hidden = true;
  const steps = [
    { width: "24%", label: "Downloading Blueprint bundle", detail: "Fetching theme, plugins, and content assets" },
    { width: "48%", label: "Replacing WordPress content", detail: "Updating files and SQLite-backed database" },
    { width: "76%", label: "Installing WooCommerce and theme", detail: "Applying Blueprint steps" },
    { width: "100%", label: "Blueprint run complete", detail: "Preview updated to Coffee Shop homepage" },
  ];
  let index = 0;
  meter.style.width = "8%";

  const timer = window.setInterval(() => {
    const step = steps[index];
    label.textContent = step.label;
    detail.textContent = step.detail;
    meter.style.width = step.width;
    index += 1;
    if (index === steps.length) {
      window.clearInterval(timer);
      updatePreview({
        title: "Coffee Shop",
        headline: "Coffee Shop <span>Storefront</span>",
        description: "The selected Blueprint replaced the starter content with a WooCommerce coffee shop, custom theme, products, and homepage.",
        label: "Blueprint result",
        path: "/",
      });
      addHistoryText('<span class="badge green">Blueprint</span> Coffee Shop replaced current content and updated the live preview');
      document.getElementById("blueprintValidation").textContent = "Run complete";
    }
  }, 560);
}

function selectBlueprint(card) {
  state.selectedBlueprint = card.dataset.blueprint;
  state.blueprintValid = false;
  document.querySelectorAll(".blueprint-card").forEach((item) => item.classList.toggle("selected", item === card));
  document.getElementById("selectedBlueprint").textContent = state.selectedBlueprint;
  document.getElementById("blueprintValidation").className = "badge amber";
  document.getElementById("blueprintValidation").textContent = "Not validated";
  document.getElementById("blueprintMeter").style.width = "0%";
  document.getElementById("blueprintProgressLabel").textContent = "Waiting for validation";
  document.getElementById("blueprintProgressDetail").textContent = "Run is blocked until the replacement warning is confirmed.";
  document.getElementById("blueprintJson").innerHTML = `<code>{
  "$schema": "https://playground.wordpress.net/blueprint-schema.json",
  "meta": { "title": "${state.selectedBlueprint}" },
  "landingPage": "/",
  "preferredVersions": { "php": "8.3", "wp": "latest" },
  "steps": [
    { "step": "installTheme" },
    { "step": "importWxr" }
  ]
}</code>`;
}

function filterBlueprints(filter) {
  document.querySelectorAll("[data-filter]").forEach((button) => button.classList.toggle("is-active", button.dataset.filter === filter));
  const query = document.getElementById("blueprintSearch").value.trim().toLowerCase();
  document.querySelectorAll(".blueprint-card").forEach((card) => {
    const matchesFilter = filter === "all" || card.dataset.tags.includes(filter);
    const matchesQuery = !query || card.textContent.toLowerCase().includes(query);
    card.hidden = !matchesFilter || !matchesQuery;
  });
}

function confirmDelete() {
  const row = document.querySelector('[data-row="plugin-review"]');
  if (row) row.remove();
  document.getElementById("deleteConfirm").hidden = true;
  addHistoryText('<span class="badge red">Deleted</span> Plugin Review Playground removed from browser storage');
}

document.addEventListener("click", (event) => {
  const commandButton = event.target.closest("[data-command]");
  if (commandButton && commandButton.dataset.command) {
    setCommand(commandButton.dataset.command);
  }

  const destination = event.target.closest("[data-destination]");
  if (destination) setSaveDestination(destination.dataset.destination);

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.action;

  if (action === "start-save") startSave();
  if (action === "cancel-save") {
    document.getElementById("saveProgressLabel").textContent = "Save canceled";
    document.getElementById("saveProgressDetail").textContent = "No files were copied.";
    document.getElementById("saveMeter").style.width = "0%";
  }
  if (action === "go-admin") {
    pathInput.value = "/wp-admin/";
    updatePreview({ label: "WP Admin route", path: "/wp-admin/" });
    addHistoryText('<span class="badge green">Path</span> Navigated live shell to /wp-admin/');
  }
  if (action === "go-home") {
    pathInput.value = "/";
    updatePreview({ label: "Homepage route", path: "/" });
  }
  if (action === "refresh") addHistoryText(`<span class="badge green">Reload</span> Refreshed ${pathInput.value}`);
  if (action === "validate-blueprint") validateBlueprint();
  if (action === "ask-blueprint-run") askBlueprintRun();
  if (action === "confirm-blueprint-run") runBlueprint();
  if (action === "cancel-blueprint-run") document.getElementById("replaceWarning").hidden = true;
  if (action === "ask-delete") document.getElementById("deleteConfirm").hidden = false;
  if (action === "cancel-delete") document.getElementById("deleteConfirm").hidden = true;
  if (action === "confirm-delete") confirmDelete();
  if (action === "rename-row") {
    const rowTitle = document.querySelector('[data-row="plugin-review"] strong');
    if (rowTitle) rowTitle.textContent = "Renamed Plugin Review";
    addHistoryText('<span class="badge green">Renamed</span> Saved row updated to Renamed Plugin Review');
  }
  if (action === "open-saved") {
    state.storage = "browser";
    state.activeName = "Plugin Review Playground";
    state.activeIdentity = "Saved in this browser as /plugin-review-playground/";
    markActiveRow('[data-row="plugin-review"]');
    updateIdentity();
    addHistoryText('<span class="badge green">Opened</span> Plugin Review Playground became the active saved site');
  }
  if (action === "save-file") {
    document.getElementById("fileState").className = "badge green";
    document.getElementById("fileState").textContent = "Saved";
    addHistoryText('<span class="badge green">File</span> /wordpress/wp-config.php saved');
  }
  if (action === "new-file") addHistoryText('<span class="badge green">File</span> Created /wordpress/wp-content/new-file.php');
  if (action === "new-folder") addHistoryText('<span class="badge green">Folder</span> Created /wordpress/wp-content/new-folder/');
  if (action === "upload-file") addHistoryText('<span class="badge green">Upload</span> Uploaded selected file into /wordpress/wp-content/uploads/');
  if (action === "browse-files") addHistoryText('<span class="badge green">Browse</span> File chooser returned wp-config.php');
  if (action === "apply-settings") {
    const text = state.storage === "temporary" ? "Temporary WordPress install reset with new settings" : "Saved Playground reloaded after settings update";
    document.getElementById("settingsResult").textContent = text;
    addHistoryText(`<span class="badge amber">Settings</span> ${text}`);
  }
  if (action === "copy-blueprint") addHistoryText('<span class="badge green">Copied</span> Blueprint link copied to clipboard');
  if (action === "download-blueprint") addHistoryText('<span class="badge green">Download</span> Blueprint bundle prepared');
  if (action === "download-db") addHistoryText('<span class="badge green">Database</span> database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite');
  if (action === "connect-github") addHistoryText('<span class="badge amber">GitHub</span> Account connection required; token will not be stored after refresh');
  if (action === "github-export") addHistoryText('<span class="badge amber">GitHub</span> Export prepared; choose repository after authentication');
  if (action === "zip-import") addHistoryText('<span class="badge amber">ZIP</span> Native file chooser opened; selected archive will require replacement confirmation');
  if (action === "download-zip") addHistoryText('<span class="badge green">ZIP</span> Playground archive generated for download');
  if (action === "launch-vanilla") {
    updatePreview({
      title: "My WordPress Website",
      headline: "Fresh <span>WordPress Playground</span>",
      description: "A clean latest WordPress install replaced the previous temporary session after confirmation.",
      label: "Fresh install",
      path: "/",
    });
    state.storage = "temporary";
    state.activeName = "Unsaved Playground";
    state.activeIdentity = "Fresh temporary session, not saved";
    updateIdentity();
    markActiveRow('[data-row="temporary"]');
    addHistoryText('<span class="badge amber">Started</span> Vanilla WordPress replaced the active temporary session');
  }
});

document.querySelectorAll("[data-manager-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.managerTab;
    document.querySelectorAll("[data-manager-tab]").forEach((item) => item.classList.toggle("is-active", item === button));
    document.querySelectorAll("[data-manager-panel]").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.managerPanel === tab);
    });
  });
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => filterBlueprints(button.dataset.filter));
});

document.getElementById("blueprintSearch").addEventListener("input", () => {
  const active = document.querySelector("[data-filter].is-active");
  filterBlueprints(active ? active.dataset.filter : "all");
});

document.querySelectorAll(".blueprint-card").forEach((card) => {
  card.addEventListener("click", () => selectBlueprint(card));
});

document.getElementById("fileCode").addEventListener("input", () => {
  document.getElementById("fileState").className = "badge amber";
  document.getElementById("fileState").textContent = "Dirty";
});

pathInput.addEventListener("change", () => {
  state.path = pathInput.value;
  addHistoryText(`<span class="badge green">Path</span> Navigated live shell to ${state.path}`);
});

renderHistory();
updateIdentity();
