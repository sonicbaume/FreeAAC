import { LucideIcon, Monitor, Speech, X } from "lucide-react-native";
import { ListRenderItem, Pressable, SectionList, StyleSheet, Switch, Text, View } from "react-native";
import { useLabelLocation, useMessageWindowLocation, usePlayOnPress, usePrefsActions } from "../stores/prefs";

interface SettingsHeader {
  title: string;
  icon: LucideIcon;
}

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

  const renderItem: ListRenderItem<SettingItem> = ({item}) => (
    <View style={styles.settingItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingItemTitle}>{item.name}</Text>
        <Text style={styles.settingItemDescription}>{item.description}</Text>
      </View>
      {item.component}
    </View>
  )

  const renderSectionHeader = ({section}: {section: SettingsHeader}) => {
    const Icon = section.icon
    return (
    <View style={styles.sectionHeader}>
      <Icon size={20} />
      <Text style={{ fontSize: 14 }}>{section.title}</Text>
    </View>)
  }

  const settingsData: (SettingsHeader & { data: SettingItem[] })[] = [
    {
      title: "Speech",
      icon: Speech,
      data: [
        {
          name: "Speak on press",
          description: "Play audio when a button is pressed",
          component: <Switch value={playOnPress} onValueChange={togglePlayOnPress} />
        }
      ]
    },{
      title: "Interface",
      icon: Monitor,
      data: [
        {
          name: "Label position",
          description: "Position of label on buttons",
          component: <View style={{display: 'flex', alignItems: 'center'}}>
            <Switch value={labelLocation === "top"} onValueChange={val => {
              setLabelLocation(val ? "top" : "bottom")
            }} />
            <Text style={{textAlign: 'center', fontSize: 12}}>{labelLocation === "top" ? "Top" : "Bottom"}</Text>
          </View>
        },{
          name: "Message window position",
          description: "Position of message window on screen",
          component: <View style={{display: 'flex', alignItems: 'center'}}>
            <Switch value={messageWindowLocation === "top"} onValueChange={val => {
              setMessageWindowLocation(val ? "top" : "bottom")
            }} />
            <Text style={{textAlign: 'center', fontSize: 12}}>{messageWindowLocation === "top" ? "Top" : "Bottom"}</Text>
          </View>
        }
      ]
    }
  ]

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <X size={24} />
        </Pressable>
        <Text style={styles.modalTitle}>Settings</Text>
        <SectionList
          sections={settingsData}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
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