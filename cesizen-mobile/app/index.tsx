import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import UserHead from '../components/UserHead';
import Footer from '../components/Footer';
import InformationCard from '../components/InformationCard';
import { Information } from '../interfaces/information';
import { router } from "expo-router";

export default function Accueil() {
  const [info, setInfo] = useState<Information | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/informations`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setInfo(data[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <UserHead />
      <View style={{ padding: 24, flex: 1 }}>
        <ScrollView style={{ flex: 1, marginBottom: 80 }}>
          <Text style={{ fontSize: 18, marginBottom: 16 }}>Informations les plus consultés</Text>

          {loading ? (
            <ActivityIndicator size="large" />
          ) : info ? (
            <InformationCard
              titre={info.titre}
              contenus={info.contenus}
              onPress={() => router.replace(`/information/${info.id}`)}
            />
          ) : (
            <Text>Aucune information disponible.</Text>
          )}
        </ScrollView>
      </View>
      <Footer />
    </View>
  );
}
