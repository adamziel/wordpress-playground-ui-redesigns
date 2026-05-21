const objects = [
  {
    id: 'temp',
    name: 'Unsaved Playground',
    route: 'Vanilla WordPress',
    storage: 'Temporary',
    state: 'temporary',
    last: 'Created at /hello-from-playground/',
    path: '/hello-from-playground/',
    active: true,
    meta: 'Temporary session, lost on refresh or close.',
  },
  {
    id: 'research-browser',
    name: 'Research Browser Playground',
    route: 'Saved Playground',
    storage: 'Browser storage',
    state: 'saved',
    last: 'Saved in this browser a moment ago',
    path: '/research-browser-playground/',
    active: false,
    meta: 'Browser-backed saved identity with a stable slug.',
  },
  {
    id: 'theme-local',
    name: 'Theme Lab Directory',
    route: 'Local directory save',
    storage: '~/Sites/theme-lab',
    state: 'local-permission',
    last: 'Folder permission required after reload',
    path: '/theme-lab/',
    active: false,
    meta: 'Folder-backed Playground. Reconnect the local directory before editing.',
  },
  {
    id: 'github-export',
    name: 'GitHub export package',
    route: 'Export to GitHub',
    storage: 'Remote repository',
    state: 'ready',
    last: 'Repository not selected',
    path: '/wp-admin/',
    active: false,
    meta: 'Portable transfer target for pushing the active Playground to a repository branch.',
  },
];

const blueprints = [
  {
    title: 'Art Gallery',
    tags: ['Featured', 'Website', 'Personal', 'Themes'],
    copy: 'An art gallery created with the Vue theme.',
    url: 'https://playground.wordpress.net/blueprints/art-gallery.json',
  },
  {
    title: 'Coffee Shop',
    tags: ['Featured', 'WooCommerce', 'Website'],
    copy: 'A stylized WooCommerce coffee shop storefront with custom content.',
    url: 'https://playground.wordpress.net/blueprints/coffee-shop.json',
  },
  {
    title: 'Feed Reader with the Friends Plugin',
    tags: ['Featured', 'Content', 'Experiments'],
    copy: 'Read feeds from the web in Playground using the Friends plugin.',
    url: 'https://playground.wordpress.net/blueprints/friends-feed-reader.json',
  },
  {
    title: 'Gaming News',
    tags: ['Featured', 'Website', 'News'],
    copy: 'A gaming news site created with the Spiel theme.',
    url: 'https://playground.wordpress.net/blueprints/gaming-news.json',
  },
  {
    title: 'Non-profit Organization',
    tags: ['Featured', 'Website'],
    copy: 'A non-profit organization site created with the Koinonia theme.',
    url: 'https://playground.wordpress.net/blueprints/non-profit.json',
  },
  {
    title: 'Personal Blog',
    tags: ['Personal', 'Website', 'Themes'],
    copy: 'A personal blog created with the Substrata theme.',
    url: 'https://playground.wordpress.net/blueprints/personal-blog.json',
  },
];

const state = {
  selectedId: 'temp',
  destination: 'browser',
  localGranted: false,
  selectedBlueprint: blueprints[1],
  activeCategory: 'All',
  modal: null,
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'saved-playground';
}

function getActive() {
  return objects.find((object) => object.active) || objects[0];
}

function getSelected() {
  return objects.find((object) => object.id === state.selectedId) || getActive();
}

function stateClass(stateName) {
  if (['saved', 'local', 'exported', 'ready'].includes(stateName)) return 'green';
  if (['temporary', 'local-permission', 'saving'].includes(stateName)) return 'amber';
  if (['deleting', 'resetting', 'failed'].includes(stateName)) return 'red';
  return 'blue';
}

function stateLabel(stateName) {
  const labels = {
    temporary: 'Temporary',
    saved: 'Saved',
    local: 'Local',
    'local-permission': 'Local permission',
    saving: 'Saving',
    imported: 'Imported',
    exported: 'Exported',
    deleting: 'Deleting',
    resetting: 'Resetting',
    ready: 'Ready',
    failed: 'Failed',
  };
  return labels[stateName] || stateName;
}

