import { View, Text, StyleSheet } from 'react-native';

export default function RapportEmotion() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rapport émotionnel</Text>
      <Text>Filtrer par semaine, mois, trimestre, année...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
});