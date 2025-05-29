# Contributing to FaceForge AI

Thank you for your interest in contributing to FaceForge AI! We welcome contributions from the community and are excited to see what you can bring to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@faceforge-ai.com](mailto:conduct@faceforge-ai.com).

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Set up the development environment (see [README.md](README.md))
4. Create a new branch for your changes
5. Make your changes
6. Test your changes
7. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 18+
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)
- Git

### Environment Setup

1. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/faceforge-ai.git
   cd faceforge-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Fill in the required API keys and configuration
   ```

4. **Install iOS dependencies** (if developing for iOS)
   ```bash
   cd ios && pod install && cd ..
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes** - Help us squash bugs
- ✨ **New features** - Add functionality that benefits users
- 📚 **Documentation** - Improve our docs, comments, or examples
- 🎨 **Design improvements** - Enhance UI/UX
- ⚡ **Performance optimizations** - Make the app faster
- 🧪 **Tests** - Add or improve test coverage
- 🔧 **Developer experience** - Improve build tools, CI/CD, etc.

### Before You Start

1. **Check existing issues** - Look for existing issues or feature requests
2. **Open an issue** - If you're planning a significant change, open an issue first to discuss it
3. **Assign yourself** - Comment on the issue to let others know you're working on it

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes**
   - Follow our coding standards (see below)
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add voice cloning optimization"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use a clear and descriptive title
   - Describe what changes you made and why
   - Reference any related issues
   - Include screenshots for UI changes

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use strict mode settings

### React Native

- Use functional components with hooks
- Follow React Native best practices
- Use proper lifecycle management
- Optimize for performance

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run prettier
```

### File Structure

```
src/
├── components/
│   ├── common/           # Reusable components
│   ├── forms/           # Form components
│   └── ui/              # UI-specific components
├── screens/
│   ├── auth/            # Authentication screens
│   ├── avatar/          # Avatar-related screens
│   └── video/           # Video-related screens
├── services/
│   ├── api/             # API service layers
│   ├── auth/            # Authentication services
│   └── storage/         # Storage services
├── utils/
├── hooks/
├── types/
└── constants/
```

### Naming Conventions

- **Components**: PascalCase (e.g., `AvatarPreview`)
- **Files**: camelCase for utilities, PascalCase for components
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase with descriptive names

## Testing Guidelines

### Unit Tests

- Write tests for utility functions
- Test component behavior, not implementation
- Use Jest and React Native Testing Library
- Aim for meaningful test coverage

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

### Integration Tests

- Test user flows and interactions
- Use Detox for E2E testing
- Test on both iOS and Android

```bash
# Build E2E tests
npm run test:e2e:build

# Run E2E tests
npm run test:e2e
```

### Manual Testing

- Test on both iOS and Android
- Test different device sizes
- Test with slow networks
- Test edge cases and error conditions

## Issue Reporting

When reporting issues, please include:

1. **Clear title** and description
2. **Steps to reproduce** the issue
3. **Expected behavior** vs actual behavior
4. **Device information** (OS, version, device model)
5. **App version** where the issue occurs
6. **Screenshots/videos** if applicable
7. **Console logs** if relevant

### Issue Templates

**Bug Report:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
Add screenshots if applicable.

**Environment:**
- Device: [e.g. iPhone 12, Samsung Galaxy S21]
- OS: [e.g. iOS 15.0, Android 12]
- App Version: [e.g. 1.0.0]
```

**Feature Request:**
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Any other context or screenshots.
```

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature development branches
- `fix/*` - Bug fix branches
- `release/*` - Release preparation branches

### Release Process

1. Create release branch from `develop`
2. Update version numbers
3. Update CHANGELOG.md
4. Test thoroughly
5. Merge to `main` and tag release
6. Deploy to app stores

Thank you for contributing to FaceForge AI! 🎭✨