function addHistory(kind, text) {
  const item = document.createElement('li');
  item.innerHTML = `<span class="state-pill ${stateClass(kind)}">${stateLabel(kind)}</span> ${escapeHtml(text)}`;
  $('#historyList').prepend(item);
}

function setActive(id) {
  objects.forEach((object) => {
    object.active = object.id === id;
  });
  state.selectedId = id;
  updateShell();
  renderRows();
  renderDetail();
}

function selectObject(id) {
  state.selectedId = id;
  renderRows();
  renderDetail();
}

function updateShell() {
  const active = getActive();
  $('#shellTitle').textContent = active.name;
  $('#pathInput').value = active.path;
  $('#summaryPath').textContent = active.path;
  $('#previewUrl').textContent = `playground.local${active.path}`;
  $('#storageBadge').className = `state-pill ${stateClass(active.state)}`;
  $('#storageBadge').textContent = stateLabel(active.state);
  $('#resetBehavior').textContent = active.state === 'saved' || active.state === 'local'
    ? 'Settings use Save and Reload'
    : 'Reset discards this temporary site';
  $('#settingsConsequence').textContent = active.state === 'saved' || active.state === 'local'
    ? 'Stored Playground reload'
    : 'Temporary reset warning';
  $('#settingsCopy').textContent = active.state === 'saved' || active.state === 'local'
    ? 'Stored Playgrounds have limited configuration options. Save and Reload preserves the selected identity.'
    : 'Applying settings to this unsaved Playground resets files, database, and installed content.';
  $('#exportAvailability').textContent = active.state === 'temporary'
    ? 'Available, but unsaved changes remain temporary'
    : 'Available for this saved identity';
}

function renderRows() {
  const rows = objects.map((object) => {
    const activeText = object.active ? 'Active shell' : 'Selectable';
    const rowClass = [
      'object-row',
      object.id === state.selectedId ? 'is-active' : '',
      object.state === 'saving' ? 'is-saving' : '',
      object.state === 'deleting' ? 'is-deleting' : '',
    ].filter(Boolean).join(' ');

    return `
      <div class="${rowClass}" role="row" data-id="${escapeHtml(object.id)}">
        <div class="object-cell" role="cell">
          <strong>${escapeHtml(object.name)}</strong>
          <small>${activeText}</small>
        </div>
        <div class="object-cell" role="cell"><span>${escapeHtml(object.route)}</span></div>
        <div class="object-cell" role="cell"><span>${escapeHtml(object.storage)}</span></div>
        <div class="object-cell" role="cell"><span class="state-pill ${stateClass(object.state)}">${stateLabel(object.state)}</span></div>
        <div class="object-cell" role="cell"><span>${escapeHtml(object.last)}</span></div>
        <div class="object-cell row-actions" role="cell">
          <button type="button" data-row-action="open" data-id="${escapeHtml(object.id)}">Open</button>
          <button type="button" data-row-action="manage" data-id="${escapeHtml(object.id)}">Manage</button>
          <button type="button" data-row-action="rename" data-id="${escapeHtml(object.id)}">Rename</button>
          <button class="danger" type="button" data-row-action="delete" data-id="${escapeHtml(object.id)}">Delete</button>
        </div>
      </div>
    `;
  }).join('');

  $('#objectRows').innerHTML = rows;
}

function renderDetail() {
  const selected = getSelected();
  $('#detailTitle').textContent = selected.name;
  $('#detailMeta').textContent = selected.meta;
  $('#detailState').className = `state-pill ${stateClass(selected.state)}`;
  $('#detailState').textContent = stateLabel(selected.state);
}

function updatePreviewForActive(headline, copy, notice) {
  const active = getActive();
  $('#wpAdminSite').textContent = active.name;
  $('#previewSiteName').textContent = active.name;
  $('#previewHeadline').textContent = headline;
  $('#previewCopy').textContent = copy;
  $('#previewNotice').textContent = notice;
  $('#previewStatus').className = `state-pill ${stateClass(active.state)}`;
  $('#previewStatus').textContent = stateLabel(active.state);
}

function setPath(path) {
  const active = getActive();
  active.path = path;
  $('#pathInput').value = path;
  $('#summaryPath').textContent = path;
  $('#previewUrl').textContent = `playground.local${path}`;
}

