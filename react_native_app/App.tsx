import { StatusBar } from 'expo-status-bar';

import { ThemeProvider } from './src/core/theme';
import WelcomeScreen from './src/screens/WelcomeScreen';

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      <WelcomeScreen />
    </ThemeProvider>
  );
}
