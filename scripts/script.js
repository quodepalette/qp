// ●●●●●●●●●●●●●●●●●●●●●
// HERO INTERACTIONS + EFFECTS
// ●●●●●●●●●●●●●●●●●●●●●
(function () {
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const shapes = document.querySelectorAll('.shape');
    const codeElements = document.querySelectorAll('.code-element');

    initHeroParallax(hero, shapes, codeElements);
    initIntersectionObserver();
    generateHeroParticles(hero, 25);
    initTechPattern();
    initLoader();
    initMenuToggle();
    initServiceCards();
  }

  // ●●●●●●●●●●●●●●●●●●●●●
  // HERO PARALLAX
  // ●●●●●●●●●●●●●●●●●●●●●
  function initHeroParallax(hero, shapes, codeElements) {
    let isDragging = false;
    let lastX = 0,
      lastY = 0;

    const setInitialPositions = (elements) => {
      elements.forEach((el) => {
        el.dataset.x = '0';
        el.dataset.y = '0';
      });
    };
    setInitialPositions(shapes);
    setInitialPositions(codeElements);

    const handlePointerMove = (e) => {
      if (!isDragging) {
        const mouseXPercent =
          (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const mouseYPercent =
          (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        applySmoothMovement(
          shapes,
          mouseXPercent,
          mouseYPercent,
          5,
          0.05,
          false
        );
        applySmoothMovement(
          codeElements,
          mouseXPercent,
          mouseYPercent,
          1,
          0.08,
          true
        );
        return;
      }
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      applyDragMovement(
        shapes,
        deltaX,
        deltaY,
        (i) => (5 - i) * 3,
        window.innerWidth / 8,
        window.innerHeight / 8,
        false
      );
      applyDragMovement(
        codeElements,
        deltaX,
        deltaY,
        (i) => (i + 1) * 2,
        window.innerWidth / 6,
        window.innerHeight / 6,
        true
      );
    };

    const handlePointerDown = (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      hero.classList.add('grabbing');
    };

    const handlePointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      hero.classList.remove('grabbing');
      springBack(shapes, 0.7);
      springBack(codeElements, 0.7);
    };

    // ATTACH POINTER EVENT LISTENERS (WORKS FOR MOUSE, TOUCH, PEN)
    hero.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', handlePointerUp);
  }

  function applySmoothMovement(
    elements,
    mouseXPercent,
    mouseYPercent,
    strengthBase,
    smoothing,
    reverse
  ) {
    elements.forEach((el, index) => {
      const strength = (reverse ? index + 1 : strengthBase - index) * 5;
      const factor = reverse ? -1 : 1;
      const x = mouseXPercent * strength * factor;
      const y = mouseYPercent * strength * factor;

      const currentX = parseFloat(el.dataset.x || 0);
      const currentY = parseFloat(el.dataset.y || 0);

      const newX = currentX + (x - currentX) * smoothing;
      const newY = currentY + (y - currentY) * smoothing;

      el.dataset.x = newX;
      el.dataset.y = newY;
      el.style.transform = `translate(${newX}px, ${newY}px)`;
    });
  }

  function springBack(elements, factor) {
    elements.forEach((el) => {
      const targetX = parseFloat(el.dataset.x) * factor;
      const targetY = parseFloat(el.dataset.y) * factor;

      el.style.transition =
        'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      el.style.transform = `translate(${targetX}px, ${targetY}px)`;

      el.dataset.x = targetX;
      el.dataset.y = targetY;

      setTimeout(() => (el.style.transition = ''), 800);
    });
  }

  function applyDragMovement(
    elements,
    deltaX,
    deltaY,
    strengthFn,
    limitX,
    limitY,
    reverse
  ) {
    elements.forEach((el, index) => {
      const strength = strengthFn(index);
      const factor = reverse ? -1 : 1;

      const newX = parseFloat(el.dataset.x) + deltaX * (strength / 40) * factor;
      const newY = parseFloat(el.dataset.y) + deltaY * (strength / 40) * factor;

      const boundedX = Math.max(-limitX, Math.min(limitX, newX));
      const boundedY = Math.max(-limitY, Math.min(limitY, newY));

      el.dataset.x = boundedX;
      el.dataset.y = boundedY;
      el.style.transform = `translate(${boundedX}px, ${boundedY}px)`;
    });
  }

  // ●●●●●●●●●●●●●●●●●●●●●
  // INTERSECTION OBSERVER
  // ●●●●●●●●●●●●●●●●●●●●●
  function initIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('visible', entry.isIntersecting);
        });
      },
      { threshold: 0.2 }
    );

    document
      .querySelectorAll('.section-header')
      .forEach((header) => observer.observe(header));
  }

  // ●●●●●●●●●●●●●●●●●●●●●
  // PARTICLES
  // ●●●●●●●●●●●●●●●●●●●●●
  function generateHeroParticles(hero, count) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * window.innerWidth}px`;
      particle.style.animationDuration = `${Math.random() * 5 + 5}s`;
      hero.appendChild(particle);
    }
  }

  // ●●●●●●●●●●●●●●●●●●●●●
  // TECH PATTERN
  // ●●●●●●●●●●●●●●●●●●●●●
  function initTechPattern() {
    const container = document.getElementById('tech-pattern');
    if (!container) return;

    container.innerHTML = '';

    const config = {
      verticalLines: 20,
      nodesCount: 25,
      connectionsCount: 30,
      minAnimationDuration: 2,
      maxAnimationDuration: 6,
    };

    for (let i = 0; i <= config.verticalLines; i++) {
      const line = document.createElement('div');
      line.className = 'grid-line vertical-line';
      line.style.left = `${(i / config.verticalLines) * 100}%`;
      line.style.opacity = 0.1 + Math.random() * 0.2;
      line.style.animation = `fadeInOut ${randRange(
        config.minAnimationDuration,
        config.maxAnimationDuration
      )}s ease-in-out infinite`;
      line.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(line);
    }

    const nodes = [];
    for (let i = 0; i < config.nodesCount; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const node = document.createElement('div');
      node.className = 'tech-node';
      node.style.left = `${x}%`;
      node.style.top = `${y}%`;
      node.style.animation = `pulseNode ${
        config.minAnimationDuration + Math.random() * 2
      }s ease-in-out infinite`;
      node.style.animationDelay = `${Math.random() * 3}s`;
      const blueValue = 50 + Math.floor(Math.random() * 100);
      const opacity = 0.7 + Math.random() * 0.3;
      node.style.background = `rgba(59, ${blueValue}, 246, ${opacity})`;
      node.style.boxShadow = `0 0 15px rgba(59, ${blueValue}, 246, ${opacity})`;
      container.appendChild(node);
      nodes.push({ x, y });
    }

    const connections = [];
    const createConnection = (n1, n2) => {
      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const conn = document.createElement('div');
      conn.className = 'connection-line';
      conn.style.width = `${distance}%`;
      conn.style.left = `${n1.x}%`;
      conn.style.top = `${n1.y}%`;
      conn.style.transform = `rotate(${angle}deg)`;
      conn.style.opacity = 0.1 + Math.random() * 0.2;
      container.appendChild(conn);
      return { node1: n1, node2: n2, distance, angle };
    };

    for (
      let i = 0;
      i < Math.min(config.connectionsCount, nodes.length * 2);
      i++
    ) {
      let n1 = nodes[Math.floor(Math.random() * nodes.length)];
      let n2 = nodes[Math.floor(Math.random() * nodes.length)];
      while (n2 === n1 && nodes.length > 1) {
        n2 = nodes[Math.floor(Math.random() * nodes.length)];
      }
      connections.push(createConnection(n1, n2));
    }

    setInterval(() => {
      if (connections.length === 0) return;
      const c = connections[Math.floor(Math.random() * connections.length)];
      const packet = document.createElement('div');
      packet.className = 'data-packet';
      packet.style.left = `${c.node1.x}%`;
      packet.style.top = `${c.node1.y}%`;
      packet.style.width = `${c.distance}%`;
      packet.style.transform = `rotate(${c.angle}deg)`;
      const duration = randRange(1, 3);
      packet.style.animation = `moveData ${duration}s linear forwards`;
      container.appendChild(packet);
      setTimeout(() => packet.remove(), duration * 1000);
    }, randRange(1000, 3000));
  }

  function randRange(min, max) {
    return min + Math.random() * (max - min);
  }

  // ●●●●●●●●●●●●●●●●●●●●●
  // LOADER
  // ●●●●●●●●●●●●●●●●●●●●●
  // Run loader for 1 sec
  window.addEventListener('load', function () {
    const loader = document.getElementById('loader-container');

    // Keep it visible for 1 sec
    setTimeout(() => {
      loader.style.display = 'none'; // Hides loader
    }, 1000); // 1000ms = 1s
  });

  // ●●●●●●●●●●●●●●●●●●●●●
  // MENU TOGGLE
  // ●●●●●●●●●●●●●●●●●●●●●
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const label = document.querySelector('.menu-circles');

  if (!menuToggle) return console.error('[menu] #menu-toggle not found');
  if (!mobileMenu) return console.error('[menu] #mobileMenu not found');
  if (!label) return console.error('[menu] .menu-circles label not found');

  const openMenu = () => {
    mobileMenu.classList.add('active'); // matches your CSS (.mobile-menu.active)
    menuToggle.checked = true; // keep checkbox in sync
    document.body.style.overflow = 'hidden'; // optional: prevent background scroll
  };
  const closeMenu = () => {
    mobileMenu.classList.remove('active');
    menuToggle.checked = false;
    document.body.style.overflow = ''; // restore scroll
  };
  const toggleMenu = () =>
    mobileMenu.classList.contains('active') ? closeMenu() : openMenu();

  // Label click: prevent default (some browsers may attempt native toggle),
  // and use JS toggle so behavior is consistent even when input is hidden.
  label.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu();
  });

  // If the checkbox ever changes (keyboard or other script), keep menu synced:
  menuToggle.addEventListener('change', () => {
    if (menuToggle.checked) openMenu();
    else closeMenu();
  });

  // Close when a menu link is clicked
  mobileMenu
    .querySelectorAll('a')
    .forEach((a) => a.addEventListener('click', closeMenu));

  // Close when clicking outside the menu + label
  document.addEventListener('click', (e) => {
    if (
      !mobileMenu.contains(e.target) &&
      !label.contains(e.target) &&
      mobileMenu.classList.contains('active')
    ) {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active'))
      closeMenu();
  });
});

  // ●●●●●●●●●●●●●●●●●●●●●
  // SERVICE CARDS
  // ●●●●●●●●●●●●●●●●●●●●●
  function initServiceCards() {
    document.querySelectorAll('.service-card').forEach((card) => {
      const glow = card.querySelector('.glow');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = (y - rect.height / 2) / 25;
        const rotateY = (rect.width / 2 - x) / 25;
        if (glow)
          glow.style.transform = `translate(${(x - rect.width / 2) / 10}px, ${
            (y - rect.height / 2) / 10
          }px) scale(1.5)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        if (glow) glow.style.transform = '';
      });

      card.addEventListener('click', () => {
        card.style.transform = 'scale(0.98)';
        setTimeout(() => (card.style.transform = ''), 200);
      });
    });
  }
})();

