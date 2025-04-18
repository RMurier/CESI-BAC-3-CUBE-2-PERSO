import { View, Text, StyleSheet } from 'react-native';

export default function ViewEmotion() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détail de l'émotion</Text>
      <Text style={styles.note}>Contenu détaillé de l'entrée...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  note: { fontSize: 16, color: '#444' },
});
