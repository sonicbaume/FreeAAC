import { useEffect, useRef, useState } from "react";
import {
  AudioBuffer,
  AudioBufferSourceNode,
  AudioContext,
  AudioManager
} from 'react-native-audio-api';
import { useAudioActions } from "../stores/audio";

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
  const { setOnNext, setOnEnd } = useAudioActions()

  useEffect(() => {
    AudioManager.setAudioSessionOptions({
      iosCategory: 'playAndRecord',
      iosMode: 'spokenAudio',
      iosOptions: ['defaultToSpeaker'],
    });

    audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    audioContextRef.current.suspend();

    setOnNext(async (audioVec: Float32Array) => {
      const audioContext = audioContextRef.current;
      if (!audioContext) return;
      return new Promise<void>((resolve) => {
        const audioBuffer = createAudioBufferFromVector(
          audioVec,
          audioContext,
          24000
        );

        const source = (sourceRef.current = audioContext.createBufferSource());
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);

        source.onEnded = () => resolve();

        source.start();
      });
    })

    setOnEnd(async () => {
      const audioContext = audioContextRef.current;
      if (!audioContext) return;
      setIsPlaying(false);
      await audioContext.suspend();
    })

    return () => {
      audioContextRef.current?.close();
      audioContextRef.current = null;
    };
  }, []);

  return null
}