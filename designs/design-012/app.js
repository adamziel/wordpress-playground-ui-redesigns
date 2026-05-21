const steps = document.querySelectorAll('[data-step]');
const stepButtons = document.querySelectorAll('.step');
const panels = document.querySelectorAll('.panel-screen');
const managerTabs = document.querySelectorAll('.manager-tab');
const managerPanes = document.querySelectorAll('.manager-pane');
const modalBackdrop = document.querySelector('.modal-backdrop');
const modalContent = document.querySelector('#modal-content');
const modalClose = document.querySelector('.modal-close');

function showStep(stepName) {
  panels.forEach((panel) => {
    panel.classList.toggle('is-active', panel.id === `panel-${stepName}`);
  });

  stepButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.step === stepName);
  });
}

function showManagerTab(tabName) {
  managerTabs.forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.managerTab === tabName);
  });
  managerPanes.forEach((pane) => {
    pane.classList.toggle('is-active', pane.id === `manager-${tabName}`);
  });
}

function openModal(name) {
  const template = document.querySelector(`#modal-${name}`);
  if (!template) return;
  modalContent.replaceChildren(template.content.cloneNode(true));
  modalBackdrop.hidden = false;
  const focusTarget = modalContent.querySelector('input, button');
  if (focusTarget) focusTarget.focus();
}

function closeModal() {
  modalBackdrop.hidden = true;
  modalContent.replaceChildren();
}

document.addEventListener('click', (event) => {
  const stepTrigger = event.target.closest('[data-step]');
  if (stepTrigger) {
    showStep(stepTrigger.dataset.step);
  }

  const modalTrigger = event.target.closest('[data-modal]');
  if (modalTrigger) {
    openModal(modalTrigger.dataset.modal);
  }

  const startTrigger = event.target.closest('[data-start="vanilla"]');
  if (startTrigger) {
    showStep('save');
  }

  const managerTrigger = event.target.closest('[data-manager-tab]');
  if (managerTrigger) {
    showManagerTab(managerTrigger.dataset.managerTab);
  }

  if (event.target.matches('.modal-cancel')) {
    closeModal();
  }
});

modalClose.addEventListener('click', closeModal);

modalBackdrop.addEventListener('click', (event) => {
  if (event.target === modalBackdrop) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modalBackdrop.hidden) {
    closeModal();
  }
});
