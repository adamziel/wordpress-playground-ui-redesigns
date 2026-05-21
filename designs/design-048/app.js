const detailCopy = {
  vanilla: {
    eyebrow: "Selected start",
    title: "Vanilla WordPress",
    body: "Start a clean WordPress Playground immediately with the current default runtime.",
    action: "Start Playground"
  },
  "wordpress-pr": {
    eyebrow: "Preview core",
    title: "WordPress PR",
    body: "Enter a WordPress PR number or URL, then preview it in a disposable Playground.",
    action: "Preview PR"
  },
  "gutenberg-pr": {
    eyebrow: "Preview editor work",
    title: "Gutenberg PR or branch",
    body: "Use a PR number, URL, or branch name when a workshop needs the latest block editor change.",
    action: "Preview Gutenberg"
  },
  github: {
    eyebrow: "Import source",
    title: "From GitHub",
    body: "Connect a GitHub account to import public plugins, themes, or wp-content directories. The token is not stored.",
    action: "Connect GitHub"
  },
  "blueprint-url": {
    eyebrow: "Run recipe",
    title: "Blueprint URL",
    body: "Paste a public Blueprint URL and run it to recreate the workshop environment.",
    action: "Run Blueprint"
  },
  zip: {
    eyebrow: "Restore bundle",
    title: "Import .zip",
    body: "Trigger the native file chooser and import a Playground zip bundle.",
    action: "Choose zip"
  }
};

const taskDetail = document.querySelector("#task-detail");

document.querySelectorAll("[data-detail]").forEach((button) => {
  button.addEventListener("click", () => {
    const item = detailCopy[button.dataset.detail];
    taskDetail.innerHTML = `
      <p class="eyebrow">${item.eyebrow}</p>
      <h3>${item.title}</h3>
      <p>${item.body}</p>
      <button class="primary">${item.action}</button>
    `;
  });
});

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    document.querySelector(`#${button.dataset.panel}`).classList.add("active");
  });
});

document.querySelectorAll("[data-tool]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-tool]").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".tool-panel").forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    document.querySelector(`#${button.dataset.tool}`).classList.add("active");
  });
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll(".blueprint-grid article").forEach((card) => {
      const tags = card.dataset.tags.split(" ");
      card.hidden = filter !== "all" && !tags.includes(filter);
    });
  });
});
