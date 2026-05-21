const state = {
  activeId: 'unsaved',
  pendingDeleteId: null,
  selectedView: 'ledger',
  selectedManager: 'settings',
  selectedCategory: 'All',
  selectedBlueprint: 0,
  githubConnected: false,
  exportGithubConnected: false,
  zipChosen: false,
  resetArmed: false,
  prTimer: null,
  rows: [
    {
      id: 'unsaved',
      title: 'Unsaved Playground',
      storage: 'Temporary only',
      badge: 'Temporary',
      tone: 'amber',
      route: 'Vanilla WordPress',
      path: '/hello-from-playground/',
      meta: 'Temporary runtime. It will be lost when the tab closes unless saved.',
      exportState: 'Save first',
    },
    {
      id: 'browser',
      title: 'Research Browser Playground',
      storage: 'Saved in this browser',
      badge: 'Browser saved',
      tone: 'green',
      route: 'Vanilla WordPress',
      path: '/research-browser-playground/hello-from-playground/',
      meta: 'Created May 21, 2026. Slug is stored in browser storage.',
      exportState: 'ZIP and GitHub available',
    },
    {
      id: 'local',
      title: 'Local Theme Lab',
      storage: 'Local directory: Sites/Playground Research',
      badge: 'Local linked',
      tone: 'blue',
      route: 'Local directory save',
      path: '/local-theme-lab/wp-admin/',
      meta: 'Folder permission granted. Reconnect may be needed after refresh.',
      exportState: 'Folder, ZIP, database',
    },
  ],
};

const blueprints = [
  ['Art Gallery', 'An art gallery created with the Vueo theme.', ['Featured', 'Website', 'Personal', 'Themes'], 'art'],
  ['Coffee Shop', 'A stylish WooCommerce coffee shop storefront with custom products and content.', ['Featured', 'Website', 'WooCommerce'], 'coffee'],
  ['Feed Reader with the Friends Plugin', 'Read feeds from the web in Playground using the Friends plugin.', ['Featured', 'Content', 'Experiments'], 'feed'],
  ['Gaming News', 'A gaming news site created with the Spiel theme.', ['Featured', 'Website', 'News', 'Themes'], 'gaming'],
  ['Non-profit Organization', 'A non-profit organization site created with the Koinonia theme.', ['Featured', 'Website'], 'nonprofit'],
  ['Personal Blog', 'A personal blog created with the Substrata theme.', ['Personal', 'Website', 'Content'], 'blog'],
  ['Block Theme Shop', 'A compact storefront for testing block theme patterns and WooCommerce content.', ['WooCommerce', 'Themes', 'Gutenberg'], 'shop'],
  ['Docs Starter', 'A content-heavy starter site for editing pages, navigation, and media.', ['Content', 'Website', 'Gutenberg'], 'docs'],
].map(([name, description, categories, thumb]) => ({ name, description, categories, thumb }));

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function activeRow() {
  return state.rows.find((row) => row.id === state.activeId) || state.rows[0];
}

function toneClass(tone) {
  return `chip ${tone || ''}`.trim();
}

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value;
}

function event(title, detail, tone = 'green') {
  const item = document.createElement('li');
  item.innerHTML = `<time>${now()}</time><strong>${title}</strong><span>${detail}</span>`;
  $('#eventList').prepend(item);
  $('#streamState').className = toneClass(tone);
  $('#streamState').textContent = tone === 'red' ? 'Needs attention' : 'Updated';

  const mutation = document.createElement('li');
  mutation.innerHTML = `<strong>${title}</strong><span>${detail}</span>`;
  $('#mutationList').prepend(mutation);
}

