const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const state = {
  title: 'Unsaved Playground',
  storage: 'temporary',
  path: '/hello-from-playground/',
  command: 'Runtime settings',
  deleteTarget: null,
  renameTarget: null,
  githubConnected: false,
  importConnected: false,
  zipSelected: false,
  localReady: false,
  history: []
};

const blueprints = [
  { title: 'Art Gallery', category: 'Website', desc: 'Vueo theme gallery with artwork and pages.' },
  { title: 'Coffee Shop', category: 'WooCommerce', desc: 'Storefront with products, cart, and custom theme.' },
  { title: 'Feed Reader with the Friends Plugin', category: 'Content', desc: 'Social web feed reader configured in Playground.' },
  { title: 'Gaming News', category: 'News', desc: 'Spiel theme news layout with posts and menus.' },
  { title: 'Non-profit Organization', category: 'Website', desc: 'Koinonia nonprofit site with donation-oriented content.' },
  { title: 'Personal Blog', category: 'Personal', desc: 'Substrata theme blog with author profile content.' }
];

function setCommand(command) {
  state.command = command;
  $('#selectedCommand').textContent = `${command} selected`;
  $('#commandSummary').textContent = command;
}

function setPath(path) {
  state.path = path;
  $('#pathInput').value = path;
  $('#previewPath').textContent = path;
  setCommand(path === '/wp-admin/' ? 'WP Admin navigation' : 'Homepage navigation');
  $('#previewStatus').textContent = path === '/wp-admin/' ? 'WP Admin dashboard loaded' : 'Homepage loaded';
}

function setProgress(bar, text, doneText, onDone) {
  let progress = 0;
  bar.style.width = '0%';
  text.textContent = 'Starting...';
  const timer = window.setInterval(() => {
    progress += 20;
    bar.style.width = `${progress}%`;
    text.textContent = progress < 100 ? `Processing ${progress}%` : doneText;
    if (progress >= 100) {
      window.clearInterval(timer);
      if (onDone) onDone();
    }
  }, 180);
}

function updateStorage(kind, detail) {
  state.storage = kind;
  document.querySelector('.app').dataset.storage = kind;
  if (kind === 'browser') {
    state.title = $('#playgroundName').value || 'Saved Playground';
    $('#saveBadge').textContent = 'Saved Playground';
    $('#saveBadge').className = 'state-pill green';
    $('#identityBadge').textContent = state.title;
    $('#shellTitle').textContent = state.title;
    $('#savedIdentity').textContent = 'Browser saved';
    $('#storageSummary').textContent = 'Saved in this browser';
    $('#storageDetail').textContent = 'Reload restores from browser storage and site slug.';
    $('#reloadConsequence').textContent = 'Runtime changes use Save & Reload.';
    $('#reloadConsequence').className = '';
    $('#runtimeConsequence').innerHTML = '<strong>Stored Playground reload required.</strong><span>Settings changes preserve the saved identity but reload the runtime.</span>';
    $('#resetButton').textContent = 'Save & Reload';
  }
  if (kind === 'local') {
    state.title = $('#playgroundName').value || 'Local Directory Playground';
    $('#saveBadge').textContent = 'Local directory';
    $('#saveBadge').className = 'state-pill green';
    $('#identityBadge').textContent = state.title;
    $('#shellTitle').textContent = state.title;
    $('#savedIdentity').textContent = detail || 'Local folder linked';
    $('#storageSummary').textContent = 'Local directory';
    $('#storageDetail').textContent = 'Reload pauses until folder permission is reconnected.';
    $('#reloadConsequence').textContent = 'Reload will ask to reconnect the selected folder.';
    $('#reloadConsequence').className = '';
    $('#runtimeConsequence').innerHTML = '<strong>Local directory reload required.</strong><span>Settings changes update files on disk after folder permission is confirmed.</span>';
    $('#resetButton').textContent = 'Save & Reload local folder';
    $('#localRowStatus').textContent = `${detail || 'Selected folder'} connected. Reload requires permission confirmation.`;
    $('[data-row="local"]').classList.remove('muted');
    activateSavedRow('local');
  }
}

function addHistory(text) {
  state.history.unshift(text);
  $('#historyList').innerHTML = state.history.map((item) => `<li>${item}</li>`).join('');
  $('#lastTransfer').textContent = text;
  $('#transferDetail').textContent = 'Completed transfer recorded in Portability history.';
}

function activateSavedRow(rowName) {
  $$('.saved-row').forEach((row) => row.classList.toggle('active', row.dataset.row === rowName));
}

