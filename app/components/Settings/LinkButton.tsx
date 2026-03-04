import { FONT_SIZE, ICON_SIZE, useTheme } from "@/app/utils/theme"
import { Href, Link } from "expo-router"
import { LucideIcon } from "lucide-react-native"
import { Button, Text } from "../Styled"

export default function LinkButton({
  href,
  title,
  icon,
}: {
  href: Href
  title: string
  icon?: LucideIcon
}) {
  const Icon = icon
  const theme = useTheme()
  return (
    <Link href={href} asChild>
      <Button>
        {Icon && <Icon size={ICON_SIZE.md} color={theme.onSecondary} />}
        <Text style={{ fontSize: FONT_SIZE.md, color: theme.onSecondary }}>
          {title}
        </Text>
      </Button>
    </Link>
  )
}
