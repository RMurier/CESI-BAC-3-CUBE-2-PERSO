import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Modal,
    Pressable,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MonCompte() {
    const { user, isLoaded } = useUser();
    const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

    const [nom, setNom] = useState('');
    const [editing, setEditing] = useState(false);
    const [tempNom, setTempNom] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const fetchInfos = async () => {
            if (!isLoaded || !user) return;
            try {
                console.log(user.id)
                const res = await fetch(`${API_BASE_URL}/api/utilisateurs/${user.id}`);
                const data = await res.json();
                if (res.ok) {
                    console.log(data)
                    setNom(data.nom || '');
                } else {
                    console.warn('❌ API error:', data);
                }
            } catch (err) {
                console.error('❌ Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInfos();
    }, [isLoaded]);

    const handleSaveNom = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const patchrequest = await fetch(`${API_BASE_URL}/api/utilisateurs/${user.id}`, { method: "PATCH", body: JSON.stringify({ nom: tempNom }) })
            if (patchrequest.ok) {
                setNom(tempNom);
                setEditing(false);
                Alert.alert('✅ Succès', 'Nom mis à jour !');
            } else {
                Alert.alert('❌ Erreur', "Impossible de modifier le nom.");
            }
        } catch (err) {
            console.error(err);
            Alert.alert('❌ Erreur', "Impossible de modifier le nom.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mon compte</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Nom :</Text>
                <Text style={styles.value}>{nom}</Text>
                <TouchableOpacity onPress={() => { setTempNom(nom); setEditing(true); }}>
                    <Feather name="edit-2" size={18} color="#007AFF" />
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={() => {router.replace("/reset")}} style={styles.resetPasswordButton}>
                    <Text style={styles.resetPasswordButtonText}>Changer mon mot de passe</Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent
                visible={editing}
                onRequestClose={() => setEditing(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Modifier le nom</Text>
                        <TextInput
                            value={tempNom}
                            onChangeText={setTempNom}
                            style={styles.input}
                            placeholder="Votre nom"
                        />
                        <View style={styles.modalActions}>
                            <Pressable onPress={() => setEditing(false)} style={styles.cancel}>
                                <Text style={styles.cancelText}>Annuler</Text>
                            </Pressable>
                            <Pressable onPress={handleSaveNom} style={styles.save}>
                                <Text style={styles.saveText}>
                                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    resetPasswordButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    resetPasswordButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    container: {
        padding: 24,
        flex: 1,
        backgroundColor: '#fff',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 32,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
        gap: 8,
    },
    label: {
        fontWeight: '600',
        color: '#333',
        fontSize: 16,
        width: 70,
    },
    value: {
        fontSize: 16,
        color: '#444',
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: '#00000066',
        justifyContent: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
    },
    input: {
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    cancel: {
        padding: 10,
    },
    cancelText: {
        color: '#888',
        fontSize: 16,
    },
    save: {
        padding: 10,
    },
    saveText: {
        color: '#007AFF',
        fontWeight: '600',
        fontSize: 16,
    },
});
