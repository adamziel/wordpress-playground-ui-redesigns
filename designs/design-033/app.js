const panels = document.querySelectorAll(".screen");
const menuItems = document.querySelectorAll("[data-panel]");
const managerTabs = document.querySelectorAll("[data-manager-tab]");
const managerPanels = document.querySelectorAll(".manager-panel");
const backdrop = document.querySelector(".modal-backdrop");
const modalTitle = document.querySelector("#modal-title");
const modalKicker = document.querySelector("#modal-kicker");
const modalBody = document.querySelector("#modal-body");
const closeModal = document.querySelector(".close");

const modalContent = {
  save: {
    kicker: "Persistence",
    title: "Save Playground",
    body: `
      <p class="notice">Temporary Playgrounds are lost on refresh or close unless saved.</p>
      <div class="form-grid">
        <label><span>Playground name</span><input value="Plugin Compatibility Lab"></label>
        <label><span>Storage location</span><select><option>Save in this browser</option><option>Save to a local directory</option></select></label>
      </div>
      <div class="progress-block"><span>Copying files</span><strong>Saving 3028 / 3751 files</strong><div class="progress"><i style="width:81%"></i></div></div>
      <div class="button-row"><button type="button" class="close-inline">Cancel</button><button class="primary" type="button">Save</button></div>
    `
  },
  vanilla: {
    kicker: "Start new",
    title: "Vanilla WordPress",
    body: `
      <p>Start a fresh logged-in WordPress Playground with the selected runtime.</p>
      <dl class="compact-defs"><div><dt>WordPress</dt><dd>Latest</dd></div><div><dt>PHP</dt><dd>8.3</dd></div><div><dt>Admin</dt><dd>Logged in as admin</dd></div></dl>
      <div class="button-row"><button type="button" class="close-inline">Cancel</button><button class="primary" type="button">Start Playground</button></div>
    `
  },
  "wordpress-pr": {
    kicker: "Preview",
    title: "Preview a WordPress PR",
    body: `
      <label><span>PR number or URL</span><input placeholder="12345 or https://github.com/WordPress/wordpress-develop/pull/12345"></label>
      <div class="button-row"><button type="button" class="close-inline">Cancel</button><button class="primary" type="button">Preview</button></div>
    `
  },
  "gutenberg-pr": {
    kicker: "Preview",
    title: "Preview a Gutenberg PR or Branch",
    body: `
      <label><span>PR number, URL, or branch name</span><input placeholder="trunk, 60000, or pull request URL"></label>
      <div class="button-row"><button type="button" class="close-inline">Cancel</button><button class="primary" type="button">Preview</button></div>
    `
  },
  github: {
    kicker: "Import",
    title: "Import from GitHub",
    body: `
      <p class="notice">Import public plugins, themes, and wp-content directories. The access token is not stored and re-authentication is required after refresh.</p>
      <label><span>Repository after connection</span><input placeholder="owner/repository"></label>
      <div class="button-row"><button type="button" class="close-inline">Cancel</button><button class="primary" type="button">Connect GitHub account</button></div>
    `
  },
  "blueprint-url": {
    kicker: "Blueprint",
    title: "Run Blueprint from URL",
    body: `
      <label><span>Blueprint URL</span><input placeholder="https://example.com/blueprint.json"></label>
      <div class="button-row"><button type="button" class="close-inline">Cancel</button><button class="primary" type="button">Run Blueprint</button></div>
    `
  },
  zip: {
    kicker: "Import",
    title: "Import .zip",
    body: `
      <p>The current product opens the native file chooser for a local Playground bundle.</p>
      <div class="button-row"><button type="button" class="close-inline">Cancel</button><button class="primary" type="button">Choose .zip file</button></div>
    `
  }
};

function showPanel(name) {
  panels.forEach((panel) => panel.classList.toggle("active", panel.id === `panel-${name}`));
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.panel === name);
  });
}

function showManagerTab(name) {
  managerTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.managerTab === name));
  managerPanels.forEach((panel) => panel.classList.toggle("active", panel.id === `manager-${name}`));
}

function openModal(name) {
  const content = modalContent[name] || modalContent.save;
  modalKicker.textContent = content.kicker;
  modalTitle.textContent = content.title;
  modalBody.innerHTML = content.body;
  backdrop.hidden = false;
  backdrop.querySelector(".modal").focus();
}

function hideModal() {
  backdrop.hidden = true;
}

document.addEventListener("click", (event) => {
  const panelTrigger = event.target.closest("[data-panel]");
  if (panelTrigger) {
    showPanel(panelTrigger.dataset.panel);
  }

  const tabShortcut = event.target.closest("[data-tab-target]");
  if (tabShortcut) {
    showPanel("manager");
    showManagerTab(tabShortcut.dataset.tabTarget);
  }

  const modalTrigger = event.target.closest("[data-modal]");
  if (modalTrigger) {
    openModal(modalTrigger.dataset.modal);
  }

  const managerTrigger = event.target.closest("[data-manager-tab]");
  if (managerTrigger) {
    showManagerTab(managerTrigger.dataset.managerTab);
  }

  if (event.target.matches(".close-inline")) {
    hideModal();
  }
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".command-results .table-row[data-kind]").forEach((row) => {
      row.hidden = filter !== "all" && row.dataset.kind !== filter;
    });
  });
});

document.querySelector("#command-search").addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();
  document.querySelectorAll(".command-results .table-row[data-kind]").forEach((row) => {
    row.hidden = query && !row.textContent.toLowerCase().includes(query);
  });
});

closeModal.addEventListener("click", hideModal);
backdrop.addEventListener("click", (event) => {
  if (event.target === backdrop) {
    hideModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !backdrop.hidden) {
    hideModal();
  }
});