function showPanel(panelName) {
  $$('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.panel === panelName));
  $$('.panel').forEach((panel) => panel.classList.toggle('active', panel.id === `panel-${panelName}`));
  const labels = {
    runtime: 'Runtime settings',
    save: 'Save destination',
    launch: 'Launch and import',
    manager: 'Site Manager',
    portability: 'Portability transfers',
    saved: 'Saved management'
  };
  setCommand(labels[panelName] || 'Inspector');
}

function showManager(panelName) {
  $$('.manager-tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.manager === panelName));
  $$('.manager-panel').forEach((panel) => panel.classList.toggle('active', panel.id === `manager-${panelName}`));
  setCommand(`Site Manager ${panelName}`);
}

function renderBlueprints(filter = 'all', query = '') {
  const normalized = query.trim().toLowerCase();
  const filtered = blueprints.filter((item) => {
    const matchesFilter = filter === 'all' || item.category === filter;
    const matchesQuery = !normalized || `${item.title} ${item.desc} ${item.category}`.toLowerCase().includes(normalized);
    return matchesFilter && matchesQuery;
  });
  $('#blueprintList').innerHTML = filtered.map((item) => `
    <article class="blueprint-card">
      <div class="thumb" aria-hidden="true"></div>
      <div>
        <strong>${item.title}</strong>
        <small>${item.desc} Category: ${item.category}.</small>
      </div>
      <button class="ghost small blueprint-run" data-title="${item.title}">Run</button>
    </article>
  `).join('') || '<p class="manager-note">No Blueprint subset entries match this filter.</p>';
}

$$('.tab').forEach((tab) => {
  tab.addEventListener('click', () => showPanel(tab.dataset.panel));
});

$$('[data-panel-jump]').forEach((button) => {
  button.addEventListener('click', () => showPanel(button.dataset.panelJump));
});

$$('[data-route]').forEach((button) => {
  button.addEventListener('click', () => setPath(button.dataset.route));
});

$('#pathInput').addEventListener('change', (event) => {
  const value = event.target.value.startsWith('/') ? event.target.value : `/${event.target.value}`;
  setPath(value);
});

$('#refreshButton').addEventListener('click', () => {
  $('#previewStatus').textContent = state.storage === 'local' ? 'Reloaded after folder permission check' : 'Current page refreshed';
  setCommand('Refresh current page');
});

['wpVersion', 'phpVersion', 'language', 'olderVersions', 'networkAccess', 'multisite'].forEach((id) => {
  $(`#${id}`).addEventListener('change', () => {
    const wp = $('#wpVersion').value;
    const php = $('#phpVersion').value;
    const language = $('#language').value.split(' ')[0];
    $('#runtimeSummary').textContent = `WordPress ${wp} / PHP ${php} / ${language}`;
    setCommand('Runtime settings changed');
  });
});

$('#resetButton').addEventListener('click', () => {
  if (state.storage === 'temporary') {
    state.title = 'Unsaved Playground';
    setPath('/hello-from-playground/');
    $('#previewStatus').textContent = 'Runtime reset complete';
    $('#previewMarker').textContent = 'Temporary Playground was reset with selected runtime settings.';
    setCommand('Destructive runtime reset complete');
  } else {
    $('#previewStatus').textContent = 'Saved Playground reloaded with selected runtime settings';
    $('#previewMarker').textContent = state.storage === 'local'
      ? 'Reload complete. Local folder permission was required before boot.'
      : 'Reload complete. Browser-saved identity was preserved.';
    setCommand('Saved runtime reload complete');
  }
});

$('#saveBrowser').addEventListener('click', () => {
  showPanel('save');
  setCommand('Browser save in progress');
  setProgress($('#browserProgress'), $('#browserProgressText'), 'Saved 3,751 / 3,751 files to browser storage.', () => {
    updateStorage('browser');
    activateSavedRow('browser');
    $('#previewStatus').textContent = 'Browser-saved identity active';
    $('#previewMarker').textContent = 'Saved in this browser. Slug URL is available after reload.';
  });
});

$('#pickFolder').addEventListener('click', () => {
  $('#folderName').textContent = 'Sites/Playground Research';
  $('#folderPermission').textContent = 'Folder selected. Permission request is pending.';
  $('#permissionBadge').textContent = 'Permission pending';
  $('#permissionBadge').className = 'state-pill amber';
  $('#grantFolder').disabled = false;
  $('#localProgressText').textContent = 'Grant access before copying files.';
  setCommand('Local folder picked');
});

$('#grantFolder').addEventListener('click', () => {
  state.localReady = true;
  $('#folderPermission').textContent = 'Read and write permission granted for this session.';
  $('#permissionBadge').textContent = 'Permission granted';
  $('#permissionBadge').className = 'state-pill green';
  $('#saveLocal').disabled = false;
  $('#localProgressText').textContent = 'Ready to copy files to local directory.';
  setCommand('Local folder permission granted');
});

$('#saveLocal').addEventListener('click', () => {
  setCommand('Local directory save in progress');
  setProgress($('#localProgress'), $('#localProgressText'), 'Saved 3,751 / 3,751 files to Sites/Playground Research.', () => {
    updateStorage('local', 'Sites/Playground Research');
    $('#previewStatus').textContent = 'Local directory backed Playground active';
    $('#previewMarker').textContent = 'Local directory save complete. Reload asks to reconnect Sites/Playground Research.';
  });
});

$$('.route-action').forEach((button) => {
  button.addEventListener('click', () => {
    setCommand(button.dataset.command);
    $('#previewStatus').textContent = `${button.dataset.command} prepared`;
  });
});

$('#connectImportGitHub').addEventListener('click', () => {
  state.importConnected = true;
  $('#connectImportGitHub').textContent = 'GitHub connected';
  $('#previewStatus').textContent = 'GitHub import can now select a repository';
  setCommand('GitHub import account connected');
});

$('#chooseZip').addEventListener('click', () => {
  state.zipSelected = true;
  $('#chooseZip').textContent = 'plugin-demo.zip selected';
  $('#confirmZipImport').disabled = false;
  $('#previewStatus').textContent = 'ZIP validated. Replacement confirmation required.';
  setCommand('ZIP import validation');
});

$('#confirmZipImport').addEventListener('click', () => {
  $('#previewStatus').textContent = 'ZIP import replaced files and database';
  $('#previewMarker').textContent = 'Imported plugin-demo.zip. Current site was replaced after confirmation.';
  addHistory('Imported plugin-demo.zip and replaced current Playground');
  setCommand('ZIP replacement complete');
});

let activeBlueprintFilter = 'all';
renderBlueprints();

$$('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    activeBlueprintFilter = chip.dataset.filter;
    $$('.chip').forEach((item) => item.classList.toggle('active', item === chip));
    renderBlueprints(activeBlueprintFilter, $('#blueprintSearch').value);
  });
});

