const modal = document.querySelector('#modal');
const modalTitle = document.querySelector('#modal-title');
const modalBody = document.querySelector('#modal-body');

const modalContent = {
  save: {
    title: 'Save Playground',
    body: `
      <label>
        Playground name
        <input value="Research Browser Playground">
      </label>
      <div class="destination-grid">
        <button class="route-card is-selected"><strong>Save in this browser</strong><span>Stored in browser storage and available from Saved sites.</span></button>
        <button class="route-card"><strong>Save to a local directory</strong><span>Use the browser directory picker.</span></button>
      </div>
      <div class="progress-line"><span style="width: 61%"></span></div>
      <small>Saving 3028 / 3751 files</small>
    `
  },
  vanilla: {
    title: 'Start Vanilla WordPress',
    body: `
      <p>A fresh logged-in WordPress Playground will be created with the configuration currently selected in the register.</p>
      <div class="mini-table"><span>WordPress</span><strong>latest</strong><span>PHP</span><strong>8.3</strong><span>Language</span><strong>English (United States)</strong></div>
    `
  },
  'wordpress-pr': {
    title: 'Preview a WordPress PR',
    body: `
      <label>
        PR number or URL
        <input placeholder="https://github.com/WordPress/wordpress-develop/pull/0000">
      </label>
      <p>Starts a Playground built from the selected WordPress core pull request.</p>
    `
  },
  'gutenberg-pr': {
    title: 'Preview a Gutenberg PR or Branch',
    body: `
      <label>
        PR number, URL, or branch name
        <input placeholder="trunk, 0000, or GitHub URL">
      </label>
      <p>Starts a Playground with the selected Gutenberg PR or branch installed.</p>
    `
  },
  github: {
    title: 'Import from GitHub',
    body: `
      <p>Import public plugins, themes, or wp-content directories from GitHub. A GitHub account connection is required; the access token is not stored and must be reconnected after refresh.</p>
      <button class="button button-primary">Connect GitHub account</button>
    `
  },
  'blueprint-url': {
    title: 'Run Blueprint from URL',
    body: `
      <label>
        Blueprint URL
        <input placeholder="https://example.com/blueprint.json">
      </label>
      <p>Runs a hosted Playground Blueprint in the current browser session.</p>
    `
  },
  'import-zip': {
    title: 'Import .zip',
    body: `
      <p>The production UI opens the native file chooser for a Playground bundle. This wireframe keeps that action visible beside the other launch routes.</p>
      <button class="button button-primary">Browse for .zip</button>
    `
  }
};

document.querySelectorAll('[data-scroll]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.scroll);
    if (target) {
      target.scrollIntoView({ block: 'start' });
    }
    document.querySelectorAll('.rail-link').forEach((item) => {
      item.classList.toggle('is-active', item.dataset.scroll === button.dataset.scroll);
    });
  });
});

document.querySelectorAll('.manager-tabs button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.manager-tabs button').forEach((item) => item.classList.remove('is-active'));
    document.querySelectorAll('.tool-panel').forEach((panel) => panel.classList.remove('is-active'));
    button.classList.add('is-active');
    document.querySelector(`[data-panel="${button.dataset.tab}"]`)?.classList.add('is-active');
  });
});

document.querySelectorAll('[data-modal]').forEach((button) => {
  button.addEventListener('click', () => openModal(button.dataset.modal));
});

document.querySelectorAll('[data-close-modal]').forEach((button) => {
  button.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

function openModal(type) {
  const content = modalContent[type] || modalContent.save;
  modalTitle.textContent = content.title;
  modalBody.innerHTML = content.body;
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
}
