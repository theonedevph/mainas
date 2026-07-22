document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");
  const carouselElement = document.querySelector("#carouselExampleIndicators");
  let carouselInstance = null;

  function updateNavbar(id) {
    links.forEach((link) => {
      const isActive = link.dataset.target === id;
      link.classList.toggle("active", isActive);
    });

    const label = document.getElementById("current-section-label");
    if (label) {
      const labelMap = {
        home: "Home",
        quem: "Quem sou eu",
        contratos: "Serviços",
        agende: "Agende",
      };
      label.textContent = `Estamos em: ${labelMap[id] || "Home"}`;
    }
  }

  function getCurrentHomeAnchor() {
    const offset = 120;
    const scrollPosition = window.scrollY + offset;
    const quemAnchor = document.getElementById("quem");
    const contratosAnchor = document.getElementById("contratos");

    if (contratosAnchor && scrollPosition >= contratosAnchor.offsetTop) {
      return "contratos";
    }

    if (quemAnchor && scrollPosition >= quemAnchor.offsetTop) {
      return "quem";
    }

    return "home";
  }

  function handleScroll() {
    const activeSection = document.querySelector("section.active");
    if (activeSection && activeSection.id === "home") {
      const currentId = getCurrentHomeAnchor();
      updateNavbar(currentId);
    }
  }

  function show(id) {
    if (!id) return;

    const target = document.getElementById(id);

    if (!target) {
      console.warn("Seção não encontrada:", id);
      return;
    }

    const section = target.closest("section");
    sections.forEach((s) => s.classList.remove("active"));

    if (section) {
      section.classList.add("active");
    } else {
      const homeSection = document.getElementById("home");
      if (homeSection) {
        homeSection.classList.add("active");
      }
    }

    if (target.closest("#home")) {
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }

    updateNavbar(id);

    // Controlar carrossel
    if (id === "home") {
      if (carouselInstance) {
        carouselInstance.cycle();
      }
    } else {
      if (carouselInstance) {
        carouselInstance.pause();
      }
    }
  }

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const target = link.dataset.target;

      show(target);

      const nav = document.querySelector(".navbar-collapse");
      if (nav && nav.classList.contains("show")) {
        nav.classList.remove("show");
      }
    });
  });

  // Handle main-btn clicks
  document.querySelectorAll(".main-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const href = btn.getAttribute("href");
      if (href && href.startsWith("#")) {
        const target = href.substring(1);
        show(target);
      }
    });
  });

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      const emailInput = contactForm.querySelector("#email");
      const emailValue = emailInput ? emailInput.value.trim() : "";
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

      if (!emailValid) {
        event.preventDefault();
        alert("Por favor, insira um e-mail válido para receber a mensagem.");
        return;
      }

      const replyField = document.getElementById("_replyto");
      if (replyField) {
        replyField.value = emailValue;
      }
      contactForm.action = `https://formsubmit.co/${encodeURIComponent(emailValue)}`;
    });
  }

  show("home");
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Inicializar carrossel com Bootstrap
  if (carouselElement && window.bootstrap) {
    carouselInstance = bootstrap.Carousel.getOrCreateInstance(carouselElement, {
      interval: 3000,
      wrap: true,
      ride: "carousel",
    });
  }
});
// Removido: showSlides(slideIndex) quebrava o script quando a função não existe.
// var slideIndex = 1;
// showSlides(slideIndex);

function collapseCard(card) {
  const btn = card.querySelector(".btn-toggle");
  const toggleContent = card.querySelector(".toggle-content");
  if (!toggleContent) return;

  const currentHeight = toggleContent.scrollHeight;
  toggleContent.style.maxHeight = currentHeight + "px";
  toggleContent.style.opacity = "1";
  toggleContent.style.transform = "translateY(0)";

  void toggleContent.offsetHeight;

  toggleContent.style.maxHeight = "0";
  toggleContent.style.opacity = "0";
  toggleContent.style.transform = "translateY(-10px)";
  card.classList.add("collapsed");
  if (btn) btn.textContent = "Saiba Mais ↓";

  toggleContent.addEventListener("transitionend", function handler(event) {
    if (event.propertyName === "max-height") {
      toggleContent.style.maxHeight = "";
      toggleContent.removeEventListener("transitionend", handler);
    }
  });
}

