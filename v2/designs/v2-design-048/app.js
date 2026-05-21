const app = document.querySelector('.app');
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const state = {
  selectedId: 'temp',
  activeId: 'temp',
  shellTitle: 'Unsaved Playground',
  subtitle: 'Temporary site. Runtime reset will replace files and database.',
  storage: 'Temporary',
  path: '/hello-from-playground/',
  wp: 'latest',
  php: '8.3',
  language: 'English (United States)',
  older: false,
  network: true,
  multisite: false,
  dbSize: '452 KB',
  fileDirty: false,
  githubConnected: false,
  selectedCommand: 'admin',
  confirmAction: null,
  rows: [
    {
      id: 'temp',
      title: 'Unsaved Playground',
      detail: 'Active live site',
      type: 'playground',
      state: 'Temporary',
      stateClass: 'warn',
      source: 'Browser memory',
      runtime: 'WP latest / PHP 8.3',
      last: 'Booted at /hello-from-playground/',
      filter: 'saved',
      description: 'This active Playground is not saved. Refreshing or replacing it loses files and the SQLite database unless it is saved first.'
    },
    {
      id: 'browser',
      title: 'Research Browser Playground',
      detail: 'Saved in this browser',
      type: 'playground',
      state: 'Saved',
      stateClass: 'ok',
      source: 'IndexedDB browser storage',
      runtime: 'WP latest / PHP 8.3',
      last: 'Created May 21, 2026',
      filter: 'saved',
      description: 'A browser-backed saved Playground opens by slug and can be renamed, reloaded, or deleted from the saved list.'
    },
    {
      id: 'local',
      title: 'Theme QA Local Directory',
      detail: 'Local folder backed',
      type: 'playground',
      state: 'Permission needed',
      stateClass: 'warn',
      source: '~/Playgrounds/theme-qa',
      runtime: 'WP 6.8 / PHP 8.2',
      last: 'Reconnect folder permission after refresh',
      filter: 'saved',
      description: 'A local-directory Playground writes to a selected folder and needs browser folder permission again after refresh.'
    },
    {
      id: 'database',
      title: 'SQLite database',
      detail: '/wordpress/wp-content/database/.ht.sqlite',
      type: 'operation',
      state: 'Ready',
      stateClass: '',
      source: 'MySQL emulation backed by SQLite',
      runtime: '452 KB',
      last: 'Adminer and phpMyAdmin available',
      filter: 'ops',
      description: 'The current site database can be downloaded as database.sqlite, opened in Adminer, or opened in phpMyAdmin.'
    },
    {
      id: 'file',
      title: 'wp-config.php',
      detail: '/wordpress/wp-config.php',
      type: 'operation',
      state: 'Clean',
      stateClass: '',
      source: 'File browser',
      runtime: 'Editable PHP',
      last: 'Selected in Site Manager',
      filter: 'ops',
      description: 'The file browser supports new files, folders, uploads, browsing, selected-file editing, dirty state, and save results.'
    },
    {
      id: 'blueprint',
      title: 'Art Gallery Blueprint',
      detail: 'Representative gallery item',
      type: 'operation',
      state: 'Validated',
      stateClass: 'ok',
      source: 'Blueprint gallery, 6 shown of 43',
      runtime: 'Website / Personal',
      last: 'JSON validated',
      filter: 'ops',
      description: 'Blueprint actions can copy a link, download a bundle, run from URL, or replace the current site after validation.'
    },
    {
      id: 'zip',
      title: 'ZIP import',
      detail: 'No archive selected',
      type: 'transfer',
      state: 'Waiting',
      stateClass: 'warn',
      source: 'Native file chooser',
      runtime: 'Replacement flow',
      last: 'Choose .zip before import',
      filter: 'transfers',
      description: 'Importing a ZIP validates the archive, warns that current files and database are replaced, then updates the active Playground identity.'
    },
    {
      id: 'github',
      title: 'GitHub export',
      detail: 'Repository not selected',
      type: 'transfer',
      state: 'Connect account',
      stateClass: 'warn',
      source: 'GitHub import/export',
      runtime: 'Token not stored after refresh',
      last: 'Awaiting account connection',
      filter: 'transfers',
      description: 'GitHub flows import plugins, themes, or wp-content directories and export the current Playground after account connection.'
    }
  ],
  events: [
    ['Boot', 'Started Unsaved Playground at /hello-from-playground/.'],
    ['Runtime', 'Network access is allowed. Multisite is off. Older versions hidden.'],
    ['Files', 'Selected /wordpress/wp-config.php in Site Manager.'],
    ['Database', 'SQLite database ready at /wordpress/wp-content/database/.ht.sqlite.']
  ],
  blueprints: [
    ['Art Gallery', 'Website Personal Featured', 'An art gallery created with the Vueo theme.'],
    ['Coffee Shop', 'WooCommerce Store Featured', 'A stylish WooCommerce coffee shop storefront.'],
    ['Feed Reader with the Friends Plugin', 'Content rss social web', 'Read feeds from the web in Playground.'],
    ['Gaming News', 'Website News', 'A gaming news site created with the Spiel theme.'],
    ['Non-profit Organization', 'Website Organization', 'A non-profit organization site created with the Koinonia theme.'],
    ['Personal Blog', 'Website Personal Blog', 'A personal blog created with the Substrata theme.']
  ]
};

