import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import uuid from 'react-native-uuid';

const ACTIONS = ['INSPIRER', 'RETENIR', 'EXPIRER'];

export default function CustomRespiration() {
  const [steps, setSteps] = useState<any[]>([]);
  const router = useRouter();

  const addStep = () => {
    setSteps([...steps, { id: uuid.v4(), type: 'INSPIRER', dureeSecondes: 4 }]);
  };

  const updateStep = (id: string, key: string, value: any) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [key]: value } : s))
    );
  };

  const removeStep = (id: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const lancer = () => {
    if (steps.length === 0) {
      Alert.alert('Ajoute au moins une étape.');
      return;
    }
    router.push({ pathname: '/respiration/start', params: { config: JSON.stringify(steps) } });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Créer un exercice personnalisé' }} />

      <FlatList
        data={steps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.stepRow}>
            <TouchableOpacity onPress={() => removeStep(item.id)}>
              <Feather name="x" size={20} color="red" />
            </TouchableOpacity>
            <Text style={styles.label}>Action :</Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => {
                const currentIndex = ACTIONS.indexOf(item.type);
                const nextType = ACTIONS[(currentIndex + 1) % ACTIONS.length];
                updateStep(item.id, 'type', nextType);
              }}
            >
              <Text style={styles.pickerText}>{item.type}</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Durée :</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={item.dureeSecondes.toString()}
              onChangeText={(text) => updateStep(item.id, 'dureeSecondes', parseInt(text) || 1)}
            />
            <Text style={styles.sec}>sec</Text>
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.addButton} onPress={addStep}>
            <Text style={styles.addText}>+ Ajouter une étape</Text>
          </TouchableOpacity>
        }
      />

      <TouchableOpacity style={styles.startButton} onPress={lancer}>
        <Text style={styles.startText}>Lancer l’exercice</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  label: { fontWeight: '600', color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    width: 60,
    textAlign: 'center',
  },
  sec: { color: '#888' },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pickerText: {
    fontWeight: '600',
    color: '#007AFF',
  },
  addButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  addText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  startText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
