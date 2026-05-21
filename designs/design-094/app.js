const routeData = {
  vanilla: {
    badge: "WP",
    title: "Start Vanilla WordPress",
    copy: "Creates a clean temporary Playground using the runtime below.",
    fields: [
      ["WordPress version", "Latest stable", "Nightly", "6.8.x"],
      ["PHP version", "PHP 8.3", "PHP 8.2", "PHP 8.1"]
    ],
    consequence: "Starting a new site replaces the current temporary Playground unless it is saved first.",
    action: "Start Playground"
  },
  wppr: {
    badge: "PR",
    title: "Preview a WordPress PR",
    copy: "Builds WordPress from a wordpress-develop pull request.",
    fields: [
      ["PR number or URL", "https://github.com/WordPress/wordpress-develop/pull/1234"]
    ],
    consequence: "Requires a WordPress core PR number or URL. The preview starts a new temporary site.",
    action: "Preview WordPress PR"
  },
  gutenberg: {
    badge: "GB",
    title: "Preview a Gutenberg PR or branch",
    copy: "Loads Gutenberg from a pull request, URL, or branch name.",
    fields: [
      ["PR number, URL, or branch name", "trunk"],
      ["WordPress version", "Latest stable", "Nightly", "6.8.x"]
    ],
    consequence: "Branch previews are isolated from saved sites until you explicitly save the resulting Playground.",
    action: "Preview Gutenberg"
  },
  github: {
    badge: "GH",
    title: "Import from GitHub",
    copy: "Imports public plugins, themes, or wp-content directories after connecting a GitHub account.",
    fields: [
      ["Repository URL", "https://github.com/example/workshop-plugin"],
      ["Import as", "Plugin", "Theme", "wp-content"]
    ],
    consequence: "GitHub access tokens are not stored. Refreshing requires reconnecting before another import.",
    action: "Connect GitHub"
  },
  blueprint: {
    badge: "URL",
    title: "Run Blueprint from URL",
    copy: "Runs a hosted blueprint.json and applies its steps to a new Playground.",
    fields: [
      ["Blueprint URL", "https://example.com/blueprint.json"]
    ],
    consequence: "Running a Blueprint URL can replace current content. Save first if this workshop state matters.",
    action: "Run Blueprint"
  },
  zip: {
    badge: "ZIP",
    title: "Import .zip",
    copy: "Uses the browser file picker to import a Playground zip.",
    fields: [
      ["Selected file", "workshop-site.zip"]
    ],
    consequence: "Importing a .zip replaces the current site. This consequence is shown before the chooser opens.",
    action: "Choose .zip"
  }
};

const routeFields = document.getElementById("routeFields");
const routeBadge = document.getElementById("routeBadge");
const routeTitle = document.getElementById("routeTitle");
const routeCopy = document.getElementById("routeCopy");
const routeConsequence = document.getElementById("routeConsequence");
const runRouteButton = document.getElementById("runRouteButton");
const flowSource = document.getElementById("flowSource");
const flowProgress = document.getElementById("flowProgress");
const flowResult = document.getElementById("flowResult");
const flowStatus = document.getElementById("flowStatus");
const topState = document.getElementById("topState");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function renderRoute(routeKey) {
  const route = routeData[routeKey];
  routeBadge.textContent = route.badge;
  routeTitle.textContent = route.title;
  routeCopy.textContent = route.copy;
  routeConsequence.textContent = route.consequence;
  runRouteButton.textContent = route.action;
  routeFields.classList.toggle("single", route.fields.length === 1);
  routeFields.innerHTML = route.fields.map((field) => {
    const [label, first, ...options] = field;
    if (options.length) {
      return `<label><span>${label}</span><select>${[first, ...options].map((option) => `<option>${option}</option>`).join("")}</select></label>`;
    }
    return `<label><span>${label}</span><input value="${first}" aria-label="${label}"></label>`;
  }).join("");
  flowSource.textContent = `${route.title.replace("Start ", "")} selected`;
  flowProgress.textContent = "Progress waits";
  flowResult.textContent = "Temporary site";
}

document.querySelectorAll(".source-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".source-tab").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderRoute(button.dataset.route);
  });
});

runRouteButton.addEventListener("click", () => {
  flowStatus.textContent = "Running";
  flowProgress.textContent = "Preparing WordPress runtime";
  flowResult.textContent = "Unsaved result ready";
  showToast(`${runRouteButton.textContent}: progress shown in flow proof`);
});

const selectedTitle = document.getElementById("selectedTitle");
const selectedDesc = document.getElementById("selectedDesc");
const selectedRuntime = document.getElementById("selectedRuntime");
const selectedSteps = document.getElementById("selectedSteps");
const resultCount = document.getElementById("resultCount");

function selectBlueprint(card) {
  document.querySelectorAll(".blueprint-card").forEach((item) => item.classList.remove("is-selected"));
  card.classList.add("is-selected");
  selectedTitle.textContent = card.dataset.title;
  selectedDesc.textContent = card.dataset.desc;
  selectedRuntime.textContent = card.dataset.runtime;
  selectedSteps.textContent = card.dataset.steps;
  flowSource.textContent = `${card.dataset.title} selected`;
}

document.querySelectorAll(".blueprint-card").forEach((card) => {
  card.addEventListener("click", () => selectBlueprint(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectBlueprint(card);
    }
  });
});

