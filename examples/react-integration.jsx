import React, { useEffect, useState, useCallback } from 'react';
import CircadianRed from 'circadian-red';
import 'circadian-red/dist/circadian-red.css';

/**
 * CircadianRed React Hook
 *
 * Usage:
 * const { enabled, toggle, setIntensity, status } = useCircadianRed({
 *   mode: 'safe',
 *   intensity: 'medium',
 *   autoEnable: false
 * });
 */
export function useCircadianRed(options = {}) {
  const [instance] = useState(() => new CircadianRed(options));
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Set up event listeners
    instance.on('enable', () => {
      setEnabled(true);
      setStatus(instance.getStatus());
    });

    instance.on('disable', () => {
      setEnabled(false);
      setStatus(instance.getStatus());
    });

    instance.on('intensityChange', () => {
      setStatus(instance.getStatus());
    });

    // Initial status
    setStatus(instance.getStatus());
    setEnabled(instance.enabled);

    // Cleanup
    return () => {
      instance.destroy();
    };
  }, [instance]);

  const toggle = useCallback(() => {
    instance.toggle();
  }, [instance]);

  const enable = useCallback((mode) => {
    instance.enable(mode);
  }, [instance]);

  const disable = useCallback(() => {
    instance.disable();
  }, [instance]);

  const setIntensity = useCallback((level) => {
    instance.setIntensity(level);
  }, [instance]);

  const validateContrast = useCallback(() => {
    return instance.validateContrast();
  }, [instance]);

  return {
    enabled,
    status,
    toggle,
    enable,
    disable,
    setIntensity,
    validateContrast,
    instance
  };
}

/**
 * CircadianRed Toggle Button Component
 */
export function CircadianToggle({ mode = 'safe', intensity = 'medium' }) {
  const { enabled, toggle } = useCircadianRed({ mode, intensity });

  return (
    <button
      onClick={toggle}
      className="circadian-toggle"
      aria-label={enabled ? 'Disable Night Safe Mode' : 'Enable Night Safe Mode'}
    >
      {enabled ? '☀️ Disable' : '🌙 Enable'} Night Safe Mode
    </button>
  );
}

/**
 * Three-Mode Selector Component (Light/Dark/Circadian)
 */
export function ModeSelector() {
  const { enable, disable } = useCircadianRed({
    mode: 'safe',
    intensity: 'medium'
  });

  const [currentMode, setCurrentMode] = useState('light');

  const handleModeChange = (mode) => {
    setCurrentMode(mode);

    if (mode === 'circadian') {
      enable('safe');
    } else if (mode === 'dark') {
      disable();
      document.body.classList.add('dark-mode');
    } else {
      disable();
      document.body.classList.remove('dark-mode');
    }

    // Persist preference
    localStorage.setItem('display-mode', mode);
  };

  // Restore saved mode on mount
  useEffect(() => {
    const saved = localStorage.getItem('display-mode');
    if (saved) {
      handleModeChange(saved);
    }
  }, []);

  return (
    <div className="circadian-mode-selector">
      <button
        onClick={() => handleModeChange('light')}
        data-active={currentMode === 'light'}
      >
        ☀️ Light
      </button>
      <button
        onClick={() => handleModeChange('dark')}
        data-active={currentMode === 'dark'}
      >
        🌑 Dark
      </button>
      <button
        onClick={() => handleModeChange('circadian')}
        data-active={currentMode === 'circadian'}
      >
        🌙 Night Safe
      </button>
    </div>
  );
}

/**
 * Intensity Control Component
 */
export function IntensityControl() {
  const { setIntensity, status } = useCircadianRed();

  return (
    <label className="intensity-control">
      Intensity:
      <select
        value={status?.intensity || 'medium'}
        onChange={(e) => setIntensity(e.target.value)}
      >
        <option value="low">Low (0.5 lux)</option>
        <option value="medium">Medium (1.5 lux)</option>
        <option value="high">High (3 lux)</option>
      </select>
    </label>
  );
}

/**
 * Status Display Component
 */
export function CircadianStatus() {
  const { status, enabled } = useCircadianRed();

  if (!status) return null;

  return (
    <div className="circadian-status">
      <h3>CircadianRed Status</h3>
      <div className="status-grid">
        <div className="status-item">
          <span className="label">Enabled:</span>
          <span className="value">{enabled ? 'Yes' : 'No'}</span>
        </div>
        <div className="status-item">
          <span className="label">Mode:</span>
          <span className="value">{status.mode}</span>
        </div>
        <div className="status-item">
          <span className="label">Intensity:</span>
          <span className="value">{status.intensity}</span>
        </div>
        {status.autoEnable && (
          <div className="status-item">
            <span className="label">Schedule:</span>
            <span className="value">
              {status.schedule.start} - {status.schedule.end}
              {status.schedule.active && ' (Active)'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Complete App Example
 */
export default function App() {
  const {
    enabled,
    status,
    toggle,
    setIntensity,
    validateContrast
  } = useCircadianRed({
    mode: 'safe',
    intensity: 'medium',
    autoEnable: false
  });

  const handleValidate = () => {
    const warnings = validateContrast();
    if (warnings.length === 0) {
      alert('✅ All elements pass WCAG AA contrast!');
    } else {
      console.warn('Contrast warnings:', warnings);
      alert(`⚠️ Found ${warnings.length} contrast issues. Check console.`);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>CircadianRed React Demo</h1>
        <p>True circadian-safe red light mode</p>
      </header>

      <section className="controls">
        <ModeSelector />

        <IntensityControl />

        <button onClick={handleValidate}>
          Validate Contrast
        </button>
      </section>

      <CircadianStatus />

      <main>
        <h2>About CircadianRed</h2>
        <p>
          CircadianRed eliminates the 446-477nm blue wavelengths that
          maximally suppress melatonin and disrupt circadian rhythm.
        </p>

        <h3>Features</h3>
        <ul>
          <li>Pure RGB(255,0,0) spectrum - zero blue/green</li>
          <li>Intensity below 3 lux for circadian safety</li>
          <li>WCAG AA contrast compliant (5.25:1 maximum)</li>
          <li>Auto-scheduling support</li>
          <li>React hooks for easy integration</li>
        </ul>

        <h3>Usage Example</h3>
        <pre><code>{`
import { useCircadianRed } from 'circadian-red';

function MyComponent() {
  const { enabled, toggle } = useCircadianRed({
    mode: 'safe',
    intensity: 'medium'
  });

  return (
    <button onClick={toggle}>
      {enabled ? 'Disable' : 'Enable'} Night Mode
    </button>
  );
}
        `}</code></pre>

        <h3>The Science</h3>
        <p>
          Based on melanopsin sensitivity research and Pollack's
          structured water studies showing:
        </p>
        <ul>
          <li>Melanopsin peaks at 479nm</li>
          <li>450-500nm destroys cellular EZ water</li>
          <li>Red light (>620nm) preserves both circadian rhythm and cell structure</li>
        </ul>
      </main>

      <footer>
        <p>
          Current status: <strong>{enabled ? 'Protected' : 'Standard'}</strong>
          {enabled && ` | Intensity: ${status?.intensity}`}
        </p>
      </footer>
    </div>
  );
}