const commandData = {
  admin: {
    title: 'Open WP Admin',
    description: 'Navigate the protected live WordPress shell to /wp-admin/ and record the navigation.',
    run: () => {
      state.path = '/wp-admin/';
      $('#previewHeading').textContent = 'WordPress Admin is open';
      $('#previewText').textContent = 'The path input, preview frame, and event record changed together after command execution.';
      addEvent('Command', 'Command search opened WP Admin at /wp-admin/.');
      updateRow('temp', { last: 'Command opened WP Admin' });
      selectRow('temp');
    }
  },
  homepage: {
    title: 'Open Homepage',
    description: 'Navigate back to the Playground homepage route.',
    run: () => {
      state.path = '/hello-from-playground/';
      $('#previewHeading').textContent = 'Hello from WordPress Playground!';
      $('#previewText').textContent = 'Homepage restored through command search.';
      addEvent('Command', 'Command search opened Homepage.');
      updateRow('temp', { last: 'Command opened Homepage' });
      selectRow('temp');
    }
  },
  php: {
    title: 'Change PHP version to 8.2',
    description: 'Select PHP 8.2, then use reset or Save & Reload consequences based on the active storage mode.',
    run: () => {
      state.php = '8.2';
      $('#phpSelect').value = '8.2';
      updateRuntimeRows('Command selected PHP 8.2');
      addEvent('Command', 'Command search changed PHP selector to 8.2. Runtime is pending reset or reload.');
      selectRow('temp');
    }
  },
  reset: {
    title: 'Apply settings and reset unsaved site',
    description: 'Destructive reset: current unsaved files and database are replaced by the selected runtime profile.',
    run: () => applyRuntimeSettings()
  },
  database: {
    title: 'Download database.sqlite',
    description: 'Select the SQLite-backed database row and finish a database download with progress and logs.',
    run: () => downloadDatabase()
  },
  export: {
    title: 'Export current site to GitHub',
    description: 'Connect GitHub if needed, choose repository, push current Playground, then mark export complete.',
    run: () => exportGithub()
  }
};

function rowById(id) {
  return state.rows.find((row) => row.id === id);
}

function updateRow(id, patch) {
  Object.assign(rowById(id), patch);
}

function addEvent(kind, text) {
  state.events.unshift([kind, text]);
  state.events = state.events.slice(0, 9);
  renderEvents();
}

function badgeClass(row) {
  if (row.stateClass === 'ok') return 'badge badge-ok';
  if (row.stateClass === 'warn') return 'badge badge-warn';
  if (row.stateClass === 'danger') return 'badge badge-danger';
  return 'badge';
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'playground';
}

function renderRows(filter = 'all') {
  const tbody = $('#objectRows');
  tbody.innerHTML = '';
  const rows = state.rows.filter((row) => filter === 'all' || row.filter === filter);
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    tr.className = `${row.id === state.selectedId ? 'is-selected' : ''} ${row.state === 'Deleted' ? 'is-deleted' : ''}`;
    tr.dataset.id = row.id;
    tr.innerHTML = `
      <td><div class="row-title"><strong>${row.title}</strong><span>${row.detail}</span></div></td>
      <td><span class="${badgeClass(row)}">${row.state}</span></td>
      <td><small>${row.source}</small></td>
      <td>${row.runtime}</td>
      <td><small>${row.last}</small></td>
      <td><div class="row-actions">${rowButtons(row)}</div></td>
    `;
    tbody.appendChild(tr);
  });
  $('#tableSummary').textContent = `${rows.length} visible rows. ${rowById(state.selectedId).title} selected.`;
}

function rowButtons(row) {
  if (row.id === 'temp') {
    return '<button class="ghost" data-action="saveBrowser">Save browser</button><button class="ghost" data-action="saveLocal">Save local</button>';
  }
  if (row.id === 'browser') {
    return '<button class="ghost" data-action="open">Open/Manage</button><button class="ghost" data-action="rename">Rename</button><button class="danger" data-action="delete">Delete</button>';
  }
  if (row.id === 'local') {
    return '<button class="ghost" data-action="grantLocal">Grant folder</button><button class="ghost" data-action="reloadLocal">Save & Reload</button>';
  }
  if (row.id === 'database') {
    return '<button class="ghost" data-action="downloadDb">Download</button><button class="ghost" data-action="adminer">Adminer</button>';
  }
  if (row.id === 'file') {
    return '<button class="ghost" data-action="dirtyFile">Edit</button><button class="ghost" data-action="saveFile">Save</button>';
  }
  if (row.id === 'blueprint') {
    return '<button class="ghost" data-action="runBlueprint">Run</button><button class="ghost" data-action="copyBlueprint">Copy</button>';
  }
  if (row.id === 'zip') {
    return '<button class="ghost" data-action="zipPick">Choose ZIP</button><button class="danger" data-action="zipImport">Import</button>';
  }
  if (row.id === 'github') {
    return '<button class="ghost" data-action="connectGithub">Connect</button><button class="ghost" data-action="exportGithub">Export</button>';
  }
  return '<button class="ghost" data-action="select">Select</button>';
}

