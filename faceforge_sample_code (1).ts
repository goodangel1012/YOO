// src/types/avatar.ts
export interface Avatar {
  id: string;
  userId: string;
  imageUrl: string;
  customizations: AvatarCustomization[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AvatarCustomization {
  type: 'hair_color' | 'eye_color' | 'skin_tone' | 'accessories';
  value: string;
  prompt?: string;
}

export interface VoiceClone {
  id: string;
  userId: string;
  audioUrl: string;
  duration: number;
  modelId: string;
  createdAt: Date;
}

export interface VideoGeneration {
  id: string;
  avatarId: string;
  voiceId: string;
  text: string;
  videoUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  duration?: number;
  createdAt: Date;
}

---

// src/services/ai/cartesia.ts
import axios from 'axios';
import { VoiceClone } from '@/types/avatar';

class CartesiaService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.CARTESIA_API_KEY!;
    this.baseUrl = process.env.CARTESIA_API_URL!;
  }

  async cloneVoice(audioFile: File): Promise<VoiceClone> {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('model', 'sonic-english');

    try {
      const response = await axios.post(
        `${this.baseUrl}/voice-cloning/create`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return {
        id: response.data.id,
        userId: response.data.userId,
        audioUrl: response.data.audioUrl,
        duration: response.data.duration,
        modelId: response.data.modelId,
        createdAt: new Date(response.data.createdAt),
      };
    } catch (error) {
      console.error('Voice cloning failed:', error);
      throw new Error('Failed to clone voice');
    }
  }

  async generateSpeech(voiceId: string, text: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/text-to-speech`,
        {
          voice_id: voiceId,
          text,
          model: 'sonic-english',
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
        }
      );

      // Convert blob to base64 or upload to storage
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error('Speech generation failed:', error);
      throw new Error('Failed to generate speech');
    }
  }
}

export default new CartesiaService();

---

// src/services/ai/hedra.ts
import axios from 'axios';
import { VideoGeneration } from '@/types/avatar';

class HedraService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.HEDRA_API_KEY!;
    this.baseUrl = process.env.HEDRA_API_URL!;
  }

  async generateVideo(
    avatarImageUrl: string,
    audioUrl: string,
    text: string
  ): Promise<VideoGeneration> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/characters/generate`,
        {
          image_url: avatarImageUrl,
          audio_url: audioUrl,
          text,
          duration: Math.min(60, Math.ceil(text.length / 5)), // Estimate duration
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        id: response.data.id,
        avatarId: response.data.avatarId,
        voiceId: response.data.voiceId,
        text,
        status: 'processing',
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Video generation failed:', error);
      throw new Error('Failed to generate video');
    }
  }

  async checkVideoStatus(videoId: string): Promise<VideoGeneration> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/characters/${videoId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return {
        id: response.data.id,
        avatarId: response.data.avatarId,
        voiceId: response.data.voiceId,
        text: response.data.text,
        videoUrl: response.data.videoUrl,
        status: response.data.status,
        duration: response.data.duration,
        createdAt: new Date(response.data.createdAt),
      };
    } catch (error) {
      console.error('Failed to check video status:', error);
      throw new Error('Failed to check video status');
    }
  }
}

export default new HedraService();

---

// src/hooks/useCamera.ts
import { useState, useRef } from 'react';
import { Camera } from 'react-native-vision-camera';
import { Alert } from 'react-native';

export const useCamera = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<Camera>(null);

  const requestPermission = async () => {
    try {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === 'authorized');
      return permission === 'authorized';
    } catch (error) {
      console.error('Camera permission error:', error);
      setHasPermission(false);
      return false;
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || !hasPermission) {
      Alert.alert('Error', 'Camera not available');
      return null;
    }

    try {
      const photo = await cameraRef.current.takePhoto({
        quality: 0.8,
        enableAutoStabilization: true,
        enablePortraitEffectsMatteDelivery: false,
      });
      
      return photo;
    } catch (error) {
      console.error('Take picture error:', error);
      Alert.alert('Error', 'Failed to take picture');
      return null;
    }
  };

  const startRecording = async () => {
    if (!cameraRef.current || !hasPermission) {
      Alert.alert('Error', 'Camera not available');
      return;
    }

    try {
      setIsRecording(true);
      await cameraRef.current.startRecording({
        onRecordingFinished: (video) => {
          setIsRecording(false);
          // Handle video recording finished
        },
        onRecordingError: (error) => {
          setIsRecording(false);
          console.error('Recording error:', error);
          Alert.alert('Error', 'Failed to record video');
        },
      });
    } catch (error) {
      setIsRecording(false);
      console.error('Start recording error:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!cameraRef.current || !isRecording) return;

    try {
      await cameraRef.current.stopRecording();
      setIsRecording(false);
    } catch (error) {
      console.error('Stop recording error:', error);
      setIsRecording(false);
    }
  };

  return {
    cameraRef,
    hasPermission,
    isRecording,
    requestPermission,
    takePicture,
    startRecording,
    stopRecording,
  };
};

---

// src/hooks/useAudio.ts
import { useState, useRef } from 'react';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';

export const useAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const requestPermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Audio permission error:', error);
      return false;
    }
  };

  const startRecording = async () => {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        Alert.alert('Permission required', 'Microphone access is needed to record audio');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      
      recordingRef.current = recording;
      setIsRecording(true);
      setRecordingDuration(0);

      await recording.startAsync();

      // Update duration every second
      const interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // Store interval for cleanup
      (recording as any).durationInterval = interval;

    } catch (error) {
      console.error('Start recording error:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return null;

    try {
      setIsRecording(false);
      
      // Clear duration interval
      if ((recordingRef.current as any).durationInterval) {
        clearInterval((recordingRef.current as any).durationInterval);
      }

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      return uri;
    } catch (error) {
      console.error('Stop recording error:', error);
      Alert.alert('Error', 'Failed to stop recording');
      return null;
    }
  };

  const playRecording = async (uri: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      soundRef.current = sound;
      setIsPlaying(true);

      await sound.playAsync();
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Play recording error:', error);
      Alert.alert('Error', 'Failed to play recording');
    }
  };

  const stopPlaying = async () => {
    if (!soundRef.current) return;

    try {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      setIsPlaying(false);
    } catch (error) {
      console.error('Stop playing error:', error);
    }
  };

  return {
    isRecording,
    isPlaying,
    recordingDuration,
    requestPermission,
    startRecording,
    stopRecording,
    playRecording,
    stopPlaying,
  };
};

