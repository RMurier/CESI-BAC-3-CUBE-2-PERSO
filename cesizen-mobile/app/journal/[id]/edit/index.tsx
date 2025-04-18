import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function EditEmotion() {
  const [note, setNote] = useState('Texte existant...');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier l'émotion</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />
      <Button title="Mettre à jour" onPress={() => {}} color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
});