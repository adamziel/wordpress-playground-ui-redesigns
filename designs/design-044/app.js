const panelButtons = document.querySelectorAll('[data-panel]');
const panels = document.querySelectorAll('.navigator .panel');
const editorTabs = document.querySelectorAll('[data-editor]');
const editorViews = document.querySelectorAll('.editor-view');
const overlay = document.querySelector('.overlay');

function closeSurfaces() {
  document.querySelectorAll('.drawer.open, .modal.open').forEach((surface) => {
    surface.classList.remove('open');
    surface.setAttribute('aria-hidden', 'true');
  });
  document.body.classList.remove('has-drawer');
  overlay.hidden = true;
}

function openSurface(id) {
  const surface = document.getElementById(id);
  if (!surface) return;
  if (surface.classList.contains('modal')) {
    document.querySelectorAll('.modal.open').forEach((modal) => modal.classList.remove('open'));
  } else {
    document.querySelectorAll('.drawer.open').forEach((drawer) => drawer.classList.remove('open'));
    document.body.classList.add('has-drawer');
    overlay.hidden = false;
  }
  surface.classList.add('open');
  surface.setAttribute('aria-hidden', 'false');
}

panelButtons.forEach((button) => {
  button.addEventListener('click', () => {
    panelButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    panels.forEach((panel) => panel.classList.toggle('active', panel.id === `${button.dataset.panel}-panel`));
  });
});

editorTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    editorTabs.forEach((item) => item.classList.remove('active'));
    tab.classList.add('active');
    editorViews.forEach((view) => view.classList.toggle('active', view.id === `${tab.dataset.editor}-view`));
  });
});

document.addEventListener('click', (event) => {
  const openButton = event.target.closest('[data-open]');
  const closeButton = event.target.closest('[data-close]');

  if (openButton) {
    openSurface(openButton.dataset.open);
  }

  if (closeButton || event.target === overlay || event.target.classList.contains('modal')) {
    closeSurfaces();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeSurfaces();
  }
});