$('#blueprintSearch').addEventListener('input', (event) => {
  renderBlueprints(activeBlueprintFilter, event.target.value);
});

$('#blueprintList').addEventListener('click', (event) => {
  const button = event.target.closest('.blueprint-run');
  if (!button) return;
  $('#previewStatus').textContent = `${button.dataset.title} Blueprint run complete`;
  $('#previewMarker').textContent = `${button.dataset.title} replaced the active content after validation.`;
  setCommand('Blueprint gallery run complete');
});

$$('.manager-tab').forEach((tab) => {
  tab.addEventListener('click', () => showManager(tab.dataset.manager));
});

$('#newFile').addEventListener('click', () => {
  $('#fileState').textContent = 'Dirty: new file draft';
  setCommand('New file draft created');
});

$('#newFolder').addEventListener('click', () => {
  $('#fileState').textContent = 'Dirty: new folder pending';
  setCommand('New folder pending');
});

$('#uploadFile').addEventListener('click', () => {
  $('#fileState').textContent = 'Uploaded theme-preview.css';
  setCommand('File upload result');
});

$('#browseFiles').addEventListener('click', () => {
  $('#fileState').textContent = 'Selected wp-config.php';
  setCommand('Browse files selection');
});

$('#codeEditor').addEventListener('click', () => {
  $('#fileState').textContent = 'Dirty';
  setCommand('File editor dirty state');
});

$('#saveFile').addEventListener('click', () => {
  $('#fileState').textContent = 'Saved just now';
  $('#previewStatus').textContent = 'wp-config.php saved';
  setCommand('File saved');
});

$('#copyBlueprint').addEventListener('click', () => {
  $('#blueprintResult').textContent = 'Blueprint link copied to clipboard state.';
  setCommand('Blueprint link copied');
});

$('#downloadBlueprint').addEventListener('click', () => {
  $('#blueprintResult').textContent = 'Blueprint bundle downloaded.';
  addHistory('Downloaded Blueprint bundle');
  setCommand('Blueprint bundle downloaded');
});

$('#runBlueprint').addEventListener('click', () => {
  $('#blueprintResult').textContent = 'Blueprint validation passed and run completed.';
  $('#previewMarker').textContent = 'blueprint.json ran successfully and updated the current site.';
  setCommand('Blueprint editor run complete');
});

$('#downloadDb').addEventListener('click', () => {
  addHistory('Downloaded database.sqlite from /wordpress/wp-content/database/.ht.sqlite');
  setCommand('Database download complete');
});

$('#downloadZip').addEventListener('click', () => {
  $('#zipStatus').textContent = 'Generating';
  $('#zipStatus').className = 'state-pill amber';
  setCommand('ZIP download in progress');
  setProgress($('#zipProgress'), $('#zipProgressText'), 'Generated playground-research-site.zip and started download.', () => {
    $('#zipStatus').textContent = 'Downloaded';
    $('#zipStatus').className = 'state-pill green';
    $('#previewStatus').textContent = 'ZIP bundle generated from active Playground';
    addHistory('Downloaded playground-research-site.zip');
    setCommand('ZIP download complete');
  });
});

