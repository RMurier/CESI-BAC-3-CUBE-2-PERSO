import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  const tabs = isSignedIn
    ? [
        { label: 'Accueil', icon: 'home', route: '/' },
        { label: "Tracker d'émotions", icon: 'heart', route: '/journal' },
      ]
    : [
        { label: 'Accueil', icon: 'home', route: '/' },
      ];

  return (
    <View style={styles.footer}>
      {tabs.map((tab) => {
        const active = pathname === tab.route;
        return (
          <TouchableOpacity
            key={tab.route}
            style={styles.tab}
            onPress={() => router.push(tab.route)}
          >
            <Feather
              name={tab.icon as any}
              size={24}
              color={active ? '#007AFF' : '#999'}
            />
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  tab: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  labelActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
