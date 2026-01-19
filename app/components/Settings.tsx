import { X } from "lucide-react-native";
import { FlatList, ListRenderItem, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { useLabelLocation, useMessageWindowLocation, usePlayOnPress, usePrefsActions } from "../stores/prefs";

interface SettingItem {
  name: string;
  description: string;
  component: React.ReactNode;
}

export default function Settings({
  onClose,
}: {
  onClose: () => void;
}) {
  const playOnPress = usePlayOnPress()
  const messageWindowLocation = useMessageWindowLocation()
  const labelLocation = useLabelLocation()
  const { togglePlayOnPress, setMessageWindowLocation, setLabelLocation } = usePrefsActions()

  const handleRenderItem: ListRenderItem<SettingItem> = ({item})  => (
    <View style={styles.settingItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingItemTitle}>{item.name}</Text>
        <Text style={styles.settingItemDescription}>{item.description}</Text>
      </View>
      {item.component}
    </View>
  )

  const settingsData: SettingItem[] = [
    {
      name: "Speak on press",
      description: "Play audio when a button is pressed",
      component: <Switch value={playOnPress} onValueChange={togglePlayOnPress} />
    },{
      name: "Label location",
      description: "Position of label on buttons",
      component: <View style={{display: 'flex', alignItems: 'center'}}>
        <Switch value={labelLocation === "top"} onValueChange={val => {
          setLabelLocation(val ? "top" : "bottom")
        }} />
        <Text style={{textAlign: 'center', fontSize: 12}}>{labelLocation === "top" ? "Top" : "Bottom"}</Text>
      </View>
    },{
      name: "Message window location",
      description: "Position of message window on screen",
      component: <View style={{display: 'flex', alignItems: 'center'}}>
        <Switch value={messageWindowLocation === "top"} onValueChange={val => {
          setMessageWindowLocation(val ? "top" : "bottom")
        }} />
        <Text style={{textAlign: 'center', fontSize: 12}}>{messageWindowLocation === "top" ? "Top" : "Bottom"}</Text>
      </View>
    }
  ]

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <X size={24} />
        </Pressable>
        <Text style={styles.modalTitle}>Settings</Text>
        <FlatList
          data={settingsData}
          renderItem={handleRenderItem}
          style={styles.settingsList}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: 400,
    maxWidth: '90%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'semibold',
    marginBottom: 15,
  },
  settingsList: {
    width: '100%',
  },
  settingItem: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    padding: 15,
    // justifyContent: 'space-between'
  },
  settingItemTitle: {
    fontSize: 16,
  },
  settingItemDescription: {
    fontSize: 12,
    fontWeight: 'light',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10
  }
})