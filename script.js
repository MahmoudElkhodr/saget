document.addEventListener("DOMContentLoaded", () => {

  // ── Mobile menu toggle ────────────────────────────

  const header  = document.querySelector(".site-header");
  const toggle  = document.querySelector("[data-menu-toggle]");
  const closeBtn = document.querySelector("[data-menu-close]");
  const nav     = document.querySelector("[data-menu]");

  if (toggle && nav) {
    const setMenuState = (open) => {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };

    setMenuState(false);

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("open");
      setMenuState(!isOpen);
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => setMenuState(false));
    }

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) setMenuState(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setMenuState(false);
        toggle.focus();
      }
    });
  }

  // ── Service sub-nav scroll tracking ─────────────

  const subnav = document.querySelector(".service-subnav");
  if (subnav) {
    const subnavLinks = subnav.querySelectorAll(".subnav-link:not(.subnav-cta)");
    const sectionIds = Array.from(subnavLinks).map(a => a.getAttribute("href").replace("#", "")).filter(Boolean);

    const updateActiveLink = () => {
      const offset = 160;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) current = id;
      }
      subnavLinks.forEach(link => {
        const href = link.getAttribute("href").replace("#", "");
        link.classList.toggle("active", href === current);
      });
    };

    window.addEventListener("scroll", updateActiveLink, { passive: true });
    updateActiveLink();
  }

  // ── Rotating word animation (hero tagline) ─────

  const words = document.querySelectorAll(".rotating-word");
  if (words.length > 1) {
    let currentIndex = 0;
    setInterval(() => {
      words[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % words.length;
      words[currentIndex].classList.add("active");
    }, 2200);
  }

  // ── Auto-fill copyright year ──────────────────────

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  // ── Consultation form → mailto ────────────────────
  // Fields: name, organisation, email, interest, message

  document.querySelectorAll("[data-consultation-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData   = new FormData(form);
      const getValue   = (name) => String(formData.get(name) || "").trim();
      const submitTo   = form.getAttribute("data-submit-to") || "m.elkhodr@cqu.edu.au";
      const source     = form.getAttribute("data-form-source") || document.title;
      const org        = getValue("organisation") || "Organisation not provided";
      const subject    = encodeURIComponent(`SAGET Enquiry — ${org}`);

      const bodyLines = [
        "SAGET consultation request",
        "",
        `Source:        ${source}`,
        `Name:          ${getValue("name")}`,
        `Organisation:  ${getValue("organisation")}`,
        `Email:         ${getValue("email")}`,
        `Interest:      ${getValue("interest") || "Not specified"}`,
        "",
        "Message:",
        getValue("message") || "Not provided",
      ];

      window.location.href =
        `mailto:${submitTo}?subject=${subject}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    });
  });

});
