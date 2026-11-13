/* =============================================================
   StudyFlow — main.js
   Global JavaScript: theme toggle, sidebar, utilities, and
   any interactivity that applies to every page.
   ============================================================= */

/* ---------------------------------------------------------------
   1. THEME MANAGEMENT
   Reads the saved preference from localStorage and applies it.
   The toggle button switches between 'light' and 'dark'.
   --------------------------------------------------------------- */

const ThemeManager = {

  /**
   * The localStorage key where we store the user's choice.
   * Storing it here (not in a database) keeps it frontend-only.
   */
  STORAGE_KEY: 'studyflow-theme',

  /** The <html> element — this is where we set data-theme */
  htmlEl: document.documentElement,

  /** The toggle button */
  toggleBtn: null,

  /** The icon inside the toggle button */
  iconEl: null,

  /** Initialise — apply saved theme and wire up the button */
  init() {
    this.toggleBtn = document.getElementById('sfThemeToggle');
    this.iconEl    = document.getElementById('sfThemeIcon');

    // Load saved preference, defaulting to 'light'
    const saved = localStorage.getItem(this.STORAGE_KEY) || 'light';
    this.apply(saved);

    // Listen for clicks on the toggle button
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }
  },

  /** Apply a given theme ('light' or 'dark') */
  apply(theme) {
    this.htmlEl.setAttribute('data-theme', theme);
    this.updateIcon(theme);
    // Save so it persists across page loads
    localStorage.setItem(this.STORAGE_KEY, theme);
  },

  /** Switch between light and dark */
  toggle() {
    const current = this.htmlEl.getAttribute('data-theme') || 'light';
    const next    = current === 'light' ? 'dark' : 'light';
    this.apply(next);
  },

  /** Update the icon to match the current theme */
  updateIcon(theme) {
    if (!this.iconEl) return;
    if (theme === 'dark') {
      // Showing dark mode: offer to switch to light (sun icon)
      this.iconEl.className = 'bi bi-sun-fill';
      if (this.toggleBtn) this.toggleBtn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      // Showing light mode: offer to switch to dark (moon icon)
      this.iconEl.className = 'bi bi-moon-stars-fill';
      if (this.toggleBtn) this.toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    }
  },
};


/* ---------------------------------------------------------------
   2. SIDEBAR MANAGER (Mobile)
   On mobile screens the sidebar is hidden by default.
   The hamburger button toggles it open/closed.
   A backdrop overlay closes it when tapped.
   --------------------------------------------------------------- */

const SidebarManager = {

  sidebar:  null,
  overlay:  null,
  toggle:   null,
  isOpen:   false,

  init() {
    this.sidebar = document.getElementById('sfSidebar');
    this.overlay = document.getElementById('sfSidebarOverlay');
    this.toggle  = document.getElementById('sfMenuToggle');

    if (this.toggle) {
      this.toggle.addEventListener('click', () => this.open());
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }

    // Close sidebar when a nav link is clicked (on mobile)
    if (this.sidebar) {
      this.sidebar.querySelectorAll('.sf-nav-link').forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth < 992) this.close();
        });
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  },

  open() {
    if (!this.sidebar) return;
    this.sidebar.classList.add('sidebar-open');
    this.overlay.classList.add('active');
    this.toggle.setAttribute('aria-expanded', 'true');
    this.sidebar.setAttribute('aria-hidden', 'false');
    this.isOpen = true;
    // Trap focus inside sidebar for accessibility
    document.body.style.overflow = 'hidden';
  },

  close() {
    if (!this.sidebar) return;
    this.sidebar.classList.remove('sidebar-open');
    this.overlay.classList.remove('active');
    if (this.toggle) this.toggle.setAttribute('aria-expanded', 'false');
    this.sidebar.setAttribute('aria-hidden', 'true');
    this.isOpen = false;
    document.body.style.overflow = '';
  },
};


/* ---------------------------------------------------------------
   3. DATE AND TIME DISPLAY
   Displays the current date in the topbar subtitle.
   --------------------------------------------------------------- */

function displayCurrentDate() {
  const el = document.getElementById('currentDateDisplay');
  if (!el) return;

  const now = new Date();
  const options = {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  };
  el.textContent = now.toLocaleDateString('en-GB', options);
}


/* ---------------------------------------------------------------
   4. TOAST NOTIFICATIONS
   Call StudyFlow.toast('Your message', 'success') from any page.
   Types: 'success', 'warning', 'error', 'info' (default)
   --------------------------------------------------------------- */

const ToastManager = {

  container: null,

  init() {
    this.container = document.getElementById('sfToastContainer');
  },

  /**
   * Show a temporary notification message.
   * @param {string} message  - The text to display
   * @param {string} type     - 'success' | 'warning' | 'error' | 'info'
   * @param {number} duration - How long (ms) before auto-dismiss (default 3500)
   */
  show(message, type = 'info', duration = 3500) {
    if (!this.container) return;

    // Choose an icon based on the type
    const icons = {
      success: 'bi-check-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      error:   'bi-x-circle-fill',
      info:    'bi-info-circle-fill',
    };
    const icon = icons[type] || icons.info;

    // Build the toast element
    const toast = document.createElement('div');
    toast.className = `sf-toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <i class="bi ${icon}" aria-hidden="true" style="flex-shrink:0; font-size:1.1rem;"></i>
      <span>${message}</span>
    `;

    this.container.appendChild(toast);

    // Auto-remove after the duration
    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity    = '0';
      toast.style.transform  = 'translateX(20px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },
};


/* ---------------------------------------------------------------
   5. GLOBAL STUDYFLOW NAMESPACE
   Expose the most useful utilities globally so page-specific
   scripts (dashboard.js, planner.js, etc.) can call them easily.
   --------------------------------------------------------------- */

window.StudyFlow = {
  /**
   * Show a toast notification from any page script.
   * Usage: StudyFlow.toast('Activity added!', 'success');
   */
  toast(message, type = 'info', duration = 3500) {
    ToastManager.show(message, type, duration);
  },

  /**
   * Format a Date object as a human-readable string.
   * Usage: StudyFlow.formatDate(new Date())
   */
  formatDate(date) {
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day:     'numeric',
      month:   'short',
      year:    'numeric',
    });
  },

  /**
   * Format a time string "HH:MM" to "H:MM AM/PM".
   * Usage: StudyFlow.formatTime('14:30') → '2:30 PM'
   */
  formatTime(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour   = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${period}`;
  },

  /**
   * Save data to localStorage with a StudyFlow prefix.
   * This keeps our keys separate from other websites.
   */
  save(key, data) {
    try {
      localStorage.setItem(`sf_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn('StudyFlow: could not save to localStorage.', e);
    }
  },

  /**
   * Load data from localStorage.
   * Returns null if nothing is stored under that key.
   */
  load(key) {
    try {
      const raw = localStorage.getItem(`sf_${key}`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('StudyFlow: could not load from localStorage.', e);
      return null;
    }
  },

  /**
   * Generate a simple unique ID for mock data items.
   * Not cryptographically secure — just good enough for frontend IDs.
   */
  generateId() {
    return `sf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  },
};


/* ---------------------------------------------------------------
   6. INITIALISATION
   Run all managers when the DOM is fully loaded.
   --------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  SidebarManager.init();
  ToastManager.init();
  displayCurrentDate();

  // Activate Bootstrap tooltips on elements with data-bs-toggle="tooltip"
  const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltips.forEach(el => new bootstrap.Tooltip(el));
});
