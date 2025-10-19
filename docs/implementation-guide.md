# Implementation Guide

## Quick Start (5 Minutes)

### 1. Add CircadianRed to Your Site

#### Via CDN (Fastest)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Site with CircadianRed</title>

  <!-- CircadianRed CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/shaneclary/circadian-red/dist/circadian-red.min.css">
</head>
<body>

  <h1>My Website</h1>
  <p>Content goes here...</p>

  <!-- Toggle button -->
  <button onclick="CircadianRed.toggle()">🌙 Night Safe Mode</button>

  <!-- CircadianRed JS -->
  <script src="https://cdn.jsdelivr.net/gh/shaneclary/circadian-red/dist/circadian-red.min.js"></script>
  <script>
    // Initialize
    const cr = new CircadianRed({
      mode: 'safe',
      intensity: 'medium',
      autoEnable: false
    });
  </script>

</body>
</html>
```

#### Via npm

```bash
npm install circadian-red
```

```javascript
import CircadianRed from 'circadian-red';
import 'circadian-red/dist/circadian-red.css';

const cr = new CircadianRed({
  mode: 'safe',
  intensity: 'medium'
});
```

### 2. Add a Toggle Button

```html
<!-- Simple toggle -->
<button id="cr-toggle">🌙 Night Mode</button>

<script>
  const cr = new CircadianRed();
  document.getElementById('cr-toggle').addEventListener('click', () => {
    cr.toggle();
  });
</script>
```

### 3. Test

1. Click the toggle button
2. Verify display turns pure red
3. Check that text is readable
4. Confirm no blue/green tint visible

---

## Advanced Setup (30 Minutes)

### Three-Mode Toggle (Light/Dark/Circadian)

```html
<div class="mode-selector circadian-mode-selector">
  <button data-mode="light" onclick="setMode('light')">
    ☀️ Light
  </button>
  <button data-mode="dark" onclick="setMode('dark')">
    🌑 Dark
  </button>
  <button data-mode="circadian" onclick="setMode('circadian')" data-active="false">
    🌙 Night Safe
  </button>
</div>

<script>
  const cr = new CircadianRed();
  let currentMode = 'light';

  function setMode(mode) {
    // Update button states
    document.querySelectorAll('[data-mode]').forEach(btn => {
      btn.setAttribute('data-active', btn.dataset.mode === mode);
    });

    if (mode === 'circadian') {
      cr.enable('safe');
      document.body.classList.remove('dark-mode');
    } else if (mode === 'dark') {
      cr.disable();
      document.body.classList.add('dark-mode');
    } else {
      cr.disable();
      document.body.classList.remove('dark-mode');
    }

    currentMode = mode;
    localStorage.setItem('display-mode', mode);
  }

  // Restore saved mode on load
  window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('display-mode') || 'light';
    setMode(saved);
  });
</script>
```

### Auto-Enable on Schedule

```javascript
const cr = new CircadianRed({
  mode: 'safe',
  intensity: 'medium',
  autoEnable: true,
  scheduleStart: '20:00',  // 8 PM
  scheduleEnd: '06:00'     // 6 AM
});

// Check schedule status
console.log(cr.getStatus().schedule);
// {
//   start: '20:00',
//   end: '06:00',
//   active: true/false
// }
```

### Intensity Control

```html
<label>
  Intensity:
  <select id="intensity-select" onchange="cr.setIntensity(this.value)">
    <option value="low">Low (0.5 lux)</option>
    <option value="medium" selected>Medium (1.5 lux)</option>
    <option value="high">High (3 lux)</option>
  </select>
</label>
```

### Event Listeners

```javascript
cr.on('enable', (data) => {
  console.log('CircadianRed enabled:', data.mode);
  // Update UI, analytics, etc.
});

cr.on('disable', () => {
  console.log('CircadianRed disabled');
});

cr.on('intensityChange', (data) => {
  console.log('Intensity changed to:', data.level);
});
```

---

## Framework Integration

### React

```jsx
import React, { useEffect, useState } from 'react';
import CircadianRed from 'circadian-red';
import 'circadian-red/dist/circadian-red.css';

function App() {
  const [cr] = useState(() => new CircadianRed({
    mode: 'safe',
    intensity: 'medium'
  }));
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    cr.on('enable', () => setEnabled(true));
    cr.on('disable', () => setEnabled(false));

    return () => cr.destroy();
  }, [cr]);

  const toggleMode = () => {
    cr.toggle();
  };

  return (
    <div className="App">
      <h1>My React App</h1>

      <button onClick={toggleMode}>
        {enabled ? '☀️ Disable' : '🌙 Enable'} Night Safe Mode
      </button>

      {/* Your content */}
    </div>
  );
}

