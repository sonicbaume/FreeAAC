import { AACButton, AACPage, AACTree } from "@willwade/aac-processors/browser";
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

type DataOnly<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K]
};
export type BoardButton = DataOnly<AACButton>
export type BoardPage = DataOnly<AACPage>
export type BoardTree = Omit<DataOnly<AACTree>, 'pages'> & { pages: { [key: string]: BoardPage } }