// ●●●●●●●●●●●●●●●●●●●●●
// FAQS ACCORDION
// ●●●●●●●●●●●●●●●●●●●●●
document.querySelectorAll('.accordion-header').forEach((header) => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    const accordionBody = item.querySelector('.accordion-body');
    const isActive = item.classList.contains('active');

    // CLOSE ALL OTHER ITEMS FOR SINGLE-OPEN BEHAVIOR (OPTIONAL)
    document.querySelectorAll('.accordion-item').forEach((otherItem) => {
      if (otherItem !== item && otherItem.classList.contains('active')) {
        otherItem.classList.remove('active');
      }
    });

    // TOGGLE CURRENT ITEM
    item.classList.toggle('active');

    // HANDLE ACCESSIBILITY
    const expanded = item.classList.contains('active');
    header.setAttribute('aria-expanded', expanded);
  });
});

// INITIALIZE ARIA ATTRIBUTES FOR ACCESSIBILITY
document.querySelectorAll('.accordion-header').forEach((header) => {
  header.setAttribute('aria-expanded', 'false');
});

// ●●●●●●●●●●●●●●●●●●●●●
// SHOW MORE/LESS FUNCTIONALITY
// ●●●●●●●●●●●●●●●●●●●●●
const showMoreBtn = document.getElementById('showMoreBtn');
const accordionItems = document.querySelectorAll('.accordion-item');
const itemsPerIncrement = 10;
let currentlyShown = 10;

