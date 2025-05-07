import { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    Pressable,
    Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';

export default function JournalHistory() {
    const { user } = useUser();
    const [data, setData] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();

    const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

    const deleteEmotion = async (id: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/journal/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchData();
            } else {
                Alert.alert("Une erreur est survenue lors de la suppression de l'émotion");
            }
        } catch (ex) {
            Alert.alert("Une erreur est survenue lors de la suppression de l'émotion");
        }
    };

    const fetchData = async () => {
        const res = await fetch(`${API_BASE_URL}/api/journal/user/${user?.id}`);
        const json = await res.json();
        setData(json);
    };

    useEffect(() => {
        if (user?.id) fetchData();
    }, [user]);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Mes émotions passées' }} />

            {data.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Feather name="calendar" size={64} color="#ccc" style={{ marginBottom: 12 }} />
                    <Text style={styles.emptyTitle}>Aucune émotion enregistrée</Text>
                    <Text style={styles.emptyText}>Commence à utiliser le journal pour suivre ton état émotionnel quotidien.</Text>
                </View>
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => {
                                setSelected(item);
                                setModalVisible(true);
                            }}
                        >
                            <Text style={styles.date}>{new Date(item.date).toLocaleDateString('fr-FR')}</Text>
                            <View style={styles.row}>
                                <Feather name={item.emotion.icon} size={20} color="#007AFF" />
                                <Text style={styles.emotion}>{item.emotion.nom}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}

            <Modal visible={modalVisible} transparent animationType="slide">
                <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContent}>
                        {selected && (
                            <>
                                <Text style={styles.modalDate}>{new Date(selected.date).toLocaleDateString('fr-FR')}</Text>
                                <View style={styles.row}>
                                    <Feather name={selected.emotion.icon} size={20} color="#007AFF" />
                                    <Text style={styles.modalTitle}>{selected.emotion.nom}</Text>
                                </View>
                                <Text style={styles.modalDescription}>{selected.description}</Text>
                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={() => {
                                        setModalVisible(false);
                                        router.push(`/journal/${selected.id}/edit`);
                                    }}
                                >
                                    <Text style={styles.editText}>Modifier</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalVisible(false);
                                        deleteEmotion(selected.id);
                                    }}
                                    style={styles.deleteButton}
                                >
                                    <Text style={styles.editText}>Supprimer</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    item: { padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
    date: { fontWeight: '700', marginBottom: 4 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    emotion: { fontSize: 16, color: '#333' },
    overlay: { flex: 1, backgroundColor: '#00000055', justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    modalDate: { fontWeight: '600', marginBottom: 6 },
    modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
    modalDescription: { color: '#444', fontSize: 15, marginBottom: 16 },
    editButton: {
        margin: '2%',
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteButton: {
        margin: '2%',
        backgroundColor: '#ed0000',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    editText: { color: '#fff', fontWeight: '600' },
    emptyBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#555',
        marginBottom: 8,
    },
    emptyText: {
        textAlign: 'center',
        color: '#777',
        fontSize: 14,
    },
});