function renderDetail() {
  const row = rowById(state.selectedId);
  $('#detailType').textContent = row.type === 'playground' ? 'Selected Playground' : row.type === 'transfer' ? 'Selected transfer' : 'Selected manager tool';
  $('#detailTitle').textContent = row.title;
  $('#detailBadge').textContent = row.state;
  $('#detailBadge').className = badgeClass(row);
  $('#detailDescription').textContent = row.description;
  $('#detailActions').innerHTML = detailButtons(row);
}

function detailButtons(row) {
  if (row.id === 'temp') {
    return '<button class="primary" data-action="saveBrowser">Save in this browser</button><button class="ghost" data-action="saveLocal">Save to local directory</button><button class="danger" data-action="reset">Apply Settings & Reset</button>';
  }
  if (row.id === 'browser') {
    return '<button class="primary" data-action="open">Open/Manage saved Playground</button><button class="ghost" data-action="rename">Rename</button><button class="danger" data-action="delete">Delete with confirmation</button>';
  }
  if (row.id === 'local') {
    return '<button class="primary" data-action="grantLocal">Grant folder permission</button><button class="ghost" data-action="reloadLocal">Save & Reload</button>';
  }
  if (row.id === 'database') {
    return '<button class="primary" data-action="downloadDb">Download database.sqlite</button><button class="ghost" data-action="adminer">Open Adminer</button><button class="ghost" data-action="phpmyadmin">Open phpMyAdmin</button>';
  }
  if (row.id === 'file') {
    return '<button class="ghost" data-action="dirtyFile">Edit selected file</button><button class="primary" data-action="saveFile">Save file</button>';
  }
  if (row.id === 'blueprint') {
    return '<button class="ghost" data-action="copyBlueprint">Copy Blueprint link</button><button class="ghost" data-action="downloadBlueprint">Download bundle</button><button class="primary" data-action="runBlueprint">Run Blueprint</button>';
  }
  if (row.id === 'zip') {
    return '<button class="ghost" data-action="zipPick">Choose workshop-site.zip</button><button class="danger" data-action="zipImport">Replace and import</button>';
  }
  if (row.id === 'github') {
    return '<button class="ghost" data-action="connectGithub">Connect GitHub account</button><button class="primary" data-action="exportGithub">Export current site</button>';
  }
  return '';
}

function renderShell() {
  $('#shellTitle').textContent = state.shellTitle;
  $('#shellSubtitle').textContent = state.subtitle;
  $('#storageBadge').textContent = state.storage;
  $('#storageBadge').className = state.storage.includes('Temporary') ? 'badge badge-warn' : 'badge badge-ok';
  $('#pathInput').value = state.path;
  $('#previewPath').textContent = state.path;
  $('#runtimeBadge').textContent = `WP ${state.wp} / PHP ${state.php}`;
  $('#factWp').textContent = state.wp;
  $('#factPhp').textContent = state.php;
  $('#factLang').textContent = state.language;
  $('#factNet').textContent = `${state.network ? 'Allowed' : 'Blocked'}, multisite ${state.multisite ? 'on' : 'off'}`;
  $('#settingsConsequence').textContent = state.storage.includes('Temporary')
    ? 'Unsaved settings reset the Playground and replace files/database. Save first to switch to Save & Reload.'
    : 'Stored Playground settings use Save & Reload and preserve the saved identity.';
}

function renderEvents() {
  $('#eventCount').textContent = `${state.events.length} events`;
  $('#eventList').innerHTML = state.events.map(([kind, text]) => `
    <div class="event-item"><strong>${kind}</strong><span>${text}</span></div>
  `).join('');
}

function renderBlueprints(filter = 'All', query = '') {
  const q = query.trim().toLowerCase();
  const cards = state.blueprints.filter(([name, tags]) => {
    const matchFilter = filter === 'All' || tags.toLowerCase().includes(filter.toLowerCase());
    const matchQuery = !q || `${name} ${tags}`.toLowerCase().includes(q);
    return matchFilter && matchQuery;
  });
  $('#catalogGrid').innerHTML = cards.map(([name, tags, text], index) => `
    <button class="catalog-card ${index === 0 ? 'is-selected' : ''}" data-blueprint-name="${name}">
      <div class="catalog-shot">${name.split(' ')[0]}</div>
      <div class="catalog-copy"><strong>${name}</strong><span>${text}</span><span>${tags}</span></div>
    </button>
  `).join('');
}

function renderAll() {
  const filter = $('.view-tab.is-active')?.dataset.filter || 'all';
  renderRows(filter);
  renderDetail();
  renderShell();
  renderEvents();
  renderBlueprints($('.chip.is-active')?.dataset.blueprintFilter || 'All', $('#blueprintSearch').value);
}

function selectRow(id) {
  if (!rowById(id)) return;
  state.selectedId = id;
  renderAll();
}

