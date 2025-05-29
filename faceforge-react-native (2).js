export default VoiceScreen;

// src/screens/TextPromptScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import Button from '../components/Button';
import { colors, typography, spacing, borderRadius } from '../constants/theme';

const TextPromptScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selfie, customization, voice } = route.params || {};
  
  const [scriptText, setScriptText] = useState('');
  const maxCharacters = 300;

  const sampleTexts = [
    "Hello world! This is my avatar speaking. Pretty cool, right?",
    "Welcome to FaceForge AI! I'm excited to show you what I can do.",
    "Thanks for trying out our AI avatar technology. Hope you love it!",
  ];

  const insertSampleText = () => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setScriptText(randomText);
  };

  const handleGenerateVideo = () => {
    if (!scriptText.trim()) return;
    
    navigation.navigate('Loading', {
      selfie,
      customization,
      voice,
      script: scriptText,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="What Should Your Avatar Say?" />
      
      <View style={styles.content}>
        <View style={styles.avatarPreview}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>

        <View style={styles.textPromptContainer}>
          <Text style={styles.label}>Enter your script</Text>
          <TextInput
            style={styles.textPrompt}
            placeholder="Type your message here..."
            placeholderTextColor={colors.text.muted}
            value={scriptText}
            onChangeText={setScriptText}
            multiline
            maxLength={maxCharacters}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>
            {scriptText.length}/{maxCharacters}
          </Text>
        </View>

        <View style={styles.toneSection}>
          <Text style={styles.sectionTitle}>Tone (Optional)</Text>
          <View style={styles.toneOptions}>
            <Button title="Cheerful" variant="secondary" />
            <Button title="Professional" variant="secondary" />
            <Button title="Excited" variant="secondary" />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Use Sample Text"
            variant="secondary"
            onPress={insertSampleText}
          />
          
          <Button
            title="Generate Video"
            onPress={handleGenerateVideo}
            disabled={!scriptText.trim()}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  avatarPreview: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarIcon: {
    fontSize: 80,
  },
  textPromptContainer: {
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  textPrompt: {
    ...typography.body,
    color: colors.text.primary,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    ...typography.small,
    color: colors.text.muted,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  toneSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  toneOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: spacing.xl,
  },
});

export default TextPromptScreen;

// src/screens/LoadingScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography, spacing } from '../constants/theme';

const LoadingScreen = ({ saveVideo }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selfie, customization, voice, script } = route.params || {};
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const spinValue = new Animated.Value(0);

  const loadingMessages = [
    "Analyzing your selfie...",
    "Creating your digital twin...",
    "Processing voice clone...",
    "Generating lip-sync animation...",
    "Applying AI magic...",
    "Almost ready!"
  ];

  useEffect(() => {
    // Start spinner animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => 
        (prev + 1) % loadingMessages.length
      );
    }, 1000);

    // Simulate video generation
    const generationTimer = setTimeout(async () => {
      const newVideo = {
        id: Date.now(),
        title: `Video ${Date.now()}`,
        date: new Date().toLocaleDateString(),
        script: script?.substring(0, 30) + '...' || 'New Video',
        duration: '0:15',
      };

      await saveVideo(newVideo);
      navigation.navigate('Playback', { video: newVideo });
    }, 4000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(generationTimer);
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.loadingContainer}>
        <Animated.View 
          style={[
            styles.spinner,
            { transform: [{ rotate: spin }] }
          ]}
        />
        
        <Text style={styles.loadingText}>
          {loadingMessages[currentMessageIndex]}
        </Text>
        
        <Text style={styles.loadingSubtext}>
          This may take a few moments
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill,
                { width: `${((currentMessageIndex + 1) / loadingMessages.length) * 100}%` }
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  spinner: {
    width: 60,
    height: 60,
    borderWidth: 4,
    borderColor: colors.background.secondary,
    borderTopColor: colors.primary,
    borderRadius: 30,
    marginBottom: spacing.lg,
  },
  loadingText: {
    ...typography.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  loadingSubtext: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  progressContainer: {
    width: '100%',
    marginTop: spacing.lg,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.background.secondary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});

export default LoadingScreen;

// src/screens/PlaybackScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import Button from '../components/Button';
import { colors, typography, spacing, borderRadius } from '../constants/theme';

const PlaybackScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { video } = route.params || {};
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(15); // seconds

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // Here you would integrate with actual video player
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out my FaceForge AI avatar video!',
        title: 'My Avatar Video',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share video');
    }
  };

  const handleSave = () => {
    Alert.alert('Success', 'Video saved to your device!');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Video',
      'Are you sure you want to delete this video?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Your Avatar Video" 
        backAction={() => navigation.navigate('Dashboard')}
      />
      
      <View style={styles.content}>
        <View style={styles.videoPlayer}>
          <TouchableOpacity 
            style={styles.playButton}
            onPress={togglePlayback}
          >
            <Text style={styles.playIcon}>
              {isPlaying ? '⏸️' : '▶️'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.videoControls}>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlIcon}>⏮</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={togglePlayback}
          >
            <Text style={styles.controlIcon}>
              {isPlaying ? '⏸' : '▶️'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlIcon}>⏭</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${(currentTime / duration) * 100}%` }
              ]}
            />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{video?.title || 'Avatar Video'}</Text>
          <Text style={styles.videoDate}>Created {video?.date || 'today'}</Text>
          
          {video?.script && (
            <View style={styles.scriptContainer}>
              <Text style={styles.scriptLabel}>Script:</Text>
              <Text style={styles.scriptText}>{video.script}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="Share Video"
            onPress={handleShare}
          />
          
          <Button
            title="Save to Device"
            variant="secondary"
            onPress={handleSave}
          />
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.deleteText}>Delete Video</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.createMoreContainer}>
          <Text style={styles.createMoreText}>
            Want to create another video with this avatar?
          </Text>
          <Button
            title="Create New Video"
            variant="secondary"
            onPress={() => navigation.navigate('TextPrompt')}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  videoPlayer: {
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 32,
  },
  videoControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.sm,
  },
  controlIcon: {
    fontSize: 20,
    color: colors.text.primary,
  },
  progressContainer: {
    marginBottom: spacing.lg,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.background.secondary,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    ...typography.small,
    color: colors.text.muted,
  },
  videoInfo: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  videoTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  videoDate: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  scriptContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    width: '100%',
  },
  scriptLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  scriptText: {
    ...typography.body,
    color: colors.text.primary,
    fontStyle: 'italic',
  },
  actionButtons: {
    marginBottom: spacing.xl,
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  deleteText: {
    ...typography.body,
    color: colors.error,
  },
  createMoreContainer: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  createMoreText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});

export default PlaybackScreen;

// package.json - Dependencies
{
  "name": "FaceForgeAI",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "react-native-screens": "^3.25.0",
    "react-native-safe-area-context": "^4.7.4",
    "react-native-gesture-handler": "^2.13.4",
    "@react-native-async-storage/async-storage": "^1.19.5",
    "react-native-image-picker": "^7.0.3",
    "react-native-share": "^10.0.2",
    "react-native-vector-icons": "^10.0.2"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@babel/preset-env": "^7.20.0",
    "@babel/runtime": "^7.20.0",
    "@react-native/eslint-config": "^0.72.0",
    "@react-native/metro-config": "^0.72.0",
    "@tsconfig/react-native": "^3.0.0",
    "@types/react": "^18.0.24",
    "@types/react-test-renderer": "^18.0.0",
    "babel-jest": "^29.2.1",
    "eslint": "^8.19.0",
    "jest": "^29.2.1",
    "metro-react-native-babel-preset": "0.76.8",
    "prettier": "^2.4.1",
    "react-test-renderer": "18.2.0",
    "typescript": "4.8.4"
  },
  "engines": {
    "node": ">=16"
  }
}

// metro.config.js - Metro bundler configuration
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

// babel.config.js - Babel configuration
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
  ],
};

// android/app/src/main/AndroidManifest.xml - Android permissions
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />

// ios/FaceForgeAI/Info.plist - iOS permissions
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera to take selfies for avatar creation</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs access to photo library to upload selfies</string>
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to microphone to record voice samples</string>

// README.md - Project documentation
# FaceForge AI - React Native Mobile App

A mobile application that transforms selfies into talking AI avatars using advanced AI services.

## Features

- **Selfie to Avatar**: Convert photos into digital avatars
- **Voice Cloning**: Clone voice from 3-second samples
- **Avatar Customization**: Modify appearance with AI assistance
- **Video Generation**: Create talking avatar videos
- **Video Library**: Save and manage created videos
- **Cross-Platform**: Works on iOS and Android

## Tech Stack

- **React Native** - Mobile framework
- **React Navigation** - Navigation system
- **AsyncStorage** - Local data persistence
- **React Native Image Picker** - Camera/gallery access
- **React Native Share** - Social sharing capabilities

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Install iOS pods: `cd ios && pod install`
4. Run the app: `npm run ios` or `npm run android`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # Navigation header
│   └── Button.js       # Custom button component
├── screens/            # Screen components
│   ├── OnboardingScreen.js
│   ├── SignInScreen.js
│   ├── DashboardScreen.js
│   ├── SelfieScreen.js
│   ├── CustomizationScreen.js
│   ├── VoiceScreen.js
│   ├── TextPromptScreen.js
│   ├── LoadingScreen.js
│   └── PlaybackScreen.js
├── constants/          # App constants
│   └── theme.js       # Design system
└── utils/             # Utility functions
```

