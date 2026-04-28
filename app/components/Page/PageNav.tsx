import { useBoards } from "@/app/stores/boards"
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { useLocalSearchParams } from "expo-router"
import { RefObject } from "react"
import { ScrollView } from "react-native"
import { PADDING, useTheme } from "../../utils/theme"
import SheetItem from "../SheetItem"

export default function PageNav({
  ref,
  navigateToPage,
}: {
  ref: RefObject<TrueSheet | null>
  navigateToPage: (pageId: string) => void
}) {
  const theme = useTheme()
  const { boardId } = useLocalSearchParams()
  const boards = useBoards()
  const pages = boards.find((b) => b.id === boardId)?.pages ?? []

  const shouldScroll = pages.length > 10
  return (
    <TrueSheet
      ref={ref}
      detents={shouldScroll ? [0.75] : ["auto"]}
      backgroundColor={theme.surfaceContainer}
      style={{ padding: PADDING.xl }}
      scrollable={shouldScroll}
    >
      <ScrollView nestedScrollEnabled>
        {pages.map((page, i) => (
          <SheetItem
            key={i}
            label={page.name}
            onPress={() => {
              navigateToPage(page.id)
              ref.current?.dismiss()
            }}
          />
        ))}
      </ScrollView>
    </TrueSheet>
  )
}
