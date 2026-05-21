const templates = {
  start: 'tpl-start',
  save: 'tpl-save',
  saved: 'tpl-saved',
  gallery: 'tpl-gallery',
  settings: 'tpl-settings',
  files: 'tpl-files',
  blueprint: 'tpl-blueprint',
  database: 'tpl-database',
  logs: 'tpl-logs',
  move: 'tpl-move',
};

const routeDetails = {
  vanilla: {
    title: 'Vanilla WordPress',
    body: 'Starts a fresh Playground immediately with WordPress latest, PHP 8.3, admin login, network access on, and no imported files.',
    input: '',
    action: 'Start fresh Playground',
  },
  wppr: {
    title: 'Preview a WordPress PR',
    body: 'Accepts a WordPress core PR number or a wordpress-develop pull request URL.',
    input: 'PR number or URL',
    value: 'https://github.com/WordPress/wordpress-develop/pull/7821',
    action: 'Preview WordPress PR',
  },
  gutenberg: {
    title: 'Preview a Gutenberg PR or Branch',
    body: 'Accepts a PR number, GitHub URL, or a Gutenberg branch name for editor testing.',
    input: 'PR number, URL, or branch name',
    value: 'trunk',
    action: 'Preview Gutenberg build',
  },
  github: {
    title: 'Import from GitHub',
    body: 'Imports plugins, themes, or wp-content directories from public repositories. The GitHub token is not stored and refresh requires reconnecting.',
    input: 'GitHub account connection',
    value: 'Connect GitHub account to continue',
    action: 'Connect GitHub',
  },
  blueprintUrl: {
    title: 'Run Blueprint from URL',
    body: 'Runs a remote blueprint.json and may replace the current runtime depending on the selected start behavior.',
    input: 'Blueprint URL',
    value: 'https://example.com/workshop/blueprint.json',
    action: 'Run Blueprint',
  },
  zip: {
    title: 'Import .zip',
    body: 'Opens the native file chooser. The selected archive starts a new Playground rather than silently overwriting the current site.',
    input: '',
    action: 'Choose .zip file',
  },
};

const blueprints = [
  { title: 'Art Gallery', desc: 'Vueo theme gallery with sample pages.', category: 'Website Personal Featured', thumb: 'art' },
  { title: 'Coffee Shop', desc: 'WooCommerce storefront with products.', category: 'WooCommerce Website Featured', thumb: 'coffee' },
  { title: 'Feed Reader with the Friends Plugin', desc: 'Feeds and social web testing in Playground.', category: 'Content Experiments Featured', thumb: 'feed' },
  { title: 'Gaming News', desc: 'Spiel theme news layout with posts.', category: 'News Website Featured', thumb: 'game' },
  { title: 'Non-profit Organization', desc: 'Koinonia theme donation site.', category: 'Website Content Featured', thumb: 'nonprofit' },
  { title: 'Personal Blog', desc: 'Substrata personal writing site.', category: 'Personal Website', thumb: 'blog' },
  { title: 'Block Theme Workshop', desc: 'Theme.json and pattern editing sample.', category: 'Themes Gutenberg', thumb: 'theme' },
  { title: 'Editorial News Desk', desc: 'Dense category archive for publishing demos.', category: 'News Content', thumb: 'news' },
  { title: 'Woo Product Lab', desc: 'Product content and checkout test data.', category: 'WooCommerce Experiments', thumb: 'coffee' },
  { title: 'Gutenberg Components', desc: 'Editor experiments and block examples.', category: 'Gutenberg Experiments', thumb: 'theme' },
];

const inspector = document.querySelector('#inspector');
const resultRows = [...document.querySelectorAll('.result-row')];
const resultTitle = document.querySelector('#resultTitle');
const resultCount = document.querySelector('#resultCount');
const searchInput = document.querySelector('#commandSearch');

function renderInspector(key) {
  const templateId = templates[key] || templates.start;
  const template = document.getElementById(templateId);
  inspector.replaceChildren(template.content.cloneNode(true));
  const active = document.querySelector(`.result-row[data-result="${key}"]`);
  resultTitle.textContent = active ? active.querySelector('strong').textContent : 'Command detail';

  if (key === 'start') setupRoutes();
  if (key === 'save') setupSave();
  if (key === 'saved') setupSaved();
  if (key === 'gallery') setupGallery();
  if (key === 'move') setupMove();
}

function setActiveResult(key) {
  resultRows.forEach((row) => row.classList.toggle('active', row.dataset.result === key));
  renderInspector(key);
}

function setupRoutes() {
  const detail = document.querySelector('#routeDetail');
  const routeButtons = [...document.querySelectorAll('.route')];

  function renderRoute(routeKey) {
    const route = routeDetails[routeKey];
    detail.innerHTML = `
      <h4>${route.title}</h4>
      <p class="muted">${route.body}</p>
      ${route.input ? `<label>${route.input}<input value="${route.value || ''}" aria-label="${route.input}"></label>` : ''}
      <div class="action-row"><button>Cancel</button><button class="primary">${route.action}</button></div>
    `;
  }

  routeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      routeButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      renderRoute(button.dataset.route);
    });
  });

  renderRoute('vanilla');
}

