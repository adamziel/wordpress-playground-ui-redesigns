(function () {
  const modalMap = {
    save: document.getElementById('save-modal'),
    start: document.getElementById('start-modal'),
    gallery: document.getElementById('gallery-modal'),
    export: document.getElementById('export-modal')
  };

  const drawerTitle = document.getElementById('drawer-title');
  const startFieldLabel = document.getElementById('start-field-label');
  const startAction = document.getElementById('start-action');

  function openModal(name) {
    const modal = modalMap[name];
    if (!modal) {
      return;
    }
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
  }

  function setDrawerTab(name) {
    document.querySelectorAll('[data-tab]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.tab === name);
    });
    document.querySelectorAll('[data-panel]').forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.panel === name);
    });
    document.querySelectorAll('.metric-card').forEach((card) => {
      card.classList.toggle('is-selected', card.dataset.drawer === name);
    });
  }

  function setStartType(type) {
    const labels = {
      'Vanilla WordPress': ['No extra input required', 'Start'],
      'WordPress PR': ['PR number or URL', 'Preview'],
      'Gutenberg PR or branch': ['PR number, URL, or branch name', 'Preview'],
      'From GitHub': ['Public repository URL after GitHub connection', 'Connect GitHub'],
      'Blueprint URL': ['Blueprint URL', 'Run Blueprint'],
      'Import .zip': ['Local .zip bundle selected through the file chooser', 'Import .zip']
    };
    const selected = labels[type] || labels['WordPress PR'];
    startFieldLabel.textContent = selected[0];
    startAction.textContent = selected[1];
    openModal('start');
  }

  document.addEventListener('click', (event) => {
    const modalTrigger = event.target.closest('[data-open-modal]');
    if (modalTrigger) {
      openModal(modalTrigger.dataset.openModal);
    }

    const drawerTrigger = event.target.closest('[data-drawer]');
    if (drawerTrigger) {
      setDrawerTab(drawerTrigger.dataset.drawer);
    }

    const tab = event.target.closest('[data-tab]');
    if (tab) {
      setDrawerTab(tab.dataset.tab);
    }

    const section = event.target.closest('[data-section]');
    if (section) {
      document.querySelectorAll('.menu-item').forEach((item) => {
        item.classList.toggle('is-active', item === section);
      });
      const target = document.querySelector(`[data-section-panel="${section.dataset.section}"]`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    const start = event.target.closest('[data-start-type]');
    if (start) {
      setStartType(start.dataset.startType);
    }

    const tableRow = event.target.closest('.table-row:not(.table-head)');
    if (tableRow) {
      document.querySelectorAll('.table-row').forEach((row) => row.classList.remove('is-active'));
      tableRow.classList.add('is-active');
      if (drawerTitle && tableRow.textContent.includes('Research Browser')) {
        drawerTitle.textContent = 'Research Browser Playground';
      } else if (drawerTitle) {
        drawerTitle.textContent = 'Unsaved Playground';
      }
    }

    const filterButton = event.target.closest('.gallery-filters button');
    if (filterButton) {
      document.querySelectorAll('.gallery-filters button').forEach((button) => {
        button.classList.toggle('is-active', button === filterButton);
      });
    }

    const choice = event.target.closest('.choice');
    if (choice) {
      choice.parentElement.querySelectorAll('.choice').forEach((item) => {
        item.classList.toggle('is-selected', item === choice);
      });
    }
  });
})();
