import { Image } from "expo-image";
import { ImageStyle, StyleProp, View } from "react-native";
import { SvgXml } from "react-native-svg";

const isSvgDataUri = (uri: string) => uri.startsWith('data:image/svg') && uri.includes(';base64,')

export default function TileImage ({
  uri,
  style,
}: {
  uri: string;
  style: StyleProp<ImageStyle>;
}) {
  if (isSvgDataUri(uri)) {
    const xml = atob(uri.split(';base64,')[1])
    const svgXml = xml.substring(xml.indexOf('<svg'), xml.lastIndexOf('</svg>') + 6)
    return (
      <View style={style}>
        <SvgXml
          xml={svgXml}
          width="100%"
          height="100%"
        />
      </View>
    )
  } else {
    return (
      <Image
        source={{uri}}
        contentFit="contain"
        style={style}
      />
    )
  }
}