export default App;
```

### Vue 3

```vue
<template>
  <div class="app">
    <h1>My Vue App</h1>

    <button @click="toggle">
      {{ enabled ? '☀️ Disable' : '🌙 Enable' }} Night Safe Mode
    </button>

    <!-- Your content -->
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import CircadianRed from 'circadian-red';
import 'circadian-red/dist/circadian-red.css';

const enabled = ref(false);
let cr;

onMounted(() => {
  cr = new CircadianRed({
    mode: 'safe',
    intensity: 'medium'
  });

  cr.on('enable', () => enabled.value = true);
  cr.on('disable', () => enabled.value = false);
});

onUnmounted(() => {
  if (cr) cr.destroy();
});

const toggle = () => {
  if (cr) cr.toggle();
};
</script>
```

### Angular

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import CircadianRed from 'circadian-red';
import 'circadian-red/dist/circadian-red.css';

@Component({
  selector: 'app-root',
  template: `
    <h1>My Angular App</h1>

    <button (click)="toggle()">
      {{ enabled ? '☀️ Disable' : '🌙 Enable' }} Night Safe Mode
    </button>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  private cr: CircadianRed;
  enabled = false;

  ngOnInit() {
    this.cr = new CircadianRed({
      mode: 'safe',
      intensity: 'medium'
    });

    this.cr.on('enable', () => this.enabled = true);
    this.cr.on('disable', () => this.enabled = false);
  }

  ngOnDestroy() {
    if (this.cr) this.cr.destroy();
  }

  toggle() {
    this.cr.toggle();
  }
}
```

---

## CSS Customization

### Override Color Variables

```css
/* Customize while maintaining circadian safety */
[data-circadian-mode="safe"] {
  /* Your brand red (must keep G=0, B=0!) */
  --cr-text-primary: rgb(255, 0, 0);
  --cr-text-secondary: rgb(200, 0, 0);

  /* Adjust backgrounds */
  --cr-bg-primary: rgb(10, 0, 0);  /* Slightly lighter */
  --cr-bg-secondary: rgb(20, 0, 0);

  /* Custom borders */
  --cr-border: rgb(120, 0, 0);
}
```

**WARNING:** Always keep green and blue channels at 0 for true circadian safety!

### Custom Utility Classes

```css
/* Add your own classes */
.my-card {
  background-color: var(--cr-bg-secondary);
  border: 1px solid var(--cr-border);
  padding: 20px;
  border-radius: 8px;
}

.my-heading {
  color: var(--cr-text-primary);
  font-size: 2em;
  margin-bottom: 0.5em;
}
```

### Integration with Existing Dark Mode

```css
/* Light mode */
body {
  background: white;
  color: black;
}

/* Your existing dark mode */
body.dark-mode {
  background: #1a1a1a;
  color: #e0e0e0;
}

/* CircadianRed overrides everything when active */
[data-circadian-mode="safe"] body,
[data-circadian-mode="safe"] body.dark-mode {
  background: rgb(0, 0, 0) !important;
  color: rgb(255, 0, 0) !important;
}
```

---

## Design Best Practices

### 1. Hierarchy Without Color

Since you can only use brightness variations:

```html
<!-- Use size for hierarchy -->
<h1 style="font-size: 3em;">Most Important</h1>
<h2 style="font-size: 2em;">Secondary</h2>
<p style="font-size: 1em;">Body text</p>

<!-- Use weight -->
<span style="font-weight: 700;">Emphasized</span>
<span style="font-weight: 400;">Normal</span>

<!-- Use spacing -->
<div style="margin-bottom: 2em;">Section 1</div>
<div style="margin-bottom: 2em;">Section 2</div>

<!-- Use borders -->
<div style="border-left: 3px solid var(--cr-border); padding-left: 1em;">
  Highlighted content
</div>
```

### 2. Avoid Mid-Range Reds

```css
/* ✅ GOOD - High contrast */
.good-text {
  color: rgb(255, 0, 0);  /* Bright red */
  background: rgb(0, 0, 0);  /* Black */
}

/* ❌ BAD - Mid-range is hard to see */
.bad-text {
  color: rgb(150, 0, 0);  /* Mid red */
  background: rgb(100, 0, 0);  /* Also mid red */
}

