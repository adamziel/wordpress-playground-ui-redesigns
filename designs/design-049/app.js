const tabButtons = document.querySelectorAll('[data-tab-target]');
const panels = document.querySelectorAll('.tab-panel');
const managerButtons = document.querySelectorAll('[data-manager-target]');
const managerPanels = document.querySelectorAll('.manager-panel');
const toast = document.querySelector('.toast');
let toastTimer;

function showToast(message) {
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 1800);
}

function activateTab(id) {
  panels.forEach((panel) => panel.classList.toggle('active', panel.id === id));
  document.querySelectorAll('.workspace-tabs .tab').forEach((button) => {
    button.classList.toggle('active', button.dataset.tabTarget === id);
  });
  const panel = document.getElementById(id);
  if (panel) {
    panel.scrollIntoView({ block: 'start' });
  }
}

tabButtons.forEach((button) => {
  button.addEventListener('click', () => activateTab(button.dataset.tabTarget));
});

managerButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const id = button.dataset.managerTarget;
    managerButtons.forEach((item) => item.classList.toggle('active', item === button));
    managerPanels.forEach((panel) => panel.classList.toggle('active', panel.id === id));
  });
});

document.querySelectorAll('[data-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.dialog);
    if (dialog?.showModal) dialog.showModal();
  });
});

document.querySelectorAll('[data-toast]').forEach((button) => {
  button.addEventListener('click', () => showToast(button.dataset.toast));
});

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    showToast(`${button.textContent.trim()} blueprints shown`);
  });
});

document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    const box = dialog.querySelector('.dialog-card');
    if (box && !box.contains(event.target)) dialog.close();
  });
});
