import { AACButton, AACPage, AACTree } from "@willwade/aac-processors/browser"
import { RnExecutorchError } from "react-native-executorch"
import {
  TextToSpeechInput,
  TextToSpeechStreamingInput,
} from "react-native-executorch/lib/typescript/types/tts"

export interface ExecuTorchTtsModel {
  error: RnExecutorchError | null
  isReady: boolean
  isGenerating: boolean
  forward: (input: TextToSpeechInput) => Promise<unknown>
  stream: (input: TextToSpeechStreamingInput) => Promise<void>
  streamStop: unknown
  downloadProgress: number
}

// type DataOnly<T> = {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
//   [K in keyof T as T[K] extends Function | undefined ? never : K]: T[K]
// }
type DataOnly<T> = Pick<
  T,
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K
  }[keyof T]
>

export type BoardButton = DataOnly<AACButton>
export type BoardPage = Omit<DataOnly<AACPage>, "images"> & {
  images?: TileImage[]
}
export type BoardTree = Omit<DataOnly<AACTree>, "pages"> & {
  pages: { [key: string]: BoardPage }
}
export type TileImage = {
  content_type?: string
  data?: string
  data_url?: string
  height?: number
  id: string
  license?: {
    author_name?: string
    author_url?: string
    copyright_notice_url?: string
    type?: string
    uneditable?: boolean
  }
  path?: string
  url: string
  width?: number
}
