import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';

export default function RespirationDetail() {
  const { id } = useLocalSearchParams();
  const { user, isSignedIn } = useUser();
  const [exercice, setExercice] = useState<any>(null);
  const [isFavori, setIsFavori] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/respiration/${id}`);
        const data = await res.json();
        setExercice(data);

        if (user && isSignedIn) {
          const fav = await fetch(`${API_BASE_URL}/api/respiration/${id}/is-favori?user=${user.id}`);
          const favData = await fav.json();
          setIsFavori(favData?.isFavori);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const toggleFavori = async () => {
    try {
      const method = isFavori ? 'DELETE' : 'POST';
      const res = await fetch(`${API_BASE_URL}/api/respiration/${id}/favori`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (res.ok) setIsFavori(!isFavori);
    } catch (err) {
      console.error(err);
    }
  };

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
        <Text style={styles.title}>Exercice introuvable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: exercice.nom }} />

      <View style={styles.header}>
        <Feather name={exercice.icone || 'wind'} size={28} color="#007AFF" />
        <Text style={styles.title}>{exercice.nom}</Text>
        {isSignedIn && (
          <TouchableOpacity onPress={toggleFavori}>
            {isFavori ? (
  <Ionicons name="heart" size={24} color="red" />
) : (
  <Ionicons name="heart-outline" size={24} color="#ccc" />
)}
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.bienfait}>Bienfait : {exercice.bienfait}</Text>
      <Text style={styles.description}>{exercice.description}</Text>

      <TouchableOpacity style={styles.startButton} onPress={() => {router.replace(`/respiration/${id}/start`)}}>
        <Text style={styles.startText}>Démarrer l’exercice</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loading: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  bienfait: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 8,
  },
  description: {
    color: '#444',
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  startText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
