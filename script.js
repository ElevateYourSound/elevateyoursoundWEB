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

// Function to scroll to a specific section (for buttons)
function scrollToSection(sectionId) {
  if (sectionId === 'home') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  } else {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80; // Account for navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }
}

// Loading screen
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      
      // Trigger hero animations after loading screen disappears
      setTimeout(() => {
        const heroLogo = document.querySelector('.hero-logo');
        const heroVideoContainer = document.querySelector('.hero-video-container');
        const heroContent = document.querySelector('.hero-content');
        
        if (heroLogo) heroLogo.classList.add('loaded');
        
        setTimeout(() => {
          if (heroVideoContainer) heroVideoContainer.classList.add('loaded');
        }, 200);
        
        setTimeout(() => {
          if (heroContent) heroContent.classList.add('loaded');
        }, 600);
        
      }, 100);
      
    }, 500);
  }, 3000); // mostra per almeno 3s
});

// ==== COOKIE CONSENT SYSTEM ====
class CookieManager {
  constructor() {
    this.cookieName = 'elevateYourSound_cookies';
    this.cookieExpiry = 365; // giorni
    this.init();
  }

  init() {
    // Controlla se l'utente ha già dato il consenso
    if (!this.getCookieConsent()) {
      this.showCookieBanner();
    }
    
    this.bindEvents();
  }

  bindEvents() {
    // Banner buttons
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');
    const settingsBtn = document.getElementById('cookieSettings');
    
    // Modal elements
    const modal = document.getElementById('cookieModal');
    const closeModalBtn = document.getElementById('closeModal');
    const saveSettingsBtn = document.getElementById('saveCookieSettings');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => this.acceptAllCookies());
    }
    
    if (declineBtn) {
      declineBtn.addEventListener('click', () => this.declineAllCookies());
    }
    
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this.showCookieModal());
    }
    
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => this.hideCookieModal());
    }
    
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', () => this.saveCustomSettings());
    }
    
    // Chiudi modal cliccando fuori
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideCookieModal();
        }
      });
    }
  }

  showCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (banner) {
      // Mostra il banner dopo un breve delay per permettere il caricamento della pagina
      setTimeout(() => {
        banner.classList.add('show');
      }, 2000);
    }
  }

  hideCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (banner) {
      banner.classList.remove('show');
      setTimeout(() => {
        banner.style.display = 'none';
      }, 600);
    }
  }

  showCookieModal() {
    const modal = document.getElementById('cookieModal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  hideCookieModal() {
    const modal = document.getElementById('cookieModal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  acceptAllCookies() {
    const consent = {
      essential: true,
      performance: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    
    this.setCookieConsent(consent);
    this.hideCookieBanner();
    this.enableCookies(consent);
    
    console.log('🍪 Tutti i cookie accettati');
  }

  declineAllCookies() {
    const consent = {
      essential: true, // Sempre vero, necessari per il funzionamento
      performance: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    
    this.setCookieConsent(consent);
    this.hideCookieBanner();
    this.enableCookies(consent);
    
    console.log('🍪 Cookie non essenziali rifiutati');
  }

  saveCustomSettings() {
    const performanceCheckbox = document.getElementById('performanceCookies');
    const marketingCheckbox = document.getElementById('marketingCookies');
    
    const consent = {
      essential: true,
      performance: performanceCheckbox ? performanceCheckbox.checked : false,
      marketing: marketingCheckbox ? marketingCheckbox.checked : false,
      timestamp: new Date().toISOString()
    };
    
    this.setCookieConsent(consent);
    this.hideCookieModal();
    this.hideCookieBanner();
    this.enableCookies(consent);
    
    console.log('🍪 Impostazioni cookie personalizzate salvate:', consent);
  }

  setCookieConsent(consent) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (this.cookieExpiry * 24 * 60 * 60 * 1000));
    
    document.cookie = `${this.cookieName}=${JSON.stringify(consent)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }

  getCookieConsent() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === this.cookieName) {
        try {
          return JSON.parse(decodeURIComponent(value));
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }

  enableCookies(consent) {
    // Qui puoi attivare i vari tipi di cookie/tracking basati sul consenso
    
    if (consent.performance) {
      // Attiva Google Analytics, etc.
      console.log('🍪 Cookie di performance attivati');
    }
    
    if (consent.marketing) {
      // Attiva pixel di marketing, etc.
      console.log('🍪 Cookie di marketing attivati');
    }
    
    // I cookie essenziali sono sempre attivi
    console.log('🍪 Cookie essenziali sempre attivi');
  }
}

// Inizializza il sistema cookie quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
  new CookieManager();
});