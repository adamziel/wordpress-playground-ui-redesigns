const routeData = {
  vanilla: {
    title: 'Vanilla WordPress',
    body: 'Creates a fresh temporary Playground using the selected WordPress, PHP, language, network, and multisite settings.',
    controls: `
      <label>WordPress version<select><option>latest</option><option>6.5</option><option>6.4</option></select></label>
      <label>PHP version<select><option>8.3</option><option>8.2</option><option>8.1</option></select></label>
      <label class="checkline"><input type="checkbox" checked> Allow network access</label>
      <label class="checkline"><input type="checkbox"> Create multisite network</label>
    `,
    action: 'Start fresh Playground'
  },
  'wordpress-pr': {
    title: 'Preview a WordPress PR',
    body: 'Boots WordPress from a wordpress-develop pull request. The route needs a PR number or a full pull request URL.',
    controls: `
      <label>PR number or URL<input value="https://github.com/WordPress/wordpress-develop/pull/1234"></label>
      <label>WordPress base<select><option>latest trunk</option><option>6.5 branch</option></select></label>
      <label class="checkline"><input type="checkbox" checked> Log in as admin</label>
    `,
    action: 'Preview WordPress PR'
  },
  'gutenberg-pr': {
    title: 'Preview a Gutenberg PR or Branch',
    body: 'Installs Gutenberg from a PR number, pull request URL, or branch name before opening the Playground.',
    controls: `
      <label>PR number, URL, or branch name<input value="try/block-bindings-panel"></label>
      <label>Plugin install mode<select><option>Gutenberg plugin active</option><option>Plugin installed only</option></select></label>
      <label class="checkline"><input type="checkbox" checked> Allow network access for package fetch</label>
    `,
    action: 'Preview Gutenberg source'
  },
  github: {
    title: 'Import from GitHub',
    body: 'Imports a public plugin, theme, or wp-content directory. GitHub authentication is required and the token is not stored after refresh.',
    controls: `
      <label>Repository<input value="wordpress/wordpress-playground"></label>
      <label>Path to import<input value="/packages/playground/wordpress"></label>
      <label>Import type<select><option>plugin</option><option>theme</option><option>wp-content</option></select></label>
      <label class="checkline"><input type="checkbox"> Connect GitHub account for this session</label>
    `,
    action: 'Connect GitHub and import'
  },
  'blueprint-url': {
    title: 'Run Blueprint from URL',
    body: 'Fetches a blueprint JSON file and runs its steps. Running over the selected temporary site can replace current content.',
    controls: `
      <label>Blueprint URL<input value="https://example.com/blueprint.json"></label>
      <label>Target<select><option>Create new Playground</option><option>Run over selected temporary site</option></select></label>
      <label class="checkline"><input type="checkbox" checked> Inspect before running</label>
    `,
    action: 'Run Blueprint URL'
  },
  zip: {
    title: 'Import .zip',
    body: 'Opens the native file chooser. Imported archives can replace the current Playground files, so the consequence is shown before action.',
    controls: `
      <label>Archive constraint<input value=".zip file selected through browser picker" disabled></label>
      <label>Import target<select><option>Replace current temporary Playground</option><option>Create new Playground from archive</option></select></label>
      <label class="checkline"><input type="checkbox" checked> Show import result after file copy</label>
    `,
    action: 'Choose .zip file'
  }
};

const routeDetail = document.querySelector('#route-detail');
const launchAction = document.querySelector('#launch-action');

document.querySelectorAll('[data-route]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-route]').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const route = routeData[button.dataset.route];
    routeDetail.querySelector('.route-copy h3').textContent = route.title;
    routeDetail.querySelector('.route-copy p:not(.eyebrow)').textContent = route.body;
    routeDetail.querySelector('.form-grid').innerHTML = route.controls;
    launchAction.textContent = route.action;
  });
});

launchAction.addEventListener('click', () => {
  launchAction.textContent = 'Preparing WordPress...';
  setTimeout(() => {
    launchAction.textContent = 'Started: Unsaved Plugin Sandbox';
  }, 600);
});

const saveResult = document.querySelector('#save-result');
document.querySelectorAll('[data-save]').forEach((button) => {
  button.addEventListener('click', () => {
    const isLocal = button.dataset.save === 'local';
    const label = isLocal ? 'Selecting local directory and copying 3,751 files...' : 'Saving 3,028 / 3,751 files into browser storage...';
    saveResult.innerHTML = `<strong>${label}</strong><div class="progress"><span style="width: 68%"></span></div>`;
    setTimeout(() => {
      const complete = isLocal
        ? 'Saved to local directory: ~/Sites/unsaved-plugin-sandbox. Site is now mounted.'
        : 'Saved in this browser as /plugin-sandbox/. Library identity changed to Saved Playground.';
      saveResult.innerHTML = `<strong>${complete}</strong><div class="progress"><span style="width: 100%"></span></div>`;
      document.querySelector('.detail-panel .status').textContent = isLocal ? 'Local dir' : 'Saved';
      document.querySelector('.detail-panel .status').className = 'status ok';
    }, 800);
  });
});

document.querySelectorAll('[data-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach((item) => item.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.tab).classList.add('active');
  });
});

document.querySelector('#reset-button').addEventListener('click', () => {
  document.querySelector('#reset-result').textContent = 'Reset queued: temporary files and database will be replaced after reload.';
});

document.querySelector('#rename-button').addEventListener('click', () => {
  document.querySelector('#identity-result').textContent = 'Rename preview applied. Saving commits this name into the library.';
});

document.querySelector('#delete-button').addEventListener('click', () => {
  document.querySelector('#delete-dialog').showModal();
});

document.querySelectorAll('[data-open]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector(`#${button.dataset.open}-dialog`).showModal();
  });
});

const panels = document.querySelectorAll('[data-mobile-view]');
const mobileButtons = document.querySelectorAll('[data-mobile-target]');

function showMobilePanel(target) {
  panels.forEach((panel) => {
    panel.classList.toggle('mobile-active', panel.dataset.mobileView === target);
  });
  mobileButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.mobileTarget === target);
  });
}

mobileButtons.forEach((button) => {
  button.addEventListener('click', () => showMobilePanel(button.dataset.mobileTarget));
});

function syncMobileMode() {
  if (window.matchMedia('(max-width: 760px)').matches) {
    const active = document.querySelector('.bottom-nav button.active')?.dataset.mobileTarget || 'library';
    showMobilePanel(active);
  } else {
    panels.forEach((panel) => panel.classList.remove('mobile-active'));
  }
}

window.addEventListener('resize', syncMobileMode);
syncMobileMode();
