document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // Keep the active navigation state in sync across all standalone pages.
  const currentPage = body.dataset.page || 'home';
  document.querySelectorAll('[data-nav]').forEach((link) => {
    const isActive = link.dataset.nav === currentPage;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
  });

  // Mobile navigation.
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      body.classList.toggle('no-scroll', isOpen);
    });
    mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation');
      body.classList.remove('no-scroll');
    }));
  }

  // Scroll reveal for content blocks.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Animated stats.
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const animateCounter = (element) => {
      const target = Number(element.dataset.target || 0);
      const decimal = element.dataset.decimal || '';
      const duration = 1350;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${Math.floor(target * eased)}${progress === 1 ? decimal : ''}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.65 });
      counters.forEach((counter) => counterObserver.observe(counter));
    } else counters.forEach(animateCounter);
  }

  // Back-to-top control.
  const backToTop = document.querySelector('.back-to-top');
  const updateBackToTop = () => backToTop?.classList.toggle('visible', window.scrollY > 520);
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Demo chatbot with concise predefined answers.
  const chatbotToggle = document.querySelector('.chatbot-toggle');
  const chatbotPanel = document.querySelector('.chatbot-panel');
  const chatbotClose = document.querySelector('.chatbot-close');
  const chatbotForm = document.querySelector('.chatbot-form');
  const chatbotMessages = document.querySelector('.chatbot-messages');
  const chatbotInput = chatbotForm?.querySelector('input');
  const chatbotAnswers = {
    services: 'We build custom chatbots, AI process automation, ML solutions, voice assistants, computer vision, and AI roadmaps. Explore the Services page for the full picture.',
    pricing: 'Our focused Signal sprint starts at $2.5k, a Build pilot starts at $8.5k, and Scale partnerships are custom. Every plan is shaped after a short discovery call.',
    contact: 'You can reach us at hello@neurabot.ai or +1 415 555 0186. You can also use the contact form and we’ll reply within one business day.',
    fallback: 'I can help with services, pricing, or contact details. Try asking “What services do you offer?”'
  };
  const getChatAnswer = (message) => {
    const value = message.toLowerCase();
    if (value.includes('service') || value.includes('chatbot') || value.includes('automation') || value.includes('machine')) return chatbotAnswers.services;
    if (value.includes('price') || value.includes('cost') || value.includes('plan') || value.includes('budget')) return chatbotAnswers.pricing;
    if (value.includes('contact') || value.includes('email') || value.includes('phone') || value.includes('call')) return chatbotAnswers.contact;
    return chatbotAnswers.fallback;
  };
  const addChatMessage = (message, type = 'bot') => {
    if (!chatbotMessages) return;
    const bubble = document.createElement('div');
    bubble.className = `${type}-message`;
    bubble.textContent = message;
    chatbotMessages.appendChild(bubble);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  };
  const openChat = () => {
    if (!chatbotPanel || !chatbotToggle) return;
    chatbotPanel.hidden = false;
    chatbotToggle.setAttribute('aria-expanded', 'true');
    chatbotInput?.focus();
  };
  const closeChat = () => {
    if (!chatbotPanel || !chatbotToggle) return;
    chatbotPanel.hidden = true;
    chatbotToggle.setAttribute('aria-expanded', 'false');
  };
  chatbotToggle?.addEventListener('click', () => (chatbotPanel?.hidden ? openChat() : closeChat()));
  chatbotClose?.addEventListener('click', closeChat);
  document.querySelectorAll('[data-chat-question]').forEach((button) => button.addEventListener('click', () => {
    openChat();
    addChatMessage(button.dataset.chatQuestion, 'user');
    window.setTimeout(() => addChatMessage(getChatAnswer(button.dataset.chatQuestion)), 220);
  }));
  chatbotForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = chatbotInput?.value.trim();
    if (!value) return;
    addChatMessage(value, 'user');
    chatbotInput.value = '';
    window.setTimeout(() => addChatMessage(getChatAnswer(value)), 220);
  });

  // Portfolio filter and project lightbox.
  const filterButtons = document.querySelectorAll('.filter-button');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    portfolioCards.forEach((card) => card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter));
  }));

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const lightboxTitle = lightbox?.querySelector('h2');
  const lightboxDescription = lightbox?.querySelector('p');
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    body.classList.remove('no-scroll');
  };
  document.querySelectorAll('.portfolio-image').forEach((button) => button.addEventListener('click', () => {
    const card = button.closest('.portfolio-card');
    if (!lightbox || !card || !lightboxImage || !lightboxTitle || !lightboxDescription) return;
    const image = button.querySelector('img');
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxTitle.textContent = card.dataset.title;
    lightboxDescription.textContent = card.dataset.description;
    lightbox.hidden = false;
    body.classList.add('no-scroll');
    lightbox.querySelector('.lightbox-close')?.focus();
  }));
  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.querySelector('.lightbox-backdrop')?.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLightbox();
      closeChat();
    }
  });

  // Contact form validation and success state.
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    const fields = ['name', 'email', 'phone', 'service', 'message'].map((name) => contactForm.elements[name]);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,18}$/;
    const messages = {
      name: 'Please enter your name.',
      email: 'Please enter a valid work email.',
      phone: 'Please enter a valid phone number.',
      service: 'Please choose a service.',
      message: 'Please share a little more about your project.'
    };
    const validateField = (field) => {
      const value = field.value.trim();
      let valid = value.length > 0;
      if (field.name === 'email' && value) valid = emailPattern.test(value);
      if (field.name === 'phone' && value) valid = phonePattern.test(value);
      if (field.name === 'message' && value) valid = value.length >= 15;
      const wrapper = field.closest('.form-field');
      const error = contactForm.querySelector(`[data-error-for="${field.name}"]`);
      wrapper?.classList.toggle('invalid', !valid);
      field.setAttribute('aria-invalid', String(!valid));
      if (error) error.textContent = valid ? '' : messages[field.name];
      return valid;
    };
    fields.forEach((field) => field?.addEventListener('blur', () => validateField(field)));
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const results = fields.map((field) => field && validateField(field));
      const valid = results.every(Boolean);
      if (!valid) {
        fields.find((field) => field && field.getAttribute('aria-invalid') === 'true')?.focus();
        return;
      }
      contactForm.querySelector('.form-success').hidden = false;
      contactForm.reset();
      fields.forEach((field) => {
        field.removeAttribute('aria-invalid');
        field.closest('.form-field')?.classList.remove('invalid');
        const error = contactForm.querySelector(`[data-error-for="${field.name}"]`);
        if (error) error.textContent = '';
      });
    });
  }

  // Accessible FAQ accordion, one open item at a time.
  document.querySelectorAll('.faq-item button').forEach((button) => button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const shouldOpen = !item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach((openItem) => {
      openItem.classList.remove('open');
      openItem.querySelector('button')?.setAttribute('aria-expanded', 'false');
    });
    item.classList.toggle('open', shouldOpen);
    button.setAttribute('aria-expanded', String(shouldOpen));
  }));

  // Preselect a service when arriving from a service card or pricing CTA.
  const serviceSelect = document.querySelector('#service');
  const serviceParam = new URLSearchParams(window.location.search).get('service');
  if (serviceSelect && serviceParam) serviceSelect.value = serviceParam;
});
