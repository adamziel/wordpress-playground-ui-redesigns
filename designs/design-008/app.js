const modalButtons = document.querySelectorAll('[data-modal]');
const tabs = document.querySelectorAll('.tab');
const menus = document.querySelectorAll('[data-menu]');
const toast = document.getElementById('toast');
const saveConfirm = document.getElementById('saveConfirm');
const saveProgress = document.getElementById('saveProgress');
const topStatus = document.getElementById('topStatus');
const saveState = document.getElementById('saveState');

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2200);
}

modalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.modal);
    if (dialog && typeof dialog.showModal === 'function') {
      dialog.showModal();
    }
  });
});

document.querySelectorAll('[data-toast]').forEach((button) => {
  button.addEventListener('click', () => showToast(button.dataset.toast));
});

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab.active').forEach((active) => active.classList.remove('active'));
    document.querySelectorAll('.panel.active').forEach((active) => active.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

menus.forEach((button) => {
  button.addEventListener('click', (event) => {
    document.querySelectorAll('.floating-menu').forEach((menu) => {
      if (menu.id !== button.dataset.menu) {
        menu.hidden = true;
      }
    });
    const menu = document.getElementById(button.dataset.menu);
    const rect = event.currentTarget.getBoundingClientRect();
    menu.style.top = `${rect.bottom + 6}px`;
    menu.style.left = `${Math.min(rect.left, window.innerWidth - 190)}px`;
    menu.style.right = 'auto';
    menu.hidden = !menu.hidden;
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('[data-menu]') && !event.target.closest('.floating-menu')) {
    document.querySelectorAll('.floating-menu').forEach((menu) => {
      menu.hidden = true;
    });
  }
});

if (saveConfirm) {
  saveConfirm.addEventListener('click', (event) => {
    event.preventDefault();
    saveProgress.style.width = '18%';
    showToast('Saving 3028 / 3751 files');

    window.setTimeout(() => {
      saveProgress.style.width = '68%';
      showToast('Saving 3510 / 3751 files');
    }, 450);

    window.setTimeout(() => {
      saveProgress.style.width = '100%';
      topStatus.textContent = 'Saved Playground';
      topStatus.classList.remove('unsaved');
      topStatus.classList.add('saved');
      saveState.textContent = 'Saved in this browser a moment ago';
      document.getElementById('save').close();
      showToast('Playground saved in this browser');
    }, 950);
  });
}

document.querySelectorAll('.filters button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filters .active').forEach((active) => active.classList.remove('active'));
    button.classList.add('active');
  });
});
