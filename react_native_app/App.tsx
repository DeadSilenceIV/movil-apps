import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { ThemeProvider } from './src/core/theme';
import GlobalSnackbar from './src/features/productos/presentation/widgets/GlobalSnackbar';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      <View style={{ flex: 1 }}>
        <AppNavigator />
        <GlobalSnackbar />
      </View>
    </ThemeProvider>
  );
}
