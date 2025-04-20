import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const actionLabels: Record<string, string> = {
  INSPIRER: 'Inspire',
  EXPIRER: 'Expire',
  RETENIR: 'Retiens',
};

const actionIcons: Record<string, keyof typeof Feather.glyphMap> = {
  INSPIRER: 'arrow-down',
  EXPIRER: 'arrow-up',
  RETENIR: 'pause',
};

export default function StartRespiration() {
  const { id } = useLocalSearchParams();
  const [exercice, setExercice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const router = useRouter();

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchExercice = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/respiration/${id}`);
        const data = await res.json();
        setExercice(data);
        setRemaining(data.actions[0]?.dureeSecondes || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchExercice();
  }, [id]);
  
  useEffect(() => {
    if (!exercice || remaining <= 0) return;
  
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          const next = stepIndex + 1;
          if (next < exercice.actions.length) {
            setStepIndex(next);
            return exercice.actions[next].dureeSecondes;
          } else {
            clearInterval(interval);
            router.replace('/respiration/done'); // ✅ Redirection ici
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [exercice, stepIndex, remaining]);
  

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!exercice) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Exercice non trouvé</Text>
      </View>
    );
  }

  const currentAction = exercice.actions[stepIndex];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: exercice.nom }} />

      <Text style={styles.title}>Étape {stepIndex + 1} / {exercice.actions.length}</Text>
      <Feather name={actionIcons[currentAction.type]} size={80} color="#007AFF" style={styles.icon} />
      <Text style={styles.actionText}>{actionLabels[currentAction.type]}</Text>
      <Text style={styles.timer}>{remaining}s</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    color: '#007AFF',
  },
  icon: {
    marginBottom: 16,
  },
  actionText: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});
