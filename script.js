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

// Loading screen con fallback
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        
        // Trigger hero animations after loading screen disappears
        setTimeout(() => {
          const heroLogo = document.querySelector('.hero-logo');
          const heroVideoContainer = document.querySelector('.hero-video-container');
          const heroContent = document.querySelector('.hero-content');
          
          if (heroLogo) {
            heroLogo.classList.add('loaded');
          }
          
          setTimeout(() => {
            if (heroVideoContainer) {
              heroVideoContainer.classList.add('loaded');
            }
          }, 200);
          
          setTimeout(() => {
            if (heroContent) {
              heroContent.classList.add('loaded');
            }
          }, 600);
          
        }, 100);
        
      }, 500);
    }, 1500); // Ridotto da 3s a 1.5s
  }
});

// ==== AUDIO CONTROL FOR HERO VIDEO ====
document.addEventListener('DOMContentLoaded', () => {
  const audioControl = document.getElementById('audioControl');
  const audioIcon = document.getElementById('audioIcon');
  const heroVideo = document.getElementById('heroVideo');
  
  if (audioControl && audioIcon && heroVideo) {
    // Stato iniziale: muto
    let isMuted = true;
    let originalVolume = 1;
    
    // Gestisci autoplay policy dei browser
    heroVideo.addEventListener('loadeddata', () => {
      // Prova a fare autoplay con audio
      const playPromise = heroVideo.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Se l'autoplay con audio fallisce, forza muto e riprova
          heroVideo.muted = true;
          heroVideo.play();
        });
      }
    });

    // Aggiungi fade out dell'audio alla fine del video
    heroVideo.addEventListener('timeupdate', () => {
      if (heroVideo.duration && !isMuted) {
        const timeLeft = heroVideo.duration - heroVideo.currentTime;
        const fadeOutDuration = 2; // 2 secondi di fade out
        
        if (timeLeft <= fadeOutDuration && timeLeft > 0) {
          // Calcola il volume in base al tempo rimanente
          const fadeVolume = timeLeft / fadeOutDuration;
          heroVideo.volume = fadeVolume * originalVolume;
        } else {
          // Mantieni il volume originale
          heroVideo.volume = originalVolume;
        }
      }
    });
    
    audioControl.addEventListener('click', () => {
      if (isMuted) {
        // Attiva audio
        heroVideo.muted = false;
        heroVideo.volume = originalVolume;
        audioIcon.className = 'fas fa-volume-up';
        audioControl.classList.add('unmuted');
        audioControl.title = 'Disattiva Audio';
        isMuted = false;
        
        // Aggiungi piccola animazione di feedback
        audioControl.style.transform = 'scale(1.2)';
        setTimeout(() => {
          audioControl.style.transform = '';
        }, 150);
        
      } else {
        // Disattiva audio
        heroVideo.muted = true;
        audioIcon.className = 'fas fa-volume-mute';
        audioControl.classList.remove('unmuted');
        audioControl.title = 'Attiva Audio';
        isMuted = true;
        
        // Aggiungi piccola animazione di feedback
        audioControl.style.transform = 'scale(0.9)';
        setTimeout(() => {
          audioControl.style.transform = '';
        }, 150);
      }
    });
    
    // Gestisci il volume del video
    heroVideo.volume = 0.6; // Volume al 60% quando attivato per non essere troppo forte
    
    // Mostra il pulsante solo dopo che il video è caricato
    heroVideo.addEventListener('canplay', () => {
      audioControl.style.opacity = '1';
      audioControl.style.pointerEvents = 'auto';
    });
    
    // Nascondi inizialmente il pulsante
    audioControl.style.opacity = '0';
    audioControl.style.pointerEvents = 'none';
    audioControl.style.transition = 'opacity 0.3s ease';
  }
});

