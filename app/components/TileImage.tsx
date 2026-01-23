import { Image, ImageStyle, StyleProp, View } from "react-native";
import { SvgUri, SvgXml } from "react-native-svg";

const isSvgDataUri = (uri: string) => uri.startsWith('data:image/svg') && uri.includes(';base64,')
const isSvgUrl = (uri: string) => uri.split(/[?#]/)[0].toLowerCase().endsWith('.svg')

export default function TileImage ({
  uri,
  style,
}: {
  uri: string;
  style: StyleProp<ImageStyle>;
}) {
  if (isSvgDataUri(uri)) {
    const xml = atob(uri.split(';base64,')[1])
    const svgXml = xml.substring(xml.indexOf('<svg'), xml.indexOf('</svg>') + 6)
    console.log(svgXml)
    return (
      <View style={style}>
        <SvgXml
          xml={svgXml}
          width="100%"
          height="100%"
        />
      </View>
    )
  } else if (isSvgUrl(uri)) {
    return (
      <View style={style}>
        <SvgUri
          uri={uri}
          width="100%"
          height="100%"
        />
      </View>
    )
  } else {
    return (
      <Image
        source={{uri}}
        resizeMode="contain"
        style={style}
      />
    )
  }
}