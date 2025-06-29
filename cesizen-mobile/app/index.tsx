import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import UserHead from '../components/UserHead';
import Footer from '../components/Footer';
import InformationCard from '../components/InformationCard';
import { Information } from '../interfaces/information';
import { router } from 'expo-router';

export default function Accueil() {
  const [infos, setInfos] = useState<Information[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/informations?limit=5`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setInfos(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getDescription = (contenus: Information['contenus']) => {
    const contenuTexte = contenus.find((c) => c.type === 'TEXTE');
    if (contenuTexte) return contenuTexte.valeur.slice(0, 100) + '...';

    const type = contenus[0]?.type;
    if (type === 'IMAGE') return '[Image]';
    if (type === 'VIDEO') return '[Vidéo]';
    if (type === 'DOCUMENT') return '[Document]';
    return '[Contenu]';
  };

  return (
    <View style={{ flex: 1 }}>
      <UserHead />
      <View style={{ padding: 24, flex: 1 }}>
        <ScrollView style={{ flex: 1, marginBottom: 80 }}>
          <Text style={{ fontSize: 18, marginBottom: 16 }}>Informations les plus consultées</Text>

          {loading ? (
            <ActivityIndicator size="large" />
          ) : infos.length > 0 ? (
            infos.map((info) => (
              <InformationCard
                key={info.id}
                titre={info.titre}
                contenus={[{ type: 'TEXTE', valeur: getDescription(info.contenus) }]}
                onPress={() => router.push(`/informations/${info.id}`)}
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
