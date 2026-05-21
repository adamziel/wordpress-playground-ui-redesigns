(function () {
  const state = {
    title: "Unsaved Playground",
    storage: "temporary",
    path: "/hello-from-playground/",
    selectedBlueprint: "Coffee Shop",
    selectedSavedRow: "current",
    selectedRoute: "GitHub import",
    settingsStoredPreview: false
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const shellTitle = $("#shell-title");
  const selectedCommand = $("#selected-command");
  const pathInput = $("#path-input");
  const browserUrl = $("#browser-url");
  const saveState = $("#save-state");
  const storageChip = $("#storage-chip");
  const runtimeBadge = $("#runtime-badge");
  const identityName = $("#identity-name");
  const identityDetail = $("#identity-detail");
  const identityStorage = $("#identity-storage");
  const rowCurrentTitle = $("#row-current-title");
  const rowCurrentDetail = $("#row-current-detail");
  const preview = $("#preview");
  const previewTitle = $("#preview-title");
  const previewBody = $("#preview-body");
  const previewRoute = $("#preview-route");
  const previewNote = $("#preview-note");
  const previewButton = $("#preview-button");
  const previewSiteTitle = $("#preview-site-title");
  const historyList = $("#history-list");

  function addHistory(message) {
    const li = document.createElement("li");
    li.innerHTML = `<span>Now</span> ${message}`;
    historyList.prepend(li);
  }

  function setCommand(label) {
    selectedCommand.textContent = `Selected command: ${label}`;
  }

  function updatePath(path) {
    state.path = path;
    pathInput.value = path;
    browserUrl.textContent = `playground.wordpress.net${path}`;
  }

  function setBadge(el, label, type) {
    el.textContent = label;
    el.classList.remove("blue", "green", "amber", "red");
    if (type) el.classList.add(type);
  }

  function updateIdentity() {
    shellTitle.textContent = state.title;
    identityName.textContent = state.title;
    rowCurrentTitle.textContent = state.title;

    if (state.storage === "browser") {
      setBadge(saveState, "Saved Playground", "green");
      setBadge(identityStorage, "Browser saved", "green");
      storageChip.textContent = "Browser saved: research-browser-playground";
      storageChip.style.color = "var(--green)";
      identityDetail.textContent = "Browser-backed identity with slug /?site=research-browser-playground.";
      rowCurrentDetail.textContent = "Browser saved. Created May 21, 2026. Slug research-browser-playground.";
    } else if (state.storage === "local") {
      setBadge(saveState, "Local directory", "green");
      setBadge(identityStorage, "Local directory", "green");
      storageChip.textContent = "Local folder: ~/Sites/playground-transfer-lab";
      storageChip.style.color = "var(--green)";
      identityDetail.textContent = "Local directory backed. Reload reads from ~/Sites/playground-transfer-lab.";
      rowCurrentDetail.textContent = "Local directory saved. Permission granted for ~/Sites/playground-transfer-lab.";
    } else {
      setBadge(saveState, "Temporary", "amber");
      setBadge(identityStorage, "Temporary", "amber");
      storageChip.textContent = "Unsaved: lost on refresh";
      storageChip.style.color = "var(--amber)";
      identityDetail.textContent = "Temporary runtime. Save before refresh, close, reset, or replacement.";
      rowCurrentDetail.textContent = "Temporary. Not saved to browser storage.";
    }
  }

  function showPanel(panelName) {
    $$(".panel-tabs button").forEach((button) => {
      button.classList.toggle("active", button.dataset.panel === panelName);
    });
    $$(".panel").forEach((panel) => {
      panel.classList.toggle("active", panel.id === `panel-${panelName}`);
    });

    const labels = {
      blueprint: "Blueprint bundle run",
      transfers: "Transfer routes and save",
      settings: "Runtime settings",
      manage: "Saved Playground management",
      site: "Site Manager"
    };
    setCommand(labels[panelName] || panelName);
  }

  $$(".panel-tabs button, [data-panel]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.panel) showPanel(button.dataset.panel);
    });
  });

  $("#manager-toggle").addEventListener("click", () => showPanel("site"));

  pathInput.addEventListener("change", () => {
    updatePath(pathInput.value || "/");
    previewRoute.textContent = "Path navigation";
    addHistory(`Navigated active browser to ${state.path}.`);
  });

  $("#refresh-btn").addEventListener("click", () => {
    previewRoute.textContent = "Browser refreshed";
    addHistory(`Refreshed ${state.path} without leaving the transfer deck.`);
  });

  $("#home-btn").addEventListener("click", () => {
    preview.classList.remove("admin");
    updatePath("/hello-from-playground/");
    previewRoute.textContent = "Homepage";
    addHistory("Homepage opened in the live WordPress browser.");
  });

  $("#admin-btn").addEventListener("click", () => {
    preview.classList.add("admin");
    updatePath("/wp-admin/");
    previewRoute.textContent = "WP Admin";
    previewTitle.innerHTML = "WordPress <span>Dashboard</span>";
    previewBody.textContent = "The embedded admin stays live while the inspector handles transfers, files, runtime settings, database tools, and logs.";
    previewNote.textContent = "Logged in as admin.";
    previewButton.textContent = "Open Site Editor";
    addHistory("WP Admin opened in the protected live browser.");
  });

  $("#reset-current").addEventListener("click", () => {
    preview.classList.remove("coffee", "admin");
    state.title = "Unsaved Playground";
    state.storage = "temporary";
    updateIdentity();
    updatePath("/hello-from-playground/");
    previewRoute.textContent = "Temporary Playground reset";
    previewTitle.innerHTML = "Hello from <span>WordPress Playground!</span>";
    previewBody.textContent = "This temporary runtime was reset. Save to browser storage or a local directory before closing or replacing it.";
    previewNote.textContent = "Unsaved reset completed.";
    addHistory("Current unsaved Playground reset and returned to the welcome page.");
  });

  const blueprints = {
    "Coffee Shop": {
      description: "A stylish WooCommerce coffee shop storefront",
      jsonTitle: "Coffee Shop",
      route: "/",
      previewTitle: "Coffee Shop",
      body: "WooCommerce products, storefront pages, and sample coffee content were installed from the selected Blueprint bundle.",
      note: "Blueprint run completed: 7 steps applied."
    },
    "Art Gallery": {
      description: "An art gallery created with the Vueo theme",
      jsonTitle: "Art Gallery",
      route: "/",
      previewTitle: "Art Gallery",
      body: "Gallery pages, artwork posts, and theme settings are ready for inspection in the live browser.",
      note: "Blueprint selected. Validate before replacing current content."
    },
    "Feed Reader with the Friends Plugin": {
      description: "RSS and social web reader setup",
      jsonTitle: "Feed Reader with the Friends Plugin",
      route: "/wp-admin/admin.php?page=friends",
      previewTitle: "Friends Feed Reader",
      body: "The Friends plugin setup is prepared with feed subscriptions and reader pages.",
      note: "Blueprint selected. Validate before replacing current content."
    },
    "Gaming News": {
      description: "A gaming news site created with the Spiel theme",
      jsonTitle: "Gaming News",
      route: "/",
      previewTitle: "Gaming News",
      body: "News posts, theme layout, and sample media are queued for replacement.",
      note: "Blueprint selected. Validate before replacing current content."
    },
    "Non-profit Organization": {
      description: "A non-profit organization site created with the Koinonia theme",
      jsonTitle: "Non-profit Organization",
      route: "/",
      previewTitle: "Non-profit Organization",
      body: "Donation-focused pages and organization content are prepared.",
      note: "Blueprint selected. Validate before replacing current content."
    },
    "Personal Blog": {
      description: "A personal blog created with the Substrata theme",
      jsonTitle: "Personal Blog",
      route: "/",
      previewTitle: "Personal Blog",
      body: "Personal posts and blog theme settings are prepared.",
      note: "Blueprint selected. Validate before replacing current content."
    }
  };

  function selectBlueprint(name) {
    state.selectedBlueprint = name;
    const blueprint = blueprints[name];
    $("#selected-blueprint-title").textContent = name;
    $("#blueprint-stage").textContent = "Inspecting JSON";
    $("#blueprint-stage").className = "status-badge blue";
    $("#editor-state").textContent = "blueprint.json clean";
    $("#blueprint-json").value = JSON.stringify({
      $schema: "https://playground.wordpress.net/blueprint-schema.json",
      meta: {
        title: blueprint.jsonTitle,
        description: blueprint.description
      },
      landingPage: blueprint.route,
      preferredVersions: {
        php: "8.3",
        wp: "latest"
      },
      steps: [
        { step: "login", username: "admin" },
        { step: "installTheme", themeSlug: "twentytwentyfive" },
        { step: "runPHP", code: "<?php /* apply blueprint content */" }
      ]
    }, null, 2);
    $("#replace-warning").classList.add("hidden");
    $("#blueprint-result").classList.add("hidden");
    $("#blueprint-progress").classList.add("hidden");
    $$(".blueprint-card").forEach((card) => {
      card.classList.toggle("active", card.dataset.blueprint === name);
    });
    setCommand(`Inspect ${name} Blueprint`);
    addHistory(`${name} Blueprint selected from representative gallery subset.`);
  }

  $$(".blueprint-card").forEach((card) => {
    card.addEventListener("click", () => selectBlueprint(card.dataset.blueprint));
  });

  $("#blueprint-json").addEventListener("input", () => {
    $("#editor-state").textContent = "blueprint.json dirty";
    $("#blueprint-stage").textContent = "Needs validation";
    $("#blueprint-stage").className = "status-badge amber";
  });

  $("#validate-blueprint").addEventListener("click", () => {
    try {
      JSON.parse($("#blueprint-json").value);
      $("#editor-state").textContent = "valid JSON";
      $("#blueprint-stage").textContent = "Valid";
      $("#blueprint-stage").className = "status-badge green";
      $("#blueprint-result").classList.remove("hidden");
      $("#blueprint-result").textContent = `${state.selectedBlueprint} validated. Replacement warning is required before running.`;
      addHistory(`${state.selectedBlueprint} Blueprint JSON validated successfully.`);
    } catch (error) {
      $("#editor-state").textContent = "JSON error";
      $("#blueprint-stage").textContent = "Validation failed";
      $("#blueprint-stage").className = "status-badge red";
      $("#blueprint-result").classList.remove("hidden");
      $("#blueprint-result").textContent = `Validation failed: ${error.message}`;
      addHistory("Blueprint validation failed and run was blocked.");
    }
  });

  $("#prepare-run").addEventListener("click", () => {
    $("#replace-warning").classList.remove("hidden");
    $("#blueprint-result").classList.add("hidden");
    $("#blueprint-stage").textContent = "Replacement warning";
    $("#blueprint-stage").className = "status-badge amber";
    setCommand("Confirm Blueprint replacement");
    addHistory(`${state.selectedBlueprint} run paused for replace-current confirmation.`);
  });

  $("#cancel-run").addEventListener("click", () => {
    $("#replace-warning").classList.add("hidden");
    $("#blueprint-stage").textContent = "Run canceled";
    $("#blueprint-stage").className = "status-badge amber";
    addHistory("Blueprint replacement canceled. Active Playground unchanged.");
  });

  $("#confirm-run").addEventListener("click", () => {
    $("#replace-warning").classList.add("hidden");
    runProgress({
      card: $("#blueprint-progress"),
      bar: $("#blueprint-progress-bar"),
      count: $("#blueprint-progress-count"),
      label: $("#blueprint-progress-label"),
      total: 7,
      unit: "steps",
      startLabel: "Running Blueprint",
      doneLabel: "Blueprint applied",
      onDone: finishBlueprintRun
    });
  });

  function finishBlueprintRun() {
    const blueprint = blueprints[state.selectedBlueprint];
    preview.classList.remove("admin");
    preview.classList.add("coffee");
    previewRoute.textContent = "Blueprint result";
    previewTitle.innerHTML = `${blueprint.previewTitle} <span>is running</span>`;
    previewBody.textContent = blueprint.body;
    previewNote.textContent = blueprint.note;
    previewButton.textContent = "Review generated pages";
    previewSiteTitle.textContent = blueprint.previewTitle;
    updatePath(blueprint.route);
    $("#blueprint-stage").textContent = "Applied";
    $("#blueprint-stage").className = "status-badge green";
    $("#blueprint-result").classList.remove("hidden");
    $("#blueprint-result").textContent = `${state.selectedBlueprint} applied. Current content was replaced and the preview is now showing the Blueprint landing page.`;
    $("#db-size").textContent = "688 KB";
    addHistory(`${state.selectedBlueprint} replaced current content, updated preview, and changed database size to 688 KB.`);
  }

  $("#copy-blueprint").addEventListener("click", () => addHistory(`${state.selectedBlueprint} Blueprint link copied.`));
  $("#download-blueprint").addEventListener("click", () => addHistory(`${state.selectedBlueprint} bundle downloaded as blueprint.zip.`));
  $("#run-url").addEventListener("click", () => {
    $("#blueprint-result").classList.remove("hidden");
    $("#blueprint-result").textContent = "Blueprint URL validated. Inspect JSON before running over the current Playground.";
    addHistory("Blueprint URL validated and loaded into the editor.");
  });

  function runProgress(options) {
    options.card.classList.remove("hidden");
    options.bar.style.width = "0%";
    options.label.textContent = options.startLabel;
    let current = 0;
    const interval = window.setInterval(() => {
      current += 1;
      const percent = Math.min(100, Math.round((current / options.total) * 100));
      options.bar.style.width = `${percent}%`;
      options.count.textContent = `${Math.min(current, options.total)} / ${options.total} ${options.unit}`;
      if (current >= options.total) {
        window.clearInterval(interval);
        options.label.textContent = options.doneLabel;
        window.setTimeout(options.onDone, 250);
      }
    }, 180);
  }

  $$(".route-card").forEach((card) => {
    card.addEventListener("click", () => {
      state.selectedRoute = card.dataset.route;
      $$(".route-card").forEach((item) => item.classList.toggle("active", item === card));
      const input = $("#route-input");
      const note = $("#route-note");
      const routeText = {
        "Vanilla WordPress": ["Starts immediately; warns if replacing an unsaved Playground.", "Fresh latest WordPress runtime with admin logged in."],
        "WordPress PR": ["PR NUMBER OR URL", "Preview a WordPress core PR without leaving the shell."],
        "Gutenberg PR or branch": ["PR NUMBER, URL, OR BRANCH NAME", "Preview a Gutenberg PR or branch with the current runtime options."],
        "GitHub import": ["Connect GitHub account to choose a public repository", "Token is not stored and re-authentication is required after refresh."],
        "Blueprint URL": ["https://playground.wordpress.net/blueprint.json", "URL is validated before replacement warning and run."],
        "Import .zip": ["Native file chooser opens; no file selected yet", "Import replaces files and database after confirmation."]
      };
      input.value = routeText[state.selectedRoute][0];
      note.textContent = routeText[state.selectedRoute][1];
      setCommand(`Create route: ${state.selectedRoute}`);
      addHistory(`${state.selectedRoute} route selected with its real input requirement.`);
    });
  });

  $("#route-start").addEventListener("click", () => {
    if (state.selectedRoute === "Blueprint URL") {
      showPanel("blueprint");
      addHistory("Blueprint URL route moved into JSON inspection.");
      return;
    }
    if (state.selectedRoute === "Import .zip") {
      addHistory("ZIP import picker opened. Replacement confirmation required after file selection.");
      return;
    }
    if (state.selectedRoute === "GitHub import") {
      addHistory("GitHub account connection requested before repository import.");
      return;
    }
    state.title = state.selectedRoute === "Vanilla WordPress" ? "Unsaved Playground" : `${state.selectedRoute} Preview`;
    state.storage = "temporary";
    updateIdentity();
    previewRoute.textContent = state.selectedRoute;
    addHistory(`${state.selectedRoute} started as a temporary Playground.`);
  });

  function saveTo(destination) {
    const browser = destination === "browser";
    $("#save-flow-state").textContent = browser ? "Saving to browser" : "Requesting folder";
    $("#save-flow-state").className = "status-badge amber";
    $$(".destination-card").forEach((card) => card.classList.remove("active"));
    $(browser ? "#save-browser" : "#save-local").classList.add("active");
    const total = browser ? 3751 : 3751;
    runProgress({
      card: $("#save-progress"),
      bar: $("#save-progress-bar"),
      count: $("#save-progress-count"),
      label: $("#save-progress-label"),
      total,
      unit: "files",
      startLabel: browser ? "Saving to browser storage" : "Writing to chosen local directory",
      doneLabel: browser ? "Browser save complete" : "Local directory save complete",
      onDone: () => {
        state.storage = browser ? "browser" : "local";
        state.title = browser ? "Research Browser Playground" : "Local Directory Playground";
        updateIdentity();
        updatePath(browser ? "/hello-from-playground/?site=research-browser-playground" : "/hello-from-playground/?local=playground-transfer-lab");
        $("#save-flow-state").textContent = browser ? "Browser saved" : "Local folder connected";
        $("#save-flow-state").className = "status-badge green";
        $("#settings-mode").textContent = "Stored Save & Reload";
        $("#settings-mode").className = "status-badge green";
        $("#apply-settings").textContent = "Save & Reload";
        $("#apply-settings").classList.remove("danger");
        $("#apply-settings").classList.add("primary");
        $("[data-row='current']").classList.add("active");
        addHistory(browser
          ? "Temporary row transformed into a browser-saved Playground with slug research-browser-playground."
          : "Temporary row transformed into a local-directory Playground with folder permission granted.");
      }
    });
  }

  $("#save-browser").addEventListener("click", () => saveTo("browser"));
  $("#save-local").addEventListener("click", () => saveTo("local"));

  $$(".action-matrix [data-transfer], [data-transfer]").forEach((button) => {
    button.addEventListener("click", () => addHistory(button.dataset.transfer));
  });

  $("#settings-preview").addEventListener("click", () => {
    state.settingsStoredPreview = !state.settingsStoredPreview;
    if (state.settingsStoredPreview) {
      $("#settings-warning").innerHTML = "<strong>Stored behavior preview.</strong><p>Saved browser and local-directory Playgrounds keep identity and use Save & Reload. Some settings are limited.</p>";
      $("#settings-mode").textContent = "Stored Save & Reload";
      $("#settings-mode").className = "status-badge green";
      $("#apply-settings").textContent = "Save & Reload";
      $("#apply-settings").classList.remove("danger");
      $("#apply-settings").classList.add("primary");
    } else {
      $("#settings-warning").innerHTML = "<strong>Applying settings resets an unsaved Playground.</strong><p>Saved browser and local-directory Playgrounds use Save & Reload with limited configuration options.</p>";
      $("#settings-mode").textContent = "Unsaved reset warning";
      $("#settings-mode").className = "status-badge amber";
      $("#apply-settings").textContent = "Apply Settings & Reset Playground";
      $("#apply-settings").classList.add("danger");
      $("#apply-settings").classList.remove("primary");
    }
  });

  $("#apply-settings").addEventListener("click", () => {
    const stored = state.storage !== "temporary" || state.settingsStoredPreview;
    runProgress({
      card: $("#settings-progress"),
      bar: $("#settings-progress-bar"),
      count: $("#settings-progress-count"),
      label: $("#settings-progress-label"),
      total: 5,
      unit: "tasks",
      startLabel: stored ? "Saving settings and reloading" : "Resetting temporary runtime",
      doneLabel: stored ? "Stored reload complete" : "Reset complete",
      onDone: () => {
        const wp = $("#wp-version").value;
        const php = $("#php-version").value;
        const language = $("#language").value;
        runtimeBadge.textContent = `WP ${wp} / PHP ${php}`;
        previewRoute.textContent = stored ? "Stored reload" : "Settings reset";
        previewNote.textContent = stored ? "Saved identity preserved after reload." : "Temporary content was reset by settings.";
        $("#settings-result").classList.remove("hidden");
        $("#settings-result").textContent = stored
          ? `Save & Reload completed with ${language}, network ${$("#network-access").checked ? "enabled" : "disabled"}, multisite ${$("#multisite").checked ? "enabled" : "disabled"}.`
          : `Temporary Playground reset with ${language}, network ${$("#network-access").checked ? "enabled" : "disabled"}, multisite ${$("#multisite").checked ? "enabled" : "disabled"}.`;
        addHistory(stored
          ? `Runtime Save & Reload finished: WP ${wp}, PHP ${php}, ${language}.`
          : `Destructive settings reset finished: WP ${wp}, PHP ${php}, ${language}.`);
      }
    });
  });

  $$(".saved-row").forEach((row) => {
    row.addEventListener("click", () => {
      state.selectedSavedRow = row.dataset.row;
      $$(".saved-row").forEach((item) => item.classList.toggle("active", item === row));
      addHistory(`${row.querySelector("strong").textContent} selected in saved management.`);
    });
  });

  $("[data-open-row='research']").addEventListener("click", (event) => {
    event.stopPropagation();
    state.title = "Research Browser Playground";
    state.storage = "browser";
    updateIdentity();
    addHistory("Research Browser Playground opened from saved list.");
  });

  $("[data-open-row='local']").addEventListener("click", (event) => {
    event.stopPropagation();
    state.title = "Local Theme Lab";
    state.storage = "local";
    updateIdentity();
    addHistory("Local Theme Lab opened with local directory permission.");
  });

  $("#rename-current").addEventListener("click", () => {
    $("#rename-box").classList.remove("hidden");
    $("#delete-box").classList.add("hidden");
    $("#rename-input").value = state.title;
  });

  $("#confirm-rename").addEventListener("click", () => {
    state.title = $("#rename-input").value || state.title;
    updateIdentity();
    $("#rename-box").classList.add("hidden");
    $("#manage-result").classList.remove("hidden");
    $("#manage-result").textContent = `Saved row renamed to ${state.title}.`;
    addHistory(`Saved Playground renamed to ${state.title}.`);
  });

  $("#delete-current").addEventListener("click", () => {
    $("#delete-box").classList.remove("hidden");
    $("#rename-box").classList.add("hidden");
  });

  $("#cancel-delete").addEventListener("click", () => {
    $("#delete-box").classList.add("hidden");
    addHistory("Delete canceled. Saved list unchanged.");
  });

  $("#confirm-delete").addEventListener("click", () => {
    const active = $(".saved-row.active");
    if (active && active.dataset.row !== "current") {
      active.remove();
    }
    state.title = "Unsaved Playground";
    state.storage = "temporary";
    state.selectedSavedRow = "current";
    updateIdentity();
    $$(".saved-row").forEach((row) => row.classList.toggle("active", row.dataset.row === "current"));
    $("#delete-box").classList.add("hidden");
    $("#manage-result").classList.remove("hidden");
    $("#manage-result").textContent = "Saved row deleted. Active browser fell back to the unsaved Playground.";
    addHistory("Delete confirmed. Saved row removed and active site returned to unsaved fallback.");
  });

  $$(".site-tabs button").forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.siteTab;
      $$(".site-tabs button").forEach((item) => item.classList.toggle("active", item === button));
      $$(".site-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `site-${tab}`));
      $("#site-tab-label").textContent = button.textContent;
      addHistory(`Site Manager tab opened: ${button.textContent}.`);
    });
  });

  $$("[data-file-action]").forEach((button) => {
    button.addEventListener("click", () => {
      $("#file-state").textContent = "saved";
      addHistory(button.dataset.fileAction);
    });
  });

  $("#clear-history").addEventListener("click", () => {
    historyList.innerHTML = "<li><span>Now</span> Transfer history cleared for this static exploration.</li>";
  });

  updateIdentity();
  updatePath(state.path);
})();