// INITIALIZE - SHOW FIRST 10 ITEMS
function initializeFAQDisplay() {
  accordionItems.forEach((item, index) => {
    if (index >= itemsPerIncrement) {
      item.classList.add('hidden');
    } else {
      item.classList.remove('hidden');
    }
  });
  updateButtonText();
}

// UPDATE BUTTON TEXT BASED ON CURRENT STATE
function updateButtonText() {
  const totalItems = accordionItems.length;
  const hiddenItems = document.querySelectorAll('.accordion-item.hidden');

  if (hiddenItems.length === 0) {
    showMoreBtn.textContent = 'Show Less FAQs';
  } else {
    const remainingItems = hiddenItems.length;
    const nextIncrement = Math.min(itemsPerIncrement, remainingItems);
    showMoreBtn.textContent = `Show More FAQs`;
  }
}

// HANDLE SHOW MORE/LESS BUTTON CLICK
showMoreBtn.addEventListener('click', () => {
  const hiddenItems = document.querySelectorAll('.accordion-item.hidden');

  if (hiddenItems.length === 0) {
    // ALL ITEMS ARE SHOWN, COLLAPSE TO FIRST 10
    accordionItems.forEach((item, index) => {
      if (index >= itemsPerIncrement) {
        item.classList.add('hidden');
        // CLOSE ANY OPEN ITEMS THAT ARE BEING HIDDEN
        item.classList.remove('active');
        const header = item.querySelector('.accordion-header');
        header.setAttribute('aria-expanded', 'false');
      }
    });
    currentlyShown = itemsPerIncrement;
  } else {
    // SHOW NEXT INCREMENT OF ITEMS
    const itemsToShow = Math.min(itemsPerIncrement, hiddenItems.length);
    for (let i = 0; i < itemsToShow; i++) {
      hiddenItems[i].classList.remove('hidden');
    }
    currentlyShown += itemsToShow;
  }

  updateButtonText();
});

