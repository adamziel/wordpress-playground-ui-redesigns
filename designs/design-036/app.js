const modalData = {
	vanilla: {
		kicker: 'Clean site',
		title: 'Start Vanilla WordPress',
		copy: 'Create a fresh Playground with WordPress, PHP, admin login, and the default welcome page.',
		primary: 'Start clean site',
		html: `
			<div class="notice inline">This starts immediately in the live product and replaces the current temporary Playground.</div>
			<label>Landing path<input value="/hello-from-playground/"></label>
		`
	},
	'wordpress-pr': {
		kicker: 'Preview core',
		title: 'Preview a WordPress PR',
		copy: 'Enter a WordPress core pull request number or URL.',
		primary: 'Preview PR',
		html: `
			<label>PR number or URL<input placeholder="e.g. 12345 or https://github.com/WordPress/wordpress-develop/pull/12345"></label>
		`
	},
	'gutenberg-pr': {
		kicker: 'Preview Gutenberg',
		title: 'Preview a Gutenberg PR or Branch',
		copy: 'Use a PR number, URL, or branch name to test editor work in Playground.',
		primary: 'Preview Gutenberg',
		html: `
			<label>PR number, URL, or branch name<input placeholder="try: trunk, 65432, or a GitHub pull URL"></label>
		`
	},
	github: {
		kicker: 'Import source',
		title: 'Import from GitHub',
		copy: 'Import public plugins, themes, or wp-content directories. Playground connects to GitHub for this session only.',
		primary: 'Connect GitHub account',
		html: `
			<div class="notice inline">The access token is not stored. Refreshing the page requires re-authentication.</div>
			<label>Repository URL<input placeholder="https://github.com/user/repository"></label>
			<label>Import target<select><option>Plugin</option><option>Theme</option><option>wp-content directory</option></select></label>
		`
	},
	'blueprint-url': {
		kicker: 'Run recipe',
		title: 'Run Blueprint from URL',
		copy: 'Load a hosted blueprint.json recipe and rebuild the Playground from its steps.',
		primary: 'Run Blueprint',
		html: `
			<label>Blueprint URL<input placeholder="https://example.com/blueprint.json"></label>
		`
	},
	zip: {
		kicker: 'Import package',
		title: 'Import .zip',
		copy: 'In the current product this opens the native file chooser. This wireframe shows the trigger before the browser takes over.',
		primary: 'Choose .zip file',
		html: `
			<div class="notice inline">Accepted source: a zipped Playground, plugin, theme, or project package.</div>
			<label>Selected file<input value="No file selected" readonly></label>
		`
	},
	save: {
		kicker: 'Keep work',
		title: 'Save Playground',
		copy: 'Name this temporary Playground and choose where it should be stored.',
		primary: 'Save Playground',
		html: `
			<label>Playground name<input value="Research Browser Playground"></label>
			<div class="choice-row">
				<label><input type="radio" name="modal-storage" checked> Save in this browser</label>
				<label><input type="radio" name="modal-storage"> Save to a local directory</label>
			</div>
			<div class="progress"><span style="width: 73%"></span></div>
			<p class="muted">Saving 3028 / 3751 files</p>
		`
	},
	gallery: {
		kicker: 'Blueprint gallery',
		title: 'Browse 43 Blueprints',
		copy: 'Filter prepared Playground scenarios by topic, then start from the selected blueprint.',
		primary: 'Start selected blueprint',
		html: `
			<div class="gallery-filters" aria-label="Blueprint filters">
				<button type="button" class="active" data-filter="all">All</button>
				<button type="button" data-filter="featured">Featured</button>
				<button type="button" data-filter="website">Website</button>
				<button type="button" data-filter="personal">Personal</button>
				<button type="button" data-filter="content">Content</button>
				<button type="button" data-filter="themes">Themes</button>
				<button type="button" data-filter="gutenberg">Gutenberg</button>
				<button type="button" data-filter="experiments">Experiments</button>
				<button type="button" data-filter="woocommerce">WooCommerce</button>
				<button type="button" data-filter="news">News</button>
			</div>
			<div class="gallery-grid">
				<div class="gallery-card" data-tags="featured website personal themes"><strong>Art Gallery</strong><span>Vue theme gallery for artwork and essays.</span></div>
				<div class="gallery-card" data-tags="featured woocommerce website"><strong>Coffee Shop</strong><span>Storefront with products and content.</span></div>
				<div class="gallery-card" data-tags="featured content experiments"><strong>Feed Reader with the Friends Plugin</strong><span>Read feeds and social web content.</span></div>
				<div class="gallery-card" data-tags="featured website news"><strong>Gaming News</strong><span>News site using the Spiel theme.</span></div>
				<div class="gallery-card" data-tags="featured website"><strong>Non-profit Organization</strong><span>Donation-oriented organization site.</span></div>
				<div class="gallery-card" data-tags="personal website content"><strong>Personal Blog</strong><span>Substrata-powered personal publishing.</span></div>
			</div>
		`
	}
};

const backdrop = document.querySelector('.modal-backdrop');
const modalTitle = document.querySelector('#modal-title');
const modalKicker = document.querySelector('#modal-kicker');
const modalCopy = document.querySelector('#modal-copy');
const modalContent = document.querySelector('#modal-content');
const modalPrimary = document.querySelector('#modal-primary');

function openModal(key) {
	const data = modalData[key];
	if (!data) return;
	modalKicker.textContent = data.kicker;
	modalTitle.textContent = data.title;
	modalCopy.textContent = data.copy;
	modalPrimary.textContent = data.primary;
	modalContent.innerHTML = data.html;
	backdrop.hidden = false;
	const firstInput = modalContent.querySelector('input, select, button');
	(firstInput || modalPrimary).focus();
}

function closeModal() {
	backdrop.hidden = true;
}

document.addEventListener('click', (event) => {
	const openButton = event.target.closest('[data-open]');
	if (openButton) {
		openModal(openButton.dataset.open);
	}

	const closeButton = event.target.closest('[data-close]');
	if (closeButton || event.target === backdrop) {
		closeModal();
	}

	const scrollButton = event.target.closest('[data-scroll]');
	if (scrollButton) {
		const target = document.querySelector(`#${scrollButton.dataset.scroll}`);
		if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	const saveDemo = event.target.closest('[data-save-demo]');
	if (saveDemo) {
		saveDemo.textContent = 'Saved in browser';
		saveDemo.classList.remove('accent');
		const shellChip = document.querySelector('.shell-actions .chip');
		if (shellChip) {
			shellChip.textContent = 'Saved';
			shellChip.className = 'chip ok';
		}
	}

	const filterButton = event.target.closest('[data-filter]');
	if (filterButton) {
		const filter = filterButton.dataset.filter;
		document.querySelectorAll('.gallery-filters button').forEach((button) => {
			button.classList.toggle('active', button === filterButton);
		});
		document.querySelectorAll('.gallery-card').forEach((card) => {
			const visible = filter === 'all' || card.dataset.tags.includes(filter);
			card.hidden = !visible;
		});
	}
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && !backdrop.hidden) {
		closeModal();
	}
});
