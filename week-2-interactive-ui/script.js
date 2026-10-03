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
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    panels.forEach(panel => panel.classList.add("hidden"));

    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    const panel = document.getElementById(tab.getAttribute("aria-controls"));
    panel.classList.remove("hidden");
  });

  tab.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = (index + direction + tabs.length) % tabs.length;
      tabs[next].focus();
      tabs[next].click();
    }
  });
});
document.querySelectorAll(".accordion-trigger").forEach(trigger => {
  trigger.addEventListener("click", () => {
    const panel = document.getElementById(trigger.getAttribute("aria-controls"));
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!expanded));
    trigger.querySelector("span").textContent = expanded ? "+" : "−";
    panel.hidden = expanded;
  });
});
const modal = document.getElementById("demoModal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const modalDone = document.getElementById("modalDone");
const modalBackdrop = document.getElementById("modalBackdrop");

function showModal() {
  modal.hidden = false;
  document.body.classList.add("modal-open");
  closeModal.focus();
}

function hideModal() {
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  openModal.focus();
}

openModal.addEventListener("click", showModal);
closeModal.addEventListener("click", hideModal);
modalDone.addEventListener("click", hideModal);
modalBackdrop.addEventListener("click", hideModal);

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !modal.hidden) {
    hideModal();
    return;
  }
  if (event.key === "Tab" && !modal.hidden) {
    const focusable = modal.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
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
