import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { RefObject } from "react"
import { ScrollView } from "react-native"
import { usePagesetActions } from "../../stores/boards"
import { PADDING, useTheme } from "../../utils/theme"
import SheetItem from "../SheetItem"

export default function PageNav({
  ref,
  pages,
}: {
  ref: RefObject<TrueSheet | null>
  pages: { id: string; name: string }[]
}) {
  const theme = useTheme()
  const { navigateToPage } = usePagesetActions()

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
