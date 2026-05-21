const app = document.querySelector('.app');
const historyList = document.querySelector('#historyList');

const state = {
  active: 'research',
  pendingDelete: null,
  selectedDestination: 'browser',
  pendingTemporaryReset: false,
  objects: {
    research: {
      name: 'Research Browser Playground',
      storage: 'browser',
      meta: 'Saved in this browser - slug /research-browser',
      badge: 'Saved in browser',
      badgeClass: 'green',
      rowMeta: 'Browser storage - saved a moment ago',
      previewState: 'Saved'
    },
    local: {
      name: 'Client Theme Lab',
      storage: 'local',
      meta: 'Local directory - ~/Sites/client-theme-lab',
      badge: 'Local directory',
      badgeClass: 'blue',
      rowMeta: 'Local directory - ~/Sites/client-theme-lab',
      previewState: 'Folder backed'
    },
    temporary: {
      name: 'Unsaved Playground',
      storage: 'temporary',
      meta: 'Temporary session - lost on refresh or close',
      badge: 'Unsaved',
      badgeClass: 'amber',
      rowMeta: 'Temporary - lost on refresh or close',
      previewState: 'Temporary'
    }
  }
};

const blueprints = [
  { name: 'Art Gallery', tags: ['Website', 'Personal', 'Themes'], description: 'An art gallery created with the Vueo theme.' },
  { name: 'Coffee Shop', tags: ['WooCommerce', 'Website'], description: 'A store with products, custom theme, and cart content.' },
  { name: 'Feed Reader with the Friends Plugin', tags: ['Content', 'Personal'], description: 'Read feeds from the web in Playground.' },
  { name: 'Gaming News', tags: ['Website', 'News'], description: 'A Spiel-powered gaming news homepage.' },
  { name: 'Non-profit Organization', tags: ['Website', 'Content'], description: 'A Koinonia-based volunteer and benefit site.' },
  { name: 'Personal Blog', tags: ['Personal', 'Themes'], description: 'A Substrata personal journal and research blog.' }
];

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return [...document.querySelectorAll(selector)];
}

function setText(selector, text) {
  const node = qs(selector);
  if (node) node.textContent = text;
}

function addHistory(text, color = 'blue') {
  const item = document.createElement('li');
  item.innerHTML = `<span class="dot ${color}"></span> ${text}`;
  historyList.prepend(item);
}

function setBadge(node, object) {
  node.className = `badge ${object.badgeClass}`;
  node.textContent = object.badge;
}

function updateRuntimeCopy() {
  const wp = qs('#wpVersion').value;
  const php = qs('#phpVersion').value;
  const network = qs('#networkAccess').checked ? 'network on' : 'network off';
  setText('#shellRuntime', `WP ${wp} - PHP ${php} - ${network}`);
}

function renderActiveObject() {
  const object = state.objects[state.active];
  if (!object) return;

  app.dataset.storage = object.storage;
  setText('#activeName', object.name);
  setText('#activeMeta', object.meta);
  setText('#previewTitle', object.name);
  qs('#renameInput').value = object.name;

  setBadge(qs('#shellBadge'), object);
  const previewState = qs('#previewState');
  previewState.className = `badge ${object.badgeClass}`;
  previewState.textContent = object.previewState;

  qsa('.object-row').forEach((row) => {
    const key = row.dataset.object;
    row.classList.toggle('is-active', key === state.active);
    const rowObject = state.objects[key];
    if (!rowObject) return;
    row.querySelector('strong').textContent = rowObject.name;
    row.querySelector('small').textContent = rowObject.rowMeta;
    const badge = row.querySelector('.badge');
    badge.className = `badge ${key === state.active ? rowObject.badgeClass : rowObject.badgeClass}`;
    badge.textContent = key === state.active ? 'Current' : rowObject.previewState;
  });

  const stored = object.storage !== 'temporary';
  qs('#settingsModeTitle').textContent = stored ? 'Stored reload behavior' : 'Unsaved reset warning';
  qs('#settingsModeCopy').textContent = stored
    ? 'This saved Playground keeps its identity. Save & Reload applies runtime changes without removing the saved row.'
    : 'Applying settings to a temporary Playground resets WordPress and discards current files, database changes, and unsaved edits.';
  qs('#settingsWarning').classList.toggle('is-destructive', !stored);
  qs('#applySettings').textContent = stored ? 'Save & Reload' : 'Apply Settings & Reset';
  qs('#settingsResult').textContent = stored
    ? 'Runtime matches saved object settings.'
    : 'Temporary settings changes require a destructive reset confirmation.';
  state.pendingTemporaryReset = false;
}

