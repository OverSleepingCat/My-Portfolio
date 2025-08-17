// Global Variables
let currentSlide = 0;
let slideInterval;
const slides = document.querySelectorAll('.slide');
const heroNext = document.getElementById('hero-next');
const heroPrev = document.getElementById('hero-prev');
const heroDots = document.querySelectorAll('.hero-dot');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const scrollToTopBtn = document.getElementById('scroll-to-top');
const contactForm = document.getElementById('contact-form');
const successMessage = document.getElementById('success-message');

// Skill Data
const skillsData = {
  html: {
    name: 'HTML',
    icon: 'fab fa-html5',
    description: 'The foundation of web development. HTML structures content and provides semantic meaning to web pages, ensuring accessibility and SEO optimization.',
    level: 95
  },
  css: {
    name: 'CSS',
    icon: 'fab fa-css3-alt',
    description: 'Cascading Style Sheets control the visual presentation of web pages. From layouts to animations, CSS brings designs to life.',
    level: 90
  },
  javascript: {
    name: 'JavaScript',
    icon: 'fab fa-js-square',
    description: 'The programming language of the web. JavaScript adds interactivity, handles user events, and creates dynamic user experiences.',
    level: 88
  },
  react: {
    name: 'Shopify',
    icon: 'fa-brands fa-shopify',
    description: 'Experience in building and customizing Shopify storefronts, integrating themes, and optimizing user experiences for e-commerce businesses. Skilled at tailoring designs to meet client needs and enhancing online shopping functionality.',
    level: 85
  },
  php: {
    name: 'PHP',
    icon: 'fab fa-php',
    description: 'Server-side scripting language perfect for web development. PHP handles backend logic, database operations, and server communication.',
    level: 80
  },
  python: {
    name: 'Python',
    icon: 'fab fa-python',
    description: 'Versatile programming language used in web development, data science, AI, and automation. Known for its readable syntax and powerful libraries.',
    level: 82
  },
  sql: {
    name: 'SQL',
    icon: 'fas fa-database',
    description: 'Structured Query Language for managing relational databases. Essential for data manipulation, retrieval, and database optimization.',
    level: 75
  },
  nodejs: {
    name: 'JSON',
    icon: 'fas fa-database',
    description: 'Proficient in using JSON for data storage, transfer, and API communication. Familiar with structuring, parsing, and integrating JSON to connect front-end applications with back-end services efficiently.',
    level: 78
  },
  figma: {
    name: 'Figma',
    icon: 'fab fa-figma',
    description: 'Collaborative design tool for UI/UX design. Figma streamlines the design process with real-time collaboration and prototyping.',
    level: 85
  },
  photoshop: {
    name: 'Photoshop',
    icon: 'fas fa-image',
    description: 'Industry-standard image editing software. Photoshop is essential for creating and manipulating graphics for web and print.',
    level: 70
  },
  illustrator: {
    name: 'Canva',
    icon: 'fas fa-paint-brush',
    description: 'Vector graphics software for creating logos, icons, and illustrations. Perfect for scalable graphics and brand design.',
    level: 68
  }
};

// Initialize Everything
document.addEventListener('DOMContentLoaded', function() {
  initializeHeroSlider();
  initializeNavigation();
  initializeSkills();
  initializeScrollEffects();
  initializeContactForm();
  initializeAnimations();
});

// Hero Slider Functions
function initializeHeroSlider() {
  if (slides.length === 0) return;

  // Set initial state
  setActiveSlide(0);

  // Event listeners for navigation
  heroNext?.addEventListener('click', nextSlide);
  heroPrev?.addEventListener('click', prevSlide);

  // Dot navigation
  heroDots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
  });

  // Auto-play slider
  startAutoSlide();

  // Pause on hover
  const heroSection = document.querySelector('.hero');
  heroSection?.addEventListener('mouseenter', stopAutoSlide);
  heroSection?.addEventListener('mouseleave', startAutoSlide);

  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
}

function setActiveSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  
  heroDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
  
  currentSlide = index;
}

function nextSlide() {
  const nextIndex = (currentSlide + 1) % slides.length;
  setActiveSlide(nextIndex);
}

function prevSlide() {
  const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
  setActiveSlide(prevIndex);
}

function goToSlide(index) {
  setActiveSlide(index);
}

function startAutoSlide() {
  stopAutoSlide();
  slideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
}

function handleKeyboardNavigation(e) {
  if (e.key === 'ArrowLeft') {
    prevSlide();
  } else if (e.key === 'ArrowRight') {
    nextSlide();
  }
}

// Navigation Functions
function initializeNavigation() {
  // Hamburger menu
  hamburger?.addEventListener('click', toggleMobileMenu);

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', handleSmoothScroll);
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Update active nav link on scroll
  window.addEventListener('scroll', updateActiveNavLink);
}