/* ✅ GOOD - Clear separation */
.good-secondary {
  color: rgb(200, 0, 0);  /* Still bright */
  background: rgb(15, 0, 0);  /* Nearly black */
}
```

### 3. Increase Touch Targets

```css
[data-circadian-mode] button {
  min-height: 44px;  /* iOS minimum */
  min-width: 44px;
  padding: 12px 20px;
  font-size: 16px;  /* Larger than usual */
}
```

### 4. Clear Focus Indicators

```css
[data-circadian-mode] *:focus-visible {
  outline: 3px solid rgb(255, 0, 0);
  outline-offset: 2px;
}
```

---

## Validation & Testing

### Contrast Validation

```javascript
// Check all elements for sufficient contrast
const warnings = cr.validateContrast();

if (warnings.length > 0) {
  console.warn('Contrast issues found:', warnings);
  // warnings = [
  //   {
  //     element: <DOM node>,
  //     contrast: 3.2,
  //     required: 4.5,
  //     text: "Sample text content..."
  //   }
  // ]
}
```

### Intensity Measurement

```javascript
// Get guidance for manual measurement
cr.measureIntensity();

// Prints:
// 1. Use a light meter
// 2. Display white (RGB 255,255,255)
// 3. Note baseline lux
// 4. Enable CircadianRed
// 5. Note red lux - should be <3 for 'safe'
```

### Wavelength Validation

```javascript
// Get guidance for spectral measurement
cr.validateWavelengths();

// Explains how to verify no blue/green leakage
// (Requires spectrophotometer for full validation)
```

### User Testing Checklist

- [ ] Can users read body text comfortably?
- [ ] Is the visual hierarchy clear?
- [ ] Can users distinguish between interactive elements?
- [ ] Are focus indicators visible?
- [ ] Can users complete core tasks?
- [ ] After 10 minutes, any eye strain?
- [ ] Is the auto-schedule working correctly?
- [ ] Does it persist across page reloads?

---

## Deployment Checklist

### Before Launch

- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices (iOS, Android)
- [ ] Validate contrast ratios
- [ ] Measure actual lux output
- [ ] Test with screen readers
- [ ] Verify keyboard navigation works
- [ ] Check that images filter properly
- [ ] Test toggle/settings persistence
- [ ] Add user guidance/tutorial
- [ ] Document any limitations

### Performance Optimization

```javascript
// Debounce DOM observations for better performance
const cr = new CircadianRed({
  mode: 'safe',
  intensity: 'medium',
  // Reduce observation frequency if needed
  observationDebounce: 500  // ms
});
```

### Analytics Integration

```javascript
cr.on('enable', (data) => {
  // Track usage
  analytics.track('CircadianRed Enabled', {
    mode: data.mode,
    intensity: cr.options.intensity
  });
});

cr.on('disable', () => {
  analytics.track('CircadianRed Disabled');
});
```

---

## Common Issues & Solutions

### Issue: Text too dim to read

**Solution:**
```javascript
// Increase intensity
cr.setIntensity('high');

// Or increase font sizes in CSS
[data-circadian-mode] body {
  font-size: 18px;  /* Larger base size */
}
```

### Issue: Images look wrong

**Solution:**
```css
/* Adjust image filter */
[data-circadian-mode="safe"] img {
  filter: saturate(0) brightness(0.8) sepia(100%) hue-rotate(-50deg) !important;
  /* Tweak values as needed */
}

/* Or disable filtering for specific images */
img.preserve-original {
  filter: none !important;
}
```

### Issue: Conflicts with existing CSS

**Solution:**
```javascript
// CircadianRed uses !important to override
// If you need more specificity:
[data-circadian-mode="safe"] .my-specific-element {
  color: rgb(255, 0, 0) !important;
}
```

### Issue: Not working on specific browser

**Check:**
1. Browser supports CSS custom properties (IE11 not supported)
2. JavaScript enabled
3. Console errors?
4. Try without other extensions/plugins

---

## Next Steps

- Read the [Science documentation](../SCIENCE.md) to understand the research
- Explore the [examples directory](../examples) for complete implementations
- Join discussions on [GitHub Issues](https://github.com/shaneclary/circadian-red/issues)
- Contribute improvements via pull requests

## Support

- **Issues:** https://github.com/shaneclary/circadian-red/issues
- **Email:** shane@shaneclary.com
- **Discussions:** GitHub Discussions (coming soon)
