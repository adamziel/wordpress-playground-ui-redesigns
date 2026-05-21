const state = {
  destination: 'browser',
  saveComplete: false,
  currentPanel: 'launch',
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function addActivity(kind, text) {
  const item = document.createElement('li');
  const className = kind === 'Saved' || kind === 'Ready' ? 'green' : kind === 'Warning' || kind === 'Temporary' ? 'amber' : kind === 'Delete' || kind === 'Replace' ? 'red-text' : 'blue';
  item.innerHTML = `<span class="${className}">${kind}</span> ${text}`;
  $('#activityList').prepend(item);
}

function setPanel(name) {
  state.currentPanel = name;
  $$('.inspector-tabs button').forEach((button) => button.classList.toggle('is-active', button.dataset.panel === name));
  $$('.panel').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.panelView === name));
  const titles = {
    launch: 'Launch Contract',
    save: 'Save Destination',
    library: 'Saved Library',
    manager: 'Site Manager',
    blueprints: 'Blueprint Gallery',
    transfers: 'Portability',
  };
  $('#inspectorTitle').textContent = titles[name];
  $('#inspectorStatus').textContent = name === 'launch' ? 'Input required' : 'Ready';
}

function setRoute(route) {
  const labels = {
    gutenberg: 'Gutenberg PR or branch',
    wordpress: 'WordPress PR',
    github: 'From GitHub',
    blueprintUrl: 'Blueprint URL',
    zip: 'Import .zip',
    vanilla: 'Vanilla WordPress',
  };
  $$('.route-card').forEach((card) => card.classList.toggle('is-active', card.dataset.route === route));
  $$('.route-detail').forEach((detail) => detail.classList.toggle('is-active', detail.dataset.routeDetail === route));
  $('#selectedCommand').textContent = labels[route];
  $('#inspectorStatus').textContent = route === 'zip' ? 'Confirmation needed' : 'Input required';
  addActivity('Contract', `${labels[route]} selected.`);
}

function updatePath(path) {
  $('#pathInput').value = path;
  $('#browserUrl').textContent = `playground.local${path}`;
  $('#previewPulse').textContent = 'navigated';
  window.setTimeout(() => {
    $('#previewPulse').textContent = 'ready';
  }, 900);
}

function completeGutenbergPreview() {
  const input = $('#gutenbergInput').value.trim();
  if (!input) {
    $('#inspectorStatus').textContent = 'Validation failed';
    addActivity('Warning', 'Gutenberg preview needs a PR number, URL, or branch name.');
    return;
  }

  $('#inspectorStatus').textContent = 'Validating';
  $('#launchTimeline').innerHTML = `
    <li class="done">Input validated: ${input}</li>
    <li class="current">Building Gutenberg runtime</li>
    <li>Preview identity pending</li>
    <li>Save and export locked</li>
  `;
  $('#stepValidate').classList.add('done');
  addActivity('Contract', `Validated Gutenberg input <code>${input}</code>.`);

  window.setTimeout(() => {
    $('#inspectorStatus').textContent = 'Preview ready';
    $('#launchTimeline').innerHTML = `
      <li class="done">Input validated: ${input}</li>
      <li class="done">WordPress latest and PHP 8.3 runtime built</li>
      <li class="done">Preview identity assigned: Gutenberg branch review</li>
      <li class="done">Save and export actions unlocked</li>
    `;
    $('#activeTitle').textContent = 'Gutenberg Branch Review';
    $('#reviewTarget').textContent = input;
    $('#reviewSummary').textContent = 'Gutenberg plugin build is mounted. Save, GitHub export, ZIP download, files, database, and logs are available for this preview.';
    $('#siteName').textContent = 'Gutenberg Branch Review';
    $('#storageBadge').textContent = 'Unsaved preview';
    $('#storageBadge').className = 'state-badge amber';
    $('#stepBuild').classList.add('done');
    $('#stepReady').classList.add('done');
    updatePath('/wp-admin/site-editor.php?canvas=edit');
    addActivity('Ready', `Gutenberg branch preview is running at <code>/wp-admin/site-editor.php</code>.`);
  }, 850);
}

