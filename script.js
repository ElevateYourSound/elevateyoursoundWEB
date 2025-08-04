// DOM Content Loaded - Assicura che tutto sia caricato
document.addEventListener('DOMContentLoaded', function() {
  
  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Navbar scroll effect - più fluido
  let ticking = false;
  
  function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
    
    // Update active section
    updateActiveSection();
  });

  // Navigation functionality
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      link.classList.add('active');
      
      // Get target section
      const targetId = link.getAttribute('href').substring(1);
      
      // Handle home differently - scroll to top
      if (targetId === 'home') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        // Scroll to target section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80; // Account for navbar height
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
      
      // Close mobile menu
      if (navMenu) {
        navMenu.classList.remove('active');
      }
    });
  });
  
  // Function to update active section based on scroll position
  function updateActiveSection() {
    const sections = ['home', 'services', 'discord'];
    const scrollPos = window.scrollY + 100; // Add offset for navbar
    
    sections.forEach((sectionId, index) => {
      const section = document.getElementById(sectionId);
      const navLink = document.querySelector(`a[href="#${sectionId}"]`);
      
      if (section && navLink) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        // For home section (hero), check if we're at the very top
        if (sectionId === 'home' && window.scrollY < 100) {
          navLinks.forEach(l => l.classList.remove('active'));
          navLink.classList.add('active');
        }
        // For other sections
        else if (scrollPos >= sectionTop && scrollPos < sectionBottom && sectionId !== 'home') {
          navLinks.forEach(l => l.classList.remove('active'));
          navLink.classList.add('active');
        }
      }
    });
  }
  
  // Set initial active section
  updateActiveSection();
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu && hamburger) {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('active');
      }
    }
  });

});

// Loading screen
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => loadingScreen.style.display = 'none', 500);
  }, 3000); // mostra per almeno 3s
});