// INITIALIZE ON PAGE LOAD
initializeFAQDisplay();

// HANDLE LINK TRIGGERS
document.querySelectorAll('.link-trigger').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const url = e.target.getAttribute('data-link');
    if (url) {
      window.open(url, '_blank');
    }
  });
});

// ●●●●●●●●●●●●●●●●●●●●●
// BACK TO TOP BUTTON
// ●●●●●●●●●●●●●●●●●●●●●
class BackToTopButton {
  constructor() {
    this.button = document.getElementById('backToTop');
    this.progressCircle = this.button.querySelector('.progress');
    this.circumference = 2 * Math.PI * 30; // RADIUS = 30
    this.threshold = 300; // SHOW BUTTON AFTER 300PX SCROLL

    this.init();
  }

  init() {
    // SET UP PROGRESS CIRCLE
    this.progressCircle.style.strokeDasharray = this.circumference;
    this.progressCircle.style.strokeDashoffset = this.circumference;

    // EVENT LISTENERS
    window.addEventListener('scroll', this.handleScroll.bind(this), {
      passive: true,
    });
    this.button.addEventListener('click', this.scrollToTop.bind(this));

    // INITIAL CHECK
    this.handleScroll();
  }

  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / scrollHeight;

    // SHOW/HIDE BUTTON
    if (scrollTop > this.threshold) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }

    // UPDATE PROGRESS RING
    const offset = this.circumference - scrollPercent * this.circumference;
    this.progressCircle.style.strokeDashoffset = offset;
  }

  scrollToTop() {
    // SMOOTH SCROLL TO TOP
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // ADD A SUBTLE BOUNCE EFFECT
    this.button.style.transform = 'scale(0.9)';
    setTimeout(() => {
      this.button.style.transform = '';
    }, 150);
  }
}

