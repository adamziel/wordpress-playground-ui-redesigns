const routeDetails = {
  vanilla: {
    label: 'selected route',
    title: 'Vanilla WordPress',
    copy: 'Creates a fresh temporary Playground tab. It is lost on refresh or close until saved.',
    fields: `
      <label>WordPress version<select><option>Latest</option><option>6.9 nightly</option><option>6.8.x</option></select></label>
      <label>PHP version<select><option>PHP 8.3</option><option>PHP 8.2</option><option>PHP 7.4</option></select></label>
    `,
    consequence: 'New tab opens as Unsaved Playground, path /wp-admin/ available immediately.',
    cta: 'Start fresh Playground'
  },
  wppr: {
    label: 'core preview',
    title: 'Preview a WordPress PR',
    copy: 'Builds a Playground from a wordpress-develop pull request. Use a PR number or full PR URL.',
    fields: `
      <label>PR number or URL<input type="text" value="https://github.com/WordPress/wordpress-develop/pull/7012"></label>
      <label>Landing path<input type="text" value="/wp-admin/"></label>
    `,
    consequence: 'Current tab is replaced by a temporary preview of that Core pull request.',
    cta: 'Preview WordPress PR'
  },
  gutenberg: {
    label: 'editor preview',
    title: 'Preview a Gutenberg PR or Branch',
    copy: 'Starts latest WordPress with a Gutenberg pull request or branch mounted as the editor plugin.',
    fields: `
      <label>PR number, URL, or branch<input type="text" value="trunk"></label>
      <label>Landing path<input type="text" value="/wp-admin/site-editor.php"></label>
    `,
    consequence: 'A temporary tab opens with the requested Gutenberg build and can be saved afterward.',
    cta: 'Preview Gutenberg build'
  },
  github: {
    label: 'repository import',
    title: 'Import from GitHub',
    copy: 'Imports public plugins, themes, or wp-content directories after connecting a GitHub account.',
    fields: `
      <label>Repository URL<input type="text" value="https://github.com/wordpress/wordpress-develop"></label>
      <label>Import target<select><option>Plugin</option><option>Theme</option><option>wp-content directory</option></select></label>
    `,
    consequence: 'Access token is not stored; refresh requires reconnecting GitHub before another import.',
    cta: 'Connect GitHub account'
  },
  blueprintUrl: {
    label: 'blueprint runner',
    title: 'Run Blueprint from URL',
    copy: 'Loads a public blueprint JSON URL and runs it against the active Playground after confirmation.',
    fields: `
      <label>Blueprint URL<input type="text" value="https://example.com/blueprint.json"></label>
      <label>Behavior<select><option>Modify current tab</option><option>Open in new tab</option></select></label>
    `,
    consequence: 'Running over the current site can install plugins, change content, and update settings.',
    cta: 'Run Blueprint URL'
  },
  zip: {
    label: 'archive import',
    title: 'Import .zip',
    copy: 'Triggers the native file chooser for a Playground zip archive.',
    fields: `
      <label>Selected file<input type="text" value="site-export.zip"></label>
      <label>Import mode<select><option>Replace current site</option><option>Open as new tab</option></select></label>
    `,
    consequence: 'Replacing the current site discards unsaved files and database changes.',
    cta: 'Choose .zip file'
  }
};

const routeDetail = document.querySelector('#route-detail');
const appShell = document.querySelector('.app-shell');

function renderRoute(routeName) {
  const route = routeDetails[routeName];
  if (!route || !routeDetail) return;

  routeDetail.innerHTML = `
    <div class="detail-title">
      <span class="chip black">${route.label}</span>
      <h2>${route.title}</h2>
    </div>
    <p>${route.copy}</p>
    <div class="form-grid">${route.fields}</div>
    <div class="consequence">
      <strong>Result</strong>
      <span>${route.consequence}</span>
    </div>
    <button class="primary" type="button" id="launch-button">${route.cta}</button>
  `;
}

document.querySelectorAll('.route-card').forEach((card) => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.route-card').forEach((item) => item.classList.remove('selected'));
    card.classList.add('selected');
    renderRoute(card.dataset.route);
  });
});

function openDrawer(name) {
  document.querySelectorAll('.panel-overlay').forEach((panel) => panel.classList.remove('open'));
  const panel = document.querySelector(`#drawer-${name}`);
  appShell.dataset.activeDrawer = name;
  if (panel) panel.classList.add('open');
}

document.addEventListener('click', (event) => {
  const drawerButton = event.target.closest('[data-drawer]');
  if (drawerButton) {
    openDrawer(drawerButton.dataset.drawer);
  }

  if (event.target.matches('[data-close]') || event.target.classList.contains('panel-overlay')) {
    document.querySelectorAll('.panel-overlay').forEach((panel) => panel.classList.remove('open'));
    if (appShell.dataset.activeDrawer !== 'launch') {
      appShell.dataset.activeDrawer = 'preview';
    }
  }

  const managerButton = event.target.closest('[data-manager-tab]');
  if (managerButton) {
    const tabName = managerButton.dataset.managerTab;
    document.querySelectorAll('[data-manager-tab]').forEach((button) => button.classList.remove('active'));
    managerButton.classList.add('active');
    document.querySelectorAll('.manager-content').forEach((content) => content.classList.remove('active'));
    document.querySelector(`#manager-${tabName}`)?.classList.add('active');
  }
});
