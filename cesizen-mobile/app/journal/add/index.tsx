import { useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Emotion } from '../../../interfaces/emotion';

export default function AddEmotion() {
  const { user, isLoaded } = useUser();
  const [note, setNote] = useState('');
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emotionRes, journalRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/emotions`),
          fetch(`${API_BASE_URL}/api/journal/user/${user?.id}/today`),
        ]);

        const emotionData = await emotionRes.json();
        const journalData = await journalRes.json();


        if (emotionRes.ok) setEmotions(emotionData);
        if (journalRes.ok) {
          setAlreadyExists(journalData ? true : false);
        }
      } catch (ex) {
        Alert.alert('Une erreur est survenue lors du chargement.');
        console.error(ex);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) fetchData();
  }, [isLoaded]);

  const submitEmotion = async () => {
    if (!selectedEmotion || !note.trim()) {
      Alert.alert('Remplis tous les champs !');
      return;
    }

    try {
      const now = new Date();
      const utcMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

      const res = await fetch(`${API_BASE_URL}/api/journal/user/${user?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refUtilisateur: user?.id,
          refEmotion: selectedEmotion.id,
          description: note,
          date: utcMidnight
        }),
      });

      if (res.ok) {
        Alert.alert('✅ Emotion enregistrée !');
        setAlreadyExists(true);
      } else {
        Alert.alert("❌ Impossible d’enregistrer l’émotion");
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur réseau');
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Stack.Screen options={{ title: "Journal d'émotions" }} />
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (alreadyExists) {
  return (
    <View style={styles.alreadyContainer}>
      <Stack.Screen options={{ title: "Journal d'émotions" }} />
      <Feather name="smile" size={48} color="#007AFF" style={{ marginBottom: 16 }} />
      <Text style={styles.alreadyTitle}>C’est fait 🎉</Text>
      <Text style={styles.alreadyMessage}>
        Tu as déjà partagé ton émotion aujourd’hui.
      </Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          router.back();
        }}
      >
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
}


  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Journal d'émotions" }} />
      <Text style={styles.title}>Ajouter une émotion</Text>

      <Text style={styles.label}>Émotion sélectionnée :</Text>
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
        placeholder="Décris ton émotion du jour..."
        value={note}
        onChangeText={setNote}
        style={styles.input}
        multiline
      />

      <Button title="Enregistrer" onPress={submitEmotion} color="#007AFF" />

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
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
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
  alreadyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#fff',
  },
  alreadyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 8,
  },
  alreadyMessage: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },  
});
