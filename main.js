
if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          paper: '#F3F1EC',
          paper2: '#FAF9F6',
          card: '#FFFFFF',
          navy: '#132238',
          royal: '#1E3A63',
          cobalt: '#2D5B94',
          steel: '#8CA0B8',
          sky: '#B6C9DD',
          powder: '#E8EEF5',
          ink: '#1A2436',
          muted: '#58667A',
          line: '#DCE3EB',
          gold: '#C29F5D',
        },
        fontFamily: {
          serif: ['"Playfair Display"', 'Georgia', 'serif'],
          sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        },
        fontSize: {
          'eyebrow': ['0.72rem', { letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: '600' }],
          'display-xl': ['clamp(2.4rem, 5.2vw, 3.8rem)', { lineHeight: '1.14', letterSpacing: '-0.015em' }],
          'display-lg': ['clamp(1.85rem, 3.6vw, 2.75rem)', { lineHeight: '1.18', letterSpacing: '-0.015em' }],
          'display-md': ['1.6rem', { lineHeight: '1.25' }],
          'display-sm': ['1.25rem', { lineHeight: '1.3' }],
          'body-lead': ['1.06rem', { lineHeight: '1.75' }],
          'body': ['0.95rem', { lineHeight: '1.7' }],
          'body-sm': ['0.86rem', { lineHeight: '1.65' }],
          'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.04em' }],
        },
        boxShadow: {
          'subtle': '0 1px 3px rgba(19, 34, 56, 0.05)',
          'editorial': '0 8px 30px rgba(19, 34, 56, 0.08)',
          'editorial-lg': '0 20px 50px rgba(19, 34, 56, 0.12)',
        }
      }
    }
  };
}

let mobileMenu, menuIcon;

function toggleMobileMenu() {
  if (!mobileMenu || !menuIcon) {
    mobileMenu = document.getElementById('mobileMenu');
    menuIcon = document.getElementById('menuIcon');
  }
  if (!mobileMenu || !menuIcon) return;

  const isHidden = mobileMenu.classList.contains('hidden');
  if (isHidden) {
    mobileMenu.classList.remove('hidden');
    menuIcon.classList.remove('fa-bars');
    menuIcon.classList.add('fa-times');
    document.body.classList.add('overflow-hidden');
  } else {
    closeMobileMenu();
  }
}

function closeMobileMenu() {
  if (!mobileMenu || !menuIcon) {
    mobileMenu = document.getElementById('mobileMenu');
    menuIcon = document.getElementById('menuIcon');
  }
  if (!mobileMenu || !menuIcon) return;

  mobileMenu.classList.add('hidden');
  menuIcon.classList.remove('fa-times');
  menuIcon.classList.add('fa-bars');
  document.body.classList.remove('overflow-hidden');
}

