const dialogButtons = document.querySelectorAll("[data-dialog]");
const navButtons = document.querySelectorAll("[data-target]");
const categoryButtons = document.querySelectorAll("[data-filter]");
const tabButtons = document.querySelectorAll("[data-tab]");

dialogButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.dialog);
    if (!dialog) return;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  });
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.target);
    if (!target) return;

    navButtons.forEach((candidate) => {
      candidate.classList.toggle("is-active", candidate.dataset.target === button.dataset.target);
    });

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.focus?.({ preventScroll: true });
  });
});

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    categoryButtons.forEach((candidate) => candidate.classList.toggle("is-active", candidate === button));

    document.querySelectorAll(".blueprint-card").forEach((card) => {
      const categories = card.dataset.category || "";
      card.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;
    tabButtons.forEach((candidate) => candidate.classList.toggle("is-active", candidate === button));
    document.querySelectorAll("[data-panel]").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === tab);
    });
  });
});

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});