function expandCard(card) {
  const btn = card.querySelector(".btn-toggle");
  const toggleContent = card.querySelector(".toggle-content");
  if (!toggleContent) return;

  document
    .querySelectorAll(".service-card:not(.collapsed)")
    .forEach((otherCard) => {
      if (otherCard !== card) {
        collapseCard(otherCard);
      }
    });

  card.classList.remove("collapsed");
  toggleContent.style.opacity = "1";
  toggleContent.style.transform = "translateY(0)";
  const scrollHeight = toggleContent.scrollHeight;
  toggleContent.style.maxHeight = scrollHeight + "px";

  if (btn) btn.textContent = "Recolher ↑";

  setTimeout(() => {
    if (!card.classList.contains("collapsed")) {
      toggleContent.style.maxHeight = "none";
    }
  }, 450);
}

function toggleCard(btn) {
  const card = btn.closest(".service-card");
  if (!card) return;

  if (card.classList.contains("collapsed")) {
    expandCard(card);
  } else {
    collapseCard(card);
  }
}

document.querySelectorAll(".card-hea").forEach((header) => {
  header.addEventListener("click", () => {
    const currentItem = header.parentElement;
    const isActive = currentItem.classList.contains("active");
    const currentBody = currentItem.querySelector(".card-s");

    document.querySelectorAll(".card-r").forEach((item) => {
      if (item !== currentItem) {
        item.classList.remove("active");
        item.querySelector(".card-s").style.maxHeight = null;
      }
    });

    // Toggle behavior for the sobre-grid dark cards (first card and left card)
    function toggleSobreCard(card) {
      const section = card.querySelector("section");
      if (!section) return;

      // ensure basic inline styles for transition exist
      section.style.overflow = "hidden";
      section.style.transition =
        section.style.transition ||
        "max-height 0.35s ease, opacity 0.25s ease, transform 0.35s ease";

      if (card.classList.contains("open")) {
        // collapse
        section.style.maxHeight = "0";
        section.style.opacity = "0";
        card.classList.remove("open");
      } else {
        // expand fully (show all content)
        const full = section.scrollHeight;
        section.style.maxHeight = full + "px";
        section.style.opacity = "1";
        card.classList.add("open");
        // after transition, remove maxHeight to allow responsive content
        setTimeout(() => {
          if (card.classList.contains("open")) section.style.maxHeight = "none";
        }, 400);
      }
    }

    // Attach to first sobre-grid card
    const firstSobre = document.querySelector(".sobre-grid .card.dark");
    if (firstSobre) {
      firstSobre.addEventListener("click", (e) => {
        // ignore clicks on inner interactive elements
        if (e.target.closest("button") || e.target.closest("a")) return;
        toggleSobreCard(firstSobre);
      });
    }

    // Attach to left card inside sobre-grid2
    const leftSobre2 = document.querySelector(
      ".sobre-grid2 .sobre-col.esquerda2 .card.dark",
    );
    if (leftSobre2) {
      leftSobre2.addEventListener("click", (e) => {
        if (e.target.closest("button") || e.target.closest("a")) return;
        toggleSobreCard(leftSobre2);
      });
    }

    // Toggle the clicked card: if it is not active, activate it; otherwise collapse it.
    if (!isActive) {
      if (currentBody) {
        currentItem.classList.add("active");
        currentBody.style.maxHeight = currentBody.scrollHeight + "px";
      } else {
        currentItem.classList.add("active");
      }
    } else {
      if (currentBody) {
        currentBody.style.maxHeight = null;
      }
      currentItem.classList.remove("active");
    }
  });
});
