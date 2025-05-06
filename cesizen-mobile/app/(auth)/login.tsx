import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Text,
  Alert,
} from "react-native";
import { useSignIn, useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { getToken, signOut } = useAuth();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const decodeJwt = (token: string) => {
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (err) {
      throw new Error("Impossible de décoder le token.");
    }
  };

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      // Étape 1 : Authentifier avec Clerk
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // Étape 2 : Activer la session localement
      await setActive({ session: completeSignIn.createdSessionId });

      // Étape 3 : Récupérer le token et décoder l'ID Clerk
      const token = await getToken();
      if (!token) throw new Error("Token introuvable");

      const payload = decodeJwt(token);
      const clerkUserId = payload.sub;
      if (!clerkUserId) throw new Error("ID utilisateur introuvable");

      // Étape 4 : Vérifier si l'utilisateur est actif dans ta base
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/utilisateurs/check/${clerkUserId}`
      );

      if (!res.ok) throw new Error("Erreur lors de la vérification du compte");

      const { isActive } = await res.json();

      if (!isActive) {
        await signOut(); // Déconnexion immédiate
        Alert.alert("Accès refusé", "Votre compte a été désactivé.");
        return;
      }

      // ✅ Accès autorisé
      router.replace("/");

    } catch (err: any) {
      console.error(err);
      Alert.alert("Erreur", err?.errors?.[0]?.message || err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        placeholder="exemple@mail.fr"
        value={emailAddress}
        onChangeText={setEmailAddress}
        style={styles.inputField}
      />
      <TextInput
        placeholder="mot de passe"
        value={password}
        autoCapitalize="none"
        onChangeText={setPassword}
        secureTextEntry
        style={styles.inputField}
      />

      <Button onPress={onSignInPress} title="Login" color="#6c47ff" disabled={loading} />

      <Pressable style={styles.button} onPress={() => router.push("/reset")}>
        <Text>Mot de passe oublié ?</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push("/register")}>
        <Text>Créer un compte</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    margin: 8,
    alignItems: "center",
  },
});

export default Login;
