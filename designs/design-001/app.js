const modeButtons = document.querySelectorAll('[data-mode]');
const panels = document.querySelectorAll('[data-panel]');
const railButtons = document.querySelectorAll('.rail-item');
const dialogLayer = document.querySelector('.dialog-layer');
const dialogContent = document.querySelector('[data-dialog-content]');

function setMode(mode) {
  panels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.panel === mode);
  });
  railButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === mode);
  });
}

modeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const mode = button.dataset.mode;
    if (mode) setMode(mode);
  });
});

document.querySelectorAll('[data-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    const tab = button.dataset.tab;
    document.querySelectorAll('[data-tab]').forEach((item) => item.classList.toggle('active', item === button));
    document.querySelectorAll('[data-tab-panel]').forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.tabPanel === tab);
    });
  });
});

document.querySelectorAll('[data-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    const template = document.querySelector(`#dialog-${button.dataset.dialog}`);
    if (!template) return;
    dialogContent.innerHTML = '';
    dialogContent.append(template.content.cloneNode(true));
    dialogLayer.hidden = false;
  });
});

document.querySelector('.close').addEventListener('click', () => {
  dialogLayer.hidden = true;
});

dialogLayer.addEventListener('click', (event) => {
  if (event.target === dialogLayer) {
    dialogLayer.hidden = true;
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    dialogLayer.hidden = true;
  }
});

document.querySelectorAll('[data-menu]').forEach((button) => {
  button.addEventListener('click', () => {
    const menu = document.getElementById(button.dataset.menu);
    if (menu) menu.hidden = !menu.hidden;
  });
});

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((item) => item.classList.toggle('active', item === button));
    document.querySelectorAll('.gallery-card').forEach((card) => {
      const tags = card.dataset.tags || '';
      card.hidden = filter !== 'all' && !tags.includes(filter);
    });
  });
});