$('#connectGitHub').addEventListener('click', () => {
  state.githubConnected = true;
  $('#githubStatus').textContent = 'Connected';
  $('#githubStatus').className = 'state-pill green';
  $('#connectGitHub').textContent = 'GitHub connected';
  $('#exportGitHub').disabled = false;
  $('#githubProgressText').textContent = 'Repository destination ready. Token will be forgotten after refresh.';
  setCommand('GitHub export account connected');
});

$('#exportGitHub').addEventListener('click', () => {
  setCommand('GitHub export in progress');
  setProgress($('#githubProgress'), $('#githubProgressText'), `Exported files to ${$('#repoName').value}.`, () => {
    $('#previewStatus').textContent = 'GitHub export complete';
    addHistory(`Exported active Playground to ${$('#repoName').value}`);
    setCommand('GitHub export complete');
  });
});

$$('[data-open-row]').forEach((button) => {
  button.addEventListener('click', () => {
    const row = button.dataset.openRow;
    activateSavedRow(row);
    if (row === 'browser') {
      updateStorage('browser');
    }
    if (row === 'local') {
      updateStorage('local', 'Sites/Playground Research');
    }
    if (row === 'unsaved') {
      state.storage = 'temporary';
      state.title = 'Unsaved Playground';
      $('#saveBadge').textContent = 'Temporary';
      $('#saveBadge').className = 'state-pill amber';
      $('#identityBadge').textContent = 'Unsaved Playground';
      $('#shellTitle').textContent = 'Unsaved Playground';
      $('#savedIdentity').textContent = 'No saved identity';
      $('#storageSummary').textContent = 'Temporary memory';
      $('#storageDetail').textContent = 'Refresh or reset discards files and database.';
      $('#reloadConsequence').textContent = 'Reset will replace this temporary site.';
      $('#reloadConsequence').className = 'danger-text';
    }
    setCommand(`Opened ${row} Playground`);
  });
});

$$('[data-manage-row]').forEach((button) => {
  button.addEventListener('click', () => {
    showPanel('manager');
    setCommand(`Managing ${button.dataset.manageRow} Playground`);
  });
});

$$('[data-delete-row]').forEach((button) => {
  button.addEventListener('click', () => {
    state.deleteTarget = button.dataset.deleteRow;
    $('#deleteConfirm').hidden = false;
    $('#renameBox').hidden = true;
    setCommand('Delete confirmation open');
  });
});

$('#confirmDelete').addEventListener('click', () => {
  if (!state.deleteTarget) return;
  const row = $(`[data-row="${state.deleteTarget}"]`);
  row.remove();
  state.deleteTarget = null;
  $('#deleteConfirm').hidden = true;
  activateSavedRow('unsaved');
  state.storage = 'temporary';
  $('#saveBadge').textContent = 'Temporary';
  $('#saveBadge').className = 'state-pill amber';
  $('#identityBadge').textContent = 'Unsaved Playground';
  $('#shellTitle').textContent = 'Unsaved Playground';
  $('#previewStatus').textContent = 'Saved row deleted. Active site fell back to Unsaved Playground.';
  setCommand('Saved Playground deleted');
});

$('#cancelDelete').addEventListener('click', () => {
  state.deleteTarget = null;
  $('#deleteConfirm').hidden = true;
  setCommand('Delete cancelled');
});

$$('[data-rename-row]').forEach((button) => {
  button.addEventListener('click', () => {
    state.renameTarget = button.dataset.renameRow;
    $('#renameBox').hidden = false;
    $('#deleteConfirm').hidden = true;
    const current = $(`[data-row="${state.renameTarget}"] strong`);
    $('#renameInput').value = current ? current.textContent : state.title;
    setCommand('Rename form open');
  });
});

$('#confirmRename').addEventListener('click', () => {
  if (!state.renameTarget) return;
  const name = $('#renameInput').value || 'Renamed Playground';
  const rowTitle = $(`[data-row="${state.renameTarget}"] strong`);
  if (rowTitle) rowTitle.textContent = name;
  if ($(`[data-row="${state.renameTarget}"]`).classList.contains('active')) {
    state.title = name;
    $('#shellTitle').textContent = name;
    $('#identityBadge').textContent = name;
  }
  $('#renameBox').hidden = true;
  setCommand('Saved Playground renamed');
});

$('#cancelRename').addEventListener('click', () => {
  state.renameTarget = null;
  $('#renameBox').hidden = true;
  setCommand('Rename cancelled');
});
