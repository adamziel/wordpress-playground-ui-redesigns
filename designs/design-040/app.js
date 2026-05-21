const details = {
	vanilla: {
		kicker: 'Start',
		title: 'New WordPress',
		copy: 'Start a fresh Playground immediately. This replaces the current temporary site unless you save it first.',
		body: `
			<div class="safe-message">
				<strong>Before you start</strong>
				<span>This Playground is unsaved. Save it in this browser or to a local directory if you need to keep the current state.</span>
			</div>
			<button class="primary-action" type="button">Start new WordPress</button>
		`
	},
	'wordpress-pr': {
		kicker: 'Start',
		title: 'Preview a WordPress PR',
		copy: 'Use a core pull request number or URL to start a Playground that previews the proposed WordPress change.',
		body: `
			<label>PR number or URL<input value="https://github.com/WordPress/wordpress-develop/pull/" /></label>
			<div class="safe-message">
				<strong>Replacement warning</strong>
				<span>Previewing a PR starts a new Playground. Save or download the current site before continuing.</span>
			</div>
			<button class="primary-action" type="button">Preview WordPress PR</button>
			<button type="button">Cancel</button>
		`
	},
	'gutenberg-pr': {
		kicker: 'Start',
		title: 'Preview a Gutenberg PR or branch',
		copy: 'Enter a pull request number, URL, or branch name to test a Gutenberg change with WordPress Playground.',
		body: `
			<label>PR number, URL, or branch<input value="trunk" /></label>
			<div class="safe-message">
				<strong>Theme author note</strong>
				<span>This is useful before confirming a theme issue is caused by a block editor change.</span>
			</div>
			<button class="primary-action" type="button">Preview Gutenberg build</button>
			<button type="button">Cancel</button>
		`
	},
	github: {
		kicker: 'Import',
		title: 'Import from GitHub',
		copy: 'Connect a GitHub account, then import a public plugin, theme, or wp-content directory. The token is not stored after refresh.',
		body: `
			<div class="safe-message safe">
				<strong>Account connection</strong>
				<span>GitHub access is only used for the import session. Re-authentication is required after refresh.</span>
			</div>
			<label>Repository path<input value="owner/theme-repository" /></label>
			<button class="primary-action" type="button">Connect GitHub account</button>
		`
	},
	'blueprint-url': {
		kicker: 'Import',
		title: 'Run Blueprint from URL',
		copy: 'Paste a hosted Blueprint URL to configure a Playground with known content, plugins, themes, and runtime preferences.',
		body: `
			<label>Blueprint URL<input value="https://example.com/blueprint.json" /></label>
			<div class="safe-message">
				<strong>Run action</strong>
				<span>The current Playground will be replaced by the Blueprint result unless it is saved first.</span>
			</div>
			<button class="primary-action" type="button">Run Blueprint</button>
			<button type="button">Cancel</button>
		`
	},
	'zip-import': {
		kicker: 'Import',
		title: 'Import .zip',
		copy: 'Open a local Playground zip bundle through the browser file picker. The current site can be saved first.',
		body: `
			<div class="safe-message">
				<strong>Native file chooser</strong>
				<span>The real product opens the operating system file picker for zip imports.</span>
			</div>
			<button class="primary-action" type="button">Choose .zip file</button>
		`
	},
	'save-browser': {
		kicker: 'Save',
		title: 'Save in this browser',
		copy: 'Copy the temporary Playground into browser storage so it appears in Saved Playgrounds and survives refreshes.',
		body: `
			<label>Playground name<input value="Research Browser Playground" /></label>
			<label>Storage location<select><option>Save in this browser</option><option>Save to a local directory</option></select></label>
			<div class="safe-message safe">
				<strong>Saving progress</strong>
				<span>3,028 / 3,751 files copied. Keep this tab open while saving finishes.</span>
			</div>
			<meter min="0" max="3751" value="3028">80%</meter>
			<button class="primary-action" type="button">Save Playground</button>
			<button type="button">Cancel</button>
		`
	},
	'save-local': {
		kicker: 'Save',
		title: 'Save to a local directory',
		copy: 'Choose a local directory as the storage destination when browser storage is not the right long-term place.',
		body: `
			<label>Playground name<input value="Theme demo local copy" /></label>
			<label>Storage location<select><option>Save to a local directory</option><option>Save in this browser</option></select></label>
			<div class="safe-message safe">
				<strong>Local copy</strong>
				<span>The saved directory can be kept with your theme assets outside the browser.</span>
			</div>
			<button class="primary-action" type="button">Choose directory</button>
		`
	},
	'saved-sites': {
		kicker: 'Manage',
		title: 'Saved Playgrounds',
		copy: 'Browse temporary and browser-backed Playgrounds, then open, rename, delete, save, import, or download as needed.',
		body: `
			<div class="safe-message safe">
				<strong>Research Browser Playground</strong>
				<span>Saved in this browser a moment ago. Actions available: Open, Rename, Delete.</span>
			</div>
			<button type="button">Open saved Playground</button>
			<button type="button">Rename</button>
			<button class="danger" type="button">Delete</button>
		`
	},
	'reset-warning': {
		kicker: 'Safety',
		title: 'Apply settings safely',
		copy: 'Playground settings can reset or reload the current WordPress site. The drawer makes the destructive behavior visible before the action.',
		body: `
			<div class="safe-message danger">
				<strong>Unsaved reset</strong>
				<span>Applying WordPress, PHP, language, network, or multisite changes resets an unsaved Playground.</span>
			</div>
			<div class="safe-message">
				<strong>Saved reload</strong>
				<span>Stored Playgrounds have limited options and use Save & Reload instead of the unsaved reset action.</span>
			</div>
			<button class="danger" type="button">Apply Settings & Reset Playground</button>
			<button type="button">Save & Reload</button>
		`
	},
	settings: {
		kicker: 'Site Manager',
		title: 'Runtime settings',
		copy: 'Edit WordPress version, PHP version, language, older version visibility, network access, and multisite mode.',
		body: `
			<label>WordPress version<select><option>Latest</option><option>6.9 nightly</option><option>6.8</option></select></label>
			<label>PHP version<select><option>PHP 8.3</option><option>PHP 8.2</option><option>PHP 8.1</option></select></label>
			<label>Language<select><option>English (United States)</option><option>Polish</option></select></label>
			<label class="check"><input type="checkbox" checked /> Allow network access</label>
			<label class="check"><input type="checkbox" /> Include older WordPress versions</label>
			<label class="check"><input type="checkbox" /> Create a multisite network</label>
			<button class="danger" type="button">Apply Settings & Reset Playground</button>
		`
	},
	files: {
		kicker: 'Site Manager',
		title: 'File browser',
		copy: 'Browse /wordpress, create files and folders, upload or browse files, and edit code such as wp-config.php.',
		body: `
			<div class="safe-message safe"><strong>Selected file</strong><span>/wordpress/wp-config.php is open in the editor.</span></div>
			<button type="button">New File</button>
			<button type="button">New Folder</button>
			<button type="button">Upload files</button>
			<button type="button">Browse files</button>
		`
	},
	'blueprint-tools': {
		kicker: 'Site Manager',
		title: 'Blueprint tools',
		copy: 'Work with blueprint.json, copy a link, download the bundle, or run the current Blueprint against the Playground.',
		body: `
			<label>Open file<input value="/blueprint.json" /></label>
			<button type="button">Copy link to Blueprint</button>
			<button type="button">Download bundle</button>
			<button class="primary-action" type="button">Run Blueprint</button>
		`
	},
	database: {
		kicker: 'Site Manager',
		title: 'Database',
		copy: 'Inspect the database driver, SQLite path, and size. Download database.sqlite or open Adminer and phpMyAdmin.',
		body: `
			<div class="safe-message safe"><strong>Driver</strong><span>MySQL emulation backed by SQLite at /wordpress/wp-content/database/.ht.sqlite. Size: 452 KB.</span></div>
			<button type="button">Download database.sqlite</button>
			<button type="button">Open Adminer</button>
			<button type="button">Open phpMyAdmin</button>
		`
	},
	logs: {
		kicker: 'Site Manager',
		title: 'Logs',
		copy: 'Inspect Playground, WordPress, and PHP logs. Empty states still tell the user there are no problems so far.',
		body: `
			<div class="safe-message safe"><strong>Playground logs</strong><span>No problems so far.</span></div>
			<div class="safe-message safe"><strong>WordPress logs</strong><span>No notices or warnings.</span></div>
			<div class="safe-message safe"><strong>PHP logs</strong><span>Empty state ready for errors.</span></div>
		`
	},
	exports: {
		kicker: 'Move out',
		title: 'Export and download',
		copy: 'Use additional actions to export the current Playground to GitHub or download it as a .zip bundle.',
		body: `
			<div class="safe-message safe"><strong>Portable outputs</strong><span>Theme demos can leave the browser as a GitHub export or a downloadable zip.</span></div>
			<button class="primary-action" type="button">Export to GitHub</button>
			<button type="button">Download as .zip</button>
		`
	},
	rename: {
		kicker: 'Manage',
		title: 'Rename saved Playground',
		copy: 'Rename a saved browser-backed Playground without changing its stored files.',
		body: `
			<label>Playground name<input value="Research Browser Playground" /></label>
			<button class="primary-action" type="button">Save name</button>
			<button type="button">Cancel</button>
		`
	},
	delete: {
		kicker: 'Manage',
		title: 'Delete saved Playground',
		copy: 'Delete removes a saved browser-backed Playground from the local saved list.',
		body: `
			<div class="safe-message danger">
				<strong>Destructive action</strong>
				<span>Deleting cannot be undone from this browser. Download a .zip first if you need a backup.</span>
			</div>
			<button class="danger" type="button">Delete Playground</button>
			<button type="button">Cancel</button>
		`
	},
	'blueprint-gallery': {
		kicker: 'Blueprint gallery',
		title: 'Browse all 43 Blueprints',
		copy: 'Filter by All, Featured, Website, Personal, Content, Themes, Gutenberg, Experiments, WooCommerce, or News before running a starter.',
		body: `
			<label>Search<input value="theme starter" /></label>
			<div class="safe-message safe"><strong>Featured shortcuts</strong><span>Art Gallery, Coffee Shop, Feed Reader, Gaming News, Non-profit Organization, and Personal Blog are visible in this prototype.</span></div>
			<button class="primary-action" type="button">Run selected Blueprint</button>
		`
	}
};

