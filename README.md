# Circadian Red

### True circadian-safe red light mode for websites

Protect your users' sleep and cellular health with scientifically-validated red-spectrum display mode. Goes far beyond "night mode."

[![npm version](https://img.shields.io/npm/v/circadian-red.svg)](https://www.npmjs.com/package/circadian-red)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[🌙 Live Demo](https://shaneclary.github.io/circadian-red) | [📚 Documentation](./docs/implementation-guide.md) | [🔬 The Science](./SCIENCE.md)

## The Problem

Modern "night modes" are scientifically inadequate:

- **Night Shift/f.lux** reduce blue light by only 15-18% at default settings
- **Blue-blocking glasses** filter 10-25% without standardization
- **450-480nm wavelengths** suppress melatonin AND destroy cellular structured water (Pollack research)
- Peak melanopsin sensitivity at **479nm** means most displays still disrupt circadian rhythm

## The Solution

Two modes designed for different use cases:

### CircadianSafe™ Mode
**Pure RGB(255,0,0) | Zero blue/green | <3 lux**

- Maximum biological protection
- Based on melanopsin sensitivity curve research
- Eliminates 446-477nm wavelengths entirely
- For evening use 2-3 hours before bed
- Preserves both melatonin production and cellular water structure

### RedMode (Relaxed)
**Warm red spectrum | Practical contrast | <5 lux**

- Substantial blue reduction (>90%)
- Better contrast for extended use
- Still circadian-friendly
- All-evening usability

## Quick Start

### CDN (Fastest)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/shaneclary/circadian-red/dist/circadian-red.min.css">
<script src="https://cdn.jsdelivr.net/gh/shaneclary/circadian-red/dist/circadian-red.min.js"></script>

<button onclick="CircadianRed.toggle()">🌙 Night Safe Mode</button>
```

### npm

```bash
npm install circadian-red
```

```javascript
import CircadianRed from 'circadian-red';

const cr = new CircadianRed({
  mode: 'safe',           // 'safe' or 'relaxed'
  intensity: 'medium',    // 'low', 'medium', 'high'
  autoEnable: true,       // Auto-enable on schedule
  scheduleStart: '20:00', // 8 PM
  scheduleEnd: '06:00'    // 6 AM
});

cr.enable();
```

### Three-Mode Toggle Pattern

```html
<div class="mode-selector">
  <button onclick="setMode('light')">☀️ Light</button>
  <button onclick="setMode('dark')">🌑 Dark</button>
  <button onclick="setMode('circadian')">🌙 Night Safe</button>
</div>
```

## Features

- ✅ **Pure red spectrum** (RGB 255,0,0) with zero blue/green channels
- ✅ **Gamma-corrected rendering** for accurate brightness perception
- ✅ **Contrast validation** ensuring WCAG AA compliance where possible
- ✅ **Image filtering** to maintain red-only display integrity
- ✅ **Auto-scheduling** based on user-defined times
- ✅ **Intensity control** for different environments
- ✅ **Framework agnostic** - works with React, Vue, vanilla JS
- ✅ **Accessibility focused** - maintains maximum possible contrast (5.25:1)

## Scientific Foundation

This implementation is based on peer-reviewed research:

- **Melanopsin biology**: Peak sensitivity at 479nm, minimal response above 620nm
- **Pollack's structured water**: 450-500nm destroys EZ water, red/IR enhances it
- **Contrast mathematics**: WCAG-compliant within red-spectrum limitations
- **Astronomy field standards**: Proven patterns from night vision preservation

Maximum achievable contrast in pure red: **5.25:1** (meets WCAG AA for normal text)

[Read the full scientific research](./SCIENCE.md)

## Use Cases

### ✅ Recommended For:
- Evening reading (2-3 hours before bed)
- Late-night messaging/communication
- Sleep tracking apps
- Health/wellness applications
- Astronomy software
- Night shift worker interfaces

### ⚠️ Not Recommended For:
- Color-critical work (photo editing, design)
- Complex data visualization requiring color coding
- Extended sessions >30 minutes (eye strain from monochromatic viewing)
- Accessibility contexts requiring >7:1 contrast (WCAG AAA)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Examples

See the [examples directory](./examples) for:
- Basic HTML toggle
- React integration
- Vue component
- WordPress plugin
- Obsidian plugin

## API Reference

### Constructor Options

```javascript
new CircadianRed({
  mode: 'safe',           // 'safe' | 'relaxed'
  intensity: 'medium',    // 'low' | 'medium' | 'high'
  autoEnable: false,      // boolean
  scheduleStart: '20:00', // 24-hour format
  scheduleEnd: '06:00',   // 24-hour format
  validateContrast: true, // boolean - warns if contrast insufficient
  gammaCorrection: true   // boolean - applies proper sRGB gamma
})
```

### Methods

- `enable(mode)` - Enable circadian mode
- `disable()` - Disable circadian mode
- `toggle()` - Toggle current state
- `setIntensity(level)` - Adjust brightness ('low'|'medium'|'high')
- `validateContrast()` - Check all text elements for sufficient contrast
- `getStatus()` - Returns current mode and settings

## CSS Variables

Customize the color palette while maintaining circadian safety:

```css
[data-circadian-mode="safe"] {
  --cr-bg-primary: rgb(0, 0, 0);
  --cr-bg-secondary: rgb(15, 0, 0);
  --cr-text-primary: rgb(255, 0, 0);
  --cr-text-secondary: rgb(200, 0, 0);
  --cr-accent: rgb(255, 0, 0);
  --cr-border: rgb(100, 0, 0);
}
```

**Important**: Always keep green and blue channels at 0 for true circadian safety.

## Testing & Validation

We provide tools to validate your implementation:

```javascript
CircadianRed.validateContrast(); // Checks all text elements
CircadianRed.measureIntensity(); // Guides lux measurement
CircadianRed.validateWavelengths(); // Confirms no blue/green leakage
```

[Testing documentation](./docs/testing-validation.md)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Priority Areas:
- Framework integrations (Angular, Svelte, etc.)
- Browser extension
- Mobile app implementations
- Clinical validation studies
- Accessibility improvements

## Roadmap

- [ ] Browser extension (Chrome, Firefox, Safari)
- [ ] WordPress plugin
- [ ] Obsidian plugin
- [ ] VS Code theme
- [ ] Figma design system
- [ ] Clinical sleep study validation
- [ ] Ambient light sensor integration
- [ ] E-ink display optimization

## License

MIT License - see [LICENSE](./LICENSE)

## Citations

This project builds on research from:
- Brainard et al. (2001) - Melanopsin sensitivity curves
- Lockley et al. (2003) - Blue light circadian effects
- Pollack (2013) - Fourth phase of water, EZ water research
- WCAG 2.1 - Accessibility contrast standards

## Acknowledgments

Built by [Shane Clary](https://github.com/shaneclary)

Inspired by the astronomy community's night vision preservation techniques and sleep research labs' circadian lighting protocols.

---

**Disclaimer**: This tool helps reduce circadian disruption but is not medical advice. Consult healthcare providers for sleep disorders. Effectiveness depends on proper configuration and usage patterns. Best results require measuring actual display output with a light meter.
