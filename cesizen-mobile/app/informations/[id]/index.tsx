import { View, Text, ScrollView, ActivityIndicator, Image, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Information } from '../../../interfaces/information';
import UserHead from '../../../components/UserHead';
import Footer from '../../../components/Footer';
import { Video } from 'expo-av';
import * as WebBrowser from 'expo-web-browser';

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
                const fullUri = `${process.env.EXPO_PUBLIC_API_BASE_URL}${contenu.valeur}`;
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
                        source={{ uri: fullUri }}
                        style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 12 }}
                        resizeMode="cover"
                      />
                    );
                  case 'VIDEO':
                    return (
                      <Video
                        key={index}
                        source={{ uri: fullUri }}
                        useNativeControls
                        resizeMode="contain"
                        style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 12 }}
                      />
                    );
                  case 'DOCUMENT':
                    return (
                      <Pressable
                        key={index}
                        onPress={() => WebBrowser.openBrowserAsync(fullUri)}
                      >
                        <Text
                          style={{
                            color: 'blue',
                            textDecorationLine: 'underline',
                            marginBottom: 12,
                          }}
                        >
                          📄 Ouvrir le document
                        </Text>
                      </Pressable>
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
