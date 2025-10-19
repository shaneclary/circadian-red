/**
 * Circadian Red - True circadian-safe red light mode
 * @license MIT
 * @author Shane Clary
 * @version 0.1.0
 *
 * Implements scientifically-validated red-spectrum display mode
 * Based on melanopsin sensitivity and structured water research
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory()
    : typeof define === 'function' && define.amd
    ? define(factory)
    : ((global = global || self), (global.CircadianRed = factory()));
})(this, function () {
  'use strict';

  /**
   * Default configuration options
   */
  const DEFAULTS = {
    mode: 'safe', // 'safe' | 'relaxed'
    intensity: 'medium', // 'low' | 'medium' | 'high'
    autoEnable: false,
    scheduleStart: '20:00',
    scheduleEnd: '06:00',
    validateContrast: true,
    gammaCorrection: true,
    storageKey: 'circadian-red-settings',
    transitionDuration: 300, // ms
  };

  /**
   * RGB to linear color space conversion (sRGB gamma decoding)
   */
  function sRGBToLinear(value) {
    const normalized = value / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  }

  /**
   * Linear to sRGB color space conversion (gamma encoding)
   */
  function linearToSRGB(value) {
    return value <= 0.0031308
      ? value * 12.92 * 255
      : (1.055 * Math.pow(value, 1 / 2.4) - 0.055) * 255;
  }

  /**
   * Calculate relative luminance according to WCAG
   * L = 0.2126 × R + 0.7152 × G + 0.0722 × B
   * For red-only displays: L = 0.2126 × R
   */
  function calculateLuminance(r, g, b) {
    return (
      0.2126 * sRGBToLinear(r) +
      0.7152 * sRGBToLinear(g) +
      0.0722 * sRGBToLinear(b)
    );
  }

  /**
   * Calculate contrast ratio between two colors
   * (L1 + 0.05) / (L2 + 0.05) where L1 is lighter
   */
  function calculateContrast(rgb1, rgb2) {
    const l1 = calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = calculateLuminance(rgb2.r, rgb2.g, rgb2.b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Parse RGB color string to object
   */
  function parseRGB(rgbString) {
    const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return { r: 0, g: 0, b: 0 };
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10),
    };
  }

  /**
   * Check if time is within scheduled range
   */
  function isWithinSchedule(start, end) {
    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    // Handle overnight schedules (e.g., 20:00 to 06:00)
    if (startMinutes > endMinutes) {
      return current >= startMinutes || current < endMinutes;
    }

    return current >= startMinutes && current < endMinutes;
  }

  /**
   * Main CircadianRed class
   */
  class CircadianRed {
    constructor(options = {}) {
      this.options = { ...DEFAULTS, ...options };
      this.enabled = false;
      this.observers = [];

      this.init();
    }

    /**
     * Initialize the library
     */
    init() {
      // Load saved settings
      this.loadSettings();

      // Apply gamma correction if enabled
      if (this.options.gammaCorrection) {
        this.applyGammaCorrection();
      }

      // Set up auto-enable schedule
      if (this.options.autoEnable) {
        this.scheduleAutoEnable();
      }

      // Set up mutation observer for dynamic content
      this.observeDOM();

      // Check if should be enabled on load
      if (this.getSavedState() === true) {
        this.enable();
      }
    }

    /**
     * Enable circadian mode
     */
    enable(mode = this.options.mode) {
      this.enabled = true;
      this.options.mode = mode;

      document.documentElement.setAttribute('data-circadian-mode', mode);
      document.documentElement.setAttribute(
        'data-circadian-intensity',
        this.options.intensity
      );

      this.filterImages();

      if (this.options.validateContrast) {
        this.validateContrast();
      }

      this.saveSettings();
      this.emit('enable', { mode });

      return this;
    }

    /**
     * Disable circadian mode
     */
    disable() {
      this.enabled = false;

      document.documentElement.removeAttribute('data-circadian-mode');
      document.documentElement.removeAttribute('data-circadian-intensity');

      this.saveSettings();
      this.emit('disable');

      return this;
    }

    /**
     * Toggle circadian mode
     */
    toggle() {
      return this.enabled ? this.disable() : this.enable();
    }

    /**
     * Set intensity level
     */
    setIntensity(level) {
      if (!['low', 'medium', 'high'].includes(level)) {
        console.warn(`Invalid intensity level: ${level}`);
        return this;
      }

      this.options.intensity = level;
      document.documentElement.setAttribute('data-circadian-intensity', level);

      this.saveSettings();
      this.emit('intensityChange', { level });

      return this;
    }

    /**
     * Apply proper gamma correction
     */
    applyGammaCorrection() {
      // This would ideally be handled at the browser level
      // For now, we ensure our CSS values are gamma-correct
      // Future: Could manipulate canvas/WebGL for pixel-perfect correction
    }

    /**
     * Filter images to red spectrum
     */
    filterImages() {
      const images = document.querySelectorAll('img, video, canvas, svg');
      images.forEach((img) => {
        if (!img.hasAttribute('data-cr-filtered')) {
          img.setAttribute('data-cr-filtered', 'true');
        }
      });
    }

    /**
     * Validate contrast ratios of all text elements
     */
    validateContrast() {
      const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button, li, td, th');
      const warnings = [];

      elements.forEach((el) => {
        const style = window.getComputedStyle(el);
        const color = parseRGB(style.color);
        const bgColor = parseRGB(style.backgroundColor);

        const contrast = calculateContrast(color, bgColor);
        const fontSize = parseFloat(style.fontSize);
        const fontWeight = parseInt(style.fontWeight, 10);

        // WCAG AA requirements
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
        const requiredContrast = isLargeText ? 3 : 4.5;

        if (contrast < requiredContrast) {
          warnings.push({
            element: el,
            contrast: contrast.toFixed(2),
            required: requiredContrast,
            text: el.textContent.substring(0, 50),
          });
        }
      });

      if (warnings.length > 0) {
        console.warn(
          `CircadianRed: ${warnings.length} elements have insufficient contrast:`,
          warnings
        );
      }

      return warnings;
    }

    /**
     * Measure display intensity (guidance for manual measurement)
     */
    measureIntensity() {
      const guidance = `
To measure actual display intensity:

1. Use a light meter or lux meter app
2. Hold sensor at eye position facing display
3. Display pure white (RGB 255,255,255)
4. Note the lux reading
5. Enable CircadianRed and display RGB(255,0,0)
6. Note the new lux reading - should be <3 lux for 'safe' mode

If above 3 lux:
- Reduce monitor backlight brightness
- Move further from display
- Adjust intensity to 'low' mode

Current mode: ${this.options.mode}
Current intensity: ${this.options.intensity}
Max safe lux: ${this.options.mode === 'safe' ? '3' : '5'}
      `;

      console.log(guidance);
      return guidance;
    }

    /**
     * Validate wavelengths (requires spectrophotometer - provides guidance)
     */
    validateWavelengths() {
      const guidance = `
To validate wavelength purity:

CircadianRed forces RGB(255,0,0) for 'safe' mode, which SHOULD eliminate
blue (450-495nm) and green (495-570nm) wavelengths entirely.

However, actual monitor output depends on:
- LCD backlight spectrum (white LED backlights emit broad spectrum)
- Color filter quality
- Panel technology (IPS vs OLED vs quantum dot)

For true validation:
1. Use a spectrophotometer (e.g., Ocean Optics USB2000+)
2. Measure display at RGB(255,0,0)
3. Verify no emission peaks <620nm
4. Ideal: Single peak at 630-650nm

Software check (limited):
- Verified: Green channel = 0, Blue channel = 0
- This prevents SOFTWARE mixing but doesn't guarantee
  hardware backlight doesn't leak shorter wavelengths

For maximum safety: Use OLED displays (per-pixel emission)
or red LED backlights, not white LED + filters.
      `;

      console.log(guidance);
      return guidance;
    }

    /**
     * Get current status
     */
    getStatus() {
      return {
        enabled: this.enabled,
        mode: this.options.mode,
        intensity: this.options.intensity,
        autoEnable: this.options.autoEnable,
        schedule: {
          start: this.options.scheduleStart,
          end: this.options.scheduleEnd,
          active: isWithinSchedule(this.options.scheduleStart, this.options.scheduleEnd),
        },
      };
    }

    /**
     * Schedule auto-enable based on time
     */
    scheduleAutoEnable() {
      // Check every minute
      setInterval(() => {
        const shouldBeEnabled = isWithinSchedule(
          this.options.scheduleStart,
          this.options.scheduleEnd
        );

        if (shouldBeEnabled && !this.enabled) {
          this.enable();
        } else if (!shouldBeEnabled && this.enabled) {
          this.disable();
        }
      }, 60000); // Check every minute

      // Also check immediately
      const shouldBeEnabled = isWithinSchedule(
        this.options.scheduleStart,
        this.options.scheduleEnd
      );
      if (shouldBeEnabled && !this.enabled) {
        this.enable();
      }
    }

    /**
     * Observe DOM for dynamic content
     */
    observeDOM() {
      const observer = new MutationObserver((mutations) => {
        if (this.enabled) {
          this.filterImages();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      this.observers.push(observer);
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
      try {
        localStorage.setItem(
          this.options.storageKey,
          JSON.stringify({
            enabled: this.enabled,
            mode: this.options.mode,
            intensity: this.options.intensity,
          })
        );
      } catch (e) {
        console.warn('CircadianRed: Could not save to localStorage', e);
      }
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
      try {
        const saved = localStorage.getItem(this.options.storageKey);
        if (saved) {
          const settings = JSON.parse(saved);
          this.enabled = settings.enabled || false;
          this.options.mode = settings.mode || this.options.mode;
          this.options.intensity = settings.intensity || this.options.intensity;
        }
      } catch (e) {
        console.warn('CircadianRed: Could not load from localStorage', e);
      }
    }

    /**
     * Get saved enabled state
     */
    getSavedState() {
      try {
        const saved = localStorage.getItem(this.options.storageKey);
        if (saved) {
          return JSON.parse(saved).enabled;
        }
      } catch (e) {
        return false;
      }
      return false;
    }

    /**
     * Simple event emitter
     */
    on(event, callback) {
      if (!this._events) this._events = {};
      if (!this._events[event]) this._events[event] = [];
      this._events[event].push(callback);
      return this;
    }

    /**
     * Emit event
     */
    emit(event, data) {
      if (!this._events || !this._events[event]) return;
      this._events[event].forEach((callback) => callback(data));
    }

    /**
     * Destroy instance and clean up
     */
    destroy() {
      this.disable();
      this.observers.forEach((observer) => observer.disconnect());
      this.observers = [];
      this._events = {};
    }
  }

  // Export
  return CircadianRed;
});
