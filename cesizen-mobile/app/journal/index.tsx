import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function JournalIndex() {
  return (
    <View style={styles.container}>
        <Stack.Screen
        options={{
            title: "Journal d'émotions"
        }}
        />
      <Text style={styles.title}>Mon journal émotionnel</Text>
      <Link href="/journal/add" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Ajouter une émotion</Text>
        </TouchableOpacity>
      </Link>
      <FlatList data={[]} renderItem={() => null} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  addButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8 },
  addButtonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});