function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const counter = document.getElementById('carouselCounter');
  const dotsContainer = document.getElementById('carouselDots');

  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;
  if (totalSlides === 0) return;

  let progressFill = null;

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    dotsContainer.className = 'carousel-progress';
    dotsContainer.setAttribute('role', 'progressbar');
    dotsContainer.setAttribute('aria-valuemin', '1');
    progressFill = document.createElement('span');
    progressFill.className = 'carousel-progress-fill';
    dotsContainer.appendChild(progressFill);
  }

  function getStepWidth() {
    if (slides.length < 2) return track.clientWidth;
    const firstRect = slides[0].getBoundingClientRect();
    const secondRect = slides[1].getBoundingClientRect();
    const step = secondRect.left - firstRect.left;
    return step > 0 ? step : firstRect.width;
  }

  function getMetrics() {
    const step = getStepWidth();
    const visibleCount = step > 0
      ? Math.max(1, Math.round(track.clientWidth / step))
      : 1;
    const pageCount = Math.max(1, Math.ceil(totalSlides / visibleCount));
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);

    return { step, visibleCount, pageCount, maxScroll };
  }

  function getCurrentPage(metrics) {
    if (metrics.maxScroll <= 5 || metrics.pageCount === 1) return 0;
    const progress = track.scrollLeft / metrics.maxScroll;
    return Math.max(
      0,
      Math.min(metrics.pageCount - 1, Math.round(progress * (metrics.pageCount - 1)))
    );
  }

  function updateCarouselUI() {
    const metrics = getMetrics();
    const currentPage = getCurrentPage(metrics);

    if (counter) {
      const currentFormatted = String(currentPage + 1).padStart(2, '0');
      const totalFormatted = String(metrics.pageCount).padStart(2, '0');
      counter.textContent = `${currentFormatted} / ${totalFormatted}`;
    }

    if (dotsContainer && progressFill) {
      const percentage = ((currentPage + 1) / metrics.pageCount) * 100;
      progressFill.style.width = `${percentage}%`;
      dotsContainer.setAttribute('aria-valuemax', String(metrics.pageCount));
      dotsContainer.setAttribute('aria-valuenow', String(currentPage + 1));
      dotsContainer.setAttribute(
        'aria-label',
        `Página ${currentPage + 1} de ${metrics.pageCount} das especialidades`
      );
    }

    if (prevBtn) {
      prevBtn.disabled = track.scrollLeft <= 5;
    }
    if (nextBtn) {
      nextBtn.disabled = track.scrollLeft >= metrics.maxScroll - 5;
    }
  }

  function goToSlide(index) {
    const clampedIndex = Math.max(0, Math.min(index, totalSlides - 1));
    const metrics = getMetrics();
    const targetScroll = Math.min(clampedIndex * metrics.step, metrics.maxScroll);

    track.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });

    setTimeout(updateCarouselUI, 300);
  }

  function goToPage(pageIndex) {
    const metrics = getMetrics();
    const clampedPage = Math.max(0, Math.min(pageIndex, metrics.pageCount - 1));
    const targetScroll = Math.min(
      clampedPage * metrics.visibleCount * metrics.step,
      metrics.maxScroll
    );

    track.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });

    setTimeout(updateCarouselUI, 300);
  }

  window.goToCarouselSlide = function (targetIndex, shouldHighlight = true) {
    goToSlide(targetIndex);
    if (shouldHighlight && slides[targetIndex]) {
      const card = slides[targetIndex].querySelector('.service-card');
      if (card) {
        card.classList.remove('card-highlight');
        void card.offsetWidth;
        card.classList.add('card-highlight');
      }
    }
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const metrics = getMetrics();
      goToPage(getCurrentPage(metrics) - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const metrics = getMetrics();
      goToPage(getCurrentPage(metrics) + 1);
    });
  }

  let isScrolling;
  track.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(updateCarouselUI, 60);
  }, { passive: true });

  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });

  window.requestAnimationFrame(updateCarouselUI);
  window.addEventListener('resize', updateCarouselUI);
}

function initHeroQuickLinks() {
  const quickLinks = document.querySelectorAll('[data-carousel-target]');
  quickLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetIndex = parseInt(this.getAttribute('data-carousel-target'), 10);
      const servicosSection = document.getElementById('servicos');

      if (servicosSection) {
        const topPos = servicosSection.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({
          top: topPos,
          behavior: 'smooth'
        });

        setTimeout(() => {
          if (typeof window.goToCarouselSlide === 'function') {
            window.goToCarouselSlide(targetIndex, true);
          }
        }, 450);
      }
    });
  });
}

function initCustomSelect() {
  const selectWrapper = document.getElementById('customServiceSelect');
  const realSelect = document.getElementById('realServiceSelect');
  const trigger = document.getElementById('customSelectTrigger');
  const triggerLabel = document.getElementById('customSelectLabel');
  const dropdown = document.getElementById('customSelectDropdown');

  if (!selectWrapper || !realSelect || !trigger || !triggerLabel || !dropdown) return;

  dropdown.innerHTML = '';
  const options = Array.from(realSelect.options);

  options.forEach((opt, idx) => {
    const optDiv = document.createElement('div');
    optDiv.className = `custom-option ${opt.selected ? 'selected' : ''}`;
    optDiv.setAttribute('role', 'option');
    optDiv.setAttribute('data-value', opt.value);

    optDiv.innerHTML = `
      <span>${opt.text}</span>
      <i class="fas fa-check check-icon"></i>
    `;

    optDiv.addEventListener('click', (e) => {
      e.stopPropagation();
      selectOption(opt.value, opt.text);
      closeSelect();
    });

    dropdown.appendChild(optDiv);
  });

  if (realSelect.selectedIndex >= 0) {
    triggerLabel.textContent = realSelect.options[realSelect.selectedIndex].text;
  }

  function selectOption(value, text) {
    realSelect.value = value;
    triggerLabel.textContent = text;

    const allOptions = dropdown.querySelectorAll('.custom-option');
    allOptions.forEach(el => {
      if (el.getAttribute('data-value') === value) {
        el.classList.add('selected');
      } else {
        el.classList.remove('selected');
      }
    });

    const event = new Event('change', { bubbles: true });
    realSelect.dispatchEvent(event);
  }

  function openSelect() {
    selectWrapper.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function closeSelect() {
    selectWrapper.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  function toggleSelect() {
    if (selectWrapper.classList.contains('open')) {
      closeSelect();
    } else {
      openSelect();
    }
  }

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSelect();
  });

  document.addEventListener('click', (e) => {
    if (!selectWrapper.contains(e.target)) {
      closeSelect();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && selectWrapper.classList.contains('open')) {
      closeSelect();
      trigger.focus();
    }
  });
}

