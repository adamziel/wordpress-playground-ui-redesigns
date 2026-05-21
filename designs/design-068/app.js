const app = document.querySelector('.app');
const navLinks = document.querySelectorAll('[data-nav]');
const panels = document.querySelectorAll('[data-panel]');
const dialogs = document.querySelectorAll('.dialog-backdrop');

function setView(view) {
  app.dataset.view = view;
  panels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.panel === view);
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.nav === view);
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    setView(link.dataset.nav);
  });
});

document.querySelectorAll('[data-view-target]').forEach((button) => {
  button.addEventListener('click', () => setView(button.dataset.viewTarget));
});

document.querySelectorAll('[data-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    const tab = button.dataset.tab;
    const shell = button.closest('.manager-shell');
    shell.querySelectorAll('[data-tab]').forEach((item) => {
      item.classList.toggle('active', item.dataset.tab === tab);
    });
    shell.querySelectorAll('[data-tab-panel]').forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.tabPanel === tab);
    });
  });
});

document.querySelectorAll('[data-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.dialog);
    if (dialog) {
      dialog.hidden = false;
    }
  });
});

document.querySelectorAll('[data-close-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    button.closest('.dialog-backdrop').hidden = true;
  });
});

dialogs.forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.hidden = true;
    }
  });
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    dialogs.forEach((dialog) => {
      dialog.hidden = true;
    });
  }
});
