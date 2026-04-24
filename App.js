import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Original from './Original';
import Lista from './Lista';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Original/>
      <Lista/>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