function activateTab(tab) {
  qsa('[data-tab]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.tab === tab);
  });
  qsa('[data-panel]').forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.panel === tab);
  });
}

function setManagerTab(tab) {
  qsa('[data-manager-tab]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.managerTab === tab);
  });
  qsa('[data-manager-pane]').forEach((pane) => {
    pane.classList.toggle('is-active', pane.dataset.managerPane === tab);
  });
}

function startProgress({ meter, label, steps, done }) {
  let index = 0;
  const meterNode = qs(meter);
  const labelNode = qs(label);
  meterNode.style.width = '0%';

  const tick = () => {
    const step = steps[index];
    labelNode.textContent = step.text;
    meterNode.style.width = step.width;
    index += 1;
    if (index < steps.length) {
      window.setTimeout(tick, 420);
    } else if (done) {
      window.setTimeout(done, 320);
    }
  };
  tick();
}

function handleObjectAction(button) {
  const key = button.dataset.object;
  const action = button.dataset.action;
  if (!state.objects[key]) return;

  if (action === 'open') {
    state.active = key;
    renderActiveObject();
    setText('#previewMode', key === 'temporary' ? 'Temporary preview' : 'Saved preview');
    addHistory(`${state.objects[key].name} opened as the active Playground.`, 'green');
    return;
  }

  if (action === 'rename') {
    state.active = key;
    renderActiveObject();
    qs('#renameCard').hidden = false;
    qs('#deleteCard').hidden = true;
    activateTab('objects');
    return;
  }

  if (action === 'delete') {
    state.pendingDelete = key;
    const object = state.objects[key];
    qs('#deleteCard').hidden = false;
    qs('#renameCard').hidden = true;
    qs('#deleteProgress').hidden = true;
    setText('#deleteTitle', object.storage === 'temporary' ? 'Reset temporary Playground?' : `Delete ${object.name}?`);
    setText(
      '#deleteCopy',
      object.storage === 'local'
        ? 'This forgets the local-directory object from the saved list. Files remain in the chosen folder.'
        : object.storage === 'temporary'
          ? 'This resets the temporary Playground and clears unsaved runtime changes.'
          : 'This removes the browser-saved object. The live preview falls back to the remaining Unsaved Playground.'
    );
  }
}

function applyRename() {
  const object = state.objects[state.active];
  const name = qs('#renameInput').value.trim() || object.name;
  object.name = name;
  object.meta = object.storage === 'browser'
    ? `Saved in this browser - slug /${name.toLowerCase().replace(/\s+/g, '-')}`
    : object.storage === 'local'
      ? `Local directory - ~/Sites/${name.toLowerCase().replace(/\s+/g, '-')}`
      : 'Named draft - temporary until saved';
  object.rowMeta = object.meta.replace('Saved in this browser', 'Browser storage');
  qs('#renameCard').hidden = true;
  renderActiveObject();
  addHistory(`${name} renamed and kept as the current Playground.`, 'green');
}

function confirmDelete() {
  const key = state.pendingDelete;
  const object = state.objects[key];
  if (!key || !object) return;
  qs('#deleteProgress').hidden = false;

  startProgress({
    meter: '#deleteProgress i',
    label: '#deleteProgressLabel',
    steps: [
      { text: 'Checking active selection...', width: '32%' },
      { text: object.storage === 'temporary' ? 'Resetting temporary runtime...' : 'Removing saved object...', width: '68%' },
      { text: 'Updating saved object list...', width: '100%' }
    ],
    done: () => {
      const row = qs(`.object-row[data-object="${key}"]`);
      if (object.storage === 'temporary') {
        object.name = 'Unsaved Playground';
        object.meta = 'Temporary session - reset just now';
        object.rowMeta = 'Temporary - reset just now';
        state.active = 'temporary';
        addHistory('Temporary Playground reset completed and remains active.', 'red');
      } else {
        row?.remove();
        delete state.objects[key];
        state.active = state.objects.temporary ? 'temporary' : Object.keys(state.objects)[0];
        addHistory(`${object.name} deleted from saved Playgrounds. Active site fell back to Unsaved Playground.`, 'red');
      }
      qs('#deleteCard').hidden = true;
      setText('#objectCount', `${Object.keys(state.objects).length} objects`);
      renderActiveObject();
      setText('#previewHeadline', 'Hello from WordPress Playground!');
      setText('#previewNotice', 'Active fallback is unsaved.');
    }
  });
}

