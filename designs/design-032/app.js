const workspaceTabs = document.querySelectorAll('.workspace-tab');
const workspacePanels = document.querySelectorAll('.workspace-panel');

function openWorkspace(name) {
  workspaceTabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.workspace === name);
  });

  workspacePanels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === `workspace-${name}`);
  });
}

workspaceTabs.forEach((tab) => {
  tab.addEventListener('click', () => openWorkspace(tab.dataset.workspace));
});

document.querySelectorAll('[data-open-workspace]').forEach((button) => {
  button.addEventListener('click', () => openWorkspace(button.dataset.openWorkspace));
});

const managerTabs = document.querySelectorAll('.manager-tab');
const managerViews = document.querySelectorAll('.manager-view');

managerTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    managerTabs.forEach((item) => item.classList.toggle('active', item === tab));
    managerViews.forEach((view) => {
      view.classList.toggle('active', view.id === `manager-${tab.dataset.manager}`);
    });
  });
});

document.querySelectorAll('.task-list button').forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.step;
    if (target === 'start') openWorkspace('starts');
    if (target === 'save') openWorkspace('library');
    if (['files', 'blueprint', 'database'].includes(target)) {
      openWorkspace('manager');
      const managerTab = document.querySelector(`.manager-tab[data-manager="${target}"]`);
      managerTab?.click();
    }
    if (target === 'ship') openWorkspace('manager');
  });
});
