const drawerButtons = document.querySelectorAll('[data-drawer]');
const drawerPanels = document.querySelectorAll('.drawer-panel');
const chromeDrawerButtons = document.querySelectorAll('.drawer-button');

function openDrawer(name) {
  drawerPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === `drawer-${name}`);
  });
  chromeDrawerButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.drawer === name);
  });
}

drawerButtons.forEach((button) => {
  button.addEventListener('click', () => openDrawer(button.dataset.drawer));
});

const managerTabs = document.querySelectorAll('[data-manager]');
const managerPanels = document.querySelectorAll('.manager-panel');

managerTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    managerTabs.forEach((item) => item.classList.toggle('active', item === tab));
    managerPanels.forEach((panel) => {
      panel.classList.toggle('active', panel.id === `manager-${tab.dataset.manager}`);
    });
  });
});

document.querySelectorAll('.filter-row button').forEach((button) => {
  button.addEventListener('click', () => {
    button.parentElement.querySelectorAll('button').forEach((item) => {
      item.classList.toggle('active', item === button);
    });
  });
});
