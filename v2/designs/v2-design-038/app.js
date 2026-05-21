const state = {
  title: 'Unsaved Playground',
  subtitle: 'Temporary runtime - changes are lost on refresh',
  storage: 'Temporary',
  path: '/hello-from-playground/',
  wp: 'latest',
  php: '8.3',
  language: 'English (United States)',
  network: true,
  multisite: false,
  older: false,
  dbSize: '452 KB',
  githubConnected: false,
  deleteTarget: null,
  library: [
    { id: 'active', name: 'Unsaved Playground', meta: 'Temporary - not saved to browser storage', type: 'Temporary', active: true },
    { id: 'browser', name: 'Research Browser Playground', meta: 'Saved in this browser - created May 21, 2026', type: 'Browser saved', active: false },
    { id: 'local', name: 'Theme QA Local Directory', meta: 'Local folder - reconnect permission after refresh', type: 'Local directory', active: false }
  ],
  history: [
    { kind: 'Boot', text: 'Started Unsaved Playground at /hello-from-playground/.' },
    { kind: 'Runtime', text: 'Network access allowed. Multisite is off.' }
  ]
};

const titles = {
  runtime: ['Runtime profile', 'Settings control room'],
  create: ['Launch and replace', 'Start routes and ZIP import'],
  save: ['Storage destination', 'Save temporary Playground'],
  library: ['Saved objects', 'Saved and unsaved Playgrounds'],
  manager: ['Site Manager', 'Files, Blueprint, database, and logs'],
  transfer: ['Portability', 'Export, download, and transfer history']
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function addHistory(kind, text) {
  state.history.unshift({ kind, text });
  state.history = state.history.slice(0, 8);
  renderHistory();
}

function setActiveTab(tab) {
  $$('.op-tab').forEach((button) => button.classList.toggle('is-active', button.dataset.tab === tab));
  $$('.panel-view').forEach((view) => view.classList.toggle('is-active', view.id === `tab-${tab}`));
  $('#panelEyebrow').textContent = titles[tab][0];
  $('#panelTitle').textContent = titles[tab][1];
}

function setManagerTab(tab) {
  $$('.manager-tab').forEach((button) => button.classList.toggle('is-active', button.dataset.managerTab === tab));
  $$('.manager-view').forEach((view) => view.classList.toggle('is-active', view.id === `manager-${tab}`));
}

function renderShell() {
  $('#shellTitle').textContent = state.title;
  $('#shellSubtitle').textContent = state.subtitle;
  $('#storageBadge').textContent = state.storage;
  $('#storageBadge').className = state.storage === 'Temporary' || state.storage.includes('import')
    ? 'state-pill state-pill--warn'
    : 'state-pill state-pill--saved';
  $('#pathInput').value = state.path;
  $('#previewPath').textContent = state.path;
  $('#runtimeBadge').textContent = `WP ${state.wp} / PHP ${state.php}`;
  $('#managerRuntime').textContent = `WP ${state.wp} / PHP ${state.php}`;
  $('#managerLanguage').textContent = state.language;
  $('#managerNetwork').textContent = `${state.network ? 'Allowed' : 'Blocked'} / Multisite ${state.multisite ? 'on' : 'off'}`;
  $('#dbSize').textContent = state.dbSize;

  const saved = state.storage !== 'Temporary' && !state.storage.includes('import');
  $('#modeBadge').textContent = saved ? 'Stored Save & Reload mode' : 'Unsaved reset mode';
  $('#managerAction').textContent = saved ? 'Save & Reload' : 'Apply Settings & Reset Playground';
  $('#applyRuntimeBtn').textContent = saved ? 'Save & Reload runtime' : 'Apply Settings & Reset Playground';
  $('#runtimeWarning').innerHTML = saved
    ? '<strong>Stored Playground settings reload the saved identity.</strong><span>Reload keeps the browser/local storage object and updates runtime badges.</span>'
    : '<strong>Applying runtime settings resets this unsaved Playground.</strong><span>Save first to switch this action to Save & Reload.</span>';

  $('#previewHeadline').textContent = state.title.includes('ZIP')
    ? 'Imported ZIP Playground is running'
    : state.title.includes('PR')
      ? 'Preview Playground is ready'
      : 'Hello from WordPress Playground!';
}

function renderLibrary() {
  const list = $('#libraryList');
  list.innerHTML = '';
  state.library.forEach((item) => {
    const row = document.createElement('div');
    row.className = `library-row${item.active ? ' is-active' : ''}`;
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <span>${item.type} - ${item.meta}</span>
      </div>
      <div class="row-actions">
        <button class="secondary" data-open="${item.id}">Open</button>
        <button class="secondary" data-rename="${item.id}">Rename</button>
        <button class="danger" data-delete="${item.id}">Delete</button>
      </div>
    `;
    list.appendChild(row);
  });
  $('#libraryCount').textContent = `${state.library.length} objects`;

  $$('[data-open]').forEach((button) => {
    button.addEventListener('click', () => openLibraryItem(button.dataset.open));
  });
  $$('[data-rename]').forEach((button) => {
    button.addEventListener('click', () => renameLibraryItem(button.dataset.rename));
  });
  $$('[data-delete]').forEach((button) => {
    button.addEventListener('click', () => requestDelete(button.dataset.delete));
  });
}

function renderHistory() {
  $('#historyList').innerHTML = state.history.map((event) => `
    <div class="history-item">
      <span>${event.kind}</span>
      <p>${event.text}</p>
    </div>
  `).join('');
}

function openLibraryItem(id) {
  const item = state.library.find((entry) => entry.id === id);
  if (!item) return;
  state.library.forEach((entry) => {
    entry.active = entry.id === id;
  });
  state.title = item.name;
  state.storage = item.type;
  state.subtitle = item.meta;
  state.path = item.type === 'Temporary' ? '/hello-from-playground/' : `/${slugify(item.name)}/`;
  addHistory('Library', `Opened ${item.name}.`);
  renderAll();
}

function renameLibraryItem(id) {
  const item = state.library.find((entry) => entry.id === id);
  if (!item) return;
  item.name = item.name.includes('Renamed') ? item.name : `${item.name} Renamed`;
  if (item.active) {
    state.title = item.name;
    state.path = `/${slugify(item.name)}/`;
  }
  item.meta = `${item.meta} - renamed a moment ago`;
  addHistory('Library', `Renamed saved row to ${item.name}.`);
  renderAll();
}

function requestDelete(id) {
  state.deleteTarget = id;
  $('#deleteConfirm').hidden = false;
  setActiveTab('library');
}

function confirmDelete() {
  if (!state.deleteTarget) return;
  const target = state.library.find((item) => item.id === state.deleteTarget);
  if (!target) return;
  const wasActive = target.active;
  state.library = state.library.filter((item) => item.id !== state.deleteTarget);
  if (wasActive) {
    state.library.unshift({ id: 'fallback', name: 'Unsaved Playground', meta: 'Temporary fallback after delete', type: 'Temporary', active: true });
    state.title = 'Unsaved Playground';
    state.storage = 'Temporary';
    state.subtitle = 'Temporary fallback after deleting the active saved Playground';
    state.path = '/hello-from-playground/';
  }
  addHistory('Delete', `Deleted ${target.name}. ${wasActive ? 'Active shell fell back to Unsaved Playground.' : 'Active shell unchanged.'}`);
  state.deleteTarget = null;
  $('#deleteConfirm').hidden = true;
  renderAll();
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'playground';
}

function simulateProgress(progressEl, textEl, percentEl, barEl, steps, done) {
  progressEl.hidden = false;
  let index = 0;
  const tick = () => {
    const step = steps[index];
    textEl.textContent = step.text;
    percentEl.textContent = `${step.percent}%`;
    barEl.style.width = `${step.percent}%`;
    index += 1;
    if (index < steps.length) {
      window.setTimeout(tick, 320);
    } else {
      window.setTimeout(() => {
        progressEl.hidden = true;
        done();
      }, 360);
    }
  };
  tick();
}

function saveBrowser() {
  const name = $('#browserSaveName').value.trim() || 'Saved Playground';
  simulateProgress(
    $('#saveProgress'),
    $('#saveProgressText'),
    $('#savePercent'),
    $('#saveProgress .bar span'),
    [
      { text: 'Saving 812 / 3751 files to browser storage', percent: 22 },
      { text: 'Saving 2478 / 3751 files to browser storage', percent: 66 },
      { text: 'Saving 3751 / 3751 files to browser storage', percent: 100 }
    ],
    () => {
      state.title = name;
      state.storage = 'Browser saved';
      state.subtitle = `Saved in this browser at /${slugify(name)}/`;
      state.path = `/${slugify(name)}/`;
      upsertActiveLibrary({ id: 'active', name, meta: 'Saved in browser storage a moment ago', type: 'Browser saved', active: true });
      $('#saveResultText').textContent = `${name} is now saved in this browser. Runtime actions now use Save & Reload instead of destructive reset.`;
      addHistory('Save', `Saved ${name} in browser storage.`);
      renderAll();
    }
  );
}

function saveLocal() {
  const name = $('#localSaveName').value.trim() || 'Local Directory Playground';
  $('#folderStatus').textContent = 'Folder permission granted: ~/Playgrounds/wordpress-playground-local';
  simulateProgress(
    $('#saveProgress'),
    $('#saveProgressText'),
    $('#savePercent'),
    $('#saveProgress .bar span'),
    [
      { text: 'Preparing local folder handle', percent: 15 },
      { text: 'Copying 2034 / 3751 files to local directory', percent: 58 },
      { text: 'Syncing database and blueprint bundle', percent: 86 },
      { text: 'Local directory save complete', percent: 100 }
    ],
    () => {
      state.title = name;
      state.storage = 'Local directory';
      state.subtitle = 'Local folder backed - reconnect permission after browser refresh';
      state.path = `/${slugify(name)}/`;
      upsertActiveLibrary({ id: 'active', name, meta: 'Local directory ~/Playgrounds/wordpress-playground-local', type: 'Local directory', active: true });
      $('#saveResultText').textContent = `${name} is backed by a local directory. Browser refresh may require reconnecting folder permission.`;
      addHistory('Save', `Saved ${name} to a local directory.`);
      renderAll();
    }
  );
}

function upsertActiveLibrary(next) {
  state.library = state.library.filter((item) => item.id !== 'fallback');
  const current = state.library.find((item) => item.id === next.id);
  state.library.forEach((item) => {
    item.active = false;
  });
  if (current) {
    Object.assign(current, next);
  } else {
    state.library.unshift(next);
  }
}

function applyRuntime() {
  state.wp = $('#wpVersion').value;
  state.php = $('#phpVersion').value;
  state.language = $('#language').value;
  state.network = $('#networkAccess').checked;
  state.multisite = $('#multisite').checked;
  state.older = $('#olderVersions').checked;
  const stored = state.storage !== 'Temporary' && !state.storage.includes('import');
  simulateProgress(
    $('#runtimeProgress'),
    $('#runtimeProgressText'),
    $('#runtimePercent'),
    $('#runtimeProgress .bar span'),
    stored
      ? [
          { text: 'Saving runtime profile to stored Playground', percent: 35 },
          { text: 'Reloading WordPress with saved settings', percent: 78 },
          { text: 'Stored runtime reloaded', percent: 100 }
        ]
      : [
          { text: 'Confirming destructive reset', percent: 20 },
          { text: 'Rebuilding files and SQLite database', percent: 70 },
          { text: 'Unsaved Playground reset complete', percent: 100 }
        ],
    () => {
      state.path = '/hello-from-playground/';
      $('#previewBody').textContent = stored
        ? 'The saved Playground reloaded with the selected WordPress, PHP, language, network, and multisite settings.'
        : 'The temporary Playground was reset with the selected runtime settings. Save it to keep this state after refresh.';
      addHistory('Runtime', `${stored ? 'Saved and reloaded' : 'Reset'} runtime to WP ${state.wp}, PHP ${state.php}.`);
      renderAll();
    }
  );
}

function chooseZip() {
  $('#zipSource').textContent = 'Selected workshop-site.zip - 18.4 MB';
  updateZipSteps('warning');
  $('#zipWarning').hidden = false;
  addHistory('ZIP import', 'Selected workshop-site.zip and staged replacement warning.');
}

function updateZipSteps(current) {
  const order = ['source', 'warning', 'progress', 'result'];
  const currentIndex = order.indexOf(current);
  $$('[data-zip-step]').forEach((step) => {
    const index = order.indexOf(step.dataset.zipStep);
    step.classList.toggle('is-current', index === currentIndex);
    step.classList.toggle('is-done', index < currentIndex);
  });
}

function importZip() {
  $('#zipWarning').hidden = true;
  updateZipSteps('progress');
  simulateProgress(
    $('#zipProgress'),
    $('#zipProgressText'),
    $('#zipPercent'),
    $('#zipProgress .bar span'),
    [
      { text: 'Validating workshop-site.zip structure', percent: 28 },
      { text: 'Replacing files and SQLite database', percent: 63 },
      { text: 'Preparing imported WordPress preview', percent: 91 },
      { text: 'ZIP import complete', percent: 100 }
    ],
    () => {
      state.title = 'ZIP Import: Workshop Site';
      state.storage = 'Temporary import';
      state.subtitle = 'Imported from workshop-site.zip - save to keep after refresh';
      state.path = '/';
      state.dbSize = '1.8 MB';
      upsertActiveLibrary({ id: 'active', name: 'ZIP Import: Workshop Site', meta: 'Temporary import from workshop-site.zip', type: 'Temporary import', active: true });
      $('#previewBody').textContent = 'The ZIP archive replaced the active files and database. This imported Playground is temporary until saved.';
      $('#previewNote').textContent = 'Imported from workshop-site.zip. Save before refresh.';
      updateZipSteps('result');
      addHistory('ZIP import', 'Imported workshop-site.zip and updated the active Playground identity.');
      renderAll();
      setActiveTab('create');
    }
  );
}

function startRoute(name) {
  state.title = name || 'Vanilla WordPress Playground';
  state.storage = 'Temporary';
  state.subtitle = 'Temporary preview route - save to keep after refresh';
  state.path = name && name.includes('PR') ? '/wp-admin/' : '/hello-from-playground/';
  upsertActiveLibrary({ id: 'active', name: state.title, meta: 'Temporary preview route result', type: 'Temporary', active: true });
  addHistory('Start', `Started ${state.title}.`);
  renderAll();
}

function runZipDownload() {
  setActiveTab('transfer');
  simulateProgress(
    $('#transferProgress'),
    $('#transferProgressText'),
    $('#transferPercent'),
    $('#transferProgress .bar span'),
    [
      { text: 'Collecting current files and wp-content', percent: 25 },
      { text: 'Bundling SQLite database and blueprint.json', percent: 62 },
      { text: 'Generating ZIP archive', percent: 88 },
      { text: 'ZIP generated', percent: 100 }
    ],
    () => {
      $('#zipDownloadStatus').textContent = `${slugify(state.title)}.zip generated from ${state.title}.`;
      addHistory('ZIP download', `Generated ${slugify(state.title)}.zip from the active Playground.`);
      renderHistory();
    }
  );
}

function runGithubExport() {
  setActiveTab('transfer');
  simulateProgress(
    $('#transferProgress'),
    $('#transferProgressText'),
    $('#transferPercent'),
    $('#transferProgress .bar span'),
    [
      { text: 'Checking session GitHub connection', percent: 20 },
      { text: 'Preparing repository adamziel/research-browser-playground', percent: 52 },
      { text: 'Pushing wp-content, blueprint, and database notes', percent: 86 },
      { text: 'GitHub export complete', percent: 100 }
    ],
    () => {
      $('#githubExportStatus').textContent = 'Export complete: pushed active Playground bundle to adamziel/research-browser-playground.';
      addHistory('GitHub export', 'Exported the active Playground to GitHub with a session-only token.');
      renderHistory();
    }
  );
}

function renderAll() {
  renderShell();
  renderLibrary();
  renderHistory();
}

function bindEvents() {
  $$('.op-tab').forEach((button) => {
    button.addEventListener('click', () => setActiveTab(button.dataset.tab));
  });
  $$('[data-open-tab]').forEach((button) => {
    button.addEventListener('click', () => setActiveTab(button.dataset.openTab));
  });
  $$('.manager-tab').forEach((button) => {
    button.addEventListener('click', () => setManagerTab(button.dataset.managerTab));
  });
  $('#homepageBtn').addEventListener('click', () => {
    state.path = '/hello-from-playground/';
    addHistory('Navigate', 'Opened Homepage.');
    renderAll();
  });
  $('#adminBtn').addEventListener('click', () => {
    state.path = '/wp-admin/';
    addHistory('Navigate', 'Opened WP Admin.');
    renderAll();
  });
  $('#refreshBtn').addEventListener('click', () => {
    addHistory('Refresh', `Refreshed ${state.path}.`);
  });
  $('#goPathBtn').addEventListener('click', () => {
    state.path = $('#pathInput').value || '/';
    addHistory('Navigate', `Navigated active WordPress iframe to ${state.path}.`);
    renderAll();
  });
  $('#saveBrowserBtn').addEventListener('click', saveBrowser);
  $('#chooseFolderBtn').addEventListener('click', () => {
    $('#folderStatus').textContent = 'Folder picker granted: ~/Playgrounds/wordpress-playground-local';
    addHistory('Local folder', 'Granted local directory permission.');
  });
  $('#saveLocalBtn').addEventListener('click', saveLocal);
  $('#applyRuntimeBtn').addEventListener('click', applyRuntime);
  $('#chooseZipBtn').addEventListener('click', chooseZip);
  $('#confirmZipBtn').addEventListener('click', importZip);
  $('#cancelZipBtn').addEventListener('click', () => {
    $('#zipWarning').hidden = true;
    updateZipSteps('source');
    $('#zipSource').textContent = 'Import canceled - no archive selected';
    addHistory('ZIP import', 'Canceled ZIP replacement warning.');
  });
  $('#confirmDeleteBtn').addEventListener('click', confirmDelete);
  $('#cancelDeleteBtn').addEventListener('click', () => {
    state.deleteTarget = null;
    $('#deleteConfirm').hidden = true;
    addHistory('Delete', 'Canceled delete confirmation.');
  });
  $$('.route-start').forEach((button) => {
    button.addEventListener('click', () => startRoute(button.dataset.routeName || button.closest('.route-card').dataset.route));
  });
  $('#connectGithubBtn').addEventListener('click', () => {
    state.githubConnected = true;
    $('#connectGithubBtn').textContent = 'GitHub connected';
    addHistory('GitHub import', 'Connected GitHub account. Token is not stored after refresh.');
  });
  $('#downloadZipBtn').addEventListener('click', runZipDownload);
  $('#managerZipBtn').addEventListener('click', runZipDownload);
  $('#exportGithubBtn').addEventListener('click', runGithubExport);
  $('#runGithubExportBtn').addEventListener('click', runGithubExport);
  $('#transferGithubImportBtn').addEventListener('click', () => {
    addHistory('GitHub import', 'GitHub import route opened with account connection and replacement warning.');
  });
  $('#transferDbBtn').addEventListener('click', () => {
    $('#databaseResult').textContent = 'database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite.';
    addHistory('Database', 'Downloaded database.sqlite.');
  });
  $('#downloadDbBtn').addEventListener('click', () => {
    $('#databaseResult').textContent = 'database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite.';
    addHistory('Database', 'Downloaded database.sqlite from Site Manager.');
  });
  $('#fileEditor').addEventListener('input', () => {
    $('#fileDirty').textContent = 'Dirty';
    $('#fileDirty').style.color = '#ad6900';
    $('#fileResult').textContent = 'Unsaved edits in wp-config.php.';
  });
  $('#saveFileBtn').addEventListener('click', () => {
    $('#fileDirty').textContent = 'Saved';
    $('#fileDirty').style.color = '#0a8f5b';
    $('#fileResult').textContent = 'wp-config.php saved successfully.';
    addHistory('Files', 'Saved /wordpress/wp-config.php.');
  });
  $('#copyBlueprintBtn').addEventListener('click', () => {
    $('#blueprintResult').textContent = 'Blueprint link copied.';
    addHistory('Blueprint', 'Copied Blueprint URL.');
  });
  $('#downloadBlueprintBtn').addEventListener('click', () => {
    $('#blueprintResult').textContent = 'Blueprint bundle downloaded.';
    addHistory('Blueprint', 'Downloaded Blueprint bundle.');
  });
  $('#runBlueprintBtn').addEventListener('click', () => {
    $('#blueprintResult').textContent = 'Blueprint validated and ran. Current content may be replaced.';
    state.path = '/hello-from-playground/';
    addHistory('Blueprint', 'Validated and ran the current Blueprint.');
    renderAll();
  });
  $$('.blueprint-card').forEach((button) => {
    button.addEventListener('click', () => {
      $$('.blueprint-card').forEach((card) => card.classList.remove('is-selected'));
      button.classList.add('is-selected');
      addHistory('Blueprint', `Selected ${button.childNodes[0].textContent.trim()} from a representative 6 of 43 gallery subset.`);
    });
  });
}

bindEvents();
renderAll();
