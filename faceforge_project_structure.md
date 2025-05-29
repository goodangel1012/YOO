# FaceForge AI - Project Structure

This document outlines the complete file and folder structure for the FaceForge AI mobile application.

## Root Directory

```
faceforge-ai/
├── .github/                    # GitHub configuration
│   ├── workflows/              # CI/CD workflows
│   ├── ISSUE_TEMPLATE/         # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md
├── android/                    # Android-specific code
├── ios/                        # iOS-specific code
├── src/                        # Main source code
├── docs/                       # Documentation
├── design/                     # Design assets and mockups
├── __tests__/                  # Test files
├── e2e/                        # End-to-end tests
├── scripts/                    # Build and utility scripts
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── .eslintrc.js              # ESLint configuration
├── .prettierrc.js            # Prettier configuration
├── babel.config.js           # Babel configuration
├── jest.config.js            # Jest configuration
├── metro.config.js           # Metro bundler configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies and scripts
├── README.md                 # Project overview
├── CONTRIBUTING.md           # Contribution guidelines
├── LICENSE                   # MIT License
└── CHANGELOG.md              # Version history
```

## Source Code Structure (`src/`)

```
src/
├── components/                 # Reusable UI components
│   ├── common/                # Generic reusable components
│   │   ├── Button/
│   │   │   ├── index.tsx
│   │   │   ├── Button.styles.ts
│   │   │   └── Button.test.tsx
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── LoadingSpinner/
│   │   ├── ProgressBar/
│   │   └── ErrorBoundary/
│   ├── forms/                 # Form-specific components
│   │   ├── AuthForm/
│   │   ├── ProfileForm/
│   │   └── TextPromptForm/
│   ├── ui/                    # UI-specific components
│   │   ├── Header/
│   │   ├── TabBar/
│   │   ├── Card/
│   │   ├── Avatar/
│   │   └── VideoPlayer/
│   └── media/                 # Media-related components
│       ├── CameraView/
│       ├── AudioRecorder/
│       ├── ImagePicker/
│       └── VideoThumbnail/
├── screens/                   # App screens/pages
│   ├── auth/                  # Authentication screens
│   │   ├── OnboardingScreen/
│   │   │   ├── index.tsx
│   │   │   ├── OnboardingScreen.styles.ts
│   │   │   └── components/
│   │   ├── SignInScreen/
│   │   └── SignUpScreen/
│   ├── home/                  # Home and dashboard
│   │   ├── HomeScreen/
│   │   └── LibraryScreen/
│   ├── creation/              # Avatar creation flow
│   │   ├── SelfieCapture/
│   │   ├── AvatarCustomization