const commands = [
  {
    id: 'vanilla',
    group: 'Start routes',
    title: 'Start Vanilla WordPress',
    summary: 'Fresh latest WordPress install, logged in as admin.',
    badge: 'No external input',
    fields: [],
    constraints: ['Uses selected WordPress, PHP, language, network, and multisite settings', 'Creates a temporary Playground until saved'],
    runText: 'Start Playground',
    progress: ['Preparing WordPress runtime', 'Creating temporary files and SQLite database', 'Opening Homepage'],
    result: 'Started a fresh temporary WordPress Playground.',
    mutation: 'vanilla',
  },
  {
    id: 'wordpress-pr',
    group: 'Start routes',
    title: 'Preview WordPress PR',
    summary: 'Accepts a WordPress core PR number or wordpress-develop URL.',
    badge: 'Core patch',
    fields: [{ label: 'PR number or URL', value: 'https://github.com/WordPress/wordpress-develop/pull/7821' }],
    constraints: ['Requires a WordPress PR number or URL', 'Builds a preview identity that can be saved or exported'],
    runText: 'Preview WordPress PR',
    progress: ['Validating core PR', 'Applying patch to latest WordPress', 'Opening PR preview'],
    result: 'WordPress PR preview is running and can now be saved.',
    mutation: 'wordpress-pr',
  },
  {
    id: 'gutenberg-pr',
    group: 'Start routes',
    title: 'Preview Gutenberg PR or branch',
    summary: 'Accepts a Gutenberg PR number, URL, or branch name.',
    badge: 'Editor patch',
    fields: [{ label: 'PR number, URL, or branch', value: 'try/block-bindings-panel' }],
    constraints: ['Installs a Gutenberg plugin build', 'Allows branch names as well as PR URLs'],
    runText: 'Preview Gutenberg',
    progress: ['Resolving Gutenberg branch', 'Installing plugin build', 'Opening editor patch review'],
    result: 'Gutenberg branch preview is running.',
    mutation: 'gutenberg-pr',
  },
  {
    id: 'github-import',
    group: 'Portability',
    title: 'Import from GitHub',
    summary: 'Connect an account, then import a plugin, theme, or wp-content directory.',
    badge: 'Account connection',
    fields: [{ label: 'Repository path', value: 'wordpress/wordpress-playground/packages/playground' }],
    constraints: ['GitHub account connection required', 'Access token is not stored after refresh', 'Can import plugins, themes, or wp-content directories'],
    runText: 'Connect and import',
    progress: ['Opening GitHub connection', 'Reading repository contents', 'Importing selected directory'],
    result: 'GitHub import finished; current Playground now uses imported wp-content.',
    mutation: 'github-import',
  },
  {
    id: 'blueprint-url',
    group: 'Blueprints',
    title: 'Run Blueprint from URL',
    summary: 'Validate a public blueprint.json URL, warn about replacement, then run it.',
    badge: 'Blueprint runner',
    fields: [{ label: 'Blueprint URL', value: 'https://example.com/blueprint.json' }],
    constraints: ['Requires public JSON URL', 'Running may replace current content and files', 'Copy and download bundle stay available in Site Manager'],
    runText: 'Validate and run',
    progress: ['Fetching blueprint.json', 'Validating schema', 'Replacing current content'],
    result: 'Blueprint URL ran successfully and changed the active preview.',
    mutation: 'blueprint',
  },
  {
    id: 'zip-import',
    group: 'Portability',
    title: 'Import .zip',
    summary: 'Open native file chooser, validate archive, confirm replacement, and import.',
    badge: 'Replacement',
    fields: [{ label: 'Selected archive', value: 'review-site-export.zip' }],
    constraints: ['Uses native file chooser in the live product', 'Requires confirmation before replacing files and database', 'Final state becomes an imported Playground'],
    runText: 'Review replacement and import',
    progress: ['Validating archive', 'Confirming replacement', 'Replacing files and SQLite database'],
    result: 'ZIP import completed and replaced the current Playground.',
    mutation: 'zip-import',
  },
  {
    id: 'save-browser',
    group: 'Save current Playground',
    title: 'Save in this browser',
    summary: 'Copy files into browser storage and create a saved row plus slug URL.',
    badge: 'Browser storage',
    fields: [{ label: 'Playground name', value: 'Research Browser Playground' }],
    constraints: ['Copies 3,751 files to browser storage', 'Available after reload in this browser', 'Settings switch from destructive reset to Save & Reload'],
    runText: 'Save in browser',
    progress: ['Saving 981 / 3751 files', 'Saving 3028 / 3751 files', 'Saved 3751 / 3751 files'],
    result: 'Saved to browser storage as research-browser-playground.',
    mutation: 'save-browser',
  },
  {
    id: 'save-local',
    group: 'Save current Playground',
    title: 'Save to a local directory',
    summary: 'Use the folder picker and keep a local directory backed working copy.',
    badge: 'Local directory',
    fields: [{ label: 'Playground name', value: 'Local Theme Lab' }, { label: 'Chosen folder', value: '~/Sites/playground-lab' }],
    constraints: ['Browser asks for folder permission', 'Folder may need reconnect after reload', 'Local files can be inspected outside Playground'],
    runText: 'Pick folder and save',
    progress: ['Requesting folder permission', 'Writing WordPress files to local directory', 'Local directory linked'],
    result: 'Saved to local directory ~/Sites/playground-lab.',
    mutation: 'save-local',
  },
  {
    id: 'file-save',
    group: 'Files and database',
    title: 'Save selected file',
    summary: 'Save the selected editor file, clear dirty state, and record the operation in Logs.',
    badge: 'File editor',
    fields: [{ label: 'Selected file', value: '/wordpress/wp-config.php' }],
    constraints: ['Selected file must be dirty', 'Save result updates the editor badge and WordPress logs'],
    runText: 'Save file',
    progress: ['Checking file permissions', 'Writing /wordpress/wp-config.php', 'Refreshing file result state'],
    result: 'wp-config.php saved. WordPress log recorded a config write.',
    mutation: 'file-save',
  },
  {
    id: 'database-download',
    group: 'Files and database',
    title: 'Download database.sqlite',
    summary: 'Download the SQLite-backed database for the active Playground.',
    badge: 'Database',
    fields: [],
    constraints: ['Driver: MySQL emulation backed by SQLite', 'Path: /wordpress/wp-content/database/.ht.sqlite', 'Current size: 452 KB'],
    runText: 'Download database.sqlite',
    progress: ['Checking SQLite database handle', 'Packaging database.sqlite', 'Download ready'],
    result: 'database.sqlite downloaded, 452 KB.',
    mutation: 'database-download',
  },
  {
    id: 'github-export',
    group: 'Portability',
    title: 'Export to GitHub',
    summary: 'Choose a repository and push the current Playground bundle.',
    badge: 'GitHub export',
    fields: [{ label: 'Repository', value: 'acme/playground-export' }, { label: 'Branch', value: 'playground-snapshot' }],
    constraints: ['GitHub account connection required', 'Exports current files and database-derived content', 'Records final pushed repository in transfer history'],
    runText: 'Export to GitHub',
    progress: ['Connecting GitHub account', 'Bundling Playground files', 'Pushing export branch'],
    result: 'Export pushed to acme/playground-export:playground-snapshot.',
    mutation: 'github-export',
  },
  {
    id: 'zip-download',
    group: 'Portability',
    title: 'Download as .zip',
    summary: 'Bundle WordPress files, Blueprint, and database into a zip archive.',
    badge: 'ZIP download',
    fields: [{ label: 'Archive name', value: 'research-browser-playground.zip' }],
    constraints: ['Includes files and SQLite-backed database', 'Can be imported back with the .zip route'],
    runText: 'Download zip',
    progress: ['Collecting WordPress files', 'Adding database and Blueprint', 'Archive ready'],
    result: 'research-browser-playground.zip downloaded.',
    mutation: 'zip-download',
  },
];

