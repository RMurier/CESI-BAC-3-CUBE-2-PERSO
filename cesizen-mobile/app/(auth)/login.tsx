import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Text,
  Alert,
  ActivityIndicator,
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

  const validateInputs = () => {
    if (!emailAddress.trim()) {
      Alert.alert("Erreur", "Veuillez saisir votre adresse email.");
      return false;
    }
    
    if (!password.trim()) {
      Alert.alert("Erreur", "Veuillez saisir votre mot de passe.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      Alert.alert("Erreur", "Veuillez saisir une adresse email valide.");
      return false;
    }

    return true;
  };

  const checkUserInDatabase = async (clerkUserId: string) => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/utilisateurs/check/${clerkUserId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Gérer les différents codes de statut
      if (res.status === 404) {
        throw new Error("ACCOUNT_NOT_FOUND");
      }
      
      if (res.status === 500) {
        throw new Error("SERVER_ERROR");
      }
      
      if (!res.ok) {
        throw new Error("NETWORK_ERROR");
      }

      const data = await res.json();
      return data;

    } catch (error: any) {
      if (error.message === "ACCOUNT_NOT_FOUND") {
        throw error;
      }
      
      // Erreur de réseau ou autre
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        throw new Error("NETWORK_ERROR");
      }
      
      throw new Error("SERVER_ERROR");
    }
  };

  const handleAuthenticationError = (error: any) => {
    const errorCode = error?.errors?.[0]?.code;
    const errorMessage = error?.errors?.[0]?.message;

    switch (errorCode) {
      case 'form_identifier_not_found':
        return "Aucun compte trouvé avec cette adresse email.";
      case 'form_password_incorrect':
        return "Mot de passe incorrect.";
      case 'form_identifier_exists':
        return "Cette adresse email est déjà utilisée.";
      case 'session_exists':
        return "Une session est déjà active.";
      default:
        return errorMessage || "Erreur d'authentification. Veuillez réessayer.";
    }
  };

  const handleDatabaseError = (error: Error) => {
    switch (error.message) {
      case "ACCOUNT_NOT_FOUND":
        return "Votre compte n'existe pas dans notre système. Contactez l'administrateur.";
      case "NETWORK_ERROR":
        return "Impossible de se connecter au serveur. Vérifiez votre connexion internet.";
      case "SERVER_ERROR":
        return "Erreur du serveur. Veuillez réessayer plus tard.";
      default:
        return "Une erreur inattendue s'est produite.";
    }
  };

  const safeSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log("Erreur lors de la déconnexion (ignorée):", error);
      // On ignore l'erreur de déconnexion
    }
  };

  const onSignInPress = async () => {
    if (!isLoaded) {
      Alert.alert("Erreur", "L'application n'est pas encore prête. Veuillez patienter.");
      return;
    }

    if (!validateInputs()) return;

    setLoading(true);

    try {
      // Étape 1 : Authentifier avec Clerk
      console.log("🔐 Tentative d'authentification avec Clerk...");
      const completeSignIn = await signIn.create({
        identifier: emailAddress.trim(),
        password: password.trim(),
      });

      if (completeSignIn.status !== "complete") {
        throw new Error("Authentification incomplète. Veuillez réessayer.");
      }

      // Étape 2 : Activer la session localement
      console.log("✅ Authentification réussie, activation de la session...");
      await setActive({ session: completeSignIn.createdSessionId });

      // Étape 3 : Récupérer le token et décoder l'ID Clerk
      console.log("🎫 Récupération du token...");
      const token = await getToken();
      if (!token) {
        throw new Error("Impossible de récupérer le token d'authentification.");
      }

      const payload = decodeJwt(token);
      const clerkUserId = payload.sub;
      if (!clerkUserId) {
        throw new Error("ID utilisateur introuvable dans le token.");
      }

      console.log("👤 ID utilisateur récupéré:", clerkUserId);

      // Étape 4 : Vérifier si l'utilisateur existe et est actif dans la base
      console.log("🔍 Vérification du compte dans la base de données...");
      const userData = await checkUserInDatabase(clerkUserId);

      if (!userData) {
        await safeSignOut();
        throw new Error("ACCOUNT_NOT_FOUND");
      }

      if (!userData.isActive) {
        await safeSignOut();
        Alert.alert(
          "Accès refusé", 
          "Votre compte a été désactivé. Contactez l'administrateur pour plus d'informations.",
          [{ text: "OK", style: "default" }]
        );
        return;
      }

      // ✅ Accès autorisé - Redirection directe
      console.log("🎉 Connexion réussie!");
      router.replace("/");
      
      // Alert optionnel après redirection
      setTimeout(() => {
        Alert.alert(
          "Connexion réussie", 
          `Bienvenue ${userData.name || emailAddress}!`
        );
      }, 100);

    } catch (err: any) {
      // console.error("❌ Erreur lors de la connexion:", err);
      
      let errorMessage: string;

      // Erreur d'authentification Clerk
      if (err?.errors && Array.isArray(err.errors)) {
        errorMessage = handleAuthenticationError(err);
      }
      // Erreur de base de données
      else if (err.message === "ACCOUNT_NOT_FOUND" || 
               err.message === "NETWORK_ERROR" || 
               err.message === "SERVER_ERROR") {
        await safeSignOut(); // Déconnexion sécurisée
        errorMessage = handleDatabaseError(err);
      }
      // Autres erreurs
      else {
        errorMessage = err.message || "Une erreur inattendue s'est produite.";
      }

      Alert.alert(
        "Erreur de connexion", 
        errorMessage,
        [{ text: "OK", style: "default" }]
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Connexion</Text>
        
        <TextInput
          autoCapitalize="none"
          placeholder="exemple@mail.fr"
          value={emailAddress}
          onChangeText={setEmailAddress}
          style={[styles.inputField, loading && styles.inputDisabled]}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          editable={!loading}
        />
        
        <TextInput
          placeholder="Mot de passe"
          value={password}
          autoCapitalize="none"
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.inputField, loading && styles.inputDisabled]}
          textContentType="password"
          autoComplete="password"
          editable={!loading}
        />

        <View style={styles.buttonContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#6c47ff" />
              <Text style={styles.loadingText}>Connexion en cours...</Text>
            </View>
          ) : (
            <Button 
              onPress={onSignInPress} 
              title="Se connecter" 
              color="#6c47ff"
            />
          )}
        </View>

        <View style={styles.linkContainer}>
          <Pressable 
            style={[styles.linkButton, loading && styles.linkDisabled]} 
            onPress={() => router.push("/reset")}
            disabled={loading}
          >
            <Text style={[styles.linkText, loading && styles.linkTextDisabled]}>
              Mot de passe oublié ?
            </Text>
          </Pressable>

          <Pressable 
            style={[styles.linkButton, loading && styles.linkDisabled]} 
            onPress={() => router.push("/register")}
            disabled={loading}
          >
            <Text style={[styles.linkText, loading && styles.linkTextDisabled]}>
              Créer un compte
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  inputField: {
    marginVertical: 8,
    height: 50,
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderRadius: 8,
    padding: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: "#f8f8f8",
    borderColor: "#ccc",
    color: "#999",
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  loadingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  loadingText: {
    marginLeft: 10,
    color: "#6c47ff",
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 20,
  },
  linkButton: {
    marginVertical: 8,
    alignItems: "center",
    paddingVertical: 10,
  },
  linkDisabled: {
    opacity: 0.5,
  },
  linkText: {
    color: "#6c47ff",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  linkTextDisabled: {
    color: "#ccc",
  },
});

export default Login;