function updatePreview(kind, title, body, note) {
  const row = activeRow();
  setText('#previewTitle', row.title);
  setText('#wpBarTitle', row.title.includes('Unsaved') ? 'My WordPress Website' : row.title);
  setText('#wpSiteTitle', row.title.includes('Unsaved') ? 'My WordPress Website' : row.title);

  if (kind === 'admin') {
    $('#previewBadge').textContent = 'WP Admin';
    setText('#previewKicker', 'WordPress Admin');
    setText('#previewHeadline', 'Dashboard');
    setText('#previewBody', 'The embedded WordPress admin is open for plugins, themes, posts, settings, and Site Editor workflows.');
    setText('#previewNote', 'Admin navigation stays inside the Playground shell.');
    return;
  }

  if (kind === 'pr') {
    $('#previewBadge').textContent = 'PR Preview';
    setText('#previewKicker', 'Branch preview');
    setText('#previewHeadline', title);
    setText('#previewBody', body);
    setText('#previewNote', note);
    return;
  }

  if (kind === 'import') {
    $('#previewBadge').textContent = 'Imported';
    setText('#previewKicker', 'Replacement complete');
    setText('#previewHeadline', title);
    setText('#previewBody', body);
    setText('#previewNote', note);
    return;
  }

  if (kind === 'blueprint') {
    $('#previewBadge').textContent = 'Blueprint';
    setText('#previewKicker', 'Blueprint result');
    setText('#previewHeadline', title);
    setText('#previewBody', body);
    setText('#previewNote', note);
    return;
  }

  $('#previewBadge').textContent = 'Home';
  setText('#previewKicker', 'Browser-hosted WordPress');
  setText('#previewHeadline', 'Hello from WordPress Playground!');
  setText('#previewBody', 'This Playground runs client-side in your browser. It is ready for training, demonstrating plugins and themes, and testing changes.');
  setText('#previewNote', row.storage.includes('Temporary') ? 'You are logged in as admin. Save this temporary site before closing the browser.' : 'This Playground identity is saved. Manager and portability actions operate on this selected object.');
}

function renderIdentity() {
  const row = activeRow();
  setText('#activeTitle', row.title);
  setText('#activeMeta', row.meta);
  setText('#identityStorage', row.storage);
  setText('#identityRoute', row.route);
  setText('#identityExport', row.exportState);
  setText('#previewTitle', row.title);
  setText('#wpBarTitle', row.title.includes('Unsaved') ? 'My WordPress Website' : row.title);
  setText('#wpSiteTitle', row.title.includes('Unsaved') ? 'My WordPress Website' : row.title);
  setText('#storageBadge', row.badge);
  $('#storageBadge').className = toneClass(row.tone);
  $('#pathInput').value = row.path;

  const resetIsSaved = !row.storage.includes('Temporary');
  setText('#resetTitle', resetIsSaved ? 'Save & Reload stored Playground' : 'Apply Settings & Reset Playground');
  setText('#resetCopy', resetIsSaved ? 'Stored Playgrounds have limited configuration options. Changes are saved, then the runtime reloads.' : 'For a temporary Playground this destroys the current files and database before applying settings.');
  setText('#resetBtn', resetIsSaved ? 'Save & Reload' : 'Reset temporary site');
}

function renderRows() {
  const container = $('#playgroundRows');
  container.innerHTML = '';
  state.rows.forEach((row) => {
    const article = document.createElement('article');
    article.className = `ledger-row${row.id === state.activeId ? ' is-active' : ''}`;
    article.innerHTML = `
      <div>
        <span class="${toneClass(row.tone)}">${row.badge}</span>
        <h3>${row.title}</h3>
        <p>${row.storage} · ${row.route} · ${row.path}</p>
      </div>
      <div class="row-actions">
        <button class="btn quiet small" type="button" data-open="${row.id}">Open</button>
        <button class="btn secondary small" type="button" data-manage="${row.id}">Manage</button>
        <button class="btn secondary small" type="button" data-rename="${row.id}">Rename</button>
        <button class="btn danger small" type="button" data-delete="${row.id}" ${row.id === 'unsaved' ? 'disabled' : ''}>Delete</button>
      </div>
    `;
    container.append(article);
  });

  $$('[data-open]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeId = button.dataset.open;
      renderAll();
      updatePreview('home');
      event('Opened Playground', `${activeRow().title} became the selected shell object.`, 'blue');
    });
  });

  $$('[data-rename]').forEach((button) => {
    button.addEventListener('click', () => renameRow(button.dataset.rename));
  });

  $$('[data-manage]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeId = button.dataset.manage;
      renderAll();
      updatePreview('home');
      setView('manager');
      event('Opened Site Manager', `${activeRow().title} is selected for settings, files, Blueprint, database, and logs.`, 'blue');
    });
  });

  $$('[data-delete]').forEach((button) => {
    button.addEventListener('click', () => armDelete(button.dataset.delete));
  });
}

