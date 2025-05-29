// App.js - Main App Entry Point (Refactored)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#121212" />
            <AppNavigator />
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// src/context/AppContext.js - Centralized State Management
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appReducer, initialState } from './appReducer';
import * as StorageService from '../services/StorageService';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const [userData, videoData] = await Promise.all([
        StorageService.getUser(),
        StorageService.getVideos()
      ]);

      if (userData) {
        dispatch({ type: 'SET_USER', payload: userData });
      }
      if (videoData) {
        dispatch({ type: 'SET_VIDEOS', payload: videoData });
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load app data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const actions = {
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    logout: () => dispatch({ type: 'LOGOUT' }),
    addVideo: (video) => dispatch({ type: 'ADD_VIDEO', payload: video }),
    deleteVideo: (videoId) => dispatch({ type: 'DELETE_VIDEO', payload: videoId }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
  };

  return (
    <AppContext.Provider value={{ state, ...actions }}>
      {children}
    </AppContext.Provider>
  );
};

// src/context/appReducer.js - State Management Logic
export const initialState = {
  user: null,
  videos: [],
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload 
      };
    
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false,
        videos: [] 
      };
    
    case 'SET_VIDEOS':
      return { ...state, videos: action.payload };
    
    case 'ADD_VIDEO':
      return { 
        ...state, 
        videos: [...state.videos, action.payload] 
      };
    
    case 'DELETE_VIDEO':
      return { 
        ...state, 
        videos: state.videos.filter(video => video.id !== action.payload) 
      };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
};

// src/navigation/AppNavigator.js - Navigation Configuration
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';
import { navigationConfig } from '../config/navigation';

// Screen imports
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthScreen from '../screens/AuthScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CreateVideoStack from './CreateVideoStack';
import PlaybackScreen from '../screens/PlaybackScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { state } = useApp();

  return (
    <Stack.Navigator
      initialRouteName={state.isAuthenticated ? "Dashboard" : "Onboarding"}
      screenOptions={navigationConfig.defaultScreenOptions}
    >
      {!state.isAuthenticated ? (
        // Auth Stack
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
        </>
      ) : (
        // Main App Stack
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen 
            name="CreateVideo" 
            component={CreateVideoStack}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen name="Playback" component={PlaybackScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;

// src/navigation/CreateVideoStack.js - Video Creation Flow
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationConfig } from '../config/navigation';

import SelfieScreen from '../screens/SelfieScreen';
import CustomizationScreen from '../screens/CustomizationScreen';
import VoiceScreen from '../screens/VoiceScreen';
import TextPromptScreen from '../screens/TextPromptScreen';
import LoadingScreen from '../screens/LoadingScreen';

const Stack = createStackNavigator();

const CreateVideoStack = () => {
  return (
    <Stack.Navigator screenOptions={navigationConfig.defaultScreenOptions}>
      <Stack.Screen name="Selfie" component={SelfieScreen} />
      <Stack.Screen name="Customization" component={CustomizationScreen} />
      <Stack.Screen name="Voice" component={VoiceScreen} />
      <Stack.Screen name="TextPrompt" component={TextPromptScreen} />
      <Stack.Screen name="Loading" component={LoadingScreen} />
    </Stack.Navigator>
  );
};

export default CreateVideoStack;

// src/config/navigation.js - Navigation Configuration
export const navigationConfig = {
  defaultScreenOptions: {
    headerShown: false,
    gestureEnabled: true,
    cardStyleInterpolator: ({ current, layouts }) => ({
      cardStyle: {
        transform: [{
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        }],
      },
    }),
  },
};

// src/services/StorageService.js - Data Persistence
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER: 'faceforge_user',
  VIDEOS: 'faceforge_videos',
};

export const getUser = async () => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    return true;
  } catch (error) {
    console.error('Error removing user:', error);
    return false;
  }
};

export const getVideos = async () => {
  try {
    const videoData = await AsyncStorage.getItem(STORAGE_KEYS.VIDEOS);
    return videoData ? JSON.parse(videoData) : [];
  } catch (error) {
    console.error('Error getting videos:', error);
    return [];
  }
};

export const saveVideos = async (videos) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
    return true;
  } catch (error) {
    console.error('Error saving videos:', error);
    return false;
  }
};

// src/services/MediaService.js - Media Handling
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

const DEFAULT_IMAGE_OPTIONS = {
  mediaType: 'photo',
  quality: 0.8,
  maxWidth: 1000,
  maxHeight: 1000,
};

const DEFAULT_AUDIO_OPTIONS = {
  mediaType: 'audio',
  quality: 0.8,
};

export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'FaceForge needs access to your camera to take selfies',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

export const takeSelfie = async (options = {}) => {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    Alert.alert('Permission Denied', 'Camera permission is required to take selfies');
    return null;
  }

  return new Promise((resolve) => {
    launchCamera(
      { ...DEFAULT_IMAGE_OPTIONS, cameraType: 'front', ...options },
      (response) => {
        if (response.assets && response.assets[0]) {
          resolve(response.assets[0]);
        } else {
          resolve(null);
        }
      }
    );
  });
};

export const selectImageFromGallery = async (options = {}) => {
  return new Promise((resolve) => {
    launchImageLibrary(
      { ...DEFAULT_IMAGE_OPTIONS, ...options },
      (response) => {
        if (response.assets && response.assets[0]) {
          resolve(response.assets[0]);
        } else {
          resolve(null);
        }
      }
    );
  });
};

