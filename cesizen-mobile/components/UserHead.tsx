import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';

export default function UserHead() {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);

  if (!isSignedIn || !user)
    return (
      <View style={styles.header}>
        <Text style={styles.logo}>CESIZen</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
          <Text style={styles.loginText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.logo}>CESIZen</Text>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {user.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          ) : (
            <Feather name="user" size={28} color="#333" />
          )}
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <View style={styles.menuContainer}>
            <View style={styles.menu}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setModalVisible(false);
                  router.push('/mon-compte');
                }}
              >
                <Text style={styles.menuText}>👤 Mon compte</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={async () => {
                  setModalVisible(false);
                  await signOut();
                }}
              >
                <Text style={styles.menuText}>🚪 Se déconnecter</Text>
              </TouchableOpacity>
            </View>

          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loginText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#fff',
    paddingBottom: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  menu: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: '100%',
  },

  menuItem: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },

  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    textAlign: 'left',
  },

  separator: {
    height: 1,
    backgroundColor: '#e6e6e6',
    marginVertical: 4,
  },
});
