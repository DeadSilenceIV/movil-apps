import { StatusBar } from 'expo-status-bar';

import { ThemeProvider } from './src/core/theme';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </ThemeProvider>
  );
}
