import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const bienfaits = ['calme', 'énergie', 'sommeil', 'stress', 'focus'];
const initialLayout = { width: Dimensions.get('window').width };

export default function ListeRespiration() {
  const [exercices, setExercices] = useState<any[]>([]);
  const [favoris, setFavoris] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
  const { user } = useUser();
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'explore', title: 'Explorer' },
    { key: 'favoris', title: 'Favoris' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = selected
          ? `${API_BASE_URL}/api/respiration?bienfait=${selected}`
          : `${API_BASE_URL}/api/respiration`;

          console.log(url);
        const res = await fetch(url);
        const data = await res.json();
        setExercices(data);

        if (user?.id) {
          const favRes = await fetch(`${API_BASE_URL}/api/respiration/user/${user.id}/favoris`);
          const favData = await favRes.json();
          setFavoris(favData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selected, user]);

  const renderExplore = () => (
    <View style={{ flex: 1 }}>
      <View style={styles.filters}>
        {bienfaits.map((b) => (
          <TouchableOpacity
            key={b}
            style={[styles.filterButton, selected === b && styles.filterButtonSelected]}
            onPress={() => setSelected(b === selected ? null : b)}
          >
            <Text style={selected === b ? styles.filterTextSelected : styles.filterText}>{b}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.customButton} onPress={() => router.push('/respiration/custom')}>
        <Text style={styles.customButtonText}>+ Exercice personnalisé</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={exercices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/respiration/${item.id}`)}
            >
              <Feather name={item.icone || 'wind'} size={24} color="#007AFF" />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.nom}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
                <Text style={styles.cardBienfait}>💙 {item.bienfait}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Aucun exercice trouvé.</Text>}
        />
      )}
    </View>
  );

  const renderFavoris = () => (
    loading ? (
      <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
    ) : (
      <FlatList
        data={favoris}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/respiration/${item.id}`)}
          >
            <Feather name={item.icone || 'wind'} size={24} color="#007AFF" />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.nom}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
              <Text style={styles.cardBienfait}>💙 {item.bienfait}</Text>
            </View>
            <Ionicons name="heart" size={20} color="red" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucun favori enregistré.</Text>}
      />
    )
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Respiration guidée' }} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({ explore: renderExplore, favoris: renderFavoris })}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#007AFF' }}
            style={{ backgroundColor: '#fff' }}
            activeColor="#007AFF"
            inactiveColor="#888"
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  filterButtonSelected: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#333',
    fontWeight: '500',
  },
  filterTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  customButton: {
    marginHorizontal: 20,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  customButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  cardDesc: {
    color: '#666',
    fontSize: 13,
    marginTop: 4,
  },
  cardBienfait: {
    marginTop: 4,
    color: '#007AFF',
    fontSize: 12,
  },
  empty: {
    marginTop: 40,
    textAlign: 'center',
    color: '#666',
  },
});
