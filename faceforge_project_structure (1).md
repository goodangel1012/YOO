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
│   │   ├── AvatarCustomization/
│   │   ├── VoiceCapture/
│   │   ├── TextPrompt/
│   │   └── VideoGeneration/
│   └── video/                 # Video-related screens
│       ├── VideoPlayback/
│       ├── VideoLibrary/
│       └── VideoShare/
├── navigation/                # Navigation configuration
│   ├── AppNavigator.tsx      # Main app navigator
│   ├── AuthNavigator.tsx     # Authentication flow navigator
│   ├── CreationNavigator.tsx # Avatar creation flow navigator
│   ├── TabNavigator.tsx      # Bottom tab navigator
│   └── types.ts              # Navigation type definitions
├── services/                  # External service integrations
│   ├── api/                   # API service layers
│   │   ├── base.ts           # Base API configuration
│   │   ├── auth.ts           # Authentication API
│   │   ├── avatar.ts         # Avatar generation API
│   │   ├── voice.ts          # Voice cloning API
│   │   └── video.ts          # Video generation API
│   ├── ai/                    # AI service integrations
│   │   ├── chatgpt.ts        # ChatGPT Vision API
│   │   ├── cartesia.ts       # Cartesia voice cloning
│   │   └── hedra.ts          # Hedra video generation
│   ├── storage/               # Storage services
│   │   ├── firebase.ts       # Firebase integration
│   │   ├── s3.ts             # AWS S3 integration
│   │   └── local.ts          # Local storage utilities
│   ├── auth/                  # Authentication services
│   │   ├── firebase-auth.ts  # Firebase authentication
│   │   └── oauth.ts          # OAuth providers
│   └── media/                 # Media processing services
│       ├── image.ts          # Image processing
│       ├── audio.ts          # Audio processing
│       └── video.ts          # Video processing
├── utils/                     # Utility functions
│   ├── constants.ts          # App constants
│   ├── helpers.ts            # General helper functions
│   ├── validation.ts         # Input validation
│   ├── formatting.ts         # Data formatting
│   ├── permissions.ts        # Device permissions
│   ├── file.ts               # File operations
│   └── animation.ts          # Animation utilities
├── hooks/                     # Custom React hooks
│   ├── useAuth.ts            # Authentication hook
│   ├── useCamera.ts          # Camera functionality
│   ├── useAudio.ts           # Audio recording/playback
│   ├── useVideo.ts           # Video operations
│   ├── usePermissions.ts     # Device permissions
│   ├── useStorage.ts         # Storage operations
│   └── useAPI.ts             # API interaction hooks
├── store/                     # State management
│   ├── index.ts              # Store configuration
│   ├── authSlice.ts          # Authentication state
│   ├── avatarSlice.ts        # Avatar state
│   ├── videoSlice.ts         # Video library state
│   └── settingsSlice.ts      # App settings state
├── types/                     # TypeScript type definitions
│   ├── api.ts                # API response types
│   ├── auth.ts               # Authentication types
│   ├── avatar.ts             # Avatar-related types
│   ├── video.ts              # Video-related types
│   ├── navigation.ts         # Navigation types
│   └── common.ts             # Common/shared types
├── assets/                    # Static assets
│   ├── images/               # Image assets
│   │   ├── icons/            # App icons
│   │   ├── illustrations/    # Onboarding illustrations
│   │   ├── backgrounds/      # Background images
│   │   └── placeholders/     # Placeholder images
│   ├── fonts/                # Custom fonts
│   ├── animations/           # Lottie animations
│   └── sounds/               # Sound effects
├── styles/                    # Global styles and themes
│   ├── colors.ts             # Color palette
│   ├── typography.ts         # Font styles
│   ├── spacing.ts            # Spacing constants
│   ├── theme.ts              # App theme configuration
│   └── globals.ts            # Global style utilities
└── constants/                 # App-wide constants
    ├── api.ts                # API endpoints and keys
    ├── dimensions.ts         # Screen dimensions
    ├── strings.ts            # Static text content
    └── config.ts             # App configuration