function showProgress(label, steps, done) {
  const card = $('#progressCard');
  const fill = $('#progressFill');
  const progressLabel = $('#progressLabel');
  const percent = $('#progressPercent');
  card.hidden = false;
  fill.style.width = '0%';
  let index = 0;
  const tick = () => {
    const step = steps[index];
    progressLabel.textContent = step.text || label;
    percent.textContent = `${step.value}%`;
    fill.style.width = `${step.value}%`;
    index += 1;
    if (index < steps.length) {
      window.setTimeout(tick, 340);
    } else {
      window.setTimeout(() => {
        card.hidden = true;
        done?.();
      }, 260);
    }
  };
  tick();
}

function saveBrowser() {
  selectRow('temp');
  updateRow('temp', {
    state: 'Saving',
    stateClass: 'warn',
    last: 'Saving 0 / 3751 files to browser storage'
  });
  renderAll();
  showProgress('Saving to browser', [
    { text: 'Saving 834 / 3751 files to browser storage', value: 22 },
    { text: 'Saving 2396 / 3751 files to browser storage', value: 64 },
    { text: 'Saving 3751 / 3751 files to browser storage', value: 100 }
  ], () => {
    state.shellTitle = 'Research Browser Playground';
    state.subtitle = 'Saved in this browser at /research-browser-playground/.';
    state.storage = 'Browser saved';
    state.path = '/research-browser-playground/';
    state.activeId = 'temp';
    updateRow('temp', {
      title: 'Research Browser Playground',
      detail: 'Transformed from temporary row',
      state: 'Saved',
      stateClass: 'ok',
      source: 'IndexedDB browser storage',
      runtime: `WP ${state.wp} / PHP ${state.php}`,
      last: 'Saved 3751 files in this browser',
      description: 'This row was the temporary Playground. It is now addressable from the saved list and uses Save & Reload for runtime changes.'
    });
    $('#previewHeading').textContent = 'Saved Playground is running';
    $('#previewText').textContent = 'The temporary row became a browser-saved Playground; shell title, path, storage badge, table row, and history all changed.';
    addEvent('Save', 'Finished Save in this browser. Temporary row transformed into Research Browser Playground.');
    renderAll();
  });
}

function saveLocal() {
  selectRow('local');
  updateRow('local', {
    state: 'Permission prompt',
    stateClass: 'warn',
    last: 'Folder picker opened for ~/Playgrounds/theme-qa'
  });
  renderAll();
  showProgress('Requesting local folder', [
    { text: 'Waiting for folder permission', value: 18 },
    { text: 'Copying 1420 / 3751 files to local directory', value: 48 },
    { text: 'Copying 3751 / 3751 files to local directory', value: 100 }
  ], () => {
    state.shellTitle = 'Theme QA Local Directory';
    state.subtitle = 'Saved to local directory. Browser refresh requires reconnecting folder permission.';
    state.storage = 'Local directory';
    state.path = '/theme-qa-local-directory/';
    updateRow('local', {
      state: 'Local saved',
      stateClass: 'ok',
      last: 'Folder permission granted and files copied',
      runtime: `WP ${state.wp} / PHP ${state.php}`
    });
    addEvent('Save', 'Finished Save to a local directory. Permission granted for ~/Playgrounds/theme-qa.');
    $('#previewHeading').textContent = 'Local directory Playground is running';
    $('#previewText').textContent = 'This save destination has folder permission and reconnect consequences after refresh.';
    renderAll();
  });
}

function openSaved() {
  const row = rowById(state.selectedId);
  if (!row || row.state === 'Deleted') return;
  state.shellTitle = row.title;
  state.subtitle = row.detail;
  state.storage = row.id === 'local' ? 'Local directory' : row.id === 'temp' ? row.state : 'Browser saved';
  state.path = `/${slugify(row.title)}/`;
  addEvent('Library', `Opened ${row.title}.`);
  renderAll();
}

function renameSaved() {
  const row = rowById(state.selectedId);
  if (!row || row.state === 'Deleted') return;
  row.title = row.title.includes('Renamed') ? row.title : `${row.title} Renamed`;
  row.last = 'Renamed a moment ago';
  if (state.shellTitle.includes('Research') || state.selectedId === 'temp') {
    state.shellTitle = row.title;
    state.path = `/${slugify(row.title)}/`;
  }
  addEvent('Rename', `Renamed selected Playground to ${row.title}.`);
  renderAll();
}

function requestDelete() {
  const row = rowById(state.selectedId);
  $('#confirmTitle').textContent = `Delete ${row.title}?`;
  $('#confirmText').textContent = 'Deleting removes this saved Playground from the list. If it is active, the shell falls back to an unsaved Playground.';
  $('#confirmBox').hidden = false;
  state.confirmAction = () => {
    row.state = 'Deleted';
    row.stateClass = 'danger';
    row.last = 'Deleted. Final state retained for audit.';
    row.description = 'This saved row has completed the destructive delete flow. It can no longer be opened.';
    if (state.shellTitle === row.title) {
      state.shellTitle = 'Unsaved Playground';
      state.subtitle = 'Temporary fallback after deleting the active saved Playground.';
      state.storage = 'Temporary';
      state.path = '/hello-from-playground/';
      updateRow('temp', {
        title: 'Unsaved Playground',
        detail: 'Fallback temporary site',
        state: 'Temporary',
        stateClass: 'warn',
        source: 'Browser memory',
        last: 'Active shell fallback after delete'
      });
    }
    $('#confirmBox').hidden = true;
    addEvent('Delete', `Confirmed delete for ${row.title}. Active shell fallback applied when needed.`);
    renderAll();
  };
}

