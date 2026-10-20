/**
 * Disk Toldos - Modern Client-Side Controller & SPA Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header & Scroll Effects
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. SPA View Routing Engine
  const navLinks = document.querySelectorAll('[data-view-target]');
  const pageViews = document.querySelectorAll('.page-view');
  const mobileNav = document.querySelector('.main-nav');
  const mobileToggle = document.querySelector('.mobile-toggle');

  function switchView(targetViewId) {
    // Hide all views
    pageViews.forEach(view => {
      view.classList.remove('active-view');
    });

    // Show target view
    const activeView = document.getElementById(targetViewId);
    if (activeView) {
      activeView.classList.add('active-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active nav link
    navLinks.forEach(link => {
      if (link.getAttribute('data-view-target') === targetViewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile menu if open
    if (mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      mobileToggle.innerHTML = '<i class="fa fa-bars"></i>';
    }

    // Trigger reveal checks on view change
    setTimeout(checkScrollReveal, 100);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-view-target');
      if (target) {
        switchView(target);
        // Update URL hash without jumping
        history.pushState(null, null, `#${target}`);
      }
    });
  });

  // Handle URL hash on load or back/forward
  function handleHashChange() {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
      switchView(hash);
    } else {
      switchView('view-home');
    }
  }

  window.addEventListener('popstate', handleHashChange);
  handleHashChange();

  // 3. Mobile Hamburger Menu Toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      mobileToggle.innerHTML = isOpen ? '<i class="fa fa-times"></i>' : '<i class="fa fa-bars"></i>';
    });
  }

  // 4. Hero Carousel Auto-play & Controls
  const heroSlides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.querySelector('.slider-btn-prev');
  const nextBtn = document.querySelector('.slider-btn-next');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    if (!heroSlides.length) return;
    heroSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % heroSlides.length;
    showSlide(next);
  }

  function prevSlide() {
    let prev = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
    showSlide(prev);
  }

  if (nextBtn && prevBtn && heroSlides.length > 0) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetInterval();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetInterval();
    });

    function startInterval() {
      slideInterval = setInterval(nextSlide, 5000);
    }

    function resetInterval() {
      clearInterval(slideInterval);
      startInterval();
    }

    startInterval();
  }

  // 5. Gallery Filter System
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  function applyGalleryFilter(filterValue) {
    filterBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-filter') === filterValue);
    });

    galleryCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filterValue === 'all' || category === filterValue) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');
      applyGalleryFilter(filterValue);
    });
  });

  // Support clicking niche cards to filter gallery directly
  document.querySelectorAll('[data-set-filter]').forEach(link => {
    link.addEventListener('click', (e) => {
      const filter = link.getAttribute('data-set-filter');
      if (filter) {
        setTimeout(() => {
          applyGalleryFilter(filter);
        }, 150);
      }
    });
  });

  // 6. Modern Lightbox Modal
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.gallery-card-title')?.innerText || '';
      const cat = card.querySelector('.gallery-card-category')?.innerText || '';

      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        if (lightboxCaption) {
          lightboxCaption.innerText = cat ? `${cat} — ${title}` : title;
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // 7. Service Modal Handler
  const serviceCards = document.querySelectorAll('[data-service-modal]');
  const serviceModal = document.getElementById('service-modal');
  const serviceModalTitle = document.getElementById('service-modal-title');
  const serviceModalBody = document.getElementById('service-modal-body');
  const serviceModalClose = document.getElementById('service-modal-close');

  const serviceData = {
    'toldos': {
      title: 'Serviços Especializados em Toldos',
      content: 'Oferecemos soluções completas com fabricação sob medida, instalação segura, higienização profunda e troca de lonas para toldos residenciais e comerciais. Utilizamos ferragens galvanizadas e lonas com proteção UV de alta performance, garantindo durabilidade máxima e proteção contra sol e chuva intensa.'
    },
    'tendas': {
      title: 'Tendas Personalizadas para Eventos e Empresas',
      content: 'Projetamos e instalamos tendas de alta resistência para eventos, confraternizações, feiras e coberturas comerciais. Montagem ágil, estrutura metálica reforçada e acabamento impecável para transformar qualquer área externa em um ambiente confortável e seguro.'
    },
    'telhas': {
      title: 'Coberturas e Instalação de Telhas',
      content: 'Instalação, limpeza e manutenção preventiva de coberturas em policarbonato, telhas metálicas, termoacústicas e translúcidas. Perfeito para garagens, corredores, áreas de lazer e galpões industriais.'
    },
    'serralheria': {
      title: 'Serralheria Estrutural e Sob Medida',
      content: 'Serviços completos de serralheria de precisão, estruturas metálicas sob medida, portões, suportes e esquadrias. Garantimos soldas de alto padrão e pintura anticorrosiva de longa durabilidade.'
    }
  };

  serviceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = card.getAttribute('data-service-modal');
      if (serviceData[serviceKey] && serviceModal) {
        serviceModalTitle.innerText = serviceData[serviceKey].title;
        serviceModalBody.innerText = serviceData[serviceKey].content;
        serviceModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (serviceModalClose && serviceModal) {
    serviceModalClose.addEventListener('click', closeServiceModal);
    serviceModal.addEventListener('click', (e) => {
      if (e.target === serviceModal) {
        closeServiceModal();
      }
    });
  }

  function closeServiceModal() {
    if (serviceModal) {
      serviceModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // 8. Scroll Reveal Animations (Intersection Observer)
  function checkScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;

    reveals.forEach(reveal => {
      const elementTop = reveal.getBoundingClientRect().top;
      const elementVisible = 80;

      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('revealed');
      }
    });
  }

  window.addEventListener('scroll', checkScrollReveal);
  checkScrollReveal();
});
