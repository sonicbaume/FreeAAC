/* eslint-disable @typescript-eslint/no-require-imports */
import { Link, useRouter } from "expo-router"
import {
  FilePlusCorner,
  PackageOpen,
  SquareArrowRightEnter,
} from "lucide-react-native"
import { useTransition } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import {
  ScalarType,
  useExecutorchModule,
  useTokenizer,
} from "react-native-executorch"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import BoardList from "./components/Board/BoardList"
import { Button, Text } from "./components/Styled"
import { usePagesetActions } from "./stores/boards"
import { handleError } from "./utils/error"
import { importBoardFile, loadBoard } from "./utils/file"
import {
  FONT_SIZE,
  FONT_WEIGHT,
  GAP,
  ICON_SIZE,
  MAX_WIDTH,
  PADDING,
  useTheme,
} from "./utils/theme"

export default function Index() {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { addBoard } = usePagesetActions()
  const [loading, startLoading] = useTransition()

  // const llm = useLLM({
  //   model: {
  //     modelSource: require("./models/aac_gpt2/model.pte"),
  //     tokenizerSource: require("./models/aac_gpt2/tokenizer.json"),
  //     tokenizerConfigSource: require("./models/aac_gpt2/tokenizer_config.json"),
  //   },
  // })

  // useEffect(() => {
  //   if (llm.isReady) console.log("LLM is ready")
  // }, [llm.isReady])

  // useEffect(() => {
  //   if (llm.isGenerating) console.log("LLM is generating...")
  // }, [llm.isGenerating])

  const openFile = async () => {
    try {
      const file = await importBoardFile()
      if (!file) return
      startLoading(async () => {
        const tree = await loadBoard(file.uri)
        addBoard({
          id: file.id,
          uri: file.uri,
          name: tree.metadata.name || "Untitled board",
        })
        router.push({ pathname: "/[board]", params: { board: file.id } })
      })
    } catch (e) {
      handleError(e)
    }
  }

  // const testLLM = async () => {
  //   console.log("testing LLM")
  //   if (!llm.isReady) return console.log(`Downloading: ${llm.downloadProgress}`)
  //   const chat: Message[] = [
  //     { role: "user", content: "My favorite season is " },
  //   ]
  //   const response = await llm.generate(chat)
  //   console.log("Complete response:", response)
  // }

  // const tokenizer = useTokenizer({
  //   tokenizer: {
  //     tokenizerSource: require("./models/aac_gpt2/tokenizer.json"),
  //   },
  // })
  // useEffect(() => {
  //   async function testTokenizer() {
  //     if (tokenizer.isReady) {
  //       try {
  //         const text = "hello"
  //         const tokens = await tokenizer.encode(text)
  //         console.log(`Tokens for "${text}":`, tokens)

  //         // For GPT-2, "hello" should encode to an array containing 31373
  //         // If you see wildly different numbers, Metro might not be loading the file correctly!
  //       } catch (error) {
  //         console.error("Tokenizer error:", error)
  //       }
  //     }
  //   }
  //   testTokenizer()
  // }, [tokenizer.isReady])

  // 1. Load the raw module instead of useLLM
  const gpt2Module = useExecutorchModule({
    modelSource: require("./models/aac_gpt2/model.pte"),
  })

  const tokenizer = useTokenizer({
    tokenizer: {
      tokenizerSource: require("./models/aac_gpt2/tokenizer.json"),
    },
  })

  async function generateText(inputText: string) {
    if (!gpt2Module.isReady || !tokenizer.isReady)
      return console.log("not ready")

    // FIX 1: Manually prepend the <bos> token just like your Python script
    const prompt = "<bos>" + inputText
    const tokens = await tokenizer.encode(prompt)
    console.log({ prompt, tokens })

    // GPT-2 Vocabulary size
    const VOCAB_SIZE = 50257

    // FIX 2: The Generation Loop (Passes the whole sequence every time)
    for (let step = 0; step < 20; step++) {
      // max_new_tokens = 20

      // Convert JS array to typed array for the ExecuTorch engine
      const inputIds = new BigInt64Array(tokens.map((t) => BigInt(t)))

      // Run the forward pass. We pass the inputs, and the shape: [batch=1, seq_len]
      const inputTensor = {
        dataPtr: inputIds,
        sizes: [1, tokens.length],
        scalarType: ScalarType.LONG,
      }
      // console.log({ inputTensor })
      const result = await gpt2Module.forward([inputTensor])

      // The result is an ArrayBuffer of Float32 logits.
      // Shape is [1, sequence_length, vocab_size]
      const tensorBuffer = result[0].dataPtr
      const floatLogits =
        tensorBuffer instanceof ArrayBuffer ?
          new Float32Array(tensorBuffer)
        : tensorBuffer

      // We only care about the predictions for the VERY LAST token in the sequence.
      // We slice the array to get the last 50,257 numbers.
      const startIndex = (tokens.length - 1) * VOCAB_SIZE
      const lastTokenLogits = floatLogits.subarray(
        startIndex,
        startIndex + VOCAB_SIZE,
      )

      // FIX 3: Basic Greedy Decoding (Argmax)
      // Note: If the model repeats itself, you will need to add your repetition_penalty
      // math right here before finding the max!
      let maxLogit: number | bigint = -Infinity
      let nextTokenId = 0
      for (let i = 0; i < VOCAB_SIZE; i++) {
        if (lastTokenLogits[i] > maxLogit) {
          maxLogit = lastTokenLogits[i]
          nextTokenId = i
        }
      }

      // Append the new token to our running list
      tokens.push(nextTokenId)

      // Decode and update UI
      const currentText = await tokenizer.decode(tokens, undefined)
      console.log(currentText)

      if (currentText.includes("<eos>")) {
        const cleaned = currentText
          .replace("<bos>", "")
          .replace("<eos>", "")
          .trim()
        console.log("COMPLETED:")
        console.log(cleaned)
        break
      }

      // Stop if it generates the EOS token (usually 50256 for GPT2)
      if (nextTokenId === 50256) break
    }
  }

  return (
    <>
      <View
        style={{
          ...styles.container,
          backgroundColor: theme.background,
          paddingBottom: insets.bottom,
        }}
      >
        <View style={{ ...styles.boardList, backgroundColor: theme.surface }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <Text
              style={{ fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semi }}
            >
              My boards
            </Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Link href="/create" asChild>
                <Button variant="ghost">
                  <FilePlusCorner size={ICON_SIZE.md} color={theme.onSurface} />
                </Button>
              </Link>
              <Button variant="ghost" onPress={openFile}>
                <SquareArrowRightEnter
                  size={ICON_SIZE.md}
                  color={theme.onSurface}
                />
              </Button>
            </View>
          </View>
          <BoardList />
          {loading && (
            <ActivityIndicator size="large" color={theme.onSurface} />
          )}
          {!loading && (
            <>
              <Button
                variant="outline"
                onPress={() => router.push("/templates")}
              >
                <PackageOpen size={ICON_SIZE.md} color={theme.onSurface} />
                <Text style={{ color: theme.onSurface }}>View templates</Text>
              </Button>
            </>
          )}
          <Button
            onPress={() => {
              console.log("starting LLM")
              generateText("I need to use the")
            }}
          >
            <Text>Test LLM</Text>
          </Button>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  boardList: {
    width: MAX_WIDTH,
    maxWidth: "100%",
    padding: PADDING.xl,
    gap: GAP.xl,
  },
})