function switchView(view) {
  $$('.deck-tabs button').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.view === view);
  });
  $$('.view').forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.viewPanel === view);
  });
}

function switchManager(panelName) {
  $$('.manager-tabs button').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.manager === panelName);
  });
  $$('.manager-panel').forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.managerPanel === panelName);
  });
}

function setDestination(destination) {
  state.destination = destination;
  $$('.destination').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.destination === destination);
  });
  $('#localPermission').hidden = destination !== 'local';
  $('#progressDetail').textContent = destination === 'local'
    ? 'Destination: local directory, permission required'
    : 'Destination: browser storage';
}

function startMeter(progressSelector, labelSelector, detailSelector, steps, onDone) {
  let index = 0;
  const progress = $(progressSelector);
  const label = $(labelSelector);
  const detail = $(detailSelector);
  progress.style.width = '0%';
  const timer = window.setInterval(() => {
    const step = steps[index];
    progress.style.width = `${step.percent}%`;
    label.textContent = step.label;
    detail.textContent = step.detail;
    index += 1;
    if (index >= steps.length) {
      window.clearInterval(timer);
      window.setTimeout(onDone, 220);
    }
  }, 260);
}

function startSave() {
  const active = getActive();

  if (state.destination === 'local' && !state.localGranted) {
    active.state = 'local-permission';
    active.storage = 'Local directory pending';
    active.last = 'Waiting for folder permission';
    addHistory('local-permission', 'Local directory save is waiting for folder permission.');
    renderRows();
    renderDetail();
    updateShell();
    $('#localPermission').hidden = false;
    $('#progressLabel').textContent = 'Folder permission required before copying files';
    $('#progressDetail').textContent = 'Grant or deny access to ~/Sites/playground-transfer-lab.';
    return;
  }

  const name = $('#saveName').value.trim() || 'Saved Playground';
  active.name = name;
  active.state = 'saving';
  active.last = state.destination === 'local'
    ? 'Copying to local directory'
    : 'Copying to browser storage';
  active.storage = state.destination === 'local' ? '~/Sites/playground-transfer-lab' : 'Browser storage';
  renderRows();
  renderDetail();
  updateShell();
  addHistory('saving', `${name} started saving to ${state.destination === 'local' ? 'a local directory' : 'browser storage'}.`);

  startMeter(
    '#progressBar',
    '#progressLabel',
    '#progressDetail',
    [
      { percent: 12, label: 'Saving 421 / 3751 files', detail: 'Copying WordPress core files.' },
      { percent: 38, label: 'Saving 1428 / 3751 files', detail: 'Copying wp-content and uploads.' },
      { percent: 68, label: 'Saving 2558 / 3751 files', detail: 'Copying database and configuration.' },
      { percent: 100, label: 'Saving 3751 / 3751 files', detail: 'Finalizing saved identity.' },
    ],
    () => {
      active.state = state.destination === 'local' ? 'local' : 'saved';
      active.storage = state.destination === 'local' ? '~/Sites/playground-transfer-lab' : 'Browser storage';
      active.last = state.destination === 'local'
        ? 'Saved to local directory with reconnect consequence'
        : 'Saved in this browser with stable slug';
      active.path = `/${slugify(name)}/`;
      active.meta = state.destination === 'local'
        ? 'Local-directory saved Playground. Future reloads may ask to reconnect the folder.'
        : 'Browser-backed saved Playground with a stable slug in this browser.';
      updateShell();
      renderRows();
      renderDetail();
      updatePreviewForActive(
        `${name} is saved`,
        state.destination === 'local'
          ? 'This Playground is backed by a local directory. Folder permission may be requested again after reload.'
          : 'This Playground is saved in browser storage and can be reopened from the saved table.',
        state.destination === 'local' ? 'Local directory save complete.' : 'Browser save complete.'
      );
      addHistory(active.state, `${name} saved. The same active row transformed from temporary to ${state.destination === 'local' ? 'local' : 'browser-saved'}.`);
    }
  );
}

function grantLocal() {
  state.localGranted = true;
  $('#progressLabel').textContent = 'Folder permission granted';
  $('#progressDetail').textContent = 'Ready to copy 3,751 files into ~/Sites/playground-transfer-lab.';
  addHistory('ready', 'Local directory permission granted for ~/Sites/playground-transfer-lab.');
  startSave();
}