---

// src/components/common/Button/index.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography } from '@/styles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.white : colors.primary}
          size="small"
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 32,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 52,
  },
  // Disabled state
  disabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  // Text styles
  text: {
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center',
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.primary,
  },
  smallText: {
    fontSize: typography.fontSize.small,
  },
  mediumText: {
    fontSize: typography.fontSize.medium,
  },
  largeText: {
    fontSize: typography.fontSize.large,
  },
  disabledText: {
    opacity: 0.8,
  },
});

---

// src/screens/creation/SelfieCapture/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/components/common/Button';
import { useCamera } from '@/hooks/useCamera';
import { colors, typography, spacing } from '@/styles';

export const SelfieCaptureScreen: React.FC = () => {
  const navigation = useNavigation();
  const devices = useCameraDevices();
  const frontCamera = devices.front;
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(true);

  const {
    cameraRef,
    hasPermission,
    requestPermission,
    takePicture,
  } = useCamera();

  useEffect(() => {
    requestPermission();
  }, []);

  const handleTakePicture = async () => {
    const photo = await takePicture();
    if (photo) {
      setCapturedPhoto(photo.path);
      setShowGuide(false);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setShowGuide(true);
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      // Navigate to avatar customization with the photo
      navigation.navigate('AvatarCustomization', { photoUri: capturedPhoto });
    }
  };

  const renderCameraGuide = () => (
    <View style={styles.guideContainer}>
      <View style={styles.faceGuide} />
      <Text style={styles.guideText}>
        Position your face within the circle
      </Text>
      <Text style={styles.tipsText}>
        Even lighting and neutral expression work best
      </Text>
    </View>
  );

  const renderCapturedPhoto = () => (
    <View style={styles.previewContainer}>
      <Image source={{ uri: `file://${capturedPhoto}` }} style={styles.preview} />
      <View style={styles.previewActions}>
        <Button
          title="Retake"
          onPress={handleRetake}
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title="Use Photo"
          onPress={handleConfirm}
          style={styles.actionButton}
        />
      </View>
    </View>
  );

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Camera permission is required to take a selfie
        </Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  if (!frontCamera) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Front camera not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Take Your Selfie</Text>
        <Text style={styles.subtitle}>
          This will be used to create your avatar
        </Text>
      </View>

      {capturedPhoto ? (
        renderCapturedPhoto()
      ) : (
        <>
          <View style={styles.cameraContainer}>
            <Camera
              ref={cameraRef}
              style={styles.camera}
              device={frontCamera}
              isActive={true}
              photo={true}
            />
            {showGuide && renderCameraGuide()}
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleTakePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.large,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.xlarge,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
    marginBottom: spacing.small,
  },
  subtitle: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    margin: spacing.large,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  guideContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  guideText: {
    color: colors.white,
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
    marginTop: spacing.large,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    borderRadius: 8,
  },
  tipsText: {
    color: colors.white,
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.regular,
    marginTop: spacing.small,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    borderRadius: 8,
  },
  controls: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
  },
  previewContainer: {
    flex: 1,
    margin: spacing.large,
  },
  preview: {
    flex: 1,
    borderRadius: 20,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.large,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.small,
  },
  loadingText: {
    fontSize: typography.fontSize.medium,
    color: colors.text,
    textAlign: 'center',
  },
  errorText: {
    fontSize: typography.fontSize.medium,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.large,
  },
});

---

// src/styles/index.ts
export const colors = {
  // Primary colors
  primary: '#1E3A8A',      // Royal Blue
  secondary: '#A855F7',     // Purple/Magenta
  
  // Background colors
  background: '#121212',    // Dark Charcoal
  surface: '#1F1F1F',      // Slightly lighter than background
  card: '#2A2A2A',         // Card backgrounds
  
  // Text colors
  text: '#FFFFFF',         // Primary text
  textSecondary: '#B3B3B3', // Secondary text
  textTertiary: '#808080',  // Tertiary text
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#808080',
  lightGray: '#F5F5F5',
  darkGray: '#333333',
  
  // Status colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Transparent colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  cardOverlay: 'rgba(255, 255, 255, 0.1)',
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xsmall: 12,
    small: 14,
    medium: 16,
    large: 18,
    xlarge: 24,
    xxlarge: 28,
    xxxlarge: 32,
  },
  lineHeight: {
    small: 16,
    medium: 20,
    large: 24,
    xlarge: 32,
  },
};

export const spacing = {
  xsmall: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
  xxlarge: 48,
};

export const borderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 16,
  round: 50,
};

export const shadows = {
  small: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
};
        