import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
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
      <View style={styles.menu}>
        
        <TouchableOpacity onPress={() => setPantalla('original')} style={styles.boton}>
          <Text style={styles.texto}>Trivia</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setPantalla('lista')} style={styles.boton}>
          <Text style={styles.texto}>Lista</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contenido}>
        {renderPantalla()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 'auto',
    backgroundColor: '#fff',
  },

  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    backgroundColor: '#000000',
    width: '100%',
  },

  boton: {
    padding: 10,
  },

  texto: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },

  contenido: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});