// Fallback per assicurarsi che il loading si nasconda sempre
setTimeout(() => {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen && loadingScreen.style.display !== 'none') {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }
}, 5000); // Fallback dopo 5 secondi massimo

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
    
    // Privacy Policy elements
    const privacyLink = document.getElementById('openPrivacyPolicy');
    const privacyModal = document.getElementById('privacyModal');
    const closePrivacyBtn = document.getElementById('closePrivacyModal');
    const closePrivacyFooterBtn = document.getElementById('closePrivacyFromFooter');

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
    
    // Privacy Policy events
    if (privacyLink) {
      privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showPrivacyModal();
      });
    }
    
    if (closePrivacyBtn) {
      closePrivacyBtn.addEventListener('click', () => this.hidePrivacyModal());
    }
    
    if (closePrivacyFooterBtn) {
      closePrivacyFooterBtn.addEventListener('click', () => this.hidePrivacyModal());
    }
    
    // Chiudi modal cliccando fuori
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideCookieModal();
        }
      });
    }
    
    if (privacyModal) {
      privacyModal.addEventListener('click', (e) => {
        if (e.target === privacyModal) {
          this.hidePrivacyModal();
        }
      });
    }
  }

  showCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (banner) {
      // Aspetta che l'utente veda il brand "ELEVATE YOUR SOUND" per qualche secondo
      // Prima aspetta che finisca il loading (1.5s) + tempo per apprezzare il brand (4s) = 5.5s totali
      setTimeout(() => {
        banner.classList.add('show');
      }, 5500);
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

  showPrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  hidePrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
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
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ipHash: 'stored_separately',
      method: 'accept_all'
    };
    
    this.logConsentForCompliance(consent);
    
    this.setCookieConsent(consent);
    this.hideCookieBanner();
    this.enableCookies(consent);
  }

  declineAllCookies() {
    const consent = {
      essential: true, // Sempre vero, necessari per il funzionamento
      performance: false,
      marketing: false,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ipHash: 'stored_separately',
      method: 'decline_all'
    };
    
    this.logConsentForCompliance(consent);
    
    this.setCookieConsent(consent);
    this.hideCookieBanner();
    this.enableCookies(consent);
  }

  saveCustomSettings() {
    const performanceCheckbox = document.getElementById('performanceCookies');
    const marketingCheckbox = document.getElementById('marketingCookies');
    
    const consent = {
      essential: true,
      performance: performanceCheckbox ? performanceCheckbox.checked : false,
      marketing: marketingCheckbox ? marketingCheckbox.checked : false,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ipHash: 'stored_separately', // Per GDPR, l'IP deve essere hashato
      method: 'custom_settings'
    };
    
    this.logConsentForCompliance(consent);
    
    this.setCookieConsent(consent);
    this.hideCookieModal();
    this.hideCookieBanner();
    this.enableCookies(consent);
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
    }
    
    if (consent.marketing) {
      // Attiva pixel di marketing, etc.
    }
    
    // I cookie essenziali sono sempre attivi
  }

  // METODO OBBLIGATORIO PER GDPR - Logging del consenso
  logConsentForCompliance(consent) {
    // In produzione, questo dovrebbe inviare i dati a un server sicuro
    const consentLog = {
      ...consent,
      url: window.location.href,
      referrer: document.referrer,
      sessionId: this.generateSessionId()
    };
    
    // Salva nel localStorage per compliance (in produzione usa un server)
    const existingLogs = JSON.parse(localStorage.getItem('consent_logs') || '[]');
    existingLogs.push(consentLog);
    
    // Mantieni solo gli ultimi 100 log per evitare problemi di spazio
    if (existingLogs.length > 100) {
      existingLogs.shift();
    }
    
    localStorage.setItem('consent_logs', JSON.stringify(existingLogs));
    
    // TODO: In produzione, invia al server
    // fetch('/api/consent-log', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(consentLog)
    // });
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Metodo per ottenere tutti i log del consenso (per audit GDPR)
  getConsentLogs() {
    return JSON.parse(localStorage.getItem('consent_logs') || '[]');
  }

  // Metodo per cancellare tutti i dati (diritto all'oblio GDPR)
  deleteAllUserData() {
    // Rimuovi tutti i cookie
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Rimuovi dati locali
    localStorage.removeItem('consent_logs');
    localStorage.removeItem(this.cookieName);
    
    // Ricarica la pagina per mostrare di nuovo il banner
    window.location.reload();
  }
}

// Inizializza il sistema cookie quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
  new CookieManager();
});