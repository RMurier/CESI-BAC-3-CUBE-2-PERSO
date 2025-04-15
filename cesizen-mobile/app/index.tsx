import { View, Text } from 'react-native';
import UserHead from '../components/UserHead';

export default function Accueil() {
  return (
    <View style={{ flex: 1 }}>
      <UserHead />
      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 18 }}>Bienvenue sur CESIZen 🎉</Text>
      </View>
    </View>
  );
}