function runGenericRoute(route) {
  const copy = {
    wordpress: ['WordPress PR Preview', '/wp-admin/about.php', 'Core PR runtime built. Save, files, database, logs, and exports are available.'],
    github: ['GitHub Import Preview', '/wp-admin/plugins.php', 'GitHub account connected for this session and repository import completed. Token is not stored after refresh.'],
    blueprintUrl: ['Blueprint URL Result', '/hello-from-blueprint/', 'Blueprint URL validated and run against the active Playground.'],
    vanilla: ['Vanilla WordPress', '/hello-from-playground/', 'Clean WordPress install started from selected WP, PHP, language, and network settings.'],
  };
  const result = copy[route];
  if (!result) return;
  $('#activeTitle').textContent = result[0];
  $('#reviewTarget').textContent = result[0];
  $('#reviewSummary').textContent = result[2];
  $('#siteName').textContent = result[0];
  updatePath(result[1]);
  addActivity('Ready', `${result[0]} completed.`);
}

function setDestination(destination) {
  state.destination = destination;
  $$('.destination').forEach((button) => button.classList.toggle('is-active', button.dataset.destination === destination));
  $('#localPermission').classList.toggle('hidden', destination !== 'local');
  $('#saveResult').textContent = destination === 'local'
    ? 'Local directory saves are folder-backed and require permission after refresh.'
    : 'Browser saves create a saved row and a stable slug in this browser.';
}

function insertSavedRow(name, mode) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'saved-playground';
  const existing = $(`[data-row-id="${slug}"]`);
  if (existing) existing.remove();
  $$('.saved-row').forEach((row) => row.classList.remove('is-active'));
  const row = document.createElement('article');
  row.className = 'saved-row is-active';
  row.dataset.rowId = slug;
  row.innerHTML = `
    <span class="wp-icon">W</span>
    <div>
      <strong>${name}</strong>
      <small>${mode === 'local' ? 'Saved to local directory' : 'Saved in this browser'} just now - /${slug}/</small>
    </div>
    <span class="state-badge green">${mode === 'local' ? 'Local' : 'Browser'}</span>
    <div class="row-actions">
      <button class="small rename-row" data-rename-row="${slug}">Rename</button>
      <button class="small delete-row" data-delete-row="${slug}">Delete</button>
    </div>
  `;
  $('#savedRows').prepend(row);
  row.querySelector('.delete-row').addEventListener('click', () => openDelete(slug, name));
  row.querySelector('.rename-row').addEventListener('click', () => openRename(slug, name));
  return slug;
}

function openRename(id, name) {
  $('#renameBox').classList.remove('hidden');
  $('#renameInput').value = name;
  $('#confirmRename').dataset.renameTarget = id;
  setPanel('library');
}

function confirmRename() {
  const target = $('#confirmRename').dataset.renameTarget || 'research';
  const row = $(`[data-row-id="${target}"]`);
  if (!row) return;
  const nextName = $('#renameInput').value.trim() || 'Renamed Playground';
  row.querySelector('strong').textContent = nextName;
  if (row.classList.contains('is-active')) {
    $('#activeTitle').textContent = nextName;
    $('#siteName').textContent = nextName;
  }
  $('#renameBox').classList.add('hidden');
  addActivity('Saved', `${nextName} renamed in the saved library.`);
}

