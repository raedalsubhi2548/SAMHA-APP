"use strict";

function setupNavScroll() {
  const chips = document.querySelectorAll(".nav-chip");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const id = chip.getAttribute("data-target");
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      chips.forEach(c => c.classList.remove("is-active"));
      chip.classList.add("is-active");
    });
  });
}

function setupSectionReveal() {
  const sections = document.querySelectorAll(".section");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-in-view");
        }
      });
    },
    { threshold: 0.15 }
  );
  sections.forEach(section => observer.observe(section));
}

function setupParallax() {
  const elements = document.querySelectorAll("[data-parallax]");
  if (!elements.length) return;

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    elements.forEach(el => {
      const factor = parseFloat(el.getAttribute("data-parallax")) || 0;
      el.style.transform = "translateY(" + scrollY * factor * -1 + "px)";
    });
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll);
}

/* Hero slider removed - now using single static phone image */

function setupBannerSlider() {
  const shell = document.querySelector("[data-slider='banners']");
  if (!shell) return;

  const slides = shell.querySelectorAll(".banner-slide");
  const prevBtn = shell.querySelector("[data-banner-prev]");
  const nextBtn = shell.querySelector("[data-banner-next]");
  const dots = shell.querySelectorAll("[data-banner-dot]");
  let index = 0;
  let autoplayId;
  const AUTOPLAY_INTERVAL = 4000; // 4 seconds

  function activateSlide(newIndex) {
    index = (newIndex + slides.length) % slides.length;
    slides.forEach(slide => slide.classList.remove("is-active"));
    dots.forEach(dot => dot.classList.remove("is-active"));
    const activeSlide = shell.querySelector("[data-banner-index='" + index + "']");
    const activeDot = shell.querySelector("[data-banner-dot='" + index + "']");
    if (activeSlide) activeSlide.classList.add("is-active");
    if (activeDot) activeDot.classList.add("is-active");
  }

  function next() {
    activateSlide(index + 1);
  }

  function prev() {
    activateSlide(index - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(next, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayId) clearInterval(autoplayId);
  }

  // Arrow button events
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prev();
      startAutoplay();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      next();
      startAutoplay();
    });
  }

  // Dots navigation events
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const dotIndex = parseInt(dot.getAttribute("data-banner-dot"), 10);
      if (!isNaN(dotIndex)) {
        activateSlide(dotIndex);
        startAutoplay();
      }
    });
  });

  // Touch/Swipe support
  let startX = 0;
  let isSwiping = false;

  function onTouchStart(e) {
    isSwiping = true;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    stopAutoplay();
  }

  function onTouchMove(e) {
    if (!isSwiping) return;
    // Prevent default to avoid page scrolling during swipe
    if (e.cancelable) e.preventDefault();
  }

  function onTouchEnd(e) {
    if (!isSwiping) return;
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = endX - startX;
    const threshold = 50;
    
    // For RTL layout, swipe directions are reversed
    const isRTL = document.documentElement.dir === 'rtl';
    if (isRTL) {
      if (diff > threshold) next();
      if (diff < -threshold) prev();
    } else {
      if (diff > threshold) prev();
      if (diff < -threshold) next();
    }
    
    isSwiping = false;
    startAutoplay();
  }

  // Touch events for mobile
  shell.addEventListener("touchstart", onTouchStart, { passive: true });
  shell.addEventListener("touchmove", onTouchMove, { passive: false });
  shell.addEventListener("touchend", onTouchEnd);
  
  // Mouse events for desktop drag
  shell.addEventListener("mousedown", onTouchStart);
  shell.addEventListener("mousemove", (e) => {
    if (isSwiping) e.preventDefault();
  });
  window.addEventListener("mouseup", onTouchEnd);

  // Pause autoplay on hover (desktop)
  shell.addEventListener("mouseenter", stopAutoplay);
  shell.addEventListener("mouseleave", startAutoplay);

  // Start autoplay
  startAutoplay();
}

function setupFaq() {
  const items = document.querySelectorAll(".faq-item");
  items.forEach(item => {
    item.addEventListener("click", () => {
      const open = item.classList.contains("is-open");
      items.forEach(i => {
        i.classList.remove("is-open");
        const toggle = i.querySelector(".faq-toggle");
        if (toggle) toggle.textContent = "+";
      });
      if (!open) {
        item.classList.add("is-open");
        const toggle = item.querySelector(".faq-toggle");
        if (toggle) toggle.textContent = "−";
      }
    });
  });
}