let selectedCommand = commands.find((command) => command.id === 'database-download');
let selectedBlueprintName = 'Art Gallery';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function addActivity(kind, text) {
  const li = document.createElement('li');
  const badgeClass = kind === 'Error' ? 'red' : kind === 'Saved' || kind === 'File' ? 'green' : kind === 'Replacement' ? 'amber' : 'blue';
  li.innerHTML = `<span class="pill ${badgeClass}">${kind}</span> ${text}`;
  $('#activityList').prepend(li);
}

function addLog(target, text) {
  const list = $(`#${target}`);
  if (!list) return;
  if (list.children.length === 1 && /No problems/.test(list.textContent)) {
    list.innerHTML = '';
  }
  const li = document.createElement('li');
  li.textContent = text;
  list.prepend(li);
}

function setPanel(panelName) {
  $$('.cockpit-tabs button, .bottom-nav button').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.panel === panelName);
  });
  $$('.panel').forEach((panel) => panel.classList.toggle('is-active', panel.id === `panel-${panelName}`));
}

function renderCommandResults() {
  const query = $('#commandSearch').value.trim().toLowerCase();
  const matches = commands.filter((command) => {
    const haystack = `${command.group} ${command.title} ${command.summary} ${command.constraints.join(' ')}`.toLowerCase();
    return !query || haystack.includes(query);
  });
  const grouped = matches.reduce((acc, command) => {
    acc[command.group] ||= [];
    acc[command.group].push(command);
    return acc;
  }, {});
  $('#commandResults').innerHTML = Object.entries(grouped).map(([group, items]) => `
    <section class="result-group">
      <h3>${group}</h3>
      ${items.map((command) => `
        <button class="result-item ${command.id === selectedCommand.id ? 'is-active' : ''}" type="button" data-command-id="${command.id}">
          <span><strong>${command.title}</strong><span>${command.summary}</span></span>
          <span class="badge blue">${command.badge}</span>
        </button>
      `).join('')}
    </section>
  `).join('') || '<p class="result-line">No commands match this query. Try save, file, database, github, blueprint, zip, PR, or reset.</p>';
}

