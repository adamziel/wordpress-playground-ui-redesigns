const state = {
  title: 'Unsaved Playground',
  storage: 'Temporary only',
  badge: 'Temporary Playground',
  badgeTone: 'amber',
  path: '/hello-from-playground/',
  selectedCommand: 'Blueprint Gallery',
  activePreview: 'home',
  selectedBlueprint: 0,
  zipFile: null,
  zipValid: false,
  githubImportConnected: false,
  githubExportConnected: false,
  browserRowDeleted: false,
};

const blueprints = [
  {
    name: 'Art Gallery',
    description: 'An art gallery created with the Vueo theme.',
    categories: ['Featured', 'Website', 'Personal', 'Themes'],
    thumb: 'art',
  },
  {
    name: 'Coffee Shop',
    description: 'A stylish WooCommerce coffee shop storefront with custom theme, products, and content.',
    categories: ['Featured', 'Website', 'WooCommerce'],
    thumb: 'coffee',
  },
  {
    name: 'Feed Reader with the Friends Plugin',
    description: 'Read feeds from the web in Playground using the Friends plugin.',
    categories: ['Featured', 'Content', 'Experiments'],
    thumb: 'feed',
  },
  {
    name: 'Gaming News',
    description: 'A gaming news site created with the Spiel theme.',
    categories: ['Featured', 'Website', 'News', 'Themes'],
    thumb: 'gaming',
  },
  {
    name: 'Non-profit Organization',
    description: 'A non-profit organization site created with the Koinonia theme.',
    categories: ['Featured', 'Website'],
    thumb: 'nonprofit',
  },
  {
    name: 'Personal Blog',
    description: 'A personal blog created with the Substrata theme.',
    categories: ['Personal', 'Website', 'Content'],
    thumb: 'blog',
  },
  {
    name: 'Block Theme Shop',
    description: 'A compact storefront for testing block theme patterns and WooCommerce content.',
    categories: ['WooCommerce', 'Themes', 'Gutenberg'],
    thumb: 'shop',
  },
  {
    name: 'Docs Starter',
    description: 'A content-heavy starter site for editing pages, navigation, and media.',
    categories: ['Content', 'Website', 'Gutenberg'],
    thumb: 'docs',
  },
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function setText(selector, text) {
  const element = $(selector);
  if (element) element.textContent = text;
}

function setBadge(element, text, tone) {
  element.textContent = text;
  element.className = `status-pill ${tone}`;
}

function addHistory(title, detail) {
  const list = $('#transferHistory');
  const ready = list.querySelector('li b');
  if (ready && ready.textContent === 'Ready') list.innerHTML = '';
  const item = document.createElement('li');
  item.innerHTML = `<b>${title}</b><span>${detail}</span>`;
  list.prepend(item);
}

function setOperation(title, detail, progress = 0) {
  setText('#operationTitle', title);
  setText('#operationDetail', detail);
  $('#globalProgress').style.width = `${progress}%`;
}

function updateIdentity() {
  setText('#activeTitle', state.title);
  setText('#identityStorage', state.storage);
  setText('#selectedCommandLabel', state.selectedCommand);
  setText('#commandBadge', state.selectedCommand);
  setText('#downloadSource', state.title);
  setText('#zipCurrentName', state.title);
  setText('#wpSiteName', state.title.includes('Unsaved') ? 'My WordPress Website' : state.title);
  $('#pathInput').value = state.path;
  setBadge($('#storageBadge'), state.badge, state.badgeTone);
  $$('.saved-row').forEach((row) => row.classList.remove('is-active'));
  if (state.storage.includes('browser')) $('#row-browser')?.classList.add('is-active');
  else if (state.storage.includes('directory')) $('#row-local')?.classList.add('is-active');
  else $('#row-unsaved')?.classList.add('is-active');
}

function setPanel(panel) {
  $$('.panel').forEach((item) => item.classList.toggle('is-active', item.dataset.panel === panel));
  $$('.tab').forEach((item) => item.classList.toggle('is-active', item.dataset.panelTarget === panel));
  const labels = {
    blueprints: 'Blueprint Gallery',
    import: 'Import Routes',
    export: 'Portability',
    save: 'Save Flow',
    manager: 'Site Manager',
    library: 'Saved Library',
  };
  state.selectedCommand = labels[panel] || 'Command';
  updateIdentity();
}

function simulateProgress({ card, bar, count, text, steps, done }) {
  card.hidden = false;
  let index = 0;
  const timer = window.setInterval(() => {
    const step = steps[index];
    text.textContent = step.label;
    count.textContent = step.count;
    bar.style.width = `${step.percent}%`;
    setOperation(step.label, step.detail, step.percent);
    index += 1;
    if (index >= steps.length) {
      window.clearInterval(timer);
      window.setTimeout(done, 180);
    }
  }, 360);
}

function renderBlueprints() {
  const query = $('#blueprintSearch').value.trim().toLowerCase();
  const activeCategory = $('#categoryChips .is-active').dataset.category;
  const list = $('#blueprintList');
  const filtered = blueprints.filter((blueprint) => {
    const categoryMatch = activeCategory === 'All' || blueprint.categories.includes(activeCategory);
    const text = `${blueprint.name} ${blueprint.description} ${blueprint.categories.join(' ')}`.toLowerCase();
    return categoryMatch && (!query || text.includes(query));
  });
  list.innerHTML = '';
  filtered.forEach((blueprint) => {
    const originalIndex = blueprints.indexOf(blueprint);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `blueprint-card ${originalIndex === state.selectedBlueprint ? 'is-selected' : ''}`;
    button.innerHTML = `<span class="thumb ${blueprint.thumb}"></span><strong>${blueprint.name}</strong><span>${blueprint.description}</span>`;
    button.addEventListener('click', () => selectBlueprint(originalIndex));
    list.append(button);
  });
  setText('#catalogNote', filtered.length ? `Showing ${filtered.length} representative entries from the 43-entry Blueprint gallery.` : 'No representative entries match this filter.');
}

function selectBlueprint(index) {
  state.selectedBlueprint = index;
  const blueprint = blueprints[index];
  setText('#selectedBlueprintName', blueprint.name);
  setText('#selectedBlueprintDescription', blueprint.description);
  $('#selectedArt').className = `detail-art ${blueprint.thumb}`;
  $('#selectedTags').innerHTML = blueprint.categories.map((tag) => `<span>${tag}</span>`).join('');
  $('#blueprintUrl').value = `https://playground.wordpress.net/blueprints/${blueprint.name.toLowerCase().replaceAll(' ', '-').replaceAll('.', '')}.json`;
  renderBlueprints();
}

function updatePreview(kind, title, body) {
  if (kind === 'admin') {
    setText('#previewKicker', 'WordPress Admin');
    setText('#previewHeadline', 'Dashboard');
    setText('#previewBody', 'The embedded WordPress admin is open for plugins, themes, posts, settings, and site editing.');
    setText('#previewNote', 'Admin navigation stays inside the Playground shell.');
  } else if (kind === 'zip') {
    setText('#previewKicker', 'Imported archive');
    setText('#previewHeadline', title);
    setText('#previewBody', body);
    setText('#previewNote', 'Imported from ZIP. Save again if you want this replacement state to survive refresh.');
  } else if (kind === 'blueprint') {
    setText('#previewKicker', 'Blueprint result');
    setText('#previewHeadline', title);
    setText('#previewBody', body);
    setText('#previewNote', 'Blueprint steps completed and replaced the active content.');
  } else {
    setText('#previewKicker', 'Browser hosted WordPress');
    setText('#previewHeadline', 'Hello from WordPress Playground!');
    setText('#previewBody', 'This Playground runs client-side in your browser. It is ready for plugin tests, theme demos, Blueprint runs, and file edits.');
    setText('#previewNote', 'You are logged in as admin. Save before closing the browser to keep files and the database.');
  }
}

function finishSave(destination) {
  if (destination === 'browser') {
    const name = $('#browserSaveName').value.trim() || 'Research Browser Playground';
    state.title = name;
    state.storage = 'Saved in this browser';
    state.badge = 'Saved Playground';
    state.badgeTone = 'green';
    state.path = '/research-browser-playground/hello-from-playground/';
    setText('#unsavedRowTitle', name);
    setText('#unsavedRowMeta', 'Transformed from temporary into a browser-saved Playground.');
    setText('#saveResult', `${name} is saved in this browser. It now has a slug and appears in Saved Playgrounds.`);
    addHistory('Browser save complete', `${name} copied 3751 files and database records into browser storage.`);
  } else {
    const folder = $('#localFolderName').value.trim() || 'Sites/Playground Research';
    state.title = 'Local Directory Playground';
    state.storage = `Local directory: ${folder}`;
    state.badge = 'Local directory linked';
    state.badgeTone = 'green';
    state.path = '/local-directory/hello-from-playground/';
    setText('#saveResult', `Folder permission granted for ${folder}. Reconnect will be required after refresh.`);
    addHistory('Local directory save complete', `Files and database written to ${folder}; browser storage row was not created.`);
  }
  updateIdentity();
  setOperation('Save complete', `${state.title} is now ${state.storage}.`, 100);
}

function runSave(destination) {
  $('#saveProgressBar').style.width = '0';
  simulateProgress({
    card: $('#saveProgressCard'),
    bar: $('#saveProgressBar'),
    count: $('#saveProgressCount'),
    text: $('#saveProgressText'),
    steps: [
      { label: 'Scanning Playground files...', count: '481 / 3751 files', percent: 18, detail: 'Preparing file copy.' },
      { label: 'Saving wp-content and database...', count: '2036 / 3751 files', percent: 54, detail: 'Copying active files and SQLite database.' },
      { label: 'Writing identity metadata...', count: '3504 / 3751 files', percent: 86, detail: 'Updating saved row, slug, and storage badge.' },
      { label: 'Save complete', count: '3751 / 3751 files', percent: 100, detail: 'Saved identity is active.' },
    ],
    done: () => finishSave(destination),
  });
}

function chooseZip(file, valid) {
  state.zipFile = file;
  state.zipValid = false;
  setText('#zipSource', file);
  setText('#zipSourceMeta', valid ? 'Archive selected. Validate before replacement.' : 'This source is not a ZIP archive.');
  setBadge($('#zipStatus'), valid ? 'Selected' : 'Invalid source', valid ? 'blue' : 'red');
  $('#prepareZipReplace').disabled = true;
  $('#zipWarning').hidden = true;
  setText('#zipResult', valid ? 'Archive selected. Validation is required before import.' : 'Failure: notes.txt is not a .zip Playground archive.');
  addHistory(valid ? 'ZIP selected' : 'ZIP validation failed', valid ? `${file} is ready for validation.` : `${file} rejected before replacement.`);
}

function finishZipImport() {
  state.title = 'Imported ZIP Playground';
  state.storage = 'Temporary ZIP import';
  state.badge = 'Unsaved ZIP import';
  state.badgeTone = 'amber';
  state.path = '/wp-admin/';
  updateIdentity();
  updatePreview('zip', 'Imported ZIP Playground', 'The selected archive replaced the previous files and database. The shell path moved to /wp-admin/ so the imported site can be inspected immediately.');
  setText('#zipResult', 'Success: playground-client-demo.zip replaced the active Playground. Save this imported state before refresh.');
  setText('#databaseSize', '688 KB');
  addHistory('ZIP import complete', 'playground-client-demo.zip replaced files, database, blueprint.json, and active identity.');
  setOperation('ZIP import complete', 'Active Playground identity, path, preview, and database size updated.', 100);
}

function runZipImport() {
  $('#zipWarning').hidden = true;
  $('#zipProgressBar').style.width = '0';
  simulateProgress({
    card: $('#zipProgressCard'),
    bar: $('#zipProgressBar'),
    count: $('#zipProgressCount'),
    text: $('#zipProgressText'),
    steps: [
      { label: 'Mounting archive...', count: '22%', percent: 22, detail: 'Reading selected ZIP source.' },
      { label: 'Replacing files...', count: '49%', percent: 49, detail: 'Current wp-content and WordPress files are being replaced.' },
      { label: 'Importing SQLite database...', count: '78%', percent: 78, detail: 'Database import is replacing the active site data.' },
      { label: 'Activating imported Playground...', count: '100%', percent: 100, detail: 'Updating shell identity and preview.' },
    ],
    done: finishZipImport,
  });
}

function finishZipDownload() {
  const name = `${state.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'playground'}-2026-05-21.zip`;
  setBadge($('#zipDownloadStatus'), 'Generated', 'green');
  setText('#downloadResultName', name);
  addHistory('ZIP download generated', `${name} contains files, database, blueprint.json, and wp-content.`);
  setOperation('ZIP download ready', `${name} is ready from the active Playground.`, 100);
}

function runZipDownload() {
  $('#downloadProgressBar').style.width = '0';
  simulateProgress({
    card: $('#downloadProgressCard'),
    bar: $('#downloadProgressBar'),
    count: $('#downloadProgressCount'),
    text: $('#downloadProgressText'),
    steps: [
      { label: 'Collecting active source...', count: '25%', percent: 25, detail: `Source: ${state.title}.` },
      { label: 'Bundling database and files...', count: '61%', percent: 61, detail: 'Adding SQLite database and wp-content.' },
      { label: 'Generating archive...', count: '91%', percent: 91, detail: 'Preparing the browser download result.' },
      { label: 'ZIP ready', count: '100%', percent: 100, detail: 'Archive generated.' },
    ],
    done: finishZipDownload,
  });
}

function initializeEvents() {
  $$('[data-panel-target]').forEach((button) => {
    button.addEventListener('click', () => setPanel(button.dataset.panelTarget));
  });

  $$('.manager-tab').forEach((button) => {
    button.addEventListener('click', () => {
      $$('.manager-tab').forEach((tab) => tab.classList.remove('is-active'));
      button.classList.add('is-active');
      $$('.manager-panel').forEach((panel) => panel.classList.toggle('is-active', panel.id === `manager-${button.dataset.managerTarget}`));
    });
  });

  $('#homeButton').addEventListener('click', () => {
    state.path = '/hello-from-playground/';
    updateIdentity();
    updatePreview('home');
    setOperation('Homepage opened', 'Path changed to /hello-from-playground/.', 35);
  });
  $('#adminButton').addEventListener('click', () => {
    state.path = '/wp-admin/';
    updateIdentity();
    updatePreview('admin');
    setOperation('WP Admin opened', 'Path changed to /wp-admin/.', 35);
  });
  $('#refreshButton').addEventListener('click', () => {
    setOperation('Preview refreshed', `${state.path} reloaded inside the WordPress frame.`, 42);
  });
  $('#pathInput').addEventListener('change', (event) => {
    state.path = event.target.value || '/';
    updateIdentity();
    setOperation('Path changed', `Active WordPress path is now ${state.path}.`, 40);
  });

  $('#blueprintSearch').addEventListener('input', renderBlueprints);
  $$('#categoryChips .chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      $$('#categoryChips .chip').forEach((item) => item.classList.remove('is-active'));
      chip.classList.add('is-active');
      renderBlueprints();
    });
  });
  $('#showAllBlueprints').addEventListener('click', () => {
    $('#blueprintSearch').value = '';
    $$('#categoryChips .chip').forEach((item) => item.classList.toggle('is-active', item.dataset.category === 'All'));
    setText('#catalogNote', 'The current product has 43 Blueprint entries. This static slice shows 8 representative cards with the captured categories.');
    renderBlueprints();
  });
  $('#blueprintEditor').addEventListener('input', () => {
    $('#jsonDirty').hidden = false;
    setText('#blueprintResult', 'JSON editor has unsaved changes. Validate before running.');
  });
  $('#validateBlueprint').addEventListener('click', () => {
    try {
      JSON.parse($('#blueprintEditor').value);
      $('#jsonDirty').hidden = true;
      setText('#blueprintResult', 'Valid Blueprint JSON. Run will still ask before replacing the current Playground.');
      addHistory('Blueprint validated', `${blueprints[state.selectedBlueprint].name} JSON passed validation.`);
    } catch (error) {
      setText('#blueprintResult', `Validation failed: ${error.message}`);
    }
  });
  $('#copyBlueprint').addEventListener('click', () => {
    setText('#blueprintResult', 'Blueprint link copied to clipboard state.');
    addHistory('Blueprint link copied', $('#blueprintUrl').value);
  });
  $('#downloadBlueprint').addEventListener('click', () => {
    setText('#blueprintResult', 'Blueprint bundle generated for download.');
    addHistory('Blueprint bundle downloaded', `${blueprints[state.selectedBlueprint].name} bundle generated.`);
  });
  $('#runBlueprint').addEventListener('click', () => {
    $('#blueprintWarning').hidden = false;
    setText('#blueprintResult', 'Replacement warning opened. Confirm to run this Blueprint against the current Playground.');
  });
  $('#cancelBlueprintRun').addEventListener('click', () => {
    $('#blueprintWarning').hidden = true;
    setText('#blueprintResult', 'Blueprint run cancelled. Active Playground was not changed.');
  });
  $('#confirmBlueprintRun').addEventListener('click', () => {
    const blueprint = blueprints[state.selectedBlueprint];
    $('#blueprintWarning').hidden = true;
    state.title = `${blueprint.name} Playground`;
    state.storage = 'Temporary Blueprint result';
    state.badge = 'Unsaved Blueprint result';
    state.badgeTone = 'amber';
    state.path = '/';
    updateIdentity();
    updatePreview('blueprint', blueprint.name, `${blueprint.description} The current content was replaced by Blueprint steps.`);
    setText('#blueprintResult', `${blueprint.name} ran successfully and replaced the active Playground content.`);
    addHistory('Blueprint run complete', `${blueprint.name} replaced current content and updated the preview.`);
    setOperation('Blueprint run complete', `${blueprint.name} is now active.`, 100);
  });

  $('#saveBrowser').addEventListener('click', () => runSave('browser'));
  $('#saveLocal').addEventListener('click', () => runSave('local'));
  $('#denyLocalFolder').addEventListener('click', () => {
    setText('#saveResult', 'Local directory permission denied. No folder was linked and the Playground remains in its current storage state.');
    addHistory('Local save cancelled', 'Folder picker permission was denied; no files were written.');
  });

  $('#chooseBadZip').addEventListener('click', () => chooseZip('notes.txt', false));
  $('#chooseZip').addEventListener('click', () => chooseZip('playground-client-demo.zip', true));
  $('#validateZip').addEventListener('click', () => {
    if (!state.zipFile) {
      setText('#zipResult', 'Validation failed: no file selected.');
      return;
    }
    if (!state.zipFile.endsWith('.zip')) {
      setBadge($('#zipStatus'), 'Validation failed', 'red');
      setText('#zipResult', 'Failure: selected source is not a ZIP archive. Choose a .zip file to continue.');
      return;
    }
    state.zipValid = true;
    $('#prepareZipReplace').disabled = false;
    setBadge($('#zipStatus'), 'Validated', 'green');
    setText('#zipResult', 'Archive validated. Replacement confirmation is required before import.');
    addHistory('ZIP validated', `${state.zipFile} passed archive checks.`);
  });
  $('#prepareZipReplace').addEventListener('click', () => {
    $('#zipWarning').hidden = false;
    setText('#zipResult', 'Replacement warning opened. Confirm to overwrite the current files and database.');
  });
  $('#cancelZipImport').addEventListener('click', () => {
    $('#zipWarning').hidden = true;
    setText('#zipResult', 'ZIP import cancelled. Active Playground was not changed.');
    addHistory('ZIP import cancelled', `${state.zipFile} was validated but not imported.`);
  });
  $('#confirmZipImport').addEventListener('click', runZipImport);

  $('#connectGithubImport').addEventListener('click', () => {
    state.githubImportConnected = true;
    $('#runGithubImport').disabled = false;
    setBadge($('#githubImportStatus'), 'Connected', 'green');
    setText('#githubImportResult', 'GitHub connected for this session. Token will not be stored after refresh.');
  });
  $('#runGithubImport').addEventListener('click', () => {
    const repo = $('#githubRepo').value;
    state.title = 'GitHub Import Playground';
    state.storage = 'Temporary GitHub import';
    state.badge = 'Unsaved GitHub import';
    state.badgeTone = 'amber';
    state.path = '/wp-admin/plugins.php';
    updateIdentity();
    updatePreview('zip', 'GitHub Import Playground', `${repo} was imported into wp-content and is ready for inspection.`);
    setText('#githubImportResult', `Success: imported ${repo}. Save this state before refresh.`);
    addHistory('GitHub import complete', `${repo} imported after account connection.`);
    setOperation('GitHub import complete', 'Active Playground identity and path updated.', 100);
  });

  $('#downloadZip').addEventListener('click', runZipDownload);
  $('#connectGithubExport').addEventListener('click', () => {
    state.githubExportConnected = true;
    $('#runGithubExport').disabled = false;
    setBadge($('#githubExportStatus'), 'Connected', 'green');
    setText('#githubExportResult', 'GitHub connected for export. Choose the destination repository and run export.');
  });
  $('#runGithubExport').addEventListener('click', () => {
    const repo = $('#githubExportRepo').value;
    setBadge($('#githubExportStatus'), 'Exported', 'green');
    setText('#githubExportResult', `Success: ${state.title} exported to ${repo} with files, database, and blueprint.json.`);
    addHistory('GitHub export complete', `${state.title} exported to ${repo}.`);
    setOperation('GitHub export complete', `${repo} received the active Playground bundle.`, 100);
  });
  $('#downloadDb').addEventListener('click', () => addHistory('Database downloaded', '/wordpress/wp-content/database/.ht.sqlite saved as database.sqlite.'));
  $('#openAdminer').addEventListener('click', () => addHistory('Adminer opened', 'Database tool opened in a new browser context.'));
  $('#openPhpMyAdmin').addEventListener('click', () => addHistory('phpMyAdmin opened', 'Database tool opened in a new browser context.'));
  $('#clearHistory').addEventListener('click', () => {
    $('#transferHistory').innerHTML = '<li><b>Ready</b><span>No transfers have run in this session.</span></li>';
  });

  $('#fileEditor').addEventListener('input', () => {
    $('#fileDirty').hidden = false;
    setText('#fileResult', 'wp-config.php has unsaved edits.');
  });
  $('#saveFile').addEventListener('click', () => {
    $('#fileDirty').hidden = true;
    setText('#fileResult', 'wp-config.php saved. Preview will use the updated configuration after reload.');
    addHistory('File saved', '/wordpress/wp-config.php saved from File browser.');
  });
  $('#newFile').addEventListener('click', () => setText('#fileResult', 'New file field opened in /wordpress. Save to create it.'));
  $('#newFolder').addEventListener('click', () => setText('#fileResult', 'New folder field opened in /wordpress. Save to create it.'));
  $('#uploadFile').addEventListener('click', () => setText('#fileResult', 'Upload completed: mu-plugin-demo.php added to wp-content/mu-plugins.'));
  $('#browseFiles').addEventListener('click', () => setText('#fileResult', 'Native file browser opened for selecting files.'));
  $('#applySettings').addEventListener('click', () => {
    state.title = state.storage.includes('Saved') ? state.title : 'Reset Playground';
    state.path = '/';
    updateIdentity();
    updatePreview('home');
    setOperation('Settings applied', state.storage.includes('Saved') ? 'Saved Playground reloaded with limited configuration changes.' : 'Temporary Playground was destructively reset.', 100);
    addHistory('Settings applied', state.storage.includes('Saved') ? 'Save & Reload completed.' : 'Unsaved Playground reset completed.');
  });
  $('#copyBundleLink').addEventListener('click', () => addHistory('Blueprint bundle link copied', '/blueprint.json link copied from Site Manager.'));
  $('#downloadBundle').addEventListener('click', () => addHistory('Blueprint bundle downloaded', 'Current /blueprint.json bundle generated.'));
  $('#managerDownloadDb').addEventListener('click', () => addHistory('Database downloaded', 'database.sqlite downloaded from Site Manager.'));
  $('#managerAdminer').addEventListener('click', () => addHistory('Adminer opened', 'Adminer opened from Site Manager database tab.'));
  $('#managerPhpMyAdmin').addEventListener('click', () => addHistory('phpMyAdmin opened', 'phpMyAdmin opened from Site Manager database tab.'));
  $('#managerDownloadZip').addEventListener('click', () => {
    setPanel('export');
    runZipDownload();
  });

  $('#startVanilla').addEventListener('click', () => {
    state.title = 'Unsaved Playground';
    state.storage = 'Temporary only';
    state.badge = 'Temporary Playground';
    state.badgeTone = 'amber';
    state.path = '/hello-from-playground/';
    updateIdentity();
    updatePreview('home');
    addHistory('Vanilla WordPress started', 'Fresh latest WordPress Playground replaced the current temporary session.');
    setOperation('Vanilla WordPress started', 'Fresh temporary Playground is active.', 100);
  });
  $('#previewWpPr').addEventListener('click', () => {
    state.title = 'WordPress PR Preview';
    state.storage = 'Temporary PR preview';
    state.badge = 'Unsaved PR preview';
    state.badgeTone = 'amber';
    state.path = '/wp-admin/about.php';
    updateIdentity();
    setOperation('WordPress PR preview started', 'Core pull request is running in a temporary Playground.', 100);
  });
  $('#previewGbPr').addEventListener('click', () => {
    state.title = 'Gutenberg Branch Preview';
    state.storage = 'Temporary Gutenberg preview';
    state.badge = 'Unsaved Gutenberg preview';
    state.badgeTone = 'amber';
    state.path = '/wp-admin/site-editor.php';
    updateIdentity();
    setOperation('Gutenberg preview started', 'Branch or PR is running in a temporary Playground.', 100);
  });

  $('#openBrowserRow').addEventListener('click', () => {
    if (state.browserRowDeleted) return;
    state.title = 'Research Browser Playground';
    state.storage = 'Saved in this browser';
    state.badge = 'Saved Playground';
    state.badgeTone = 'green';
    state.path = '/research-browser-playground/hello-from-playground/';
    updateIdentity();
    setText('#libraryResult', 'Research Browser Playground opened and is now the active browser-saved site.');
  });
  $('#renameBrowserRow').addEventListener('click', () => {
    if (state.browserRowDeleted) return;
    $('#row-browser strong').textContent = 'Renamed Browser Playground';
    if (state.storage.includes('browser')) {
      state.title = 'Renamed Browser Playground';
      updateIdentity();
    }
    setText('#libraryResult', 'Saved Playground renamed. Active shell title updates if that row is open.');
  });
  $('#deleteBrowserRow').addEventListener('click', () => {
    if (!state.browserRowDeleted) $('#deleteConfirm').hidden = false;
  });
  $('#cancelDelete').addEventListener('click', () => {
    $('#deleteConfirm').hidden = true;
    setText('#libraryResult', 'Delete cancelled. Saved row remains available.');
  });
  $('#confirmDelete').addEventListener('click', () => {
    state.browserRowDeleted = true;
    $('#deleteConfirm').hidden = true;
    $('#row-browser').remove();
    if (state.storage.includes('browser')) {
      state.title = 'Unsaved Playground';
      state.storage = 'Temporary only';
      state.badge = 'Temporary Playground';
      state.badgeTone = 'amber';
      state.path = '/hello-from-playground/';
      updateIdentity();
    }
    setText('#libraryResult', 'Research Browser Playground deleted. The browser list and active fallback state are updated.');
    addHistory('Saved Playground deleted', 'Browser-stored row removed after confirmation.');
  });
  $('#openLocalRow').addEventListener('click', () => {
    state.title = 'Local Directory Playground';
    state.storage = 'Local directory: Sites/Playground Research';
    state.badge = 'Local directory linked';
    state.badgeTone = 'green';
    state.path = '/local-directory/hello-from-playground/';
    updateIdentity();
    setText('#libraryResult', 'Local Directory Playground opened. Folder permission is available for this session.');
  });
}

selectBlueprint(0);
initializeEvents();
updateIdentity();