function renderAll() {
  renderRows();
  renderIdentity();
}

function setView(view) {
  state.selectedView = view;
  $$('[data-view-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.viewPanel === view));
  $$('.tab').forEach((tab) => tab.classList.toggle('is-active', tab.dataset.view === view));
}

function setManager(manager) {
  state.selectedManager = manager;
  $$('.manager-panel').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.managerPanel === manager));
  $$('.manager-tab').forEach((tab) => tab.classList.toggle('is-active', tab.dataset.manager === manager));
}

function addOrReplaceActive(row) {
  const index = state.rows.findIndex((item) => item.id === row.id);
  if (index >= 0) state.rows[index] = row;
  else state.rows.unshift(row);
  state.activeId = row.id;
  renderAll();
}

function renameRow(id) {
  const row = state.rows.find((item) => item.id === id);
  if (!row) return;
  row.title = row.title.includes('Renamed') ? row.title.replace(' Renamed', '') : `${row.title} Renamed`;
  row.meta = `Renamed a moment ago. ${row.storage}`;
  event('Renamed Playground', `${row.title} updated in the ledger, shell title, and preview toolbar.`, 'blue');
  renderAll();
}

function armDelete(id) {
  const row = state.rows.find((item) => item.id === id);
  if (!row) return;
  state.pendingDeleteId = id;
  $('#deleteFlow').hidden = false;
  $('#deleteProgress').style.width = '0%';
  setText('#deleteText', `Delete "${row.title}" from ${row.storage}. This cannot be undone. If it is active, the shell falls back to Unsaved Playground.`);
  setView('ledger');
  event('Delete warning opened', `${row.title} is waiting for cancel or confirm.`, 'amber');
}

function finishDelete() {
  const row = state.rows.find((item) => item.id === state.pendingDeleteId);
  if (!row) return;
  $('#confirmDeleteBtn').disabled = true;
  $('#deleteProgress').style.width = '45%';
  setText('#deleteText', `Removing browser files and database for "${row.title}"...`);
  window.setTimeout(() => {
    $('#deleteProgress').style.width = '100%';
    const wasActive = row.id === state.activeId;
    state.rows = state.rows.filter((item) => item.id !== row.id);
    if (wasActive) state.activeId = state.rows.find((item) => item.id === 'unsaved')?.id || state.rows[0].id;
    state.pendingDeleteId = null;
    $('#deleteFlow').hidden = true;
    $('#confirmDeleteBtn').disabled = false;
    event('Deleted Playground', `${row.title} was removed from the ledger. ${wasActive ? 'Unsaved Playground is now active.' : 'The active preview was unchanged.'}`, 'red');
    renderAll();
  }, 820);
}

function progress({ bar, stateEl, detailEl, steps, done }) {
  let index = 0;
  const timer = window.setInterval(() => {
    const step = steps[index];
    if (bar) bar.style.width = `${step.percent}%`;
    if (stateEl) {
      stateEl.className = toneClass(step.tone || 'blue');
      stateEl.textContent = step.label;
    }
    if (detailEl) detailEl.textContent = step.detail;
    index += 1;
    if (index >= steps.length) {
      window.clearInterval(timer);
      window.setTimeout(done, 240);
    }
  }, 430);
}

