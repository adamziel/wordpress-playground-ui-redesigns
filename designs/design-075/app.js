const routeCopy = {
  vanilla: {
    chip: "One click",
    title: "Vanilla WordPress",
    copy: "Starts a fresh Playground with the selected WordPress, PHP, language, network, and multisite settings.",
    label: "Confirmation",
    value: "Start fresh WordPress",
    risk: "Starting fresh discards the current unsaved temporary site unless it is saved first.",
    action: "Start Playground"
  },
  wppr: {
    chip: "Core patch",
    title: "Preview a WordPress PR",
    copy: "Fetches and previews a WordPress core pull request in a new Playground.",
    label: "PR NUMBER OR URL",
    value: "https://github.com/WordPress/wordpress-develop/pull/62111",
    risk: "Preview opens as a separate start route. Save current work before replacing the active session.",
    action: "Preview"
  },
  gbpr: {
    chip: "Editor build",
    title: "Preview a Gutenberg PR or Branch",
    copy: "Runs a Gutenberg plugin build from a PR number, URL, or branch name.",
    label: "PR NUMBER, URL, OR A BRANCH NAME",
    value: "trunk",
    risk: "The selected Gutenberg build becomes the active editor environment for this Playground.",
    action: "Preview"
  },
  github: {
    chip: "Account required",
    title: "Import from GitHub",
    copy: "Imports plugins, themes, and wp-content directories directly from public GitHub repositories.",
    label: "Connection",
    value: "Connect your GitHub account",
    risk: "The access token is not stored, so re-authentication is required after every page refresh.",
    action: "Connect GitHub account"
  },
  "blueprint-url": {
    chip: "Remote recipe",
    title: "Run Blueprint from URL",
    copy: "Loads a blueprint JSON URL and runs its steps against the active Playground.",
    label: "BLUEPRINT URL",
    value: "https://example.com/blueprint.json",
    risk: "Running a Blueprint can change content, files, plugins, themes, and landing page.",
    action: "Run Blueprint"
  },
  zip: {
    chip: "Local file",
    title: "Import .zip",
    copy: "Uses the browser's native file chooser to import a Playground zip bundle.",
    label: "Selected file",
    value: "No file selected",
    risk: "Importing a zip replaces the current site filesystem after confirmation.",
    action: "Choose .zip"
  }
};

const routeButtons = document.querySelectorAll(".route-card");
const routeChip = document.querySelector("#route-chip");
const routeTitle = document.querySelector("#route-title");
const routeText = document.querySelector("#route-copy");
const routeField = document.querySelector("#route-field span");
const routeInput = document.querySelector("#route-field input");
const routeRisk = document.querySelector("#route-risk");
const routeAction = document.querySelector("#route-action");

routeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    routeButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const detail = routeCopy[button.dataset.route];
    routeChip.textContent = detail.chip;
    routeTitle.textContent = detail.title;
    routeText.textContent = detail.copy;
    routeField.textContent = detail.label;
    routeInput.value = detail.value;
    routeRisk.textContent = detail.risk;
    routeAction.textContent = detail.action;
  });
});

const destinationButtons = document.querySelectorAll(".destination");
const progressLabel = document.querySelector("#progress-label");
const progressCount = document.querySelector("#progress-count");
const progressBar = document.querySelector("#progress-bar");
const progressResult = document.querySelector("#progress-result");

destinationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    destinationButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    if (button.dataset.destination === "local") {
      progressLabel.textContent = "Preparing local directory write";
      progressCount.textContent = "Choose directory";
      progressBar.style.width = "28%";
      progressResult.textContent = "Result: waiting for a local folder grant before file copy begins.";
    } else {
      progressLabel.textContent = "Saving to browser storage";
      progressCount.textContent = "3028 / 3751 files";
      progressBar.style.width = "81%";
      progressResult.textContent = "Result: Saved Playground available at /research-browser-playground/.";
    }
  });
});

const filterButtons = document.querySelectorAll(".filter-pills button");
const blueprintItems = document.querySelectorAll(".blueprint-item");
const searchInput = document.querySelector("#blueprint-search");
const catalogCount = document.querySelector("#catalog-count");

function filterBlueprints() {
  const activeFilter = document.querySelector(".filter-pills button.active").dataset.filter;
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;

  blueprintItems.forEach((item) => {
    const text = item.textContent.toLowerCase();
    const tags = item.dataset.tags;
    const matchesFilter = activeFilter === "all" || tags.includes(activeFilter);
    const matchesSearch = !query || text.includes(query) || tags.includes(query);
    const show = matchesFilter && matchesSearch;
    item.style.display = show ? "" : "none";
    if (show) visible += 1;
  });

  catalogCount.textContent = `Showing ${visible} visible card${visible === 1 ? "" : "s"} from a 43 item catalog.`;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    filterBlueprints();
  });
});

searchInput.addEventListener("input", filterBlueprints);

document.querySelectorAll(".blueprint-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".blueprint-item").forEach((card) => card.classList.remove("selected"));
    item.classList.add("selected");
  });
});
