const drawerTitles = {
  default: 'Current Playground context',
  'wordpress-pr': 'Preview a WordPress PR',
  'gutenberg-pr': 'Preview a Gutenberg PR or branch',
  github: 'Import from GitHub',
  'blueprint-url': 'Run Blueprint from URL',
  zip: 'Import .zip over current site',
  vanilla: 'Start Vanilla WordPress',
  'run-proof': 'Complete review run sequence',
  save: 'Save Playground',
  'save-browser': 'Browser storage result',
  'save-local': 'Save to a local directory',
  'rename-delete': 'Saved Playground actions',
  'settings-reset': 'Reset and reload consequences',
  'blueprint-detail': 'Blueprint detail'
};

const navButtons = Array.from(document.querySelectorAll('[data-view].nav-tab'));
const panels = Array.from(document.querySelectorAll('[data-panel]'));
const drawerTitle = document.getElementById('drawer-title');
const drawerBody = document.getElementById('drawer-body');

function openDrawer(name = 'default') {
  const template = document.getElementById(`drawer-${name}`) || document.getElementById('drawer-default');
  drawerTitle.textContent = drawerTitles[name] || drawerTitles.default;
  drawerBody.replaceChildren(template.content.cloneNode(true));
}

function setView(view) {
  navButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.view === view));
  panels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.panel === view));
}

document.addEventListener('click', (event) => {
  const drawerTrigger = event.target.closest('[data-drawer]');
  if (drawerTrigger) {
    openDrawer(drawerTrigger.dataset.drawer);
  }

  const viewTrigger = event.target.closest('[data-view]:not(.nav-tab)');
  if (viewTrigger) {
    setView(viewTrigger.dataset.view);
  }

  const navTrigger = event.target.closest('.nav-tab[data-view]');
  if (navTrigger) {
    setView(navTrigger.dataset.view);
    const defaults = {
      launch: 'wordpress-pr',
      sites: 'rename-delete',
      manager: 'settings-reset',
      blueprints: 'blueprint-detail',
      transfer: 'save'
    };
    openDrawer(defaults[navTrigger.dataset.view] || 'default');
  }

  const toolTrigger = event.target.closest('.manager-tab[data-tool]');
  if (toolTrigger) {
    const tool = toolTrigger.dataset.tool;
    document.querySelectorAll('.manager-tab').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.tool === tool);
    });
    document.querySelectorAll('.tool-panel').forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.toolPanel === tool);
    });
  }
});

openDrawer('wordpress-pr');
