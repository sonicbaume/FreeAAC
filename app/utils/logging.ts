import { HistoryOccurrence } from "@willwade/aac-processors/analytics"
import {
  AACSemanticCategory,
  AACSemanticIntent,
} from "@willwade/aac-processors/browser"
import { OblAction } from "@willwade/aac-processors/metrics"
import { BoardButton } from "./types"

export type LogType =
  | "button"
  | "navigate"
  | "sentence"
  | "home"
  | "back"
  | "backspace"
  | "clear"
  | "copy"

export type LogEvent =
  | {
      type: "home" | "back" | "backspace" | "clear" | "copy"
    }
  | LogEventButton
  | LogEventSentence

export type LogEventButton = {
  type: "button" | "navigate"
  button: BoardButton
  spoken: boolean
  playOnPress?: boolean
  goHomeOnPress?: string
}

export type LogEventSentence = {
  type: "sentence"
  content: string
  vocalization?: string
}

const intentMap: Record<LogType, AACSemanticIntent> = {
  button: AACSemanticIntent.SPEAK_TEXT,
  navigate: AACSemanticIntent.NAVIGATE_TO,
  home: AACSemanticIntent.GO_HOME,
  back: AACSemanticIntent.GO_BACK,
  backspace: AACSemanticIntent.DELETE_WORD,
  clear: AACSemanticIntent.CLEAR_TEXT,
  copy: AACSemanticIntent.COPY_TEXT,
  sentence: AACSemanticIntent.SPEAK_TEXT,
}

const categoryMap: Record<LogType, AACSemanticCategory> = {
  button: AACSemanticCategory.COMMUNICATION,
  navigate: AACSemanticCategory.NAVIGATION,
  home: AACSemanticCategory.NAVIGATION,
  back: AACSemanticCategory.NAVIGATION,
  backspace: AACSemanticCategory.TEXT_EDITING,
  clear: AACSemanticCategory.TEXT_EDITING,
  copy: AACSemanticCategory.TEXT_EDITING,
  sentence: AACSemanticCategory.COMMUNICATION,
}

const typeMap: Record<
  LogType,
  "button" | "action" | "utterance" | "note" | "other"
> = {
  button: "button",
  navigate: "button",
  home: "action",
  back: "action",
  backspace: "action",
  clear: "action",
  copy: "action",
  sentence: "utterance",
}

export const contentMap: Record<
  "home" | "back" | "backspace" | "clear" | "copy",
  string
> = {
  home: ":home",
  back: ":back",
  backspace: ":backspace",
  clear: ":clear",
  copy: ":copy",
}

export const parseLogEvent = (
  event: LogEvent,
  pageId?: string,
  boardId?: string,
): HistoryOccurrence => {
  const buttonData = parseButtonEvent(event)
  const occurance: HistoryOccurrence = {
    ...buttonData,
    timestamp: new Date(),
    intent: intentMap[event.type],
    category: categoryMap[event.type],
    type: typeMap[event.type],
    pageId,
    boardId,
  }
  return occurance
}

const parseButtonEvent = (event: LogEvent) => {
  if (event.type !== "button" && event.type !== "navigate") return {}
  const button = event.button
  const actions: OblAction[] = []
  if (event.goHomeOnPress) {
    actions.push({
      action: ":auto_home",
      destination_board_id: event.goHomeOnPress,
    })
  }
  return {
    vocalization: button.semanticAction?.text,
    buttonId: button.id,
    imageUrl: button.image?.startsWith("http") ? button.image : undefined,
    actions: actions.length ? actions : undefined,
  }
}

export const parseLogContent = (event: LogEvent) => {
  if (event.type === "sentence") return event.content
  if (event.type === "button" || event.type === "navigate")
    return event.button.label
  return contentMap[event.type]
}
