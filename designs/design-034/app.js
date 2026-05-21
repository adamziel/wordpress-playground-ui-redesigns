const viewButtons = document.querySelectorAll('[data-view]');
const panels = document.querySelectorAll('[data-view-panel]');
const navItems = document.querySelectorAll('.nav-item');
const modalLayer = document.getElementById('modalLayer');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
const toast = document.getElementById('toast');
const blueprintCards = document.querySelectorAll('.blueprint-card');
const selectedTitle = document.getElementById('selectedTitle');
const selectedCopy = document.getElementById('selectedCopy');
const filters = document.querySelectorAll('.filter');
const search = document.getElementById('blueprintSearch');

function showView(name) {
  panels.forEach((panel) => panel.classList.toggle('is-visible', panel.dataset.viewPanel === name));
  navItems.forEach((item) => item.classList.toggle('is-active', item.dataset.view === name));
}

function openModal(id) {
  const template = document.getElementById(id);
  if (!template) return;
  modalContent.innerHTML = '';
  modalContent.append(template.content.cloneNode(true));
  modalLayer.classList.add('is-open');
  modalLayer.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modalLayer.classList.remove('is-open');
  modalLayer.setAttribute('aria-hidden', 'true');
}

let toastTimer;
function showToast(message) {
  if (!message) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

viewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.view) showView(button.dataset.view);
  });
});

document.addEventListener('click', (event) => {
  const modalButton = event.target.closest('[data-modal]');
  if (modalButton) openModal(modalButton.dataset.modal);

  const toastButton = event.target.closest('[data-toast]');
  if (toastButton) showToast(toastButton.dataset.toast);

  if (event.target.closest('[data-close]')) closeModal();
});

modalClose.addEventListener('click', closeModal);
modalLayer.addEventListener('click', (event) => {
  if (event.target === modalLayer) closeModal();
});

blueprintCards.forEach((card) => {
  card.addEventListener('click', () => selectBlueprint(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectBlueprint(card);
    }
  });
});

function selectBlueprint(card) {
  blueprintCards.forEach((item) => item.classList.remove('is-selected'));
  card.classList.add('is-selected');
  selectedTitle.textContent = card.dataset.title;
  selectedCopy.textContent = card.querySelector('p').textContent;
}

let activeFilter = 'all';
filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    filters.forEach((item) => item.classList.remove('is-active'));
    filter.classList.add('is-active');
    activeFilter = filter.dataset.filter;
    applyBlueprintFilters();
  });
});

search.addEventListener('input', applyBlueprintFilters);

function applyBlueprintFilters() {
  const query = search.value.trim().toLowerCase();
  blueprintCards.forEach((card) => {
    const matchesFilter = activeFilter === 'all' || card.dataset.tags.includes(activeFilter);
    const matchesQuery = !query || card.dataset.title.toLowerCase().includes(query) || card.textContent.toLowerCase().includes(query);
    card.hidden = !(matchesFilter && matchesQuery);
  });
}

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((item) => item.classList.remove('is-active'));
    document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.remove('is-visible'));
    tab.classList.add('is-active');
    document.querySelector(`[data-tab-panel="${tab.dataset.tab}"]`).classList.add('is-visible');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modalLayer.classList.contains('is-open')) closeModal();
});