## Design System

The app follows a consistent design system with:
- **Colors**: Primary blue (#4A90E2), secondary purple (#8B5CF6)
- **Typography**: System fonts with defined hierarchy
- **Spacing**: Consistent spacing scale
- **Components**: Reusable UI components

## Key Features Implementation

### Navigation Flow
1. Onboarding → Sign In → Dashboard
2. Dashboard → Selfie → Customization → Voice → Text Prompt → Loading → Playback
3. Dashboard ↔ Video Library

### State Management
- User authentication state
- Video library persistence
- Navigation params for data flow

### Permissions
- Camera access for selfies
- Microphone access for voice recording
- Storage access for saving videos

## API Integration Points

The app is structured to easily integrate with:
- **Image Processing**: ChatGPT vision API for avatar customization
- **Voice Cloning**: Cartesia API for voice synthesis
- **Video Generation**: Hedra API for talking avatar videos

## Performance Optimizations

- Lazy loading of screens
- Image optimization
- Efficient list rendering
- Memory management for media files

## Future Enhancements

- Real-time avatar preview
- Multiple avatar profiles
- Advanced customization options
- Cloud storage integration
- Social sharing features// App.js - Main App Entry Point
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import all screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import SignInScreen from './src/screens/SignInScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import SelfieScreen from './src/screens/SelfieScreen';
import CustomizationScreen from './src/screens/CustomizationScreen';
import VoiceScreen from './src/screens/VoiceScreen';
import TextPromptScreen from './src/screens/TextPromptScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import PlaybackScreen from './src/screens/PlaybackScreen';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('faceforge_user');
      const videoData = await AsyncStorage.getItem('faceforge_videos');
      
      if (userData) {
        setUser(JSON.parse(userData));
      }
      if (videoData) {
        setVideos(JSON.parse(videoData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveVideo = async (newVideo) => {
    const updatedVideos = [...videos, newVideo];
    setVideos(updatedVideos);
    await AsyncStorage.setItem('faceforge_videos', JSON.stringify(updatedVideos));
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? "Dashboard" : "Onboarding"}
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SignIn">
          {props => <SignInScreen {...props} setUser={setUser} />}
        </Stack.Screen>
        <Stack.Screen name="Dashboard">
          {props => <DashboardScreen {...props} videos={videos} user={user} />}
        </Stack.Screen>
        <Stack.Screen name="Selfie" component={SelfieScreen} />
        <Stack.Screen name="Customization" component={CustomizationScreen} />
        <Stack.Screen name="Voice" component={VoiceScreen} />
        <Stack.Screen name="TextPrompt" component={TextPromptScreen} />
        <Stack.Screen name="Loading">
          {props => <LoadingScreen {...props} saveVideo={saveVideo} />}
        </Stack.Screen>
        <Stack.Screen name="Playback" component={PlaybackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// src/components/Header.js - Reusable Header Component
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography } from '../constants/theme';

const Header = ({ title, showBack = true, backAction }) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (backAction) {
      backAction();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.header}>
      {showBack && (
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: colors.primary,
    fontSize: 16,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  placeholder: {
    width: 60,
  },
});

export default Header;

// src/constants/theme.js - Design System Constants
export const colors = {
  primary: '#4A90E2',
  secondary: '#8B5CF6',
  background: {
    primary: '#121212',
    secondary: '#2A2A2A',
    light: '#FFFFFF',
    gray: '#F5F5F5',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#CCCCCC',
    muted: '#888888',
  },
  border: '#444444',
  error: '#FF4444',
  success: '#4CAF50',
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 34,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 50,
};

// src/components/Button.js - Reusable Button Component
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '../constants/theme';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled = false, 
  style = {} 
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
    disabled && styles.disabledText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  primary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  disabled: {
    backgroundColor: '#666666',
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    ...typography.body,
    fontWeight: '600',
  },
  primaryText: {
    color: colors.text.primary,
  },
  secondaryText: {
    color: colors.primary,
  },
  disabledText: {
    color: colors.text.muted,
  },
});

export default Button;

// src/screens/OnboardingScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import { colors, typography, spacing } from '../constants/theme';

const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: '📱',
      title: 'Create Your Digital Avatar',
      description: 'Turn a simple selfie into a lifelike, talking digital version of yourself using advanced AI technology.',
    },
    {
      icon: '🎤',
      title: 'Clone Your Voice',
      description: 'Record just 3 seconds of your voice and our AI will create a perfect digital clone that sounds exactly like you.',
    },
    {
      icon: '🎬',
      title: 'Generate Talking Videos',
      description: 'Type any message and watch your avatar speak it with your voice. Create unlimited videos in minutes.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % slides.length;
      goToSlide(nextSlide);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
    scrollViewRef.current?.scrollTo({
      x: slideIndex * width,
      animated: true,
    });
  };

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.carousel}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <Text style={styles.icon}>{slide.icon}</Text>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              index === currentSlide && styles.activeDot,
            ]}
            onPress={() => goToSlide(index)}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={() => navigation.navigate('SignIn')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  carousel: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.muted,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
});