function setupAutoScrollRow() {
  const container = document.querySelector(".reviews-shell .reviews-track");
  if (!container) return;

  const allCards = container.querySelectorAll(".review-card");
  allCards.forEach(card => {
    card.style.transform = "translateZ(0)";
  });
}

function setupRoadTimelineAnimation() {
  const steps = document.querySelectorAll(".road-step");
  if (!steps.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
        }
      });
    },
    { threshold: 0.2 }
  );

  steps.forEach(step => {
    step.style.animationPlayState = "paused";
    observer.observe(step);
  });
}

/* ========== نافذة اختيار المتجر (Store-selection modal) ========== */
// روابط المتاجر معرّفة هنا داخل الكود لمنع أي تلاعب من خلال DOM (XSS-safe)
const STORE_LINKS = {
  owner: {
    appstore: "https://apps.apple.com/sa/app/samha-owner/id6760688062?l=ar",
    googleplay: "https://play.google.com/store/apps/details?id=com.samha.owner",
  },
  customer: {
    appstore: "https://apps.apple.com/sa/app/samha/id6760321732",
    googleplay: "https://play.google.com/store/apps/details?id=com.samha.customer",
  },
};

function setupStoreModal() {
  const modal = document.getElementById("storeModal");
  if (!modal || modal.dataset.bound === "1") return;
  modal.dataset.bound = "1";
  const appstoreLink = modal.querySelector("[data-store-appstore]");
  const playLink = modal.querySelector("[data-store-googleplay]");

  // فتح النافذة بناءً على هوية التطبيق (owner / customer) من الزر
  document.querySelectorAll("[data-open-store-modal]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      const target = trigger.getAttribute("data-store-target");
      const links = Object.prototype.hasOwnProperty.call(STORE_LINKS, target)
        ? STORE_LINKS[target]
        : null;
      if (!links) return;
      if (appstoreLink) appstoreLink.setAttribute("href", links.appstore);
      if (playLink) playLink.setAttribute("href", links.googleplay);
      // إغلاق النافذة الأولى إن كانت مفتوحة
      const firstModal = document.getElementById("appModal");
      if (firstModal) firstModal.style.display = "none";
      modal.classList.add("is-open");
    });
  });

  // الإغلاق بالضغط على × أو خارج البطاقة
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.closest("[data-close-store-modal]")) {
      modal.classList.remove("is-open");
    }
  });

  // الإغلاق بمفتاح Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      modal.classList.remove("is-open");
    }
  });
}

function setupMobileNav() {
  const nav = document.querySelector(".header-nav");
  const toggle = document.querySelector(".nav-toggle");
  if (!nav || !toggle) return;

  const getFocusable = () =>
    Array.from(nav.querySelectorAll("a, button")).filter(
      el => el.offsetParent !== null || el === toggle
    );

  const closeNav = (focusToggle) => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    if (focusToggle) toggle.focus();
  };

  const openNav = () => {
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    const focusable = getFocusable();
    const firstLink = focusable.find(el => el !== toggle);
    if (firstLink) firstLink.focus();
  };

  toggle.addEventListener("click", () => {
    if (nav.classList.contains("is-open")) {
      closeNav(false);
    } else {
      openNav();
    }
  });

  // إغلاق القائمة عند الضغط على أي رابط داخلها
  nav.querySelectorAll(".nav-chip").forEach(link => {
    link.addEventListener("click", () => closeNav(false));
  });

  // إغلاق القائمة عند الضغط خارجها
  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (!nav.contains(event.target)) closeNav(false);
  });

  // إغلاق القائمة بمفتاح Escape + حصر التنقل (focus trap) داخل القائمة عند فتحها
  document.addEventListener("keydown", (event) => {
    if (!nav.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      closeNav(true);
      return;
    }

    if (event.key === "Tab") {
      const focusable = getFocusable();
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

  // إغلاق القائمة تلقائيًا عند تكبير الشاشة فوق نقطة التحول للجوال
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && nav.classList.contains("is-open")) {
      closeNav(false);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavScroll();
  setupSectionReveal();
  setupParallax();
  setupBannerSlider();
  setupFaq();
  setupAutoScrollRow();
  setupRoadTimelineAnimation();
  setupStoreModal();
  setupMobileNav();
});

