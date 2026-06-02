import { Platform } from "react-native"

const sw = `
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(error => {
            console.error('Service Worker registration failed:', error);
        });
    });
}
`

export default function InstallServiceWorker() {
  if (Platform.OS !== "web" || __DEV__) return null
  return <script dangerouslySetInnerHTML={{ __html: sw }} />
}
