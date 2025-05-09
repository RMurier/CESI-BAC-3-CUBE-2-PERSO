import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Image,
  Pressable,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { Ressource } from '../../../interfaces/ressource';
import { useAuth } from '@clerk/clerk-expo';

export default function RessourceDetail() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [ressource, setRessource] = useState<Ressource | null>(null);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const { isSignedIn, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchRessource = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/ressources/${id}`
        );
        const data: Ressource = await res.json();

        setRessource(data);
        setLikes(data.likes?.length ?? 0);

        if (userId && data.likes?.some((l: any) => l.refUtilisateur === userId)) {
          setHasLiked(true);
        }

        await fetch(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/ressources/${id}/views`,
          { method: 'PATCH' }
        );
      } catch (err) {
        console.error('Erreur chargement ressource :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRessource();
  }, [id, userId]);

  const handleLike = async () => {
    if (!id) return;

    if (!isSignedIn) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/ressources/${id}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUtilisateur: userId }),
      });

      const result = await res.json();

      if (result.liked) {
        setLikes((prev) => prev + 1);
        setHasLiked(true);
      } else {
        setLikes((prev) => Math.max(prev - 1, 0));
        setHasLiked(false);
      }
    } catch (error) {
      console.error('Erreur lors du toggle like :', error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!ressource) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Ressource non trouvée</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      {ressource.imagePreviewUrl && (
        <Image
          source={{ uri: ressource.imagePreviewUrl }}
          style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 16 }}
          resizeMode="cover"
        />
      )}

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
        {ressource.title}
      </Text>

      <Text style={{ fontSize: 16, color: '#666', marginBottom: 20 }}>
        {ressource.description}
      </Text>

      {ressource.type === 'HTML' && ressource.content && (
        <RenderHTML contentWidth={width} source={{ html: ressource.content }} />
      )}

      <View style={{ marginTop: 24 }}>
        <Pressable
          onPress={handleLike}
          style={{
            backgroundColor: '#e91e63',
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>
            {hasLiked ? '💔 Je n’aime plus' : '❤️ J’aime'} ({likes})
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