function renderCommandForm() {
  $('#formGroup').textContent = selectedCommand.group;
  $('#formTitle').textContent = selectedCommand.title;
  $('#formDescription').textContent = selectedCommand.summary;
  $('#runCommand').textContent = selectedCommand.runText;
  $('#constraints').innerHTML = selectedCommand.constraints.map((constraint) => `<span>${constraint}</span>`).join('');
  $('#dynamicFields').innerHTML = selectedCommand.fields.map((field, index) => `
    <label>
      <span>${field.label}</span>
      <input data-field-index="${index}" value="${field.value}">
    </label>
  `).join('');
  $('#commandProgress').hidden = true;
  $('.meter span', $('#commandProgress')).style.width = '0';
  $('#commandResult').innerHTML = selectedCommand.result.replace(/</g, '&lt;');
  renderCommandResults();
}

function selectCommand(id) {
  const command = commands.find((item) => item.id === id);
  if (!command) return;
  selectedCommand = command;
  setPanel('command');
  renderCommandForm();
}

function updateOperationSteps(current, result) {
  $('#operationSteps').innerHTML = `
    <li class="done">Command selected</li>
    <li class="done">Validation complete</li>
    <li class="${result ? 'done' : 'current'}">${current}</li>
    <li class="${result ? 'current' : ''}">${result || 'Result pending'}</li>
  `;
}

function setPath(path) {
  $('#pathInput').value = path;
  $('#browserUrl').textContent = `playground.local${path}`;
  $('#pathState').textContent = 'navigated';
  addActivity('Path', `Navigated active WordPress preview to <code>${path}</code>.`);
}

