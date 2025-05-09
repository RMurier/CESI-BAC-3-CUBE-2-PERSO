import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ressource } from '../../../interfaces/ressource';

export default function RessourceLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [ressource, setRessource] = useState<Ressource | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRessource = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/ressources/${id}`
        );
        const data: Ressource = await res.json();
        setRessource(data);
        navigation.setOptions({ title: data.title });
      } catch (err) {
        console.error('Erreur chargement titre ressource :', err);
      }
    };

    fetchRessource();
  }, [id]);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          title: ressource ? ressource.title : 'Ressource',
        }}
      />
    </Stack>
  );
}