function save(destination) {
  const row = activeRow();
  const isLocal = destination === 'local';
  const name = isLocal ? 'Local Directory Playground' : ($('#browserName').value.trim() || 'Research Browser Playground');
  const folder = $('#localFolder').value.trim() || 'Sites/Playground Research';
  $('#saveProgress').style.width = '0%';
  progress({
    bar: $('#saveProgress'),
    stateEl: $('#saveState'),
    detailEl: $('#saveDetail'),
    steps: [
      { percent: 18, label: 'Preparing', detail: isLocal ? 'Requesting local directory permission.' : 'Preparing browser storage manifest.' },
      { percent: 54, label: 'Copying', detail: 'Saving 3028 / 3751 files plus SQLite database records.' },
      { percent: 82, label: 'Indexing', detail: isLocal ? `Linking folder ${folder} and recording reconnect requirement.` : 'Creating saved slug and Saved Playgrounds row.' },
      { percent: 100, label: 'Complete', detail: isLocal ? 'Local directory save complete.' : 'Browser save complete.', tone: 'green' },
    ],
    done: () => {
      row.id = isLocal ? 'local-active' : 'browser-active';
      row.title = name;
      row.storage = isLocal ? `Local directory: ${folder}` : 'Saved in this browser';
      row.badge = isLocal ? 'Local linked' : 'Saved Playground';
      row.tone = 'green';
      row.route = isLocal ? 'Local directory save' : row.route;
      row.path = isLocal ? '/local-directory-playground/hello-from-playground/' : `/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}/hello-from-playground/`;
      row.meta = isLocal ? `Folder permission granted for ${folder}. Reconnect is required after refresh.` : 'Transformed from temporary into a browser-saved Playground with a slug.';
      row.exportState = isLocal ? 'Folder, ZIP, database, GitHub' : 'ZIP, database, GitHub';
      state.activeId = row.id;
      event(isLocal ? 'Saved to local directory' : 'Saved in browser', `${row.title} updated the shell title, path, storage badge, and ledger row.`, 'green');
      renderAll();
    },
  });
}

function startPr(kind) {
  const input = kind === 'wp' ? $('#wpPrInput').value.trim() : $('#gbPrInput').value.trim();
  const label = kind === 'wp' ? 'WordPress PR' : 'Gutenberg PR or branch';
  if (!input) {
    setText('#prFlowDetail', `${label} requires a PR number, URL, or branch value.`);
    $('#prFlowState').className = toneClass('red');
    $('#prFlowState').textContent = 'Invalid';
    return;
  }
  setText('#prFlowTitle', `${label} preview`);
  $('#prProgress').style.width = '0%';
  progress({
    bar: $('#prProgress'),
    stateEl: $('#prFlowState'),
    detailEl: $('#prFlowDetail'),
    steps: [
      { percent: 20, label: 'Validating', detail: `Checking ${input} and resolving build artifacts.` },
      { percent: 52, label: 'Downloading', detail: 'Fetching the preview package inside the browser runtime.' },
      { percent: 76, label: 'Booting', detail: 'Preparing WordPress, database, and admin session.' },
      { percent: 100, label: 'Ready', detail: 'Preview identity created. Save and export controls are now available.', tone: 'green' },
    ],
    done: () => {
      const safe = input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'preview';
      const row = {
        id: `${kind}-preview-${Date.now()}`,
        title: kind === 'wp' ? `WordPress PR ${input} Preview` : `Gutenberg ${input} Preview`,
        storage: 'Temporary PR preview',
        badge: 'PR preview',
        tone: 'blue',
        route: `${label}: ${input}`,
        path: kind === 'wp' ? `/wp-pr-${safe}/wp-admin/` : `/gutenberg-${safe}/wp-admin/`,
        meta: 'Temporary route-specific preview. Save to keep this preview after refresh.',
        exportState: 'Save, ZIP, database, GitHub after connection',
      };
      addOrReplaceActive(row);
      updatePreview('pr', row.title, `The ${label} route validated "${input}" and booted a temporary WordPress preview.`, 'Save in browser or to a local directory before closing. ZIP download is available from Transfers.');
      event('PR preview completed', `${row.title} became the active Playground with save and export actions enabled.`, 'green');
    },
  });
}

function renderBlueprints() {
  const query = $('#blueprintSearch').value.trim().toLowerCase();
  const filtered = blueprints.filter((blueprint) => {
    const category = state.selectedCategory === 'All' || blueprint.categories.includes(state.selectedCategory);
    const haystack = `${blueprint.name} ${blueprint.description} ${blueprint.categories.join(' ')}`.toLowerCase();
    return category && (!query || haystack.includes(query));
  });
  $('#galleryCount').textContent = filtered.length
    ? `Showing ${filtered.length} representative entries from the 43-entry Blueprint gallery.`
    : 'No representative Blueprint entries match this filter.';
  $('#blueprintGrid').innerHTML = '';
  filtered.forEach((blueprint) => {
    const index = blueprints.indexOf(blueprint);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `blueprint-card${index === state.selectedBlueprint ? ' is-selected' : ''}`;
    button.innerHTML = `
      <span class="thumb ${blueprint.thumb}" aria-hidden="true"></span>
      <span><strong>${blueprint.name}</strong><span>${blueprint.description}</span></span>
    `;
    button.addEventListener('click', () => selectBlueprint(index));
    $('#blueprintGrid').append(button);
  });
}