function setupSave() {
  const destinations = [...document.querySelectorAll('.destination')];
  const label = document.querySelector('#saveDestinationLabel');
  const text = document.querySelector('#saveProgressText');
  const bar = document.querySelector('#saveProgressBar');
  const name = document.querySelector('#saveName');
  const currentStorage = document.querySelector('#currentStorage');
  const playgroundName = document.querySelector('#playgroundName');

  destinations.forEach((button) => {
    button.addEventListener('click', () => {
      destinations.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const local = button.dataset.destination === 'local';
      label.textContent = local ? 'Local directory selected: choose folder on save' : 'Browser storage selected';
      text.textContent = local ? 'Ready to request directory access' : 'Ready to copy 3,751 files';
      bar.style.width = '0%';
    });
  });

  document.querySelector('#runSave').addEventListener('click', () => {
    const local = document.querySelector('.destination.active').dataset.destination === 'local';
    label.textContent = local ? 'Syncing to selected local directory' : 'Saving in this browser';
    text.textContent = 'Saving 0 / 3,751 files';
    bar.style.width = '8%';

    const checkpoints = [
      [32, 'Saving 1,208 / 3,751 files'],
      [68, 'Saving 2,610 / 3,751 files'],
      [100, local ? 'Saved to local directory and ready to reload' : 'Saved in this browser as a stored Playground'],
    ];

    checkpoints.forEach(([width, message], index) => {
      window.setTimeout(() => {
        bar.style.width = `${width}%`;
        text.textContent = message;
        if (width === 100) {
          currentStorage.textContent = local ? 'Saved to local directory a moment ago' : 'Saved in this browser a moment ago';
          playgroundName.textContent = name.value || 'Saved Playground';
          document.querySelector('.status-button').textContent = 'Saved';
          document.querySelector('.status-button').classList.remove('warning');
        }
      }, 450 * (index + 1));
    });
  });
}

function setupSaved() {
  const result = document.querySelector('#savedActionResult');
  const name = document.querySelector('#savedName');
  const row = document.querySelector('#savedResearch');

  document.querySelector('#renameSaved').addEventListener('click', () => {
    name.textContent = 'Renamed Workshop Playground';
    document.querySelector('#playgroundName').textContent = 'Renamed Workshop Playground';
    result.textContent = 'Rename applied. The saved browser-backed Playground keeps its created date and storage location.';
  });

  document.querySelector('#deleteSaved').addEventListener('click', () => {
    row.style.opacity = '0.48';
    result.textContent = 'Delete confirmed for the saved copy. The current unsaved runtime remains open until replaced or saved.';
  });
}

function setupGallery() {
  const list = document.querySelector('#blueprintCards');
  const search = document.querySelector('#gallerySearch');
  const categories = [...document.querySelectorAll('.category-row button')];
  let category = 'All';

  function renderCards() {
    const query = search.value.trim().toLowerCase();
    const filtered = blueprints.filter((item) => {
      const inCategory = category === 'All' || item.category.includes(category);
      const inSearch = !query || `${item.title} ${item.desc} ${item.category}`.toLowerCase().includes(query);
      return inCategory && inSearch;
    });

    list.innerHTML = filtered.map((item, index) => `
      <button class="blueprint-card ${index === 0 ? 'selected' : ''}" data-title="${item.title}" data-desc="${item.desc}">
        <span class="thumb ${item.thumb}" aria-hidden="true"></span>
        <strong>${item.title}</strong>
        <span>${item.desc}</span>
      </button>
    `).join('');

    if (!filtered.length) {
      list.innerHTML = '<div class="inline-result">No matching Blueprints in this filter. Clear search or switch categories.</div>';
      return;
    }

    [...document.querySelectorAll('.blueprint-card')].forEach((card) => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.blueprint-card').forEach((item) => item.classList.remove('selected'));
        card.classList.add('selected');
        document.querySelector('#selectedBlueprint').textContent = card.dataset.title;
        document.querySelector('#selectedBlueprintDesc').textContent = card.dataset.desc;
      });
    });

    document.querySelector('#selectedBlueprint').textContent = filtered[0].title;
    document.querySelector('#selectedBlueprintDesc').textContent = filtered[0].desc;
  }

  search.addEventListener('input', renderCards);
  categories.forEach((button) => {
    button.addEventListener('click', () => {
      categories.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      category = button.dataset.category;
      renderCards();
    });
  });

  renderCards();
}

function setupMove() {
  document.querySelector('#zipImport').addEventListener('click', () => {
    document.querySelector('#moveResult').textContent = 'Native file chooser would open now. Selected .zip starts a new Playground and keeps the current runtime visible until launch is confirmed.';
  });
}

document.querySelectorAll('[data-open-result]').forEach((button) => {
  button.addEventListener('click', () => setActiveResult(button.dataset.openResult));
});

resultRows.forEach((row) => {
  row.addEventListener('click', () => setActiveResult(row.dataset.result));
});

document.querySelectorAll('.stack-row').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.stack-row').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    document.querySelectorAll('.tool-panel').forEach((panel) => panel.classList.remove('active'));
    document.querySelector(`#${button.dataset.tool}-panel`).classList.add('active');
    document.querySelector('#editorTitle').textContent = button.querySelector('span').textContent;
    if (templates[button.dataset.tool]) setActiveResult(button.dataset.tool);
  });
});

document.querySelectorAll('.command-tabs button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.command-tabs button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    filterResults();
  });
});

searchInput.addEventListener('input', filterResults);

function filterResults() {
  const activeFilter = document.querySelector('.command-tabs button.active').dataset.filter;
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;

  resultRows.forEach((row) => {
    const matchesFilter = activeFilter === 'all' || row.dataset.group === activeFilter;
    const matchesSearch = !query || row.dataset.search.includes(query);
    const show = matchesFilter && matchesSearch;
    row.hidden = !show;
    if (show) visible += 1;
  });

  resultCount.textContent = `${visible} command${visible === 1 ? '' : 's'}`;

  const active = document.querySelector('.result-row.active');
  if (!active || active.hidden) {
    const next = resultRows.find((row) => !row.hidden);
    if (next) setActiveResult(next.dataset.result);
  }
}

renderInspector('start');
