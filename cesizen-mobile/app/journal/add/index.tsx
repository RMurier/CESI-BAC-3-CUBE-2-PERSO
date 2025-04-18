import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function AddEmotion() {
  const [note, setNote] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter une émotion</Text>
      <TextInput
        placeholder="Décris ton émotion..."
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />
      <Button title="Enregistrer" onPress={() => {}} color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
});