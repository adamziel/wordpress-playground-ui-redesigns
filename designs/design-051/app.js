const app = document.querySelector('.app');
const modalLayer = document.querySelector('.modal-layer');
const toast = document.querySelector('#toast');

function setView(name) {
  app.dataset.view = name;
  document.querySelectorAll('[data-view-panel]').forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.viewPanel === name);
  });
  document.querySelectorAll('[data-view-target]').forEach((button) => {
    button.classList.toggle('active', button.dataset.viewTarget === name);
  });
}

function setTab(name) {
  setView('manager');
  document.querySelectorAll('[data-tab-panel]').forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.tabPanel === name);
  });
  document.querySelectorAll('[data-tab-target]').forEach((button) => {
    button.classList.toggle('active', button.dataset.tabTarget === name);
  });
}

function openModal(id) {
  const modal = document.querySelector(`#${id}-modal`);
  if (!modal) return;
  modalLayer.hidden = false;
  modal.hidden = false;
  if (!modal.open) {
    modal.show();
  }
}

function closeModals() {
  document.querySelectorAll('.modal').forEach((modal) => {
    if (modal.open) modal.close();
    modal.hidden = true;
  });
  modalLayer.hidden = true;
  document.querySelectorAll('.save-progress').forEach((progress) => {
    progress.hidden = true;
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}

document.addEventListener('click', (event) => {
  const viewButton = event.target.closest('[data-view-target]');
  if (viewButton) {
    setView(viewButton.dataset.viewTarget);
  }

  const tabButton = event.target.closest('[data-tab-target]');
  if (tabButton) {
    setTab(tabButton.dataset.tabTarget);
  }

  const modalButton = event.target.closest('[data-open-modal]');
  if (modalButton) {
    openModal(modalButton.dataset.openModal);
  }

  if (event.target.closest('[data-close-modal]')) {
    closeModals();
  }

  const menuButton = event.target.closest('[data-open-menu]');
  if (menuButton) {
    const menu = document.querySelector(`#${menuButton.dataset.openMenu}`);
    document.querySelectorAll('.floating-menu').forEach((item) => {
      if (item !== menu) item.hidden = true;
    });
    if (menu) menu.hidden = !menu.hidden;
  } else if (!event.target.closest('.floating-menu')) {
    document.querySelectorAll('.floating-menu').forEach((item) => {
      item.hidden = true;
    });
  }

  const startButton = event.target.closest('[data-start]');
  if (startButton) {
    const type = startButton.dataset.start;
    if (type === 'zip') {
      showToast('Native file chooser opened for .zip import.');
    } else {
      showToast('Starting a new vanilla WordPress Playground...');
    }
  }

  if (event.target.closest('.rename-action')) {
    showToast('Rename action opened for Research Browser Playground.');
  }

  if (event.target.closest('.delete-action')) {
    showToast('Delete confirmation opened for Research Browser Playground.');
  }
});

document.querySelector('#save-confirm').addEventListener('click', () => {
  const progress = document.querySelector('.save-progress');
  progress.hidden = false;
  showToast('Saving current Playground in browser storage.');
  window.setTimeout(() => {
    closeModals();
    document.querySelectorAll('.status-pill.amber').forEach((pill) => {
      pill.textContent = 'Saved Playground';
      pill.classList.remove('amber');
      pill.classList.add('green');
    });
    showToast('Playground saved to this browser.');
  }, 1200);
});

const filters = document.querySelectorAll('.filter');
const search = document.querySelector('#blueprint-search');
const cards = document.querySelectorAll('.blueprint-card');
let activeFilter = 'all';

function applyBlueprintFilter() {
  const query = search.value.trim().toLowerCase();
  cards.forEach((card) => {
    const matchesFilter = activeFilter === 'all' || card.dataset.tags.includes(activeFilter);
    const matchesSearch = !query || card.textContent.toLowerCase().includes(query);
    card.hidden = !(matchesFilter && matchesSearch);
  });
}

filters.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filters.forEach((item) => item.classList.toggle('active', item === button));
    applyBlueprintFilter();
  });
});

search.addEventListener('input', applyBlueprintFilter);

modalLayer.addEventListener('click', (event) => {
  if (event.target === modalLayer) {
    closeModals();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModals();
    document.querySelectorAll('.floating-menu').forEach((item) => {
      item.hidden = true;
    });
  }
});