function denyLocal() {
  state.localGranted = false;
  const active = getActive();
  active.state = 'temporary';
  active.storage = 'Temporary';
  active.last = 'Local folder permission denied; still temporary';
  $('#progressLabel').textContent = 'Local directory save canceled';
  $('#progressDetail').textContent = 'No files copied. The active Playground remains temporary.';
  addHistory('failed', 'Local directory permission denied. Active Playground remains temporary.');
  updateShell();
  renderRows();
  renderDetail();
}

function previewRoute(route) {
  const active = getActive();
  const config = {
    'wordpress-pr': {
      input: $('#wpPrInput').value.trim(),
      label: 'WordPress PR Preview',
      status: '#wpPrStatus',
      route: 'WordPress PR',
      path: '/wp-admin/about.php?pr=7821',
      headline: 'WordPress PR preview is running',
      copy: 'The core pull request was validated, built, and loaded into the active Playground. Save, export, files, database, and logs are available.',
    },
    'gutenberg-pr': {
      input: $('#gbPrInput').value.trim(),
      label: 'Gutenberg Branch Preview',
      status: '#gbPrStatus',
      route: 'Gutenberg PR or branch',
      path: '/wp-admin/site-editor.php?canvas=edit',
      headline: 'Gutenberg branch preview is running',
      copy: 'The Gutenberg plugin build is mounted in WordPress. Save and export actions are now available for this preview identity.',
    },
  }[route];

  if (!config.input) {
    $(config.status).textContent = 'Validation failed. Enter a PR number, URL, or branch name.';
    addHistory('failed', `${config.route} validation failed because the input was empty.`);
    return;
  }

  active.name = config.label;
  active.route = config.route;
  active.storage = 'Temporary preview';
  active.state = 'imported';
  active.last = `Validating ${config.input}`;
  active.meta = `${config.route} built from ${config.input}. Result is temporary until saved.`;
  $(config.status).textContent = 'Validating input and building WordPress runtime.';
  $('#previewStatus').textContent = 'Loading';
  $('#previewStatus').className = 'state-pill blue';
  renderRows();
  renderDetail();
  updateShell();
  addHistory('imported', `${config.route} input validated: ${config.input}.`);

  window.setTimeout(() => {
    active.last = `Preview ready from ${config.input}`;
    active.path = config.path;
    $(config.status).textContent = 'Preview ready. Save, Export to GitHub, Download .zip, files, database, and logs are available.';
    updateShell();
    renderRows();
    renderDetail();
    updatePreviewForActive(config.headline, config.copy, 'Preview identity is temporary until saved.');
    addHistory('ready', `${config.label} is ready at ${config.path}.`);
  }, 850);
}

function launchVanilla() {
  const active = getActive();
  active.name = 'Unsaved Playground';
  active.route = 'Vanilla WordPress';
  active.storage = 'Temporary';
  active.state = 'temporary';
  active.last = 'Fresh latest WordPress started';
  active.path = '/hello-from-playground/';
  active.meta = 'Temporary session, lost on refresh or close.';
  updateShell();
  renderRows();
  renderDetail();
  updatePreviewForActive(
    'Hello from WordPress Playground',
    'This is a fresh WordPress install running client-side in the browser.',
    'Logged in as admin. Current state is temporary.'
  );
  addHistory('temporary', 'Vanilla WordPress started as a fresh temporary Playground.');
}

function githubImport() {
  const active = getActive();
  active.name = 'GitHub Import Preview';
  active.route = 'GitHub import';
  active.storage = 'Temporary import';
  active.state = 'imported';
  active.last = 'Connected GitHub account and imported public wp-content directory';
  active.path = '/wp-admin/plugins.php';
  active.meta = 'GitHub token is session-only and is not stored after refresh.';
  updateShell();
  renderRows();
  renderDetail();
  updatePreviewForActive(
    'GitHub import complete',
    'A public repository directory was imported into wp-content. The resulting site remains temporary until saved or exported.',
    'GitHub access token will not be stored after refresh.'
  );
  addHistory('imported', 'GitHub account connected and repository import completed for this session.');
}

