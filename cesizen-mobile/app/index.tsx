import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import UserHead from '../components/UserHead';
import Footer from '../components/Footer';
import { Ressource } from '../interfaces/ressource';

export default function Accueil() {
  const [ressources, setRessources] = useState<Ressource[]>([]);
  const router = useRouter();

  const fetchRessources = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/ressources`);
      const data: Ressource[] = await res.json();

      const sorted = data
        .sort((a, b) => {
          const likeDiff = (b.likes?.length ?? 0) - (a.likes?.length ?? 0);
          if (likeDiff !== 0) return likeDiff;
          return (b.vues ?? 0) - (a.vues ?? 0);
        })
        .slice(0, 10);

      setRessources(sorted);
    } catch (err) {
      console.error("Erreur lors de la récupération des ressources :", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRessources();
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <UserHead />
      <View style={{ padding: 24, flex: 1 }}>
        <ScrollView style={{ flex: 1, marginBottom: 80 }}>
          <Text style={{ fontSize: 18, marginBottom: 16 }}>
            Bienvenue sur CESIZen 🎉
          </Text>

          <Text style={{ fontSize: 16, marginBottom: 12 }}>
            Ressources populaires :
          </Text>

          {ressources.map((ressource) => (
            <Pressable
              key={ressource.id}
              onPress={() => router.push(`/ressources/${ressource.id}`)}
              style={{
                backgroundColor: '#f0f0f0',
                borderRadius: 12,
                marginBottom: 16,
                overflow: 'hidden',
                elevation: 2,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              {ressource.imagePreviewUrl ? (
                <Image
                  source={{ uri: ressource.imagePreviewUrl }}
                  style={{
                    width: '100%',
                    height: 180,
                    backgroundColor: '#ddd',
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={{
                    width: '100%',
                    height: 180,
                    backgroundColor: '#ccc',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#555' }}>Aucune image</Text>
                </View>
              )}

              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                  {ressource.title}
                </Text>
                <Text numberOfLines={2} style={{ color: '#666', marginTop: 4 }}>
                  {ressource.description}
                </Text>

                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <Text style={{ marginRight: 12, color: '#444' }}>
                    👁 {ressource.vues ?? 0}
                  </Text>
                  <Text style={{ color: '#444' }}>
                    ❤️ {ressource.likes?.length ?? 0}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <Footer />
    </View>
  );
}