function handleDestination(destination) {
  state.selectedDestination = destination;
  qsa('.destination').forEach((button) => {
    button.classList.toggle('is-selected', button.dataset.destination === destination);
  });
  qs('#localPermission').hidden = destination !== 'local';
  qs('#saveDestinationBadge').textContent = destination === 'local' ? 'Local folder' : 'Browser';
  qs('#saveDestinationBadge').className = `badge ${destination === 'local' ? 'blue' : 'green'}`;
  setText(
    '#saveProgressLabel',
    destination === 'local'
      ? 'Ready to request folder permission and write 3,751 files.'
      : 'Ready to copy 3,751 files.'
  );
}

function runSave() {
  const name = qs('#saveName').value.trim() || 'Saved Playground';
  const destination = state.selectedDestination;
  const object = state.objects[state.active];

  startProgress({
    meter: '#saveMeter',
    label: '#saveProgressLabel',
    steps: destination === 'local'
      ? [
          { text: 'Requesting local folder permission...', width: '22%' },
          { text: 'Writing 1,248 / 3,751 files to ~/Sites/research-browser-playground...', width: '45%' },
          { text: 'Writing 3,751 / 3,751 files...', width: '82%' },
          { text: 'Local directory save complete. Reconnect may be required after reload.', width: '100%' }
        ]
      : [
          { text: 'Saving 302 / 3,751 files to browser storage...', width: '18%' },
          { text: 'Saving 2,814 / 3,751 files...', width: '62%' },
          { text: 'Saving 3,751 / 3,751 files...', width: '88%' },
          { text: 'Browser save complete. Slug and saved row updated.', width: '100%' }
        ],
    done: () => {
      object.name = name;
      object.storage = destination;
      object.badge = destination === 'local' ? 'Local directory' : 'Saved in browser';
      object.badgeClass = destination === 'local' ? 'blue' : 'green';
      object.previewState = destination === 'local' ? 'Folder backed' : 'Saved';
      object.meta = destination === 'local'
        ? 'Local directory - ~/Sites/research-browser-playground'
        : `Saved in this browser - slug /${name.toLowerCase().replace(/\s+/g, '-')}`;
      object.rowMeta = destination === 'local'
        ? 'Local directory - ~/Sites/research-browser-playground'
        : 'Browser storage - saved just now';
      renderActiveObject();
      addHistory(
        destination === 'local'
          ? `${name} saved to local directory with folder permission.`
          : `${name} saved in browser storage and selected as current.`,
        'green'
      );
    }
  });
}

function applySettings() {
  const object = state.objects[state.active];
  const stored = object.storage !== 'temporary';

  if (!stored && !state.pendingTemporaryReset) {
    state.pendingTemporaryReset = true;
    qs('#settingsWarning').classList.add('is-destructive');
    setText('#settingsModeTitle', 'Unsaved reset warning');
    setText('#settingsModeCopy', 'Confirming will reset this temporary Playground, discard the current database and file edits, and reload WordPress with the selected runtime.');
    setText('#applySettings', 'Confirm reset');
    setText('#settingsResult', 'Reset is armed. Cancel by restoring defaults or selecting a saved object.');
    return;
  }

  qs('#settingsProgress').hidden = false;
  startProgress({
    meter: '#settingsMeter',
    label: '#settingsProgressLabel',
    steps: stored
      ? [
          { text: 'Saving version, PHP, language, and network settings...', width: '26%' },
          { text: 'Reloading stored Playground runtime...', width: '58%' },
          { text: 'Reattaching saved identity and preview path...', width: '84%' },
          { text: 'Runtime badge updated.', width: '100%' }
        ]
      : [
          { text: 'Discarding temporary runtime changes...', width: '28%' },
          { text: 'Resetting WordPress files and SQLite database...', width: '64%' },
          { text: 'Booting selected runtime...', width: '100%' }
        ],
    done: () => {
      updateRuntimeCopy();
      const wp = qs('#wpVersion').value;
      const php = qs('#phpVersion').value;
      const language = qs('#language').value;
      const network = qs('#networkAccess').checked ? 'network enabled' : 'network disabled';
      if (stored) {
        object.rowMeta = `${object.storage === 'local' ? 'Local directory' : 'Browser storage'} - WP ${wp}, PHP ${php}`;
        setText('#settingsResult', `Saved and reloaded ${object.name}: WP ${wp}, PHP ${php}, ${language}, ${network}.`);
        setText('#previewMode', 'Reloaded runtime');
        setText('#previewNotice', 'Saved identity preserved.');
        addHistory(`${object.name} Save & Reload completed with WP ${wp}, PHP ${php}, ${network}.`, 'green');
      } else {
        object.rowMeta = `Temporary - reset to WP ${wp}, PHP ${php}`;
        setText('#settingsResult', `Temporary Playground reset complete: WP ${wp}, PHP ${php}, ${language}, ${network}.`);
        setText('#previewMode', 'Reset runtime');
        setText('#previewNotice', 'Temporary reset completed.');
        addHistory(`Unsaved Playground reset after settings change: WP ${wp}, PHP ${php}.`, 'red');
      }
      renderActiveObject();
    }
  });
}