function blueprintUrl() {
  const value = $('#blueprintUrlInput').value.trim();
  if (!value || !value.startsWith('http')) {
    addHistory('failed', 'Blueprint URL validation failed. A full URL is required.');
    return;
  }
  $('#selectedBlueprintUrl').value = value;
  addHistory('ready', `Blueprint URL validated: ${value}.`);
  switchView('blueprints');
}

function openZipImport() {
  openModal({
    kicker: 'Replacement warning',
    title: 'Import review-site-export.zip?',
    copy: 'The selected ZIP passed archive validation. Importing it replaces the active Playground files and SQLite database. Unsaved changes will be lost unless saved first.',
    confirmText: 'Import and replace',
    danger: true,
    onConfirm: () => {
      const active = getActive();
      active.state = 'imported';
      active.name = 'Imported ZIP Playground';
      active.route = 'ZIP import';
      active.storage = 'Temporary import';
      active.last = 'review-site-export.zip replaced files and database';
      active.path = '/wp-admin/import.php?zip=complete';
      active.meta = 'Imported archive. Save to browser or local directory to keep it.';
      $('#databaseSize').textContent = '731 KB';
      updateShell();
      renderRows();
      renderDetail();
      updatePreviewForActive(
        'Imported ZIP Playground',
        'The archive replaced files and the SQLite-backed database. The imported result is temporary until saved.',
        'ZIP import completed. Current storage is temporary.'
      );
      addHistory('imported', 'ZIP import replaced the active files and database.');
    },
  });
}

function exportGitHub() {
  const active = getActive();
  active.state = 'exported';
  active.last = 'Exported to github.com/acme/playground-review branch transfer-deck';
  $('#transferStatus').className = 'state-pill blue';
  $('#transferStatus').textContent = 'Exporting';
  renderRows();
  renderDetail();
  addHistory('exported', 'GitHub export started for github.com/acme/playground-review.');
  window.setTimeout(() => {
    $('#transferStatus').className = 'state-pill green';
    $('#transferStatus').textContent = 'Exported';
    updatePreviewForActive(
      'GitHub export complete',
      'The selected Playground files were pushed to the transfer-deck branch. The active site remains open in the browser shell.',
      'Export complete. Browser runtime remains available.'
    );
    renderRows();
    renderDetail();
    addHistory('exported', 'GitHub export completed on branch transfer-deck.');
  }, 700);
}

function downloadZip() {
  $('#transferStatus').className = 'state-pill blue';
  $('#transferStatus').textContent = 'Generating .zip';
  addHistory('ready', 'Generating wordpress-playground-export.zip from current files and database.');
  window.setTimeout(() => {
    $('#transferStatus').className = 'state-pill green';
    $('#transferStatus').textContent = 'ZIP ready';
    getActive().last = 'Downloaded wordpress-playground-export.zip';
    renderRows();
    addHistory('exported', 'Downloaded wordpress-playground-export.zip.');
  }, 650);
}

function transferAction(type) {
  const messages = {
    database: ['database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite.', 'Downloaded database.sqlite'],
    adminer: ['Adminer opened in a new Playground tool window.', 'Adminer opened'],
    phpmyadmin: ['phpMyAdmin opened in a new Playground tool window.', 'phpMyAdmin opened'],
  };
  const [history, last] = messages[type] || ['Transfer completed.', 'Transfer completed'];
  getActive().last = last;
  renderRows();
  addHistory(type === 'database' ? 'exported' : 'ready', history);
}

function blueprintAction(action) {
  const active = getActive();
  const title = state.selectedBlueprint.title;
  if (action === 'copy') {
    addHistory('ready', `Copied Blueprint bundle link for ${title}.`);
    $('#blueprintState').textContent = 'Copied';
    return;
  }
  if (action === 'download') {
    addHistory('exported', `Downloaded Blueprint bundle for ${title}.`);
    $('#blueprintState').textContent = 'Downloaded';
    return;
  }
  active.name = `${title} Blueprint Result`;
  active.route = 'Blueprint run';
  active.storage = 'Temporary blueprint result';
  active.state = 'imported';
  active.last = `${title} Blueprint validated and ran`;
  active.path = '/hello-from-blueprint/';
  active.meta = `${title} Blueprint ran against the active Playground. Save or export to keep it.`;
  $('#blueprintState').textContent = 'Ran successfully';
  updateShell();
  renderRows();
  renderDetail();
  updatePreviewForActive(
    `${title} Blueprint Result`,
    'The selected Blueprint validated and updated the current WordPress content. The result can now be saved or exported.',
    'Blueprint run complete. Current storage is temporary.'
  );
  addHistory('imported', `${title} Blueprint validated, ran, and updated the active preview.`);
}

