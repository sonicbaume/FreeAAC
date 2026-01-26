import * as Speech from 'expo-speech';
import { SpeechOptions } from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AudioBuffer,
  AudioBufferSourceNode,
  AudioContext,
  AudioManager
} from 'react-native-audio-api';
import { useAudioActions } from "../stores/audio";
import { useSpeechOptions } from "../stores/prefs";
import { handleError } from '../utils/error';
import { useTts } from '../utils/tts';

/**
 * Converts an audio vector (Float32Array) to an AudioBuffer for playback
 * @param audioVector - The generated audio samples from the model
 * @param sampleRate - The sample rate (default: 24000 Hz for Kokoro)
 * @returns AudioBuffer ready for playback
 */
const createAudioBufferFromVector = (
  audioVector: Float32Array,
  audioContext: AudioContext | null = null,
  sampleRate: number = 24000
): AudioBuffer => {
  if (audioContext == null) audioContext = new AudioContext({ sampleRate });

  const audioBuffer = audioContext.createBuffer(
    1,
    audioVector.length,
    sampleRate
  );
  const channelData = audioBuffer.getChannelData(0);
  channelData.set(audioVector);

  return audioBuffer;
};

export default function AudioController () {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode>(null);
  const speechOptions = useSpeechOptions()
  const { setSpeak, setTtsStatus } = useAudioActions()

  const { isReady, isGenerating, downloadProgress, ...model } = useTts(speechOptions)
  useEffect(() => setTtsStatus({
    isReady, isGenerating, downloadProgress
  }), [isReady, isGenerating, downloadProgress])

  const speak = useCallback(async (inputText: string, options?: Partial<SpeechOptions>) => {
    let text = inputText.trim()
    if (!text) return

    if (speechOptions.engine === "device") {
      if (text === "I") text = "i"  // avoid "capital I" output
      Speech.speak(text, {...speechOptions, ...options})
      return
    }
    
    if (!model || isPlaying) return
    setIsPlaying(true)

    try {
      const audioContext = audioContextRef.current;
      if (!audioContext) return;

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const onNext = async (audioVec: Float32Array) => {
        return new Promise<void>((resolve) => {
          const audioBuffer = createAudioBufferFromVector(
            audioVec,
            audioContext,
            24000
          );

          const source = (sourceRef.current =
            audioContext.createBufferSource());
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);

          source.onEnded = () => resolve();

          source.start();
        });
      };

      const onEnd = async () => {
        setIsPlaying(false);
        await audioContext.suspend();
      };

      await model.stream({
        text: inputText,
        onNext,
        onEnd,
      });
    } catch (e) {
      handleError(e)
      setIsPlaying(false)
    }
  }, [speechOptions, model, audioContextRef, sourceRef])

  useEffect(() => setSpeak(speak), [speak])

  useEffect(() => {
    AudioManager.setAudioSessionOptions({
      iosCategory: 'playAndRecord',
      iosMode: 'spokenAudio',
      iosOptions: ['defaultToSpeaker'],
    });

    audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    audioContextRef.current.suspend();

    return () => {
      audioContextRef.current?.close();
      audioContextRef.current = null;
    };
  }, []);

  return null
}