const detailButtons = document.querySelectorAll('[data-detail]');
const drawerKicker = document.querySelector('#drawer-kicker');
const drawerTitle = document.querySelector('#drawer-title');
const drawerCopy = document.querySelector('#drawer-copy');
const drawerBody = document.querySelector('#drawer-body');

function setDetail(key) {
	const detail = details[key];
	if (!detail) {
		return;
	}
	drawerKicker.textContent = detail.kicker;
	drawerTitle.textContent = detail.title;
	drawerCopy.textContent = detail.copy;
	drawerBody.innerHTML = detail.body;
	document.querySelectorAll('.action-card').forEach((card) => {
		card.classList.toggle('active', card.dataset.detail === key);
	});
}

detailButtons.forEach((button) => {
	button.addEventListener('click', () => {
		setDetail(button.dataset.detail);
		if (button.closest('.section-panel')) {
			document.querySelector('.detail-drawer').scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	});
});

document.querySelectorAll('[data-jump]').forEach((button) => {
	button.addEventListener('click', () => {
		document.querySelector(button.dataset.jump)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	});
});

document.querySelectorAll('.manager-tab').forEach((tab) => {
	tab.addEventListener('click', () => {
		document.querySelectorAll('.manager-tab').forEach((item) => item.classList.remove('active'));
		document.querySelectorAll('.manager-pane').forEach((item) => item.classList.remove('active'));
		tab.classList.add('active');
		document.querySelector(`#${tab.dataset.panel}`)?.classList.add('active');
	});
});

document.querySelectorAll('.chip').forEach((chip) => {
	chip.addEventListener('click', () => {
		const filter = chip.dataset.filter;
		document.querySelectorAll('.chip').forEach((item) => item.classList.remove('active'));
		chip.classList.add('active');
		document.querySelectorAll('.blueprint-card').forEach((card) => {
			card.hidden = filter !== 'all' && !card.dataset.tags.includes(filter);
		});
	});
});
