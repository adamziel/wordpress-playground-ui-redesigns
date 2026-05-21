const detailContent = {
  vanilla: {
    title: 'Vanilla WordPress',
    body: 'Starts a fresh WordPress Playground immediately with the selected runtime settings.',
    fields: ['Input', 'No extra form fields. Uses WordPress latest, PHP 8.3, English, network access on.'],
    consequence: 'Creates a temporary unsaved site until it is saved in browser storage or to a local directory.',
    primary: 'Start fresh',
    secondary: 'Review settings'
  },
  'wordpress-pr': {
    title: 'Preview a WordPress PR',
    body: 'Core PR starts require a WordPress pull request number or full pull request URL.',
    fields: ['Required input', 'PR NUMBER OR URL, for example 60428 or https://github.com/WordPress/wordpress-develop/pull/60428'],
    consequence: 'Boots a temporary Playground from the selected Core patch. Unsaved state is visible before reset or save.',
    primary: 'Preview PR',
    secondary: 'Cancel'
  },
  'gutenberg-pr': {
    title: 'Preview a Gutenberg PR or Branch',
    body: 'Gutenberg starts accept a PR number, pull request URL, or branch name.',
    fields: ['Required input', 'PR NUMBER, URL, OR A BRANCH NAME. Branch try/block-bindings-ui is selected in the card.'],
    consequence: 'Adds the Gutenberg plugin build into the Playground and keeps the route distinct from Core PR preview.',
    primary: 'Preview Gutenberg',
    secondary: 'Cancel'
  },
  github: {
    title: 'Import from GitHub',
    body: 'Imports plugins, themes, or wp-content directories from public GitHub repositories.',
    fields: ['Account step', 'Connect GitHub account. The access token is not stored and the user must reconnect after refresh.'],
    consequence: 'The import source is authenticated separately from .zip upload and Blueprint URL execution.',
    primary: 'Connect account',
    secondary: 'Learn constraints'
  },
  'blueprint-url': {
    title: 'Run Blueprint from URL',
    body: 'Runs a remote blueprint.json file by URL.',
    fields: ['Required input', 'BLUEPRINT URL, for example https://example.com/blueprint.json'],
    consequence: 'The current site can be changed by the Blueprint steps, so the run action remains explicit.',
    primary: 'Run Blueprint',
    secondary: 'Inspect URL'
  },
  zip: {
    title: 'Import .zip',
    body: 'Opens the native file chooser for a WordPress Playground export archive.',
    fields: ['File chooser', 'Accepts .zip archives. The current Playground is replaced after confirmation.'],
    consequence: 'This action can overwrite the current site and is shown with a destructive warning at the moment of action.',
    primary: 'Choose .zip',
    secondary: 'Cancel'
  },
  gallery: {
    title: 'Blueprint catalog',
    body: 'Browse the current Blueprint gallery with category filters, search, selected detail, inspect, and run actions.',
    fields: ['Catalog density', '43 blueprints total. Featured shortcuts are pinned first and the grid shows matching catalog cards.'],
    consequence: 'Running a gallery Blueprint starts from its recipe rather than a PR, GitHub repository, or local archive.',
    primary: 'Run selected',
    secondary: 'Inspect JSON'
  },
  'save-browser': {
    title: 'Save in this browser',
    body: 'Copies the Playground into browser storage and creates a saved Playground entry with a slug.',
    fields: ['Progress', 'Saving 3028 / 3751 files. Result: /research-browser/ in this browser.'],
    consequence: 'The shell title changes from Unsaved Playground to Saved Playground after the browser copy finishes.',
    primary: 'Save to browser',
    secondary: 'Cancel'
  },
  'save-local': {
    title: 'Save to a local directory',
    body: 'Prompts for a local directory handle and writes the Playground files to that destination.',
    fields: ['Directory state', 'No directory selected yet. The destination is separate from browser-backed storage.'],
    consequence: 'The site becomes backed by the chosen directory rather than the saved-browser list.',
    primary: 'Choose directory',
    secondary: 'Cancel'
  },
  'saved-sites': {
    title: 'Saved Playgrounds',
    body: 'Shows temporary and browser-backed Playgrounds together while preserving their different consequences.',
    fields: ['Actions', 'Research Browser Playground supports Rename and Delete. Unsaved Playground supports Save.'],
    consequence: 'Deleting a saved Playground removes the browser-backed site; deleting is not presented as a normal navigation action.',
    primary: 'Open selected',
    secondary: 'Rename'
  },
  rename: {
    title: 'Rename Playground',
    body: 'Renames the saved browser-backed Playground identity without changing the WordPress site contents.',
    fields: ['New name', 'Research Browser Playground Draft'],
    consequence: 'The saved list and Site Manager header update together so the saved identity stays visible.',
    primary: 'Apply rename',
    secondary: 'Cancel'
  },
  delete: {
    title: 'Delete Playground',
    body: 'Deletes the saved browser-backed Playground entry.',
    fields: ['Confirmation', 'Research Browser Playground will be removed from saved Playgrounds. The active unsaved session remains visible only if it is still running.'],
    consequence: 'The destructive outcome is shown at the moment of action, not hidden behind a generic overflow menu.',
    primary: 'Delete saved site',
    secondary: 'Cancel'
  },
  reset: {
    title: 'Apply Settings & Reset Playground',
    body: 'Applies WordPress, PHP, language, network, and multisite settings to a new boot.',
    fields: ['Unsaved warning', 'The current temporary WordPress site is discarded. Save first to preserve it.'],
    consequence: 'This is destructive for unsaved Playgrounds and uses different copy from Save & Reload on stored sites.',
    primary: 'Reset Playground',
    secondary: 'Save first'
  },
  'saved-reload': {
    title: 'Save & Reload saved site',
    body: 'Stored Playgrounds expose limited configuration options and reload after saving supported changes.',
    fields: ['Saved behavior', 'Configuration is limited for browser-backed Playgrounds. PHP can be reloaded; older Core selection is disabled.'],
    consequence: 'This avoids presenting stored and unsaved settings as the same operation.',
    primary: 'Save & Reload',
    secondary: 'Review limits'
  },
  'wp-admin': {
    title: 'WP Admin shortcut',
    body: 'Opens /wp-admin/ inside the narrow embedded preview without leaving Site Manager.',
    fields: ['Path result', '/wp-admin/'],
    consequence: 'The path bar remains part of the Playground shell and the manager surface stays primary.',
    primary: 'Open admin',
    secondary: 'Homepage'
  },
  homepage: {
    title: 'Homepage shortcut',
    body: 'Returns the embedded site preview to the active home route.',
    fields: ['Path result', '/hello-from-playground/'],
    consequence: 'Preview navigation is visible but subordinate to the manager tools.',
    primary: 'Open homepage',
    secondary: 'Refresh'
  },
  'export-actions': {
    title: 'Additional actions',
    body: 'Site Manager exposes export paths from the same workbench.',
    fields: ['Available actions', 'Export to GitHub and Download as .zip.'],
    consequence: 'Exports operate on the current active Playground and are separate from import routes.',
    primary: 'Download .zip',
    secondary: 'Export to GitHub'
  },
  'export-github': {
    title: 'Export to GitHub',
    body: 'Exports the current Playground bundle to a GitHub destination after account authorization.',
    fields: ['Destination', 'GitHub repository flow.'],
    consequence: 'This is an export action, not the From GitHub import route.',
    primary: 'Export',
    secondary: 'Cancel'
  },
  'download-zip': {
    title: 'Download as .zip',
    body: 'Downloads the active Playground as a portable .zip archive.',
    fields: ['Archive', 'Includes WordPress files, content, database, and Blueprint bundle where available.'],
    consequence: 'The downloaded .zip can later be imported and will replace the current site after confirmation.',
    primary: 'Download',
    secondary: 'Cancel'
  },
  'db-download': {
    title: 'Download database.sqlite',
    body: 'Downloads the SQLite database backing the current WordPress site.',
    fields: ['Path', '/wordpress/wp-content/database/.ht.sqlite - 452 KB'],
    consequence: 'Database download does not export the full Playground; use Download as .zip for the complete site.',
    primary: 'Download database',
    secondary: 'Open Adminer'
  },
  adminer: {
    title: 'Open Adminer',
    body: 'Opens the current SQLite-backed database in Adminer.',
    fields: ['Driver', 'MySQL emulation backed by SQLite.'],
    consequence: 'Adminer is an inspection tool; it does not replace the export flow.',
    primary: 'Open Adminer',
    secondary: 'Download database'
  },
  phpmyadmin: {
    title: 'Open phpMyAdmin',
    body: 'Opens phpMyAdmin for the emulated MySQL database.',
    fields: ['Database', 'SQLite-backed MySQL emulation.'],
    consequence: 'The early-access database warning stays visible in the Database tab.',
    primary: 'Open phpMyAdmin',
    secondary: 'Cancel'
  },
  'new-file': {
    title: 'Create new file',
    body: 'Adds a file under the selected /wordpress directory in the browser file system.',
    fields: ['Selected folder', '/wordpress'],
    consequence: 'File changes affect the active Playground immediately and can be persisted through save or export.',
    primary: 'Create file',
    secondary: 'Cancel'
  },
  'new-folder': {
    title: 'Create new folder',
    body: 'Adds a folder under the selected /wordpress directory.',
    fields: ['Selected folder', '/wordpress'],
    consequence: 'Folders are part of the active browser file system and can be bundled in .zip export.',
    primary: 'Create folder',
    secondary: 'Cancel'
  },
  'browse-files': {
    title: 'Browse files',
    body: 'Opens the native file picker to import files into the current Playground file browser.',
    fields: ['Import target', 'Selected directory /wordpress.'],
    consequence: 'Imported files modify the current site and are distinct from full .zip site import.',
    primary: 'Browse files',
    secondary: 'Cancel'
  },
  'upload-files': {
    title: 'Upload files',
    body: 'Uploads files into the selected WordPress directory in the active Playground file browser.',
    fields: ['Upload target', '/wordpress, with wp-config.php currently open in the editor.'],
    consequence: 'This modifies the active file system only; use browser save, local directory save, or export to persist the result.',
    primary: 'Upload files',
    secondary: 'Cancel'
  },
  'file-save': {
    title: 'Save file',
    body: 'Writes the open editor contents to /wordpress/wp-config.php.',
    fields: ['Open file', '/wordpress/wp-config.php'],
    consequence: 'The active Playground changes immediately; browser or local save persists the file system later.',
    primary: 'Save file',
    secondary: 'Discard'
  },
  'new-blueprint-file': {
    title: 'Create Blueprint file',
    body: 'Adds a file to the current Blueprint bundle tree.',
    fields: ['Bundle target', '/blueprint.json workspace'],
    consequence: 'The file becomes part of the downloadable Blueprint bundle, not the WordPress file browser tree.',
    primary: 'Create file',
    secondary: 'Cancel'
  },
  'new-blueprint-folder': {
    title: 'Create Blueprint folder',
    body: 'Adds a folder for Blueprint assets or support files.',
    fields: ['Bundle target', 'Blueprint file bundle'],
    consequence: 'Folder contents are included when the bundle is downloaded or run.',
    primary: 'Create folder',
    secondary: 'Cancel'
  },
  'upload-blueprint': {
    title: 'Upload Blueprint files',
    body: 'Adds local files into the Blueprint bundle.',
    fields: ['Upload target', 'Current Blueprint bundle, separate from full .zip site import.'],
    consequence: 'Uploaded files can be referenced by blueprint.json steps and included in Download bundle.',
    primary: 'Upload files',
    secondary: 'Cancel'
  },
  'browse-blueprint-files': {
    title: 'Browse Blueprint files',
    body: 'Opens a native file picker for selecting Blueprint bundle files.',
    fields: ['Picker mode', 'Files are added to the Blueprint bundle workspace.'],
    consequence: 'This is a bundle authoring operation, not a replacement of the current WordPress site.',
    primary: 'Browse files',
    secondary: 'Cancel'
  },
  'copy-blueprint': {
    title: 'Copy link to blueprint',
    body: 'Copies a shareable URL for the current blueprint.json.',
    fields: ['Copied target', 'playground.wordpress.net/?blueprint-url=...'],
    consequence: 'The link starts from the Blueprint recipe; it does not save the current browser-backed site.',
    primary: 'Copy link',
    secondary: 'Inspect JSON'
  },
  'download-blueprint': {
    title: 'Download Blueprint bundle',
    body: 'Downloads the current Blueprint bundle files.',
    fields: ['Bundle', 'blueprint.json plus uploaded bundle files.'],
    consequence: 'This is different from Download as .zip, which exports the entire active Playground site.',
    primary: 'Download bundle',
    secondary: 'Cancel'
  },
  'run-current-blueprint': {
    title: 'Run current Blueprint',
    body: 'Runs the open blueprint.json against the active Playground context.',
    fields: ['Open file', '/blueprint.json - valid JSON'],
    consequence: 'The run can change the current site, so it is paired with save and export consequences in the same view.',
    primary: 'Run Blueprint',
    secondary: 'Inspect steps'
  }
};

