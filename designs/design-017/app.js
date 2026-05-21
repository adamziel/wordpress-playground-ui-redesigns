const outlineLinks = Array.from(document.querySelectorAll(".outline-nav a"));
const sections = outlineLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) {
      return;
    }

    outlineLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.4, 0.7] }
);

sections.forEach((section) => observer.observe(section));

document.querySelectorAll(".filter-row button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-row button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

document.querySelectorAll(".choice input").forEach((input) => {
  input.addEventListener("change", () => {
    document.querySelectorAll(".choice").forEach((choice) => choice.classList.remove("selected"));
    input.closest(".choice").classList.add("selected");
  });
});
