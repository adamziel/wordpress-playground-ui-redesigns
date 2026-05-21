const dialog = document.querySelector('#flowDialog');
const dialogContent = document.querySelector('#dialogContent');

const blueprintCards = [
  ['Art Gallery', 'An art gallery created with the Vueo theme.', ['Website', 'Personal'], ''],
  ['Coffee Shop', 'A WooCommerce storefront with custom products and content.', ['WooCommerce', 'Store'], 'coffee'],
  ['Feed Reader with the Friends Plugin', 'Read feeds from the web in Playground.', ['Content', 'Social web'], ''],
  ['Gaming News', 'A gaming news site created with the Spiel theme.', ['Website', 'News'], 'news'],
  ['Non-profit Organization', 'A donation-focused organization site.', ['Website', 'Organization'], 'org'],
  ['Personal Blog', 'A journal-style site created with the Substrata theme.', ['Personal', 'Content'], 'coffee']
];

const modalTemplates = {
  save: `
    <h2 class="dialog-title">Save Playground</h2>
    <p class="dialog-copy">Temporary Playgrounds are lost on refresh or close. Save this one in browser storage or choose a local directory.</p>
    <label class="dialog-field"><span>Playground name</span><input value="Research Browser Playground"></label>
    <div class="dialog-grid">
      <button class="source-card"><strong>Save in this browser</strong><span>Fast browser-backed storage</span></button>
      <button class="source-card"><strong>Save to a local directory</strong><span>Pick a folder on this device</span></button>
      <div class="save-progress"><div class="progress-copy"><span>Saving files</span><strong>3028 / 3751</strong></div><div class="progress-track"><span></span></div></div>
    </div>
    <div class="dialog-actions"><button value="cancel">Cancel</button><button class="primary" value="default">Save</button></div>
  `,
  'wp-pr': `
    <h2 class="dialog-title">Preview a WordPress PR</h2>
    <p class="dialog-copy">Start a Playground from a WordPress core pull request number or URL.</p>
    <label class="dialog-field"><span>PR number or URL</span><input placeholder="https://github.com/WordPress/wordpress-develop/pull/0000"></label>
    <div class="dialog-actions"><button value="cancel">Cancel</button><button class="primary" value="default">Preview</button></div>
  `,
  'gutenberg-pr': `
    <h2 class="dialog-title">Preview a Gutenberg PR or Branch</h2>
    <p class="dialog-copy">Use a Gutenberg PR number, pull request URL, or branch name.</p>
    <label class="dialog-field"><span>PR number, URL, or branch</span><input placeholder="trunk, fix/editor-flow, or PR URL"></label>
    <div class="dialog-actions"><button value="cancel">Cancel</button><button class="primary" value="default">Preview</button></div>
  `,
  github: `
    <h2 class="dialog-title">Import from GitHub</h2>
    <p class="dialog-copy">Import public plugins, themes, or wp-content directories. Connecting GitHub provides an access token for this session only; re-authentication is required after refresh.</p>
    <div class="dialog-actions"><button value="cancel">Cancel</button><button class="primary" value="default">Connect GitHub account</button></div>
  `,
  'blueprint-url': `
    <h2 class="dialog-title">Run Blueprint from URL</h2>
    <p class="dialog-copy">Paste a URL to a blueprint JSON file and run it in this Playground.</p>
    <label class="dialog-field"><span>Blueprint URL</span><input placeholder="https://example.com/blueprint.json"></label>
    <div class="dialog-actions"><button value="cancel">Cancel</button><button class="primary" value="default">Run Blueprint</button></div>
  `,
  manage: `
    <h2 class="dialog-title">Saved Playground actions</h2>
    <p class="dialog-copy">Manage the browser-backed Playground entry without affecting unrelated Playgrounds.</p>
    <label class="dialog-field"><span>Rename Playground</span><input value="Research Browser Playground"></label>
    <div class="dialog-actions"><button value="cancel">Cancel</button><button value="default">Delete</button><button class="primary" value="default">Rename</button></div>
  `,
  actions: `
    <h2 class="dialog-title">Additional actions</h2>
    <p class="dialog-copy">Export the active Playground to GitHub or download a complete .zip bundle.</p>
    <div class="dialog-grid">
      <button class="source-card"><strong>Export to GitHub</strong><span>Create a repository-ready export</span></button>
      <button class="source-card"><strong>Download as .zip</strong><span>Save files and database locally</span></button>
      <button class="source-card"><strong>Import .zip</strong><span>Replace current files from upload</span></button>
    </div>
  `
};

function renderGallery(active = 'All') {
  const filters = ['All', 'Featured', 'Website', 'Personal', 'Content', 'Themes', 'Gutenberg', 'Experiments', 'WooCommerce', 'News'];
  const visibleCards = active === 'All'
    ? blueprintCards
    : blueprintCards.filter((card) => card[2].includes(active) || active === 'Featured');

  dialogContent.innerHTML = `
    <h2 class="dialog-title">Blueprint gallery</h2>
    <p class="dialog-copy">Showing ${visibleCards.length} of all 43 blueprints. Filter categories, inspect summaries, and start a selected blueprint.</p>
    <div class="filter-bar">${filters.map((filter) => `<button type="button" class="${filter === active ? 'is-active' : ''}" data-filter="${filter}">${filter}</button>`).join('')}</div>
    <div class="dialog-grid">
      ${visibleCards.map((card) => `
        <article class="blueprint-card">
          <div class="thumb ${card[3]}"></div>
          <div>
            <strong>${card[0]}</strong>
            <p class="dialog-copy">${card[1]}</p>
            <div class="tag-row">${card[2].map((tag) => `<span>${tag}</span>`).join('')}</div>
          </div>
        </article>
      `).join('')}
    </div>
    <div class="dialog-actions"><button value="cancel">Close</button><button class="primary" value="default">Start selected blueprint</button></div>
  `;
}

document.querySelectorAll('[data-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach((tab) => tab.classList.toggle('is-active', tab === button));
    document.querySelectorAll('[data-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.panel === button.dataset.tab));
  });
});

document.addEventListener('click', (event) => {
  const opener = event.target.closest('[data-open]');
  if (!opener) return;
  const key = opener.dataset.open;

  if (key === 'gallery') {
    renderGallery();
  } else {
    dialogContent.innerHTML = modalTemplates[key] || modalTemplates.actions;
  }
  dialog.showModal();
});

document.addEventListener('click', (event) => {
  const filter = event.target.closest('[data-filter]');
  if (!filter) return;
  renderGallery(filter.dataset.filter);
});

document.querySelectorAll('[data-start]').forEach((button) => {
  button.addEventListener('click', () => {
    dialogContent.innerHTML = `
      <h2 class="dialog-title">${button.dataset.start}</h2>
      <p class="dialog-copy">This static wireframe represents the existing start flow trigger for ${button.dataset.start}.</p>
      <div class="dialog-actions"><button value="cancel">Cancel</button><button class="primary" value="default">Start Playground</button></div>
    `;
    dialog.showModal();
  });
});