function grantLocal() {
  selectRow('local');
  updateRow('local', { state: 'Reconnecting', stateClass: 'warn', last: 'Requesting local folder permission' });
  renderAll();
  showProgress('Reconnecting folder', [
    { text: 'Checking local directory handle', value: 30 },
    { text: 'Verifying write permission', value: 70 },
    { text: 'Local directory reconnected', value: 100 }
  ], () => {
    updateRow('local', { state: 'Local saved', stateClass: 'ok', last: 'Folder permission reconnected' });
    addEvent('Local directory', 'Reconnected ~/Playgrounds/theme-qa folder permission.');
    renderAll();
  });
}

function reloadLocal() {
  selectRow('local');
  showProgress('Save and reload', [
    { text: 'Writing runtime settings to local directory', value: 40 },
    { text: 'Reloading saved local Playground', value: 80 },
    { text: 'Local Playground reloaded', value: 100 }
  ], () => {
    updateRow('local', { last: `Save & Reload completed with WP ${state.wp} / PHP ${state.php}` });
    state.storage = 'Local directory';
    state.shellTitle = 'Theme QA Local Directory';
    state.subtitle = 'Saved local Playground reloaded with selected runtime settings.';
    addEvent('Runtime', 'Save & Reload completed for local-directory Playground.');
    renderAll();
  });
}

function updateRuntimeRows(last) {
  state.wp = $('#wpSelect').value;
  state.php = $('#phpSelect').value;
  state.language = $('#languageSelect').value;
  state.older = $('#olderToggle').checked;
  state.network = $('#networkToggle').checked;
  state.multisite = $('#multisiteToggle').checked;
  state.rows.forEach((row) => {
    if (row.type === 'playground') row.runtime = `WP ${state.wp} / PHP ${state.php}`;
  });
  updateRow('temp', { last });
  renderAll();
}

function applyRuntimeSettings() {
  selectRow('temp');
  updateRuntimeRows('Runtime reset queued');
  const saved = !state.storage.includes('Temporary');
  updateRow('temp', {
    state: saved ? 'Reloading' : 'Resetting',
    stateClass: 'warn',
    last: saved ? 'Save & Reload started' : 'Destructive reset started'
  });
  renderAll();
  showProgress('Applying runtime', [
    { text: saved ? 'Saving runtime profile' : 'Discarding unsaved files and database', value: 28 },
    { text: `Booting WP ${state.wp} with PHP ${state.php}`, value: 72 },
    { text: saved ? 'Saved Playground reloaded' : 'Temporary Playground reset', value: 100 }
  ], () => {
    updateRow('temp', {
      state: saved ? 'Saved' : 'Temporary',
      stateClass: saved ? 'ok' : 'warn',
      last: saved ? 'Save & Reload complete' : 'Reset complete with selected runtime'
    });
    $('#previewHeading').textContent = saved ? 'Saved Playground reloaded' : 'Runtime reset complete';
    $('#previewText').textContent = `Running WordPress ${state.wp}, PHP ${state.php}, ${state.language}. Network ${state.network ? 'allowed' : 'blocked'}, multisite ${state.multisite ? 'on' : 'off'}.`;
    addEvent('Runtime', saved ? 'Completed Save & Reload for stored Playground.' : 'Completed destructive reset for unsaved Playground.');
    renderAll();
  });
}

function dirtyFile() {
  selectRow('file');
  state.fileDirty = true;
  $('#fileDirty').textContent = 'Dirty';
  $('#fileDirty').className = 'badge badge-warn';
  $('#fileEditor').value += "\n\ndefine( 'WP_DEBUG', true );";
  updateRow('file', { state: 'Dirty', stateClass: 'warn', last: 'Unsaved editor changes' });
  addEvent('Files', 'Edited /wordpress/wp-config.php. Dirty state is visible.');
  renderAll();
}

function saveFile() {
  selectRow('file');
  if (!state.fileDirty) {
    updateRow('file', { last: 'Save skipped because file is clean' });
    addEvent('Files', 'Save requested for clean wp-config.php. No changes written.');
    renderAll();
    return;
  }
  updateRow('file', { state: 'Saving', stateClass: 'warn', last: 'Writing wp-config.php' });
  renderAll();
  showProgress('Saving file', [
    { text: 'Validating PHP syntax', value: 35 },
    { text: 'Writing /wordpress/wp-config.php', value: 78 },
    { text: 'File saved', value: 100 }
  ], () => {
    state.fileDirty = false;
    $('#fileDirty').textContent = 'Saved';
    $('#fileDirty').className = 'badge badge-ok';
    updateRow('file', { state: 'Saved', stateClass: 'ok', last: 'wp-config.php saved successfully' });
    $('#phpLog').textContent = 'WP_DEBUG enabled by saved wp-config.php edit.';
    addEvent('Files', 'Saved /wordpress/wp-config.php and appended PHP log result.');
    renderAll();
  });
}

