const routeContent = {
  vanilla: {
    title: 'Vanilla WordPress',
    help: 'Fresh latest WordPress starts without extra input. Use this for workshops where every attendee needs the same neutral baseline.',
    label: 'Optional site label',
    value: 'Block theme basics lab',
    constraint: 'No authentication or remote URL is required. The new Playground will replace the temporary session unless it is saved first.'
  },
  'wp-pr': {
    title: 'Preview a WordPress PR',
    help: 'Runs a WordPress core pull request in Playground so instructors can demonstrate a specific proposed change.',
    label: 'PR number or URL',
    value: 'https://github.com/WordPress/wordpress-develop/pull/7123',
    constraint: 'Accepts a core PR number or URL. Starting this preview resets the current temporary Playground unless saved.'
  },
  'gb-pr': {
    title: 'Preview a Gutenberg PR or Branch',
    help: 'Loads Gutenberg from a pull request, PR URL, or named branch for editor-focused lessons.',
    label: 'PR number, URL, or branch name',
    value: 'trunk',
    constraint: 'Branch names are valid here. This route is distinct from WordPress core PR preview.'
  },
  github: {
    title: 'Import from GitHub',
    help: 'Imports a public plugin, theme, or wp-content directory after account connection.',
    label: 'Repository path',
    value: 'wordpress/wporg-mu-plugins',
    constraint: 'Requires GitHub connection. The access token is not stored and re-authentication is required after refresh.'
  },
  'blueprint-url': {
    title: 'Run Blueprint from URL',
    help: 'Runs a hosted blueprint.json file as the source for the Playground.',
    label: 'Blueprint URL',
    value: 'https://example.com/workshop/blueprint.json',
    constraint: 'Only a Blueprint URL belongs here. Gallery Blueprints can be inspected before running from the catalog below.'
  },
  zip: {
    title: 'Import .zip',
    help: 'Triggers the native file chooser to import a zip package.',
    label: 'Selected file',
    value: 'workshop-starting-site.zip',
    constraint: 'Import may replace files in the current site. Save the temporary Playground first if students need a rollback point.'
  }
};

document.querySelectorAll('.source-card').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.source-card').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const content = routeContent[button.dataset.source];
    document.querySelector('#route-title').textContent = content.title;
    document.querySelector('#route-help').textContent = content.help;
    document.querySelector('#route-field-label').firstChild.textContent = `${content.label} `;
    document.querySelector('#route-input').value = content.value;
    document.querySelector('#route-constraint').textContent = content.constraint;
  });
});

const blueprintContent = {
  friends: {
    title: 'Feed Reader with the Friends Plugin',
    copy: 'Starts WordPress with the Friends plugin installed so attendees can read feeds and inspect a real plugin-backed site.',
    thumb: 'friends'
  },
  coffee: {
    title: 'Coffee Shop',
    copy: 'A WooCommerce storefront with products and custom theme content for store-building workshops.',
    thumb: 'coffee'
  },
  gallery: {
    title: 'Art Gallery',
    copy: 'A visual gallery site created with the Vueo theme for teaching content structure and theme presentation.',
    thumb: 'gallery'
  }
};

document.querySelectorAll('[data-blueprint]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.blueprint-row').forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    const content = blueprintContent[button.dataset.blueprint];
    document.querySelector('#blueprint-title').textContent = content.title;
    document.querySelector('#blueprint-copy').textContent = content.copy;
    const thumb = document.querySelector('.thumb');
    thumb.className = `thumb ${content.thumb}`;
  });
});

document.querySelectorAll('[data-manager]').forEach((button) => {
  button.addEventListener('click', () => {
    const key = button.dataset.manager;
    document.querySelectorAll('[data-manager]').forEach((item) => item.classList.remove('active'));
    document.querySelectorAll(`[data-manager="${key}"]`).forEach((item) => item.classList.add('active'));
    document.querySelectorAll('.manager-tab').forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.managerPanel === key);
    });
  });
});

document.querySelectorAll('[data-jump]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.querySelector(`#${button.dataset.jump}`);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
