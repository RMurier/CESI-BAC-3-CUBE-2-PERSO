import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Feather } from '@expo/vector-icons';
import { Emotion } from '../../../../interfaces/emotion';
export default function EditEmotion() {
  const { id } = useLocalSearchParams();
  const { user } = useUser();
  const router = useRouter();

  const [note, setNote] = useState('');
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/journal/${id}`);
        const data = await res.json();

        const emotionList = await fetch(`${API_BASE_URL}/api/emotions`);
        const emotionsData = await emotionList.json();

        setEmotions(emotionsData);
        setNote(data.description);

        const found = emotionsData.find((e: Emotion) => e.id === data.refEmotion);
        if (found) {
          setSelectedEmotion(found);
        } else {
          setSelectedEmotion(data.emotion); // fallback
        }
      } catch (err) {
        Alert.alert('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    if (id && user?.id) fetchData();
  }, [id, user]);

  const submit = async () => {
    if (!note.trim() || !selectedEmotion) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/journal/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refEmotion: selectedEmotion.id,
          description: note,
        }),
      });

      if (res.ok) {
        Alert.alert('Émotion mise à jour !');
        router.replace("/journal/history");
      } else {
        Alert.alert("Impossible de modifier l’émotion");
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur réseau');
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Stack.Screen options={{ title: 'Modifier une émotion' }} />
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Modifier une émotion' }} />

      <Text style={styles.label}>Émotion :</Text>
      <TouchableOpacity
        style={styles.selectBox}
        onPress={() => setModalVisible(true)}
      >
        {selectedEmotion ? (
          <View style={styles.selectRow}>
            <Feather name={selectedEmotion.icon} size={20} color="#007AFF" />
            <Text style={styles.selectText}>{selectedEmotion.nom}</Text>
          </View>
        ) : (
          <Text style={styles.selectPlaceholder}>Choisir une émotion</Text>
        )}
      </TouchableOpacity>

      {selectedEmotion && (
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>{selectedEmotion.description}</Text>
        </View>
      )}

      <TextInput
        placeholder="Modifier la description..."
        value={note}
        onChangeText={setNote}
        style={styles.input}
        multiline
      />

      <Button title="Enregistrer" onPress={submit} color="#007AFF" />

      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={emotions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedEmotion(item);
                    setModalVisible(false);
                  }}
                >
                  <Feather name={item.icon} size={20} color="#007AFF" />
                  <Text style={styles.modalItemText}>{item.nom}</Text>
                  <Text style={styles.modalItemDescription}>{item.description}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
    container: { padding: 20, flex: 1 },
    loading: { flex: 1, justifyContent: 'center' },
    label: { fontWeight: '600', marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    selectBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    selectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    selectText: {
        fontSize: 16,
        color: '#333',
    },
    selectPlaceholder: {
        color: '#999',
        fontStyle: 'italic',
    },
    descriptionBox: {
        marginBottom: 16,
    },
    descriptionText: {
        fontSize: 14,
        color: '#444',
    },
    overlay: {
        flex: 1,
        backgroundColor: '#00000055',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '50%',
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
    },
    modalItemText: {
        fontSize: 16,
    },
    modalItemDescription: {
        fontSize: 13,
        color: '#777',
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
    },
});