function downloadDatabase() {
  selectRow('database');
  updateRow('database', { state: 'Downloading', stateClass: 'warn', last: 'Preparing database.sqlite' });
  renderAll();
  showProgress('Downloading database', [
    { text: 'Reading SQLite file at .ht.sqlite', value: 25 },
    { text: 'Packaging database.sqlite', value: 70 },
    { text: 'database.sqlite ready', value: 100 }
  ], () => {
    state.dbSize = '468 KB';
    $('#dbSize').textContent = state.dbSize;
    updateRow('database', { state: 'Downloaded', stateClass: 'ok', runtime: state.dbSize, last: 'database.sqlite downloaded' });
    $('#playgroundLog').textContent = 'database.sqlite downloaded from SQLite-backed database.';
    addEvent('Database', 'Finished database.sqlite download. Size changed to 468 KB.');
    renderAll();
  });
}

function adminer(source = 'Adminer') {
  selectRow('database');
  updateRow('database', { last: `${source} opened in a new database tool tab` });
  addEvent('Database', `${source} opened for /wordpress/wp-content/database/.ht.sqlite.`);
  renderAll();
}

function runBlueprint() {
  selectRow('blueprint');
  $('#confirmTitle').textContent = 'Run Art Gallery Blueprint?';
  $('#confirmText').textContent = 'The Blueprint is valid, but running it replaces current content and updates the active preview.';
  $('#confirmBox').hidden = false;
  state.confirmAction = () => {
    $('#confirmBox').hidden = true;
    updateRow('blueprint', { state: 'Running', stateClass: 'warn', last: 'Replacing current content' });
    renderAll();
    showProgress('Running Blueprint', [
      { text: 'Validating blueprint.json', value: 22 },
      { text: 'Applying Blueprint steps', value: 67 },
      { text: 'Art Gallery Blueprint applied', value: 100 }
    ], () => {
      updateRow('blueprint', { state: 'Applied', stateClass: 'ok', last: 'Art Gallery applied to active site' });
      $('#previewHeading').textContent = 'Art Gallery Blueprint applied';
      $('#previewText').textContent = 'The selected Blueprint replaced current content and updated the active WordPress preview.';
      addEvent('Blueprint', 'Ran Art Gallery Blueprint after replacement confirmation.');
      renderAll();
    });
  };
}

function copyBlueprint() {
  selectRow('blueprint');
  updateRow('blueprint', { last: 'Blueprint share link copied' });
  addEvent('Blueprint', 'Copied link to current Blueprint bundle.');
  renderAll();
}

function downloadBlueprint() {
  selectRow('blueprint');
  updateRow('blueprint', { last: 'Blueprint bundle downloaded' });
  addEvent('Blueprint', 'Downloaded Blueprint bundle.');
  renderAll();
}

function pickZip() {
  selectRow('zip');
  $('#zipPickLabel').textContent = 'workshop-site.zip selected. Import will replace current files and database.';
  updateRow('zip', {
    detail: 'workshop-site.zip selected',
    state: 'Selected',
    stateClass: 'warn',
    last: 'Archive selected; awaiting replacement confirmation'
  });
  addEvent('ZIP import', 'Selected workshop-site.zip from native file chooser.');
  renderAll();
}

function importZip() {
  selectRow('zip');
  if (rowById('zip').state === 'Waiting') pickZip();
  $('#confirmTitle').textContent = 'Replace current Playground with workshop-site.zip?';
  $('#confirmText').textContent = 'ZIP import is destructive: current files and SQLite database are replaced by the archive.';
  $('#confirmBox').hidden = false;
  state.confirmAction = () => {
    $('#confirmBox').hidden = true;
    updateRow('zip', { state: 'Importing', stateClass: 'warn', last: 'Validating and extracting ZIP' });
    renderAll();
    showProgress('Importing ZIP', [
      { text: 'Validating workshop-site.zip', value: 20 },
      { text: 'Replacing files and SQLite database', value: 65 },
      { text: 'Imported ZIP Playground ready', value: 100 }
    ], () => {
      updateRow('zip', { state: 'Imported', stateClass: 'ok', last: 'workshop-site.zip imported into active shell' });
      state.shellTitle = 'Imported ZIP Playground';
      state.subtitle = 'Imported from workshop-site.zip. Save to keep this Playground after refresh.';
      state.storage = 'Temporary import';
      state.path = '/imported-workshop-site/';
      updateRow('temp', {
        title: 'Imported ZIP Playground',
        detail: 'Temporary imported site',
        state: 'Imported',
        stateClass: 'warn',
        source: 'workshop-site.zip',
        last: 'ZIP import replaced files and database'
      });
      $('#previewHeading').textContent = 'Imported ZIP Playground is running';
      $('#previewText').textContent = 'The ZIP replacement flow finished and mutated the active title, path, table row, preview, and event record.';
      addEvent('ZIP import', 'Finished destructive ZIP replacement from workshop-site.zip.');
      renderAll();
    });
  };
}

function connectGithub() {
  state.githubConnected = true;
  selectRow('github');
  updateRow('github', {
    state: 'Connected',
    stateClass: 'ok',
    detail: 'Account connected',
    source: 'GitHub account session',
    last: 'Token available for this browser session only'
  });
  addEvent('GitHub', 'Connected GitHub account. Access token is not stored after refresh.');
  renderAll();
}

