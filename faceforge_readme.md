# FaceForge AI 🎭

Turn a selfie into a speaking, lifelike digital avatar with AI-powered voice cloning and video generation.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-0.72-blue.svg)](https://reactnative.dev/)
[![iOS](https://img.shields.io/badge/iOS-13.0+-black.svg)](https://developer.apple.com/ios/)
[![Android](https://img.shields.io/badge/Android-API%2021+-green.svg)](https://developer.android.com)

## Overview

FaceForge AI is a cross-platform mobile application that transforms a user's selfie into a lifelike, talking digital avatar video. By leveraging advanced AI services, users can create personalized avatar videos in minutes with just a photo and a few seconds of their voice.

### Key Features

- 📸 **Selfie to Avatar**: Convert any selfie into a digital avatar
- 🎨 **AI-Powered Customization**: Modify appearance using natural language prompts
- 🔊 **Voice Cloning**: Clone your voice from just 3 seconds of audio
- 🎬 **Video Generation**: Create talking avatar videos up to 60 seconds
- 📱 **Cross-Platform**: Native iOS and Android experience
- 💾 **Personal Library**: Save and manage all your avatar videos

## Tech Stack

### Frontend
- **React Native 0.72+** - Cross-platform mobile development
- **TypeScript** - Type-safe development
- **React Navigation 6** - Navigation library
- **React Native Reanimated 3** - Smooth animations
- **React Native Paper** - Material Design components
- **Expo Camera** - Camera functionality
- **React Native Video** - Video playback

### Backend Services
- **ChatGPT Vision API** - Image editing and avatar customization
- **Cartesia API** - 3-second voice cloning technology
- **Hedra API** - Talking avatar video generation
- **Firebase** - Authentication and data storage
- **AWS S3** - Media file storage

### Development Tools
- **Expo CLI** - Development toolchain
- **ESLint + Prettier** - Code formatting and linting
- **Jest** - Unit testing
- **Detox** - E2E testing
- **Flipper** - Mobile debugging

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)
- Expo CLI (optional but recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/faceforge-ai.git
   cd faceforge-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS dependencies**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your API keys and configuration:
   ```env
   CHATGPT_API_KEY=your_openai_api_key
   CARTESIA_API_KEY=your_cartesia_api_key
   HEDRA_API_KEY=your_hedra_api_key
   FIREBASE_CONFIG=your_firebase_config
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   ```

5. **Run the application**
   ```bash
   # iOS
   npm run ios
   # or
   yarn ios

   # Android
   npm run android
   # or
   yarn android
   ```

## Project Structure

```
faceforge-ai/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # App screens
│   ├── navigation/         # Navigation configuration
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   ├── assets/             # Images, fonts, etc.
│   └── constants/          # App constants
├── docs/                   # Documentation
├── __tests__/              # Test files
├── android/                # Android-specific code
├── ios/                    # iOS-specific code
└── design/                 # Design assets and mockups
```

## User Flow

1. **Onboarding & Sign-In** - Welcome screens and authentication
2. **Home Dashboard** - Main hub with "New Video" CTA and library access
3. **Selfie Capture** - Camera interface with guidance for optimal photos
4. **Avatar Customization** - AI-powered appearance modifications
5. **Voice Capture** - Record voice sample for cloning
6. **Text Prompt & Generation** - Enter script and generate talking video
7. **Video Playback & Library** - View, share, and manage created videos

## API Integration

### ChatGPT Vision API
Used for avatar customization and image editing:
```typescript
const customizeAvatar = async (image: string, prompt: string) => {
  // Implementation for avatar customization
};
```

### Cartesia Voice Cloning
Clone user voice from 3-second audio sample:
```typescript
const cloneVoice = async (audioFile: File) => {
  // Implementation for voice cloning
};
```

### Hedra Video Generation
Generate talking avatar videos:
```typescript
const generateVideo = async (avatar: string, voice: string, text: string) => {
  // Implementation for video generation
};
```

## Design System

### Color Palette
- **Primary**: Royal Blue (#1E3A8A) - Buttons, highlights, active states
- **Secondary**: Purple/Magenta (#A855F7) - Voice waveforms, AI magic elements
- **Background**: Dark Charcoal (#121212) - Main backgrounds
- **Surface**: White (#FFFFFF) / Light Gray (#F5F5F5) - Cards and modals

### Typography
- **iOS**: SF Pro (System font)
- **Android**: Roboto
- **Headings**: 24-28pt, Medium weight
- **Body**: 16pt, Regular weight

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint

# Type checking
npm run type-check
```

## Deployment

### iOS
1. Archive the project in Xcode
2. Upload to App Store Connect
3. Submit for review

### Android
1. Generate signed APK/AAB
2. Upload to Google Play Console
3. Submit for review

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Cartesia](https://cartesia.ai/) - Voice cloning technology
- [Hedra AI](https://www.hedra-ai.com/) - Talking avatar generation
- [OpenAI](https://openai.com/) - ChatGPT Vision API for image editing

## Support

For support, email support@faceforge-ai.com or join our [Discord community](https://discord.gg/faceforge-ai).

---

**Built with ❤️ by the FaceForge AI team**