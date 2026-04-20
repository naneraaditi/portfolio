const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");
const revealElements = document.querySelectorAll(".reveal");
const backToTop = document.getElementById("backToTop");
const progressBars = document.querySelectorAll(".progress-fill");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const typingText = document.getElementById("typingText");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
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
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((el) => revealObserver.observe(el));

const sections = document.querySelectorAll("section[id]");

function updateActiveLink() {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 130;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navItems.forEach((link) => link.classList.remove("active"));
      const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      if (activeLink) activeLink.classList.add("active");
    }
  });
}

window.addEventListener("scroll", () => {
  updateActiveLink();

  if (window.scrollY > 300) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

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

    if (!name  !email  !message) {
      formMessage.textContent = "Please fill in all fields.";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formMessage.textContent = "Please enter a valid email address.";
      return;
    }

    formMessage.textContent = "Thank you. Your message has been captured successfully.";
    contactForm.reset();
  });
}

const typingPhrases = [
  "Designing thoughtful spaces with creativity and precision.",
  "An architecture student focused on detail and visual clarity.",
  "Turning ideas into structured and meaningful design."
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
updateActiveLink();
