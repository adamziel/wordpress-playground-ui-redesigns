const routeDetails = {
  vanilla: {
    title: 'Vanilla WordPress',
    copy: 'Start a clean WordPress Playground with selected runtime settings.',
    action: 'Start Playground',
    form: `
      <label>WordPress version <select><option>Latest</option><option>6.8</option><option>6.7</option></select></label>
      <label>PHP version <select><option>8.3</option><option>8.2</option><option>8.1</option></select></label>
      <label>Language <select><option>English (United States)</option><option>Polski</option></select></label>
    `
  },
  'wp-pr': {
    title: 'Preview a WordPress PR',
    copy: 'Build WordPress core from a pull request number or full GitHub PR URL.',
    action: 'Preview WordPress PR',
    form: `
      <label>PR number or URL <input value="https://github.com/WordPress/wordpress-develop/pull/73152"></label>
      <label>Runtime <select><option>PHP 8.3, WP from PR</option><option>PHP 8.2, WP from PR</option></select></label>
    `
  },
  'gb-pr': {
    title: 'Preview a Gutenberg PR or Branch',
    copy: 'Accepts a pull request number, PR URL, or branch name from the Gutenberg repository.',
    action: 'Preview Gutenberg Build',
    form: `
      <label>PR, URL, or branch <input value="trunk"></label>
      <label>Install as <select><option>Plugin in current Playground</option><option>Fresh Playground</option></select></label>
    `
  },
  github: {
    title: 'Import from GitHub',
    copy: 'Import a public plugin, theme, or wp-content directory after connecting a GitHub account. The access token is not stored.',
    action: 'Connect GitHub Account',
    form: `
      <label>Repository <input value="owner/repository"></label>
      <label>Path <input value="wp-content/plugins/example-plugin"></label>
    `
  },
  'blueprint-url': {
    title: 'Run Blueprint from URL',
    copy: 'Fetch and run a remote blueprint.json against a new or current Playground.',
    action: 'Run Blueprint URL',
    form: `
      <label>Blueprint URL <input value="https://example.com/blueprint.json"></label>
      <label>Target <select><option>New Playground</option><option>Current Playground</option></select></label>
    `
  },
  zip: {
    title: 'Import .zip',
    copy: 'Choose a Playground export zip. Importing over the current site replaces files and database state.',
    action: 'Choose .zip File',
    form: `
      <label>Import target <select><option>Replace current unsaved site</option><option>Open as new Playground</option></select></label>
      <label class="check-line"><input type="checkbox" checked> Show destructive import confirmation</label>
    `
  }
};

document.querySelectorAll('.tool-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tool-tab').forEach((item) => item.classList.remove('is-active'));
    document.querySelectorAll('.panel').forEach((panel) => panel.classList.remove('is-active'));
    tab.classList.add('is-active');
    document.querySelector(`#panel-${tab.dataset.panel}`).classList.add('is-active');
  });
});

document.querySelectorAll('.route-item').forEach((route) => {
  route.addEventListener('click', () => {
    const detail = routeDetails[route.dataset.route];
    document.querySelectorAll('.route-item').forEach((item) => item.classList.remove('is-selected'));
    route.classList.add('is-selected');
    document.querySelector('#route-title').textContent = detail.title;
    document.querySelector('#route-copy').textContent = detail.copy;
    document.querySelector('#route-form').innerHTML = detail.form;
    document.querySelector('#route-action').textContent = detail.action;
  });
});

document.querySelectorAll('.project-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    if (tab.classList.contains('add-tab')) {
      return;
    }
    document.querySelectorAll('.project-tab').forEach((item) => item.classList.remove('is-active'));
    tab.classList.add('is-active');
  });
});