const blueprints = [
  ['Art Gallery', 'An art gallery created with the Vueo theme.', ['featured', 'website', 'personal'], '#d5b16a'],
  ['Coffee Shop', 'A stylish WooCommerce storefront with a custom theme and products.', ['featured', 'woocommerce', 'themes'], '#9b63c8'],
  ['Feed Reader with the Friends Plugin', 'Read web feeds in Playground using the Friends plugin.', ['featured', 'content'], '#b9d2ff'],
  ['Gaming News', 'A gaming news site created with the Spiel theme.', ['featured', 'news', 'website'], '#d6503f'],
  ['Non-profit Organization', 'A nonprofit landing site created with the Koinonia theme.', ['featured', 'website'], '#b67838'],
  ['Personal Blog', 'A personal blog created with the Substrata theme.', ['personal', 'themes'], '#8b2550'],
  ['Block Theme Starter', 'A compact starter for testing theme.json and template parts.', ['gutenberg', 'themes'], '#4f73d9'],
  ['Woo Store Sample Data', 'A WooCommerce catalog with products, cart, checkout, and orders.', ['woocommerce', 'content'], '#805ad5'],
  ['Pattern Directory Test', 'A content-heavy site for testing patterns and synced layouts.', ['gutenberg', 'experiments'], '#319795'],
  ['Classic Theme Fixture', 'A small site for comparing classic theme behavior.', ['themes', 'website'], '#718096'],
  ['Newsroom Blocks', 'A posts-first editorial setup for list and archive testing.', ['news', 'content'], '#dd6b20'],
  ['Plugin Smoke Test', 'A minimal site for plugin activation and compatibility checks.', ['experiments'], '#38a169']
];

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');
const drawerTitle = document.getElementById('drawerTitle');
const drawerBody = document.getElementById('drawerBody');
const drawerFields = document.getElementById('drawerFields');
const drawerConsequence = document.getElementById('drawerConsequence');
const drawerPrimary = document.getElementById('drawerPrimary');
const drawerSecondary = document.getElementById('drawerSecondary');
const toast = document.getElementById('toast');
const gallery = document.getElementById('blueprintGallery');
const categoryFilter = document.getElementById('categoryFilter');
const catalogSearch = document.getElementById('catalogSearch');
const galleryCount = document.getElementById('galleryCount');

