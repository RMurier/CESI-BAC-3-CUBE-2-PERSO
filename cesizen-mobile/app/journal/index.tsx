import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function JournalIndex() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Journal d'émotions" }} />

      <Text style={styles.title}>Bienvenue dans ton journal émotionnel</Text>

      <View style={styles.section}>
        <Link href="/journal/add" asChild>
          <TouchableOpacity style={styles.button}>
            <Feather name="plus-circle" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Ajouter mon émotion du jour</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/journal/history" asChild>
          <TouchableOpacity style={styles.button}>
            <Feather name="book" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Mes émotions passées</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/journal/rapport" asChild>
          <TouchableOpacity style={styles.button}>
            <Feather name="bar-chart-2" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Voir mon rapport</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#222',
  },
  section: {
    gap: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginRight: 10,
  },
});
