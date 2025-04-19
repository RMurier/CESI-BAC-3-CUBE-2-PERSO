// app/_layout.tsx
import { Slot, Stack } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

export default function Layout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISH_KEY}
    >
       <Stack
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
      }}
    />
    </ClerkProvider>
  );
}