function setDetail(key) {
  const detail = detailContent[key] || detailContent.vanilla;
  drawerTitle.textContent = detail.title;
  drawerBody.textContent = detail.body;
  drawerFields.innerHTML = `<b>${detail.fields[0]}</b><span>${detail.fields[1]}</span>`;
  drawerConsequence.textContent = detail.consequence;
  drawerPrimary.textContent = detail.primary;
  drawerSecondary.textContent = detail.secondary;

  document.querySelectorAll('.work-card').forEach((card) => {
    card.classList.toggle('selected', card.dataset.detail === key);
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('visible'), 2600);
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => item.classList.remove('active'));
    panels.forEach((panel) => panel.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`panel-${tab.dataset.tab}`).classList.add('active');
    setDetail(tab.dataset.tab === 'blueprint' ? 'gallery' : tab.dataset.tab === 'database' ? 'db-download' : tab.dataset.tab === 'logs' ? 'export-actions' : tab.dataset.tab === 'files' ? 'file-save' : 'reset');
  });
});

document.addEventListener('click', (event) => {
  const detailTarget = event.target.closest('[data-detail]');
  if (detailTarget) {
    setDetail(detailTarget.dataset.detail);
  }

  const saveTarget = event.target.closest('[data-save]');
  if (saveTarget) {
    const local = saveTarget.dataset.save === 'local';
    document.getElementById('shellStatus').textContent = local ? 'Local Directory Playground' : 'Saved Playground';
    document.getElementById('shellStatus').className = 'status status-ok';
    document.getElementById('saveState').textContent = local ? 'Saved to ~/Sites/research-browser' : 'Saved in this browser a moment ago';
    showToast(local ? 'Directory selected. Playground files are now backed by local storage.' : 'Saved 3751 files. Slug created at /research-browser/.');
    setDetail(local ? 'save-local' : 'save-browser');
  }

  const toastTarget = event.target.closest('[data-toast]');
  if (toastTarget) {
    showToast(toastTarget.dataset.toast);
  }
});