function fileAction(action) {
  if (action === 'dirty') {
    $('#fileState').className = 'state-pill amber';
    $('#fileState').textContent = 'Dirty';
    $('#phpLog').textContent = 'wp-config.php edited. Save required before reload.';
    addHistory('temporary', 'wp-config.php marked dirty in the File browser.');
  } else if (action === 'save') {
    $('#fileState').className = 'state-pill green';
    $('#fileState').textContent = 'Saved';
    getActive().last = 'wp-config.php saved from File browser';
    renderRows();
    addHistory('saved', 'wp-config.php saved and file editor dirty state cleared.');
  } else {
    addHistory('ready', `File browser action completed: ${action.replace('-', ' ')}.`);
  }
}

function openRename(id) {
  const object = objects.find((entry) => entry.id === id);
  if (!object) return;
  const nextName = window.prompt('Rename Playground', object.name);
  if (!nextName) return;
  object.name = nextName.trim();
  object.last = 'Renamed from saved management table';
  if (object.active) updateShell();
  renderRows();
  renderDetail();
  addHistory('saved', `${object.name} renamed in the saved management table.`);
}

function openDelete(id) {
  const object = objects.find((entry) => entry.id === id);
  if (!object) return;
  openModal({
    kicker: 'Destructive action',
    title: `Delete ${object.name}?`,
    copy: object.active
      ? 'This saved object is active. Confirming removes its row, records the deletion, and falls back to a new Unsaved Playground so the live shell stays available.'
      : 'Confirming removes this saved row from the table. This cannot be undone in the current browser session.',
    confirmText: 'Delete Playground',
    danger: true,
    onConfirm: () => deleteObject(id),
  });
}

function deleteObject(id) {
  const index = objects.findIndex((entry) => entry.id === id);
  if (index === -1) return;
  const object = objects[index];
  object.state = 'deleting';
  object.last = 'Delete confirmed, removing row';
  renderRows();
  renderDetail();
  addHistory('deleting', `${object.name} delete confirmed. Row is being removed.`);
  window.setTimeout(() => {
    const wasActive = object.active;
    const deletedName = object.name;
    objects.splice(index, 1);
    if (wasActive) {
      objects.unshift({
        id: `fallback-${Date.now()}`,
        name: 'Unsaved Playground',
        route: 'Vanilla WordPress',
        storage: 'Temporary',
        state: 'temporary',
        last: 'Fallback active site after deletion',
        path: '/hello-from-playground/',
        active: true,
        meta: 'Fallback temporary Playground created after deleting the active saved object.',
      });
      state.selectedId = objects[0].id;
      updatePreviewForActive(
        'Hello from WordPress Playground',
        'The deleted saved object was removed. A temporary fallback Playground is active so the live shell remains usable.',
        'Deleted object removed. Active site fell back to temporary.'
      );
    } else {
      state.selectedId = getActive().id;
    }
    updateShell();
    renderRows();
    renderDetail();
    addHistory('deleting', `${deletedName} deleted. ${wasActive ? 'Active shell fell back to an Unsaved Playground.' : 'Saved row removed from the table.'}`);
  }, 760);
}

