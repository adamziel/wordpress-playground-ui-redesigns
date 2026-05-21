const navButtons = document.querySelectorAll("[data-section]");
const sections = document.querySelectorAll(".panel-section");
const saveDialog = document.getElementById("save-dialog");

function showSection(sectionId) {
  sections.forEach((section) => {
    section.classList.toggle("is-visible", section.id === sectionId);
  });

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.section === sectionId);
  });
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.section) {
      showSection(button.dataset.section);
    }
  });
});

document.querySelectorAll("[data-dialog='save']").forEach((button) => {
  button.addEventListener("click", () => {
    if (typeof saveDialog.showModal === "function") {
      saveDialog.showModal();
    }
  });
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const group = chip.closest(".blueprint-toolbar, .log-tabs");
    if (!group) return;
    group.querySelectorAll(".chip").forEach((item) => item.classList.remove("is-active"));
    chip.classList.add("is-active");
  });
});
