const filters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.blueprint-card');
const search = document.querySelector('#blueprint-search');

function applyGalleryFilter() {
  const active = document.querySelector('[data-filter].active')?.dataset.filter || 'all';
  const query = (search?.value || '').trim().toLowerCase();

  cards.forEach((card) => {
    const tags = card.dataset.tags || '';
    const text = card.textContent.toLowerCase();
    const matchesFilter = active === 'all' || tags.includes(active);
    const matchesSearch = !query || text.includes(query);
    card.classList.toggle('is-hidden', !(matchesFilter && matchesSearch));
  });
}

filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    applyGalleryFilter();
  });
});

search?.addEventListener('input', applyGalleryFilter);

const tabButtons = document.querySelectorAll('[data-tab]');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    tabButtons.forEach((item) => item.classList.remove('active'));
    tabPanels.forEach((panel) => panel.classList.remove('active'));
    button.classList.add('active');
    document.querySelector(`#tab-${button.dataset.tab}`)?.classList.add('active');
  });
});

const dialogs = {
  vanilla: {
    title: 'Start Vanilla WordPress',
    copy: 'Start a fresh Playground with the selected WordPress and PHP versions.',
    input: 'WordPress latest, PHP 8.3'
  },
  'wp-pr': {
    title: 'Preview a WordPress PR',
    copy: 'Enter a WordPress core PR number or URL to create a preview Playground.',
    input: 'PR number or URL'
  },
  'gutenberg-pr': {
    title: 'Preview a Gutenberg PR or Branch',
    copy: 'Enter a Gutenberg PR number, URL, or branch name.',
    input: 'PR number, URL, or branch'
  },
  github: {
    title: 'Import from GitHub',
    copy: 'Connect GitHub to import public plugins, themes, or wp-content directories. Access tokens are not stored.',
    input: 'github.com/owner/repository'
  },
  zip: {
    title: 'Import .zip',
    copy: 'Open the native file chooser to import a Playground zip export or bundle.',
    input: 'No file selected'
  }
};

const backdrop = document.querySelector('.dialog-backdrop');
const dialogTitle = document.querySelector('#dialog-title');
const dialogCopy = document.querySelector('#dialog-copy');
const dialogInput = document.querySelector('#dialog-input');

document.querySelectorAll('[data-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    const data = dialogs[button.dataset.dialog];
    dialogTitle.textContent = data.title;
    dialogCopy.textContent = data.copy;
    dialogInput.value = data.input;
    backdrop.hidden = false;
  });
});

document.querySelectorAll('.dialog-close, .dialog-close-secondary').forEach((button) => {
  button.addEventListener('click', () => {
    backdrop.hidden = true;
  });
});

backdrop?.addEventListener('click', (event) => {
  if (event.target === backdrop) {
    backdrop.hidden = true;
  }
});
