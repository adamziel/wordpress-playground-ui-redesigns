const detailContent = {
  "wp-pr": {
    title: "Preview a WordPress PR",
    type: "Launch",
    html: `
      <dl>
        <dt>Input</dt><dd>PR number or GitHub pull request URL</dd>
        <dt>Example</dt><dd><code>61234</code></dd>
        <dt>Consequence</dt><dd>Current unsaved Playground is replaced after confirmation.</dd>
      </dl>
      <div class="actions"><button class="primary" type="button">Preview PR</button><button type="button">Cancel</button></div>`
  },
  "gb-pr": {
    title: "Preview a Gutenberg PR or branch",
    type: "Launch",
    html: `
      <dl>
        <dt>Input</dt><dd>PR number, URL, or branch name</dd>
        <dt>Example</dt><dd><code>trunk</code> or <code>https://github.com/WordPress/gutenberg/pull/61000</code></dd>
        <dt>Constraint</dt><dd>Branch previews load Gutenberg into the active WordPress runtime.</dd>
      </dl>
      <div class="actions"><button class="primary" type="button">Preview branch</button><button type="button">Cancel</button></div>`
  },
  vanilla: {
    title: "Start Vanilla WordPress",
    type: "Launch",
    html: `
      <dl>
        <dt>Input</dt><dd>None</dd>
        <dt>Runtime</dt><dd>Latest WordPress with PHP 8.3</dd>
        <dt>Result</dt><dd>Fresh temporary Playground, logged in as admin.</dd>
      </dl>
      <div class="actions"><button class="primary" type="button">Start fresh</button></div>`
  },
  github: {
    title: "Import from GitHub",
    type: "Import",
    html: `
      <dl>
        <dt>Scope</dt><dd>Public plugins, themes, or wp-content directories</dd>
        <dt>Auth</dt><dd>Connect GitHub account; access token is not stored and refresh requires re-authentication.</dd>
        <dt>Result</dt><dd>Repository files are imported into the current Playground.</dd>
      </dl>
      <div class="actions"><button class="primary" type="button">Connect GitHub</button></div>`
  },
  "blueprint-url": {
    title: "Run Blueprint from URL",
    type: "Blueprint",
    html: `
      <dl>
        <dt>Input</dt><dd>Blueprint URL</dd>
        <dt>Example</dt><dd><code>https://playground.wordpress.net/blueprint.json</code></dd>
        <dt>Consequence</dt><dd>Blueprint steps run over the selected Playground.</dd>
      </dl>
      <div class="actions"><button class="primary" type="button">Run Blueprint</button><button type="button">Inspect first</button></div>`
  },
  "import-zip": {
    title: "Import .zip",
    type: "Import",
    html: `
      <dl>
        <dt>Input</dt><dd>Local archive through native file chooser</dd>
        <dt>Constraint</dt><dd>No in-page picker is shown by Playground.</dd>
        <dt>Consequence</dt><dd>Imported files replace the current WordPress site unless saved first.</dd>
      </dl>
      <div class="actions"><button class="primary" type="button">Browse .zip</button><button class="danger" type="button">Review overwrite warning</button></div>`
  },
  "save-browser": {
    title: "Save in this browser",
    type: "Save",
    html: `
      <dl>
        <dt>Name</dt><dd>Research Browser Playground</dd>
        <dt>Progress</dt><dd>Saving 3028 / 3751 files</dd>
        <dt>Result</dt><dd>Saved Playground appears in the Library with browser storage as its destination.</dd>
      </dl>
      <div class="progress"><span style="width:81%"></span></div>
      <div class="actions"><button class="primary" type="button">Save in browser</button><button type="button">Save to local directory instead</button></div>`
  },
  local: {
    title: "Save to a local directory",
    type: "Save",
    html: `
      <dl>
        <dt>Directory</dt><dd><code>~/Sites/playground-docs-demo</code></dd>
        <dt>Permission</dt><dd>Browser asks for a directory handle before writing files.</dd>
        <dt>Result</dt><dd>Saved state is linked to local files and can be reloaded.</dd>
      </dl>
      <div class="actions"><button class="primary" type="button">Select directory</button><button type="button">Cancel</button></div>`
  },
  rename: {
    title: "Rename or delete saved Playground",
    type: "Library",
    html: `
      <dl>
        <dt>Current name</dt><dd>Research Browser Playground</dd>
        <dt>Rename</dt><dd>Inline edit updates the saved site identity.</dd>
        <dt>Delete</dt><dd>Deletion removes browser-backed files and database for this saved Playground.</dd>
      </dl>
      <div class="actions"><button class="primary" type="button">Apply rename</button><button class="danger" type="button">Delete saved site</button></div>`
  }
};

function setActiveTab(tabId) {
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === tabId);
  });
  document.querySelectorAll("[data-tab-target]").forEach((control) => {
    control.classList.toggle("active", control.dataset.tabTarget === tabId);
  });
}

function setDetail(key) {
  const detail = detailContent[key] || detailContent["wp-pr"];
  document.querySelector("#detailTitle").textContent = detail.title;
  document.querySelector("#detailType").textContent = detail.type;
  document.querySelector("#detailBody").innerHTML = detail.html;
}

document.addEventListener("click", (event) => {
  const tabTarget = event.target.closest("[data-tab-target]");
  if (tabTarget) {
    event.preventDefault();
    setActiveTab(tabTarget.dataset.tabTarget);
  }

  const detailTarget = event.target.closest("[data-detail]");
  if (detailTarget) {
    document.querySelectorAll("[data-detail]").forEach((row) => row.classList.remove("selected"));
    detailTarget.classList.add("selected");
    setDetail(detailTarget.dataset.detail);
  }

  const managerTarget = event.target.closest("[data-manager-target]");
  if (managerTarget) {
    const target = managerTarget.dataset.managerTarget;
    document.querySelectorAll("[data-manager-target]").forEach((button) => {
      button.classList.toggle("active", button.dataset.managerTarget === target);
    });
    document.querySelectorAll(".manager-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.id === target);
    });
  }
});

setDetail("wp-pr");