function toggleMobileMenu() {
  hamburger?.classList.toggle('active');
  navMenu?.classList.toggle('active');
}

function closeMobileMenu() {
  hamburger?.classList.remove('active');
  navMenu?.classList.remove('active');
}

function handleSmoothScroll(e) {
  e.preventDefault();
  const targetId = this.getAttribute('href');
  const targetSection = document.querySelector(targetId);
  
  if (targetSection) {
    targetSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;
    
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

// Skills Functions
function initializeSkills() {
  const skillButtons = document.querySelectorAll('.skill-btn');
  const skillInfo = document.getElementById('skill-info');
  
  // Set initial skill
  showSkill('html');
  
  skillButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      skillButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      
      // Show skill info
      const skill = this.getAttribute('data-skill');
      showSkill(skill);
    });
  });
}

function showSkill(skillKey) {
  const skillInfo = document.getElementById('skill-info');
  const skill = skillsData[skillKey];
  
  if (!skill || !skillInfo) return;
  
  // Hide current skill info
  skillInfo.classList.remove('show');
  
  setTimeout(() => {
    // Update content
    skillInfo.innerHTML = `
      <div class="skill-icon">
        <i class="${skill.icon}"></i>
      </div>
      <h4 class="skill-name">${skill.name}</h4>
      <p class="skill-description">${skill.description}</p>
      <div class="skill-level">
        <div class="skill-bar">
          <div class="skill-progress" style="width: 0%"></div>
        </div>
        <span class="skill-percentage">${skill.level}%</span>
      </div>
    `;
    
    // Show skill info
    skillInfo.classList.add('show');
    
    // Animate progress bar
    setTimeout(() => {
      const progressBar = skillInfo.querySelector('.skill-progress');
      if (progressBar) {
        progressBar.style.width = `${skill.level}%`;
      }
    }, 300);
  }, 250);
}

// Scroll Effects
function initializeScrollEffects() {
  window.addEventListener('scroll', handleScroll);
  
  // Initialize Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(handleIntersection, observerOptions);
  
  // Observe elements for animation
  document.querySelectorAll('.project-card, .stat, .contact-item, .skill-category').forEach(el => {
    observer.observe(el);
  });
}

function handleScroll() {
  const scrollTop = window.scrollY;
  
  // Update navbar appearance
  if (scrollTop > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
  
  // Show/hide scroll to top button
  if (scrollTop > 300) {
    scrollToTopBtn?.classList.add('show');
  } else {
    scrollToTopBtn?.classList.remove('show');
  }
}

function handleIntersection(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
    }
  });
}

// Contact Form
function initializeContactForm() {
  contactForm?.addEventListener('submit', handleFormSubmit);
  
  // Add scroll to top functionality
  scrollToTopBtn?.addEventListener('click', scrollToTop);
}

async function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(contactForm);
  const formObj = Object.fromEntries(formData);
  
  // Add loading state
  const submitBtn = contactForm.querySelector('.submit-btn');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;
  
  try {
    // Simulate form submission (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show success message
    showSuccessMessage('Message sent successfully!');
    
    // Reset form
    contactForm.reset();
    
  } catch (error) {
    console.error('Error sending message:', error);
    showSuccessMessage('Error sending message. Please try again.', true);
  } finally {
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

function showSuccessMessage(message, isError = false) {
  if (!successMessage) return;
  
  successMessage.querySelector('span').textContent = message;
  successMessage.style.background = isError ? '#f44336' : '#4caf50';
  successMessage.classList.add('show');
  
  setTimeout(() => {
    successMessage.classList.remove('show');
  }, 4000);
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Animation Utilities
function initializeAnimations() {
  // Add initial animation classes
  setTimeout(() => {
    document.querySelectorAll('.hero-title, .hero-subtitle').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, 500);
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Performance optimizations
const debouncedScroll = debounce(handleScroll, 10);
window.addEventListener('scroll', debouncedScroll);

// Error handling
window.addEventListener('error', function(e) {
  console.error('JavaScript error:', e.error);
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
  stopAutoSlide();
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const swipeDistance = touchEndX - touchStartX;
  
  if (Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) {
      prevSlide(); // Swipe right
    } else {
      nextSlide(); // Swipe left
    }
  }
}

// Accessibility enhancements
document.addEventListener('keydown', function(e) {
  // ESC key to close mobile menu
  if (e.key === 'Escape') {
    closeMobileMenu();
  }
});

// Focus management for mobile menu
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }
  });
}

// Initialize focus trap for mobile menu when active
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.target.classList.contains('active')) {
      trapFocus(navMenu);
    }
  });
});

if (navMenu) {
  observer.observe(navMenu, { attributes: true, attributeFilter: ['class'] });
}