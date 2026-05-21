const routeContent = {
  vanilla: {
    name: "Vanilla WordPress",
    summary: "Start a clean WordPress Playground tab with selected runtime settings.",
    form: `
      <label>WordPress version <select><option>latest</option><option>6.8</option><option>6.7</option></select></label>
      <label><input type="checkbox"> Include older versions</label>
      <label>PHP version <select><option>8.3</option><option>8.2</option><option>8.1</option></select></label>
      <label>Language <select><option>English (United States)</option><option>Polish</option></select></label>
      <label><input type="checkbox" checked> Allow network access</label>
      <label><input type="checkbox"> Create a multisite network</label>
    `,
    impact: "Starting creates a fresh temporary tab. Existing unsaved work stays in the current tab until closed.",
    action: "Start Playground"
  },
  wppr: {
    name: "Preview a WordPress PR",
    summary: "Enter a Core pull request number or URL to preview a WordPress build.",
    form: `<label>PR number or URL <input value="https://github.com/WordPress/wordpress-develop/pull/73152"></label>`,
    impact: "The tab boots from the selected WordPress PR and remains temporary until saved.",
    action: "Preview WordPress PR"
  },
  gutenberg: {
    name: "Preview a Gutenberg PR or Branch",
    summary: "Enter a PR number, pull request URL, or branch name.",
    form: `<label>PR number, URL, or branch name <input value="trunk"></label>`,
    impact: "A Gutenberg source preview is created. Save it before closing if it needs to be reused.",
    action: "Preview Gutenberg"
  },
  github: {
    name: "Import from GitHub",
    summary: "Import public plugin, theme, or wp-content directories after account connection.",
    form: `
      <label>Repository URL <input value="https://github.com/example/theme-demo"></label>
      <label>Import target <select><option>Plugin</option><option>Theme</option><option>wp-content</option></select></label>
    `,
    impact: "A GitHub access token is requested for import and is not stored after refresh.",
    action: "Connect GitHub"
  },
  blueprinturl: {
    name: "Run Blueprint from URL",
    summary: "Paste a remote blueprint.json URL and run it against a Playground.",
    form: `<label>Blueprint URL <input value="https://example.com/blueprint.json"></label>`,
    impact: "The Blueprint may install plugins, themes, content, and settings. Inspect before running.",
    action: "Run Blueprint"
  },
  zip: {
    name: "Import .zip",
    summary: "Choose a local Playground export zip from the browser file picker.",
    form: `<label>Zip file <input value="No file chosen" readonly></label>`,
    impact: "Importing over the current site replaces WordPress files and may replace database state.",
    action: "Choose .zip"
  }
};

document.querySelectorAll("[data-panel]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-panel]").forEach((item) => item.classList.remove("is-active"));
    document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("is-active"));
    button.classList.add("is-active");
    document.getElementById(button.dataset.panel).classList.add("is-active");
  });
});

document.querySelectorAll(".route-card").forEach((card) => {
  card.addEventListener("click", () => {
    const content = routeContent[card.dataset.route];
    document.querySelectorAll(".route-card").forEach((item) => item.classList.remove("is-selected"));
    card.classList.add("is-selected");
    document.getElementById("routeName").textContent = content.name;
    document.getElementById("routeSummary").textContent = content.summary;
    document.getElementById("routeForm").innerHTML = content.form;
    document.getElementById("routeImpact").textContent = content.impact;
    document.getElementById("routeAction").textContent = content.action;
  });
});

document.querySelectorAll(".manager-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".manager-tab").forEach((item) => item.classList.remove("is-active"));
    document.querySelectorAll(".manager-panel").forEach((panel) => panel.classList.remove("is-active"));
    button.classList.add("is-active");
    document.getElementById(button.dataset.manager).classList.add("is-active");
  });
});

document.querySelectorAll(".manager-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector('[data-panel="manager"]').click();
  });
});
