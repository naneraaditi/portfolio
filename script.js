const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");
const headerLinks = document.querySelectorAll('.header a[href^="#"]');
const revealElements = document.querySelectorAll(".reveal");
const backToTop = document.getElementById("backToTop");
const progressBars = document.querySelectorAll(".progress-fill");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const typingText = document.getElementById("typingText");
const currentYear = document.getElementById("currentYear");
const header = document.querySelector(".header");
const sections = [...document.querySelectorAll("section[id]")];

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

headerLinks.forEach((item) => {
  item.addEventListener("click", (event) => {
    const targetId = item.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop =
        targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });

      setActiveLink(targetId.replace("#", ""));
      window.history.pushState(null, "", targetId);
    }

    navLinks.classList.remove("open");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");

        const fills = entry.target.querySelectorAll(".progress-fill");
        fills.forEach((fill) => {
          fill.style.width = fill.dataset.width;
        });

        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -60px",
  },
);

revealElements.forEach((el) => revealObserver.observe(el));

let sectionPositions = [];
let activeSectionId = "home";
let isBackToTopVisible = false;
let scrollTicking = false;
let resizeTimer;

function refreshSectionPositions() {
  sectionPositions = sections.map((section) => ({
    id: section.getAttribute("id"),
    top: section.offsetTop - 140,
    bottom: section.offsetTop + section.offsetHeight - 140,
  }));

  updateScrollState();
}

function setActiveLink(sectionId) {
  if (sectionId === activeSectionId) return;

  activeSectionId = sectionId;
  navItems.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${sectionId}`,
    );
  });
}

function updateScrollState() {
  const scrollY = window.scrollY;
  let currentSectionId = "home";

  sectionPositions.forEach((section) => {
    if (scrollY >= section.top && scrollY < section.bottom) {
      currentSectionId = section.id;
    }
  });

  setActiveLink(currentSectionId);

  const shouldShowBackToTop = scrollY > 300;
  if (shouldShowBackToTop !== isBackToTopVisible) {
    isBackToTopVisible = shouldShowBackToTop;
    backToTop.classList.toggle("show", shouldShowBackToTop);
  }

  scrollTicking = false;
}

function requestScrollUpdate() {
  if (scrollTicking) return;

  scrollTicking = true;
  requestAnimationFrame(updateScrollState);
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener(
  "resize",
  () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refreshSectionPositions, 120);
  },
  { passive: true },
);
window.addEventListener("load", refreshSectionPositions);

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      formMessage.textContent = "Please fill in all fields.";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formMessage.textContent = "Please enter a valid email address.";
      return;
    }

    formMessage.textContent =
      "Thank you. Your message has been captured successfully.";
    contactForm.reset();
  });
}

const typingPhrases = [
  "Designing thoughtful spaces with creativity and precision.",
  "An architecture student focused on detail and visual clarity.",
  "Turning ideas into structured and meaningful design.",
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  if (!typingText) return;

  const currentPhrase = typingPhrases[phraseIndex];
  const currentText = currentPhrase.substring(0, charIndex);
  typingText.textContent = currentText;

  if (!isDeleting && charIndex < currentPhrase.length) {
    charIndex++;
    setTimeout(typeEffect, 55);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeEffect, 30);
  } else {
    if (!isDeleting) {
      isDeleting = true;
      setTimeout(typeEffect, 1400);
    } else {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      setTimeout(typeEffect, 250);
    }
  }
}

typeEffect();
refreshSectionPositions();
