import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.menu}>
        <TouchableOpacity 
          onPress={() => setPantalla('original')} 
          style={styles.boton}
        >
          <Text style={styles.texto}>Trivia</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setPantalla('lista')} 
          style={styles.boton}
        >
          <Text style={styles.texto}>Lista</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contenido}>
        {renderPantalla()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  menu: {
    flexDirection: 'row',
    backgroundColor: '#000',
  },

  boton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },

  texto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  contenido: {
    flex: 1,
  },
});