const menuToggle = document.getElementById("menuToggle");
const primaryMenu = document.getElementById("primaryMenu");

menuToggle.addEventListener("click", () => {
  const isOpen = primaryMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
});

document.querySelectorAll("#primaryMenu a").forEach((link) => {
  link.addEventListener("click", () => {
    primaryMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetHref = link.getAttribute("href");
    if (!targetHref || targetHref === "#") return;

    if (targetHref === "#top") {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
      if (window.location.hash) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      return;
    }

    const targetEl = document.querySelector(targetHref);
    if (targetEl) {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      targetEl.setAttribute("tabindex", "-1");
      targetEl.focus({ preventScroll: true });
      history.pushState(null, "", targetHref);
    }
  });
});