const panels = document.querySelectorAll('.panel');

panels.forEach((panel) => {
  const toggle = panel.querySelector('.panel-toggle');
  toggle?.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
});

document.querySelectorAll('[data-panel-target]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.panelTarget);
    if (!target) return;
    target.classList.add('open');
    target.querySelector('.panel-toggle')?.setAttribute('aria-expanded', 'true');
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.querySelectorAll('[data-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.dialog);
    if (dialog?.showModal) {
      dialog.showModal();
    }
  });
});

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const name = tab.dataset.tab;
    document.querySelectorAll('.tab').forEach((item) => {
      item.classList.toggle('active', item.dataset.tab === name);
    });
    document.querySelectorAll('.tab-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.tabPanel === name);
    });
  });
});

document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;
    document.querySelectorAll('.chip').forEach((item) => {
      item.classList.toggle('active', item === chip);
    });
    document.querySelectorAll('.blueprint-row').forEach((row) => {
      const tags = row.dataset.tags || '';
      row.hidden = filter !== 'all' && !tags.includes(filter);
    });
  });
});
