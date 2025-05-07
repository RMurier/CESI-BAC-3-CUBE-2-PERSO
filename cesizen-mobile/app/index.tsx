import { View, Text, ScrollView } from 'react-native';
import UserHead from '../components/UserHead';
import Footer from '../components/Footer';

export default function Accueil() {
  return (
    <View style={{ flex: 1 }}>
      <UserHead />
      <View style={{ padding: 24, flex: 1 }}>
        <ScrollView style={{ flex: 1, marginBottom: 80 }}>
          <Text style={{ fontSize: 18 }}>Bienvenue sur CESIZen 🎉</Text>
        </ScrollView>
      </View>
      <Footer />
    </View>
  );
}
