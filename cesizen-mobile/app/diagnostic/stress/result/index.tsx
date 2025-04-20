import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DiagnosticResult() {
  const { score } = useLocalSearchParams();
  const router = useRouter();

  const parsedScore = parseInt(score as string);

  let niveau = '';
  let conseil = '';

  if (parsedScore <= 5) {
    niveau = 'Stress faible';
    conseil = "Continue à prendre soin de toi. Tu peux renforcer ton bien-être avec des exercices de respiration ou de méditation.";
  } else if (parsedScore <= 12) {
    niveau = 'Stress modéré';
    conseil = "Essaie d'intégrer des moments de pause dans ta journée. Une activité relaxante ou une routine régulière peut t'aider.";
  } else {
    niveau = 'Stress élevé';
    conseil = "Il est important de ralentir et de prendre soin de ta santé mentale. N'hésite pas à consulter un professionnel ou utiliser les ressources de CESIZen.";
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Résultat du diagnostic' }} />

      <Text style={styles.score}>Score : {parsedScore} / 20</Text>
      <Text style={styles.level}>{niveau}</Text>
      <Text style={styles.description}>{conseil}</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/')}> 
        <Text style={styles.buttonText}>Retour à l'accueil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  score: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  level: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