function applyMutation(command) {
  const titleInput = $('[data-field-index="0"]', $('#dynamicFields'));
  const name = titleInput ? titleInput.value : 'Research Browser Playground';

  if (command.mutation === 'save-browser') {
    $('.app').dataset.storage = 'browser';
    $('#activeTitle').textContent = name;
    $('#activeSlug').textContent = 'Slug: research-browser-playground';
    $('#storageBadge').textContent = 'Saved in browser';
    $('#storageBadge').className = 'badge green';
    $('#resetMode').textContent = 'Settings changes use Save & Reload';
    $('#previewKicker').textContent = 'Saved Playground';
    $('#previewNotice').textContent = 'Saved in this browser. This Playground can be reopened from Saved Playgrounds on this device.';
    addSavedRow(name, 'Browser storage, just saved', 'browser');
    addActivity('Saved', `Browser save completed. Shell title, storage badge, slug, and Saved Playgrounds row now point to <strong>${name}</strong>.`);
  }

  if (command.mutation === 'save-local') {
    $('.app').dataset.storage = 'local';
    $('#activeTitle').textContent = name;
    $('#activeSlug').textContent = 'Local folder: ~/Sites/playground-lab';
    $('#storageBadge').textContent = 'Local directory';
    $('#storageBadge').className = 'badge green';
    $('#resetMode').textContent = 'Reload may require reconnecting the local folder';
    addSavedRow(name, 'Local directory: ~/Sites/playground-lab, permission granted', 'local');
    addActivity('Saved', `Local directory save completed. Folder permission is granted for <code>~/Sites/playground-lab</code>.`);
  }

  if (command.mutation === 'database-download') {
    $('#databaseResult').textContent = 'database.sqlite downloaded successfully, 452 KB.';
    $('#selectedObject').textContent = '/wordpress/wp-content/database/.ht.sqlite';
    $('#selectedObjectState').textContent = 'Database downloaded, 452 KB';
    addActivity('Transfer', 'Downloaded <code>database.sqlite</code> from the SQLite-backed database.');
    addLog('playgroundLog', 'Database download completed: /wordpress/wp-content/database/.ht.sqlite, 452 KB.');
  }

  if (command.mutation === 'file-save') {
    markFileClean('Saved through command search.');
  }

  if (command.mutation === 'blueprint') {
    $('#activeTitle').textContent = 'Blueprint URL Playground';
    $('#activeSlug').textContent = 'Blueprint source: https://example.com/blueprint.json';
    $('#previewKicker').textContent = 'Blueprint result';
    $('#previewTitle').innerHTML = 'Blueprint content is now running';
    $('#previewText').textContent = 'The current content was replaced after validation and confirmation. Blueprint copy, download, and run actions remain available in Site Manager.';
    addActivity('Replacement', 'Blueprint URL validated and replaced the current Playground content.');
    addLog('playgroundLog', 'Blueprint run completed with schema validation.');
  }

  if (command.mutation === 'zip-import') {
    $('#activeTitle').textContent = 'Imported ZIP Playground';
    $('#activeSlug').textContent = 'Imported archive: review-site-export.zip';
    $('#storageBadge').textContent = 'Imported';
    $('#storageBadge').className = 'badge amber';
    $('#previewKicker').textContent = 'ZIP import result';
    $('#previewTitle').innerHTML = 'Imported Playground bundle';
    $('#previewText').textContent = 'The selected ZIP replaced the current files and SQLite-backed database after confirmation.';
    addActivity('Replacement', 'ZIP import completed and replaced the active Playground.');
    addLog('playgroundLog', 'ZIP import replaced WordPress files and database.');
  }

  if (['vanilla', 'wordpress-pr', 'gutenberg-pr', 'github-import'].includes(command.mutation)) {
    const label = {
      vanilla: 'Unsaved Playground',
      'wordpress-pr': 'WordPress PR Preview',
      'gutenberg-pr': 'Gutenberg Branch Preview',
      'github-import': 'GitHub Import Playground',
    }[command.mutation];
    $('#activeTitle').textContent = label;
    $('#storageBadge').textContent = 'Temporary';
    $('#storageBadge').className = 'badge amber';
    $('#activeSlug').textContent = command.mutation === 'github-import' ? 'Imported from GitHub, not saved after refresh' : 'Temporary preview, save to keep it';
    $('#previewKicker').textContent = label;
    $('#previewText').textContent = command.result;
    addActivity('Command', `${command.title} completed and mutated the active shell identity.`);
  }

  if (command.mutation === 'github-export') {
    addActivity('Transfer', 'Export pushed to <code>acme/playground-export:playground-snapshot</code>.');
  }

  if (command.mutation === 'zip-download') {
    addActivity('Transfer', 'Downloaded <code>research-browser-playground.zip</code> for import elsewhere.');
  }

  updateOperationSteps('Progress complete', 'Result applied');
}

