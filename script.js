document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const open = navigation.classList.toggle('open');

      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute(
        'aria-label',
        open ? 'Close navigation' : 'Open navigation'
      );
    });

    document.querySelectorAll('.main-nav a').forEach((link) => {
      link.addEventListener('click', () => {
        navigation.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
      });
    });

    document.addEventListener('click', (event) => {
      if (
        navigation.classList.contains('open') &&
        !navigation.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        navigation.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
      }
    });
  }

  // Active navigation link
  const sections = [
    ...document.querySelectorAll('main section[id], header[id]')
  ];

  const navLinks = [
    ...document.querySelectorAll('.main-nav a')
  ];

  const updateActiveLink = () => {
    if (!sections.length || !navLinks.length) return;

    const current = sections.reduce((active, section) => {
      return window.scrollY >= section.offsetTop - 180
        ? section.id
        : active;
    }, 'home');

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', isActive);
    });
  };

  // General scroll reveal animation
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px 80px 0px'
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add('visible');
    });
  }

  // Gallery left-to-right reveal animation
  const galleryItems = document.querySelectorAll('.gallery-reveal');

  if ('IntersectionObserver' in window) {
    const galleryObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px 120px 0px'
      }
    );

    galleryItems.forEach((item) => {
      galleryObserver.observe(item);
    });
  } else {
    galleryItems.forEach((item) => {
      item.classList.add('is-visible');
    });
  }

  // Safety fallback: prevent gallery from remaining blank
  if (galleryItems.length) {
    window.setTimeout(() => {
      galleryItems.forEach((item) => {
        if (!item.classList.contains('is-visible')) {
          item.classList.add('is-visible');
        }
      });
    }, 1500);
  }

  // Gallery scroll progress
  const galleryRail = document.querySelector('.gallery-rail');
  const galleryProgress = document.querySelector(
    '.gallery-progress span'
  );

  const updateGalleryProgress = () => {
    if (!galleryRail || !galleryProgress) return;

    const maxScroll =
      galleryRail.scrollWidth - galleryRail.clientWidth;

    const progress =
      maxScroll > 0 ? galleryRail.scrollLeft / maxScroll : 1;

    const scale = Math.max(0.18, Math.min(1, progress));

    galleryProgress.style.transform = `scaleX(${scale})`;
  };

  if (galleryRail && galleryProgress) {
    galleryRail.addEventListener(
      'scroll',
      updateGalleryProgress,
      { passive: true }
    );

    window.addEventListener(
      'resize',
      updateGalleryProgress,
      { passive: true }
    );

    updateGalleryProgress();
  }

 // Contact form - send enquiries to WhatsApp
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const status = form.querySelector('.form-status');

    const name = form.querySelector('[name="name"]')?.value.trim() || '';
    const email = form.querySelector('[name="email"]')?.value.trim() || '';
    const interest =
      form.querySelector('[name="interest"]')?.value.trim() ||
      'General enquiry';
    const message =
      form.querySelector('[name="message"]')?.value.trim() || '';

    if (!name || !message) {
      if (status) {
        status.textContent =
          'Please enter your name and message before continuing.';
      }

      return;
    }

    const whatsappNumber = '27662913726';

    const whatsappMessage = `
*New Website Enquiry*
Mount of Hope Agriculture Holdings

*Name:* ${name}
*Email:* ${email || 'Not provided'}
*Enquiry Type:* ${interest}

*Message:*
${message}
    `.trim();

    const whatsappURL =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    if (status) {
      status.textContent = 'Opening WhatsApp...';
    }

    window.open(whatsappURL, '_blank', 'noopener,noreferrer');

    window.setTimeout(() => {
      form.reset();

      if (status) {
        status.textContent =
          'Your enquiry has been prepared in WhatsApp. Please press Send to complete it.';
      }
    }, 500);
  });
}

  // Dynamic copyright year
  const yearElement = document.getElementById('year');

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Initialise navigation
  window.addEventListener(
    'scroll',
    updateActiveLink,
    { passive: true }
  );

  updateActiveLink();
});