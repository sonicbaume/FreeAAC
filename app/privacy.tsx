import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Privacy () {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{maxWidth: 600, paddingHorizontal: 24, paddingBottom: 200 }}>
<Text style={styles.body}>Last Updated: 29th January 2026</Text>
<Text style={styles.body}>This Privacy Policy describes how Sonic Baume Ltd ("we," "us," or "our") handles information in the mobile application FreeAAC (the "App").</Text>
<Text style={styles.header}>Data collection</Text>
<Text style={styles.body}>
We do not collect, use, save, or have access to any of your personal data. All data you create or enter in the App, including communication boards, symbols, settings, and user profiles, is stored locally on your device only.
We do not transmit any data to external servers or third parties. We have no access to the content you create or the way you use the App.
</Text>
<Text style={styles.header}>Third party services</Text>
<Text style={styles.body}>This App does not use any third-party services that may collect information used to identify you. We do not use analytics tools, tracking technologies, advertising networks, or crash reporting services.</Text>
<Text style={styles.header}>Cookies and tracking</Text>
<Text style={styles.body}>
We do not use cookies, tracking pixels, or any other tracking technologies to monitor your activity or collect information about you.</Text>
<Text style={styles.header}>Data security</Text>
<Text style={styles.body}>
Since we do not collect any data, your information is as secure as your device. We recommend that you keep your device's operating system updated,
use device-level security features such as passwords and PINs,
use your device's backup features to prevent data loss, and 
be cautious about who has physical access to your device.
</Text>
<Text style={styles.header}>Data retention</Text>
<Text style={styles.body}>
All data created in the App remains on your device until you choose to delete it. You can delete individual items within the App or remove all data by uninstalling the App or clearing the App's data through your device settings.
We recommend regularly backing up your device using your device manufacturer's backup solutions to prevent accidental data loss.
</Text>
<Text style={styles.header}>Children's privacy</Text>
<Text style={styles.body}>
We do not knowingly collect any information from children or any users. Since all data is stored locally on the device, parents, guardians, and caregivers maintain full control over any information created within the App.
This App is designed to be used by individuals of all ages, including children. We are committed to protecting children's privacy. If you are a parent or guardian and have concerns about your child's use of the App, please contact us.
</Text>
<Text style={styles.header}>Your rights</Text>
<Text style={styles.body}>
Even though we do not collect your data, you have the right to understand how the App handles your information. You maintain complete control over your data and can
access, export, back up, and delete all data stored locally on your device through the App interface.
</Text>
<Text style={styles.header}>Compliance</Text>
<Text style={styles.body}>
This Privacy Policy is designed to comply with applicable data protection laws, including the UK General Data Protection Regulation (UK GDPR) and other international privacy regulations. Given our privacy-by-design approach of not collecting any user data, we maintain compliance by not processing personal data.
</Text>
<Text style={styles.header}>Changes to this policy</Text>
<Text style={styles.body}>
We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or for other operational reasons. Any changes will be posted on this page with an updated "Last Updated" date.
We encourage you to review this Privacy Policy periodically. Your continued use of the App after any changes indicates your acceptance of the updated policy.
</Text>
<Text style={styles.header}>Contact us</Text>
<Text style={styles.body}>
If you have any questions, concerns, or requests regarding this policy, please contact support@free-aac.org.
</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 20
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12
  }
})