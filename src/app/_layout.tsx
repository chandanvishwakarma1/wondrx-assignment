import 'react-native-get-random-values'
import { Stack } from "expo-router";
import { SafeAreaInsetsContext, SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>

      <Stack screenOptions={{ headerShown: false}}/>
    </SafeAreaProvider>
  )
}
