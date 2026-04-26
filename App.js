import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import Original from './Original';
import Lista from './Lista';

export default function App() {

  const [pantalla, setPantalla] = useState('original');

  const renderPantalla = () => {
    if (pantalla === 'original') return <Original />;
    if (pantalla === 'lista') return <Lista />;
  };

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
