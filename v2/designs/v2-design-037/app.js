(function () {
  const routes = {
    vanilla: {
      title: "Vanilla WordPress",
      type: "Fresh runtime",
      state: "Ready",
      body: `
        <p>Starts a clean Playground with the selected WordPress, PHP, language, network, and multisite settings.</p>
        <div class="form-grid">
          <label>WordPress version <select id="routeWp"><option>latest</option><option>6.5</option><option>6.4</option></select></label>
          <label>PHP version <select id="routePhp"><option>8.3</option><option>8.2</option></select></label>
        </div>
        <label class="check"><input type="checkbox" checked> Allow network access</label>
      `
    },
    wppr: {
      title: "Preview a WordPress PR",
      type: "Core review",
      state: "Needs PR",
      input: "PR NUMBER OR URL",
      placeholder: "61234 or https://github.com/WordPress/wordpress-develop/pull/61234",
      body: `
        <p>Builds WordPress core from a pull request. Empty or private URLs cannot be previewed.</p>
        <label>PR number or URL <input id="routeInput" placeholder="61234 or WordPress PR URL"></label>
      `
    },
    gutenberg: {
      title: "Preview a Gutenberg PR or Branch",
      type: "Gutenberg review",
      state: "Needs branch",
      input: "PR NUMBER, URL, OR A BRANCH NAME",
      placeholder: "trunk, fix/list-view-focus, or Gutenberg PR URL",
      body: `
        <p>Checks out a Gutenberg PR or branch, installs it into WordPress, and marks the result as an unsaved review Playground.</p>
        <label>PR, URL, or branch <input id="routeInput" value="fix/list-view-focus"></label>
      `
    },
    github: {
      title: "Import from GitHub",
      type: "Repository import",
      state: "Auth required",
      body: `
        <p>Imports plugins, themes, or wp-content directories from public repositories. The access token is not stored; refresh requires reconnecting.</p>
        <div class="form-grid">
          <label>Repository <input id="routeInput" value="wordpress/gutenberg"></label>
          <label>Directory <input id="routePathInput" value="packages/block-library"></label>
        </div>
        <button class="ghost" id="inlineConnectGithub" type="button">Connect GitHub account</button>
      `
    },
    blueprintUrl: {
      title: "Run Blueprint from URL",
      type: "Blueprint URL",
      state: "Needs URL",
      body: `
        <p>Downloads a Blueprint JSON file, validates it, then runs it against the current Playground.</p>
        <label>Blueprint URL <input id="routeInput" value="https://playground.wordpress.net/blueprints/gallery/non-profit.json"></label>
      `
    },
    zip: {
      title: "Import .zip",
      type: "Archive replacement",
      state: "Chooser required",
      body: `
        <p>Opens the native file chooser. Importing replaces files and database in the active Playground after confirmation.</p>
        <label>Selected archive <input id="routeInput" value="plugin-review-build.zip"></label>
        <div class="warning-box"><strong>Replacement warning</strong><span>The current runtime is overwritten when the archive is imported.</span></div>
      `
    }
  };

  const blueprints = [
    { name: "Art Gallery", tags: ["Website", "Personal"], desc: "An art gallery created with the Vueo theme." },
    { name: "Coffee Shop", tags: ["WooCommerce", "Website"], desc: "A WooCommerce coffee storefront with products and content." },
    { name: "Feed Reader with the Friends Plugin", tags: ["Content", "Personal"], desc: "Reads feeds from the web in Playground using the Friends plugin." },
    { name: "Gaming News", tags: ["News", "Website"], desc: "A gaming news site created with the Spiel theme." },
    { name: "Non-profit Organization", tags: ["Website"], desc: "A non-profit organization site created with the Koinonia theme." },
    { name: "Personal Blog", tags: ["Personal", "Content"], desc: "A personal blog created with the Substrata theme." }
  ];

  const state = {
    section: "launch",
    route: "vanilla",
    blueprintFilter: "All",
    selectedBlueprint: blueprints[0],
    deleteTarget: null,
    active: {
      id: "unsaved",
      title: "Unsaved Playground",
      subtitle: "Temporary vanilla WordPress runtime",
      source: "Vanilla WordPress",
      path: "/hello-from-playground/",
      storage: "temporary"
    },
    saved: [
      { id: "unsaved", title: "Unsaved Playground", storage: "temporary", meta: "Not saved. Lost on close or refresh.", active: true },
      { id: "research", title: "Research Browser Playground", storage: "saved", meta: "Saved in this browser. Created May 21, 2026.", active: false },
      { id: "local-kit", title: "Local Theme Debug", storage: "local", meta: "Backed by ~/Sites/theme-debug. Permission required after refresh.", active: false }
    ],
    history: [
      "Opened temporary Vanilla WordPress at /hello-from-playground/."
    ]
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  function addHistory(text) {
    state.history.unshift(text);
    state.history = state.history.slice(0, 8);
    renderHistory();
  }

  function setSection(section) {
    state.section = section;
    $(".app").dataset.section = section;
    $$(".panel-section").forEach((panel) => panel.classList.remove("is-active"));
    $(`#${section}Section`).classList.add("is-active");
    $$("[data-section-target]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.sectionTarget === section);
    });
  }

  function setActive(updates) {
    state.active = { ...state.active, ...updates };
    state.saved = state.saved.map((item) => ({ ...item, active: item.id === state.active.id }));
    renderShell();
    renderSaved();
  }

  function storageLabel(storage) {
    if (storage === "saved") return "Saved in this browser";
    if (storage === "local") return "Local directory";
    return "Temporary";
  }

  function renderShell() {
    $("#shellTitle").textContent = state.active.title;
    $("#shellSubtitle").textContent = state.active.subtitle;
    $("#pathInput").value = state.active.path;
    $("#previewPath").textContent = state.active.path;
    $("#previewStatus").textContent = storageLabel(state.active.storage);
    $("#receiptSource").textContent = state.active.source;
    $("#receiptPath").textContent = state.active.path;
    $("#receiptStorage").textContent = state.active.storage === "saved"
      ? "Saved in browser storage with a restorable slug"
      : state.active.storage === "local"
        ? "Stored in a local folder; reconnect permission after refresh"
        : "Temporary, lost on close or refresh";
    $("#receiptActions").textContent = state.active.storage === "temporary"
      ? "Save, destructive reset, WP Admin, export/download"
      : "Save & Reload, rename, delete, WP Admin, export/download";
    $("#storageBadge").className = `state-badge ${state.active.storage}`;
    $("#storageBadge").textContent = storageLabel(state.active.storage);
    $("#settingsMode").textContent = state.active.storage === "temporary"
      ? "Temporary runtime: Apply Settings & Reset Playground is destructive."
      : "Stored runtime: settings use Save & Reload.";
    $("#settingsCopy").textContent = state.active.storage === "temporary"
      ? "A reset replaces files and database for the current unsaved site."
      : "Reload keeps the saved identity and writes settings before WordPress restarts.";
    $("#previewSiteName").textContent = state.active.title.includes("PR") || state.active.title.includes("branch")
      ? "WordPress Review Website"
      : "My WordPress Website";
  }

  function renderRoute() {
    const route = routes[state.route];
    $("#contractType").textContent = route.type;
    $("#contractTitle").textContent = route.title;
    $("#contractState").textContent = route.state;
    $("#contractState").className = "state-badge";
    $("#contractBody").innerHTML = route.body;
    $$(".route").forEach((button) => button.classList.toggle("is-active", button.dataset.route === state.route));
    const inline = $("#inlineConnectGithub");
    if (inline) inline.addEventListener("click", () => addHistory("GitHub account connected for this session; token will not be stored after refresh."));
  }

  function renderBlueprints() {
    const search = ($("#blueprintSearch")?.value || "").toLowerCase();
    const items = blueprints.filter((item) => {
      const matchesFilter = state.blueprintFilter === "All" || item.tags.includes(state.blueprintFilter);
      const matchesSearch = !search || `${item.name} ${item.tags.join(" ")} ${item.desc}`.toLowerCase().includes(search);
      return matchesFilter && matchesSearch;
    });
    $("#blueprintGrid").innerHTML = items.map((item) => `
      <button class="blueprint-item ${item.name === state.selectedBlueprint.name ? "is-active" : ""}" data-blueprint="${item.name}" type="button">
        <strong>${item.name}</strong>
        <span>${item.tags.join(" / ")}</span>
      </button>
    `).join("") || `<p>No matching Blueprints in this representative subset.</p>`;
    $("#blueprintDetail").innerHTML = `
      <strong>${state.selectedBlueprint.name}</strong>
      <p>${state.selectedBlueprint.desc}</p>
      <div class="contract-actions">
        <button class="ghost" id="inspectBlueprint" type="button">Inspect JSON</button>
        <button class="primary" id="runSelectedBlueprint" type="button">Run selected</button>
      </div>
    `;
    $$(".blueprint-item").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedBlueprint = blueprints.find((item) => item.name === button.dataset.blueprint);
        renderBlueprints();
      });
    });
    $("#inspectBlueprint")?.addEventListener("click", () => setSection("manager") || setManagerTab("blueprint"));
    $("#runSelectedBlueprint")?.addEventListener("click", () => {
      setManagerTab("blueprint");
      setSection("manager");
      $("#blueprintValidation").textContent = `Ready to replace current content with ${state.selectedBlueprint.name}`;
      addHistory(`Selected Blueprint "${state.selectedBlueprint.name}" and opened replacement tools.`);
    });
  }

  function renderSaved() {
    $("#savedCount").textContent = `${state.saved.length} objects`;
    $("#savedList").innerHTML = state.saved.map((item) => `
      <div class="saved-row ${item.active ? "is-active" : ""}" data-id="${item.id}">
        <span class="state-badge ${item.storage}">${storageLabel(item.storage)}</span>
        <div>
          <h3>${item.title}</h3>
          <p>${item.meta}</p>
        </div>
        <div class="row-actions">
          <button class="ghost" data-action="open" data-id="${item.id}" type="button">Open</button>
          <button class="ghost" data-action="manage" data-id="${item.id}" type="button">Manage</button>
          ${item.storage !== "temporary" ? `<button class="ghost" data-action="rename" data-id="${item.id}" type="button">Rename</button>` : `<button class="ghost" data-action="save" data-id="${item.id}" type="button">Save</button>`}
          ${item.storage !== "temporary" ? `<button class="danger-ghost" data-action="delete" data-id="${item.id}" type="button">Delete</button>` : ""}
        </div>
      </div>
    `).join("");

    $$(".row-actions button").forEach((button) => button.addEventListener("click", handleSavedAction));
  }

  function handleSavedAction(event) {
    const id = event.currentTarget.dataset.id;
    const action = event.currentTarget.dataset.action;
    const item = state.saved.find((entry) => entry.id === id);
    if (!item) return;
    if (action === "open") {
      setActive({
        id: item.id,
        title: item.title,
        subtitle: item.meta,
        storage: item.storage,
        source: item.storage === "local" ? "Local directory" : item.storage === "saved" ? "Saved browser Playground" : "Vanilla WordPress",
        path: "/hello-from-playground/"
      });
      addHistory(`Opened ${item.title}; shell identity and storage badge updated.`);
    }
    if (action === "manage") setSection("manager");
    if (action === "save") {
      $("#saveName").value = state.active.title === "Unsaved Playground" ? "Review Browser Playground" : state.active.title;
      setSection("saved");
    }
    if (action === "rename") {
      item.title = `${item.title} Renamed`;
      if (state.active.id === item.id) setActive({ title: item.title, subtitle: item.meta });
      addHistory(`Renamed saved Playground to "${item.title}".`);
      renderSaved();
    }
    if (action === "delete") {
      state.deleteTarget = item.id;
      $("#deleteTitle").textContent = `Delete ${item.title}?`;
      $("#deletePanel").classList.remove("hidden");
      $("#deleteProgress").classList.add("hidden");
      setSection("saved");
    }
  }

  function renderHistory() {
    $("#historyList").innerHTML = state.history.map((item) => `<li>${item}</li>`).join("");
  }

  function setManagerTab(tab) {
    $$(".mini-tab").forEach((button) => button.classList.toggle("is-active", button.dataset.managerTab === tab));
    $$(".manager-panel").forEach((panel) => panel.classList.remove("is-active"));
    $(`#${tab}Panel`).classList.add("is-active");
  }

  function progress(el, labelEl, labels, done) {
    el.classList.remove("hidden");
    const bar = el.querySelector(".progress span");
    bar.style.width = "0";
    let index = 0;
    function tick() {
      const pct = Math.min(100, (index + 1) * (100 / labels.length));
      if (labelEl) labelEl.textContent = labels[index];
      bar.style.width = `${pct}%`;
      index += 1;
      if (index < labels.length) {
        window.setTimeout(tick, 420);
      } else {
        window.setTimeout(() => {
          el.classList.add("hidden");
          done?.();
        }, 450);
      }
    }
    tick();
  }

  function runContract() {
    const route = routes[state.route];
    const input = $("#routeInput");
    if (input && !input.value.trim()) {
      $("#contractState").textContent = "Validation failed";
      $("#contractState").className = "state-badge temporary";
      input.focus();
      return;
    }
    $("#contractState").textContent = "Validated";
    $("#contractState").className = "state-badge running";
    const labels = state.route === "gutenberg"
      ? ["Checking branch name...", "Installing Gutenberg package...", "Booting WordPress preview..."]
      : state.route === "wppr"
        ? ["Resolving WordPress PR...", "Applying patch...", "Booting WordPress preview..."]
        : ["Validating contract...", "Preparing files...", "Booting WordPress preview..."];
    progress($("#contractProgress"), $("#contractProgressLabel"), labels, () => {
      let title = route.title;
      let source = route.title;
      let path = "/hello-from-playground/";
      let subtitle = "Temporary preview ready to save or export";
      if (state.route === "gutenberg") {
        const value = input.value.trim();
        title = `Gutenberg branch: ${value}`;
        source = `Gutenberg ${value}`;
        path = "/wp-admin/plugins.php?plugin=gutenberg";
        subtitle = "Unsaved review runtime with Gutenberg installed";
      } else if (state.route === "wppr") {
        const value = input.value.trim().match(/\d+/)?.[0] || input.value.trim();
        title = `WordPress PR #${value}`;
        source = `WordPress core PR ${value}`;
        path = "/wp-admin/about.php?preview=core-pr";
        subtitle = "Unsaved WordPress core review runtime";
      } else if (state.route === "github") {
        title = `GitHub import: ${input.value.trim()}`;
        source = "GitHub import";
        path = "/wp-admin/plugins.php?import=github";
        subtitle = "Imported repository, token not stored after refresh";
      } else if (state.route === "blueprintUrl") {
        title = "Blueprint URL Preview";
        source = input.value.trim();
        subtitle = "Blueprint URL ran against current runtime";
      } else if (state.route === "zip") {
        title = `ZIP import: ${input.value.trim()}`;
        source = "Imported .zip archive";
        path = "/wp-admin/";
        subtitle = "Archive replaced files and database";
      }
      const existing = state.saved.find((item) => item.id === "unsaved");
      existing.title = title;
      existing.meta = subtitle;
      setActive({ id: "unsaved", title, subtitle, source, path, storage: "temporary" });
      $("#previewMode").textContent = route.type;
      $("#previewHeadline").textContent = title;
      $("#previewCopy").textContent = "The active preview now reflects the completed launch contract. Save, export, inspect files, or continue reviewing in WP Admin.";
      addHistory(`Completed ${route.title}; active identity, path, saved row, and preview updated.`);
      $("#contractState").textContent = "Preview running";
      $("#contractState").className = "state-badge running";
    });
  }

  function saveActive() {
    const destination = $("input[name='destination']:checked").value;
    const name = $("#saveName").value.trim() || "Saved Playground";
    const id = destination === "local" ? "local-review" : "browser-review";
    const labels = destination === "local"
      ? ["Requesting folder permission...", "Copying 1320 / 3751 files...", "Copying 3028 / 3751 files...", "Writing local directory manifest..."]
      : ["Saving 480 / 3751 files", "Saving 1842 / 3751 files", "Saving 3028 / 3751 files", "Saving browser slug and identity"];
    progress($("#saveProgress"), $("#saveProgressLabel"), labels, () => {
      const storage = destination === "local" ? "local" : "saved";
      const meta = destination === "local"
        ? `Backed by ${$("#folderName").value}. Permission required after refresh.`
        : "Saved in this browser with slug /review-browser-playground/.";
      state.saved = state.saved.filter((item) => item.id !== id);
      state.saved = state.saved.map((item) => item.id === "unsaved"
        ? { ...item, title: "Unsaved Playground", meta: "Available for the next temporary launch.", active: false }
        : { ...item, active: false });
      state.saved.unshift({ id, title: name, storage, meta, active: true });
      setActive({
        id,
        title: name,
        subtitle: meta,
        source: state.active.source,
        storage,
        path: destination === "local" ? "/wp-admin/?local-folder=connected" : "/review-browser-playground/"
      });
      addHistory(`${destination === "local" ? "Saved to local directory" : "Saved in this browser"}; shell title, path, storage badge, saved rows, and reload behavior updated.`);
    });
  }

  function confirmDelete() {
    const target = state.saved.find((item) => item.id === state.deleteTarget);
    if (!target) return;
    progress($("#deleteProgress"), null, ["Removing saved files...", "Updating saved list...", "Selecting fallback runtime..."], () => {
      const wasActive = state.active.id === target.id;
      state.saved = state.saved.filter((item) => item.id !== target.id);
      if (wasActive) {
        const fallback = state.saved.find((item) => item.id === "unsaved") || {
          id: "unsaved",
          title: "Unsaved Playground",
          storage: "temporary",
          meta: "Fallback temporary site after deletion.",
          active: true
        };
        if (!state.saved.find((item) => item.id === "unsaved")) state.saved.unshift(fallback);
        fallback.title = "Unsaved Playground";
        fallback.meta = "Fallback temporary site after deletion.";
        setActive({
          id: "unsaved",
          title: "Unsaved Playground",
          subtitle: "Fallback temporary site after saved deletion",
          source: "Vanilla WordPress",
          path: "/hello-from-playground/",
          storage: "temporary"
        });
        $("#previewHeadline").textContent = "Unsaved Playground";
        $("#previewCopy").textContent = "The deleted saved site is gone. The shell has fallen back to a temporary WordPress Playground.";
      }
      $("#deletePanel").classList.add("hidden");
      addHistory(`Deleted "${target.title}"; row removed and ${wasActive ? "active shell fell back to Unsaved Playground" : "saved list updated"}.`);
      renderSaved();
    });
  }

  function bind() {
    $$("[data-section-target]").forEach((button) => {
      button.addEventListener("click", () => setSection(button.dataset.sectionTarget));
    });
    $$("[data-jump]").forEach((button) => {
      button.addEventListener("click", () => setSection(button.dataset.jump));
    });
    $$(".route").forEach((button) => {
      button.addEventListener("click", () => {
        state.route = button.dataset.route;
        renderRoute();
      });
    });
    $("#validateContract").addEventListener("click", () => {
      const input = $("#routeInput");
      const valid = !input || input.value.trim().length > 0;
      $("#contractState").textContent = valid ? "Validated" : "Validation failed";
      $("#contractState").className = valid ? "state-badge saved" : "state-badge temporary";
      addHistory(valid ? `Validated ${routes[state.route].title} contract.` : `Validation failed for ${routes[state.route].title}; required input missing.`);
    });
    $("#runContract").addEventListener("click", runContract);
    $("#pathInput").addEventListener("change", (event) => {
      setActive({ path: event.target.value || "/" });
      addHistory(`Navigated active WordPress path to ${state.active.path}.`);
    });
    $("#homeButton").addEventListener("click", () => setActive({ path: "/hello-from-playground/" }));
    $("#adminButton").addEventListener("click", () => setActive({ path: "/wp-admin/" }));
    $("#refreshButton").addEventListener("click", () => addHistory(`Refreshed ${state.active.path} in the embedded WordPress preview.`));
    $("#previewRefresh").addEventListener("click", () => $("#refreshButton").click());
    $("#openSave").addEventListener("click", () => setSection("saved"));
    $("#cancelSave").addEventListener("click", () => setSection("launch"));
    $("#saveAction").addEventListener("click", saveActive);
    $$("input[name='destination']").forEach((radio) => {
      radio.addEventListener("change", () => {
        $$(".destination").forEach((label) => label.classList.toggle("is-selected", label.querySelector("input").checked));
        $("#folderName").disabled = radio.value !== "local" && !$("input[value='local']").checked;
      });
    });
    $("#cancelDelete").addEventListener("click", () => {
      $("#deletePanel").classList.add("hidden");
      addHistory("Cancelled destructive delete; saved row remains available.");
    });
    $("#confirmDelete").addEventListener("click", confirmDelete);
    $$(".mini-tab").forEach((button) => button.addEventListener("click", () => setManagerTab(button.dataset.managerTab)));
    $("#fileEditor").addEventListener("input", () => {
      $("#fileState").textContent = "Dirty, unsaved";
      $("#fileState").style.color = "#c1372b";
    });
    $("#saveFile").addEventListener("click", () => {
      $("#fileState").textContent = "Saved";
      $("#fileState").style.color = "#0a7f58";
      addHistory("Saved /wordpress/wp-config.php; file editor dirty state cleared.");
    });
    $("#discardFile").addEventListener("click", () => {
      $("#fileState").textContent = "Clean";
      $("#fileState").style.color = "";
      addHistory("Discarded file editor changes.");
    });
    ["newFile", "newFolder", "uploadFile", "browseFiles"].forEach((id) => {
      $(`#${id}`).addEventListener("click", () => addHistory(`${$(`#${id}`).textContent} completed in File browser.`));
    });
    $("#settingsReset").addEventListener("click", () => {
      if (state.active.storage !== "temporary") {
        addHistory("Stored Playground uses Save & Reload instead of destructive reset.");
        return;
      }
      $("#previewHeadline").textContent = "Resetting Playground...";
      window.setTimeout(() => {
        setActive({ title: "Unsaved Playground", subtitle: "Reset with latest runtime settings", source: "Vanilla WordPress", path: "/hello-from-playground/", storage: "temporary" });
        $("#previewHeadline").textContent = "Hello from WordPress Playground!";
        $("#previewCopy").textContent = "Settings were applied by resetting files and database for this temporary Playground.";
        addHistory("Confirmed destructive settings reset; preview, path, storage badge, and manager state updated.");
      }, 500);
    });
    $("#settingsReload").addEventListener("click", () => addHistory("Saved settings and reloaded WordPress without changing the saved identity."));
    $("#resetButton").addEventListener("click", () => {
      setSection("manager");
      setManagerTab("settings");
      addHistory("Opened reset controls in Site Manager settings.");
    });
    $("#openBlueprintManager").addEventListener("click", () => {
      setSection("manager");
      setManagerTab("blueprint");
    });
    $$(".chip").forEach((button) => button.addEventListener("click", () => {
      state.blueprintFilter = button.dataset.blueprintFilter;
      $$(".chip").forEach((chip) => chip.classList.toggle("is-active", chip === button));
      renderBlueprints();
    }));
    $("#blueprintSearch").addEventListener("input", renderBlueprints);
    $("#copyBlueprint").addEventListener("click", () => addHistory("Copied Blueprint URL to clipboard result state."));
    $("#downloadBlueprint").addEventListener("click", () => addHistory("Downloaded Blueprint bundle for current active Playground."));
    $("#runBlueprint").addEventListener("click", () => {
      $("#blueprintState").textContent = "Running replacement";
      window.setTimeout(() => {
        $("#blueprintState").textContent = "Run complete";
        $("#dbSize").textContent = "508 KB";
        $("#previewHeadline").textContent = state.selectedBlueprint.name;
        $("#previewCopy").textContent = `${state.selectedBlueprint.desc} The active Playground content and database now reflect the Blueprint run.`;
        addHistory(`Ran Blueprint "${state.selectedBlueprint.name}"; preview and SQLite size updated.`);
      }, 500);
    });
    ["downloadDb", "downloadDb2"].forEach((id) => $(`#${id}`).addEventListener("click", () => addHistory("Downloaded database.sqlite from /wordpress/wp-content/database/.ht.sqlite.")));
    $("#openAdminer").addEventListener("click", () => addHistory("Opened Adminer for the SQLite-backed database."));
    $("#openPhpmyadmin").addEventListener("click", () => addHistory("Opened phpMyAdmin database tool."));
    ["exportGithub", "exportGithub2"].forEach((id) => $(`#${id}`).addEventListener("click", () => addHistory("Exported active Playground to GitHub after repository selection.")));
    ["downloadZip", "downloadZip2"].forEach((id) => $(`#${id}`).addEventListener("click", () => addHistory("Generated and downloaded active Playground .zip archive.")));
    $("#connectGithub").addEventListener("click", () => addHistory("Connected GitHub account for import/export; token is session-only."));
    $("#zipChooser").addEventListener("click", () => addHistory("Native .zip chooser opened; replacement warning shown before import."));
    $("#clearHistory").addEventListener("click", () => {
      state.history = [];
      renderHistory();
    });
  }

  renderRoute();
  renderBlueprints();
  renderSaved();
  renderHistory();
  renderShell();
  bind();
})();
