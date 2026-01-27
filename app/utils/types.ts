import { RnExecutorchError } from "react-native-executorch";
import { TextToSpeechInput, TextToSpeechStreamingInput } from "react-native-executorch/lib/typescript/types/tts";

export interface ExecuTorchTtsModel {
  error: RnExecutorchError | null;
  isReady: boolean;
  isGenerating: boolean;
  forward: (input: TextToSpeechInput) => Promise<any>;
  stream: (input: TextToSpeechStreamingInput) => Promise<void>;
  streamStop: any;
  downloadProgress: number;
}