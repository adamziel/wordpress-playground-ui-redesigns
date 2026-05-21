const modalBackdrop = document.querySelector(".modal-backdrop");
const modalBody = document.querySelector("#modal-body");

const flowTemplates = {
  "wordpress-pr": {
    title: "Preview a WordPress PR",
    body: "Start a Playground from a WordPress Core pull request without changing the current saved site.",
    label: "PR number or URL",
    placeholder: "https://github.com/WordPress/wordpress-develop/pull/0000",
    action: "Preview"
  },
  "gutenberg-pr": {
    title: "Preview a Gutenberg PR or Branch",
    body: "Load a Gutenberg pull request, URL, or branch name into a fresh Playground.",
    label: "PR number, URL, or branch name",
    placeholder: "trunk or pull/0000",
    action: "Preview"
  },
  "github": {
    title: "Import from GitHub",
    body: "Import a public plugin, theme, or wp-content directory. Connect GitHub to authorize the import; the token is not stored after refresh.",
    label: "Repository URL",
    placeholder: "https://github.com/example/plugin",
    action: "Connect GitHub account"
  },
  "blueprint-url": {
    title: "Run Blueprint from URL",
    body: "Start a Playground from a Blueprint JSON file available at a public URL.",
    label: "Blueprint URL",
    placeholder: "https://example.com/blueprint.json",
    action: "Run Blueprint"
  }
};

function openModal(name) {
  if (name === "save" || name === "gallery") {
    const template = document.querySelector(`#${name}-template`);
    modalBody.innerHTML = "";
    modalBody.append(template.content.cloneNode(true));
  } else {
    const flow = flowTemplates[name];
    modalBody.innerHTML = `
      <h2 id="modal-title">${flow.title}</h2>
      <p>${flow.body}</p>
      <label>${flow.label}<input placeholder="${flow.placeholder}"></label>
      <div class="modal-actions">
        <button class="secondary modal-close-proxy">Cancel</button>
        <button class="primary">${flow.action}</button>
      </div>
    `;
  }
  modalBackdrop.hidden = false;
}

function closeModal() {
  modalBackdrop.hidden = true;
}

document.addEventListener("click", (event) => {
  const modalTrigger = event.target.closest("[data-modal]");
  if (modalTrigger) {
    openModal(modalTrigger.dataset.modal);
    return;
  }

  const tab = event.target.closest("[data-tab]");
  if (tab) {
    document.querySelectorAll(".tabs button").forEach((button) => button.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
    return;
  }

  if (event.target.matches(".modal-close, .modal-close-proxy") || event.target === modalBackdrop) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});
