import { Stack } from 'expo-router';

export default function JournalLayout() {
    return (
    <Stack screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen name="add" options={{
          headerTitle: "Ajout d'une émotion",
        }}></Stack.Screen>
    </Stack>
    );
}