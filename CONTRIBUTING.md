# Contributing to CircadianRed

Thank you for your interest in contributing to CircadianRed! This project aims to provide scientifically-validated circadian-safe display technology as a public good.

## How to Contribute

### Reporting Issues

- Use the [GitHub Issues](https://github.com/shaneclary/circadian-red/issues) page
- Check if the issue already exists before creating a new one
- Provide clear reproduction steps
- Include browser/OS information
- For scientific questions, cite relevant research when possible

### Suggesting Features

We welcome feature suggestions that align with our core mission:
- Preserving circadian health
- Maintaining scientific validity
- Improving usability within red-spectrum constraints
- Expanding framework/platform support

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Test thoroughly** (see Testing Guidelines below)
5. **Commit with clear messages**: `git commit -m "Add: feature description"`
6. **Push to your fork**: `git push origin feature/your-feature-name`
7. **Open a Pull Request**

#### PR Guidelines

- Maintain zero blue/green channels in red-spectrum modes
- Preserve WCAG AA contrast compliance where possible
- Add tests for new features
- Update documentation as needed
- Follow existing code style
- Keep PRs focused on a single feature/fix

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/circadian-red.git
cd circadian-red

# Install dependencies
npm install

# Run development build
npm run dev

# Run tests
npm test

# Validate contrast
npm run validate
```

## Testing Guidelines

### Manual Testing Checklist

- [ ] Test in Chrome, Firefox, Safari, Edge
- [ ] Test on mobile (iOS and Android)
- [ ] Verify pure red output (no green/blue visible)
- [ ] Check contrast ratios with validator
- [ ] Test with screen reader
- [ ] Verify keyboard navigation
- [ ] Test auto-scheduling
- [ ] Check localStorage persistence

### Automated Testing

- Write unit tests for new functions
- Ensure contrast validation passes
- Test color channel purity (G=0, B=0)

## Code Style

### JavaScript

- Use ES6+ features
- Prefer `const` over `let`, avoid `var`
- Use meaningful variable names
- Comment complex logic
- Follow existing patterns for consistency

### CSS

- Use CSS custom properties for colors
- Maintain red-spectrum purity (G=0, B=0)
- Include fallbacks for older browsers
- Comment non-obvious decisions
- Keep specificity low where possible

### Documentation

- Update README.md for user-facing changes
- Update SCIENCE.md for research-related additions
- Update implementation-guide.md for developer changes
- Include code examples for new features

## Priority Areas for Contribution

We especially welcome contributions in these areas:

### 1. Framework Integrations
- Angular component library
- Svelte components
- Web Components
- CMS plugins (WordPress, Drupal, etc.)

### 2. Browser Extensions
- Chrome extension
- Firefox add-on
- Safari extension
- Edge extension

### 3. Scientific Validation
- Clinical sleep studies
- Spectral measurement data
- Usability research
- Accessibility audits

### 4. Design Resources
- Figma design system
- Sketch library
- Design guidelines for red-spectrum UIs
- Color palette generators

### 5. Documentation
- Translation to other languages
- Video tutorials
- Blog posts explaining the science
- Case studies from real implementations

### 6. Testing & Quality
- Cross-browser testing automation
- Accessibility testing tools
- Performance benchmarks
- Contrast validation improvements

## Scientific Standards

When contributing features based on research:

1. **Cite peer-reviewed sources** when making claims
2. **Maintain wavelength purity** - no compromises on G=0, B=0
3. **Document intensity targets** - measurements, not estimates
4. **Preserve contrast standards** - WCAG compliance where possible
5. **Be honest about limitations** - red-spectrum has real constraints

## Code of Conduct

### Our Standards

- **Respectful communication** - Be kind and constructive
- **Scientific rigor** - Back claims with evidence
- **Accessibility focus** - Consider all users
- **Open collaboration** - Share knowledge freely
- **Health-first mindset** - Prioritize biology over aesthetics

### Unacceptable Behavior

- Harassment or discrimination
- Dismissing scientific evidence
- Compromising wavelength purity for aesthetics
- Plagiarism or uncredited work
- Spam or self-promotion unrelated to the project

## Getting Help

- **Documentation**: Start with [implementation-guide.md](./docs/implementation-guide.md)
- **Science Questions**: Read [SCIENCE.md](./SCIENCE.md)
- **GitHub Discussions**: Ask questions (coming soon)
- **Email**: shane@shaneclary.com for complex inquiries

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Acknowledged in documentation where appropriate

Significant contributions may earn co-authorship on any published papers about the project.

## License

By contributing, you agree that your contributions will be licensed under the MIT License, the same license covering the project.

---

Thank you for helping make circadian-safe display technology accessible to everyone!
