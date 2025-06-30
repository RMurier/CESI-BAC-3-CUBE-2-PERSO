import { Text, Pressable } from 'react-native';

interface ContenuInformation {
  type: 'TEXTE' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  valeur: string;
}

interface Props {
  titre: string;
  contenus: ContenuInformation[];
  onPress?: () => void;
}

export default function InformationCard({ titre, contenus, onPress }: Props) {
  const texte = contenus.find((c) => c.type === 'TEXTE')?.valeur ?? '';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? '#e0e0e0' : '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
        {titre}
      </Text>
      <Text style={{ fontSize: 14, color: '#555' }}>
        {texte.slice(0, 100)}...
      </Text>
    </Pressable>
  );
}
