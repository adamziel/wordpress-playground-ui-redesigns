const workflows = {
	'save-browser': {
		kicker: 'Current flow',
		title: 'Save in this browser',
		copy: 'Copy the temporary Playground into browser storage, then return to the register as a named saved site.',
		body: `
			<label>Playground name<input value="Research Browser Playground" /></label>
			<fieldset>
				<legend>Storage destination</legend>
				<label class="choice checked"><input type="radio" checked /> Save in this browser</label>
				<label class="choice"><input type="radio" /> Save to a local directory</label>
			</fieldset>
			<div class="progress-row">
				<span>Saving 3,028 / 3,751 files</span>
				<meter min="0" max="3751" value="3028">80%</meter>
			</div>
			<ol class="flow-steps">
				<li class="done">Temporary site selected</li>
				<li class="active">Browser storage copy in progress</li>
				<li>Saved row will appear with rename and delete actions</li>
			</ol>
			<div class="button-row">
				<button class="primary" type="button" data-action="save-browser-result">Finish save</button>
				<button type="button">Cancel</button>
			</div>
		`
	},
	'save-browser-result': {
		kicker: 'Result',
		title: 'Saved Playground',
		copy: 'The saved state is now addressable from the register and browser storage.',
		body: `
			<div class="notice info-notice"><strong>Saved:</strong> Research Browser Playground was saved in this browser a moment ago.</div>
			<ol class="flow-steps">
				<li class="done">3,751 files copied</li>
				<li class="done">Saved row created</li>
				<li class="active">Available actions: Open, Rename, Delete, Export</li>
			</ol>
			<div class="button-row">
				<button type="button" data-action="rename">Rename</button>
				<button class="danger" type="button" data-action="delete">Delete</button>
				<button type="button" data-action="exports">Export</button>
			</div>
		`
	},
	'save-local': {
		kicker: 'Save destination',
		title: 'Save to a local directory',
		copy: 'Choose a directory-backed destination when the Playground should live outside browser storage.',
		body: `
			<label>Playground name<input value="Block Editor Trunk Local" /></label>
			<fieldset>
				<legend>Storage destination</legend>
				<label class="choice"><input type="radio" /> Save in this browser</label>
				<label class="choice checked"><input type="radio" checked /> Save to a local directory</label>
			</fieldset>
			<div class="notice info-notice"><strong>Directory permission:</strong> The browser asks for a local folder before files are copied.</div>
			<ol class="flow-steps">
				<li class="done">Temporary site selected</li>
				<li class="active">Choose local directory</li>
				<li>Saved state returns as a local-directory row</li>
			</ol>
			<div class="button-row">
				<button class="primary" type="button" data-action="save-local-result">Choose directory</button>
				<button type="button">Cancel</button>
			</div>
		`
	},
	'save-local-result': {
		kicker: 'Result',
		title: 'Local directory saved',
		copy: 'The Playground is stored outside browser storage and uses Save & Reload for later configuration changes.',
		body: `
			<div class="notice info-notice"><strong>Saved locally:</strong> Block Editor Trunk Local now appears with a Local directory state.</div>
			<ol class="flow-steps">
				<li class="done">Directory selected</li>
				<li class="done">Files copied</li>
				<li class="active">Use Save & Reload after settings edits</li>
			</ol>
			<div class="button-row">
				<button type="button" data-action="save-reload">Save & Reload</button>
				<button type="button" data-action="exports">Download zip</button>
			</div>
		`
	},
	rename: {
		kicker: 'Saved management',
		title: 'Rename saved Playground',
		copy: 'Rename changes the saved register label and slug, without changing WordPress files.',
		body: `
			<label>Playground name<input value="Research Browser Playground" /></label>
			<ol class="flow-steps">
				<li class="done">Saved browser-backed site selected</li>
				<li class="active">Edit visible name</li>
				<li>Register row updates after Save name</li>
			</ol>
			<div class="button-row">
				<button class="primary" type="button">Save name</button>
				<button type="button">Cancel</button>
			</div>
		`
	},
	delete: {
		kicker: 'Saved management',
		title: 'Delete saved Playground',
		copy: 'Delete removes the saved browser-backed site from the register. It does not affect the current unsaved tab until selected.',
		body: `
			<div class="notice danger-notice"><strong>Delete consequence:</strong> Research Browser Playground will be removed from browser storage and cannot be opened from Saved Playgrounds.</div>
			<ol class="flow-steps">
				<li class="done">Saved browser row selected</li>
				<li class="active">Confirm deletion</li>
				<li>Register returns to temporary and remaining saved rows</li>
			</ol>
			<div class="button-row">
				<button class="danger" type="button">Delete saved Playground</button>
				<button type="button">Cancel</button>
			</div>
		`
	},
	'settings-reset': {
		kicker: 'Settings consequence',
		title: 'Apply Settings & Reset Playground',
		copy: 'Runtime changes reset an unsaved Playground. Saved Playgrounds have limited options and use Save & Reload.',
		body: `
			<label>WordPress Version<select><option>Latest</option><option>6.9 nightly</option><option>6.8</option></select></label>
			<label>PHP Version<select><option>PHP 8.3</option><option>PHP 8.2</option></select></label>
			<label class="choice checked"><input type="checkbox" checked /> Allow network access</label>
			<label class="choice"><input type="checkbox" /> Create a multisite network</label>
			<div class="notice danger-notice"><strong>Unsaved reset:</strong> Applying these settings discards current temporary site changes.</div>
			<div class="button-row">
				<button class="danger" type="button">Apply Settings & Reset Playground</button>
				<button type="button" data-action="save-reload">Save & Reload stored site</button>
			</div>
		`
	},
	'save-reload': {
		kicker: 'Stored Playground',
		title: 'Save & Reload',
		copy: 'Stored Playgrounds can save limited setting changes and reload without presenting the full temporary reset action.',
		body: `
			<div class="notice info-notice"><strong>Stored configuration:</strong> WordPress version and language are locked for this saved site; PHP version and network access can be reloaded.</div>
			<ol class="flow-steps">
				<li class="done">Saved site selected</li>
				<li class="active">Settings queued</li>
				<li>Reload starts and returns to the same saved identity</li>
			</ol>
			<button class="primary" type="button">Save & Reload</button>
		`
	},
	vanilla: {
		kicker: 'Launch source',
		title: 'Vanilla WordPress',
		copy: 'Start a fresh WordPress Playground with no extra input.',
		body: `
			<div class="notice warning-notice"><strong>Replacement warning:</strong> This starts a new temporary Playground and replaces the current unsaved site.</div>
			<ol class="flow-steps">
				<li class="active">Start clean WordPress</li>
				<li>Prepare WordPress</li>
				<li>Land on /hello-from-playground/ logged in as admin</li>
			</ol>
			<button class="primary" type="button">Start new WordPress</button>
		`
	},
	'wordpress-pr': {
		kicker: 'Launch source',
		title: 'Preview a WordPress PR',
		copy: 'Use a WordPress core PR number or URL to start a review Playground.',
		body: `
			<label>PR number or URL<input value="https://github.com/WordPress/wordpress-develop/pull/68123" /></label>
			<div class="notice warning-notice"><strong>Constraint:</strong> Only WordPress core pull request numbers or URLs are accepted for this route.</div>
			<div class="button-row">
				<button class="primary" type="button">Preview WordPress PR</button>
				<button type="button">Cancel</button>
			</div>
		`
	},
	'gutenberg-pr': {
		kicker: 'Launch source',
		title: 'Preview a Gutenberg PR or branch',
		copy: 'Use a Gutenberg PR number, URL, or branch name to test editor changes.',
		body: `
			<label>PR number, URL, or branch<input value="trunk" /></label>
			<div class="notice info-notice"><strong>Accepted input:</strong> PR number, GitHub URL, or a branch name such as trunk.</div>
			<div class="button-row">
				<button class="primary" type="button">Preview Gutenberg build</button>
				<button type="button">Cancel</button>
			</div>
		`
	},
	github: {
		kicker: 'Import route',
		title: 'Import from GitHub',
		copy: 'Connect a GitHub account to import public plugins, themes, or wp-content directories.',
		body: `
			<label>Repository path<input value="owner/repository/path" /></label>
			<div class="notice info-notice"><strong>Authentication:</strong> The access token is not stored and re-authentication is required after refresh.</div>
			<button class="primary" type="button">Connect GitHub account</button>
		`
	},
	'blueprint-url': {
		kicker: 'Import route',
		title: 'Run Blueprint from URL',
		copy: 'Run a hosted blueprint.json against a new Playground state.',
		body: `
			<label>Blueprint URL<input value="https://example.com/blueprint.json" /></label>
			<div class="notice warning-notice"><strong>Replacement warning:</strong> Running the URL replaces the current site unless it is saved first.</div>
			<div class="button-row">
				<button class="primary" type="button">Run Blueprint</button>
				<button type="button">Cancel</button>
			</div>
		`
	},
	'zip-import': {
		kicker: 'Import route',
		title: 'Import .zip',
		copy: 'Open a Playground zip bundle through the native file picker.',
		body: `
			<div class="notice warning-notice"><strong>Import over current site:</strong> The selected zip replaces the current Playground state after confirmation.</div>
			<ol class="flow-steps">
				<li class="active">Choose zip from native file picker</li>
				<li>Confirm import over current site</li>
				<li>Load imported Playground</li>
			</ol>
			<button class="primary" type="button">Choose .zip file</button>
		`
	},
	'import-warning': {
		kicker: 'Consequence',
		title: 'Import replaces current site',
		copy: 'Blueprint URL runs and zip imports both replace the current Playground unless the user saves or downloads it first.',
		body: `
			<div class="notice danger-notice"><strong>Current state is unsaved:</strong> Save in this browser, save to a local directory, or download a zip before importing over it.</div>
			<div class="button-row">
				<button type="button" data-action="save-browser">Save browser</button>
				<button type="button" data-action="save-local">Save local</button>
				<button class="primary" type="button" data-action="zip-import">Continue import</button>
			</div>
		`
	},
	'blueprint-detail': {
		kicker: 'Blueprint catalog',
		title: 'Inspect selected Blueprint',
		copy: 'Selected catalog rows expose category, tags, run behavior, and the option to inspect generated JSON.',
		body: `
			<div class="notice info-notice"><strong>Feed Reader with the Friends Plugin:</strong> Content and social web Blueprint with sample feeds and plugin setup.</div>
			<ol class="flow-steps">
				<li class="done">Catalog filtered</li>
				<li class="active">Blueprint selected</li>
				<li>Run selected or inspect blueprint.json</li>
			</ol>
			<div class="button-row">
				<button class="primary" type="button" data-action="run-blueprint-result">Run selected</button>
				<button type="button" data-action="blueprint-tools">Inspect JSON</button>
			</div>
		`
	},
	'run-blueprint-result': {
		kicker: 'Result',
		title: 'Blueprint run complete',
		copy: 'The selected Blueprint produced a new Playground and the register records it as the active source.',
		body: `
			<div class="notice info-notice"><strong>Prepared:</strong> WordPress loaded with the Friends plugin, sample feeds, and landing page configuration.</div>
			<ol class="flow-steps">
				<li class="done">Blueprint validated</li>
				<li class="done">Steps executed</li>
				<li class="active">Save result or inspect Site Manager</li>
			</ol>
			<div class="button-row">
				<button type="button" data-action="save-browser">Save result</button>
				<button type="button" data-action="blueprint-tools">Open Blueprint tab</button>
			</div>
		`
	},
	'blueprint-tools': {
		kicker: 'Site Manager',
		title: 'Blueprint tools',
		copy: 'Edit blueprint.json, copy a link, download the bundle, or run the current Blueprint.',
		body: `
			<div class="notice info-notice"><strong>Open file:</strong> /blueprint.json is selected in the Site Manager Blueprint tab.</div>
			<div class="button-row">
				<button type="button" data-action="copy-blueprint">Copy link</button>
				<button type="button" data-action="download-bundle">Download bundle</button>
				<button class="primary" type="button" data-action="run-blueprint-result">Run Blueprint</button>
			</div>
		`
	},
	files: {
		kicker: 'Site Manager',
		title: 'File browser',
		copy: 'Browse /wordpress, create files and folders, upload files, and edit wp-config.php.',
		body: `
			<div class="notice info-notice"><strong>Selected file:</strong> /wordpress/wp-config.php is open in the editor.</div>
			<div class="button-row">
				<button type="button">New File</button>
				<button type="button">New Folder</button>
				<button type="button">Upload files</button>
				<button type="button">Browse files</button>
			</div>
		`
	},
	database: {
		kicker: 'Site Manager',
		title: 'Database',
		copy: 'Inspect SQLite-backed database details and open database tools.',
		body: `
			<table class="facts">
				<tr><th scope="row">Driver</th><td>MySQL emulation backed by SQLite</td></tr>
				<tr><th scope="row">Path</th><td>/wordpress/wp-content/database/.ht.sqlite</td></tr>
				<tr><th scope="row">Size</th><td>452 KB</td></tr>
			</table>
			<div class="button-row">
				<button type="button">Download database.sqlite</button>
				<button type="button">Open Adminer</button>
				<button type="button">Open phpMyAdmin</button>
			</div>
		`
	},
	logs: {
		kicker: 'Site Manager',
		title: 'Logs',
		copy: 'Review Playground, WordPress, and PHP log channels.',
		body: `
			<div class="notice info-notice"><strong>Playground logs:</strong> No problems so far.</div>
			<div class="notice info-notice"><strong>WordPress logs:</strong> No notices or warnings.</div>
			<div class="notice info-notice"><strong>PHP logs:</strong> No PHP errors recorded.</div>
		`
	},
	exports: {
		kicker: 'Transfers',
		title: 'Export to GitHub or download zip',
		copy: 'Additional actions move the current Playground out of the browser.',
		body: `
			<div class="notice info-notice"><strong>Available outputs:</strong> Export to GitHub or download the current Playground as a .zip bundle.</div>
			<div class="button-row">
				<button class="primary" type="button">Export to GitHub</button>
				<button type="button" data-action="download-zip">Download as .zip</button>
			</div>
		`
	},
	'download-zip': {
		kicker: 'Transfer result',
		title: 'Zip download prepared',
		copy: 'The current Playground can be downloaded and later imported through the .zip route.',
		body: `
			<ol class="flow-steps">
				<li class="done">Bundle assembled</li>
				<li class="active">Download as .zip</li>
				<li>Import through the zip route when needed</li>
			</ol>
			<button class="primary" type="button">Download current Playground.zip</button>
		`
	},
	'copy-blueprint': {
		kicker: 'Blueprint result',
		title: 'Blueprint link copied',
		copy: 'The shareable Blueprint link is ready to paste into a PR, issue, or test note.',
		body: `
			<label>Blueprint link<input value="https://playground.wordpress.net/#eyJzdGVwcyI6W119" /></label>
			<button class="primary" type="button">Copy again</button>
		`
	},
	'download-bundle': {
		kicker: 'Blueprint result',
		title: 'Bundle download prepared',
		copy: 'Download the Blueprint bundle from the Site Manager Blueprint tab.',
		body: `
			<div class="notice info-notice"><strong>Ready:</strong> blueprint-bundle.zip includes blueprint.json and supporting files.</div>
			<button class="primary" type="button">Download bundle</button>
		`
	}
};

const title = document.querySelector('#workflow-title');
const kicker = document.querySelector('#workflow-kicker');
const copy = document.querySelector('#workflow-copy');
const body = document.querySelector('#workflow-body');

function showWorkflow(name) {
	const workflow = workflows[name];
	if (!workflow) return;
	kicker.textContent = workflow.kicker;
	title.textContent = workflow.title;
	copy.textContent = workflow.copy;
	body.innerHTML = workflow.body;
}

document.addEventListener('click', (event) => {
	const actionButton = event.target.closest('[data-action]');
	if (actionButton) {
		showWorkflow(actionButton.dataset.action);
	}

	const tab = event.target.closest('[data-manager-tab]');
	if (tab) {
		document.querySelectorAll('[data-manager-tab]').forEach((button) => button.classList.remove('active'));
		document.querySelectorAll('.manager-panel').forEach((panel) => panel.classList.remove('active'));
		tab.classList.add('active');
		const panel = document.querySelector(`#manager-${tab.dataset.managerTab}`);
		if (panel) panel.classList.add('active');
	}
});
