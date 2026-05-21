const notice = document.querySelector("#notice");

function showNotice(message) {
  notice.textContent = message;
  notice.animate(
    [
      { transform: "translateY(10px)", opacity: 0 },
      { transform: "translateY(0)", opacity: 1 },
    ],
    { duration: 180, easing: "ease-out" }
  );
}

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(`#${button.dataset.jump}`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-notice]").forEach((button) => {
  button.addEventListener("click", () => showNotice(button.dataset.notice));
});

document.querySelectorAll("[data-route]").forEach((button) => {
  button.addEventListener("click", () => {
    const route = button.dataset.route;
    document.querySelectorAll(".route-card").forEach((card) => {
      card.classList.toggle("selected", card.dataset.routeCard === route);
    });
    document.querySelector("#route-result").textContent =
      `${route} will start with WP latest, PHP 8.3, English, network allowed. Import and reset consequences remain visible before the run.`;
    document.querySelector("#flow-source").textContent = route;
    showNotice(`Launch route selected: ${route}`);
  });
});

document.querySelectorAll("[data-destination]").forEach((button) => {
  button.addEventListener("click", () => {
    const destination = button.dataset.destination;
    document.querySelectorAll(".destination-tabs button").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.destination === destination);
    });
    document.querySelectorAll(".destination-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.id === `destination-${destination}`);
    });
    showNotice(destination === "browser" ? "Browser storage destination selected" : "Local directory destination selected");
  });
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((tab) => tab.classList.toggle("active", tab === button));
    document.querySelectorAll(".catalog-row").forEach((row) => {
      const tags = row.dataset.tags || "";
      row.hidden = filter !== "All" && !tags.includes(filter);
    });
    showNotice(`Blueprint category filter: ${filter}`);
  });
});

document.querySelectorAll(".catalog-row").forEach((row) => {
  row.addEventListener("click", () => {
    document.querySelectorAll(".catalog-row").forEach((item) => item.classList.toggle("selected", item === row));
    const name = row.dataset.blueprint;
    const description = row.querySelector("small")?.textContent || "Blueprint detail selected.";
    document.querySelector("#blueprint-name").textContent = name;
    document.querySelector("#blueprint-description").textContent = description;
    showNotice(`Blueprint selected: ${name}`);
  });
});

document.querySelectorAll("[data-shortcut]").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.shortcut;
    document.querySelector("#blueprints")?.scrollIntoView({ behavior: "smooth", block: "start" });
    const row = [...document.querySelectorAll(".catalog-row")].find((item) => item.dataset.blueprint === name);
    row?.click();
    showNotice(`Featured Blueprint shortcut selected: ${name}`);
  });
});
