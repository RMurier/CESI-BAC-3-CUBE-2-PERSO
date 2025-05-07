import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Feather } from '@expo/vector-icons';

const periods = [
  { label: 'Semaine', value: 'week' },
  { label: 'Mois', value: 'month' },
  { label: 'Trimestre', value: 'quarter' },
  { label: 'Année', value: 'year' },
];

export default function RapportEmotion() {
  const { user } = useUser();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [rapport, setRapport] = useState<any[]>([]);

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      const res = await fetch(`${API_BASE_URL}/api/journal/user/${user.id}/rapport?periode=${selectedPeriod}`);
      const json = await res.json();
      setRapport(json);
    };

    fetchData();
  }, [selectedPeriod, user]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Rapport émotionnel' }} />

      <Text style={styles.title}>Mon rapport émotionnel</Text>

      <View style={styles.filters}>
        {periods.map((p) => (
          <TouchableOpacity
            key={p.value}
            style={[styles.periodButton, selectedPeriod === p.value && styles.periodSelected]}
            onPress={() => setSelectedPeriod(p.value)}
          >
            <Text style={selectedPeriod === p.value ? styles.periodSelectedText : styles.periodText}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={rapport}
        keyExtractor={(item, index) => item.emotion + index}
        renderItem={({ item }) => (
          <View style={styles.rapportItem}>
            <Feather name={item.icon} size={20} color="#007AFF" />
            <Text style={styles.rapportText}>{item.emotion}</Text>
            <Text style={styles.rapportCount}>{item.count}x</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  filters: { flexDirection: 'row', marginBottom: 16, gap: 8, flexWrap: 'wrap' },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  periodSelected: {
    backgroundColor: '#007AFF',
  },
  periodText: {
    color: '#333',
    fontWeight: '500',
  },
  periodSelectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  rapportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  rapportText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  rapportCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});