function selectBlueprint(index) {
  state.selectedBlueprint = index;
  const blueprint = blueprints[index];
  $('#selectedBlueprintThumb').className = `thumb ${blueprint.thumb}`;
  setText('#selectedBlueprintTitle', blueprint.name);
  setText('#selectedBlueprintText', `${blueprint.description} Tags: ${blueprint.categories.join(', ')}.`);
  renderBlueprints();
}

function runSelectedBlueprint() {
  const blueprint = blueprints[state.selectedBlueprint];
  const row = activeRow();
  row.title = `${blueprint.name} Playground`;
  row.route = `Blueprint gallery: ${blueprint.name}`;
  row.path = '/';
  row.meta = 'Active content was replaced by a Blueprint run. Save again to preserve this result.';
  row.exportState = 'Blueprint bundle, ZIP, database';
  updatePreview('blueprint', blueprint.name, `${blueprint.description} The active files and database were replaced by Blueprint steps.`, 'Blueprint completed. The current unsaved result should be saved before refresh.');
  event('Blueprint replaced active site', `${blueprint.name} ran against the selected Playground and updated preview identity.`, 'amber');
  renderAll();
}

function chooseZip() {
  state.zipChosen = true;
  $('#replaceZipBtn').disabled = false;
  event('ZIP selected', 'site-export.zip passed extension checks and is waiting for replacement confirmation.', 'amber');
}

function importZip() {
  if (!state.zipChosen) return;
  const row = {
    id: `zip-${Date.now()}`,
    title: 'Imported ZIP Playground',
    storage: 'Temporary ZIP import',
    badge: 'ZIP import',
    tone: 'amber',
    route: 'Import .zip: site-export.zip',
    path: '/imported-home/',
    meta: 'ZIP import replaced files and database. Save to keep the result.',
    exportState: 'Save, ZIP, database',
  };
  $('#replaceZipBtn').disabled = true;
  addOrReplaceActive(row);
  updatePreview('import', 'Imported ZIP Playground', 'The archive replaced WordPress files, wp-content, and the SQLite database in the active browser runtime.', 'Save this imported state to keep it after closing the tab.');
  event('ZIP import completed', 'site-export.zip replaced the active Playground and added a new temporary import row.', 'green');
}

function resetCurrent() {
  const row = activeRow();
  if (!state.resetArmed) {
    state.resetArmed = true;
    $('#resetBtn').textContent = row.storage.includes('Temporary') ? 'Confirm destructive reset' : 'Confirm Save & Reload';
    event('Reset warning opened', row.storage.includes('Temporary') ? 'Temporary reset will replace files and database.' : 'Stored settings change will save and reload the runtime.', 'amber');
    return;
  }
  state.resetArmed = false;
  row.path = '/hello-from-playground/';
  row.route = row.storage.includes('Temporary') ? 'Reset vanilla WordPress' : `${row.route} · reloaded`;
  row.meta = row.storage.includes('Temporary') ? 'Reset completed with selected runtime settings.' : 'Settings saved and runtime reloaded.';
  updatePreview('home');
  event(row.storage.includes('Temporary') ? 'Reset completed' : 'Saved and reloaded', `${row.title} updated the preview state and path after settings were applied.`, 'green');
  renderAll();
}