function completeSave() {
  const name = $('#saveName').value.trim() || 'Saved Playground';
  let copied = 0;
  const total = 3751;
  $('#runSave').disabled = true;
  $('#saveResult').textContent = state.destination === 'local'
    ? 'Requesting folder permission and copying the Playground file tree.'
    : 'Copying Playground files into browser storage.';
  const timer = window.setInterval(() => {
    copied = Math.min(total, copied + 417);
    const pct = Math.round((copied / total) * 100);
    $('#saveProgressLabel').textContent = `Saving ${copied} / ${total} files`;
    $('#savePercent').textContent = `${pct}%`;
    $('#saveProgressBar').style.width = `${pct}%`;
    if (copied === total) {
      window.clearInterval(timer);
      const slug = insertSavedRow(name, state.destination);
      state.saveComplete = true;
      $('#runSave').disabled = false;
      $('#activeTitle').textContent = name;
      $('#siteName').textContent = name;
      $('#storageBadge').textContent = state.destination === 'local' ? 'Saved local' : 'Saved';
      $('#storageBadge').className = 'state-badge green';
      $('#identitySlug').textContent = state.destination === 'local'
        ? 'Folder-backed: ~/Sites/playground-reviews/block-bindings'
        : `Browser slug: /${slug}/`;
      $('#resetMode').textContent = 'Settings now use Save & Reload instead of destructive reset';
      $('#settingsConsequence').textContent = 'Stored Playground reload';
      $('#settingsCopy').textContent = 'Stored Playgrounds have limited configuration options. Save & Reload keeps the saved identity.';
      $('#applySettings').textContent = 'Save & Reload';
      $('#applySettings').className = 'primary';
      $('#saveResult').textContent = state.destination === 'local'
        ? `Saved to local directory and inserted a local-backed row for ${name}.`
        : `Saved in this browser and inserted a browser-backed row for ${name}.`;
      addActivity('Saved', `${name} saved to ${state.destination === 'local' ? 'a local directory' : 'browser storage'} and selected in the library.`);
    }
  }, 120);
}

function openDelete(id, name = 'Research Browser Playground') {
  $('#deleteConfirm').classList.remove('hidden');
  $('#confirmDelete').dataset.deleteTarget = id;
  $('#deleteConfirm strong').textContent = `Delete ${name}?`;
  setPanel('library');
}

function confirmDelete() {
  const target = $('#confirmDelete').dataset.deleteTarget || 'research';
  const row = $(`[data-row-id="${target}"]`);
  const name = row ? row.querySelector('strong').textContent : 'saved Playground';
  if (row) row.remove();
  $('#deleteConfirm').classList.add('hidden');
  const unsaved = $('[data-row-id="unsaved"]');
  if (unsaved) unsaved.classList.add('is-active');
  addActivity('Delete', `${name} was deleted. The active shell remains open and selected row falls back to the unsaved Playground.`);
}

function replaceWithZip() {
  $('#zipConfirm').classList.add('hidden');
  $('#activeTitle').textContent = 'Imported ZIP Playground';
  $('#siteName').textContent = 'Imported ZIP Playground';
  $('#reviewTarget').textContent = 'review-site-export.zip';
  $('#reviewSummary').textContent = 'Archive imported and replaced files plus the SQLite-backed database. The resulting site is temporary until saved.';
  $('#storageBadge').textContent = 'Unsaved import';
  $('#storageBadge').className = 'state-badge amber';
  $('#identitySlug').textContent = 'Imported archive has no saved slug';
  $('#resetMode').textContent = 'Reset will discard imported ZIP state';
  updatePath('/wp-admin/import.php?import=zip-complete');
  addActivity('Replace', 'ZIP import replaced the active Playground files and database.');
}

function runBlueprintResult(label) {
  $('#reviewTarget').textContent = label;
  $('#reviewSummary').textContent = 'Blueprint validated, ran, and updated the current WordPress content. The result can be saved or exported.';
  $('#blueprintValidation').textContent = `${label} completed successfully. Preview and activity history updated.`;
  updatePath('/hello-from-blueprint/');
  addActivity('Ready', `${label} ran against the active Playground.`);
}

$$('.inspector-tabs button').forEach((button) => button.addEventListener('click', () => setPanel(button.dataset.panel)));
$$('.route-card').forEach((button) => button.addEventListener('click', () => setRoute(button.dataset.route)));
$$('.route-run').forEach((button) => button.addEventListener('click', () => {
  if (button.dataset.routeRun === 'zip') {
    setPanel('transfers');
    $('#zipConfirm').classList.remove('hidden');
    return;
  }
  runGenericRoute(button.dataset.routeRun);
}));
$$('.destination').forEach((button) => button.addEventListener('click', () => setDestination(button.dataset.destination)));
$$('[data-open-save]').forEach((button) => button.addEventListener('click', () => setPanel('save')));
$$('.delete-row').forEach((button) => button.addEventListener('click', () => openDelete(button.dataset.deleteRow)));
$$('.rename-row').forEach((button) => button.addEventListener('click', () => {
  const row = button.closest('.saved-row');
  openRename(button.dataset.renameRow, row.querySelector('strong').textContent);
}));

