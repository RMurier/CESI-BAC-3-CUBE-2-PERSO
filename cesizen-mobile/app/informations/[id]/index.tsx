import { Image } from 'react-native';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Information } from '../../../interfaces/information';
import UserHead from '../../../components/UserHead';
import Footer from '../../../components/Footer';

export default function InfoDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [info, setInfo] = useState<Information | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/informations/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setInfo(data);
      })
      .catch((err) => {
        console.error('Erreur récupération information :', err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <View style={{ flex: 1 }}>
      <UserHead />
      <View style={{ padding: 24, flex: 1 }}>
        <ScrollView style={{ flex: 1, marginBottom: 80 }}>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : info ? (
            <>
              <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>
                {info.titre}
              </Text>
              {info.contenus.map((contenu, index) => {
                switch (contenu.type) {
                  case 'TEXTE':
                    return (
                      <Text key={index} style={{ fontSize: 16, marginBottom: 12 }}>
                        {contenu.valeur}
                      </Text>
                    );
                  case 'IMAGE':
                    return (
                      <Image
                        key={index}
                        source={{ uri: contenu.valeur }}
                        style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 12 }}
                        resizeMode="cover"
                      />
                    );
                  case 'VIDEO':
                    return (
                      <Text key={index} style={{ color: 'blue', marginBottom: 12 }}>
                        [Vidéo non affichée ici] {contenu.valeur}
                      </Text>
                    );
                  case 'DOCUMENT':
                    return (
                      <Text key={index} style={{ color: 'blue', marginBottom: 12 }}>
                        [Document] {contenu.valeur}
                      </Text>
                    );
                  default:
                    return null;
                }
              })}
            </>
          ) : (
            <Text>Information non trouvée.</Text>
          )}
        </ScrollView>
      </View>
      <Footer />
    </View>
  );
}