function exportGithub() {
  selectRow('github');
  if (!state.githubConnected) {
    connectGithub();
  }
  updateRow('github', { state: 'Exporting', stateClass: 'warn', last: 'Pushing current Playground to adam/site-snapshot' });
  renderAll();
  showProgress('Exporting to GitHub', [
    { text: 'Collecting current files and wp-content', value: 25 },
    { text: 'Creating commit in adam/site-snapshot', value: 74 },
    { text: 'Export complete', value: 100 }
  ], () => {
    updateRow('github', {
      state: 'Exported',
      stateClass: 'ok',
      detail: 'adam/site-snapshot',
      last: 'Exported current Playground to GitHub'
    });
    addEvent('GitHub', 'Exported current Playground to adam/site-snapshot.');
    renderAll();
  });
}

function downloadZip() {
  updateRow('zip', { state: 'Downloaded', stateClass: 'ok', last: 'Current Playground downloaded as playground.zip' });
  addEvent('ZIP download', 'Downloaded current Playground as playground.zip.');
  selectRow('zip');
}

function executeAction(action) {
  const map = {
    saveBrowser,
    saveLocal,
    open: openSaved,
    rename: renameSaved,
    delete: requestDelete,
    grantLocal,
    reloadLocal,
    reset: applyRuntimeSettings,
    downloadDb: downloadDatabase,
    adminer: () => adminer('Adminer'),
    phpmyadmin: () => adminer('phpMyAdmin'),
    dirtyFile,
    saveFile,
    runBlueprint,
    copyBlueprint,
    downloadBlueprint,
    zipPick: pickZip,
    zipImport: importZip,
    connectGithub,
    exportGithub,
    downloadZip
  };
  map[action]?.();
}

function setView(view) {
  app.dataset.view = view;
  $$('.rail-button').forEach((button) => button.classList.toggle('is-active', button.dataset.view === view));
  if (view === 'manager') selectRow('file');
  if (view === 'blueprints') selectRow('blueprint');
  if (view === 'transfer') selectRow('zip');
  if (view === 'save') selectRow('temp');
}

function filterCommands(query) {
  const q = query.trim().toLowerCase();
  $$('.result-group button').forEach((button) => {
    const visible = !q || button.textContent.toLowerCase().includes(q) || button.closest('.result-group').querySelector('strong').textContent.toLowerCase().includes(q);
    button.style.display = visible ? 'block' : 'none';
  });
}

function chooseCommand(command) {
  state.selectedCommand = command;
  $$('.result-group button').forEach((button) => button.classList.toggle('is-selected', button.dataset.command === command));
  $('#commandTitle').textContent = commandData[command].title;
  $('#commandDescription').textContent = commandData[command].description;
  $('#commandForm').hidden = false;
}

document.addEventListener('click', (event) => {
  const row = event.target.closest('tr[data-id]');
  if (row && !event.target.closest('button')) {
    selectRow(row.dataset.id);
  }

  const actionButton = event.target.closest('[data-action]');
  if (actionButton) {
    const tr = actionButton.closest('tr[data-id]');
    if (tr) state.selectedId = tr.dataset.id;
    executeAction(actionButton.dataset.action);
  }

  const rail = event.target.closest('.rail-button');
  if (rail) setView(rail.dataset.view);

  const tab = event.target.closest('.view-tab');
  if (tab) {
    $$('.view-tab').forEach((button) => button.classList.remove('is-active'));
    tab.classList.add('is-active');
    renderRows(tab.dataset.filter);
  }

  const managerTab = event.target.closest('.manager-tab');
  if (managerTab) {
    $$('.manager-tab').forEach((button) => button.classList.remove('is-active'));
    managerTab.classList.add('is-active');
    $$('.manager-view').forEach((view) => view.classList.toggle('is-active', view.id === `manager-${managerTab.dataset.manager}`));
    if (managerTab.dataset.manager === 'database') selectRow('database');
    if (managerTab.dataset.manager === 'files') selectRow('file');
    if (managerTab.dataset.manager === 'blueprint') selectRow('blueprint');
  }

  const command = event.target.closest('[data-command]');
  if (command) chooseCommand(command.dataset.command);

  const launch = event.target.closest('[data-launch]');
  if (launch) {
    state.shellTitle = `${launch.dataset.launch} Playground`;
    state.subtitle = `${launch.dataset.launch} route prepared with its required inputs and constraints.`;
    state.storage = 'Temporary';
    state.path = `/${slugify(launch.dataset.launch)}-preview/`;
    updateRow('temp', {
      title: state.shellTitle,
      detail: 'Temporary launch result',
      state: 'Temporary',
      stateClass: 'warn',
      source: launch.dataset.launch,
      last: `${launch.dataset.launch} route started`
    });
    $('#previewHeading').textContent = `${launch.dataset.launch} preview ready`;
    $('#previewText').textContent = 'Starting a new route mutates the active shell while preserving save, reset, and replacement consequences.';
    addEvent('Start route', `${launch.dataset.launch} route started with visible input contract.`);
    selectRow('temp');
  }

  const catalog = event.target.closest('.catalog-card');
  if (catalog) {
    $$('.catalog-card').forEach((card) => card.classList.remove('is-selected'));
    catalog.classList.add('is-selected');
    updateRow('blueprint', {
      title: `${catalog.dataset.blueprintName} Blueprint`,
      detail: 'Selected gallery item',
      last: 'Selected from representative subset'
    });
    addEvent('Blueprint', `Selected ${catalog.dataset.blueprintName} from representative 6 of 43 Blueprint gallery.`);
    selectRow('blueprint');
  }
});