document.getElementById('renameSite').addEventListener('click', () => {
  document.getElementById('manager-title').textContent = 'Research Browser Playground Draft';
  document.getElementById('savedName').textContent = 'Research Browser Playground Draft';
  showToast('Saved Playground renamed to Research Browser Playground Draft.');
});

document.getElementById('deleteSite').addEventListener('click', () => {
  const row = document.getElementById('savedResearch');
  row.style.opacity = '0.48';
  row.querySelector('small').textContent = 'Marked for deletion after confirmation';
  showToast('Delete confirmation staged in the detail drawer.');
});

function renderGallery() {
  const category = categoryFilter.value;
  const query = catalogSearch.value.trim().toLowerCase();
  const filtered = blueprints.filter(([name, description, tags]) => {
    const categoryMatch = category === 'all' || tags.includes(category);
    const queryMatch = !query || name.toLowerCase().includes(query) || description.toLowerCase().includes(query) || tags.join(' ').includes(query);
    return categoryMatch && queryMatch;
  });

  galleryCount.textContent = `Showing ${filtered.length} of 43 blueprints`;
  gallery.innerHTML = filtered.map(([name, description, tags, color], index) => `
    <article class="blueprint-card" data-detail="gallery" style="--thumb:${color}">
      <div class="thumb" aria-hidden="true"></div>
      <div class="blueprint-card-body">
        <b>${name}</b>
        <p>${description}</p>
        <div class="chips">${tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
        <button class="${index === 0 ? 'primary' : 'outline'} small" type="button" data-detail="gallery">${index === 0 ? 'Run selected' : 'Inspect'}</button>
      </div>
    </article>
  `).join('');
}

categoryFilter.addEventListener('change', renderGallery);
catalogSearch.addEventListener('input', renderGallery);

drawerPrimary.addEventListener('click', () => showToast(`${drawerPrimary.textContent} staged for this wireframe.`));
drawerSecondary.addEventListener('click', () => showToast(`${drawerSecondary.textContent} opened in the detail drawer.`));

renderGallery();
setDetail('vanilla');
