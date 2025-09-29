# Contributing to LocalLens

Thank you for your interest in contributing to LocalLens! This document provides guidelines for contributing to our civic engagement platform.

## 🤝 How to Contribute

### **Reporting Issues**
- Use the GitHub issue tracker
- Include detailed reproduction steps
- Provide browser/device information
- Include screenshots for UI issues

### **Feature Requests**
- Check existing issues first
- Provide clear use cases and benefits
- Consider accessibility implications
- Include mockups or examples when possible

### **Code Contributions**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 🎯 Development Guidelines

### **Code Style**
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Maintain consistent formatting with Prettier

### **Accessibility Requirements**
- All components must be keyboard accessible
- Include proper ARIA labels and roles
- Test with screen readers
- Maintain color contrast ratios (WCAG AAA)
- Support high contrast mode

### **Testing**
- Write unit tests for new utilities
- Test accessibility features manually
- Verify multi-language support
- Test on various devices and browsers

### **Commit Messages**
Use conventional commit format:
```
feat: add new accessibility feature
fix: resolve screen reader compatibility issue
docs: update README with new features
style: format code with Prettier
refactor: improve component structure
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and API clients
├── contexts/           # React context providers
├── translations/       # Multi-language support
└── assets/             # Static assets
```

## 🔧 Development Setup

### **Prerequisites**
- Node.js 18+
- Git
- Azure CLI (for deployment)

### **Local Development**
```bash
# Clone and install
git clone https://github.com/your-username/locallens.git
cd locallens
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

### **Environment Variables**
Create `.env.local`:
```env
VITE_AZURE_FUNCTION_URL=https://your-function-app.azurewebsites.net/api
VITE_AZURE_TRANSLATOR_KEY=your-translator-key
```

## ♿ Accessibility Guidelines

### **Required Standards**
- WCAG AAA compliance
- Screen reader compatibility
- Keyboard navigation
- High contrast support
- Focus management

### **Testing Checklist**
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify keyboard-only navigation
- [ ] Check color contrast ratios
- [ ] Test high contrast mode
- [ ] Validate ARIA implementation

## 🌍 Internationalization

### **Adding New Languages**
1. Create translation file in `src/translations/`
2. Add language option to accessibility settings
3. Test with Azure Translator API
4. Update language selector component

### **Translation Keys**
Use descriptive, hierarchical keys:
```json
{
  "navigation": {
    "home": "Home",
    "community": "Community"
  },
  "accessibility": {
    "highContrast": "High Contrast Mode"
  }
}
```

## 🚀 Deployment

### **Azure Functions**
- Deploy using Azure Functions Core Tools
- Test endpoints before merging
- Update CORS settings if needed

### **Frontend**
- Build and deploy to Azure Static Web Apps
- Verify all routes work correctly
- Test accessibility features in production

## 📋 Pull Request Process

### **Before Submitting**
- [ ] Code follows project style guidelines
- [ ] Accessibility requirements met
- [ ] Tests pass (if applicable)
- [ ] Documentation updated
- [ ] No console errors or warnings

### **PR Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Accessibility
- [ ] Tested with screen reader
- [ ] Keyboard navigation works
- [ ] Color contrast maintained
- [ ] High contrast mode supported

## Testing
- [ ] Manual testing completed
- [ ] No console errors
- [ ] Cross-browser compatibility verified
```

## 🎉 Recognition

Contributors will be recognized in:
- README contributors section
- Release notes
- Project documentation

## 📞 Questions?

- **Discord**: [Community Server](https://discord.gg/locallens)
- **Email**: dev@locallens.ai
- **GitHub Discussions**: Use the Discussions tab

Thank you for helping make civic engagement more accessible! 🌟