$('#confirmDanger').addEventListener('click', () => state.confirmAction?.());
$('#cancelDanger').addEventListener('click', () => {
  $('#confirmBox').hidden = true;
  state.confirmAction = null;
  addEvent('Cancel', 'Cancelled destructive confirmation.');
});

$('#pathForm').addEventListener('submit', (event) => {
  event.preventDefault();
  state.path = $('#pathInput').value || '/';
  $('#previewHeading').textContent = state.path.includes('wp-admin') ? 'WordPress Admin is open' : 'Hello from WordPress Playground!';
  addEvent('Navigation', `Path input navigated active shell to ${state.path}.`);
  renderAll();
});

$('#refreshBtn').addEventListener('click', () => {
  addEvent('Shell', `Refreshed active WordPress page at ${state.path}.`);
  updateRow('temp', { last: `Refreshed ${state.path}` });
  renderAll();
});

$('#homeBtn').addEventListener('click', () => commandData.homepage.run());
$('#adminBtn').addEventListener('click', () => commandData.admin.run());
$('#openSaveBtn').addEventListener('click', () => setView('save'));
$('#applyRuntime').addEventListener('click', applyRuntimeSettings);
$('#downloadDb').addEventListener('click', downloadDatabase);
$('#openAdminer').addEventListener('click', () => adminer('Adminer'));
$('#openPhpMyAdmin').addEventListener('click', () => adminer('phpMyAdmin'));
$('#newFile').addEventListener('click', () => {
  updateRow('file', { title: 'new-plugin-test.php', detail: '/wordpress/wp-content/plugins/new-plugin-test.php', state: 'Created', stateClass: 'ok', last: 'New file created' });
  addEvent('Files', 'Created /wordpress/wp-content/plugins/new-plugin-test.php.');
  selectRow('file');
});
$('#newFolder').addEventListener('click', () => {
  updateRow('file', { last: 'New folder /wordpress/wp-content/mu-plugins created' });
  addEvent('Files', 'Created folder /wordpress/wp-content/mu-plugins.');
  selectRow('file');
});
$('#uploadFile').addEventListener('click', () => {
  updateRow('file', { state: 'Uploaded', stateClass: 'ok', last: 'theme-helper.php uploaded' });
  addEvent('Files', 'Uploaded theme-helper.php through Browse files.');
  selectRow('file');
});
$('#browseFiles').addEventListener('click', () => {
  updateRow('file', { last: 'Browse files chooser opened and wp-config.php selected' });
  addEvent('Files', 'Browse files opened the native file chooser.');
  selectRow('file');
});
$('#dirtyFile').addEventListener('click', dirtyFile);
$('#saveFile').addEventListener('click', saveFile);
$('#copyBlueprint').addEventListener('click', copyBlueprint);
$('#downloadBlueprint').addEventListener('click', downloadBlueprint);
$('#runBlueprint').addEventListener('click', runBlueprint);
$('#zipPick').addEventListener('click', pickZip);
$('#connectGithub').addEventListener('click', connectGithub);
$('#downloadZip').addEventListener('click', downloadZip);
$('#githubExport').addEventListener('click', exportGithub);

['wpSelect', 'phpSelect', 'languageSelect', 'olderToggle', 'networkToggle', 'multisiteToggle'].forEach((id) => {
  $(`#${id}`).addEventListener('change', () => updateRuntimeRows('Runtime selector changed; reset or reload required'));
});

$('#commandSearch').addEventListener('input', (event) => filterCommands(event.target.value));
$('#runSelectedCommand').addEventListener('click', () => {
  chooseCommand(state.selectedCommand);
  addEvent('Command search', `Query "${$('#commandSearch').value || 'admin'}" exposed grouped command results.`);
});
$('#confirmCommand').addEventListener('click', () => {
  $('#commandForm').hidden = true;
  showProgress('Running command', [
    { text: 'Validating command form', value: 30 },
    { text: 'Applying command to active Playground', value: 75 },
    { text: 'Command complete', value: 100 }
  ], () => commandData[state.selectedCommand].run());
});
$('#cancelCommand').addEventListener('click', () => {
  $('#commandForm').hidden = true;
  addEvent('Command search', 'Cancelled selected command form.');
});

$('#blueprintSearch').addEventListener('input', () => renderBlueprints($('.chip.is-active').dataset.blueprintFilter, $('#blueprintSearch').value));
$$('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    $$('.chip').forEach((button) => button.classList.remove('is-active'));
    chip.classList.add('is-active');
    renderBlueprints(chip.dataset.blueprintFilter, $('#blueprintSearch').value);
  });
});

chooseCommand('admin');
renderAll();
