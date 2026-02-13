// ============================================
// PrimeNest Utility Functions
// Currency formatting, theme management, and helpers
// ============================================

// ============================================
// CURRENCY UTILITIES
// ============================================

// Currency data with symbols and locales
const CURRENCIES = {
  USD: { symbol: '$', locale: 'en-US', name: 'US Dollar' },
  EUR: { symbol: '€', locale: 'de-DE', name: 'Euro' },
  GBP: { symbol: '£', locale: 'en-GB', name: 'British Pound' },
  JPY: { symbol: '¥', locale: 'ja-JP', name: 'Japanese Yen' },
  NGN: { symbol: '₦', locale: 'en-NG', name: 'Nigerian Naira' },
  CNY: { symbol: '¥', locale: 'zh-CN', name: 'Chinese Yuan' },
  INR: { symbol: '₹', locale: 'en-IN', name: 'Indian Rupee' },
  AUD: { symbol: 'A$', locale: 'en-AU', name: 'Australian Dollar' },
  CAD: { symbol: 'C$', locale: 'en-CA', name: 'Canadian Dollar' },
  CHF: { symbol: 'CHF', locale: 'de-CH', name: 'Swiss Franc' },
  AED: { symbol: 'د.إ', locale: 'ar-AE', name: 'UAE Dirham' },
  SAR: { symbol: '﷼', locale: 'ar-SA', name: 'Saudi Riyal' },
  ZAR: { symbol: 'R', locale: 'en-ZA', name: 'South African Rand' },
  KES: { symbol: 'KSh', locale: 'en-KE', name: 'Kenyan Shilling' },
  GHS: { symbol: 'GH₵', locale: 'en-GH', name: 'Ghanaian Cedi' },
};

// Country to currency mapping
const COUNTRY_CURRENCY_MAP = {
  'US': 'USD', 'USA': 'USD', 'UNITED STATES': 'USD', 'AMERICA': 'USD',
  'UK': 'GBP', 'GB': 'GBP', 'UNITED KINGDOM': 'GBP', 'ENGLAND': 'GBP', 'BRITAIN': 'GBP',
  'EU': 'EUR', 'EUROPE': 'EUR', 'GERMANY': 'EUR', 'FRANCE': 'EUR', 
  'ITALY': 'EUR', 'SPAIN': 'EUR', 'NETHERLANDS': 'EUR', 'BELGIUM': 'EUR',
  'JAPAN': 'JPY', 'JP': 'JPY',
  'NIGERIA': 'NGN', 'NG': 'NGN',
  'CHINA': 'CNY', 'CN': 'CNY',
  'INDIA': 'INR', 'IN': 'INR',
  'AUSTRALIA': 'AUD', 'AU': 'AUD',
  'CANADA': 'CAD', 'CA': 'CAD',
  'SWITZERLAND': 'CHF', 'CH': 'CHF',
  'UAE': 'AED', 'DUBAI': 'AED', 'UNITED ARAB EMIRATES': 'AED',
  'SAUDI': 'SAR', 'SAUDI ARABIA': 'SAR', 'SA': 'SAR',
  'SOUTH AFRICA': 'ZAR', 'ZA': 'ZAR',
  'KENYA': 'KES', 'KE': 'KES',
  'GHANA': 'GHS', 'GH': 'GHS',
};

/**
 * Detect user's preferred currency based on browser locale or timezone
 * @returns {string} Currency code (e.g., 'USD', 'EUR')
 */
