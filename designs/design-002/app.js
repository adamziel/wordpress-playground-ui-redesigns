const sourceCopy = {
  "Vanilla WordPress": {
    title: "Vanilla WordPress",
    copy: "Start a fresh Playground with the latest WordPress defaults.",
    label: "Site name",
    placeholder: "Untitled Playground",
    primary: "Start Playground"
  },
  "WordPress PR": {
    title: "Preview a WordPress PR",
    copy: "Preview a WordPress core pull request by entering a PR number or URL.",
    label: "PR number or URL",
    placeholder: "https://github.com/WordPress/wordpress-develop/pull/1234",
    primary: "Preview"
  },
  "Gutenberg PR or branch": {
    title: "Preview a Gutenberg PR or Branch",
    copy: "Enter a Gutenberg PR number, URL, or branch name.",
    label: "PR number, URL, or branch name",
    placeholder: "trunk or pull/67890",
    primary: "Preview"
  },
  "From GitHub": {
    title: "Import from GitHub",
    copy: "Import plugins, themes, or wp-content directories from public GitHub repositories.",
    label: "Repository URL",
    placeholder: "https://github.com/user/repository",
    primary: "Connect GitHub"
  },
  "Blueprint URL": {
    title: "Run Blueprint from URL",
    copy: "Paste a Blueprint URL to configure and launch a Playground.",
    label: "Blueprint URL",
    placeholder: "https://example.com/blueprint.json",
    primary: "Run Blueprint"
  },
  "Import .zip": {
    title: "Import .zip",
    copy: "Choose a local zip archive to import a Playground bundle.",
    label: "Selected archive",
    placeholder: "No file selected",
    primary: "Browse for .zip"
  }
};

function openDialog(id) {
  const dialog = document.getElementById(id);
  if (!dialog) return;
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function setSource(name) {
  const detail = sourceCopy[name] || sourceCopy["WordPress PR"];
  document.getElementById("sourceDetailTitle").textContent = detail.title;
  document.getElementById("sourceDetailCopy").textContent = detail.copy;
  document.getElementById("sourceDetailInput").childNodes[0].nodeValue = detail.label;
  document.querySelector("#sourceDetailInput input").placeholder = detail.placeholder;
  document.getElementById("sourcePrimary").textContent = detail.primary;
  document.getElementById("githubNote").classList.toggle("is-visible", name === "From GitHub");
  openDialog("sourceModal");
}

document.querySelectorAll("[data-open-modal]").forEach((button) => {
  button.addEventListener("click", () => openDialog(button.dataset.openModal));
});

document.querySelectorAll("[data-source]").forEach((button) => {
  button.addEventListener("click", () => setSource(button.dataset.source));
});

document.querySelectorAll("[data-blueprint]").forEach((button) => {
  button.addEventListener("click", () => openDialog("galleryModal"));
});

document.querySelectorAll(".tool-tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = button.dataset.panel;
    document.querySelectorAll(".tool-tabs button").forEach((tab) => tab.classList.toggle("is-active", tab === button));
    document.querySelectorAll("[data-panel-content]").forEach((content) => {
      content.classList.toggle("is-active", content.dataset.panelContent === panel);
    });
  });
});

document.querySelectorAll("[data-focus-panel]").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = button.dataset.focusPanel;
    document.querySelector(`.tool-tabs button[data-panel="${panel}"]`)?.click();
    document.querySelector(".right-desk")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-destination]").forEach((button) => {
  button.addEventListener("click", () => {
    const destination = button.dataset.destination;
    document.querySelectorAll(".preview-tabs button").forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.destination === destination);
    });
    const path = destination === "admin" ? "/wp-admin/" : destination === "sample" ? "/sample-page/" : "/hello-from-playground/";
    document.querySelector(".path-field input").value = path;
  });
});

document.querySelectorAll(".chip-row button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".chip-row button").forEach((chip) => chip.classList.toggle("is-active", chip === button));
  });
});