function resetSettings() {
  qs('#wpVersion').value = 'latest';
  qs('#phpVersion').value = '8.3';
  qs('#language').value = 'English (United States)';
  qs('#olderVersions').checked = false;
  qs('#networkAccess').checked = true;
  qs('#multisite').checked = false;
  qs('#settingsProgress').hidden = true;
  updateRuntimeCopy();
  renderActiveObject();
}

function renderBlueprints(filter = 'All', search = '') {
  const grid = qs('#blueprintGrid');
  const query = search.trim().toLowerCase();
  const filtered = blueprints.filter((item) => {
    const matchesFilter = filter === 'All' || item.tags.includes(filter);
    const matchesSearch = !query || item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });
  grid.innerHTML = '';
  filtered.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `blueprint-card${index === 2 ? ' is-selected' : ''}`;
    button.innerHTML = `
      <span class="blueprint-shot" aria-hidden="true"></span>
      <div>
        <strong>${item.name}</strong>
        <small>${item.description}</small>
      </div>
    `;
    button.addEventListener('click', () => {
      qsa('.blueprint-card').forEach((card) => card.classList.remove('is-selected'));
      button.classList.add('is-selected');
      qs('#blueprintDetail strong').textContent = item.name;
      qs('#blueprintDetail p').textContent = `${item.description} Running it validates JSON, warns before replacing current content, then updates the active preview.`;
    });
    grid.append(button);
  });
  setText('#blueprintCount', `${filtered.length} shown`);
}

function runRoute(route) {
  const labels = {
    vanilla: 'Vanilla WordPress start queued. Unsaved changes warning acknowledged.',
    wordpress: 'WordPress PR input validated. Preview build started.',
    gutenberg: 'Gutenberg branch input validated. Preview build started.',
    github: 'GitHub account connection requested. Token will not be stored after refresh.',
    blueprintUrl: 'Blueprint URL validated. Replacement warning shown before run.',
    zip: 'Native .zip chooser opened. Archive validation will run before replacement.'
  };
  setText('#routeResult', labels[route]);
  addHistory(labels[route], route === 'zip' || route === 'blueprintUrl' ? 'red' : 'blue');
}

function setPreviewPath(path, label) {
  qs('#pathInput').value = path;
  setText('#previewMode', label);
  addHistory(`Preview navigated to ${path}.`, 'blue');
}

qsa('[data-tab]').forEach((button) => {
  button.addEventListener('click', () => activateTab(button.dataset.tab));
});

qsa('[data-tab-target]').forEach((button) => {
  button.addEventListener('click', () => activateTab(button.dataset.tabTarget));
});

qsa('[data-manager-tab]').forEach((button) => {
  button.addEventListener('click', () => setManagerTab(button.dataset.managerTab));
});

qs('#objectList').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (button) handleObjectAction(button);
});

qs('#applyRename').addEventListener('click', applyRename);
qs('#cancelRename').addEventListener('click', () => {
  qs('#renameCard').hidden = true;
});
qs('#cancelDelete').addEventListener('click', () => {
  qs('#deleteCard').hidden = true;
  addHistory('Delete cancelled; saved object list unchanged.', 'blue');
});
qs('#confirmDelete').addEventListener('click', confirmDelete);

qsa('.destination').forEach((button) => {
  button.addEventListener('click', () => handleDestination(button.dataset.destination));
});
qs('#runSave').addEventListener('click', runSave);
qs('#cancelSave').addEventListener('click', () => {
  setText('#saveProgressLabel', 'Save cancelled. Current Playground state is unchanged.');
  qs('#saveMeter').style.width = '0%';
});

qs('#applySettings').addEventListener('click', applySettings);
qs('#resetSettings').addEventListener('click', resetSettings);
qsa('#wpVersion, #phpVersion, #language, #olderVersions, #networkAccess, #multisite').forEach((control) => {
  control.addEventListener('change', () => {
    state.pendingTemporaryReset = false;
    setText('#settingsResult', 'Settings changed. Apply to reload or reset the active Playground.');
    updateRuntimeCopy();
  });
});

