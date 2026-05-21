const routeData = {
  vanilla: {
    title: "Vanilla WordPress",
    description: "Start a clean WordPress Playground with selected runtime settings.",
    action: "Start Playground",
    consequence: "Creates a new temporary Playground. Existing unsaved work remains in this tab until closed or replaced.",
    fields: `
      <label>WordPress version
        <select><option>latest</option><option>6.8</option><option>6.7</option></select>
      </label>
      <label>PHP version
        <select><option>8.3</option><option>8.2</option><option>8.1</option></select>
      </label>
      <label>Language
        <select><option>English (United States)</option><option>Polish</option></select>
      </label>
      <label class="check-row"><input type="checkbox" /> Include older WordPress versions</label>
      <label class="check-row"><input type="checkbox" checked /> Allow network access</label>
      <label class="check-row"><input type="checkbox" /> Create a multisite network</label>
    `
  },
  wppr: {
    title: "Preview a WordPress PR",
    description: "Preview a WordPress Core pull request in a fresh Playground.",
    action: "Preview PR",
    consequence: "Requires a Core PR number or URL. The resulting site uses a WordPress build from that pull request.",
    fields: `
      <label>PR number or URL
        <input value="https://github.com/WordPress/wordpress-develop/pull/6123" />
      </label>
      <label>PHP version
        <select><option>8.3</option><option>8.2</option><option>8.1</option></select>
      </label>
      <label class="check-row"><input type="checkbox" checked /> Allow network access</label>
    `
  },
  gbpr: {
    title: "Preview a Gutenberg PR or Branch",
    description: "Load Gutenberg from a pull request, URL, or branch name.",
    action: "Preview Gutenberg",
    consequence: "This starts a runtime with the selected Gutenberg source. Branch names and PR URLs are accepted.",
    fields: `
      <label>PR number, URL, or branch name
        <input value="trunk/add-template-preview" />
      </label>
      <label>WordPress version
        <select><option>latest</option><option>6.8</option><option>6.7</option></select>
      </label>
      <label class="check-row"><input type="checkbox" checked /> Allow network access</label>
    `
  },
  github: {
    title: "Import from GitHub",
    description: "Import a public plugin, theme, or wp-content directory from GitHub.",
    action: "Connect GitHub",
    consequence: "A GitHub account connection is required. The access token is not stored and re-authentication is required after refresh.",
    fields: `
      <label>Repository
        <input value="WordPress/twentytwentyfive" />
      </label>
      <label>Path inside repository
        <input value="/wp-content/themes/twentytwentyfive" />
      </label>
      <label class="check-row"><input type="checkbox" checked /> Import into a new Playground</label>
    `
  },
  blueprinturl: {
    title: "Run Blueprint from URL",
    description: "Paste a blueprint.json URL and run that recipe.",
    action: "Run Blueprint",
    consequence: "The remote Blueprint can create or modify a Playground. Inspect the recipe before running when replacing the current site.",
    fields: `
      <label>Blueprint URL
        <input value="https://playground.wordpress.net/blueprints/plugin-preview.json" />
      </label>
      <label class="check-row"><input type="checkbox" checked /> Run in a new Playground</label>
    `
  },
  zip: {
    title: "Import .zip",
    description: "Choose a Playground export zip from this device.",
    action: "Choose .zip file",
    consequence: "Importing over the current site can replace the active files and database. Save the current Playground first if needed.",
    fields: `
      <label>Local archive
        <input value="playground-export.zip" />
      </label>
      <label class="check-row"><input type="checkbox" /> Replace current site after confirmation</label>
    `
  }
};

const notes = {
  start: "Starting a new source keeps this temporary tab visible until you replace or close it.",
  save: "Saving to browser and saving to a local directory produce different stored identities.",
  saved: "Rename and delete apply to the selected saved copy, not to every open temporary tab.",
  manager: "Site Manager keeps the live WordPress frame available while files, settings, Blueprint, database, and logs are inspected.",
  blueprints: "Blueprint gallery actions can run a new site, inspect JSON, or copy the Blueprint URL.",
  transfer: "Importing a zip over the current site can replace files and the database.",
  settings: "Unsaved settings changes reset the Playground; saved sites use Save & Reload with limited settings.",
  result: "The active frame remains reachable through path navigation, refresh, WP Admin, and Homepage."
};

const completion = {
  start: 2,
  save: 3,
  saved: 4,
  manager: 5,
  blueprints: 6,
  transfer: 7,
  settings: 7,
  result: 8
};

function setPanel(panelName) {
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === `panel-${panelName}`);
  });

  document.querySelectorAll("[data-panel]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.panel === panelName);
  });

  const task = document.querySelector(`.task[data-panel="${panelName}"]`);
  if (task) {
    document.querySelectorAll(".task").forEach((item) => item.classList.remove("is-active"));
    task.classList.add("is-active");
  }

  const doneCount = completion[panelName] || 2;
  document.getElementById("progressText").textContent = `${doneCount} of 8 checked`;
  document.getElementById("progressBar").style.width = `${(doneCount / 8) * 100}%`;
  document.getElementById("railNote").textContent = notes[panelName] || notes.start;
}

document.querySelectorAll("[data-panel], [data-open]").forEach((button) => {
  button.addEventListener("click", () => {
    setPanel(button.dataset.panel || button.dataset.open);
  });
});

document.querySelectorAll(".route").forEach((button) => {
  button.addEventListener("click", () => {
    const route = routeData[button.dataset.route];
    document.querySelectorAll(".route").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    document.getElementById("routeTitle").textContent = route.title;
    document.getElementById("routeDescription").textContent = route.description;
    document.getElementById("routeFields").innerHTML = route.fields;
    document.getElementById("routeConsequence").textContent = route.consequence;
    document.getElementById("routeAction").textContent = route.action;
  });
});

document.querySelectorAll(".manager-tab").forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.manager;
    document.querySelectorAll(".manager-tab").forEach((item) => item.classList.remove("is-active"));
    document.querySelectorAll(".manager-view").forEach((item) => {
      item.classList.toggle("is-active", item.id === `manager-${view}`);
    });
    button.classList.add("is-active");
  });
});

document.querySelectorAll(".blueprint-card").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".blueprint-card").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    document.getElementById("blueprintTitle").textContent = button.dataset.blueprint;
  });
});
