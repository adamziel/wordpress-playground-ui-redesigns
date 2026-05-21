const sourceData = {
  vanilla: {
    title: 'Vanilla WordPress',
    description: 'Start a clean WordPress install immediately. The current unsaved site will be replaced unless it is saved first.',
    label: 'Packet name',
    value: 'Blueprint author scratchpad',
    constraint: 'No remote account or file input is required.',
    primary: 'Start Playground'
  },
  'wordpress-pr': {
    title: 'Preview a WordPress PR',
    description: 'Preview a WordPress core pull request in an isolated Playground.',
    label: 'PR NUMBER OR URL',
    value: 'https://github.com/WordPress/wordpress-develop/pull/7392',
    constraint: 'Core PRs only. Enter a PR number or full pull request URL before Preview.',
    primary: 'Preview'
  },
  'gutenberg-pr': {
    title: 'Preview a Gutenberg PR or Branch',
    description: 'Load Gutenberg from a pull request, pull request URL, or branch name.',
    label: 'PR NUMBER, URL, OR A BRANCH NAME',
    value: 'trunk',
    constraint: 'Accepts Gutenberg PR numbers, GitHub URLs, or branch names. Useful for editor and block testing.',
    primary: 'Preview'
  },
  github: {
    title: 'Import from GitHub',
    description: 'Import public plugins, themes, or wp-content directories from GitHub after account connection.',
    label: 'Repository path',
    value: 'wordpress/gutenberg',
    constraint: 'Connect GitHub first. The access token is not stored and re-authentication is required after refresh.',
    primary: 'Connect GitHub'
  },
  'blueprint-url': {
    title: 'Run Blueprint from URL',
    description: 'Run a hosted blueprint.json and open the configured landing page when setup completes.',
    label: 'BLUEPRINT URL',
    value: 'https://example.com/blueprint.json',
    constraint: 'Remote URL must point to a valid Blueprint file. Running can replace the current unsaved site.',
    primary: 'Run Blueprint'
  },
  zip: {
    title: 'Import .zip',
    description: 'Restore a Playground bundle from a local .zip using the native file chooser.',
    label: 'Selected file',
    value: 'No file selected',
    constraint: 'Importing a .zip can replace the active temporary site. Save first if this site should survive.',
    primary: 'Choose .zip'
  }
};

const blueprintData = {
  friends: {
    preview: 'RSS',
    title: 'Feed Reader with the Friends Plugin',
    desc: 'Read feeds from the web in Playground and test the Friends plugin setup with social web tags.',
    tags: ['rss', 'social web', 'plugin']
  },
  coffee: {
    preview: 'SHOP',
    title: 'Coffee Shop',
    desc: 'A WooCommerce storefront with custom theme, products, checkout, and cart paths ready to inspect.',
    tags: ['WooCommerce', 'store', 'theme']
  },
  gallery: {
    preview: 'ART',
    title: 'Art Gallery',
    desc: 'A gallery site built with the Vueo theme for testing image-heavy content and navigation.',
    tags: ['website', 'personal', 'Vueo']
  },
  gaming: {
    preview: 'NEWS',
    title: 'Gaming News',
    desc: 'A news site using the Spiel theme with article lists, media, and category navigation.',
    tags: ['website', 'news', 'Spiel']
  },
  nonprofit: {
    preview: 'CARE',
    title: 'Non-profit Organization',
    desc: 'A Koinonia themed organization site with donation-style content and mission pages.',
    tags: ['website', 'organization', 'content']
  }
};

document.querySelectorAll('.source-card').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.source-card').forEach((card) => card.classList.remove('selected'));
    button.classList.add('selected');

    const data = sourceData[button.dataset.source];
    document.getElementById('route-title').textContent = data.title;
    document.getElementById('route-description').textContent = data.description;
    document.getElementById('route-label').firstChild.textContent = data.label;
    document.getElementById('route-input').value = data.value;
    document.getElementById('route-constraint').textContent = data.constraint;
    document.getElementById('route-primary').textContent = data.primary;
  });
});

document.querySelectorAll('[data-storage]').forEach((radio) => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.storage-option').forEach((option) => option.classList.remove('selected'));
    radio.closest('.storage-option').classList.add('selected');

    const local = radio.dataset.storage === 'local';
    document.getElementById('save-progress-label').textContent = local
      ? 'Requesting directory permission, then copying 3751 files'
      : 'Saving 3028 / 3751 files';
    document.getElementById('save-result').innerHTML = local
      ? 'Result: local directory linked. Use <code>Save & Reload</code> after file changes.'
      : 'Result: saved browser site at <code>/research-browser-playground/</code>.';
  });
});

document.querySelectorAll('.catalog-row[data-blueprint], .featured-shortcuts button[data-blueprint]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.catalog-row').forEach((row) => row.classList.remove('selected'));
    const matchingRow = document.querySelector(`.catalog-row[data-blueprint="${button.dataset.blueprint}"]`);
    if (matchingRow) {
      matchingRow.classList.add('selected');
    }

    const data = blueprintData[button.dataset.blueprint];
    document.getElementById('blueprint-preview').textContent = data.preview;
    document.getElementById('blueprint-title').textContent = data.title;
    document.getElementById('blueprint-desc').textContent = data.desc;
    document.getElementById('blueprint-tags').innerHTML = data.tags.map((tag) => `<span>${tag}</span>`).join('');
  });
});

document.querySelectorAll('.tabs button').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tabs button').forEach((button) => button.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
  });
});

document.querySelectorAll('[data-open]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.open);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
