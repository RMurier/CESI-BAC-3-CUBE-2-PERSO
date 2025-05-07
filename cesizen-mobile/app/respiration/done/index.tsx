import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function RespirationDone() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Exercice terminé' }} />

      <Feather name="check-circle" size={64} color="#00C851" style={{ marginBottom: 20 }} />
      <Text style={styles.title}>Bravo 🎉</Text>
      <Text style={styles.message}>Tu as terminé ton exercice de respiration avec succès.</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/respiration')}>
        <Text style={styles.buttonText}>Retour à la liste</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