function init() {
  renderAll();
  updatePreview('home');
  renderBlueprints();
  selectBlueprint(0);

  $$('[data-view]').forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));
  $$('.manager-tab').forEach((button) => button.addEventListener('click', () => setManager(button.dataset.manager)));

  $('#refreshBtn').addEventListener('click', () => event('Preview refreshed', `${activeRow().title} refreshed at ${$('#pathInput').value}.`, 'blue'));
  $('#pathInput').addEventListener('change', (eventObject) => {
    activeRow().path = eventObject.target.value || '/';
    event('Path changed', `${activeRow().title} navigated to ${activeRow().path}.`, 'blue');
    renderAll();
  });

  ['#homeBtn', '#previewHomeBtn'].forEach((selector) => $(selector).addEventListener('click', () => {
    activeRow().path = '/hello-from-playground/';
    event('Homepage opened', `${activeRow().title} navigated to the Homepage.`, 'blue');
    renderAll();
    updatePreview('home');
  }));
  ['#adminBtn', '#previewAdminBtn'].forEach((selector) => $(selector).addEventListener('click', () => {
    activeRow().path = '/wp-admin/';
    event('WP Admin opened', `${activeRow().title} navigated to /wp-admin/.`, 'blue');
    renderAll();
    updatePreview('admin');
  }));

  $('#renameActiveBtn').addEventListener('click', () => renameRow(state.activeId));
  $('#cancelDeleteBtn').addEventListener('click', () => {
    const row = state.rows.find((item) => item.id === state.pendingDeleteId);
    $('#deleteFlow').hidden = true;
    event('Delete canceled', `${row?.title || 'Selected Playground'} stayed in the ledger.`, 'green');
    state.pendingDeleteId = null;
  });
  $('#confirmDeleteBtn').addEventListener('click', finishDelete);

  $('#saveBrowserBtn').addEventListener('click', () => save('browser'));
  $('#saveLocalBtn').addEventListener('click', () => save('local'));
  $('#cancelLocalBtn').addEventListener('click', () => {
    $('#saveState').className = toneClass('amber');
    $('#saveState').textContent = 'Canceled';
    $('#saveDetail').textContent = 'Local directory picker was canceled. No folder permission was granted.';
    $('#saveProgress').style.width = '0%';
    event('Local save canceled', 'The active Playground remains in its previous storage state.', 'amber');
  });

  $('#wpPrBtn').addEventListener('click', () => startPr('wp'));
  $('#gbPrBtn').addEventListener('click', () => startPr('gb'));
  $('#cancelPrBtn').addEventListener('click', () => {
    $('#prProgress').style.width = '0%';
    $('#prFlowState').className = toneClass('amber');
    $('#prFlowState').textContent = 'Canceled';
    $('#prFlowDetail').textContent = 'Preview validation was canceled. The active Playground was unchanged.';
    event('PR preview canceled', 'No route mutation was applied to the active Playground.', 'amber');
  });
  $('#startVanilla').addEventListener('click', () => {
    addOrReplaceActive({
      id: `vanilla-${Date.now()}`,
      title: 'Unsaved Playground',
      storage: 'Temporary only',
      badge: 'Temporary',
      tone: 'amber',
      route: 'Vanilla WordPress',
      path: '/hello-from-playground/',
      meta: 'Fresh temporary WordPress install. Save before closing.',
      exportState: 'Save first',
    });
    updatePreview('home');
    event('Started Vanilla WordPress', 'A fresh temporary Playground became active.', 'blue');
  });
  $('#connectGithubBtn').addEventListener('click', () => {
    state.githubConnected = true;
    $('#importGithubBtn').disabled = false;
    event('GitHub connected', 'Account connected for import. Token will not be stored after refresh.', 'green');
  });
  $('#importGithubBtn').addEventListener('click', () => {
    addOrReplaceActive({
      id: `github-${Date.now()}`,
      title: 'GitHub Import Playground',
      storage: 'Temporary GitHub import',
      badge: 'GitHub import',
      tone: 'blue',
      route: 'GitHub import: public repository',
      path: '/wp-admin/plugins.php',
      meta: 'Imported a plugin/theme/wp-content repository after account connection.',
      exportState: 'Save, ZIP, database',
    });
    updatePreview('import', 'GitHub Import Playground', 'Repository content was imported into wp-content for testing in the browser runtime.', 'Save the GitHub import if you need it after refresh.');
    event('GitHub import completed', 'Repository content replaced the selected Playground object.', 'green');
  });
  $('#routeBlueprintBtn').addEventListener('click', () => event('Blueprint URL validated', `${$('#routeBlueprintUrl').value} is ready to run from the Blueprint gallery tools.`, 'green'));
  $('#chooseZipBtn').addEventListener('click', chooseZip);
  $('#replaceZipBtn').addEventListener('click', importZip);

  $('#resetBtn').addEventListener('click', resetCurrent);
  $('#cancelResetBtn').addEventListener('click', () => {
    state.resetArmed = false;
    renderIdentity();
    event('Settings reset canceled', 'No runtime settings or files changed.', 'green');
  });

  $('#fileEditor').addEventListener('input', () => {
    $('#fileDirty').textContent = 'dirty';
    $('#fileDirty').style.color = '#9a6400';
  });
  $('#saveFileBtn').addEventListener('click', () => {
    $('#fileDirty').textContent = 'saved';
    $('#fileDirty').style.color = '#147a48';
    event('File saved', '/wordpress/wp-config.php dirty state cleared and preview remains active.', 'green');
  });
  $('#newFileBtn').addEventListener('click', () => event('New file created', '/wordpress/wp-content/new-snippet.php appeared in the file browser.', 'blue'));
  $('#newFolderBtn').addEventListener('click', () => event('New folder created', '/wordpress/wp-content/playground-tests/ appeared in the file browser.', 'blue'));
  $('#uploadFileBtn').addEventListener('click', () => event('Upload complete', 'theme-fixture.json uploaded into wp-content.', 'green'));

  $('#managerBlueprintEditor').addEventListener('input', () => {
    $('#blueprintDirty').textContent = 'dirty';
    $('#blueprintDirty').style.color = '#9a6400';
  });
  $('#copyBlueprintBtn').addEventListener('click', () => event('Blueprint link copied', 'Current blueprint.json URL copied to clipboard state.', 'green'));
  $('#downloadBlueprintBtn').addEventListener('click', () => event('Blueprint bundle downloaded', 'blueprint-bundle.zip generated for the active Playground.', 'green'));
  $('#runBlueprintBtn').addEventListener('click', runSelectedBlueprint);
  $('#downloadDbBtn').addEventListener('click', () => event('Database downloaded', 'database.sqlite generated from /wordpress/wp-content/database/.ht.sqlite.', 'green'));
  $('#downloadDbBtn2').addEventListener('click', () => event('Database downloaded', 'database.sqlite generated from /wordpress/wp-content/database/.ht.sqlite.', 'green'));
  $('#adminerBtn').addEventListener('click', () => event('Adminer opened', 'Adminer launched against the SQLite-backed database.', 'blue'));
  $('#phpmyadminBtn').addEventListener('click', () => event('phpMyAdmin opened', 'phpMyAdmin launched against the SQLite-backed database.', 'blue'));

  $('#blueprintSearch').addEventListener('input', renderBlueprints);
  $$('#categoryFilters .chip').forEach((button) => button.addEventListener('click', () => {
    state.selectedCategory = button.dataset.category;
    $$('#categoryFilters .chip').forEach((chip) => chip.classList.toggle('blue', chip === button));
    renderBlueprints();
  }));
  $('#copyGalleryBlueprint').addEventListener('click', () => event('Blueprint URL copied', `${blueprints[state.selectedBlueprint].name} URL copied.`, 'green'));
  $('#downloadGalleryBlueprint').addEventListener('click', () => event('Blueprint downloaded', `${blueprints[state.selectedBlueprint].name} bundle downloaded.`, 'green'));
  $('#runGalleryBlueprint').addEventListener('click', runSelectedBlueprint);

  $('#connectExportGithubBtn').addEventListener('click', () => {
    state.exportGithubConnected = true;
    $('#exportGithubBtn').disabled = false;
    event('GitHub export connected', 'Account connected for export. Choose repository and push active files.', 'green');
  });
  $('#exportGithubBtn').addEventListener('click', () => event('Exported to GitHub', `${activeRow().title} pushed files, Blueprint, and database metadata to a repository.`, 'green'));
  $('#downloadZipBtn').addEventListener('click', () => event('ZIP generated', `${activeRow().title} bundled as playground-export.zip.`, 'green'));
}

init();