function runSelectedCommand() {
  const progress = $('#commandProgress');
  const meter = $('.meter span', progress);
  progress.hidden = false;
  meter.style.width = '8%';
  $('#progressTitle').textContent = selectedCommand.title;
  $('#progressText').textContent = selectedCommand.progress[0];
  $('#commandResult').textContent = 'Running...';
  updateOperationSteps('Progress running', '');

  selectedCommand.progress.forEach((step, index) => {
    window.setTimeout(() => {
      $('#progressText').textContent = step;
      meter.style.width = `${Math.round(((index + 1) / selectedCommand.progress.length) * 100)}%`;
    }, 420 * (index + 1));
  });

  window.setTimeout(() => {
    $('#commandResult').textContent = selectedCommand.result;
    applyMutation(selectedCommand);
  }, 420 * (selectedCommand.progress.length + 1));
}

function addSavedRow(name, subtitle, storage) {
  const list = $('#savedList');
  const existing = Array.from(list.children).find((row) => $('strong', row)?.textContent === name);
  if (existing) {
    existing.classList.add('is-active');
    return;
  }
  $$('.saved-row').forEach((row) => row.classList.remove('is-active'));
  const row = document.createElement('article');
  row.className = 'saved-row is-active';
  row.dataset.rowId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  row.innerHTML = `
    <span class="site-icon ${storage === 'local' ? 'folder' : ''}">${storage === 'local' ? 'L' : 'W'}</span>
    <div><strong>${name}</strong><small>${subtitle}</small></div>
    <button type="button" class="open-row">Open</button>
    <button type="button" class="rename-row">Rename</button>
    <button type="button" class="delete-row">Delete</button>
  `;
  list.append(row);
}

function setManagerTab(name) {
  $$('.subtabs button').forEach((button) => button.classList.toggle('is-active', button.dataset.managerTab === name));
  $$('.manager-tab').forEach((tab) => tab.classList.toggle('is-active', tab.id === `manager-${name}`));
}

function markFileDirty() {
  $('#fileDirty').textContent = 'Dirty';
  $('#fileDirty').className = 'badge amber';
  $('#selectedObjectState').textContent = 'Dirty file, save required';
  $('#fileResult').textContent = 'Unsaved changes in selected file.';
}

function markFileClean(prefix = 'File saved.') {
  $('#fileDirty').textContent = 'Saved';
  $('#fileDirty').className = 'badge green';
  $('#selectedObjectState').textContent = 'Saved a moment ago';
  $('#fileResult').textContent = `${prefix} Editor dirty state cleared and logs updated.`;
  addActivity('File', 'Saved selected file <code>/wordpress/wp-config.php</code> and cleared the dirty badge.');
  addLog('wordpressLog', 'File saved: /wordpress/wp-config.php.');
}

function simulateButtonResult(button, message, kind = 'Transfer') {
  const original = button.textContent;
  button.textContent = 'Working...';
  button.disabled = true;
  window.setTimeout(() => {
    button.textContent = original;
    button.disabled = false;
    addActivity(kind, message);
  }, 650);
}