export default OnboardingScreen;

// src/screens/SignInScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import Button from '../components/Button';
import { colors, typography, spacing, borderRadius } from '../constants/theme';

const SignInScreen = ({ setUser }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (text && !validateEmail(text)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text && text.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      // Simulate authentication
      const userData = {
        email,
        name: email.split('@')[0],
        id: Date.now(),
      };

      await AsyncStorage.setItem('faceforge_user', JSON.stringify(userData));
      setUser(userData);
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="FaceForge AI" showBack />
      
      <View style={styles.content}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome to FaceForge AI</Text>
          <Text style={styles.welcomeSubtitle}>
            {isSignUp ? 'Create your account to get started' : 'Sign in to start creating your digital avatar'}
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, emailError && styles.inputError]}
              placeholder="Enter your email"
              placeholderTextColor={colors.text.muted}
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, passwordError && styles.inputError]}
              placeholder="Enter your password"
              placeholderTextColor={colors.text.muted}
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          <Button
            title={isSignUp ? 'Create Account' : 'Sign In'}
            onPress={handleSubmit}
            disabled={!email || !password || emailError || passwordError}
          />

          <Button
            title={isSignUp ? 'Already have an account? Sign in' : 'New here? Create an account'}
            variant="secondary"
            onPress={() => setIsSignUp(!isSignUp)}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  welcomeTitle: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  welcomeSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.body,
    color: colors.text.primary,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.small,
    color: colors.error,
    marginTop: spacing.xs,
  },
});