```

## Test Structure (`__tests__/` and `e2e/`)

```
__tests__/                     # Unit and integration tests
├── components/                # Component tests
│   ├── common/
│   ├── forms/
│   └── ui/
├── screens/                   # Screen tests
│   ├── auth/
│   ├── creation/
│   └── video/
├── services/                  # Service tests
│   ├── api/
│   ├── ai/
│   └── storage/
├── utils/                     # Utility function tests
├── hooks/                     # Custom hook tests
└── __mocks__/                 # Test mocks and fixtures

e2e/                          # End-to-end tests
├── tests/                    # E2E test files
│   ├── onboarding.e2e.js
│   ├── avatar-creation.e2e.js
│   ├── voice-cloning.e2e.js
│   └── video-generation.e2e.js
├── fixtures/                 # Test data and assets
├── helpers/                  # E2E test helpers
└── config/                   # Detox configuration
```

## Documentation Structure (`docs/`)

```
docs/
├── api/                      # API documentation
│   ├── authentication.md
│   ├── avatar-generation.md
│   ├── voice-cloning.md
│   └── video-generation.md
├── development/              # Development guides
│   ├── setup.md
│   ├── debugging.md
│   ├── testing.md
│   └── deployment.md
├── design/                   # Design documentation
│   ├── design-system.md
│   ├── user-flows.md
│   └── accessibility.md
├── architecture/             # Architecture documentation
│   ├── overview.md
│   ├── state-management.md
│   ├── navigation.md
│   └── performance.md
└── user-guide/              # User documentation
    ├── getting-started.md
    ├── features.md
    └── troubleshooting.md
```

## Design Assets (`design/`)

```
design/
├── mockups/                  # Screen mockups
│   ├── onboarding/
│   ├── avatar-creation/
│   ├── video-generation/
│   └── library/
├── wireframes/               # Low-fidelity wireframes
├── user-flows/               # User journey diagrams
├── style-guide/              # Visual design guide
│   ├── colors.png
│   ├── typography.png
│   ├── icons.png
│   └── components.png
├── assets/                   # Design source files
│   ├── sketch-files/
│   ├── figma-files/
│   └── adobe-files/
└── exports/                  # Exported assets for development
    ├── icons/
    ├── illustrations/
    └── backgrounds/
```

## Platform-Specific Structure

### iOS (`ios/`)

```
ios/
├── FaceForgeAI/              # Main iOS project
│   ├── AppDelegate.h
│   ├── AppDelegate.m
│   ├── Info.plist
│   ├── LaunchScreen.storyboard
│   └── Images.xcassets/
├── FaceForgeAI.xcodeproj/    # Xcode project file
├── FaceForgeAI.xcworkspace/  # Xcode workspace
├── Podfile                   # CocoaPods dependencies
├── Podfile.lock             # Locked CocoaPods versions
└── Pods/                    # CocoaPods installed libraries
```

### Android (`android/`)

```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/faceforgeai/
│   │       ├── res/
│   │       └── AndroidManifest.xml
│   ├── build.gradle
│   └── proguard-rules.pro
├── gradle/
├── build.gradle
├── gradle.properties
├── gradlew
├── gradlew.bat
└── settings.gradle
```

## Configuration Files

### Key Configuration Files

- **`.env.example`** - Environment variables template
- **`babel.config.js`** - Babel transpilation settings
- **`jest.config.js`** - Jest testing configuration
- **`metro.config.js`** - Metro bundler configuration
- **`tsconfig.json`** - TypeScript compiler settings
- **`.eslintrc.js`** - ESLint linting rules
- **`.prettierrc.js`** - Prettier formatting rules
- **`detox.config.js`** - E2E testing configuration

### Package Scripts

The `package.json` includes scripts for:

- **Development**: `start`, `ios`, `android`
- **Testing**: `test`, `test:e2e`, `lint`, `type-check`
- **Building**: `build:android`, `build:ios`
- **Maintenance**: `clean`, `postinstall`

This structure ensures:

1. **Separation of concerns** - Each directory has a specific purpose
2. **Scalability** - Easy to add new features and components
3. **Maintainability** - Clear organization makes code easy to find and update
4. **Testing** - Comprehensive test coverage with organized test files
5. **Cross-platform support** - Proper iOS and Android project structure
6. **Documentation** - Complete documentation for all aspects of the project

The structure follows React Native best practices and supports the complete user flow outlined in the design brief, from onboarding through video generation and library management.