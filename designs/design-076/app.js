const tabButtons = document.querySelectorAll('.workspace-tabs .tab');
const views = document.querySelectorAll('.view');

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.view;
    tabButtons.forEach((tab) => tab.classList.toggle('is-active', tab === button));
    views.forEach((view) => view.classList.toggle('is-active', view.id === target));
  });
});

const routes = {
  gutenberg: {
    title: 'Preview a Gutenberg PR or branch',
    copy: 'Use this path when testing block editor fixes, theme.json behavior, or a branch from the Gutenberg repository.',
    label: 'PR number, URL, or branch name',
    value: 'feature/theme-json-layout',
    warning: 'Previewing this branch starts a new Playground and discards unsaved runtime changes unless saved first.',
    action: 'Preview branch'
  },
  wordpress: {
    title: 'Preview a WordPress PR',
    copy: 'Use this path for core patches that need a live site, admin access, and current WordPress runtime controls.',
    label: 'PR number or URL',
    value: 'https://github.com/WordPress/wordpress-develop/pull/7210',
    warning: 'Starting a core PR preview replaces the current unsaved Playground state.',
    action: 'Preview PR'
  },
  github: {
    title: 'Import from GitHub',
    copy: 'Import public plugins, themes, or wp-content directories from GitHub after connecting an account.',
    label: 'Repository URL',
    value: 'https://github.com/example/theme-fixtures',
    warning: 'The access token is not stored. Refreshing the page requires GitHub reconnection.',
    action: 'Connect GitHub'
  },
  blueprint: {
    title: 'Run Blueprint from URL',
    copy: 'Run a remote blueprint.json to install plugins, import content, and set the landing page for the current Playground.',
    label: 'Blueprint URL',
    value: 'https://example.com/blueprint.json',
    warning: 'Running a Blueprint imports files and content over the current Playground.',
    action: 'Run Blueprint'
  },
  zip: {
    title: 'Import a .zip bundle',
    copy: 'Open the native file chooser and import a Playground zip into the current runtime.',
    label: 'Selected archive',
    value: 'theme-regression-playground.zip',
    warning: 'Zip import can overwrite current files and database state.',
    action: 'Choose .zip'
  },
  vanilla: {
    title: 'Start Vanilla WordPress',
    copy: 'Start a clean WordPress Playground with the selected runtime, language, network, and multisite settings.',
    label: 'Landing path',
    value: '/hello-from-playground/',
    warning: 'Vanilla WordPress starts immediately and replaces unsaved runtime changes.',
    action: 'Start clean Playground'
  }
};

const routeButtons = document.querySelectorAll('.route');
const title = document.querySelector('#route-title');
const copy = document.querySelector('#route-copy');
const label = document.querySelector('#route-label');
const input = document.querySelector('#route-input');
const warning = document.querySelector('#route-warning');
const action = document.querySelector('#route-action');

routeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const route = routes[button.dataset.route];
    routeButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    title.textContent = route.title;
    copy.textContent = route.copy;
    label.textContent = route.label;
    input.value = route.value;
    warning.textContent = route.warning;
    action.textContent = route.action;
  });
});