function resetActive() {
  const active = getActive();
  openModal({
    kicker: 'Reset consequence',
    title: active.state === 'saved' || active.state === 'local'
      ? 'Save and reload this stored Playground?'
      : 'Reset this temporary Playground?',
    copy: active.state === 'saved' || active.state === 'local'
      ? 'Stored Playgrounds have limited configuration options. Save and Reload preserves the saved identity while rebuilding runtime settings.'
      : 'This resets WordPress files, the SQLite-backed database, plugins, themes, and content for the active temporary Playground.',
    confirmText: active.state === 'saved' || active.state === 'local' ? 'Save and Reload' : 'Reset Playground',
    danger: active.state !== 'saved' && active.state !== 'local',
    onConfirm: () => {
      active.state = 'resetting';
      active.last = 'Reset or reload in progress';
      renderRows();
      renderDetail();
      addHistory('resetting', `${active.name} reset/reload started.`);
      window.setTimeout(() => {
        active.state = active.storage.includes('Browser') ? 'saved' : active.storage.includes('Sites') ? 'local' : 'temporary';
        active.last = active.state === 'temporary' ? 'Reset to fresh WordPress state' : 'Settings saved and runtime reloaded';
        active.path = '/hello-from-playground/';
        updateShell();
        renderRows();
        renderDetail();
        updatePreviewForActive(
          active.state === 'temporary' ? 'Fresh temporary Playground' : `${active.name} reloaded`,
          active.state === 'temporary'
            ? 'The active temporary Playground was reset to a clean WordPress install.'
            : 'Runtime settings were saved and the stored Playground reloaded without changing its saved identity.',
          active.state === 'temporary' ? 'Reset complete.' : 'Save and Reload complete.'
        );
        addHistory(active.state, `${active.name} finished reset/reload and updated the preview state.`);
      }, 820);
    },
  });
}

function openModal(config) {
  state.modal = config;
  $('#modalKicker').textContent = config.kicker;
  $('#modalTitle').textContent = config.title;
  $('#modalCopy').textContent = config.copy;
  $('[data-modal="confirm"]').textContent = config.confirmText || 'Confirm';
  $('[data-modal="confirm"]').className = config.danger ? 'danger-button' : 'primary-button';
  $('#modalProgress').hidden = true;
  $('#modalProgressBar').style.width = '0%';
  $('#confirmModal').hidden = false;
}

function closeModal() {
  $('#confirmModal').hidden = true;
  state.modal = null;
}

function confirmModal() {
  if (!state.modal) return;
  $('#modalProgress').hidden = false;
  startMeter(
    '#modalProgressBar',
    '#modalProgressLabel',
    '#modalProgressDetail',
    [
      { percent: 35, label: 'Preparing operation', detail: 'Checking current Playground state.' },
      { percent: 72, label: 'Applying change', detail: 'Updating files, database, and table rows.' },
      { percent: 100, label: 'Finalizing result', detail: 'Refreshing shell identity and transfer history.' },
    ],
    () => {
      const onConfirm = state.modal.onConfirm;
      closeModal();
      onConfirm();
    }
  );
}

