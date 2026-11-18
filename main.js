// ==========================================================================
// Blumck Advocacia - Script de Navegação, Carrossel e Seletor Customizado
// ==========================================================================

// Configuração do Tailwind com o Design System Editorial
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

// Funções globais de menu mobile
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

// ==========================================================================
// Módulo: Carrossel Editorial de Especialidades
// ==========================================================================
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

  // Gerar os pontos indicadores de navegação
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Ir para slide ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  // Obter o passo de rolagem (largura de 1 slide + gap)
  function getStepWidth() {
    if (slides.length < 2) return track.clientWidth;
    const firstRect = slides[0].getBoundingClientRect();
    const secondRect = slides[1].getBoundingClientRect();
    const step = secondRect.left - firstRect.left;
    return step > 0 ? step : firstRect.width;
  }

  // Obter o índice do slide atualmente visível
  function getCurrentIndex() {
    const step = getStepWidth();
    if (step <= 0) return 0;
    const index = Math.round(track.scrollLeft / step);
    return Math.max(0, Math.min(index, totalSlides - 1));
  }

  // Atualizar contador e indicadores visuais
  function updateCarouselUI() {
    const currentIndex = getCurrentIndex();

    // Atualizar texto do contador "01 / 14"
    if (counter) {
      const currentFormatted = String(currentIndex + 1).padStart(2, '0');
      const totalFormatted = String(totalSlides).padStart(2, '0');
      counter.textContent = `${currentFormatted} / ${totalFormatted}`;
    }

    // Atualizar pontos indicadores
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // Atualizar estado de desabilitação dos botões
    if (prevBtn) {
      prevBtn.disabled = track.scrollLeft <= 5;
    }
    if (nextBtn) {
      const maxScrollLeft = track.scrollWidth - track.clientWidth - 5;
      nextBtn.disabled = track.scrollLeft >= maxScrollLeft;
    }
  }

  // Ir diretamente para um slide específico
  function goToSlide(index) {
    const clampedIndex = Math.max(0, Math.min(index, totalSlides - 1));
    const step = getStepWidth();
    const targetScroll = clampedIndex * step;

    track.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });

    setTimeout(updateCarouselUI, 300);
  }

  // Expor globalmente para os atalhos da Hero Card
  window.goToCarouselSlide = function (targetIndex, shouldHighlight = true) {
    goToSlide(targetIndex);
    if (shouldHighlight && slides[targetIndex]) {
      const card = slides[targetIndex].querySelector('.service-card');
      if (card) {
        card.classList.remove('card-highlight');
        void card.offsetWidth; // Forçar reflow
        card.classList.add('card-highlight');
      }
    }
  };

  // Botão Anterior
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const step = getStepWidth();
      track.scrollBy({ left: -step, behavior: 'smooth' });
    });
  }

  // Botão Próximo
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const step = getStepWidth();
      track.scrollBy({ left: step, behavior: 'smooth' });
    });
  }

  // Atualizar UI durante a rolagem com throttling
  let isScrolling;
  track.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(updateCarouselUI, 60);
  }, { passive: true });

  // Arrastar com o mouse (Drag-to-scroll) para Desktop
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

  // Atualização inicial
  setTimeout(updateCarouselUI, 100);
  window.addEventListener('resize', updateCarouselUI);
}

// ==========================================================================
// Módulo: Atalhos Clicáveis da Hero Card
// ==========================================================================
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

        // Aguarda a rolagem e posiciona o carrossel no card com destaque
        setTimeout(() => {
          if (typeof window.goToCarouselSlide === 'function') {
            window.goToCarouselSlide(targetIndex, true);
          }
        }, 450);
      }
    });
  });
}

// ==========================================================================
// Módulo: Seletor Customizado no Estilo do Site
// ==========================================================================
function initCustomSelect() {
  const selectWrapper = document.getElementById('customServiceSelect');
  const realSelect = document.getElementById('realServiceSelect');
  const trigger = document.getElementById('customSelectTrigger');
  const triggerLabel = document.getElementById('customSelectLabel');
  const dropdown = document.getElementById('customSelectDropdown');

  if (!selectWrapper || !realSelect || !trigger || !triggerLabel || !dropdown) return;

  // Preencher as opções customizadas baseando-se no <select> original
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

  // Definir rótulo inicial
  if (realSelect.selectedIndex >= 0) {
    triggerLabel.textContent = realSelect.options[realSelect.selectedIndex].text;
  }

  function selectOption(value, text) {
    realSelect.value = value;
    triggerLabel.textContent = text;

    // Atualizar classe selected na lista
    const allOptions = dropdown.querySelectorAll('.custom-option');
    allOptions.forEach(el => {
      if (el.getAttribute('data-value') === value) {
        el.classList.add('selected');
      } else {
        el.classList.remove('selected');
      }
    });

    // Disparar evento change no select original para integrações (ex: n8n)
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

  // Fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (!selectWrapper.contains(e.target)) {
      closeSelect();
    }
  });

  // Fechar com Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && selectWrapper.classList.contains('open')) {
      closeSelect();
      trigger.focus();
    }
  });
}

// ==========================================================================
// Inicialização Geral no DOM Ready
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('header');
  const progressBar = document.getElementById('scrollProgressBar');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  mobileMenu = document.getElementById('mobileMenu');
  menuIcon = document.getElementById('menuIcon');

  // Toggle do menu mobile
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }

  // Fechar menu mobile com tecla ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
      closeMobileMenu();
    }
  });

  // Atualização da barra de rolagem e estilo do header
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Barra de progresso
    if (progressBar && docHeight > 0) {
      const scrollPercent = (scrollY / docHeight) * 100;
      progressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
    }

    // Header fixo com sombra e blur refinados
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

  // Scroll Spy para links de navegação
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

  // Inicializar Componentes Específicos Solicitados
  initCarousel();
  initHeroQuickLinks();
  initCustomSelect();

  // FAQ Accordion exclusivo: fecha os outros ao abrir um item
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