export default SignInScreen;

// src/screens/DashboardScreen.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../constants/theme';

const DashboardScreen = ({ videos, user }) => {
  const navigation = useNavigation();

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => navigation.navigate('Playback', { video: item })}
    >
      <View style={styles.videoThumbnail}>
        <Text style={styles.playIcon}>▶️</Text>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{item.title}</Text>
        <Text style={styles.videoDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🎬</Text>
      <Text style={styles.emptyTitle}>No videos yet</Text>
      <Text style={styles.emptyDescription}>
        Tap 'Create New Video' to make your first talking avatar!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>FaceForge AI</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Hello {user?.name || 'Alex'}!</Text>
          <Text style={styles.welcomeSubtitle}>
            Ready to create your next avatar video?
          </Text>
        </View>

        <TouchableOpacity
          style={styles.newVideoCard}
          onPress={() => navigation.navigate('Selfie')}
          activeOpacity={0.8}
        >
          <Text style={styles.newVideoIcon}>➕</Text>
          <Text style={styles.newVideoTitle}>Create New Video</Text>
          <Text style={styles.newVideoSubtitle}>Start making your talking avatar</Text>
        </TouchableOpacity>

        <View style={styles.librarySection}>
          <Text style={styles.sectionTitle}>Recent Videos</Text>
          
          {videos.length === 0 ? (
            <EmptyState />
          ) : (
            <FlatList
              data={videos}
              renderItem={renderVideoItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.videoGrid}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  logo: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  welcomeTitle: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  welcomeSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  newVideoCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  newVideoIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  newVideoTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  newVideoSubtitle: {
    ...typography.body,
    color: colors.text.primary,
    opacity: 0.9,
  },
  librarySection: {
    flex: 1,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  videoGrid: {
    flexGrow: 1,
  },
  videoCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    margin: spacing.sm,
    overflow: 'hidden',
  },
  videoThumbnail: {
    aspectRatio: 16 / 9,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 24,
    color: colors.text.muted,
  },
  videoInfo: {
    padding: spacing.md,
  },
  videoTitle: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  videoDate: {
    ...typography.small,
    color: colors.text.muted,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default DashboardScreen;

// src/screens/SelfieScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Header from '../components/Header';
import Button from '../components/Button';
import { colors, typography, spacing, borderRadius } from '../constants/theme';

const SelfieScreen = () => {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      cameraType: 'front',
    };

    launchCamera(options, (response) => {
      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

  const handleContinue = () => {
    if (!selectedImage) {
      Alert.alert('No Photo Selected', 'Please take a selfie or upload from gallery');
      return;
    }
    navigation.navigate('Customization', { selfie: selectedImage });
  };

  return (
    <View style={styles.container}>
      <Header title="Take Your Selfie" />
      
      <View style={styles.content}>
        <View style={styles.cameraContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
          ) : (
            <View style={styles.cameraGuide}>
              <Text style={styles.guideText}>
                Position your face here{'\n'}Even lighting works best
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.instructionText}>
          {selectedImage ? 'Looking good! Ready to continue?' : 'Center your face in the frame for best results'}
        </Text>

        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.controlButton} onPress={openCamera}>
            <Text style={styles.controlIcon}>🔄</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.shutterButton} 
            onPress={openCamera}
            activeOpacity={0.8}
          >
            <View style={styles.shutterInner} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlIcon}>⚡</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Upload from Gallery"
            variant="secondary"
            onPress={openGallery}
          />
          
          <Button
            title={selectedImage ? 'Continue with Photo' : 'Continue'}
            onPress={handleContinue}
            disabled={!selectedImage}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  cameraContainer: {
    aspectRatio: 3 / 4,
    backgroundColor: '#000',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  cameraGuide: {
    width: 200,
    height: 250,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideText: {
    ...typography.body,
    color: colors.primary,
    textAlign: 'center',
  },
  instruction