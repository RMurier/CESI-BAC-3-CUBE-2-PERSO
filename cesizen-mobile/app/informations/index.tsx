import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Information } from '../../interfaces/information';
import InformationCard from '../../components/InformationCard';
import UserHead from '../../components/UserHead';
import Footer from '../../components/Footer';

export default function ToutesLesInformations() {
  const [informations, setInformations] = useState<Information[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/informations`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setInformations(data);
      })
      .catch((err) => console.error('Erreur récupération informations :', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <UserHead />
      <View style={{ padding: 24, flex: 1 }}>
        <ScrollView style={{ flex: 1, marginBottom: 80 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>
            Toutes les informations
          </Text>

          {loading ? (
            <ActivityIndicator size="large" />
          ) : informations.length > 0 ? (
            informations.map((info) => (
              <InformationCard
                key={info.id}
                titre={info.titre}
                contenus={info.contenus}
                onPress={() => router.push(`/information/${info.id}`)}
              />
            ))
          ) : (
            <Text>Aucune information disponible.</Text>
          )}
        </ScrollView>
      </View>
      <Footer />
    </View>
  );
}