function initPageTransition() {
  const loader = document.getElementById('siteLoader');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!loader || reducedMotion) {
    if (loader) loader.remove();
    document.body.classList.add('site-loaded');
    return;
  }

  const mark = loader.querySelector('.site-loader__mark');
  let pageReady = document.readyState === 'complete';
  let markReady = false;
  let hasFinished = false;

  document.body.classList.add('site-loading');

  const finish = () => {
    if (hasFinished || !pageReady || !markReady) return;
    hasFinished = true;
    loader.classList.add('is-leaving');
    document.body.classList.remove('site-loading');
    document.body.classList.add('site-loaded');

    const removeLoader = () => loader.remove();
    loader.addEventListener('transitionend', event => {
      if (event.target === loader && event.propertyName === 'transform') {
        removeLoader();
      }
    });
    window.setTimeout(removeLoader, 1300);
  };

  if (mark) {
    mark.addEventListener('animationend', () => {
      markReady = true;
      finish();
    }, { once: true });
  } else {
    markReady = true;
  }

  window.requestAnimationFrame(() => loader.classList.add('is-ready'));

  if (!pageReady) {
    window.addEventListener('load', () => {
      pageReady = true;
      finish();
    }, { once: true });
  }

  window.setTimeout(() => {
    markReady = true;
    pageReady = pageReady || document.readyState === 'complete';
    finish();
  }, 1100);

  window.setTimeout(() => {
    markReady = true;
    pageReady = true;
    finish();
  }, 3500);
}

function initScrollReveals() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const groups = [
    document.querySelectorAll('#servicos > div > .flex:first-child'),
    document.querySelectorAll('.carousel-slide'),
    document.querySelectorAll('#agendamento > div > div'),
    document.querySelectorAll('section:has(img[alt="Nosso Escritório"]) .grid > div'),
    document.querySelectorAll('section:has(.faq-wrap) > div > div:first-child, .faq-item'),
    document.querySelectorAll('footer > div > div')
  ];

  const items = [];
  groups.forEach((group, groupIndex) => {
    group.forEach((element, index) => {
      element.classList.add('reveal-item');

      if (groupIndex === 3) {
        element.classList.add(index % 2 === 0 ? 'reveal-from-left' : 'reveal-from-right');
      }

      element.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 70}ms`);
      items.push(element);
    });
  });

  if (reducedMotion || !('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      activeObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px'
  });

  items.forEach(item => observer.observe(item));
}

function initHeroDepth() {
  const hero = document.querySelector('.hero-editorial');
  const card = hero?.querySelector('.snap-card');
  const canMove = window.matchMedia('(pointer: fine)').matches &&
                  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!hero || !card || !canMove) return;

  let frameId = null;
  let pointerX = 0;
  let pointerY = 0;

  const render = () => {
    card.style.transform = `rotate(${(-1.5 + pointerX * 0.9).toFixed(2)}deg) translate3d(${(pointerX * 6).toFixed(1)}px, ${(pointerY * 6).toFixed(1)}px, 0)`;
    frameId = null;
  };

  hero.addEventListener('pointermove', event => {
    const bounds = hero.getBoundingClientRect();
    pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
    pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;

    if (!frameId) frameId = window.requestAnimationFrame(render);
  }, { passive: true });

  hero.addEventListener('pointerleave', () => {
    pointerX = 0;
    pointerY = 0;
    card.style.transform = 'rotate(-1.5deg) translate3d(0, 0, 0)';
  });
}

initPageTransition();

document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('header');
  const progressBar = document.getElementById('scrollProgressBar');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  mobileMenu = document.getElementById('mobileMenu');
  menuIcon = document.getElementById('menuIcon');

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
      closeMobileMenu();
    }
  });

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (progressBar && docHeight > 0) {
      const scrollPercent = (scrollY / docHeight) * 100;
      progressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
    }

    if (header) {
      if (scrollY > 25) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  const updateActiveNavLink = () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 160;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  initCarousel();
  initHeroQuickLinks();
  initCustomSelect();
  initScrollReveals();
  initHeroDepth();

  const faqDetails = document.querySelectorAll('.faq-item');
  faqDetails.forEach(detail => {
    detail.addEventListener('toggle', function () {
      if (this.open) {
        faqDetails.forEach(otherDetail => {
          if (otherDetail !== this && otherDetail.open) {
            otherDetail.removeAttribute('open');
          }
        });
      }
    });
  });
});
