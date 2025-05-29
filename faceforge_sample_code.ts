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
        