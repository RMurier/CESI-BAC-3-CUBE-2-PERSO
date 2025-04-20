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

export default function CustomStart() {
  const { config } = useLocalSearchParams();
  const router = useRouter();

  const [steps, setSteps] = useState<any[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!config) return;
    try {
      const parsed = JSON.parse(config as string);
      if (!Array.isArray(parsed)) throw new Error('Invalid format');
      setSteps(parsed);
      setRemaining(parsed[0]?.dureeSecondes || 0);
    } catch (err) {
      console.error('❌ Configuration invalide');
    }
  }, [config]);

  useEffect(() => {
    if (!steps.length || remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          const next = stepIndex + 1;
          if (next < steps.length) {
            setStepIndex(next);
            return steps[next].dureeSecondes;
          } else {
            clearInterval(interval);
            router.replace('/respiration/done');
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [steps, stepIndex, remaining]);

  const current = steps[stepIndex];

  if (!steps.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Aucune étape définie</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Respiration personnalisée' }} />
      <Text style={styles.title}>Étape {stepIndex + 1} / {steps.length}</Text>
      <Feather name={actionIcons[current.type]} size={80} color="#007AFF" style={styles.icon} />
      <Text style={styles.actionText}>{actionLabels[current.type]}</Text>
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
