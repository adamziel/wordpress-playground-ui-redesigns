const sectionButtons = [...document.querySelectorAll(".section-tab, .bottom-item")];
const panels = [...document.querySelectorAll(".tab-panel")];
const projectButtons = [...document.querySelectorAll(".project-tab")];
const launchButtons = [...document.querySelectorAll(".launch-option")];
const projectTitle = document.querySelector("#project-title");
const projectMeta = document.querySelector("#project-meta");
const launchDetail = document.querySelector("#launch-detail");

const projects = {
  research: {
    title: "Research Browser Playground",
    meta: "Saved in this browser a moment ago. PHP 8.3, WordPress latest, network enabled."
  },
  lesson: {
    title: "Lesson Starter Playground",
    meta: "Temporary Playground. Save in browser storage or choose a local directory before the workshop reset."
  },
  coffee: {
    title: "Coffee Shop Blueprint",
    meta: "Started from a WooCommerce blueprint. Export to GitHub or download the project zip when the exercise ends."
  },
  new: {
    title: "New Playground",
    meta: "Choose Vanilla WordPress, PR preview, GitHub import, Blueprint URL, or zip import from the workshop launchpad."
  }
};

const launchDetails = {
  "vanilla": {
    title: "Vanilla WordPress",
    body: "Start a clean WordPress Playground immediately for the next exercise.",
    control: '<label class="detail-control">Runtime <select><option>WordPress latest with PHP 8.3</option><option>WordPress 6.8 with PHP 8.2</option></select></label>',
    action: "Start Playground"
  },
  "wordpress-pr": {
    title: "Preview a WordPress PR",
    body: "Enter a PR number or URL, then start a Playground running that WordPress core change.",
    control: '<label class="detail-control">PR number or URL <input value="https://github.com/WordPress/wordpress-develop/pull/7392"></label>',
    action: "Preview PR"
  },
  "gutenberg-pr": {
    title: "Preview a Gutenberg PR or branch",
    body: "Use a PR number, URL, or branch name when the workshop needs the Gutenberg plugin build.",
    control: '<label class="detail-control">PR number, URL, or branch <input value="trunk"></label>',
    action: "Preview Gutenberg"
  },
  "github": {
    title: "Import from GitHub",
    body: "Connect a GitHub account to import public plugins, themes, or wp-content directories. Tokens are not stored.",
    control: '<label class="detail-control">Repository path <input value="wordpress/gutenberg"></label>',
    action: "Connect GitHub"
  },
  "blueprint-url": {
    title: "Run Blueprint from URL",
    body: "Paste a public blueprint URL and run it in the active Playground.",
    control: '<label class="detail-control">Blueprint URL <input value="https://example.com/blueprint.json"></label>',
    action: "Run Blueprint URL"
  },
  "zip": {
    title: "Import .zip",
    body: "Open the native file chooser and restore a Playground bundle from a zip archive.",
    control: '<label class="detail-control">Selected file <input value="No zip selected"></label>',
    action: "Choose zip"
  }
};

function showPanel(id) {
  panels.forEach((panel) => panel.classList.toggle("active", panel.id === id));
  sectionButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.panel === id);
  });
}

sectionButtons.forEach((button) => {
  button.addEventListener("click", () => showPanel(button.dataset.panel));
});

document.querySelectorAll("[data-open-panel]").forEach((button) => {
  button.addEventListener("click", () => showPanel(button.dataset.openPanel));
});

projectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const project = projects[button.dataset.project];
    projectButtons.forEach((tab) => tab.classList.toggle("active", tab === button));
    projectTitle.textContent = project.title;
    projectMeta.textContent = project.meta;
  });
});

launchButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const detail = launchDetails[button.dataset.detail];
    launchButtons.forEach((option) => option.classList.toggle("active", option === button));
    launchDetail.innerHTML = `
      <p class="eyebrow">Selected start</p>
      <h3>${detail.title}</h3>
      <p>${detail.body}</p>
      ${detail.control}
      <button class="primary">${detail.action}</button>
    `;
  });
});