function renderBlueprintGallery() {
  const query = $('#blueprintSearch').value.trim().toLowerCase();
  const entries = blueprints.filter((blueprint) => {
    const matchesCategory = state.activeCategory === 'All' || blueprint.tags.includes(state.activeCategory);
    const matchesQuery = !query || `${blueprint.title} ${blueprint.copy} ${blueprint.tags.join(' ')}`.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  $('#blueprintGallery').innerHTML = entries.map((blueprint) => `
    <article class="${blueprint.title === state.selectedBlueprint.title ? 'is-active' : ''}" data-blueprint="${escapeHtml(blueprint.title)}">
      <div>
        <div class="blueprint-preview"></div>
        <h3>${escapeHtml(blueprint.title)}</h3>
        <p>${escapeHtml(blueprint.copy)}</p>
      </div>
      <span class="state-pill blue">${escapeHtml(blueprint.tags.slice(0, 2).join(' / '))}</span>
    </article>
  `).join('');
}

function selectBlueprint(title) {
  const blueprint = blueprints.find((entry) => entry.title === title);
  if (!blueprint) return;
  state.selectedBlueprint = blueprint;
  $('#selectedBlueprintTitle').textContent = blueprint.title;
  $('#selectedBlueprintCopy').textContent = blueprint.copy;
  $('#selectedBlueprintUrl').value = blueprint.url;
  renderBlueprintGallery();
  addHistory('ready', `${blueprint.title} selected from the representative Blueprint subset.`);
}

document.addEventListener('click', (event) => {
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) {
    switchView(viewButton.dataset.view);
    return;
  }

  const managerButton = event.target.closest('[data-manager]');
  if (managerButton) {
    switchManager(managerButton.dataset.manager);
    return;
  }

  const destination = event.target.closest('[data-destination]');
  if (destination) {
    setDestination(destination.dataset.destination);
    return;
  }

  const rowButton = event.target.closest('[data-row-action]');
  if (rowButton) {
    const id = rowButton.dataset.id;
    const action = rowButton.dataset.rowAction;
    if (action === 'open') setActive(id);
    if (action === 'manage') {
      selectObject(id);
      switchView('manager');
    }
    if (action === 'rename') openRename(id);
    if (action === 'delete') openDelete(id);
    return;
  }

  const row = event.target.closest('.object-row');
  if (row) {
    selectObject(row.dataset.id);
    return;
  }

  const route = event.target.closest('[data-route]');
  if (route) {
    const routeName = route.dataset.route;
    if (routeName === 'vanilla') launchVanilla();
    if (routeName === 'wordpress-pr' || routeName === 'gutenberg-pr') previewRoute(routeName);
    if (routeName === 'github-import') githubImport();
    if (routeName === 'blueprint-url') blueprintUrl();
    if (routeName === 'zip-import') openZipImport();
    return;
  }

  const action = event.target.closest('[data-action]');
  if (action) {
    const actionName = action.dataset.action;
    if (actionName === 'open-save') $('#saveCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (actionName === 'start-save') startSave();
    if (actionName === 'cancel-save') {
      $('#progressLabel').textContent = 'Save canceled';
      $('#progressDetail').textContent = 'No files copied. Current storage state is unchanged.';
      addHistory('temporary', 'Save flow canceled before copy.');
    }
    if (actionName === 'grant-local') grantLocal();
    if (actionName === 'deny-local') denyLocal();
    if (actionName === 'home') setPath('/hello-from-playground/');
    if (actionName === 'admin') setPath('/wp-admin/');
    if (actionName === 'refresh') addHistory('ready', `Refreshed active WordPress page at ${getActive().path}.`);
    if (actionName === 'manager-view') switchView('manager');
    if (actionName === 'reset-active') resetActive();
    if (actionName === 'github-export') exportGitHub();
    if (actionName === 'download-zip') downloadZip();
    return;
  }

  const fileButton = event.target.closest('[data-file-action]');
  if (fileButton) {
    fileAction(fileButton.dataset.fileAction);
    return;
  }

  const blueprintButton = event.target.closest('[data-blueprint-action]');
  if (blueprintButton) {
    blueprintAction(blueprintButton.dataset.blueprintAction);
    return;
  }

  const transferButton = event.target.closest('[data-transfer]');
  if (transferButton) {
    transferAction(transferButton.dataset.transfer);
    return;
  }

  const categoryButton = event.target.closest('[data-category]');
  if (categoryButton) {
    state.activeCategory = categoryButton.dataset.category;
    $$('.chip-row button').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.category === state.activeCategory);
    });
    renderBlueprintGallery();
    return;
  }

  const blueprintCard = event.target.closest('[data-blueprint]');
  if (blueprintCard) {
    selectBlueprint(blueprintCard.dataset.blueprint);
    return;
  }

  const modalButton = event.target.closest('[data-modal]');
  if (modalButton) {
    if (modalButton.dataset.modal === 'cancel') {
      addHistory('ready', 'Confirmation canceled. No table rows changed.');
      closeModal();
    } else {
      confirmModal();
    }
  }
});

$('#pathInput').addEventListener('change', (event) => {
  const active = getActive();
  active.path = event.target.value || '/';
  active.last = `Navigated to ${active.path}`;
  updateShell();
  renderRows();
  addHistory('ready', `Active path changed to ${active.path}.`);
});

$('#blueprintSearch').addEventListener('input', renderBlueprintGallery);

renderRows();
renderDetail();
updateShell();
renderBlueprintGallery();
updatePreviewForActive(
  'Hello from WordPress Playground',
  'This is Playground, a WordPress that runs client-side in your browser. Edits, plugin installs, and content changes stay isolated until saved or exported.',
  'Logged in as admin. Current state is temporary.'
);