qs('#manageButton').addEventListener('click', () => activateTab('manager'));
qs('#startButton').addEventListener('click', () => activateTab('start'));
qs('#saveButton').addEventListener('click', () => activateTab('save'));
qs('#homeButton').addEventListener('click', () => setPreviewPath('/hello-from-playground/', 'Homepage'));
qs('#adminButton').addEventListener('click', () => setPreviewPath('/wp-admin/', 'WP Admin'));
qs('#previewHomeLink').addEventListener('click', () => setPreviewPath('/hello-from-playground/', 'Homepage'));
qs('#refreshButton').addEventListener('click', () => {
  setText('#previewNotice', 'Preview refreshed.');
  addHistory(`Refreshed ${qs('#pathInput').value}.`, 'green');
});
qs('#pathInput').addEventListener('change', () => {
  setPreviewPath(qs('#pathInput').value || '/', 'Custom path');
});

qsa('[data-route-run]').forEach((button) => {
  button.addEventListener('click', () => runRoute(button.dataset.routeRun));
});

qs('#fileEditor').addEventListener('input', () => {
  qs('#fileDirty').textContent = 'dirty';
  qs('#fileDirty').className = 'badge amber';
  setText('#fileResult', 'wp-config.php has unsaved edits.');
});
qs('#saveFile').addEventListener('click', () => {
  qs('#fileDirty').textContent = 'saved';
  qs('#fileDirty').className = 'badge green';
  setText('#fileResult', 'wp-config.php saved to the active Playground file system.');
  addHistory('wp-config.php saved from the file browser.', 'green');
});
qs('#newFile').addEventListener('click', () => setText('#fileResult', 'New file created: /wordpress/wp-content/mu-plugins/playground-note.php.'));
qs('#newFolder').addEventListener('click', () => setText('#fileResult', 'New folder created: /wordpress/wp-content/uploads/imports.'));
qs('#uploadFiles').addEventListener('click', () => setText('#fileResult', 'Upload complete: theme-overrides.css added to wp-content.'));

qs('#copyBlueprint').addEventListener('click', () => setText('#blueprintResult', 'Blueprint link copied for the current bundle.'));
qs('#downloadBlueprint').addEventListener('click', () => {
  setText('#blueprintResult', 'Blueprint bundle downloaded.');
  addHistory('Blueprint bundle downloaded.', 'green');
});
qs('#runBlueprint').addEventListener('click', () => {
  setText('#blueprintResult', 'Blueprint validated and run against the active Playground.');
  setText('#previewMode', 'Blueprint result');
  addHistory('Current blueprint.json ran successfully after validation.', 'green');
});
qs('#runSelectedBlueprint').addEventListener('click', () => {
  const name = qs('#blueprintDetail strong').textContent;
  setText('#previewHeadline', name);
  setText('#previewBody', 'The selected Blueprint has replaced the preview content after validation and replacement confirmation.');
  setText('#previewMode', 'Blueprint gallery result');
  addHistory(`${name} Blueprint run completed and updated the preview.`, 'green');
});

qs('#downloadDb').addEventListener('click', () => {
  setText('#databaseResult', 'database.sqlite downloaded from /wordpress/wp-content/database/.ht.sqlite.');
  addHistory('database.sqlite downloaded.', 'green');
});
qs('#downloadZip').addEventListener('click', () => addHistory('Current Playground downloaded as .zip.', 'green'));
qs('#managerExportGithub').addEventListener('click', () => addHistory('Site Manager opened GitHub export with account connection and repository selection.', 'blue'));
qs('#exportGithub').addEventListener('click', () => addHistory('GitHub export opened repository selection after account connection.', 'blue'));

qsa('[data-transfer]').forEach((button) => {
  button.addEventListener('click', () => {
    const labels = {
      githubImport: 'GitHub import requested account connection; access token will not persist after refresh.',
      githubExport: 'Export to GitHub opened repository and branch selection.',
      zipImport: 'Import .zip opened native file chooser and replacement warning.',
      zipDownload: 'Download .zip generated a portable archive for the active Playground.',
      database: 'database.sqlite downloaded from the SQLite-backed database path.',
      blueprint: 'Blueprint bundle downloaded for the active Playground.'
    };
    addHistory(labels[button.dataset.transfer], button.dataset.transfer === 'zipImport' ? 'red' : 'blue');
  });
});

qsa('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    qsa('[data-filter]').forEach((filterButton) => filterButton.classList.remove('is-active'));
    button.classList.add('is-active');
    renderBlueprints(button.dataset.filter, qs('#blueprintSearch').value);
  });
});
qs('#blueprintSearch').addEventListener('input', () => {
  const filter = qs('[data-filter].is-active')?.dataset.filter || 'All';
  renderBlueprints(filter, qs('#blueprintSearch').value);
});

renderActiveObject();
renderBlueprints();