function applyGalleryFilter(filter) {
  let visible = 0;
  document.querySelectorAll(".blueprint-card").forEach((card) => {
    const match = filter === "all" || card.dataset.tags.includes(filter);
    card.hidden = !match;
    if (match) visible += 1;
  });
  resultCount.textContent = `Showing ${visible} of 43`;
}

document.querySelectorAll(".group-chip").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".group-chip").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    applyGalleryFilter(button.dataset.filter);
  });
});

document.getElementById("commandSearch").addEventListener("input", (event) => {
  const term = event.target.value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll(".blueprint-card").forEach((card) => {
    const text = `${card.dataset.title} ${card.dataset.tags} ${card.dataset.desc}`.toLowerCase();
    const match = !term || text.includes(term) || term.includes("gallery") || term.includes("starter");
    card.hidden = !match;
    if (match) visible += 1;
  });
  resultCount.textContent = `Showing ${visible} of 43`;
});

document.getElementById("runBlueprintButton").addEventListener("click", () => {
  flowStatus.textContent = "Running";
  flowProgress.textContent = `Running ${selectedTitle.textContent} Blueprint`;
  flowResult.textContent = "Blueprint result is unsaved";
  showToast(`${selectedTitle.textContent} Blueprint started`);
});

document.querySelector("[data-copy-blueprint]").addEventListener("click", () => {
  showToast("Blueprint link copied to this wireframe result state");
});

let saveDestination = "browser";
const saveProgressTitle = document.getElementById("saveProgressTitle");
const saveProgressCopy = document.getElementById("saveProgressCopy");
const saveBar = document.getElementById("saveBar");
const flowSave = document.getElementById("flowSave");
const savedSiteName = document.getElementById("savedSiteName");
const savedSiteMeta = document.getElementById("savedSiteMeta");
const managerName = document.getElementById("managerName");
const managerStatus = document.getElementById("managerStatus");

document.querySelectorAll(".save-option").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".save-option").forEach((item) => item.classList.remove("is-selected"));
    button.classList.add("is-selected");
    saveDestination = button.dataset.save;
    saveBar.style.width = "12%";
    if (saveDestination === "browser") {
      saveProgressTitle.textContent = "Browser save selected";
      saveProgressCopy.textContent = "Ready to copy files into browser storage.";
      flowSave.textContent = "Destination: this browser";
    } else {
      saveProgressTitle.textContent = "Local directory save selected";
      saveProgressCopy.textContent = "Ready to request folder access and write files locally.";
      flowSave.textContent = "Destination: local directory";
    }
  });
});

document.getElementById("completeSaveButton").addEventListener("click", () => {
  saveBar.style.width = "72%";
  saveProgressTitle.textContent = saveDestination === "browser" ? "Saving 3028 / 3751 files" : "Writing 3028 / 3751 files to local directory";
  flowProgress.textContent = saveProgressTitle.textContent;
  window.setTimeout(() => {
    saveBar.style.width = "100%";
    if (saveDestination === "browser") {
      saveProgressTitle.textContent = "Saved in this browser";
      saveProgressCopy.textContent = "Research Browser Playground is now available in Saved Playgrounds.";
      savedSiteMeta.textContent = "Saved in this browser a moment ago. URL slug: /research-browser-playground/";
      managerStatus.textContent = "Saved in this browser. Homepage and WP Admin are one click away.";
      topState.textContent = "Saved Playground";
      topState.classList.remove("warning");
      topState.classList.add("success");
      flowResult.textContent = "Saved browser identity";
    } else {
      saveProgressTitle.textContent = "Saved to local directory";
      saveProgressCopy.textContent = "Mounted local directory is ready. Save & Reload is available for stored settings.";
      savedSiteMeta.textContent = "Saved to local directory ~/Workshops/research-browser. Reload uses the mounted folder.";
      managerStatus.textContent = "Saved to a local directory. Settings changes use Save & Reload.";
      topState.textContent = "Local Directory Playground";
      flowResult.textContent = "Local directory mounted";
    }
    flowStatus.textContent = "Complete";
    showToast(saveProgressTitle.textContent);
  }, 360);
});

document.getElementById("renameButton").addEventListener("click", () => {
  const newName = savedSiteName.textContent === "Research Browser Playground" ? "Workshop Demo Playground" : "Research Browser Playground";
  savedSiteName.textContent = newName;
  managerName.textContent = newName;
  showToast(`Renamed to ${newName}`);
});

document.getElementById("deleteButton").addEventListener("click", () => {
  const warning = document.getElementById("deleteWarning");
  warning.hidden = !warning.hidden;
  flowResult.textContent = warning.hidden ? "Saved browser identity" : "Delete consequence visible";
});

document.getElementById("importZipButton").addEventListener("click", () => {
  document.getElementById("importResult").textContent = "Import .zip selected: native file chooser opens, then the imported zip replaces the current site.";
  flowProgress.textContent = "Importing workshop-site.zip";
  flowResult.textContent = "Current site replaced by zip import";
  showToast("Import-over-current-site consequence shown");
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.jump);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

document.querySelector("[data-action='refresh']").addEventListener("click", () => {
  showToast("Active WordPress iframe refreshed");
});