document.addEventListener('click', (event) => {
  const panelButton = event.target.closest('[data-panel]');
  if (panelButton) setPanel(panelButton.dataset.panel);

  const openPanel = event.target.closest('[data-open-panel]');
  if (openPanel) {
    setPanel(openPanel.dataset.openPanel);
    if (openPanel.dataset.commandId) selectCommand(openPanel.dataset.commandId);
  }

  const commandButton = event.target.closest('[data-command-id]');
  if (commandButton && !event.target.closest('[data-open-panel]')) {
    selectCommand(commandButton.dataset.commandId);
  }

  const managerButton = event.target.closest('[data-manager-tab]');
  if (managerButton) setManagerTab(managerButton.dataset.managerTab);

  if (event.target.id === 'runCommand') runSelectedCommand();
  if (event.target.id === 'validateCommand') {
    $('#commandResult').textContent = `${selectedCommand.title} validated. Constraints are satisfied.`;
    addActivity('Command', `${selectedCommand.title} validated from command search.`);
  }
  if (event.target.id === 'cancelCommand') {
    $('#commandProgress').hidden = true;
    $('#commandResult').textContent = 'Command canceled before changing the active Playground.';
  }

  if (event.target.id === 'homeButton') setPath('/hello-from-playground/');
  if (event.target.id === 'adminButton') setPath('/wp-admin/');
  if (event.target.id === 'refreshButton') {
    $('#pathState').textContent = 'refreshed';
    addActivity('Path', `Refreshed active WordPress page at <code>${$('#pathInput').value}</code>.`);
  }

  if (event.target.id === 'saveFile') {
    $('#fileResult').textContent = 'Saving selected file...';
    window.setTimeout(() => markFileClean('File save completed.'), 600);
  }
  if (event.target.id === 'revertFile') {
    $('#fileEditor').value = "define( 'DB_NAME', 'database_name_here' );\ndefine( 'DB_USER', 'username_here' );\ndefine( 'DB_PASSWORD', 'password_here' );\ndefine( 'DB_HOST', 'localhost' );\ndefine( 'WP_DEBUG', true );";
    markFileClean('File reverted.');
  }
  if (event.target.id === 'newFile') addActivity('File', 'Created new file placeholder in /wordpress/wp-content/.');
  if (event.target.id === 'newFolder') addActivity('File', 'Created new folder placeholder in /wordpress/wp-content/.');
  if (event.target.id === 'uploadFile') addActivity('File', 'Upload completed: mu-plugin-demo.php added to wp-content/mu-plugins.');
  if (event.target.id === 'browseFiles') addActivity('File', 'Native browse files picker returned wp-config.php.');

  if (event.target.classList.contains('tree-row')) {
    $$('.tree-row').forEach((row) => row.classList.remove('is-active'));
    event.target.classList.add('is-active');
    $('#fileName').textContent = event.target.dataset.file;
    $('#selectedObject').textContent = event.target.dataset.file;
    markFileClean('Selected file loaded.');
  }

  if (event.target.id === 'applySettings') {
    $('#resetMode').textContent = 'Reset completed with WordPress latest / PHP 8.3';
    addActivity('Replacement', 'Settings applied. Unsaved Playground reset completed.');
    addLog('playgroundLog', 'Settings reset completed for temporary Playground.');
  }
  if (event.target.id === 'openAdminer') simulateButtonResult(event.target, 'Adminer opened for /wordpress/wp-content/database/.ht.sqlite.');
  if (event.target.id === 'openPhpMyAdmin') simulateButtonResult(event.target, 'phpMyAdmin opened for the SQLite-backed database.');

  if (event.target.id === 'copyBlueprint' || event.target.id === 'copySelectedBlueprint') simulateButtonResult(event.target, 'Blueprint link copied to clipboard.', 'Blueprint');
  if (event.target.id === 'downloadBlueprint' || event.target.id === 'downloadSelectedBlueprint' || event.target.id === 'downloadBlueprintBundle') simulateButtonResult(event.target, 'Blueprint bundle downloaded.', 'Blueprint');
  if (event.target.id === 'runBlueprint' || event.target.id === 'runSelectedBlueprint') {
    selectCommand('blueprint-url');
    runSelectedCommand();
  }

  const blueprintCard = event.target.closest('.blueprint-card');
  if (blueprintCard) {
    $$('.blueprint-card').forEach((card) => card.classList.remove('is-active'));
    blueprintCard.classList.add('is-active');
    selectedBlueprintName = blueprintCard.dataset.bp;
    $('#selectedBlueprint').textContent = selectedBlueprintName;
    $('#selectedBlueprintText').textContent = `${selectedBlueprintName} is selected from this representative subset of the 43 Blueprint gallery entries. Running it asks before replacing current content.`;
  }

  if (event.target.classList.contains('delete-row')) {
    $('#deleteConfirm').hidden = false;
    $('#deleteProgress').hidden = true;
    $('#deleteConfirm').scrollIntoView({ block: 'nearest' });
  }
  if (event.target.id === 'cancelDelete') {
    $('#deleteConfirm').hidden = true;
    addActivity('Saved', 'Delete canceled. Saved Playground row remains available.');
  }
  if (event.target.id === 'confirmDelete') {
    $('#deleteProgress').hidden = false;
    const meter = $('.meter span', $('#deleteProgress'));
    meter.style.width = '45%';
    window.setTimeout(() => {
      meter.style.width = '100%';
      const row = $('[data-row-id="research"]');
      if (row) row.remove();
      $('#deleteConfirm').hidden = true;
      $('#activeTitle').textContent = 'Unsaved Playground';
      $('#activeSlug').textContent = 'Temporary session, no browser slug';
      $('#storageBadge').textContent = 'Temporary';
      $('#storageBadge').className = 'badge amber';
      addActivity('Saved', 'Deleted Research Browser Playground. Active shell fell back to the unsaved temporary Playground.');
    }, 720);
  }

  if (event.target.classList.contains('open-row')) {
    const row = event.target.closest('.saved-row');
    $$('.saved-row').forEach((item) => item.classList.remove('is-active'));
    row.classList.add('is-active');
    $('#activeTitle').textContent = $('strong', row).textContent;
    $('#activeSlug').textContent = $('small', row).textContent;
    $('#storageBadge').textContent = row.dataset.rowId === 'local' ? 'Local directory' : 'Saved in browser';
    $('#storageBadge').className = 'badge green';
    addActivity('Saved', `Opened saved Playground <strong>${$('strong', row).textContent}</strong>.`);
  }

  if (event.target.classList.contains('rename-row')) {
    const row = event.target.closest('.saved-row');
    const strong = $('strong', row);
    strong.textContent = strong.textContent === 'Renamed Playground' ? 'Research Browser Playground' : 'Renamed Playground';
    $('#activeTitle').textContent = strong.textContent;
    addActivity('Saved', `Renamed saved row to <strong>${strong.textContent}</strong>.`);
  }

  if (event.target.id === 'clearResolved') {
    $('#activityList').innerHTML = '<li><span class="pill green">Resolved</span> Transfer history cleared for this static session.</li>';
  }
});

$('#commandSearch').addEventListener('input', renderCommandResults);
$('#fileEditor').addEventListener('input', markFileDirty);
$('#pathInput').addEventListener('change', (event) => setPath(event.target.value.startsWith('/') ? event.target.value : `/${event.target.value}`));

$('#blueprintSearch').addEventListener('input', (event) => {
  const query = event.target.value.toLowerCase();
  $$('.blueprint-card').forEach((card) => {
    const haystack = `${card.dataset.bp} ${card.dataset.tags}`.toLowerCase();
    card.hidden = !haystack.includes(query);
  });
});

$$('.chips button').forEach((button) => {
  button.addEventListener('click', () => {
    $$('.chips button').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    const category = button.dataset.category;
    $$('.blueprint-card').forEach((card) => {
      card.hidden = category !== 'all' && !card.dataset.tags.includes(category);
    });
  });
});

renderCommandForm();
