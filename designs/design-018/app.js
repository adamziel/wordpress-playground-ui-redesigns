const sectionButtons = document.querySelectorAll('[data-view]');
const drawerButtons = document.querySelectorAll('[data-drawer]');
const projectTabs = document.querySelectorAll('.project-tab[data-project]');
const closeButtons = document.querySelectorAll('.drawer-close');
const drawer = document.querySelector('.drawer');
const workspace = document.querySelector('.workspace');

function showView(id) {
  document.querySelectorAll('.section-tab').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === id);
  });
  document.querySelectorAll('.view').forEach((view) => {
    view.classList.toggle('active', view.id === `view-${id}`);
  });
}

function showDrawer(id) {
  drawer.classList.add('open');
  workspace.classList.remove('drawer-collapsed');
  document.querySelectorAll('.drawer-panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === `drawer-${id}`);
  });
}

sectionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.view) {
      showView(button.dataset.view);
    }
  });
});

drawerButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showDrawer(button.dataset.drawer);
  });
});

projectTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    projectTabs.forEach((item) => item.classList.remove('active'));
    tab.classList.add('active');
    const name = tab.querySelector('span')?.textContent || 'Unsaved Playground';
    const pathInput = document.querySelector('.path-field input');
    const state = document.querySelector('.save-state');

    if (tab.classList.contains('unsaved')) {
      pathInput.value = '/hello-from-playground/';
      state.innerHTML = '<span></span> Unsaved Playground';
      state.style.color = '#b7791f';
      state.querySelector('span').style.background = '#b7791f';
      showDrawer('save');
    } else {
      pathInput.value = name.includes('Rescue') ? '/volunteer-benefit/' : '/hello-from-playground/';
      state.innerHTML = '<span></span> Saved Playground';
      state.style.color = '#15803d';
      state.querySelector('span').style.background = '#15803d';
    }
  });
});

closeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    drawer.classList.remove('open');
    workspace.classList.add('drawer-collapsed');
  });
});