export const detectUserCurrency = () => {
  // Try to get from localStorage first
  const savedCurrency = localStorage.getItem('primenest_currency');
  if (savedCurrency && CURRENCIES[savedCurrency]) {
    return savedCurrency;
  }

  // Try to detect from browser locale
  const locale = navigator.language || navigator.userLanguage;
  const localeRegion = locale?.split('-')[1]?.toUpperCase();
  
  if (localeRegion && COUNTRY_CURRENCY_MAP[localeRegion]) {
    return COUNTRY_CURRENCY_MAP[localeRegion];
  }

  // Try to detect from timezone
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneToCurrency = {
      'America/New_York': 'USD',
      'America/Los_Angeles': 'USD',
      'America/Chicago': 'USD',
      'America/Denver': 'USD',
      'Europe/London': 'GBP',
      'Europe/Berlin': 'EUR',
      'Europe/Paris': 'EUR',
      'Asia/Tokyo': 'JPY',
      'Africa/Lagos': 'NGN',
      'Asia/Shanghai': 'CNY',
      'Asia/Kolkata': 'INR',
      'Australia/Sydney': 'AUD',
      'America/Toronto': 'CAD',
      'Europe/Zurich': 'CHF',
      'Asia/Dubai': 'AED',
      'Africa/Johannesburg': 'ZAR',
      'Africa/Nairobi': 'KES',
    };
    
    if (timezoneToCurrency[timezone]) {
      return timezoneToCurrency[timezone];
    }
  } catch (e) {
    // Timezone detection failed
  }

  // Default to USD
  return 'USD';
};

/**
 * Set user's preferred currency
 * @param {string} currencyCode - Currency code (e.g., 'USD', 'EUR')
 */
export const setUserCurrency = (currencyCode) => {
  if (CURRENCIES[currencyCode]) {
    localStorage.setItem('primenest_currency', currencyCode);
  }
};

/**
 * Format a price with the appropriate currency
 * @param {number} price - The price to format
 * @param {string} currencyCode - Currency code (optional, defaults to detected currency)
 * @param {object} options - Formatting options
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currencyCode = null, options = {}) => {
  const currency = currencyCode || detectUserCurrency();
  const currencyData = CURRENCIES[currency] || CURRENCIES.USD;
  
  const {
    showDecimals = price >= 10000 ? false : true,
    compact = false,
  } = options;

  // Compact format for large numbers
  if (compact && price >= 1000000) {
    const millions = price / 1000000;
    return `${currencyData.symbol}${millions.toFixed(1)}M`;
  }
  
  if (compact && price >= 1000) {
    const thousands = price / 1000;
    return `${currencyData.symbol}${thousands.toFixed(0)}K`;
  }

  try {
    return new Intl.NumberFormat(currencyData.locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(price);
  } catch (e) {
    // Fallback formatting
    return `${currencyData.symbol}${price.toLocaleString()}`;
  }
};

/**
 * Format price for display in cards (compact)
 * @param {number} price - The price to format
 * @returns {string} Formatted price string
 */
export const formatPriceCompact = (price) => {
  return formatPrice(price, null, { compact: true });
};

/**
 * Get all available currencies
 * @returns {object} Currency data object
 */
export const getAvailableCurrencies = () => {
  return Object.entries(CURRENCIES).map(([code, data]) => ({
    code,
    ...data,
  }));
};

/**
 * Get currency symbol for a given code
 * @param {string} currencyCode - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currencyCode) => {
  return CURRENCIES[currencyCode]?.symbol || '$';
};

// ============================================
// THEME UTILITIES
// ============================================

/**
 * Get the current theme
 * @returns {string} 'light' or 'dark'
 */
export const getTheme = () => {
  // Check localStorage first
  const savedTheme = localStorage.getItem('primenest_theme');
  if (savedTheme) {
    return savedTheme;
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

/**
 * Set the theme
 * @param {string} theme - 'light' or 'dark'
 */
export const setTheme = (theme) => {
  localStorage.setItem('primenest_theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  
  // Add transition class temporarily
  document.body.classList.add('theme-transition');
  setTimeout(() => {
    document.body.classList.remove('theme-transition');
  }, 300);
};

/**
 * Toggle between light and dark themes
 * @returns {string} The new theme
 */
export const toggleTheme = () => {
  const currentTheme = getTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
};

/**
 * Initialize theme on page load
 */
export const initializeTheme = () => {
  const theme = getTheme();
  document.documentElement.setAttribute('data-theme', theme);
  
  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('primenest_theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
};

// ============================================
// GENERAL UTILITIES
// ============================================

/**
 * Debounce function
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${diffYears}y ago`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if device is mobile
 * @returns {boolean}
 */
export const isMobile = () => {
  return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Scroll to element smoothly
 * @param {string|HTMLElement} element - Element or selector
 * @param {object} options - Scroll options
 */
export const scrollToElement = (element, options = {}) => {
  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (el) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      ...options,
    });
  }
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  return num?.toLocaleString() || '0';
};

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