// INITIALIZE WHEN DOM IS LOADED
document.addEventListener('DOMContentLoaded', () => {
  new BackToTopButton();
});

// INTERSECTION OBSERVER FOR PERFORMANCE OPTIMIZATION
if ('IntersectionObserver' in window) {
  const observerOptions = {
    rootMargin: '100px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // OBSERVE ALL SECTIONS FOR SMOOTH REVEAL
  document.querySelectorAll('.section').forEach((section) => {
    section.style.opacity = '0.8';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
}

// ●●●●●●●●●●●●●●●●●●●●●
// FOOTER YEAR UPDATE
// ●●●●●●●●●●●●●●●●●●●●●
//
document.getElementById('year').textContent = new Date().getFullYear();

// SHOW WHATSAPP BUTTON ON SCROLL LIKE BACK-TO-TOP
const whatsappButton = document.getElementById('whatsappButton');
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    whatsappButton.classList.add('visible');
    backToTop.classList.add('visible');
  } else {
    whatsappButton.classList.remove('visible');
    backToTop.classList.remove('visible');
  }
});

// ●●●●●●●●●●●●●●●●●●●●●
// LINK WHATSAPP BUTTON
// ●●●●●●●●●●●●●●●●●●●●●
document
  .getElementById('whatsappButton')
  .addEventListener('click', function (e) {
    e.preventDefault(); // STOPS THE # FROM JUMPING TO TOP
    window.open(
      "https://api.whatsapp.com/send?phone=233243010469&text=Hello%20Quode%20Palette!%20I'm%20interested%20in%20your%20services.",
      '_blank'
    );
  });


  
document.querySelectorAll('.link-trigger').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    const url = this.getAttribute('data-link');
    window.open(url, '_blank'); // OPENS IN NEW TAB
    // IF YOU WANT MAILTO/TEL TO WORK IN THE SAME WINDOW INSTEAD:
    // WINDOW.LOCATION.HREF = URL;
  });
});

// ●●●●●●●●●●●●●●●●●●●●●
// ONBOARDING
// ●●●●●●●●●●●●●●●●●●●●●
const form = document.getElementById('onboardingForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (result.success) {
    document.getElementById('successPopup').style.display = 'flex';
    form.reset();
  } else {
    alert('Oops! Something went wrong. Please try again.');
  }
});


// ●●●●●●●●●●●●●●●●●●●●●
// ANIMATED COUNTER FOR STATS
// ●●●●●●●●●●●●●●●●●●●●●
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const increment = target / 100;
    let current = 0;

    clearInterval(element._timer); // PREVENT STACKING INTERVALS

    element._timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(element._timer);
        }
        element.textContent = Math.floor(current) + (element.dataset.suffix || '');
    }, 20);
}