$('#quickSaveBtn').addEventListener('click', () => setPanel('save'));
$('#validateGutenberg').addEventListener('click', () => {
  $('#inspectorStatus').textContent = 'Input valid';
  $('#launchTimeline').innerHTML = `
    <li class="done">Input validated: ${$('#gutenbergInput').value.trim()}</li>
    <li class="current">Ready to build runtime</li>
    <li>Preview identity not assigned</li>
    <li>Save and export locked</li>
  `;
  addActivity('Contract', 'Gutenberg route input validated.');
});
$('#runGutenberg').addEventListener('click', completeGutenbergPreview);
$('#runSave').addEventListener('click', completeSave);
$('#cancelSave').addEventListener('click', () => addActivity('Temporary', 'Save canceled; Playground remains temporary.'));
$('#confirmDelete').addEventListener('click', confirmDelete);
$('#cancelDelete').addEventListener('click', () => $('#deleteConfirm').classList.add('hidden'));
$('#confirmRename').addEventListener('click', confirmRename);
$('#cancelRename').addEventListener('click', () => $('#renameBox').classList.add('hidden'));
$('#importZip').addEventListener('click', () => $('#zipConfirm').classList.remove('hidden'));
$('#confirmZip').addEventListener('click', replaceWithZip);
$('#cancelZip').addEventListener('click', () => $('#zipConfirm').classList.add('hidden'));
$('#downloadZip').addEventListener('click', () => addActivity('Ready', 'Current Playground packaged as playground-export.zip.'));
$('#runGalleryBlueprint').addEventListener('click', () => runBlueprintResult('Art Gallery Blueprint'));
$('#runBlueprintBundle').addEventListener('click', () => runBlueprintResult('Current blueprint.json'));
$('#refreshBtn').addEventListener('click', () => {
  $('#previewPulse').textContent = state.saveComplete ? 'reloaded' : 'temporary';
  addActivity(state.saveComplete ? 'Ready' : 'Temporary', state.saveComplete ? 'Saved Playground reloaded without losing identity.' : 'Temporary Playground refreshed; unsaved state is still at risk.');
});
$('#homeBtn').addEventListener('click', () => updatePath('/hello-from-playground/'));
$('#adminBtn').addEventListener('click', () => updatePath('/wp-admin/'));
$('#resetBtn').addEventListener('click', () => {
  if (state.saveComplete) {
    addActivity('Ready', 'Stored Playground uses Save & Reload for settings changes.');
  } else {
    addActivity('Warning', 'Reset requested for temporary site; confirmation would discard current files and database.');
  }
});
$('#pathInput').addEventListener('change', (event) => updatePath(event.target.value.startsWith('/') ? event.target.value : `/${event.target.value}`));
$('#codeEditor').addEventListener('input', () => {
  $('#fileDirty').textContent = 'Unsaved changes';
  $('#fileDirty').className = 'red-text';
});
$('#saveFile').addEventListener('click', () => {
  $('#fileDirty').textContent = 'Saved';
  $('#fileDirty').className = 'green';
  addActivity('Saved', '<code>/wordpress/wp-config.php</code> saved from the file browser.');
});
$('#clearHistoryBtn').addEventListener('click', () => {
  $('#activityList').innerHTML = '<li><span class="green">Ready</span> Resolved activity was cleared from the visible ledger.</li>';
});
$$('.manager-tabs button').forEach((button) => button.addEventListener('click', () => {
  $$('.manager-tabs button').forEach((tab) => tab.classList.toggle('is-active', tab === button));
  $$('.manager-panel').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.managerPanel === button.dataset.managerTab));
}));