export const selectAudioFile = async (options = {}) => {
  return new Promise((resolve) => {
    launchImageLibrary(
      { ...DEFAULT_AUDIO_OPTIONS, ...options },
      (response) => {
        if (response.assets && response.assets[0]) {
          resolve(response.assets[0]);
        } else {
          resolve(null);
        }
      }
    );
  });
};

// src/hooks/useAudioRecording.js - Custom Hook for Audio Recording
import { useState, useRef, useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

export const useAudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  
  const intervalRef = useRef(null);

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'FaceForge needs access to your microphone to record voice samples',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const startRecording = useCallback(async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      return false;
    }

    setIsRecording(true);
    setRecordingTime(0);
    
    intervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    // Here you would integrate with actual recording library
    // For now, we simulate recording
    return true;
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (recordingTime >= 3) {
      setHasRecording(true);
      // Simulate audio URI
      setAudioUri(`recording_${Date.now()}.m4a`);
    }
  }, [recordingTime]);

  const clearRecording = useCallback(() => {
    setHasRecording(false);
    setAudioUri(null);
    setRecordingTime(0);
  }, []);

  return {
    isRecording,
    recordingTime,
    hasRecording,
    audioUri,
    startRecording,
    stopRecording,
    clearRecording,
  };
};

// src/components/common/LoadingSpinner.js - Reusable Loading Component
import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

const LoadingSpinner = ({ size = 60, color = colors.primary }) => {
  const spinValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: size,
            height: size,
            borderTopColor: color,
            transform: [{ rotate: spin }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
  },
});

export default LoadingSpinner;

// src/components/common/ErrorBoundary.js - Error Handling
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../constants/theme';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            We're sorry for the inconvenience. Please try again.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 25,
  },
  buttonText: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
});

export default ErrorBoundary;

// src/components/common/ProgressBar.js - Progress Indicator
import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

const ProgressBar = ({ progress = 0, height = 4, color = colors.primary }) => {
  const animatedValue = new Animated.Value(progress);

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { height }]}>
      <Animated.View
        style={[
          styles.progress,
          {
            width,
            backgroundColor: color,
            height,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 2,
  },
});

export default ProgressBar;

// src/utils/validation.js - Input Validation Utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: emailRegex.test(email),
    error: !emailRegex.test(email) ? 'Please enter a valid email address' : null,
  };
};

export const validatePassword = (password) => {
  const minLength = 6;
  return {
    isValid: password.length >= minLength,
    error: password.length < minLength ? `Password must be at least ${minLength} characters` : null,
  };
};

export const validateRequired = (value, fieldName) => {
  const isValid = value && value.trim().length > 0;
  return {
    isValid,
    error: !isValid ? `${fieldName} is required` : null,
  };
};

export const validateTextLength = (text, maxLength) => {
  return {
    isValid: text.length <= maxLength,
    error: text.length > maxLength ? `Text must be ${maxLength} characters or less` : null,
    remainingChars: maxLength - text.length,
  };
};

// src/utils/time.js - Time Utilities
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatDate = (date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const today = new Date();
  const diffTime = today - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString();
};

// src/constants/theme.js - Enhanced Theme System
export const colors = {
  primary: '#4A90E2',
  secondary: '#8B5CF6',
  background: {
    primary: '#121212',
    secondary: '#2A2A2A',
    tertiary: '#1A1A1A',
    light: '#FFFFFF',
    gray: '#F5F5F5',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#CCCCCC',
    muted: '#888888',
    inverse: '#000000',
  },
  border: '#444444',
  error: '#FF4444',
  success: '#4CAF50',
  warning: '#FFA726',
  info: '#29B6F6',
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
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
  h4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 24,
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
  xxxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 50,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// src/constants/config.js - App Configuration
export const APP_CONFIG = {
  name: 'FaceForge AI',
  version: '1.0.0',
  maxVideoLength: 60, // seconds
  maxScriptLength: 300, // characters
  minRecordingTime: 3, // seconds
  supportedImageFormats: ['jpg', 'jpeg', 'png'],
  supportedAudioFormats: ['mp3', 'wav', 'm4a'],
};

export const API_ENDPOINTS = {
  // These would be actual API endpoints in production
  imageProcessing: '/api/process-image',
  voiceCloning: '/api/clone-voice',
  videoGeneration: '/api/generate-video',
};

export const SAMPLE_TEXTS = [
  "Hello world! This is my avatar speaking. Pretty cool, right?",
  "Welcome to FaceForge AI! I'm excited to show you what I can do.",
  "Thanks for trying out our AI avatar technology. Hope you love it!",
  "Creating digital avatars has never been this easy and fun!",
  "Your voice, your look, your message - all powered by AI magic.",
];

// package.json - Updated Dependencies
{
  "name": "FaceForgeAI",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "type-check": "tsc --noEmit"
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
    "react-native-vector-icons": "^10.0.2",
    "react-native-reanimated": "^3.5.4",
    "react-native-svg": "^13.14.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@babel/preset-env": "^7.20.0",
    "@babel/runtime": "^7.20.0",
    "@react-native/eslint-config": "^0.72.0",
    "@react-native/metro-config": "^0.72.0",
    "@types/react": "^18.0.24",
    "@types/react-native": "^0.72.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "babel-jest": "^29.2.1",
    "eslint": "^8.19.0",
    "jest": "^29.2.1",
    "metro-react-native-babel-preset": "0.76.8",
    "prettier": "^3.0.0",
    "react-test-renderer": "18.2.0",
    "typescript": "5.1.6"
  },
  "engines": {
    "node": ">=18",
    "npm": ">=8"
  }
}