// START COUNTER ANIMATION WHEN STATS ARE VISIBLE
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const numbers = entry.target.querySelectorAll('.stat-number');

        if (entry.isIntersecting) {
            // RUN ANIMATION EACH TIME SECTION IS VISIBLE
            numbers.forEach(number => animateCounter(number));
        } else {
            // RESET NUMBERS WHEN LEAVING VIEWPORT (OPTIONAL)
            numbers.forEach(number => {
                number.textContent = '0' + (number.dataset.suffix || '');
            });
        }
    });
}, { threshold: 0.3 }); //

const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ●●●●●●●●●●●●●●●●●●●●●
// SHOW MOUSE-GUIDE ONLY WHEN HERO SECTION IS IN VIEWPORT AND ON DESKTOP
// ●●●●●●●●●●●●●●●●●●●●●
document.addEventListener('DOMContentLoaded', function () {
  const mouseGuide = document.querySelector('.mouse-guide');
  const heroSection = document.querySelector(
    '.hero, #hero, [data-section="hero"]'
  ); // Adjust selector as needed

  if (!mouseGuide || !heroSection) return;

  // Check if device is desktop (width > 768px)
  function isDesktop() {
    return window.innerWidth > 768;
  }

  // Show/hide toast based on hero section visibility
  function toggleMouseGuide() {
    if (!isDesktop()) return;

    const heroRect = heroSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Check if hero section is visible in viewport
    const isHeroVisible = heroRect.bottom > 0 && heroRect.top < viewportHeight;

    if (isHeroVisible) {
      mouseGuide.classList.add('show');
      mouseGuide.classList.remove('hide');
    } else {
      mouseGuide.classList.add('hide');
      mouseGuide.classList.remove('show');
    }
  }

  // Initial check
  toggleMouseGuide();

  // Listen for scroll events
  let ticking = false;
  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        toggleMouseGuide();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', handleScroll);

  // Listen for resize events to handle desktop/mobile switching
  window.addEventListener('resize', function () {
    if (!isDesktop()) {
      mouseGuide.classList.remove('show');
      mouseGuide.classList.add('hide');
    } else {
      toggleMouseGuide();
    }
  });

  // Optional: Hide toast when user starts interacting
  let hideTimeout;
  function scheduleHide() {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      if (isDesktop() && mouseGuide.classList.contains('show')) {
        mouseGuide.classList.add('hide');
        mouseGuide.classList.remove('show');
      }
    }, 5000); // Hide after 5 seconds of no interaction
  }

  // Reset timer on user interaction
  ['mousemove', 'scroll', 'keydown'].forEach((event) => {
    document.addEventListener(event, scheduleHide, { passive: true });
  });

  // Initial schedule
  scheduleHide();
});



// ●●●●●●●●●●●●●●●●●●●●●
// PROCESS
// ●●●●●●●●●●●●●●●●●●●●●
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible'); 
            } else {
              entry.target.classList.remove('visible'); 
            }
          });
        }, observerOptions);

        // OBSERVE ALL PROCESS STEPS
        document.addEventListener('DOMContentLoaded', () => {
          const steps = document.querySelectorAll('.process-step');
          steps.forEach((step) => {
            observer.observe(step);
          });
        });

// ●●●●●●●●●●●●●●●●●●●●●
// TESTIMONIALS
// ●●●●●●●●●●●●●●●●●●●●●
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('demoModal');
  const iframe = document.getElementById('demoModalIframe');
  const title = document.getElementById('demoModalTitle');
  const closeBtn = document.getElementById('demoModalClose');

  document.querySelectorAll('.btn[data-url]').forEach((btn) => {
    btn.addEventListener('click', () => {
      iframe.src = btn.dataset.url;
      title.textContent = btn.dataset.title || 'Live Demo';
      modal.classList.add('is-open');
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('is-open');
    iframe.src = '';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('is-open');
      iframe.src = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.classList.remove('is-open');
      iframe.src = '';
    }
  });
});

